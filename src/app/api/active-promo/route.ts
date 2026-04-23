import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
} as const;

/** GET /api/active-promo – get active coupon with banner enabled (no cache) */
export async function GET() {
  try {
    const now = new Date();

    const promo = await prisma.coupon.findFirst({
      where: {
        isActive: true,
        showBanner: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
      },
      select: {
        code: true,
        discountType: true,
        discountValue: true,
        bannerText: true,
        productSlugs: true,
        endDate: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter out expired
    if (promo && promo.endDate && now > promo.endDate) {
      return NextResponse.json({ promo: null }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ promo: promo || null }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Active promo error:', error);
    return NextResponse.json({ promo: null }, { headers: NO_CACHE_HEADERS });
  }
}
