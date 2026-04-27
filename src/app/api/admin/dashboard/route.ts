import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Simple in-memory cache for dashboard stats (60s TTL)
let dashCache: { data: any; ts: number } | null = null;
const CACHE_TTL = 60_000;

export async function GET() {
  console.log('[dashboard GET] Request received');

  // Return cached if fresh
  if (dashCache && Date.now() - dashCache.ts < CACHE_TTL) {
    console.log('[dashboard GET] Cache HIT');
    return new NextResponse(JSON.stringify(dashCache.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
    });
  }

  console.log('[dashboard GET] Cache MISS, fetching data');
  try {
    // Three parallel queries — safe for Turso/libsql
    const [aggregateStats, recentOrders, monthlyRevenue] = await Promise.all([
      prisma.$queryRaw<Array<{
        totalOrders: bigint;
        completedOrders: bigint;
        cancelledOrders: bigint;
        pendingOrders: bigint;
        totalRevenue: number;
        totalCustomers: bigint;
        totalBlogPosts: bigint;
      }>>`
        SELECT 
          (SELECT COUNT(*) FROM "Order" WHERE "deletedAt" IS NULL) as totalOrders,
          (SELECT SUM(CASE WHEN "status" = 'completed' THEN 1 ELSE 0 END) FROM "Order" WHERE "deletedAt" IS NULL) as completedOrders,
          (SELECT SUM(CASE WHEN "status" = 'cancelled' THEN 1 ELSE 0 END) FROM "Order" WHERE "deletedAt" IS NULL) as cancelledOrders,
          (SELECT SUM(CASE WHEN "status" IN ('pending', 'processing', 'on-hold') THEN 1 ELSE 0 END) FROM "Order" WHERE "deletedAt" IS NULL) as pendingOrders,
          (SELECT COALESCE(SUM("total"), 0) FROM "Order" WHERE "status" = 'completed' AND "deletedAt" IS NULL) as totalRevenue,
          (SELECT COUNT(*) FROM "Customer") as totalCustomers,
          (SELECT COUNT(*) FROM "BlogPost") as totalBlogPosts
      `,
      prisma.order.findMany({
        where: { deletedAt: null },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          billingFirst: true,
          billingLast: true,
          billingEmail: true,
          createdAt: true,
        },
      }),
      prisma.$queryRaw`
        SELECT 
          strftime('%Y-%m', "createdAt") as month,
          SUM("total") as revenue,
          COUNT(*) as orders
        FROM "Order"
        WHERE "status" = 'completed'
          AND "deletedAt" IS NULL
          AND "createdAt" >= date('now', '-12 months')
        GROUP BY strftime('%Y-%m', "createdAt")
        ORDER BY month ASC
      `,
    ]);

    const s = aggregateStats[0];
    console.log('[dashboard GET] Aggregate stats:', s);

    const result = {
      stats: {
        totalOrders: Number(s?.totalOrders || 0),
        completedOrders: Number(s?.completedOrders || 0),
        cancelledOrders: Number(s?.cancelledOrders || 0),
        pendingOrders: Number(s?.pendingOrders || 0),
        totalCustomers: Number(s?.totalCustomers || 0),
        totalBlogPosts: Number(s?.totalBlogPosts || 0),
        totalRevenue: Number(s?.totalRevenue || 0),
      },
      recentOrders,
      monthlyRevenue: (monthlyRevenue as any[]).map((m: any) => ({
        month: m.month,
        revenue: Number(m.revenue),
        orders: Number(m.orders),
      })),
    };

    console.log('[dashboard GET] Result:', { stats: result.stats, recentOrdersCount: result.recentOrders.length, monthlyRevenueCount: result.monthlyRevenue.length });

    // Cache the result
    dashCache = { data: result, ts: Date.now() };

    return new NextResponse(
      JSON.stringify(result, (_key, value) =>
        typeof value === 'bigint' ? Number(value) : value
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS',
          'Cache-Control': 'private, max-age=30, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
