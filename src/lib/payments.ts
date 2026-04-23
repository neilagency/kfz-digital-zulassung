/**
 * Direct Payment Processing Library
 * ==================================
 * Handles payments directly via Mollie (credit card, Apple Pay, SEPA, PayPal)
 * without any WordPress/WooCommerce dependency.
 *
 * Mollie API: https://docs.mollie.com/reference/v2
 */

import createMollieClient, { PaymentMethod, Locale } from '@mollie/api-client';
import { paymentLog } from '@/lib/payment-logger';

/* ── Env ──────────────────────────────────────────────────── */
const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY || '';
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://onlineautoabmelden.com';

/* ── Mollie method mapping (checkout ID → Mollie enum) ───── */
const MOLLIE_METHOD_MAP: Record<string, PaymentMethod> = {
  paypal: PaymentMethod.paypal,
  credit_card: PaymentMethod.creditcard,
  apple_pay: PaymentMethod.applepay,
  sepa: PaymentMethod.banktransfer,
  klarna: PaymentMethod.klarna,
};

export function getMollieMethod(checkoutId: string): PaymentMethod | undefined {
  return MOLLIE_METHOD_MAP[checkoutId];
}

/* ── Types ────────────────────────────────────────────────── */
export interface CreatePaymentPayload {
  // Customer / billing info
  firstName?: string;
  lastName?: string;
  company?: string;
  street?: string;
  postcode?: string;
  city?: string;
  phone: string;
  email: string;

  // Payment
  paymentMethod: string; // paypal | credit_card | apple_pay | sepa

  // Product
  productId?: string; // 'abmeldung' | 'anmeldung'
  amount: string;      // Total amount as string (e.g. "20.20")
  description: string; // Order description

  // Internal
  orderId: string;     // Local DB order ID
  orderNumber: number; // Human-readable order number
}

export interface MolliePaymentResult {
  paymentId: string;
  checkoutUrl: string;
  status: string;
}

/* ── Client ───────────────────────────────────────────────── */
let _mollieClient: ReturnType<typeof createMollieClient> | null = null;

function getMollieClient() {
  if (!MOLLIE_API_KEY) {
    throw new Error('MOLLIE_API_KEY is not set');
  }
  if (!_mollieClient) {
    _mollieClient = createMollieClient({ apiKey: MOLLIE_API_KEY });
  }
  return _mollieClient;
}

/* ── Create Mollie Payment ────────────────────────────────── */
export async function createMolliePayment(payload: CreatePaymentPayload): Promise<MolliePaymentResult> {
  const mollie = getMollieClient();
  const mollieMethod = getMollieMethod(payload.paymentMethod);
  
  if (!mollieMethod) {
    throw new Error(`Unknown payment method: ${payload.paymentMethod}`);
  }

  const isTestMode = MOLLIE_API_KEY.startsWith('test_');

  paymentLog.mollieCreateAttempt({
    orderId: payload.orderId,
    orderNumber: payload.orderNumber,
    method: payload.paymentMethod,
    amount: payload.amount,
    isTestMode,
  });

  // Build payment creation params
  const paymentParams: Record<string, any> = {
    amount: {
      currency: 'EUR',
      value: payload.amount, // Must be like "19.70"
    },
    description: `Bestellung #${payload.orderNumber} – ${payload.description}`,
    redirectUrl: `${SITE_URL}/api/payment/callback?orderId=${payload.orderId}`,
    metadata: {
      orderId: payload.orderId,
      orderNumber: String(payload.orderNumber),
      email: payload.email,
      productId: payload.productId || '',
    },
    locale: Locale.de_DE,
  };

  // In test mode, omit method so Mollie shows all test methods on their page.
  // In live mode, try to pre-select the method for a smoother UX.
  // If the method is not enabled in the Mollie profile, we still create the
  // payment without a method — Mollie will show its own method selection page.
  if (!isTestMode && mollieMethod) {
    paymentParams.method = mollieMethod;
  }

  // Webhook URL — Mollie requires a publicly accessible URL (not localhost).
  // In test mode, Mollie won't call the webhook but the callback handles it.
  if (!isTestMode) {
    paymentParams.webhookUrl = `${SITE_URL}/api/payment/webhook`;
  }

  // Billing address — only include if we have enough data.
  // Mollie requires streetAndNumber, postalCode, city if billingAddress is sent.
  if (payload.street && payload.postcode && payload.city) {
    paymentParams.billingAddress = {
      givenName: payload.firstName || '',
      familyName: payload.lastName || '',
      email: payload.email,
      streetAndNumber: payload.street,
      postalCode: payload.postcode,
      city: payload.city,
      country: 'DE',
    };
  }

  // Log full payload in debug mode
  paymentLog.mollieRequestPayload(paymentParams);

  let result;
  try {
    result = await mollie.payments.create(paymentParams as any);
    paymentLog.mollieCreated({
      orderId: payload.orderId,
      orderNumber: payload.orderNumber,
      paymentId: result.id,
      status: result.status,
      checkoutUrl: result.getCheckoutUrl() || '',
    });
  } catch (err: any) {
    const msg = err?.message || '';
    const statusCode = err?.statusCode || err?.status || 'unknown';
    paymentLog.mollieCreateFailed({
      orderId: payload.orderId,
      orderNumber: payload.orderNumber,
      method: paymentParams.method || 'none',
      error: msg,
      statusCode,
    });

    if (paymentParams.method && (msg.includes('not enabled') || msg.includes('not available') || msg.includes('not supported'))) {
      paymentLog.mollieFallback({
        orderId: payload.orderId,
        orderNumber: payload.orderNumber,
        originalMethod: paymentParams.method,
      });
      delete paymentParams.method;
      try {
        result = await mollie.payments.create(paymentParams as any);
        paymentLog.mollieCreated({
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          paymentId: result.id,
          status: result.status,
          checkoutUrl: result.getCheckoutUrl() || '',
        });
      } catch (retryErr: any) {
        paymentLog.mollieCreateFailed({
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          method: 'fallback-no-method',
          error: retryErr?.message || String(retryErr),
        });
        throw retryErr;
      }
    } else {
      throw err;
    }
  }

  return {
    paymentId: result.id,
    checkoutUrl: result.getCheckoutUrl() || '',
    status: result.status,
  };
}

