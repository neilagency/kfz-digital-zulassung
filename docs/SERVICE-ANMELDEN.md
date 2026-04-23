# 📄 SERVICE DOCUMENTATION: Fahrzeuganmeldung / Ummeldung (Anmelden)

> **Blueprint Reference** — هذا التقرير يُستخدم كمرجع كامل لإعادة بناء الخدمة في مشروع آخر بنفس الدقة.

---

## 1. General Overview

| Property | Value |
|----------|-------|
| **Service Name** | Fahrzeuganmeldung / Ummeldung (Vehicle Registration / Re-registration) |
| **URL** | `/product/auto-online-anmelden` |
| **Purpose** | تمكين المستخدم من تسجيل أو إعادة تسجيل سيارته إلكترونياً |
| **User Action** | اختيار نوع الخدمة، إدخال بيانات التأمين والبنك، ورفع مستندات السيارة |
| **Conversion Goal** | إتمام الفورم (3 خطوات) → الانتقال لصفحة الدفع `/rechnung` → الدفع → تأكيد الطلب |
| **Price Range** | `€99.70 – €124.70` (حسب نوع الخدمة) |
| **Product Slug (DB)** | `auto-online-anmelden` |
| **Service Type (DB)** | `anmeldung` |
| **Form Type (DB)** | `anmeldung` |

### Service Options (Sub-services)

| Key | Label | Price |
|-----|-------|-------|
| `neuzulassung` | Anmelden (تسجيل جديد) | €124.70 |
| `ummeldung` | Ummelden (إعادة تسجيل / نقل) | €119.70 |
| `wiederzulassung` | Wiederzulassen (إعادة تسجيل معلّق) | €99.70 |
| `neuwagen` | Neuwagen Zulassung (تسجيل سيارة جديدة) | €124.70 |

### Optional Add-ons

| Option | Price | Condition |
|--------|-------|-----------|
| Kennzeichen reserviert (لوحة محجوزة مسبقاً) | +€24.70 | `kennzeichenWahl === 'reserviert'` |
| Kennzeichen bestellen (طلب لوحات جديدة) | +€29.70 | `kennzeichenBestellen === 'ja'` |

---

## 2. Page Structure (Frontend)

### File Location
```
src/app/product/auto-online-anmelden/page.tsx
```

### Page Type
- **Server Component** (async) — يتم تحميل البيانات من قاعدة البيانات
- **ISR**: `revalidate = 60` (كل 60 ثانية)

### Hero Section
| Property | Value |
|----------|-------|
| **Display** | **معطّل** — `showFullContent = false` |
| **Background** | Gradient: `from-dark via-primary-900 to-dark` |
| **Content** | لا يظهر محتوى Hero — الصفحة تبدأ مباشرة بالفورم |

### Body Layout
| Property | Value |
|----------|-------|
| **Mode** | Light mode |
| **Max Width** | `max-w-4xl` (الصفحة) / `max-w-3xl` (الفورم) |
| **Structure** | Single column — الفورم في المنتصف |

### Complete Page Sections (بالترتيب):

1. **Registration Form Section** — الفورم الرئيسية (3 خطوات)
2. **Trust Badge** — تقييم 5 نجوم
3. **CTA Buttons** — زر التسجيل + WhatsApp
4. **SEO Intro Text** — نص تعريفي
5. **Process Steps** — خطوات مرئية
6. **Cost Overview** — الأسعار حسب نوع الخدمة
7. **Payment Methods** — طرق الدفع
8. **Contact Section** — Phone, WhatsApp, Email
9. **Mini-FAQ** — أسئلة شائعة

---

## 3. Form System (CRITICAL)

### File Location
```
src/components/RegistrationForm.tsx
```

### Form Type
- **Client Component** (`'use client'`)
- **Multi-step wizard** — **3 خطوات**
- **Library**: React Hook Form + Zod validation
- **Animation**: Tailwind CSS `animate-in` classes (`fade-in slide-in-from-right-4 duration-300`)
- **يتضمن**: رفع ملفات (Document Upload) مع ضغط الصور

### Zod Validation Schema

