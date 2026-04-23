# 📄 SERVICE DOCUMENTATION: Fahrzeugabmeldung (Abmelden)

> **Blueprint Reference** — هذا التقرير يُستخدم كمرجع كامل لإعادة بناء الخدمة في مشروع آخر بنفس الدقة.

---

## 1. General Overview

| Property | Value |
|----------|-------|
| **Service Name** | Fahrzeugabmeldung (Vehicle Deregistration) |
| **URL** | `/product/fahrzeugabmeldung` |
| **Purpose** | تمكين المستخدم من إلغاء تسجيل سيارته إلكترونياً عبر ربط مباشر بالـ KBA (Kraftfahrt-Bundesamt) |
| **User Action** | إدخال بيانات الفاهرسوك شاين (رخصة السيارة) والأكواد الأمنية في فورم متعددة الخطوات |
| **Conversion Goal** | إتمام الفورم → الانتقال لصفحة الدفع `/rechnung` → الدفع → تأكيد الطلب |
| **Base Price** | `€19.70` (من قاعدة البيانات `Product.price`) |
| **Optional Add-on** | حجز اللوحة لمدة سنة: `+€4.70` |
| **Product Slug (DB)** | `fahrzeugabmeldung` |
| **Service Type (DB)** | `abmeldung` |
| **Form Type (DB)** | `abmeldung` |

---

## 2. Page Structure (Frontend)

### File Location
```
src/app/product/fahrzeugabmeldung/page.tsx
```

### Page Type
- **Server Component** (async) — يتم تحميل البيانات من قاعدة البيانات قبل العرض
- **ISR**: `revalidate = 60` (كل 60 ثانية)

### Hero Section
| Property | Value |
|----------|-------|
| **Display** | **معطّل** — `showFullContent = false` |
| **Background** | Gradient: `from-dark via-primary-900 to-dark` |
| **Content** | لا يظهر أي محتوى Hero — الصفحة تبدأ مباشرة بالفورم |

### Body Layout
| Property | Value |
|----------|-------|
| **Mode** | Light mode (خلفية بيضاء/رمادية فاتحة) |
| **Max Width** | `max-w-4xl` (الصفحة) / `max-w-3xl` (الفورم) |
| **Structure** | Single column — فورم في المنتصف |

### Complete Page Sections (بالترتيب من أعلى لأسفل):

1. **Service Form Section** — الفورم الرئيسية (4 خطوات)
2. **Trust Badge** — تقييم 5 نجوم Google
3. **CTA Buttons** — زر "Jetzt abmelden" + رابط WhatsApp
4. **SEO Intro Text** — نص تعريفي عن الخدمة
5. **6-Step Process** — شرح خطوات الإجراء بكروت مرئية (من `Steps` component)
6. **Cost Overview** — عرض الأسعار والتكاليف
7. **Kennzeichen Reservation Info** — معلومات حجز اللوحة
8. **Payment Methods** — عرض طرق الدفع المتاحة
9. **Contact Section** — Phone, WhatsApp, Email
10. **Mini-FAQ** — 6 أسئلة شائعة

---

## 3. Form System (CRITICAL)

### File Location
```
src/components/ServiceForm.tsx
```

### Form Type
- **Client Component** (`'use client'`)
- **Multi-step wizard** — 4 خطوات
- **Library**: React Hook Form + Zod validation
- **Animation**: Tailwind CSS `animate-in` classes (`fade-in slide-in-from-right-4 duration-300`)

### Zod Validation Schema

```typescript
const formSchema = z.object({
  kennzeichen:     z.string().min(3),
  fin:             z.string().min(6),
  sicherheitscode: z.string().min(7).max(7),
  stadtKreis:      z.string().min(2),
  codeVorne:       z.string().min(3).max(3),
  codeHinten:      z.string().min(3).max(3),
  reservierung:    z.enum(['keine', 'einJahr']).default('keine'),
});
```

### Step Definitions

---

#### Step 1: `Fahrzeugdaten` (بيانات السيارة)

