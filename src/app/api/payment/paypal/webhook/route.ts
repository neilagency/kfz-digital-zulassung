/**
 * PayPal Webhook (IPN)
 * =====================
 * Receives asynchronous notifications from PayPal about payment status changes.
 * This is a safety net — the capture callback handles the primary flow.
 *
 * To set up: PayPal Dashboard → Webhooks → Add Webhook URL:
 *   https://onlineautoabmelden.com/api/payment/paypal/webhook
 * Events to subscribe: PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED, PAYMENT.CAPTURE.REFUNDED
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { triggerInvoiceEmail } from '@/lib/trigger-invoice';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const eventType = body.event_type as string;
    const resource = body.resource;

    console.log(`[paypal-webhook] Event: ${eventType}, Resource ID: ${resource?.id}`);

    // Find the order by PayPal capture ID or custom_id
    const captureId = resource?.id;
    const customId = resource?.custom_id; // Our orderId set during creation

    if (!captureId && !customId) {
      console.warn('[paypal-webhook] No captureId or customId in event');
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Try to find payment by transactionId (captureId) or by orderId (customId)
    let payment;
    if (captureId) {
      payment = await prisma.payment.findFirst({
        where: { transactionId: captureId },
        include: { order: true },
      });
    }
    if (!payment && customId) {
      payment = await prisma.payment.findFirst({
        where: { orderId: customId },
        include: { order: true },
      });
    }

    if (!payment) {
      console.warn(`[paypal-webhook] Payment not found for capture=${captureId}, custom=${customId}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const order = payment.order;
    if (!order) {
      console.warn(`[paypal-webhook] Order not found for payment ${payment.id}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        // Only update if not already processed
        if (order.status !== 'processing' && order.status !== 'completed') {
          await Promise.all([
            prisma.order.update({
              where: { id: order.id },
              data: { status: 'processing', datePaid: new Date(), transactionId: captureId },
            }),
            prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'paid', paidAt: new Date(), transactionId: captureId },
            }),
            prisma.invoice.updateMany({
              where: { orderId: order.id },
              data: { paymentStatus: 'paid', transactionId: captureId },
            }),
            prisma.orderNote.create({
              data: {
                orderId: order.id,
                note: `PayPal Webhook: Zahlung abgeschlossen. Capture ID: ${captureId}`,
                author: 'system',
              },
            }),
          ]);
          console.log(`[paypal-webhook] Order #${order.orderNumber} marked as paid`);

          // Trigger invoice email — await to ensure it runs
          const emailResult = await triggerInvoiceEmail(order.id);
          if (!emailResult.success) {
            console.error(`[paypal-webhook] Email failed for order ${order.id}: ${emailResult.error}`);
          }
        }
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.REFUNDED': {
        const newStatus = eventType === 'PAYMENT.CAPTURE.DENIED' ? 'cancelled' : 'refunded';
        await Promise.all([
          prisma.order.update({
            where: { id: order.id },
            data: { status: newStatus },
          }),
          prisma.payment.update({
            where: { id: payment.id },
            data: { status: newStatus === 'refunded' ? 'refunded' : 'failed' },
          }),
          prisma.orderNote.create({
            data: {
              orderId: order.id,
              note: `PayPal Webhook: ${eventType}. Capture ID: ${captureId}`,
              author: 'system',
            },
          }),
        ]);
        console.log(`[paypal-webhook] Order #${order.orderNumber} → ${newStatus}`);
        break;
      }

      default:
        console.log(`[paypal-webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[paypal-webhook] Error:', error);
    // Always return 200 to prevent PayPal from retrying
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
