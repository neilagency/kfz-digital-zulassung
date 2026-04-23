# 📝 BLOG SYSTEM DOCUMENTATION

> **Blueprint Reference** — هذا التقرير يُستخدم كمرجع كامل لإعادة بناء نظام المدوّنة في مشروع آخر بنفس الدقة.

---

## 1. General Overview

| Property | Value |
|----------|-------|
| **System Name** | Insiderwissen Blog |
| **Listing URL** | `/insiderwissen` |
| **Post URL** | `/{slug}` (catch-all route — NOT under `/insiderwissen/`) |
| **Admin Editor** | `/admin/blog/[id]` |
| **Admin Listing** | `/admin/blog` |
| **Content Editor** | Tiptap (WYSIWYG) + Raw HTML toggle |
| **Media System** | MediaPicker modal — integrated media library |
| **Publishing** | Draft → Publish → Scheduled (3 modes) |
| **Scheduling** | Cron endpoint `GET /api/cron/publish-scheduled` |
| **ISR (listing)** | 300 seconds (5 min) |
| **ISR (post)** | 60 seconds (1 min) |
| **Posts per page** | 9 |
| **DB Model** | `BlogPost` (27 fields) |

---

## 2. Database Schema

### BlogPost Model

```prisma
model BlogPost {
  id              String    @id @default(cuid())
  wpPostId        Int?      @unique          // Legacy WP reference
  slug            String    @unique
  title           String
  content         String                      // HTML content (Tiptap output)
  excerpt         String    @default("")
  featuredImage   String    @default("")      // URL to image
  featuredImageId String    @default("")      // Media library record ID
  status          String    @default("draft") // draft | publish | scheduled
  author          String    @default("Admin")
  metaTitle       String    @default("")
  metaDescription String    @default("")
  focusKeyword    String    @default("")
  canonical       String    @default("")
  robots          String    @default("index, follow")
  ogTitle         String    @default("")
  ogDescription   String    @default("")
  ogImage         String    @default("")
  category        String    @default("")      // Category slug as string
  tags            String    @default("")      // Comma-separated tag slugs
  views           Int       @default(0)
  scheduledAt     DateTime?
  publishedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  @@index([slug])
  @@index([status])
  @@index([publishedAt])
  @@index([status, scheduledAt])
}
```

### Category Model

```prisma
model Category {
  id          String   @id @default(cuid())
  wpCatId     Int?     @unique
  name        String
  slug        String   @unique
  description String   @default("")
  count       Int      @default(0)
  parent      Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([slug])
}
```

### Tag Model

```prisma
model Tag {
  id          String   @id @default(cuid())
  wpTagId     Int?     @unique
  name        String
  slug        String   @unique
  description String   @default("")
  count       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([slug])
}
```

### Media Model (used by MediaPicker)

