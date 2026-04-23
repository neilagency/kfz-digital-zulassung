# تقرير شامل – نظام الإيميلات الكامل (Email System Full Audit)

> تحليل كامل لنظام إرسال الإيميلات داخل المشروع: configuration، logic، templates، triggers، و migration guide للنقل 1:1 لمشروع آخر.

---

## 1. إعدادات الإيميل (Email Configuration)

### 1.1 المزود (Email Provider)
- **Provider:** Titan Email (by Hostinger)
- **Protocol:** SMTP over SSL
- **Library:** `nodemailer` ^7.0.13

### 1.2 متغيرات البيئة المطلوبة (Environment Variables)

```bash
# ─── SMTP (مطلوبة) ───
SMTP_HOST=smtp.titan.email          # خادم SMTP
SMTP_PORT=465                       # بورت SSL
SMTP_USER=info@onlineautoabmelden.com   # اسم المستخدم
SMTP_PASS_B64=bStNOFdkLkElRSNOWSpueg== # كلمة المرور بـ Base64 (مطلوب!)
SMTP_PASS=m+M8Wd.A5E#tY*n2             # بديل: كلمة مرور نص عادي

# ─── عناوين البريد ───
EMAIL_FROM=info@onlineautoabmelden.com      # عنوان المرسل
EMAIL_FROM_NAME=Online Auto Abmelden        # اسم المرسل
ADMIN_EMAIL=info@onlineautoabmelden.com     # إيميل الأدمن (نسخ الإشعارات)

# ─── أمان ───
SMTP_DEBUG=true                             # (اختياري) تفعيل debug logging
CRON_SECRET=WxnNhSP7Z39fXzfKnLXzfGm9...    # مفتاح cron jobs + test-smtp
NEXTAUTH_SECRET=...                          # لتوليد invoice tokens
JWT_SECRET=...                               # بديل لـ NEXTAUTH_SECRET

# ─── الموقع ───
SITE_URL=https://onlineautoabmelden.com     # رابط الموقع (للإيميلات)
NEXT_PUBLIC_SITE_URL=...                     # رابط عام (fallback)
```

### 1.3 لماذا SMTP_PASS_B64؟
⚠️ **مهم جداً:** كلمة المرور تحتوي على أحرف خاصة مثل `$` و `|` اللي dotenv-expand بيخرّبها. الحل:
```bash
# لتوليد SMTP_PASS_B64:
echo -n 'YOUR_ACTUAL_PASSWORD' | base64
```
الكود بيفك التشفير تلقائياً:
```typescript
const smtpPass = process.env.SMTP_PASS_B64
  ? Buffer.from(process.env.SMTP_PASS_B64, 'base64').toString('utf-8')
  : process.env.SMTP_PASS || '';
```

### 1.4 أين يتم تعريف الإعدادات؟
**لا يوجد ملف إعدادات مركزي.** كل ملف email يقرأ الـ env vars مباشرة بنفس الباترن:

```typescript
const smtpHost = process.env.SMTP_HOST || 'smtp.titan.email';
const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
const smtpUser = process.env.SMTP_USER || 'info@onlineautoabmelden.com';
const smtpPass = process.env.SMTP_PASS_B64
  ? Buffer.from(process.env.SMTP_PASS_B64, 'base64').toString('utf-8')
  : process.env.SMTP_PASS || '';
const fromEmail = process.env.EMAIL_FROM || 'info@onlineautoabmelden.com';
const fromName = process.env.EMAIL_FROM_NAME || 'Online Auto Abmelden';
```

### 1.5 إعداد Transporter
كل الملفات تستخدم نفس الـ config:
```typescript
nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,   // true لـ SSL
  auth: { user: smtpUser, pass: smtpPass },
  tls: { rejectUnauthorized: false },   // مطلوب لـ Titan
});
```

### 1.6 طريقة Import الـ nodemailer
```typescript
// طريقة 1: Dynamic import (في invoice.ts, document-email.ts)
const nodemailer = await import('nodemailer');
nodemailer.default.createTransport(...)

// طريقة 2: require (في campaign-email.ts, order-message-email.ts)
const nodemailer = require('nodemailer');
nodemailer.createTransport(...)
```

