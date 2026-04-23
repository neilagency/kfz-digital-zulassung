/**
 * PayPal Capture Callback
 * ========================
 * User is redirected here after approving payment on PayPal.
 * We capture the payment and redirect to success/failure page.
 *
 * Flow: User approves on PayPal → PayPal redirects here → we capture → redirect to success
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { capturePayPalOrder } from '@/lib/paypal';
import { triggerInvoiceEmail } from '@/lib/trigger-invoice';

export const runtime = 'nodejs';

const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://onlineautoabmelden.com';

function siteRedirect(path: string) {
  return NextResponse.redirect(`${SITE_URL}${path}`, { status: 302 });
}

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId');
  const paypalToken = request.nextUrl.searchParams.get('token'); // PayPal adds this

  if (!orderId) {
    return siteRedirect('/rechnung?error=missing-order');
  }

  try {
    // Get the order + payment record
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) {
      return siteRedirect('/rechnung?error=order-not-found');
    }

    const payment = order.payments?.[0];
    if (!payment?.transactionId) {
      console.error('[paypal-capture] No transactionId for order', orderId);
      return siteRedirect(`/zahlung-fehlgeschlagen?order=${order.orderNumber}&error=payment-error`);
    }

    // Already paid? Skip capture
    if (order.status === 'processing' || order.status === 'completed') {
      return siteRedirect(`/bestellung-erfolgreich?order=${order.orderNumber}`);
    }

    // Capture the PayPal order
    const captureResult = await capturePayPalOrder(payment.transactionId);

    console.log(
      `[paypal-capture] Order #${order.orderNumber}: status=${captureResult.status}, captureId=${captureResult.captureId}`,
    );

    if (captureResult.status === 'COMPLETED') {
      // Update order, payment, and invoice — all in parallel
      const invoice = await prisma.invoice.findFirst({ where: { orderId } });

      await Promise.all([
        prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'processing',
            datePaid: new Date(),
            transactionId: captureResult.captureId,
          },
        }),
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'paid',
            paidAt: new Date(),
            transactionId: captureResult.captureId,
            providerData: JSON.stringify({
              paypalOrderId: captureResult.paypalOrderId,
              captureId: captureResult.captureId,
              payerEmail: captureResult.payerEmail,
              provider: 'paypal',
            }),
          },
        }),
        ...(invoice
          ? [
              prisma.invoice.update({
                where: { id: invoice.id },
                data: {
                  paymentStatus: 'paid',
                  transactionId: captureResult.captureId,
                },
              }),
            ]
          : []),
        // Add order note
        prisma.orderNote.create({
          data: {
            orderId,
            note: `PayPal-Zahlung erfolgreich. Capture ID: ${captureResult.captureId}. Payer: ${captureResult.payerEmail}`,
            author: 'system',
          },
        }),
      ]);

      // Trigger invoice email — await to ensure it runs
      const emailResult = await triggerInvoiceEmail(orderId);
      if (!emailResult.success) {
        console.error(`[paypal-capture] Email failed for order ${orderId}: ${emailResult.error}`);
      }

      return siteRedirect(`/bestellung-erfolgreich?order=${order.orderNumber}`);
    }

    // Payment not completed
    console.error(`[paypal-capture] Unexpected status: ${captureResult.status}`);

    await prisma.orderNote.create({
      data: {
        orderId,
        note: `PayPal-Zahlung fehlgeschlagen. Status: ${captureResult.status}`,
        author: 'system',
      },
    });

    return siteRedirect(`/zahlung-fehlgeschlagen?order=${order.orderNumber}`);
  } catch (error) {
    console.error('[paypal-capture] Error:', error);
    return siteRedirect('/zahlung-fehlgeschlagen?error=server-error');
  }
}
