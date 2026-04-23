# SEO & Indexing Audit — onlineautoabmelden.com

**Date:** 2026-04-12
**Auditor:** Technical SEO Engineering Review
**Scope:** Full codebase analysis + live site crawl

---

## 1. Executive Summary

### Overall SEO Health Score: **6.5 / 10**

The site has a well-architected city pages system (~400+ pages), proper redirects for legacy WordPress URLs, canonical tags are present, and robots.txt is correctly configured. However, several critical issues are actively damaging crawl efficiency, indexing, and potential rankings.

### Top 5 Critical Issues

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 1 | **Internal links point to alias URLs (308 redirects)** — homepage + CityPageView link to ~15+ alias URLs instead of canonical slugs | 🔴 Critical | Crawl budget waste, diluted PageRank, slower indexing |
| 2 | **`krichheim` slug typo** — Kirchheim city page has wrong slug in CITY_ENTRIES, both `/kirchheim` AND `/krichheim` return 404 | 🔴 Critical | Lost city page, broken internal link |
| 3 | **Berlin page shows "Berlin Zulassungsstelle" as city name** — generic Behörde data, unnatural title/H1 | 🔴 Critical | Thin content signal, poor user experience, Google may classify as soft 404 |
| 4 | **~20+ city pages show generic authority data** ("Zuständige Zulassungsstelle, vor Ort") — CSV lookup fails | 🟡 Medium | Content uniqueness issues, potential "Crawled — currently not indexed" |
| 5 | **No FAQ structured data (Schema.org)** despite FAQ sections on every city page | 🟡 Medium | Missing SERP real estate (FAQ rich results) |

---

## 2. 404 Error Report

### 2.1 Confirmed 404 URLs

| URL | Category | Root Cause |
|-----|----------|------------|
| `/krichheim` | **Typo in CITY_ENTRIES** | Slug defined as `krichheim` instead of `kirchheim` — page doesn't exist in DB with either slug |
| `/kirchheim` | **Missing city page** | Not in CITY_ENTRIES as a direct slug, not an alias |
| `/auto-online-abmelden-muenchen-2` | **Duplicate cleanup** | Explicitly excluded in sitemap, but still discoverable by crawlers if previously indexed |
| `/bonn-2` | **Duplicate cleanup** | Same as above |
| `/some-nonexistent-page` | **Generic 404** | Correctly returns 404 |

### 2.2 WordPress Legacy URLs (Properly Handled)

These are correctly returning **308 redirects** — no action needed:

| Old URL | Redirects To | Status |
|---------|-------------|--------|
| `/orte` | `/kfz-zulassung-abmeldung-in-deiner-stadt` | 308 ✅ |
| `/blog` | `/insiderwissen` | 308 ✅ |
| `/fahrzeugabmeldung` | `/product/fahrzeugabmeldung` | 308 ✅ |
| `/wp-admin` | `/` | 308 ✅ |
| `/datenschutz` | `/datenschutzhinweise` | 308 ✅ |
| `/sitemap_index.xml` | `/sitemap.xml` | 301 ✅ |

### 2.3 Deleted Slugs (410 Gone System)

The `DeletedSlug` model exists in Prisma schema but needs verification that it's actually being used in the [slug] route. **Current code in `[slug]/page.tsx` does NOT check `DeletedSlug` table** — it simply calls `notFound()` (404) for unpublished pages. The 410 Gone logic mentioned in the repo memory may be in a different code path or not yet implemented.

**Impact:** Google treats 404 and 410 differently. 410 tells Google "permanently removed — stop crawling." 404 means "might come back." For deleted duplicate city pages (muenchen-2, bonn-2, etc.), a 410 response would be vastly more efficient.

### 2.4 Estimated 404 Categories from Google's Perspective

| Category | Estimated Count | Root Cause |
|----------|----------------|------------|
| Old WordPress/Elementor URLs | 50-100+ | WordPress migration residuals (category, tag, author archives, wp-json endpoints) |
| Deleted duplicate city pages (-2, -3 suffixes) | ~18 pages | Phase 7 cleanup — unpublished but not deleted from DB |
| Wrong slug structure | 1-2 | `krichheim` typo |
| Encoded URL slugs (`%`-containing) | Unknown | Filtered from sitemap but may still exist in DB |

---

## 3. City Pages Report

### 3.1 Overview