/* ── Klarna: Mollie Orders API (required for Klarna/in3) ──── */
export interface CreateMollieOrderPayload extends CreatePaymentPayload {
  productName: string;   // e.g. "Fahrzeugabmeldung"
  productPrice: number;  // net product price
  paymentFee: number;    // gateway fee (may be 0)
  discountAmount?: number; // coupon discount (positive value)
  couponCode?: string;     // coupon code for display
}

export async function createMollieOrder(payload: CreateMollieOrderPayload): Promise<MolliePaymentResult> {
  const mollie = getMollieClient();

  paymentLog.mollieCreateAttempt({
    orderId: payload.orderId,
    orderNumber: payload.orderNumber,
    method: payload.paymentMethod,
    amount: payload.amount,
    isTestMode: MOLLIE_API_KEY.startsWith('test_'),
  });

  // Build order lines
  const lines: any[] = [
    {
      name: payload.productName,
      quantity: 1,
      unitPrice: { currency: 'EUR', value: payload.productPrice.toFixed(2) },
      totalAmount: { currency: 'EUR', value: payload.productPrice.toFixed(2) },
      vatRate: '19.00',
      vatAmount: {
        currency: 'EUR',
        value: (payload.productPrice - payload.productPrice / 1.19).toFixed(2),
      },
    },
  ];

  if (payload.paymentFee > 0) {
    lines.push({
      name: 'Zahlungsgebühr',
      quantity: 1,
      unitPrice: { currency: 'EUR', value: payload.paymentFee.toFixed(2) },
      totalAmount: { currency: 'EUR', value: payload.paymentFee.toFixed(2) },
      vatRate: '19.00',
      vatAmount: {
        currency: 'EUR',
        value: (payload.paymentFee - payload.paymentFee / 1.19).toFixed(2),
      },
    });
  }

  // Add discount line item (negative amount) if coupon was applied
  if (payload.discountAmount && payload.discountAmount > 0) {
    const discountLabel = payload.couponCode
      ? `Rabatt (${payload.couponCode})`
      : 'Rabatt';
    lines.push({
      name: discountLabel,
      quantity: 1,
      unitPrice: { currency: 'EUR', value: `-${payload.discountAmount.toFixed(2)}` },
      totalAmount: { currency: 'EUR', value: `-${payload.discountAmount.toFixed(2)}` },
      vatRate: '19.00',
      vatAmount: {
        currency: 'EUR',
        value: `-${(payload.discountAmount - payload.discountAmount / 1.19).toFixed(2)}`,
      },
    });
  }

  const orderParams: Record<string, any> = {
    amount: { currency: 'EUR', value: payload.amount },
    orderNumber: String(payload.orderNumber),
    lines,
    billingAddress: {
      givenName: payload.firstName || 'Kunde',
      familyName: payload.lastName || '-',
      email: payload.email,
      streetAndNumber: payload.street || '-',
      postalCode: payload.postcode || '00000',
      city: payload.city || '-',
      country: 'DE',
    },
    redirectUrl: `${SITE_URL}/api/payment/callback?orderId=${payload.orderId}`,
    locale: Locale.de_DE,
    method: 'klarna',
    metadata: {
      orderId: payload.orderId,
      orderNumber: String(payload.orderNumber),
      email: payload.email,
      productId: payload.productId || '',
    },
  };

  if (!MOLLIE_API_KEY.startsWith('test_')) {
    orderParams.webhookUrl = `${SITE_URL}/api/payment/webhook`;
  }

  paymentLog.mollieRequestPayload(orderParams);

  try {
    const result = await (mollie as any).orders.create(orderParams);

    paymentLog.mollieCreated({
      orderId: payload.orderId,
      orderNumber: payload.orderNumber,
      paymentId: result.id,
      status: result.status,
      checkoutUrl: result._links?.checkout?.href || '',
    });

    return {
      paymentId: result.id, // ord_xxxxx
      checkoutUrl: result._links?.checkout?.href || '',
      status: result.status,
    };
  } catch (err: any) {
    paymentLog.mollieCreateFailed({
      orderId: payload.orderId,
      orderNumber: payload.orderNumber,
      method: 'klarna',
      error: err?.message || String(err),
      statusCode: err?.statusCode || 'unknown',
    });
    throw err;
  }
}