```typescript
const formSchema = z.object({
  /* Step 1 */
  service:              z.string().min(1, 'Bitte wählen Sie eine Leistung'),
  ausweis:              z.string().min(1, 'Bitte wählen Sie Ihren Ausweistyp'),
  evbNummer:            z.string().min(6).max(12),
  
  /* Step 2 */
  kennzeichenWahl:      z.string().min(1, 'Bitte wählen Sie eine Kennzeichen-Option'),
  wunschkennzeichen:    z.string().optional().default(''),
  kennzeichenPin:       z.string().optional().default(''),
  kennzeichenBestellen: z.enum(['ja', 'nein']),
  
  /* Step 3 */
  kontoinhaber:         z.string().min(2),
  iban:                 z.string().min(15).max(34),
});
```

### Step Definitions

---

#### Step 1: `Service & Ausweis` (نوع الخدمة والهوية)

| Field | Label | Type | Required | Validation | Options/Notes |
|-------|-------|------|----------|------------|---------------|
| `service` | Leistung wählen | `select` | ✅ | min 1 char | 4 خيارات (انظر Service Options أعلاه) |
| `ausweis` | Ausweistyp | `select` | ✅ | min 1 char | `personalausweis` / `aufenthaltstitel` / `reisepass` |
| `evbNummer` | eVB-Nummer | `input[text]` | ✅ | min 6, max 12 | رقم تأكيد التأمين الإلكتروني |

**Helper Content:**
- وصف: "Wählen Sie Ihre gewünschte Leistung"
- عرض السعر بجانب كل خيار خدمة
- شرح eVB: "الرقم الإلكتروني من شركة التأمين الخاصة بك"

**Price Display:**
- يتم عرض السعر الديناميكي لكل خيار Service
- `€124.70` للتسجيل الجديد، `€119.70` للنقل، إلخ

**Step Icon:** `Car` (lucide-react)

---

#### Step 2: `Kennzeichen` (اللوحة)

| Field | Label | Type | Required | Validation | Options/Notes |
|-------|-------|------|----------|------------|---------------|
| `kennzeichenWahl` | Kennzeichen-Option | `radio` | ✅ | min 1 char | `automatisch` / `reserviert` |
| `wunschkennzeichen` | Wunschkennzeichen | `input[text]` | ❌ | optional | يظهر فقط إذا `reserviert` |
| `kennzeichenPin` | Reservierungs-PIN | `input[text]` | ❌ | optional | يظهر فقط إذا `reserviert` |
| `kennzeichenBestellen` | Kennzeichen bestellen? | `radio` | ✅ | enum | `ja` (+€29.70) / `nein` |

**Conditional Fields:**
```
if (kennzeichenWahl === 'reserviert'):
    → Show wunschkennzeichen input (+€24.70)
    → Show kennzeichenPin input
```

**Price Impact:**
- `kennzeichenWahl === 'reserviert'` → `+€24.70`
- `kennzeichenBestellen === 'ja'` → `+€29.70`

**Step Icon:** `Package` (lucide-react)

---

#### Step 3: `Bankdaten & Kasse` (البيانات البنكية + رفع المستندات)

| Field | Label | Type | Required | Validation | Notes |
|-------|-------|------|----------|------------|-------|
| `kontoinhaber` | Kontoinhaber | `input[text]` | ✅ | min 2 chars | اسم صاحب الحساب البنكي |
| `iban` | IBAN | `input[text]` | ✅ | min 15, max 34 | رقم الحساب البنكي (لضريبة السيارة) |

**+ Document Uploads (Required — varies by service & ausweis type):**

**Vehicle Documents — depend on `service` type:**

| Service | Required Vehicle Docs |
|---------|----------------------|
| `neuzulassung` | fahrzeugscheinVorne + fahrzeugscheinHinten + fahrzeugbriefVorne |
| `ummeldung` | fahrzeugscheinVorne + fahrzeugscheinHinten + fahrzeugbriefVorne |
| `wiederzulassung` | fahrzeugscheinVorne + fahrzeugscheinHinten |
| `neuwagen` | fahrzeugbriefVorne |

| Upload ID | Label | Hint | Example Image |
|-----------|-------|------|---------------|
| `fahrzeugscheinVorne` | Fahrzeugschein (Teil I) – Vorderseite | رفع الوجه الأمامي كاملاً | `/images/example-fahrzeugschein-vorderseite.jpg` |
| `fahrzeugscheinHinten` | Fahrzeugschein (Teil I) – Rückseite mit Sicherheitscode | الوجه الخلفي مع كشف كود الأمان | `/images/example-fahrzeugschein-rueckseite.jpg` |
| `fahrzeugbriefVorne` | Fahrzeugbrief (Teil II) – Vorderseite mit Sicherheitscode | الوجه الأمامي مع كود الأمان | `/images/example-fahrzeugbrief-vorderseite.jpg` |

