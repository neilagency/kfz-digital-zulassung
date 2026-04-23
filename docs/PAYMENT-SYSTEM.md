# 📋 Payment System – Complete Documentation

> **Purpose**: Full documentation of the payment system for replication in a new project (Project B).
> **Generated from**: Actual source code analysis (not assumptions).
> **Project**: Online Auto Abmelden (onlineautoabmelden.com) – Next.js + Prisma + SQLite/Turso

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Summary](#2-architecture-summary)
3. [Payment Method 1: Credit Card (Mollie)](#3-payment-method-1-credit-card-via-mollie)
4. [Payment Method 2: Apple Pay (Mollie)](#4-payment-method-2-apple-pay-via-mollie)
5. [Payment Method 3: Klarna (Mollie Orders API)](#5-payment-method-3-klarna-via-mollie-orders-api)
6. [Payment Method 4: PayPal (Direct REST API v2)](#6-payment-method-4-paypal-direct-rest-api-v2)
7. [Payment Method 5: SEPA Bank Transfer (No Provider)](#7-payment-method-5-sepa-bank-transfer-no-provider)
8. [Special Case: Free Order (100% Coupon)](#8-special-case-free-order-100-coupon)
9. [Coupon / Discount System](#9-coupon--discount-system)
10. [Order System](#10-order-system)
11. [Invoice System](#11-invoice-system)
12. [Refund System](#12-refund-system)
13. [Admin Dashboard](#13-admin-dashboard)
14. [Database Schema](#14-database-schema)
15. [Environment Variables](#15-environment-variables)
16. [Complete File Index](#16-complete-file-index)
17. [Edge Cases & Important Notes](#17-edge-cases--important-notes)

---

## 1. System Overview

### Payment Providers
| Provider | Payment Methods | Integration Type |
|----------|----------------|------------------|
| **Mollie** | Credit Card, Apple Pay, Klarna | API (Payments API + Orders API for Klarna) |
| **PayPal** | PayPal | Direct REST API v2 (no Mollie middleman) |
| **None** | SEPA Bank Transfer | No provider – manual bank transfer |

### Gateway ID Mapping
The system uses two ID systems:
- **DB Gateway ID** (stored in `PaymentGateway.gatewayId`): `mollie_creditcard`, `mollie_applepay`, `mollie_klarna`, `paypal`, `sepa`
- **Checkout ID** (used in frontend & API): `credit_card`, `apple_pay`, `klarna`, `paypal`, `sepa`

```typescript
// Mapping: DB gatewayId → checkout ID
const GATEWAY_ID_MAP = {
  mollie_creditcard: 'credit_card',
  mollie_applepay: 'apple_pay',
  mollie_klarna: 'klarna',
  paypal: 'paypal',
  sepa: 'sepa',
};

// Mollie method mapping: checkout ID → Mollie SDK enum
const MOLLIE_METHOD_MAP = {
  paypal: PaymentMethod.paypal,
  credit_card: PaymentMethod.creditcard,
  apple_pay: PaymentMethod.applepay,
  sepa: PaymentMethod.banktransfer,
  klarna: PaymentMethod.klarna,
};
```

---

## 2. Architecture Summary

### Common Checkout Flow (All Methods)

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (CheckoutForm.tsx)                                 │
│                                                              │
│ 1. User fills form (phone, email, payment method)           │
│ 2. Klarna: additional fields (name, address, postcode, city)│
│ 3. Other methods: just nameOrCompany + phone + email        │
│ 4. Optional: apply coupon code                              │
│ 5. Accept AGB → Submit                                      │
│                                                              │
│ POST /api/checkout/direct                                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│ BACKEND (checkout/direct/route.ts)                           │
│                                                              │
│ 1. Rate limit (8/min per IP)                                │
│ 2. Zod validation (checkoutDirectSchema)                    │
│ 3. Verify payment method is valid                           │
│ 4. BATCH 1 (parallel):                                      │
│    - Get gateway config (fee, label) from DB                │
│    - Get product price from DB (server-side validation)     │
│    - Get max order number                                   │
│    - Get last invoice number                                │
│ 5. Coupon validation (if provided)                          │
│ 6. Calculate: total = product - discount + fee              │
│ 7. Customer upsert                                          │
│ 8. Create Order (with retry for race conditions)            │
│ 9. Record coupon usage                                      │
│ 10. BATCH 3 (parallel):                                     │
│     - Create OrderItems                                     │
│     - Create Payment record (status: pending)               │
│ 11. Create Invoice (with retry for race conditions)         │
│ 12. Route to payment provider:                              │
│     - SEPA → return invoiceUrl                              │
│     - PayPal → create PayPal order → return paymentUrl      │
│     - Mollie (CC/Apple Pay) → create payment → paymentUrl   │
│     - Mollie Klarna → create order → paymentUrl             │
│     - Free (coupon 100%) → mark paid → return invoiceUrl    │
└─────────────────────────────────────────────────────────────┘
```

### Price Calculation Logic
```
productPrice = DB product price (server validated)
paymentFee   = gateway fee from PaymentGateway table
discount     = coupon calculation (percentage or fixed)
total        = max(productPrice - discount + paymentFee, 0)
taxAmount    = total - (total / 1.19)  // German 19% MwSt included
```

**CRITICAL**: Price is ALWAYS validated server-side from the database. Client-sent price is only used if it's >= DB price (allows custom pricing but prevents underpayment).

---

## 3. Payment Method 1: Credit Card (via Mollie)

### 3.1 Payment Flow
```
1. User selects "Kredit- und Debitkarte" in checkout form
2. Frontend sends POST /api/checkout/direct with paymentMethod: "credit_card"
3. Backend creates Order + Payment + Invoice in DB
4. Backend calls createMolliePayment() → Mollie Payments API
5. Mollie returns checkoutUrl → user redirected to Mollie page
6. User enters card details on Mollie's hosted page
7. Payment processed:
   ├── Success → Mollie redirects to /api/payment/callback?orderId=xxx
   │             Mollie calls POST /api/payment/webhook with {id: "tr_xxx"}
   │             → Order status: pending → processing
   │             → Payment status: pending → paid
   │             → Invoice email sent
   │             → User redirected to /bestellung-erfolgreich
   ├── Failed  → Callback checks status → /zahlung-fehlgeschlagen
   └── Cancelled/Expired → /zahlung-fehlgeschlagen
```

### 3.2 Order States
| Status | Trigger | Condition |
|--------|---------|-----------|
| `pending` | Order created | Initial state at checkout |
| `processing` | Webhook/callback: Mollie status = `paid` | Payment confirmed |
| `cancelled` | Webhook: Mollie status = `failed`/`canceled`/`expired` | Payment failed |
| `on-hold` | Mollie create fails | Payment gateway error |
| `completed` | Admin manual action | Admin marks as done |
| `refunded` | Admin initiates refund | Full refund via Mollie API |

### 3.3 Integration Details
- **Type**: Redirect (Mollie hosted payment page)
- **Mollie API**: Payments API (`mollie.payments.create()`)
- **Transaction ID format**: `tr_xxxxxxxx`
- **Webhook**: `POST /api/payment/webhook` (Mollie sends form data with `id` field)
- **Callback**: `GET /api/payment/callback?orderId=xxx` (user redirect after payment)
- **Fallback**: If specific method (creditcard) is not enabled in Mollie profile, retries without method → Mollie shows its own selection page
- **Test mode**: When `MOLLIE_API_KEY` starts with `test_`, method is omitted and webhook URL is not set
- **Payment fee**: 0.50 € (configurable via PaymentGateway table)
- **Webhook URL**: Only sent in live mode (Mollie requires publicly accessible URL)

### 3.4 Mollie Payment Parameters
```typescript
{
  amount: { currency: 'EUR', value: '20.20' },
  description: 'Bestellung #1234 – Fahrzeugabmeldung',
  redirectUrl: 'https://site.com/api/payment/callback?orderId=xxx',
  webhookUrl: 'https://site.com/api/payment/webhook', // live only
  method: 'creditcard', // live only, omitted in test mode
  metadata: { orderId, orderNumber, email, productId },
  locale: 'de_DE',
  billingAddress: { // optional, sent if available
    givenName, familyName, email,
    streetAndNumber, postalCode, city, country: 'DE'
  }
}
```

### 3.5 Files
| File | Role |
|------|------|
| `src/app/api/checkout/direct/route.ts` | Main checkout (lines routing to Mollie) |
| `src/lib/payments.ts` | `createMolliePayment()`, `getMolliePaymentStatus()` |
| `src/app/api/payment/webhook/route.ts` | Mollie webhook handler |
| `src/app/api/payment/callback/route.ts` | User redirect handler |
| `src/components/CheckoutForm.tsx` | Frontend form |
| `src/components/checkout/PaymentMethodSelector.tsx` | Payment method UI |

### 3.6 Important Notes
- Webhook and callback BOTH update order status — deduplication happens via status check (`order.status !== 'processing'`)
- Webhook always returns 200 (even on error) — Mollie treats non-2xx as "unreachable" and blocks payment creation
- Invoice email is triggered from BOTH webhook and callback (deduplication via in-memory `triggeredOrders` Set)

---

## 4. Payment Method 2: Apple Pay (via Mollie)

### 4.1 Payment Flow
Identical to Credit Card, except:
- `paymentMethod: "apple_pay"`
- Mollie method: `PaymentMethod.applepay`
- Apple Pay is **only shown** when `ApplePaySession.canMakePayments()` returns true (Safari on Apple devices)

### 4.2 Frontend Apple Pay Detection
```typescript
// In CheckoutForm.tsx
useEffect(() => {
  if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
    setApplePayAvailable(true);
  } else {
    setApplePayAvailable(false);
  }
}, []);

// Filter: hide Apple Pay if not available
const PAYMENT_METHODS = ALL_PAYMENT_METHODS.filter(
  (m) => !(m.id === 'apple_pay' && applePayAvailable === false)
);
```

### 4.3 Differences from Credit Card
- No payment fee (0.00 €)
- Requires `APPLE_PAY_DOMAIN_ASSOCIATION` env var for domain verification
- Apple Pay button is displayed with "Apple Pay" brand text
- Same webhook/callback/invoice flow as credit card

### 4.4 Files
Same as Credit Card — no additional files needed.

---

## 5. Payment Method 3: Klarna (via Mollie Orders API)

### 5.1 Payment Flow
```
1. User selects "Klarna" in checkout form
2. ADDITIONAL fields appear: firstName, lastName, street, postcode, city, email
   (Klarna REQUIRES full billing address — other methods don't)
3. Frontend validates all Klarna-specific fields
4. POST /api/checkout/direct with paymentMethod: "klarna"
5. Backend creates Order + Payment + Invoice
6. Backend calls createMollieOrder() (NOT createMolliePayment!)
   → Uses Mollie ORDERS API (required for Klarna)
   → Sends individual line items with VAT
7. Mollie returns checkoutUrl → user redirected to Klarna page
8. User completes Klarna flow (pay now/later/installments)
9. Klarna authorizes payment:
   ├── Webhook receives ord_xxx (Mollie Order ID)
   │   Status mapping:
   │   - 'authorized' → orderStatus: processing, paymentStatus: paid
   │   - 'paid' → same
   │   - 'completed' → same
   │   - 'canceled'/'expired'/'failed' → cancelled
   └── Callback checks status (same as above)
```

### 5.2 Key Difference: Mollie Orders API
Klarna requires the **Mollie Orders API** (not Payments API) because Klarna needs:
- Individual line items with names, prices, and VAT
- Full billing address
- Order number

```typescript
// Order lines structure
const lines = [
  {
    name: 'Fahrzeugabmeldung',
    quantity: 1,
    unitPrice: { currency: 'EUR', value: '19.70' },
    totalAmount: { currency: 'EUR', value: '19.70' },
    vatRate: '19.00',
    vatAmount: { currency: 'EUR', value: '3.05' },
  },
  // Optional: payment fee line
  // Optional: discount line (negative amount)
];
```

### 5.3 Transaction ID Format
- Mollie Order ID: `ord_xxxxxxxx` (vs `tr_xxxxxxxx` for payments)
- The webhook handler detects Klarna by checking `mollieId.startsWith('ord_')`
- Uses `getMollieOrderStatus()` instead of `getMolliePaymentStatus()`

### 5.4 Klarna-Specific Status Mapping
| Mollie Order Status | Our Order Status | Our Payment Status |
|---------------------|------------------|--------------------|
| `authorized` | `processing` | `paid` |
| `paid` | `processing` | `paid` |
| `completed` | `processing` | `paid` |
| `canceled` | `cancelled` | `cancelled` |
| `expired` | `cancelled` | `expired` |
| `failed` | `cancelled` | `failed` |
| `created` / `pending` | `pending` | `pending` |

### 5.5 Frontend Validation (Klarna Only)
```typescript
// checkoutSchema uses .superRefine() — if paymentMethod === 'klarna':
// - firstName: required
// - lastName: required
// - street: required
// - postcode: required (must be 5 digits)
// - city: required
// Other methods only require: nameOrCompany + phone + email
```

### 5.6 Files
| File | Role |
|------|------|
| `src/lib/payments.ts` | `createMollieOrder()`, `getMollieOrderStatus()` |
| `src/components/checkout/PaymentMethodSelector.tsx` | Extra form fields for Klarna |
| Same webhook/callback/checkout routes | Same handlers with ord_ detection |

### 5.7 Important Notes
- Klarna `authorized` status means **payment is guaranteed** by Klarna — treat as paid
- Discount line items are sent as **negative amounts** to Mollie
- Billing address is required (Mollie fills `Kunde` / `-` / `00000` as defaults if empty)

---

## 6. Payment Method 4: PayPal (Direct REST API v2)

### 6.1 Payment Flow
```
1. User selects "PayPal" in checkout form
2. POST /api/checkout/direct with paymentMethod: "paypal"
3. Backend creates Order + Payment + Invoice
4. Backend calls createPayPalOrder() → PayPal REST API v2
   → Creates PayPal order with purchase_units
   → PayPal returns approval URL
5. Payment.transactionId = PayPal Order ID (before capture)
6. User redirected to PayPal approval page
7. User approves on PayPal
8. PayPal redirects to:
   GET /api/payment/paypal/capture?orderId=xxx&token=yyy
9. Backend calls capturePayPalOrder(paypalOrderId)
10. Capture result:
    ├── COMPLETED:
    │   → Order status: pending → processing
    │   → Payment.transactionId updated to captureId
    │   → Payment.providerData = { paypalOrderId, captureId, payerEmail }
    │   → Invoice email sent
    │   → Redirect to /bestellung-erfolgreich
    └── Failed:
        → Order note created
        → Redirect to /zahlung-fehlgeschlagen
11. PayPal webhook (safety net):
    POST /api/payment/paypal/webhook
    → Handles: PAYMENT.CAPTURE.COMPLETED, DENIED, REFUNDED
    → Only updates if not already processed
```

### 6.2 PayPal API Details
```typescript
// Create Order
POST https://api-m.paypal.com/v2/checkout/orders
{
  intent: 'CAPTURE',
  purchase_units: [{
    reference_id: orderId,
    description: 'Bestellung #1234 – Fahrzeugabmeldung',
    amount: { currency_code: 'EUR', value: '19.70' },
    custom_id: orderId,        // used to find order in webhook
    invoice_id: 'ORD-1234',
  }],
  payment_source: {
    paypal: {
      experience_context: {
        brand_name: 'Online Auto Abmelden',
        locale: 'de-DE',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: 'https://site.com/api/payment/paypal/capture?orderId=xxx',
        cancel_url: 'https://site.com/rechnung?error=payment-cancelled&order=1234',
      }
    }
  }
}

// Capture Order  
POST https://api-m.paypal.com/v2/checkout/orders/{paypalOrderId}/capture

// Refund Capture
POST https://api-m.paypal.com/v2/payments/captures/{captureId}/refund
```

### 6.3 Authentication
- OAuth2 Client Credentials flow
- Token cached in memory with 60s safety margin before expiry
- `PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET` → Base64 → Basic Auth → `/v1/oauth2/token`

### 6.4 PayPal Webhook Events
| Event | Handler Action |
|-------|---------------|
| `PAYMENT.CAPTURE.COMPLETED` | Mark order processing, payment paid, trigger invoice email |
| `PAYMENT.CAPTURE.DENIED` | Mark order cancelled, payment failed |
| `PAYMENT.CAPTURE.REFUNDED` | Mark order refunded, payment refunded |

### 6.5 Dual Safety: Capture Callback + Webhook
- **Primary flow**: User returns → capture callback captures payment + updates DB
- **Safety net**: PayPal webhook fires async → only updates if not already processed
- Both check `order.status !== 'processing'` before updating

### 6.6 Files
| File | Role |
|------|------|
| `src/lib/paypal.ts` | `createPayPalOrder()`, `capturePayPalOrder()`, `refundPayPalCapture()`, `getPayPalCaptureRefunds()` |
| `src/app/api/payment/paypal/capture/route.ts` | Capture callback (user redirect) |
| `src/app/api/payment/paypal/webhook/route.ts` | PayPal webhook handler |
| `src/app/api/checkout/direct/route.ts` | PayPal-specific branch in checkout |

### 6.7 Important Notes
- PayPal is **NOT** routed through Mollie — it uses direct PayPal REST API v2
- Transaction ID changes: initially PayPal Order ID, then updated to **Capture ID** after successful capture
- PayPal webhook always returns 200 (to prevent retries)
- Cancel URL sends user to `/rechnung?error=payment-cancelled`
- No payment fee (0.00 €)

---

## 7. Payment Method 5: SEPA Bank Transfer (No Provider)

### 7.1 Payment Flow
```
1. User selects "SEPA Überweisung" in checkout form
2. POST /api/checkout/direct with paymentMethod: "sepa"
3. Backend creates Order + Payment + Invoice
4. Order status set to "on-hold" (awaiting bank transfer)
5. Invoice email sent immediately (with bank details)
6. No payment redirect — frontend receives invoiceUrl
7. User redirected to invoice page
8. User transfers money manually to company bank account
9. Admin manually confirms payment in dashboard:
   → Order status: on-hold → processing → completed
```

### 7.2 Key Differences
- **No payment provider API call**
- **No webhook** — no automated payment confirmation
- **No redirect to external payment page**
- Order status starts as `on-hold` (not `pending`)
- Invoice is sent immediately (other methods send after payment confirmation)
- Admin must manually change order status after verifying bank transfer

### 7.3 Response Format
```json
{
  "success": true,
  "orderId": "xxx",
  "orderNumber": 1234,
  "total": "19.70",
  "invoiceNumber": "RE-2026-0001",
  "invoiceUrl": "/rechnung/RE-2026-0001?order=1234&token=xxx"
  // NOTE: no "paymentUrl" field — frontend uses invoiceUrl
}
```

### 7.4 Frontend Handling
```typescript
// In CheckoutForm.tsx onSubmit:
if (result.paymentUrl) {
  window.location.href = result.paymentUrl;  // Mollie/PayPal
} else if (result.invoiceUrl) {
  window.location.href = result.invoiceUrl;  // SEPA / Free order
}
```

### 7.5 Files
| File | Role |
|------|------|
| `src/app/api/checkout/direct/route.ts` | SEPA-specific branch (no payment API) |
| Invoice email system | Sends bank details to customer |

### 7.6 Important Notes
- No payment fee (0.00 €)
- No automated refund possible — admin must do manual bank transfer
- Payment record is created with `status: 'pending'` and never automatically updated
- The displayed description: "Bitte überweisen Sie den Gesamtbetrag auf unser Bankkonto"

---

## 8. Special Case: Free Order (100% Coupon)

### 8.1 Flow
```
1. User applies coupon that covers full product price + fee
2. total = max(productPrice - discountAmount + paymentFee, 0) → 0.00
3. Backend detects orderTotal <= 0
4. Skips ALL payment providers
5. Order status → processing (immediately)
6. Payment status → paid (with transactionId: "FREE-{COUPON_CODE}")
7. Invoice paymentStatus → paid
8. Invoice email sent immediately
9. User redirected to invoice page
```

### 8.2 Provider Data for Free Orders
```json
{
  "provider": "coupon",
  "couponCode": "WELCOME50",
  "discountAmount": 19.70,
  "note": "Full discount — no payment required"
}
```

---

## 9. Coupon / Discount System

### 9.1 Coupon Validation (Two-Step)

**Step 1: Frontend Preview** (`POST /api/apply-coupon`)
- Rate limited: 10 requests per minute per IP
- Validates: code exists, active, date range, usage limits, product restrictions, min order value
- Returns: `discountAmount`, `discountType`, `discountValue`
- Does NOT record usage — just preview

**Step 2: Server-Side Re-Validation** (in checkout route)
- Same validations repeated server-side at checkout time
- Records usage ONLY after order is successfully created

### 9.2 Discount Calculation
```typescript
if (coupon.discountType === 'percentage') {
  discountAmount = Math.round(productPrice * coupon.discountValue / 100 * 100) / 100;
} else { // 'fixed'
  discountAmount = Math.min(coupon.discountValue, productPrice);
}
// Discount cannot exceed subtotal
```

### 9.3 Coupon Usage Recording
```typescript
// After order creation:
await Promise.all([
  prisma.couponUsage.create({
    data: { couponId, email, orderId }
  }),
  prisma.coupon.update({
    where: { id: couponId },
    data: { usageCount: { increment: 1 } }
  }),
]);
```

### 9.4 Validation Rules
| Rule | Field | Behavior |
|------|-------|----------|
| Active check | `isActive` | Must be true |
| Date range | `startDate` / `endDate` | Must be within range |
| Total usage limit | `maxUsageTotal` | 0 = unlimited |
| Per-user limit | `maxUsagePerUser` | Checked via CouponUsage table (unique per email) |
| Product restriction | `productSlugs` | Comma-separated slugs, empty = applies to all |
| Min order value | `minOrderValue` | Product subtotal must be >= value |

### 9.5 Coupon Display
- Applied coupon stored in `sessionStorage` (key: `appliedCoupon`)
- Shown as a green line in OrderSummary: "Gutschein (CODE) -X.XX €"
- Coupon code stored on Order: `order.couponCode`
- Coupon discount stored: `order.discountAmount`

### 9.6 Admin Coupon Management
- `GET /api/admin/coupons` — list all coupons
- `POST /api/admin/coupons` — create new coupon
- `GET/PATCH/DELETE /api/admin/coupons/[id]` — manage single coupon
- Admin pages: `/admin/coupons` and `/admin/coupons/[id]`
- Support `showBanner` flag for site-wide promo banner

### 9.7 Files
| File | Role |
|------|------|
| `src/app/api/apply-coupon/route.ts` | Frontend coupon preview |
| `src/app/api/checkout/direct/route.ts` | Server-side re-validation + usage recording |
| `src/app/api/admin/coupons/route.ts` | Admin: list/create |
| `src/app/api/admin/coupons/[id]/route.ts` | Admin: get/update/delete |
| `src/components/checkout/OrderSummary.tsx` | Coupon input UI |

---

## 10. Order System

### 10.1 Order Creation
- Created in `POST /api/checkout/direct`
- `orderNumber` is auto-incremented (max existing + 1)
- Retry loop (5 attempts) for `orderNumber` unique constraint race conditions
- Customer is upserted by email (created if new, increments `totalOrders`/`totalSpent` if existing)

### 10.2 Order Status Flow
```
                           ┌── Mollie webhook: paid ──► processing ──► completed (admin)
                           │
pending ──► (payment) ─────┤── PayPal capture: COMPLETED ──► processing ──► completed
                           │
                           └── failed/cancelled/expired ──► cancelled

on-hold ◄── SEPA (immediate)     │── Admin marks paid ──► processing
        ◄── Mollie/PayPal error   │
                                  └── Admin marks completed ──► completed

any status ──► refunded (admin via refund API)
```

### 10.3 Order Data Structure
```typescript
{
  id: 'cuid',
  orderNumber: 1234,          // unique auto-increment
  status: 'pending',          // pending | processing | completed | cancelled | refunded | on-hold
  total: 20.20,
  subtotal: 19.70,            // product price only
  paymentFee: 0.50,
  discountAmount: 0,
  couponCode: '',
  currency: 'EUR',
  paymentMethod: 'credit_card', // checkout ID
  paymentTitle: 'Kredit- und Debitkarte', // display label
  transactionId: 'tr_xxx',
  billingEmail, billingPhone, billingFirst, billingLast,
  billingStreet, billingCity, billingPostcode,
  productName: 'Fahrzeugabmeldung',
  serviceData: '{"kennzeichen":"AB-CD-1234","fin":"..."}', // JSON string
  datePaid: DateTime,
  dateCompleted: DateTime,
  customerId: 'xxx',          // FK to Customer
}
```

### 10.4 Related Records Created at Checkout
1. **OrderItem(s)**: Product line item + optional payment fee line item
2. **Payment**: One record per order (status: pending → paid/failed)
3. **Invoice**: One record per order (invoiceNumber: RE-YYYY-NNNN)
4. **CouponUsage**: If coupon was used

### 10.5 OrderNote (Audit Trail)
System automatically creates notes for:
- Mollie payment status changes: "Mollie Zahlung paid: tr_xxx (creditcard)"
- PayPal capture success: "PayPal-Zahlung erfolgreich. Capture ID: xxx"
- Payment failures with reason
- Refund completion with details

---

## 11. Invoice System

### 11.1 Invoice Creation
- Created during checkout (same transaction as Order)
- Invoice number format: `RE-YYYY-NNNN` (e.g. `RE-2026-0001`)
- Auto-incremented per year, with retry for unique constraint
- Snapshots billing info from order at creation time

### 11.2 Invoice Email Trigger
```
Payment flow → triggerInvoiceEmail(orderId)
                   │
                   ├── Deduplication: in-memory Set (5 min TTL)
                   │   prevents webhook + callback double-send
                   │
                   └── generateAndSendInvoice(orderId)
                           │
                           ├── Load order + items + payments + invoice from DB
                           ├── Generate PDF using jsPDF (no browser/Chromium)
                           └── Send email with PDF attachment
```

### 11.3 Invoice PDF Generation
- Uses **jsPDF** library (lightweight, server-side compatible)
- A4 format, German locale
- Contains:
  - Company header (iKFZ Digital Zulassung UG)
  - Invoice number, date, order number
  - Customer billing address
  - Payment method and status
  - Line items table (product, fee, discount)
  - Net amount, 19% MwSt, total
  - Service details (Kennzeichen, FIN, etc.)
  - Footer with company details and bank info

### 11.4 Invoice Status
| Status | When Set |
|--------|----------|
| `pending` | Created at checkout |
| `paid` | Webhook/callback confirms payment |
| `refunded` | Admin initiates refund |
| `partially_refunded` | Admin partial refund |

### 11.5 Admin Invoice Features
- List all invoices: `GET /api/admin/invoices`
- View invoice detail: `GET /api/admin/invoices/[id]/pdf`
- Resend invoice email: `POST /api/admin/orders/[id]/resend-invoice`
- Generate multiple invoices: `POST /api/admin/invoices/[id]/generate-all`

### 11.6 Files
| File | Role |
|------|------|
| `src/lib/invoice.ts` | `generateInvoicePDF()`, `generateAndSendInvoice()` |
| `src/lib/invoice-template.ts` | Invoice data type definition |
| `src/lib/trigger-invoice.ts` | Deduplication wrapper + email trigger |
| `src/app/api/send-invoice/route.ts` | Manual invoice send |
| `src/app/api/admin/invoices/route.ts` | Admin list |
| `src/app/api/admin/invoices/[id]/pdf/route.ts` | PDF generation |
| `src/app/api/admin/orders/[id]/resend-invoice/route.ts` | Resend |

---

## 12. Refund System

### 12.1 Refund Flow
```
Admin clicks "Refund" in order detail page
POST /api/admin/orders/[id]/refund { amount?: "10.00" }

1. Load order + payments
2. Auto-detect provider:
   - transactionId starts with 'tr_' → Mollie
   - gatewayId/method contains 'paypal' → PayPal
3. Determine amount (partial or full)
4. Call provider API:
   - Mollie: createMollieRefund(transactionId, amount, description)
   - PayPal: refundPayPalCapture(captureId, amount, note)
5. ONLY after provider confirms → update DB:
   - Order status → 'refunded' (full) or unchanged (partial)
   - Payment status → 'refunded' or 'partially_refunded'
   - Invoice status → same
   - OrderNote created with refund details
```

### 12.2 Provider Detection Logic
```typescript
function detectProvider(order, payments) {
  const paidPayment = payments.find(p => p.status === 'paid' && p.transactionId);
  if (paidPayment?.transactionId.startsWith('tr_')) return { provider: 'mollie', ... };
  if (paidPayment?.gatewayId === 'paypal') return { provider: 'paypal', ... };
  // Fallback to order.transactionId
  if (order.transactionId.startsWith('tr_')) return 'mollie';
  if (order.paymentMethod === 'paypal') return 'paypal';
  return null; // SEPA has no automated refund
}
```

### 12.3 Error Handling
Provider-specific error messages are translated to German:
- `already been refunded` → "Diese Zahlung wurde bereits vollständig erstattet"
- `CAPTURE_FULLY_REFUNDED` → "Diese PayPal-Zahlung wurde bereits vollständig erstattet"
- `REFUND_AMOUNT_EXCEEDED` → "Der Erstattungsbetrag übersteigt den verfügbaren PayPal-Betrag"

### 12.4 Files
| File | Role |
|------|------|
| `src/app/api/admin/orders/[id]/refund/route.ts` | POST: refund, GET: refund history |
| `src/lib/payments.ts` | `createMollieRefund()`, `getMollieRefunds()` |
| `src/lib/paypal.ts` | `refundPayPalCapture()`, `getPayPalCaptureRefunds()` |

### 12.5 Important Notes
- SEPA orders cannot be refunded through the system (no provider API)
- DB is only updated AFTER provider confirms refund (not before)
- Both full and partial refunds are supported
- €0 orders skip provider API call

---

## 13. Admin Dashboard

### 13.1 Orders Management
- **List**: `/admin/orders` — paginated, searchable, filterable by status/date
- **Detail**: `/admin/orders/[id]` — full order view with:
  - Order info, status management
  - Payment details
  - Document upload (PDF only)
  - Customer communication (messages with attachments)
  - Order notes (audit trail)
  - Refund button (auto-detects Mollie/PayPal)
  - Resend invoice button

### 13.2 Status Changes
- Admin can change order status via `PATCH /api/admin/orders/[id]`
- Manual status changes available: pending → processing → completed → refunded
- SEPA: Admin must manually confirm payment and change status

### 13.3 Payment Gateway Management
- Page: `/admin/payments`
- `GET /api/admin/payments` — list all gateway configs + payment stats
- `PUT /api/admin/payments` — update gateway config (enable/disable, change fee, etc.)
- Debug endpoint: `GET /api/admin/payments/debug` — health check, payment status lookup

### 13.4 Coupon Management
- Page: `/admin/coupons` — list, create, edit, delete
- Full CRUD via API routes

### 13.5 Invoice Management
- Page: `/admin/invoices` — list all invoices
- PDF generation and email resend from order detail page

---

## 14. Database Schema

### 14.1 Core Models

#### Order
```prisma
model Order {
  id              String    @id @default(cuid())
  orderNumber     Int       @unique
  status          String    @default("pending")
  total           Float     @default(0)
  subtotal        Float     @default(0)
  paymentFee      Float     @default(0)
  discountAmount  Float     @default(0)
  couponCode      String    @default("")
  currency        String    @default("EUR")
  paymentMethod   String    @default("")
  paymentTitle    String    @default("")
  transactionId   String    @default("")
  billingEmail    String    @default("")
  billingPhone    String    @default("")
  billingFirst    String    @default("")
  billingLast     String    @default("")
  billingStreet   String    @default("")
  billingCity     String    @default("")
  billingPostcode String    @default("")
  serviceData     String    @default("{}")
  productName     String    @default("")
  customerId      String?
  datePaid        DateTime?
  dateCompleted   DateTime?
  completionEmailSent Boolean @default(false)
  deletedAt       DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  // Relations: items[], notes[], payments[], invoices[], documents[], messages[]
}
```

#### Payment
```prisma
model Payment {
  id            String    @id @default(cuid())
  orderId       String
  gatewayId     String    // mollie_creditcard | mollie_applepay | mollie_klarna | paypal | sepa
  transactionId String    @default("")  // tr_xxx | ord_xxx | captureId | FREE-CODE
  amount        Float
  currency      String    @default("EUR")
  status        String    @default("pending")
  method        String    @default("")  // display label
  providerData  String    @default("{}")  // full provider response JSON
  paidAt        DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### PaymentGateway
```prisma
model PaymentGateway {
  id          String   @id @default(cuid())
  gatewayId   String   @unique  // mollie_creditcard | mollie_applepay | mollie_klarna | paypal | sepa
  name        String            // Display name (e.g., "Kredit- und Debitkarte")
  description String   @default("")
  isEnabled   Boolean  @default(false)
  fee         Float    @default(0)
  apiKey      String   @default("")
  secretKey   String   @default("")
  mode        String   @default("live")
  icon        String   @default("")
  sortOrder   Int      @default(0)
  settings    String   @default("{}")
}
```

#### Invoice
```prisma
model Invoice {
  id              String    @id @default(cuid())
  invoiceNumber   String    @unique  // RE-YYYY-NNNN
  orderId         String
  customerId      String?
  billingName     String    @default("")
  billingEmail    String    @default("")
  billingAddress  String    @default("")
  billingCity     String    @default("")
  billingPostcode String    @default("")
  billingCountry  String    @default("DE")
  companyName     String    @default("")
  companyTaxId    String    @default("")
  items           String    @default("[]")  // JSON: [{name, quantity, price, total}]
  subtotal        Float     @default(0)
  taxRate         Float     @default(19)
  taxAmount       Float     @default(0)
  total           Float     @default(0)
  paymentMethod   String    @default("")
  paymentStatus   String    @default("pending")
  transactionId   String    @default("")
  pdfUrl          String    @default("")
  invoiceDate     DateTime  @default(now())
  dueDate         DateTime?
}
```

#### Coupon + CouponUsage
```prisma
model Coupon {
  id              String    @id @default(cuid())
  code            String    @unique   // uppercase
  description     String    @default("")
  discountType    String    @default("fixed")  // fixed | percentage
  discountValue   Float     @default(0)
  minOrderValue   Float     @default(0)
  maxUsageTotal   Int       @default(0)  // 0 = unlimited
  maxUsagePerUser Int       @default(1)
  usageCount      Int       @default(0)
  productSlugs    String    @default("")  // comma-separated, empty = all
  isActive        Boolean   @default(true)
  showBanner      Boolean   @default(false)
  bannerText      String    @default("")
  startDate       DateTime?
  endDate         DateTime?
  usages          CouponUsage[]
}

model CouponUsage {
  id        String   @id @default(cuid())
  couponId  String
  email     String
  orderId   String?
  createdAt DateTime @default(now())
  @@unique([couponId, email])  // one use per email per coupon
}
```

#### Supporting Models
```prisma
model OrderItem {
  id, orderId, productName, quantity, price, total
}

model OrderNote {
  id, orderId, note, author (system|admin), createdAt
}

model OrderMessage {
  id, orderId, message, attachments (JSON), sentBy, createdAt
}

model OrderDocument {
  id, orderId, fileName, fileUrl, fileSize, token (unique), createdAt
}

model Customer {
  id, email (unique), firstName, lastName, phone, city, postcode,
  address, street, country, totalOrders, totalSpent,
  emailSubscribed, unsubscribeToken
}
```

---

## 15. Environment Variables

### Required
```bash
# Mollie
MOLLIE_API_KEY=live_xxxxxxxxxx          # live_ or test_ prefix

# PayPal
PAYPAL_CLIENT_ID=xxxxxxxxxx
PAYPAL_CLIENT_SECRET=xxxxxxxxxx
PAYPAL_MODE=live                        # live | sandbox

# Site
SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Optional
```bash
# Apple Pay
APPLE_PAY_DOMAIN_ASSOCIATION=xxx        # Domain verification file content

# Debugging
PAYMENT_DEBUG=true                      # Enable verbose payment logging

# Database
TURSO_DATABASE_URL=libsql://xxx
TURSO_AUTH_TOKEN=xxx

# Email (for invoice sending)
SMTP_HOST=xxx
SMTP_PORT=465
SMTP_USER=xxx
SMTP_PASS=xxx
```

---

## 16. Complete File Index

### Core Payment Files
| File | Purpose |
|------|---------|
| `src/app/api/checkout/direct/route.ts` | **Main checkout endpoint** — all payment methods route through here |
| `src/lib/payments.ts` | Mollie client, `createMolliePayment()`, `createMollieOrder()`, `getMolliePaymentStatus()`, `getMollieOrderStatus()`, `createMollieRefund()`, `getMollieRefunds()` |
| `src/lib/paypal.ts` | PayPal REST API v2: `createPayPalOrder()`, `capturePayPalOrder()`, `refundPayPalCapture()`, `getPayPalCaptureRefunds()` |
| `src/lib/db.ts` | Gateway ID mapping, `getEnabledPaymentMethods()`, `getPaymentGatewayByCheckoutId()` |

### Webhook & Callback Files
| File | Purpose |
|------|---------|
| `src/app/api/payment/webhook/route.ts` | Mollie webhook (handles `tr_` and `ord_` IDs) |
| `src/app/api/payment/callback/route.ts` | Mollie redirect callback |
| `src/app/api/payment/paypal/capture/route.ts` | PayPal capture callback |
| `src/app/api/payment/paypal/webhook/route.ts` | PayPal webhook (IPN) |

### Invoice Files
| File | Purpose |
|------|---------|
| `src/lib/invoice.ts` | PDF generation + email sending |
| `src/lib/invoice-template.ts` | InvoiceData type definition |
| `src/lib/trigger-invoice.ts` | Deduplication + trigger |
| `src/app/api/send-invoice/route.ts` | Manual invoice send endpoint |

### Frontend Files
| File | Purpose |
|------|---------|
| `src/components/CheckoutForm.tsx` | Main checkout form with validation |
| `src/components/checkout/PaymentMethodSelector.tsx` | Payment method cards with Klarna extra fields |
| `src/components/checkout/OrderSummary.tsx` | Order total + coupon input + submit |

### Admin Files
| File | Purpose |
|------|---------|
| `src/app/api/admin/orders/route.ts` | List orders |
| `src/app/api/admin/orders/[id]/route.ts` | Get/update/delete order |
| `src/app/api/admin/orders/[id]/refund/route.ts` | Refund via Mollie/PayPal |
| `src/app/api/admin/orders/[id]/documents/route.ts` | Document upload/download |
| `src/app/api/admin/orders/[id]/messages/route.ts` | Customer communication |
| `src/app/api/admin/orders/[id]/resend-invoice/route.ts` | Resend invoice email |
| `src/app/api/admin/payments/route.ts` | Gateway config management |
| `src/app/api/admin/payments/debug/route.ts` | Payment debug/health check |
| `src/app/api/admin/coupons/route.ts` | Coupon CRUD |
| `src/app/api/admin/coupons/[id]/route.ts` | Single coupon management |
| `src/app/api/admin/invoices/route.ts` | Invoice list |
| `src/app/api/admin/invoices/[id]/pdf/route.ts` | Invoice PDF render |

### Utility Files
| File | Purpose |
|------|---------|
| `src/lib/validations.ts` | Zod schemas (`checkoutDirectSchema`) |
| `src/lib/rate-limit.ts` | Rate limiter (checkout: 8/min, coupon: 10/min) |
| `src/lib/payment-logger.ts` | Structured payment debugging logs |
| `prisma/schema.prisma` | Database schema |

### Admin Dashboard Pages
| File | Purpose |
|------|---------|
| `src/app/admin/(dashboard)/orders/page.tsx` | Orders list |
| `src/app/admin/(dashboard)/orders/[id]/page.tsx` | Order detail |
| `src/app/admin/(dashboard)/payments/page.tsx` | Payment gateways |
| `src/app/admin/(dashboard)/coupons/page.tsx` | Coupon list |
| `src/app/admin/(dashboard)/coupons/[id]/page.tsx` | Coupon edit |
| `src/app/admin/(dashboard)/invoices/page.tsx` | Invoice list |
| `src/app/admin/(dashboard)/invoices/[id]/page.tsx` | Invoice detail |

---

## 17. Edge Cases & Important Notes

### 17.1 Race Conditions
- **Order number**: Retry loop (5 attempts) for `orderNumber` unique constraint conflicts
- **Invoice number**: Retry loop (5 attempts) for `invoiceNumber` unique constraint conflicts
- **Invoice email**: In-memory `Set` prevents double-send from webhook + callback race

### 17.2 Mollie Fallback
If a specific Mollie method (e.g., `creditcard`) is not enabled in the Mollie profile, the system:
1. Catches the error
2. Retries WITHOUT specifying a method
3. Mollie shows its own method selection page
4. This prevents complete checkout failure

### 17.3 Mollie Test Mode
When `MOLLIE_API_KEY` starts with `test_`:
- Method is omitted (Mollie shows all test methods)
- Webhook URL is NOT set (Mollie can't call localhost)
- Callback still works (handles status check inline)

### 17.4 SEPA Manual Process
- No automated payment verification
- Admin must check bank account for incoming transfer
- Admin manually changes status: on-hold → processing → completed
- No automated refund for SEPA

### 17.5 Product Price Security
- Price is ALWAYS validated server-side from `Product` table
- Client price is accepted ONLY if it's >= DB price
- This prevents underpayment while allowing custom (higher) pricing

### 17.6 Coupon + Payment Fee Interaction
```
total = max(productPrice - discountAmount + paymentFee, 0)
```
- Discount applies to product price, NOT to the fee
- If discount >= product price, fee may still apply (unless total ≤ 0)
- Free orders (total ≤ 0) skip all payment gateways

### 17.7 Service Data
- Stored as JSON string on Order (`serviceData` field)
- Contains customer's service-specific input (Kennzeichen, FIN, etc.)
- Included in invoice PDF as "AUFTRAGSDETAILS"
- Passed from frontend via `sessionStorage` → checkout form → API

### 17.8 Webhook Security
- Mollie webhook: Always returns 200 (prevents Mollie from marking URL as unreachable)
- PayPal webhook: Always returns 200 (prevents PayPal retries)
- No webhook signature verification currently implemented (potential improvement)

### 17.9 In-Memory Caching
- Gateway config: 5-minute TTL in-memory cache
- Product config: 5-minute TTL in-memory cache
- PayPal access token: cached until expiry - 60 seconds
- Invoice deduplication: 5-minute TTL in Set

### 17.10 Dependencies (npm packages)
- `@mollie/api-client` — Mollie SDK
- `jspdf` — PDF generation (invoice)
- `zod` — Input validation
- `react-hook-form` — Frontend form management
- `@hookform/resolvers` — Zod ↔ react-hook-form integration
- `lucide-react` — Icons
- `prisma` / `@prisma/client` — Database ORM

---

## Replication Checklist for Project B

1. **Database**: Create all models (Order, Payment, PaymentGateway, Invoice, Coupon, CouponUsage, OrderItem, OrderNote, Customer, OrderDocument, OrderMessage)
2. **Seed PaymentGateway**: Insert 5 gateway records (mollie_creditcard, mollie_applepay, mollie_klarna, paypal, sepa)
3. **Seed Products**: Create products with prices
4. **Environment**: Set all required env vars (Mollie, PayPal, SMTP, Site URL)
5. **Mollie Dashboard**: Enable desired methods, set webhook URL
6. **PayPal Dashboard**: Create app, set webhook URL, subscribe to PAYMENT.CAPTURE.* events
7. **Apple Pay**: Domain verification file at `/.well-known/apple-developer-merchantid-domain-association`
8. **Copy files**: All files listed in Section 16
9. **Install packages**: `@mollie/api-client`, `jspdf`, `zod`, `react-hook-form`, `@hookform/resolvers`
10. **Test**: Each payment method individually, webhook delivery, invoice email, coupon flow
