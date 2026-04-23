# تقرير شامل: صفحة Zahlungen (إدارة الدفع) + ربط موقع الزوار

> **المشروع المصدر:** Project A — onlineautoabmelden.com  
> **التاريخ:** 2025-07-25  
> **الغرض:** توثيق كامل لصفحة إدارة بوابات الدفع في لوحة التحكم وكيفية ربطها بصفحة الدفع للزوار — للتنفيذ في Project B

---

## جدول المحتويات

1. [نظرة عامة على النظام](#1-نظرة-عامة-على-النظام)
2. [قاعدة البيانات — PaymentGateway Model](#2-قاعدة-البيانات)
3. [البيانات الأولية — Seed Data](#3-البيانات-الأولية)
4. [صفحة Admin: Zahlungen — لوحة التحكم](#4-صفحة-admin-zahlungen)
5. [API لوحة التحكم](#5-api-لوحة-التحكم)
6. [ربط البيانات بموقع الزوار — Checkout Page](#6-ربط-البيانات-بموقع-الزوار)
7. [مكون اختيار طريقة الدفع — PaymentMethodSelector](#7-مكون-اختيار-طريقة-الدفع)
8. [تدفق الدفع الكامل — حسب كل طريقة](#8-تدفق-الدفع-الكامل)
9. [Callbacks + Webhooks](#9-callbacks--webhooks)
10. [دليل مسارات الملفات الكامل](#10-دليل-مسارات-الملفات-الكامل)
11. [خطوات التنفيذ للمطور](#11-خطوات-التنفيذ-للمطور)

---

## 1. نظرة عامة على النظام

النظام يعمل بشكل ديناميكي بالكامل — **لا يوجد hardcode** لبوابات الدفع:

```
┌──────────────────────────────────────────────────────────────┐
│                     لوحة التحكم (Admin)                      │
│                                                              │
│   صفحة Zahlungen → تفعيل/تعطيل بوابات + تعديل الرسوم       │
│         ↓ (PUT /api/admin/payments)                          │
│   قاعدة البيانات (PaymentGateway table)                      │
│         ↓ (getEnabledPaymentMethods)                        │
│   صفحة الدفع للزوار ← تعرض فقط البوابات المفعّلة           │
│         ↓ (POST /api/checkout/direct)                       │
│   التوجيه التلقائي → PayPal أو Mollie أو SEPA              │
└──────────────────────────────────────────────────────────────┘
```

**المثال:** لو الأدمن عطّل Apple Pay من لوحة التحكم → يختفي تلقائياً من صفحة الدفع بدون أي تعديل كود.

---

## 2. قاعدة البيانات

### Prisma Schema

**الملف:** `prisma/schema.prisma` (سطر 238-254)

```prisma
model PaymentGateway {
  id          String   @id @default(cuid())
  gatewayId   String   @unique            // المفتاح الفريد: mollie_creditcard, paypal, etc.
  name        String                       // الاسم المعروض: "Kredit- / Debitkarte"
  description String   @default("")        // الوصف: "Visa, Mastercard via Mollie"
  isEnabled   Boolean  @default(false)     // مفعّل أو معطّل
  fee         Float    @default(0)         // رسوم إضافية بالـ EUR
  apiKey      String   @default("")        // مفتاح API (اختياري)
  secretKey   String   @default("")        // مفتاح سري (اختياري)
  mode        String   @default("live")    // "live" أو "test"
  icon        String   @default("")        // مسار أيقونة SVG
  sortOrder   Int      @default(0)         // ترتيب العرض
  settings    String   @default("{}")      // إعدادات إضافية JSON
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Gateway IDs المستخدمة

| `gatewayId` (DB) | Checkout ID | الوصف |
|---|---|---|
| `mollie_creditcard` | `credit_card` | Visa, Mastercard عبر Mollie |
| `mollie_applepay` | `apple_pay` | Apple Pay عبر Mollie |
| `mollie_klarna` | `klarna` | Klarna عبر Mollie |
| `paypal` | `paypal` | PayPal مباشر (REST API v2) |
| `sepa` | `sepa` | تحويل بنكي — بدون مزود خارجي |

### خريطة التحويل (Gateway ID Map)

**الملف:** `src/lib/db.ts` (سطر 238-256)

```typescript
const GATEWAY_ID_MAP: Record<string, string> = {
  mollie_creditcard: 'credit_card',
  mollie_applepay: 'apple_pay',
  mollie_klarna: 'klarna',
  paypal: 'paypal',
  sepa: 'sepa',
};

const REVERSE_GATEWAY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(GATEWAY_ID_MAP).map(([k, v]) => [v, k])
);
```

**السبب:** قاعدة البيانات تحفظ `mollie_creditcard` لكن الـ Checkout يستخدم `credit_card` — الـ Map يحول بينهم.

---

## 3. البيانات الأولية

### Seed Data

**الملف:** `prisma/seed.ts` (سطر 67-122)

```typescript
const gateways = [
  {
    gatewayId: 'mollie_creditcard',
    name: 'Kredit- / Debitkarte',
    description: 'Visa, Mastercard, American Express via Mollie',
    isEnabled: true,
    fee: 0.50,                            // رسوم 50 سنت
    icon: '/images/payment/card.svg',
    sortOrder: 1,
  },
  {
    gatewayId: 'paypal',
    name: 'PayPal',
    description: 'Schnell & sicher mit PayPal bezahlen',
    isEnabled: true,
    fee: 0.00,
    icon: '/images/payment/paypal.svg',
    sortOrder: 2,
  },
  {
    gatewayId: 'mollie_applepay',
    name: 'Apple Pay',
    description: 'Bezahlen mit Apple Pay via Mollie',
    isEnabled: true,
    fee: 0.00,
    icon: '/images/payment/applepay.svg',
    sortOrder: 3,
  },
  {
    gatewayId: 'sepa',
    name: 'SEPA-Überweisung',
    description: 'Direkte Banküberweisung – keine Gebühren',
    isEnabled: true,
    fee: 0.00,
    icon: '/images/payment/sepa.svg',
    sortOrder: 4,
  },
  {
    gatewayId: 'mollie_klarna',
    name: 'Klarna',
    description: 'Sofort bezahlen, später zahlen oder in Raten via Klarna',
    isEnabled: true,
    fee: 0.00,
    icon: '/images/payment/klarna.svg',
    sortOrder: 5,
  },
];

for (const gw of gateways) {
  await prisma.paymentGateway.upsert({
    where: { gatewayId: gw.gatewayId },
    update: {},
    create: gw,
  });
}
```

---

## 4. صفحة Admin: Zahlungen

### وصف الصفحة (كما في الصورة)

الصفحة تعرض:

1. **إحصائيات عامة** (4 بطاقات):
   - Gesamtumsatz (إجمالي الإيرادات)
   - Transaktionen (عدد المعاملات)
   - Aktive Gateways (عدد البوابات المفعّلة)
   - Inaktive Gateways (عدد البوابات المعطّلة)

2. **إحصائيات لكل بوابة** (إيرادات + عدد معاملات لكل طريقة دفع)

3. **بطاقات البوابات** (كل بوابة تعرض):
   - الاسم + `gatewayId`
   - زر تفعيل/تعطيل (Toggle)
   - حقل الرسوم (Gebühr) — قابل للتعديل مباشرة
   - المود (Live/Test)

### الكود الكامل

**الملف:** `src/app/admin/(dashboard)/payments/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Activity, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PageHeader, StatsCard, Toast } from '@/components/admin/ui';
import { usePayments } from '@/lib/admin-api';

export default function PaymentsPage() {
  const { data, isLoading: loading, mutate } = usePayments();
  const [gateways, setGateways] = useState<any[]>([]);
  const [paymentStats, setPaymentStats] = useState<any[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (data) {
      setGateways(data.gateways || []);
      setPaymentStats(data.paymentStats || []);
    }
  }, [data]);

  // تفعيل/تعطيل بوابة
  const toggleGateway = async (gateway: any) => {
    setSaving(gateway.id);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: gateway.id, isEnabled: !gateway.isEnabled }),
      });
      if (res.ok) {
        const updated = await res.json();
        setGateways(gateways.map((g) => (g.id === updated.id ? updated : g)));
        setToast({ message: `${gateway.name} ${!gateway.isEnabled ? 'aktiviert' : 'deaktiviert'}`, type: 'success' });
      }
    } catch {
      setToast({ message: 'Fehler beim Aktualisieren', type: 'error' });
    } finally {
      setSaving(null);
    }
  };

  // تعديل الرسوم
  const updateFee = async (gateway: any, fee: number) => {
    setSaving(gateway.id);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: gateway.id, fee }),
      });
      if (res.ok) {
        const updated = await res.json();
        setGateways(gateways.map((g) => (g.id === updated.id ? updated : g)));
        setToast({ message: 'Gebühr aktualisiert', type: 'success' });
      }
    } catch {
      setToast({ message: 'Fehler beim Speichern', type: 'error' });
    } finally {
      setSaving(null);
    }
  };