**Verification Documents — depend on `ausweis` type:**

| Ausweis | Required Verification Docs |
|---------|---------------------------|
| `personalausweis` | personalausweisVorne + personalausweisHinten |
| `aufenthaltstitel` | aufenthaltstitelVorne + aufenthaltstitelHinten |
| `reisepass` | reisepassVorne + meldebescheinigung |

| Upload ID | Label | Hint | Example Image |
|-----------|-------|------|---------------|
| `personalausweisVorne` | Personalausweis – Vorderseite | الوجه الأمامي للبطاقة الشخصية | `/images/example-personalausweis-vorne.jpg` |
| `personalausweisHinten` | Personalausweis – Rückseite | الوجه الخلفي للبطاقة الشخصية | `/images/example-personalausweis-hinten.jpg` |
| `aufenthaltstitelVorne` | Aufenthaltstitel – Vorderseite | الوجه الأمامي لتصريح الإقامة | `/images/example-aufenthaltstitel-vorne.jpg` |
| `aufenthaltstitelHinten` | Aufenthaltstitel – Rückseite | الوجه الخلفي لتصريح الإقامة | `/images/example-aufenthaltstitel-hinten.jpg` |
| `reisepassVorne` | Reisepass – Seite mit Foto | صفحة الصورة الشخصية | `/images/example-reisepass-vorne.jpg` |
| `meldebescheinigung` | Meldebescheinigung | شهادة التسجيل الرسمية | `/images/example-meldebescheinigung.gif` |

**Upload Specifications:**
| Property | Value |
|----------|-------|
| **Accepted Types** | `image/jpeg, image/png, image/jpg, application/pdf` |
| **Max File Size** | 10 MB (raw), 3.5 MB (after compression) |
| **Compression** | Client-side image compression — reduces dimensions & quality iteratively |
| **Upload Endpoint** | `POST /api/upload/documents` |
| **Preview** | صورة مصغرة للملف المرفوع |
| **Example Images** | لكل حقل زر (i) يعرض صورة مثال في Modal |

**Step Icon:** `CreditCard` (lucide-react)

---

### Upload Card Component (`FileUploadCard`)

كل حقل رفع يعرض:
1. **Label** مع علامة * (مطلوب)
2. **زر (i)** — يفتح Modal يعرض صورة مثال توضيحية
3. **منطقة الرفع** — أيقونة كاميرا + "Foto aufnehmen oder Datei wählen"
4. **بعد الرفع** — صورة مصغرة + اسم الملف + حجمه + زر حذف (X)
5. **رسالة خطأ** — إذا كان الملف مفقوداً عند Submit

### Image Compression Logic

```typescript
async function compressImage(file: File): Promise<File> {
  // If file is already small enough, return as-is
  if (file.size <= 3.5 * 1024 * 1024) return file;
  
  // Iteratively reduce quality and dimensions
  // Uses canvas to resize
  // Target: < 3.5 MB
  // Min quality: 0.5
  // Max iterations: 5
}
```

---

### Step Navigation

| Direction | Behavior |
|-----------|----------|
| **Next** | يتحقق من حقول الخطوة الحالية + التحقق من رفع الملفات (في Step 3) |
| **Back** | العودة بدون تحقق |
| **Submit** | في Step 3 فقط — بعد التحقق من كل الحقول + كل الملفات |

### State Variables

```typescript
const [currentStep, setCurrentStep]     = useState(0);      // 0-2
const [isSubmitting, setIsSubmitting]   = useState(false);
const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({
  fahrzeugscheinVorne: null,
  fahrzeugscheinHinten: null,
  fahrzeugbriefVorne: null,
  personalausweisVorne: null,
  personalausweisHinten: null,
  aufenthaltstitelVorne: null,
  aufenthaltstitelHinten: null,
  reisepassVorne: null,
  meldebescheinigung: null,
});
const [uploadErrors, setUploadErrors]   = useState<Record<string, string>>({});
```

---

## 4. Images Inside Steps

### Step 3 — Document Example Images (Modal)

