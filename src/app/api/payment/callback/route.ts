/**
 * Mollie Payment Callback
 * ========================
 * User is redirected here after completing/cancelling payment on Mollie.
 * Checks payment status and redirects to appropriate page.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getMolliePaymentStatus, getMollieOrderStatus } from '@/lib/payments';
import { triggerInvoiceEmail } from '@/lib/trigger-invoice';
import { paymentLog } from '@/lib/payment-logger';

export const runtime = 'nodejs';

const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://onlineautoabmelden.com';

function siteRedirect(path: string) {
  return NextResponse.redirect(`${SITE_URL}${path}`, { status: 302 });
}

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId');

  if (!orderId) {
    return siteRedirect('/rechnung?error=missing-order');
  }

  try {
    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) {
      return siteRedirect('/rechnung?error=order-not-found');
    }

    paymentLog.callbackReceived({ orderId, orderNumber: order.orderNumber });

    // Check payment status via the latest payment record
    const payment = order.payments?.[0];
    if (payment?.transactionId) {
      try {
        // Klarna uses Orders API (ord_xxxxx), others use Payments API (tr_xxxxx)
        const isOrderId = payment.transactionId.startsWith('ord_');
        const mollieStatus = isOrderId
          ? await getMollieOrderStatus(payment.transactionId)
          : await getMolliePaymentStatus(payment.transactionId);

        paymentLog.callbackStatus({
          orderId,
          paymentId: payment.transactionId,
          status: mollieStatus.status,
          method: mollieStatus.method,
          failureReason: mollieStatus.failureReason,
          details: mollieStatus.details,
        });

        // Klarna 'authorized' = payment guaranteed (treat as paid)
        const isPaid = mollieStatus.status === 'paid' || mollieStatus.status === 'authorized' || mollieStatus.status === 'completed';

        if (isPaid) {
          // Update order if webhook hasn't fired yet
          if (order.status !== 'processing' && order.status !== 'completed') {
            await prisma.order.update({
              where: { id: orderId },
              data: { status: 'processing', datePaid: new Date(), transactionId: payment.transactionId },
            });
            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'paid', paidAt: new Date() },
            });
            const invoice = await prisma.invoice.findFirst({ where: { orderId } });
            if (invoice) {
              await prisma.invoice.update({
                where: { id: invoice.id },
                data: { paymentStatus: 'paid', transactionId: payment.transactionId },
              });
            }
          }

          // Trigger invoice email — await to ensure it runs
          const emailResult = await triggerInvoiceEmail(orderId);
          paymentLog.emailTriggered({ orderId, success: emailResult.success, error: emailResult.error });
          if (!emailResult.success) {
            console.error(`[callback] Email failed for order ${orderId}: ${emailResult.error}`);
          }

          // Redirect to success page
          return siteRedirect(`/bestellung-erfolgreich?order=${order.orderNumber}`);
        }

        if (mollieStatus.status === 'failed' || mollieStatus.status === 'canceled' || mollieStatus.status === 'expired') {
          console.error(`[callback] Payment failed: ${payment.transactionId}`, JSON.stringify({
            status: mollieStatus.status,
            failureReason: mollieStatus.failureReason,
            details: mollieStatus.details,
            method: mollieStatus.method,
          }));

          // Store failure details + order note
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: mollieStatus.status === 'canceled' ? 'cancelled' : mollieStatus.status,
              providerData: JSON.stringify({
                ...mollieStatus,
                failedAt: new Date().toISOString(),
              }),
            },
          });

          // Add order note for the failure
          await prisma.orderNote.create({
            data: {
              orderId,
              note: `Zahlung ${mollieStatus.status}: ${payment.transactionId} (${mollieStatus.method || 'unknown'})${mollieStatus.failureReason ? ' \u2014 Grund: ' + JSON.stringify(mollieStatus.failureReason) : ''}`,
              author: 'System',
            },
          });

          return siteRedirect(`/zahlung-fehlgeschlagen?order=${order.orderNumber}&reason=${mollieStatus.failureReason || mollieStatus.status}`);
        }

        // Still pending — check again
        if (mollieStatus.status === 'open' || mollieStatus.status === 'pending') {
          return siteRedirect(`/bestellung-erfolgreich?order=${order.orderNumber}&status=pending`);
        }
      } catch {
        // Mollie check failed, fall through
      }
    }

    // Fallback: check order status from our DB
    if (order.status === 'processing' || order.status === 'completed') {
      return siteRedirect(`/bestellung-erfolgreich?order=${order.orderNumber}`);
    }

    // Default: redirect to pending
    return siteRedirect(`/bestellung-erfolgreich?order=${order.orderNumber}&status=pending`);
  } catch (error) {
    console.error('Payment callback error:', error);
    return siteRedirect('/zahlung-fehlgeschlagen?error=server-error');
  }
}
