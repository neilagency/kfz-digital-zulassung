import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// In-memory cache for list queries (10s TTL)
let listCache: Map<string, { data: any; ts: number }> = new Map();
const LIST_CACHE_TTL = 30_000;

// Total count cache (30s TTL)
let totalCache: Map<string, { total: number; ts: number }> = new Map();
const TOTAL_CACHE_TTL = 30_000;

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

function getFreshTotal(cacheKey: string) {
  const cached = totalCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < TOTAL_CACHE_TTL) {
    return cached.total;
  }
  return null;
}

function storeTotal(cacheKey: string, total: number) {
  totalCache.set(cacheKey, { total, ts: Date.now() });
  if (totalCache.size > 50) {
    const now = Date.now();
    for (const [key, value] of totalCache) {
      if (now - value.ts > TOTAL_CACHE_TTL) totalCache.delete(key);
    }
  }
}

// Helper: generate next invoice number like RE-2025-0001
async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `RE-${year}-`;

  const lastInvoice = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: 'desc' },
  });

  let nextNum = 1;
  if (lastInvoice) {
    const lastNum = parseInt(lastInvoice.invoiceNumber.replace(prefix, ''), 10);
    nextNum = lastNum + 1;
  }

  return `${prefix}${String(nextNum).padStart(4, '0')}`;
}

// GET /api/admin/invoices – list invoices
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') || undefined;

  const where: any = {};

  if (status && status !== 'all') {
    where.paymentStatus = status;
  }

  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search } },
      { billingName: { contains: search } },
      { billingEmail: { contains: search } },
    ];
  }

  try {
    // Check cache
    const cacheKey = `inv:${page}:${limit}:${status || ''}:${search || ''}`;
    const cached = listCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < LIST_CACHE_TTL) {
      return jsonResponse(cached.data, 5, true);
    }

    const totalCacheKey = `inv-total:${status || ''}:${search || ''}`;
    const cachedTotal = getFreshTotal(totalCacheKey);

    let invoices;
    let total;

    if (cachedTotal != null) {
      invoices = await prisma.invoice.findMany({
        where,
        select: {
          id: true,
          invoiceNumber: true,
          invoiceDate: true,
          billingName: true,
          billingEmail: true,
          total: true,
          subtotal: true,
          paymentStatus: true,
          paymentMethod: true,
          orderId: true,
          createdAt: true,
          order: { select: { orderNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });
      total = cachedTotal;
    } else {
      [invoices, total] = await prisma.$transaction([
        prisma.invoice.findMany({
          where,
          select: {
            id: true,
            invoiceNumber: true,
            invoiceDate: true,
            billingName: true,
            billingEmail: true,
            total: true,
            subtotal: true,
            paymentStatus: true,
            paymentMethod: true,
            orderId: true,
            createdAt: true,
            order: { select: { orderNumber: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.invoice.count({ where }),
      ]);
      storeTotal(totalCacheKey, total);
    }

    const result = {
      invoices,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };

    listCache.set(cacheKey, { data: result, ts: Date.now() });
    // Prune old cache entries
    if (listCache.size > 50) {
      const now = Date.now();
      for (const [k, v] of listCache) {
        if (now - v.ts > LIST_CACHE_TTL) listCache.delete(k);
      }
    }

    return jsonResponse(result);
  } catch (error) {
    console.error('Invoices API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/invoices – create invoice from order
export async function POST(request: NextRequest) {
  // Invalidate list cache on mutation
  listCache.clear();
  totalCache.clear();
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    // Check if invoice already exists for this order
    const existing = await prisma.invoice.findFirst({ where: { orderId } });
    if (existing) {
      return NextResponse.json({ error: 'Invoice already exists for this order', invoice: existing }, { status: 409 });
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, customer: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const invoiceNumber = await generateInvoiceNumber();

    // Build invoice items from order items
    const invoiceItems = order.items.map((item) => ({
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    }));

    // Add payment fee as line item if exists
    if (order.paymentFee > 0) {
      invoiceItems.push({
        name: 'Zahlungsgebühr',
        quantity: 1,
        price: order.paymentFee,
        total: order.paymentFee,
      });
    }

    const subtotal = order.subtotal || order.total;
    const taxRate = 19;
    // German tax: included in price (Brutto), so taxAmount = total - (total / 1.19)
    const taxAmount = parseFloat((order.total - order.total / 1.19).toFixed(2));

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        customerId: order.customerId,
        billingName: `${order.billingFirst} ${order.billingLast}`.trim(),
        billingEmail: order.billingEmail,
        billingAddress: order.billingStreet,
        billingCity: order.billingCity,
        billingPostcode: order.billingPostcode,
        items: JSON.stringify(invoiceItems),
        subtotal,
        taxRate,
        taxAmount,
        total: order.total,
        paymentMethod: order.paymentTitle || order.paymentMethod,
        paymentStatus: order.status === 'completed' ? 'paid' : 'pending',
        transactionId: order.transactionId,
        invoiceDate: order.datePaid || order.createdAt,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
