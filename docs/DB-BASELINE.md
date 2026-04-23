# Database Baseline — Production Schema Reference

> Generated: 2026-04-20 | Source: Turso Production
> Full DDL snapshot: [`scripts/db-baseline-snapshot.sql`](../scripts/db-baseline-snapshot.sql)

This document is the **single authoritative reference** for the production database schema.
It replaces the deleted `prisma/migrations/` folder as the historical baseline.

---

## Tables Overview

| # | Table | Purpose | Row Count | Relations |
|---|-------|---------|-----------|-----------|
| 1 | User | Admin users (dashboard login) | 1 | — |
| 2 | Customer | End customers (extracted from orders) | 1,781 | → Order, Invoice |
| 3 | Order | Service orders (Abmeldung/Anmeldung) | 2,190 | → Customer; ← OrderItem, OrderNote, Payment, Invoice, OrderDocument, OrderMessage |
| 4 | OrderItem | Line items per order | 2,216 | → Order |
| 5 | OrderNote | Internal notes on orders | 551 | → Order |
| 6 | OrderMessage | Admin↔customer communication | 16 | → Order |
| 7 | OrderDocument | PDF uploads per order | 49 | → Order |
| 8 | Payment | Payment transactions | 2,116 | → Order |
| 9 | PaymentGateway | Gateway config (PayPal, Mollie, etc.) | 5 | — |
| 10 | Invoice | Generated invoices (Rechnungen) | 2,190 | → Order, Customer |
| 11 | Product | Service products (Abmeldung, Anmeldung) | 2 | — |
| 12 | BlogPost | Blog articles (Insiderwissen) | 189 | — |
| 13 | Category | Blog categories | 27 | — |
| 14 | Tag | Blog tags | 304 | — |
| 15 | Page | Static/legal pages | 6 | — |
| 16 | Media | Image/file library | 339 | — |
| 17 | Setting | Key-value site config | 13 | — |
| 18 | EmailCampaign | Marketing email campaigns | 10 | — |
| 19 | Coupon | Discount codes | 3 | ← CouponUsage |
| 20 | CouponUsage | Coupon usage tracking | 2 | → Coupon |

---

## Column Details (Per Table)

### User

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| email | String | TEXT | NO | — | UNIQUE |
| password | String | TEXT | NO | — | bcrypt hash |
| name | String | TEXT | NO | — | |
| role | String | TEXT | NO | 'admin' | |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |
| updatedAt | DateTime | DATETIME | NO | — | Auto-updated |

### Customer

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| email | String | TEXT | NO | — | UNIQUE |
| firstName | String | TEXT | NO | '' | |
| lastName | String | TEXT | NO | '' | |
| phone | String | TEXT | NO | '' | |
| city | String | TEXT | NO | '' | Customer city (not service city) |
| postcode | String | TEXT | NO | '' | |
| address | String | TEXT | NO | '' | |
| street | String | TEXT | NO | '' | |
| country | String | TEXT | NO | 'DE' | |
| totalOrders | Int | INTEGER | NO | 0 | Denormalized count |
| totalSpent | Float | REAL | NO | 0 | Denormalized sum |
| password | String? | TEXT | YES | null | Optional customer login |
| emailSubscribed | Boolean | INTEGER | NO | 1 | ⚠ SQLite stores as INTEGER |
| unsubscribeToken | String | TEXT | NO | '' | |
| lastLoginAt | DateTime? | DATETIME | YES | null | |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |
| updatedAt | DateTime | DATETIME | NO | — | |