| Field | Label | Type | Required | Validation | Placeholder |
|-------|-------|------|----------|------------|-------------|
| `kennzeichen` | Kennzeichen (Nummernschild) | `input[text]` | ✅ | min 3 chars | - |
| `fin` | FIN (Fahrzeugidentnummer) | `input[text]` | ✅ | min 6 chars | Feld E im Fahrzeugschein |

**Helper Content:**
- وصف: "Öffnen Sie Ihren Fahrzeugschein (Teil I), Ihre FIN finden Sie in Feld E"
- صورة توضيحية موجودة (انظر القسم 4)

---

#### Step 2: `Fahrzeugschein-Code` (كود رخصة السيارة)

| Field | Label | Type | Required | Validation | Placeholder |
|-------|-------|------|----------|------------|-------------|
| `sicherheitscode` | Sicherheitscode | `input[text]` | ✅ | exactly 7 chars (min 7, max 7) | 7-stelliger Code |
| `stadtKreis` | Stadt/Landkreis | `input[text]` | ✅ | min 2 chars | z.B. Berlin, München |

**Helper Content:**
- رابط فيديو YouTube: `https://www.youtube.com/watch?v=u38keaF1QKU`
- صورة مرجعية (انظر القسم 4)
- تحذير: "Erst rubbeln/freilegen, dann den Code eingeben."

---

#### Step 3: `Kennzeichen-Code(s)` (كود اللوحة)

| Field | Label | Type | Required | Validation | Placeholder |
|-------|-------|------|----------|------------|-------------|
| `codeVorne` | Plakette vorne | `input[text]` | ✅ | exactly 3 chars (min 3, max 3) | 3-stelliger Code |
| `codeHinten` | Plakette hinten | `input[text]` | ✅ | exactly 3 chars (min 3, max 3) | 3-stelliger Code |

**Helper Content:**
- رابط فيديو YouTube: `https://www.youtube.com/watch?v=3nsdJSvKAtE`
- ملاحظة: للدراجات النارية والمقطورات (لوحة واحدة) → يتم إدخال نفس الكود مرتين

---

#### Step 4: `Reservierung` (حجز اللوحة)

| Field | Label | Type | Required | Options | Default |
|-------|-------|------|----------|---------|---------|
| `reservierung` | Kennzeichen reservieren? | `radio` | ✅ | `keine` / `einJahr` | `keine` |

**Options:**
- `keine` — "Keine Reservierung" → `+€0.00`
- `einJahr` — "1 Jahr reservieren" → `+€4.70` (من `reservierungPrice` prop)

---

### Step Navigation

| Direction | Behavior |
|-----------|----------|
| **Next** | يتحقق من صحة حقول الخطوة الحالية فقط، ثم ينتقل |
| **Back** | العودة للخطوة السابقة بدون تحقق |
| **Submit** | فقط في الخطوة الأخيرة (Step 4) وبعد زيارة الخطوة |

### Step Progress UI
- شريط تقدم أعلى الفورم يعرض الخطوات الـ4
- الخطوة الحالية مميزة باللون الأساسي
- الخطوات المكتملة تظهر بعلامة ✓

### State Variables

```typescript
const [currentStep, setCurrentStep]     = useState(0);    // 0-3
const [isSubmitting, setIsSubmitting]   = useState(false);
const [isSubmitted, setIsSubmitted]     = useState(false);
const [step4Visited, setStep4Visited]   = useState(false); // Guard for submit button
```

---

## 4. Images Inside Steps

### Step 1 Image
| Property | Value |
|----------|-------|
| **Source** | `/uploads/wp/2024/01/WhatsApp-Image-2024-01-06-at-3.21.48-PM.jpeg` |
| **Purpose** | توضيح مكان FIN (Feld E) في رخصة السيارة |
| **Position** | أسفل حقل FIN مع شرح نصي |
| **Origin** | Local file (migrated from WordPress uploads) |
| **Constant** | `FAHRZEUGSCHEIN_IMAGE` |

### Step 2 Image
| Property | Value |
|----------|-------|
| **Source** | `/uploads/wp/2024/10/WhatsApp-Image-2024-10-28-at-23.51.02.jpeg` |
| **Purpose** | توضيح مكان Sicherheitscode في الفاهرسوك شاين |
| **Position** | بجانب حقول الكود |
| **Origin** | Local file |

