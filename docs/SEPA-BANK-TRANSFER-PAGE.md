# تقرير: صفحة التحويل البنكي (SEPA Überweisung)

> **الهدف:** توثيق كامل لصفحة بيانات الحساب البنكي التي تظهر بعد اختيار "التحويل البنكي" كطريقة دفع — مع كل اللوجيك والتدفق والحساب البنكي.

---

## 1. التدفق الكامل (من اختيار الدفع إلى ظهور الصفحة)

```
عميل يختار "SEPA Überweisung" في Checkout
         ↓
[CheckoutForm.tsx] يرسل POST /api/checkout/direct
         ↓
[route.ts] يكتشف paymentMethod === 'sepa'
         ↓
   ┌─────────────────────────────────────────────┐
   │ 1. Order.status = "on-hold"                 │
   │ 2. triggerInvoiceEmail() → إيميل الفاتورة   │
   │ 3. لا يوجد paymentUrl (لا Mollie/PayPal)    │
   │ 4. يُولّد invoiceUrl مع HMAC token           │
   └─────────────────────────────────────────────┘
         ↓
Response: { invoiceUrl: "/rechnung/RE-2026-XXXX?order=2140&token=abc123..." }
         ↓
[CheckoutForm.tsx] window.location.href = result.invoiceUrl
         ↓
 ════════════════════════════════════════════
   صفحة /rechnung/[invoiceNumber] تظهر
   مع بيانات الحساب البنكي + الفاتورة
 ════════════════════════════════════════════
```

---

## 2. الملفات المتعلقة

| # | الملف | الغرض |
|---|-------|-------|
| 1 | `src/app/rechnung/[invoiceNumber]/page.tsx` | **الصفحة الرئيسية** — عرض بيانات البنك + الفاتورة |
| 2 | `src/components/PrintButton.tsx` | زر تحميل PDF الفاتورة |
| 3 | `src/lib/invoice-token.ts` | توليد + تحقق HMAC token للحماية |
| 4 | `src/app/api/invoice/[invoiceNumber]/pdf/route.ts` | API تحميل PDF الفاتورة |
| 5 | `src/app/api/checkout/direct/route.ts` | المكان الذي يُعالج فيه طلب SEPA في Checkout |
| 6 | `src/components/checkout/PaymentMethodSelector.tsx` | اختيار طريقة الدفع (يعرض "SEPA Überweisung") |
| 7 | `src/components/CheckoutForm.tsx` | الفورم – يعرّف طريقة SEPA ويتعامل مع الـ redirect |

---

## 3. بيانات الحساب البنكي (ثابتة في الكود)

```typescript
// src/app/rechnung/[invoiceNumber]/page.tsx — سطر 26-31
const BANK_DETAILS = {
  accountHolder: 'ikfz Digital-Zulassung UG (haftungsbeschränkt)',
  iban: 'DE70 3002 0900 5320 8804 65',
  bic: 'CMCIDEDD',
  bankName: 'Targobank',
  reference: 'Bestellnr.',  // + رقم الطلب
};
```

**ملاحظة:** الـ `Verwendungszweck` (سبب التحويل) يتم تكوينه ديناميكياً:
```typescript
const transferReference = `${orderNumber} - ${dbOrder.billingLast || invoiceNumber}`;
// مثال: "2140 - Mustermann"
```

---

## 4. تعريف SEPA في CheckoutForm

```typescript
// src/components/CheckoutForm.tsx — سطر 53-58
{
  id: 'sepa',
  label: 'SEPA Überweisung',
  icon: '/images/payment/sepa.svg',
  fee: 0.0,  // بدون رسوم إضافية
  description: 'Direkte Banküberweisung',
}
```

**الوصف في PaymentMethodSelector عند اختيار SEPA:**
```
"Bitte überweisen Sie den Gesamtbetrag auf unser Bankkonto. 
Die Bearbeitung beginnt nach Zahlungseingang."
```

**أيقونة SEPA في الـ Selector:**
```tsx
case 'sepa':
  return <Banknote className="w-6 h-6 text-gray-400" />;  // lucide-react
```

---

## 5. لوجيك SEPA في API الـ Checkout