```

### جلب البيانات (SWR Hook)

**الملف:** `src/lib/admin-api.ts` (سطر 220-227)

```typescript
export function usePayments(config?: SWRConfiguration) {
  return useSWR('/api/admin/payments', fetcher, {
    ...HP_CONFIG,
    dedupingInterval: 30_000,     // 30 ثانية cache
    ...config,
  });
}
```

---

## 5. API لوحة التحكم

### GET `/api/admin/payments` — جلب البيانات

**الملف:** `src/app/api/admin/payments/route.ts`

```typescript
export async function GET() {
  // 1. جلب كل البوابات مرتبة
  const gateways = await prisma.paymentGateway.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  // 2. إحصائيات الدفع مجمّعة حسب البوابة
  const payments = await prisma.payment.groupBy({
    by: ['gatewayId'],
    _sum: { amount: true },
    _count: true,
  });

  return NextResponse.json({ gateways, paymentStats: payments });
}
```

### PUT `/api/admin/payments` — تحديث بوابة

```typescript
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const gateway = await prisma.paymentGateway.update({
    where: { id: body.id },
    data: {
      isEnabled: body.isEnabled,
      fee: body.fee,
      apiKey: body.apiKey,
      secretKey: body.secretKey,
      mode: body.mode,
      sortOrder: body.sortOrder,
    },
  });

  // إعادة تحميل الـ Cache لتحديث صفحة الدفع فوراً
  revalidatePath('/rechnung');
  revalidatePath('/');
  revalidateTag('payment-gateways');

  return NextResponse.json(gateway);
}
```

**ملاحظة مهمة:** بعد أي تحديث، يتم مسح الـ cache تلقائياً (`revalidateTag('payment-gateways')`) فتظهر التغييرات فوراً في صفحة الدفع للزوار.

### Debug API (للتشخيص)

**الملف:** `src/app/api/admin/payments/debug/route.ts`

```
GET /api/admin/payments/debug?orderId=xxx       → فحص حالة طلب
GET /api/admin/payments/debug?orderNumber=2075  → بحث برقم الطلب
GET /api/admin/payments/debug?health=1          → اختبار اتصال Mollie
GET /api/admin/payments/debug?methods=1         → عرض طرق Mollie المتاحة
GET /api/admin/payments/debug?recent=10         → آخر 10 مدفوعات فاشلة
```

---

## 6. ربط البيانات بموقع الزوار

### كيف يعمل الربط؟

```
Admin يفعّل PayPal + Credit Card (isEnabled: true)
         ↓