### Step 3 Image
| Property | Value |
|----------|-------|
| **Source** | `/uploads/wp/2024/01/WhatsApp-Image-2024-01-06-at-3.21.48-PM-1.jpeg` |
| **Purpose** | توضيح مكان Plaketten-Codes على اللوحات |
| **Position** | بجانب حقلي الكود |
| **Origin** | Local file |

### YouTube Videos (Embedded links)
| Step | URL | Purpose |
|------|-----|---------|
| Step 2 | `https://www.youtube.com/watch?v=u38keaF1QKU` | شرح كيفية إيجاد Sicherheitscode |
| Step 3 | `https://www.youtube.com/watch?v=3nsdJSvKAtE` | شرح كيفية إيجاد Plaketten-Code |

---

## 5. Validation Logic

### Client-Side Validation (Zod + React Hook Form)

| Field | Rule | Error Message |
|-------|------|---------------|
| `kennzeichen` | `min(3)` | Default Zod message |
| `fin` | `min(6)` | Default Zod message |
| `sicherheitscode` | `min(7), max(7)` | يجب أن يكون 7 أحرف بالضبط |
| `stadtKreis` | `min(2)` | Default Zod message |
| `codeVorne` | `min(3), max(3)` | يجب أن يكون 3 أحرف بالضبط |
| `codeHinten` | `min(3), max(3)` | يجب أن يكون 3 أحرف بالضبط |
| `reservierung` | `enum(['keine', 'einJahr'])` | يجب اختيار أحد الخيارين |

### Step-Level Validation
- عند الضغط على "Weiter" (التالي)، يتم التحقق من حقول الخطوة الحالية فقط
- الحقول الفاشلة تظهر بحدود حمراء مع رسالة خطأ أسفل الحقل
- لا يُسمح بالتقدم حتى نجاح التحقق

### Server-Side Validation
- لا يوجد server validation على الفورم نفسها
- يتم التحقق من السعر في `/api/checkout/direct` (السعر من API لا من العميل)

---

## 6. Data Flow

### مصدر البيانات
```
Database (Prisma) → getProductBySlug('fahrzeugabmeldung') → Server Component → ServiceForm (props)
```

**Props المرسلة للفورم:**
```typescript
<ServiceForm
  basePrice={basePrice}               // من Product.price (default 19.7)
  reservierungPrice={reservierungPrice} // من Product.options (default 4.7)
  contactPhone={settings.phone}
  contactPhoneLink={settings.phoneLink}
  contactWhatsapp={settings.whatsapp}
/>
```

### حساب السعر (Client-side)
```typescript
const basePrice = propBasePrice ?? 19.7;
const reservierungUnitPrice = propReservierungPrice ?? 4.7;
const totalPrice = basePrice + (reservierung === 'einJahr' ? reservierungUnitPrice : 0);
```

### مسار البيانات بعد Submit

```
ServiceForm (client)
    │
    ├── 1. يحفظ البيانات في sessionStorage:
    │       sessionStorage.setItem('serviceData', JSON.stringify({
    │         formType: 'fahrzeugabmeldung',
    │         productId: 'abmeldung',
    │         productPrice: totalPrice.toFixed(2),
    │         kennzeichen, fin, sicherheitscode,
    │         stadtKreis, codeVorne, codeHinten,
    │         reservierung
    │       }))
    │
    └── 2. يعيد التوجيه إلى: router.push('/rechnung')
```

---

## 7. Checkout Flow

### ماذا يحدث بعد آخر خطوة؟

```
Step 4 (Reservierung) → Submit
    │
    ├── حفظ في sessionStorage
    │
    └── Redirect → /rechnung (Checkout Page)
```

### صفحة Checkout (`/rechnung`)

**File:** `src/app/rechnung/page.tsx` (Server Component) + `src/components/CheckoutForm.tsx` (Client Component)

#### المحتوى:

1. **Hero Section** — شارات الأمان (SSL, DSGVO, Official, Fast)
2. **CheckoutForm** — الفورم الرئيسية:

