# تقرير شامل - نظام الفواتير (Invoice System) في لوحة التحكم

> هذا التقرير يشرح كل التفاصيل الخاصة بقسم الفواتير (Rechnungen) داخل لوحة تحكم الأدمن، بما يشمل كل الفيتشرز، الواجهات، الـ API، قاعدة البيانات، إرسال الإيميلات، وتوليد الـ PDF.

---

## 1. الملفات الأساسية

### صفحات الأدمن:
| الملف | الوظيفة |
|-------|---------|
| `src/app/admin/(dashboard)/invoices/page.tsx` | صفحة قائمة الفواتير الرئيسية |
| `src/app/admin/(dashboard)/invoices/[id]/page.tsx` | صفحة تفاصيل فاتورة واحدة |

### الـ API Routes:
| الملف | الوظيفة |
|-------|---------|
| `src/app/api/admin/invoices/route.ts` | عرض القائمة + إنشاء فاتورة |
| `src/app/api/admin/invoices/[id]/route.ts` | تفاصيل فاتورة + حذف |
| `src/app/api/admin/invoices/[id]/pdf/route.ts` | عرض PDF للأدمن |
| `src/app/api/admin/invoices/generate-all/route.ts` | توليد جميع الفواتير دفعة واحدة |
| `src/app/api/admin/orders/[id]/resend-invoice/route.ts` | إعادة إرسال إيميل الفاتورة |
| `src/app/api/admin/orders/[id]/documents/route.ts` | رفع/عرض مستندات الطلب |
| `src/app/api/send-invoice/route.ts` | trigger عام لإرسال فاتورة |
| `src/app/api/invoice/[invoiceNumber]/pdf/route.ts` | تحميل PDF للعميل (مؤمّن بـ token) |

### مكتبات مساعدة:
| الملف | الوظيفة |
|-------|---------|
| `src/lib/invoice.ts` | توليد PDF بـ jsPDF + إرسال الإيميل |
| `src/lib/invoice-template.ts` | HTML template الفاتورة الاحترافي |
| `src/lib/invoice-token.ts` | توليد والتحقق من HMAC tokens |
| `src/lib/trigger-invoice.ts` | إرسال فاتورة fire-and-forget مع منع التكرار |
| `src/lib/document-email.ts` | إيميل إشعار رفع مستند |
| `src/lib/admin-api.ts` | SWR hooks لجلب بيانات الأدمن |

### الكومبوننتات:
| الملف | الوظيفة |
|-------|---------|
| `src/components/admin/OrderDocuments.tsx` | رفع وعرض مستندات الطلب |
| `src/components/PrintButton.tsx` | زر تحميل PDF الفاتورة |
| `src/components/admin/AdminSidebar.tsx` | القائمة الجانبية (فيها رابط "Rechnungen") |

---

## 2. صفحة قائمة الفواتير (Invoice List Page)

### الفيتشرز الرئيسية:

#### أ) فلترة حسب الحالة (Status Tabs):
- **Alle** - كل الفواتير
- **Bezahlt** (Paid) - المدفوعة
- **Ausstehend** (Pending) - قيد الانتظار
- **Erstattet** (Refunded) - المستردة
- **Storniert** (Cancelled) - الملغاة

#### ب) البحث:
- بحث بـ **رقم الفاتورة** (مثل RE-2026-0001)
- بحث بـ **اسم العميل**
- بحث بـ **إيميل العميل**

#### ج) الأعمدة في الجدول (Desktop View):
| العمود | العرض | الوصف |
|--------|-------|-------|
| Rechnungsnr. (رقم الفاتورة) | 14% | رابط قابل للنقر يفتح تفاصيل الفاتورة |
| Bestellung (رقم الطلب) | 12% | رابط يفتح تفاصيل الطلب |
| Kunde (العميل) | 22% | الاسم + الإيميل |
| Datum (التاريخ) | 14% | بصيغة DD.MM.YYYY |
| Betrag (المبلغ) | 12% | بالـ EUR محاذاة لليمين |
| Status (الحالة) | 14% | Badge ملون (أخضر=مدفوع، أصفر=قيد الانتظار، إلخ) |
| Aktionen (الإجراءات) | 12% | أيقونة عرض + أيقونة تحميل PDF |

