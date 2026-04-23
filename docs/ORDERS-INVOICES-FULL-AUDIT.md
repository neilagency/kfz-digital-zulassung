# 📋 تقرير تقني شامل: نظام الطلبات والفواتير (Orders & Invoices Full System Audit)

> **تاريخ التقرير:** 2026-04-03  
> **المشروع:** Online Auto Abmelden (Next.js 14 + Prisma + SQLite)  
> **الهدف:** توثيق كامل لنظام الطلبات والفواتير لإعادة بنائه في مشروع آخر بنسبة 100%

---

## جدول المحتويات

1. [هيكل قاعدة البيانات (Database Structure)](#1-هيكل-قاعدة-البيانات)
2. [نظام الطلبات (Order System)](#2-نظام-الطلبات)
3. [حالات الطلب (Order States)](#3-حالات-الطلب)
4. [نظام الفواتير (Invoice System)](#4-نظام-الفواتير)
5. [العلاقة بين Orders و Invoices](#5-العلاقة-بين-orders-و-invoices)
6. [نظام الدفع (Payment Flow)](#6-نظام-الدفع)
7. [API Layer](#7-api-layer)
8. [Admin Dashboard Logic](#8-admin-dashboard-logic)
9. [Business Logic & Edge Cases](#9-business-logic--edge-cases)
10. [End-to-End Flow](#10-end-to-end-flow)
11. [System Architecture Summary](#11-system-architecture-summary)
12. [Flow Diagram (نصي)](#12-flow-diagram)
13. [Data Model](#13-data-model)
14. [Migration Guide](#14-migration-guide)

---

## 1. هيكل قاعدة البيانات

### 1.1 الجداول المرتبطة بالنظام

| الجدول | الوصف | الملف |
|--------|-------|-------|
| `Order` | الطلبات الأساسية | `prisma/schema.prisma` |
| `OrderItem` | عناصر الطلب (المنتجات) | `prisma/schema.prisma` |
| `OrderNote` | ملاحظات النظام/الأدمن على الطلب | `prisma/schema.prisma` |
| `OrderMessage` | رسائل بين الأدمن والعميل | `prisma/schema.prisma` |
| `OrderDocument` | ملفات PDF مرفوعة من الأدمن | `prisma/schema.prisma` |
| `Invoice` | الفواتير (Rechnungen) | `prisma/schema.prisma` |
| `Payment` | سجلات الدفع/المعاملات | `prisma/schema.prisma` |
| `Customer` | العملاء | `prisma/schema.prisma` |
| `PaymentGateway` | إعدادات بوابات الدفع | `prisma/schema.prisma` |
| `Coupon` | كوبونات الخصم | `prisma/schema.prisma` |
| `CouponUsage` | تتبع استخدام الكوبونات | `prisma/schema.prisma` |

### 1.2 جدول Order (الطلب)

```
Order
├── id              String   @id @default(cuid())
├── orderNumber     Int      @unique              ← رقم الطلب المتسلسل
├── wpOrderId       Int?     @unique              ← معرف WooCommerce (للبيانات المهاجرة فقط)
├── status          String   @default("pending")  ← حالة الطلب
├── total           Float    @default(0)           ← المبلغ الإجمالي (شامل الرسوم والخصم)
├── subtotal        Float    @default(0)           ← سعر المنتج قبل الرسوم
├── paymentFee      Float    @default(0)           ← رسوم بوابة الدفع
├── discountAmount  Float    @default(0)           ← مبلغ الخصم (كوبون)
├── couponCode      String   @default("")          ← كود الكوبون المستخدم
├── currency        String   @default("EUR")
├── paymentMethod   String   @default("")          ← معرف بوابة الدفع (mollie, paypal, sepa)
├── paymentTitle    String   @default("")          ← اسم طريقة الدفع للعرض
├── transactionId   String   @default("")          ← معرف المعاملة من المزود
├── billingEmail    String   @default("")
├── billingPhone    String   @default("")
├── billingFirst    String   @default("")
├── billingLast     String   @default("")
├── billingStreet   String   @default("")
├── billingCity     String   @default("")
├── billingPostcode String   @default("")
├── serviceData     String   @default("{}")        ← بيانات الخدمة (JSON): كينزايخن، FIN، إلخ
├── productName     String   @default("")
├── productId       Int?
├── customerId      String?                        ← FK → Customer
├── datePaid        DateTime?                      ← تاريخ الدفع
├── dateCompleted   DateTime?                      ← تاريخ الإكمال
├── completionEmailSent Boolean @default(false)    ← هل تم إرسال إيميل الإكمال
├── deletedAt       DateTime?                      ← Soft delete
├── createdAt       DateTime @default(now())
├── updatedAt       DateTime @updatedAt
│
├── Relations:
│   ├── customer    → Customer (optional)
│   ├── items       → OrderItem[] (1:N)
│   ├── notes       → OrderNote[] (1:N)
│   ├── payments    → Payment[] (1:N)
│   ├── invoices    → Invoice[] (1:N)
│   ├── documents   → OrderDocument[] (1:N)
│   └── messages    → OrderMessage[] (1:N)
│
└── Indexes:
    ├── @@index([status])
    ├── @@index([billingEmail])
    ├── @@index([createdAt])
    ├── @@index([deletedAt])
    ├── @@index([deletedAt, status])
    └── @@index([deletedAt, createdAt])
```

### 1.3 جدول Invoice (الفاتورة)

```
Invoice
├── id              String    @id @default(cuid())
├── invoiceNumber   String    @unique              ← رقم الفاتورة (RE-YYYY-NNNN)
├── orderId         String                         ← FK → Order
├── customerId      String?                        ← FK → Customer
│
├── ─── Billing Snapshot ───
├── billingName     String    @default("")
├── billingEmail    String    @default("")
├── billingAddress  String    @default("")
├── billingCity     String    @default("")
├── billingPostcode String    @default("")
├── billingCountry  String    @default("DE")
│
├── ─── Company (B2B) ───
├── companyName     String    @default("")
├── companyTaxId    String    @default("")
│
├── ─── Items ───
├── items           String    @default("[]")       ← JSON array of line items
│
├── ─── Amounts ───
├── subtotal        Float     @default(0)
├── taxRate         Float     @default(19)         ← نسبة MwSt
├── taxAmount       Float     @default(0)          ← مبلغ الضريبة
├── total           Float     @default(0)
│
├── ─── Payment ───
├── paymentMethod   String    @default("")
├── paymentStatus   String    @default("pending")  ← paid | pending | refunded | cancelled
├── transactionId   String    @default("")
│
├── pdfUrl          String    @default("")         ← رابط PDF المُولَّد
├── invoiceDate     DateTime  @default(now())
├── dueDate         DateTime?
├── createdAt       DateTime  @default(now())
├── updatedAt       DateTime  @updatedAt
│
├── Relations:
│   ├── order    → Order
│   └── customer → Customer (optional)
│
└── Indexes:
    ├── @@index([orderId])
    ├── @@index([customerId])
    ├── @@index([invoiceDate])
    ├── @@index([paymentStatus])
    ├── @@index([billingEmail])
    ├── @@index([invoiceNumber])
    └── @@index([createdAt])
```

### 1.4 جدول Payment (المعاملة)

```
Payment
├── id            String    @id @default(cuid())
├── orderId       String                           ← FK → Order
├── gatewayId     String                           ← معرف بوابة الدفع
├── transactionId String    @default("")           ← معرف من المزود (tr_xxx, capture ID)
├── amount        Float
├── currency      String    @default("EUR")
├── status        String    @default("pending")    ← pending|paid|failed|cancelled|expired|refunded|partially_refunded
├── method        String    @default("")           ← اسم طريقة الدفع
├── providerData  String    @default("{}")         ← بيانات المزود كاملة (JSON)
├── paidAt        DateTime?
├── createdAt     DateTime  @default(now())
├── updatedAt     DateTime  @updatedAt
│
├── Relations:
│   └── order → Order
│
└── Indexes:
    ├── @@index([orderId])
    └── @@index([status])
```

### 1.5 جدول Customer (العميل)

```
Customer
├── id               String    @id @default(cuid())
├── email            String    @unique
├── firstName        String    @default("")
├── lastName         String    @default("")
├── phone            String    @default("")
├── city             String    @default("")
├── postcode         String    @default("")
├── address          String    @default("")
├── street           String    @default("")
├── country          String    @default("DE")
├── totalOrders      Int       @default(0)         ← عداد إجمالي الطلبات
├── totalSpent       Float     @default(0)         ← إجمالي المدفوعات
├── password         String?
├── emailSubscribed  Boolean   @default(true)
├── unsubscribeToken String    @default("")
├── lastLoginAt      DateTime?
│
├── Relations:
│   ├── orders   → Order[] (1:N)
│   └── invoices → Invoice[] (1:N)
│
└── Indexes:
    ├── @@index([createdAt])
    ├── @@index([firstName, lastName])
    └── @@index([emailSubscribed])
```

### 1.6 الجداول المساعدة

```
OrderItem
├── id          String @id
├── orderId     String → FK Order (onDelete: Cascade)
├── productName String
├── productId   Int?
├── quantity    Int    @default(1)
├── price       Float  @default(0)
└── total       Float  @default(0)

OrderNote
├── id        String   @id
├── orderId   String   → FK Order (onDelete: Cascade)
├── note      String
├── author    String   @default("system")  ← "system" | "Admin" | "System"
└── createdAt DateTime @default(now())

OrderMessage (رسائل Admin → Customer)
├── id          String   @id
├── orderId     String   → FK Order (onDelete: Cascade)
├── message     String
├── attachments String   @default("[]")    ← JSON array of file URLs
├── sentBy      String   @default("admin")
└── createdAt   DateTime

OrderDocument (PDFs مرفوعة من Admin)
├── id        String   @id
├── orderId   String   → FK Order (onDelete: Cascade)
├── fileName  String
├── fileUrl   String
├── fileSize  Int      @default(0)
├── token     String   @unique @default(cuid())  ← للوصول الآمن بدون auth
└── createdAt DateTime

PaymentGateway
├── id          String   @id
├── gatewayId   String   @unique    ← "mollie_creditcard", "paypal", "sepa"
├── name        String
├── description String
├── isEnabled   Boolean
├── fee         Float    @default(0)  ← رسوم البوابة
├── apiKey      String
├── secretKey   String
├── mode        String   @default("live")
├── icon        String
├── sortOrder   Int
└── settings    String   @default("{}")
```

### 1.7 مخطط العلاقات (ER Diagram)

```
Customer (1) ──────< (N) Order (1) ──────< (N) OrderItem
                         │
                         ├──────< (N) OrderNote
                         │
                         ├──────< (N) OrderMessage
                         │
                         ├──────< (N) OrderDocument
                         │
                         ├──────< (N) Payment
                         │
                         └──────< (N) Invoice
                                       │
Customer (1) ──────────────────< (N) Invoice
```

---

## 2. نظام الطلبات (Order System)

### 2.1 إنشاء الطلب (Create Order)

**الملف الرئيسي:** `src/app/api/checkout/direct/route.ts`  
**Endpoint:** `POST /api/checkout/direct`

#### خطوات إنشاء الطلب بالترتيب:

```
1. Rate Limiting (8 req/min per IP)
   └── src/lib/rate-limit.ts → getClientIP() + rateLimit()

2. Zod Validation
   └── src/lib/validations.ts → checkoutDirectSchema

3. التحقق من طريقة الدفع
   └── SEPA | PayPal | Mollie method check

4. BATCH 1 (متوازي - Promise.all):
   ├── gateway   ← getPaymentGatewayByCheckoutId(paymentMethod)
   ├── product   ← prisma.product.findUnique({ slug })
   ├── maxOrder  ← prisma.order.findFirst({ orderBy: orderNumber desc })
   └── lastInv   ← prisma.invoice.findFirst({ invoiceNumber starts with RE-YYYY- })

5. حساب الأسعار:
   ├── productPrice  = DB price (مع قبول سعر العميل إن كان أعلى)
   ├── paymentFee    = gateway.fee
   ├── discountAmount = حساب الكوبون (server-side)
   └── orderTotal     = max(productPrice - discount + fee, 0)

6. Coupon Validation (إن وجد):
   ├── التحقق من isActive
   ├── التحقق من startDate / endDate
   ├── التحقق من maxUsageTotal / usageCount
   ├── التحقق من maxUsagePerUser (per email)
   ├── التحقق من productSlugs (product restriction)
   ├── التحقق من minOrderValue
   └── حساب الخصم (percentage أو fixed)

7. Customer Upsert:
   └── prisma.customer.upsert({ email }) 
       ├── إن وجد: increment totalOrders + totalSpent
       └── إن لم يوجد: إنشاء عميل جديد

8. Order Creation (مع retry حتى 5 محاولات):
   └── prisma.order.create({ orderNumber: nextOrderNum, status: "pending", ... })
       ├── عند UNIQUE conflict على orderNumber: إعادة جلب max + retry
       └── يتم ربط customerId بعد الإنشاء عبر update

9. BATCH 3 (متوازي):
   ├── prisma.orderItem.createMany(items)
   ├── prisma.payment.create({ status: "pending", gatewayId, amount })
   └── prisma.invoice.create({ invoiceNumber, paymentStatus: "pending" })
       └── مع retry حتى 5 محاولات لل invoiceNumber

10. Coupon Usage Recording (إن وجد):
    ├── prisma.couponUsage.create()
    └── prisma.coupon.update({ usageCount: increment })

11. Payment Routing (حسب طريقة الدفع):
    ├── FREE (total = 0):  → status="processing", payment="paid", email sent
    ├── SEPA:               → status="on-hold", email sent, return invoiceUrl
    ├── PayPal:             → createPayPalOrder(), return approvalUrl
    └── Mollie:             → createMolliePayment/Order(), return checkoutUrl
```

#### الحقول المطلوبة من العميل (Zod Schema):

```typescript
{
  firstName?: string (max 100),
  lastName?: string (max 100),
  company?: string (max 200),
  street?: string (max 200),
  postcode?: string (max 10),
  city?: string (max 100),
  phone: string (min 6, max 30, regex: digits/+/-/spaces),  // مطلوب
  email: string (valid email, max 255),                      // مطلوب
  paymentMethod: string (min 1),                             // مطلوب
  productId?: string (default: "abmeldung"),
  productPrice?: string,
  serviceData?: Record<string, any>,
  couponCode?: string (max 50)
}
```

### 2.2 تحديث الطلب (Update Order)

**الملف:** `src/app/api/admin/orders/[id]/route.ts`  
**Endpoint:** `PATCH /api/admin/orders/{id}`  
**الصلاحية:** Admin فقط

```typescript
// المدخلات
{ status?: string, note?: string }

// المنطق:
1. تحديث status في Order
2. إن كان status = "completed" أو "processing":
   → تعيين datePaid إن لم يكن موجودًا
3. مزامنة Payment status تلقائيًا:
   ├── completed/processing → payment.status = "paid"
   ├── cancelled → payment.status = "cancelled"
   └── refunded → payment.status = "refunded"
4. مزامنة Invoice paymentStatus (نفس المنطق)
5. إنشاء OrderNote تلقائي: "Status geändert zu: {status}"
6. إن كان note محدد → إنشاء OrderNote إضافي
7. إن كان status = "completed":
   → sendCompletionEmail(orderId) ← إرسال إيميل الإكمال
```

### 2.3 حذف الطلب (Delete Order)

**النوع:** Soft Delete فقط (لا يوجد hard delete)

```typescript
// Endpoint: DELETE /api/admin/orders/{id}
// المنطق:
1. التحقق من وجود الطلب
2. التحقق أنه غير محذوف مسبقًا
3. تعيين deletedAt = now() + status = "deleted"
4. إنشاء OrderNote: "Order gelöscht (soft delete)..."

// Bulk Delete: POST /api/admin/orders
// body: { action: "delete", ids: string[] }
// → prisma.order.updateMany({ deletedAt: new Date() })
```

### 2.4 عمليات الطلب الجماعية (Bulk Operations)

```typescript
// Endpoint: POST /api/admin/orders
// body: { action: "delete" | "status", ids: string[], status?: string }
// الحد الأقصى: 100 عنصر لكل عملية

// Actions:
├── "delete" → soft delete (updateMany deletedAt)
└── "status" → تغيير الحالة
    └── الحالات المسموحة: pending, processing, completed, on-hold, cancelled, refunded
```

---

## 3. حالات الطلب (Order States)

### 3.1 جميع الحالات

| الحالة | الوصف | متى تُستخدم |
|--------|-------|-------------|
| `pending` | في انتظار الدفع | عند إنشاء الطلب (الحالة الأولية) |
| `on-hold` | معلق | SEPA (بانتظار التحويل) أو فشل إنشاء الدفع |
| `processing` | قيد المعالجة | بعد نجاح الدفع |
| `completed` | مكتمل | بعد إنهاء الخدمة (يدوي من Admin) |
| `cancelled` | ملغي | فشل/إلغاء الدفع |
| `refunded` | مسترد | بعد الاسترداد الكامل |
| `failed` | فشل | (نادر - يُستخدم في حالات خاصة) |
| `deleted` | محذوف | soft delete من الأدمن |

### 3.2 مخطط انتقال الحالات (State Transitions)

```
                          ┌─────────────┐
                          │   pending   │ ← الحالة الأولية
                          └──────┬──────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                   │
              ▼                  ▼                   ▼
       ┌────────────┐    ┌────────────┐     ┌──────────────┐
       │  on-hold   │    │ processing │     │  cancelled   │
       │ (SEPA/fail)│    │ (paid)     │     │ (pay failed) │
       └─────┬──────┘    └─────┬──────┘     └──────────────┘
             │                 │
             │                 ▼
             │          ┌────────────┐
             └─────────►│ completed  │ ← يدوي من Admin
                        └─────┬──────┘
                              │
                              ▼
                       ┌────────────┐
                       │  refunded  │ ← عبر Refund API
                       └────────────┘
```

### 3.3 تفاصيل الانتقالات (Triggers)

| من | إلى | Trigger | أوتوماتيك/يدوي |
|----|-----|---------|----------------|
| `(new)` | `pending` | إنشاء الطلب | أوتوماتيك |
| `pending` | `processing` | نجاح الدفع (Mollie/PayPal callback/webhook) | أوتوماتيك |
| `pending` | `on-hold` | طلب SEPA أو فشل إنشاء payment | أوتوماتيك |
| `pending` | `cancelled` | رفض/إلغاء/انتهاء الدفع | أوتوماتيك |
| `pending` | `processing` | FREE order (كوبون 100%) | أوتوماتيك |
| `processing` | `completed` | Admin يغير الحالة بعد إنهاء الخدمة | يدوي |
| `completed` | `refunded` | Admin يُصدر استرداد كامل | يدوي + أوتوماتيك (API) |
| `any` | `cancelled` | Admin يلغي الطلب | يدوي |
| `any` | `deleted` | Admin يحذف الطلب (soft delete) | يدوي |

### 3.4 التأثيرات الجانبية لتغيير الحالة

```
status → "processing" أو "completed":
  ├── order.datePaid = now() (إن لم يكن موجودًا)
  ├── payment.status = "paid"
  ├── payment.paidAt = now()
  └── invoice.paymentStatus = "paid"

status → "cancelled":
  ├── payment.status = "cancelled"
  └── invoice.paymentStatus = "cancelled"

status → "refunded":
  ├── payment.status = "refunded"
  └── invoice.paymentStatus = "refunded"

status → "completed":
  └── sendCompletionEmail() → إيميل + completionEmailSent = true + dateCompleted = now()
```

---

## 4. نظام الفواتير (Invoice System)

### 4.1 إنشاء الفاتورة

#### أ) إنشاء تلقائي عند Checkout (الطريقة الرئيسية)

**الملف:** `src/app/api/checkout/direct/route.ts`  
**التوقيت:** أثناء إنشاء الطلب (BATCH 3)

```typescript
// يتم إنشاء الفاتورة فورًا مع الطلب
await prisma.invoice.create({
  data: {
    invoiceNumber: "RE-YYYY-NNNN",  // مع retry للتعارضات
    orderId: localOrder.id,
    customerId,
    billingName, billingEmail, billingAddress, billingCity, billingPostcode,
    items: JSON.stringify(invoiceItems),  // JSON array
    subtotal: productPrice,
    taxRate: 19,
    taxAmount: total - (total / 1.19),
    total: orderTotal,
    paymentMethod: gateway.label,
    paymentStatus: "pending",
  }
});
```

#### ب) إنشاء يدوي من Admin

**الملف:** `src/app/api/admin/invoices/route.ts`  
**Endpoint:** `POST /api/admin/invoices`

```typescript
// المدخلات: { orderId: string }
// المنطق:
1. التحقق من عدم وجود فاتورة مسبقة للطلب (409 إن وُجدت)
2. جلب الطلب مع items و customer
3. توليد invoiceNumber
4. بناء items من OrderItems + paymentFee
5. حساب الضريبة
6. إنشاء Invoice
```

#### ج) إنشاء جماعي (Generate All)

**الملف:** `src/app/api/admin/invoices/generate-all/route.ts`  
**Endpoint:** `POST /api/admin/invoices/generate-all`

```typescript
// المنطق:
1. جلب كل الطلبات التي ليس لها فاتورة: { invoices: { none: {} } }
2. حساب nextInvNum من آخر فاتورة
3. loop: إنشاء فاتورة لكل طلب بالتسلسل
```

### 4.2 ترقيم الفواتير (Invoice Number Logic)

```
الصيغة: RE-YYYY-NNNN
مثال:   RE-2026-0001, RE-2026-0002, ...

المنطق:
1. prefix = "RE-{currentYear}-"
2. البحث عن آخر فاتورة تبدأ بهذا prefix
3. استخراج الرقم + 1
4. padding بـ 4 أصفار على الأقل
5. retry حتى 5 محاولات عند تعارض UNIQUE
```

**الملف المسؤول:**
- في Checkout: `src/app/api/checkout/direct/route.ts` (inline logic)
- في Admin: `src/app/api/admin/invoices/route.ts` → `generateInvoiceNumber()`

### 4.3 حالات الفاتورة (Invoice Status)

| paymentStatus | الوصف |
|---------------|-------|
| `pending` | في انتظار الدفع |
| `paid` | مدفوعة |
| `refunded` | مستردة |
| `cancelled` | ملغاة |
| `partially_refunded` | مستردة جزئيًا |

### 4.4 هيكل بنود الفاتورة (Items JSON)

```json
[
  {
    "name": "Fahrzeugabmeldung",
    "quantity": 1,
    "price": 29.99,
    "total": 29.99
  },
  {
    "name": "Zahlungsgebühr",  // إن وجدت
    "quantity": 1,
    "price": 1.49,
    "total": 1.49
  },
  {
    "name": "Gutschein (DISCOUNT10)",  // إن وجد خصم
    "quantity": 1,
    "price": -2.99,
    "total": -2.99
  }
]
```

### 4.5 توليد PDF

**الملف:** `src/lib/invoice.ts` → `generateInvoicePDF(orderId)`  
**المكتبة:** `jsPDF` (بدون headless browser)

```typescript
// المنطق:
1. جلب Order مع items, payments, invoices
2. بناء InvoiceData object
3. إنشاء PDF باستخدام jsPDF:
   ├── Header: لوجو + اسم الشركة + رقم الفاتورة
   ├── عنوان العميل + عنوان المرسل
   ├── شريط الدفع (طريقة + حالة)
   ├── جدول البنود (وصف، كمية، سعر، إجمالي)
   ├── Nettobetrag + MwSt + Gesamtbetrag
   ├── تفاصيل الخدمة (كينزايخن، FIN، سيشرهايتسكود)
   └── Footer: بيانات الشركة + IBAN

4. حفظ pdfUrl في DB: "generated:{invoiceNumber}"
5. إرجاع { pdfBuffer, invoiceData, invoiceNumber }
```

### 4.6 عرض PDF (HTML للطباعة)

**الملف:** `src/app/api/admin/invoices/[id]/pdf/route.ts`  
**Endpoint:** `GET /api/admin/invoices/{id}/pdf`

يُرجع HTML page مع أنماط CSS للطباعة وزر "PDF drucken / speichern".

### 4.7 تحميل PDF للعميل (مع أمان)

**الملف:** `src/app/api/invoice/[invoiceNumber]/pdf/route.ts`  
**Endpoint:** `GET /api/invoice/{invoiceNumber}/pdf?token={token}`

```typescript
// الأمان:
1. التحقق من صيغة invoiceNumber: /^RE-\d{4}-\d+$/
2. التحقق من token عبر HMAC-SHA256
   └── src/lib/invoice-token.ts → verifyInvoiceToken()
3. توليد PDF عبر generateInvoicePDF()
4. إرجاع application/pdf مع Content-Disposition: attachment
```

---

## 5. العلاقة بين Orders و Invoices

### 5.1 النوع: One-to-Many (1:N)

- **كل Order يمكن أن يكون له أكثر من Invoice** (نظريًا)
- **عمليًا: 1:1** — يتم إنشاء فاتورة واحدة لكل طلب
- الكود يتحقق من وجود فاتورة مسبقة قبل الإنشاء اليدوي (409 conflict)
- عند القراءة: `order.invoices?.[0]` يُستخدم دائمًا

### 5.2 توقيت الإنشاء

```
كل Invoice تُنشأ في نفس لحظة إنشاء Order
(BATCH 3 في checkout/direct/route.ts)

┌─────────────────────────────┐
│  Order Created              │
│  ├── OrderItem Created      │
│  ├── Payment Created        │  ← كلها في نفس الوقت (Promise.all)
│  └── Invoice Created        │
└─────────────────────────────┘
```

### 5.3 هل يمكن وجود Order بدون Invoice؟

**نعم** — في حالتين:
1. طلبات مهاجرة من WordPress قد لا يكون لها فواتير
2. إذا فشل إنشاء الفاتورة (UNIQUE conflict بعد 5 محاولات)

**الحل:** زر "Generate All" في لوحة التحكم يُنشئ فواتير لكل الطلبات بدون فاتورة.

### 5.4 مزامنة الحالات

```
عند تغيير Order.status:
  → Invoice.paymentStatus يُحدَّث تلقائيًا

عند استلام Webhook/Callback:
  → Order.status + Payment.status + Invoice.paymentStatus 
    كلها تُحدَّث معًا

الاتجاه: Order → Invoice (أحادي)
لا يوجد تحديث عكسي (Invoice لا يؤثر على Order)
```

---

## 6. نظام الدفع (Payment Flow)

### 6.1 بوابات الدفع المدعومة

| البوابة | المعرف | المزود | الملف |
|---------|--------|--------|-------|
| بطاقة ائتمان | `creditcard` | Mollie | `src/lib/payments.ts` |
| Apple Pay | `applepay` | Mollie | `src/lib/payments.ts` |
| Klarna | `klarna` | Mollie (Orders API) | `src/lib/payments.ts` |
| PayPal | `paypal` | PayPal REST v2 | `src/lib/paypal.ts` |
| SEPA / تحويل بنكي | `sepa` | بدون مزود (يدوي) | Checkout direct |
| أخرى (Sofort, iDEAL...) | متنوع | Mollie | `src/lib/payments.ts` |

### 6.2 تدفق الدفع لكل بوابة

#### Mollie (بطاقة/Apple Pay/أخرى)

```
1. Checkout → createMolliePayment()
   ├── method: creditcard | applepay | ...
   ├── amount, description, metadata
   └── redirectUrl: /api/payment/callback?orderId={id}
       webhookUrl: /api/payment/webhook

2. العميل يُوجَّه لصفحة Mollie للدفع

3.A. Webhook (POST /api/payment/webhook):
   ├── Mollie يُرسل POST مع { id: "tr_xxx" }
   ├── نجلب الحالة من Mollie API
   ├── نُحدث Order + Payment + Invoice
   └── إن paid → triggerInvoiceEmail()

3.B. Callback (GET /api/payment/callback?orderId=xxx):
   ├── العميل يعود بعد الدفع
   ├── نتحقق من الحالة عبر Mollie API
   ├── نُحدث (إن لم يُحدَّث من webhook)
   ├── إن paid → triggerInvoiceEmail()
   └── redirect → /bestellung-erfolgreich أو /zahlung-fehlgeschlagen
```

#### Klarna (عبر Mollie Orders API)

```
1. Checkout → createMollieOrder()
   ├── يتطلب line items (product + fee + discount)
   ├── billing address مطلوب
   └── يُنشئ ord_xxx (بدل tr_xxx)

2. العميل يوافق على Klarna

3. نفس webhook/callback flow لكن مع:
   ├── getMollieOrderStatus() بدل getMolliePaymentStatus()
   └── "authorized" يُعامل كـ "paid" (Klarna guarantee)
```

#### PayPal

```
1. Checkout → createPayPalOrder()
   ├── intent: CAPTURE
   ├── amount, description
   └── return_url: /api/payment/paypal/capture?orderId={id}

2. العميل يوافق على PayPal

3.A. Capture (GET /api/payment/paypal/capture?orderId=xxx):
   ├── capturePayPalOrder(paypalOrderId)
   ├── إن COMPLETED:
   │   ├── order.status = "processing"
   │   ├── payment.status = "paid"
   │   ├── invoice.paymentStatus = "paid"
   │   └── triggerInvoiceEmail()
   └── إن فشل → redirect to /zahlung-fehlgeschlagen

3.B. Webhook (POST /api/payment/paypal/webhook):
   ├── Safety net (الأساسي هو capture callback)
   ├── Events: PAYMENT.CAPTURE.COMPLETED | DENIED | REFUNDED
   └── نفس logic التحديث
```

#### SEPA (تحويل بنكي)

```
1. Checkout → لا يوجد redirect لمزود
   ├── order.status = "on-hold"
   ├── triggerInvoiceEmail() ← إرسال فاتورة مع بيانات التحويل
   └── إرجاع invoiceUrl (بدل paymentUrl)

2. العميل يحول يدويًا

3. Admin يغير الحالة يدويًا إلى "processing" أو "completed"
```

#### FREE (طلب مجاني بالكامل)

```
1. Checkout (total = 0, كوبون يغطي كامل المبلغ):
   ├── order.status = "processing"
   ├── payment.status = "paid", transactionId = "FREE-{couponCode}"
   ├── invoice.paymentStatus = "paid"
   └── triggerInvoiceEmail()
```

### 6.3 منع الإرسال المزدوج (Deduplication)

**الملف:** `src/lib/trigger-invoice.ts`

```typescript
// In-memory Set يتتبع orderId
// عند استدعاء triggerInvoiceEmail(orderId):
1. إن كان orderId في Set → skip (return success)
2. إضافة orderId للـ Set
3. حذف تلقائي بعد 5 دقائق (setTimeout)
4. استدعاء generateAndSendInvoice()

// الهدف: منع إرسال إيميل مرتين عندما يصل webhook + callback بنفس الوقت
```

### 6.4 الاسترداد (Refund)

**الملف:** `src/app/api/admin/orders/[id]/refund/route.ts`

```typescript
// POST /api/admin/orders/{id}/refund
// body: { amount?: string }  // optional لاسترداد جزئي

// المنطق:
1. تحميل الطلب مع payments
2. detectProvider(): تحديد المزود من transactionId
   ├── tr_xxx → Mollie
   ├── paypal method → PayPal
   └── null → خطأ
3. حساب المبلغ (كامل أو جزئي)
4. التحقق: المبلغ لا يتجاوز order.total
5. استدعاء API المزود:
   ├── Mollie: createMollieRefund(transactionId, amount)
   └── PayPal: refundPayPalCapture(transactionId, amount)
6. تحديث محلي:
   ├── إن كان استرداد كامل: order.status = "refunded"
   ├── payment.status = "refunded" أو "partially_refunded"
   ├── invoice.paymentStatus = مزامنة
   └── إنشاء OrderNote
```

---

## 7. API Layer

### 7.1 جميع endpoints المتعلقة بالطلبات

| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| `POST` | `/api/checkout/direct` | إنشاء طلب جديد | Public (rate limited) |
| `GET` | `/api/admin/orders` | قائمة الطلبات (مع فلترة/بحث/pagination) | Admin |
| `POST` | `/api/admin/orders` | عمليات جماعية (delete/status) | Admin |
| `GET` | `/api/admin/orders/{id}` | تفاصيل طلب واحد | Admin |
| `PATCH` | `/api/admin/orders/{id}` | تحديث حالة/ملاحظة | Admin |
| `DELETE` | `/api/admin/orders/{id}` | حذف ناعم | Admin |
| `POST` | `/api/admin/orders/{id}/refund` | إصدار استرداد | Admin |
| `GET` | `/api/admin/orders/{id}/refund` | تاريخ الاستردادات | Admin |
| `POST` | `/api/admin/orders/{id}/resend-invoice` | إعادة إرسال إيميل الفاتورة | Admin |
| `GET` | `/api/admin/orders/{id}/messages` | رسائل الطلب | Admin |
| `POST` | `/api/admin/orders/{id}/messages` | إرسال رسالة للعميل | Admin |
| `GET` | `/api/admin/orders/{id}/documents` | مستندات الطلب | Admin |
| `POST` | `/api/admin/orders/{id}/documents` | رفع مستند | Admin |
| `GET` | `/api/customer/orders` | طلبات العميل (صفحة العميل) | Customer Session |
| `GET` | `/api/customer/orders/{id}` | تفاصيل طلب العميل | Customer Session |
| `GET` | `/api/customer/orders/{id}/documents` | مستندات طلب العميل | Customer Session |

### 7.2 جميع endpoints المتعلقة بالفواتير

| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| `GET` | `/api/admin/invoices` | قائمة الفواتير | Admin |
| `POST` | `/api/admin/invoices` | إنشاء فاتورة من طلب | Admin |
| `GET` | `/api/admin/invoices/{id}` | تفاصيل فاتورة | Admin |
| `DELETE` | `/api/admin/invoices/{id}` | حذف فاتورة | Admin |
| `GET` | `/api/admin/invoices/{id}/pdf` | HTML preview للطباعة | Admin |
| `POST` | `/api/admin/invoices/generate-all` | إنشاء فواتير لكل الطلبات بدون فاتورة | Admin |
| `GET` | `/api/invoice/{invoiceNumber}/pdf?token=xxx` | تحميل PDF (للعميل) | Token-based |

### 7.3 endpoints الدفع

| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| `GET` | `/api/payment/callback` | Mollie redirect بعد الدفع | Public (orderId) |
| `POST` | `/api/payment/webhook` | Mollie async webhook | Public (Mollie IP) |
| `GET` | `/api/payment/paypal/capture` | PayPal capture بعد الموافقة | Public (orderId) |
| `POST` | `/api/payment/paypal/webhook` | PayPal IPN webhook | Public (PayPal) |
| `GET` | `/api/admin/payments` | قائمة المدفوعات | Admin |
| `GET` | `/api/admin/payments/debug` | Debug info | Admin |

### 7.4 تفاصيل Request/Response لأهم الـ APIs

#### GET /api/admin/orders

```typescript
// Query Params:
page?: number (default 1)
limit?: number (default 20, max 100)
cursor?: string (for cursor-based pagination)
status?: string (pending|processing|completed|cancelled|...)
search?: string (order number, name, email)
dateFrom?: string (ISO date)
dateTo?: string (ISO date)
sortBy?: string (createdAt|total|orderNumber|status)
sortDir?: "asc" | "desc"

// Response:
{
  orders: [{
    id, orderNumber, status, total, currency,
    paymentMethod, paymentTitle,
    billingEmail, billingFirst, billingLast,
    createdAt
  }],
  pagination: { page, limit, total, pages },
  statusCounts: { all: N, pending: N, processing: N, ... }
}
```

#### GET /api/admin/orders/{id}

```typescript
// Response:
{
  id, orderNumber, status, total, subtotal, paymentFee,
  discountAmount, couponCode, currency,
  paymentMethod, paymentTitle, transactionId,
  billingEmail, billingPhone, billingFirst, billingLast,
  billingStreet, billingCity, billingPostcode,
  serviceData, productName,
  datePaid, dateCompleted, completionEmailSent,
  createdAt, updatedAt,
  items: [{ id, productName, quantity, price, total }],
  payments: [{ id, gatewayId, transactionId, amount, status, method, paidAt }],
  notes: [{ id, note, author, createdAt }]
}
```

#### GET /api/admin/invoices

```typescript
// Query Params:
page?: number, limit?: number, search?: string, status?: string

// Response:
{
  invoices: [{
    id, invoiceNumber, invoiceDate,
    billingName, billingEmail,
    total, subtotal, paymentStatus, paymentMethod,
    orderId, createdAt,
    order: { orderNumber }
  }],
  pagination: { page, limit, total, pages }
}
```

#### POST /api/checkout/direct

```typescript
// Request: CheckoutDirectInput (see Zod schema above)

// Response (success):
{
  success: true,
  orderId: string,
  orderNumber: number,
  total: string,
  paymentUrl?: string,      // Mollie/PayPal checkout URL
  invoiceUrl?: string,      // SEPA/FREE invoice page
  invoiceNumber: string
}

// Response (error):
{ error: string }    // Status: 400 | 429 | 500 | 502
```

### 7.5 Caching Strategy

```
Admin Orders List:   Status counts cached 15s (in-memory)
Admin Invoices List: Full results cached 10s (in-memory Map, max 50 entries)
Checkout:            Gateway + Product cached 5 min (in-memory Map)
```

---

## 8. Admin Dashboard Logic

### 8.1 صفحة الطلبات (Orders Page)

**الملف:** `src/app/admin/(dashboard)/orders/page.tsx`

```
Components & State:
├── useOrders() SWR hook ← GET /api/admin/orders
├── Filters: status tabs, search, date range, sort
├── Table: react-window virtualized (48px rows)
│   └── Columns: checkbox, #, customer, email, status, payment, total, date, actions
├── Bulk Actions: status change, delete
├── Pagination: offset-based with page numbers
└── Status Counts: displayed as tabs (all, pending, processing, ...)

Data Flow:
1. Page mount → SWR fetches /api/admin/orders?page=1&limit=20
2. Filter change → SWR refetches with new params
3. Bulk action → POST /api/admin/orders → SWR revalidates
4. Click order → navigate to /admin/orders/{id}
```

### 8.2 صفحة تفاصيل الطلب (Order Detail Page)

**الملف:** `src/app/admin/(dashboard)/orders/[id]/page.tsx`

```
Sections:
├── Customer Info (name, email, phone, address)
├── Order Items + Price Breakdown (subtotal, fee, discount, total)
├── Service Data (كينزايخن, FIN, سيشرهايتسكود, uploaded files)
├── Payment Info (method, status, transaction ID)
├── Status Switcher (dropdown → PATCH /api/admin/orders/{id})
├── Invoice Management:
│   ├── InvoiceLink component
│   │   ├── Search: GET /api/admin/invoices?search={orderNumber}
│   │   ├── Create: POST /api/admin/invoices { orderId }
│   │   ├── View PDF: link to /api/admin/invoices/{id}/pdf
│   │   └── Resend: POST /api/admin/orders/{id}/resend-invoice
│   └── Shows invoice number + status
├── Refund Section:
│   ├── Amount input (optional for partial)
│   ├── Execute: POST /api/admin/orders/{id}/refund
│   └── History: GET /api/admin/orders/{id}/refund
├── Order Notes (system + admin notes)
└── Toast Notifications (success/warning/error)
```

### 8.3 صفحة الفواتير (Invoices Page)

**الملف:** `src/app/admin/(dashboard)/invoices/page.tsx`

```
Components:
├── useInvoices() SWR hook ← GET /api/admin/invoices
├── Filters: status (all, paid, pending, refunded, cancelled), search
├── Table: react-window virtualized (52px rows)
│   └── Columns: invoice#, order#, customer, date, amount, status, actions
├── Generate All button → POST /api/admin/invoices/generate-all
├── Mobile: card view (responsive)
└── Desktop: table view

Actions per Invoice:
├── View PDF → /api/admin/invoices/{id}/pdf (new tab)
└── Click → /admin/invoices/{id} (detail page)
```

### 8.4 صفحة تفاصيل الفاتورة (Invoice Detail Page)

**الملف:** `src/app/admin/(dashboard)/invoices/[id]/page.tsx`

```
Layout:
├── Main: Invoice Preview Card (styled like real PDF)
│   ├── Header (company, invoice number)
│   ├── Billing address + Invoice date + Order number
│   ├── Items table
│   ├── Tax calculation + totals
│   └── Payment status banner
└── Sidebar:
    ├── PDF download link
    ├── Link back to order
    ├── Invoice details box
    └── Customer info

API Calls:
├── GET /api/admin/invoices/{id}
└── GET /api/settings (company name, site name)
```

---

## 9. Business Logic & Edge Cases

### 9.1 Race Conditions (التعارضات المتزامنة)

```
المشكلة: طلبان متزامنان يحاولان نفس orderNumber
الحل:    Retry loop (5 محاولات) مع re-fetch لأعلى رقم
الملف:   src/app/api/checkout/direct/route.ts

المشكلة: نفس الشيء لـ invoiceNumber
الحل:    نفس retry loop (5 محاولات)

المشكلة: Webhook + Callback يصلان بنفس الوقت
الحل:    triggerInvoiceEmail() مع in-memory dedup Set (5 دقائق TTL)
الملف:   src/lib/trigger-invoice.ts
```

### 9.2 أوامر مجانية (Free Orders)

```
عندما يغطي الكوبون كامل المبلغ (total ≤ 0):
├── لا يتم redirect لأي بوابة دفع
├── order.status = "processing" فورًا
├── payment.transactionId = "FREE-{couponCode}"
├── invoice.paymentStatus = "paid"
└── إرسال إيميل الفاتورة مباشرة
```

### 9.3 فشل الدفع (Payment Failures)

```
فشل إنشاء payment عند المزود:
├── order.status = "on-hold"
├── payment.status = "failed"
├── الطلب يبقى في DB (لا يُحذف)
└── response = 502 مع رسالة خطأ

فشل الدفع بعد redirect:
├── Mollie callback → redirect to /zahlung-fehlgeschlagen
├── Payment record يُحدث مع failure details
├── OrderNote يُنشأ مع السبب
└── الطلب يبقى بحالة pending أو cancelled
```

### 9.4 محاولات إرسال الإيميل

```
sendInvoiceEmail():
├── 3 محاولات (retry)
├── 2 ثانية بين كل محاولة (تزايدي: 2s, 4s, 6s)
├── SMTP verify قبل الإرسال
├── إن فشل: OrderNote يُسجل الفشل
├── نسخة للأدمن (admin copy) - فشلها لا يؤثر على العملية
└── لا يؤثر على حالة الطلب
```

### 9.5 الاسترداد الجزئي (Partial Refund)

```
POST /api/admin/orders/{id}/refund { amount: "10.00" }
├── يُرسل المبلغ المحدد للمزود
├── payment.status = "partially_refunded"
├── order.status لا يتغير (يبقى processing/completed)
├── OrderNote يُسجل المبلغ المسترد
└── webhook يتعامل مع partial refund أيضًا
```

### 9.6 Completion Email (إيميل الإكمال)

```
يُرسل عندما يغير Admin الحالة لـ "completed"
├── dedup: completionEmailSent flag يمنع الإرسال المزدوج
├── محتوى مختلف حسب نوع الخدمة:
│   ├── Abmeldung: رسالة نجاح + عرض Anmeldung
│   └── Anmeldung: رسالة نجاح عامة
├── يتضمن رابط الفاتورة أو المستند
├── يُعيّن completionEmailSent = true + dateCompleted = now()
└── يُستخدم sendCampaignEmail() (نفس SMTP infrastructure)
```

### 9.7 أمان الفواتير (Invoice Security)

```
العميل يصل للفاتورة عبر URL مع token:
/api/invoice/RE-2026-0001/pdf?token=abc123def456

Token = HMAC-SHA256(invoiceNumber, SECRET).slice(0, 16)
SECRET = NEXTAUTH_SECRET || JWT_SECRET || "fallback-secret"

التحقق: constant-time comparison (ضد timing attacks)
```

---

## 10. End-to-End Flow

### 10.1 السيناريو الكامل: طلب عادي بالبطاقة

```
[العميل يملأ نموذج الخدمة]
    │
    ▼
[CheckoutForm.tsx] ← يجمع بيانات الخدمة + الدفع
    │ POST /api/checkout/direct
    ▼
[checkout/direct/route.ts]
    │
    ├── 1. Rate limit check (8/min per IP)
    ├── 2. Zod validation
    ├── 3. BATCH 1 (parallel):
    │       ├── getCachedGateway("creditcard")
    │       ├── getCachedProduct("fahrzeugabmeldung")
    │       ├── maxOrderNumber
    │       └── lastInvoiceNumber
    │
    ├── 4. Price calculation:
    │       total = productPrice - discount + paymentFee
    │
    ├── 5. Customer upsert (by email)
    │
    ├── 6. Order create (with retry):
    │       status: "pending", orderNumber: N+1
    │
    ├── 7. BATCH 3 (parallel):
    │       ├── OrderItems.createMany
    │       ├── Payment.create (status: "pending")
    │       └── Invoice.create (invoiceNumber: "RE-2026-NNNN", status: "pending")
    │
    ├── 8. createMolliePayment() → returns checkoutUrl
    │       └── Payment.update (transactionId: "tr_xxx")
    │
    └── 9. Response: { success: true, paymentUrl: "https://mollie.com/..." }
    
    │
    ▼
[العميل يُوجَّه لـ Mollie → يدفع]
    │
    ├──── [Mollie Webhook]  ──────────────────────┐
    │     POST /api/payment/webhook               │
    │     body: { id: "tr_xxx" }                  │
    │         │                                    │
    │         ├── getMolliePaymentStatus("tr_xxx") │
    │         ├── order.status = "processing"      │
    │         ├── payment.status = "paid"           │
    │         ├── invoice.paymentStatus = "paid"    │
    │         ├── OrderNote: "paid"                 │
    │         └── triggerInvoiceEmail(orderId) ─────┤
    │                                               │
    ▼                                               │
[Mollie Callback]                                   │
GET /api/payment/callback?orderId=xxx               │
    │                                               │
    ├── getMolliePaymentStatus("tr_xxx")            │
    ├── (يتحقق إن لم يُحدَّث من webhook)           │
    ├── triggerInvoiceEmail(orderId) ←── DEDUP ─────┘
    │       │                              (يتخطى إن أُرسل مسبقًا)
    │       │
    │       ├── generateInvoicePDF(orderId)
    │       │       ├── jsPDF → Buffer
    │       │       └── update invoice.pdfUrl
    │       │
    │       └── sendInvoiceEmail()
    │               ├── SMTP verify
    │               ├── Send to customer (3 retries)
    │               ├── Send admin copy
    │               └── Create OrderNote
    │
    └── Redirect → /bestellung-erfolgreich?order=N

    [لاحقًا: Admin يراجع الطلب]
    │
    ├── يفتح /admin/orders/{id}
    ├── يراجع البيانات والمستندات
    ├── يرفع مستندات (إن لزم)
    ├── يغير الحالة إلى "completed"
    │       │
    │       └── PATCH /api/admin/orders/{id} { status: "completed" }
    │               ├── order.datePaid = now() (إن لم يكن)
    │               ├── payment.status = "paid"
    │               ├── invoice.paymentStatus = "paid"
    │               └── sendCompletionEmail()
    │                       ├── بريد إلكتروني بنموذج مخصص
    │                       ├── completionEmailSent = true
    │                       └── dateCompleted = now()
    │
    └── ✅ الطلب مكتمل
```

### 10.2 السيناريو: طلب SEPA

```
[Checkout] → order.status = "on-hold"
          → triggerInvoiceEmail() (فورًا)
          → Response: { invoiceUrl: "/rechnung/RE-2026-NNNN?..." }

[العميل يحول بنكيًا]

[Admin يتأكد من وصول التحويل]
          → PATCH status: "processing"
          → ثم "completed"
```

### 10.3 السيناريو: كوبون مجاني

```
[Checkout] → total = 0
          → order.status = "processing"
          → payment.transactionId = "FREE-DISCOUNT100"
          → invoice.paymentStatus = "paid"
          → triggerInvoiceEmail() (فورًا)
          → Response: { invoiceUrl: "..." }
```

---

## 11. System Architecture Summary

### 11.1 التقنيات المستخدمة

| المكون | التقنية |
|--------|---------|
| Frontend | Next.js 14 (App Router) + React + Tailwind CSS |
| Backend API | Next.js API Routes (Route Handlers) |
| Database | SQLite via Prisma ORM |
| PDF Generation | jsPDF (server-side, no browser needed) |
| Email | Nodemailer + SMTP (Titan Email) |
| Payments | Mollie API + PayPal REST v2 |
| Validation | Zod |
| State Management (Admin) | SWR (client-side data fetching) |
| Table Virtualization | react-window |
| Auth (Admin) | NextAuth / JWT |
| Auth (Invoice Access) | HMAC-SHA256 tokens |

### 11.2 الملفات الرئيسية

```
src/
├── app/api/
│   ├── checkout/direct/route.ts          ← نقطة إنشاء الطلب
│   ├── payment/
│   │   ├── callback/route.ts             ← Mollie redirect
│   │   ├── webhook/route.ts              ← Mollie webhook
│   │   └── paypal/
│   │       ├── capture/route.ts          ← PayPal capture
│   │       └── webhook/route.ts          ← PayPal IPN
│   ├── admin/
│   │   ├── orders/
│   │   │   ├── route.ts                  ← قائمة + bulk
│   │   │   └── [id]/
│   │   │       ├── route.ts              ← تفاصيل + تحديث + حذف
│   │   │       ├── refund/route.ts       ← استرداد
│   │   │       ├── resend-invoice/route.ts
│   │   │       ├── messages/route.ts
│   │   │       └── documents/route.ts
│   │   ├── invoices/
│   │   │   ├── route.ts                  ← قائمة + إنشاء
│   │   │   ├── generate-all/route.ts     ← إنشاء جماعي
│   │   │   └── [id]/
│   │   │       ├── route.ts              ← تفاصيل + حذف
│   │   │       └── pdf/route.ts          ← HTML preview
│   │   └── payments/
│   │       ├── route.ts
│   │       └── debug/route.ts
│   ├── invoice/
│   │   └── [invoiceNumber]/pdf/route.ts  ← تحميل PDF للعميل
│   └── customer/orders/
│       ├── route.ts
│       └── [id]/
│           ├── route.ts
│           └── documents/route.ts
│
├── lib/
│   ├── prisma.ts                         ← Prisma client singleton
│   ├── db.ts                             ← DB helpers + gateway mapping
│   ├── payments.ts                       ← Mollie integration
│   ├── paypal.ts                         ← PayPal REST v2 integration
│   ├── invoice.ts                        ← PDF generation + email
│   ├── invoice-token.ts                  ← HMAC token generation/verification
│   ├── invoice-template.ts               ← InvoiceData type definition
│   ├── trigger-invoice.ts                ← Dedup wrapper for email
│   ├── completion-email.ts               ← Order completion email
│   ├── order-message-email.ts            ← Admin-to-customer messages
│   ├── validations.ts                    ← Zod schemas
│   ├── rate-limit.ts                     ← IP-based rate limiting
│   ├── payment-logger.ts                 ← Structured payment logging
│   └── campaign-email.ts                 ← Generic email sending
│
├── app/admin/(dashboard)/
│   ├── orders/
│   │   ├── page.tsx                      ← Orders list UI
│   │   └── [id]/page.tsx                 ← Order detail UI
│   └── invoices/
│       ├── page.tsx                      ← Invoices list UI
│       └── [id]/page.tsx                 ← Invoice detail UI
│
├── components/
│   └── CheckoutForm.tsx                  ← Checkout UI
│
└── generated/prisma/                     ← Prisma generated types
```

---

## 12. Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER FLOW                                │
│                                                                     │
│  [Service Form] → [CheckoutForm] → POST /api/checkout/direct        │
│                                        │                            │
│                              ┌─────────┼─────────────┐              │
│                              │         │             │              │
│                         ┌────▼───┐ ┌───▼────┐  ┌────▼───┐          │
│                         │  SEPA  │ │ PayPal │  │ Mollie │          │
│                         └────┬───┘ └───┬────┘  └────┬───┘          │
│                              │         │             │              │
│                     [on-hold +   [Approve on    [Pay on             │
│                      email]       PayPal]        Mollie]            │
│                              │         │             │              │
│                              │    [Capture]    [Callback +          │
│                              │         │        Webhook]            │
│                              │         │             │              │
│                              ▼         ▼             ▼              │
│                         ┌────────────────────────────────┐          │
│                         │  Order: "processing"           │          │
│                         │  Payment: "paid"                │          │
│                         │  Invoice: "paid"                │          │
│                         │  → Email with PDF attachment   │          │
│                         └────────────┬───────────────────┘          │
│                                      │                              │
└──────────────────────────────────────┼──────────────────────────────┘
                                       │
┌──────────────────────────────────────┼──────────────────────────────┐
│                        ADMIN FLOW    │                               │
│                                      ▼                              │
│                         ┌────────────────────┐                      │
│                         │  Review Order       │                      │
│                         │  + Upload Documents │                      │
│                         └─────────┬──────────┘                      │
│                                   │                                  │
│                          PATCH status: "completed"                   │
│                                   │                                  │
│                         ┌─────────▼──────────┐                      │
│                         │  Completion Email   │                      │
│                         │  dateCompleted=now  │                      │
│                         └────────────────────┘                      │
│                                                                     │
│                    [Optional: Refund]                                │
│                    POST /orders/{id}/refund                          │
│                         │                                            │
│                    ┌────▼─────────────┐                              │
│                    │ Mollie/PayPal    │                              │
│                    │ Refund API       │                              │
│                    └─────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 13. Data Model

### مخطط البيانات المبسط

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Customer   │     │      Order       │     │   Payment    │
│──────────────│     │──────────────────│     │──────────────│
│ id (PK)      │◄────│ customerId (FK)  │────►│ orderId (FK) │
│ email (UQ)   │     │ id (PK)          │     │ id (PK)      │
│ firstName    │     │ orderNumber (UQ) │     │ gatewayId    │
│ lastName     │     │ status           │     │ transactionId│
│ totalOrders  │     │ total            │     │ amount       │
│ totalSpent   │     │ subtotal         │     │ status       │
└──────────────┘     │ paymentFee       │     │ paidAt       │
       │             │ discountAmount   │     └──────────────┘
       │             │ paymentMethod    │
       │             │ billingEmail     │     ┌──────────────┐
       │             │ serviceData (J)  │     │  OrderItem   │
       │             │ productName      │     │──────────────│
       │             │ datePaid         │────►│ orderId (FK) │
       │             │ dateCompleted    │     │ productName  │
       │             │ deletedAt        │     │ quantity     │
       │             │ completionEmail  │     │ price, total │
       │             └──────────────────┘     └──────────────┘
       │                    │
       │                    │                 ┌──────────────┐
       │                    │                 │  OrderNote   │
       │                    │                 │──────────────│
       │                    │────────────────►│ orderId (FK) │
       │                    │                 │ note, author │
       │                    │                 └──────────────┘
       │                    │
       │             ┌──────▼───────────┐     ┌──────────────┐
       │             │    Invoice       │     │OrderDocument │
       │             │──────────────────│     │──────────────│
       └────────────►│ customerId (FK)  │     │ orderId (FK) │
                     │ orderId (FK)     │     │ fileName     │
                     │ invoiceNumber(UQ)│     │ fileUrl      │
                     │ billingName      │     │ token (UQ)   │
                     │ items (JSON)     │     └──────────────┘
                     │ subtotal         │
                     │ taxRate (19%)    │     ┌──────────────┐
                     │ taxAmount        │     │OrderMessage  │
                     │ total            │     │──────────────│
                     │ paymentStatus    │     │ orderId (FK) │
                     │ paymentMethod    │     │ message      │
                     │ pdfUrl           │     │ attachments  │
                     └──────────────────┘     │ sentBy       │
                                              └──────────────┘

Legend: (PK) = Primary Key, (FK) = Foreign Key, (UQ) = Unique, (J) = JSON
```

---

## 14. Migration Guide (دليل إعادة البناء)

### 14.1 الخطوات المطلوبة بالترتيب

```
1. إعداد قاعدة البيانات:
   ├── نسخ prisma/schema.prisma (الجداول: Order, Invoice, Payment, 
   │   Customer, OrderItem, OrderNote, OrderMessage, OrderDocument, 
   │   PaymentGateway, Coupon, CouponUsage)
   ├── npx prisma migrate dev
   └── seed PaymentGateway records

2. إعداد المكتبات:
   ├── prisma (ORM)
   ├── zod (validation)
   ├── jspdf (PDF generation)
   ├── nodemailer (email)
   ├── swr (admin data fetching)
   └── react-window (table virtualization)

3. بناء Checkout API:
   ├── نسخ src/app/api/checkout/direct/route.ts
   ├── نسخ src/lib/validations.ts (checkoutDirectSchema)
   ├── نسخ src/lib/rate-limit.ts
   ├── نسخ src/lib/db.ts (gateway functions)
   └── تعديل الأسعار والمنتجات حسب المشروع الجديد

4. بناء Payment Integrations:
   ├── نسخ src/lib/payments.ts (Mollie)
   ├── نسخ src/lib/paypal.ts (PayPal)
   ├── نسخ src/app/api/payment/callback/route.ts
   ├── نسخ src/app/api/payment/webhook/route.ts
   ├── نسخ src/app/api/payment/paypal/capture/route.ts
   └── نسخ src/app/api/payment/paypal/webhook/route.ts

5. بناء Invoice System:
   ├── نسخ src/lib/invoice.ts (PDF + email)
   ├── نسخ src/lib/invoice-token.ts (security)
   ├── نسخ src/lib/invoice-template.ts (types)
   ├── نسخ src/lib/trigger-invoice.ts (dedup)
   ├── نسخ src/lib/completion-email.ts
   └── تعديل بيانات الشركة في PDF template

6. بناء Admin APIs:
   ├── نسخ src/app/api/admin/orders/ (كامل المجلد)
   ├── نسخ src/app/api/admin/invoices/ (كامل المجلد)
   ├── نسخ src/app/api/admin/payments/ (كامل المجلد)
   └── نسخ src/app/api/invoice/ (customer PDF access)

7. بناء Admin UI:
   ├── Orders list page
   ├── Order detail page
   ├── Invoices list page
   └── Invoice detail page

8. بناء Customer APIs:
   └── نسخ src/app/api/customer/orders/ (كامل المجلد)
```

### 14.2 المتغيرات البيئية المطلوبة (.env)

```env
# Database
DATABASE_URL="file:./dev.db"

# Mollie
MOLLIE_API_KEY="live_xxxxxxxx"
MOLLIE_TEST_KEY="test_xxxxxxxx"

# PayPal
PAYPAL_CLIENT_ID="AxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxB"
PAYPAL_CLIENT_SECRET="ExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxF"
PAYPAL_MODE="live"   # "sandbox" for testing

# SMTP (Email)
SMTP_HOST="smtp.titan.email"
SMTP_PORT="465"
SMTP_USER="info@yourdomain.com"
SMTP_PASS_B64="base64_encoded_password"   # Use B64 to avoid $ char issues
EMAIL_FROM="info@yourdomain.com"
EMAIL_FROM_NAME="Your Company"
ADMIN_EMAIL="admin@yourdomain.com"

# App
SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Auth (for invoice tokens)
NEXTAUTH_SECRET="your-random-secret-key"
```

### 14.3 ما يمكن تغييره

| العنصر | قابل للتغيير | ملاحظات |
|--------|-------------|---------|
| اسم الشركة وبيانات الاتصال | ✅ | في PDF template و emails |
| أسعار المنتجات | ✅ | عبر DB (Product table) |
| بوابات الدفع | ✅ | إضافة/إزالة/تعديل عبر PaymentGateway |
| صيغة رقم الفاتورة | ✅ | تغيير prefix "RE-" |
| نسبة الضريبة | ✅ | taxRate (default 19%) |
| عملة الدفع | ✅ | EUR → أي عملة (تغيير في checkout + templates) |
| تصميم PDF | ✅ | تعديل jsPDF code في invoice.ts |
| تصميم الإيميلات | ✅ | HTML templates في invoice.ts و completion-email.ts |
| Database engine | ✅ | SQLite → PostgreSQL/MySQL (تغيير provider في schema) |
| SMTP provider | ✅ | أي مزود SMTP |

### 14.4 ما لا يجب تغييره (Critical Logic)

| العنصر | السبب |
|--------|-------|
| Order → Invoice creation flow | يجب أن تُنشأ الفاتورة مع الطلب |
| Status sync (Order ↔ Payment ↔ Invoice) | إن لم تتزامن، ستختل البيانات |
| Dedup logic في trigger-invoice.ts | بدونها ستُرسل إيميلات مزدوجة |
| Retry logic لـ orderNumber/invoiceNumber | بدونها ستفشل الطلبات المتزامنة |
| Webhook always returns 200 | Mollie يعتبر الـ URL غير متاح إن حصل على خطأ |
| Soft delete pattern | الحذف النهائي سيكسر العلاقات |
| Server-side price validation | منع التلاعب بالأسعار |
| Rate limiting | حماية من الـ abuse |
| HMAC invoice tokens | حماية الفواتير من الوصول غير المصرح |

### 14.5 ملاحظات تقنية مهمة

1. **Mollie Webhook يجب أن يُرجع 200 دائمًا** — حتى عند حدوث خطأ. و إلا سيعتبر Mollie الـ URL غير متاح ويمنع إنشاء payments جديدة.

2. **PayPal Capture vs Webhook** — الـ capture callback هو المسار الأساسي. الـ webhook هو safety net فقط.

3. **SMTP_PASS_B64** — كلمة المرور مشفرة بـ Base64 لأن dotenv-expand يفسد الأحرف الخاصة مثل `$`.

4. **In-memory caching** — الـ caching يعمل per-process. في بيئة multi-instance يجب استخدام Redis بديلاً.

5. **SQLite limitations** — لا يدعم concurrent writes بنفس كفاءة PostgreSQL. الـ retry loops للـ orderNumber تعوض هذا جزئيًا.

6. **jsPDF** — مكتبة خفيفة لا تحتاج Chromium/Puppeteer. مناسبة لـ serverless environments.

7. **Kleinunternehmerregelung (§19 UStG)** — الفاتورة تذكر أن الضريبة لا تُحصَّل (حالة خاصة بالقانون الألماني). في المشروع الجديد يجب مراجعة هذا.

---

> **نهاية التقرير** — هذا التقرير مبني بالكامل على الكود المصدري الفعلي للمشروع.  
> كل معلومة مدعومة بمرجع للملف والـ function المسؤولة.