```prisma
model Media {
  id            String   @id @default(cuid())
  wpMediaId     Int?     @unique
  fileName      String   @default("")
  originalName  String   @default("")
  title         String   @default("")
  altText       String   @default("")
  sourceUrl     String
  localPath     String   @default("")
  thumbnailUrl  String   @default("")
  mediumUrl     String   @default("")
  largeUrl      String   @default("")
  webpUrl       String   @default("")
  avifUrl       String   @default("")
  mimeType      String   @default("")
  width         Int      @default(0)
  height        Int      @default(0)
  fileSize      Int      @default(0)
  folder        String   @default("")
  usedIn        String   @default("[]")
  useCount      Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 3. Blog Listing Page (Public)

### File Location
```
src/app/insiderwissen/page.tsx
```

### Technical Details
| Property | Value |
|----------|-------|
| **Type** | Server Component (async) |
| **ISR** | `export const revalidate = 300` (5 minutes) |
| **Data Fetching** | `Promise.all([getAllPosts(page, perPage, cat), getCategories()])` |
| **Search Params** | `?page=N&cat=slug` |
| **Posts per Page** | 9 |
| **Grid** | 3 columns responsive (`md:grid-cols-2 lg:grid-cols-3`) |

### Page Sections (بالترتيب)

1. **Hero Header**
   - Gradient background: `from-dark via-primary-900 to-dark`
   - Icon: `BookOpen` (lucide-react)
   - Title: `"Insiderwissen"`
   - Description: `"Expertenwissen rund um ..."`

2. **Category Filter Pills**
   - "Alle" (default) + categories from DB
   - Each category shows count badge
   - Active filter: filled background
   - Links: `?cat={slug}` (page resets to 1)

3. **Category SEO Description Block**
   - Shows only when a category filter is active
   - Hardcoded `CATEGORY_DESCRIPTIONS` map (~12 categories)
   - Long SEO-friendly text for each category

4. **Blog Cards Grid**
   - 9 posts per page
   - Each card uses `BlogCard` component

5. **Smart Pagination**
   - 7-page window with prev/next buttons
   - Links: `?page=N&cat={cat}`
   - Ellipsis for large page counts

### Metadata Generation

| Condition | Title | Index | Canonical |
|-----------|-------|-------|-----------|
| Main page (no filter, page 1) | "Insiderwissen – Kfz..." | `index, follow` | `/insiderwissen` |
| Category filter | "Category Name – Insiderwissen" | `index, follow` | `/insiderwissen` (canonical consolidation) |
| Pagination (page > 1) | "Insiderwissen – Seite N" | `noindex, follow` | `/insiderwissen?page=N` (self-referencing) |

---

## 4. BlogCard Component

### File Location
```
src/components/BlogCard.tsx
```

### Interface
```typescript
interface BlogCardProps {
  post: LocalPost  // { slug, title, excerpt, featuredImage, publishedAt, category }
}
```

### Rendered Elements
1. **Featured Image** — 16:10 aspect ratio, `next/image`, lazy loading, hover scale 105%
2. **Date** — German locale `de-DE`, format: `{ year: 'numeric', month: 'long', day: 'numeric' }`
3. **Title** — `<h3>`, truncated 2 lines
4. **Excerpt** — HTML stripped, truncated 160 chars
5. **"Weiterlesen" link** — Arrow icon

### Link Target
- Links to `/{post.slug}` (NOT `/insiderwissen/{slug}`)
- This is because blog posts are handled by the catch-all `[slug]` route

### Hover Effects
- `shadow-xl`
- `translate-y-1`
- Image scale 105%

---

## 5. Single Blog Post Page (Public)

### File Location
```
src/app/[slug]/page.tsx
```

### Important: Catch-All Route Logic

This is a **shared `[slug]` route** that handles:
1. **Pages** (`Page` model) → renders `PageView` or `CityPageView`
2. **Blog Posts** (`BlogPost` model) → renders `BlogPostView`
3. Otherwise → `notFound()`

**Priority**: Page check first, then BlogPost check.

**Reserved slugs** (excluded from catch-all):
```
insiderwissen, rechnung, admin, product, api, ...
```

### Technical Details
| Property | Value |
|----------|-------|
| **Type** | Server Component (async) |
| **ISR** | `export const revalidate = 60` (1 minute) |
| **Static Generation** | `generateStaticParams()` → only `Page` slugs (blog is on-demand ISR) |
| **Dynamic Params** | `export const dynamicParams = true` |

### BlogPostView Layout

**Two-column layout**: Content (left, `2/3`) + Sidebar (right, `lg:w-80 xl:w-[340px]`)

#### Hero Section
| Element | Details |
|---------|---------|
| Gradient BG | `from-dark via-primary-900 to-dark` |
| Breadcrumb | Start → Insiderwissen → Post Title (with ChevronRight separators) |
| Title | `<h1>` from post |
| Meta info | Date (German) + Reading time (`Math.ceil(wordCount / 200)` min) |
| CTA Buttons | 2 buttons — Abmeldung + WhatsApp |

#### Featured Image
| Property | Value |
|----------|-------|
| Aspect Ratio | 2:1 |
| Loading | `priority` |
| Size | Full width |
| Component | `next/image` |

#### Content Area
| Property | Value |
|----------|-------|
| Sanitization | `isomorphic-dompurify` via `sanitizeHtml()` |
| Typography | `prose prose-lg` Tailwind CSS Typography |
| Heading IDs | Auto-injected via regex scan of `<h2>` and `<h3>` for TOC anchoring |

#### Share Bar
- WhatsApp share link
- Facebook share link

#### Big CTA Block
- Gradient card below content
- 2 buttons: Abmeldung + Anmeldung (with dynamic pricing from DB)

### Sidebar Components (بالترتيب، sticky)

1. **CTA Card** — Gradient, links to Abmeldung + Anmeldung products with live pricing from DB
2. **Table of Contents (TOC)** — Auto-generated from h2/h3 headings in post content
   - Sticky `top-24`
   - h3 entries indented
   - Max-height with scroll
   - Only shown when > 2 headings
3. **Help Card** — Phone + WhatsApp contact links from site settings
4. **Trust Badges** — KBA-registered, 24/7, instant confirmation

### SEO & Structured Data

#### Metadata (via `buildSEOMetadata()`)
| Property | Logic |
|----------|-------|
| **Title** | `metaTitle || title` — truncated to keep total ≤ 70 chars (accounting for site suffix " \| Online Auto Abmelden") |
| **Description** | `metaDescription || excerpt` |
| **Canonical** | Auto-generated from slug (ignores stale DB values) |
| **OpenGraph** | `type: 'article'`, `publishedTime`, `modifiedTime` |
| **Twitter** | `card: 'summary_large_image'` |
| **Robots** | Non-production → `noindex, nofollow`; Production → from DB field |

#### JSON-LD Structured Data

**Article Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Post Title",
  "datePublished": "2025-01-15T...",
  "dateModified": "2025-01-16T...",
  "author": { "@type": "Organization", "name": "Online Auto Abmelden" },
  "publisher": {
    "@type": "Organization",
    "name": "Online Auto Abmelden",
    "logo": { "@type": "ImageObject", "url": ".../logo.webp" }
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://..." },
  "image": "featured-image-url"
}
```