---

## 2. ملفات النظام (Email Service Layer)

### 2.1 خريطة الملفات الكاملة

```
src/lib/
├── invoice.ts                 ← توليد PDF + إرسال إيميل الفاتورة
├── invoice-template.ts        ← HTML template + InvoiceData interface
├── invoice-token.ts           ← HMAC tokens لتحميل الفاتورة الآمن
├── trigger-invoice.ts         ← trigger مع منع التكرار
├── document-email.ts          ← إيميل إشعار رفع مستند
├── order-message-email.ts     ← إيميل رسالة من الأدمن للعميل
├── completion-email.ts        ← إيميل إتمام الطلب
├── campaign-email.ts          ← إرسال حملات بريدية (فردي + دفعات)
├── campaign-templates.ts      ← قوالب حملات جاهزة (5 أنواع)
└── campaign-recipients.ts     ← تحديد مستقبلين الحملة

src/app/api/
├── send-invoice/route.ts              ← API عام لإرسال فاتورة
├── test-smtp/route.ts                 ← اختبار اتصال SMTP
├── admin/orders/[id]/resend-invoice/route.ts   ← إعادة إرسال فاتورة
├── admin/orders/[id]/documents/route.ts        ← رفع مستندات (يرسل إيميل)
├── admin/orders/[id]/messages/route.ts         ← إرسال رسالة للعميل
├── admin/email-campaigns/route.ts              ← CRUD حملات
├── admin/email-campaigns/[id]/send/route.ts    ← إرسال حملة
├── admin/email-campaigns/[id]/test/route.ts    ← إرسال حملة تجريبية
├── admin/email-campaigns/[id]/preview/route.ts ← معاينة حملة
├── cron/send-scheduled/route.ts                ← إرسال حملات مجدولة
├── track/open/[id]/route.ts                    ← تتبع فتح إيميل
├── track/click/[id]/route.ts                   ← تتبع نقر رابط
└── unsubscribe/[token]/route.ts                ← إلغاء الاشتراك
```

### 2.2 وصف كل ملف ووظائفه

#### `src/lib/invoice.ts` (≈395 سطر)
| الدالة | Input | Output | الوظيفة |
|--------|-------|--------|---------|
| `generateInvoicePDF(orderId)` | orderId: string | `{ pdfBuffer, invoiceData, invoiceNumber }` | توليد PDF بمكتبة jsPDF |
| `sendInvoiceEmail(opts)` | to, customerName, orderNumber, invoiceNumber, total, paymentMethod, pdfBuffer | `{ success, error? }` | إرسال إيميل + نسخة للأدمن |
| `generateAndSendInvoice(orderId)` | orderId: string | `{ success, invoiceNumber?, emailSent?, error? }` | توليد + إرسال + order note |

**يتضمن:**
- Retry logic: 3 محاولات مع تأخير تصاعدي (2s, 4s)
- SMTP verification قبل الإرسال
- نسخة أدمن تلقائية مع رابط الداشبورد
- إنشاء OrderNote بنتيجة الإرسال

#### `src/lib/trigger-invoice.ts` (53 سطر)
| الدالة | Input | Output | الوظيفة |
|--------|-------|--------|---------|
| `triggerInvoiceEmail(orderId)` | orderId: string | `{ success, error? }` | استدعاء آمن مع deduplication |

**Deduplication:** يتتبع الطلبات في `Set` مع cooldown 5 دقائق

#### `src/lib/document-email.ts` (≈200 سطر)
| الدالة | Input | Output | الوظيفة |
|--------|-------|--------|---------|
| `sendDocumentEmail(opts)` | to, customerName, orderNumber, fileName, downloadToken, documentId, pdfBuffer? | `{ success, error? }` | إرسال إشعار رفع مستند |

**يتضمن:** Retry logic (3 محاولات), SMTP verify، رابط تحميل آمن بـ token

#### `src/lib/order-message-email.ts` (≈160 سطر)
| الدالة | Input | Output | الوظيفة |
|--------|-------|--------|---------|
| `sendOrderMessageEmail(opts)` | to, customerName?, orderNumber, productName, message, attachments? | `{ success, error? }` | إرسال رسالة أدمن للعميل |

