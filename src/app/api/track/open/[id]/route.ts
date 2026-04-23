import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type RouteCtx = { params: Promise<{ id: string }> };

// 1x1 transparent PNG pixel
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

/** GET /api/track/open/[id].png – track email open via invisible pixel */
export async function GET(_req: NextRequest, ctx: RouteCtx) {
  let { id } = await ctx.params;
  // Strip .png extension if present
  id = id.replace(/\.png$/, '');

  // Fire and forget – increment open count
  prisma.emailCampaign.update({
    where: { id },
    data: { openCount: { increment: 1 } },
  }).catch(() => {}); // silently fail

  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
