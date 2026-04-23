import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type RouteCtx = { params: Promise<{ id: string }> };

/** GET /api/admin/email-campaigns/[id] – single campaign */
export async function GET(_req: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;

  try {
    const campaign = await prisma.emailCampaign.findUnique({ where: { id } });
    if (!campaign) {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Get campaign error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/** PUT /api/admin/email-campaigns/[id] – update campaign */
export async function PUT(request: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;

  try {
    const body = await request.json();

    // Only allow updates on draft campaigns
    const existing = await prisma.emailCampaign.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    }
    if (existing.status !== 'draft' && existing.status !== 'scheduled') {
      return NextResponse.json(
        { error: 'Nur Entwürfe und geplante Kampagnen können bearbeitet werden' },
        { status: 400 }
      );
    }

    const allowedFields = [
      'name', 'subject', 'heading', 'content', 'imageUrl', 'ctaText', 'ctaUrl',
      'targetMode', 'targetEmails', 'targetSegment', 'templateId', 'scheduledAt',
    ];
    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        if (field === 'scheduledAt') {
          data[field] = body[field] ? new Date(body[field]) : null;
        } else {
          data[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
        }
      }
    }

    // If scheduledAt is set and status is draft, change to scheduled
    if (data.scheduledAt && existing.status === 'draft') {
      data.status = 'scheduled';
    }
    // If scheduledAt is cleared, revert to draft
    if ('scheduledAt' in data && !data.scheduledAt && existing.status === 'scheduled') {
      data.status = 'draft';
    }

    const campaign = await prisma.emailCampaign.update({
      where: { id },
      data,
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Update campaign error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/** DELETE /api/admin/email-campaigns/[id] – delete campaign */
export async function DELETE(_req: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;

  try {
    await prisma.emailCampaign.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete campaign error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