**Breadcrumb Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "position": 1, "name": "Start", "item": "https://..." },
    { "position": 2, "name": "Insiderwissen", "item": "https://.../insiderwissen" },
    { "position": 3, "name": "Post Title" }
  ]
}
```

---

## 6. Admin Blog Editor

### File Location
```
src/app/admin/(dashboard)/blog/[id]/page.tsx
```

### Route
- `/admin/blog/new` — إنشاء مقال جديد
- `/admin/blog/{cuid}` — تعديل مقال موجود

### Component Type
- Client Component (`'use client'`)
- Dynamic imports: `TiptapEditor` + `MediaPicker` — loaded with `next/dynamic({ ssr: false })`

### Form State (16 fields)

```typescript
const [formData, setFormData] = useState({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  status: 'draft',
  category: '',
  featuredImage: '',
  featuredImageId: '',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  canonical: '',
  ogTitle: '',
  ogDescription: '',
  tags: '',
  scheduledAt: '',
});
```

### Layout — 3-column grid (`lg:grid-cols-3`)

#### Left Column (`col-span-2`)

1. **Title Input**
   - Auto-generates slug on new posts via `generateSlug(title)`
   - Large font input

2. **Slug Input**
   - Shows prefix: `/insiderwissen/` (display only)
   - Editable slug value

3. **Content Editor**
   - Toggle: Visual (Tiptap) ↔ HTML (raw textarea)
   - HTML mode: `font-mono bg-gray-900 text-green-400`
   - Visual mode: Full Tiptap editor

4. **Excerpt Textarea**
   - Plain text excerpt for listings and SEO fallback

5. **SEO Section**
   - **Google Snippet Preview**: URL + Title + Description (live preview)
   - **Meta Title**: Input + character counter (60 max, green/red progress bar)
   - **Meta Description**: Textarea + character counter (160 max, green/red progress bar)
   - **Canonical URL**: Input
   - **Open Graph Subsection**:
     - Preview card (image + title + description)
     - OG Title input
     - OG Description textarea
   - **Focus Keyword**: Input

#### Right Column (Sidebar)

1. **Publish Mode Selector** — 3 radio buttons:
   | Mode | Label | Behavior |
   |------|-------|----------|
   | `draft` | Entwurf | يحفظ كمسودة |
   | `publish` | Veröffentlichen | ينشر فوراً, sets `publishedAt = now` |
   | `schedule` | Planen | يحدد موعد نشر مستقبلي |

2. **Schedule DateTime Picker**
   - Shows only in `schedule` mode
   - `<input type="datetime-local">`
   - Warning if date is in the past

3. **Save/Publish Button**
   - Dynamic label: "Entwurf speichern" / "Veröffentlichen" / "Planen"
   - Loading state with spinner

4. **Category Input**
   - Text input (free-form — NOT a select)
   - Stores category slug

5. **Tags Input**
   - Text input
   - Comma-separated values

6. **Featured Image**
   - 3 source options:
     | Option | Action |
     |--------|--------|
     | "Aus Mediathek" | Opens MediaPicker modal — returns `{ url, alt, id }` |
     | "URL eingeben" | Direct URL text input |
   - Preview thumbnail after selection
   - "Ändern" (change) + "Entfernen" (remove) buttons

### Save Logic

| Action | Method | Endpoint |
|--------|--------|----------|
| New post | `POST` | `/api/admin/blog` |
| Edit post | `PUT` | `/api/admin/blog/{id}` |

After save: shows success toast → redirects to `/admin/blog` after 800ms.

---

## 7. Admin Blog Listing

### File Location
```
src/app/admin/(dashboard)/blog/page.tsx
```

### Data Fetching
- Uses `useBlogPosts()` SWR hook from `src/lib/admin-api.ts`
- `GET /api/admin/blog?page=N&limit=M&status=X&search=Y`

### Features

1. **Status Filter Tabs**: Alle | Veröffentlicht | Geplant | Entwurf
2. **Search Input**: Filters by title/slug
3. **Virtualized Table**: `react-window` `FixedSizeList`, `ROW_HEIGHT = 52`
4. **Columns**: Titel, Status (badge), Kategorie, Views, Datum, Aktionen
5. **Status Badges**:
   | Status | Badge Color | Icon |
   |--------|-------------|------|
   | `publish` | Green | — |
   | `scheduled` | Yellow | 🕐 + datetime |
   | `draft` | Gray | — |
6. **Actions**: Edit (link) + Delete (with `ConfirmModal`)
7. **Pagination**: Page selector + page size selector
8. **"Neuer Beitrag" Button** → `/admin/blog/new`

---

## 8. TiptapEditor Component

### File Location
```
src/components/admin/TiptapEditor.tsx
```

### Extensions Used

| Extension | Package | Configuration |
|-----------|---------|---------------|
| `StarterKit` | `@tiptap/starter-kit` | `heading.levels: [2, 3, 4]` |
| `Image` | `@tiptap/extension-image` | `HTMLAttributes: { class: 'max-w-full rounded-lg' }` |
| `TextAlign` | `@tiptap/extension-text-align` | `types: ['heading', 'paragraph']` |
| `Placeholder` | `@tiptap/extension-placeholder` | Configurable placeholder text |
| `Highlight` | `@tiptap/extension-highlight` | Default config |

### Toolbar Buttons (بالترتيب)

| Group | Buttons |
|-------|---------|
| Text Formatting | Bold, Italic, Underline, Strikethrough, Highlight |
| Headings | H2, H3, H4 |
| Lists | Bullet List, Ordered List |
| Alignment | Left, Center, Right |
| Blocks | Blockquote, Code Block, Horizontal Rule |
| Insert | Link (prompt for URL), Image (prompt for URL) |
| History | Undo, Redo |

Groups are separated by divider elements.

### Editor Config
| Property | Value |
|----------|-------|
| CSS Classes | `prose prose-sm max-w-none` |
| Min Height | `min-h-[400px]` |
| Immediate Render | `false` |
| Update Method | `onUpdate` callback to parent |

### Content Sync
- `useEffect` watches external content prop changes
- Updates editor content without emitting `onUpdate` (prevents loops)

---

## 9. MediaPicker Component

### File Location
```
src/components/admin/MediaPicker.tsx
```

### Type
- Modal component — fullscreen overlay
- Size: `90vw max-w-4xl h-[80vh]`

### Two Tabs

#### Tab 1: Mediathek (Library)
| Property | Value |
|----------|-------|
| Grid | 8 columns |
| Pagination | Page-based |
| Search | 300ms debounce |
| API | `GET /api/admin/media?page=N&limit=30&search=X` |
| Image Fallback | `thumbnailUrl → localPath → sourceUrl` |
| Error State | Placeholder icon |

#### Tab 2: Hochladen (Upload)
| Property | Value |
|----------|-------|
| Type | Drag-and-drop zone |
| Multi-file | ✅ Yes |
| API | `POST /api/admin/upload` |

### Selection
- Click image → blue border + checkmark
- Confirm button → returns `{ url, alt, id }` to parent

### Integration with Blog Editor
- Used for featured image selection
- Returns: `url` → `featuredImage`, `id` → `featuredImageId`

---

## 10. Blog API Endpoints

### Admin CRUD

#### GET `/api/admin/blog`
```
Params: page, limit (max 100), status, search (title/slug contains)
Select: id, title, slug, status, category, featuredImage, featuredImageId,
        views, publishedAt, scheduledAt, createdAt, updatedAt