#### د) عرض الموبايل (Mobile Card View):
- كل فاتورة تظهر ككارت يحتوي:
  - Badge الحالة
  - اسم وإيميل العميل
  - التاريخ
  - المبلغ الإجمالي
  - زران: **Ansehen** (عرض) + **PDF** (تحميل)

#### هـ) التصفح (Pagination):
- عدد العناصر لكل صفحة: **20, 50, 100, 200**
- مؤشر الصفحة الحالية
- أزرار التنقل بين الصفحات
- عرض العدد الإجمالي

#### و) Virtual Scrolling:
- يستخدم مكتبة `react-window` للأداء العالي مع القوائم الكبيرة

#### ز) زر توليد جميع الفواتير:
- زر **"Alle generieren"** (Generate All)
- يولد فواتير لكل الطلبات اللي ماعندهاش فاتورة بعد
- يستدعي `POST /api/admin/invoices/generate-all`

#### ح) الإجراءات المتاحة:
| الإجراء | الوصف |
|---------|-------|
| عرض الفاتورة | النقر على رقم الفاتورة أو أيقونة العين → ينقل لصفحة `/admin/invoices/[id]` |
| تحميل PDF | أيقونة التحميل → يحمل PDF مباشرة من `/api/admin/invoices/[id]/pdf` |

---

## 3. صفحة تفاصيل الفاتورة (Invoice Detail Page)

