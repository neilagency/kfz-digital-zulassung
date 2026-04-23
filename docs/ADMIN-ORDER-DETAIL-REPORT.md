# تقرير شامل: صفحة تفاصيل الطلب في لوحة التحكم (Admin Order Detail)

> **الهدف:** توثيق كامل لكل اللوجيك والأكشنات والإيميلات والمسارات — لإعادة بناء النظام بالكامل في مشروع آخر.

---

## 1. ملخص الملفات (19 ملف / ~5,400 سطر)

| # | الملف | الأسطر | الوظيفة |
|---|-------|--------|---------|
| 1 | `src/app/admin/(dashboard)/orders/[id]/page.tsx` | 787 | صفحة تفاصيل الطلب (Client Component) |
| 2 | `src/app/api/admin/orders/[id]/route.ts` | 165 | GET/PATCH/DELETE طلب واحد |
| 3 | `src/app/api/admin/orders/route.ts` | 191 | GET قائمة + POST bulk actions |
| 4 | `src/app/api/admin/orders/[id]/refund/route.ts` | 235 | POST استرداد + GET سجل الاستردادات |
| 5 | `src/app/api/admin/orders/[id]/resend-invoice/route.ts` | 64 | POST إعادة إرسال الفاتورة |
| 6 | `src/app/api/admin/orders/[id]/messages/route.ts` | 204 | GET/POST رسائل الطلب |
| 7 | `src/app/api/admin/orders/[id]/documents/route.ts` | 147 | GET/POST مستندات الطلب |
| 8 | `src/lib/invoice.ts` | 395 | توليد PDF (jsPDF) + إرسال إيميل |
| 9 | `src/lib/invoice-template.ts` | 482 | InvoiceData type + HTML template |
| 10 | `src/lib/completion-email.ts` | 228 | إيميل إتمام الطلب |
| 11 | `src/lib/document-email.ts` | 151 | إيميل إشعار المستند |
| 12 | `src/lib/order-message-email.ts` | 158 | إيميل رسالة للعميل |
| 13 | `src/lib/payments.ts` | 454 | Mollie payment + refund |
| 14 | `src/lib/paypal.ts` | 307 | PayPal create/capture/refund |
| 15 | `src/lib/campaign-email.ts` | 214 | Branded email template (SMTP مشترك) |
| 16 | `src/components/admin/OrderDocuments.tsx` | 245 | واجهة رفع/عرض/حذف المستندات |
| 17 | `src/components/admin/OrderCommunication.tsx` | 339 | واجهة التواصل مع العميل |
| 18 | `src/app/api/send-invoice/route.ts` | 84 | API عام لإرسال الفاتورة |
| 19 | `prisma/schema.prisma` | 550 | جميع الـ Models |

---

## 2. قاعدة البيانات (Prisma Models)

### 2.1 Order (الطلب الرئيسي)

