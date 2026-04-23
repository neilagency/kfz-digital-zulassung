/**
 * Refund API (Mollie + PayPal)
 * =============================
 * POST /api/admin/orders/[id]/refund
 *
 * Automatically routes to the correct payment provider:
 *   - Mollie (tr_* transaction IDs)
 *   - PayPal (all other paid transactions)
 *
 * Only updates local DB status AFTER provider confirms the refund.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createMollieRefund, getMollieRefunds } from '@/lib/payments';
import { refundPayPalCapture, getPayPalCaptureRefunds } from '@/lib/paypal';

/** Determine payment provider from transaction ID and payment method */
function detectProvider(
  order: { paymentMethod: string; transactionId: string },
  payments: { transactionId: string; method: string; status: string; gatewayId: string }[],
): { provider: 'mollie' | 'paypal'; transactionId: string } | null {
  // 1. Check paid payments for provider info
  const paidPayment = payments.find((p) => p.status === 'paid' && p.transactionId);

  if (paidPayment) {
    if (paidPayment.transactionId.startsWith('tr_')) {
      return { provider: 'mollie', transactionId: paidPayment.transactionId };
    }
    if (
      paidPayment.gatewayId === 'paypal' ||
      paidPayment.method?.includes('paypal') ||
      order.paymentMethod === 'paypal'
    ) {
      return { provider: 'paypal', transactionId: paidPayment.transactionId };
    }
  }

  // 2. Fallback to order-level transactionId
  if (order.transactionId) {
    if (order.transactionId.startsWith('tr_')) {
      return { provider: 'mollie', transactionId: order.transactionId };
    }
    if (order.paymentMethod === 'paypal') {
      return { provider: 'paypal', transactionId: order.transactionId };
    }
  }

  return null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { amount } = body; // optional: partial refund amount as string e.g. "10.00"

    // 1. Load order with payments
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Bestellung nicht gefunden' }, { status: 404 });
    }

    // 2. Detect payment provider
    const providerInfo = detectProvider(order, order.payments);

    if (!providerInfo) {
      return NextResponse.json(
        { error: 'Keine gültige Zahlung gefunden. Refund erfordert eine bezahlte Mollie- oder PayPal-Transaktion.' },
        { status: 400 },
      );
    }

    const { provider, transactionId } = providerInfo;

    // 3. Determine refund amount
    const refundValue = amount
      ? parseFloat(amount).toFixed(2)
      : order.total.toFixed(2);

    if (isNaN(parseFloat(refundValue)) || parseFloat(refundValue) < 0) {
      return NextResponse.json({ error: 'Ungültiger Betrag' }, { status: 400 });
    }

    if (parseFloat(refundValue) > order.total) {
      return NextResponse.json(
        { error: `Betrag (€${refundValue}) übersteigt Bestellsumme (€${order.total.toFixed(2)})` },
        { status: 400 },
      );
    }

    const isFullRefund = parseFloat(refundValue) >= order.total;
    let refundResult: { refundId: string; status: string };

    // 4. For €0 orders, skip provider API (nothing to refund financially)
    if (parseFloat(refundValue) === 0) {
      refundResult = { refundId: 'zero-amount', status: 'refunded' };
    } else if (provider === 'mollie') {
      // ── Mollie Refund ──
      refundResult = await createMollieRefund(
        transactionId,
        { currency: 'EUR', value: refundValue },
        `Erstattung für Bestellung #${order.orderNumber}`,
      );
    } else {
      // ── PayPal Refund ──
      const paypalResult = await refundPayPalCapture(
        transactionId,
        { currency_code: 'EUR', value: refundValue },
        `Erstattung Bestellung #${order.orderNumber}`,
      );
      refundResult = {
        refundId: paypalResult.refundId,
        status: paypalResult.status === 'COMPLETED' ? 'refunded' : paypalResult.status.toLowerCase(),
      };
    }

    // 5. Only update DB after success
    const paidPayment = order.payments.find((p) => p.status === 'paid' && p.transactionId);

    if (isFullRefund) {
      await prisma.order.update({
        where: { id: params.id },
        data: { status: 'refunded' },
      });
    }

    // Update payment status
    if (paidPayment) {
      await prisma.payment.update({
        where: { id: paidPayment.id },
        data: { status: isFullRefund ? 'refunded' : 'partially_refunded' },
      });
    }

    // Update invoice
    await prisma.invoice.updateMany({
      where: { orderId: params.id },
      data: { paymentStatus: isFullRefund ? 'refunded' : 'partially_refunded' },
    });

    // Add order note
    const providerLabel = provider === 'mollie' ? 'Mollie' : 'PayPal';
    await prisma.orderNote.create({
      data: {
        orderId: params.id,
        note: `${providerLabel} Erstattung ${isFullRefund ? '(Voll)' : '(Teil)'}: €${refundValue} – Refund-ID: ${refundResult.refundId} – Status: ${refundResult.status}`,
        author: 'System',
      },
    });

    return NextResponse.json({
      success: true,
      provider,
      refundId: refundResult.refundId,
      status: refundResult.status,
      amount: refundValue,
      isFullRefund,
    });
  } catch (error: any) {
    console.error('Refund error:', error);

    const errMessage = error?.message || '';
    let userMessage = 'Erstattung fehlgeschlagen';

    // Mollie-specific errors
    if (errMessage.includes('already been refunded')) {
      userMessage = 'Diese Zahlung wurde bereits vollständig erstattet';
    } else if (errMessage.includes('higher than')) {
      userMessage = 'Der Erstattungsbetrag ist höher als der verfügbare Betrag';
    } else if (errMessage.includes('not paid')) {
      userMessage = 'Diese Zahlung wurde noch nicht bezahlt';
    }
    // PayPal-specific errors
    else if (errMessage.includes('CAPTURE_FULLY_REFUNDED')) {
      userMessage = 'Diese PayPal-Zahlung wurde bereits vollständig erstattet';
    } else if (errMessage.includes('REFUND_AMOUNT_EXCEEDED')) {
      userMessage = 'Der Erstattungsbetrag übersteigt den verfügbaren PayPal-Betrag';
    } else if (errMessage.includes('REFUND_NOT_ALLOWED')) {
      userMessage = 'PayPal erlaubt keine Erstattung für diese Transaktion';
    } else if (errMessage) {
      userMessage = `Fehler: ${errMessage}`;
    }

    return NextResponse.json({ error: userMessage }, { status: 400 });
  }
}

// GET: Fetch refund history for this order's payment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const providerInfo = detectProvider(order, order.payments);
    if (!providerInfo) {
      return NextResponse.json({ refunds: [], provider: null });
    }

    const { provider, transactionId } = providerInfo;

    if (provider === 'mollie') {
      const refunds = await getMollieRefunds(transactionId);
      return NextResponse.json({ refunds, provider: 'mollie' });
    } else {
      const refunds = await getPayPalCaptureRefunds(transactionId);
      // Normalize PayPal format to match Mollie display format
      const normalized = refunds.map((r) => ({
        id: r.id,
        status: r.status === 'COMPLETED' ? 'refunded' : r.status.toLowerCase(),
        amount: { value: r.amount.value, currency: r.amount.currency_code },
        createdAt: r.create_time,
      }));
      return NextResponse.json({ refunds: normalized, provider: 'paypal' });
    }
  } catch (error) {
    console.error('Refund list error:', error);
    return NextResponse.json({ refunds: [], provider: null });
  }
}