DB table: PaymentGateway (5 rows, 2 enabled)
         ↓
Server Component: getEnabledPaymentMethods()
         ↓
يرجع فقط البوابات المفعّلة [{id: 'paypal', label: 'PayPal', fee: 0}, ...]
         ↓
CheckoutForm component يستقبلهم كـ props
         ↓
PaymentMethodSelector يعرضهم كـ radio buttons
         ↓
العميل يختار ويضغط "دفع"
         ↓
POST /api/checkout/direct → يتحقق من الـ DB مرة ثانية
         ↓
يوجّه للمزود المناسب (PayPal / Mollie / SEPA)
```

### صفحة الدفع للزوار

**الملف:** `src/app/rechnung/page.tsx`

```typescript
export default async function CheckoutPage() {
  // جلب البوابات المفعّلة من قاعدة البيانات — Server Side
  const paymentMethods = await getEnabledPaymentMethods();
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero section + trust badges */}
      <CheckoutForm paymentMethods={paymentMethods} />
    </>
  );
}
```

### دالة جلب البوابات المفعّلة

**الملف:** `src/lib/db.ts` (سطر 259-280)

```typescript
export async function getEnabledPaymentMethods() {
  const gateways = await prisma.paymentGateway.findMany({
    where: { isEnabled: true },           // فقط المفعّلة
    orderBy: { sortOrder: 'asc' },        // بالترتيب
    select: {
      gatewayId: true,
      name: true,
      description: true,
      fee: true,
      icon: true,
    },
  });

  return gateways.map((g) => ({
    id: GATEWAY_ID_MAP[g.gatewayId] || g.gatewayId,   // mollie_creditcard → credit_card
    label: g.name,
    description: g.description,
    fee: g.fee,              // ← الرسوم من لوحة التحكم
    icon: g.icon,
  }));
}
```

### حساب المبلغ النهائي

**الملف:** `src/components/CheckoutForm.tsx`

```typescript
const { paymentFee, subtotal, total, discountAmount } = useMemo(() => {
  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selectedPayment);
  const fee = selectedMethod?.fee ?? 0;     // رسوم البوابة من الـ DB
  const sub = productPrice;
  const discount = appliedCoupon?.discountAmount ?? 0;

  return {
    paymentFee: fee,
    subtotal: sub,
    total: Math.max(sub - discount + fee, 0),   // المبلغ = المنتج - الخصم + رسوم الدفع
    discountAmount: discount,
  };
}, [PAYMENT_METHODS, selectedPayment, productPrice, appliedCoupon]);
```

**مثال:**
- سعر المنتج: €19.70
- الأدمن حط رسوم على Credit Card: €0.50
- العميل اختار Credit Card
- النتيجة: €19.70 + €0.50 = **€20.20**

### تأكيد البوابة في الـ Backend

**الملف:** `src/app/api/checkout/direct/route.ts`

```typescript
// الـ Backend يتحقق مرة ثانية إن البوابة مفعّلة
const gateway = await getPaymentGatewayByCheckoutId(body.paymentMethod);