```typescript
// src/app/api/checkout/direct/route.ts — سطر 430-452

if (body.paymentMethod === 'sepa') {
  // 1. تغيير حالة الطلب إلى "معلق" (ينتظر التحويل)
  await prisma.order.update({
    where: { id: localOrder.id },
    data: { status: 'on-hold' },
  });

  // 2. إرسال إيميل الفاتورة فوراً (لأنه لا يوجد redirect لمقدم دفع)
  const emailResult = await triggerInvoiceEmail(localOrder.id);
  if (!emailResult.success) {
    console.error(`[checkout] SEPA email failed for order #${nextOrderNum}: ${emailResult.error}`);
  }

  // 3. إرجاع invoiceUrl (بدون paymentUrl)
  return NextResponse.json({
    success: true,
    orderId: localOrder.id,
    orderNumber: nextOrderNum,
    total: totalFormatted,
    invoiceNumber: currentInvNumber,
    // لا يوجد paymentUrl — الفرونت يستخدم invoiceUrl
    invoiceUrl: `/rechnung/${currentInvNumber}?order=${nextOrderNum}&token=${generateInvoiceToken(currentInvNumber)}`,
  });
}
```

**الفرق بين SEPA وباقي طرق الدفع:**
| | PayPal/Mollie/Klarna | SEPA |
|---|---|---|
| **الحالة بعد الطلب** | `pending` (ينتظر الدفع) | `on-hold` (ينتظر التحويل) |
| **Redirect** | `paymentUrl` → صفحة مقدم الدفع | `invoiceUrl` → صفحة البنك |
| **إيميل الفاتورة** | بعد نجاح الدفع (webhook) | **فوراً** عند إنشاء الطلب |
| **رسوم إضافية** | حسب الطريقة (مثلاً PayPal €0.50) | **€0.00** |

---

## 6. نظام الحماية (HMAC Token)

الصفحة محمية بـ HMAC token — بدونه تعطي 404:

```typescript
// src/lib/invoice-token.ts

import { createHmac } from 'crypto';

const SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback-secret';

// توليد token (16 حرف hex = 64 bits)
export function generateInvoiceToken(invoiceNumber: string): string {
  return createHmac('sha256', SECRET)
    .update(invoiceNumber)
    .digest('hex')
    .slice(0, 16);
}