```prisma
model Order {
  id              String    @id @default(cuid())
  orderNumber     Int       @unique
  wpOrderId       Int?      @unique
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
  productId       Int?
  customer        Customer? @relation(fields: [customerId], references: [id])
  customerId      String?
  items           OrderItem[]
  notes           OrderNote[]
  payments        Payment[]
  invoices        Invoice[]
  documents       OrderDocument[]
  messages        OrderMessage[]
  datePaid        DateTime?
  dateCompleted   DateTime?
  completionEmailSent Boolean @default(false)
  deletedAt       DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### 2.2 OrderItem (عناصر الطلب)

```prisma
model OrderItem {
  id          String @id @default(cuid())
  orderId     String
  order       Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productName String
  productId   Int?
  quantity    Int    @default(1)
  price       Float  @default(0)
  total       Float  @default(0)
}
```

### 2.3 OrderNote (ملاحظات الطلب)

```prisma
model OrderNote {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  note      String
  author    String   @default("system")  // "Admin" | "System" | "system"
  createdAt DateTime @default(now())
}
```

### 2.4 OrderMessage (رسائل للعميل)

```prisma
model OrderMessage {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  message     String
  attachments String   @default("[]")  // JSON: [{name, url, size}]
  sentBy      String   @default("admin")
  createdAt   DateTime @default(now())
}
```

### 2.5 OrderDocument (مستندات الطلب - PDF)

```prisma
model OrderDocument {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  fileName  String
  fileUrl   String
  fileSize  Int      @default(0)
  token     String   @unique @default(cuid())  // للتحميل الآمن بدون تسجيل دخول
  createdAt DateTime @default(now())
}
```

### 2.6 Payment (المدفوعات)

```prisma
model Payment {
  id            String    @id @default(cuid())
  orderId       String
  order         Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  gatewayId     String           // "paypal" | "mollie" | "sepa"
  transactionId String    @default("")  // "tr_*" = Mollie, غيره = PayPal
  amount        Float
  currency      String    @default("EUR")
  status        String    @default("pending")  // pending|paid|refunded|partially_refunded|cancelled
  method        String    @default("")
  providerData  String    @default("{}")
  paidAt        DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### 2.7 Invoice (الفاتورة)

```prisma
model Invoice {
  id              String    @id @default(cuid())
  invoiceNumber   String    @unique    // مثل "INV-2024-0001"
  orderId         String
  order           Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
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
  taxRate         Float     @default(19)     // 19% MwSt
  taxAmount       Float     @default(0)
  total           Float     @default(0)
  paymentMethod   String    @default("")
  paymentStatus   String    @default("pending")
  transactionId   String    @default("")
  pdfUrl          String    @default("")
  invoiceDate     DateTime  @default(now())
  dueDate         DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

---

## 3. بنية صفحة تفاصيل الطلب (UI Layout)

**Route:** `/admin/orders/[id]`
**ملف:** `src/app/admin/(dashboard)/orders/[id]/page.tsx`
**نوع:** Client Component (`'use client'`)

```
┌──────────────────────────────────────────────────────────────────┐
│  Toast Notification (fixed top-right z-50)                       │
│  يظهر عند تغيير الحالة / إرسال إيميل / خطأ                      │
│  3 أنواع: success (أخضر) | warning (أصفر) | error (أحمر)        │
│  يختفي تلقائياً بعد 6 ثوانٍ                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [← رجوع]   Bestellung #2140                     [حالة Badge]   │
│              01. April 2026, 14:30 Uhr                           │
│                                                                  │
├───────────────────────────────────────┬──────────────────────────┤
│  █ المحتوى الرئيسي (lg:col-span-2)  │  █ الشريط الجانبي       │
│                                       │                          │
│  ┌─────────────────────────────────┐ │  ┌──────────────────────┐│
│  │ 1. بيانات العميل               │ │  │ تغيير الحالة         ││
│  │    اسم / إيميل / تليفون / عنوان │ │  │ 5 أزرار status       ││
│  └─────────────────────────────────┘ │  └──────────────────────┘│
│                                       │                          │
│  ┌─────────────────────────────────┐ │  ┌──────────────────────┐│
│  │ 2. عناصر الطلب (Positionen)    │ │  │ معلومات الدفع        ││
│  │    اسم × كمية            سعر   │ │  │ الطريقة / الحالة     ││
│  │    ──────────────────────────── │ │  │ المبلغ / Transaction ││
│  │    Zwischensumme         €19.70 │ │  └──────────────────────┘│
│  │    Zahlungsgebühr        €0.50  │ │                          │
│  │    Rabatt (COUPON)      -€5.00  │ │  ┌──────────────────────┐│
│  │    ════════════════════════════ │ │  │ الفاتورة             ││
│  │    Gesamt               €15.20  │ │  │ رابط / PDF / إعادة   ││
│  └─────────────────────────────────┘ │  │ إرسال / إنشاء        ││
│                                       │  └──────────────────────┘│
│  ┌─────────────────────────────────┐ │                          │
│  │ 3. بيانات الخدمة               │ │  ┌──────────────────────┐│
│  │    (Abmeldung أو Anmeldung)     │ │  │ الاسترداد (Refund)   ││
│  │    Kennzeichen / FIN / Code...  │ │  │ Mollie أو PayPal     ││
│  │    + روابط تحميل المستندات     │ │  │ مبلغ / سجل / تنفيذ  ││
│  └─────────────────────────────────┘ │  └──────────────────────┘│
│                                       │                          │
│  ┌─────────────────────────────────┐ │                          │
│  │ 4. المستندات (OrderDocuments)   │ │                          │
│  │    رفع PDF + قائمة + حذف + إعادة│ │                          │
│  └─────────────────────────────────┘ │                          │
│                                       │                          │
│  ┌─────────────────────────────────┐ │                          │
│  │ 5. التواصل (OrderCommunication) │ │                          │
│  │    قوالب سريعة + textarea       │ │                          │
│  │    + رفع ملفات + إرسال          │ │                          │
│  │    + سجل الرسائل السابقة       │ │                          │
│  └─────────────────────────────────┘ │                          │
│                                       │                          │
│  ┌─────────────────────────────────┐ │                          │
│  │ 6. الملاحظات (Notes)           │ │                          │
│  │    قائمة + إضافة ملاحظة جديدة  │ │                          │
│  └─────────────────────────────────┘ │                          │
├───────────────────────────────────────┴──────────────────────────┤
```

---

## 4. API Routes — التفاصيل الكاملة

### 4.1 GET `/api/admin/orders/[id]`

**الغرض:** جلب بيانات طلب واحد بكل العلاقات

```typescript
const order = await prisma.order.findUnique({
  where: { id: params.id },
  include: {
    items: true,
    payments: true,
    notes: { orderBy: { createdAt: 'desc' } }
  },
});
```

**Response:** كائن Order كامل مع items[], payments[], notes[]

---

### 4.2 PATCH `/api/admin/orders/[id]`

**الغرض:** تحديث حالة الطلب أو إضافة ملاحظة

**Body المتوقع:**
```json
{ "status": "completed" }
// أو
{ "note": "ملاحظة من الأدمن" }
```

**اللوجيك الكامل:**

```
1. تحديث الحالة في DB:
   └── إذا status = completed أو processing:
       └── set datePaid = now() (إذا لم يكن موجوداً)

2. مزامنة حالة الدفع (Payment.status):
   ├── completed/processing → "paid"
   ├── cancelled → "cancelled"
   └── refunded → "refunded"

3. مزامنة حالة الفاتورة (Invoice.paymentStatus):
   └── نفس القيمة من الخطوة 2

4. إضافة OrderNote:
   └── "Status geändert zu: {status}" (author: "System")

5. إرسال Completion Email (إذا status = completed):
   └── await sendCompletionEmail(orderId)
   └── النتيجة ترجع في Response → completionEmailResult

6. Response:
   └── Order object + completionEmailResult
```

---

### 4.3 DELETE `/api/admin/orders/[id]`

**الغرض:** حذف ناعم (Soft Delete)

**اللوجيك:**
```
1. التأكد من وجود الطلب وعدم حذفه مسبقاً
2. Order.deletedAt = now(), Order.status = 'deleted'
3. OrderNote: "Order gelöscht (soft delete)... Vorheriger Status: {status}"
```

---

### 4.4 POST `/api/admin/orders/[id]/refund`

**الغرض:** تنفيذ استرداد (كامل أو جزئي)

**Body المتوقع:**
```json
{ "amount": "10.00" }  // اختياري — فارغ = استرداد كامل
```

**اللوجيك الكامل:**

```
1. جلب الطلب مع payments[]

2. اكتشاف مقدم الدفع تلقائياً (detectProvider):
   ├── transactionId يبدأ بـ "tr_" → Mollie
   ├── gatewayId = "paypal" أو method يحتوي "paypal" → PayPal
   └── fallback: order.transactionId

3. حساب مبلغ الاسترداد:
   ├── إذا amount محدد → استخدامه
   └── إذا فارغ → order.total (كامل)
   ├── تحقق: ليس NaN, ليس < 0, ليس > order.total

4. طلبات بمبلغ €0 → synthetic refund (بدون API)

5. Mollie:
   └── createMollieRefund(transactionId, {currency:'EUR', value}, description)
       └── mollie.paymentRefunds.create()

6. PayPal:
   └── refundPayPalCapture(transactionId, {currency_code:'EUR', value}, note)
       └── POST /v2/payments/captures/{id}/refund

7. تحديث DB (بعد نجاح المقدم فقط):
   ├── استرداد كامل: Order.status = "refunded"
   ├── Payment.status = "refunded" أو "partially_refunded"
   └── Invoice.paymentStatus = نفس القيمة

8. OrderNote: "{Provider} Erstattung (Voll/Teil): €{amount} – Refund-ID: {id}"
```

**أخطاء محددة:**
| رسالة المقدم | الرسالة للمستخدم |
|---|---|
| `already been refunded` | "Diese Zahlung wurde bereits vollständig erstattet" |
| `higher than` | "Der Erstattungsbetrag ist höher als der verfügbare Betrag" |
| `not paid` | "Diese Zahlung wurde noch nicht bezahlt" |
| `CAPTURE_FULLY_REFUNDED` | "Diese PayPal-Zahlung wurde bereits vollständig erstattet" |
| `REFUND_AMOUNT_EXCEEDED` | "Der Erstattungsbetrag übersteigt den verfügbaren PayPal-Betrag" |
| `REFUND_NOT_ALLOWED` | "PayPal erlaubt keine Erstattung für diese Transaktion" |

---

### 4.5 GET `/api/admin/orders/[id]/refund`

**الغرض:** جلب سجل الاستردادات من المقدم

```
1. detectProvider() → mollie أو paypal
2. Mollie: getMollieRefunds(transactionId)
3. PayPal: getPayPalCaptureRefunds(transactionId)
   → normalize to: {id, status, amount:{value, currency}, createdAt}
```

---

### 4.6 POST `/api/admin/orders/[id]/resend-invoice`

**الغرض:** إعادة توليد PDF + إعادة إرسال الفاتورة

```
1. التأكد من وجود الطلب وبريد إلكتروني صالح
2. generateAndSendInvoice(orderId):
   a. generateInvoicePDF(orderId) → jsPDF → Buffer
   b. sendInvoiceEmail({to, customerName, orderNumber, invoiceNumber, total, paymentMethod, pdfBuffer})
      ├── إيميل للعميل (مع PDF كمرفق)
      └── إيميل إشعار للأدمن (مع رابط Dashboard)
   c. 3 محاولات مع exponential backoff (2s, 4s, 6s)
   d. OrderNote: "Rechnung {number} per E-Mail an {email} gesendet"
```

---

### 4.7 POST `/api/admin/orders/[id]/documents`

**الغرض:** رفع مستند PDF للعميل

```
1. Validation:
   ├── file.type === 'application/pdf'
   ├── file.size ≤ 10 MB
   └── PDF magic bytes: أول 5 بايتات = "%PDF"

2. التخزين:
   └── public/uploads/order-documents/{year}/{month}/order-{orderNumber}_{random}_{filename}

3. إنشاء سجل DB:
   └── OrderDocument { fileName, fileUrl, fileSize, token: random(24 bytes hex) }

4. OrderNote: "Dokument '{filename}' hochgeladen."

5. إرسال إيميل (async — لا يحظر Response):
   └── sendDocumentEmail({to, customerName, orderNumber, fileName, downloadToken, documentId, pdfBuffer})
```

---

### 4.8 GET `/api/admin/orders/[id]/documents`

**الغرض:** جلب قائمة المستندات

```typescript
const documents = await prisma.orderDocument.findMany({
  where: { orderId: order.id },
  orderBy: { createdAt: 'desc' },
  select: { id, fileName, fileUrl, fileSize, createdAt },
});
```

---

### 4.9 POST `/api/admin/orders/[id]/messages`

**الغرض:** إرسال رسالة من الأدمن للعميل

**Body:** `FormData` مع `message` (text) و `files` (اختياري)

```
1. Validation:
   ├── الطلب موجود وبريد إلكتروني صالح
   ├── message ليست فارغة
   ├── max 5 ملفات
   ├── كل ملف ≤ 10 MB
   ├── أنواع مسموحة: PDF, JPG, PNG, WEBP
   └── PDF magic bytes check

2. تخزين الملفات:
   └── public/uploads/order-messages/{year}/{month}/msg-{orderNumber}_{random}_{filename}

3. حفظ الرسالة في DB:
   └── OrderMessage { message, attachments: JSON, sentBy: 'admin' }

4. OrderNote: "Nachricht an Kunden gesendet (X Anhang/Anhänge)"

5. إرسال إيميل (async — fire-and-forget):
   └── sendOrderMessageEmail({to, customerName, orderNumber, productName, message, attachments})
```

---

## 5. خريطة الإيميلات الكاملة

### 5.1 إيميل الفاتورة (Invoice Email)

| الخاصية | القيمة |
|---------|--------|
| **الملف** | `src/lib/invoice.ts` → `sendInvoiceEmail()` |
| **المُشغّل** | عند إنشاء طلب جديد (checkout) / إعادة إرسال يدوية |
| **المستلم** | العميل (`billingEmail`) + نسخة للأدمن (`ADMIN_EMAIL`) |
| **الموضوع - عميل** | `Ihre Bestellung #{orderNumber} & Rechnung {invoiceNumber}` |
| **الموضوع - أدمن** | `[Admin] Neue Bestellung #{orderNumber} - {invoiceNumber}` |
| **المرفقات** | PDF الفاتورة (`Rechnung-{invoiceNumber}.pdf`) |
| **المحاولات** | 3 محاولات مع backoff (2s, 4s, 6s) |
| **OrderNote** | "Rechnung {number} per E-Mail an {email} gesendet" أو "fehlgeschlagen: {error}" |

**محتوى الإيميل للعميل:**
```
┌─ Header: #0D5581 gradient + Logo ──────────────────┐
│  "Ihre Rechnung & Bestellbestätigung"               │
├─────────────────────────────────────────────────────┤
│  Begrüßung: "Sehr geehrte/r {name},"               │
│  شكر على الطلب                                      │
│                                                     │
│  ┌─ جدول معلومات ─────────────────────────────────┐│
│  │ Bestellnummer:     #{orderNumber}                ││
│  │ Rechnungsnr.:      {invoiceNumber}               ││
│  │ Zahlungsmethode:   {paymentMethod}               ││
│  │ Gesamtbetrag:      {total} EUR (خط عريض #0D5581) ││
│  └──────────────────────────────────────────────────┘│
│                                                     │
│  "PDF im Anhang" + "Dokumente in 24 Stunden"        │
│                                                     │
│  [CTA: Zur Website] (#0D5581)                       │
│                                                     │
│  ┌─ مربع مساعدة (أخضر) ───────────────────────────┐│
│  │ Telefon / WhatsApp / E-Mail                      ││
│  └──────────────────────────────────────────────────┘│
├─ Footer ────────────────────────────────────────────┤
│  iKFZ Digital Zulassung UG · Gerhard-Küchen-Str. 14 │
│  45141 Essen                                        │
└─────────────────────────────────────────────────────┘
```

**محتوى الإيميل للأدمن:**
```
نفس التصميم + جدول بيانات العميل + زر:
[CTA: "Bestellung in Dashboard öffnen"] → /admin/orders/{orderId}
```

---

### 5.2 إيميل إتمام الطلب (Completion Email)

| الخاصية | القيمة |
|---------|--------|
| **الملف** | `src/lib/completion-email.ts` → `sendCompletionEmail()` |
| **المُشغّل** | تلقائي عند تغيير الحالة إلى `completed` |
| **المستلم** | العميل فقط |
| **الموضوع** | `Bestellung #{orderNumber} — Erfolgreich abgeschlossen ✅` |
| **Dedup** | يفحص `order.completionEmailSent` — يتخطى إذا true |
| **عند النجاح** | `completionEmailSent = true`, `dateCompleted = now()` |
| **OrderNote** | "Abschluss-E-Mail erfolgreich an {email} gesendet" |
| **يستخدم** | `sendCampaignEmail()` من `campaign-email.ts` (SMTP مشترك) |

**محتوى الإيميل:**
```
┌─ Header: #0D5581 + Logo ───────────────────────────┐
│  "Ihre Bestellung wurde erfolgreich abgeschlossen"  │
├─────────────────────────────────────────────────────┤
│  "Hallo {name},"                                    │
│  "Bestellung #{orderNumber} erfolgreich bearbeitet" │
│                                                     │
│  ┌─ جدول ──────────────────────────────────────────┐│
│  │ Bestellnummer: #{orderNumber}                    ││
│  │ Service:       {productName}                     ││
│  │ Status:        ✅ Abgeschlossen (أخضر)           ││
│  └──────────────────────────────────────────────────┘│
│                                                     │
│  ── محتوى خاص بنوع الخدمة ──                        │
│                                                     │
│  إذا Abmeldung:                                     │
│  ┌─ مربع أخضر ──────────────────────────────────────┐│
│  │ ✅ Abmeldung erfolgreich!                        ││
│  │ 📌 Versicherung + Zollamt automatisch informiert ││
│  │ 📁 Abmeldebestätigung im Anhang                  ││
│  └──────────────────────────────────────────────────┘│
│  ┌─ مربع أزرق ──────────────────────────────────────┐│
│  │ 🚗 Cross-sell:                                   ││
│  │ • Neuanmeldung → /product/auto-online-anmelden/  ││
│  │ • Auto-Verkauf                                    ││
│  │ • eVB-Nummer                                      ││
│  └──────────────────────────────────────────────────┘│
│                                                     │
│  [CTA: Rechnung ansehen / Kontakt] (#0D5581)        │
│                                                     │
│  ┌─ تقييم Google (أصفر) ───────────────────────────┐│
│  │ 🤝 Zufrieden? 5-Sterne-Bewertung!               ││
│  │ ⭐ [Hier bewerten] → g.page/r/.../review         ││
│  └──────────────────────────────────────────────────┘│
│                                                     │
│  ┌─ مربع مساعدة (أخضر) ───────────────────────────┐│
│  │ Telefon / WhatsApp / E-Mail                      ││
│  └──────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**التعامل في الـ UI:**
```
updateStatus('completed')
  ↓
API Response.completionEmailResult:
  ├── {success: true, skipped: false} → Toast أخضر: "Status aktualisiert & Email gesendet ✅"
  ├── {success: true, skipped: true}  → Toast أصفر: "Email wurde bereits zuvor gesendet"
  └── {success: false, error: "..."}  → Toast أحمر: "Email fehlgeschlagen: {error}"
```

---

### 5.3 إيميل المستند (Document Email)

| الخاصية | القيمة |
|---------|--------|
| **الملف** | `src/lib/document-email.ts` → `sendDocumentEmail()` |
| **المُشغّل** | تلقائي عند رفع مستند من الأدمن |
| **المستلم** | العميل |
| **الموضوع** | `Ihr Dokument zu Bestellung #{orderNumber} ist verfügbar` |
| **المرفقات** | ملف PDF المرفوع (كمرفق) |
| **رابط التحميل** | `{SITE_URL}/api/documents/{documentId}/download?token={downloadToken}` |
| **المحاولات** | 3 محاولات مع backoff (2s, 4s, 6s) |

**محتوى الإيميل:**
```
┌─ Header: #0D5581 + Logo ───────────────────────────┐
│  "Ihr Dokument ist verfügbar"                       │
├─────────────────────────────────────────────────────┤
│  "Sehr geehrte/r {name},"                           │
│  "Dokument zu Bestellung #{orderNumber} bereit"     │
│                                                     │
│  ┌─ جدول ──────────────────────────────────────────┐│
│  │ Bestellnummer: #{orderNumber}                    ││
│  │ Dokument:      {fileName}                        ││
│  └──────────────────────────────────────────────────┘│
│                                                     │
│  [📄 Dokument herunterladen] (#0D5581)              │
│                                                     │
│  "PDF auch als Anhang beigefügt"                    │
│  "Alle Dokumente unter Mein Konto → Bestellungen"   │
└─────────────────────────────────────────────────────┘
```

---

### 5.4 إيميل رسالة الطلب (Order Message Email)

| الخاصية | القيمة |
|---------|--------|
| **الملف** | `src/lib/order-message-email.ts` → `sendOrderMessageEmail()` |
| **المُشغّل** | عند إرسال رسالة من الأدمن للعميل |
| **المستلم** | العميل |
| **الموضوع** | `Nachricht zu Ihrer Bestellung #{orderNumber}` |
| **المرفقات** | الملفات المرفقة (PDF, JPG, PNG, WEBP) |
| **ملاحظة** | يُرسل async (fire-and-forget) — لا يحظر Response |

**محتوى الإيميل:**
```
┌─ Header: #0D5581 + Logo ───────────────────────────┐
│  "Nachricht zu Ihrer Bestellung #{orderNumber}"     │
├─────────────────────────────────────────────────────┤
│  "Sehr geehrte/r {name},"                           │
│  "Nachricht bezüglich Bestellung #{orderNumber}     │
│   ({productName}):"                                 │
│                                                     │
│  ┌─ Blockquote (border-left: 4px #0D5581) ────────┐│
│  │  {message text — newlines → <p> tags}           ││
│  └──────────────────────────────────────────────────┘│
│                                                     │
│  إذا مرفقات:                                        │
│  ┌─ مربع أزرق فاتح ────────────────────────────────┐│
│  │ 📎 Anhänge ({count}):                            ││
│  │ • filename1.pdf                                  ││
│  │ • filename2.jpg                                  ││
│  └──────────────────────────────────────────────────┘│
│                                                     │
│  "Bitte antworten Sie direkt auf diese E-Mail"      │
└─────────────────────────────────────────────────────┘
```

---

## 6. الكومبوننتات (Client Components)

### 6.1 InvoiceLink

**موقعه:** داخل `page.tsx` (inline component)  
**الغرض:** عرض/إنشاء/إعادة إرسال الفاتورة

**State:**
```typescript
const [invoice, setInvoice]       = useState(null);
const [loading, setLoading]       = useState(true);
const [creating, setCreating]     = useState(false);
const [resending, setResending]   = useState(false);
const [resendResult, setResendResult] = useState(null);
```

**لوجيك التحميل:**
```
useEffect → GET /api/admin/invoices?search={orderNumber}
         → ابحث عن فاتورة بنفس orderId
```

**3 حالات عرض:**
1. **الفاتورة موجودة:**
   - رابط لصفحة الفاتورة: `/admin/invoices/{id}`
   - رابط PDF: `/api/admin/invoices/{id}/pdf`
   - زر إعادة إرسال: `POST /api/admin/orders/{orderId}/resend-invoice`
   
2. **الفاتورة غير موجودة:**
   - زر "Rechnung erstellen" → `POST /api/admin/invoices` مع `{orderId}`
   
3. **يتم التحميل:** Skeleton

---

### 6.2 OrderDocuments

**ملف:** `src/components/admin/OrderDocuments.tsx`  
**الغرض:** رفع وعرض وحذف وإعادة إرسال مستندات PDF

**الميزات:**
| الميزة | التفاصيل |
|--------|---------|
| **Drag & Drop** | منطقة رفع مع `onDragOver/onDrop` |
| **Click Upload** | `<input type="file" accept=".pdf">` مخفي |
| **Multiple upload** | يدعم رفع عدة ملفات |
| **Validation** | PDF فقط + max 10 MB |
| **القائمة** | اسم + حجم + تاريخ لكل مستند |
| **Actions per doc** | تحميل / إعادة إرسال إيميل / حذف |
| **حذف** | `DELETE /api/admin/documents/{docId}` مع confirm |
| **إعادة إرسال** | `POST /api/admin/documents/{docId}` |

---

### 6.3 OrderCommunication

**ملف:** `src/components/admin/OrderCommunication.tsx`  
**الغرض:** إرسال رسائل من الأدمن للعميل

**القوالب السريعة (4 قوالب):**

| القالب | المحتوى |
|--------|---------|
| **Fehlende Daten** | "Leider fehlen uns für die Bearbeitung noch einige Daten..." |
| **Falsche Daten** | "Bei der Überprüfung haben wir festgestellt, dass einige Angaben nicht korrekt sind..." |
| **Dokument erneut hochladen** | "Leider konnten wir das hochgeladene Dokument nicht verarbeiten..." |
| **Verzögerung** | "Es kommt bei der Bearbeitung zu einer leichten Verzögerung..." |

**الميزات:**
| الميزة | التفاصيل |
|--------|---------|
| **textarea** | 5 أسطر، قابل لتغيير الحجم |
| **File Upload** | PDF, JPG, PNG, WEBP — max 10 MB/file — max 5 files |
| **File Preview** | اسم + حجم + زر حذف لكل ملف معلق |
| **الإرسال** | `POST /api/admin/orders/{id}/messages` (FormData) |
| **Message History** | قائمة مرتبة بالتاريخ (max-h-96 overflow-y-auto) |
| **المرفقات في History** | روابط تحميل لكل مرفق |

---

## 7. تفاصيل عرض بيانات الخدمة (Service Data)

الصفحة تعرض بيانات `order.serviceData` (JSON parsed) بشكل ذكي حسب نوع الخدمة:

### 7.1 بيانات Abmeldung (إلغاء التسجيل)
```
┌───────────────────────────────────────┐
│ عنوان: "Abmeldung – Fahrzeugdaten"   │
│                                       │
│ Formular:    Fahrzeugabmeldung        │
│ Kennzeichen: B AB 1234               │
│ FIN:         WBA71AUU805U1111        │ (font-mono text-xs)
│ Sicherheitscode: YKeqT2v            │ (font-mono)
│ Stadt/Kreis: Berlin                   │
│ Code vorne:  jA4                      │ (font-mono)
│ Code hinten: a1B                      │ (font-mono)
│ Reservierung: Ja (1 Jahr) / Keine     │
└───────────────────────────────────────┘
```

### 7.2 بيانات Anmeldung (التسجيل)
```
┌───────────────────────────────────────┐
│ عنوان: "Anmeldung – Formulardaten"   │
│                                       │
│ Formular:           Auto Online Anmelden │
│ Service:            ummeldung         │ (capitalize)
│ Ausweis:            personalausweis   │ (capitalize)
│ eVB-Nummer:         ABC1234567        │ (font-mono)
│ Kennzeichen-Wahl:   automatisch       │ (capitalize)
│ Wunschkennzeichen:  B AB 9999        │ (إذا موجود)
│ Kennzeichen bestellen: Ja / Nein      │
│ Kontoinhaber:       Max Mustermann    │
│ IBAN:               DE89370400...     │ (font-mono text-xs)
│                                       │
│ ── Hochgeladene Dokumente: ──         │
│ ┌──────────────────────────────────┐  │
│ │ 📄 Fahrzeugschein (Vorderseite)  │  │
│ │    IMG_001.jpeg (2048 KB)        │  │
│ │                   [Herunterladen]│  │
│ ├──────────────────────────────────┤  │
│ │ 📄 Fahrzeugschein (Rückseite)    │  │
│ │    IMG_002.jpeg (1900 KB)        │  │
│ │                   [Herunterladen]│  │
│ ├──────────────────────────────────┤  │
│ │ 📄 Fahrzeugbrief (Vorderseite)   │  │
│ │    IMG_003.jpeg (2100 KB)        │  │
│ │                   [Herunterladen]│  │
│ └──────────────────────────────────┘  │
└───────────────────────────────────────┘
```

**Labels mapping (في الكود):**
```typescript
const fileLabel: Record<string, string> = {
  fahrzeugscheinVorne: 'Fahrzeugschein (Vorderseite)',
  fahrzeugscheinHinten: 'Fahrzeugschein (Rückseite)',
  fahrzeugbriefVorne: 'Fahrzeugbrief (Vorderseite)',
};
```

---

## 8. الحالات (Status System)

### 8.1 الحالات المتاحة

| الحالة | اللون (Badge) | اللون (German Label) |
|--------|--------------|---------------------|
| `pending` | `bg-yellow-100 text-yellow-700` | Ausstehend |
| `processing` | `bg-blue-100 text-blue-700` | In Bearbeitung |
| `on-hold` | `bg-orange-100 text-orange-700` | Zurückgestellt |
| `completed` | `bg-green-100 text-green-700` | Abgeschlossen |
| `cancelled` | `bg-red-100 text-red-700` | Storniert |
| `refunded` | `bg-purple-100 text-purple-700` | Erstattet |

### 8.2 العمليات الجانبية عند تغيير الحالة

| من → إلى | تأثير على Payment | تأثير على Invoice | إيميل | ملاحظات |
|----------|-------------------|-------------------|-------|---------|
| `*` → `completed` | status="paid", paidAt=now() | paymentStatus="paid" | ✅ Completion Email | datePaid إذا لم يوجد |
| `*` → `processing` | status="paid", paidAt=now() | paymentStatus="paid" | ❌ | datePaid إذا لم يوجد |
| `*` → `cancelled` | status="cancelled" | paymentStatus="cancelled" | ❌ | — |
| `*` → `refunded` | status="refunded" | paymentStatus="refunded" | ❌ | — |
| `*` → `pending` | — | — | ❌ | — |
| `*` → `on-hold` | — | — | ❌ | — |

---

## 9. توليد PDF الفاتورة

**الملف:** `src/lib/invoice.ts` → `generateInvoicePDF()`  
**المكتبة:** `jsPDF` (لا يحتاج Chromium)

### بنية PDF (A4)

```
┌─────────────────────────────────────────────┐
│  HEADER (خلفية #0D5581 أزرق)               │
│  يسار: "RECHNUNG" + اسم الشركة              │
│  يمين: Nr. {invoiceNumber}                  │
│         Datum: {date}                        │
│         Bestellung #{orderNumber}            │
├─────────────────────────────────────────────┤
│                                             │
│  يسار: RECHNUNGSADRESSE                     │
│  {customerName}                             │
│  {street}                                   │
│  {postcode} {city}                          │
│  {email} / Tel: {phone}                     │
│                                             │
│  يمين: ABSENDER                             │
│  iKFZ Digital Zulassung UG                  │
│  (haftungsbeschränkt)                       │
│  Gerhard-Küchen-Str. 14                     │
│  45141 Essen                                │
│  info@onlineautoabmelden.com                │
│  Tel: 01522 4999190                         │
├─────────────────────────────────────────────┤
│  Zahlungsmethode: {method}    Status: Bezahlt│
├─────────────────────────────────────────────┤
│  ┌─ ITEMS TABLE (header: #0D5581) ────────┐│
│  │ BESCHREIBUNG  MENGE  PREIS    GESAMT    ││
│  │ {item.name}    1    19.70   19.70 EUR   ││
│  │ {item2.name}   1     4.70    4.70 EUR   ││
│  └──────────────────────────────────────────┘│
│                                             │
│  Nettobetrag:              20.50 EUR        │
│  MwSt. (19%):               3.90 EUR        │
│  ┌─ GESAMTBETRAG (#0D5581) ──────────────┐ │
│  │ Gesamtbetrag:           24.40 EUR      │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  AUFTRAGSDETAILS:                           │
│  Kennzeichen: B AB 1234                     │
│  FIN: WBA71AUU805U1111                      │
│  ...                                        │
├─────────────────────────────────────────────┤
│  FOOTER: iKFZ Digital Zulassung UG ·        │
│  Gerhard-Küchen-Str. 14 · 45141 Essen ·     │
│  IBAN: DE70 3002 0900 5320 8804 65          │
└─────────────────────────────────────────────┘
```

---

## 10. إعدادات SMTP

جميع الإيميلات تستخدم نفس البنية التحتية:

```
SMTP_HOST     = smtp.titan.email
SMTP_PORT     = 465 (SSL)
SMTP_USER     = info@onlineautoabmelden.com
SMTP_PASS_B64 = <base64-encoded password>  ← لتجنب corruption بسبب $ في dotenv
EMAIL_FROM    = info@onlineautoabmelden.com
EMAIL_FROM_NAME = Online Auto Abmelden
ADMIN_EMAIL   = info@onlineautoabmelden.com
```

**ملاحظة مهمة:** `SMTP_PASS_B64` يتم فك ترميزه من Base64:
```typescript
const smtpPass = process.env.SMTP_PASS_B64
  ? Buffer.from(process.env.SMTP_PASS_B64, 'base64').toString('utf-8')
  : process.env.SMTP_PASS || '';
```

**TLS:** `tls: { rejectUnauthorized: false }` — لأن Titan يستخدم شهادة مشتركة.

---

## 11. مسار التدفق الكامل (Complete Flow)

```
┌─ المسار 1: طلب جديد ───────────────────────────────────────┐
│                                                              │
│  عميل يملأ الفورم → /rechnung (Checkout) → يدفع            │
│  ↓                                                          │
│  POST /api/checkout/direct:                                   │
│  ├── إنشاء Order + OrderItem + Payment + Invoice            │
│  ├── بدء الدفع (PayPal/Mollie/SEPA)                         │
│  └── بعد الدفع الناجح:                                       │
│      ├── Payment.status = "paid"                              │
│      ├── Order.status = "processing"                          │
│      └── triggerInvoiceEmail() → generateAndSendInvoice()     │
│          ├── generateInvoicePDF() → PDF buffer                │
│          ├── sendInvoiceEmail() → عميل + أدمن                 │
│          └── OrderNote: "Rechnung gesendet"                   │
│                                                              │
│  الطلب يظهر في /admin/orders → الأدمن يفتح التفاصيل        │
└──────────────────────────────────────────────────────────────┘

┌─ المسار 2: تغيير الحالة ────────────────────────────────────┐
│                                                              │
│  الأدمن يضغط زر حالة جديدة                                  │
│  ↓                                                          │
│  PATCH /api/admin/orders/{id} { status: "completed" }        │
│  ├── Order.status = "completed"                               │
│  ├── Order.datePaid = now() (إذا لم يوجد)                    │
│  ├── Payment.status = "paid"                                  │
│  ├── Invoice.paymentStatus = "paid"                           │
│  ├── OrderNote: "Status geändert zu: completed"               │
│  └── sendCompletionEmail(orderId):                            │
│      ├── فحص completionEmailSent → skip إذا true             │
│      ├── بناء HTML (Abmeldung vs Anmeldung)                   │
│      ├── sendCampaignEmail() → SMTP                           │
│      ├── completionEmailSent = true, dateCompleted = now()    │
│      └── OrderNote: "Abschluss-E-Mail gesendet"              │
│  ↓                                                          │
│  UI: Toast notification (أخضر / أصفر / أحمر)                 │
└──────────────────────────────────────────────────────────────┘

┌─ المسار 3: رفع مستند ───────────────────────────────────────┐
│                                                              │
│  الأدمن يسحب PDF إلى منطقة الرفع                             │
│  ↓                                                          │
│  POST /api/admin/orders/{id}/documents (FormData)             │
│  ├── Validation: PDF + ≤10MB + magic bytes                    │
│  ├── حفظ في /uploads/order-documents/{year}/{month}/          │
│  ├── OrderDocument { fileName, fileUrl, token }               │
│  ├── OrderNote: "Dokument hochgeladen"                        │
│  └── sendDocumentEmail() [async]:                             │
│      ├── HTML مع رابط تحميل آمن (token)                       │
│      ├── PDF كمرفق                                            │
│      └── 3 محاولات مع backoff                                 │
└──────────────────────────────────────────────────────────────┘

┌─ المسار 4: إرسال رسالة ─────────────────────────────────────┐
│                                                              │
│  الأدمن يختار قالب أو يكتب رسالة + يرفق ملفات               │
│  ↓                                                          │
│  POST /api/admin/orders/{id}/messages (FormData)              │
│  ├── Validation: message + files (max 5, ≤10MB each)          │
│  ├── حفظ الملفات في /uploads/order-messages/                  │
│  ├── OrderMessage { message, attachments JSON, sentBy }       │
│  ├── OrderNote: "Nachricht an Kunden gesendet"                │
│  └── sendOrderMessageEmail() [async fire-and-forget]:         │
│      ├── HTML مع الرسالة في blockquote                        │
│      └── المرفقات في الإيميل                                  │
└──────────────────────────────────────────────────────────────┘

┌─ المسار 5: استرداد ──────────────────────────────────────────┐
│                                                              │
│  الأدمن يدخل مبلغ (أو يترك فارغ = كامل) → يؤكد             │
│  ↓                                                          │
│  POST /api/admin/orders/{id}/refund { amount?: "10.00" }     │
│  ├── detectProvider() → mollie أو paypal                      │
│  ├── حساب مبلغ الاسترداد                                      │
│  ├── €0 → synthetic (بدون API)                                │
│  ├── Mollie: createMollieRefund()                             │
│  ├── PayPal: refundPayPalCapture()                            │
│  ├── تحديث DB (فقط بعد نجاح المقدم):                         │
│  │   ├── كامل: Order.status = "refunded"                      │
│  │   ├── Payment.status = "refunded" / "partially_refunded"   │
│  │   └── Invoice.paymentStatus = مطابق                        │
│  └── OrderNote: "{Provider} Erstattung: €{amount}"            │
│  ↓                                                          │
│  UI: نتيجة في مربع (أخضر = ناجح / أحمر = خطأ)               │
│  + إعادة جلب البيانات + سجل الاستردادات                       │
└──────────────────────────────────────────────────────────────┘

┌─ المسار 6: إعادة إرسال الفاتورة ────────────────────────────┐
│                                                              │
│  الأدمن يضغط "📧 Rechnung erneut senden"                     │
│  ↓                                                          │
│  POST /api/admin/orders/{id}/resend-invoice                   │
│  └── generateAndSendInvoice(orderId):                         │
│      ├── generateInvoicePDF() → PDF buffer جديد               │
│      ├── sendInvoiceEmail() → عميل + أدمن                     │
│      ├── 3 محاولات مع backoff                                 │
│      └── OrderNote: "Rechnung gesendet/fehlgeschlagen"        │
│  ↓                                                          │
│  UI: نتيجة أسفل زر الفاتورة                                  │
│  "✅ E-Mail an {email} gesendet" أو "❌ {error}"              │
└──────────────────────────────────────────────────────────────┘

┌─ المسار 7: حذف الطلب ───────────────────────────────────────┐
│                                                              │
│  DELETE /api/admin/orders/{id}                                │
│  ├── Order.deletedAt = now()                                  │
│  ├── Order.status = "deleted"                                 │
│  └── OrderNote: "Order gelöscht. Vorheriger Status: {status}" │
└──────────────────────────────────────────────────────────────┘
```

---

## 12. ملخص جميع الإيميلات

| # | المُشغّل | الدالة | المستلم | الموضوع | مرفقات | ملف |
|---|---------|--------|---------|---------|--------|-----|
| 1 | طلب جديد (checkout) | `sendInvoiceEmail()` | عميل | `Ihre Bestellung #{n} & Rechnung {inv}` | PDF فاتورة | `invoice.ts` |
| 2 | طلب جديد (checkout) | `sendInvoiceEmail()` | أدمن | `[Admin] Neue Bestellung #{n}` | PDF فاتورة | `invoice.ts` |
| 3 | Status → completed | `sendCompletionEmail()` | عميل | `Bestellung #{n} — Erfolgreich abgeschlossen ✅` | — | `completion-email.ts` |
| 4 | رفع مستند | `sendDocumentEmail()` | عميل | `Ihr Dokument zu Bestellung #{n} ist verfügbar` | PDF مستند | `document-email.ts` |
| 5 | إرسال رسالة | `sendOrderMessageEmail()` | عميل | `Nachricht zu Ihrer Bestellung #{n}` | ملفات مرفقة | `order-message-email.ts` |
| 6 | إعادة إرسال فاتورة | `sendInvoiceEmail()` | عميل + أدمن | نفس #1 و #2 | PDF فاتورة | `invoice.ts` |

---

## 13. البنية التحتية للإيميل المشتركة

كل الإيميلات تتبع نفس النمط:

```typescript
// 1. إنشاء transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 465,
  secure: true,
  auth: { user: smtpUser, pass: smtpPass },  // smtpPass from B64
  tls: { rejectUnauthorized: false },
});

// 2. التحقق من الاتصال
await transporter.verify();

// 3. إرسال مع retry
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    await transporter.sendMail({
      from: '"Online Auto Abmelden" <info@onlineautoabmelden.com>',
      to: recipientEmail,
      subject: '...',
      html: brandedHTML,
      attachments: [{ filename: '...', content: buffer, contentType: 'application/pdf' }],
    });
    return { success: true };
  } catch (err) {
    if (attempt < 3) await new Promise(r => setTimeout(r, 2000 * attempt));
  }
}
```

### نمط HTML المشترك لكل الإيميلات:
```html
<!-- Header: #0D5581 gradient + logo.webp -->
<div style="background:#0D5581;border-radius:12px 12px 0 0;padding:30px;text-align:center;">
  <img src="{SITE_URL}/logo.webp" ... />
  <h1 style="color:#fff;font-size:22px;">{عنوان}</h1>
</div>

<!-- Body: white bg, rounded bottom -->
<div style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:30px;">
  <!-- المحتوى -->
</div>

<!-- Footer -->
<div style="text-align:center;padding:20px;font-size:11px;color:#999;">
  iKFZ Digital Zulassung UG (haftungsbeschränkt) · Gerhard-Küchen-Str. 14 · 45141 Essen
</div>
```

---

## 14. ملخص State Variables في صفحة التفاصيل

```typescript
// البيانات الأساسية
const [order, setOrder]           = useState(null);
const [loading, setLoading]       = useState(true);
const [updating, setUpdating]     = useState(false);
const [note, setNote]             = useState('');

// الاسترداد
const [refundAmount, setRefundAmount]   = useState('');
const [refundLoading, setRefundLoading] = useState(false);
const [refundResult, setRefundResult]   = useState(null);
const [refundHistory, setRefundHistory] = useState([]);
const [showRefundForm, setShowRefundForm] = useState(false);

// التنبيهات
const [toast, setToast] = useState(null);
// Auto-dismiss بعد 6 ثوانٍ
```

---

## 15. Dependencies

| المكتبة | الاستخدام |
|---------|----------|
| `jspdf` | توليد PDF الفاتورة (server-side) |
| `nodemailer` | إرسال الإيميلات عبر SMTP |
| `date-fns` + `date-fns/locale/de` | تنسيق التواريخ بالألمانية |
| `@prisma/client` | الوصول لقاعدة البيانات |
| `crypto` | توليد tokens آمنة + أسماء ملفات عشوائية |
| `fs/promises` | كتابة الملفات على القرص |
| `@mollie/api-client` | Mollie Payments + Refunds |
| `PayPal REST API v2` | PayPal Capture + Refunds (fetch مباشر) |
