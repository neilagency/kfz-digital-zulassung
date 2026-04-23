import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// In-memory cache for customer list (10s TTL)
let customerListCache: Map<string, { data: any; ts: number }> = new Map();
const CUSTOMER_CACHE_TTL = 30_000;

// Total count cache (30s TTL)
let customerTotalCache: Map<string, { total: number; ts: number }> = new Map();
const CUSTOMER_TOTAL_TTL = 30_000;

function jsonResponse(data: unknown, cacheSecs = 5, cacheHit = false) {
  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `private, max-age=${cacheSecs}, stale-while-revalidate=${cacheSecs * 6}`,
      ...(cacheHit ? { 'X-Cache': 'HIT' } : {}),
    },
  });
}

function getFreshCustomerTotal(cacheKey: string) {
  const cached = customerTotalCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CUSTOMER_TOTAL_TTL) {
    return cached.total;
  }
  return null;
}

function storeCustomerTotal(cacheKey: string, total: number) {
  customerTotalCache.set(cacheKey, { total, ts: Date.now() });
  if (customerTotalCache.size > 30) {
    const now = Date.now();
    for (const [key, value] of customerTotalCache) {
      if (now - value.ts > CUSTOMER_TOTAL_TTL) customerTotalCache.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const search = searchParams.get('search') || undefined;

  const where: any = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const selectFields = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    city: true,
    totalOrders: true,
    totalSpent: true,
    password: true,
    lastLoginAt: true,
    createdAt: true,
  };

  try {
    // Check cache for offset-based requests
    if (!cursor) {
      const cacheKey = `cust:${page}:${limit}:${search || ''}`;
      const cached = customerListCache.get(cacheKey);
      if (cached && Date.now() - cached.ts < CUSTOMER_CACHE_TTL) {
        return jsonResponse(cached.data, 5, true);
      }
    }

    // Cursor-based pagination
    if (cursor) {
      const rawCustomers = await prisma.customer.findMany({
        where,
        select: selectFields,
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        cursor: { id: cursor },
        skip: 1,
      });
      const hasMore = rawCustomers.length > limit;
      if (hasMore) rawCustomers.pop();
      const customers = rawCustomers.map(({ password, ...rest }) => ({
        ...rest,
        hasAccount: !!password,
      }));
      return jsonResponse({
        customers,
        nextCursor: hasMore ? customers[customers.length - 1]?.id : null,
      });
    }

    // Offset-based pagination (default) — $transaction batches into 1 HTTP request to Turso
    const totalCacheKey = `cust-total:${search || ''}`;
    const cachedTotal = getFreshCustomerTotal(totalCacheKey);

    let rawCustomers;
    let total;

    if (cachedTotal != null) {
      rawCustomers = await prisma.customer.findMany({
        where,
        select: selectFields,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });
      total = cachedTotal;
    } else {
      [rawCustomers, total] = await prisma.$transaction([
        prisma.customer.findMany({
          where,
          select: selectFields,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.customer.count({ where }),
      ]);
      storeCustomerTotal(totalCacheKey, total);
    }

    // Transform: never expose password hash, add hasAccount boolean
    const customers = rawCustomers.map(({ password, ...rest }) => ({
      ...rest,
      hasAccount: !!password,
    }));

    const result = {
      customers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };

    // Store in cache
    const cacheKey = `cust:${page}:${limit}:${search || ''}`;
    customerListCache.set(cacheKey, { data: result, ts: Date.now() });
    if (customerListCache.size > 30) {
      const now = Date.now();
      for (const [k, v] of customerListCache) {
        if (now - v.ts > CUSTOMER_CACHE_TTL) customerListCache.delete(k);
      }
    }

    return jsonResponse(result);
  } catch (error) {
    console.error('Customers API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