### Order

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| orderNumber | Int | INTEGER | NO | — | UNIQUE, sequential |
| wpOrderId | Int? | INTEGER | YES | null | UNIQUE, legacy WP ref |
| status | String | TEXT | NO | 'pending' | pending/processing/completed/cancelled/refunded |
| total | Float | REAL | NO | 0 | |
| subtotal | Float | REAL | NO | 0 | |
| paymentFee | Float | REAL | NO | 0 | |
| discountAmount | Float | REAL | NO | 0 | |
| couponCode | String | TEXT | NO | '' | |
| currency | String | TEXT | NO | 'EUR' | |
| paymentMethod | String | TEXT | NO | '' | |
| paymentTitle | String | TEXT | NO | '' | |
| transactionId | String | TEXT | NO | '' | |
| billingEmail | String | TEXT | NO | '' | |
| billingPhone | String | TEXT | NO | '' | |
| billingFirst | String | TEXT | NO | '' | |
| billingLast | String | TEXT | NO | '' | |
| billingStreet | String | TEXT | NO | '' | |
| billingCity | String | TEXT | NO | '' | |
| billingPostcode | String | TEXT | NO | '' | |
| serviceData | String | TEXT | NO | '{}' | JSON: license plate, service details |
| productName | String | TEXT | NO | '' | |
| productId | Int? | INTEGER | YES | null | |
| customerId | String? | TEXT | YES | null | FK → Customer |
| datePaid | DateTime? | DATETIME | YES | null | |
| dateCompleted | DateTime? | DATETIME | YES | null | |
| completionEmailSent | Boolean | INTEGER | NO | 0 | ⚠ SQLite stores as INTEGER |
| deletedAt | DateTime? | DATETIME | YES | null | Soft delete |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |
| updatedAt | DateTime | DATETIME | NO | — | |

### OrderItem

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| orderId | String | TEXT | NO | — | FK → Order (CASCADE) |
| productName | String | TEXT | NO | — | |
| productId | Int? | INTEGER | YES | null | |
| quantity | Int | INTEGER | NO | 1 | |
| price | Float | REAL | NO | 0 | |
| total | Float | REAL | NO | 0 | |

### OrderNote

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| orderId | String | TEXT | NO | — | FK → Order (CASCADE) |
| note | String | TEXT | NO | — | |
| author | String | TEXT | NO | 'system' | |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |

### OrderMessage

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| orderId | String | TEXT | NO | — | FK → Order (CASCADE) |
| message | String | TEXT | NO | — | |
| attachments | String | TEXT | NO | '[]' | JSON array |
| sentBy | String | TEXT | NO | 'admin' | |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |

### OrderDocument

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| orderId | String | TEXT | NO | — | FK → Order (CASCADE) |
| fileName | String | TEXT | NO | — | |
| fileUrl | String | TEXT | NO | — | |
| fileSize | Int | INTEGER | NO | 0 | |
| token | String | TEXT | NO | cuid() | UNIQUE, download token |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |

### Payment

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| orderId | String | TEXT | NO | — | FK → Order (CASCADE) |
| gatewayId | String | TEXT | NO | — | |
| transactionId | String | TEXT | NO | '' | |
| amount | Float | REAL | NO | — | |
| currency | String | TEXT | NO | 'EUR' | |
| status | String | TEXT | NO | 'pending' | |
| method | String | TEXT | NO | '' | |
| providerData | String | TEXT | NO | '{}' | JSON: raw gateway response |
| paidAt | DateTime? | DATETIME | YES | null | |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |
| updatedAt | DateTime | DATETIME | NO | — | |

### PaymentGateway

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| gatewayId | String | TEXT | NO | — | UNIQUE (e.g. 'paypal', 'mollie') |
| name | String | TEXT | NO | — | |
| description | String | TEXT | NO | '' | |
| isEnabled | Boolean | BOOLEAN | NO | false | |
| fee | Float | REAL | NO | 0 | |
| apiKey | String | TEXT | NO | '' | |
| secretKey | String | TEXT | NO | '' | |
| mode | String | TEXT | NO | 'live' | |
| icon | String | TEXT | NO | '' | |
| sortOrder | Int | INTEGER | NO | 0 | |
| settings | String | TEXT | NO | '{}' | JSON config |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |
| updatedAt | DateTime | DATETIME | NO | — | |

