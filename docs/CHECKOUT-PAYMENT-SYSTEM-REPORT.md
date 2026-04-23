# تقرير نظام الدفع والتشيك اوت الكامل
# Checkout & Payment System – Full Developer Report

> **المشروع**: onlineautoabmelden.com  
> **التاريخ**: 2 أبريل 2026  
> **الغرض**: تقرير شامل للمطور لتكرار نفس النظام بالكامل في مشروع ثاني

---

## فهرس المحتويات

1. [نظرة عامة على المعمارية](#1-نظرة-عامة-على-المعمارية)
2. [خريطة الملفات الكاملة](#2-خريطة-الملفات-الكاملة)
3. [قاعدة البيانات – Prisma Models](#3-قاعدة-البيانات--prisma-models)
4. [بوابات الدفع – Payment Gateways](#4-بوابات-الدفع--payment-gateways)
5. [صفحة التشيك اوت – Checkout Page](#5-صفحة-التشيك-اوت--checkout-page)
6. [API الرئيسي – POST /api/checkout/direct](#6-api-الرئيسي--post-apicheckoutdirect)
7. [مسار كل بوابة دفع بالتفصيل](#7-مسار-كل-بوابة-دفع-بالتفصيل)
8. [Callbacks & Webhooks](#8-callbacks--webhooks)
9. [نظام الفواتير والإيميلات](#9-نظام-الفواتير-والإيميلات)
10. [نظام الكوبونات](#10-نظام-الكوبونات)
11. [الأمان والتحقق](#11-الأمان-والتحقق)
12. [متغيرات البيئة المطلوبة](#12-متغيرات-البيئة-المطلوبة)
13. [Seed Data](#13-seed-data)
14. [رسم بياني للـ Flow الكامل](#14-رسم-بياني-للـ-flow-الكامل)

---

## 1. نظرة عامة على المعمارية

النظام مبني على **Next.js 14 (App Router)** مع **Prisma ORM** و **SQLite/Turso** قاعدة بيانات.

### بوابات الدفع المدعومة:
| البوابة | المزود | الـ API المستخدم | الرسوم |
|---------|--------|------------------|--------|
| كريدت/ديبت كارد | Mollie | Payments API (`tr_xxxxx`) | 0.50€ |
| Apple Pay | Mollie | Payments API (`tr_xxxxx`) | 0.00€ |
| Klarna | Mollie | **Orders API** (`ord_xxxxx`) | 0.00€ |
| PayPal | PayPal مباشر | REST API v2 | 0.00€ |
| SEPA تحويل بنكي | بدون مزود | لا يوجد دفع أونلاين | 0.00€ |

### الفرق المهم:
- **Klarna** يستخدم Mollie **Orders API** (يتطلب line items كاملة) — باقي طرق Mollie تستخدم **Payments API** (مبلغ واحد)
- **PayPal** متصل مباشر بـ PayPal REST API v2 — بدون Mollie كوسيط
- **SEPA** لا يمر بأي بوابة دفع — يتم إنشاء الأوردر وإرسال الفاتورة مباشرة

---

## 2. خريطة الملفات الكاملة

### صفحات الـ Checkout والنتائج
```
src/app/rechnung/page.tsx                          ← صفحة التشيك اوت الرئيسية (Server Component)
src/app/bestellung-erfolgreich/page.tsx             ← صفحة النجاح بعد الدفع
src/app/zahlung-fehlgeschlagen/page.tsx             ← صفحة الفشل في الدفع
src/app/rechnung/[invoiceNumber]/page.tsx           ← صفحة عرض الفاتورة (عامة بتوكن)
```

### Components
```
src/components/CheckoutForm.tsx                     ← الفورم الرئيسي (React Hook Form + Zod)
src/components/checkout/PaymentMethodSelector.tsx   ← اختيار طريقة الدفع (Radio buttons)
src/components/checkout/OrderSummary.tsx            ← ملخص الطلب + كوبون + زر الدفع
```

### API Routes
```
src/app/api/checkout/direct/route.ts               ← POST: إنشاء الأوردر + بدء الدفع
src/app/api/payment/callback/route.ts              ← GET: Mollie callback بعد رجوع المستخدم
src/app/api/payment/webhook/route.ts               ← POST: Mollie webhook (إشعار غير متزامن)
src/app/api/payment/paypal/capture/route.ts        ← GET: PayPal capture بعد موافقة المستخدم
src/app/api/payment/paypal/webhook/route.ts        ← POST: PayPal webhook (إشعار غير متزامن)
```

### مكتبات الدفع (Libraries)
```
src/lib/payments.ts                                ← Mollie SDK: createMolliePayment, createMollieOrder, getMolliePaymentStatus, getMollieOrderStatus
src/lib/paypal.ts                                  ← PayPal REST API: createPayPalOrder, capturePayPalOrder, refundPayPalCapture
src/lib/db.ts                                      ← الاستعلامات: getEnabledPaymentMethods, getPaymentGatewayByCheckoutId
src/lib/validations.ts                             ← Zod schemas: checkoutDirectSchema
src/lib/rate-limit.ts                              ← Rate limiter: 8 طلبات/دقيقة لكل IP
src/lib/payment-logger.ts                          ← Payment logging system
```

### الفواتير والإيميلات
```
src/lib/invoice.ts                                 ← generateInvoicePDF (jsPDF) + sendInvoiceEmail (Nodemailer)
src/lib/invoice-template.ts                        ← HTML template للفاتورة
src/lib/trigger-invoice.ts                         ← triggerInvoiceEmail مع deduplication
src/lib/invoice-token.ts                           ← Token generation لعرض الفاتورة العامة
```

### Database
```
prisma/schema.prisma                               ← كل الموديلز
prisma/seed.ts                                     ← Seed data (5 بوابات + منتجات)
```

---

## 3. قاعدة البيانات – Prisma Models

### 3.1 Order Model
```prisma
model Order {
  id              String    @id @default(cuid())
  orderNumber     Int       @unique              // رقم الطلب التسلسلي
  status          String    @default("pending")  // pending → processing → completed | cancelled | refunded
  total           Float     @default(0)          // المبلغ الإجمالي (منتج - خصم + رسوم)
  subtotal        Float     @default(0)          // سعر المنتج الأصلي
  paymentFee      Float     @default(0)          // رسوم بوابة الدفع
  discountAmount  Float     @default(0)          // قيمة الخصم (كوبون)
  couponCode      String    @default("")         // كود الكوبون المستخدم
  currency        String    @default("EUR")
  paymentMethod   String    @default("")         // credit_card | paypal | apple_pay | sepa | klarna
  paymentTitle    String    @default("")         // الاسم المعروض (مثلاً "Kredit- / Debitkarte")
  transactionId   String    @default("")         // معرف المعاملة من المزود
  billingEmail    String    @default("")
  billingPhone    String    @default("")
  billingFirst    String    @default("")
  billingLast     String    @default("")
  billingStreet   String    @default("")
  billingCity     String    @default("")
  billingPostcode String    @default("")
  serviceData     String    @default("{}")       // بيانات الخدمة (JSON) - رقم اللوحة، المدينة، إلخ
  productName     String    @default("")
  customerId      String?                        // ربط بالعميل
  datePaid        DateTime?                      // تاريخ الدفع
  dateCompleted   DateTime?                      // تاريخ الإكمال
  completionEmailSent Boolean @default(false)    // هل تم إرسال إيميل الإكمال
  deletedAt       DateTime?                      // Soft delete
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  customer        Customer? @relation(...)
  items           OrderItem[]
  notes           OrderNote[]
  payments        Payment[]
  invoices        Invoice[]
  documents       OrderDocument[]
  messages        OrderMessage[]
}
```

### 3.2 Payment Model
```prisma
model Payment {
  id            String    @id @default(cuid())
  orderId       String                           // ربط بالأوردر
  gatewayId     String                           // معرف البوابة (credit_card, paypal, ...)
  transactionId String    @default("")           // معرف المعاملة (tr_xxxxx, ord_xxxxx, capture ID)
  amount        Float                            // المبلغ
  currency      String    @default("EUR")
  status        String    @default("pending")    // pending → paid | failed | cancelled | expired | refunded
  method        String    @default("")           // اسم الطريقة المعروض
  providerData  String    @default("{}")         // JSON كامل من المزود
  paidAt        DateTime?                        // تاريخ الدفع
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### 3.3 PaymentGateway Model
```prisma
model PaymentGateway {
  id          String   @id @default(cuid())
  gatewayId   String   @unique                   // mollie_creditcard | paypal | mollie_applepay | sepa | mollie_klarna
  name        String                             // الاسم المعروض
  description String   @default("")              // الوصف
  isEnabled   Boolean  @default(false)           // مفعلة أم لا
  fee         Float    @default(0)               // الرسوم بالـ €
  apiKey      String   @default("")              // (غير مستخدم حالياً - المفاتيح في env)
  secretKey   String   @default("")
  mode        String   @default("live")
  icon        String   @default("")              // مسار الأيقونة
  sortOrder   Int      @default(0)               // ترتيب العرض
  settings    String   @default("{}")            // إعدادات إضافية (JSON)
}
```

### 3.4 Invoice Model
```prisma
model Invoice {
  id              String    @id @default(cuid())
  invoiceNumber   String    @unique              // RE-2026-0001 (تنسيق ثابت)
  orderId         String                         // ربط بالأوردر
  customerId      String?
  billingName     String    @default("")
  billingEmail    String    @default("")
  billingAddress  String    @default("")
  billingCity     String    @default("")
  billingPostcode String    @default("")
  items           String    @default("[]")       // JSON array - عناصر الفاتورة
  subtotal        Float     @default(0)
  taxRate         Float     @default(19)         // ضريبة 19% ألمانية
  taxAmount       Float     @default(0)          // قيمة الضريبة المحسوبة
  total           Float     @default(0)
  paymentMethod   String    @default("")
  paymentStatus   String    @default("pending")  // pending | paid | refunded
  transactionId   String    @default("")
  pdfUrl          String    @default("")         // رابط الـ PDF
  invoiceDate     DateTime  @default(now())
  dueDate         DateTime?
}
```

### 3.5 Customer Model
```prisma
model Customer {
  id               String    @id @default(cuid())
  email            String    @unique
  firstName        String    @default("")
  lastName         String    @default("")
  phone            String    @default("")
  city             String    @default("")
  postcode         String    @default("")
  address          String    @default("")
  totalOrders      Int       @default(0)         // عدد الطلبات الكلي
  totalSpent       Float     @default(0)         // إجمالي المبالغ المدفوعة
  emailSubscribed  Boolean   @default(true)
}
```

### 3.6 نماذج مساعدة
```prisma
model OrderItem {
  id          String @id @default(cuid())
  orderId     String
  productName String
  quantity    Int    @default(1)
  price       Float  @default(0)
  total       Float  @default(0)
}

model OrderNote {
  id        String   @id @default(cuid())
  orderId   String
  note      String                               // نص الملاحظة
  author    String   @default("system")          // system | admin
  createdAt DateTime @default(now())
}

model Coupon {
  id              String    @id @default(cuid())
  code            String    @unique              // كود الكوبون (أحرف كبيرة)
  discountType    String    @default("fixed")    // fixed | percentage
  discountValue   Float     @default(0)          // القيمة بالـ € أو %
  minOrderValue   Float     @default(0)          // الحد الأدنى للطلب
  maxUsageTotal   Int       @default(0)          // 0 = بلا حدود
  maxUsagePerUser Int       @default(1)          // لكل إيميل
  usageCount      Int       @default(0)          // عدد الاستخدامات الحالي
  productSlugs    String    @default("")         // منتجات محددة (comma-separated)
  isActive        Boolean   @default(true)
  startDate       DateTime?
  endDate         DateTime?
}

model CouponUsage {
  id        String   @id @default(cuid())
  couponId  String
  email     String
  orderId   String?
  @@unique([couponId, email])                    // استخدام واحد لكل إيميل لكل كوبون
}
```

---

## 4. بوابات الدفع – Payment Gateways

### خريطة الأسماء (ID Mapping)

النظام يستخدم أسماء مختلفة في الـ DB والـ Frontend:

```typescript
// ملف: src/lib/db.ts (line 238-248)

// DB gatewayId → Frontend checkoutId
const GATEWAY_ID_MAP = {
  mollie_creditcard: 'credit_card',    // DB: mollie_creditcard → Frontend: credit_card
  mollie_applepay:   'apple_pay',      // DB: mollie_applepay   → Frontend: apple_pay
  mollie_klarna:     'klarna',         // DB: mollie_klarna     → Frontend: klarna
  paypal:            'paypal',         // نفس الاسم
  sepa:              'sepa',           // نفس الاسم
};

// Frontend checkoutId → DB gatewayId (عكسي)
const REVERSE_GATEWAY_MAP = Object.fromEntries(
  Object.entries(GATEWAY_ID_MAP).map(([k, v]) => [v, k])
);
```

### Mollie Method Mapping

```typescript
// ملف: src/lib/payments.ts (line 19-25)

// Frontend checkoutId → Mollie PaymentMethod enum
const MOLLIE_METHOD_MAP = {
  paypal:      PaymentMethod.paypal,
  credit_card: PaymentMethod.creditcard,
  apple_pay:   PaymentMethod.applepay,
  sepa:        PaymentMethod.banktransfer,
  klarna:      PaymentMethod.klarna,
};
```

### جلب البوابات المفعلة

```typescript
// ملف: src/lib/db.ts (line 259-280)

export async function getEnabledPaymentMethods() {
  const gateways = await prisma.paymentGateway.findMany({
    where: { isEnabled: true },
    orderBy: { sortOrder: 'asc' },
    select: { gatewayId, name, description, fee, icon },
  });

  return gateways.map((g) => ({
    id: GATEWAY_ID_MAP[g.gatewayId] || g.gatewayId,  // تحويل للـ frontend ID
    label: g.name,
    description: g.description,
    fee: g.fee,
    icon: g.icon,
  }));
}
```

---

## 5. صفحة التشيك اوت – Checkout Page

### 5.1 الصفحة الرئيسية (`src/app/rechnung/page.tsx`)

صفحة **Server Component** تجلب البيانات وتمررها:

```typescript
export default async function CheckoutPage() {
  const paymentMethods = await getEnabledPaymentMethods();  // بوابات الدفع المفعلة
  const settings = await getSiteSettings();                  // إعدادات الموقع

  return (
    // Trust badges (SSL, DSGVO, etc.)
    // CheckoutForm component
    <CheckoutForm
      paymentMethods={paymentMethods}
      settings={settings}
    />
  );
}
```

### 5.2 CheckoutForm (`src/components/CheckoutForm.tsx`)

الفورم الرئيسي يستخدم **React Hook Form** مع **Zod validation**:

**الحقول:**
- `firstName`, `lastName` — الاسم
- `company` — الشركة (اختياري)
- `street`, `postcode`, `city` — العنوان
- `phone` — الهاتف (مطلوب)
- `email` — الإيميل (مطلوب)
- `paymentMethod` — طريقة الدفع (مطلوب)
- `couponCode` — كود الخصم (اختياري)
- `productId` — المنتج (`abmeldung` أو `anmeldung`)
- `serviceData` — بيانات الخدمة (رقم اللوحة، إلخ)

**الـ Flow عند الضغط على "Zahlungspflichtig bestellen":**

```
1. Client-side validation (Zod)
2. POST /api/checkout/direct مع كل البيانات
3. الاستجابة تحتوي على:
   - paymentUrl → redirect للمزود (Mollie/PayPal)
   - invoiceUrl → redirect للفاتورة (SEPA/مجاني)
4. window.location.href = paymentUrl أو invoiceUrl
```

### 5.3 PaymentMethodSelector (`src/components/checkout/PaymentMethodSelector.tsx`)

- يعرض Radio buttons لكل بوابة مفعلة
- يعرض الوصف والأيقونة والرسوم
- Klarna يطلب حقول إضافية (عنوان كامل)

### 5.4 OrderSummary (`src/components/checkout/OrderSummary.tsx`)

- ملخص السعر (المنتج + الرسوم - الخصم = الإجمالي)
- حقل إدخال الكوبون
- Checkbox الموافقة على الشروط (AGB)
- زر الإرسال

---

## 5.5 تفاصيل واجهة صفحة التشيك اوت (UI Structure)

### الهيكل العام للصفحة (`/rechnung`):

```
┌──────────────────────────────────────────────────────────────────┐
│  HERO SECTION                                                     │
│  ├── خلفية gradient: from-dark via-primary-900 to-dark            │
│  ├── Breadcrumb: Startseite / Kasse                                │
│  ├── Badge أخضر: 🛡️ SICHERE BEZAHLUNG                             │
│  ├── عنوان: "Kasse" (3xl-5xl, font-extrabold, text-white)         │
│  ├── وصف: "Schließen Sie Ihren Auftrag sicher ab..."              │
│  └── زخارف: دوائر blur + قفل watermark شفاف (opacity 0.03)       │
├──────────────────────────────────────────────────────────────────┤
│  TRUST FEATURES BAR (-mt-6, يتداخل مع الـ Hero)                  │
│  ├── 4 أعمدة على Desktop / 2 على Mobile                          │
│  ├── 🔒 SSL-Verschlüsselung — 256-Bit gesicherte Datenübertragung │
│  ├── 🔐 DSGVO-konform — Ihre Daten sind sicher & geschützt         │
│  ├── ✅ Offizielle Bearbeitung — Sicher und korrekt übermittelt     │
│  └── ⏱️ Sofort-Prüfung — Direkte Bearbeitung Ihres Auftrags       │
├──────────────────────────────────────────────────────────────────┤
│  MAIN CONTENT (bg-gray-50, grid lg:grid-cols-5)                   │
│                                                                    │
│  ┌─── col-span-3 ────────────┐  ┌─── col-span-2 ──────────────┐  │
│  │  PaymentMethodSelector     │  │  OrderSummary (sticky)       │  │
│  │  (انظر تفاصيل أسفل)        │  │  (انظر تفاصيل أسفل)         │  │
│  └────────────────────────────┘  └──────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│  SUPPORT BAR (أسفل الصفحة)                                       │
│  ├── أيقونة سماعات                                                │
│  ├── "Brauchen Sie Hilfe bei der Bestellung?"                     │
│  ├── وصف: Support متاح عبر Telefon, WhatsApp, E-Mail             │
│  └── زر الاتصال بالرقم                                            │
└──────────────────────────────────────────────────────────────────┘
```

### PaymentMethodSelector — العمود الأيسر (3/5):

```
┌──────────────────────────────────────────────────────────┐
│  HEADER (gradient from-primary to-primary/90)             │
│  💳 Zahlungsmethode                                       │
│  "Alle Zahlungen sind SSL-verschlüsselt"                  │
├──────────────────────────────────────────────────────────┤
│  PAYMENT METHODS (Radio buttons, space-y-3)               │
│                                                            │
│  ┌─ Selected ────────────────────────────────────────┐    │
│  │ ◉ PayPal                           PayPal logo    │    │
│  ├───────────────────────────────────────────────────┤    │
│  │ ▶ وصف الطريقة + حقول الإدخال                       │    │
│  │                                                    │    │
│  │ [Non-Klarna الحقول:]                                │    │
│  │   Name / Firma *        [___________________]     │    │
│  │   Telefon *             [___________________]     │    │
│  │   E-Mail-Adresse *      [___________________]     │    │
│  │                                                    │    │
│  │ [Klarna الحقول — إضافية:]                           │    │
│  │   Vorname *    [________]  Nachname *  [________] │    │
│  │   Straße und Hausnr. *  [___________________]     │    │
│  │   PLZ *  [_____]   Stadt *  [_______________]     │    │
│  │   Telefon *             [___________________]     │    │
│  │   E-Mail-Adresse *      [___________________]     │    │
│  └───────────────────────────────────────────────────┘    │
│                                                            │
│  ┌─ Unselected ──────────────────────────────────────┐    │
│  │ ○ Apple Pay                        Apple Pay text  │    │
│  └───────────────────────────────────────────────────┘    │
│  ┌─ Unselected ──────────────────────────────────────┐    │
│  │ ○ Kredit- und Debitkarte              Karte text  │    │
│  └───────────────────────────────────────────────────┘    │
│  ┌─ Unselected ──────────────────────────────────────┐    │
│  │ ○ Klarna                           Klarna badge   │    │
│  └───────────────────────────────────────────────────┘    │
│  ┌─ Unselected ──────────────────────────────────────┐    │
│  │ ○ SEPA Überweisung                     💰 icon    │    │
│  └───────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### السلوك الديناميكي للحقول:

```typescript
// Klarna يتطلب عنوان كامل (Mollie Orders API يتطلبها):
if (paymentMethod === 'klarna') {
  // يظهر: Vorname, Nachname, Straße, PLZ, Stadt, Telefon, E-Mail
  // كل الحقول مطلوبة (*)
  // PLZ يجب أن يكون 5 أرقام
} else {
  // يظهر: Name/Firma, Telefon, E-Mail
  // حقول أقل — فقط الأساسي
}

// Apple Pay يختفي إذا الجهاز لا يدعمه:
if (!window.ApplePaySession?.canMakePayments()) {
  // Apple Pay يُحذف من القائمة
}
```

### OrderSummary — العمود الأيمن (2/5, sticky):

```
┌──────────────────────────────────────────────────────┐
│  HEADER (gradient from-dark to-dark/90)               │
│  🛡️ Ihre Bestellung                                   │
├──────────────────────────────────────────────────────┤
│  المنتج:                                              │
│  Fahrzeug jetzt online abmelden        ×1   19,70 €  │
│  ─────────────────────────────────────────────────    │
│  Zwischensumme                              19,70 €  │
│  Zahlungsgebühr               Kostenlos أو  0,50 €   │
│                                                       │
│  ┌─ Coupon Input ──────────────────────────────────┐ │
│  │  [Gutscheincode______]  [Einlösen]              │ │
│  └─────────────────────────────────────────────────┘ │
│  أو إذا مُطبق:                                      │
│  ┌─ Applied Coupon ────────────────────────────────┐ │
│  │  ✅ SUMMER20                              [✕]   │ │
│  └─────────────────────────────────────────────────┘ │
│  🏷️ Gutschein (SUMMER20)                    -3,94 €  │
│  ═══════════════════════════════════════════════════  │
│  Gesamtsumme                               16,26 €   │
│  (inkl. MwSt.)                                       │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ☐ AGB akzeptieren (Checkbox + رابط AGB + Datenschutz) │
│                                                       │
│  [Error box — أحمر — يظهر عند فشل API]               │
│                                                       │
│  ┌─ Submit Button (حسب طريقة الدفع) ──────────────┐ │
│  │                                                  │ │
│  │  PayPal:  [🟡 PayPal Jetzt kaufen]    (#FFC439) │ │
│  │  Apple:   [⬛ Mit  Pay bezahlen]     (black)   │ │
│  │  Default: [🟢 🔒 Zahlungspflichtig bestellen ›] │ │
│  │           (gradient accent→green-500)            │ │
│  └──────────────────────────────────────────────────┘ │
│                                                       │
│  🔒 256-Bit SSL-verschlüsselte Verbindung             │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  Trust Badges (3 أيقونات):                            │
│  🔒 SSL-verschlüsselt  ✅ DSGVO-konform  🔐 Sicher   │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  🛡️ Faire und transparente Prüfung                    │
│  "Sollte es bei der Bearbeitung Probleme geben..."   │
└──────────────────────────────────────────────────────┘
```

### أزرار الإرسال الثلاثة (حسب طريقة الدفع):

| طريقة الدفع | لون الزر | النص | الأيقونة |
|-------------|----------|------|----------|
| PayPal | `#FFC439` (أصفر PayPal) | "PayPal Jetzt kaufen" | شعار PayPal بالألوان |
| Apple Pay | `black` | "Mit  Pay bezahlen" | شعار Apple SVG أبيض |
| الباقي | `gradient accent→green-500` | "🔒 Zahlungspflichtig bestellen ›" | قفل + سهم |
| أثناء التحميل | نفس اللون + opacity 70% | "Wird weitergeleitet…" / "Bestellung wird erstellt…" | Loader spinner |

### حالة النجاح (بعد الإرسال مباشرة — orders مجانية/SEPA):

```
┌──────────────────────────────────────────────────────┐
│                    ✅ (دائرة خضراء كبيرة)              │
│                                                       │
│        Bestellung erfolgreich übermittelt              │
│                                                       │
│  Vielen Dank. Wir haben Ihre Bestellung erhalten     │
│  und prüfen Ihren Auftrag jetzt.                     │
│                                                       │
│  Weitere Informationen senden wir Ihnen an Ihre      │
│  E-Mail-Adresse.                                     │
│                                                       │
│        [Zurück zur Startseite ›]                      │
└──────────────────────────────────────────────────────┘
```

### أوصاف كل طريقة دفع (تظهر عند الاختيار):

| الطريقة | الوصف المعروض |
|---------|---------------|
| PayPal | "Zahlen Sie sicher und schnell mit PayPal. Nach Klick auf „PayPal Jetzt kaufen" werden Sie automatisch zur sicheren PayPal-Zahlung weitergeleitet." |
| Apple Pay | "Bezahlen Sie bequem und sicher mit Apple Pay. Nach Klick auf „Mit Apple Pay bezahlen" werden Sie zur sicheren Zahlungsseite weitergeleitet." |
| Kreditkarte | "Zahlen Sie sicher per Kredit- oder Debitkarte..." + 🔒 "Sichere Zahlungen bereitgestellt durch **mollie**" |
| SEPA | "Bitte überweisen Sie den Gesamtbetrag auf unser Bankkonto. Die Bearbeitung beginnt nach Zahlungseingang." |
| Klarna | "Bezahlen Sie flexibel mit Klarna – sofort, später oder in Raten." + 🔒 "Sichere Zahlungen bereitgestellt durch **Klarna** via **mollie**" |

### Brand Icons لكل طريقة:

```typescript
PayPal:      <span>Pay<span style="color:#009cde">Pal</span></span>  // أزرق غامق + سماوي
Apple Pay:   <span>Apple Pay</span>                                   // أسود bold
Kreditkarte: <span>Karte</span>                                      // نص صغير
SEPA:        <Banknote icon />                                       // أيقونة رمادية
Klarna:      <span bg="#FFB3C7">Klarna.</span>                       // Badge وردي
```

### التصميم التقني (Tailwind classes):

```
الصفحة:          bg-gray-50, max-w-6xl mx-auto
الكروت:          bg-white rounded-2xl border border-gray-100 shadow-lg
الحقول:          px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2
Radio المختار:   border-2 border-primary bg-primary/[0.03]
Radio العادي:    border-2 border-gray-100 hover:border-gray-200
الأخطاء:         text-red-500 text-sm مع أيقونة AlertCircle
OrderSummary:    lg:sticky lg:top-28 (يلتصق عند التمرير)
```

---

## 6. API الرئيسي – POST /api/checkout/direct

**الملف**: `src/app/api/checkout/direct/route.ts`

هذا هو API الوحيد لإنشاء الأوردرات. يقوم بكل شيء:

### خطوات المعالجة بالترتيب:

```
الخطوة 1: Rate Limiting
├── 8 طلبات / 60 ثانية لكل IP
├── يرجع 429 مع Retry-After header إذا تجاوز الحد
└── ملف: src/lib/rate-limit.ts

الخطوة 2: Zod Validation
├── التحقق من كل الحقول المطلوبة
├── email: valid email format
├── phone: 6+ chars, أرقام فقط مع +/-/()/مسافات
└── ملف: src/lib/validations.ts

الخطوة 3: التحقق من طريقة الدفع
├── SEPA و PayPal لهم مسارات خاصة
├── باقي الطرق يجب أن يكون لها Mollie method mapping
└── خطأ 400 إذا الطريقة غير مدعومة

الخطوة 4: BATCH 1 (استعلامات متوازية)
├── getCachedGateway(paymentMethod) — بوابة الدفع مع الرسوم
├── getCachedProduct(slug) — المنتج والسعر
├── max orderNumber — آخر رقم أوردر
└── last invoiceNumber — آخر رقم فاتورة في نفس السنة

الخطوة 5: التحقق من بوابة الدفع
├── يجب أن تكون مفعلة (isEnabled: true)
├── الرسوم تأتي من DB (ليس من الفرونت)
└── خطأ 400 إذا غير مفعلة

الخطوة 6: التحقق من المنتج
├── يجب أن يكون موجود وفعال (isActive: true)
├── السعر من DB (لا نثق بسعر الكلاينت)
└── السعر من الكلاينت يُقبل فقط إذا >= سعر DB

الخطوة 7: التحقق من الكوبون (إذا أدخل كوبون)
├── isActive — مفعل
├── startDate / endDate — صلاحية التاريخ
├── maxUsageTotal — لم يتجاوز الحد الكلي
├── maxUsagePerUser — لم يستخدمه نفس الإيميل
├── productSlugs — يعمل على هذا المنتج
├── minOrderValue — الحد الأدنى للطلب
├── حساب الخصم: percentage → (سعر × نسبة / 100) | fixed → min(قيمة, سعر)
└── 10 أنواع أخطاء محددة بالألمانية

الخطوة 8: حساب الإجمالي
├── orderTotal = max(productPrice - discountAmount + paymentFee, 0)
└── لا يمكن أن يكون سلبي

الخطوة 9: BATCH 2 - إنشاء الأوردر
├── Customer upsert (إنشاء أو تحديث) بحسب الإيميل
├── Order create مع retry (5 محاولات) لتعارض orderNumber
├── OrderItem create (المنتج + رسوم الدفع إذا > 0)
├── Payment create (status: pending)
├── Invoice create مع retry (5 محاولات) لتعارض invoiceNumber
└── CouponUsage create + increment usageCount

الخطوة 10: التوجيه حسب طريقة الدفع ← (انظر القسم 7)
```

### تنسيق رقم الفاتورة:
```
RE-{YEAR}-{0001}
مثال: RE-2026-0001, RE-2026-0002, RE-2026-0003
```

### الكاش (In-memory cache):
```typescript
// Cache مدته 5 دقائق لبيانات شبه ثابتة
const CACHE_TTL = 5 * 60 * 1000;
const gatewayCache = new Map();   // بوابات الدفع
const productCache = new Map();   // المنتجات
```

---

## 7. مسار كل بوابة دفع بالتفصيل

### 7.1 الأوردر المجاني (Full Coupon Discount)

```
الشرط: orderTotal <= 0 (الكوبون يغطي كامل المبلغ)

1. تحديث الأوردر: status = "processing"
2. تحديث الدفع: status = "paid", transactionId = "FREE-{COUPON_CODE}"
3. تحديث الفاتورة: paymentStatus = "paid"
4. إرسال الفاتورة بالإيميل فوراً
5. إرجاع invoiceUrl (لا يوجد redirect لمزود دفع)

الاستجابة:
{
  success: true,
  orderId: "clxxx...",
  orderNumber: 123,
  total: "0.00",
  invoiceNumber: "RE-2026-0001",
  invoiceUrl: "/rechnung/RE-2026-0001?order=123&token=xxx"
}
```

### 7.2 SEPA (تحويل بنكي)

```
1. تحديث الأوردر: status = "on-hold" (في انتظار التحويل)
2. إرسال الفاتورة بالإيميل فوراً (تحتوي بيانات التحويل)
3. إرجاع invoiceUrl (لا يوجد redirect لمزود دفع)
   ← الإدمن يؤكد الدفع يدوياً عند وصول التحويل

الاستجابة:
{
  success: true,
  orderId: "clxxx...",
  orderNumber: 123,
  total: "19.70",
  invoiceNumber: "RE-2026-0001",
  invoiceUrl: "/rechnung/RE-2026-0001?order=123&token=xxx"
  // ❌ لا يوجد paymentUrl
}
```

### 7.3 PayPal (مباشر بدون Mollie)

```
1. استدعاء createPayPalOrder() في src/lib/paypal.ts
   ├── الحصول على Access Token (OAuth2, cached)
   ├── POST https://api-m.paypal.com/v2/checkout/orders
   ├── intent: "CAPTURE"
   ├── purchase_units: [{ amount, description, custom_id: orderId }]
   ├── experience_context: {
   │     brand_name: "Online Auto Abmelden",
   │     locale: "de-DE",
   │     landing_page: "LOGIN",
   │     user_action: "PAY_NOW",
   │     return_url: "/api/payment/paypal/capture?orderId=xxx",
   │     cancel_url: "/rechnung?error=payment-cancelled"
   │   }
   └── الحصول على paypalOrderId + approvalUrl

2. تحديث Payment: transactionId = paypalOrderId
3. إرجاع paymentUrl = approvalUrl (redirect المستخدم لـ PayPal)

الاستجابة:
{
  success: true,
  orderId: "clxxx...",
  orderNumber: 123,
  total: "19.70",
  paymentUrl: "https://www.paypal.com/checkoutnow?token=xxx",
  invoiceNumber: "RE-2026-0001"
}

بعد الموافقة على PayPal:
├── PayPal يعيد المستخدم لـ /api/payment/paypal/capture?orderId=xxx&token=xxx
├── التقاط (capture) الدفع: POST /v2/checkout/orders/{id}/capture
├── إذا COMPLETED → processing + paid + إرسال فاتورة + redirect لصفحة النجاح
└── إذا فشل → redirect لصفحة الفشل
```

### 7.4 Kredit-/Debitkarte (Mollie Payments API)

```
1. استدعاء createMolliePayment() في src/lib/payments.ts
   ├── mollie.payments.create({
   │     amount: { currency: "EUR", value: "20.20" },
   │     description: "Bestellung #123 – Fahrzeugabmeldung",
   │     redirectUrl: "/api/payment/callback?orderId=xxx",
   │     webhookUrl: "/api/payment/webhook",  // فقط في live mode
   │     method: PaymentMethod.creditcard,     // فقط في live mode (test ← يحذف)
   │     locale: "de_DE",
   │     metadata: { orderId, orderNumber, email, productId },
   │     billingAddress: { givenName, familyName, email, streetAndNumber, postalCode, city, country: "DE" }
   │   })
   └── النتيجة: paymentId (tr_xxxxx) + checkoutUrl

2. تحديث Payment: transactionId = tr_xxxxx
3. إرجاع paymentUrl = checkoutUrl

4. Fallback Logic (مهم!):
   ├── إذا method غير مفعلة في Mollie profile → خطأ "not enabled"
   ├── النظام يحذف method ويعيد المحاولة (Mollie يعرض صفحة اختيار)
   └── هذا يضمن عدم فشل الدفع بسبب إعدادات Mollie

بعد الدفع:
├── Mollie يعيد المستخدم لـ /api/payment/callback?orderId=xxx
├── يتحقق من الحالة عبر getMolliePaymentStatus(tr_xxxxx)
├── paid → processing + إرسال فاتورة + redirect نجاح
├── failed/canceled/expired → redirect فشل
└── open/pending → redirect نجاح مع status=pending
```

### 7.5 Apple Pay (Mollie Payments API)

```
نفس مسار الكريدت كارد بالضبط
الفرق الوحيد: method = PaymentMethod.applepay
Mollie يتعامل مع Apple Pay UI
```

### 7.6 Klarna (Mollie Orders API) ⚠️ مختلف

```
1. استدعاء createMollieOrder() في src/lib/payments.ts  ← ليس createMolliePayment!

   ├── بناء line items (مطلوب لـ Klarna):
   │   [
   │     { name: "Fahrzeugabmeldung", quantity: 1, unitPrice: "19.70", vatRate: "19.00", ... },
   │     { name: "Zahlungsgebühr", quantity: 1, unitPrice: "0.50", ... },     // إذا > 0
   │     { name: "Rabatt (CODE)", quantity: 1, unitPrice: "-5.00", ... },      // إذا كوبون
   │   ]
   │
   ├── mollie.orders.create({
   │     amount: { currency: "EUR", value: "20.20" },
   │     orderNumber: "123",
   │     lines: [...],                    ← عناصر مفصلة (مطلوب!)
   │     billingAddress: {                ← عنوان كامل (مطلوب!)
   │       givenName, familyName, email,
   │       streetAndNumber, postalCode, city, country: "DE"
   │     },
   │     redirectUrl: "/api/payment/callback?orderId=xxx",
   │     webhookUrl: "/api/payment/webhook",
   │     locale: "de_DE",
   │     method: "klarna",
   │     metadata: { orderId, orderNumber, email, productId }
   │   })
   └── النتيجة: orderId (ord_xxxxx) + checkoutUrl

2. تحديث Payment: transactionId = ord_xxxxx
3. إرجاع paymentUrl = checkoutUrl (Klarna checkout page)

⚠️ الفروقات الرئيسية عن Payments API:
├── يستخدم Orders API (ord_xxxxx بدل tr_xxxxx)
├── يتطلب line items تفصيلية مع VAT
├── يتطلب billingAddress كامل
├── في الـ callback: يستخدم getMollieOrderStatus() بدل getMolliePaymentStatus()
├── الحالة "authorized" تعني الدفع مضمون (يُعامل كـ "paid")
└── الحالة "completed" = تم التسوية مع Klarna
```

---

## 8. Callbacks & Webhooks

### 8.1 Mollie Callback (`/api/payment/callback`)

**ملف**: `src/app/api/payment/callback/route.ts`  
**النوع**: GET  
**متى يُستدعى**: Mollie يعيد المستخدم بعد الدفع (أو الإلغاء)

```
GET /api/payment/callback?orderId=clxxx...

1. جلب الأوردر + payments من DB
2. التحقق من transactionId:
   ├── يبدأ بـ ord_ → getMollieOrderStatus() (Klarna)
   └── يبدأ بـ tr_  → getMolliePaymentStatus() (باقي الطرق)
3. حسب الحالة:
   ├── paid | authorized | completed:
   │   ├── تحديث Order: status="processing", datePaid=now()
   │   ├── تحديث Payment: status="paid", paidAt=now()
   │   ├── تحديث Invoice: paymentStatus="paid"
   │   ├── triggerInvoiceEmail(orderId)
   │   └── Redirect → /bestellung-erfolgreich?order=123
   │
   ├── failed | canceled | expired:
   │   ├── تحديث Payment: status, providerData
   │   ├── إنشاء OrderNote مع سبب الفشل
   │   └── Redirect → /zahlung-fehlgeschlagen?order=123&reason=xxx
   │
   └── open | pending:
       └── Redirect → /bestellung-erfolgreich?order=123&status=pending
```

### 8.2 Mollie Webhook (`/api/payment/webhook`)

**ملف**: `src/app/api/payment/webhook/route.ts`  
**النوع**: POST  
**متى يُستدعى**: Mollie يرسل إشعار عند تغير حالة الدفع (غير متزامن)  
**الغرض**: شبكة أمان — يضمن تحديث الأوردر حتى لو فشل الـ callback

```
POST /api/payment/webhook
Content-Type: application/x-www-form-urlencoded
Body: id=tr_xxxxx أو id=ord_xxxxx

1. قراءة mollieId من form data
2. جلب الحالة من Mollie API
3. استخراج orderId من metadata
4. تحويل حالة Mollie لحالة النظام:
   ├── paid | authorized | completed → orderStatus: "processing", paymentStatus: "paid"
   ├── failed → "cancelled" / "failed"
   ├── canceled → "cancelled" / "cancelled"
   ├── expired → "cancelled" / "expired"
   └── open | pending → "pending" / "pending"
5. التحقق من الـ refunds:
   ├── amountRefunded > 0 && == totalAmount → "refunded"
   └── amountRefunded > 0 && < totalAmount → "partially_refunded"
6. تحديث Order, Payment, Invoice
7. إنشاء OrderNote
8. إذا paid → triggerInvoiceEmail(orderId)

⚠️ مهم جداً: يرجع 200 OK دائماً!
├── حتى عند حدوث خطأ → return { success: true }
├── لأن Mollie يعتبر الـ URL "unreachable" عند 4xx/5xx
└── وهذا يمنع إنشاء دفعات جديدة (يكسر الـ checkout بالكامل)
```

### 8.3 PayPal Capture (`/api/payment/paypal/capture`)

**ملف**: `src/app/api/payment/paypal/capture/route.ts`  
**النوع**: GET  
**متى يُستدعى**: PayPal يعيد المستخدم بعد الموافقة

```
GET /api/payment/paypal/capture?orderId=clxxx...&token=EC-xxxxx

1. جلب الأوردر + payment من DB
2. التحقق: هل الأوردر مدفوع بالفعل؟ → redirect للنجاح مباشرة
3. capturePayPalOrder(transactionId):
   ├── POST /v2/checkout/orders/{paypalOrderId}/capture
   └── النتيجة: { captureId, status, payerEmail, amount }
4. إذا COMPLETED:
   ├── تحديث Order: status="processing", datePaid, transactionId=captureId
   ├── تحديث Payment: status="paid", transactionId=captureId, providerData
   ├── تحديث Invoice: paymentStatus="paid"
   ├── إنشاء OrderNote: "PayPal-Zahlung erfolgreich"
   ├── triggerInvoiceEmail(orderId)
   └── Redirect → /bestellung-erfolgreich?order=123
5. غير ذلك:
   ├── إنشاء OrderNote: "PayPal-Zahlung fehlgeschlagen"
   └── Redirect → /zahlung-fehlgeschlagen?order=123
```

### 8.4 PayPal Webhook (`/api/payment/paypal/webhook`)

**ملف**: `src/app/api/payment/paypal/webhook/route.ts`  
**النوع**: POST  
**متى يُستدعى**: PayPal يرسل إشعار عند تغير حالة الدفع  
**الأحداث المعالجة**:

```
POST /api/payment/paypal/webhook
Content-Type: application/json

Event Types:

1. PAYMENT.CAPTURE.COMPLETED:
   ├── البحث عن Payment بـ captureId أو custom_id (orderId)
   ├── إذا لم يتم المعالجة بعد:
   │   ├── تحديث Order/Payment/Invoice → paid
   │   ├── إنشاء OrderNote
   │   └── triggerInvoiceEmail()
   └── تخطي إذا مدفوع بالفعل (حماية من التكرار)

2. PAYMENT.CAPTURE.DENIED:
   ├── تحديث Order: status="cancelled"
   ├── تحديث Payment: status="failed"
   └── إنشاء OrderNote

3. PAYMENT.CAPTURE.REFUNDED:
   ├── تحديث Order: status="refunded"
   ├── تحديث Payment: status="refunded"
   └── إنشاء OrderNote

⚠️ يرجع 200 OK دائماً (مثل Mollie webhook)
```

---

## 9. نظام الفواتير والإيميلات

### 9.1 Invoice Generation (`src/lib/invoice.ts`)

```typescript
// الوظيفة الرئيسية
async function generateAndSendInvoice(orderId: string) {
  // 1. جلب بيانات الأوردر + الفاتورة من DB
  // 2. إنشاء PDF عبر jsPDF:
  //    ├── Header مع الشعار واسم الشركة
  //    ├── بيانات العميل
  //    ├── جدول العناصر (اسم، كمية، سعر، المجموع)
  //    ├── المبلغ الصافي
  //    ├── ضريبة 19% (MwSt)
  //    ├── المبلغ الإجمالي
  //    └── Footer مع بيانات الشركة
  // 3. إرسال عبر SMTP (Nodemailer + Titan):
  //    ├── للعميل: فاتورة + تفاصيل الطلب
  //    ├── للإدمن: نسخة + تفاصيل
  //    └── PDF كمرفق
  // 4. تسجيل النتيجة في OrderNote
}
```

### 9.2 Deduplication (`src/lib/trigger-invoice.ts`)

```typescript
// مشكلة: Callback و Webhook يصلان بنفس الوقت تقريباً
// الحل: In-memory Set يمنع الإرسال المزدوج

const triggeredOrders = new Set<string>();

export async function triggerInvoiceEmail(orderId: string) {
  if (triggeredOrders.has(orderId)) {
    return { success: true };  // تم الإرسال بالفعل — تخطي
  }

  triggeredOrders.add(orderId);
  setTimeout(() => triggeredOrders.delete(orderId), 5 * 60 * 1000);  // حذف بعد 5 دقائق

  return await generateAndSendInvoice(orderId);
}

// Timeline مثال:
// T=0ms    → Callback يصل → triggerInvoiceEmail(orderId) → يرسل الإيميل ✅
// T=150ms  → Webhook يصل  → triggerInvoiceEmail(orderId) → "already triggered" ← يتخطى ✅
// T=5min   → Entry يُحذف → يسمح بإعادة الإرسال اليدوي إذا لزم الأمر
```

### 9.3 SMTP Configuration

```
Provider: Titan Email
Host: smtp.titan.email
Port: 465 (SSL)
From: info@onlineautoabmelden.com
Admin CC: info@onlineautoabmelden.com

⚠️ كلمة السر مخزنة بـ Base64 (SMTP_PASS_B64)
لتجنب مشكلة $ في كلمات السر مع .env parser
```

---

## 10. نظام الكوبونات

### التحقق الكامل (Server-side فقط):

```
1. ✅ isActive — الكوبون مفعل
2. ✅ startDate — لم يبدأ قبل الوقت
3. ✅ endDate — لم ينتهي
4. ✅ maxUsageTotal — لم يتجاوز الحد الكلي (0 = بلا حد)
5. ✅ maxUsagePerUser — الإيميل لم يستخدمه من قبل (CouponUsage)
6. ✅ productSlugs — يعمل على المنتج المحدد
7. ✅ minOrderValue — الحد الأدنى للطلب مستوفى

الحساب:
├── percentage: round(price × value / 100 × 100) / 100
└── fixed: min(value, price)

بعد الاستخدام:
├── CouponUsage.create({ couponId, email, orderId })
└── Coupon.update({ usageCount: { increment: 1 } })
```

---

## 11. الأمان والتحقق

| الحماية | الملف | التفاصيل |
|---------|-------|----------|
| Rate Limiting | `src/lib/rate-limit.ts` | 8 طلبات/60 ثانية لكل IP (sliding window) |
| سعر من السيرفر | `route.ts` L107-122 | السعر من DB دائماً — لا نثق بسعر الكلاينت |
| Zod Validation | `src/lib/validations.ts` | Email, phone, payment method |
| بوابة مفعلة | `route.ts` L81-89 | يجب أن تكون isEnabled: true |
| كوبون تحقق كامل | `route.ts` L144-178 | 7 فحوصات مختلفة |
| OrderNumber Retry | `route.ts` L220-260 | 5 محاولات لتجنب تعارض concurrent |
| InvoiceNumber Retry | `route.ts` L340-370 | 5 محاولات لتجنب تعارض concurrent |
| Webhook 200 OK | webhook routes | يرجع 200 دائماً لمنع حجب المزود |
| Invoice Dedup | `trigger-invoice.ts` | In-memory Set يمنع إرسال مزدوج |
| Mollie Fallback | `payments.ts` L130-160 | إذا method غير مفعلة → يعيد بدون method |

---

## 12. متغيرات البيئة المطلوبة

```bash
# ─── Mollie ───
MOLLIE_API_KEY=live_xxxxxxxxxxxxx           # أو test_xxx لوضع الاختبار

# ─── PayPal ───
PAYPAL_CLIENT_ID=AH...xxxxx                 # من PayPal Developer Dashboard
PAYPAL_CLIENT_SECRET=xxxxxxxxxxxxxxx
PAYPAL_MODE=live                            # "live" أو "sandbox"

# ─── الموقع ───
SITE_URL=https://onlineautoabmelden.com     # للـ callbacks/webhooks
NEXT_PUBLIC_SITE_URL=https://onlineautoabmelden.com

# ─── SMTP (Titan Email) ───
SMTP_HOST=smtp.titan.email
SMTP_PORT=465
SMTP_USER=info@onlineautoabmelden.com
SMTP_PASS_B64=xxxxxxxxxx                    # base64(password) لتجنب $ corruption
EMAIL_FROM=info@onlineautoabmelden.com
EMAIL_FROM_NAME=Online Auto Abmelden
ADMIN_EMAIL=info@onlineautoabmelden.com     # يستقبل نسخة من كل فاتورة

# ─── قاعدة البيانات ───
DATABASE_URL=file:./dev.db                  # SQLite محلي أو Turso URL
```

---

## 13. Seed Data

**ملف**: `prisma/seed.ts`

### المنتجات:
```typescript
{ slug: 'fahrzeugabmeldung', name: 'Fahrzeugabmeldung', price: 19.70 }
{ slug: 'auto-online-anmelden', name: 'Fahrzeuganmeldung', price: 99.70 }
```

### بوابات الدفع:
```typescript
{ gatewayId: 'mollie_creditcard', name: 'Kredit- / Debitkarte', fee: 0.50, sortOrder: 1, isEnabled: true }
{ gatewayId: 'paypal',            name: 'PayPal',                fee: 0.00, sortOrder: 2, isEnabled: true }
{ gatewayId: 'mollie_applepay',   name: 'Apple Pay',             fee: 0.00, sortOrder: 3, isEnabled: true }
{ gatewayId: 'sepa',              name: 'SEPA-Überweisung',      fee: 0.00, sortOrder: 4, isEnabled: true }
{ gatewayId: 'mollie_klarna',     name: 'Klarna',                fee: 0.00, sortOrder: 5, isEnabled: true }
```

---

## 14. رسم بياني للـ Flow الكامل

```
┌──────────────────────────────────────────────────────────────────────┐
│                          المستخدم (Browser)                          │
│                                                                      │
│  /rechnung ← صفحة التشيك اوت                                         │
│  ├── يملأ البيانات (الاسم، الإيميل، الهاتف)                           │
│  ├── يختار طريقة الدفع                                                │
│  ├── يدخل كوبون (اختياري)                                             │
│  └── يضغط "Zahlungspflichtig bestellen"                               │
└────────────────────────┬─────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                POST /api/checkout/direct                             │
│                                                                      │
│  Rate Limit → Zod Validate → Get Gateway + Product + Coupon          │
│  → Create Order + Customer + Payment + Invoice                       │
│  → Route by Payment Method ↓                                        │
└────┬─────────┬──────────┬──────────┬──────────┬─────────────────────┘
     │         │          │          │          │
     ▼         ▼          ▼          ▼          ▼
  مجاني     SEPA      PayPal     Mollie    Klarna
  (كوبون)   (تحويل)   (مباشر)   (Payments) (Orders)
     │         │          │          │          │
     ▼         ▼          ▼          ▼          ▼
  ┌─────┐  ┌─────┐   ┌──────┐  ┌───────┐  ┌───────┐
  │paid │  │hold │   │PayPal│  │Mollie │  │Mollie │
  │     │  │     │   │.com  │  │hosted │  │Klarna │
  │no   │  │no   │   │      │  │page   │  │page   │
  │redir│  │redir│   │      │  │       │  │       │
  └──┬──┘  └──┬──┘   └──┬───┘  └───┬───┘  └───┬───┘
     │        │         │          │           │
     ▼        ▼         ▼          ▼           ▼
  invoice  invoice   /api/pay/   /api/pay/   /api/pay/
  Url      Url       paypal/     callback    callback
                     capture     ?orderId=   ?orderId=
                     ?orderId=
                         │          │           │
                    ┌────┴──────────┴───────────┘
                    ▼
          ┌─────────────────────┐
          │ Check Payment Status │
          │ from Provider API    │
          └────┬────────────┬───┘
               │            │
          ┌────▼────┐  ┌────▼──────────┐
          │  PAID   │  │ FAILED/CANCEL │
          │         │  │               │
          │Order →  │  │Order note     │
          │process  │  │with reason    │
          │Payment →│  │               │
          │paid     │  │               │
          │Invoice →│  │               │
          │paid     │  │               │
          │         │  │               │
          │Email +  │  │               │
          │PDF sent │  │               │
          └────┬────┘  └────┬──────────┘
               │            │
               ▼            ▼
          /bestellung-  /zahlung-
          erfolgreich   fehlgeschlagen
          ?order=123    ?order=123&
                        reason=xxx

          ║ Meanwhile (Async) ║
          ╠════════════════════╣
          ║ Mollie/PayPal      ║
          ║ Webhook fires      ║
          ║ (safety net)       ║
          ║ → Same updates     ║
          ║ → Dedup prevents   ║
          ║   double email     ║
          ╚════════════════════╝
```

---

## ملاحظات للمطور

### يجب مراعاتها عند التكرار:

1. **Klarna Orders API مختلف تماماً** عن Payments API — يتطلب line items وعنوان كامل
2. **الكاش In-memory** يعمل فقط مع single instance — إذا كان لديك multiple instances، استخدم Redis
3. **Invoice deduplication** أيضاً in-memory — نفس الملاحظة
4. **Mollie webhook يجب أن يرجع 200 دائماً** — 4xx/5xx يكسر الـ checkout بالكامل
5. **PayPal webhook لا يتحقق من التوقيع** — يجب إضافة `PAYPAL_WEBHOOK_ID` للتحقق عند الإنتاج
6. **SMTP_PASS_B64**: كلمة سر SMTP مشفرة بـ base64 لتجنب مشكلة أحرف `$` في `.env`
7. **orderNumber retry**: خمس محاولات لتجنب تعارض الأرقام عند طلبين متزامنين
8. **الأسعار من السيرفر فقط** — لا نثق أبداً بالسعر القادم من الفرونت

### الحزم المطلوبة (npm):
```json
{
  "@mollie/api-client": "^3.x",
  "jspdf": "^2.x",
  "nodemailer": "^6.x",
  "zod": "^3.x",
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x"
}
```

### URLs المطلوب إعدادها:
```
Mollie Dashboard → Settings → Webhooks:
  https://YOUR-DOMAIN.com/api/payment/webhook

PayPal Developer Dashboard → Webhooks:
  https://YOUR-DOMAIN.com/api/payment/paypal/webhook
  Events: PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED, PAYMENT.CAPTURE.REFUNDED
```
