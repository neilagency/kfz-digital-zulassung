import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { buildCampaignHtml, sendCampaignBatch } from '@/lib/campaign-email';
import { resolveRecipients } from '@/lib/campaign-recipients';

export const dynamic = 'force-dynamic';

/** GET /api/cron/send-scheduled – check and send scheduled campaigns */
export async function GET(req: NextRequest) {
  // Simple auth check
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || process.env.ADMIN_SECRET || '';
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find campaigns that are scheduled and due
    const now = new Date();
    const dueCampaigns = await prisma.emailCampaign.findMany({
      where: {
        status: 'scheduled',
        scheduledAt: { lte: now },
      },
    });

    if (dueCampaigns.length === 0) {
      return NextResponse.json({ message: 'No scheduled campaigns due', count: 0 });
    }

    const results: { id: string; name: string; recipientCount: number }[] = [];

    for (const campaign of dueCampaigns) {
      if (!campaign.subject || !campaign.heading || !campaign.content) {
        await prisma.emailCampaign.update({
          where: { id: campaign.id },
          data: { status: 'failed', errorLog: JSON.stringify(['Missing subject/heading/content']) },
        });
        continue;
      }

      // Resolve recipients based on targetMode
      const recipients = await resolveRecipients({
        targetMode: campaign.targetMode,
        targetEmails: campaign.targetEmails,
        targetSegment: campaign.targetSegment,
      });

      if (recipients.length === 0) {
        await prisma.emailCampaign.update({
          where: { id: campaign.id },
          data: { status: 'failed', errorLog: JSON.stringify(['No recipients found']) },
        });
        continue;
      }

      // Mark as sending
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: {
          status: 'sending',
          totalRecipients: recipients.length,
          sentCount: 0,
          failedCount: 0,
          errorLog: '[]',
        },
      });

      // Build HTML
      const html = buildCampaignHtml({
        subject: campaign.subject,
        heading: campaign.heading,
        content: campaign.content,
        imageUrl: campaign.imageUrl || undefined,
        ctaText: campaign.ctaText || undefined,
        ctaUrl: campaign.ctaUrl || undefined,
        campaignId: campaign.id,
      });

      // Fire and forget
      sendCampaignBatch({
        campaignId: campaign.id,
        recipients,
        subject: campaign.subject,
        html,
        onProgress: async (sent, failed, errors) => {
          await prisma.emailCampaign.update({
            where: { id: campaign.id },
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
            where: { id: campaign.id },
            data: {
              status: result.failed > 0 && result.sent === 0 ? 'failed' : 'sent',
              sentCount: result.sent,
              failedCount: result.failed,
              errorLog: JSON.stringify(result.errors.slice(-100)),
              sentAt: new Date(),
            },
          });
        })
        .catch(async (err) => {
          await prisma.emailCampaign.update({
            where: { id: campaign.id },
            data: { status: 'failed', errorLog: JSON.stringify([String(err)]) },
          });
        });

      results.push({ id: campaign.id, name: campaign.name, recipientCount: recipients.length });
    }

    return NextResponse.json({
      message: `${results.length} scheduled campaign(s) started`,
      campaigns: results,
    });
  } catch (error) {
    console.error('Cron send-scheduled error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
