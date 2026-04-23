/**
 * Mollie Payment Webhook
 * ======================
 * Called by Mollie when payment status changes.
 * Updates local order status + payment record.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getMolliePaymentStatus, getMollieOrderStatus } from '@/lib/payments';
import { triggerInvoiceEmail } from '@/lib/trigger-invoice';
import { paymentLog } from '@/lib/payment-logger';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const mollieId = body.get('id') as string;

    if (!mollieId) {
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 });
    }

    paymentLog.webhookReceived({ paymentId: mollieId });

    // Klarna uses Orders API (ord_xxxxx), others use Payments API (tr_xxxxx)
    const isOrderId = mollieId.startsWith('ord_');

    const molliePayment = isOrderId
      ? await getMollieOrderStatus(mollieId)
      : await getMolliePaymentStatus(mollieId);
    const orderId = molliePayment.metadata?.orderId;

    paymentLog.webhookStatus({
      paymentId: mollieId,
      orderId: orderId || 'unknown',
      orderNumber: molliePayment.metadata?.orderNumber,
      status: molliePayment.status,
      method: molliePayment.method,
      amount: molliePayment.amount,
      failureReason: molliePayment.failureReason,
      details: molliePayment.details,
    });

    if (!orderId) {
      console.error('[webhook] No orderId in Mollie payment metadata');
      return NextResponse.json({ error: 'No order ID in metadata' }, { status: 400 });
    }

    // Map Mollie status to our order status
    // Note: Klarna Orders API uses 'authorized' when customer approved
    let orderStatus: string;
    let paymentStatus: string;
    switch (molliePayment.status) {
      case 'paid':
      case 'authorized': // Klarna: customer authorized, payment guaranteed
      case 'completed':  // Klarna: order completed
        orderStatus = 'processing';
        paymentStatus = 'paid';
        break;
      case 'failed':
        orderStatus = 'cancelled';
        paymentStatus = 'failed';
        break;
      case 'canceled':
        orderStatus = 'cancelled';
        paymentStatus = 'cancelled';
        break;
      case 'expired':
        orderStatus = 'cancelled';
        paymentStatus = 'expired';
        break;
      case 'open':
      case 'pending':
        orderStatus = 'pending';
        paymentStatus = 'pending';
        break;
      default:
        orderStatus = 'on-hold';
        paymentStatus = molliePayment.status;
    }

    // Check if this payment has refunds (Mollie sends webhook on refund too)
    const hasRefunds = (molliePayment as any).amountRefunded?.value
      && parseFloat((molliePayment as any).amountRefunded.value) > 0;
    if (hasRefunds && molliePayment.status === 'paid') {
      const refundedAmount = parseFloat((molliePayment as any).amountRefunded.value);
      const totalAmount = parseFloat((molliePayment as any).amount?.value || '0');
      if (refundedAmount >= totalAmount) {
        orderStatus = 'refunded';
        paymentStatus = 'refunded';
      } else {
        // Partial refund — keep order processing, mark payment
        paymentStatus = 'partially_refunded';
      }
    }

    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: orderStatus,
        transactionId: mollieId,
        ...(paymentStatus === 'paid' ? { datePaid: new Date() } : {}),
      },
    });

    // Update payment record
    const paymentRecord = await prisma.payment.findFirst({
      where: { orderId, transactionId: mollieId },
    });
    if (paymentRecord) {
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: paymentStatus,
          ...(paymentStatus === 'paid' ? { paidAt: new Date() } : {}),
          providerData: JSON.stringify(molliePayment),
        },
      });
    } else {
      // Find payment by orderId (transactionId may not be set yet)
      const pending = await prisma.payment.findFirst({
        where: { orderId, status: 'pending' },
      });
      if (pending) {
        await prisma.payment.update({
          where: { id: pending.id },
          data: {
            transactionId: mollieId,
            status: paymentStatus,
            ...(paymentStatus === 'paid' ? { paidAt: new Date() } : {}),
            providerData: JSON.stringify(molliePayment),
          },
        });
      }
    }

    // Update invoice payment status
    const invoice = await prisma.invoice.findFirst({ where: { orderId } });
    if (invoice) {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          paymentStatus,
          transactionId: mollieId,
        },
      });
    }

    // Add order note
    await prisma.orderNote.create({
      data: {
        orderId,
        note: `Mollie Zahlung ${paymentStatus}: ${mollieId} (${molliePayment.method || 'unknown'})`,
        author: 'System',
      },
    });

    console.log(`[webhook] Order ${orderId} updated to ${orderStatus} (payment: ${paymentStatus})`);

    paymentLog.webhookUpdated({
      orderId,
      paymentId: mollieId,
      orderStatus,
      paymentStatus,
    });

    // Trigger invoice email for successful payments
    if (paymentStatus === 'paid') {
      const emailResult = await triggerInvoiceEmail(orderId);
      paymentLog.emailTriggered({ orderId, success: emailResult.success, error: emailResult.error });
      if (!emailResult.success) {
        console.error(`[webhook] Email failed for order ${orderId}: ${emailResult.error}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Always return 200 — Mollie requires webhooks to respond with 2xx.
    // Returning 4xx/5xx causes Mollie to consider the URL "unreachable"
    // during payment creation validation, blocking the checkout flow.
    console.error('Mollie webhook error:', error);
    return NextResponse.json({ success: true });
  }
}
