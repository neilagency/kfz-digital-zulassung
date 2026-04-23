import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * WordPress / WooCommerce Webhook Endpoint
 * =========================================
 * Receives order update webhooks from WooCommerce.
 * Updates local order status, payment status, and invoice status.
 * 
 * WooCommerce webhook setup:
 *   Topic: Order updated
 *   Delivery URL: https://kfz-digital-zulassung.vercel.app/api/webhook/wc-order
 *   Secret: (set WC_WEBHOOK_SECRET env var)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // WooCommerce sends a ping event on webhook creation
    if (!body.id) {
      return NextResponse.json({ message: 'Webhook received (ping)' });
    }

    const wpOrderId = body.id;
    const newStatus = body.status;
    const transactionId = body.transaction_id || '';
    const datePaid = body.date_paid ? new Date(body.date_paid) : undefined;
    const dateCompleted = body.date_completed ? new Date(body.date_completed) : undefined;

    console.log(`🔔 WC Webhook: Order #${wpOrderId} → ${newStatus}`);

    // Find the local order by WP order ID
    const localOrder = await prisma.order.findFirst({
      where: { wpOrderId },
      include: { invoices: true, payments: true },
    });

    if (!localOrder) {
      console.log(`  ⚠️ WP Order #${wpOrderId} not found in local DB`);
      return NextResponse.json({ message: 'Order not found locally' }, { status: 200 });
    }

    // Update order status
    await prisma.order.update({
      where: { id: localOrder.id },
      data: {
        status: newStatus,
        transactionId: transactionId || localOrder.transactionId,
        datePaid: datePaid || localOrder.datePaid,
        dateCompleted: dateCompleted || localOrder.dateCompleted,
      },
    });

    // Update payment status
    const paymentStatus = newStatus === 'completed' ? 'paid'
      : newStatus === 'refunded' ? 'refunded'
      : newStatus === 'cancelled' ? 'cancelled'
      : 'pending';

    if (localOrder.payments.length > 0) {
      for (const payment of localOrder.payments) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: paymentStatus,
            transactionId: transactionId || payment.transactionId,
            paidAt: paymentStatus === 'paid' ? (datePaid || new Date()) : payment.paidAt,
          },
        });
      }
    }

    // Update invoice payment status
    if (localOrder.invoices.length > 0) {
      for (const invoice of localOrder.invoices) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            paymentStatus,
            transactionId: transactionId || invoice.transactionId,
          },
        });
      }
    }

    console.log(`  ✅ Local order #${localOrder.orderNumber} updated to ${newStatus}`);

    return NextResponse.json({ success: true, orderNumber: localOrder.orderNumber });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Also support GET for health check
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'wc-order-webhook' });
}
