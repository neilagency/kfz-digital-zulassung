# PayPal & Mollie — Payment Provider Setup Guide (Project B)

> **Author:** AI System Audit  
> **Date:** 2025-07-25  
> **Purpose:** Step-by-step guide for the second developer setting up payment providers in Project B  
> **Source:** Extracted from working production code of Project A (onlineautoabmelden.com)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Environment Variables](#2-environment-variables)
3. [PayPal Setup](#3-paypal-setup)
4. [Mollie Setup](#4-mollie-setup)
5. [Webhook Security Model](#5-webhook-security-model)
6. [Testing Checklist](#6-testing-checklist)
7. [Common Pitfalls](#7-common-pitfalls)

---

## 1. Architecture Overview

The payment system uses **two separate providers**:

| Provider | Methods | Integration Type |
|----------|---------|-----------------|
| **Mollie** | Credit Card, Apple Pay, SEPA, Klarna | Mollie SDK (`@mollie/api-client`) |
| **PayPal** | PayPal balance, CC via PayPal | Direct REST API v2 (no SDK) |

### Payment Flow (Both Providers)

```
Customer → Checkout → Create Payment → Redirect to Provider → Customer Pays
    → Provider Redirects Back (callback URL) → Capture/Verify → Update DB
    → Provider Sends Webhook (async) → Safety Net Update
```

**Key Concept:** The **callback** (redirect) is the primary flow. The **webhook** is a safety net for edge cases (user closes browser, network timeout, etc.).

---

## 2. Environment Variables

Add these to your `.env` or `server.env`:

```bash
# ── PayPal Direct (REST API v2) ──────────────────────────────
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_MODE=sandbox                    # "sandbox" for testing, "live" for production

# ── Mollie Payments ──────────────────────────────────────────
MOLLIE_API_KEY=test_xxxxxxxxxxxxxxxxx  # "test_..." for testing, "live_..." for production

# ── Site URL (used for callback/webhook URLs) ────────────────
SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

> **⚠️ IMPORTANT:** Never commit real credentials to git. Use environment files excluded from version control.

---

## 3. PayPal Setup

### Step 1: Create PayPal Developer Account

1. Go to: https://developer.paypal.com/dashboard/
2. Log in with your PayPal business account
3. Switch between **Sandbox** and **Live** using the toggle at the top

### Step 2: Create an App (REST API)

1. Go to **Apps & Credentials**
2. Click **Create App**
3. Name it (e.g., "Project B - Fahrzeug Zulassung")
4. Select **Merchant** as the app type
5. Click **Create App**
6. Copy the **Client ID** and **Secret** → put in `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`

> **Do this twice:** Once for Sandbox (testing), once for Live (production). Each has different credentials.

### Step 3: Configure Webhook URL

1. In the same app page, scroll down to **Webhooks**
2. Click **Add Webhook**
3. Enter your webhook URL:
   ```
   https://your-domain.com/api/payment/paypal/webhook
   ```
4. Subscribe to these events (minimum required):
   - ✅ `PAYMENT.CAPTURE.COMPLETED` — Payment was successful
   - ✅ `PAYMENT.CAPTURE.DENIED` — Payment was declined
   - ✅ `PAYMENT.CAPTURE.REFUNDED` — A refund was processed
5. Click **Save**
6. After saving, PayPal shows a **Webhook ID** (e.g., `5GP028458E2496506`)
   - Copy this → put in `PAYPAL_WEBHOOK_ID` env var (if you implement signature verification — see Section 5)

### Step 4: PayPal API Endpoints

The code automatically selects the correct base URL based on `PAYPAL_MODE`:

| Mode | Base URL |
|------|----------|
| `sandbox` | `https://api-m.sandbox.paypal.com` |
| `live` | `https://api-m.paypal.com` |

### Step 5: API Routes to Create

You need these API routes in your Next.js app:

```
src/app/api/payment/paypal/create/route.ts    → Creates PayPal order, returns approval URL
src/app/api/payment/paypal/capture/route.ts   → Captures payment after customer approves
src/app/api/payment/paypal/webhook/route.ts   → Receives async notifications (safety net)
```

**PayPal Flow in Detail:**

```
1. Frontend calls POST /api/payment/paypal/create
   → Backend calls PayPal API: POST /v2/checkout/orders
   → Returns { approvalUrl } to frontend

2. Frontend redirects customer to approvalUrl (PayPal login page)

3. Customer approves → PayPal redirects to your callback URL:
   https://your-domain.com/api/payment/paypal/capture?token=PAYPAL_ORDER_ID

4. Your capture endpoint calls PayPal API: POST /v2/checkout/orders/{id}/capture
   → If status == "COMPLETED" → update DB order status to "processing"
   → Redirect customer to success page

5. Later, PayPal sends webhook POST to /api/payment/paypal/webhook
   → Safety net: update DB if callback was missed
```

---

## 4. Mollie Setup

### Step 1: Create Mollie Account

1. Go to: https://www.mollie.com/dashboard/signup
2. Complete business verification (required for live payments)

### Step 2: Get API Key

1. Go to **Developers** → **API Keys**
2. Copy the **Test API key** (`test_...`) for development
3. Copy the **Live API key** (`live_...`) for production
4. Put in `MOLLIE_API_KEY`

### Step 3: Enable Payment Methods

1. Go to **Settings** → **Payment Methods**
2. Enable:
   - ✅ Credit Card
   - ✅ Apple Pay (requires domain verification — see below)
   - ✅ SEPA Bank Transfer
   - ✅ Klarna (requires separate Klarna approval)

### Step 4: Configure Webhook URL (Automatic)

Unlike PayPal, Mollie's webhook URL is sent **per payment** in the API call:

```typescript
const payment = await mollieClient.payments.create({
  amount: { currency: 'EUR', value: '19.70' },
  description: 'Fahrzeug Abmeldung',
  redirectUrl: `${SITE_URL}/api/payment/callback?orderId=${orderId}`,
  webhookUrl: `${SITE_URL}/api/payment/webhook`,  // ← Set here
  metadata: { orderId, orderNumber },
  method: 'creditcard',  // or 'applepay', 'banktransfer'
});
```

No separate dashboard configuration needed for webhooks.

### Step 5: Apple Pay Domain Verification

If using Apple Pay via Mollie:

1. Download the verification file from Mollie Dashboard
2. Place it at: `public/.well-known/apple-developer-merchantid-domain-association`
3. Deploy and verify via the Mollie Dashboard

### Step 6: API Routes for Mollie

```
src/app/api/payment/checkout/route.ts     → Creates Mollie payment, returns checkout URL
src/app/api/payment/callback/route.ts     → Customer returns here after paying
src/app/api/payment/webhook/route.ts      → Mollie posts payment ID when status changes
```

**Mollie Flow in Detail:**

```
1. Frontend calls POST /api/payment/checkout
   → Backend calls Mollie API: payments.create(...)
   → Returns { checkoutUrl } to frontend

2. Frontend redirects customer to checkoutUrl (Mollie hosted payment page)

3. Customer pays → Mollie redirects to your callback URL:
   /api/payment/callback?orderId=xxx

4. Your callback endpoint calls Mollie API to verify: payments.get(transactionId)
   → If status == "paid" → update DB
   → Redirect customer to success page

5. Mollie sends webhook POST to /api/payment/webhook with body: id=tr_xxxxx
   → Your webhook endpoint calls Mollie API: payments.get(mollieId)
   → Verify actual status from API response (don't trust webhook body)
   → Update DB if needed
```

---

## 5. Webhook Security Model

### Current Approach (Project A): "Verify via API"

| Provider | How Webhook Works | Security |
|----------|------------------|----------|
| **Mollie** | Sends only `id` (e.g., `tr_xxx`) → Backend fetches actual status from Mollie API | ✅ Secure — status comes from API, not webhook body |
| **PayPal** | Sends full event body → Backend uses `custom_id` to find order in DB | ⚠️ No signature verification — relies on DB lookup |

### Mollie Security (Already Secure)

Mollie's model is inherently safe:
1. Webhook sends: `id=tr_xxxxx` (nothing else)
2. Your code calls: `mollieClient.payments.get('tr_xxxxx')`
3. You read the **actual** status from Mollie's API response
4. **An attacker sending a fake webhook ID would get "payment not found" from Mollie API** → safe

### PayPal Security (Needs Improvement)

Current Project A code does **NOT** verify PayPal webhook signatures. To add this:

#### Option A: Add Signature Verification (Recommended)

```typescript
// In your webhook handler
import crypto from 'crypto';

async function verifyPayPalWebhook(req: NextRequest, body: any): Promise<boolean> {
  const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;  // From PayPal Dashboard
  if (!WEBHOOK_ID) return false;

  const headers = {
    'paypal-auth-algo': req.headers.get('paypal-auth-algo') || '',
    'paypal-cert-url': req.headers.get('paypal-cert-url') || '',
    'paypal-transmission-id': req.headers.get('paypal-transmission-id') || '',
    'paypal-transmission-sig': req.headers.get('paypal-transmission-sig') || '',
    'paypal-transmission-time': req.headers.get('paypal-transmission-time') || '',
  };

  // Call PayPal's verify-webhook-signature API
  const accessToken = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: WEBHOOK_ID,
      webhook_event: body,
    }),
  });

  const result = await res.json();
  return result.verification_status === 'SUCCESS';
}
```

Then in the webhook handler:

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Verify signature first
  const isValid = await verifyPayPalWebhook(request, body);
  if (!isValid) {
    console.warn('[paypal-webhook] Invalid signature — rejecting');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ... process event
}
```

#### Option B: Verify via PayPal API (Like Mollie)

Instead of trusting the webhook body, re-fetch the capture status:

```typescript
// After finding payment in DB from webhook:
const captureDetails = await fetch(
  `${PAYPAL_BASE_URL}/v2/payments/captures/${captureId}`,
  { headers: { Authorization: `Bearer ${accessToken}` } }
);
const capture = await captureDetails.json();

// Use capture.status from API, not from webhook body
if (capture.status === 'COMPLETED') {
  // ... update DB
}
```

> **Recommendation:** Implement **Option A** (signature verification) for Project B. It's the PayPal-recommended approach and prevents fake webhook attacks entirely.

---

## 6. Testing Checklist

### PayPal Sandbox Testing

1. [ ] Set `PAYPAL_MODE=sandbox` and use sandbox credentials
2. [ ] Create test buyer account at https://developer.paypal.com/dashboard/accounts
3. [ ] Test happy path: Create → Approve → Capture → Check DB status
4. [ ] Test cancelled: Customer clicks "Cancel" on PayPal page → verify redirect
5. [ ] Check webhook logs at: https://developer.paypal.com/dashboard/webhooks
6. [ ] Verify webhook receives events (may need a public URL — use ngrok for local dev)

### Mollie Test Mode

1. [ ] Set `MOLLIE_API_KEY=test_...`
2. [ ] Use Mollie test payment page (lets you simulate different statuses)
3. [ ] Test: paid, failed, cancelled, expired
4. [ ] Verify webhook receives `id` and status is fetched from API

### Production Go-Live

1. [ ] Switch `PAYPAL_MODE=live` and use live credentials
2. [ ] Switch `MOLLIE_API_KEY=live_...`
3. [ ] Update webhook URL to production domain
4. [ ] Do one real small-amount test payment with each method
5. [ ] Monitor logs for first 24 hours for webhook errors

---

## 7. Common Pitfalls

### PayPal

| Problem | Cause | Solution |
|---------|-------|----------|
| `PayPal auth failed (401)` | Wrong credentials for the mode | Sandbox credentials for sandbox, live for live |
| Webhook never fires | URL not accessible or events not subscribed | Check PayPal Dashboard → Webhooks → Event log |
| `COMPLETED` status but DB not updated | Callback already processed it | Check for idempotency: `if (order.status !== 'processing')` |
| Duplicate captures | Capture called multiple times | PayPal is idempotent — same response returned, but check your DB logic |

### Mollie

| Problem | Cause | Solution |
|---------|-------|----------|
| Webhook returns 404 | Wrong URL path | URL must be publicly accessible, not localhost |
| `live_` key but test mode | Mollie dashboard in test mode | Toggle to live in dashboard AND use live API key |
| Apple Pay not showing | Domain not verified | Add Apple Pay verification file to `/.well-known/` |
| SEPA takes days | Bank transfer is async | Status stays `open` until bank confirms (1-3 business days) |

### General

| Problem | Cause | Solution |
|---------|-------|----------|
| Webhook works in dev, not in prod | Firewall/proxy blocking POST | Ensure server accepts POST on webhook routes |
| Order stuck in "pending" | Neither callback nor webhook fired | Add a cron job to check pending orders > 1 hour |
| Double email sent | Both callback and webhook update status | Only send email if status was NOT already "processing" |

---

## Quick Start Commands

```bash
# Install dependencies
npm install @mollie/api-client

# PayPal doesn't need an SDK — uses native fetch()

# Run in sandbox mode
PAYPAL_MODE=sandbox npm run dev

# Test PayPal webhook locally (with ngrok)
ngrok http 3000
# Then update PayPal Dashboard webhook URL to: https://xxxx.ngrok.io/api/payment/paypal/webhook
```

---

## File Structure Reference

```
src/
├── lib/
│   ├── paypal.ts              # PayPal REST API v2 functions
│   └── payments.ts            # Mollie integration + gateway logic
├── app/api/payment/
│   ├── checkout/route.ts      # POST: Create Mollie payment
│   ├── callback/route.ts      # GET: Customer returns after paying
│   ├── webhook/route.ts       # POST: Mollie webhook (async)
│   ├── paypal/
│   │   ├── create/route.ts    # POST: Create PayPal order
│   │   ├── capture/route.ts   # GET: Capture after approval
│   │   └── webhook/route.ts   # POST: PayPal webhook (async)
│   └── refund/route.ts        # POST: Process refunds (admin)
```

---

**End of guide. For the full payment system documentation, see `docs/PAYMENT-SYSTEM.md` and `docs/PAYMENT-IMPLEMENTATION-PLAN.md`.**