if (!gateway) {
  return NextResponse.json(
    { error: 'Bitte wählen Sie eine gültige, aktive Zahlungsmethode.' },
    { status: 400 },
  );
}

// يستخدم الرسوم من الـ DB مش من الـ Frontend (أمان)
const paymentFee = gateway.fee;
const orderTotal = Math.max(productPrice - discountAmount + paymentFee, 0);
```

> **⚠️ أمان:** الرسوم تُحسب من قاعدة البيانات في الـ Backend — ليس من الـ Frontend. حتى لو العميل عدّل القيمة، الـ Backend يتجاهلها ويجيب القيمة الصحيحة.

---

## 7. مكون اختيار طريقة الدفع

**الملف:** `src/components/checkout/PaymentMethodSelector.tsx`

### الوصف لكل طريقة دفع

```typescript
const PAYMENT_DESCRIPTIONS: Record<string, React.ReactNode> = {
  paypal: (
    <p>Zahlen Sie sicher und schnell mit PayPal...</p>
  ),
  apple_pay: (
    <p>Bezahlen Sie bequem und sicher mit Apple Pay...</p>
  ),
  credit_card: (
    <div className="space-y-3">
      <p>Zahlen Sie sicher per Kredit- oder Debitkarte...</p>
      <p className="text-xs text-gray-400">
        Sichere Zahlungen bereitgestellt durch <strong>mollie</strong>
      </p>
    </div>
  ),
  sepa: (
    <p>Bitte überweisen Sie den Gesamtbetrag auf unser Bankkonto...</p>
  ),
  klarna: (
    <div>
      <p>Bezahlen Sie flexibel mit Klarna – sofort, später oder in Raten.</p>
      <p>Sichere Zahlungen durch <strong>Klarna</strong> via <strong>mollie</strong></p>
    </div>
  ),
};
```

### شكل العرض

كل طريقة دفع تتولد ديناميكياً من الـ `methods` prop:

```typescript
{methods.map((method) => (
  <label className={`... ${isSelected ? 'border-primary' : 'border-gray-100'}`}>
    <input type="radio" value={method.id} {...register('paymentMethod')} />
    <span>{method.label}</span>
    <PaymentBrandIcon methodId={method.id} />
  </label>
))}
```

### حالة Klarna الخاصة

Klarna يطلب بيانات إضافية (الاسم الأول + الاسم الأخير) — تظهر حقول إضافية عند اختياره:

```typescript
{isKlarna && (
  <div className="grid sm:grid-cols-2 gap-5">
    <input {...register('firstName')} placeholder="Max" />
    <input {...register('lastName')} placeholder="Mustermann" />
  </div>
)}
```

---

## 8. تدفق الدفع الكامل

### توجيه الدفع حسب الطريقة المختارة

**الملف:** `src/app/api/checkout/direct/route.ts`

```typescript
// 1. طلب مجاني (كوبون يغطي 100%)
if (orderTotal <= 0) {
  → حالة الطلب = "processing" — لا حاجة لمزود دفع
}