**يتضمن:** تحويل text→HTML، دعم مرفقات PDF/صور

#### `src/lib/completion-email.ts` (≈220 سطر)
| الدالة | Input | Output | الوظيفة |
|--------|-------|--------|---------|
| `sendCompletionEmail(orderId)` | orderId: string | `{ success, error?, skipped? }` | إيميل إتمام الطلب |

**يتضمن:**
- فحص deduplication (`completionEmailSent` flag في الـ DB)
- محتوى مختلف حسب نوع الخدمة (Abmeldung vs Anmeldung)
- رابط فاتورة آمن بـ token
- CTA لتقييم Google
- تحديث `completionEmailSent = true` في الـ DB + OrderNote

**يستخدم `sendCampaignEmail`** لإرسال الإيميل (بدون إشعار إلغاء اشتراك)

#### `src/lib/campaign-email.ts` (≈250 سطر)
| الدالة | Input | Output | الوظيفة |
|--------|-------|--------|---------|
| `buildCampaignHtml(campaign)` | CampaignContent | string (HTML) | بناء HTML الحملة مع tracking |
| `personalizeHtml(html, token)` | html, unsubscribeToken | string (HTML) | استبدال `{{UNSUBSCRIBE_URL}}` |
| `sendCampaignEmail(opts)` | to, subject, html | `{ success, error? }` | إرسال إيميل واحد |
| `sendCampaignBatch(opts)` | campaignId, recipients[], subject, html, onProgress | `{ sent, failed, errors[] }` | إرسال دفعات |

**Batch Config:**
- حجم الدفعة: 50 إيميل
- تأخير بين الإيميلات: 500ms
- تأخير بين الدفعات: 3000ms

#### `src/lib/campaign-templates.ts` (126 سطر)
5 قوالب جاهزة:
| Template ID | الاسم | الوصف |
|------------|-------|-------|
| `welcome` | Willkommen | ترحيب عميل جديد |
| `discount` | Rabatt-Aktion | عرض خصم مع كود |
| `reminder` | Erinnerung | تذكير بإجراء |
| `newsletter` | Newsletter | أخبار عامة |
| `feedback` | Bewertung | طلب تقييم Google |
| `empty` | Leer | قالب فارغ |

#### `src/lib/campaign-recipients.ts` (191 سطر)
| الدالة | الوظيفة |
|--------|---------|
| `resolveRecipients(campaign)` | تحديد المستقبلين حسب targetMode |
| `countRecipients(campaign)` | عدّ بدون توليد tokens |
| `parseEmails(raw)` | تحليل CSV/newline/semicolon |

**Target Modes:**
- `all`: كل العملاء المشتركين (`emailSubscribed = true`)
- `specific`: قائمة إيميلات مخصصة (CSV)
- `segment`: فلترة بمعايير JSON

#### `src/lib/invoice-token.ts` (28 سطر)
| الدالة | الوظيفة |
|--------|---------|
| `generateInvoiceToken(invoiceNumber)` | HMAC-SHA256 → 16 hex chars |
| `verifyInvoiceToken(invoiceNumber, token)` | مقارنة constant-time |

---

## 3. قوالب الإيميل (Email Templates)

### 3.1 نوع القوالب
**كل القوالب HTML strings داخل الكود مباشرة** (لا يوجد ملفات خارجية أو React Email).

### 3.2 التصميم الموحد (Design System)
كل الإيميلات تتبع نفس الـ design:

```
┌─────────────────────────────────────┐
│  🔵 HEADER (bg: #0D5581)           │
│  [Logo] logo.webp                   │
│  [Title] عنوان أبيض بـ 22px        │
├─────────────────────────────────────┤
│  📝 BODY (bg: #ffffff)             │
│  • ترحيب بالاسم                     │
│  • محتوى الرسالة                    │
│  • جدول بيانات (bg: #f8fafc)       │
│  • زر CTA (bg: #0D5581)            │
│  • مربع مساعدة أخضر (bg: #f0fdf4)  │
│    - تليفون: 01522 4999190         │
│    - واتساب: wa.me/4915224999190   │
│    - إيميل: info@...               │
├─────────────────────────────────────┤
│  📎 FOOTER                          │
│  iKFZ Digital Zulassung UG          │
│  Gerhard-Küchen-Str. 14, 45141 Essen│
│  [رابط إلغاء اشتراك - حملات فقط]  │
│  [Tracking pixel - حملات فقط]      │
└─────────────────────────────────────┘
```