### Invoice

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| invoiceNumber | String | TEXT | NO | — | UNIQUE (e.g. 'RE-2026-0001') |
| orderId | String | TEXT | NO | — | FK → Order (CASCADE) |
| customerId | String? | TEXT | YES | null | FK → Customer (SET NULL) |
| billingName | String | TEXT | NO | '' | Snapshot from order |
| billingEmail | String | TEXT | NO | '' | |
| billingAddress | String | TEXT | NO | '' | |
| billingCity | String | TEXT | NO | '' | |
| billingPostcode | String | TEXT | NO | '' | |
| billingCountry | String | TEXT | NO | 'DE' | |
| companyName | String | TEXT | NO | '' | |
| companyTaxId | String | TEXT | NO | '' | |
| items | String | TEXT | NO | '[]' | JSON line items |
| subtotal | Float | REAL | NO | 0 | |
| taxRate | Float | REAL | NO | 19 | |
| taxAmount | Float | REAL | NO | 0 | |
| total | Float | REAL | NO | 0 | |
| paymentMethod | String | TEXT | NO | '' | |
| paymentStatus | String | TEXT | NO | 'pending' | |
| transactionId | String | TEXT | NO | '' | |
| pdfUrl | String | TEXT | NO | '' | |
| invoiceDate | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |
| dueDate | DateTime? | DATETIME | YES | null | |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |
| updatedAt | DateTime | DATETIME | NO | — | |

### Product

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| wpProductId | Int? | INTEGER | YES | null | UNIQUE, legacy WP ref |
| name | String | TEXT | NO | — | |
| slug | String | TEXT | NO | — | UNIQUE |
| description | String | TEXT | NO | '' | |
| price | Float | REAL | NO | 0 | |
| isActive | Boolean | BOOLEAN | NO | true | |
| serviceType | String | TEXT | NO | '' | |
| options | String | TEXT | NO | '[]' | JSON |
| content | String | TEXT | NO | '' | Rich HTML content |
| heroTitle | String | TEXT | NO | '' | |
| heroSubtitle | String | TEXT | NO | '' | |
| featuredImage | String | TEXT | NO | '' | |
| faqItems | String | TEXT | NO | '[]' | JSON FAQ array |
| metaTitle | String | TEXT | NO | '' | |
| metaDescription | String | TEXT | NO | '' | |
| canonical | String | TEXT | NO | '' | |
| robots | String | TEXT | NO | 'index, follow' | |
| ogTitle | String | TEXT | NO | '' | |
| ogDescription | String | TEXT | NO | '' | |
| ogImage | String | TEXT | NO | '' | |
| formType | String | TEXT | NO | '' | 'abmeldung' or 'anmeldung' |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |
| updatedAt | DateTime | DATETIME | NO | — | |

### BlogPost

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| wpPostId | Int? | INTEGER | YES | null | UNIQUE, legacy WP ref |
| slug | String | TEXT | NO | — | UNIQUE |
| title | String | TEXT | NO | — | |
| content | String | TEXT | NO | — | HTML |
| excerpt | String | TEXT | NO | '' | |
| featuredImage | String | TEXT | NO | '' | |
| featuredImageId | String | TEXT | NO | '' | Media library ref |
| status | String | TEXT | NO | 'draft' | draft/published/scheduled |
| author | String | TEXT | NO | 'Admin' | |
| metaTitle | String | TEXT | NO | '' | |
| metaDescription | String | TEXT | NO | '' | |
| focusKeyword | String | TEXT | NO | '' | |
| canonical | String | TEXT | NO | '' | |
| robots | String | TEXT | NO | 'index, follow' | |
| ogTitle | String | TEXT | NO | '' | |
| ogDescription | String | TEXT | NO | '' | |
| ogImage | String | TEXT | NO | '' | |
| category | String | TEXT | NO | '' | |
| tags | String | TEXT | NO | '' | |
| views | Int | INTEGER | NO | 0 | |
| scheduledAt | DateTime? | DATETIME | YES | null | |
| publishedAt | DateTime? | DATETIME | YES | null | |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |
| updatedAt | DateTime | DATETIME | NO | — | |

### Category

| Column | Prisma Type | DB Type | Nullable | Default |
|--------|-------------|---------|----------|---------|
| id | String | TEXT | NO | cuid() |
| wpCatId | Int? | INTEGER | YES | null |
| name | String | TEXT | NO | — |
| slug | String | TEXT | NO | — |
| description | String | TEXT | NO | '' |
| count | Int | INTEGER | NO | 0 |
| parent | Int | INTEGER | NO | 0 |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP |
| updatedAt | DateTime | DATETIME | NO | — |

### Tag

| Column | Prisma Type | DB Type | Nullable | Default |
|--------|-------------|---------|----------|---------|
| id | String | TEXT | NO | cuid() |
| wpTagId | Int? | INTEGER | YES | null |
| name | String | TEXT | NO | — |
| slug | String | TEXT | NO | — |
| description | String | TEXT | NO | '' |
| count | Int | INTEGER | NO | 0 |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP |
| updatedAt | DateTime | DATETIME | NO | — |