// تحقق من Token (مقاومة لـ timing attacks)
export function verifyInvoiceToken(invoiceNumber: string, token: string): boolean {
  const expected = generateInvoiceToken(invoiceNumber);
  if (expected.length !== token.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return result === 0;
}
```

**URL المكتمل:**
```
/rechnung/RE-2026-2140?order=2140&token=a3f8c1d2e5b7f9a0
```

---

## 7. بنية الصفحة الكاملة (UI Layout)

**Route:** `/rechnung/[invoiceNumber]`  
**ملف:** `src/app/rechnung/[invoiceNumber]/page.tsx`  
**نوع:** Server Component (SSR)  
**SEO:** `robots: { index: false, follow: false }` — لا تظهر في محركات البحث  
**Cache:** `revalidate = 60` ثانية

```
┌─────────────────────────────────────────────────────────┐
│  ─── HEADER (gradient: dark → primary-900 → dark) ──── │
│                                                         │
│  [أيقونة FileText في دائرة accent/20]                   │
│                                                         │
│  Rechnung RE-2026-2140                                  │
│  "Vielen Dank für Ihre Bestellung! Bitte überweisen     │
│   Sie den Gesamtbetrag auf unser Bankkonto."            │
│                                                         │
│  Bestellnummer: #2140  (accent, bold)                   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  max-w-3xl mx-auto, -mt-6 (يتداخل مع الهيدر)          │
│                                                         │
│  ╔═══════════════════════════════════════════════════╗  │
│  ║  بطاقة بيانات البنك (الرئيسية)                    ║  │
│  ║  border-2 border-primary/20, shadow-lg             ║  │
│  ║                                                   ║  │
│  ║  [Building2 icon]  Bankverbindung                 ║  │
│  ║                    SEPA-Überweisung                ║  │
│  ║                                                   ║  │
│  ║  ┌─ bg-gray-50 rounded-xl ──────────────────────┐ ║  │
│  ║  │                                              │ ║  │
│  ║  │  Kontoinhaber                                │ ║  │
│  ║  │  ikfz Digital-Zulassung UG                   │ ║  │
│  ║  │  (haftungsbeschränkt)                        │ ║  │
│  ║  │  ────────────────────────────────────────    │ ║  │
│  ║  │  IBAN                                        │ ║  │
│  ║  │  DE70 3002 0900 5320 8804 65  (font-mono)    │ ║  │
│  ║  │  ────────────────────────────────────────    │ ║  │
│  ║  │  BIC / SWIFT                                 │ ║  │
│  ║  │  CMCIDEDD  (font-mono)                       │ ║  │
│  ║  │  ────────────────────────────────────────    │ ║  │
│  ║  │  Bank                                        │ ║  │
│  ║  │  Targobank                                   │ ║  │
│  ║  │  ────────────────────────────────────────    │ ║  │
│  ║  │  Verwendungszweck                            │ ║  │
│  ║  │  2140 - Mustermann  (font-mono, text-primary)│ ║  │
│  ║  └──────────────────────────────────────────────┘ ║  │
│  ║                                                   ║  │
│  ║  ┌─ المبلغ (bg-primary/5, border-primary/20) ──┐ ║  │
│  ║  │  Zu überweisender Betrag                     │ ║  │
│  ║  │  inkl. 19% MwSt.                             │ ║  │
│  ║  │                          24,40 €  (3xl bold)  │ ║  │
│  ║  └──────────────────────────────────────────────┘ ║  │
│  ║                                                   ║  │
│  ║  ┌─ تحذير هام (amber-50, border-amber-200) ────┐ ║  │
│  ║  │  [Clock icon] Wichtiger Hinweis:             │ ║  │
│  ║  │  Bitte geben Sie im Verwendungszweck         │ ║  │
│  ║  │  unbedingt „2140 - Mustermann" an,           │ ║  │
│  ║  │  damit wir Ihre Zahlung zuordnen können.     │ ║  │
│  ║  │  Die Bearbeitung beginnt unmittelbar nach    │ ║  │
│  ║  │  Zahlungseingang.                            │ ║  │
│  ║  └──────────────────────────────────────────────┘ ║  │
│  ╚═══════════════════════════════════════════════════╝  │
│                                                         │
│  ╔═══════════════════════════════════════════════════╗  │
│  ║  تفاصيل الفاتورة (Rechnungsdetails)               ║  │
│  ║  border-gray-100, shadow-sm                        ║  │
│  ║                                                   ║  │
│  ║  [CreditCard icon] Rechnungsdetails               ║  │
│  ║                                                   ║  │
│  ║  ┌─ بيانات العميل (grid 2 cols) ──────────────┐  ║  │
│  ║  │  Rechnungsnummer    │  Datum                │  ║  │
│  ║  │  RE-2026-2140       │  02.04.2026           │  ║  │
│  ║  │                     │                       │  ║  │
│  ║  │  Kunde              │  E-Mail               │  ║  │
│  ║  │  Max Mustermann     │  max@example.com      │  ║  │
│  ║  │  Musterstr. 14      │                       │  ║  │
│  ║  │  45141 Essen        │                       │  ║  │
│  ║  └─────────────────────┴───────────────────────┘  ║  │
│  ║                                                   ║  │
│  ║  ┌─ جدول العناصر ──────────────────────────────┐  ║  │
│  ║  │  BESCHREIBUNG      │ MENGE │ BETRAG          │  ║  │
│  ║  │  Fahrzeugabmeldung │   1   │ 19,70 €         │  ║  │
│  ║  │  Zahlungsgebühr    │   1   │  0,50 €         │  ║  │
│  ║  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│  ║  │
│  ║  │  Nettobetrag                     16,97 €     │  ║  │
│  ║  │  MwSt. (19%)                      3,23 €     │  ║  │
│  ║  │  ═══════════════════════════════════════════ │  ║  │
│  ║  │  Gesamtbetrag           20,20 €ᵖʳⁱᵐᵃʳʸ      │  ║  │
│  ║  └──────────────────────────────────────────────┘  ║  │
│  ║                                                   ║  │
│  ║  Zahlungsmethode: SEPA • Zahlungsstatus: Ausstehend║  │
│  ╚═══════════════════════════════════════════════════╝  │
│                                                         │
│  ╔═══════════════════════════════════════════════════╗  │
│  ║  الخطوات التالية (Wie geht es weiter?)             ║  │
│  ║                                                   ║  │
│  ║  [CheckCircle icon + accent]                      ║  │
│  ║                                                   ║  │
│  ║  ① Überweisen Sie 20,20 € an die oben genannte    ║  │
│  ║     Bankverbindung mit dem Verwendungszweck       ║  │
│  ║     „2140 - Mustermann".                          ║  │
│  ║                                                   ║  │
│  ║  ② Sobald Ihre Zahlung bei uns eingegangen ist    ║  │
│  ║     (in der Regel 1–2 Werktage), erhalten Sie     ║  │
│  ║     eine Bestätigung per E-Mail.                  ║  │
│  ║                                                   ║  │
│  ║  ③ Unser Team beginnt dann sofort mit der         ║  │
│  ║     Bearbeitung Ihrer Fahrzeugabmeldung.          ║  │
│  ╚═══════════════════════════════════════════════════╝  │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────────────┐    │
│  │ [Download] Rechnung │  │ [←] Zurück zur Startseite │    │
│  │    drucken (primary) │  │    (gray-100)              │    │
│  └──────────────────┘  └──────────────────────────┘    │
│                                                         │
│  ╔═══════════════════════════════════════════════════╗  │
│  ║  الدعم (Support)                                   ║  │
│  ║  gradient: primary/4% → accent/4%                  ║  │
│  ║                                                   ║  │
│  ║  [Phone icon]  Fragen zur Überweisung?            ║  │
│  ║                Unser Support-Team hilft Ihnen.    ║  │
│  ║                                                   ║  │
│  ║                 [☎ {phone}]  (primary button)      ║  │
│  ╚═══════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────┘
```

---

## 8. كومبوننت PrintButton (تحميل PDF)

**ملف:** `src/components/PrintButton.tsx`  
**نوع:** Client Component (`'use client'`)

```typescript
export default function PrintButton({ invoiceNumber }: { invoiceNumber: string }) {
  // 1. يضغط المستخدم زر "Rechnung drucken"
  // 2. fetch(`/api/invoice/${invoiceNumber}/pdf`)
  // 3. يحول Response → Blob → Object URL
  // 4. ينشئ <a> مخفي ويضغطه لتنزيل الملف
  // 5. اسم الملف: `Rechnung-${invoiceNumber}.pdf`
}
```

**الحالات:**
| الحالة | العرض |
|--------|-------|
| جاهز | `[Download icon] Rechnung drucken` |
| يتم التحميل | `[Loader2 spinning] Wird erstellt...` (disabled) |
| خطأ | Alert: "PDF konnte nicht heruntergeladen werden..." |

---

## 9. API تحميل PDF

**Route:** `GET /api/invoice/[invoiceNumber]/pdf`  
**ملف:** `src/app/api/invoice/[invoiceNumber]/pdf/route.ts`

```
1. Validation: invoiceNumber يطابق /^RE-\d{4}-\d+$/
2. Security: token مطلوب + verifyInvoiceToken()
3. جلب Invoice من DB (بالـ orderId)
4. generateInvoicePDF(orderId) → PDF buffer
5. Response: application/pdf مع Content-Disposition: attachment
6. Cache: private, no-cache
```

---

## 10. بيانات الـ Prisma المستخدمة

الصفحة تجلب البيانات بـ query واحد:

```typescript
const invoice = await prisma.invoice.findFirst({
  where: { invoiceNumber: decodeURIComponent(invoiceNumber) },
  include: {
    order: {
      select: {
        orderNumber: true,
        billingFirst: true,
        billingLast: true,
        billingEmail: true,
        billingStreet: true,
        billingCity: true,
        billingPostcode: true,
        billingPhone: true,
        productName: true,
        total: true,
        subtotal: true,
        paymentFee: true,
        createdAt: true,
      },
    },
  },
});
```

**البيانات المستخدمة من Invoice:**
- `invoice.invoiceNumber` — رقم الفاتورة
- `invoice.total` — المبلغ الإجمالي
- `invoice.taxAmount` — مبلغ الضريبة
- `invoice.items` — JSON string → `[{name, quantity, price, total}]`
- `invoice.paymentMethod` — "SEPA Überweisung"

**البيانات المستخدمة من Order:**
- `orderNumber` — رقم الطلب
- `billingFirst`, `billingLast` — اسم العميل
- `billingEmail` — البريد الإلكتروني
- `billingStreet`, `billingCity`, `billingPostcode` — العنوان
- `createdAt` — تاريخ الطلب (يُنسق بالألمانية)

**الـ items parsing:**
```typescript
const items = JSON.parse(invoice.items || '[]') as Array<{
  name: string;
  quantity: number;
  price: number;
  total: number;
}>;
```

---

## 11. إعدادات الموقع (Site Settings)

الصفحة تجلب إعدادات الموقع لرقم الهاتف:

```typescript
const settings = await getSiteSettings();

// يُستخدم في:
<a href={settings.phoneLink}> {settings.phone} </a>
```

---

## 12. حساب الضريبة (Tax)

```typescript
// Nettobetrag (صافي بدون ضريبة):
(invoice.total / 1.19).toFixed(2)

// MwSt. 19%:
invoice.taxAmount.toFixed(2)

// إجمالي:
invoice.total.toFixed(2)
```

**التنسيق:** دائماً بالألمانية — `.` تتحول إلى `,`:
```typescript
invoice.total.toFixed(2).replace('.', ',')  // "20,20"
```

---

## 13. Tailwind Classes المهمة

| العنصر | الـ Classes |
|--------|-----------|
| **الصفحة** | `min-h-screen bg-gray-50 pb-20` |
| **Header** | `bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-32 pb-14` |
| **المحتوى** | `max-w-3xl mx-auto px-4 -mt-6 space-y-6 relative z-10` |
| **بطاقة البنك** | `bg-white rounded-2xl border-2 border-primary/20 shadow-lg p-6 md:p-8` |
| **بطاقة الفاتورة** | `bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8` |
| **IBAN/BIC** | `font-mono tracking-wider` |
| **Verwendungszweck** | `font-mono text-primary font-bold` |
| **المبلغ** | `text-3xl font-extrabold text-primary` |
| **تحذير** | `bg-amber-50 border border-amber-200 rounded-xl p-4` |
| **الخطوات (أرقام)** | `w-7 h-7 bg-primary/10 text-primary rounded-full` |
| **زر PDF** | `bg-primary hover:bg-primary-700 text-white font-bold px-6 py-4 rounded-xl` |
| **زر الرجوع** | `bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-4 rounded-xl` |
| **بطاقة الدعم** | `bg-gradient-to-r from-primary/[0.04] to-accent/[0.04] rounded-2xl` |
| **print:hidden** | أزرار الإجراءات مخفية عند الطباعة |

---

## 14. Lucide Icons المستخدمة

```typescript
import {
  FileText,    // أيقونة الهيدر (داخل دائرة accent)
  Building2,   // أيقونة بيانات البنك
  CreditCard,  // أيقونة تفاصيل الفاتورة
  Clock,       // أيقونة التحذير الهام
  CheckCircle, // أيقونة "ما التالي؟"
  Phone,       // أيقونة الدعم + زر الاتصال
  ArrowLeft,   // أيقونة زر الرجوع
} from 'lucide-react';

// في PrintButton:
import { Download, Loader2 } from 'lucide-react';
```

---

## 15. Dependencies

| المكتبة | الاستخدام |
|---------|----------|
| `next` | App Router, Server Component, Metadata, notFound(), Link |
| `@prisma/client` | جلب Invoice + Order |
| `lucide-react` | جميع الأيقونات |
| `crypto` (Node.js built-in) | HMAC-SHA256 للـ token |

---

## 16. ملخص — ما يحتاج المطور لتنفيذه

### الملفات المطلوبة:
1. **`src/app/rechnung/[invoiceNumber]/page.tsx`** — الصفحة الرئيسية (Server Component)
2. **`src/components/PrintButton.tsx`** — زر تحميل PDF (Client Component)
3. **`src/lib/invoice-token.ts`** — توليد + تحقق HMAC token
4. **`src/app/api/invoice/[invoiceNumber]/pdf/route.ts`** — API تحميل PDF

### البيانات الثابتة المطلوبة:
```
accountHolder: ikfz Digital-Zulassung UG (haftungsbeschränkt)
IBAN:          DE70 3002 0900 5320 8804 65
BIC:           CMCIDEDD
Bank:          Targobank
```

### في Checkout API (عند `paymentMethod === 'sepa'`):
1. `Order.status = 'on-hold'`
2. إرسال إيميل الفاتورة فوراً
3. إرجاع `invoiceUrl` مع HMAC token (بدون `paymentUrl`)

### Environment Variable مطلوب:
```
NEXTAUTH_SECRET أو JWT_SECRET  ← يُستخدم كمفتاح HMAC
```