| Image | Path | Purpose |
|-------|------|---------|
| Fahrzeugschein Vorderseite | `/images/example-fahrzeugschein-vorderseite.jpeg` | مثال: كيف تبدو الوجه الأمامي لرخصة السيارة |
| Fahrzeugschein Rückseite | `/images/example-fahrzeugschein-rueckseite.jpeg` | مثال: الوجه الخلفي مع Sicherheitscode |
| Fahrzeugbrief Vorderseite | `/images/example-fahrzeugbrief-vorderseite.jpeg` | مثال: الوجه الأمامي لخطاب السيارة |

**عرض الصور:**
- تُعرض في **Modal** عند الضغط على زر (i)
- تستخدم Next.js `Image` component
- **الهدف**: مساعدة المستخدم لمعرفة كيف يصور المستند بشكل صحيح

### لا يوجد فيديوهات YouTube في هذه الخدمة
(على عكس خدمة Abmelden التي تحتوي على رابطين YouTube)

### Step 3 — Additional UI Elements

**Contact Help Box (أسفل الـ uploads):**
- خلفية: `bg-gray-50 border border-gray-200 rounded-xl p-4`
- نص: "Probleme beim Hochladen? Senden Sie uns die Fotos alternativ per WhatsApp oder E-Mail."
- زر WhatsApp: `bg-[#25D366] text-white` مع رقم التواصل
- زر Email: `bg-primary text-white` مع البريد الإلكتروني

**Wichtige Informationen (Details/Collapsible):**
- خلفية: `bg-amber-50 border border-amber-200 rounded-xl`
- أيقونة: `ChevronDown` تدور 180° عند الفتح
- المحتوى:
  - "Bitte achten Sie darauf, dass alle Angaben exakt mit Ihren Dokumenten übereinstimmen."
  - "Besonders wichtig: eVB-Nummer, Name laut Ausweis, reservierte Kennzeichen, PIN, Bankdaten"
  - "Daten nicht korrekt → Antrag kann abgelehnt werden (kostenpflichtig)"
  - "Kontaktieren Sie uns vor dem Absenden bei Unsicherheit"
  - "Keine offenen Steuerrückstände bei der Zulassungsstelle"

**Price Summary Card (أسفل كل شيء في Step 3):**
- خلفية: `bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-5 border border-primary/10`
- يعرض:
  - Service Label + Price
  - + Reserviertes Kennzeichen (إذا aktiv)
  - + Kennzeichen-Bestellung (إذا aktiv)
  - ─────────────────
  - **Gesamt**: `font-extrabold text-primary text-lg`

---

## 5. Validation Logic

### Client-Side Validation (Zod + React Hook Form)

| Field | Rule | Error Message |
|-------|------|---------------|
| `service` | `min(1)` | "Bitte wählen Sie eine Leistung" |
| `ausweis` | `min(1)` | "Bitte wählen Sie Ihren Ausweistyp" |
| `evbNummer` | `min(6), max(12)` | "mind. 6 Zeichen" / "max. 12 Zeichen" |
| `kennzeichenWahl` | `min(1)` | "Bitte wählen Sie eine Kennzeichen-Option" |
| `wunschkennzeichen` | optional | - |
| `kennzeichenPin` | optional | - |
| `kennzeichenBestellen` | `enum(['ja', 'nein'])` | "Bitte wählen Sie eine Option" |
| `kontoinhaber` | `min(2)` | "Bitte geben Sie den Kontoinhaber ein" |
| `iban` | `min(15), max(34)` | "gültige IBAN" / "max 34 Zeichen" |

### File Upload Validation (Custom — dynamic based on service & ausweis)
| Check | Rule | Error Message |
|-------|------|---------------|
| Vehicle docs | Files required based on `getVehicleUploadIds(service)` | "Bitte {Label} hochladen" |
| Verification docs | Files required based on `getVerificationUploadIds(ausweis)` | "Bitte {Label} hochladen" |
| File type | Must be `image/jpeg, image/png, image/jpg, application/pdf` | Type error |
| File size | ≤ 10 MB raw input | Size error |

**Total uploads: 3–5 files** depending on service + ausweis combination.

### Server-Side Validation
- `/api/upload/documents` — يتحقق من نوع الملف وحجمه
- `/api/checkout/direct` — يتحقق من سعر المنتج من DB (لا يثق بسعر العميل)

