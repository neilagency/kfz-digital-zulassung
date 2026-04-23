import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { buildCampaignHtml, personalizeHtml, sendCampaignEmail } from '@/lib/campaign-email';

export const dynamic = 'force-dynamic';

type RouteCtx = { params: Promise<{ id: string }> };

/** POST /api/admin/email-campaigns/[id]/test – send test email without changing status */
export async function POST(request: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;

  try {
    const body = await request.json();
    const testEmail = body.email?.trim();

    if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      return NextResponse.json(
        { error: 'Gültige E-Mail-Adresse erforderlich' },
        { status: 400 }
      );
    }

    const campaign = await prisma.emailCampaign.findUnique({ where: { id } });
    if (!campaign) {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    }

    if (!campaign.subject || !campaign.heading || !campaign.content) {
      return NextResponse.json(
        { error: 'Betreff, Überschrift und Inhalt sind erforderlich' },
        { status: 400 }
      );
    }

    // Build HTML with tracking (using campaign ID for realistic preview)
    const html = buildCampaignHtml({
      subject: campaign.subject,
      heading: campaign.heading,
      content: campaign.content,
      imageUrl: campaign.imageUrl || undefined,
      ctaText: campaign.ctaText || undefined,
      ctaUrl: campaign.ctaUrl || undefined,
      campaignId: id,
    });

    // Use a dummy unsubscribe token for test emails
    const testHtml = personalizeHtml(html, 'test-preview');

    const result = await sendCampaignEmail({
      to: testEmail,
      subject: `[TEST] ${campaign.subject}`,
      html: testHtml,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: `Senden fehlgeschlagen: ${result.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test-E-Mail an ${testEmail} gesendet`,
    });
  } catch (error) {
    console.error('Test campaign email error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
