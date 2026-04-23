/**
 * PayPal Direct Integration (REST API v2)
 * ========================================
 * Creates and captures PayPal orders directly — no Mollie middleman.
 *
 * Requires env vars:
 *   PAYPAL_CLIENT_ID     – Live/Sandbox client ID
 *   PAYPAL_CLIENT_SECRET – Live/Sandbox secret
 *   PAYPAL_MODE          – "live" | "sandbox" (default: "live")
 *
 * Docs: https://developer.paypal.com/docs/api/orders/v2/
 */

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'live';

const PAYPAL_BASE_URL =
  PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://onlineautoabmelden.com';

/* ── Access Token (cached) ─────────────────────────────────── */
let _accessToken: string | null = null;
let _tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (_accessToken && Date.now() < _tokenExpiry) {
    return _accessToken;
  }

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`PayPal auth failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  _accessToken = data.access_token;
  // Expire 60s before actual expiry to be safe
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return _accessToken!;
}

/* ── Types ─────────────────────────────────────────────────── */
export interface PayPalCreateOrderPayload {
  orderId: string;       // Local DB order ID
  orderNumber: number;   // Human-readable order number
  amount: string;        // e.g. "19.70"
  description: string;   // Product name
  email: string;
}

export interface PayPalCreateOrderResult {
  paypalOrderId: string;
  approvalUrl: string;
  status: string;
}

export interface PayPalCaptureResult {
  paypalOrderId: string;
  captureId: string;
  status: string;          // COMPLETED, DECLINED, etc.
  payerEmail: string;
  amount: string;
}

/* ── Refund Types ──────────────────────────────────────────── */
export interface PayPalRefundResult {
  refundId: string;
  status: string;  // COMPLETED, PENDING, CANCELLED
  amount: string;
}

export interface PayPalRefundRecord {
  id: string;
  status: string;
  amount: { value: string; currency_code: string };
  create_time: string;
}

/* ── Create PayPal Order ───────────────────────────────────── */
export async function createPayPalOrder(
  payload: PayPalCreateOrderPayload,
): Promise<PayPalCreateOrderResult> {
  const token = await getAccessToken();

  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: payload.orderId,
        description: `Bestellung #${payload.orderNumber} – ${payload.description}`,
        amount: {
          currency_code: 'EUR',
          value: payload.amount,
        },
        custom_id: payload.orderId,
        invoice_id: `ORD-${payload.orderNumber}`,
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: 'Online Auto Abmelden',
          locale: 'de-DE',
          landing_page: 'LOGIN',
          user_action: 'PAY_NOW',
          return_url: `${SITE_URL}/api/payment/paypal/capture?orderId=${payload.orderId}`,
          cancel_url: `${SITE_URL}/rechnung?error=payment-cancelled&order=${payload.orderNumber}`,
        },
      },
    },
  };

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[paypal] Create order failed:', res.status, errText);
    throw new Error(`PayPal order creation failed (${res.status})`);
  }

  const data = await res.json();

  // Find the approval link
  const approvalLink = data.links?.find(
    (l: { rel: string; href: string }) => l.rel === 'payer-action',
  );

  if (!approvalLink) {
    throw new Error('PayPal did not return an approval URL');
  }

  return {
    paypalOrderId: data.id,
    approvalUrl: approvalLink.href,
    status: data.status,
  };
}

/* ── Capture PayPal Order (after user approves) ────────────── */
export async function capturePayPalOrder(
  paypalOrderId: string,
): Promise<PayPalCaptureResult> {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error('[paypal] Capture failed:', res.status, errText);
    throw new Error(`PayPal capture failed (${res.status})`);
  }

  const data = await res.json();
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];

  return {
    paypalOrderId: data.id,
    captureId: capture?.id || '',
    status: data.status, // COMPLETED
    payerEmail: data.payer?.email_address || '',
    amount: capture?.amount?.value || '',
  };
}

/* ── Get PayPal Order Details ──────────────────────────────── */
export async function getPayPalOrder(paypalOrderId: string) {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`PayPal get order failed (${res.status})`);
  }

  return res.json();
}

/* ── Refund PayPal Capture ─────────────────────────────────── */
export async function refundPayPalCapture(
  captureId: string,
  amount?: { currency_code: string; value: string },
  note?: string,
): Promise<PayPalRefundResult> {
  const token = await getAccessToken();

  const body: Record<string, unknown> = {};
  if (amount) {
    body.amount = amount;
  }
  if (note) {
    body.note_to_payer = note.slice(0, 255);
  }

  const res = await fetch(
    `${PAYPAL_BASE_URL}/v2/payments/captures/${captureId}/refund`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    let parsed: any;
    try { parsed = JSON.parse(errText); } catch { /* ignore */ }
    const detail = parsed?.details?.[0]?.description || parsed?.message || errText;
    console.error('[paypal] Refund failed:', res.status, errText);
    throw new Error(detail || `PayPal refund failed (${res.status})`);
  }

  const data = await res.json();

  return {
    refundId: data.id || '',
    status: data.status || '',
    amount: data.amount?.value || '',
  };
}

/* ── Get Refunds for a PayPal Capture ──────────────────────── */
export async function getPayPalCaptureRefunds(
  captureId: string,
): Promise<PayPalRefundRecord[]> {
  const token = await getAccessToken();

  // Get capture details which includes refund links
  const res = await fetch(
    `${PAYPAL_BASE_URL}/v2/payments/captures/${captureId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();

  // If the capture has a refund link, follow it
  const refundLink = data.links?.find((l: any) => l.rel === 'refund');
  if (!refundLink && data.status !== 'REFUNDED' && data.status !== 'PARTIALLY_REFUNDED') {
    return [];
  }

  // PayPal captures API doesn't directly list refunds, but we can
  // check supplementary_data or return the capture refund status
  // For display, we construct records from the capture data
  const refunds: PayPalRefundRecord[] = [];

  if (data.amount && (data.status === 'REFUNDED' || data.status === 'PARTIALLY_REFUNDED')) {
    refunds.push({
      id: data.id,
      status: data.status === 'REFUNDED' ? 'COMPLETED' : 'PARTIALLY_REFUNDED',
      amount: {
        value: data.amount?.value || '0.00',
        currency_code: data.amount?.currency_code || 'EUR',
      },
      create_time: data.update_time || data.create_time || '',
    });
  }

  return refunds;
}