### 3.3 الألوان المستخدمة
| اللون | الكود | الاستخدام |
|-------|-------|-----------|
| Primary Blue | `#0D5581` | هيدر، أزرار CTA، روابط |
| White | `#ffffff` | خلفية المحتوى |
| Light Gray | `#f8fafc` | خلفية جداول البيانات |
| Light Green | `#f0fdf4` | مربع المساعدة، نجاح |
| Green Border | `#bbf7d0` | حدود مربع المساعدة |
| Text Gray | `#333` / `#555` / `#666` | نصوص المحتوى |
| Footer Gray | `#999` | تذييل |
| Light BG | `#f4f6f9` | خلفية Body |

### 3.4 بيانات الشركة في كل الإيميلات
```
الشركة:     iKFZ Digital Zulassung UG (haftungsbeschränkt)
العنوان:    Gerhard-Küchen-Str. 14, 45141 Essen
التليفون:   01522 4999190
الواتساب:   wa.me/4915224999190
الإيميل:    info@onlineautoabmelden.com
اللوجو:     {SITE_URL}/logo.webp
الـ IBAN:   DE70 3002 0900 5320 8804 65  (في PDF فقط)
```

---

## 4. أنواع الإيميلات المرسلة (All Email Types)

### 4.1 جدول شامل

| # | النوع | المرسل من | المستقبل | الموضوع (Subject) | المرفقات | Retry | الملف |
|---|-------|-----------|----------|-------------------|----------|-------|-------|
| 1 | **فاتورة + تأكيد طلب** | تلقائي بعد الدفع | العميل | `Ihre Bestellung #XXX & Rechnung RE-YYYY-NNNN` | PDF فاتورة | 3× | `invoice.ts` |
| 2 | **نسخة أدمن (فاتورة)** | تلقائي مع #1 | ADMIN_EMAIL | `[Admin] Neue Bestellung #XXX - RE-YYYY-NNNN` | PDF فاتورة | لا | `invoice.ts` |
| 3 | **إشعار مستند** | أدمن يرفع PDF | العميل | `Ihr Dokument zu Bestellung #XXX ist verfügbar` | PDF (اختياري) | 3× | `document-email.ts` |
| 4 | **رسالة أدمن** | أدمن يرسل رسالة | العميل | `Nachricht zu Ihrer Bestellung #XXX` | مرفقات (اختياري) | لا | `order-message-email.ts` |
| 5 | **إتمام الطلب** | أدمن يكمل الطلب | العميل | `Bestellung #XXX — Erfolgreich abgeschlossen ✅` | لا | لا | `completion-email.ts` |
| 6 | **حملة بريدية** | يدوي / مجدول | شريحة عملاء | مخصص | لا | لا | `campaign-email.ts` |
| 7 | **حملة تجريبية** | يدوي | إيميل اختبار | مخصص | لا | لا | `campaign-email.ts` |
| 8 | **اختبار SMTP** | يدوي (API) | إيميل محدد | `[SMTP Test] {timestamp}` | لا | لا | `test-smtp/route.ts` |

### 4.2 تفاصيل كل إيميل

#### إيميل 1: فاتورة + تأكيد طلب (Invoice Email)
**المحتوى:**
- ترحيب بالاسم
- تفاصيل الطلب (رقم، رقم فاتورة، طريقة دفع، الإجمالي)
- "الفاتورة المفصلة في المرفق كـ PDF"
- "تحصل على كل المستندات خلال 24 ساعة"
- زر "Zur Website"
- قسم المساعدة

**المرفق:** `Rechnung-RE-YYYY-NNNN.pdf` (مولد بـ jsPDF)

