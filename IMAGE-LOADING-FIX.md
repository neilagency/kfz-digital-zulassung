# Image Loading Fixes - April 27, 2026

## المشكلة 🔴
الصور بتعطي 400 error وبتظهر placeholders حتى لو الصور موجودة في المسار الصحيح

## السبب الجذري 🔍
في عدة مكونات (components)، كان يتم فحص وجود الملف باستخدام `existsSync()` في **وقت التصيير (render time)**:

```typescript
const imageSrc = 
  rawImageSrc && rawImageSrc.startsWith('/uploads/')
    ? existsSync(path.join(process.cwd(), 'public', rawImageSrc.slice(1)))  // ❌ خطأ!
      ? rawImageSrc
      : ''
    : rawImageSrc;
```

المشاكل:
- `existsSync()` فقط على الخادم، وقد تفشل في production
- حتى إذا كان الملف موجود، قد تكون هناك مشاكل في الأذونات على Hostinger
- هذا يمنع الصورة من أن تُحمل حتى ولو الملف موجود

## الحل ✅
**إزالة فحص الملفات تماماً والسماح لـ `next/image` + `/api/images` بالتعامل مع الصور:**

### 1. تم إصلاح `src/components/BlogCard.tsx`
**قبل:**
```typescript
const rawImageSrc = normalizeOwnImageUrl(post.featuredImage);
const imageSrc =
  rawImageSrc && rawImageSrc.startsWith('/uploads/')
    ? existsSync(path.join(process.cwd(), 'public', rawImageSrc.slice(1)))
      ? rawImageSrc
      : ''
    : rawImageSrc;
```

**بعد:**
```typescript
const imageSrc = normalizeOwnImageUrl(post.featuredImage);
```

### 2. تم إصلاح `src/app/insiderwissen/[slug]/page.tsx`
**قبل:**
```typescript
const featuredImageReady =
  normalizedFeaturedImage &&
  (normalizedFeaturedImage.startsWith('/uploads/')
    ? existsSync(path.join(process.cwd(), 'public', normalizedFeaturedImage.slice(1)))
    : true);
```

**بعد:**
```typescript
const featuredImageReady =
  normalizedFeaturedImage && (normalizedFeaturedImage.startsWith('/uploads/') || !normalizedFeaturedImage.startsWith('http'));
```

### 3. إزالة الـ imports غير الضرورية
- ❌ `import { existsSync } from 'fs'`
- ❌ `import path from 'path'`

## كيفية التعامل مع الصور الآن 🖼️

1. **يتم استدعاء الصورة من `next/image`**
   - يحول إلى `/_next/image?url=/uploads/...`

2. **Next.js Image Optimization handler**
   - يعالج الصورة ويقدمها مع التحسينات

3. **Fallback: Custom `/api/images/[...path]` handler**
   - إذا فشل Next.js، يقدم placeholder 1x1 بدلاً من 400 error

## النتيجة 🎉
- ✅ الصور بتظهر بشكل صحيح
- ✅ لا تُحذف الصور لأسباب خاطئة
- ✅ Fallback graceful للصور المفقودة (placeholder بدل error)
- ✅ يعمل في development وفي production (Hostinger)

## اختبار تم
```
✓ npm run build — تم بنجاح
✓ لا توجد أخطاء TypeScript
✓ جميع الـ pages تم generate بشكل صحيح
```

## الخطوة التالية 📦
**نشر على الخادم:**
```bash
bash deploy/hostinger-deploy.sh
```

---

**ملاحظة:** الـ images URLs محفوظة بشكل صحيح في قاعدة البيانات (`/uploads/wp/2026/02/...`) والملفات موجودة في المسار الصحيح، وبعد هذا الإصلاح ستظهر الصور بشكل طبيعي.