#### Checkout Form Fields:

| Section | Field | Type | Required | Validation |
|---------|-------|------|----------|------------|
| **Billing** | firstName | input[text] | ❌ | max 100 |
| | lastName | input[text] | ❌ | max 100 |
| | company | input[text] | ❌ | max 200 |
| | street | input[text] | ❌ | max 200 |
| | postcode | input[text] | ❌ | max 10 |
| | city | input[text] | ❌ | max 100 |
| **Contact** | phone | input[tel] | ✅ | min 6, max 30, regex: `/^[0-9+\-\s()]+$/` |
| | email | input[email] | ✅ | valid email |
| **Payment** | paymentMethod | radio | ✅ | must select one |
| **Terms** | agb | checkbox | ✅ | must be true |

#### Payment Methods:

| ID | Label | Fee | Provider |
|----|-------|-----|----------|
| `paypal` | PayPal | €0.00 | PayPal REST API v2 |
| `apple_pay` | Apple Pay | €0.00 | Mollie Payments API |
| `credit_card` | Kredit-/Debitkarte | €0.50 | Mollie Payments API |
| `klarna` | Klarna | €0.00 | Mollie Orders API |
| `sepa` | SEPA Überweisung | €0.00 | Direct bank transfer |

> ⚠️ Apple Pay يظهر فقط على أجهزة Apple التي تدعمه (يتم فحص `ApplePaySession.canMakePayments()`)

#### Order Summary (Sidebar):
```
Produktname          €19.70
Zwischensumme        €19.70
Zahlungsgebühr       €0.50 (أو "Kostenlos")
─────────────────────────────
Gesamtsumme          €20.20
inkl. MwSt.
```

#### Submit Flow:
```
POST /api/checkout/direct
    │
    ├── PayPal → redirect to PayPal approval page
    ├── Mollie (CC, Apple Pay) → redirect to Mollie checkout
    ├── Klarna → redirect to Klarna checkout (via Mollie Orders API)
    └── SEPA → redirect to /rechnung/{invoiceNumber} (bank details page)
```

#### After Payment:
```
Payment Success → /bestellung-erfolgreich?order={orderNumber}
Payment Failure → /zahlung-fehlgeschlagen?order={orderNumber}&reason={reason}
```

---

## 8. Integration with Admin Panel

### موقع الخدمة في لوحة التحكم

| Admin Section | Path | Purpose |
|---------------|------|---------|
| **Products** | `/admin/products` | إدارة المنتجات/الخدمات |
| **Orders** | `/admin/orders` | عرض الطلبات الواردة |
| **Order Detail** | `/admin/orders/{id}` | تفاصيل الطلب + بيانات الخدمة |

### تخزين البيانات

**Product (في DB):**
```prisma
Product {
  name: "Fahrzeug jetzt online abmelden"
  slug: "fahrzeugabmeldung"
  price: 19.7
  serviceType: "abmeldung"
  formType: "abmeldung"
  options: '[{"key":"reservierung","label":"1 Jahr reservieren","price":4.7}]'
  isActive: true
}
```

**Order (بعد الدفع):**
```prisma
Order {
  orderNumber: 2140
  status: "processing"
  total: 24.40
  subtotal: 19.70
  paymentFee: 0.50  // (إذا credit card)
  paymentMethod: "credit_card"
  productName: "Fahrzeug jetzt online abmelden"
  serviceData: '{"formType":"fahrzeugabmeldung","productId":"abmeldung","kennzeichen":"B-XX 1234","fin":"WBA...","sicherheitscode":"1234567","stadtKreis":"Berlin","codeVorne":"123","codeHinten":"456","reservierung":"einJahr"}'
}
```

### عرض بيانات الطلب في Admin

في صفحة تفاصيل الطلب (`/admin/orders/{id}`):
- **Left Panel**: جدول يعرض كل حقول `serviceData` (JSON parsed)
  - Kennzeichen, FIN, Sicherheitscode, etc.
- **Right Panel**: حالة الطلب + معلومات الدفع + إدارة الفاتورة + Refund

### تعديل المنتج من Admin

