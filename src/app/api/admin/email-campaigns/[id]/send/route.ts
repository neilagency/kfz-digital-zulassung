import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { buildCampaignHtml, sendCampaignBatch } from '@/lib/campaign-email';
import { resolveRecipients } from '@/lib/campaign-recipients';

export const dynamic = 'force-dynamic';

type RouteCtx = { params: Promise<{ id: string }> };

/** POST /api/admin/email-campaigns/[id]/send – send campaign with targeting support */
export async function POST(_req: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;

  try {
    const campaign = await prisma.emailCampaign.findUnique({ where: { id } });
    if (!campaign) {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    }

    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      return NextResponse.json(
        { error: 'Kampagne wurde bereits gesendet' },
        { status: 400 }
      );
    }

    if (!campaign.subject || !campaign.heading || !campaign.content) {
      return NextResponse.json(
        { error: 'Betreff, Überschrift und Inhalt sind erforderlich' },
        { status: 400 }
      );
    }

    // Resolve recipients based on targeting mode
    const recipients = await resolveRecipients({
      targetMode: campaign.targetMode,
      targetEmails: campaign.targetEmails,
      targetSegment: campaign.targetSegment,
    });

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'Keine Empfänger gefunden' },
        { status: 400 }
      );
    }

    // Mark as sending with total recipients
    await prisma.emailCampaign.update({
      where: { id },
      data: {
        status: 'sending',
        totalRecipients: recipients.length,
        sentCount: 0,
        failedCount: 0,
        errorLog: '[]',
      },
    });

    // Build the HTML once (with tracking placeholders)
    const html = buildCampaignHtml({
      subject: campaign.subject,
      heading: campaign.heading,
      content: campaign.content,
      imageUrl: campaign.imageUrl || undefined,
      ctaText: campaign.ctaText || undefined,
      ctaUrl: campaign.ctaUrl || undefined,
      campaignId: id,
    });

    // Fire and forget – send in background
    sendCampaignBatch({
      campaignId: id,
      recipients,
      subject: campaign.subject,
      html,
      onProgress: async (sent, failed, errors) => {
        await prisma.emailCampaign.update({
          where: { id },
          data: {
            sentCount: sent,
            failedCount: failed,
            errorLog: JSON.stringify(errors.slice(-100)),
          },
        });
      },
    })
      .then(async (result) => {
        await prisma.emailCampaign.update({
          where: { id },
          data: {
            status: result.failed > 0 && result.sent === 0 ? 'failed' : 'sent',
            sentCount: result.sent,
            failedCount: result.failed,
            errorLog: JSON.stringify(result.errors.slice(-100)),
            sentAt: new Date(),
          },
        });
        console.log(
          `[campaign] ${id} completed: ${result.sent} sent, ${result.failed} failed`
        );
      })
      .catch(async (err) => {
        console.error(`[campaign] ${id} critical error:`, err);
        await prisma.emailCampaign.update({
          where: { id },
          data: { status: 'failed', errorLog: JSON.stringify([String(err)]) },
        });
      });

    return NextResponse.json({
      success: true,
      totalRecipients: recipients.length,
      message: `Kampagne wird an ${recipients.length} Empfänger gesendet...`,
    });
  } catch (error) {
    console.error('Send campaign error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
