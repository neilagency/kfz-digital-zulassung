import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const SITE_URL =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://onlineautoabmelden.com';

type RouteCtx = { params: Promise<{ id: string }> };

/** GET /api/track/click/[id]?url=... – track click and redirect */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const targetUrl = req.nextUrl.searchParams.get('url');

  // Validate URL to prevent open redirect
  let redirectTo = SITE_URL;
  if (targetUrl) {
    try {
      const parsed = new URL(targetUrl);
      // Only allow http/https protocols
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        redirectTo = targetUrl;
      }
    } catch {
      // Invalid URL, redirect to home
    }
  }

  // Fire and forget – increment click count
  prisma.emailCampaign.update({
    where: { id },
    data: { clickCount: { increment: 1 } },
  }).catch(() => {}); // silently fail

  return NextResponse.redirect(redirectTo, 302);
}