/* ── Get Mollie Order Status (for Klarna ord_ IDs) ────────── */
export async function getMollieOrderStatus(mollieOrderId: string) {
  const mollie = getMollieClient();
  const result = await (mollie as any).orders.get(mollieOrderId, { embed: ['payments'] });
  const meta = result.metadata as Record<string, string> || {};

  // Find the embedded payment status
  const payments = result._embedded?.payments || [];
  const latestPayment = payments[payments.length - 1];

  return {
    id: result.id,
    status: result.status, // created, paid, authorized, canceled, expired, completed
    amount: result.amount,
    method: result.method || latestPayment?.method,
    paidAt: result.paidAt || latestPayment?.paidAt,
    metadata: meta,
    details: latestPayment?.details || null,
    failureReason: latestPayment?.failureReason || null,
    paymentId: latestPayment?.id || null,
  };
}

/* ── Get Payment Status ───────────────────────────────────── */
export async function getMolliePaymentStatus(paymentId: string) {
  const mollie = getMollieClient();
  const result = await mollie.payments.get(paymentId);

  // Log every status check (info for success, error for failures)
  const meta = result.metadata as Record<string, string>;
  paymentLog.debug('MOLLIE_STATUS', `Payment ${paymentId} status fetched`, {
    paymentId,
    status: result.status,
    method: result.method || undefined,
    orderId: meta?.orderId,
  });

  if (result.status === 'failed' || result.status === 'canceled' || result.status === 'expired') {
    paymentLog.webhookStatus({
      paymentId,
      orderId: meta?.orderId || 'unknown',
      orderNumber: meta?.orderNumber,
      status: result.status,
      method: result.method,
      amount: result.amount,
      failureReason: (result as any).failureReason || null,
      details: (result as any).details || null,
    });
  }

  return {
    id: result.id,
    status: result.status,
    amount: result.amount,
    method: result.method,
    paidAt: result.paidAt,
    metadata: result.metadata as Record<string, string>,
    details: (result as any).details || null,
    failureReason: (result as any).failureReason || null,
  };
}

/* ── List Available Mollie Methods ────────────────────────── */
export async function listAvailableMollieMethods() {
  const mollie = getMollieClient();
  try {
    const methods = await mollie.methods.list();
    return methods.map((m: any) => ({
      id: m.id,
      description: m.description,
      status: m.status,
      image: m.image?.svg || '',
    }));
  } catch (err: any) {
    console.error(`[mollie] Failed to list methods: ${err?.message || err}`);
    return [];
  }
}

/* ── Create Mollie Refund ─────────────────────────────────── */
export interface RefundResult {
  refundId: string;
  status: string;
  amount: { currency: string; value: string };
}

export async function createMollieRefund(
  paymentId: string,
  amount: { currency: string; value: string },
  description?: string,
): Promise<RefundResult> {
  const mollie = getMollieClient();

  paymentLog.debug('MOLLIE_REFUND_ATTEMPT', `Refund for payment ${paymentId}`, {
    paymentId,
    amount: amount.value,
    currency: amount.currency,
  });

  const refund = await mollie.paymentRefunds.create({
    paymentId,
    amount,
    ...(description ? { description } : {}),
  });

  paymentLog.debug('MOLLIE_REFUND_CREATED', `Refund ${refund.id} created`, {
    refundId: refund.id,
    paymentId,
    status: refund.status,
    amount: String(refund.amount.value),
  });

  return {
    refundId: refund.id,
    status: refund.status,
    amount: { currency: String(refund.amount.currency), value: String(refund.amount.value) },
  };
}

/* ── Get Mollie Refunds for Payment ───────────────────────── */
export async function getMollieRefunds(paymentId: string) {
  const mollie = getMollieClient();
  const refunds = await mollie.paymentRefunds.page({ paymentId });
  return Array.from(refunds).map((r: any) => ({
    id: r.id,
    status: r.status,
    amount: { currency: String(r.amount.currency), value: String(r.amount.value) },
    createdAt: r.createdAt,
    description: r.description,
  }));
}