// 2. SEPA (تحويل بنكي)
if (body.paymentMethod === 'sepa') {
  → حالة الطلب = "on-hold"
  → يعرض بيانات الحساب البنكي للعميل
  → لا يوجد redirect لمزود خارجي
}

// 3. PayPal
if (body.paymentMethod === 'paypal') {
  → createPayPalOrder() → PayPal REST API v2
  → يرجع approvalUrl → العميل يروح PayPal يدفع
  → يرجع لـ /api/payment/paypal/capture → يتم Capture
}

// 4. Mollie (credit_card, apple_pay, klarna)
else {
  → createMolliePayment() → Mollie API
  → يرجع checkoutUrl → العميل يروح Mollie يدفع
  → يرجع لـ /api/payment/callback → يتم التحقق
}
```

### رسم بياني للتدفق

```
العميل يملأ الفورم ويختار طريقة الدفع
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      SEPA       PayPal    Mollie (CC/Apple/Klarna)
        │           │           │
   on-hold     PayPal API   Mollie API
   + بيانات       │           │
   بنكية     ┌────┘     ┌────┘
              ▼          ▼
         Redirect    Redirect
         to PayPal   to Mollie
              │          │
         Customer    Customer
          pays        pays
              │          │
              ▼          ▼
      /paypal/capture  /payment/callback
              │          │
         capturePayPal  getMollieStatus
              │          │
              ▼          ▼
         DB Update    DB Update
         + Email      + Email
              │          │
              ▼          ▼
     /bestellung-erfolgreich (Success Page)
              
         ─── Webhook (Safety Net) ───
              │          │
   /paypal/webhook  /payment/webhook
