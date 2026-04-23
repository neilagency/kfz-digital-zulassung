# 🚀 Payment System – Implementation Plan (Project B)

> **Purpose**: Step-by-step execution plan to build the payment system in a new Next.js project.
> **Reference**: `docs/PAYMENT-SYSTEM.md` (full documentation)
> **Approach**: Phased, dependency-ordered, with Minimum Viable System first.

---

## Table of Contents

1. [Module Breakdown](#1-module-breakdown)
2. [Dependency Graph](#2-dependency-graph)
3. [Phase 1: Core (MVP)](#3-phase-1-core--mvp)
4. [Phase 2: Mollie (Credit Card + Apple Pay)](#4-phase-2-mollie-credit-card--apple-pay)
5. [Phase 3: PayPal](#5-phase-3-paypal)
6. [Phase 4: Klarna](#6-phase-4-klarna)
7. [Phase 5: Coupons & Discounts](#7-phase-5-coupons--discounts)
8. [Minimum Viable Payment System](#8-minimum-viable-payment-system)
9. [Risks & Mitigations](#9-risks--mitigations)
10. [Testing Checklist](#10-testing-checklist)

---

## 1. Module Breakdown

| Module | Scope | Dependencies |
|--------|-------|--------------|
| **M1: Database Schema** | All Prisma models, migrations, seed data | None |
| **M2: Order System** | Order creation, status management, order items, order notes | M1 |
| **M3: Invoice System** | Invoice creation, PDF generation (jsPDF), email sending | M1, M2 |
| **M4: Payment Core** | Payment record management, gateway config, rate limiting, validation | M1, M2 |
| **M5: SEPA Flow** | Bank transfer (no provider), on-hold status, manual confirmation | M2, M3, M4 |
| **M6: Checkout API** | Single checkout endpoint, price calculation, provider routing | M2, M3, M4 |
| **M7: Checkout UI** | CheckoutForm, PaymentMethodSelector, OrderSummary | M6 |
| **M8: Mollie Integration** | Mollie SDK, payment creation, webhook, callback | M4, M6 |
| **M9: PayPal Integration** | PayPal REST API v2, capture, webhook | M4, M6 |
| **M10: Klarna Integration** | Mollie Orders API, line items, extra form fields | M8 |
| **M11: Coupon System** | Coupon CRUD, validation, usage tracking, discount calculation | M2, M6 |
| **M12: Refund System** | Mollie refund, PayPal refund, provider auto-detection | M8, M9 |
| **M13: Admin Dashboard** | Orders list/detail, payments config, invoices, coupons UI | M2-M12 |

---

## 2. Dependency Graph

```
M1 (Database)
 ├── M2 (Orders)
 │    ├── M3 (Invoices)
 │    │    └── M5 (SEPA) ←── [Phase 1 MVP done here]
 │    └── M4 (Payment Core)
 │         └── M6 (Checkout API)
 │              ├── M7 (Checkout UI)
 │              ├── M8 (Mollie) ←── [Phase 2 done here]
 │              │    └── M10 (Klarna) ←── [Phase 4]
 │              ├── M9 (PayPal) ←── [Phase 3 done here]
 │              └── M11 (Coupons) ←── [Phase 5]
 │
 └── M12 (Refunds) ←── needs M8 + M9 done
 └── M13 (Admin) ←── incremental, build alongside each phase
```

---

## 3. Phase 1: Core (MVP)

> **Goal**: Working checkout → order created → invoice generated → email sent → admin can view.
> **Payment**: SEPA only (no external provider needed).
> **End result**: User can complete a purchase, receive an invoice, admin sees the order.

---

### Step 1.1: Install Dependencies

**Goal**: Set up required npm packages.

```bash
npm install prisma @prisma/client zod jspdf react-hook-form @hookform/resolvers lucide-react
npm install -D prisma
```

**Notes**:
- `jspdf` is used server-side for invoice PDF generation (no Chromium needed)
- `zod` + `react-hook-form` + `@hookform/resolvers` for form validation
- `lucide-react` for icons in checkout UI

---

### Step 1.2: Create Database Schema

**Goal**: Define all Prisma models.
**Files to create**: `prisma/schema.prisma`

**Models to define** (in this order):

1. `Customer` — email (unique), name, phone, address, totalOrders, totalSpent
2. `Order` — orderNumber (unique Int), status, total, subtotal, paymentFee, discountAmount, couponCode, billing fields, serviceData (JSON string), relations to items/notes/payments/invoices/documents/messages
3. `OrderItem` — orderId FK, productName, quantity, price, total
4. `OrderNote` — orderId FK, note, author (system|admin)
5. `Payment` — orderId FK, gatewayId, transactionId, amount, status, method, providerData (JSON string)
6. `PaymentGateway` — gatewayId (unique), name, description, isEnabled, fee, apiKey, secretKey, mode, icon, sortOrder, settings (JSON string)
7. `Invoice` — invoiceNumber (unique, format RE-YYYY-NNNN), orderId FK, billing snapshot, items (JSON string), subtotal, taxRate (19), taxAmount, total, paymentMethod, paymentStatus
8. `Product` — slug (unique), name, price, isActive, formType
9. `Coupon` — code (unique, uppercase), discountType, discountValue, validation fields
10. `CouponUsage` — couponId FK, email, orderId, unique constraint (couponId, email)
11. `OrderMessage` — orderId FK, message, attachments, sentBy
12. `OrderDocument` — orderId FK, fileName, fileUrl, token (unique)

**Key indexes**: Order(status, billingEmail, createdAt, deletedAt), Payment(orderId, status), Invoice(orderId, invoiceNumber, paymentStatus)

**After creating schema**:
```bash
npx prisma migrate dev --name init
```

**Important**:
- Use `String @default("{}")` for JSON fields (Prisma SQLite doesn't have native JSON)
- Use `Float` for all money fields (not Decimal — SQLite limitation)
- Add `deletedAt DateTime?` on Order for soft delete support

---

### Step 1.3: Seed Payment Gateways + Products

**Goal**: Insert initial gateway configs and products.
**Files to create**: `prisma/seed.ts`

**Gateway seed data**:
```typescript
const gateways = [
  { gatewayId: 'sepa', name: 'SEPA Überweisung', description: 'Banküberweisung', isEnabled: true, fee: 0, sortOrder: 5, icon: '/images/payment/sepa.svg' },
  { gatewayId: 'mollie_creditcard', name: 'Kredit- und Debitkarte', description: 'Visa, Mastercard, AmEx', isEnabled: false, fee: 0.50, sortOrder: 3, icon: '/images/payment/card.svg' },
  { gatewayId: 'mollie_applepay', name: 'Apple Pay', description: 'Apple Pay', isEnabled: false, fee: 0, sortOrder: 2, icon: '/images/payment/applepay.svg' },
  { gatewayId: 'paypal', name: 'PayPal', description: 'PayPal', isEnabled: false, fee: 0, sortOrder: 1, icon: '/images/payment/paypal.svg' },
  { gatewayId: 'mollie_klarna', name: 'Klarna', description: 'Sofort, später, Raten', isEnabled: false, fee: 0, sortOrder: 4, icon: '/images/payment/klarna.svg' },
];
```

**Note**: Only `sepa` enabled initially. Enable others as you implement each phase.

**Product seed**: Insert your product(s) with name, slug, price.

---

### Step 1.4: Create Gateway ID Mapping Utilities

**Goal**: Bridge between DB gateway IDs and frontend checkout IDs.
**Files to create**: `src/lib/db.ts` (payment gateway section)

**Implement**:
```
GATEWAY_ID_MAP: { mollie_creditcard: 'credit_card', mollie_applepay: 'apple_pay', mollie_klarna: 'klarna', paypal: 'paypal', sepa: 'sepa' }
REVERSE_GATEWAY_MAP: inverse of above
getEnabledPaymentMethods(): query DB, return mapped IDs with labels/fees
getPaymentGatewayByCheckoutId(checkoutId): lookup gateway by checkout ID, return fee + label
```

**Depends on**: Step 1.2, 1.3

---

### Step 1.5: Create Validation Schemas

**Goal**: Shared Zod validation for checkout input.
**Files to create**: `src/lib/validations.ts`

**Implement `checkoutDirectSchema`**:
```typescript
z.object({
  firstName: z.string().max(100).optional().default(''),
  lastName: z.string().max(100).optional().default(''),
  company: z.string().max(200).optional().default(''),
  street: z.string().max(200).optional().default(''),
  postcode: z.string().max(10).optional().default(''),
  city: z.string().max(100).optional().default(''),
  phone: z.string().min(6).max(30).regex(/^[0-9+\-\s()]+$/),
  email: z.string().min(1).email().max(255),
  paymentMethod: z.string().min(1),
  productId: z.string().min(1).max(100).optional().default('abmeldung'),
  productPrice: z.string().optional(),
  serviceData: z.record(z.any()).optional().default({}),
  couponCode: z.string().max(50).optional().default(''),
})
```

**Also export**: `formatZodErrors()` helper for API error responses.

---

### Step 1.6: Create Rate Limiter

**Goal**: Prevent abuse of checkout and coupon endpoints.
**Files to create**: `src/lib/rate-limit.ts`

**Implement**:
- In-memory Map with IP keys, request count, and sliding window
- `rateLimit(key, { maxRequests, windowMs })` → `{ success, reset }`
- `getClientIP(request)` — extract IP from `x-forwarded-for` or `x-real-ip`
- Config: checkout = 8/min, coupon = 10/min

---

### Step 1.7: Create Payment Logger

**Goal**: Structured, traceable logging for all payment events.
**Files to create**: `src/lib/payment-logger.ts`

**Implement**:
- `paymentLog.checkoutStart()`, `.orderCreated()`, `.emailTriggered()`, etc.
- Each log: timestamp, tag, key-value context
- Debug mode via `PAYMENT_DEBUG=true` env var
- Format: `[TAG] message | orderId=xxx | amount=19.70`

**Note**: Optional but highly recommended — saves hours of debugging in production.

---

### Step 1.8: Build Invoice PDF Generator

**Goal**: Generate PDF invoice using jsPDF (server-side, no browser).
**Files to create**: `src/lib/invoice.ts`, `src/lib/invoice-template.ts`

**`invoice-template.ts`**: Define `InvoiceData` interface:
```typescript
interface InvoiceData {
  invoiceNumber, invoiceDate, orderNumber, orderDate,
  paymentMethod, paymentStatus, transactionId,
  customerName, customerEmail, customerPhone,
  customerStreet?, customerPostcode?, customerCity?,
  productName, serviceData, items[],
  subtotal, taxRate (19), taxAmount, total, paymentFee
}
```

**`invoice.ts`**: Implement:
1. `generateInvoicePDF(orderId)` — load order+invoice from DB, create jsPDF doc, return Buffer
2. `generateAndSendInvoice(orderId)` — generate PDF + send via email (SMTP)

**PDF layout** (A4):
- Header bar: company name, invoice number, date
- Customer address block + company address block
- Payment method + status bar
- Line items table (product, qty, price, total)
- Tax breakdown (net, 19% MwSt, total)
- Service details section
- Footer: company legal info + bank details

**Depends on**: Step 1.2

---

### Step 1.9: Create Invoice Email Trigger

**Goal**: Deduplication wrapper to prevent double email sends.
**Files to create**: `src/lib/trigger-invoice.ts`

**Implement**:
```typescript
const triggeredOrders = new Set<string>();

export async function triggerInvoiceEmail(orderId: string) {
  if (triggeredOrders.has(orderId)) return { success: true }; // skip duplicate
  triggeredOrders.add(orderId);
  setTimeout(() => triggeredOrders.delete(orderId), 5 * 60 * 1000); // 5 min TTL
  return generateAndSendInvoice(orderId);
}
```

**Why**: Webhook and callback can both fire for the same payment — this prevents double emails.

---

### Step 1.10: Build the Checkout API (SEPA Only first)

**Goal**: Single POST endpoint that creates order + payment + invoice.
**Files to create**: `src/app/api/checkout/direct/route.ts`

**Flow** (implement in this exact order inside the handler):

```
1. Rate limit check (8/min per IP)
2. Zod validate input
3. Verify paymentMethod is valid (for now, only 'sepa')
4. BATCH 1 (parallel queries):
   - getPaymentGatewayByCheckoutId(paymentMethod) → fee, label
   - Product.findUnique(slug) → server-side price
   - Order.findFirst(orderBy: orderNumber desc) → next order number
   - Invoice.findFirst(prefix match) → next invoice number
5. Validate gateway exists + product exists
6. Calculate: total = max(productPrice - 0 + fee, 0)
7. Customer upsert by email
8. Create Order (retry loop × 5 for orderNumber conflicts)
9. Link customer to order
10. BATCH 3 (parallel):
    - Create OrderItem(s)
    - Create Payment record (status: 'pending')
11. Create Invoice (retry loop × 5 for invoiceNumber conflicts)
12. SEPA branch:
    - Update order status → 'on-hold'
    - Send invoice email immediately
    - Return { success, orderId, orderNumber, total, invoiceNumber, invoiceUrl }
```

**Server-side price security**:
```typescript
let productPrice = dbProduct.price;
if (body.productPrice) {
  const clientPrice = parseFloat(body.productPrice);
  if (!isNaN(clientPrice) && clientPrice >= dbProduct.price) {
    productPrice = clientPrice; // allow higher, block lower
  }
}
```

**Response for SEPA** (NO `paymentUrl` field):
```json
{ "success": true, "orderId": "xxx", "orderNumber": 1234, "total": "19.70", "invoiceNumber": "RE-2026-0001", "invoiceUrl": "/rechnung/RE-2026-0001?order=1234&token=xxx" }
```

**Depends on**: Steps 1.2–1.9

---

### Step 1.11: Build Checkout UI

**Goal**: Frontend form with payment method selection and order summary.
**Files to create**:
- `src/components/CheckoutForm.tsx`
- `src/components/checkout/PaymentMethodSelector.tsx`
- `src/components/checkout/OrderSummary.tsx`

**CheckoutForm.tsx**:
- `react-hook-form` + `zodResolver`
- Validation schema with `superRefine` (Klarna needs extra fields — stub this for later)
- `onSubmit`: POST to `/api/checkout/direct`, handle `paymentUrl` vs `invoiceUrl`
- Payment method list: read from props or use defaults
- Apple Pay detection: `ApplePaySession.canMakePayments()` — hide if unavailable
- Service data from `sessionStorage`

**PaymentMethodSelector.tsx**:
- Radio button cards for each enabled method
- Shows fee, brand icon, description
- When selected: show billing fields (initially just nameOrCompany + phone + email)
- Klarna extra fields: stub with empty `<div>` for now

**OrderSummary.tsx**:
- Product name + price
- Subtotal, fee, discount (if any), total
- AGB checkbox + submit button
- Coupon input (stub for Phase 5)
- Trust badges (SSL, DSGVO, Sicher bezahlen)

**Frontend submit flow**:
```typescript
const result = await fetch('/api/checkout/direct', { method: 'POST', body: JSON.stringify({...}) });
if (result.paymentUrl) window.location.href = result.paymentUrl;     // Mollie/PayPal
else if (result.invoiceUrl) window.location.href = result.invoiceUrl; // SEPA/Free
```

**Depends on**: Step 1.10

---

### Step 1.12: Build Invoice Page

**Goal**: Page where user sees their invoice after SEPA checkout.
**Files to create**: Invoice display page (your routing)

**Content**: Display invoice number, order details, bank transfer instructions, PDF download link.

---

### Step 1.13: Build Admin — Orders List & Detail

**Goal**: Admin can see orders, change status, view details.
**Files to create**:
- `src/app/api/admin/orders/route.ts` — GET: paginated, searchable, filterable
- `src/app/api/admin/orders/[id]/route.ts` — GET/PATCH/DELETE
- Admin UI pages for list + detail

**PATCH behavior**: Update order status, add OrderNote for audit trail.
**Important for SEPA**: Admin needs to manually change `on-hold` → `processing` after verifying bank transfer.

---

### Step 1.14: Build Admin — Invoices

**Goal**: Admin can list invoices, view PDF, resend email.
**Files to create**:
- `src/app/api/admin/invoices/route.ts` — GET list
- `src/app/api/admin/invoices/[id]/pdf/route.ts` — GET PDF render
- `src/app/api/admin/orders/[id]/resend-invoice/route.ts` — POST resend

---

### ✅ Phase 1 Complete

At this point you have:
- Working checkout (SEPA only)
- Order + Invoice created in DB
- Invoice PDF generated + emailed
- Admin can view/manage orders and invoices
- **This is your MVP — a complete end-to-end payment flow.**

---

## 4. Phase 2: Mollie (Credit Card + Apple Pay)

> **Goal**: Add Mollie-powered card payments with redirect flow.
> **Depends on**: Phase 1 complete.

---

### Step 2.1: Install Mollie SDK

```bash
npm install @mollie/api-client
```

---

### Step 2.2: Create Mollie Integration Library

**Files to create**: `src/lib/payments.ts`

**Implement**:
1. Mollie client singleton: `getMollieClient()` — uses `MOLLIE_API_KEY` env var
2. `getMollieMethod(checkoutId)` — maps checkout ID → Mollie `PaymentMethod` enum
3. `createMolliePayment(payload)` — creates Mollie payment, returns `{ paymentId, checkoutUrl, status }`
4. `getMolliePaymentStatus(paymentId)` — fetches payment status from Mollie

**Mollie payment params**:
```typescript
{
  amount: { currency: 'EUR', value: '20.20' },
  description: `Bestellung #${orderNumber} – ${productName}`,
  redirectUrl: `${SITE_URL}/api/payment/callback?orderId=${orderId}`,
  webhookUrl: `${SITE_URL}/api/payment/webhook`,  // live mode only
  method: mollieMethod,  // live mode only
  metadata: { orderId, orderNumber, email, productId },
  locale: 'de_DE',
  billingAddress: { ... }  // optional
}
```

**Fallback logic**: If method is not enabled in Mollie profile → catch error → retry WITHOUT method → Mollie shows its own selection page.

**Test mode**: When `MOLLIE_API_KEY` starts with `test_`:
- Omit `method` parameter
- Omit `webhookUrl`

---

### Step 2.3: Create Mollie Webhook Handler

**Files to create**: `src/app/api/payment/webhook/route.ts`

**Implement**:
1. Parse form data → get `id` (Mollie payment/order ID)
2. Detect type: `tr_` = payment, `ord_` = order (Klarna, add in Phase 4)
3. Call `getMolliePaymentStatus(id)`
4. Map Mollie status → order status:
   - `paid` / `authorized` / `completed` → `processing` / `paid`
   - `failed` → `cancelled` / `failed`
   - `canceled` → `cancelled` / `cancelled`
   - `expired` → `cancelled` / `expired`
   - `open` / `pending` → `pending` / `pending`
5. Handle refund detection: check `amountRefunded.value > 0`
6. Update: Order status, Payment status + transactionId + providerData, Invoice paymentStatus
7. Create OrderNote
8. If paid → `triggerInvoiceEmail(orderId)`

**CRITICAL**: Always return `NextResponse.json({ success: true })` — even on errors. Mollie treats non-2xx as "unreachable" and blocks future payments.

---

### Step 2.4: Create Mollie Callback Handler

**Files to create**: `src/app/api/payment/callback/route.ts`

**Implement**:
1. Get `orderId` from query params
2. Load order + payments from DB
3. Check payment status via Mollie API (using `transactionId`)
4. If paid AND order not already processing → update DB (same as webhook)
5. Trigger invoice email
6. Redirect user:
   - Paid → `/bestellung-erfolgreich?order=${orderNumber}`
   - Failed/Cancelled → `/zahlung-fehlgeschlagen?order=${orderNumber}`
   - Pending → `/bestellung-erfolgreich?order=${orderNumber}&status=pending`

**Why both webhook AND callback?** Webhook may arrive before/after callback. Both can update DB — deduplication via status check (`order.status !== 'processing'`).

---

### Step 2.5: Add Mollie Branch to Checkout API

**Modify**: `src/app/api/checkout/direct/route.ts`

Add after SEPA branch:
```typescript
// Mollie Payment (credit_card, apple_pay)
const mollieResult = await createMolliePayment({
  firstName, lastName, ..., paymentMethod, amount: totalFormatted,
  orderId: localOrder.id, orderNumber: nextOrderNum
});

// Store Mollie payment ID
await prisma.payment.update({
  where: { id: paymentRecord.id },
  data: { transactionId: mollieResult.paymentId, providerData: JSON.stringify({...}) }
});

return NextResponse.json({
  success: true, orderId, orderNumber, total, paymentUrl: mollieResult.checkoutUrl, invoiceNumber
});
```

**Error handling**: If Mollie fails → set order to `on-hold`, payment to `failed`, return 502.

---

### Step 2.6: Enable Gateways + Set Environment

**Database**: Update `PaymentGateway` records — set `isEnabled: true` for `mollie_creditcard` and `mollie_applepay`.

**Environment**:
```bash
MOLLIE_API_KEY=test_xxxxxxxx  # start with test mode
```

**Mollie Dashboard**: Set webhook URL: `https://yourdomain.com/api/payment/webhook`

**Apple Pay**: If using Apple Pay, place domain verification file at `/.well-known/apple-developer-merchantid-domain-association`.

---

### Step 2.7: Create Success/Failure Pages

**Files to create**: Success page and failure page routes.
- Success: show order number, confirmation message
- Failure: show error, retry button (link back to checkout)

---

### ✅ Phase 2 Complete

Now you have: SEPA + Credit Card + Apple Pay working.

---

## 5. Phase 3: PayPal

> **Goal**: Add PayPal direct REST API v2 (no Mollie middleman).
> **Depends on**: Phase 1 complete. Independent of Phase 2.

---

### Step 3.1: Create PayPal Integration Library

**Files to create**: `src/lib/paypal.ts`

**Implement** (in order):

1. **Token management**: OAuth2 Client Credentials → `getAccessToken()` with in-memory caching (expiry - 60s safety margin)
2. **`createPayPalOrder(payload)`**: POST to `/v2/checkout/orders` with `intent: 'CAPTURE'`, `purchase_units`, `payment_source.paypal.experience_context` (return_url, cancel_url)
3. **`capturePayPalOrder(paypalOrderId)`**: POST to `/v2/checkout/orders/{id}/capture` → returns captureId, status, payerEmail
4. **`getPayPalOrder(paypalOrderId)`**: GET order details
5. **`refundPayPalCapture(captureId, amount?, note?)`**: POST to `/v2/payments/captures/{id}/refund` (implement now, use in Phase refunds)
6. **`getPayPalCaptureRefunds(captureId)`**: GET refund history

**Environment**:
```bash
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_MODE=sandbox  # start with sandbox
```

---

### Step 3.2: Create PayPal Capture Callback

**Files to create**: `src/app/api/payment/paypal/capture/route.ts`

**Flow**:
1. User returns from PayPal → GET with `orderId` + `token` params
2. Load order + payment from DB
3. If already paid → skip, redirect to success
4. Call `capturePayPalOrder(payment.transactionId)` — the transactionId is the PayPal Order ID at this point
5. If COMPLETED:
   - Update order → `processing`, set `datePaid`, `transactionId` = captureId
   - Update payment → `paid`, `transactionId` = captureId, store providerData
   - Update invoice → `paid`
   - Create OrderNote
   - Trigger invoice email
   - Redirect to success page
6. If failed → create OrderNote, redirect to failure page

**Important**: Transaction ID changes from PayPal Order ID → Capture ID after successful capture.

---

### Step 3.3: Create PayPal Webhook Handler

**Files to create**: `src/app/api/payment/paypal/webhook/route.ts`

**This is a safety net** — the capture callback is the primary flow.

**Events to handle**:
- `PAYMENT.CAPTURE.COMPLETED` → mark order processing + payment paid (if not already)
- `PAYMENT.CAPTURE.DENIED` → mark order cancelled
- `PAYMENT.CAPTURE.REFUNDED` → mark order refunded

**Payment lookup**: Find by `transactionId` (captureId) or `orderId` (custom_id in PayPal payload).

**CRITICAL**: Always return 200.

---

### Step 3.4: Add PayPal Branch to Checkout API

**Modify**: `src/app/api/checkout/direct/route.ts`

Add PayPal section (before Mollie section):
```typescript
if (body.paymentMethod === 'paypal') {
  const paypalResult = await createPayPalOrder({
    orderId, orderNumber, amount: totalFormatted, description: productName, email
  });
  await prisma.payment.update({
    where: { id: paymentRecord.id },
    data: { transactionId: paypalResult.paypalOrderId, providerData: JSON.stringify({...}) }
  });
  return NextResponse.json({ success: true, ..., paymentUrl: paypalResult.approvalUrl });
}
```

**Error handling**: If PayPal fails → set order to `on-hold`, return 502.

---

### Step 3.5: Enable Gateway + Configure PayPal Dashboard

**Database**: Enable `paypal` gateway.
**PayPal Dashboard**: Create app → add webhook URL → subscribe to `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`, `PAYMENT.CAPTURE.REFUNDED`.

---

### ✅ Phase 3 Complete

Now you have: SEPA + Credit Card + Apple Pay + PayPal.

---

## 6. Phase 4: Klarna

> **Goal**: Add Klarna via Mollie Orders API (different from Payments API).
> **Depends on**: Phase 2 (Mollie) must be done first.

---

### Step 4.1: Add Mollie Orders API Functions

**Modify**: `src/lib/payments.ts`

**Add**:
1. `createMollieOrder(payload)` — uses `mollie.orders.create()` instead of `mollie.payments.create()`
2. `getMollieOrderStatus(mollieOrderId)` — uses `mollie.orders.get()` with embedded payments

**Order lines structure** (required by Klarna):
```typescript
lines: [
  { name, quantity: 1, unitPrice: { currency: 'EUR', value }, totalAmount, vatRate: '19.00', vatAmount },
  // payment fee line (if > 0)
  // discount line (if coupon, negative amounts)
]
```

**Billing address is REQUIRED** (Mollie fills defaults if empty).

---

### Step 4.2: Update Webhook for ord_ IDs

**Modify**: `src/app/api/payment/webhook/route.ts`

Add detection:
```typescript
const isOrderId = mollieId.startsWith('ord_');
const molliePayment = isOrderId
  ? await getMollieOrderStatus(mollieId)
  : await getMolliePaymentStatus(mollieId);
```

**Klarna status mapping**: `authorized` = paid (payment guaranteed by Klarna).

---

### Step 4.3: Update Callback for ord_ IDs

**Modify**: `src/app/api/payment/callback/route.ts`

Same detection logic: check if `transactionId.startsWith('ord_')` → use `getMollieOrderStatus()`.

---

### Step 4.4: Add Klarna Branch to Checkout API

**Modify**: `src/app/api/checkout/direct/route.ts`

```typescript
const isKlarna = body.paymentMethod === 'klarna';
const mollieResult = isKlarna
  ? await createMollieOrder({ ..., productName, productPrice, paymentFee, discountAmount, couponCode })
  : await createMolliePayment({ ... });
```

---

### Step 4.5: Update Checkout UI for Klarna Fields

**Modify**: `src/components/checkout/PaymentMethodSelector.tsx`

When Klarna is selected, show:
- firstName (required)
- lastName (required)
- street (required)
- postcode (required, 5 digits)
- city (required)
- phone (required)
- email (required)

**Modify**: `src/components/CheckoutForm.tsx`

Update validation schema `.superRefine()`:
```typescript
if (data.paymentMethod === 'klarna') {
  // validate firstName, lastName, street, postcode (5 digits), city
} else {
  // validate nameOrCompany only
}
```

Update `onSubmit` to send proper fields based on Klarna vs other methods.

---

### Step 4.6: Enable Gateway

**Database**: Enable `mollie_klarna` gateway.
**Mollie Dashboard**: Ensure Klarna is activated in your Mollie profile.

---

### ✅ Phase 4 Complete

All 5 payment methods working.

---

## 7. Phase 5: Coupons & Discounts

> **Goal**: Full coupon system with validation, usage tracking, and admin CRUD.
> **Depends on**: Phase 1 (Order System).

---

### Step 5.1: Create Coupon Preview API

**Files to create**: `src/app/api/apply-coupon/route.ts`

**Implement**:
1. Rate limit (10/min per IP, key: `${ip}:coupon`)
2. Validate: code exists, isActive, date range, maxUsageTotal, maxUsagePerUser (by email), productSlugs restriction, minOrderValue
3. Calculate discount: `percentage` → `round(price × value / 100)` or `fixed` → `min(value, price)`
4. Return: `{ valid, code, discountType, discountValue, discountAmount }`

**Important**: Does NOT record usage — this is preview only.

---

### Step 5.2: Add Server-Side Coupon Validation to Checkout

**Modify**: `src/app/api/checkout/direct/route.ts`

After product price lookup, before order creation:
1. If `couponCode` provided → lookup coupon, run all validations (same as preview)
2. Calculate `discountAmount`
3. Update total calculation: `total = max(productPrice - discountAmount + paymentFee, 0)`
4. After order creation → record usage:
   ```typescript
   await prisma.couponUsage.create({ data: { couponId, email, orderId } });
   await prisma.coupon.update({ data: { usageCount: { increment: 1 } } });
   ```

---

### Step 5.3: Add Free Order Handling

**Modify**: `src/app/api/checkout/direct/route.ts`

Before payment provider routing:
```typescript
if (orderTotal <= 0) {
  // Skip all payment gateways
  // Set order → processing, payment → paid (transactionId: "FREE-{COUPON_CODE}")
  // Set invoice → paid
  // Send invoice email
  // Return invoiceUrl
}
```

---

### Step 5.4: Add Coupon UI to OrderSummary

**Modify**: `src/components/checkout/OrderSummary.tsx`

Add `CouponInput` component:
- Text input + "Apply" button
- On apply: POST `/api/apply-coupon` → show discount line
- Remove button to clear coupon
- Store in `sessionStorage` (key: `appliedCoupon`)

---

### Step 5.5: Build Admin Coupon CRUD

**Files to create**:
- `src/app/api/admin/coupons/route.ts` — GET list, POST create
- `src/app/api/admin/coupons/[id]/route.ts` — GET/PATCH/DELETE
- Admin UI pages

---

### ✅ Phase 5 Complete

Full coupon system with two-step validation.

---

## 8. Minimum Viable Payment System

**The absolute minimum to go live:**

| Component | Required? | Notes |
|-----------|-----------|-------|
| Database schema | ✅ Yes | All models |
| Checkout API | ✅ Yes | SEPA only |
| Checkout UI | ✅ Yes | Basic form |
| Invoice generation | ✅ Yes | jsPDF |
| Invoice email | ✅ Yes | SMTP |
| Admin orders list | ✅ Yes | View orders |
| Admin order detail | ✅ Yes | Change status |
| Mollie | ❌ Add later | Phase 2 |
| PayPal | ❌ Add later | Phase 3 |
| Klarna | ❌ Add later | Phase 4 |
| Coupons | ❌ Add later | Phase 5 |
| Refunds | ❌ Add later | After Phase 2+3 |
| Admin payments config | ❌ Add later | After Phase 2 |

**MVP = Phase 1 = ~14 files = working end-to-end checkout with SEPA.**

---

## 9. Risks & Mitigations

### R1: Webhook Delivery Failure
| Risk | Mollie/PayPal webhook doesn't reach your server |
|------|--------------------------------------------------|
| **Impact** | Order stays pending despite payment being made |
| **Mitigation** | Callback handler (user redirect) also updates status. Both webhook AND callback can finalize orders. |
| **Detection** | Admin sees "pending" order with Mollie/PayPal payment |
| **Recovery** | Admin manually changes status, or debug endpoint checks Mollie API |

### R2: Race Condition — Order Number
| Risk | Two concurrent checkouts get same orderNumber |
|------|----------------------------------------------|
| **Impact** | Unique constraint error, checkout fails |
| **Mitigation** | Retry loop (5 attempts) — re-fetch max orderNumber on conflict |

### R3: Race Condition — Invoice Number
| Risk | Same as above for invoiceNumber |
|------|--------------------------------|
| **Mitigation** | Same retry loop (5 attempts) |

### R4: Double Invoice Email
| Risk | Webhook + callback both fire within seconds |
|------|----------------------------------------------|
| **Impact** | Customer receives 2 emails |
| **Mitigation** | In-memory `Set` deduplication with 5-minute TTL in `triggerInvoiceEmail()` |

### R5: Mollie Method Not Enabled
| Risk | Mollie rejects payment creation for unconfigured method |
|------|--------------------------------------------------------|
| **Impact** | Checkout fails |
| **Mitigation** | Fallback: retry without specifying method → Mollie shows its own selection page |

### R6: PayPal Transaction ID Change
| Risk | Developer expects consistent transaction ID |
|------|---------------------------------------------|
| **Impact** | Refund fails if using wrong ID |
| **Mitigation** | Transaction ID is updated from PayPal Order ID → Capture ID after successful capture. Refund uses capture ID. |

### R7: Webhook Replay / Duplicate Events
| Risk | Provider sends same webhook event twice |
|------|----------------------------------------|
| **Impact** | Double status update, double email |
| **Mitigation** | Status check before update: `if (order.status !== 'processing')`. Invoice dedup via Set. |

### R8: SEPA — No Automated Confirmation
| Risk | Admin forgets to confirm bank transfer |
|------|---------------------------------------|
| **Impact** | Order stays on-hold indefinitely |
| **Mitigation** | Admin dashboard should highlight on-hold orders. Consider a cron job to alert. |

### R9: Webhook Security (Signature Verification)
| Risk | Spoofed webhook requests |
|------|--------------------------|
| **Impact** | Malicious order status changes |
| **Mitigation** | Current system queries provider API to verify status (not trusting webhook body). Mollie webhook only sends `id`, actual status is fetched from Mollie API. PayPal webhook uses `custom_id` to find order, then verifies via DB. **Improvement**: Add PayPal webhook signature verification. |

### R10: Server Restart Clears Dedup Set
| Risk | After deploy/restart, dedup Set is empty |
|------|------------------------------------------|
| **Impact** | Potential double email if webhook + callback both pending |
| **Mitigation** | Low risk — 5 min window. Could upgrade to Redis-based dedup if needed. |

---

## 10. Testing Checklist

### Phase 1 (SEPA)
- [ ] Checkout with SEPA → order created with status `on-hold`
- [ ] Invoice email received with PDF attachment
- [ ] Invoice PDF contains correct amounts, tax, customer info
- [ ] Admin can view order in dashboard
- [ ] Admin can change status: on-hold → processing → completed
- [ ] OrderNote created for status changes
- [ ] Rate limiting works (9th request in 1 min blocked)
- [ ] Invalid input rejected (bad email, missing phone)
- [ ] Non-existent payment method rejected

### Phase 2 (Mollie)
- [ ] Credit card checkout → redirect to Mollie page
- [ ] Successful payment → order status = processing, invoice email sent
- [ ] Failed payment → redirect to failure page, order cancelled
- [ ] Webhook updates order correctly
- [ ] Callback updates order correctly (if webhook hasn't fired yet)
- [ ] No double invoice email
- [ ] Apple Pay hidden on non-Apple devices
- [ ] Test mode works (test_ API key)
- [ ] Mollie fallback works (method not enabled → retry without method)

### Phase 3 (PayPal)
- [ ] PayPal checkout → redirect to PayPal approval page
- [ ] Successful capture → order = processing, payment.transactionId = captureId
- [ ] PayPal cancel → redirect to failure page
- [ ] Webhook: PAYMENT.CAPTURE.COMPLETED updates order (if not already processed)
- [ ] Webhook: PAYMENT.CAPTURE.DENIED cancels order
- [ ] No double email from capture + webhook race

### Phase 4 (Klarna)
- [ ] Klarna selected → extra form fields appear (name, address, postcode, city)
- [ ] Validation: all fields required, postcode must be 5 digits
- [ ] Checkout creates Mollie Order (ord_ prefix, not tr_)
- [ ] Klarna authorized → order = processing (treat as paid)
- [ ] Webhook handles ord_ IDs correctly
- [ ] Discount appears as negative line item in Mollie order

### Phase 5 (Coupons)
- [ ] Apply valid coupon → discount shown in summary
- [ ] Invalid/expired/used coupon → error message
- [ ] Coupon re-validated at checkout (server-side)
- [ ] Usage recorded after order creation
- [ ] Per-email usage limit works
- [ ] Product restriction works
- [ ] Min order value works
- [ ] 100% discount → free order flow (no payment provider)
- [ ] Admin can create/edit/delete coupons

### Refunds
- [ ] Mollie refund works (full + partial)
- [ ] PayPal refund works (full + partial)
- [ ] SEPA: refund button shows appropriate message
- [ ] DB updated only AFTER provider confirms
- [ ] OrderNote records refund details