---

## 6. Data Flow

### مصدر البيانات
```
Database (Prisma) → getProductBySlug('auto-online-anmelden') → Server Component → RegistrationForm (props)
```

**Props المرسلة للفورم:**
```typescript
<RegistrationForm
  serviceOptions={serviceFormOptions}          // [{value, label, price}]
  kennzeichenReserviertPrice={24.7}           // من Product.options
  kennzeichenBestellenPrice={29.7}            // من Product.options
  contactPhone={settings.phone}
  contactPhoneLink={settings.phoneLink}
  contactWhatsapp={settings.whatsapp}
/>
```

**Service Options Source:**
```typescript
// من Product.options (JSON في DB):
[
  { key: 'neuzulassung', label: 'Anmelden', price: 124.7 },
  { key: 'ummeldung', label: 'Ummelden', price: 119.7 },
  ...
]

// يتم تحويلها إلى:
const serviceFormOptions = productOptions.map(opt => ({
  value: opt.key,
  label: KEY_TO_LABEL[opt.key] || opt.label,
  price: opt.price,
}));
```

### حساب السعر (Client-side Dynamic)
```typescript
const basePrice = selectedServiceOption?.price ?? 0;           // €99.70 – €124.70
const kReserviertUnit = kennzeichenReserviertPrice ?? 24.7;
const kBestellenUnit = kennzeichenBestellenPrice ?? 29.7;

const kennzeichenReservierung = (kennzeichenWahl === 'reserviert') ? kReserviertUnit : 0;
const kennzeichenBestellung = (kennzeichenBestellen === 'ja') ? kBestellenUnit : 0;

const totalPrice = basePrice + kennzeichenReservierung + kennzeichenBestellung;
// Range: €99.70 – €179.10
```

### مسار البيانات بعد Submit

```
RegistrationForm (client)
    │
    ├── 1. يضغط صور المستندات (compressImage)
    │
    ├── 2. يرفع كل ملف إلى API:
    │       POST /api/upload/documents
    │       ← يعيد { url, name, size }
    │
    ├── 3. يحفظ كل البيانات في sessionStorage:
    │       sessionStorage.setItem('serviceData', JSON.stringify({
    │         formType: 'autoanmeldung',
    │         productId: 'anmeldung',
    │         productPrice: totalPrice.toFixed(2),
    │         serviceLabel: selectedOption.label,
    │         service, ausweis, evbNummer,
    │         kennzeichenWahl, wunschkennzeichen, kennzeichenPin,
    │         kennzeichenBestellen, kontoinhaber, iban,
    │         uploadedFiles: {
    │           fahrzeugscheinVorne: { name, size, url },
    │           fahrzeugscheinHinten: { name, size, url },
    │           fahrzeugbriefVorne: { name, size, url }
    │         }
    │       }))
    │
    └── 4. يعيد التوجيه إلى: router.push('/rechnung')
```

---

## 7. Checkout Flow

### ماذا يحدث بعد آخر خطوة؟

```
Step 3 (Bankdaten + Upload) → Submit
    │
    ├── Compress images → Upload files → Save to sessionStorage
    │
    └── Redirect → /rechnung (Checkout Page)
```

### صفحة Checkout (`/rechnung`)

**نفس صفحة الـ Checkout المستخدمة في خدمة Abmelden** — الاختلاف فقط في:
- **اسم المنتج**: `"Fahrzeug online anmelden – {serviceLabel}"` (مثل "Anmelden" أو "Ummelden")
- **السعر**: يأتي من `sessionStorage.serviceData.productPrice`
- **الحقول نفسها**: phone, email, billing, payment method, AGB

### Payment Methods (نفس خدمة Abmelden):
| ID | Label | Fee |
|----|-------|-----|
| `paypal` | PayPal | €0.00 |
| `apple_pay` | Apple Pay | €0.00 |
| `credit_card` | Kredit-/Debitkarte | €0.50 |
| `klarna` | Klarna | €0.00 |
| `sepa` | SEPA Überweisung | €0.00 |

### After Payment (نفس Flow):
```
Success → /bestellung-erfolgreich?order={orderNumber}
Failure → /zahlung-fehlgeschlagen?order={orderNumber}&reason={reason}
```

---

## 8. Integration with Admin Panel

