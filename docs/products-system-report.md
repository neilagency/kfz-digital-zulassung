# Products System – Full Technical Report

> **Project:** Online Auto Abmelden (kfz-digital-zulassung)
> **Stack:** Next.js 14 (App Router), Prisma ORM, SQLite/Turso, Mollie, PayPal, Nodemailer
> **Purpose:** Complete reference for replicating the Products system on a second website.
> **Audited:** May 2026

---

## Table of Contents

1. [Admin Dashboard – Products Section](#1-admin-dashboard--products-section)
2. [Database Schema](#2-database-schema)
3. [Backend / API Layer](#3-backend--api-layer)
4. [Visitor Website – Product Display](#4-visitor-website--product-display)
5. [Pricing Logic](#5-pricing-logic)
6. [Checkout / Order / Payment Flow](#6-checkout--order--payment-flow)
7. [Media / Image Connection](#7-media--image-connection)
8. [Environment Variables](#8-environment-variables)
9. [Replication Guide for Second Website](#9-replication-guide-for-second-website)
10. [Testing Checklist](#10-testing-checklist)
11. [Risks / Issues Found](#11-risks--issues-found)

---

## 1. Admin Dashboard – Products Section

### Location

| Item | Path |
|---|---|
| Products admin page | `src/app/admin/(dashboard)/products/page.tsx` |
| Admin layout wrapper | `src/app/admin/(dashboard)/layout.tsx` |
| Admin root layout | `src/app/admin/layout.tsx` |
| SWR data hook | `src/lib/admin-api.ts` → `useProducts()` |
| Media picker (for images) | `src/components/admin/MediaPicker.tsx` |

**URL in browser:** `/admin` → sidebar link → "Produkte & Dienste"

---

### Product List View

- Fetches via `useProducts({ page, search, limit })` SWR hook → `GET /api/admin/products`
- Default page size: **20** products per page; configurable via `Pagination` component
- Columns displayed: **Name**, **Slug** (link to visitor page), **Preis (€)**, **Typ** (serviceType), **Status** (active/inactive badge), **Aktionen**
- Search input: debounced, searches `name`, `slug`, `serviceType` fields
- Each row rendered by memoized `ProductRow` component to avoid re-renders
- Empty state shown when no products exist, with "Erstes Produkt erstellen" button

---

### Create / Edit Form

Clicking "Bearbeiten" on a row → `GET /api/admin/products?id={id}` (full product data) → form opens.
Clicking "Neues Produkt" → form opens with `EMPTY_FORM` defaults.

**Form has 4 tabs:**

#### Tab 1 – Grunddaten (Basic Data)
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | text input | **Yes** | Display name of product |
| `slug` | text input | No | Auto-generated from name if empty; URL-safe slug |
| `price` | number (step 0.01) | No | Base price in EUR, default `0` |
| `serviceType` | text input | No | e.g. `abmeldung`, `anmeldung` – internal classifier |
| `formType` | select | No | `''` = no form, `'abmeldung'` = ServiceForm, `'anmeldung'` = RegistrationForm |
| `description` | textarea | No | Short description, plain text, max 10,000 chars |
| `isActive` | checkbox | No | Defaults `true`; if `false`, product page returns 404 |
| **Preis-Optionen** | JSON array | No | Array of `{ name, price, key }` objects |

**Slug auto-generation logic (client + server):**
```
name.toLowerCase()
  .replace(ä→ae, ö→oe, ü→ue, ß→ss)
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')
```

**Price Options structure:**
```json
[
  { "name": "Kennzeichen reservieren (1 Jahr)", "price": 4.70, "key": "reservierung" }
]
```
Each option has a display `name`, a `price` (float), and a machine-readable `key` used in code to look up specific options (e.g. `o.key === 'reservierung'`).

#### Tab 2 – Inhalt (Content)
| Field | Type | Notes |
|---|---|---|
| `heroTitle` | text | H1 on visitor page; falls back to `name` if empty |
| `heroSubtitle` | text | Subtitle below H1 on visitor page |
| `featuredImage` | text (URL) + MediaPicker button | Image URL or media library selection |
| `content` | textarea (HTML) | Rich HTML injected as `dangerouslySetInnerHTML` via `sanitizeHtml()` between pricing and contact sections |

#### Tab 3 – SEO
| Field | Type | Notes |
|---|---|---|
| `metaTitle` | text (max 60 chars) | `<title>` tag; live character counter shown |
| `metaDescription` | textarea (max 160 chars) | `<meta description>`; live counter |
| `canonical` | text | Canonical URL; auto-generated from slug if empty |
| `robots` | select | `index, follow` / `noindex, follow` / `index, nofollow` / `noindex, nofollow` |
| `ogTitle` | text | Open Graph title; falls back to metaTitle |
| `ogDescription` | textarea | OG description; falls back to metaDescription |
| `ogImage` | text (URL) + MediaPicker button | OG image (1200×630 recommended) |

Google Preview rendered live inside the SEO tab using current form values.

#### Tab 4 – FAQ
Array of `{ q: string, a: string }` objects.
- Rendered as `<details>` accordion on visitor page
- Also output as `FAQPage` JSON-LD schema on dynamic product pages

---

### Save / Validation

- Client-side: save button disabled unless `name` is non-empty
- On save: `options` and `faqItems` arrays are `JSON.stringify`'d before sending
- API call: `POST /api/admin/products` (new) or `PUT /api/admin/products` (edit)
- Server-side: Zod validation runs; see Section 3

---

### Delete

- Click trash icon → `ConfirmModal` ("Produkt löschen?")
- On confirm: `DELETE /api/admin/products?id={id}`
- **Hard delete** — no soft delete / `deletedAt` field on Product model
- Cache and product pages revalidated after deletion

---

### Media / Image Selection in Admin

Two fields support image selection: `featuredImage` and `ogImage`.

Each has:
1. A text input for direct URL entry
2. A "Mediathek" button that opens `MediaPicker` (slide-in drawer)

`MediaPicker` is lazy-loaded via `next/dynamic` with `ssr: false`.

On media selection, `onSelect(media)` is called with `{ url: string, ... }` and the selected field is updated via `setField(mediaPickerField, media.url)`.

---

## 2. Database Schema

### Product Model

**File:** `prisma/schema.prisma` (lines 199–235)

```prisma
model Product {
  id          String   @id @default(cuid())
  wpProductId Int?     @unique          // Legacy WordPress product ID (nullable)
  name        String                    // Display name — REQUIRED
  slug        String   @unique          // URL slug — REQUIRED, unique
  description String   @default("")     // Plain text short description
  price       Float    @default(0)      // Base price in EUR
  isActive    Boolean  @default(true)   // Controls visibility; false → 404
  serviceType String   @default("")     // 'abmeldung' | 'anmeldung' | custom
  options     String   @default("[]")   // JSON: ProductOption[]

  // Rich content for dynamic product page
  content       String   @default("")   // HTML body content (sanitized on render)
  heroTitle     String   @default("")   // H1 on product page
  heroSubtitle  String   @default("")   // Subtitle under H1
  featuredImage String   @default("")   // Image URL (from media library or external)
  faqItems      String   @default("[]") // JSON: FaqItem[]

  // SEO fields
  metaTitle       String @default("")
  metaDescription String @default("")
  canonical       String @default("")
  robots          String @default("index, follow")
  ogTitle         String @default("")
  ogDescription   String @default("")
  ogImage         String @default("")

  // Form configuration
  formType  String @default("")         // 'abmeldung' | 'anmeldung' | ''

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([createdAt])
  @@index([isActive])
  @@index([serviceType])
}
```

### JSON Sub-types (Stored as Strings)

**`options` field** — `ProductOption[]`
```typescript
interface ProductOption {
  name: string;   // Display label, e.g. "Kennzeichen reservieren (1 Jahr)"
  price: number;  // Price in EUR, e.g. 4.70
  key: string;    // Machine key, e.g. "reservierung"
}
```

**`faqItems` field** — `FaqItem[]`
```typescript
interface FaqItem {
  q: string;  // Question text
  a: string;  // Answer text
}
```

---

### Seed Data (Default Products)

**File:** `prisma/seed.ts`

| Slug | Name | Price | serviceType | formType | Options |
|---|---|---|---|---|---|
| `fahrzeugabmeldung` | Fahrzeug jetzt online abmelden | 19.70 | abmeldung | (empty) | `reservierung`: 4.70 |
| `auto-online-anmelden` | Fahrzeug jetzt online anmelden | 0.00 | anmeldung | (empty) | neuzulassung: 124.70, ummeldung: 119.70, wiederzulassung: 99.70, neuwagen: 99.70, kennzeichen_reserviert: 24.70, kennzeichen_bestellen: 29.70 |

> **Note:** The `auto-online-anmelden` product has `price: 0`. The actual service prices are all in `options`. The checkout uses `body.productPrice` (sent from the form) to determine the final price, validated server-side as `>= dbProduct.price`.

---

### Related Database Models

| Model | Relationship | Notes |
|---|---|---|
| `Order` | `productId Int?`, `productName String` | Snapshot of product at time of order |
| `OrderItem` | `productId Int?`, `productName String`, `price Float`, `total Float` | Line items; product is snapshotted |
| `Invoice` | `items String` (JSON) | Invoice line items snapshot |
| `Coupon` | `productSlugs String` | Comma-separated slugs for product restriction |
| `Media` | No FK to Product | Images linked by URL string only |

**There are no foreign key relations between `Product` and `Order`/`Invoice`.** Product data is snapshotted (copied by value) into the order at checkout time.

---

### Migrations

**Directory:** `migrations/sql/`

| File | Purpose |
|---|---|
| `001_baseline.sql` | Full initial schema including Product table |
| `002_add_media_processing_status.sql` | Media table only |
| `003_add_media_processing_status_index.sql` | Media index only |

Product table has no separate migration — it is part of the baseline. Any schema changes are applied via `npx prisma migrate dev`.

---

## 3. Backend / API Layer

### Admin Products API

**File:** `src/app/api/admin/products/route.ts`

All 4 HTTP methods are in a single file. All require admin session (via middleware, not per-route guard — see `src/middleware.ts`).

---

#### `GET /api/admin/products`

**Query params:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `id` | string | — | If present, returns single full product object |
| `page` | number | `1` | Pagination page |
| `limit` | number | `20` | Page size |
| `search` | string | — | Searches `name`, `slug`, `serviceType` (contains) |
| `all` | `'true'` | — | Returns all products (id, name, slug, price, isActive); capped at 500 |

**Response (list):**
```json
{
  "products": [
    {
      "id": "cuid...",
      "name": "Fahrzeug jetzt online abmelden",
      "slug": "fahrzeugabmeldung",
      "price": 19.7,
      "isActive": true,
      "serviceType": "abmeldung",
      "formType": "",
      "featuredImage": "",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 2, "pages": 1 }
}
```

**Response (single `?id=`):**
Full `Product` object with all fields.

**Caching:** In-memory `Map` cache with 30s TTL for list results. Cleared on any write.

**Cache-Control header:** `private, max-age=5, stale-while-revalidate=30`

---

#### `POST /api/admin/products`

Creates a new product.

**Request body:** All fields from `productCreateSchema` (see validations).

**Required fields:** `name` only.

**Slug behavior:** Auto-generated from `name` if not provided; German umlauts handled.

**Response:** Full created `Product` object, status `201`.

**Side effects on success:**
- Clears in-memory product list/total cache
- `revalidatePath('/')` — homepage
- `revalidatePath('/sitemap.xml')`
- `revalidateTag('products')` — all pages using `{ tags: ['products'] }` cache

---

#### `PUT /api/admin/products`

Updates an existing product.

**Request body:** All fields from `productUpdateSchema` — same as create + required `id`.

**Response:** Full updated `Product` object.

**Side effects on success:**
- Clears in-memory cache
- `revalidatePath('/')`, `revalidatePath('/product/{slug}')`, `revalidatePath('/sitemap.xml')`
- `revalidateTag('products')`

---

#### `DELETE /api/admin/products?id={id}`

Hard-deletes a product by ID.

**Response:** `{ "success": true }`

**Side effects on success:**
- Clears in-memory cache
- `revalidatePath('/')`, `revalidatePath('/sitemap.xml')`

---

### Zod Validation Schemas

**File:** `src/lib/validations.ts`

```typescript
export const productCreateSchema = z.object({
  name:            z.string().min(1).max(255),          // REQUIRED
  slug:            z.string().max(255).optional()
                     .refine(val => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val)),
  price:           z.number().min(0).optional().default(0),
  description:     z.string().max(10000).optional().default(''),
  options:         z.string().max(10000).optional().default('[]'),    // JSON string
  isActive:        z.boolean().optional().default(true),
  serviceType:     z.string().max(100).optional().default(''),
  content:         z.string().max(100000).optional().default(''),
  heroTitle:       z.string().max(500).optional().default(''),
  heroSubtitle:    z.string().max(1000).optional().default(''),
  featuredImage:   z.string().max(2000).optional().default(''),
  faqItems:        z.string().max(50000).optional().default('[]'),    // JSON string
  formType:        z.string().max(50).optional().default(''),
  metaTitle:       z.string().max(200).optional().default(''),
  metaDescription: z.string().max(500).optional().default(''),
  canonical:       z.string().max(500).optional().default(''),
  robots:          z.string().max(100).optional().default('index, follow'),
  ogTitle:         z.string().max(200).optional().default(''),
  ogDescription:   z.string().max(500).optional().default(''),
  ogImage:         z.string().max(2000).optional().default(''),
});

export const productUpdateSchema = productCreateSchema.extend({
  id: z.string().min(1),   // REQUIRED for update
});
```

---

### Public Product DB Helpers

**File:** `src/lib/db.ts`

| Function | Description | Cache |
|---|---|---|
| `getProductBySlug(slug)` | Fetches single product by slug, returns `null` if not found | No cache — direct Prisma query |
| `getAllActiveProducts()` | Returns all `isActive: true` products ordered by `createdAt desc` | `unstable_cache`, tag `products`, 60s revalidate |
| `getAllProductSlugs()` | Returns string[] of active product slugs; returns `[]` on build-time DB error | No cache |
| `getHomepagePricing()` | Fetches prices for `fahrzeugabmeldung` and `auto-online-anmelden` slugs | `unstable_cache`, tag `products`, 60s revalidate |
| `formatPrice(price)` | Formats float → `"19,70 €"` (German locale) | N/A |

---

### Coupon Validation API

**File:** `src/app/api/apply-coupon/route.ts`

`POST /api/apply-coupon`

Used by the checkout form to validate a coupon before submission.

**Request body:**
```json
{
  "code": "DISCOUNT10",
  "email": "user@example.com",
  "productSlug": "fahrzeugabmeldung",
  "subtotal": 19.70
}
```

**Validation checks (in order):**
1. Code exists in DB
2. `isActive === true`
3. `startDate` ≤ now ≤ `endDate` (if set)
4. `usageCount < maxUsageTotal` (if limit set)
5. Per-user usage check (by email + couponId)
6. Product slug allowed (`productSlugs` whitelist, if set)
7. Subtotal ≥ `minOrderValue` (if set)

**Success response:**
```json
{
  "valid": true,
  "code": "DISCOUNT10",
  "discountType": "percentage",
  "discountValue": 10,
  "discountAmount": 1.97,
  "description": "10% Rabatt"
}
```

**Rate limit:** 10 requests/min per IP.

---

## 4. Visitor Website – Product Display

### Route Architecture

| Route | File | Type | Products Used |
|---|---|---|---|
| `/product/fahrzeugabmeldung` | `src/app/product/fahrzeugabmeldung/page.tsx` | Static | slug: `fahrzeugabmeldung` |
| `/product/auto-online-anmelden` | `src/app/product/auto-online-anmelden/page.tsx` | Static | slug: `auto-online-anmelden` |
| `/product/[slug]` | `src/app/product/[slug]/page.tsx` | Dynamic (ISR) | Any other active product |

All pages use `export const revalidate = 60` — ISR with 60-second TTL.

The dynamic `[slug]` route excludes `fahrzeugabmeldung` and `auto-online-anmelden` from `generateStaticParams()` to avoid conflicts with the static routes:
```typescript
const STATIC_PRODUCT_SLUGS = ['fahrzeugabmeldung', 'auto-online-anmelden'];
```

---

### Dynamic Product Page (`/product/[slug]`)

**File:** `src/app/product/[slug]/page.tsx`

**Data fetching:** `getProductBySlug(params.slug)` + `getSiteSettings()`

**Gate:** If `!product || !product.isActive` → `notFound()` (404)

**Page structure (top to bottom):**

1. **JSON-LD schemas** injected: `Service`, `BreadcrumbList`, `FAQPage` (if faqItems present)
2. **Hero section** — gradient background; `product.heroTitle || product.name` as H1; `product.heroSubtitle || product.description` as subtitle; 3 trust badges
3. **Form section** — rendered only if `product.formType` is set:
   - `formType === 'abmeldung'` → `<ServiceForm />` component
   - `formType === 'anmeldung'` → `<RegistrationForm />` component
4. **Trust badge** — 5-star Trustindex badge
5. **Pricing section** — gradient card showing base price + all options from `product.options`
6. **Rich content section** — rendered only if `product.content` is set; HTML sanitized via `sanitizeHtml()`
7. **Payment methods** — static cards (Credit/Debit card, PayPal, Banküberweisung)
8. **Contact section** — phone, WhatsApp, email from `getSiteSettings()`
9. **FAQ accordion** — rendered only if `faqItems.length > 0`; `<details>` elements
10. **Cross-sell CTA** — buttons linking to `/product/fahrzeugabmeldung` and `/product/auto-online-anmelden`
11. **Privacy note** — link to `/datenschutzhinweise`

---

### Static Product Pages

Both `/product/fahrzeugabmeldung` and `/product/auto-online-anmelden` are fully custom static pages with hardcoded German SEO content, full step-by-step guides, pricing sections, and FAQs.

They still **fetch live product data** from DB for:
- `product.price` — base price displayed and used in schema.org `Offer`
- `product.options` — option prices (e.g. `reservierung`, `kennzeichen_reserviert`)
- All SEO fields (`metaTitle`, `metaDescription`, `ogImage`, etc.) — DB values override defaults
- `settings` — phone, email, WhatsApp, site name, siteUrl

The `ServiceForm` and `RegistrationForm` on these pages also receive live prices from the product record.

**Key difference from dynamic page:** These pages contain rich hardcoded marketing content (step-by-step guides, cost overviews, legal notes). The dynamic `[slug]` page uses only DB-driven content.

---

### SEO / Metadata Generation

All product pages generate metadata via `generateMetadata()`:

| Meta field | Source priority |
|---|---|
| `<title>` | `product.metaTitle` → fallback: `"{name} – ab {price} €"` |
| `<meta description>` | `product.metaDescription` → fallback: hardcoded or `product.description` |
| `canonical` | Always auto-generated as `{siteUrl}/product/{slug}` (DB value ignored for dynamic page) |
| `robots` | `index, follow` always for static pages; dynamic page respects `NODE_ENV !== 'production'` check |
| `og:title` | `product.ogTitle` → fallback to title |
| `og:description` | `product.ogDescription` → fallback to description |
| `og:image` | `product.ogImage` → `product.featuredImage` → fallback `/logo.webp` |

---

### Sitemap

**File:** `src/app/sitemap.ts`

Product URLs are included in the sitemap via `getAllProductSlugs()`. All active product slugs generate entries at `/product/{slug}`.

---

## 5. Pricing Logic

### How Prices Are Stored

- Base price: `Product.price` (Float, EUR, e.g. `19.70`)
- Option prices: `Product.options` (JSON string array of `{ name, price, key }`)
- No VAT/tax field on the product itself

### How Price is Calculated at Checkout

**File:** `src/app/api/checkout/direct/route.ts`

```
productPrice = dbProduct.price  // Server-side authoritative value

// Client can send a higher price (e.g. product + selected option):
if (body.productPrice >= dbProduct.price) {
  productPrice = parseFloat(body.productPrice)
}

paymentFee = gateway.fee  // e.g. 0.50 for credit card, 0.00 for PayPal/SEPA

discountAmount = couponDiscount  // 0 if no coupon

orderTotal = max(productPrice - discountAmount + paymentFee, 0)
```

**Key security rule:** The client-submitted price is accepted **only if it is ≥ the DB base price**. This allows passing option-adjusted prices (e.g. 19.70 + 4.70 = 24.40 for abmeldung + reservierung) while preventing price manipulation downwards.

### Option Price Selection (frontend)

For `fahrzeugabmeldung`:
```typescript
const reservierungOption = options.find(o => o.key === 'reservierung')
const reservierungPrice = reservierungOption?.price ?? 4.70
// ServiceForm receives basePrice + reservierungPrice
```

For `auto-online-anmelden`, the `RegistrationForm` receives `serviceOptions` array:
```typescript
const serviceFormOptions = options
  .filter(o => ['neuzulassung','ummeldung','wiederzulassung','neuwagen'].includes(o.key))
  .map(o => ({ value: o.key, label: KEY_TO_LABEL[o.key], price: o.price }))
```
The user selects one service type in the form → that option's price becomes `productPrice` sent at checkout.

### Currency

Always EUR. Prices formatted as German locale: `price.toFixed(2).replace('.', ',') + ' €'` (via `formatPrice()` in `src/lib/db.ts`).

### VAT / Tax

**No VAT field on products.** VAT is calculated at invoice creation time:
```typescript
const taxAmount = parseFloat((orderTotal - orderTotal / 1.19).toFixed(2))
// taxRate: 19 (hardcoded in Invoice)
```
19% MwSt included in price (gross pricing). Breakdown shown on invoice only.

### Payment Gateway Fees

| Gateway | Fee |
|---|---|
| mollie_creditcard (Kredit-/Debitkarte) | +€0.50 |
| paypal | €0.00 |
| mollie_applepay | €0.00 |
| sepa | €0.00 |
| mollie_klarna | €0.00 |

Fees are stored in `PaymentGateway.fee` and fetched server-side at checkout.

### Coupons / Discounts

| Field | Behavior |
|---|---|
| `discountType: 'fixed'` | Flat EUR amount off `productPrice` |
| `discountType: 'percentage'` | Percentage of `productPrice` |
| `minOrderValue` | Coupon invalid if `productPrice < minOrderValue` |
| `maxUsageTotal` | 0 = unlimited |
| `maxUsagePerUser` | Default 1; enforced by `couponId + email` unique index |
| `productSlugs` | Comma-separated; empty = all products |
| `startDate` / `endDate` | Date range validity |

If `orderTotal <= 0` after discount, the order is marked `processing` and payment is skipped entirely. Invoice is sent immediately.

---

## 6. Checkout / Order / Payment Flow

### Step-by-Step Flow

```
Visitor fills ServiceForm / RegistrationForm
  ↓
Form submits POST /api/checkout/direct
  ↓
Server validates (Zod + DB price check + coupon check + gateway check)
  ↓
Creates: Customer (upsert) + Order + OrderItem(s) + Payment + Invoice
  ↓
Branches by payment method:
  ├─ SEPA → sets order status 'on-hold' → sends invoice email → returns invoiceUrl
  ├─ PayPal → createPayPalOrder() → returns approvalUrl → user goes to PayPal
  │     ↓
  │   GET /api/payment/paypal/capture?orderId=&token=
  │     → capturePayPalOrder() → update order 'processing' → send email → redirect success
  ├─ Mollie (card/applepay) → createMolliePayment() → returns checkoutUrl → user goes to Mollie
  │     ↓
  │   GET /api/payment/callback?orderId=
  │     → check Mollie status → update order/payment/invoice → send email → redirect success/failure
  │   POST /api/payment/webhook (Mollie server → our server)
  │     → idempotent update of order/payment/invoice status
  └─ Mollie Klarna → createMollieOrder() (Orders API) → same callback flow
```

---

### Checkout API

**File:** `src/app/api/checkout/direct/route.ts`

`POST /api/checkout/direct`

**Request payload (CheckoutDirectInput):**
```typescript
{
  name: string             // Full name (non-Klarna methods)
  firstName?: string       // Klarna only
  lastName?: string        // Klarna only
  company?: string         // Klarna only
  street?: string
  postcode?: string
  city?: string
  phone: string            // REQUIRED, min 6 chars
  email: string            // REQUIRED, valid email
  paymentMethod: string    // REQUIRED: 'credit_card'|'paypal'|'apple_pay'|'klarna'|'sepa'
  productId?: string       // 'abmeldung' (default) | 'anmeldung'
  productPrice?: string    // Price from form (validated server-side ≥ DB price)
  serviceData?: object     // Form-specific data (vehicle info, etc.)
  couponCode?: string
}
```

**productId → slug mapping (hardcoded):**
```typescript
const productSlug = body.productId === 'anmeldung'
  ? 'auto-online-anmelden'
  : 'fahrzeugabmeldung'
```

**Security features:**
- Rate limit: 8 requests/min per IP
- Zod validation on all inputs
- Server-side price lookup from DB (never trust client price)
- Server-side gateway validation from DB
- Server-side coupon re-validation (even if pre-validated via `/api/apply-coupon`)

**Response (Mollie/PayPal):**
```json
{
  "success": true,
  "orderId": "cuid...",
  "orderNumber": 1042,
  "total": "19.70",
  "paymentUrl": "https://checkout.mollie.com/...",
  "invoiceNumber": "RE-2026-0042"
}
```

**Response (SEPA/Free):**
```json
{
  "success": true,
  "orderId": "cuid...",
  "orderNumber": 1042,
  "total": "19.70",
  "invoiceUrl": "/rechnung/RE-2026-0042?order=1042&token=abc123"
}
```

---

### Order Data Saved

When an order is created, these fields are populated from the product:

| Order Field | Source |
|---|---|
| `productName` | DB product name (+ service label for anmeldung) |
| `productId` | Not an FK — legacy integer field, not used in new orders |
| `subtotal` | `productPrice` (DB-validated) |
| `paymentFee` | `gateway.fee` |
| `discountAmount` | Coupon discount |
| `total` | `subtotal - discount + fee` |
| `paymentMethod` | checkout ID (e.g. `credit_card`) |
| `paymentTitle` | Gateway display name (e.g. "Kredit- / Debitkarte") |
| `serviceData` | JSON string of full form submission data |

---

### Payment Status Flow

| Mollie Status | Order Status | Payment Status |
|---|---|---|
| `paid` / `authorized` / `completed` | `processing` | `paid` |
| `failed` | `cancelled` | `failed` |
| `canceled` | `cancelled` | `cancelled` |
| `expired` | `cancelled` | `expired` |
| `open` / `pending` | `pending` | `pending` |
| (refunded via amountRefunded) | `refunded` | `refunded` / `partially_refunded` |

SEPA orders start as `on-hold` and remain until manually set to `processing` by admin.

---

### Webhook URLs

| Gateway | URL |
|---|---|
| Mollie webhook | `https://{SITE_URL}/api/payment/webhook` |
| Mollie callback (user redirect) | `https://{SITE_URL}/api/payment/callback?orderId={id}` |
| PayPal return URL | `https://{SITE_URL}/api/payment/paypal/capture?orderId={id}` |
| PayPal cancel URL | `https://{SITE_URL}/zahlung-fehlgeschlagen?order={orderNumber}` |

---

### Success / Failure Pages

| Outcome | Redirect |
|---|---|
| Payment success | `/bestellung-erfolgreich?order={orderNumber}` |
| Payment failure | `/zahlung-fehlgeschlagen?order={orderNumber}&reason={reason}` |
| SEPA / free order | `/rechnung/{invoiceNumber}?order={orderNumber}&token={token}` |

---

### Invoice / Email on Payment

After successful payment (all gateways):
- Invoice record updated: `paymentStatus = 'paid'`, `transactionId` set
- `triggerInvoiceEmail(orderId)` called → sends branded invoice PDF email to customer
- Email uses SMTP (nodemailer) configured via ENV variables

---

## 7. Media / Image Connection

### How Images Are Uploaded

1. Admin opens product edit form → clicks "Mediathek" button next to `featuredImage` or `ogImage`
2. `MediaPicker` drawer opens → admin browses existing media or uploads new file
3. On selection, `media.url` (the `sourceUrl` from the `Media` DB record) is set into the form field
4. On save, the URL string is stored in `Product.featuredImage` or `Product.ogImage`

**No FK relationship exists between `Product` and `Media` tables.** The connection is a raw URL string. If a media item is deleted from the library, the product image will be a broken link.

### Image Storage

Images are stored at:
- `/public/uploads/` (local dev)
- Configured storage on Hostinger for production

The `Media` record stores:
- `sourceUrl` — full URL to original image
- `thumbnailUrl`, `mediumUrl`, `largeUrl` — variant URLs
- `localPath` — relative server path

### How Images Are Rendered on Visitor Pages

Direct `<img>` tag (not Next.js `<Image>`):
```tsx
{editProduct.featuredImage && (
  <img src={editProduct.featuredImage} alt="Preview" className="mt-2 rounded-lg max-h-40 object-cover" />
)}
```

On the dynamic product page, `product.featuredImage` is used as OG image fallback only. No featured image is rendered visually on the page body by default (it is used for social sharing).

### Fallback Image Behavior

In `generateMetadata()`:
```typescript
const ogImage = product.ogImage || product.featuredImage || `${baseUrl}/logo.webp`
```

If neither OG image nor featured image is set, `/logo.webp` (from `/public/`) is used.

### Image Normalization

Relative paths are handled in static product pages:
```typescript
const ogImage = product?.ogImage?.startsWith('http')
  ? product.ogImage
  : `${baseUrl}${product.ogImage.startsWith('/') ? product.ogImage : `/${product.ogImage}`}`
```

---

## 8. Environment Variables

All variables inferred from source code. No secret values shown.

### Database

| Variable | Required | Usage | Example |
|---|---|---|---|
| `DATABASE_URL` | Conditional | Used by Prisma when `USE_LOCAL_DB=true`; SQLite file path | `file:./dev.db` |
| `TURSO_DATABASE_URL` | Conditional | LibSQL/Turso connection string (Vercel deployment) | `libsql://your-db.turso.io` |
| `TURSO_AUTH_TOKEN` | Conditional | Turso auth token | `eyJ...` |
| `USE_LOCAL_DB` | No | Force local SQLite adapter | `true` |

> At least one database config is required. Use `TURSO_DATABASE_URL` on Vercel; `USE_LOCAL_DB=true` + `DATABASE_URL` on Hostinger.

---

### Authentication

| Variable | Required | Usage | Example |
|---|---|---|---|
| `NEXTAUTH_SECRET` | **Yes** | Signs admin session JWT; also used for invoice token HMAC | `random-64-char-string` |
| `JWT_SECRET` | No | Fallback for invoice token if `NEXTAUTH_SECRET` absent | `random-64-char-string` |

---

### Payment Gateways

| Variable | Required | Usage | Example |
|---|---|---|---|
| `MOLLIE_API_KEY` | **Yes** | Mollie API key for credit card / Apple Pay / Klarna | `live_xxxxxxxxxxxx` |
| `PAYPAL_CLIENT_ID` | **Yes** | PayPal REST API client ID | `AaBb...` |
| `PAYPAL_CLIENT_SECRET` | **Yes** | PayPal REST API secret | `EeFf...` |
| `PAYPAL_MODE` | No | `live` or `sandbox` | `live` |

---

### Site / URLs

| Variable | Required | Usage | Example |
|---|---|---|---|
| `SITE_URL` | **Yes** | Absolute site URL; used in payment redirects, emails, schemas | `https://yourdomain.com` |
| `NEXT_PUBLIC_SITE_URL` | No | Public version of SITE_URL (accessible client-side) | `https://yourdomain.com` |

> **Critical:** `SITE_URL` must match the production domain exactly. It is embedded in Mollie/PayPal callback URLs and all transactional emails.

---

### Email / SMTP

| Variable | Required | Usage | Example |
|---|---|---|---|
| `SMTP_HOST` | **Yes** | SMTP server hostname | `smtp.titan.email` |
| `SMTP_PORT` | No | SMTP port, default `465` | `465` |
| `SMTP_USER` | **Yes** | SMTP login username | `info@yourdomain.com` |
| `SMTP_PASS` | Conditional | SMTP password (plain) | `password123` |
| `SMTP_PASS_B64` | Conditional | SMTP password (base64-encoded) — preferred over plain | `cGFzc3dvcmQ=` |
| `EMAIL_FROM` | No | Sender email address | `info@yourdomain.com` |
| `EMAIL_FROM_NAME` | No | Sender display name | `Your Company Name` |

> Either `SMTP_PASS` or `SMTP_PASS_B64` must be set.

---

### Debug / Feature Flags

| Variable | Required | Usage | Example |
|---|---|---|---|
| `PAYMENT_DEBUG` | No | Enables verbose payment logging | `true` |
| `PREVIEW_MODE` | No | Sets `robots: noindex` on all pages | `true` |
| `NODE_ENV` | Auto | Standard Next.js; `production` enables indexing on dynamic product pages | `production` |

---

## 9. Replication Guide for Second Website

### What to Copy / Recreate

#### Database (identical — no changes needed)
- Copy `prisma/schema.prisma` exactly — `Product` model is generic
- Copy `prisma/seed.ts` but **change**: product names, descriptions, prices, options, slug names to match the new service
- Run `npx prisma migrate dev` to create tables
- Run `npx tsx prisma/seed.ts` to seed initial data

#### API Routes (identical logic — change domain config only)
- `src/app/api/admin/products/route.ts` — copy as-is
- `src/app/api/checkout/direct/route.ts` — copy as-is; update `productSlug` mapping if your product slugs differ:
  ```typescript
  // Current:
  const productSlug = body.productId === 'anmeldung' ? 'auto-online-anmelden' : 'fahrzeugabmeldung'
  // Change to your product slugs:
  const productSlug = body.productId === 'your-service-b' ? 'your-slug-b' : 'your-slug-a'
  ```
- `src/app/api/apply-coupon/route.ts` — copy as-is
- `src/app/api/payment/callback/route.ts` — copy as-is
- `src/app/api/payment/webhook/route.ts` — copy as-is
- `src/app/api/payment/paypal/capture/route.ts` — copy as-is
- `src/app/api/payment/paypal/webhook/route.ts` — copy as-is

#### Lib Helpers (copy as-is)
- `src/lib/db.ts` — copy; update `getHomepagePricing()` to use your slug names
- `src/lib/validations.ts` — copy as-is
- `src/lib/payments.ts` — copy as-is
- `src/lib/paypal.ts` — copy as-is
- `src/lib/admin-api.ts` — copy as-is

#### Admin UI (copy as-is)
- `src/app/admin/(dashboard)/products/page.tsx` — copy as-is; UI is generic

#### Visitor Product Pages (recreate with new branding/content)
- `src/app/product/[slug]/page.tsx` — copy as-is; it is fully data-driven
- `src/app/product/fahrzeugabmeldung/page.tsx` — **recreate** with your service's branding and content; keep the data-fetching logic identical
- `src/app/product/auto-online-anmelden/page.tsx` — **recreate** with your service's branding and content

---

### What Values Must Change

| Item | Location | What to Change |
|---|---|---|
| Product slugs | DB + checkout route | Use your service's slugs |
| Product names, descriptions | DB seed | Your service text |
| Product prices | DB seed / admin UI | Your pricing |
| Product option keys | DB seed + frontend code that reads `o.key === '...'` | Match your option keys |
| `SITE_URL` | ENV | Your production domain |
| `NEXTAUTH_SECRET` | ENV | New random 64-char secret |
| `SMTP_USER`, `EMAIL_FROM` | ENV | Your company email |
| `EMAIL_FROM_NAME` | ENV | Your company name |
| `MOLLIE_API_KEY` | ENV | Your Mollie account key |
| `PAYPAL_CLIENT_ID/SECRET` | ENV | Your PayPal account |
| Webhook URLs in Mollie dashboard | Mollie | Your domain |
| Return/cancel URLs in PayPal dashboard | PayPal | Your domain |
| Static marketing text (steps, FAQs) | Product page files | Your service description |
| Schema.org `serviceType`, `name`, `alternateName` | Static product pages | Your service |
| Cross-sell CTA links | Static product pages | Your service page URLs |
| Admin seed user email/password | `prisma/seed.ts` | Your admin credentials |
| `site_name`, `site_url` settings | DB seed | Your site values |
| Contact info (phone, email, whatsapp) | DB seed / settings | Your contact details |

---

### What Must Stay Identical (Do NOT Change)

- Price calculation logic in `checkout/direct/route.ts` — especially the server-side price validation guard (`clientPrice >= dbProduct.price`)
- Coupon validation double-check at checkout (even if already pre-validated via apply-coupon)
- VAT calculation formula: `orderTotal - orderTotal / 1.19` (19% included in gross)
- Payment status mapping table in webhook and callback
- Invoice number generation pattern: `RE-{YEAR}-{0000}` (unless you want a different format — but keep it unique)
- Rate limiting logic
- Zod schema structure
- The retry loop for `UNIQUE` constraint on `orderNumber` and `invoiceNumber`
- `revalidatePath()` and `revalidateTag('products')` calls after product mutations

---

### What Must NOT Be Hardcoded

- Product prices — always read from DB
- Payment gateway fees — always read from `PaymentGateway.fee` in DB
- Site URL — always from `SITE_URL` ENV variable
- Contact details (phone, email, WhatsApp) — always from `getSiteSettings()`
- SMTP credentials — always from ENV
- Payment API keys — always from ENV

---

## 10. Testing Checklist

### Admin – Products

- [ ] **Product list** loads at `/admin` → Products section; shows all products with correct name, slug, price, status
- [ ] **Search** filters products by name in real time
- [ ] **Pagination** works with >20 products
- [ ] **Add product** — click "Neues Produkt", fill name only, save → product appears in list
- [ ] **Slug auto-generation** — name "Fahrzeug Ummeldung" → slug `fahrzeug-ummeldung`; umlauts converted
- [ ] **Edit product** — opens full form with all existing values; save updates correctly
- [ ] **Price option** — add option with name/price/key, save, re-open → still present
- [ ] **FAQ item** — add Q&A, save, re-open → still present
- [ ] **SEO tab** — Google preview updates as you type metaTitle/metaDescription
- [ ] **Media picker** — "Mediathek" button opens drawer; selecting image populates `featuredImage` URL field
- [ ] **isActive toggle** — set product inactive → visitor page returns 404
- [ ] **Delete product** — confirm modal → product removed from list
- [ ] **External link** — "Seite ansehen" opens correct `/product/{slug}` URL in new tab

### Visitor Website – Product Display

- [ ] `/product/fahrzeugabmeldung` loads without error; shows correct price from DB
- [ ] `/product/auto-online-anmelden` loads without error; shows correct option prices from DB
- [ ] Dynamic `/product/{slug}` — create new product in admin → page accessible at `/product/{slug}`
- [ ] Inactive product → 404 page
- [ ] FAQ accordion opens/closes correctly
- [ ] Rich content (HTML `content` field) renders correctly
- [ ] OG image shown correctly in social share preview
- [ ] JSON-LD schemas present in page source (Service, BreadcrumbList, FAQPage)
- [ ] Sitemap at `/sitemap.xml` includes product URLs

### Pricing

- [ ] Price displayed on visitor page matches DB value
- [ ] Option price displayed correctly (e.g. reservierung 4.70 €)
- [ ] `formatPrice(19.7)` → `"19,70 €"` (German format, comma not dot)
- [ ] Coupon code "invalid" → error message from `/api/apply-coupon`
- [ ] Valid percentage coupon → correct discount amount calculated
- [ ] Valid fixed coupon → correct discount amount
- [ ] Minimum order value respected
- [ ] Per-user coupon limit respected

### Checkout / Order / Payment

- [ ] Submit ServiceForm with credit card → redirected to Mollie checkout page
- [ ] Submit ServiceForm with PayPal → redirected to PayPal approval page
- [ ] Submit ServiceForm with SEPA → redirected to invoice page (`/rechnung/...`)
- [ ] After PayPal approval → capture completes → order status `processing` in DB
- [ ] After Mollie payment → callback updates order → redirect to `/bestellung-erfolgreich`
- [ ] Mollie webhook updates order status independently of callback
- [ ] Failed payment → redirect to `/zahlung-fehlgeschlagen`
- [ ] 100% coupon (free order) → no payment gateway called; order immediately `processing`; invoice email sent

### Database Persistence

- [ ] Order record created in DB with correct `productName`, `subtotal`, `total`, `paymentMethod`
- [ ] `OrderItem` created with correct product name and price
- [ ] `Payment` record created with correct `gatewayId`, `amount`, `status`
- [ ] `Invoice` created with `taxRate: 19`, correct `total`, `items` JSON
- [ ] `Customer` upserted correctly; `totalOrders` incremented
- [ ] `CouponUsage` created when coupon applied

### Production Build

- [ ] `npx tsc --noEmit` → exit 0
- [ ] `npm run build` → exit 0
- [ ] No broken product pages at build time (getAllProductSlugs returns [] on DB unavailability → graceful)

---

## 11. Risks / Issues Found

### R1 — Hardcoded `productId → slug` Mapping in Checkout API

**File:** `src/app/api/checkout/direct/route.ts` line 141

```typescript
const productSlug = isAnmeldung ? 'auto-online-anmelden' : 'fahrzeugabmeldung'
```

The checkout API only supports two products (`abmeldung` / `anmeldung`). Adding a third product requires code changes to this mapping. If the second website has different slugs, this must be updated.

**Risk level:** Medium. Affects all new products added that are not these two.

---

### R2 — Product-to-Order Relationship is Name-Only (No FK)

`Order.productId` is an optional `Int?` field (legacy from WordPress WooCommerce product IDs). New orders do not reliably set it. The actual link is via `Order.productName` (string snapshot).

This means product analytics by product ID from the `Order` table are unreliable. You cannot join `Order` to `Product` by ID.

**Risk level:** Low (reporting only, no functional impact).

---

### R3 — No Soft Delete on Products

Deleting a product is a hard `prisma.product.delete()`. If any order references that product's name (they do via snapshot), orders are unaffected. But product pages immediately 404 and the product disappears from admin.

**Mitigation:** Always set `isActive = false` instead of deleting if the product has historical orders.

**Risk level:** Low–Medium.

---

### R4 — `getProductBySlug()` Has No Cache

Unlike `getAllActiveProducts()` and `getHomepagePricing()`, `getProductBySlug()` makes a direct Prisma query on every request. With `revalidate = 60` on product pages (ISR), this is called at most once per 60 seconds per slug in production. No immediate risk, but worth monitoring under high traffic.

**Risk level:** Low.

---

### R5 — `featuredImage` on Dynamic Product Page Not Rendered as Visual `<img>`

The `featuredImage` field is stored and editable in admin, but the dynamic `/product/[slug]` page only uses it as an OG image fallback. It is **not rendered visually** on the page. If the second website expects a hero image to render on the page, extra code is needed.

**Risk level:** Low (documentation gap).

---

### R6 — Static Product Pages Contain Hardcoded Contact Details

`/product/auto-online-anmelden/page.tsx` line 329 hardcodes:
```typescript
contactPhone="+49 1522 4999190"
contactPhoneLink="tel:+4915224999190"
```

This is inconsistent with the rest of the page which uses `settings.phone` from DB. The second website developer must search for and replace all hardcoded contact values.

**Risk level:** Medium (easy to miss in replication).

---

### R7 — `SITE_URL` with Trailing Slash Causes Broken URLs

`getSiteSettings()` in `src/lib/db.ts` does `.replace(/\/$/, '')` when building canonical URLs. But `src/lib/constants.ts` guards against localhost only. If `SITE_URL` is set with a trailing slash in ENV, some URL constructions may double-slash.

**Mitigation:** Always set `SITE_URL` without trailing slash: `https://yourdomain.com`

**Risk level:** Low.

---

*End of Report*