### التصميم:
- هيدر أزرق غامق (#0D5581) مع شعار الشركة
- تخطيط عمودين: الأيسر (أكبر) لمعاينة الفاتورة، الأيمن للإجراءات

### محتويات كارت الفاتورة:

#### 1. الهيدر:
- شريط أزرق غامق مكتوب عليه "RECHNUNG" + رقم الفاتورة

#### 2. معلومات الفاتورة (شبكة):
- **Rechnungsadresse** (عنوان الفاتورة): الاسم، الشارع، الرمز البريدي/المدينة، الإيميل
- **Rechnungsdatum** (تاريخ الفاتورة)
- **Bestellnr.** (رقم الطلب)

#### 3. جدول البنود (Items Table):
| العمود | الوصف |
|--------|-------|
| Pos. | رقم تسلسلي |
| Beschreibung | وصف البند |
| Menge | الكمية |
| Preis | السعر |
| Gesamt | الإجمالي |

#### 4. قسم المجاميع:
- **Nettobetrag** - المبلغ الصافي (بدون ضريبة)
- **USt. 19%** - مبلغ الضريبة
- **Gesamtbetrag** - المبلغ الإجمالي (مميز بلون أزرق)

#### 5. بانر حالة الدفع (إذا مدفوعة):
- خلفية خضراء مع علامة ✓
- نص: "Bezahlt via [طريقة الدفع] · Transaktions-ID: [رقم المعاملة]"

---

## 4. الـ API التفصيلي

### GET `/api/admin/invoices` - قائمة الفواتير

**المعاملات (Query Parameters):**
```
page    = رقم الصفحة (افتراضي: 1)
limit   = عدد لكل صفحة (افتراضي: 20، أقصى: 100)
status  = all | paid | pending | refunded | cancelled
search  = نص البحث (رقم فاتورة، اسم عميل، إيميل)
```

**الاستجابة:**
```json
{
  "invoices": [
    {
      "id": "cuid_xxx",
      "invoiceNumber": "RE-2026-0001",
      "invoiceDate": "2026-01-15T10:30:00Z",
      "billingName": "Max Mustermann",
      "billingEmail": "max@example.com",
      "total": 99.99,
      "subtotal": 84.03,
      "paymentStatus": "paid",
      "paymentMethod": "PayPal",
      "orderId": "cuid_yyy",
      "createdAt": "2026-01-15T10:30:00Z",
      "order": {
        "orderNumber": 12345
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

**ملاحظات تقنية:**
- كاش في الذاكرة بمدة 10 ثواني
- منع N+1 queries: جلب أرقام الطلبات في query واحد
- مسح الكاش عند العمليات الكتابية (POST/DELETE)

---

### POST `/api/admin/invoices` - إنشاء فاتورة

**الطلب:**
```json
{ "orderId": "cuid_xxx" }
```

**العملية:**
1. التحقق من عدم وجود فاتورة مسبقة للطلب (409 Conflict لو موجودة)
2. توليد رقم فاتورة تلقائي بصيغة: `RE-YYYY-NNNN`
3. بناء البنود من بنود الطلب + رسوم الدفع (لو موجودة)
4. حساب الضريبة: `taxAmount = total - (total / 1.19)`

**الاستجابة:** الفاتورة المنشأة (201 Created)

---

### POST `/api/admin/invoices/generate-all` - توليد جماعي

**العملية:**
1. البحث عن كل الطلبات بدون فواتير
2. توليد أرقام فواتير متسلسلة
3. إنشاء سجل Invoice لكل طلب
4. إضافة رسوم الدفع كبند إضافي

**الاستجابة:**
```json
{
  "message": "Successfully created 45 invoices",
  "created": 45,
  "total": 45
}
```

---

### GET `/api/admin/invoices/[id]` - تفاصيل فاتورة

**الاستجابة تشمل:**
- كل حقول الفاتورة
- بيانات الطلب المرتبط: orderNumber, status, createdAt, serviceData, productName
- بيانات العميل: firstName, lastName, email, phone

---

### DELETE `/api/admin/invoices/[id]` - حذف فاتورة

**الاستجابة:**
```json
{ "success": true }
```

---

### GET `/api/admin/invoices/[id]/pdf` - عرض PDF للأدمن

**النوع:** صفحة HTML مع زر طباعة (مش ملف PDF حقيقي)
**المحتوى:**
- هيدر أزرق غامق مع بيانات الشركة
- تخطيط فاتورة ألمانية احترافية
- CSS مخصص للطباعة (media queries)
- زر "🖨️ PDF drucken / speichern" في الأعلى

---

### GET `/api/invoice/[invoiceNumber]/pdf` - تحميل PDF للعميل

**الأمان:** يتطلب HMAC token صالح كـ query parameter
```
/api/invoice/RE-2026-0001/pdf?token=a1f4d8c9e2b7a3c6
```

**الاستجابة:**
- ملف PDF حقيقي (binary) مولد بمكتبة jsPDF
- الهيدرز:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="Rechnung-RE-2026-0001.pdf"`
  - `Cache-Control: private, no-cache`

---

### POST `/api/admin/orders/[id]/resend-invoice` - إعادة إرسال الفاتورة

**العملية:**
1. التحقق من وجود الطلب وإيميل العميل
2. استدعاء `generateAndSendInvoice(orderId)`
3. توليد PDF + إرساله بالإيميل

**الاستجابة:**
```json
{
  "success": true,
  "orderId": "...",
  "orderNumber": 12345,
  "invoiceNumber": "RE-2026-0001",
  "emailSent": true,
  "recipient": "customer@example.com"
}
```

---

### POST `/api/admin/orders/[id]/documents` - رفع مستند PDF

**المتطلبات:**
- MIME type: `application/pdf` فقط
- الحجم الأقصى: 10 MB
- التحقق من magic bytes للـ PDF (`%PDF`)

**التخزين:**
- المسار: `/public/uploads/order-documents/YYYY/MM/`
- تسمية الملف: `order-{orderNumber}_{randomHex}_{sanitizedName}`
- إنشاء download token عشوائي (24-byte hex)

**بعد الرفع:**
- إنشاء سجل `OrderDocument` في قاعدة البيانات
- إنشاء `OrderNote` بنص: "Dokument '{name}' hochgeladen."
- إرسال إيميل إشعار للعميل (async)

---

## 5. هيكل قاعدة البيانات (Database Schema)

### جدول Invoice:
```
id              - String (CUID) - المفتاح الرئيسي
invoiceNumber   - String (فريد) - رقم الفاتورة (RE-2026-0001)
orderId         - String - مفتاح خارجي للطلب
customerId      - String? - مفتاح خارجي للعميل (اختياري)

--- معلومات الفاتورة (لقطة من الطلب) ---
billingName     - String - اسم العميل
billingEmail    - String - إيميل العميل
billingAddress  - String - العنوان
billingCity     - String - المدينة
billingPostcode - String - الرمز البريدي
billingCountry  - String - الدولة (افتراضي: "DE")

--- بيانات الشركة ---
companyName     - String - اسم الشركة
companyTaxId    - String - الرقم الضريبي

--- البنود ---
items           - String (JSON) - مصفوفة: [{ name, quantity, price, total }]

--- المبالغ ---
subtotal        - Float - المبلغ الصافي
taxRate         - Float - نسبة الضريبة (افتراضي: 19%)
taxAmount       - Float - مبلغ الضريبة
total           - Float - الإجمالي

--- الدفع ---
paymentMethod   - String - طريقة الدفع
paymentStatus   - String - حالة الدفع (pending, paid, refunded, failed)
transactionId   - String - رقم المعاملة

--- PDF ---
pdfUrl          - String - رابط ملف الـ PDF

--- التواريخ ---
invoiceDate     - DateTime - تاريخ الفاتورة
dueDate         - DateTime? - تاريخ الاستحقاق (اختياري)
createdAt       - DateTime - تاريخ الإنشاء
updatedAt       - DateTime - تاريخ آخر تحديث
```

**الـ Indexes:**
- `orderId` - للبحث السريع بالطلب
- `customerId` - للبحث بالعميل
- `invoiceDate` - للترتيب بالتاريخ
- `paymentStatus` - للفلترة بالحالة
- `billingEmail` - للبحث بالإيميل
- `invoiceNumber` - للبحث برقم الفاتورة
- `createdAt` - للترتيب

### جدول OrderDocument:
```
id        - String (CUID) - المفتاح الرئيسي
orderId   - String - مفتاح خارجي للطلب
fileName  - String - اسم الملف
fileUrl   - String - مسار الملف
fileSize  - Int - حجم الملف بالبايت
token     - String (فريد) - توكن التحميل الآمن
createdAt - DateTime - تاريخ الرفع
```

---

## 6. نظام توليد الـ PDF

### طريقتين لتوليد PDF:

#### أ) PDF للأدمن (عرض في لوحة التحكم):
- **المسار:** `/api/admin/invoices/[id]/pdf`
- **الطريقة:** صفحة HTML مع أنماط طباعة مخصصة
- **الاستخدام:** الأدمن يضغط "طباعة" → المتصفح يحفظها كـ PDF
- **المحتوى:** هيدر أزرق، بيانات الشركة، عنوان العميل، جدول البنود، المجاميع، بانر حالة الدفع، تذييل

#### ب) PDF للعميل (تحميل/إيميل):
- **المسار:** `/api/invoice/[invoiceNumber]/pdf?token=xxx`
- **الطريقة:** مكتبة **jsPDF** (خفيفة، بدون Chromium)
- **التفاصيل:**
  - صيغة A4 (بالمللي)
  - هيدر أزرق غامق مع شعار الشركة
  - تخطيط فاتورة ألمانية احترافية
  - يشمل: هيدر، عنوان العميل، بيانات الشركة، جدول البنود، المجاميع، تفاصيل الخدمة، تذييل مع IBAN

---

## 7. نظام إرسال الإيميلات

### الإعدادات (SMTP):
```
SMTP_HOST       = smtp.titan.email (افتراضي)
SMTP_PORT       = 465 (SSL)
SMTP_USER       = info@onlineautoabmelden.com
SMTP_PASS_B64   = كلمة المرور بترميز Base64
EMAIL_FROM      = info@onlineautoabmelden.com
EMAIL_FROM_NAME = Online Auto Abmelden
ADMIN_EMAIL     = إيميل الأدمن
```

### إيميل العميل:
- **الموضوع:** "Ihre Bestellung #12345 & Rechnung RE-2026-0001"
- **المحتوى:**
  - هيدر مع شعار الشركة
  - ترحيب باسم العميل
  - تفاصيل الطلب والفاتورة
  - جدول المبالغ
  - رابط CTA للموقع
  - قسم المساعدة (تليفون، واتساب، إيميل)
  - فاتورة PDF كمرفق

### إيميل الأدمن:
- **الموضوع:** "[Admin] Neue Bestellung #12345 - RE-2026-0001"
- **المحتوى:**
  - رابط للوحة التحكم
  - ملخص بيانات العميل
  - نفس فاتورة PDF كمرفق

### نظام إعادة المحاولة (Retry):
- عدد المحاولات: 3
- تأخير تصاعدي: 2 ثانية، 4 ثواني
- لو فشلت كلها: يرجع `{ success: false, error: "..." }`

### منع التكرار (Deduplication):
- يتتبع الطلبات المرسلة في Set
- فترة تهدئة 5 دقائق لكل طلب
- يمنع الإرسال المزدوج من webhook + callback

---

## 8. طرق تفعيل إرسال الفاتورة (Triggers)

| الطريقة | التفاصيل |
|---------|----------|
| **تلقائي بعد الدفع** | webhook الدفع يستدعي `triggerInvoiceEmail(orderId)` |
| **يدوي - توليد جماعي** | زر "Alle generieren" في صفحة القائمة |
| **يدوي - فاتورة فردية** | POST `/api/admin/invoices` مع orderId |
| **إعادة إرسال** | POST `/api/admin/orders/[id]/resend-invoice` |
| **API عام** | POST `/api/send-invoice` (يقبل admin session / cron secret / internal call) |

---

## 9. نظام الأمان

### توكن الفاتورة (Invoice Token):
- **النوع:** HMAC-SHA256
- **المفتاح:** `NEXTAUTH_SECRET` أو `JWT_SECRET`
- **الطول:** 16 حرف hex (64-bit)
- **خاصية:** حتمي (نفس رقم الفاتورة = نفس التوكن)
- **التحقق:** مقارنة ثابتة الوقت (constant-time) لمنع timing attacks

### أمان رفع المستندات:
- التحقق من MIME type
- التحقق من magic bytes للـ PDF
- حجم أقصى 10 MB
- تسمية آمنة للملفات (sanitized)
- download token عشوائي (24-byte hex)

### مصادقة الـ API:
- Admin session مطلوبة لكل الـ admin routes
- `/api/send-invoice` يقبل طرق متعددة:
  - Bearer token (admin session)
  - CRON_SECRET
  - `x-internal-call: invoice-trigger` header
  - Localhost calls

---

## 10. صيغة رقم الفاتورة

- **النمط:** `RE-YYYY-NNNN`
- **أمثلة:** `RE-2026-0001`, `RE-2026-0042`, `RE-2026-1234`
- **تزايد تلقائي** سنوي
- **بادئة السنة** تمنع التكرار

---

## 11. حالات الدفع (Payment Statuses)

| الحالة | الوصف | اللون في الواجهة |
|--------|-------|-----------------|
| `paid` (Bezahlt) | تم الدفع | أخضر (#22c55e) |
| `pending` (Ausstehend) | قيد الانتظار | أصفر (#f59e0b) |
| `refunded` (Erstattet) | مسترد | - |
| `cancelled` (Storniert) | ملغي | - |
| `failed` | فشل الدفع | أحمر (#ef4444) |

---

## 12. التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| **Next.js 14+ (App Router)** | الفريمورك الأساسي |
| **Prisma ORM** | التعامل مع قاعدة البيانات |
| **SWR** | جلب البيانات مع التخزين المؤقت |
| **react-window** | Virtual scrolling للقوائم الكبيرة |
| **jsPDF** | توليد ملفات PDF (بدون Chromium) |
| **nodemailer** | إرسال الإيميلات عبر SMTP |
| **Titan Email (SMTP)** | خادم البريد الإلكتروني |
| **HMAC-SHA256** | توكنات آمنة لتحميل الفواتير |
| **TailwindCSS** | التصميم والأنماط |

---

## 13. الـ SWR Configuration

```typescript
useInvoices({ page, status, search, limit })
```

- `revalidateOnFocus: false` - ما يعيد الجلب عند التركيز
- `revalidateOnReconnect: false` - ما يعيد الجلب عند إعادة الاتصال
- `keepPreviousData: true` - يحتفظ بالبيانات السابقة أثناء الجلب
- `dedupingInterval: 10000` - منع الطلبات المكررة لمدة 10 ثواني
- `errorRetryCount: 2` - محاولتين إعادة عند الخطأ

---

## 14. المتغيرات البيئية المطلوبة

```bash
# توليد الفواتير
NEXTAUTH_SECRET          # لتوليد التوكنات
JWT_SECRET               # بديل لتوليد التوكنات

# البريد الإلكتروني
SMTP_HOST                # افتراضي: smtp.titan.email
SMTP_PORT                # افتراضي: 465
SMTP_USER                # مثل: info@domain.com
SMTP_PASS_B64            # كلمة المرور بـ Base64
SMTP_PASS                # بديل: كلمة مرور نص عادي
SMTP_DEBUG               # "true" لتفعيل debug logging
EMAIL_FROM               # عنوان المرسل
EMAIL_FROM_NAME          # اسم المرسل
ADMIN_EMAIL              # إيميل استلام نسخ الأدمن

# الموقع
SITE_URL                 # الرابط الأساسي (للإيميلات/PDF)
NEXT_PUBLIC_SITE_URL     # الرابط العام

# Cron
CRON_SECRET              # مفتاح الاستدعاءات المجدولة
```

---

## 15. ملخص الفيتشرز للتنفيذ

### يجب تنفيذ:
- [ ] صفحة قائمة فواتير مع جدول (Desktop) + كروت (Mobile)
- [ ] فلترة بحالة الدفع (5 حالات)
- [ ] بحث برقم الفاتورة، اسم العميل، الإيميل
- [ ] تصفح الصفحات (Pagination) مع خيارات 20/50/100/200
- [ ] Virtual scrolling بـ react-window
- [ ] صفحة تفاصيل فاتورة كاملة مع معاينة
- [ ] توليد PDF احترافي بمكتبة jsPDF
- [ ] صفحة HTML للطباعة كـ PDF من المتصفح
- [ ] زر توليد جماعي لكل الفواتير
- [ ] إرسال إيميل فاتورة للعميل (مع PDF مرفق)
- [ ] إرسال نسخة للأدمن
- [ ] إعادة إرسال الفاتورة يدوياً
- [ ] رفع مستندات PDF للطلبات (drag & drop)
- [ ] توكنات آمنة لتحميل الفواتير بدون login
- [ ] منع تكرار الإرسال (Deduplication)
- [ ] نظام retry للإيميلات (3 محاولات)
- [ ] ترقيم فواتير تلقائي (RE-YYYY-NNNN)
- [ ] حساب الضريبة تلقائي (19% USt.)
- [ ] كاش API في الذاكرة (10 ثواني)
- [ ] Sidebar navigation link

---

> **ملاحظة:** هذا التقرير يغطي كل جزء في نظام الفواتير. يمكن استخدامه كمرجع كامل لإعادة بناء نفس النظام في الموقع الثاني.