#### إيميل 2: نسخة الأدمن (Admin Copy)
**المحتوى:**
- "طلب جديد وارد"
- تفاصيل الطلب + بيانات العميل
- زر "Bestellung in Dashboard öffnen" (رابط مباشر)
- نفس PDF مرفق

#### إيميل 3: إشعار مستند (Document Notification)
**المحتوى:**
- "المستند الخاص بك متاح"
- اسم الملف + رقم الطلب
- زر "📄 Dokument herunterladen" (رابط آمن بـ token)
- نص: "المستند مرفق كـ PDF أيضاً"

#### إيميل 4: رسالة الأدمن (Order Message)
**المحتوى:**
- "رسالة بخصوص طلبك #XXX"
- الرسالة في مربع (border-left أزرق)
- قائمة مرفقات (لو موجودة)
- "أجب مباشرة على هذا الإيميل"

#### إيميل 5: إتمام الطلب (Completion Email)
**المحتوى:**
- "طلبك تم بنجاح"
- جدول: رقم الطلب، الخدمة، الحالة ✅
- **لو Abmeldung:**
  - مربع أخضر: "التأمين والجمارك تم إبلاغهم تلقائياً"
  - مربع أزرق: عروض إضافية (تسجيل، بيع، تأمين)
- زر "عرض الفاتورة" أو "تواصل معنا"
- CTA: "⭐️ قيّمنا على Google"

#### إيميل 6: حملة بريدية (Campaign Email)
**المحتوى:** مخصص بالكامل من الأدمن:
- عنوان (heading)
- صورة (اختياري)
- محتوى HTML
- زر CTA (اختياري)
- **Tracking pixel** (1x1 PNG شفاف)
- **Click tracking** (روابط ملفوفة)
- **رابط إلغاء اشتراك**

---

## 5. Flow كامل للإيميل (End-to-End)

### 5.1 Flow الفاتورة (Invoice Flow) — الأهم

```
العميل يدفع
    │
    ▼
Payment Webhook (PayPal/Mollie)
    │ POST /api/payment/webhook
    │ POST /api/payment/paypal/webhook
    │
    ▼
triggerInvoiceEmail(orderId)          ← src/lib/trigger-invoice.ts
    │
    ├── Check deduplication (Set)
    │   └── لو موجود → skip
    │
    ▼
generateAndSendInvoice(orderId)      ← src/lib/invoice.ts
    │
    ├── 1. جلب Order + Items + Payments + Invoices من DB
    ├── 2. تجهيز InvoiceData
    ├── 3. generateInvoicePDF() → jsPDF → Buffer
    │       ├── A4, هيدر أزرق، بيانات الشركة
    │       ├── عنوان العميل
    │       ├── جدول البنود + الأسعار
    │       ├── المجاميع + الضريبة 19%
    │       ├── تفاصيل الخدمة
    │       └── تذييل مع IBAN
    │
    ├── 4. sendInvoiceEmail()
    │       ├── إنشاء transporter (SMTP)
    │       ├── verify() اتصال
    │       ├── إرسال للعميل (مع PDF مرفق)
    │       │   └── 3 محاولات مع تأخير (2s, 4s)
    │       └── إرسال نسخة أدمن
    │
    └── 5. إنشاء OrderNote في DB
```

### 5.2 Flow المستند (Document Flow)

```
الأدمن يرفع PDF
    │ POST /api/admin/orders/[id]/documents
    │
    ├── 1. Validate: PDF only, max 10MB, magic bytes
    ├── 2. حفظ في /public/uploads/order-documents/YYYY/MM/
    ├── 3. إنشاء OrderDocument + download token
    ├── 4. إنشاء OrderNote
    │
    ▼
sendDocumentEmail() (async, fire-and-forget)
    │
    ├── إنشاء transporter + verify
    ├── إرسال إيميل مع رابط تحميل آمن
    └── مرفق PDF (اختياري)
```

### 5.3 Flow إتمام الطلب (Completion Flow)

