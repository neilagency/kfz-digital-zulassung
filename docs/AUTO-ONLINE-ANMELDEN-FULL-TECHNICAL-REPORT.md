# AUTO ONLINE ANMELDEN — Full Technical, UX & Content Report

> **Purpose:** Pixel-perfect + logic-perfect replication of `https://onlineautoabmelden.com/product/auto-online-anmelden` on another website.  
> **Generated:** 2026-04-16  
> **Stack:** Next.js 14.2.21 / React 18 / Tailwind CSS / Prisma + Turso (libsql) / react-hook-form + Zod

---

## Table of Contents

1. [Full User Flow (Step-by-Step)](#1-full-user-flow)
2. [Forms Breakdown](#2-forms-breakdown)
3. [Step Structure & Components](#3-step-structure--components)
4. [Assets & Images](#4-assets--images)
5. [UI Behavior & Interaction](#5-ui-behavior--interaction)
6. [Content & Copywriting](#6-content--copywriting)
7. [API & Backend Integration](#7-api--backend-integration)
8. [Checkout Flow](#8-checkout-flow)
9. [State Management & Data Flow](#9-state-management--data-flow)
10. [Technical Structure](#10-technical-structure)
11. [Edge Cases & Validation Scenarios](#11-edge-cases--validation-scenarios)
12. [Responsiveness](#12-responsiveness)

---

## 1. Full User Flow

### 1.1 Flow Diagram

```
[User lands on /product/auto-online-anmelden]
         │
         ▼
┌──────────────────────────────────────────┐
│ RegistrationForm (3-step wizard)         │
│                                          │
│  Step 1: Service & Ausweis               │
│    ├─ Service type (select dropdown)     │
│    ├─ Ausweis type (select dropdown)     │
│    └─ eVB Nummer (text input)            │
│                                          │
│  Step 2: Kennzeichen                     │
│    ├─ Kennzeichen option (select)        │
│    ├─ [Conditional] Wunschkennzeichen    │
│    │   └─ LicensePlateInput + PIN        │
│    └─ Kennzeichen mitbestellen? (radio)  │
│                                          │
│  Step 3: Bankdaten & Kasse               │
│    ├─ Kontoinhaber (text)                │
│    ├─ IBAN (text)                        │
│    ├─ File Uploads (vehicle docs)        │
│    ├─ File Uploads (ID verification)     │
│    ├─ Price Summary                      │
│    └─ Submit                             │
└────────────┬─────────────────────────────┘
             │
             │ 1. Upload files to /api/upload/documents
             │ 2. Compress images client-side (if >3.5MB)
             │ 3. sessionStorage.setItem('serviceData', {...})
             │ 4. router.push('/rechnung')
             │
             ▼
┌──────────────────────────────────────────┐
│ Checkout Page (/rechnung)                │
│  ├─ PaymentMethodSelector                │
│  │   (paypal|apple_pay|credit_card|      │
│  │    klarna|sepa)                       │
│  ├─ OrderSummary + CouponInput           │
│  └─ AGB Checkbox + Submit                │
└────────────┬─────────────────────────────┘
             │ POST /api/checkout/direct
             │ body.productId = 'anmeldung'
             ▼
┌──────────────────────────────────────────┐
│ Server: Validate → Create Order →        │
│   Create Invoice → Route to Payment      │
│                                          │
│  productSlug = 'auto-online-anmelden'    │
│  productName = "Fahrzeug online anmelden │
│                 – {serviceLabel}"         │
│                                          │
│  ├─ PayPal → PayPal Approval URL         │
│  ├─ Mollie (CC/ApplePay) → Mollie URL    │
│  ├─ Klarna → Mollie Orders API URL       │
│  ├─ SEPA → Invoice page (no redirect)    │
│  └─ Free (100% coupon) → Invoice page    │
└────────────┬─────────────────────────────┘
             ▼
┌──────────────────────────────────────────┐
│ /bestellung-erfolgreich?order=XXXX       │
│   OR                                     │
│ /rechnung/RE-2026-XXXX?order=...&token=  │
└──────────────────────────────────────────┘
```

### 1.2 Step Navigation Rules

| From | To | Condition |
|---|---|---|
| Step 1 → Step 2 | Click "Weiter" | `service`, `ausweis`, `evbNummer` all valid |
| Step 2 → Step 3 | Click "Weiter" | `kennzeichenWahl`, `kennzeichenBestellen` valid + conditional: if `reserviert` → `wunschkennzeichen` (≥3 chars) + `kennzeichenPin` (≥4 chars) |
| Step 3 → Submit | Click "Zur Kasse" | `kontoinhaber`, `iban` valid + ALL required uploads present |
| Step N → Step N-1 | Click "Zurück" | No validation needed, always allowed |
| Step N → Step <N | Click step indicator | Only completed steps are clickable |

### 1.3 Branching Logic

**Service-dependent upload requirements:**

| Service | Required Vehicle Documents |
|---|---|
| `neuzulassung` (Anmelden) | Fahrzeugschein Vorderseite, Fahrzeugschein Rückseite, Fahrzeugbrief Vorderseite |
| `ummeldung` (Ummelden) | Fahrzeugschein Vorderseite, Fahrzeugschein Rückseite, Fahrzeugbrief Vorderseite |
| `wiederzulassung` (Wiederzulassen) | Fahrzeugschein Vorderseite, Fahrzeugschein Rückseite |
| `neuwagen` (Neuwagen Zulassung) | Fahrzeugbrief Vorderseite |

**Ausweis-dependent verification documents:**

| Ausweis Type | Required Verification Documents |
|---|---|
| `personalausweis` | Personalausweis Vorderseite, Personalausweis Rückseite |
| `aufenthaltstitel` | Aufenthaltstitel Vorderseite, Aufenthaltstitel Rückseite |
| `reisepass` | Reisepass (Seite mit Foto), Meldebescheinigung |

**Kennzeichen-dependent fields:**

| Kennzeichen Option | Additional Fields |
|---|---|
| `automatisch` | None |
| `reserviert` | Wunschkennzeichen (LicensePlateInput), PIN (text input) |

---

## 2. Forms Breakdown

### 2.1 Zod Validation Schema (Complete)

```typescript
const formSchema = z.object({
  service: z.string().min(1, 'Bitte wählen Sie eine Leistung'),
  ausweis: z.string().min(1, 'Bitte wählen Sie Ihren Ausweistyp'),
  evbNummer: z.string()
    .min(6, 'Bitte geben Sie Ihre eVB-Nummer ein (mind. 6 Zeichen)')
    .max(12, 'eVB-Nummer darf max. 12 Zeichen haben'),
  kennzeichenWahl: z.string().min(1, 'Bitte wählen Sie eine Kennzeichen-Option'),
  wunschkennzeichen: z.string().optional().default(''),
  kennzeichenPin: z.string().optional().default(''),
  kennzeichenBestellen: z.enum(['ja', 'nein'], {
    required_error: 'Bitte wählen Sie eine Option',
  }),
  kontoinhaber: z.string().min(2, 'Bitte geben Sie den Kontoinhaber ein'),
  iban: z.string()
    .min(15, 'Bitte geben Sie eine gültige IBAN ein')
    .max(34, 'IBAN darf maximal 34 Zeichen haben'),
});
```

### 2.2 Step 1 – Service & Ausweis

#### Field: `service`

| Property | Value |
|---|---|
| **Code name** | `service` |
| **Label** | "Was möchten Sie tun?" |
| **Type** | `<select>` dropdown |
| **Required** | Yes ✅ |
| **Default** | `""` (empty) |
| **Placeholder option** | "— Bitte wählen —" |
| **Validation** | min 1 char (must select) |
| **Error message** | "Bitte wählen Sie eine Leistung" |
| **Options** | See table below |

**Select Options (from DB or defaults):**

| value | label (display) | price |
|---|---|---|
| `neuzulassung` | `Anmelden ( + 124,70 € )` | 124.70 |
| `ummeldung` | `Ummelden ( + 119,70 € )` | 119.70 |
| `wiederzulassung` | `Wiederzulassen ( + 99,70 € )` | 99.70 |
| `neuwagen` | `Neuwagen Zulassung ( + 124,70 € )` | 124.70 |

> **Note:** Prices come from DB `product.options` JSON, parsed server-side. The mapping from DB key to label is:
> ```typescript
> neuzulassung → 'Anmelden'
> ummeldung → 'Ummelden'
> wiederzulassung → 'Wiederzulassen'
> neuwagen → 'Neuwagen Zulassung'
> ```

#### Field: `ausweis`

| Property | Value |
|---|---|
| **Code name** | `ausweis` |
| **Label** | "Welchen Ausweis besitzen Sie?" |
| **Type** | `<select>` dropdown |
| **Required** | Yes ✅ |
| **Default** | `""` (empty) |
| **Placeholder option** | "— Bitte wählen —" |
| **Validation** | min 1 char |
| **Error message** | "Bitte wählen Sie Ihren Ausweistyp" |

**Select Options (hardcoded):**

| value | label |
|---|---|
| `personalausweis` | Deutscher Personalausweis |
| `aufenthaltstitel` | Aufenthaltstitel |
| `reisepass` | Reisepass |

#### Field: `evbNummer`

| Property | Value |
|---|---|
| **Code name** | `evbNummer` |
| **Label** | "eVB Nummer eintragen (Versicherungsbestätigung)" |
| **Type** | `<input type="text">` |
| **Required** | Yes ✅ |
| **Default** | `""` |
| **Placeholder** | "z. B. A1B2C3D" |
| **Validation** | min 6, max 12 chars |
| **Error messages** | "Bitte geben Sie Ihre eVB-Nummer ein (mind. 6 Zeichen)" / "eVB-Nummer darf max. 12 Zeichen haben" |
| **Helper text** | "Die eVB-Nummer erhalten Sie von Ihrer KFZ-Versicherung" (with Shield icon) |

### 2.3 Step 2 – Kennzeichen

#### Field: `kennzeichenWahl`

| Property | Value |
|---|---|
| **Code name** | `kennzeichenWahl` |
| **Label** | "Welches Kennzeichen möchten Sie?" |
| **Type** | `<select>` dropdown |
| **Required** | Yes ✅ |
| **Default** | `""` |
| **Placeholder option** | "— Bitte wählen —" |
| **Validation** | min 1 char |
| **Error message** | "Bitte wählen Sie eine Kennzeichen-Option" |

**Select Options:**

| value | label |
|---|---|
| `automatisch` | Automatische Zuteilung |
| `reserviert` | Reserviertes Kennzeichen ( + {kennzeichenReserviertPrice} € ) |

> Default `kennzeichenReserviertPrice` = 24.70 €

#### Field: `wunschkennzeichen` (CONDITIONAL — only when `kennzeichenWahl === 'reserviert'`)

| Property | Value |
|---|---|
| **Code name** | `wunschkennzeichen` |
| **Label** | "Wunschkennzeichen" |
| **Type** | `<LicensePlateInput>` (German license plate UI) |
| **Required** | Yes (conditionally, manual validation) |
| **Default** | `""` |
| **Validation** | min 3 chars (manual check in `nextStep()`) |
| **Error message** | "Bitte Ihr Wunschkennzeichen eingeben (mind. 3 Zeichen)" |
| **Output format** | `"CITY-LETTERS-NUMBERS"` (e.g., "BIE-NE-74") |

#### Field: `kennzeichenPin` (CONDITIONAL — only when `kennzeichenWahl === 'reserviert'`)

| Property | Value |
|---|---|
| **Code name** | `kennzeichenPin` |
| **Label** | "PIN für reserviertes Kennzeichen" |
| **Type** | `<input type="text">` |
| **Required** | Yes (conditionally) |
| **Default** | `""` |
| **Placeholder** | "z.B. 123456" |
| **Validation** | min 4 chars (manual check) |
| **Error message** | "Bitte die PIN der Reservierung eingeben (mind. 4 Zeichen)" |

**Conditional panel intro text (when `reserviert`):**
```
Bitte Ihr Wunschkennzeichen und die PIN aus der Reservierung eintragen. Kein vorhanden? Kontaktieren Sie uns.
```
("Kontaktieren Sie uns" = link to `contactWhatsapp`, `text-primary underline font-bold`)

#### Field: `kennzeichenBestellen`

| Property | Value |
|---|---|
| **Code name** | `kennzeichenBestellen` |
| **Label** | "Möchten Sie Ihre Kennzeichen mitbestellen?" |
| **Type** | Radio group (two cards) |
| **Required** | Yes ✅ |
| **Default** | `"nein"` |
| **Options** | See table below |

**Radio Options:**

| value | Label | Sub-text | Style when selected |
|---|---|---|---|
| `ja` | "Ja **(+ {kennzeichenBestellenPrice} €)**" | "Lieferung in 2–3 Werktagen" | `border-primary bg-primary/5` |
| `nein` | "Nein" | "Selbst beim Schildermacher prägen" | `border-primary bg-primary/5` |

> Default `kennzeichenBestellenPrice` = 29.70 €

**Helper text below radio group:**
```
Hinweis: Kennzeichen von uns werden in 2–3 Werktagen geliefert.
```

### 2.4 Step 3 – Bankdaten & Kasse

#### Field: `kontoinhaber`

| Property | Value |
|---|---|
| **Code name** | `kontoinhaber` |
| **Label** | "Kontoinhaber (Vor- und Nachname)" |
| **Type** | `<input type="text">` |
| **Required** | Yes ✅ |
| **Default** | `""` |
| **Placeholder** | "Max Mustermann" |
| **Validation** | min 2 chars |
| **Error message** | "Bitte geben Sie den Kontoinhaber ein" |

#### Field: `iban`

| Property | Value |
|---|---|
| **Code name** | `iban` |
| **Label** | "IBAN (Kontonummer/BLZ)" |
| **Type** | `<input type="text">` |
| **Required** | Yes ✅ |
| **Default** | `""` |
| **Placeholder** | "DE89 3704 0044 0532 0130 00" |
| **Validation** | min 15, max 34 chars |
| **Error messages** | "Bitte geben Sie eine gültige IBAN ein" / "IBAN darf maximal 34 Zeichen haben" |
| **Helper text** | "Wird nur für das Lastschriftmandat der KFZ-Steuer verwendet" (with Lock icon) |

### 2.5 File Upload Fields (Step 3)

#### Upload Configuration

| Property | Value |
|---|---|
| **Accepted types** | `image/jpg, image/png, image/jpg, application/pdf` |
| **Max file size** | 10 MB (server), 3.5 MB after client compression |
| **Client compression** | Images >3.5MB auto-compressed to JPEG (iterative: 1600px@0.7 → 400px@0.2) |
| **Upload endpoint** | `POST /api/upload/documents` |

#### All Upload Fields Definition

| ID | Label | Hint Text | Example Image |
|---|---|---|---|
| `fahrzeugscheinVorne` | "Fahrzeugschein (Teil I) – Vorderseite" | "Bitte laden Sie die Vorderseite vom Fahrzeugschein (Teil I) vollständig hoch." | `/images/example-fahrzeugschein-vorderseite.jpg` |
| `fahrzeugscheinHinten` | "Fahrzeugschein (Teil I) – Rückseite mit Sicherheitscode" | "Bitte laden Sie die Rückseite vom Fahrzeugschein (Teil I) hoch. Der Sicherheitscode muss freigelegt und gut sichtbar sein." | `/images/example-fahrzeugschein-rueckseite.jpg` |
| `fahrzeugbriefVorne` | "Fahrzeugbrief (Teil II) – Vorderseite mit Sicherheitscode" | "Bitte laden Sie die Vorderseite vom Fahrzeugbrief (Teil II) vollständig hoch. Der Sicherheitscode auf der linken Seite muss sichtbar sein." | `/images/example-fahrzeugbrief-vorderseite.jpg` |
| `personalausweisVorne` | "Personalausweis – Vorderseite" | "Bitte laden Sie die Vorderseite Ihres Personalausweises gut leserlich hoch." | `/images/example-personalausweis-vorne.jpg` |
| `personalausweisHinten` | "Personalausweis – Rückseite" | "Bitte laden Sie die Rückseite Ihres Personalausweises gut leserlich hoch." | `/images/example-personalausweis-hinten.jpg` |
| `aufenthaltstitelVorne` | "Aufenthaltstitel – Vorderseite" | "Bitte laden Sie die Vorderseite Ihres Aufenthaltstitels gut leserlich hoch." | `/images/example-aufenthaltstitel-vorne.jpg` |
| `aufenthaltstitelHinten` | "Aufenthaltstitel – Rückseite" | "Bitte laden Sie die Rückseite Ihres Aufenthaltstitels gut leserlich hoch." | `/images/example-aufenthaltstitel-hinten.jpg` |
| `reisepassVorne` | "Reisepass – Seite mit Foto" | "Bitte laden Sie die Seite mit Foto und persönlichen Daten gut leserlich hoch." | `/images/example-reisepass-vorne.jpg` |
| `meldebescheinigung` | "Meldebescheinigung" | "Bitte laden Sie eine aktuelle Meldebescheinigung oder ein behördliches Dokument mit Ihrer Adresse hoch." | `/images/example-meldebescheinigung.gif` |

#### Upload Error Messages

| Scenario | Error Message |
|---|---|
| Missing required upload | `"Bitte {field.label} hochladen"` |
| Upload API failure | `"Upload fehlgeschlagen: {errorMessage}"` |
| No URL returned | `"Keine URL vom Upload erhalten"` |

---

## 3. Step Structure & Components

### 3.1 Step Definitions

```typescript
const FORM_STEPS = [
  {
    title: 'Service & Ausweis',
    description: 'Leistung wählen, eVB eingeben',
    icon: Car,         // lucide-react
  },
  {
    title: 'Kennzeichen',
    description: 'Wunschkennzeichen & Bestellung',
    icon: Package,     // lucide-react
  },
  {
    title: 'Bankdaten & Kasse',
    description: 'IBAN für KFZ-Steuer & bezahlen',
    icon: CreditCard,  // lucide-react
  },
];
```

### 3.2 Overall Form Layout

```
┌──────────────────────────────────────────────────┐
│ FORM HEADER (gradient bg: primary → primary-700) │
│  h2: "Jetzt Formular ausfüllen – wir schalten   │
│       Ihr Fahrzeug gleich frei"                  │
│  p: "Live-Support: Persönliche Hilfe per Chat    │
│      während des Ausfüllens"                     │
├──────────────────────────────────────────────────┤
│ STEP INDICATOR                                   │
│  [Car]──────[Package]──────[CreditCard]          │
│  Service     Kennzeichen    Bankdaten            │
│  & Ausweis   & Bestellung   & Kasse             │
├──────────────────────────────────────────────────┤
│                                                  │
│ STEP CONTENT (animated slide-in-from-right)      │
│  min-height: 400px                               │
│                                                  │
│  [Fields specific to current step]               │
│                                                  │
├──────────────────────────────────────────────────┤
│ FOOTER                                           │
│  [FormErrorBanner] (if error)                    │
│  [← Zurück]              [Weiter →]             │
│                    OR    [🛒 Zur Kasse – XX €]   │
│                                                  │
│  🔒 SSL-verschlüsselt  🛡️ KBA-registriert       │
│  📞 Live-Support: {phone}                        │
└──────────────────────────────────────────────────┘
```

### 3.3 Step 1 Layout

```
┌──────────────────────────────────────────────┐
│ [Car icon] Service & Ausweis                 │
│ Wählen Sie Ihre gewünschte Leistung und      │
│ Ihren Ausweistyp                             │
├──────────────────────────────────────────────┤
│                                              │
│ Was möchten Sie tun? *                       │
│ ┌──────────────────────────────────────────┐│
│ │ — Bitte wählen —                      ▼  ││
│ └──────────────────────────────────────────┘│
│                                              │
│ Welchen Ausweis besitzen Sie? *              │
│ ┌──────────────────────────────────────────┐│
│ │ — Bitte wählen —                      ▼  ││
│ └──────────────────────────────────────────┘│
│                                              │
│ eVB Nummer eintragen (Versicherungs-        │
│ bestätigung) *                               │
│ ┌──────────────────────────────────────────┐│
│ │ z. B. A1B2C3D                            ││
│ └──────────────────────────────────────────┘│
│ 🛡️ Die eVB-Nummer erhalten Sie von Ihrer    │
│    KFZ-Versicherung                          │
│                                              │
└──────────────────────────────────────────────┘
```

### 3.4 Step 2 Layout

```
┌──────────────────────────────────────────────┐
│ [Package icon] Kennzeichen                   │
│ Wunschkennzeichen & Bestelloptionen          │
├──────────────────────────────────────────────┤
│                                              │
│ Welches Kennzeichen möchten Sie? *           │
│ ┌──────────────────────────────────────────┐│
│ │ — Bitte wählen —                      ▼  ││
│ └──────────────────────────────────────────┘│
│                                              │
│ ┌─── IF reserviert ──────────────────────┐  │
│ │ (blue bg panel, border-primary/20)     │  │
│ │                                        │  │
│ │ "Bitte Ihr Wunschkennzeichen und die   │  │
│ │  PIN aus der Reservierung eintragen.   │  │
│ │  Kein vorhanden? Kontaktieren Sie uns."│  │
│ │                                        │  │
│ │ Wunschkennzeichen *                    │  │
│ │ ┌────────────────────────────────────┐ │  │
│ │ │ [German License Plate Input]       │ │  │
│ │ └────────────────────────────────────┘ │  │
│ │                                        │  │
│ │ PIN für reserviertes Kennzeichen *     │  │
│ │ ┌────────────────────────────────────┐ │  │
│ │ │ z.B. 123456                        │ │  │
│ │ └────────────────────────────────────┘ │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ Möchten Sie Ihre Kennzeichen mitbestellen? * │
│ ┌────────────────┐ ┌────────────────────┐   │
│ │ ○ Ja (+29,70 €)│ │ ○ Nein             │   │
│ │ Lieferung in   │ │ Selbst beim        │   │
│ │ 2–3 Werktagen  │ │ Schildermacher     │   │
│ └────────────────┘ └────────────────────┘   │
│ Hinweis: Kennzeichen von uns werden in       │
│ 2–3 Werktagen geliefert.                     │
│                                              │
└──────────────────────────────────────────────┘
```

### 3.5 Step 3 Layout

```
┌──────────────────────────────────────────────┐
│ [Landmark icon] Bankverbindung für die       │
│ Kfz-Steuerlastschrift                        │
│ IBAN wird für die automatische KFZ-Steuer    │
│ benötigt                                     │
├──────────────────────────────────────────────┤
│                                              │
│ Kontoinhaber (Vor- und Nachname) *           │
│ ┌──────────────────────────────────────────┐│
│ │ Max Mustermann                           ││
│ └──────────────────────────────────────────┘│
│                                              │
│ IBAN (Kontonummer/BLZ) *                     │
│ ┌──────────────────────────────────────────┐│
│ │ DE89 3704 0044 0532 0130 00              ││
│ └──────────────────────────────────────────┘│
│ 🔒 Wird nur für das Lastschriftmandat der    │
│    KFZ-Steuer verwendet                      │
│                                              │
│ ─────────────────────────────────────────── │
│                                              │
│ [Upload icon] Fahrzeugdokumente hochladen    │
│ Bitte laden Sie die für Ihren Service        │
│ benötigten Fahrzeugdokumente hoch            │
│                                              │
│ ┌──────────────────────────────────────────┐│
│ │ [FileUploadCard: Fahrzeugschein Vorne]   ││
│ └──────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────┐│
│ │ [FileUploadCard: Fahrzeugschein Hinten]  ││
│ └──────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────┐│
│ │ [FileUploadCard: Fahrzeugbrief Vorne]    ││
│ └──────────────────────────────────────────┘│
│                                              │
│ ─────────────────────────────────────────── │
│                                              │
│ [Shield icon] Verifizierung (Verimi)         │
│ Bitte laden Sie die passenden Dokumente      │
│ gut leserlich hoch                           │
│                                              │
│ ┌──────────────────────────────────────────┐│
│ │ [FileUploadCard: Personalausweis Vorne]  ││
│ └──────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────┐│
│ │ [FileUploadCard: Personalausweis Hinten] ││
│ └──────────────────────────────────────────┘│
│                                              │
│ ─────────────────────────────────────────── │
│                                              │
│ ┌── Upload Help Box ────────────────────┐   │
│ │ Probleme beim Hochladen? Senden Sie   │   │
│ │ uns die Fotos alternativ per WhatsApp  │   │
│ │ oder E-Mail.                           │   │
│ │                                        │   │
│ │ [WhatsApp btn] [Email btn]             │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ ┌── Important Info (collapsible) ────────┐  │
│ │ ▸ Wichtige Informationen               │  │
│ │   Bitte prüfen Sie Ihre Angaben vor    │  │
│ │   dem Absenden genau                   │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ┌── Price Summary ───────────────────────┐  │
│ │ Anmelden            124,70 €           │  │
│ │ Reserviertes Kennz.  +24,70 € (if any)│  │
│ │ Kennzeichen-Best.    +29,70 € (if any)│  │
│ │ ─────────────────────────────────      │  │
│ │ Gesamt              179,10 €           │  │
│ └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

### 3.6 FileUploadCard Component

**File:** `src/components/RegistrationForm.tsx` (lines 202-370)

**States:**

| State | Border | Background | Content |
|---|---|---|---|
| Empty (no file) | `border-gray-200 border-dashed` | `bg-gray-50/50` | Camera icon + "Foto aufnehmen oder Datei wählen" + "JPG, PNG oder PDF · max. 10 MB" |
| Uploaded | `border-green-300 border-dashed` | `bg-green-50/50` | Thumbnail/icon + filename + size + remove button + "✅ Datei hochgeladen" |
| Error | `border-red-300 border-dashed` | `bg-red-50/50` | Same as empty + red error text |
| Hover (empty) | `border-primary/40` | `bg-primary/5` | Same as empty |

**Example Image Modal:**
- Triggered by clicking the `ℹ️` button in top-right corner of upload card
- Shows overlay with dark backdrop (`bg-black/60`)
- Modal: white, rounded-2xl, max-w-md
- Contains: title, example image, hint text
- Close button in header + click-outside-to-close

### 3.7 Component Hierarchy

```
AutoOnlineAnmeldenPage (server)
  └── RegistrationForm (client)
        ├── FormErrorBanner
        ├── StepIndicator (inline)
        ├── Step 1: Service & Ausweis
        │     └── 3 × <select> / <input>
        ├── Step 2: Kennzeichen
        │     ├── <select>
        │     ├── [conditional] LicensePlateInput
        │     └── Radio group
        └── Step 3: Bankdaten & Kasse
              ├── <input> × 2
              ├── FileUploadCard × N (dynamic)
              ├── Upload help box
              ├── Important info <details>
              └── Price summary
```

---

## 4. Assets & Images

### 4.1 Example Document Images

| File Name | Path | Used In | Type |
|---|---|---|---|
| `example-fahrzeugschein-vorderseite.jpg` | `/public/images/example-fahrzeugschein-vorderseite.jpg` | FileUploadCard (fahrzeugscheinVorne) | Static |
| `example-fahrzeugschein-vorderseite.jpeg` | `/public/images/example-fahrzeugschein-vorderseite.jpeg` | Duplicate format | Static |
| `example-fahrzeugschein-rueckseite.jpg` | `/public/images/example-fahrzeugschein-rueckseite.jpg` | FileUploadCard (fahrzeugscheinHinten) | Static |
| `example-fahrzeugschein-rueckseite.jpeg` | `/public/images/example-fahrzeugschein-rueckseite.jpeg` | Duplicate format | Static |
| `example-fahrzeugbrief-vorderseite.jpg` | `/public/images/example-fahrzeugbrief-vorderseite.jpg` | FileUploadCard (fahrzeugbriefVorne) | Static |
| `example-fahrzeugbrief-vorderseite.jpeg` | `/public/images/example-fahrzeugbrief-vorderseite.jpeg` | Duplicate format | Static |
| `example-personalausweis-vorne.jpg` | `/public/images/example-personalausweis-vorne.jpg` | FileUploadCard (personalausweisVorne) | Static |
| `example-personalausweis-hinten.jpg` | `/public/images/example-personalausweis-hinten.jpg` | FileUploadCard (personalausweisHinten) | Static |
| `example-aufenthaltstitel-vorne.jpg` | `/public/images/example-aufenthaltstitel-vorne.jpg` | FileUploadCard (aufenthaltstitelVorne) | Static |
| `example-aufenthaltstitel-hinten.jpg` | `/public/images/example-aufenthaltstitel-hinten.jpg` | FileUploadCard (aufenthaltstitelHinten) | Static |
| `example-reisepass-vorne.jpg` | `/public/images/example-reisepass-vorne.jpg` | FileUploadCard (reisepassVorne) | Static |
| `example-meldebescheinigung.gif` | `/public/images/example-meldebescheinigung.gif` | FileUploadCard (meldebescheinigung) | Static |

### 4.2 Icons (All from lucide-react)

| Icon | Used In |
|---|---|
| `Car` | Step 1 indicator + Step 1 header |
| `Package` | Step 2 indicator + Step 2 header |
| `CreditCard` | Step 3 indicator |
| `Landmark` | Step 3 header |
| `Upload` | Vehicle documents section header |
| `Shield` | Verification section + eVB helper + trust badge |
| `Lock` | IBAN helper + trust badge |
| `Phone` | Trust badge |
| `Camera` | File upload empty state |
| `Info` | Example image trigger button |
| `FileText` | PDF file preview icon |
| `X` | File remove + modal close |
| `CheckCircle` | Step completed indicator + upload success |
| `AlertCircle` | Error messages |
| `ArrowRight` | "Weiter" button |
| `ArrowLeft` | "Zurück" button |
| `ShoppingCart` | Submit button |
| `MessageCircle` | WhatsApp help button |
| `ChevronDown` | "Wichtige Informationen" collapsible |

### 4.3 LicensePlateInput Component

**File:** `src/components/ui/LicensePlateInput.tsx` (877 lines)

The same German license plate input component documented in the Fahrzeugabmeldung report is reused here for the Wunschkennzeichen field. It includes:
- EU blue band with 12 golden SVG stars + "D"
- City code (3 chars), Letters (2 chars), Numbers (4 chars) segments
- HU + City seal inline SVGs
- Auto-advance between segments
- Vehicle type variants (but here always used without vehicleType prop = default `auto`)

---

## 5. UI Behavior & Interaction

### 5.1 Step Transitions

- **Animation:** Each step content uses `animate-in fade-in slide-in-from-right-4 duration-300`
- **Scroll:** On step change, `formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })` after 50ms delay

### 5.2 Step Indicator States

| State | Circle Style | Label Style |
|---|---|---|
| Active | `bg-primary text-white shadow-lg shadow-primary/30 scale-110` | `text-primary font-bold` |
| Completed | `bg-accent text-white` (shows CheckCircle icon) | `text-accent font-bold` |
| Pending | `bg-gray-100 text-gray-400` | `text-gray-400` |
| Completed step clickable | `cursor-pointer` | — |
| Non-completed step | `cursor-default` | — |

**Connecting lines:** Progress bar fills with `bg-accent` when step is completed, `bg-gray-200` when pending.

### 5.3 Input Styling

```css
/* Common input class */
INPUT_CLASS = 'w-full px-4 py-3 rounded-xl border border-gray-200 
  focus:border-primary focus:ring-2 focus:ring-primary/20 
  outline-none transition-all text-base bg-white'

/* Select class (same + appearance-none cursor-pointer) */
SELECT_CLASS = INPUT_CLASS + ' appearance-none cursor-pointer'
```

### 5.4 Radio Card Selection

| State | Style |
|---|---|
| Selected | `border-2 border-primary bg-primary/5` |
| Unselected | `border-2 border-gray-200` |
| Hover (unselected) | `border-gray-300` |

### 5.5 File Upload Card Hover

Empty state hover: `hover:border-primary/40 hover:bg-primary/5`

### 5.6 Button States

| Button | Normal | Hover | Disabled |
|---|---|---|---|
| "Weiter" | `bg-primary text-white` | `bg-primary-600 shadow-lg shadow-primary/25` | — |
| "Zurück" | `text-gray-500` | `text-primary` | — |
| "Zur Kasse" | `bg-accent text-white` | `bg-accent/90 shadow-lg shadow-accent/25` | `opacity-70 cursor-not-allowed` |

### 5.7 Loading/Submitting State

When `isSubmitting = true`:
- Submit button shows spinner (`w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin`) + "Wird gesendet …"
- Button is disabled

### 5.8 Error Display

- Field-level errors: red text below field with `AlertCircle` icon, `text-red-500 text-sm`
- Form-level error: `FormErrorBanner` component at bottom of form (red bg, slide-down animation, dismiss button)
- Upload errors: red text below upload card

### 5.9 Conditional Panel (Reserviertes Kennzeichen)

- Slides in when `kennzeichenWahl === 'reserviert'`
- Styled as: `p-4 bg-primary/5 border border-primary/20 rounded-xl`
- Contains: intro text, LicensePlateInput, PIN input

### 5.10 Collapsible "Wichtige Informationen"

- `<details>` element with `group` class
- Summary: "Wichtige Informationen" + "Bitte prüfen Sie Ihre Angaben vor dem Absenden genau"
- Chevron rotates 180° on open (`group-open:rotate-180`)
- Background: `bg-amber-50 border border-amber-200 rounded-xl`

---

## 6. Content & Copywriting

### 6.1 Page-Level SEO Content

**Page Title (meta):**
```
Auto Online Anmelden – ab 124,70 €
```
(Truncated to 46 chars if longer)

**Meta Description:**
```
Fahrzeug jetzt online anmelden in 5 Minuten. 10-Tage-Zulassungsbestätigung sofort per PDF. Ohne Termin, ohne Behördengang. Bundesweit gültig.
```

**OG Title:**
```
Auto Online Anmelden – KFZ Zulassung ab 124,70 €
```

**OG Description:**
```
Fahrzeug jetzt online anmelden – Sofort-PDF, losfahren, Siegel per Post.
```

**Canonical URL:**
```
https://onlineautoabmelden.com/product/auto-online-anmelden
```

**Hidden h1 (sr-only):**
```
Auto online anmelden
```

### 6.2 Form Header

**Heading:**
```
Jetzt Formular ausfüllen – wir schalten Ihr Fahrzeug gleich frei
```

**Sub-text:**
```
Live-Support: Persönliche Hilfe per Chat während des Ausfüllens
```

### 6.3 Step 1 Content

**Section title:** "Service & Ausweis"  
**Section subtitle:** "Wählen Sie Ihre gewünschte Leistung und Ihren Ausweistyp"

**Field labels (exact):**
- "Was möchten Sie tun?"
- "Welchen Ausweis besitzen Sie?"
- "eVB Nummer eintragen (Versicherungsbestätigung)"

**Helper text:**
```
Die eVB-Nummer erhalten Sie von Ihrer KFZ-Versicherung
```

### 6.4 Step 2 Content

**Section title:** "Kennzeichen"  
**Section subtitle:** "Wunschkennzeichen & Bestelloptionen"

**Field labels (exact):**
- "Welches Kennzeichen möchten Sie?"
- "Wunschkennzeichen"
- "PIN für reserviertes Kennzeichen"
- "Möchten Sie Ihre Kennzeichen mitbestellen?"

**Conditional panel text:**
```
Bitte Ihr Wunschkennzeichen und die PIN aus der Reservierung eintragen. Kein vorhanden? Kontaktieren Sie uns.
```

**Radio label texts:**
- "Ja" + "(+ 29,70 €)" + "Lieferung in 2–3 Werktagen"
- "Nein" + "Selbst beim Schildermacher prägen"

**Helper text:**
```
Hinweis: Kennzeichen von uns werden in 2–3 Werktagen geliefert.
```

### 6.5 Step 3 Content

**Section title:** "Bankverbindung für die Kfz-Steuerlastschrift"  
**Section subtitle:** "IBAN wird für die automatische KFZ-Steuer benötigt"

**Field labels (exact):**
- "Kontoinhaber (Vor- und Nachname)"
- "IBAN (Kontonummer/BLZ)"

**IBAN helper text:**
```
Wird nur für das Lastschriftmandat der KFZ-Steuer verwendet
```

**Vehicle documents section:**
- Title: "Fahrzeugdokumente hochladen"
- Subtitle: "Bitte laden Sie die für Ihren Service benötigten Fahrzeugdokumente hoch"

**Verification section:**
- Title: "Verifizierung (Verimi)"
- Subtitle: "Bitte laden Sie die passenden Dokumente gut leserlich hoch"

**Upload help text:**
```
Probleme beim Hochladen? Senden Sie uns die Fotos alternativ per WhatsApp oder E-Mail.
```

**"Wichtige Informationen" (collapsible, full text):**
```
Bitte achten Sie darauf, dass alle Angaben exakt mit Ihren Dokumenten übereinstimmen.

Besonders wichtig sind die eVB-Nummer, der vollständige Name laut Ausweis, bereits reservierte Kennzeichen, die PIN der Reservierung und Ihre Bankdaten.

Wenn Daten bei Versicherung, Kennzeichen-Reservierung oder Lastschrift nicht korrekt hinterlegt sind, kann der Antrag abgelehnt werden.

Eine Ablehnung kann kostenpflichtig sein. Wenn Sie unsicher sind, kontaktieren Sie uns bitte vor dem Absenden kurz per WhatsApp oder Telefon.

Wichtig ist außerdem, dass bei Ihrer zuständigen Zulassungsstelle keine offenen Steuerrückstände bestehen.
```

### 6.6 Button Texts

| Button | Text |
|---|---|
| Next | "Weiter" (with ArrowRight icon) |
| Back | "Zurück" (with ArrowLeft icon) |
| Submit | "Zur Kasse – {totalPrice} €" (with ShoppingCart icon) |
| Submit (loading) | "Wird gesendet …" (with spinner) |

### 6.7 Trust Badges (Footer)

```
🔒 SSL-verschlüsselt    🛡️ KBA-registriert    📞 Live-Support: {contactPhone}
```

### 6.8 Upload Card CTA Texts

| State | Text |
|---|---|
| Empty | "Foto aufnehmen oder Datei wählen" + "JPG, PNG oder PDF · max. 10 MB" |
| Uploaded | "{filename}" + "{size} MB" + "✅ Datei hochgeladen" |

### 6.9 Error Messages Summary (Complete List)

| Field/Context | Error Message |
|---|---|
| service empty | "Bitte wählen Sie eine Leistung" |
| ausweis empty | "Bitte wählen Sie Ihren Ausweistyp" |
| evbNummer < 6 | "Bitte geben Sie Ihre eVB-Nummer ein (mind. 6 Zeichen)" |
| evbNummer > 12 | "eVB-Nummer darf max. 12 Zeichen haben" |
| kennzeichenWahl empty | "Bitte wählen Sie eine Kennzeichen-Option" |
| kennzeichenBestellen empty | "Bitte wählen Sie eine Option" |
| wunschkennzeichen < 3 | "Bitte Ihr Wunschkennzeichen eingeben (mind. 3 Zeichen)" |
| kennzeichenPin < 4 | "Bitte die PIN der Reservierung eingeben (mind. 4 Zeichen)" |
| kontoinhaber < 2 | "Bitte geben Sie den Kontoinhaber ein" |
| iban < 15 | "Bitte geben Sie eine gültige IBAN ein" |
| iban > 34 | "IBAN darf maximal 34 Zeichen haben" |
| missing upload | "Bitte {field.label} hochladen" |
| upload failure | "Upload fehlgeschlagen: {message}" |
| general submit error | "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut." |

### 6.10 Full Page Content (showFullContent = true sections)

> **Note:** Currently `showFullContent = false`, so these sections are NOT rendered. But the code contains them for future use.

**Hero Section:**
```
Badge: "i-Kfz – Offiziell über das KBA"
h1: "KFZ jetzt online anmelden" + "in 5 Minuten erledigt!"
p: "Nach der Anmeldung erhalten Sie sofort Ihre 10-Tage-Zulassungsbestätigung (PDF) – einfach ausdrucken und losfahren."
p: "Ihr Wunschkennzeichen (ungestempelt) können Sie direkt anbringen. Original-Dokumente & Siegel folgen automatisch per Post in 2–3 Werktagen."

Trust badges: "10-Tage-PDF sofort per E-Mail" | "Amtlich über i-Kfz / KBA" | "Siegel & Dokumente per Post"
```

**6-Step Cards:**
1. "Daten einreichen" — "Formular ausfüllen oder per WhatsApp senden..."
2. "Unterlagen fotografieren" — "Fahrzeugschein & Fahrzeugbrief mit Sicherheitscodes..."
3. "eVB-Nummer & IBAN" — "Versicherung und Kfz-Steuer einfach angeben."
4. "Identität bestätigen" — "Online-Verifizierung dauert nur wenige Minuten..."
5. "Zahlung" — "PayPal, Karte oder Überweisung..."
6. "Fertig – losfahren!" — "PDF-Zulassungsbestätigung per Mail..."

**FAQ Questions:**
1. "Wie schnell kann ich nach der Online-Anmeldung fahren?"
2. "Was benötige ich für die Online-Zulassung?"
3. "Was kostet die Online-Anmeldung?"
4. "Kann ich mein Wunschkennzeichen behalten?"
5. "Muss ich zur Zulassungsstelle gehen?"

---

## 7. API & Backend Integration

### 7.1 File Upload API

**Endpoint:** `POST /api/upload/documents`

**Request:**
```
Content-Type: multipart/form-data
Body:
  file: <File>         (required)
  fieldName: <string>  (e.g., "fahrzeugscheinVorne")
```

**Rate Limit:** 10 uploads/minute per IP

**Validation:**
- File required, size > 0
- Allowed types: `application/pdf`, `image/jpeg`, `image/jpg`, `image/png`
- Max size: 10 MB

**Client-Side Compression (before upload):**
```typescript
// If image > 3.5 MB, compress iteratively:
// [1600px@0.7] → [1200px@0.6] → [1000px@0.5] → [800px@0.4] → [600px@0.3] → [400px@0.2]
// Converts all images to JPEG
// Renames extension to .jpg
```

**Storage Backend:**
- **Vercel Blob** (if `BLOB_READ_WRITE_TOKEN` env set): `documents/{fieldName}_{timestamp}_{safeName}`
- **Local filesystem** (default): `public/uploads/documents/YYYY/MM/{fieldName}_{timestamp}_{random}_{safeName}`

**Success Response:**
```json
{
  "files": [{
    "fieldName": "fahrzeugscheinVorne",
    "originalName": "IMG_1234.jpg",
    "url": "https://onlineautoabmelden.com/uploads/documents/2026/04/fahrzeugscheinVorne_1713..._abc123_IMG_1234.jpg",
    "size": 2456789,
    "mimeType": "image/jpeg"
  }]
}
```

**Error Responses:**

| Status | Error |
|---|---|
| 429 | "Zu viele Upload-Anfragen. Bitte versuchen Sie es in einer Minute erneut." |
| 400 | "Keine Datei gefunden." |
| 400 | "Ungültiger Dateityp: {type}. Erlaubt: PDF, JPEG, PNG." |
| 400 | "Datei zu groß ({size} MB). Max. 10 MB." |
| 500 | "Upload fehlgeschlagen" |

### 7.2 Checkout API (`POST /api/checkout/direct`)

**Anmeldung-Specific Behavior:**

```typescript
// Detection
const isAnmeldung = body.productId === 'anmeldung';
const productSlug = isAnmeldung ? 'auto-online-anmelden' : 'fahrzeugabmeldung';

// Product name includes service label
const productName = isAnmeldung
  ? (serviceLabel ? `Fahrzeug online anmelden – ${serviceLabel}` : dbProduct.name)
  : dbProduct.name;
// e.g., "Fahrzeug online anmelden – Anmelden"
```

**Price resolution for Anmeldung:**
- Base price from DB `product.price` (auto-online-anmelden product)
- Client sends `productPrice` which includes base + kennzeichenReservierung + kennzeichenBestellung
- Server validates: `clientPrice >= dbProduct.price` → accepts client price
- Otherwise uses DB price only

**Full checkout API documentation:** See the [Fahrzeugabmeldung report](FAHRZEUGABMELDUNG-FULL-TECHNICAL-REPORT.md) sections 8-10 — the checkout flow, payment routing, order/invoice creation, and payment gateway integrations are **identical** for both services.

### 7.3 Coupon API (`POST /api/apply-coupon`)

Identical to Fahrzeugabmeldung. The `productSlug` sent is `'auto-online-anmelden'`. See previous report for full documentation.

---

## 8. Checkout Flow

### 8.1 Pricing Logic

```typescript
// Base price: from service selection
const basePrice = serviceOption?.price ?? 0;

// Add-ons:
const kennzeichenReservierung = kennzeichenWahl === 'reserviert' ? kennzeichenReserviertPrice : 0;
const kennzeichenBestellung = kennzeichenBestellen === 'ja' ? kennzeichenBestellenPrice : 0;

// Total:
const totalPrice = basePrice + kennzeichenReservierung + kennzeichenBestellung;
```

### 8.2 Price Breakdown (Example: Neuzulassung + Reserviert + Bestellen)

```
Anmelden                    124,70 €
Reserviertes Kennzeichen     +24,70 €
Kennzeichen-Bestellung       +29,70 €
─────────────────────────────────────
Gesamt                      179,10 €
```

### 8.3 Default Prices (from DB or fallback)

| Service | Default Price |
|---|---|
| Neuzulassung (Anmelden) | 124,70 € |
| Ummeldung | 119,70 € |
| Wiederzulassung | 99,70 € |
| Neuwagen Zulassung | 124,70 € |
| Kennzeichen reserviert (addon) | +24,70 € |
| Kennzeichen bestellen (addon) | +29,70 € |

### 8.4 Currency

EUR (€) — German format: `124,70 €` (comma decimal separator)

### 8.5 After Form Submit

1. Files already uploaded during Step 3 fill-out
2. `sessionStorage.setItem('serviceData', JSON.stringify({...}))`
3. `router.push('/rechnung')` → Checkout page
4. CheckoutForm reads from sessionStorage
5. User selects payment method + enters contact details
6. `POST /api/checkout/direct` with `productId: 'anmeldung'`
7. Redirect to payment provider or invoice page

### 8.6 Payment Methods

Identical to Fahrzeugabmeldung:

| Method | Fee | Provider |
|---|---|---|
| PayPal | 0.00 € | PayPal REST API v2 |
| Apple Pay | 0.00 € | Mollie |
| Kreditkarte | 0.50 € | Mollie |
| Klarna | 0.00 € | Mollie Orders API |
| SEPA Überweisung | 0.00 € | Manual (invoice page) |

---

## 9. State Management & Data Flow

### 9.1 React State (RegistrationForm)

```typescript
const [currentStep, setCurrentStep] = useState(0);        // 0-2
const [isSubmitting, setIsSubmitting] = useState(false);
const [formError, setFormError] = useState<string | null>(null);
const [uploadedFiles, setUploadedFiles] = useState<Record<UploadFieldId, File | null>>({...});
const [uploadErrors, setUploadErrors] = useState<Partial<Record<UploadFieldId, string>>>({});
```

### 9.2 react-hook-form State

```typescript
const { register, handleSubmit, watch, trigger, setError, clearErrors, setValue, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    service: '',
    ausweis: '',
    evbNummer: '',
    kennzeichenWahl: '',
    wunschkennzeichen: '',
    kennzeichenPin: '',
    kennzeichenBestellen: 'nein',
    kontoinhaber: '',
    iban: '',
  },
});
```

### 9.3 Watched Values (for conditional rendering)

```typescript
const kennzeichenWahl = watch('kennzeichenWahl');     // controls conditional panel
const kennzeichenBestellen = watch('kennzeichenBestellen'); // controls price calc
const selectedService = watch('service');               // controls upload requirements
const selectedAusweis = watch('ausweis');               // controls verification uploads
```

### 9.4 sessionStorage Data (set on submit)

**Key: `serviceData`**

```json
{
  "formType": "autoanmeldung",
  "productId": "anmeldung",
  "productPrice": "179.10",
  "service": "neuzulassung",
  "serviceLabel": "Anmelden",
  "ausweis": "personalausweis",
  "evbNummer": "A1B2C3D",
  "kennzeichenWahl": "reserviert",
  "wunschkennzeichen": "BIE-NE-74",
  "kennzeichenPin": "123456",
  "kennzeichenBestellen": "ja",
  "kontoinhaber": "Max Mustermann",
  "iban": "DE89370400440532013000",
  "uploadedFiles": {
    "fahrzeugscheinVorne": {
      "name": "IMG_1234.jpg",
      "size": 2456789,
      "type": "image/jpeg",
      "url": "https://onlineautoabmelden.com/uploads/documents/2026/04/..."
    },
    "fahrzeugscheinHinten": { ... },
    "fahrzeugbriefVorne": { ... },
    "personalausweisVorne": { ... },
    "personalausweisHinten": { ... }
  }
}
```

### 9.5 Data Flow Diagram

```
RegistrationForm
  │
  ├── Step 1-2: form fields → react-hook-form state
  │
  ├── Step 3: file uploads → POST /api/upload/documents
  │   └── Response URLs stored in fileInfo{}
  │
  ├── onSubmit:
  │   ├── Validate all required uploads present
  │   ├── Upload files (compress + POST)
  │   ├── Build serviceData object
  │   ├── sessionStorage.setItem('serviceData', JSON.stringify({...}))
  │   └── router.push('/rechnung')
  │
  ▼
CheckoutForm (/rechnung)
  │
  ├── sessionStorage.getItem('serviceData')
  │   → reads productPrice, productId='anmeldung'
  │
  ├── sessionStorage.getItem('appliedCoupon')
  │   → optional coupon discount
  │
  └── POST /api/checkout/direct
        body: {
          productId: 'anmeldung',
          productPrice: '179.10',
          serviceData: { ...full anmeldung data + uploaded file URLs... },
          phone, email, paymentMethod,
          firstName, lastName, ...
        }
```

### 9.6 Persistence

- **Page refresh during form:** All form state is lost (no persistence). User must start over.
- **After submit to /rechnung:** `serviceData` persists in sessionStorage. If user refreshes `/rechnung`, data is preserved.
- **sessionStorage cleared:** When browser tab/window is closed.
- **Missing sessionStorage on /rechnung:** Redirect back to `/product/fahrzeugabmeldung` (this redirect target may need updating for anmeldung — it currently goes to abmeldung page).

---

## 10. Technical Structure

### 10.1 File/Folder Structure

```
src/
  app/
    product/
      auto-online-anmelden/
        page.tsx                    # 703 lines — Server Component (product page)
    rechnung/
      page.tsx                      # 166 lines — Checkout page wrapper
      [invoiceNumber]/
        page.tsx                    # ~380 lines — SEPA invoice page
    bestellung-erfolgreich/
      page.tsx                      # 128 lines — Success page
    zahlung-fehlgeschlagen/
      page.tsx                      # 126 lines — Failure page
    api/
      upload/
        documents/
          route.ts                  # ~130 lines — File upload API
      checkout/
        direct/
          route.ts                  # 623 lines — Checkout API
      apply-coupon/
        route.ts                    # 112 lines — Coupon validation API
  components/
    RegistrationForm.tsx            # 1270 lines — 3-step wizard (client)
    CheckoutForm.tsx                # 427 lines — Checkout form (client)
    checkout/
      PaymentMethodSelector.tsx     # 425 lines — Payment methods
      OrderSummary.tsx              # 410 lines — Order summary + coupon
    ui/
      LicensePlateInput.tsx         # 877 lines — License plate input
      VehicleTypeSelector.tsx       # 150 lines — NOT USED in anmeldung
      FormErrorBanner.tsx           # 32 lines — Error banner
  lib/
    db.ts                           # 800+ lines — DB access functions
    payments.ts                     # 542 lines — Mollie integration
    paypal.ts                       # 403 lines — PayPal integration
    validations.ts                  # 149 lines — Zod schemas
    invoice-token.ts                # 27 lines — Invoice token HMAC
    rate-limit.ts                   # 80 lines — Rate limiting
    prisma.ts                       # Prisma client
public/
  images/
    example-fahrzeugschein-vorderseite.jpg
    example-fahrzeugschein-rueckseite.jpg
    example-fahrzeugbrief-vorderseite.jpg
    example-personalausweis-vorne.jpg
    example-personalausweis-hinten.jpg
    example-aufenthaltstitel-vorne.jpg
    example-aufenthaltstitel-hinten.jpg
    example-reisepass-vorne.jpg
    example-meldebescheinigung.gif
```

### 10.2 Reusable Components (shared with Fahrzeugabmeldung)

| Component | Shared? | Notes |
|---|---|---|
| `LicensePlateInput` | ✅ Yes | Used in both services |
| `FormErrorBanner` | ✅ Yes | Used in both services |
| `CheckoutForm` | ✅ Yes | Same checkout for both |
| `PaymentMethodSelector` | ✅ Yes | Same payment methods |
| `OrderSummary` | ✅ Yes | Same coupon + summary |
| `VehicleTypeSelector` | ❌ No | Only in Fahrzeugabmeldung |
| `ServiceForm` | ❌ No | Only in Fahrzeugabmeldung |
| `RegistrationForm` | ❌ No | Only in Anmeldung |

### 10.3 Key Differences from Fahrzeugabmeldung

| Aspect | Fahrzeugabmeldung | Auto Online Anmelden |
|---|---|---|
| **Form component** | `ServiceForm` (746 lines, 4 steps) | `RegistrationForm` (1270 lines, 3 steps) |
| **Steps** | 4 steps (Fahrzeugdaten, Fahrzeugschein-Code, Kennzeichen-Codes, Reservierung) | 3 steps (Service & Ausweis, Kennzeichen, Bankdaten & Kasse) |
| **File uploads** | None | 3-9 document uploads (photos of vehicle docs + ID) |
| **VehicleTypeSelector** | Yes (6 types) | No |
| **Service type selection** | Not applicable (single service) | Select dropdown (4 service types with different prices) |
| **ID verification** | Not required | Required (Personalausweis / Aufenthaltstitel / Reisepass) |
| **IBAN field** | No | Yes (for KFZ-Steuer Lastschrift) |
| **eVB Nummer** | No | Yes |
| **Price range** | Fixed base (19.70 €) + optional reservation | 99.70–179.10 € (service type + optionals) |
| **productId** | implicit `'abmeldung'` | `'anmeldung'` |
| **productSlug** | `'fahrzeugabmeldung'` | `'auto-online-anmelden'` |

---

## 11. Edge Cases & Validation Scenarios

### 11.1 Empty Submissions

- Each step validates only its own fields before advancing
- Step 1: all 3 fields must be filled (service, ausweis, evbNummer)
- Step 2: kennzeichenWahl + kennzeichenBestellen required; if reserviert → wunschkennzeichen + pin validated manually
- Step 3: kontoinhaber + iban validated by Zod; all required uploads checked on submit

### 11.2 Invalid Formats

| Field | Invalid Format Response |
|---|---|
| evbNummer < 6 chars | Error below field |
| evbNummer > 12 chars | Error below field |
| iban < 15 chars | Error below field |
| iban > 34 chars | Error below field |
| kontoinhaber < 2 chars | Error below field |
| wunschkennzeichen < 3 chars | Error below field (manual) |
| kennzeichenPin < 4 chars | Error below field (manual) |

### 11.3 File Upload Failures

- Network error during upload → error stored in `uploadErrors[fieldId]`, `formError` set
- `isSubmitting` set back to false
- `submittingRef.current` reset to false
- User can retry

### 11.4 Large File Handling

- Client compresses images > 3.5 MB automatically (JPEG, iterative quality reduction)
- Server rejects files > 10 MB
- Server rejects non-allowed file types

### 11.5 Partial Completion

- User can go back to previous steps freely
- Upload state persists across steps (files in `uploadedFiles` state)
- If user changes `service` or `ausweis` in Step 1 after uploading in Step 3 → required upload IDs change, previously uploaded files for now-unnecessary fields are ignored

### 11.6 Going Back to Previous Steps

- "Zurück" button: always available (no validation, just `setCurrentStep(s - 1)`)
- Step indicator: completed steps are clickable (`onClick → setCurrentStep(index)`)
- Pending steps are NOT clickable

### 11.7 Double-Submit Prevention

```typescript
const submittingRef = useRef(false);
// In onSubmit:
if (submittingRef.current) return;
submittingRef.current = true;
```

### 11.8 Upload Before Submit

Files are uploaded **during the submit process**, not during file selection. When user drops/selects a file, it's stored as a `File` object in local state. The actual `POST /api/upload/documents` calls happen only when the user clicks "Zur Kasse".

---

## 12. Responsiveness

### 12.1 Form Container

```
Max width: max-w-3xl (48rem / 768px)
Centered: mx-auto
Page container: max-w-4xl (56rem / 896px)
```

### 12.2 Form Padding

```
Desktop: px-6 md:px-10 py-8
Mobile: px-6 py-8
```

### 12.3 Step Indicator

| Viewport | Behavior |
|---|---|
| Desktop (md+) | Circle (w-12 h-12) + title text + description text shown |
| Mobile (<md) | Circle (w-10 h-10) only, text hidden (`hidden md:block`) |

### 12.4 Radio Cards (Kennzeichen bestellen)

```
Mobile: grid-cols-1 (single column)
Desktop (sm+): grid-cols-1 sm:grid-cols-2 (two columns)
```

### 12.5 Form Header

```
Desktop: text-2xl font-extrabold, px-10 py-6
Mobile: text-xl font-extrabold, px-6 py-6
```

### 12.6 Upload Help Buttons

```
Flex-wrap: buttons wrap to new line on mobile
```

### 12.7 Footer Navigation

```
flex items-center justify-between
- "Zurück" on left
- "Weiter" / "Zur Kasse" on right
```

### 12.8 showFullContent Sections (when enabled)

| Section | Layout |
|---|---|
| Hero trust badges | `flex flex-wrap justify-center gap-4` |
| Two CTA cards | `grid grid-cols-1 sm:grid-cols-2 gap-4` |
| 6-step cards | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5` |
| Price cards | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` |
| i-Kfz process | `grid grid-cols-1 md:grid-cols-2 gap-5` |
| Payment methods | `grid grid-cols-1 sm:grid-cols-3 gap-4` |
| Contact cards | `grid grid-cols-1 sm:grid-cols-3 gap-4` |
| FAQ | `space-y-3` (stacked) |

---

## Appendix A: JSON-LD Structured Data

### Service Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Auto Online Anmelden – KFZ Zulassung",
  "description": "Online-Zulassung Ihres Fahrzeugs beim KBA. 10-Tage-PDF sofort, Original per Post in 2–3 Werktagen.",
  "provider": {
    "@type": "Organization",
    "name": "Online Auto Abmelden",
    "url": "https://onlineautoabmelden.com"
  },
  "areaServed": { "@type": "Country", "name": "DE" },
  "offers": {
    "@type": "Offer",
    "price": "124.70",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
}
```

### Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "iKFZ Digital Zulassung UG",
  "url": "https://onlineautoabmelden.com",
  "logo": "https://onlineautoabmelden.com/logo.svg",
  "telephone": "+4915224999190",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+4915224999190",
    "contactType": "customer service",
    "availableLanguage": "German"
  },
  "sameAs": [
    "https://www.facebook.com/ikfzdigitalzulassung",
    "https://www.instagram.com/ikfz_digital_zulassung/",
    "https://www.youtube.com/@ikfzdigitalzulassung",
    "https://www.tiktok.com/@meldino_kfz"
  ]
}
```

## Appendix B: Theme & Design Tokens

Identical to Fahrzeugabmeldung report. Key values:

| Token | Value | Usage |
|---|---|---|
| `primary` | `#0D5581` | Buttons, headers, links |
| `primary-700` | `#093E5F` | Header gradient end |
| `accent` | `#8BC34A` | Submit button, success states |
| `dark` | `#0A1628` | Hero gradient |
| Font | Inter, Arial, sans-serif | All text |

## Appendix C: Environment Variables

Same as Fahrzeugabmeldung plus:

| Variable | Purpose |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage (optional, for file uploads) |

## Appendix D: Product Database Record

```
slug: 'auto-online-anmelden'
options (JSON): [
  { "key": "neuzulassung", "name": "Neuzulassung", "price": 124.70 },
  { "key": "ummeldung", "name": "Ummeldung", "price": 119.70 },
  { "key": "wiederzulassung", "name": "Wiederzulassung", "price": 99.70 },
  { "key": "neuwagen", "name": "Neuwagen Zulassung", "price": 124.70 },
  { "key": "kennzeichen_reserviert", "name": "Reserviertes Kennzeichen", "price": 24.70 },
  { "key": "kennzeichen_bestellen", "name": "Kennzeichen Bestellen", "price": 29.70 }
]
```

---

*End of report*