Response: { posts, pagination: { page, limit, total, pages } }
Cache: private, max-age=5, stale-while-revalidate=30
```

#### POST `/api/admin/blog`
```
Body: blogPostCreateSchema (Zod validated)
Scheduling: past/now scheduledAt → publish immediately; future → status=scheduled
Revalidates: /{slug}, /insiderwissen, /sitemap.xml, tag 'blog'
Response: 201 with post
Error: 409 on duplicate slug
```

#### GET `/api/admin/blog/[id]`
```
Returns: full post with ISO date strings for scheduledAt/publishedAt
```

#### PUT `/api/admin/blog/[id]`
```
Body: blogPostUpdateSchema (Zod validated)
Preserves: existing publishedAt when re-saving published posts
Scheduling + Revalidation: same as POST
```

#### DELETE `/api/admin/blog/[id]`
```
Deletes: post from DB
Revalidates: same paths + tag
```

### Zod Validation Schemas

```typescript
// src/lib/validations.ts

const blogPostCreateSchema = z.object({
  title:           z.string().min(1).max(500),
  slug:            z.string().min(1).max(500),
  content:         z.string().max(200000).optional().default(''),
  excerpt:         z.string().max(2000).optional().default(''),
  status:          z.enum(['draft', 'scheduled', 'publish']).optional().default('draft'),
  category:        z.string().max(200).optional().default(''),
  featuredImage:   z.string().max(2000).optional().default(''),
  featuredImageId: z.string().max(200).optional().default(''),
  tags:            z.string().max(2000).optional().default(''),
  scheduledAt:     z.string().nullable().optional(),
  metaTitle:       z.string().max(200).optional().default(''),
  metaDescription: z.string().max(500).optional().default(''),
  focusKeyword:    z.string().max(200).optional().default(''),
  canonical:       z.string().max(500).optional().default(''),
  ogTitle:         z.string().max(200).optional().default(''),
  ogDescription:   z.string().max(500).optional().default(''),
});