```
الأدمن يغير حالة الطلب → "completed"
    │ PUT /api/admin/orders/[id]  (status: 'completed')
    │
    ▼
sendCompletionEmail(orderId)         ← src/lib/completion-email.ts
    │
    ├── Check: completionEmailSent === true? → skip
    ├── جلب Order + Invoices + Documents
    ├── تحديد نوع الخدمة (Abmeldung/Anmeldung)
    ├── بناء HTML مخصص
    ├── إرسال عبر sendCampaignEmail()
    ├── تحديث DB: completionEmailSent = true
    └── إنشاء OrderNote
```

### 5.4 Flow الحملة البريدية (Campaign Flow)

```
الأدمن ينشئ حملة
    │ POST /api/admin/email-campaigns
    │
    ├── اختيار القالب (أو فارغ)
    ├── تعديل المحتوى
    ├── اختيار المستهدفين (all/specific/segment)
    │
    ▼
الأدمن يرسل الحملة
    │ POST /api/admin/email-campaigns/[id]/send
    │
    ├── 1. Validate: subject, heading, content
    ├── 2. resolveRecipients() → قائمة إيميلات + tokens
    ├── 3. buildCampaignHtml() → HTML مع tracking
    │
    ▼
sendCampaignBatch() (background, لا ينتظر)
    │
    ├── تقسيم لدفعات (50 إيميل لكل دفعة)
    ├── لكل إيميل:
    │   ├── personalizeHtml() → إضافة رابط إلغاء اشتراك
    │   ├── sendCampaignEmail() → إرسال
    │   └── تأخير 500ms
    ├── تأخير 3000ms بين الدفعات
    ├── تحديث DB: sentCount, failedCount, errorLog
    └── تحديث status → 'sent' / 'failed'
```

### 5.5 Flow الحملة المجدولة (Scheduled Campaign)

```
Cron Job (كل 5 دقائق مثلاً)
    │ GET /api/cron/send-scheduled
    │ Authorization: Bearer {CRON_SECRET}
    │
    ├── البحث عن حملات: scheduledAt <= now AND status = 'scheduled'
    ├── لكل حملة: نفس flow الإرسال (#5.4)
    └── تحديث status → 'sending' → 'sent'
```

---

## 6. المشاكل المحتملة (Critical Issues)

### ✅ أشياء جيدة موجودة:
- Retry logic للفاتورة والمستند (3 محاولات)
- Deduplication لمنع التكرار
- SMTP verify قبل الإرسال
- Base64 password لتجنب مشاكل الأحرف الخاصة
- Constant-time comparison في invoice tokens
- Logging واضح في كل المراحل
- XSS protection (escapeHtml)

### ⚠️ نقاط ضعف يجب مراعاتها:

| المشكلة | التفاصيل | الملف |
|---------|----------|-------|
| **لا يوجد ملف config مركزي** | كل ملف يقرأ env vars بشكل مستقل → duplicated code | كل الملفات |
| **لا يوجد retry في campaign emails** | لو فشل إيميل واحد، يتم تسجيله فقط بدون إعادة محاولة | `campaign-email.ts` |
| **لا يوجد retry في order messages** | لو فشل، يرجع error بدون retry | `order-message-email.ts` |
| **لا يوجد retry في completion email** | يستخدم `sendCampaignEmail` بدون retry | `completion-email.ts` |
| **Campaign batch fire-and-forget** | السيرفر route يرجع response قبل ما الـ batch يخلص | `send/route.ts` |
| **In-memory deduplication فقط** | بيتمسح لو السيرفر ريستارت → ممكن تكرار | `trigger-invoice.ts` |
| **hardcoded fallbacks** | لو env vars مش موجودة، بيستخدم defaults خاصة بالموقع الأول | كل الملفات |
| **TLS rejectUnauthorized: false** | يقبل أي شهادة SSL → مقبول لـ Titan لكن مش ideal | كل الملفات |

---

## 7. الـ Database Schema الخاص بالإيميل

### جداول وحقول مطلوبة:

