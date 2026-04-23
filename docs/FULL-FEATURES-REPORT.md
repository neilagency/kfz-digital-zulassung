# تقرير تفصيلي — نظام الكوكيز + قسم العملاء

> **الغرض:** هذا التقرير مُعد لإرساله لمطور لتنفيذ نفس الفيتشيرز بالظبط في موقع ثاني.
> **الفريمورك:** Next.js 14+ (App Router) — TypeScript — Tailwind CSS — Prisma ORM
> **تاريخ التقرير:** أبريل 2026

---

## الفهرس

1. [نظام الكوكيز والموافقة (Cookie Consent System)](#1-نظام-الكوكيز-والموافقة)
2. [قسم العملاء — لوحة تحكم الأدمن](#2-قسم-العملاء--لوحة-تحكم-الأدمن)
3. [حساب العميل — واجهة العميل](#3-حساب-العميل--واجهة-العميل)
4. [نظام المصادقة (Authentication System)](#4-نظام-المصادقة-authentication-system)
5. [الـ API Endpoints](#5-الـ-api-endpoints)
6. [قاعدة البيانات — جدول Customer](#6-قاعدة-البيانات--جدول-customer)
7. [المكونات المستخدمة](#7-المكونات-المستخدمة)

---

## 1. نظام الكوكيز والموافقة (Cookie Consent System)

### 1.1 نظرة عامة

نظام كوكيز متوافق مع GDPR/DSGVO يعتمد على Google Consent Mode v2. يتكون من:
- **Provider (React Context)** يدير كل الحالة
- **بانر الكوكيز** يظهر في أسفل الصفحة
- **مودال الإعدادات التفصيلية** للتحكم بكل فئة
- **مكون ConsentYouTube** يمنع تحميل المحتوى الخارجي بدون موافقة
- **تكامل مع Google Consent Mode v2** لـ Analytics و Ads

---

### 1.2 هيكل البيانات المحفوظة

**مفتاح التخزين في localStorage:** `cookie_consent`

**القيمة المحفوظة (JSON):**
```json
{
  "version": 1,
  "status": "accepted_all | rejected_all | custom | pending",
  "preferences": {
    "necessary": true,
    "analytics": false,
    "marketing": false,
    "external_media": false
  },
  "timestamp": 1712275200000
}
```

**القيم الممكنة لـ `status`:**
| القيمة | المعنى |
|--------|--------|
| `pending` | لم يتخذ المستخدم قرار بعد (البانر يظهر) |
| `accepted_all` | قبل كل الفئات |
| `rejected_all` | رفض الكل (فقط Necessary مفعّل) |
| `custom` | اختار فئات محددة من الإعدادات |

---

### 1.3 فئات الكوكيز (4 فئات)

| الفئة | المفتاح | الاسم بالألمانية | الوصف | مقفل؟ | قابل للتعطيل؟ |
|-------|---------|-----------------|-------|-------|---------------|
| ضرورية | `necessary` | Notwendig | كوكيز وظائف الموقع الأساسية | ✅ نعم | ❌ لا — دائماً `true` |
| تحليلات | `analytics` | Analyse & Statistik | Google Analytics, تتبع الاستخدام | ❌ لا | ✅ نعم |
| تسويق | `marketing` | Marketing & Werbung | Google Ads, Facebook Pixel | ❌ لا | ✅ نعم |
| وسائط خارجية | `external_media` | Externe Medien | YouTube, Google Maps, خدمات مُضمّنة | ❌ لا | ✅ نعم |

---

### 1.4 تكامل Google Consent Mode v2

**الحالة الافتراضية (قبل اختيار المستخدم):**
```typescript
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500,
});
```

**التحديث بعد اختيار المستخدم:**
```typescript
gtag('consent', 'update', {
  ad_storage: prefs.marketing ? 'granted' : 'denied',
  ad_user_data: prefs.marketing ? 'granted' : 'denied',
  ad_personalization: prefs.marketing ? 'granted' : 'denied',
  analytics_storage: prefs.analytics ? 'granted' : 'denied',
  personalization_storage: prefs.external_media ? 'granted' : 'denied',
});
```

**خريطة الربط:**
| فئة الكوكيز | Google Consent Parameters |
|-------------|--------------------------|
| `marketing` | `ad_storage`, `ad_user_data`, `ad_personalization` |
| `analytics` | `analytics_storage` |
| `external_media` | `personalization_storage` |
| `necessary` | `functionality_storage`, `security_storage` (دائماً `granted`) |

---

### 1.5 Provider — CookieConsentProvider

**الملف:** `src/lib/cookie-consent.tsx`

**المتغيرات (State):**
```typescript
const [status, setStatus] = useState<ConsentStatus>('pending');
const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFS);
const [showBanner, setShowBanner] = useState(false);
const [showSettings, setShowSettings] = useState(false);
```

**القيم الافتراضية:**
```typescript
const DEFAULT_PREFS = {
  necessary: true,
  analytics: false,
  marketing: false,
  external_media: false,
};

const ALL_ACCEPTED = {
  necessary: true,
  analytics: true,
  marketing: true,
  external_media: true,
};
```

**الدوال المُصدّرة عبر Context:**
| الدالة | الوظيفة |
|--------|---------|
| `acceptAll()` | يُفعّل كل الفئات، `status = 'accepted_all'` |
| `rejectAll()` | يبقي فقط `necessary: true`، `status = 'rejected_all'` |
| `acceptSelected(prefs)` | يدمج الاختيارات المخصصة مع ضمان `necessary: true`، `status = 'custom'` |
| `openSettings()` | يفتح مودال الإعدادات التفصيلية |
| `closeSettings()` | يغلق مودال الإعدادات |
| `reopenBanner()` | يعيد فتح البانر |
| `hasConsent(category)` | يتحقق هل فئة معينة مفعّلة (يرجع `true` دائماً لـ `necessary`) |

**الـ Interface الكامل:**
```typescript
export interface CookieConsentState {
  status: ConsentStatus;
  preferences: CookiePreferences;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  acceptSelected: (prefs: Partial<CookiePreferences>) => void;
  openSettings: () => void;
  closeSettings: () => void;
  reopenBanner: () => void;
  hasConsent: (category: CookieCategory) => boolean;
}
```

**تدفق التهيئة عند تحميل الصفحة:**
```
1. يرسل pushConsentDefault() لـ Google dataLayer (كل شيء denied)
2. يقرأ localStorage بمفتاح 'cookie_consent'
3. إذا وُجدت بيانات صالحة:
   → يحمل الإعدادات المحفوظة
   → يرسل pushConsentUpdate() لـ Google dataLayer
   → لا يعرض البانر
4. إذا لم تُوجد بيانات:
   → يعرض البانر (showBanner = true)
```

**دالة الحفظ:**
```typescript
const saveConsent = useCallback((prefs, newStatus) => {
  const data = {
    version: 1,
    status: newStatus,
    preferences: prefs,
    timestamp: Date.now()
  };
  localStorage.setItem('cookie_consent', JSON.stringify(data));
  setPreferences(prefs);
  setStatus(newStatus);
  setShowBanner(false);
  setShowSettings(false);
  pushConsentUpdate(prefs);   // تحديث Google dataLayer
}, []);
```

**الـ Hook:**
```typescript
export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider');
  return ctx;
}
```

---

### 1.6 بانر الكوكيز (CookieBanner Component)

**الملف:** `src/components/CookieBanner.tsx`

**التحميل:** Lazy-loaded مع `dynamic(() => import(...), { ssr: false })`

**شروط الظهور:**
- يظهر البانر إذا `showBanner = true` و `showSettings = false`
- يظهر مودال الإعدادات إذا `showSettings = true`

#### تصميم البانر الرئيسي
- **الموقع:** `fixed bottom-0 inset-x-0 z-[10000]`
- **الأنيميشن:** `slide-in-from-bottom duration-500`
- **العرض الأقصى:** `max-w-4xl` مع `mx-auto`
- **الخلفية:** أبيض مع ظل وحدود مُدورة

#### محتوى البانر
1. **الأيقونة:** أيقونة كوكيز (w-10 h-10) بخلفية `#0d5581/10`
2. **العنوان:** "Wir respektieren Ihre Privatsphäre"
3. **الوصف:** نص يتضمن رابط لـ `/datenschutzhinweise` (سياسة الخصوصية)
4. **Trust Badges (3 شارات):**
   - DSGVO-konform (متوافق مع قانون حماية البيانات)
   - لا مشاركة بيانات مع أطراف ثالثة
   - قابل للإلغاء في أي وقت

#### الأزرار (3 أزرار)
| الزر | اللون | الدالة |
|------|-------|--------|
| "Alle akzeptieren" (قبول الكل) | أزرق `#0d5581` | `consent.acceptAll()` |
| "Nur notwendige" (الضرورية فقط) | رمادي | `consent.rejectAll()` |
| "Einstellungen" (الإعدادات) | أزرق outline | `consent.openSettings()` |

---

### 1.7 مودال الإعدادات التفصيلية (Settings Modal)

**داخل نفس الملف:** `src/components/CookieBanner.tsx`

#### التصميم
- **الطبقة الخلفية (Overlay):** `fixed inset-0 z-[10001] bg-black/60 backdrop-blur-sm`
- **الأنيميشن:** `fade-in slide-in-from-bottom-4 duration-300`
- **العرض الأقصى:** `max-w-lg`
- **الارتفاع الأقصى:** `max-h-[85vh]` مع scroll

#### الـ State الداخلي
```typescript
const { preferences } = useCookieConsent();
const [local, setLocal] = useState<CookiePreferences>({ ...preferences });
const [expanded, setExpanded] = useState<string | null>(null);
```
- `local`: نسخة محلية من الإعدادات للتعديل قبل الحفظ
- `expanded`: أي فئة مفتوحة حالياً لعرض التفاصيل

#### لكل فئة من الفئات الأربعة
- **الاسم** + **الوصف** (قابل للتوسيع بالضغط)
- **Toggle Switch:**
  - إذا `locked = true` (Necessary): لون أزرق ثابت + `cursor-not-allowed`
  - إذا مُفعّل: لون أزرق `#0d5581`
  - إذا مُعطّل: لون رمادي `bg-gray-300`
  - الكُرة تتحرك: `translate-x-5` (مفعّل) أو `translate-x-0` (معطّل)

#### التصميم التقني للـ Toggle
```typescript
<input type="checkbox" checked={local[cat.key]} disabled={cat.locked}
  onChange={() => {
    if (!cat.locked) setLocal((p) => ({ ...p, [cat.key]: !p[cat.key] }));
  }}
  className="sr-only peer"
/>
<div className={`w-10 h-5 rounded-full transition-colors ${
  cat.locked ? 'bg-[#0d5581] cursor-not-allowed'
  : local[cat.key] ? 'bg-[#0d5581]' : 'bg-gray-300'
}`}>
  <div className={`w-4 h-4 ... ${local[cat.key] ? 'translate-x-5' : 'translate-x-0'}`} />
</div>
```

#### أزرار المودال
| الزر | الدالة |
|------|--------|
| "Abbrechen" (إلغاء) | `consent.closeSettings()` |
| "Auswahl speichern" (حفظ الاختيار) | `consent.acceptSelected(local)` |

---

### 1.8 مكون ConsentYouTube

**الملف:** `src/components/ConsentYouTube.tsx`

**الـ Props:**
```typescript
interface ConsentYouTubeProps {
  videoId: string;       // معرف فيديو YouTube
  title?: string;        // عنوان للـ accessibility
  className?: string;    // كلاسات Tailwind إضافية
}
```

**السلوك:**

#### إذا المستخدم وافق على `external_media`:
```html
<div class="relative w-full aspect-video rounded-xl overflow-hidden">
  <iframe
    src="https://www.youtube-nocookie.com/embed/{videoId}"
    title="{title}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    loading="lazy"
  />
</div>
```
- يستخدم `youtube-nocookie.com` (نسخة بدون كوكيز تتبع)
- `loading="lazy"` للأداء

#### إذا المستخدم لم يوافق:
- **خلفية داكنة:** `bg-gray-900`
- **صورة مصغرة مُبهمة:** thumbnail من YouTube مع `blur-lg opacity-30`
- **أيقونة تشغيل**
- **نص:** "Externer Inhalt – YouTube"
- **تحذير:** "Dieses Video wird von YouTube bereitgestellt. Beim Laden werden Daten an YouTube übertragen."
- **زر:** "Video laden & Cookies akzeptieren"
  - عند النقر: `acceptSelected({ ...preferences, external_media: true })`
  - يُفعّل فقط `external_media` بدون التأثير على باقي الفئات

---

### 1.9 التكامل في Layout

**الملف:** `src/components/ConditionalLayout.tsx`

**ترتيب الـ Wrappers:**
```jsx
<CustomerAuthProvider>
  <CookieConsentProvider>
    <PromoBanner />
    <Navbar />
    {children}
    {footer}
    <WhatsAppButton />
    <CookieBanner />        {/* Lazy-loaded, client-only */}
  </CookieConsentProvider>
</CustomerAuthProvider>
```

**CookieBanner Lazy Loading:**
```typescript
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), {
  ssr: false,    // يُحمّل فقط على الكلاينت — لا يُعرض من السيرفر
});
```

---

### 1.10 صفحة سياسة الخصوصية

- **الرابط المُشار إليه في البانر:** `/datenschutzhinweise`
- **تُبنى ديناميكياً** من قاعدة البيانات عبر `src/app/[slug]/page.tsx`
- يظهر أيضاً في فوتر الموقع وفي صفحات المنتجات

---

---

## 2. قسم العملاء — لوحة تحكم الأدمن

### 2.1 صفحة العملاء `/admin/customers`

**الملف:** `src/app/admin/customers/page.tsx`

#### البحث
- بحث بالاسم الأول، الأخير، أو الإيميل
- **Debounced** (لا يبحث مع كل حرف)

#### Virtual List
- يستخدم `react-window` لعرض القوائم الكبيرة بأداء عالي

#### الأعمدة (Desktop View — جدول)
| العمود | الوصف | التفاصيل |
|--------|-------|----------|
| الأفاتار + الاسم | دائرة بأول حرف من الاسم + الاسم الكامل | حرف كبير في دائرة ملونة |
| الإيميل | بريد العميل | نص قابل للنسخ |
| الهاتف | رقم الهاتف | يظهر إذا كان موجود |
| المدينة | مدينة العميل | من بيانات الفوترة |
| حالة الحساب | "Registered" أو "Guest" | بادج ملونة |
| عدد الطلبات | عدد طلبات العميل | بادج رقمية |
| إجمالي المصروف | مبلغ بالـ € | منسق بصيغة العملة |
| تاريخ إنشاء الحساب | تاريخ التسجيل | صيغة ألمانية |

**تحديد حالة الحساب:**
- **"Registered"** = العميل لديه كلمة مرور (سجّل حساب)
- **"Guest"** = العميل ليس لديه كلمة مرور (طلب كضيف فقط)

#### العرض على الموبايل
- تخطيط **كروت (Cards)** بدلاً من جدول
- كل كارت يعرض: الاسم، الإيميل، المدينة، عدد الطلبات

#### ملاحظة مهمة
- ❌ **لا توجد صفحة تعديل للعميل** — القائمة للعرض فقط
- ❌ **لا يمكن حذف عميل** من لوحة التحكم
- العملاء يُنشأون تلقائياً عند إتمام الطلبات أو التسجيل

---

### 2.2 API الخاص بقائمة العملاء

**Endpoint:** `GET /api/admin/customers`

**Query Params:**
| البارامتر | الوصف | الافتراضي |
|----------|-------|----------|
| `search` | نص البحث (اسم أو إيميل) | فارغ |
| `page` | رقم الصفحة | 1 |
| `limit` | عدد النتائج في الصفحة | 20 |

**البيانات المُرجعة لكل عميل:**
```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  city: string | null;
  totalOrders: number;
  totalSpent: number;
  password: boolean;       // true/false (هل لديه كلمة مرور — لا يُرسل الباسورد نفسه)
  createdAt: string;
}
```

---

---

## 3. حساب العميل — واجهة العميل (Frontend)

### 3.1 صفحة تسجيل الدخول/التسجيل `/anmelden`

**الملف:** `src/app/anmelden/page.tsx`

#### التصميم
- خلفية داكنة مع تدرج (مشابهة لصفحة الدفع)
- كارت مركزي `max-w-[420px]`
- تبديل بين وضع تسجيل الدخول والتسجيل (Tabs)

#### الـ State
```typescript
const [mode, setMode] = useState<'login' | 'register'>('login');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [firstName, setFirstName] = useState('');        // فقط في وضع التسجيل
const [lastName, setLastName] = useState('');           // فقط في وضع التسجيل
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

#### إعادة التوجيه
```typescript
const redirect = searchParams.get('redirect') || '/konto';
// إذا العميل مسجل دخول بالفعل → يحوله مباشرة
if (customer) {
  router.replace(redirect);
  return null;
}
```

#### حقول وضع تسجيل الدخول (Login)
| الحقل | نوعه | مطلوب | أيقونة |
|-------|------|-------|--------|
| Email | email | ✅ | Mail |
| Password | password/text (toggle) | ✅ | Lock + Eye/EyeOff |

#### حقول وضع التسجيل (Register) — إضافة على حقول Login
| الحقل | نوعه | مطلوب | أيقونة |
|-------|------|-------|--------|
| First Name | text | ✅ | User |
| Last Name | text | ✅ | User |

#### التقديم
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  let result;
  if (mode === 'login') {
    result = await login(email, password);
  } else {
    result = await register({ email, password, firstName, lastName });
  }
  if (result.success) {
    router.push(redirect);
  } else {
    setError(result.error || 'Ein Fehler ist aufgetreten.');
    setLoading(false);
  }
};
```

#### الـ UI
- زر Submit مع loading spinner أثناء الإرسال
- رسالة خطأ في صندوق أحمر
- اللون الأساسي: `#0d5581`

---

### 3.2 Layout حساب العميل `/konto`

**الملف:** `src/app/konto/layout.tsx`

#### التنقل
```typescript
const kontoNav = [
  { label: 'Übersicht', href: '/konto', icon: User },
  { label: 'Bestellungen', href: '/konto/bestellungen', icon: Package },
];
```

#### التصميم المتجاوب
- **Desktop (md+):** قائمة جانبية عمودية يسار (220px) + المحتوى يمين
- **Mobile:** تبويبات أفقية تحت الـ Hero (sticky, scrollable)

#### الهيدر
- عنوان: "Mein Konto"
- عنوان فرعي: `Willkommen, {firstName || email}`
- زر تسجيل الخروج في أعلى اليمين

#### تسجيل الخروج
```typescript
const handleLogout = async () => {
  await logout();                    // DELETE /api/auth/customer/session
  window.location.href = '/';       // Hard redirect للصفحة الرئيسية
};
```

#### تحديد التبويب النشط
```typescript
const isActive = pathname === item.href ||
  (item.href !== '/konto' && pathname.startsWith(item.href));
```

---

### 3.3 لوحة تحكم العميل `/konto` (Dashboard)

**الملف:** `src/app/konto/page.tsx`

#### البيانات
```typescript
const { customer, linkedOrders, clearLinkedOrders } = useCustomerAuth();
const { data, error, isLoading } = useSWR('/api/customer/stats', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 30000,       // يمنع التكرار لمدة 30 ثانية
});
```

#### إشعار ربط الطلبات
إذا سجّل العميل دخول ووُجدت طلبات سابقة كضيف بنفس الإيميل، يظهر إشعار:
```
"X frühere Bestellung(en) verlinkt"
```
- يظهر فقط إذا `linkedOrders > 0`
- يحتوي على زر إغلاق (Dismiss)
- بادج: خلفية accent مع أيقونة CheckCircle2

#### 4 كروت إحصائية
| الكارت | القيمة |
|--------|--------|
| Gesamt (إجمالي) | `stats.total` |
| Abgeschlossen (مكتمل) | `stats.completed` |
| Ausstehend (معلق) | `stats.pending` |
| In Bearbeitung (قيد المعالجة) | `stats.processing` |

#### آخر الطلبات
- يعرض آخر 3 طلبات مع: نقطة حالة ملونة، اسم المنتج، رقم الطلب
- رابط سريع لـ `/konto/bestellungen`

---

### 3.4 سجل الطلبات `/konto/bestellungen`

**الملف:** `src/app/konto/bestellungen/page.tsx`

#### جلب البيانات
```typescript
useSWR(`/api/customer/orders?page=${page}&limit=10`, fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 30000,
});
```

#### خريطة ألوان الحالات
```typescript
const STATUS_MAP = {
  pending:    { label: 'Ausstehend',      color: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-400' },
  processing: { label: 'In Bearbeitung', color: 'bg-blue-50 text-blue-700 border-blue-200',      dot: 'bg-blue-400' },
  completed:  { label: 'Abgeschlossen',  color: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-400' },
  cancelled:  { label: 'Storniert',       color: 'bg-gray-50 text-gray-500 border-gray-200',     dot: 'bg-gray-400' },
  failed:     { label: 'Fehlgeschlagen', color: 'bg-red-50 text-red-700 border-red-200',         dot: 'bg-red-400' },
  refunded:   { label: 'Erstattet',       color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-400' },
};
```

#### كل صف طلب يعرض
- رقم الطلب
- اسم المنتج
- بادج الحالة (بالألوان أعلاه)
- المبلغ الإجمالي (€ بصيغة ألمانية)
- تاريخ الإنشاء
- زر "عرض" → رابط لـ `/konto/bestellungen/{id}`

#### التصفح (Pagination)
- 10 طلبات في الصفحة
- أرقام الصفحات 1-7 مع ellipsis
- يمرر للأعلى عند تغيير الصفحة
- Skeleton Loading أثناء التحميل

---

### 3.5 تفاصيل الطلب `/konto/bestellungen/[id]`

**الملف:** `src/app/konto/bestellungen/[id]/page.tsx`

#### بنية البيانات
```typescript
interface OrderDetail {
  id: string;
  orderNumber: number;
  status: string;
  total: number;
  subtotal: number;
  paymentFee: number;
  discountAmount: number;
  couponCode: string;
  currency: string;
  productName: string;
  paymentMethod: string;
  paymentTitle: string;
  billingFirst: string;
  billingLast: string;
  billingEmail: string;
  billingPhone: string;
  billingStreet: string;
  billingCity: string;
  billingPostcode: string;
  serviceData: string;        // JSON stringified
  createdAt: string;
  datePaid: string | null;
  dateCompleted: string | null;
  items: { id: string; productName: string; quantity: number; price: number; total: number }[];
  payments: { id: string; status: string; method: string; amount: number; paidAt: string | null }[];
  invoices: { id: string; invoiceNumber: string; total: number; paymentStatus: string;
              createdAt: string; pdfToken: string }[];
}
```

#### الأقسام المعروضة
1. **هيدر الحالة** — أيقونة + بادج حالة ملونة
2. **ملخص الطلب** — رقم الطلب، المبلغ، التواريخ، طريقة الدفع
3. **عنوان الفوترة** — الاسم، الإيميل، الهاتف، العنوان الكامل
4. **بنود الطلب** — جدول: اسم المنتج، الكمية، السعر، المجموع
5. **سجل الدفع** — طريقة الدفع، المبالغ، التواريخ
6. **المستندات/الفواتير** — ملفات PDF مع روابط تحميل
7. **بيانات الخدمة** — تفاصيل JSON (أكواد، بيانات المركبة...)

#### تحميل المستندات
```html
<a href="/api/documents/{doc.id}/download?token={doc.token}">Download</a>
```

---

---

## 4. نظام المصادقة (Authentication System)

### 4.1 JWT Token & Cookie

**الملف:** `src/lib/customer-auth.ts`

#### إنشاء التوكن
```typescript
export async function createCustomerToken(payload: CustomerSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2592000s')     // 30 يوم
    .sign(SECRET);                      // process.env.NEXTAUTH_SECRET
}
```

#### إعدادات الكوكي
| الإعداد | القيمة |
|---------|--------|
| **اسم الكوكي** | `customer_token` |
| `httpOnly` | `true` — غير متاح لـ JavaScript (حماية XSS) |
| `secure` | `true` في Production (HTTPS فقط) |
| `sameSite` | `lax` — حماية CSRF |
| `path` | `/` |
| `maxAge` | `2592000` (30 يوم بالثواني) |

#### التحقق من التوكن
```typescript
export async function verifyCustomerToken(token: string): Promise<CustomerSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      firstName: payload.firstName as string,
      lastName: payload.lastName as string,
    };
  } catch {
    return null;   // التوكن منتهي أو غير صالح
  }
}
```

#### الـ Session Interface
```typescript
interface CustomerSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
```

---

### 4.2 CustomerAuthProvider — Context

**الملف:** `src/components/CustomerAuthProvider.tsx`

#### تصميم Context مزدوج (لتحسين الأداء)
- **`CustomerStateContext`** — فقط الحالة (customer, loading, linkedOrders)
- **`CustomerActionsContext`** — فقط الدوال (login, register, logout, refresh)

**الفائدة:** المكونات التي تحتاج فقط الحالة لا تُعاد رسمها عند تغيير الدوال والعكس صحيح

#### الـ Interfaces
```typescript
interface CustomerUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface CustomerAuthState {
  customer: CustomerUser | null;
  loading: boolean;
  linkedOrders: number;
}

interface CustomerAuthActions {
  clearLinkedOrders: () => void;
  login: (email: string, password: string) => Promise<{
    success: boolean; error?: string; linkedOrders?: number
  }>;
  register: (data: {
    email: string; password: string; firstName: string; lastName: string
  }) => Promise<{
    success: boolean; error?: string; linkedOrders?: number
  }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}
```

#### دوال التهيئة
```typescript
// عند تحميل الصفحة
const refresh = useCallback(async () => {
  try {
    const res = await fetch('/api/auth/customer/session');
    const data = await res.json();
    setCustomer(data.authenticated ? data.customer : null);
  } catch {
    setCustomer(null);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => { refresh(); }, [refresh]);
```

#### دالة Login
```typescript
const login = useCallback(async (email, password) => {
  const res = await fetch('/api/auth/customer/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  setCustomer(data.customer);
  if (data.linkedOrders > 0) setLinkedOrders(data.linkedOrders);
  return { success: true, linkedOrders: data.linkedOrders || 0 };
}, []);
```

#### دالة Register
```typescript
const register = useCallback(async (formData) => {
  const res = await fetch('/api/auth/customer/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  setCustomer(data.customer);
  if (data.linkedOrders > 0) setLinkedOrders(data.linkedOrders);
  return { success: true, linkedOrders: data.linkedOrders || 0 };
}, []);
```

#### دالة Logout
```typescript
const logout = useCallback(async () => {
  await fetch('/api/auth/customer/session', { method: 'DELETE' });
  setCustomer(null);
}, []);
```

#### الـ Hooks المُصدّرة
```typescript
// للمكونات التي تحتاج الحالة فقط
export function useCustomerState() { ... }

// للمكونات التي تحتاج الدوال فقط
export function useCustomerActions() { ... }

// Legacy — يجمع الاثنين (للتوافق مع الكود القديم)
export function useCustomerAuth() { ... }
```

---

### 4.3 حماية الراوتس (Middleware)

**الملف:** `src/middleware.ts`

#### الراوتس المحمية
```typescript
const isKontoPage = pathname.startsWith('/konto');
const isCustomerApi = pathname.startsWith('/api/customer');
```

#### السلوك
| نوع الراوت | إذا غير مصادق |
|-----------|---------------|
| `/konto/*` | إعادة توجيه لـ `/anmelden?redirect=/konto/...` |
| `/api/customer/*` | إرجاع JSON `{ error: 'Nicht angemeldet.' }` مع HTTP 401 |

#### Matcher Config
```typescript
export const config = {
  matcher: [
    '/admin/((?!login).*)',
    '/api/admin/(.*)',
    '/konto/(.*)',
    '/konto',
    '/api/customer/(.*)',
  ],
};
```

---

### 4.4 ربط طلبات الضيف (Guest Order Linking)

**الملف:** `src/lib/link-guest-orders.ts`

**الغرض:** ربط طلبات الضيف تلقائياً بحساب العميل بعد تسجيل الدخول/التسجيل

**يُستدعى بعد:** كل عملية Login و Register

```typescript
export async function linkGuestOrders(email: string, customerId: string): Promise<number> {
  const normalizedEmail = email.toLowerCase().trim();

  // تحديث جماعي: billingEmail يتطابق + غير مربوط بحساب
  const result = await prisma.order.updateMany({
    where: {
      billingEmail: normalizedEmail,
      customerId: null,       // فقط الطلبات الغير مربوطة
      deletedAt: null,
    },
    data: { customerId },
  });

  // ربط الفواتير أيضاً
  if (result.count > 0) {
    await prisma.invoice.updateMany({
      where: {
        billingEmail: normalizedEmail,
        customerId: null,
      },
      data: { customerId },
    });
  }

  return result.count;       // عدد الطلبات التي تم ربطها
}
```

**آمنة للاستدعاء المتكرر:** تحدث فقط الطلبات التي `customerId IS NULL`

**مثال عملي:**
```
1. ضيف يطلب بإيميل ahmed@example.com
   → Order.customerId = NULL, Order.billingEmail = "ahmed@example.com"
2. الضيف يسجل حساب بنفس الإيميل
   → linkGuestOrders() تعمل
   → Order.customerId يتحدث لمعرف العميل الجديد
3. في تسجيل الدخول التالي → الطلب يظهر في لوحة التحكم
```

---

### 4.5 نمط الوصول للبيانات

**الطلبات مربوطة بمعيارين:**
```typescript
OR: [
  { customerId: customer.id },      // طلبات مسجلة
  { billingEmail: customer.email }, // طلبات ضيف بنفس الإيميل
]
```

**السبب:** العملاء يمكنهم الطلب كضيوف ثم التسجيل لاحقاً — النظام يربط الطلبات تلقائياً

---

---

## 5. الـ API Endpoints

### 5.1 APIs المصادقة

#### تسجيل الدخول
```
POST /api/auth/customer/login
Body: { email: string, password: string }
Response: { success: true, linkedOrders: number, customer: CustomerUser }
Cookie: customer_token (httpOnly, 30 days)
```

**التحقق (Zod):**
```typescript
const loginSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein.'),
  password: z.string().min(1, 'Passwort ist erforderlich.'),
});
```

**Rate Limiting:** 10 طلبات لكل IP / دقيقة

**خطوات المعالجة:**
1. التحقق من البيانات بـ Zod
2. فحص Rate Limit (10 req/min per IP)
3. تطبيع الإيميل: `toLowerCase().trim()`
4. البحث عن العميل بالإيميل
5. رسالة خطأ عامة إذا لم يُوجد: `"E-Mail oder Passwort ist falsch."` (يمنع كشف الإيميلات)
6. مقارنة كلمة المرور بـ `bcrypt.compare()`
7. تحديث `lastLoginAt`
8. ربط طلبات الضيف `linkGuestOrders()`
9. إنشاء JWT Token
10. تعيين الكوكي

---

#### التسجيل
```
POST /api/auth/customer/register
Body: { email: string, password: string, firstName: string, lastName: string }
Response: { success: true, linkedOrders: number, customer: CustomerUser }
Cookie: customer_token (httpOnly, 30 days)
```

**التحقق (Zod):**
```typescript
const registerSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein.'),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein.'),
  firstName: z.string().min(1, 'Vorname ist erforderlich.').max(100),
  lastName: z.string().min(1, 'Nachname ist erforderlich.').max(100),
});
```

**Rate Limiting:** 5 طلبات لكل IP / دقيقة (أشد من Login)

**قواعد التسجيل:**
- إذا العميل موجود **ولديه كلمة مرور** → خطأ 409: `"Ein Konto mit dieser E-Mail existiert bereits."`
- إذا العميل موجود **بدون كلمة مرور** (ضيف) → **ترقية لحساب كامل** (Upsert)
- إذا العميل غير موجود → إنشاء حساب جديد

**Upsert Pattern:**
```typescript
const hashedPassword = await bcrypt.hash(password, 12);   // 12 rounds

const customer = await prisma.customer.upsert({
  where: { email: normalizedEmail },
  update: {
    password: hashedPassword,
    firstName: firstName || existing?.firstName || '',
    lastName: lastName || existing?.lastName || '',
    lastLoginAt: new Date(),
  },
  create: {
    email: normalizedEmail,
    password: hashedPassword,
    firstName,
    lastName,
    lastLoginAt: new Date(),
  },
});
```

---

#### فحص الجلسة
```
GET /api/auth/customer/session
Response: { authenticated: true/false, customer?: CustomerUser }
```

#### تسجيل الخروج
```
DELETE /api/auth/customer/session
Response: { success: true }
Action: يمسح كوكي customer_token (maxAge = 0)
```

---

### 5.2 APIs العميل

#### إحصائيات العميل
```
GET /api/customer/stats
Auth: Required (customer_token cookie)
Response: {
  stats: { total, completed, pending, processing },
  recentOrders: [{ id, orderNumber, status, total, productName, createdAt }]
}
```

**استعلام:** يبحث بـ `customerId` أو `billingEmail` + `deletedAt: null`
**آخر الطلبات:** آخر 3 طلبات مرتبة تنازلياً

---

#### قائمة طلبات العميل
```
GET /api/customer/orders?page=1&limit=10
Auth: Required
Response: {
  orders: OrderItem[],
  pagination: { page, limit, total, pages }
}
```

**القيود:** `limit` أقصى 50، أدنى 1

---

#### تفاصيل طلب العميل
```
GET /api/customer/orders/[id]
Auth: Required
Response: { order: OrderDetail }
```

**التحكم في الوصول:** العميل يرى فقط طلباته (بـ `customerId` أو `billingEmail`)

**يشمل:**
- `items[]` — بنود الطلب
- `payments[]` — سجل المدفوعات
- `invoices[]` — الفواتير (مع `pdfToken` للتحميل)

---

### 5.3 API الأدمن للعملاء

```
GET /api/admin/customers?search=&page=1&limit=20
Auth: Admin Required
Response: { customers: Customer[], pagination: {...} }
```

---

---

## 6. قاعدة البيانات — جدول Customer

### Prisma Schema

```prisma
model Customer {
  id               String    @id @default(uuid())
  email            String    @unique
  firstName        String    @default("")
  lastName         String    @default("")
  phone            String?
  city             String?
  postcode         String?
  address          String?
  street           String?
  country          String?   @default("DE")
  totalOrders      Int       @default(0)
  totalSpent       Float     @default(0)
  password         String?                        // BCrypt hash — null = ضيف
  emailSubscribed  Boolean   @default(true)
  unsubscribeToken String?
  lastLoginAt      DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  // Relations
  orders           Order[]
  invoices         Invoice[]
}
```

**ملاحظات مهمة:**
| الحقل | الملاحظة |
|-------|---------|
| `email` | فريد (unique) — يُطبّع بـ `toLowerCase().trim()` |
| `password` | `null` = حساب ضيف، قيمة = حساب مسجل (BCrypt 12 rounds) |
| `emailSubscribed` | `true` افتراضياً — للاشتراك في حملات الإيميل |
| `unsubscribeToken` | توكن فريد لرابط إلغاء الاشتراك |
| `totalOrders` / `totalSpent` | يُحدّثان عند إتمام الطلبات |
| `country` | `"DE"` افتراضياً (ألمانيا) |

---

---

## 7. المكونات المستخدمة

### مكونات نظام الكوكيز

| المكون | الملف | الوظيفة |
|--------|-------|---------|
| `CookieConsentProvider` | `src/lib/cookie-consent.tsx` | React Context يدير كل حالة الموافقة |
| `useCookieConsent()` | `src/lib/cookie-consent.tsx` | Hook للوصول لحالة ودوال الموافقة |
| `CookieBanner` | `src/components/CookieBanner.tsx` | البانر السفلي + مودال الإعدادات |
| `ConsentYouTube` | `src/components/ConsentYouTube.tsx` | غلاف موافقة لفيديوهات YouTube |

### مكونات حساب العميل

| المكون | الملف | الوظيفة |
|--------|-------|---------|
| `CustomerAuthProvider` | `src/components/CustomerAuthProvider.tsx` | React Context مزدوج (State + Actions) |
| `useCustomerState()` | `src/components/CustomerAuthProvider.tsx` | Hook للحالة فقط |
| `useCustomerActions()` | `src/components/CustomerAuthProvider.tsx` | Hook للدوال فقط |
| `useCustomerAuth()` | `src/components/CustomerAuthProvider.tsx` | Hook يجمع الاثنين (Legacy) |

### مكونات الـ Auth Utilities

| الدالة/الملف | الوظيفة |
|-------------|---------|
| `createCustomerToken()` | إنشاء JWT Token |
| `verifyCustomerToken()` | التحقق من التوكن |
| `setCustomerCookie()` | تعيين الكوكي |
| `clearCustomerCookie()` | مسح الكوكي |
| `getCustomerSession()` | قراءة الجلسة من Server Component |
| `getCustomerSessionFromRequest()` | قراءة الجلسة من Middleware |
| `linkGuestOrders()` | ربط طلبات الضيف بالحساب |

---

### التقنيات المستخدمة في هذين القسمين

| التقنية | الاستخدام |
|---------|----------|
| **React Context API** | إدارة حالة الموافقة والمصادقة |
| **localStorage** | تخزين إعدادات الكوكيز (`cookie_consent`) |
| **httpOnly Cookie** | تخزين JWT Token (`customer_token`) |
| **Jose (JWT)** | إنشاء والتحقق من التوكنات (HS256) |
| **bcrypt** | تشفير كلمات المرور (12 rounds) |
| **Zod** | التحقق من بيانات الـ API |
| **SWR** | جلب بيانات العميل (مع deduplication) |
| **react-window** | Virtual List لقائمة العملاء في الأدمن |
| **Google Consent Mode v2** | تكامل الموافقة مع Google Analytics/Ads |
| **next/dynamic** | تحميل كسول لبانر الكوكيز (client-only) |

---

### التدفقات الكاملة (Complete Flows)

#### تدفق التسجيل
```
1. المستخدم يدخل email, password, firstName, lastName في /anmelden
2. الفرونت يتحقق من الحقول (email, password min 8, أسماء مطلوبة)
3. POST /api/auth/customer/register
4. الباكند يتحقق بـ Zod schema
5. فحص Rate Limit (5 req/min per IP)
6. هل الحساب موجود بكلمة مرور؟ → خطأ 409
7. تشفير كلمة المرور بـ bcrypt (12 rounds)
8. Upsert العميل (إنشاء جديد أو ترقية ضيف)
9. ربط طلبات الضيف السابقة بنفس الإيميل
10. إنشاء JWT Token (صلاحية 30 يوم)
11. تعيين كوكي customer_token
12. إرجاع بيانات العميل + عدد الطلبات المربوطة
13. الفرونت يحول لـ /konto أو ?redirect param
```

#### تدفق تسجيل الدخول
```
1. المستخدم يدخل email + password في /anmelden (وضع login)
2. POST /api/auth/customer/login
3. Zod validation
4. Rate Limit (10 req/min per IP)
5. تطبيع الإيميل (toLowerCase, trim)
6. البحث عن العميل
7. رسالة خطأ عامة إذا غير موجود أو بدون كلمة مرور
8. مقارنة كلمة المرور بـ bcrypt
9. تحديث lastLoginAt
10. ربط طلبات الضيف
11. إنشاء JWT Token
12. تعيين الكوكي
13. التحويل لـ /konto
```

#### تدفق فحص الجلسة (كل زيارة لـ /konto)
```
1. Middleware يفحص pathname
2. إذا /konto/* → getCustomerSessionFromRequest()
3. يقرأ كوكي customer_token
4. يتحقق من JWT (صلاحية، توقيع)
5. صالح → يسمح بالمرور
6. غير صالح → يحول لـ /anmelden?redirect=/original/path
7. الصفحة تُحمّل ConditionalLayout
8. عند التحميل: GET /api/auth/customer/session
9. يقرأ الكوكي مرة أخرى
10. يعين حالة customer إذا صالح
```

#### تدفق تسجيل الخروج
```
1. المستخدم يضغط زر "Abmelden"
2. logout() من CustomerAuthProvider
3. DELETE /api/auth/customer/session
4. الباكند يمسح كوكي customer_token (maxAge=0)
5. الفرونت يعين customer = null
6. window.location.href = '/' (hard redirect)
```

---

> **ملاحظة للمطور:** هذا التقرير يغطي نظام الكوكيز وقسم العملاء بكل تفاصيلهم التقنية. يجب تنفيذ كل الدوال والتدفقات والـ APIs المذكورة أعلاه بنفس المنطق والسلوك بالظبط.