```

---

## 9. Callbacks + Webhooks

### Mollie Callback (العميل يرجع بعد الدفع)

**الملف:** `src/app/api/payment/callback/route.ts`

```typescript
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId');
  
  // جلب الطلب من الـ DB
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  // التحقق من حالة الدفع من Mollie API (مش من الـ URL)
  const mollieStatus = payment.transactionId.startsWith('ord_')
    ? await getMollieOrderStatus(payment.transactionId)     // Klarna
    : await getMolliePaymentStatus(payment.transactionId);  // CC/Apple Pay

  if (mollieStatus.status === 'paid') {
    // تحديث الطلب + إرسال الفاتورة بالإيميل
    await prisma.order.update({ data: { status: 'processing' } });
    await triggerInvoiceEmail(orderId);
    return redirect('/bestellung-erfolgreich');
  }
}
```

### PayPal Capture (العميل يرجع بعد الموافقة)

**الملف:** `src/app/api/payment/paypal/capture/route.ts`

```typescript
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId');
  
  // Capture الدفعة من PayPal API
  const captureResult = await capturePayPalOrder(payment.transactionId);

  if (captureResult.status === 'COMPLETED') {
    await prisma.order.update({ data: { status: 'processing' } });
    await triggerInvoiceEmail(orderId);
    return redirect('/bestellung-erfolgreich');
  }
}
```

### Mollie Webhook (شبكة أمان)

**الملف:** `src/app/api/payment/webhook/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const body = await request.formData();
  const mollieId = body.get('id') as string;    // Mollie ترسل فقط الـ ID

  // نجيب الحالة الفعلية من Mollie API — لا نثق في body الـ webhook
  const molliePayment = await getMolliePaymentStatus(mollieId);

  if (molliePayment.status === 'paid') {
    // تحديث الطلب لو لسه ما اتحدّش
    if (order.status !== 'processing') {
      await prisma.order.update({ data: { status: 'processing' } });
      await triggerInvoiceEmail(orderId);
    }
  }
}
```

### PayPal Webhook (شبكة أمان)

**الملف:** `src/app/api/payment/paypal/webhook/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();

  switch (body.event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      // تحديث الطلب لو لسه ما اتحدّش
      if (order.status !== 'processing' && order.status !== 'completed') {
        await prisma.order.update({ data: { status: 'processing' } });
        await triggerInvoiceEmail(orderId);
      }
      break;

    case 'PAYMENT.CAPTURE.DENIED':
      await prisma.order.update({ data: { status: 'cancelled' } });
      break;

    case 'PAYMENT.CAPTURE.REFUNDED':
      await prisma.order.update({ data: { status: 'refunded' } });
      break;
  }
}
```

---

## 10. دليل مسارات الملفات الكامل

### لوحة التحكم (Admin)

| الملف | الوظيفة |
|-------|---------|
| `src/app/admin/(dashboard)/payments/page.tsx` | صفحة Zahlungen الرئيسية — الصورة اللي بعتها |
| `src/app/admin/(dashboard)/layout.tsx` | Layout الـ Dashboard |
| `src/app/admin/layout.tsx` | Root Layout للأدمن |
| `src/components/admin/AdminSidebar.tsx` | الـ Sidebar — فيها رابط "Zahlungen" |
| `src/components/admin/ui/index.ts` | مكونات UI: PageHeader, StatsCard, Toast |
| `src/app/admin/(dashboard)/settings/page.tsx` | صفحة الإعدادات — فيها mollie_mode, paypal_mode |

### API Routes — لوحة التحكم

| الملف | Method | الوظيفة |
|-------|--------|---------|
| `src/app/api/admin/payments/route.ts` | GET | جلب كل البوابات + الإحصائيات |
| `src/app/api/admin/payments/route.ts` | PUT | تحديث بوابة (تفعيل/رسوم/مود) |
| `src/app/api/admin/payments/debug/route.ts` | GET | تشخيص مشاكل الدفع |
| `src/app/api/admin/orders/[id]/refund/route.ts` | POST | استرجاع مبلغ |

### موقع الزوار (Frontend)

| الملف | الوظيفة |
|-------|---------|
| `src/app/rechnung/page.tsx` | صفحة الدفع — يجلب البوابات المفعّلة |
| `src/components/CheckoutForm.tsx` | فورم الدفع الكامل — حساب الرسوم |
| `src/components/checkout/PaymentMethodSelector.tsx` | مكون اختيار طريقة الدفع |

### API Routes — صفحة الدفع

| الملف | Method | الوظيفة |
|-------|--------|---------|
| `src/app/api/checkout/direct/route.ts` | POST | إنشاء الطلب + التوجيه لمزود الدفع |
| `src/app/api/payment/callback/route.ts` | GET | العميل يرجع بعد الدفع (Mollie) |
| `src/app/api/payment/webhook/route.ts` | POST | Webhook من Mollie |
| `src/app/api/payment/paypal/create/route.ts` | POST | إنشاء طلب PayPal |
| `src/app/api/payment/paypal/capture/route.ts` | GET | Capture بعد موافقة العميل |
| `src/app/api/payment/paypal/webhook/route.ts` | POST | Webhook من PayPal |
| `src/app/api/payment/refund/route.ts` | POST | استرجاع مبلغ (admin) |

### المكتبات (Libraries)

| الملف | الوظيفة |
|-------|---------|
| `src/lib/db.ts` | `getEnabledPaymentMethods()`, `getPaymentGatewayByCheckoutId()`, Gateway ID Map |
| `src/lib/payments.ts` | Mollie SDK integration — إنشاء دفعات + التحقق |
| `src/lib/paypal.ts` | PayPal REST API v2 — إنشاء + capture + refund |
| `src/lib/admin-api.ts` | `usePayments()` SWR hook |
| `src/lib/prisma.ts` | Prisma client instance |
| `src/lib/trigger-invoice.ts` | إرسال الفاتورة بالإيميل |

### قاعدة البيانات + Seed

| الملف | الوظيفة |
|-------|---------|
| `prisma/schema.prisma` | PaymentGateway model (سطر 238-254) |
| `prisma/seed.ts` | البيانات الأولية — 5 بوابات (سطر 67-122) |

### الأمان

| الملف | الوظيفة |
|-------|---------|
| `src/middleware.ts` | حماية `/admin/*` و `/api/admin/*` بـ NextAuth |

---

## 11. خطوات التنفيذ للمطور

### المرحلة 1: قاعدة البيانات

1. [ ] انسخ `PaymentGateway` model في `prisma/schema.prisma`
2. [ ] نفذ `npx prisma migrate dev --name add-payment-gateways`
3. [ ] أضف بيانات الـ Seed في `prisma/seed.ts` (عدّل الأسماء والأوصاف حسب المشروع)
4. [ ] نفذ `npx prisma db seed`

### المرحلة 2: الدوال المساعدة

5. [ ] انسخ `GATEWAY_ID_MAP` و `REVERSE_GATEWAY_MAP` في `src/lib/db.ts`
6. [ ] انسخ الدوال: `getEnabledPaymentMethods()`, `getPaymentGatewayByCheckoutId()`, `getCheckoutIdForGateway()`, `getDbGatewayId()`

### المرحلة 3: لوحة التحكم

7. [ ] انسخ `src/app/api/admin/payments/route.ts` (GET + PUT)
8. [ ] انسخ `src/app/admin/(dashboard)/payments/page.tsx`
9. [ ] أضف `usePayments()` hook في `src/lib/admin-api.ts`
10. [ ] أضف رابط "Zahlungen" في `AdminSidebar.tsx`
11. [ ] تأكد من وجود مكونات UI: `PageHeader`, `StatsCard`, `Toast`

### المرحلة 4: صفحة الدفع للزوار

12. [ ] أنشئ `src/app/rechnung/page.tsx` — يستدعي `getEnabledPaymentMethods()` ويمرر للـ form
13. [ ] انسخ `src/components/checkout/PaymentMethodSelector.tsx` (عدّل الأوصاف للمشروع الجديد)
14. [ ] في `CheckoutForm.tsx`: تأكد من حساب الرسوم: `total = product - discount + fee`

### المرحلة 5: Checkout API

15. [ ] انسخ `src/app/api/checkout/direct/route.ts`
16. [ ] تأكد من: `gateway = await getPaymentGatewayByCheckoutId(paymentMethod)` — التحقق من الـ DB
17. [ ] تأكد من: `paymentFee = gateway.fee` — الرسوم من الـ DB مش من الـ Frontend

### المرحلة 6: مزودي الدفع

18. [ ] Mollie: انسخ `src/lib/payments.ts` + ضع `MOLLIE_API_KEY` في `.env`
19. [ ] PayPal: انسخ `src/lib/paypal.ts` + ضع `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE` في `.env`

### المرحلة 7: Callbacks + Webhooks

20. [ ] انسخ `src/app/api/payment/callback/route.ts` (Mollie callback)
21. [ ] انسخ `src/app/api/payment/webhook/route.ts` (Mollie webhook)
22. [ ] انسخ `src/app/api/payment/paypal/capture/route.ts` (PayPal capture)
23. [ ] انسخ `src/app/api/payment/paypal/webhook/route.ts` (PayPal webhook)
24. [ ] سجّل webhook URLs في لوحات تحكم المزودين (راجع `docs/PAYPAL-WEBHOOK-SETUP.md`)

### المرحلة 8: Cache + Revalidation

25. [ ] في PUT API: أضف `revalidateTag('payment-gateways')` بعد التحديث
26. [ ] في `getEnabledPaymentMethods()`: ممكن تلفها بـ `unstable_cache` مع tag `'payment-gateways'`

### المرحلة 9: اختبار

27. [ ] شغّل `prisma db seed` وتأكد البوابات ظاهرة في لوحة التحكم
28. [ ] فعّل/عطّل بوابة من لوحة التحكم → تأكد تختفي/تظهر في صفحة الدفع
29. [ ] عدّل الرسوم → تأكد المبلغ يتغير في صفحة الدفع
30. [ ] اعمل دفعة تجريبية بكل طريقة (sandbox mode)

---

## ملاحظات مهمة

1. **كل شيء ديناميكي:** لا يوجد hardcode لأي بوابة — كل شيء من الـ DB
2. **Double validation:** الرسوم تُحسب مرتين — مرة في الفرونت (للعرض) ومرة في الباكند (للأمان)
3. **Cache invalidation:** تعديل البوابة يمسح الـ cache تلقائياً
4. **Idempotency:** الـ webhooks تتحقق من الحالة قبل التحديث (`if status !== 'processing'`)
5. **SEPA خاص:** لا يوجد مزود خارجي — فقط عرض بيانات الحساب البنكي

---

**للتوثيق الكامل لنظام الدفع:** `docs/PAYMENT-SYSTEM.md`  
**لخطة التنفيذ التفصيلية:** `docs/PAYMENT-IMPLEMENTATION-PLAN.md`  
**لإعداد PayPal + Mollie:** `docs/PAYPAL-WEBHOOK-SETUP.md`
