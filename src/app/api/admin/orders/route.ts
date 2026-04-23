import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Status counts cache (60s TTL) - avoids expensive groupBy on every request
let statusCountsCache: { data: Record<string, number>; ts: number } | null = null;
const STATUS_CACHE_TTL = 60_000;

// Orders list cache (10s TTL)
let ordersListCache: Map<string, { data: any; ts: number }> = new Map();
const ORDERS_CACHE_TTL = 30_000;

// Filtered totals cache (30s TTL) - avoids repeated COUNT(*) for the same filters
let orderTotalCache: Map<string, { total: number; ts: number }> = new Map();
const ORDER_TOTAL_CACHE_TTL = 30_000;

async function getCachedStatusCounts(): Promise<Record<string, number>> {
  if (statusCountsCache && Date.now() - statusCountsCache.ts < STATUS_CACHE_TTL) {
    return statusCountsCache.data;
  }
  const raw = await prisma.$queryRaw<{ status: string; cnt: bigint }[]>`
    SELECT "status", COUNT(*) as cnt FROM "Order" WHERE "deletedAt" IS NULL GROUP BY "status"
  `;
  const counts: Record<string, number> = {};
  let allCount = 0;
  for (const g of raw) {
    counts[g.status] = Number(g.cnt);
    allCount += Number(g.cnt);
  }
  counts['all'] = allCount;
  statusCountsCache = { data: counts, ts: Date.now() };
  return counts;
}

// Allowed sort columns to prevent injection
const SORT_COLUMNS: Record<string, string> = {
  createdAt: 'createdAt',
  total: 'total',
  orderNumber: 'orderNumber',
  status: 'status',
};

/** Create a JSON response with caching headers */
function jsonResponse(data: unknown, cacheSecs = 5) {
  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `private, max-age=${cacheSecs}, stale-while-revalidate=${cacheSecs * 6}`,
    },
  });
}

function getFreshOrderTotal(cacheKey: string) {
  const cached = orderTotalCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < ORDER_TOTAL_CACHE_TTL) {
    return cached.total;
  }
  return null;
}

function storeOrderTotal(cacheKey: string, total: number) {
  orderTotalCache.set(cacheKey, { total, ts: Date.now() });
  if (orderTotalCache.size > 50) {
    const now = Date.now();
    for (const [key, value] of orderTotalCache) {
      if (now - value.ts > ORDER_TOTAL_CACHE_TTL) orderTotalCache.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;
  const dateFrom = searchParams.get('dateFrom') || undefined;
  const dateTo = searchParams.get('dateTo') || undefined;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc';

  const where: any = {};
  // Exclude soft-deleted orders
  where.deletedAt = null;

  if (status && status !== 'all') {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { orderNumber: { equals: parseInt(search) || -1 } },
      { billingFirst: { contains: search } },
      { billingLast: { contains: search } },
      { billingEmail: { contains: search } },
    ];
  }
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const orderByField = SORT_COLUMNS[sortBy] || 'createdAt';

  try {
    // Check orders list cache (offset-based only)
    if (!cursor) {
      const cacheKey = `ord:${page}:${limit}:${status || ''}:${search || ''}:${dateFrom || ''}:${dateTo || ''}:${sortBy}:${sortDir}`;
      const cached = ordersListCache.get(cacheKey);
      if (cached && Date.now() - cached.ts < ORDERS_CACHE_TTL) {
        return new NextResponse(JSON.stringify(cached.data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'private, max-age=5, stale-while-revalidate=30',
            'X-Cache': 'HIT',
          },
        });
      }
    }

    // Count all non-deleted for status tabs, plus filtered total + filtered data
    const selectFields = {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      currency: true,
      paymentMethod: true,
      paymentTitle: true,
      billingEmail: true,
      billingFirst: true,
      billingLast: true,
      createdAt: true,
    };

    // Cursor-based pagination (faster for large datasets)
    if (cursor) {
      const [orders, counts] = await Promise.all([
        prisma.order.findMany({
          where,
          select: selectFields,
          orderBy: { [orderByField]: sortDir },
          take: limit + 1,
          cursor: { id: cursor },
          skip: 1,
        }),
        getCachedStatusCounts(),
      ]);

      const hasMore = orders.length > limit;
      if (hasMore) orders.pop();

      return jsonResponse({
        orders,
        nextCursor: hasMore ? orders[orders.length - 1]?.id : null,
        statusCounts: counts,
      });
    }

    // Offset-based pagination (default) — $transaction batches into 1 HTTP request to Turso
    const totalCacheKey = `ord-total:${status || ''}:${search || ''}:${dateFrom || ''}:${dateTo || ''}`;
    const cachedTotal = getFreshOrderTotal(totalCacheKey);

    let orders;
    let total;

    if (cachedTotal != null) {
      [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          select: selectFields,
          orderBy: { [orderByField]: sortDir },
          skip: (page - 1) * limit,
          take: limit,
        }),
        Promise.resolve(cachedTotal),
      ]);
    } else {
      [orders, total] = await prisma.$transaction([
        prisma.order.findMany({
          where,
          select: selectFields,
          orderBy: { [orderByField]: sortDir },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.order.count({ where }),
      ]);
      storeOrderTotal(totalCacheKey, total);
    }

    const counts = await getCachedStatusCounts(); // Usually cache HIT (60s TTL)

    const result = {
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      statusCounts: counts,
    };

    // Store in cache
    const cacheKey = `ord:${page}:${limit}:${status || ''}:${search || ''}:${dateFrom || ''}:${dateTo || ''}:${sortBy}:${sortDir}`;
    ordersListCache.set(cacheKey, { data: result, ts: Date.now() });
    if (ordersListCache.size > 50) {
      const now = Date.now();
      for (const [k, v] of ordersListCache) {
        if (now - v.ts > ORDERS_CACHE_TTL) ordersListCache.delete(k);
      }
    }

    return jsonResponse(result);
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ids } = body;

    if (!action || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Missing action or ids' }, { status: 400 });
    }

    if (ids.length > 100) {
      return NextResponse.json({ error: 'Max 100 items per bulk operation' }, { status: 400 });
    }

    if (action === 'delete') {
      const result = await prisma.order.updateMany({
        where: { id: { in: ids }, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      ordersListCache.clear();
      orderTotalCache.clear();
      statusCountsCache = null;
      return NextResponse.json({ success: true, affected: result.count });
    }

    if (action === 'status') {
      const { status } = body;
      const allowed = ['pending', 'processing', 'completed', 'on-hold', 'cancelled', 'refunded'];
      if (!allowed.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      const result = await prisma.order.updateMany({
        where: { id: { in: ids }, deletedAt: null },
        data: { status },
      });
      ordersListCache.clear();
      orderTotalCache.clear();
      statusCountsCache = null;
      return NextResponse.json({ success: true, affected: result.count });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Orders bulk error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