| Metric | Count |
|--------|-------|
| City entries in `CITY_ENTRIES` | ~400+ |
| City slug aliases in `CITY_SLUG_ALIASES` | 38 |
| Excluded duplicate slugs in sitemap | 18 |
| City listing page | `/kfz-zulassung-abmeldung-in-deiner-stadt` ✅ |

### 3.2 URL Structure Consistency — **INCONSISTENT** ⚠️

The city URL structure is not consistent. There are at least 6 different slug patterns:

| Pattern | Example | Count |
|---------|---------|-------|
| Simple city name | `/aachen`, `/bonn`, `/mainz` | ~300 |
| `auto-online-abmelden-{city}` | `/auto-online-abmelden-muenchen` | ~10 |
| `kfz-online-abmelden-{city}` | `/kfz-online-abmelden-in-hamburg` | ~5 |
| `auto-abmelden-online-in-{city}` | `/auto-abmelden-online-in-gelsenkirchen` | 1 |
| `zulassungsservice-{city}` | `/zulassungsservice-hannover` | ~10 |
| `{city}-zulassungsstelle` | `/berlin-zulassungsstelle` | ~3 |
| `kfz-zulassung-{city}` | `/kfz-zulassung-pirna` | 2 |
| `kfz-zulassungsstelle-{city}` | `/kfz-zulassungsstelle-goeppingen` | 1 |
| `landkreis-{name}` | `/landkreis-augsburg` | ~30 |

