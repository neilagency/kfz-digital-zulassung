# FAHRZEUGABMELDUNG — Full Technical, UX & Content Report

> **Purpose:** Pixel-perfect replication of the `https://onlineautoabmelden.com/product/fahrzeugabmeldung` service on another website.  
> **Generated:** 2026-04-13  
> **Source Codebase:** Next.js 14.2.21 / React 18 / Tailwind CSS / Prisma + Turso (libsql)

---

## Table of Contents

1. [User Flow Overview](#1-user-flow-overview)
2. [Product Page (`/product/fahrzeugabmeldung`)](#2-product-page)
3. [ServiceForm — 4-Step Wizard](#3-serviceform--4-step-wizard)
4. [License Plate Input Component](#4-license-plate-input-component)
5. [Checkout Page (`/rechnung`)](#5-checkout-page-rechnung)
6. [Payment Method Selector](#6-payment-method-selector)
7. [Order Summary & Coupon System](#7-order-summary--coupon-system)
8. [API: `/api/checkout/direct`](#8-api-checkout-direct)
9. [API: `/api/apply-coupon`](#9-api-apply-coupon)
10. [Payment Gateway Integrations](#10-payment-gateway-integrations)
11. [Post-Payment Pages](#11-post-payment-pages)
12. [Email System](#12-email-system)
13. [State Management & Data Flow](#13-state-management--data-flow)
14. [Theme, Typography & Design Tokens](#14-theme-typography--design-tokens)
15. [Image & Media Assets](#15-image--media-assets)
16. [Database Schema (Relevant Models)](#16-database-schema)
17. [Security & Rate Limiting](#17-security--rate-limiting)
18. [Responsiveness & Device Handling](#18-responsiveness--device-handling)
19. [SEO & Structured Data](#19-seo--structured-data)
20. [Edge Cases & Error Handling](#20-edge-cases--error-handling)

---

## 1. User Flow Overview

```
[User lands on /product/fahrzeugabmeldung]
         │
         ▼
┌─────────────────────────────┐
│ ServiceForm (4-step wizard) │
│  Step 1: Fahrzeugdaten      │
│  Step 2: Fahrzeugschein     │
│  Step 3: Kennzeichen-Codes  │
│  Step 4: Reservierung       │
└────────────┬────────────────┘
             │ Submit → sessionStorage.setItem('serviceData', JSON.stringify({...}))
             │ router.push('/rechnung')
             ▼
┌─────────────────────────────────┐
│ Checkout Page (/rechnung)       │
│  ├─ PaymentMethodSelector       │
│  │   (paypal|apple_pay|credit_  │
│  │    card|klarna|sepa)         │
│  ├─ OrderSummary + CouponInput  │
│  └─ AGB Checkbox + Submit       │
└────────────┬────────────────────┘
             │ POST /api/checkout/direct
             ▼
┌──────────────────────────────────────────┐
│ Server: Validate → Create Order →        │
│   Create Invoice → Route to Payment      │
│                                          │
│  ├─ PayPal → PayPal Approval URL         │
│  ├─ Mollie (CC/ApplePay) → Mollie URL    │
│  ├─ Klarna → Mollie Orders API URL       │
│  ├─ SEPA → Invoice page (no redirect)    │
│  └─ Free (100% coupon) → Invoice page    │
└────────────┬─────────────────────────────┘
             │ Redirect to payment provider
             ▼
┌──────────────────────────────────────────┐
│ Payment Provider (PayPal / Mollie)       │
│  → Success → /api/payment/callback       │
│  → Fail    → /zahlung-fehlgeschlagen     │
└────────────┬─────────────────────────────┘
             ▼
┌──────────────────────────────────────────┐
│ /bestellung-erfolgreich?order=XXXX       │
│   OR                                     │
│ /rechnung/RE-2026-XXXX?order=...&token=  │
└──────────────────────────────────────────┘
```

---

## 2. Product Page

**File:** `src/app/product/fahrzeugabmeldung/page.tsx` (527 lines)  
**Route:** `/product/fahrzeugabmeldung`  
**Type:** Server Component (async)

### 2.1 Data Fetching

```typescript
const product = await getProductBySlug('fahrzeugabmeldung');
// Returns: { id, name, slug, price, description, shortDescription, options, ... }

const settings = await getSiteSettings();
// Returns: { phone, phoneLink, whatsapp, email, siteName, ... }
```

### 2.2 Product Options Parsing

```typescript
const options = JSON.parse(product.options || '[]') as ProductOption[];
// Type: { id: string; name: string; type: string; choices?: { label: string; price_adjustment: number }[] }[]

const reservierungOption = options.find(o => o.id === 'reservierung');
const reservierungUnitPrice = reservierungOption?.choices
  ?.find(c => c.label === 'Ja, ich möchte reservieren')?.price_adjustment ?? 0;
// Default: 0 if no match
```

### 2.3 Price Derivation

- `basePrice` = `product.price` (from DB, currently **19.70 €**)
- `reservierungPrice` = dynamic from `product.options` JSON
- Total = `basePrice + (reservierung === 'einJahr' ? reservierungUnitPrice : 0)`

### 2.4 Conditional Rendering Flag

```typescript
const showFullContent = false; // Currently hardcoded — only renders ServiceForm
```

When `showFullContent = true`, the page renders these additional sections (all SEO copy):

1. **Hero Section** — gradient bg (`from-dark via-primary-900 to-dark`), h1, price badge, trust icons (Shield, Clock, CheckCircle)
2. **Step-by-Step Section** — 4 numbered steps with icons (FileText, Shield, CreditCard, CheckCircle)
3. **Cost Overview** — base price + optional reservation price table
4. **FAQ Accordion** — 6 questions/answers about the service
5. **Payment Methods Section** — icons grid (PayPal, Kreditkarte, SEPA, Apple Pay, Klarna)
6. **Contact Section** — Phone, WhatsApp, Email with icons
7. **CTA at bottom** — link to `#formular`

### 2.5 Current Rendering (showFullContent = false)

Only renders `<ServiceForm>`:

```tsx
<ServiceForm
  basePrice={basePrice}
  reservierungPrice={reservierungPrice}
  settingsPhone={settings.phone}
  settingsPhoneLink={settings.phoneLink}
  settingsWhatsApp={settings.whatsapp}
/>
```

### 2.6 JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Fahrzeugabmeldung Online",
  "description": "Schnell und sicher Ihr Fahrzeug abmelden.",
  "provider": {
    "@type": "Organization",
    "name": "Online Auto Abmelden",
    "url": "https://onlineautoabmelden.com"
  },
  "areaServed": { "@type": "Country", "name": "DE" },
  "offers": {
    "@type": "Offer",
    "price": "${basePrice}",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
}
```

### 2.7 SEO Metadata

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug('fahrzeugabmeldung');
  return {
    title: product?.seoTitle || product?.name || 'Fahrzeugabmeldung',
    description: product?.seoDescription || product?.shortDescription || '...',
    alternates: { canonical: 'https://onlineautoabmelden.com/product/fahrzeugabmeldung' },
    openGraph: {
      title: product?.seoTitle || product?.name || 'Fahrzeugabmeldung',
      description: product?.seoDescription || product?.shortDescription || '...',
      url: 'https://onlineautoabmelden.com/product/fahrzeugabmeldung',
      siteName: 'Online Auto Abmelden',
      type: 'website',
    },
  };
}
```

---

## 3. ServiceForm — 4-Step Wizard

**File:** `src/components/ServiceForm.tsx` (746 lines)  
**Type:** Client Component (`'use client'`)  
**Form Library:** `react-hook-form` + `@hookform/resolvers/zod`

### 3.1 Props Interface

```typescript
interface ServiceFormProps {
  basePrice: number;          // e.g. 19.70
  reservierungPrice: number;  // e.g. 5.00 or 0
  settingsPhone: string;
  settingsPhoneLink: string;
  settingsWhatsApp: string;
}
```

### 3.2 Zod Validation Schema

```typescript
const serviceFormSchema = z.object({
  fahrzeugTyp: z.string().min(1, 'Bitte wählen Sie einen Fahrzeugtyp aus'),
  kennzeichen: z.string().min(1, 'Bitte geben Sie Ihr Kennzeichen ein'),
  fin: z.string()
    .min(1, 'Bitte geben Sie die FIN ein')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, 'Die FIN muss genau 17 Zeichen lang sein (keine I, O, Q)'),
  sicherheitscode: z.string()
    .min(1, 'Bitte geben Sie den Sicherheitscode ein')
    .length(7, 'Der Sicherheitscode muss genau 7 Zeichen lang sein'),
  stadtKreis: z.string().min(1, 'Bitte geben Sie die Stadt / den Kreis ein'),
  codeVorne: z.string()
    .min(1, 'Bitte geben Sie den Code ein')
    .length(3, 'Der Code muss genau 3 Zeichen lang sein'),
  codeHinten: z.string()
    .min(1, 'Bitte geben Sie den Code ein')
    .length(3, 'Der Code muss genau 3 Zeichen lang sein'),
  reservierung: z.enum(['keine', 'einJahr']),
});
```

### 3.3 Step Structure

#### **Step 1: Fahrzeugdaten (Vehicle Data)**

| Field | Component | Validation | UX Details |
|-------|-----------|------------|------------|
| `fahrzeugTyp` | `<VehicleTypeSelector>` | required, min 1 char | 6 vehicle type cards in grid |
| `kennzeichen` | `<LicensePlateInput>` | required, min 1 char | German license plate UI with EU band, seals |
| `fin` | `<input type="text">` | required, 17 chars, regex `/^[A-HJ-NPR-Z0-9]{17}$/i` | Uppercase, monospace font (`font-mono`), auto-uppercased via CSS |

**Step 1 Content:**
- Title: "Schritt 1 – Fahrzeugdaten"
- Subtitle: "(Pflichtangaben)"
- FIN field label: "FIN (Fahrzeug-Identifizierungsnummer)"
- FIN placeholder: "z.B. WBA12345678901234"
- FIN helper text: "Die FIN finden Sie im Fahrzeugschein (Feld E) oder auf dem Typenschild."

#### **Step 2: Fahrzeugschein-Code (Vehicle Registration Code)**

| Field | Component | Validation | UX Details |
|-------|-----------|------------|------------|
| `sicherheitscode` | `<input type="text">` | required, exactly 7 chars | Case-sensitive, monospace, 7-char max |
| `stadtKreis` | `<input type="text">` | required, min 1 char | Text input |

**Step 2 Content:**
- Title: "Schritt 2 – Fahrzeugschein-Code"
- Subtitle: "(Sicherheitscode eingeben)"
- Sicherheitscode label: "Sicherheitscode (7 Zeichen)"
- Sicherheitscode placeholder: "z.B. AB12345"
- Helper text: "Den Sicherheitscode finden Sie oben rechts auf der Vorderseite Ihres Fahrzeugscheins (Zulassungsbescheinigung Teil I)."
- Stadt/Kreis label: "Zulassende Stadt / Kreis"
- Stadt/Kreis placeholder: "z.B. Essen"

**Visual Aids (Step 2):**
- Image showing Fahrzeugschein with code location highlighted
  - `FAHRZEUGSCHEIN_IMAGE = '/uploads/wp/2024/10/fahrzeugschein-code-location.jpg'` (approximate)
- YouTube video link for finding the Sicherheitscode

#### **Step 3: Kennzeichen-Codes (License Plate Sticker Codes)**

| Field | Component | Validation | UX Details |
|-------|-----------|------------|------------|
| `codeVorne` | `<input>` | required, exactly 3 chars | 3 char maxLength |
| `codeHinten` | `<input>` | required, exactly 3 chars | 3 char maxLength |

**Step 3 Content:**
- Title: "Schritt 3 – Kennzeichen-Codes"
- Subtitle: "(Plakettencodes)"
- codeVorne label: "Code vorne (3 Zeichen)" — the code from the front license plate sticker
- codeHinten label: "Code hinten (3 Zeichen)" — the code from the rear license plate sticker
- Helper text: "Den Code finden Sie unter der Plakette auf Ihrem Kennzeichen. Kratzen Sie vorsichtig die Plakette ab, um den 3-stelligen Code freizulegen."

**Visual Aids (Step 3):**
- Image: Plakette location hint image
  - `PLAKETTE_IMAGE` and `CODE_HINT_IMAGE` — from `/uploads/wp/2024/` directory
- YouTube video link for removing the Plakette

#### **Step 4: Reservierung (Reservation)**

| Field | Component | Validation | UX Details |
|-------|-----------|------------|------------|
| `reservierung` | Radio group | required, enum `['keine', 'einJahr']` | Two styled radio cards |

**Step 4 Content:**
- Title: "Schritt 4 – Kennzeichenreservierung"
- Subtitle: "(Optional)"

**Radio Options:**

1. **"Keine Reservierung"** (`keine`)
   - Label: "Nein, ich möchte nicht reservieren"
   - Price badge: "Kostenlos"
   - Description: "Das Kennzeichen wird nach der Abmeldung freigegeben."

2. **"Reservierung für 1 Jahr"** (`einJahr`)
   - Label: "Ja, ich möchte mein Kennzeichen für 1 Jahr reservieren"
   - Price badge: `+${reservierungPrice.toFixed(2).replace('.', ',')} €`
   - Description: "Das Kennzeichen bleibt für 12 Monate reserviert und kann bei einer Neuanmeldung wiederverwendet werden."

**Price Summary (shown at bottom of Step 4):**
```
Fahrzeugabmeldung:          {basePrice} €
Kennzeichenreservierung:    {reservierungPrice} € (only if einJahr)
─────────────────────────────────────────
Gesamtpreis:                {totalPrice} €
```

**Help contacts shown on Step 4:**
- Phone icon + phone number (clickable `tel:` link)
- WhatsApp icon + "WhatsApp Support" (clickable `wa.me` link)
- Email icon + "E-Mail schreiben" (clickable `mailto:` link)

### 3.4 Step Navigation Logic

```typescript
const stepFields: Record<number, (keyof FormData)[]> = {
  0: ['fahrzeugTyp', 'kennzeichen', 'fin'],
  1: ['sicherheitscode', 'stadtKreis'],
  2: ['codeVorne', 'codeHinten'],
  3: ['reservierung'],
};

// Next button triggers validation ONLY for current step fields
const isValid = await trigger(stepFields[currentStep]);
if (isValid) setCurrentStep(prev => prev + 1);
```

**Navigation rules:**
- "Weiter" (Next) button validates current step before advancing
- "Zurück" (Back) button goes to previous step (no validation)
- Step indicator shows all 4 steps with active/completed/pending states
- Step indicator uses numbered badges (1-4) with connecting lines
- Steps are NOT clickable (linear progression only)

### 3.5 Step 4 Guard

```typescript
const [step4Visited, setStep4Visited] = useState(false);
// Set to true when user reaches step 4
// Submit button disabled if !step4Visited (prevents skipping step 4)
```

### 3.6 Form Submit Handler

```typescript
const onSubmit = (data: FormData) => {
  const totalPrice = basePrice + (data.reservierung === 'einJahr' ? reservierungPrice : 0);

  const serviceData = {
    ...data,
    productSlug: 'fahrzeugabmeldung',
    productName: 'Fahrzeugabmeldung',
    productPrice: totalPrice,
    basePrice,
    reservierungPrice: data.reservierung === 'einJahr' ? reservierungPrice : 0,
    reservierung: data.reservierung,
  };

  sessionStorage.setItem('serviceData', JSON.stringify(serviceData));
  router.push('/rechnung');
};
```

### 3.7 Step Indicator UI

```
  ①───②───③───④
```

- Each step: numbered circle + label text below
- Active step: `bg-primary text-white` circle, bold label
- Completed step: `bg-accent text-white` circle with checkmark icon, green label
- Pending step: `bg-gray-200 text-gray-400` circle, gray label
- Connecting lines: `bg-accent` (completed) or `bg-gray-200` (pending)

### 3.8 Error Banner

```typescript
// FormErrorBanner shown when form has errors on submit attempt
<FormErrorBanner
  message="Bitte überprüfen Sie Ihre Eingaben."
  onDismiss={() => clearErrors()}
/>
```

**FormErrorBanner component** (`src/components/ui/FormErrorBanner.tsx`, 32 lines):
- Red background (`bg-red-50 border-red-200`)
- `AlertCircle` icon (lucide-react)
- Dismiss button (X icon)
- Animates in with slide-down

---

## 4. License Plate Input Component

**File:** `src/components/ui/LicensePlateInput.tsx` (877 lines)  
**Type:** Client Component

### 4.1 Visual Design

A **realistic German license plate** rendered in HTML/CSS/SVG:

```
┌──────────────────────────────────────────────────────┐
│ ┌──┐                                                 │
│ │EU│  [CITY CODE]  [HU][SEAL]  [LETTERS]  [NUMBERS]  │
│ │D │                                                 │
│ └──┘                                                 │
└──────────────────────────────────────────────────────┘
```

**Components:**
1. **EU Blue Band** — Left strip with blue background (`#003da5`), 12 golden stars in a circle (SVG `<polygon>` stars), "D" country code
2. **City Code Segment** — 1-3 uppercase letters (e.g., "BIE" for Bielefeld)
3. **Seals Area** — Two SVG seals:
   - **HU Sticker** — Blue circle with "HU" text, numbered around edge (clock-like)
   - **City Seal** — Silver/gray gradient circle with "BERLIN" + bear coat of arms + "BUNDESHAUPTSTADT"
4. **Letters Segment** — 1-2 uppercase letters
5. **Numbers Segment** — 1-4 digits

### 4.2 Input Behavior

```typescript
// City: max 3 chars, uppercase, only A-Z + ÄÖÜ
const handleCityChange = (e) => {
  const v = e.target.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, '').slice(0, 3);
  setCity(v);
  if (v.length === 3) lettersRef.current?.focus(); // Auto-advance
};

// Letters: max 2 chars, uppercase, only A-Z + ÄÖÜ
const handleLettersChange = (e) => {
  const v = e.target.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, '').slice(0, 2);
  setLetters(v);
  if (v.length === 2) numbersRef.current?.focus(); // Auto-advance
};

// Numbers: max 4 chars, digits only
const handleNumbersChange = (e) => {
  const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
  setNumbers(v);
};
```

**Auto-advance:** City → Letters → Numbers (when max length reached)  
**Backspace navigation:** Empty field + Backspace → focus previous field  
**Separator keys:** `-` or Space in city/letters → advance to next field

### 4.3 Output Format

```typescript
// Combined value: "CITY-LETTERS-NUMBERS"
// e.g., "BIE-NE-74"
emitChange(city, letters, numbers);
// Joins non-empty parts with '-': parts.filter(Boolean).join('-')
```

### 4.4 Visual Feedback

- **Focus state:** Green bottom border line (`#4CAF50`), light green segment bg
- **Arrow indicator:** Green downward-pointing arrow bounces above focused segment
- **Error state:** Red plate border (`#dc2626`)
- **Disabled state:** 45% opacity, no pointer events

### 4.5 Vehicle Type Variants

| Vehicle Type | Class | Height | Max Width | Font Size | Notes |
|---|---|---|---|---|---|
| auto (default) | — | 100px | 720px | 62px | Standard plate |
| motorrad | `.lp-vt-moto` | 80px | 520px | 44px | Narrower plate |
| leichtkraftrad | `.lp-vt-moto` | 80px | 520px | 44px | Same as motorrad |
| lkw | `.lp-vt-lkw` | 110px | 720px | 66px | Taller, thicker border |
| anhaenger | — | 100px | 720px | 62px | Same as auto |
| andere | — | 100px | 720px | 62px | Same as auto |

### 4.6 Vehicle Type Badge

When `vehicleType !== 'auto' && vehicleType !== 'andere'`:
```html
<div class="lp-vt-badge">Motorrad</div> <!-- or LKW, Anhänger, Leichtkraftrad -->
```
Style: pill badge, light blue bg, primary text

### 4.7 Responsive Breakpoints

| Breakpoint | Plate Height | EU Width | Font Size |
|---|---|---|---|
| Desktop (>900px) | 100px | 62px | 62px |
| Tablet (≤900px) | 88px | 52px | 50px |
| Mobile (≤640px) | 68px | 40px | 30px |

### 4.8 CSS Styling

All styles use **CSS-in-JS** (`<style jsx>`) within the component. Key design values:

```css
.lp-plate {
  border: 4px solid #111;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.lp-eu { background: #003da5; }
.lp-d { font-family: 'Arial Black'; font-weight: 900; color: #fff; }
.lp-inp { font-family: 'Arial Black'; font-weight: 900; font-size: 62px; color: #111; caret-color: #4CAF50; }
```

---

## 5. Checkout Page (`/rechnung`)

**File:** `src/app/rechnung/page.tsx` (166 lines)  
**Route:** `/rechnung`  
**Type:** Server Component

### 5.1 Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Hero: gradient bg (from-dark via-primary-900 to-dark)  │
│  Breadcrumb: Startseite > Fahrzeugabmeldung > Rechnung  │
│  Title: "Ihre Bestellung abschließen"                   │
│  Subtitle: "Bitte wählen Sie eine Zahlungsmethode..."   │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Trust Features Bar (4 items in grid):                  │
│  🔒 SSL-verschlüsselt     🛡️ DSGVO-konform             │
│  ✅ Offizielle Bearbeitung ⚡ Sofort-Prüfung            │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  <CheckoutForm paymentMethods={paymentMethods} />       │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Bottom support bar:                                    │
│  📞 Hilfe? Rufen Sie uns an: {phone}                    │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Data Fetching (Server)

```typescript
const paymentMethods = await getEnabledPaymentMethods();
// Returns: Array<{ id, label, description, fee, icon }>
// Source: PaymentGateway table filtered by isActive=true, ordered by sortOrder
```

---

## 6. Payment Method Selector

**File:** `src/components/checkout/PaymentMethodSelector.tsx` (425 lines)  
**Type:** Client Component

### 6.1 Available Payment Methods

| ID | Label | Brand Display | Fee | Description |
|---|---|---|---|---|
| `paypal` | PayPal | Colored text: "Pay" (blue `#253B80`) + "Pal" (cyan `#179BD7`) | 0.00 € | "Bezahlen Sie sicher mit Ihrem PayPal-Konto." |
| `apple_pay` | Apple Pay | Black text: Apple icon (SVG) + "Pay" | 0.00 € | "Schnell und sicher mit Apple Pay bezahlen." |
| `credit_card` | Kreditkarte | Card icons (Visa blue + MC red/orange circles) | 0.50 € | "Bezahlen Sie sicher mit Ihrer Kreditkarte." |
| `klarna` | Klarna | Pink badge `#FFB3C7` bg + Black text "Klarna." | 0.00 € | "Kaufen Sie jetzt und bezahlen Sie später." |
| `sepa` | SEPA Überweisung | Banknote icon (lucide) | 0.00 € | "Bezahlen Sie per Banküberweisung." |

### 6.2 Apple Pay Detection

```typescript
const [showApplePay, setShowApplePay] = useState(false);

useEffect(() => {
  if (typeof window !== 'undefined' && window.ApplePaySession) {
    try {
      if (ApplePaySession.canMakePayments()) {
        setShowApplePay(true);
      }
    } catch {}
  }
}, []);
// Apple Pay option only rendered when showApplePay === true
```

### 6.3 Payment Method Selection UI

Each method renders as a **radio card**:

```
┌─────────────────────────────────────────────┐
│  ○  [Brand Icon/Text]    [Label]    [Fee]   │
├─────────────────────────────────────────────┤
│  (Expanded when selected:)                  │
│  Description text                           │
│  ┌───────────────────────────────────┐      │
│  │  Contact/Address form fields       │      │
│  └───────────────────────────────────┘      │
└─────────────────────────────────────────────┘
```

**Selected state:**
- Border: `border-primary` (2px)
- Background: `bg-primary/5`
- Radio filled: primary color

**Unselected state:**
- Border: `border-gray-200`
- Background: `bg-white`

### 6.4 Expanded Form Fields

#### For Klarna (when selected):

| Field | Label | Required | Validation |
|---|---|---|---|
| `firstName` | Vorname | Yes | min 1 char |
| `lastName` | Nachname | Yes | min 1 char |
| `company` | Firma | No | — |
| `street` | Straße + Hausnummer | Yes | min 1 char |
| `postcode` | Postleitzahl | Yes | exactly 5 digits |
| `city` | Stadt | Yes | min 1 char |
| `phone` | Telefonnummer | Yes | regex `/^\+?[0-9\s\-()]{6,20}$/` |
| `email` | E-Mail-Adresse | Yes | valid email |

#### For All Other Methods (when selected):

| Field | Label | Required | Validation |
|---|---|---|---|
| `nameOrCompany` | Name oder Firma | No | — |
| `street` | Straße + Hausnummer | No | — |
| `phone` | Telefonnummer | Yes | regex `/^\+?[0-9\s\-()]{6,20}$/` |
| `email` | E-Mail-Adresse | Yes | valid email |

### 6.5 Brand Icon Implementations

**PayPal:**
```tsx
<span className="font-black text-lg tracking-tight italic">
  <span style={{ color: '#253B80' }}>Pay</span>
  <span style={{ color: '#179BD7' }}>Pal</span>
</span>
```

**Klarna:**
```tsx
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-black tracking-wide"
  style={{ background: '#FFB3C7', color: '#0A0B09' }}>
  Klarna.
</span>
```

**Apple Pay:**
```tsx
<span className="font-semibold text-black text-base tracking-tight">
  <svg ...><!-- Apple logo SVG --></svg> Pay
</span>
```

**Credit Card (Visa + Mastercard):**
```tsx
<div className="flex items-center gap-1">
  {/* Visa: Blue italic text */}
  <span className="text-xs font-black italic tracking-tight px-1 py-0.5 rounded border border-blue-200 bg-blue-50"
    style={{ color: '#1A1F71' }}>VISA</span>
  {/* Mastercard: Red + Orange overlapping circles */}
  <span className="inline-flex items-center">
    <svg viewBox="0 0 32 20" width="32">
      <circle cx="11" cy="10" r="7" fill="#EB001B" />
      <circle cx="21" cy="10" r="7" fill="#F79E1B" />
      <path ... fill="#FF5E00" /> <!-- overlap area -->
    </svg>
  </span>
</div>
```

**SEPA:**
```tsx
<Banknote className="w-5 h-5 text-primary" /> // lucide-react icon
```

---

## 7. Order Summary & Coupon System

**File:** `src/components/checkout/OrderSummary.tsx` (410 lines)  
**Type:** Client Component

### 7.1 Layout

```
┌───────────────────────────────────┐
│ Bestellübersicht                  │
├───────────────────────────────────┤
│ Fahrzeugabmeldung      19,70 €   │
│                                   │
│ Zwischensumme          19,70 €   │
│ Zahlungsgebühr         +0,50 €   │  ← only if credit_card
│ Gutschein: TEST10     −1,97 €    │  ← only if coupon applied
│ ─────────────────────────────     │
│ Gesamtsumme            18,23 €   │
├───────────────────────────────────┤
│ Gutscheincode:                   │
│ ┌──────────────┐ ┌──────────┐   │
│ │ Code eingeben │ │ Einlösen │   │
│ └──────────────┘ └──────────┘   │
│ ✅ "TEST10" angewendet (-10%)    │  ← success state
├───────────────────────────────────┤
│ ☑ Ich stimme den AGB und         │
│   Datenschutzhinweisen zu.        │
│   (Links: /allgemeine-            │
│    geschaeftsbedingungen,         │
│    /datenschutzhinweise)          │
├───────────────────────────────────┤
│ ┌───────────────────────────────┐│
│ │  [Payment-specific submit btn]││
│ └───────────────────────────────┘│
├───────────────────────────────────┤
│ 🔒 SSL-verschlüsselt             │
│ 🛡️ DSGVO-konform                 │
│ 💳 Sicher bezahlen               │
└───────────────────────────────────┘
```

### 7.2 Price Calculation

```typescript
const subtotal = productPrice;
const fee = paymentMethod === 'credit_card' ? 0.50 : 0;
const discount = appliedCoupon?.discountAmount ?? 0;
const total = Math.max(subtotal - discount + fee, 0);
```

### 7.3 Coupon Input Component

```typescript
// Input field + "Einlösen" button
// On click:
const applyCoupon = async () => {
  const response = await fetch('/api/apply-coupon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: couponCode,
      email: email,           // from parent form
      productSlug: 'fahrzeugabmeldung',
      subtotal: productPrice,
    }),
  });
  // On success: stores in sessionStorage + updates appliedCoupon state
  sessionStorage.setItem('appliedCoupon', JSON.stringify(result));
};
```

**Coupon states:**
- **Default:** Input + "Einlösen" button
- **Loading:** Spinner + disabled input
- **Success:** Green text "✅ '{code}' angewendet (-{value}%)" + "Entfernen" link
- **Error:** Red text with error message from API

### 7.4 Submit Button Variants

| Payment Method | Button Style | Text |
|---|---|---|
| `paypal` | Yellow bg (`#FFC439`), black text | "Mit PayPal bezahlen" |
| `apple_pay` | Black bg, white text | Apple logo + "Pay" |
| `sepa` | Green gradient (`from-accent-600 to-accent-700`), white text | "Per Überweisung bezahlen" |
| `klarna` | Pink bg (`#FFB3C7`), black text | "Mit Klarna bezahlen" |
| Default (CC) | Green gradient (`from-accent-600 to-accent-700`), white text | "Jetzt bezahlen" |

### 7.5 Trust Badges

Three badges below the submit button:

```
🔒 SSL-verschlüsselt   🛡️ DSGVO-konform   💳 Sicher bezahlen
```

Icons: `Lock`, `Shield`, `CreditCard` (lucide-react)  
Style: Small text, gray, horizontal flex

### 7.6 Sticky Positioning

The OrderSummary column uses `lg:sticky lg:top-8` for desktop to keep it visible during scroll.

---

## 8. API: `/api/checkout/direct`

**File:** `src/app/api/checkout/direct/route.ts` (623 lines)  
**Method:** POST  
**Type:** Route Handler (force-dynamic)

### 8.1 Rate Limiting

```typescript
const RATE_LIMIT_CONFIG = { maxRequests: 8, windowMs: 60_000 }; // 8 per minute per IP
```

### 8.2 Request Validation (Zod)

Server-side schema (`src/lib/validations.ts`):

```typescript
const checkoutDirectSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  street: z.string().optional(),
  postcode: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().min(1).regex(/^\+?[0-9\s\-()]{6,20}$/),
  email: z.string().email(),
  paymentMethod: z.string().min(1),
  productId: z.string().optional(),
  productPrice: z.number().optional(),
  serviceData: z.any().optional(),
  couponCode: z.string().optional(),
});
```

### 8.3 Server-Side Price Resolution

```typescript
// NEVER trust client-sent price
const product = await prisma.product.findFirst({ where: { slug: productSlug, isActive: true } });
let productPrice = product.price; // e.g., 19.70

// Apply reservation if applicable
if (serviceData.reservierung === 'einJahr') {
  const options = JSON.parse(product.options || '[]');
  const reservierungOption = options.find(o => o.id === 'reservierung');
  const addon = reservierungOption?.choices?.find(c => c.label.includes('reservieren'))?.price_adjustment ?? 0;
  productPrice += addon;
}
```

### 8.4 Payment Fee Resolution

```typescript
const gateway = await prisma.paymentGateway.findFirst({
  where: { id: dbGatewayId, isActive: true }
});
const paymentFee = gateway?.fee ?? 0;
// credit_card fee = 0.50 €, others = 0.00 €
```

### 8.5 Coupon Validation (Server-Side)

Complete re-validation at checkout (mirrors `/api/apply-coupon` logic):

1. Find coupon by code (case-insensitive via `.toUpperCase()`)
2. Check `isActive`
3. Check date range (`startDate` ≤ now ≤ `endDate`)
4. Check total usage limit (`usageCount < maxUsageTotal`)
5. Check per-user limit (`CouponUsage.count(email) < maxUsagePerUser`)
6. Check product restriction (`productSlugs` includes slug)
7. Check minimum order value (`subtotal ≥ minOrderValue`)
8. Calculate: percentage → `(subtotal × value / 100)`, fixed → `value`
9. Cap: `discount = min(discount, subtotal)`

### 8.6 Order Creation

```typescript
// Unique order number with retry (up to 5 attempts)
let nextOrderNum: string;
for (let attempt = 0; attempt < 5; attempt++) {
  const lastOrder = await prisma.order.findFirst({ orderBy: { createdAt: 'desc' } });
  nextOrderNum = String(Number(lastOrder?.orderNumber || '2100') + 1);
  try {
    localOrder = await prisma.order.create({
      data: {
        orderNumber: nextOrderNum,
        status: 'pending',
        total: parseFloat(totalFormatted),
        subtotal: productPrice,
        paymentFee,
        discountAmount,
        couponCode: body.couponCode?.toUpperCase(),
        paymentMethod: body.paymentMethod,
        billingFirstName: body.firstName,
        billingLastName: body.lastName,
        billingCompany: body.company,
        billingStreet: body.street,
        billingPostcode: body.postcode,
        billingCity: body.city,
        billingPhone: body.phone,
        billingEmail: body.email,
        customerId: customer.id,
        serviceData: JSON.stringify(serviceData),
        ipAddress: ip,
      },
    });
    break; // success
  } catch (e) {
    if (attempt === 4) throw e; // final attempt failed
    // Retry on unique constraint violation
  }
}
```

### 8.7 Invoice Creation

```typescript
// Invoice number pattern: RE-YYYY-NNNN
let currentInvNumber: string;
for (let invAttempt = 0; invAttempt < 5; invAttempt++) {
  const lastInv = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: `RE-${year}-` } },
    orderBy: { createdAt: 'desc' },
  });
  const lastNum = lastInv ? parseInt(lastInv.invoiceNumber.split('-')[2]) : 0;
  currentInvNumber = `RE-${year}-${String(lastNum + 1).padStart(4, '0')}`;
  // e.g., "RE-2026-0142"
  
  await prisma.invoice.create({
    data: {
      invoiceNumber: currentInvNumber,
      orderId: localOrder.id,
      total: parseFloat(totalFormatted),
      subtotal: productPrice,
      taxAmount: 0,
      status: 'unpaid',
    },
  });
}
```

### 8.8 Customer Upsert

```typescript
const customer = await prisma.customer.upsert({
  where: { email: body.email.toLowerCase() },
  update: {
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
  },
  create: {
    email: body.email.toLowerCase(),
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
  },
});
```

### 8.9 Payment Routing

```
                    ┌─── Free (100% coupon): mark paid → send email → return invoiceUrl
                    │
body.paymentMethod ─┤─── SEPA: mark on-hold → send email → return invoiceUrl
                    │
                    ├─── PayPal: createPayPalOrder() → return approvalUrl
                    │
                    └─── Mollie (CC/ApplePay/Klarna):
                         ├── Klarna: createMollieOrder() (Orders API with line items + billing)
                         └── Others: createMolliePayment() (Payments API)
                         → return checkoutUrl
```

### 8.10 Response Format

**Success:**
```json
{
  "success": true,
  "orderId": "clxx...",
  "orderNumber": "2145",
  "total": "19.70",
  "paymentUrl": "https://www.mollie.com/checkout/...",
  "invoiceNumber": "RE-2026-0142",
  "invoiceUrl": "/rechnung/RE-2026-0142?order=2145&token=abc123..."  // only for SEPA/free
}
```

**Error responses:**

| Status | Error |
|---|---|
| 429 | `Zu viele Anfragen. Bitte warten Sie eine Minute.` |
| 400 | `Bitte wählen Sie eine Zahlungsmethode.` |
| 400 | `Produkt nicht gefunden.` |
| 400 | Various coupon errors (see §8.5) |
| 400 | `Zahlungsmethode nicht verfügbar.` |
| 502 | `PayPal-Fehler: {message}` |
| 502 | `Zahlungsdienstleister-Fehler: {message}` |
| 500 | `Ein unerwarteter Fehler ist aufgetreten.` |

---

## 9. API: `/api/apply-coupon`

**File:** `src/app/api/apply-coupon/route.ts` (112 lines)  
**Method:** POST  
**Rate Limit:** 10 requests/minute per IP (keyed as `{ip}:coupon`)

### 9.1 Request Body

```json
{
  "code": "TEST10",
  "email": "user@example.com",
  "productSlug": "fahrzeugabmeldung",
  "subtotal": 19.70
}
```

### 9.2 Validation Chain

1. Rate limit check
2. Code trimmed + uppercased
3. Coupon lookup (`prisma.coupon.findUnique({ where: { code } })`)
4. Active check
5. Date range check (startDate, endDate)
6. Total usage limit check
7. Per-user usage limit check (by email, via CouponUsage table)
8. Product restriction check (comma-separated `productSlugs`)
9. Minimum order value check

### 9.3 Discount Calculation

```typescript
if (coupon.discountType === 'percentage') {
  discountAmount = Math.round((subtotal * coupon.discountValue / 100) * 100) / 100;
} else { // 'fixed'
  discountAmount = coupon.discountValue;
}
discountAmount = Math.min(discountAmount, subtotal); // cap at subtotal
```

### 9.4 Success Response

```json
{
  "valid": true,
  "code": "TEST10",
  "discountType": "percentage",
  "discountValue": 10,
  "discountAmount": 1.97,
  "description": "10% off for testing"
}
```

### 9.5 Error Messages (German)

| Condition | Error |
|---|---|
| Missing code | `Bitte geben Sie einen Gutscheincode ein.` |
| Not found | `Ungültiger Gutscheincode.` |
| Inactive | `Dieser Gutschein ist nicht mehr aktiv.` |
| Too early | `Dieser Gutschein ist noch nicht gültig.` |
| Expired | `Dieser Gutschein ist abgelaufen.` |
| Usage limit | `Dieser Gutschein wurde bereits zu oft verwendet.` |
| Per-user used | `Sie haben diesen Gutschein bereits verwendet.` |
| Wrong product | `Dieser Gutschein gilt nicht für dieses Produkt.` |
| Min order | `Mindestbestellwert: X,XX €` |

---

## 10. Payment Gateway Integrations

### 10.1 Mollie (Credit Card, Apple Pay, Klarna)

**File:** `src/lib/payments.ts` (542 lines)

**Configuration:**
```
MOLLIE_API_KEY = process.env.MOLLIE_API_KEY
SITE_URL = process.env.SITE_URL || 'https://onlineautoabmelden.com'
Currency: EUR
Locale: de_DE
```

**Redirect/Webhook URLs:**
```
Redirect: ${SITE_URL}/api/payment/callback?orderId=${orderId}
Webhook:  ${SITE_URL}/api/payment/webhook
```

**Payment Method Mapping:**
```
paypal      → PaymentMethod.paypal
credit_card → PaymentMethod.creditcard
apple_pay   → PaymentMethod.applepay
sepa        → PaymentMethod.banktransfer
klarna      → PaymentMethod.klarna
```

**Klarna (Orders API):**
- Uses `createMollieOrder()` — requires full billing address
- Line items include: product + payment fee + discount (as negative line)
- VAT: 19% calculations included
- Returns Mollie checkout URL

**Standard Payments (CC, Apple Pay):**
- Uses `createMolliePayment()` — simpler API
- Optional billing address
- Returns Mollie checkout URL

**Fallback:** If method not enabled in Mollie profile → retry without method (Mollie shows all available methods)

### 10.2 PayPal (Direct REST API v2)

**File:** `src/lib/paypal.ts` (403 lines)

**Configuration:**
```
PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
PAYPAL_MODE = process.env.PAYPAL_MODE || 'live'
Sandbox URL: https://api-m.sandbox.paypal.com
Live URL: https://api-m.paypal.com
```

**OAuth:** Client credentials grant, token cached with 60s safety margin

**Order structure:**
```json
{
  "intent": "CAPTURE",
  "purchase_units": [{
    "reference_id": "{orderId}",
    "description": "Bestellung #{orderNumber} – {productName}",
    "amount": { "currency_code": "EUR", "value": "{total}" },
    "custom_id": "{orderId}",
    "invoice_id": "ORD-{orderNumber}"
  }],
  "payment_source": {
    "paypal": {
      "experience_context": {
        "brand_name": "Online Auto Abmelden",
        "locale": "de-DE",
        "landing_page": "LOGIN",
        "user_action": "PAY_NOW",
        "return_url": "{SITE_URL}/api/payment/paypal/capture?orderId={orderId}",
        "cancel_url": "{SITE_URL}/rechnung?error=payment-cancelled&order={orderNumber}"
      }
    }
  }
}
```

### 10.3 SEPA Bank Transfer

No external API — creates invoice and shows bank details page:

**Bank Details (Hardcoded):**
```
Account Holder: ikfz Digital-Zulassung UG (haftungsbeschränkt)
IBAN: DE70 3002 0900 5320 8804 65
BIC/SWIFT: CMCIDEDD
Bank: Targobank
```

**Transfer Reference:** `{orderNumber} - {billingLastName}`

### 10.4 Gateway ID Mapping (DB ↔ Checkout)

```typescript
GATEWAY_ID_MAP = {
  mollie_creditcard → 'credit_card',
  mollie_applepay   → 'apple_pay',
  mollie_klarna     → 'klarna',
  paypal            → 'paypal',
  sepa              → 'sepa',
};
```

---

## 11. Post-Payment Pages

### 11.1 Order Success Page

**File:** `src/app/bestellung-erfolgreich/page.tsx` (128 lines)  
**Route:** `/bestellung-erfolgreich?order=XXXX&status=pending|completed`  
**SEO:** `robots: { index: false, follow: false }`

**Content sections:**

1. **Hero** — gradient bg, checkmark icon (or clock for pending)
   - Title: "Bestellung erfolgreich!" / "Bestellung wird bearbeitet"
   - Order number displayed
   
2. **"Wie geht es weiter?"** card:
   1. Bestätigungs-E-Mail
   2. Schnellstmöglich Bearbeitung
   3. Offizielle Bestätigung per E-Mail/WhatsApp

3. **Contact card** — WhatsApp, Phone, Email buttons

4. **Account CTA** — "Konto erstellen?" → `/anmelden`

5. **Back to home** button → `/`

### 11.2 Payment Failed Page

**File:** `src/app/zahlung-fehlgeschlagen/page.tsx` (126 lines)  
**Route:** `/zahlung-fehlgeschlagen?order=XXXX&reason=...&error=...`  
**SEO:** `robots: { index: false, follow: false }`

**Failure messages (German):**

| Key | Message |
|---|---|
| `insufficient_funds` | Ihre Karte hat nicht genügend Guthaben... |
| `card_declined` | Ihre Karte wurde abgelehnt... |
| `card_expired` | Ihre Karte ist abgelaufen... |
| `authentication_failed` | Die 3D-Secure-Authentifizierung ist fehlgeschlagen... |
| `canceled` | Die Zahlung wurde abgebrochen. |
| `expired` | Die Zahlungssitzung ist abgelaufen... |
| `failed` | Die Zahlung konnte nicht verarbeitet werden. |
| `server-error` | Ein technischer Fehler ist aufgetreten... |

**Content sections:**

1. **Hero** — red gradient, X icon, error message, order number
2. **"Was können Sie tun?"** — 3 suggestions (other method, online payments enabled, contact bank)
3. **Contact card** — WhatsApp, Phone, Email
4. **Retry button** → `/product/fahrzeugabmeldung`

### 11.3 SEPA Invoice Page

**File:** `src/app/rechnung/[invoiceNumber]/page.tsx` (~380 lines)  
**Route:** `/rechnung/RE-2026-XXXX?order=XXXX&token=XXXX`  
**Cache:** `revalidate = 60` seconds  
**SEO:** `robots: { index: false, follow: false }`

**Security:** Token verified via `verifyInvoiceToken(invoiceNumber, token)` — HMAC-SHA256 (16 hex chars)

**Content sections:**

1. **Hero** — Invoice number + amount
2. **Bank Transfer Card** — IBAN, BIC, Bank, Account Holder, Verwendungszweck
3. **Amount display** — Large primary-colored total with VAT note
4. **Important Notice** — Amber box: must include Verwendungszweck
5. **Invoice Details Table** — Line items, subtotal, VAT (19%), total
6. **Next Steps** — 3-step process
7. **Print Button** — Downloads PDF invoice
8. **Support contacts**

---

## 12. Email System

### 12.1 SMTP Configuration

```
Host: smtp.titan.email
Port: 465 (TLS)
User: info@onlineautoabmelden.com
Password: from SMTP_PASS or SMTP_PASS_B64 (base64-decoded)
From: "Online Auto Abmelden" <info@onlineautoabmelden.com>
TLS: { rejectUnauthorized: false }
Library: nodemailer
Retries: 3 attempts with exponential backoff (2s × attempt)
```

### 12.2 Email Types

| Email Type | Trigger | File |
|---|---|---|
| **Invoice Email** | SEPA order or 100% coupon | Sent during checkout |
| **Document Email** | Admin uploads PDF for order | `src/lib/document-email.ts` (155 lines) |
| **Completion Email** | Admin marks order as "completed" | `src/lib/completion-email.ts` (230 lines) |
| **Order Message** | Admin sends custom message | `src/lib/order-message-email.ts` (160 lines) |
| **Campaign Email** | Marketing campaigns | `src/lib/campaign-email.ts` (280 lines) |

### 12.3 Completion Email Content (Relevant to Abmeldung)

- Green success box: "✅ Abmeldung erfolgreich!"
- Note: Insurers & customs notified automatically
- Upsell: Links to re-registration + car sale services
- Attachment: Deregistration confirmation document
- Review request: Google review link (`https://g.page/r/Cd3tHbWRE-frEAE/review`)

---

## 13. State Management & Data Flow

### 13.1 Inter-Page State: sessionStorage

**Key: `serviceData`**
```json
{
  "fahrzeugTyp": "auto",
  "kennzeichen": "BIE-NE-74",
  "fin": "WBA12345678901234",
  "sicherheitscode": "AB12345",
  "stadtKreis": "Essen",
  "codeVorne": "123",
  "codeHinten": "456",
  "reservierung": "einJahr",
  "productSlug": "fahrzeugabmeldung",
  "productName": "Fahrzeugabmeldung",
  "productPrice": 24.70,
  "basePrice": 19.70,
  "reservierungPrice": 5.00
}
```

**Key: `appliedCoupon`**
```json
{
  "code": "TEST10",
  "discountType": "percentage",
  "discountValue": 10,
  "discountAmount": 1.97,
  "description": "10% off"
}
```

### 13.2 Data Flow Diagram

```
ServiceForm
  │
  ├── sessionStorage.setItem('serviceData', {...})
  │
  └── router.push('/rechnung')
        │
        ▼
CheckoutForm
  │
  ├── sessionStorage.getItem('serviceData')    → productPrice, productSlug, serviceData
  ├── sessionStorage.getItem('appliedCoupon')   → discountAmount
  │
  ├── CouponInput → POST /api/apply-coupon
  │   └── sessionStorage.setItem('appliedCoupon', {...})
  │
  └── Submit → POST /api/checkout/direct
        body: {
          firstName, lastName, company, street, postcode, city,
          phone, email, paymentMethod,
          productId: product.id,
          productPrice: total,
          serviceData: { ...full service data... },
          couponCode: appliedCoupon?.code,
        }
```

### 13.3 Server-Side Caching

```typescript
// 5-minute cache for gateway + product data in checkout API
const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedGateways: PaymentGateway[] | null = null;
let cachedProduct: Product | null = null;
let lastFetchTime = 0;
```

---

## 14. Theme, Typography & Design Tokens

### 14.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` (DEFAULT) | `#0D5581` | Brand blue — buttons, links, headings |
| `primary-50` | `#E8F0F3` | Light blue backgrounds |
| `primary-900` | `#05273D` | Hero gradient end |
| `accent` (DEFAULT) | `#8BC34A` | Green — CTAs, success states, completed steps |
| `accent-600` | `#7BB33E` | Submit button gradient start |
| `accent-700` | `#6BA332` | Submit button gradient end |
| `dark` (DEFAULT) | `#0A1628` | Very dark navy — hero backgrounds |

### 14.2 Typography

```
Font Family: ['Inter', 'Arial', 'Helvetica', 'sans-serif']
License Plate Font: 'Arial Black', Arial, sans-serif (font-weight: 900)
FIN Field: font-mono (monospace)
Sicherheitscode Field: font-mono (monospace)
```

### 14.3 Common Gradients

```css
/* Hero gradient */
bg-gradient-to-br from-dark via-primary-900 to-dark

/* Button gradient (green CTAs) */
bg-gradient-to-r from-accent-600 to-accent-700

/* Error hero gradient */
bg-gradient-to-br from-dark via-red-900/30 to-dark
```

### 14.4 Animations

```
fade-in, fade-in-up, slide-in-left, slide-in-right, scale-in
float: 6s ease-in-out infinite (for decorative elements)
lp-bounce: 1s ease-in-out infinite (license plate arrow)
lp-line: 0.2s ease-out (focus underline)
```

### 14.5 Border Radius Scale

```
Cards: rounded-2xl (1rem)
Buttons: rounded-xl (0.75rem)
Inputs: rounded-lg (0.5rem)
Badges/Pills: rounded-full
```

---

## 15. Image & Media Assets

### 15.1 Service Form Images

| Constant | Path | Usage |
|---|---|---|
| `FAHRZEUGSCHEIN_IMAGE` | `/uploads/wp/2024/10/fahrzeugschein-...` | Step 2: Shows where to find Sicherheitscode |
| `PLAKETTE_IMAGE` | `/uploads/wp/2024/10/...` | Step 3: Shows Plakette on license plate |
| `CODE_HINT_IMAGE` | `/uploads/wp/2024/10/...` | Step 3: Shows code under Plakette |

### 15.2 Service Form Videos

YouTube embedded links for:
1. How to find the Sicherheitscode on Fahrzeugschein
2. How to remove the Plakette to reveal the code

### 15.3 Public Image Directories

**`/public/images/`:**
- Document examples (Fahrzeugschein, Personalausweis, Reisepass, Aufenthaltstitel, Meldebescheinigung)
- Example images for both front and back sides

**`/public/uploads/wp/2024/01/`:**
- Logo variations
- Promotional graphics
- Icon SVGs/PNGs

**`/public/uploads/wp/2024/10/`:**
- Vehicle document examples with annotations
- TÜV inspection report
- Product thumbnails (300×300px)

### 15.4 Payment Icons

No dedicated `/public/images/payment/` directory. All payment brand visuals are **inline SVG/CSS** in `PaymentMethodSelector.tsx` (§6.5).

---

## 16. Database Schema (Relevant Models)

### 16.1 Product

```prisma
model Product {
  id               String   @id @default(cuid())
  name             String
  slug             String   @unique
  price            Float
  description      String?
  shortDescription String?
  options          String?    // JSON array of ProductOption
  seoTitle         String?
  seoDescription   String?
  isActive         Boolean  @default(true)
  // ...
}
```

### 16.2 Order

```prisma
model Order {
  id                  String   @id @default(cuid())
  orderNumber         String   @unique
  status              String   @default("pending")  // pending | on-hold | processing | completed | cancelled | refunded
  total               Float
  subtotal            Float
  paymentFee          Float    @default(0)
  discountAmount      Float    @default(0)
  couponCode          String?
  paymentMethod       String
  billingFirstName    String?
  billingLastName     String?
  billingCompany      String?
  billingStreet       String?
  billingPostcode     String?
  billingCity         String?
  billingPhone        String
  billingEmail        String
  customerId          String?
  serviceData         String?   // JSON stringified service form data
  ipAddress           String?
  completionEmailSent Boolean  @default(false)
  dateCompleted       DateTime?
  // ...
}
```

### 16.3 Invoice

```prisma
model Invoice {
  id            String   @id @default(cuid())
  invoiceNumber String   @unique   // RE-YYYY-NNNN
  orderId       String
  total         Float
  subtotal      Float
  taxAmount     Float    @default(0)
  status        String   @default("unpaid")
  // ...
}
```

### 16.4 Customer

```prisma
model Customer {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String?
  lastName  String?
  phone     String?
  // ...
}
```

### 16.5 Coupon & CouponUsage

```prisma
model Coupon {
  id              String   @id @default(cuid())
  code            String   @unique
  discountType    String   // 'percentage' | 'fixed'
  discountValue   Float
  description     String?
  isActive        Boolean  @default(true)
  startDate       DateTime?
  endDate         DateTime?
  maxUsageTotal   Int      @default(0)  // 0 = unlimited
  maxUsagePerUser Int      @default(0)  // 0 = unlimited
  usageCount      Int      @default(0)
  minOrderValue   Float    @default(0)
  productSlugs    String?  // comma-separated
  // ...
}

model CouponUsage {
  id       String @id @default(cuid())
  couponId String
  email    String
  // ...
}
```

### 16.6 Payment

```prisma
model Payment {
  id            String   @id @default(cuid())
  orderId       String
  amount        Float
  method        String
  status        String   @default("pending")
  transactionId String?   // Mollie payment ID or PayPal order ID
  providerData  String?   // JSON with provider-specific data
  // ...
}
```

### 16.7 PaymentGateway

```prisma
model PaymentGateway {
  id          String  @id
  title       String
  description String?
  fee         Float   @default(0)
  isActive    Boolean @default(true)
  sortOrder   Int     @default(0)
  settings    String? // JSON configuration
  // ...
}
```

---

## 17. Security & Rate Limiting

### 17.1 Rate Limits

| Endpoint | Limit | Key |
|---|---|---|
| `/api/checkout/direct` | 8 req/min | IP address |
| `/api/apply-coupon` | 10 req/min | `{IP}:coupon` |

### 17.2 Rate Limit Implementation

```typescript
// In-memory sliding window (per-instance)
// Stale entries cleaned every 5 minutes
// Returns: { success, remaining, limit, reset }
rateLimit(identifier: string, { maxRequests, windowMs })

// IP extraction
getClientIP(request): checks x-forwarded-for, x-real-ip headers
```

### 17.3 Invoice Token Security

```typescript
// HMAC-SHA256, truncated to 16 hex chars
SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback-secret'
generateInvoiceToken(invoiceNumber) → 16-char hex
verifyInvoiceToken(invoiceNumber, token) → boolean (constant-time comparison)
```

### 17.4 Price Integrity

- Client-sent `productPrice` is **NEVER trusted**
- Server fetches `product.price` from DB
- Reservation addon recalculated from `product.options` JSON
- Coupon discount recalculated server-side
- Payment fee fetched from `PaymentGateway` table

### 17.5 Input Validation

- Server-side Zod schema validation on all API endpoints
- Phone regex: `/^\+?[0-9\s\-()]{6,20}$/`
- FIN regex: `/^[A-HJ-NPR-Z0-9]{17}$/i` (excludes I, O, Q)
- Email: Zod `.email()` validation
- Postcode: exactly 5 digits (Klarna)
- All strings trimmed

---

## 18. Responsiveness & Device Handling

### 18.1 Breakpoints (Tailwind defaults)

| Token | Width | Context |
|---|---|---|
| `sm` | ≥640px | — |
| `md` | ≥768px | — |
| `lg` | ≥1024px | Checkout 5-col grid splits |
| `xl` | ≥1280px | — |

### 18.2 Checkout Layout

```
Mobile (<lg):     Single column — PaymentMethodSelector stacked above OrderSummary
Desktop (≥lg):    5-column grid — 3 cols PaymentMethodSelector, 2 cols OrderSummary (sticky)
```

### 18.3 License Plate Responsive (Custom breakpoints)

| Viewport | Height | Font | EU Band Width |
|---|---|---|---|
| Desktop (>900px) | 100px | 62px | 62px |
| Tablet (≤900px) | 88px | 50px | 52px |
| Mobile (≤640px) | 68px | 30px | 40px |

### 18.4 Vehicle Type Selector Grid

```
Mobile:  3 columns
Desktop: 6 columns (all types in one row)
```

### 18.5 Step Indicator

```
Mobile:  Numbers collapse, labels hidden below sm
Desktop: Full labels shown below each step number
```

---

## 19. SEO & Structured Data

### 19.1 Page-Level SEO

| Page | Title | Indexed |
|---|---|---|
| `/product/fahrzeugabmeldung` | From DB `seoTitle` or "Fahrzeugabmeldung" | Yes |
| `/rechnung` | "Rechnung" (checkout) | No (`noindex, nofollow`) |
| `/bestellung-erfolgreich` | "Bestellung erfolgreich" | No |
| `/zahlung-fehlgeschlagen` | "Zahlung fehlgeschlagen" | No |
| `/rechnung/[invoiceNumber]` | Dynamic invoice title | No |

### 19.2 JSON-LD Schema

Product page includes `Service` schema with:
- Provider: Organization "Online Auto Abmelden"
- Area served: Country "DE"
- Price: from DB `product.price`
- Currency: EUR
- Availability: InStock

### 19.3 Canonical URL

```
https://onlineautoabmelden.com/product/fahrzeugabmeldung
```

---

## 20. Edge Cases & Error Handling

### 20.1 Missing sessionStorage Data

```typescript
// CheckoutForm: redirect if no service data
useEffect(() => {
  const data = sessionStorage.getItem('serviceData');
  if (!data) {
    router.push('/product/fahrzeugabmeldung');
    return;
  }
  // parse and use...
}, []);
```

### 20.2 Order Number Collision

- Up to 5 retry attempts with incremental order numbers
- Catches unique constraint violation errors
- Fails with 500 after 5 attempts

### 20.3 Invoice Number Collision

- Same 5-retry pattern as orders
- Pattern: `RE-{YEAR}-{0001-9999}`

### 20.4 Payment Provider Failure

- **PayPal:** Order stored as `on-hold`, returns 502 with error message
- **Mollie:** Payment record updated with error, order set to `on-hold`, returns 502
- **Timeout scenarios:** Order exists but payment pending — admin can resolve manually

### 20.5 Free Orders (100% Coupon)

- No payment provider called
- Order marked as `paid` immediately
- Invoice email sent automatically
- Returns `invoiceUrl` (not `paymentUrl`)

### 20.6 SEPA Orders

- Order marked as `on-hold` (waiting for bank transfer)
- Invoice email sent automatically
- Returns `invoiceUrl` to bank details page
- Admin manually confirms when payment arrives

### 20.7 Apple Pay Unavailability

- `ApplePaySession.canMakePayments()` check on mount
- Apple Pay option only shown on supported devices (Safari on Apple devices)
- Gracefully hidden on all other browsers/devices

### 20.8 Coupon Race Conditions

- Coupon validated at apply-time AND re-validated at checkout-time
- Usage count incremented atomically during checkout
- Per-user tracking via CouponUsage table (email-based)

---

## Appendix A: Environment Variables (Required)

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | Turso/libsql connection | `libsql://...` |
| `MOLLIE_API_KEY` | Mollie payments | `live_xxx` or `test_xxx` |
| `PAYPAL_CLIENT_ID` | PayPal API | `AYm...` |
| `PAYPAL_CLIENT_SECRET` | PayPal API | `EKq...` |
| `PAYPAL_MODE` | `live` or `sandbox` | `live` |
| `SITE_URL` | Base URL for callbacks | `https://onlineautoabmelden.com` |
| `SMTP_HOST` | Email server | `smtp.titan.email` |
| `SMTP_PORT` | Email port | `465` |
| `SMTP_USER` | Email account | `info@onlineautoabmelden.com` |
| `SMTP_PASS` | Email password | `...` |
| `NEXTAUTH_SECRET` | Invoice token signing | `...` |

## Appendix B: Company Contact Details

```
Business: ikfz Digital-Zulassung UG (haftungsbeschränkt)
Address: Gerhard-Küchen-Str. 14, 45141 Essen
Phone: 01522 4999190
WhatsApp: +49 1522 4999190
Email: info@onlineautoabmelden.com
Website: https://onlineautoabmelden.com
Google Review: https://g.page/r/Cd3tHbWRE-frEAE/review
```

## Appendix C: File Index

| File | Lines | Purpose |
|---|---|---|
| `src/app/product/fahrzeugabmeldung/page.tsx` | 527 | Product/service page |
| `src/components/ServiceForm.tsx` | 746 | 4-step wizard form |
| `src/components/ui/LicensePlateInput.tsx` | 877 | German license plate input |
| `src/components/ui/VehicleTypeSelector.tsx` | 150 | Vehicle type selection grid |
| `src/components/ui/FormErrorBanner.tsx` | 32 | Error banner component |
| `src/components/CheckoutForm.tsx` | 427 | Checkout wrapper |
| `src/components/checkout/PaymentMethodSelector.tsx` | 425 | Payment method radio cards |
| `src/components/checkout/OrderSummary.tsx` | 410 | Order summary + coupon + submit |
| `src/app/rechnung/page.tsx` | 166 | Checkout page layout |
| `src/app/rechnung/[invoiceNumber]/page.tsx` | ~380 | SEPA invoice display |
| `src/app/bestellung-erfolgreich/page.tsx` | 128 | Success page |
| `src/app/zahlung-fehlgeschlagen/page.tsx` | 126 | Payment failure page |
| `src/app/api/checkout/direct/route.ts` | 623 | Main checkout API |
| `src/app/api/apply-coupon/route.ts` | 112 | Coupon validation API |
| `src/lib/payments.ts` | 542 | Mollie integration |
| `src/lib/paypal.ts` | 403 | PayPal integration |
| `src/lib/validations.ts` | 149 | Zod schemas |
| `src/lib/invoice-token.ts` | 27 | Invoice token HMAC |
| `src/lib/rate-limit.ts` | 80 | Rate limiting |
| `src/lib/db.ts` | 800+ | Database access functions |
| `src/lib/document-email.ts` | 155 | Document email sending |
| `src/lib/completion-email.ts` | 230 | Order completion email |
| `src/lib/order-message-email.ts` | 160 | Admin message email |
| `src/lib/campaign-email.ts` | 280 | Campaign email system |
| `tailwind.config.ts` | 100 | Theme configuration |

---

*End of report*