const blogPostUpdateSchema = blogPostCreateSchema.extend({
  id: z.string().min(1),
});
```

---

## 11. Scheduling System (Cron)

### File Location
```
src/app/api/cron/publish-scheduled/route.ts
```

### Details
| Property | Value |
|----------|-------|
| Method | `GET` only |
| Cache | `force-dynamic` |
| Auth | `Authorization: Bearer ${CRON_SECRET}` |
| Auth Failure | 401 Unauthorized |

### Logic
```
1. Query: SELECT * FROM BlogPost WHERE status='scheduled' AND scheduledAt <= NOW()
2. Transaction: For each matching post:
   - SET status = 'publish'
   - SET publishedAt = NOW()
   - SET scheduledAt = NULL
3. Revalidate: Each /{slug}, /insiderwissen, /sitemap.xml, tag 'blog'
4. Response: { published: N, posts: [{ id, slug, title }] }
```

### Setup
- Requires `CRON_SECRET` environment variable
- Call periodically (e.g., every minute via external cron service)
- Example cURL:
  ```bash
  curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
       https://yourdomain.com/api/cron/publish-scheduled
  ```

---

## 12. Data Access Layer

### File Location
```
src/lib/db.ts
```

### Blog-related Functions

| Function | Cache | Revalidate | Tags | Description |
|----------|-------|------------|------|-------------|
| `getAllPosts(page, perPage, categoryFilter)` | `unstable_cache` | 300s | `['blog-posts']` | Published posts, ordered by `publishedAt desc` |
| `getPostBySlug(slug)` | `unstable_cache` | 60s | — | Full post by slug |
| `getAllPostSlugs()` | No cache | — | — | All published post slugs (for sitemap) |
| `getCategories()` | `unstable_cache` | 300s | `['blog-categories']` | Categories with `count > 0`, ordered by count desc |

### Helper Utilities

| Function | Location | Purpose |
|----------|----------|---------|
| `stripHtml(html)` | `src/lib/db.ts` | Regex strips HTML tags + entities |
| `formatDate(date)` | `src/lib/db.ts` | German locale `de-DE`: `{ year, month: 'long', day: 'numeric' }` |
| `buildSEOMetadata(item, siteUrl)` | `src/lib/db.ts` | Comprehensive SEO metadata builder with OG, Twitter, canonical |
| `sanitizeHtml(html)` | `src/lib/sanitize.ts` | DOMPurify sanitization for blog content |
| `sanitizeForSchema(text)` | `src/lib/sanitize.ts` | Strips ALL HTML for JSON-LD structured data |

### HTML Sanitization (isomorphic-dompurify)

**Allowed Tags:**
- Structure: `div, span, p, br, hr`
- Headings: `h1-h6`
- Lists: `ul, ol, li`
- Text: `strong, em, b, i, u, s, mark, sup, sub, small`
- Links: `a`
- Images: `img, figure, figcaption`
- Tables: `table, thead, tbody, tfoot, tr, th, td`
- Blocks: `blockquote, pre, code`
- Embeds: `iframe` (YouTube)

**Allowed Attributes:**
```
id, class, style, href, target, rel, src, alt, width, height,
loading, data-*, aria-*, iframe attributes (allow, allowfullscreen, frameborder)
```

---

## 13. SEO Configuration

### Sitemap (`src/app/sitemap.ts`)

| Category | Priority | Change Frequency |
|----------|----------|-----------------|
| Homepage | 1.0 | daily |
| Products | 1.0 | daily |
| `/insiderwissen` | 0.9 | daily |
| Blog Posts | 0.7 | weekly |
| Static Pages | 0.7 | monthly |

- Deduplication with `Set`
- Excluded slugs: ~20+ old WP redirects, duplicates, admin routes
- Filters out URL-encoded slugs

### Robots (`src/app/robots.ts`)

| Environment | Rules |
|-------------|-------|
| Production | Allow `/`, Disallow `/api/`, `/admin/`, includes sitemap URL |
| Non-production | Disallow everything |

---

## 14. Heading Injection & TOC Generation

### Logic (in BlogPostView)

```typescript
// 1. Scan content for <h2> and <h3> tags via regex
const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/g;