```prisma
// ─── Customer (حقول إضافية) ───
model Customer {
  emailSubscribed    Boolean  @default(true)    // هل مشترك بالحملات
  unsubscribeToken   String   @default("")      // token إلغاء الاشتراك

  @@index([emailSubscribed])
}

// ─── Order (حقول إضافية) ───
model Order {
  completionEmailSent  Boolean  @default(false)  // هل تم إرسال إيميل الإتمام

  invoices    Invoice[]
  documents   OrderDocument[]
  notes       OrderNote[]
}

// ─── EmailCampaign ───
model EmailCampaign {
  id              String    @id @default(cuid())
  name            String    @default("")
  subject         String    @default("")
  heading         String    @default("")
  content         String    @default("")         // HTML body
  imageUrl        String    @default("")
  ctaText         String    @default("")
  ctaUrl          String    @default("")

  targetMode      String    @default("all")       // "all" | "specific" | "segment"
  targetEmails    String    @default("")           // CSV
  targetSegment   String    @default("{}")         // JSON

  scheduledAt     DateTime?

  openCount       Int       @default(0)
  clickCount      Int       @default(0)

  templateId      String    @default("")
  status          String    @default("draft")      // draft|scheduled|sending|sent|failed
  totalRecipients Int       @default(0)
  sentCount       Int       @default(0)
  failedCount     Int       @default(0)
  errorLog        String    @default("[]")         // JSON array

  sentAt          DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([status])
  @@index([scheduledAt])
}

// ─── OrderNote ───
model OrderNote {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  note      String
  author    String   @default("system")
  createdAt DateTime @default(now())

  @@index([orderId])
}
```

---

## 8. الـ Dependencies المطلوبة

```json
{
  "nodemailer": "^7.0.13",
  "@types/nodemailer": "^7.0.11",
  "jspdf": "^4.2.1"
}
```

---

## 9. Migration Guide — دليل النقل للمشروع الثاني

### 9.1 الملفات المطلوب نقلها (بالترتيب)

#### المرحلة 1: البنية الأساسية
```bash
# 1. نسخ ملفات الإيميل الأساسية
cp src/lib/invoice.ts           → المشروع الجديد/src/lib/
cp src/lib/invoice-template.ts  → المشروع الجديد/src/lib/
cp src/lib/invoice-token.ts     → المشروع الجديد/src/lib/
cp src/lib/trigger-invoice.ts   → المشروع الجديد/src/lib/
cp src/lib/document-email.ts    → المشروع الجديد/src/lib/
cp src/lib/order-message-email.ts → المشروع الجديد/src/lib/
cp src/lib/completion-email.ts  → المشروع الجديد/src/lib/
```

#### المرحلة 2: نظام الحملات
```bash
cp src/lib/campaign-email.ts        → المشروع الجديد/src/lib/
cp src/lib/campaign-templates.ts    → المشروع الجديد/src/lib/
cp src/lib/campaign-recipients.ts   → المشروع الجديد/src/lib/
```

#### المرحلة 3: الـ API Routes
```bash
cp src/app/api/send-invoice/route.ts              → ...
cp src/app/api/test-smtp/route.ts                 → ...
cp src/app/api/admin/orders/[id]/resend-invoice/route.ts → ...
cp src/app/api/admin/email-campaigns/route.ts     → ...
cp src/app/api/admin/email-campaigns/[id]/send/route.ts → ...
cp src/app/api/admin/email-campaigns/[id]/test/route.ts → ...
cp src/app/api/admin/email-campaigns/[id]/preview/route.ts → ...
cp src/app/api/cron/send-scheduled/route.ts       → ...
cp src/app/api/track/open/[id]/route.ts           → ...
cp src/app/api/track/click/[id]/route.ts          → ...
cp src/app/api/unsubscribe/[token]/route.ts       → ...
```

### 9.2 ما يجب تغييره فقط (Content Only)