### Page

| Column | Prisma Type | DB Type | Nullable | Default |
|--------|-------------|---------|----------|---------|
| id | String | TEXT | NO | cuid() |
| wpPageId | Int? | INTEGER | YES | null |
| slug | String | TEXT | NO | — |
| title | String | TEXT | NO | — |
| content | String | TEXT | NO | — |
| excerpt | String | TEXT | NO | '' |
| status | String | TEXT | NO | 'draft' |
| author | String | TEXT | NO | 'iKFZ-Team' |
| template | String | TEXT | NO | '' |
| parent | Int | INTEGER | NO | 0 |
| menuOrder | Int | INTEGER | NO | 0 |
| featuredImage | String | TEXT | NO | '' |
| metaTitle | String | TEXT | NO | '' |
| metaDescription | String | TEXT | NO | '' |
| focusKeywords | String | TEXT | NO | '' |
| seoScore | Int | INTEGER | NO | 0 |
| canonical | String | TEXT | NO | '' |
| robots | String | TEXT | NO | 'index, follow' |
| schemaType | String | TEXT | NO | '' |
| schemaData | String | TEXT | NO | '' |
| ogTitle | String | TEXT | NO | '' |
| ogDescription | String | TEXT | NO | '' |
| ogImage | String | TEXT | NO | '' |
| ogType | String | TEXT | NO | 'article' |
| twitterTitle | String | TEXT | NO | '' |
| twitterDescription | String | TEXT | NO | '' |
| twitterImage | String | TEXT | NO | '' |
| twitterCard | String | TEXT | NO | 'summary_large_image' |
| internalLinks | Int | INTEGER | NO | 0 |
| externalLinks | Int | INTEGER | NO | 0 |
| isFooterPage | Boolean | BOOLEAN | NO | false |
| pageType | String | TEXT | NO | 'page' |
| publishedAt | DateTime? | DATETIME | YES | null |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP |
| updatedAt | DateTime | DATETIME | NO | — |

### Media

| Column | Prisma Type | DB Type | Nullable | Default |
|--------|-------------|---------|----------|---------|
| id | String | TEXT | NO | cuid() |
| wpMediaId | Int? | INTEGER | YES | null |
| fileName | String | TEXT | NO | '' |
| originalName | String | TEXT | NO | '' |
| title | String | TEXT | NO | '' |
| altText | String | TEXT | NO | '' |
| sourceUrl | String | TEXT | NO | — |
| localPath | String | TEXT | NO | '' |
| thumbnailUrl | String | TEXT | NO | '' |
| mediumUrl | String | TEXT | NO | '' |
| largeUrl | String | TEXT | NO | '' |
| webpUrl | String | TEXT | NO | '' |
| avifUrl | String | TEXT | NO | '' |
| mimeType | String | TEXT | NO | '' |
| width | Int | INTEGER | NO | 0 |
| height | Int | INTEGER | NO | 0 |
| fileSize | Int | INTEGER | NO | 0 |
| folder | String | TEXT | NO | '' |
| usedIn | String | TEXT | NO | '[]' |
| useCount | Int | INTEGER | NO | 0 |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP |
| updatedAt | DateTime | DATETIME | NO | — |

### Setting

| Column | Prisma Type | DB Type | Nullable | Default |
|--------|-------------|---------|----------|---------|
| id | String | TEXT | NO | cuid() |
| key | String | TEXT | NO | — |
| value | String | TEXT | NO | '' |
| group | String | TEXT | NO | 'general' |

### EmailCampaign