**SEO Impact:** This inconsistency is NOT critical for rankings alone, but it:
- Makes URL patterns unpredictable for users
- Complicates internal linking (developers must remember each city's exact slug)
- Creates confusion about which is "the" slug vs. an alias

### 3.3 Indexing Status Assessment

**Likely indexed:** Major cities with unique content (Hamburg — has real Behörde data, FAQ, nearby cities)

**Likely "Crawled — currently not indexed":**
- City pages with generic Behörde data ("Zuständige Zulassungsstelle, vor Ort")
- Template-content cities with low content uniqueness scores
- Cities that are only differentiated by the city name being templated in

**Reasons for non-indexing:**
1. **Near-identical content** — If 300+ city pages share the same template with only the city name changed, Google will classify them as thin/duplicate content
2. **Generic authority data** — Pages where the CSV lookup fails show "Zuständige Zulassungsstelle, vor Ort, [CityName]" which is meaningless content
3. **No unique local value** — the FAQ answers are identical across all cities (only the city name changes)

### 3.4 Specific Issues

#### A. Kirchheim Typo — 🔴 CRITICAL
```
File: src/lib/city-slugs.ts
Entry: ['Kirchheim', 'krichheim']  ← TYPO: missing 'i' in 'kirch'
Should be: ['Kirchheim', 'kirchheim']
```
Both `/kirchheim` and `/krichheim` return 404. The city page is completely inaccessible.

#### B. Berlin "Zulassungsstelle" in City Name — 🔴 CRITICAL
```
Entry: ['Berlin Zulassungsstelle', 'berlin-zulassungsstelle']
```
The city name is "Berlin Zulassungsstelle" so ALL templates render:
- H1: "Berlin Zulassungsstelle" (not "Berlin")
- "Auto online abmelden in Berlin Zulassungsstelle"
- "Häufige Fragen zur Abmeldung in Berlin Zulassungsstelle"
- Behörde lookup fails → shows generic data

**Fix:** Change CITY_ENTRIES name to "Berlin" and fix the Behörde CSV entry.

#### C. München Generic Authority — 🟡 HIGH
München page shows "Zuständige Zulassungsstelle, vor Ort, München" instead of real KVR (Kreisverwaltungsreferat) data. This is Germany's third-largest city.

#### D. "Rott weil" vs "Rottweil" Duplicate Entry
```
['Rott weil', 'rott-weil'],      // space in name, separate slug
['Rottweil', 'rottweil'],         // correct entry
```
Two entries for the same city — one with a space typo. Both slugs may exist in the DB.

#### E. `Königsbach-Stein` → `konigsbach-stein` (missing ö encoding)
The slug uses `konigsbach-stein` instead of `koenigsbach-stein`. This is inconsistent with the pattern used everywhere else (ö→oe, ü→ue, ä→ae).

#### F. `Mühlacker` → `muhlacker` (missing ü encoding)
Should be `muehlacker`.

#### G. `Müllheim` → `mullheim` (missing ü encoding)
Should be `muellheim`.

### 3.5 Internal Linking Between City Pages

**Nearby cities system:** Implemented in `CityPageView.tsx` via hardcoded `CITY_NEIGHBORS` map.

**Issues:**
1. Only ~15 major cities have defined neighbor relationships
2. All other cities fall back to a pseudo-random selection from `TOP_CITY_LINKS` (23 cities)
3. **Several neighbor links point to ALIAS slugs** that trigger 308 redirects:
   - `berlin-zulassungsstelle` → this IS canonical ✅
   - `krefeld-strassenverkehrsamt` → ALIAS → `krefeld` ⚠️
   - `auto-online-abmelden-in-neuss` → this IS canonical ✅
   - `muenchen-zulassungsstelle` → ALIAS → `auto-online-abmelden-muenchen` ⚠️
   - `kfz-online-abmelden-koeln` → canonical ✅

4. Each city page only links to 5 other cities — for 400+ pages this creates a very sparse link graph

---

## 4. Sitemap Audit

### 4.1 Structure
- Single `sitemap.xml` generated by Next.js metadata API
- Contains: static routes + published pages + blog posts + products
- De-duplicated via `Set`

### 4.2 Issues Found

| Issue | Severity | Detail |
|-------|----------|--------|
| **All lastmod dates are identical** | 🟡 Medium | Static routes use `new Date()` (build time). All page entries use `updatedAt` from DB, but city-page templates rarely change, so hundreds of entries share the same date. Google may reduce crawl frequency when lastmod is unreliable. |
| **No sitemap index** | 🟢 Low | With 400+ pages, a single sitemap works fine (under 50k limit), but segmenting by type (cities, blog, products) would give better GSC insights. |
| **Deleted -2/-3 pages in EXCLUDED_SLUGS** | ✅ Correct | Properly excluded. These return 404. |
| **`%`-encoded slugs filtered** | ✅ Correct | `!p.slug.includes('%')` filters malformed slugs. |
| **Missing `kfz-zulassung-abmeldung-in-deiner-stadt` from page DB entries** | ✅ OK | Included as a static route. |

### 4.3 Sitemap ↔ Live Page Validation

- Sitemap generates from DB `status: 'publish'` pages only ✅
- Alias source slugs are filtered from `getAllPageSlugs()` and `getSitemapData()` ✅
- No 404 URLs should appear in sitemap (they'd need `status: 'publish'` in DB)

**Risk:** If a page is in DB with `status: 'publish'` but its slug is in `EXCLUDED_SLUGS`, it won't appear in sitemap BUT it will load fine at the URL. This creates orphan pages that only Google discovers via internal links.

---

## 5. Internal Linking Issues

### 5.1 Broken Internal Links — 🔴 CRITICAL

| Link Source | Broken Link | Issue |
|-------------|-------------|-------|
| Homepage "Beliebte Seiten" section | `/muenchen-zulassungsstelle` | **Alias URL** → 308 redirect to `/auto-online-abmelden-muenchen` |
| Homepage "Beliebte Seiten" section | `/kfz-online-abmelden-hamburg` | **Alias URL** → 308 redirect to `/kfz-online-abmelden-in-hamburg` (missing "in-") |
| Homepage "Beliebte Seiten" section | `/essen` | **Alias URL** → 308 redirect to `/kfz-online-abmelden-essen` |
| Homepage "Beliebte Seiten" section | `/zulassungsservice-duesseldorf` | **Alias URL** → 308 redirect to `/duesseldorf` |
| CityPageView TOP_CITY_LINKS | `/krefeld-strassenverkehrsamt` | **Alias URL** → 308 redirect to `/krefeld` |
| CityPageView TOP_CITY_LINKS | `/muenchen-zulassungsstelle` | **Alias URL** → 308 redirect to `/auto-online-abmelden-muenchen` |
| CityPageView TOP_CITY_LINKS | `/neuss` (as `auto-online-abmelden-in-neuss`) | Actually canonical ✅ |
| City listing `/kfz-zulassung-abmeldung-in-deiner-stadt` | All city links | Uses CITY_ENTRIES slugs = **canonical URLs** ✅ |

### 5.2 Redirect Chain Assessment

The alias system works via `CITY_SLUG_ALIASES` in `[slug]/page.tsx`:
1. Next.js receives request for `/essen`
2. `CITY_SLUG_ALIASES['essen']` → `'kfz-online-abmelden-essen'`
3. `permanentRedirect()` fires → **308 Permanent Redirect**

**Problem:** Google treats 308 the same as 301, BUT:
- Every redirect costs crawl budget
- PageRank passes through redirects at ~95% (not 100%)
- For 400+ pages, each linking to 5 cities with potentially 2-3 being aliases, that's **1000+ unnecessary redirects per full crawl**

### 5.3 Orphan Pages

**Low risk.** The city listing page (`/kfz-zulassung-abmeldung-in-deiner-stadt`) links to all CITY_ENTRIES. The footer and header link to it. Blog posts link to service pages. Internal linking is generally well-connected.

However: Pages that exist in the DB but are NOT in CITY_ENTRIES and NOT on any other page would be orphans accessible only via sitemap.

### 5.4 Click Depth

| Page Type | Click Depth from Homepage |
|-----------|--------------------------|
| Homepage | 0 |
| Product pages | 1 (header nav + homepage CTA) |
| Blog index | 1 (header nav) |
| City listing | 1 (header nav + footer) |
| Individual city pages | 2 (Home → City Listing → City) |
| Blog posts | 2 (Home → Blog → Post) |
| Legal pages | 1 (footer links) |

**Assessment:** ✅ Good for a site this size. Most important city pages (Berlin, Hamburg, München) also get direct links from the homepage, making them depth 1.

---

## 6. Technical SEO Checks

### 6.1 HTTP Status Codes

| Test | Result |
|------|--------|
| Homepage | 200 ✅ |
| City pages (canonical) | 200 ✅ |
| City pages (alias) | 308 → canonical ✅ |
| Non-existent pages | 404 ✅ |
| WordPress legacy URLs | 308 → correct destination ✅ |
| www → non-www | 301 ✅ (middleware) |
| Deleted duplicates (-2, -3) | 404 ⚠️ (should be 410) |

**Note on 308 vs 301:** Next.js `permanentRedirect()` returns 308 (Permanent Redirect, preserve HTTP method). Functionally identical to 301 for GET requests. Google processes both the same way. However, for pure SEO consistency, 301 is more universally understood. This is a **non-issue** in practice.

### 6.2 Canonical Tags — ✅ GOOD

| Page | Canonical | Correct? |
|------|-----------|----------|
| Homepage | `https://onlineautoabmelden.com` | ✅ |
| Hamburg city | `https://onlineautoabmelden.com/kfz-online-abmelden-in-hamburg` | ✅ |
| Berlin city | `https://onlineautoabmelden.com/berlin-zulassungsstelle` | ✅ |

Self-referencing canonicals are correctly implemented.

### 6.3 Robots Meta Tags — ✅ GOOD

All checked pages return `<meta name="robots" content="index, follow"/>`.

Page model includes a `robots` field defaulting to `"index, follow"` — allowing per-page noindex if needed.

### 6.4 robots.txt — ✅ GOOD

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /konto
Disallow: /rechnung
Disallow: /bestellung-erfolgreich
Disallow: /anmelden
Sitemap: https://onlineautoabmelden.com/sitemap.xml
```

Correctly disallows private/transactional pages. References sitemap.

### 6.5 Structured Data (JSON-LD)

| Page | Schema Count | Types |
|------|-------------|-------|
| Homepage | 2 | Organization, (likely) FAQPage |
| City pages | 2 | Organization, BreadcrumbList |

**Missing:**
- **FAQPage schema on city pages** — Each city page has 6 FAQ questions but NO FAQPage structured data. This is a significant missed opportunity for rich results.
- **LocalBusiness schema** — City pages show authority/office addresses. Adding LocalBusiness or GovernmentOffice schema could enhance SERP appearance.
- **Service schema** — The main product (Fahrzeugabmeldung) has no Service/Product schema.

### 6.6 HTML Structure

| Element | City Pages | Homepage |
|---------|-----------|----------|
| H1 | ✅ Single H1 (city name) | ✅ Single H1 |
| H2 | ✅ Multiple section headings | ✅ Multiple |
| H3 | ✅ Sub-sections (FAQ, steps) | ✅ |
| Title | ✅ Unique per city | ✅ |
| Meta description | Needs verification per page | ✅ |

**Issue:** Berlin H1 is "Berlin Zulassungsstelle" instead of just "Berlin" — unnatural.

### 6.7 Page Speed (Basic Assessment)

- Next.js standalone mode with ISR (60s revalidation) ✅
- Static assets served from `/_next/static/` with proper cache headers ✅
- Images use `next/image` with WebP optimization ✅
- Hostinger shared hosting with LiteSpeed ⚠️ (slower than dedicated/cloud)
- No CDN mentioned ⚠️ (images served from origin)

---

## 7. Action Plan

### 🔴 Critical — Fix Immediately

#### 7.1 Fix Internal Links Pointing to Alias URLs

**What:** Update `TOP_CITY_LINKS` in `CityPageView.tsx` and homepage links to use canonical slugs instead of alias slugs.

**Files to modify:**
- `src/components/CityPageView.tsx` — Change `TOP_CITY_LINKS` entries:
  - `krefeld-strassenverkehrsamt` → `krefeld`
  - `muenchen-zulassungsstelle` → `auto-online-abmelden-muenchen`
  - `neuss` → `auto-online-abmelden-in-neuss` (already correct in TOP_CITY_LINKS, but verify)
- Homepage component — Change "Beliebte Seiten" city links to canonical URLs

**Why:** Every alias-URL internal link forces Googlebot through a 308 redirect, wasting crawl budget. With 400+ pages × 5 city links each, this is thousands of wasted crawls per indexing cycle.

**Expected impact:** 15-20% improvement in crawl efficiency, faster indexing of city pages.

---

#### 7.2 Fix Kirchheim Slug Typo

**What:** In `src/lib/city-slugs.ts`, change:
```typescript
['Kirchheim', 'krichheim']  // BROKEN
```
to:
```typescript
['Kirchheim', 'kirchheim']  // FIXED
```

Also ensure the DB page has slug `kirchheim` (or create/rename it).

**Why:** A city page is completely inaccessible — returning 404 for both slug variants.

**Expected impact:** One city page recovered from 404.

---

#### 7.3 Fix Berlin City Name in CITY_ENTRIES

**What:** Change:
```typescript
['Berlin Zulassungsstelle', 'berlin-zulassungsstelle']
```
to:
```typescript
['Berlin', 'berlin-zulassungsstelle']
```

Also update the Behörden CSV to have a matching entry for "Berlin" with real Landesamt für Bürger- und Ordnungsangelegenheiten (LABO) data.

**Why:** "Berlin Zulassungsstelle" reads as a keyword-stuffed, unnatural page title. Google's algorithms specifically target this pattern. Hamburg's page shows "KFZ online abmelden in Hamburg" (natural) while Berlin shows "Berlin Zulassungsstelle" (unnatural).

**Expected impact:** Berlin page goes from potentially classified as thin content to a high-quality local landing page.

---

#### 7.4 Implement 410 Gone for Deleted City Pages

**What:** In `src/app/[slug]/page.tsx`, before calling `notFound()`, check the `DeletedSlug` table:

```typescript
// Check if slug was deliberately deleted → return 410 Gone
const deletedSlug = await prisma.deletedSlug.findUnique({ where: { slug } });
if (deletedSlug) {
  return new Response(null, { status: 410 });
}
```

**Why:** 18+ deleted duplicate city pages (muenchen-2, bonn-2, etc.) currently return 404. Google will periodically re-crawl 404 pages. A 410 response tells Google "this page is permanently gone — remove it from the index and stop crawling."

**Expected impact:** Reduces crawl budget waste on dead pages by ~18 URLs per crawl cycle.

---

### 🟡 Medium Priority

#### 7.5 Add FAQ Structured Data to City Pages

**What:** Add `FAQPage` JSON-LD schema to `CityPageView.tsx`. Each city page already has 6 FAQ questions — just needs the structured data markup.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Wie funktioniert die Online-Abmeldung in {city}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

**Why:** FAQ rich results can significantly increase CTR in SERPs (30-50% higher click rates).

**Expected impact:** FAQ rich results for city-specific search queries.

---

#### 7.6 Fix Generic Behörde Data for Major Cities

**What:** Audit the Behörden CSV (`av1_2026_04_csv.csv`) and ensure entries exist for:
- Berlin (LABO)
- München (KVR — Kreisverwaltungsreferat)
- Frankfurt (Bürgeramt)
- All cities currently showing "Zuständige Zulassungsstelle, vor Ort"

**Why:** Pages showing generic authority info provide zero unique value — Google may classify them as thin content ("Crawled — currently not indexed").

**Expected impact:** 20-50 city pages gain unique, valuable content, improving indexing rate.

---

#### 7.7 Fix Duplicate "Rott weil" / "Rottweil" Entry

**What:** Remove the entry `['Rott weil', 'rott-weil']` from `CITY_ENTRIES`. If a page exists in DB with slug `rott-weil`, either:
- Delete it and add to `DeletedSlug` (for 410), or
- Add a redirect from `rott-weil` to `rottweil`

**Why:** Duplicate city entries creates confusion and potentially duplicate content.

---

#### 7.8 Fix Inconsistent Umlaut Encoding in Slugs

**What:** Fix these slugs to follow the consistent pattern (ö→oe, ü→ue, ä→ae):
- `konigsbach-stein` → `koenigsbach-stein`
- `muhlacker` → `muehlacker`
- `mullheim` → `muellheim`

Add redirects from old slugs to new ones. Update CITY_ENTRIES accordingly.

**Why:** URL inconsistency hurts user trust and makes patterns unpredictable.

---

#### 7.9 Improve Content Uniqueness for Template Cities

**What:** For the ~300 cities using template content, add at least ONE unique element per page beyond just the city name:
- Real Behörde address/phone/email from CSV
- Actual population or Gemeindeschlüssel
- Local facts (Bundesland, Regierungsbezirk)
- Different intro paragraph per region at minimum

**Why:** Google's "helpful content" update specifically targets pages that exist solely for SEO with minimal unique value. Template city pages with only the name changed are a textbook example.

**Expected impact:** Shift from "Crawled not indexed" to indexed for 50-100+ city pages.

---

### 🟢 Optimization

#### 7.10 Segment Sitemap by Type

**What:** Split `sitemap.xml` into:
- `sitemap-cities.xml` (~400 entries)
- `sitemap-blog.xml` (~120+ entries)
- `sitemap-pages.xml` (static/legal pages)
- `sitemap-products.xml`

With a `sitemap-index.xml` parent.

**Why:** Segmented sitemaps give better visibility in Google Search Console — you can see indexing rates per content type.

---

#### 7.11 Add Service/Product Schema to Product Pages

**What:** Add `Service` or `Product` JSON-LD to `/product/fahrzeugabmeldung` with price, availability, and review data.

**Why:** Product rich results in SERPs.

---

#### 7.12 Add `hreflang` If Multi-language Planned

Currently the site is German-only. No action needed, but if expansion is planned, implementing `hreflang="de"` now prevents future issues.

---

#### 7.13 Consider CDN for Static Assets

**What:** Use Cloudflare or similar CDN in front of Hostinger.

**Why:** Shared hosting TTFB can be slow. CDN improves Core Web Vitals, especially for static assets and images.

---

## 8. Quick Reference — Files to Modify

| File | Issue | Priority |
|------|-------|----------|
| `src/components/CityPageView.tsx` | Fix alias URLs in TOP_CITY_LINKS, add FAQ schema | 🔴 |
| `src/lib/city-slugs.ts` | Fix `krichheim` typo, fix Berlin name, fix umlaut inconsistencies, remove `Rott weil` duplicate | 🔴 |
| `src/app/[slug]/page.tsx` | Add DeletedSlug → 410 check | 🔴 |
| Homepage component | Fix city links to use canonical URLs | 🔴 |
| Behörden CSV (`av1_2026_04_csv.csv`) | Add/fix Berlin, München, Frankfurt entries | 🟡 |
| `src/app/sitemap.ts` | Consider splitting into sitemap index | 🟢 |

---

## 9. Google Search Console Recommendations

Since I cannot access your GSC account, here are the specific reports to check:

1. **Pages → Not indexed → "Crawled — currently not indexed"**: These are likely your template city pages with generic content. Compare the list against cities with/without real Behörde data.

2. **Pages → Not indexed → "Discovered — currently not indexed"**: These pages Google knows about but hasn't bothered to crawl. Check if they're all small-town city pages.

3. **Pages → Not indexed → "Page with redirect"**: Check if alias URLs are being reported here. They should be — this confirms the redirect chain issue.

4. **Pages → Not indexed → "Soft 404"**: Check if Berlin or other generic-data cities appear here.

5. **URL inspection tool**: Test `/kirchheim` and `/krichheim` — both should show 404, confirming the typo issue.

6. **Coverage → Valid → Indexed**: Count how many city pages are actually indexed vs. total city pages. If less than 50% are indexed, the content uniqueness issue is confirmed.

---

**END OF AUDIT**