| العنصر | القيمة الحالية | غيّرها إلى |
|--------|----------------|------------|
| اسم الشركة | `iKFZ Digital Zulassung UG (haftungsbeschränkt)` | اسم الشركة الجديدة |
| العنوان | `Gerhard-Küchen-Str. 14, 45141 Essen` | العنوان الجديد |
| التليفون | `01522 4999190` | الرقم الجديد |
| الواتساب | `wa.me/4915224999190` | الرقم الجديد |
| الإيميل | `info@onlineautoabmelden.com` | الإيميل الجديد |
| الـ IBAN | `DE70 3002 0900 5320 8804 65` | الـ IBAN الجديد |
| رابط Google Review | `https://g.page/r/Cd3tHbWRE-frEAE/review` | رابط Google الجديد |
| اللوجو | `{SITE_URL}/logo.webp` | تأكد من وجود logo.webp في public/ |
| الـ Defaults في كل ملف | `'smtp.titan.email'`, `'info@onlineautoabmelden.com'` | القيم الجديدة |

### 9.3 إعداد Environment Variables

```bash
# .env.local في المشروع الجديد
SMTP_HOST=smtp.titan.email              # أو أي SMTP provider
SMTP_PORT=465
SMTP_USER=info@NEW-DOMAIN.com
SMTP_PASS_B64=$(echo -n 'PASSWORD' | base64)
EMAIL_FROM=info@NEW-DOMAIN.com
EMAIL_FROM_NAME=اسم الشركة الجديدة
ADMIN_EMAIL=admin@NEW-DOMAIN.com

SITE_URL=https://NEW-DOMAIN.com
NEXT_PUBLIC_SITE_URL=https://NEW-DOMAIN.com

NEXTAUTH_SECRET=any-random-string-32-chars
CRON_SECRET=any-random-string-for-cron
```

### 9.4 Database Migration

```bash
# 1. أضف الحقول للـ schema.prisma
# (Customer: emailSubscribed, unsubscribeToken)
# (Order: completionEmailSent)
# (EmailCampaign table)
# (OrderNote table)

# 2. شغّل migration
npx prisma migrate dev

# أو لو Turso:
npx tsx scripts/migrate-email-marketing.ts
npx tsx scripts/push-email-campaigns.ts
```

### 9.5 اختبار النظام

```bash
# 1. اختبار SMTP
curl "https://NEW-DOMAIN.com/api/test-smtp?secret=YOUR_CRON_SECRET&to=test@gmail.com"

# 2. اختبار فاتورة (من لوحة التحكم)
# → أنشئ طلب → ادفع → تحقق من وصول الإيميل

# 3. اختبار حملة
# → /admin/campaigns → أنشئ حملة → أرسل تجريبي → أرسل

# 4. تحقق من التتبع
# → افتح إيميل الحملة → تحقق من openCount في الداشبورد

# 5. اختبار إلغاء الاشتراك
# → اضغط رابط "Vom Newsletter abmelden" → تحقق من الصفحة
```

### 9.6 إعداد Cron Job
أضف cron job لإرسال الحملات المجدولة:
```bash
# كل 5 دقائق
*/5 * * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://NEW-DOMAIN.com/api/cron/send-scheduled
```

---

## 10. ملخص الملفات

| الملف | الأسطر | الوظيفة الرئيسية | يعتمد على |
|-------|--------|-----------------|-----------|
| `invoice.ts` | ≈395 | PDF + Email Invoice | prisma, jspdf, nodemailer |
| `invoice-template.ts` | ≈482 | HTML Template + Types | - |
| `invoice-token.ts` | 28 | HMAC Tokens | crypto |
| `trigger-invoice.ts` | 53 | Dedup + Trigger | invoice.ts |
| `document-email.ts` | ≈200 | Document Notification | nodemailer |
| `order-message-email.ts` | ≈160 | Admin → Customer Msg | nodemailer |
| `completion-email.ts` | ≈220 | Order Completed | campaign-email.ts, prisma |
| `campaign-email.ts` | ≈250 | Campaign Send/Batch | nodemailer |
| `campaign-templates.ts` | 126 | 5 Predefined Templates | - |
| `campaign-recipients.ts` | 191 | Recipient Resolution | prisma |
| `test-smtp/route.ts` | 98 | SMTP Diagnostics | nodemailer |

---

> **ملاحظة نهائية:** هذا التقرير يغطي كل سطر كود مسؤول عن إرسال إيميلات في المشروع. لا يوجد أي ملف إيميل آخر لم يتم توثيقه. يمكن استخدام هذا التقرير لنقل النظام 1:1 بدون أي تخمين.
