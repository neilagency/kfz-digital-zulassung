/**
 * Payment Debug Endpoint (Admin Only)
 * =====================================
 * GET /api/admin/payments/debug?orderId=xxx       — Check by DB order ID
 * GET /api/admin/payments/debug?orderNumber=2075  — Check by order number
 * GET /api/admin/payments/debug?paymentId=tr_xxx  — Check by Mollie payment ID
 * GET /api/admin/payments/debug?methods=1         — List available Mollie methods
 * GET /api/admin/payments/debug?health=1          — Check Mollie API connectivity
 * GET /api/admin/payments/debug?recent=10         — Last N failed payments
 *
 * Protected by admin auth middleware.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getMolliePaymentStatus, listAvailableMollieMethods } from '@/lib/payments';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId');
  const orderNumber = request.nextUrl.searchParams.get('orderNumber');
  const paymentIdParam = request.nextUrl.searchParams.get('paymentId');
  const showMethods = request.nextUrl.searchParams.get('methods');
  const healthCheck = request.nextUrl.searchParams.get('health');
  const recent = request.nextUrl.searchParams.get('recent');

  // Health check: verify Mollie API key and connectivity
  if (healthCheck) {
    try {
      const methods = await listAvailableMollieMethods();
      const mollieKeyPrefix = (process.env.MOLLIE_API_KEY || '').substring(0, 5);
      return NextResponse.json({
        status: 'ok',
        keyPrefix: mollieKeyPrefix + '...',
        isTestMode: (process.env.MOLLIE_API_KEY || '').startsWith('test_'),
        availableMethods: methods.map((m) => m.id),
        methodCount: methods.length,
        webhookUrl: `${process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || ''}/api/payment/webhook`,
        siteUrl: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET',
      });
    } catch (err: any) {
      return NextResponse.json({
        status: 'error',
        error: err?.message || 'Mollie API connection failed',
        keyPrefix: (process.env.MOLLIE_API_KEY || '').substring(0, 5) + '...',
      }, { status: 500 });
    }
  }

  // List available Mollie payment methods
  if (showMethods) {
    const methods = await listAvailableMollieMethods();
    return NextResponse.json({ methods });
  }

  // Check specific order payment status (by orderId OR orderNumber)
  const resolvedOrderId = orderId || (orderNumber ? await (async () => {
    const order = await prisma.order.findFirst({
      where: { orderNumber: parseInt(orderNumber, 10) },
      select: { id: true },
    });
    return order?.id || null;
  })() : null);

  // Lookup by Mollie payment ID
  if (paymentIdParam) {
    try {
      const mollieStatus = await getMolliePaymentStatus(paymentIdParam);
      const localPayment = await prisma.payment.findFirst({
        where: { transactionId: paymentIdParam },
        include: { order: { select: { id: true, orderNumber: true, status: true, total: true, paymentMethod: true, createdAt: true } } },
      });
      return NextResponse.json({
        molliePayment: mollieStatus,
        localPayment: localPayment ? {
          id: localPayment.id,
          status: localPayment.status,
          amount: localPayment.amount,
          method: localPayment.method,
          gatewayId: localPayment.gatewayId,
          providerData: localPayment.providerData ? JSON.parse(localPayment.providerData) : null,
          order: localPayment.order,
        } : null,
      });
    } catch (err: any) {
      return NextResponse.json({ error: err?.message || 'Failed to fetch payment' }, { status: 500 });
    }
  }

  // Recent failed payments
  if (recent) {
    const limit = Math.min(parseInt(recent, 10) || 10, 50);
    const failedPayments = await prisma.payment.findMany({
      where: { status: { in: ['failed', 'cancelled', 'expired'] } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        order: { select: { id: true, orderNumber: true, status: true, total: true, paymentMethod: true, billingEmail: true, createdAt: true } },
      },
    });
    return NextResponse.json({
      count: failedPayments.length,
      payments: failedPayments.map((p) => ({
        id: p.id,
        transactionId: p.transactionId,
        status: p.status,
        amount: p.amount,
        method: p.method,
        gatewayId: p.gatewayId,
        providerData: p.providerData ? JSON.parse(p.providerData) : null,
        createdAt: p.createdAt,
        order: p.order,
      })),
    });
  }

  if (resolvedOrderId) {
    const order = await prisma.order.findUnique({
      where: { id: resolvedOrderId },
      include: {
        payments: true,
        invoices: { select: { id: true, invoiceNumber: true, paymentStatus: true, total: true, transactionId: true } },
      },
    }) as any;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const paymentDetails = [];
    for (const payment of order.payments) {
      let mollieData = null;
      if (payment.transactionId) {
        try {
          mollieData = await getMolliePaymentStatus(payment.transactionId);
        } catch (err: any) {
          mollieData = { error: err?.message || 'Failed to fetch from Mollie' };
        }
      }
      paymentDetails.push({
        localPayment: {
          id: payment.id,
          status: payment.status,
          transactionId: payment.transactionId,
          amount: payment.amount,
          method: payment.method,
          gatewayId: payment.gatewayId,
          providerData: payment.providerData ? JSON.parse(payment.providerData) : null,
          createdAt: payment.createdAt,
        },
        mollieData,
      });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        paymentMethod: order.paymentMethod,
        transactionId: order.transactionId,
        datePaid: order.datePaid,
        createdAt: order.createdAt,
        billingEmail: order.billingEmail,
      },
      payments: paymentDetails,
      invoices: order.invoices,
      notes: await prisma.orderNote.findMany({
        where: { orderId: resolvedOrderId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { note: true, author: true, createdAt: true },
      }),
    });
  }

  return NextResponse.json({
    error: 'Provide ?orderId=, ?orderNumber=, ?paymentId=, ?recent=N, ?methods=1, or ?health=1',
    examples: {
      byOrderNumber: '/api/admin/payments/debug?orderNumber=2075',
      byOrderId: '/api/admin/payments/debug?orderId=clxxx...',
      byPaymentId: '/api/admin/payments/debug?paymentId=tr_xxx',
      recentFailed: '/api/admin/payments/debug?recent=10',
      healthCheck: '/api/admin/payments/debug?health=1',
      methods: '/api/admin/payments/debug?methods=1',
    },
  }, { status: 400 });
}