### موقع الخدمة في لوحة التحكم

| Admin Section | Path | Purpose |
|---------------|------|---------|
| **Products** | `/admin/products` | إدارة خدمة Anmeldung (اسم، سعر، خيارات) |
| **Orders** | `/admin/orders` | عرض طلبات التسجيل |
| **Order Detail** | `/admin/orders/{id}` | تفاصيل الطلب مع **عرض المستندات المرفوعة** |

### تخزين البيانات

**Product (في DB):**
```prisma
Product {
  name: "Fahrzeug online anmelden"
  slug: "auto-online-anmelden"
  price: 99.7  // أقل سعر (Wiederzulassung)
  serviceType: "anmeldung"
  formType: "anmeldung"
  options: '[
    {"key":"neuzulassung","label":"Anmelden","price":124.7},
    {"key":"ummeldung","label":"Ummelden","price":119.7},
    {"key":"wiederzulassung","label":"Wiederzulassen","price":99.7},
    {"key":"neuwagen","label":"Neuwagen Zulassung","price":99.7},
    {"key":"kennzeichen_reserviert","label":"Kennzeichen reserviert","price":24.7},
    {"key":"kennzeichen_bestellen","label":"Kennzeichen bestellen","price":29.7}
  ]'
  isActive: true
}
```

**Order (بعد الدفع):**
```prisma
Order {
  orderNumber: 2145
  status: "processing"
  total: 149.90
  subtotal: 149.40  // €119.70 + €29.70
  paymentFee: 0.50
  paymentMethod: "credit_card"
  productName: "Fahrzeug online anmelden – Ummelden"
  serviceData: '{
    "formType": "autoanmeldung",
    "productId": "anmeldung",
    "productPrice": "149.40",
    "serviceLabel": "Ummelden",
    "service": "ummeldung",
    "ausweis": "Personalausweis",
    "evbNummer": "ABC1234567",
    "kennzeichenWahl": "automatisch",
    "kennzeichenBestellen": "ja",
    "kontoinhaber": "Max Mustermann",
    "iban": "DE89370400440532013000",
    "uploadedFiles": {
      "fahrzeugscheinVorne": {"name":"IMG_001.jpeg","size":2048000,"url":"/uploads/documents/abc123.jpeg"},
      "fahrzeugscheinHinten": {"name":"IMG_002.jpeg","size":1900000,"url":"/uploads/documents/def456.jpeg"},
      "fahrzeugbriefVorne": {"name":"IMG_003.jpeg","size":2100000,"url":"/uploads/documents/ghi789.jpeg"}
    }
  }'
}
```

### عرض المستندات في Admin

في صفحة تفاصيل الطلب (`/admin/orders/{id}`):
- **Service Data Section**: يعرض كل الحقول (service, ausweis, evbNummer, etc.)
- **Uploaded Files**: روابط قابلة للتنزيل لكل مستند مرفوع
  - Fahrzeugschein Vorderseite → رابط تنزيل
  - Fahrzeugschein Rückseite → رابط تنزيل
  - Fahrzeugbrief Vorderseite → رابط تنزيل

### هل الفورم dynamic أم static؟
- **الفورم static** — الحقول مبرمجة في `RegistrationForm.tsx`
- **خيارات الخدمة dynamic** — تأتي من `Product.options` في DB
- **الأسعار dynamic** — كل سعر يأتي من DB
- **حقول الرفع static** — 3 حقول ثابتة مبرمجة

---

## 9. API Endpoints

### Service Page Data

| Method | Endpoint | Purpose |
|--------|----------|---------|
| Server-side | `getProductBySlug('auto-online-anmelden')` | جلب المنتج + الخيارات + الأسعار |
| Server-side | `getSiteSettings()` | إعدادات الموقع |

### Document Upload

| Method | Endpoint | Purpose | Request |
|--------|----------|---------|---------|
| `POST` | `/api/upload/documents` | رفع مستند واحد | `multipart/form-data` (field: `file`) |

**Response:**
```json
{
  "url": "/uploads/documents/abc123.jpeg",
  "name": "IMG_001.jpeg",
  "size": 2048000
}
```