// 2. For each heading:
//    - Generate ID from text: slugify(text)
//    - Inject id attribute: <h2 id="generated-id">Text</h2>
//    - Collect: { level, text, id }

// 3. Modified content has IDs injected for anchor scrolling
// 4. Headings array passed to TOC sidebar component
```

### TOC Sidebar Component
| Property | Value |
|----------|-------|
| Position | Right sidebar, sticky `top-24` |
| Visibility | Only when > 2 headings |
| Indentation | h3 entries indented vs h2 |
| Scrollable | `max-height` with overflow scroll |
| Click behavior | Smooth scroll to heading anchor |

---

## 15. Reading Time Calculation

```typescript
const wordCount = stripHtml(post.content).split(/\s+/).length;
const readingTime = Math.ceil(wordCount / 200); // minutes
// Display: "{readingTime} Min. Lesezeit"
```

---

## 16. Key Dependencies

| Package | Purpose |
|---------|---------|
| `@tiptap/react` | Rich text editor core |
| `@tiptap/starter-kit` | Basic editor extensions |
| `@tiptap/extension-image` | Image insertion in editor |
| `@tiptap/extension-text-align` | Text alignment |
| `@tiptap/extension-placeholder` | Placeholder text |
| `@tiptap/extension-highlight` | Text highlighting |
| `isomorphic-dompurify` | HTML sanitization (SSR-safe) |
| `swr` | Client-side data fetching (admin) |
| `react-window` | Virtualized table (admin listing) |
| `date-fns` + `date-fns/locale/de` | Date formatting |
| `lucide-react` | Icons throughout |
| `zod` | Schema validation for API |
| `next/image` | Optimized images |

---

## 17. Complete Blog User Journey

### Public User
```
1. يزور /insiderwissen
2. يرى قائمة المقالات (9 per page) مع تصفية بالفئات
3. يختار فئة → يرى مقالات الفئة فقط + نص SEO وصفي
4. يضغط على مقال → ينتقل إلى /{slug}
5. يرى:
   - Hero مع عنوان + تاريخ + وقت القراءة
   - صورة رئيسية
   - محتوى المقال (HTML sanitized)
   - جدول المحتويات (sidebar)
   - أزرار مشاركة (WhatsApp + Facebook)
   - CTA للخدمات (Abmeldung + Anmeldung)
   - معلومات الاتصال