| Column | Prisma Type | DB Type | Nullable | Default |
|--------|-------------|---------|----------|---------|
| id | String | TEXT | NO | cuid() |
| name | String | TEXT | NO | — |
| subject | String | TEXT | NO | '' |
| heading | String | TEXT | NO | '' |
| content | String | TEXT | NO | '' |
| imageUrl | String | TEXT | NO | '' |
| ctaText | String | TEXT | NO | '' |
| ctaUrl | String | TEXT | NO | '' |
| targetMode | String | TEXT | NO | 'all' |
| targetEmails | String | TEXT | NO | '' |
| targetSegment | String | TEXT | NO | '' |
| scheduledAt | DateTime? | DATETIME | YES | null |
| openCount | Int | INTEGER | NO | 0 |
| clickCount | Int | INTEGER | NO | 0 |
| templateId | String | TEXT | NO | '' |
| status | String | TEXT | NO | 'draft' |
| totalRecipients | Int | INTEGER | NO | 0 |
| sentCount | Int | INTEGER | NO | 0 |
| failedCount | Int | INTEGER | NO | 0 |
| errorLog | String | TEXT | NO | '' |
| sentAt | DateTime? | DATETIME | YES | null |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP |
| updatedAt | DateTime | DATETIME | NO | — |

### Coupon

| Column | Prisma Type | DB Type | Nullable | Default | Notes |
|--------|-------------|---------|----------|---------|-------|
| id | String | TEXT | NO | cuid() | PK |
| code | String | TEXT | NO | — | UNIQUE |
| description | String | TEXT | NO | '' | |
| discountType | String | TEXT | NO | 'fixed' | fixed or percentage |
| discountValue | Float | REAL | NO | 0 | |
| minOrderValue | Float | REAL | NO | 0 | |
| maxUsageTotal | Int | INTEGER | NO | 0 | 0 = unlimited |
| maxUsagePerUser | Int | INTEGER | NO | 1 | |
| usageCount | Int | INTEGER | NO | 0 | |
| productSlugs | String | TEXT | NO | '' | |
| isActive | Boolean | INTEGER | NO | 1 | ⚠ SQLite stores as INTEGER |
| showBanner | Boolean | INTEGER | NO | 0 | ⚠ SQLite stores as INTEGER |
| bannerText | String | TEXT | NO | '' | |
| startDate | DateTime? | DATETIME | YES | null | |
| endDate | DateTime? | DATETIME | YES | null | |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP | |
| updatedAt | DateTime | DATETIME | NO | — | |

### CouponUsage

| Column | Prisma Type | DB Type | Nullable | Default |
|--------|-------------|---------|----------|---------|
| id | String | TEXT | NO | cuid() |
| couponId | String | TEXT | NO | — |
| email | String | TEXT | NO | — |
| orderId | String? | TEXT | YES | null |
| createdAt | DateTime | DATETIME | NO | CURRENT_TIMESTAMP |

---

## Indexes (70 total)

### Order Indexes (9)

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| Order_orderNumber_key | orderNumber | UNIQUE | Fast lookup by order number |
| Order_wpOrderId_key | wpOrderId | UNIQUE | Legacy WP order sync |
| Order_status_idx | status | INDEX | Admin filter by status |
| Order_billingEmail_idx | billingEmail | INDEX | Customer order lookup |
| Order_createdAt_idx | createdAt | INDEX | Date range queries |
| Order_deletedAt_idx | deletedAt | INDEX | Soft-delete filter |
| Order_deletedAt_status_idx | deletedAt, status | INDEX | Active orders by status |
| Order_deletedAt_createdAt_idx | deletedAt, createdAt | INDEX | Active orders by date |
| Order_deletedAt_status_createdAt_idx | deletedAt, status, createdAt | INDEX | Admin dashboard: active orders filtered + sorted |

### Invoice Indexes (7)

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| Invoice_invoiceNumber_key | invoiceNumber | UNIQUE | Invoice lookup |
| Invoice_orderId_idx | orderId | INDEX | Invoices per order |
| Invoice_customerId_idx | customerId | INDEX | Invoices per customer |
| Invoice_invoiceDate_idx | invoiceDate | INDEX | Date range |
| Invoice_paymentStatus_idx | paymentStatus | INDEX | Status filter |
| Invoice_billingEmail_idx | billingEmail | INDEX | Email search |
| Invoice_createdAt_idx | createdAt | INDEX | Date sort |

### BlogPost Indexes (8)

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| BlogPost_slug_key | slug | UNIQUE | URL routing |
| BlogPost_wpPostId_key | wpPostId | UNIQUE | Legacy WP sync |
| BlogPost_slug_idx | slug | INDEX | Redundant (slug_key covers) |
| BlogPost_status_idx | status | INDEX | Published/draft filter |
| BlogPost_publishedAt_idx | publishedAt | INDEX | Date sort |
| BlogPost_status_scheduledAt_idx | status, scheduledAt | INDEX | Scheduled publish cron |
| BlogPost_createdAt_idx | createdAt | INDEX | Admin sort |
| BlogPost_status_createdAt_idx | status, createdAt | INDEX | Published posts sorted |