### Checkout & Payment (نفس خدمة Abmelden)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/checkout/direct` | إنشاء الطلب + بدء الدفع |
| `GET` | `/api/payment/callback?orderId={id}` | Mollie callback |
| `GET` | `/api/payment/paypal/capture?orderId={id}` | PayPal capture |
| `POST` | `/api/payment/webhook` | Mollie webhook |
| `POST` | `/api/payment/paypal/webhook` | PayPal webhook |

### Admin

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/admin/orders` | قائمة الطلبات |
| `GET` | `/api/admin/orders/{id}` | تفاصيل طلب + serviceData + uploaded files |
| `PUT` | `/api/admin/orders/{id}` | تحديث حالة الطلب |
| `GET` | `/api/admin/products` | قائمة المنتجات |
| `PUT` | `/api/admin/products/{id}` | تحديث المنتج + الخيارات |

---

## 10. SEO

### Metadata (Generated Server-side)

| Property | Value |
|----------|-------|
| **Title** | `"Auto online anmelden – ab 99,70 €"` (dynamic min price) |
| **Description** | من `Product.metaDescription` أو auto-generated |
| **Canonical** | `https://onlineautoabmelden.com/product/auto-online-anmelden` |
| **Robots** | `index, follow` |
| **OG Image** | `Product.ogImage` أو `{siteUrl}/logo.webp` |
| **OG Type** | `website` |

---

## 11. Price Calculation Summary

```
Service Price (varies)    = €99.70 – €124.70
+ Kennzeichen reserviert  = €0.00 or €24.70
+ Kennzeichen bestellen   = €0.00 or €29.70
──────────────────────────────────────────
= Subtotal                = €99.70 – €179.10

+ Payment Fee (gateway)   = €0.00 – €0.50
──────────────────────────────────────────
= Total                   = €99.70 – €179.60

VAT (included, 19%)       = Total - (Total / 1.19)
```

---

## 12. Complete User Journey

```
1. مستخدم يزور /product/auto-online-anmelden
2. يرى الفورم مباشرة (بدون Hero)
3. Step 1: يختار نوع الخدمة (Anmelden/Ummelden/etc.) + نوع الهوية + يدخل eVB-Nummer
4. Step 2: يختار خيار اللوحة (تلقائي/محجوز) + هل يريد طلب لوحات جديدة
5. Step 3: يدخل بيانات البنك (IBAN + Kontoinhaber) + يرفع 3 مستندات:
   - Fahrzeugschein Vorderseite
   - Fahrzeugschein Rückseite
   - Fahrzeugbrief Vorderseite
6. يضغط "Weiter zur Kasse":
   a. يتم ضغط الصور (client-side)
   b. يتم رفع كل ملف إلى /api/upload/documents
   c. يتم حفظ كل البيانات + روابط الملفات في sessionStorage
7. ينتقل إلى /rechnung (Checkout)
8. يملأ بيانات الاتصال + يختار طريقة الدفع + يوافق على الشروط
9. يدفع عبر البوابة المختارة
10. بعد الدفع الناجح → /bestellung-erfolgreich
11. يستلم فاتورة بالإيميل
12. الطلب يظهر في Admin مع كل البيانات + روابط تنزيل المستندات
```

---

## 13. Key Differences: Abmelden vs. Anmelden

| Feature | Abmelden (Deregistration) | Anmelden (Registration) |
|---------|--------------------------|------------------------|
| **Steps** | 4 | 3 |
| **Form Component** | `ServiceForm.tsx` | `RegistrationForm.tsx` |
| **Base Price** | €19.70 (fixed) | €99.70–€124.70 (varies by service) |
| **Sub-services** | None | 4 types (Anmelden, Ummelden, Wiederzulassen, Neuwagen) |
| **File Uploads** | ❌ None | ✅ 3 required documents |
| **Upload Endpoint** | N/A | `POST /api/upload/documents` |
| **Bank Details** | ❌ Not needed | ✅ IBAN + Kontoinhaber required |
| **YouTube Videos** | ✅ 2 videos | ❌ None |
| **Helper Images** | ✅ In-form reference photos | ✅ Example images in modals |
| **Add-on Options** | 1 (Reservierung €4.70) | 2 (Reserviert €24.70, Bestellen €29.70) |
| **serviceData.formType** | `fahrzeugabmeldung` | `autoanmeldung` |
| **serviceData.productId** | `abmeldung` | `anmeldung` |
| **Product Name** | "Fahrzeug jetzt online abmelden" | "Fahrzeug online anmelden – {Service}" |