| Tab | Fields |
|-----|--------|
| **Basic** | Name, Slug, Price, Service Type, Form Type, Active/Inactive |
| **Content** | Hero Title, Hero Subtitle, Content (Rich HTML), Featured Image |
| **SEO** | Meta Title, Meta Description, Canonical, Robots, OG fields |
| **FAQ** | Dynamic Q&A pairs (JSON stored) |

### هل الفورم dynamic أم static؟
- **الفورم static** — الحقول مبرمجة في `ServiceForm.tsx`
- **السعر dynamic** — يأتي من قاعدة البيانات `Product.price` و `Product.options`
- **معلومات الاتصال dynamic** — تأتي من `SiteSettings`

---

## 9. API Endpoints

### Service Page Data

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | Server-side: `getProductBySlug('fahrzeugabmeldung')` | جلب بيانات المنتج |
| `GET` | Server-side: `getSiteSettings()` | جلب إعدادات الموقع (هاتف، واتساب) |
| `GET` | Server-side: `getHomepagePricing()` | جلب الأسعار للعرض |

### Checkout & Payment

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/checkout/direct` | إنشاء الطلب + بدء الدفع |
| `GET` | `/api/payment/callback?orderId={id}` | Mollie callback بعد الدفع |
| `GET` | `/api/payment/paypal/capture?orderId={id}` | PayPal capture بعد الموافقة |
| `POST` | `/api/payment/webhook` | Mollie webhook (async status update) |
| `POST` | `/api/payment/paypal/webhook` | PayPal webhook (async events) |

### Admin

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/admin/orders` | قائمة الطلبات (مع فلترة وبحث) |
| `GET` | `/api/admin/orders/{id}` | تفاصيل طلب واحد |
| `PUT` | `/api/admin/orders/{id}` | تحديث حالة الطلب |
| `GET` | `/api/admin/products` | قائمة المنتجات |
| `PUT` | `/api/admin/products/{id}` | تحديث المنتج |

---

## 10. SEO

### Metadata (Generated Server-side)

| Property | Value |
|----------|-------|
| **Title** | `"Fahrzeugabmeldung – ab 19,70 €"` (dynamic price, max 46 chars) |
| **Description** | من `Product.metaDescription` أو auto-generated |
| **Canonical** | `https://onlineautoabmelden.com/product/fahrzeugabmeldung` |
| **Robots** | `index, follow` |
| **OG Image** | `Product.ogImage` أو `{siteUrl}/logo.webp` |
| **OG Type** | `website` |

### JSON-LD Schemas (in dynamic product page)
1. **Service Schema** — نوع الخدمة مع السعر
2. **BreadcrumbList** — Home > Product Name
3. **FAQPage** — إذا وُجدت أسئلة FAQ

---

## 11. Price Calculation Summary

```
Base Price (DB)           = €19.70
+ Reservierung (optional) = €4.70
────────────────────────────────
= Subtotal               = €19.70 – €24.40

+ Payment Fee (gateway)   = €0.00 – €0.50
────────────────────────────────
= Total                  = €19.70 – €24.90

VAT (included, 19%)      = Total - (Total / 1.19)
```

---

## 12. Complete User Journey

```
1. مستخدم يزور /product/fahrzeugabmeldung
2. يرى الفورم مباشرة (بدون Hero)
3. Step 1: يدخل Kennzeichen + FIN
4. Step 2: يدخل Sicherheitscode + Stadt
5. Step 3: يدخل Code Vorne + Code Hinten
6. Step 4: يختار (مع/بدون) حجز اللوحة
7. يضغط "Weiter zur Kasse" → ينتقل إلى /rechnung
8. يملأ بيانات الاتصال (هاتف + إيميل) + بيانات الفواتير (اختياري)
9. يختار طريقة الدفع
10. يوافق على الشروط
11. يضغط "Bezahlen" → يتم إنشاء Order + Invoice + Payment
12. يتم توجيهه لبوابة الدفع (PayPal/Mollie/Klarna)
13. بعد الدفع الناجح → /bestellung-erfolgreich
14. يستلم فاتورة بالإيميل
15. الطلب يظهر في Admin Dashboard
```