6. يمكنه التنقل عبر Breadcrumb
```

### Admin User
```
1. يدخل /admin/blog
2. يرى قائمة المقالات (virtualized table) مع فلترة حسب الحالة
3. يبحث عن مقال بالعنوان أو slug
4. يضغط "Neuer Beitrag" أو يعدّل مقال موجود
5. في المحرر:
   a. يكتب العنوان (slug يتولد تلقائياً)
   b. يكتب المحتوى بـ Tiptap (WYSIWYG) أو HTML مباشر
   c. يضيف صور من MediaPicker أو URL
   d. يكتب Excerpt
   e. يملأ حقول SEO (meta title, description, OG, focus keyword)
   f. يختار الفئة والتاجات
   g. يختار Featured Image (من المكتبة أو URL)
   h. يختار وضع النشر: Draft / Publish / Schedule
   i. إذا Schedule → يحدد التاريخ والوقت
   j. يضغط حفظ
6. المقال ينشر فوراً أو ينتظر الـ Cron
7. الـ Cron يتحقق كل دقيقة → ينشر المقالات المجدولة
8. ISR يحدث المحتوى: 60s للمقال، 300s للقائمة
```

---

## 18. Environment Variables (Blog-related)

| Variable | Purpose | Required |
|----------|---------|----------|
| `CRON_SECRET` | Authentication for scheduling cron endpoint | ✅ Production |
| `NEXT_PUBLIC_SITE_URL` | Used in canonical URLs, OG tags, structured data | ✅ |
| `NODE_ENV` | Controls robots (noindex in non-production) | Auto |

---

## 19. Cache & Revalidation Strategy

| Resource | Cache Method | TTL | Invalidation |
|----------|-------------|-----|-------------|
| Blog listing | `unstable_cache` | 300s | Tag: `blog-posts` |
| Single post | `unstable_cache` | 60s | Path: `/{slug}` |
| Categories | `unstable_cache` | 300s | Tag: `blog-categories` |
| Admin API | HTTP cache | 5s + stale-while-revalidate 30s | — |
| On post save | `revalidatePath` + `revalidateTag` | Immediate | `/{slug}`, `/insiderwissen`, `/sitemap.xml`, tag `blog` |

---

## 20. File Upload for Blog Images

### Upload via MediaPicker
```
POST /api/admin/upload → saves to /public/uploads/ → creates Media record → returns URL
```

### Upload via Tiptap
- Toolbar "Image" button → prompts for URL
- Pastes URL directly into editor content (no upload)

### Featured Image Sources
1. **MediaPicker** → selects from Media library → stores `url` + `id`
2. **Direct URL** → user enters URL → stores `url` only (no `id`)