### Customer Indexes (4)

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| Customer_email_key | email | UNIQUE | Login + dedup |
| Customer_createdAt_idx | createdAt | INDEX | Admin sort |
| Customer_firstName_lastName_idx | firstName, lastName | INDEX | Name search |
| Customer_emailSubscribed_idx | emailSubscribed | INDEX | Campaign targeting |

### Payment Indexes (2)

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| Payment_orderId_idx | orderId | INDEX | Payments per order |
| Payment_status_idx | status | INDEX | Status filter |

### Other Indexes

| Index | Table | Type |
|-------|-------|------|
| PaymentGateway_gatewayId_key | PaymentGateway | UNIQUE |
| Product_slug_key, Product_wpProductId_key | Product | UNIQUE |
| Product_createdAt_idx, Product_isActive_idx, Product_serviceType_idx | Product | INDEX |
| Category_slug_key, Category_wpCatId_key, Category_slug_idx | Category | UNIQUE/INDEX |
| Tag_slug_key, Tag_wpTagId_key, Tag_slug_idx | Tag | UNIQUE/INDEX |
| Page_slug_key, Page_wpPageId_key, Page_slug_idx, Page_status_idx, Page_seoScore_idx | Page | UNIQUE/INDEX |
| Media_wpMediaId_key, Media_fileName_idx, Media_createdAt_idx, Media_folder_idx, Media_mimeType_idx, Media_useCount_idx | Media | UNIQUE/INDEX |
| EmailCampaign_status_idx, EmailCampaign_createdAt_idx, EmailCampaign_scheduledAt_idx | EmailCampaign | INDEX |
| Coupon_code_key, Coupon_code_idx, Coupon_isActive_idx, Coupon_endDate_idx | Coupon | UNIQUE/INDEX |
| CouponUsage_couponId_email_key, CouponUsage_couponId_idx, CouponUsage_email_idx | CouponUsage | UNIQUE/INDEX |
| OrderDocument_token_key, OrderDocument_orderId_idx | OrderDocument | UNIQUE/INDEX |
| OrderMessage_orderId_idx, OrderMessage_createdAt_idx | OrderMessage | INDEX |
| Setting_key_key, Setting_group_idx | Setting | UNIQUE/INDEX |
| User_email_key | User | UNIQUE |

---

## Foreign Key Constraints

| Source | Column | Target | On Delete |
|--------|--------|--------|-----------|
| Order | customerId | Customer.id | SET NULL |
| OrderItem | orderId | Order.id | CASCADE |
| OrderNote | orderId | Order.id | CASCADE |
| OrderMessage | orderId | Order.id | CASCADE |
| OrderDocument | orderId | Order.id | CASCADE |
| Payment | orderId | Order.id | CASCADE |
| Invoice | orderId | Order.id | CASCADE |
| Invoice | customerId | Customer.id | SET NULL |
| CouponUsage | couponId | Coupon.id | CASCADE |

---

## Known Deviations & Notes

### SQLite Boolean Handling

SQLite has no native BOOLEAN type. Prisma `Boolean` fields are stored as `INTEGER`:
- `true` → `1`, `false` → `0`
- Prisma's query engine handles coercion transparently
- Affected columns: `Coupon.isActive`, `Coupon.showBanner`, `Customer.emailSubscribed`, `Order.completionEmailSent`
- `Page.isFooterPage` and `PaymentGateway.isEnabled` use `BOOLEAN` affinity in DDL but store as INTEGER internally

### Redundant Indexes

- `Invoice_invoiceNumber_idx` exists in Prisma schema but not in production — this is harmless because `Invoice_invoiceNumber_key` (UNIQUE) already covers the same column
- `BlogPost_slug_idx` is redundant with `BlogPost_slug_key` (UNIQUE)
- `Category_slug_idx`, `Tag_slug_idx` — same pattern

### Primary Keys

All tables use `TEXT` primary keys with CUID values generated by Prisma.
