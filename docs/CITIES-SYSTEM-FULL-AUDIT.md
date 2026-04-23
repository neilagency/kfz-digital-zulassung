# Cities System — Full Technical Audit Report

**Date**: 2026-04-20  
**Platform**: onlineautoabmelden.com  
**Stack**: Next.js 15 (App Router), Prisma + Turso (libSQL), Hostinger Shared Hosting  
**Scope**: 913 city pages targeting German cities for KFZ-Abmeldung/Zulassung services

---

## Table of Contents

1. [System Architecture Analysis](#1-system-architecture-analysis)
2. [Database & Production Analysis](#2-database--production-analysis)
3. [SEO Technical Audit](#3-seo-technical-audit)
4. [Google Search Console Simulation Analysis](#4-google-search-console-simulation-analysis)
5. [Problems Classification](#5-problems-classification)
6. [Root Cause Analysis](#6-root-cause-analysis)
7. [Recommended Fixes & Recovery Plan](#7-recommended-fixes--recovery-plan)

---

## 1. System Architecture Analysis

### 1.1 Architecture Diagram (Text)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  INCOMING REQUEST: /{slug}                                                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────────┐               │
│  │ middleware.ts │───▶│ next.config  │───▶│ src/app/[slug]/page.tsx     │               │
│  │              │    │ redirects    │    │                              │               │
│  │ - WP blocker │    │ (150+ rules) │    │  1. RESERVED_SLUGS check    │               │
│  │ - www→non-www│    │ - 301 perma  │    │  2. Alias resolution        │               │
│  │ - Auth guard │    │ - City alias │    │     getResolvedCitySlug()   │               │
│  └──────────────┘    │   → canonical│    │  3. if alias → 308 redirect │               │
│                      └──────────────┘    │  4. DB page lookup          │               │
│                                          │  5. isCitySlug() check      │               │
│                                          └────────┬───────┬────────────┘               │
│                                                   │       │                             │
│                              ┌─────────────────────┘       └────────────────┐           │
│                              ▼                                              ▼           │
│                 ┌───────────────────────┐                    ┌──────────────────────┐   │
│                 │  DB Page EXISTS       │                    │  No DB Page          │   │
│                 │  (status=publish)     │                    │  isCitySlug()=true   │   │
│                 │                       │                    │                      │   │
│                 │  Uses DB content:     │                    │  buildSynthetic      │   │
│                 │  - Legacy HTML        │                    │  CityPage()          │   │
│                 │  - metaTitle/desc     │                    │  - cityPageContent.ts│   │
│                 │  - canonical field    │                    │  - Variant selection  │   │
│                 └───────────┬───────────┘                    │  - Hash-seeded       │   │
│                             │                                └──────────┬───────────┘   │
│                             │                                           │               │
│                             └─────────────┬─────────────────────────────┘               │
│                                           ▼                                             │
│                              ┌──────────────────────┐                                   │
│                              │  CityPageView.tsx     │                                  │
│                              │  (1,400 lines)        │                                  │
│                              │                       │                                  │
│                              │  - Badge-based UI     │                                  │
│                              │  - Seed variant select│                                  │
│                              │  - Behörde lookup     │                                  │
│                              │  - Schema.org JSON-LD │                                  │
│                              │  - Related cities     │                                  │
│                              │  - Section ordering   │                                  │
│                              └──────────────────────┘                                   │
│                                                                                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │  DATA LAYER                                                                      │   │
│  │                                                                                  │   │
│  │  ┌──────────────────┐  ┌───────────────────┐  ┌──────────────────────────────┐  │   │
│  │  │ Turso (Prod DB)  │  │ city-slugs.ts     │  │ cityPageContent.ts           │  │   │
│  │  │ - Page table     │  │ - 913 CITY_ENTRIES│  │ - 140 meta title variants    │  │   │
│  │  │ - DeletedSlug    │  │ - 70+ aliases     │  │ - 71 meta desc variants      │  │   │
│  │  │ - ~295 landing   │  │ - slug resolution │  │ - 140 intro variants         │  │   │
│  │  │   pages in DB    │  │ - CITY_SLUGS set  │  │ - 100+ per section (21 sec)  │  │   │
│  │  └──────────────────┘  └───────────────────┘  │ - 120 FAQ pool items         │  │   │
│  │                                                │ - 106 section order variants │  │   │
│  │                                                └──────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Rendering Model: Hybrid SSR + ISR

| Rendering Mode | Applies To | Mechanism |
|---|---|---|
| **SSG (Build-time)** | DB pages returned by `generateStaticParams()` | Pre-rendered at build |
| **ISR (On-demand)** | All city slugs NOT in DB | First request renders, cached 60s (`revalidate = 60`) |
| **Dynamic redirect** | Alias slugs | `permanentRedirect()` (308) at component level |

**Key issue**: Only DB-backed pages are in `generateStaticParams()`. The ~618 synthetic city pages (913 total minus ~295 in DB) are **never pre-rendered** — they're generated on first request and cached for 60 seconds. This means:

- After every deploy, the first visitor to each synthetic city page triggers a render
- Googlebot's first crawl after deploy may hit cold pages with higher TTFB
- 618 pages × ~200ms render = significant crawl budget waste on first crawl cycle

### 1.3 The Two Content Systems

| System | File | Status | Description |
|---|---|---|---|
| **Active** | `src/lib/cityPageContent.ts` (5,642 lines) | IN USE | Hash-seeded variant engine with 21 content sections |
| **Dead** | `src/lib/cityPageVariants.ts` (420 lines) | UNUSED | Legacy variant system — nothing imports it |
| **Legacy** | `src/lib/city-parser.ts` (250 lines) | PARTIAL USE | WordPress HTML parser for old Elementor content |

The active system uses `buildCityPageContent()` which takes a `CityPageData` object `{slug, city, region, state}` and returns deterministic content via `hashString()` + `seededIndex()` — every city always gets the same variant combination.

### 1.4 Duplication Between Static HTML and Dynamic Rendering

**Two code paths exist for the same URL**:

1. **DB page path**: If a Page record with matching slug exists and `status='publish'`, its stored `content` (often legacy WordPress HTML) is used
2. **Synthetic path**: If no DB record exists but `isCitySlug()` is true, `buildSyntheticCityPage()` generates content from templates

**Problem**: For the ~295 DB-backed city pages, the system **still** renders through `CityPageView.tsx` — but with the DB page's `metaTitle`/`metaDescription` instead of the synthetic ones. The HTML `content` field from the DB is used by `CityPageView.tsx` only if it's non-empty and appears to be legacy Elementor HTML. Otherwise, the badge-based dynamic UI is rendered.

This creates a situation where some city pages serve old WordPress HTML and others serve modern template content — visible inconsistency to both users and Googlebot.

### 1.5 URL Structure

**Three URL pattern families exist**:

| Pattern | Example | Count |
|---|---|---|
| `auto-online-abmelden-in-{city}` | `/auto-online-abmelden-in-bochum` | ~50 |
| `kfz-online-abmelden-{city}` | `/kfz-online-abmelden-in-hamburg` | ~30 |
| `{city}-zulassungsstelle` | `/berlin-zulassungsstelle` | ~20 |
| `auto-abmelden-online-in-{city}` | `/auto-abmelden-online-in-gelsenkirchen` | ~15 |
| `{city}` (bare city name) | `/laupheim` | ~300+ (batch 2026-04-15) |
| Other legacy patterns | Various | ~50 |

**This is a critical SEO problem.** Google sees 5+ different URL patterns for identical content types. There is no consistent, recognizable URL template that signals "this is a city page" to search engines.

---

## 2. Database & Production Analysis

### 2.1 Database Architecture

| Environment | Database | Adapter | Connection |
|---|---|---|---|
| **Production** | Turso (libSQL) | `@prisma/adapter-libsql` | `libsql://kfz-digital-zulassung-omnianeil.aws-eu-west-1.turso.io` |
| **Local Dev** | SQLite (`dev.db`) | `@prisma/adapter-better-sqlite3` | `file:./dev.db` |
| **Scripts** | Either (flag-based) | Own PrismaClient | `--local` flag selects dev.db vs Turso |

Selection logic in `src/lib/prisma.ts`:
```
if TURSO_DATABASE_URL → Turso adapter
else → better-sqlite3 with dev.db
```

### 2.2 Schema: City-Related Models

**Page model** — stores all city pages (and non-city pages):
- `isCity: Boolean` — flags as city page
- `contentType: String` — `"real"` (unique content) or `"template"` (generated)
- `cityName: String` — extracted display name
- `contentScore: Int` — uniqueness score 0-100
- `pageType: String` — `"landing"` for city pages

**DeletedSlug model** — tracks deleted city slugs for 410 Gone:
- 225 entries in production
- **NOT QUERIED by the frontend** — all return 404 instead of 410

### 2.3 Schema Drift (CRITICAL)

The following schema elements have **NO migration**:

| Element | Where Declared | Migration Exists? |
|---|---|---|
| `Page.isCity` | `schema.prisma` | **NO** |
| `Page.contentType` | `schema.prisma` | **NO** |
| `Page.cityName` | `schema.prisma` | **NO** |
| `Page.contentScore` | `schema.prisma` | **NO** |
| `DeletedSlug` table | `schema.prisma` | **NO** |
| `@@index([isCity])` | `schema.prisma` | **NO** |
| `@@index([contentType])` | `schema.prisma` | **NO** |
| `@@index([status, isCity])` | `schema.prisma` | **NO** |

These were added to Turso production via `prisma db push` or raw SQL, bypassing the migration system. The migration history is permanently out of sync.

### 2.4 Data Inconsistency Between DBs

| Metric | Production (Turso) | Local (dev.db) |
|---|---|---|
| Total pages | ~295 (pageType='landing') | ~538 (pageType='page') |
| pageType values | `'landing'` | `'page'` |
| City classification | Run via `classify-cities.ts` | Unclassified |
| DeletedSlug entries | ~225 | Unknown |

**Impact**: Developers testing locally see completely different data than production. The classify script hasn't been run on dev.db, so `isCity`, `contentType`, `cityName`, `contentScore` are all defaults locally.

### 2.5 Orphan Records Analysis

**Cities in code but NOT in DB** (~618):
- All 913 `CITY_ENTRIES` slugs minus ~295 DB pages
- These render as synthetic pages — no DB record, no admin control, no audit trail
- The batch of ~300+ cities added on 2026-04-15 are almost entirely synthetic

**Cities in DB but NOT in `CITY_ENTRIES`**:
- Any DB pages with `isCity=true` whose slug is NOT in the `CITY_SLUGS` set will be treated as regular pages, not city pages
- The `isCitySlug()` check in `[slug]/page.tsx` won't trigger, so these pages render through the generic `PageView` component instead of `CityPageView`

**DeletedSlug entries that still 404 instead of 410**:
- All 225 `DeletedSlug` records are functionally useless — the frontend never checks them

---

## 3. SEO Technical Audit

### 3.1 URL Structure Assessment

**Status: POOR — Multiple conflicting patterns**

```
/auto-online-abmelden-in-bochum          ← pattern 1
/kfz-online-abmelden-in-hamburg          ← pattern 2
/berlin-zulassungsstelle                  ← pattern 3
/auto-abmelden-online-in-gelsenkirchen   ← pattern 4
/laupheim                                ← pattern 5 (bare name)
/kfz-online-abmelden-essen              ← pattern 6 (no "in")
```

**Problems**:
1. No consistent URL template — Google cannot identify a programmatic page pattern
2. Bare city names (`/laupheim`) risk collisions with future content pages
3. Keyword-stuffed URLs (`auto-online-abmelden-in-`) add no SEO value post-2020
4. Legacy WordPress naming conventions persist alongside new patterns

### 3.2 Canonical Tags

**Implementation**: `buildSEOMetadata()` in `src/lib/db.ts`:
```
canonical = item.canonical || `${siteUrl}/${slug}`
```

**Issues**:
- DB pages may have stale `canonical` values from WordPress import — these **override** the auto-generated slug-based URL
- Synthetic pages set `canonical: ''` → correctly falls back to `siteUrl/slug`
- No validation that stored canonicals point to live, indexable URLs
- Alias URLs get `permanentRedirect()` in the component, but `generateMetadata()` runs first and returns the **canonical slug's** metadata — this is technically correct but means the redirect page emits indexable metadata before redirecting

### 3.3 Meta Tags (Title & Description)

**Generation**:
- DB pages: uses stored `metaTitle`/`metaDescription` 
- Synthetic pages: generated by `buildCityPageContent()` via hash-seeded variant selection

**Title Issues**:
- 140 title variants for 913 cities = ~6.5 cities per title template
- All titles are semantic paraphrases: "Auto online abmelden in {{city}}" variations
- Title truncation at 60 chars applied — good
- `title.template` in root layout appends `| {siteName}` — adds ~25 chars, potentially over-truncating

**Description Issues**:
- 71 description variants for 913 cities = **~12.9 cities per description**
- All descriptions are semantic equivalents with city name swapped
- Google may display its own snippet instead of these repetitive descriptions

### 3.4 Duplicate Content Assessment

**Severity: HIGH**

| Metric | Assessment |
|---|---|
| Structural uniqueness | Each page has same sections in slightly different order (106 variants) |
| Semantic uniqueness | **All pages say the same thing** — "deregister your car online in [city]" |
| Genuinely unique content | Only Behörde (local authority) data differs — name, address, phone |
| Word count | ~800-1200 words per page — not thin by volume |
| City-specific information | **None beyond authority data** — no local regulations, hours, tips |

**Variant collision math**:
- With 21 independently-seeded sections each having ~100 variants, full-page byte-for-byte duplicates are near-impossible
- But Google's NLP (BERT/MUM) detects **semantic equivalence**, not textual identity
- Section reordering doesn't help — same content in different order is still same content

### 3.5 Doorway Pages Risk

Google's Doorway Pages policy (https://developers.google.com/search/docs/essentials/spam-policies#doorways):

| Signal | Present? |
|---|---|
| 913 location-specific URLs for same service | **YES** |
| Template content with location swap | **YES** |
| All pages funnel to single checkout | **YES** |
| Content is paraphrased, not substantively different | **YES** |
| Legitimate local service (KFZ has per-city offices) | **YES** (mitigating) |

**Verdict**: MODERATE-HIGH doorway page risk. The strongest defense is that KFZ-Abmeldung is genuinely city-specific — each city has its own Zulassungsstelle. But 913 pages with template content pushes the boundary.

### 3.6 Sitemap Quality

**File**: `src/app/sitemap.ts`

**Good**:
- Aliases excluded via `getResolvedCitySlug(slug) === slug` filter
- Deduplication via `seen` Set
- Both DB pages and synthetic cities included
- `EXCLUDED_SLUGS` removes 60+ known duplicates/system pages

**Problems**:
- **lastModified is mostly static** (`2026-04-16`) for synthetic cities — no freshness signal
- **All 913 city URLs in a single sitemap** — no sitemap index splitting
- Priority `0.7` for all city pages — no differentiation between high-value (Berlin) and low-value (small towns)
- **No sitemap index** — one monolithic file for entire site

### 3.7 Internal Linking

**Implementation**:
- `CITY_NEIGHBORS` in `CityPageView.tsx`: hardcoded map for ~20 major cities
- `pickRelatedCities()`: Falls back to seeded-random selection for remaining ~893 cities
- City hub page (`/kfz-zulassung-abmeldung-in-deiner-stadt`) links all cities A-Z

**Problems**:
- Only 20 cities have intentional neighbor links — the rest get pseudo-random related cities
- No topological/geographic clustering for the ~893 non-major cities
- Hub page links ALL 913 cities — excessive for a single page (crawl budget)
- No secondary hub pages (e.g., by Bundesland) to create proper topical clusters

### 3.8 Indexability Issues

| Check | Status | Notes |
|---|---|---|
| robots.txt | ✅ OK | `/api/`, `/admin/` blocked |
| noindex tags | ⚠️ ISSUE | No `noindex` for DeletedSlug URLs (should be 410, returns 404) |
| X-Robots-Tag | ✅ OK | Set for WP/spam paths in middleware |
| Crawlability | ⚠️ ISSUE | 913 city pages + 618 synthetic = large crawl surface |
| Pagination | ✅ N/A | No pagination on city pages |
| Parameter URLs | ✅ OK | No query params used |
| JavaScript rendering | ✅ OK | SSR/ISR — content in initial HTML |

### 3.9 Crawl Budget Waste

**Estimated crawl surface**:
- 913 city pages (priority 0.7)
- ~70 alias URLs that redirect (308)
- ~150 redirect rules in next.config.js
- ~225 DeletedSlug URLs returning 404 (should be 410)
- Hub page with 913 outgoing links

**Total wasted crawls per cycle**: ~295 (aliases + deleted slugs + redirects that Googlebot follows)

---

## 4. Google Search Console Simulation Analysis

### 4.1 Why Impressions Dropped

Based on the architecture analysis, the most likely causes:

1. **Doorway pages penalty (soft)**: Google's algorithm may have demoted the entire city page cluster after detecting 913 near-identical pages. This wouldn't appear as a manual action — it's algorithmic demotion.

2. **Indexing consolidation**: Google may have chosen to index only a representative subset (e.g., 50-100 city pages) and dropped the rest from the index. This appears as "Crawled — currently not indexed" or "Duplicate without user-selected canonical" in Coverage reports.

3. **URL pattern confusion**: The 5+ URL patterns make it hard for Google to identify a consistent programmatic pattern. This can cause selective de-indexing as Google treats some patterns as duplicates of others.

4. **Fresh-deploy cold cache**: After each deploy, 618 synthetic pages need first-request rendering. If Googlebot hits these during the cold window, it may get slow responses or even timeouts, leading to "Server error (5xx)" in Coverage.

### 4.2 Probable Coverage Report Status

| Category | Estimated Count | Likely URLs |
|---|---|---|
| **Valid (indexed)** | ~100-200 | Major cities (Berlin, München, Hamburg, etc.) |
| **Crawled — not indexed** | ~400-500 | Smaller cities that Google deemed low-value |
| **Duplicate without canonical** | ~50-100 | Alias URLs or pattern variants Google considers dupes |
| **Excluded by noindex** | 0 | No noindex on city pages |
| **Not found (404)** | ~225 | DeletedSlug URLs |
| **Redirect** | ~70 | Alias URLs |

### 4.3 Probable URL Inspection Issues

- **Indexing**: Many city pages showing "URL is not on Google" — crawled but not indexed
- **Canonical**: Google may have selected a DIFFERENT canonical than specified (e.g., picking Berlin's page as canonical for a cluster of similar pages)
- **Crawl**: "Last crawled" dates may be old (weeks/months ago) for low-priority city pages
- **Rendering**: Should be clean — SSR means Googlebot sees full content

### 4.4 Soft 404 Risk

Google may classify some city pages as **soft 404s** if:
- The content is too similar to other pages (Google infers "this isn't really a unique page")
- The Behörde data is missing for a city (making it purely template content)
- The page has very low engagement signals (high bounce, low dwell time)

---

## 5. Problems Classification

### 🔴 Critical Issues (Must Fix Immediately)

| # | Issue | Impact | Location |
|---|---|---|---|
| C1 | **913 template pages = doorway page risk** | Google may penalize entire city cluster | Architectural |
| C2 | **DeletedSlug never returns 410** — 225 URLs return 404 instead of 410 Gone | Google keeps re-crawling 404s; 410 signals permanent removal | `src/app/[slug]/page.tsx` |
| C3 | **5+ inconsistent URL patterns** for city pages | Google cannot identify programmatic pattern; indexing confusion | `src/lib/city-slugs.ts` |
| C4 | **Semantic content duplication across all 913 pages** | Near-duplicate detection triggers indexing drops | `src/lib/cityPageContent.ts` |
| C5 | **Stale WordPress `canonical` fields in DB** may point to wrong/dead URLs | Canonical chain errors in GSC | `src/lib/db.ts` buildSEOMetadata() |

### 🟠 High Priority Issues

| # | Issue | Impact | Location |
|---|---|---|---|
| H1 | **618 synthetic pages not in generateStaticParams** — cold renders on first request | Slow TTFB for Googlebot, potential timeouts | `src/app/[slug]/page.tsx` |
| H2 | **Schema drift** — 4 columns + 1 table + 3 indexes have no migration | DB reproducibility broken; risks in disaster recovery | `prisma/schema.prisma` |
| H3 | **dev.db diverged from production** — different page counts, pageType values | Local dev doesn't match production behavior | Data layer |
| H4 | **Single monolithic sitemap** with 913+ city URLs | No prioritization signal to Google; large sitemap | `src/app/sitemap.ts` |
| H5 | **lastModified static for synthetic pages** — no freshness signals | Google deprioritizes stale-looking content | `src/app/sitemap.ts` |
| H6 | **Hub page links all 913 cities on one page** | Link equity diluted; crawl budget waste | City hub page |
| H7 | **Production secrets in `deploy/server.env`** in repo | Security: exposed API keys if repo is shared | `deploy/server.env` |

### 🟡 Medium Issues

| # | Issue | Impact | Location |
|---|---|---|---|
| M1 | **DB-backed vs synthetic city pages have inconsistent rendering** | Some pages show WordPress HTML, others show modern UI | `CityPageView.tsx` |
| M2 | **Only 20 cities have intentional neighbor links** — rest are random | Weak internal linking topology for 893 cities | `CityPageView.tsx` |
| M3 | **No Bundesland/region hub pages** — missing topical cluster layer | No intermediate hierarchy between hub and city pages | Architecture |
| M4 | **Dead code: `cityPageVariants.ts`** unused but still in repo | Maintenance confusion | `src/lib/cityPageVariants.ts` |
| M5 | **No city-specific content** beyond Behörde data | Pages add minimal unique value | Content strategy |
| M6 | **~12.9 cities share each meta description** template | Repeated SERP snippets harm CTR | `cityPageContent.ts` |
| M7 | **70+ slug aliases hardcoded in TypeScript** — not admin-manageable | Cannot fix routing issues without deploy | `city-slugs.ts` |
| M8 | **Alias URLs get indexed metadata before redirect fires** | Edge case: bot may capture meta before 308 | `[slug]/page.tsx` |

### 🟢 Low Priority / Optimization

| # | Issue | Impact | Location |
|---|---|---|---|
| L1 | **ISR revalidate = 60s** for city pages | Too aggressive; city content rarely changes | `[slug]/page.tsx` |
| L2 | **No geographic clustering in related cities** | Sub-optimal internal linking structure | `CityPageView.tsx` |
| L3 | **Sitemap doesn't differentiate priority by city size** | Berlin and a 5,000-person town get same priority | `sitemap.ts` |
| L4 | **No structured data for LocalBusiness** | Missing local SEO signals | `CityPageView.tsx` |
| L5 | **robots.txt doesn't explicitly block alias patterns** | Minor crawl optimization | `robots.ts` |

---

## 6. Root Cause Analysis

### 6.1 Why the System Became Inconsistent

**Phase 1 — WordPress Legacy** (pre-migration):
- City pages were created as WordPress pages with Elementor
- Each page had unique HTML, but much was template-based
- URLs were WordPress-style, creating the initial pattern diversity

**Phase 2 — Database Migration** (early 2026):
- WordPress pages imported into Prisma/Turso `Page` table
- Original slugs preserved (maintaining URL pattern inconsistency)
- `content` field stored raw Elementor HTML

**Phase 3 — Dynamic System Built** (March-April 2026):
- `CityPageView.tsx` + `cityPageContent.ts` created as new rendering engine
- `city-slugs.ts` created with 913 entries + aliases
- `buildSyntheticCityPage()` added for cities without DB records
- City classifier (`classify-cities.ts`) run on DB pages
- `DeletedSlug` model added but never wired to frontend

**Phase 4 — Massive Expansion** (2026-04-15):
- ~300+ new small-town cities added to `CITY_ENTRIES` (batch 2026-04-15)
- No corresponding DB records created — all synthetic
- Sitemap expanded from ~300 to ~900 city URLs overnight
- Google received massive sitemap change with 600+ new near-duplicate pages

### 6.2 The Core Technical Problem

The system has **three sources of truth for city data** that are never reconciled:

| Source | What It Controls | Count |
|---|---|---|
| `CITY_ENTRIES` in code | Which slugs are valid city pages | 913 |
| `Page` table in Turso | Stored content + metadata for legacy pages | ~295 |
| `CITY_SLUG_ALIASES` in code | URL redirect mappings | ~70 |

There is no single authority. A city can exist in one, two, or all three — each combination produces different behavior.

### 6.3 Why Google Indexing Dropped

**Primary cause**: The batch addition of ~300 pages on 2026-04-15. When Google's crawler discovered 600+ new URLs (via sitemap) that are semantically identical to existing pages, it triggered duplicate content detection. Google's response:

1. Re-crawled all 913 URLs
2. Detected semantic duplication across the corpus
3. Selected a subset (~100-200) to keep indexed
4. Classified the rest as "Crawled — currently not indexed" or "Duplicate"
5. Deprioritized the entire city page cluster in rankings

**Secondary causes**:
- No 410 Gone for deleted pages → Google wastes crawl budget on 225 dead URLs
- Static `lastModified` in sitemap → no freshness signal for re-crawling
- Cold ISR on synthetic pages → slow first response for Googlebot

---

## 7. Recommended Fixes & Recovery Plan

### Phase 1: Emergency SEO Fixes (Week 1)

#### Fix C2: Implement 410 Gone for DeletedSlug

In `src/app/[slug]/page.tsx`, before the `notFound()` call:

```typescript
// After checking for blog post redirect, before notFound():
const deletedSlug = await prisma.deletedSlug.findUnique({ 
  where: { slug: effectiveSlug } 
});
if (deletedSlug) {
  // Return 410 Gone
  return new Response(null, { status: 410 });
}
notFound();
```

Also update `generateMetadata` to return `noindex` for deleted slugs.

#### Fix C5: Audit & Clear Stale Canonical Fields

```sql
-- Find DB pages with non-empty canonical that might be stale
SELECT id, slug, canonical FROM Page 
WHERE isCity = true AND canonical != '' AND canonical != slug;
```

Clear any canonical values that don't match the current slug pattern:
```sql
UPDATE Page SET canonical = '' WHERE isCity = true AND canonical != '';
```

#### Fix H5: Dynamic lastModified in Sitemap

For synthetic pages, use a rolling date (e.g., weekly) instead of static:
```typescript
const weekStart = new Date();
weekStart.setDate(weekStart.getDate() - weekStart.getDay());
```

### Phase 2: Content Quality (Weeks 2-3)

#### Fix C1 + C4: Reduce City Count + Add Unique Content

**Strategy: Tiered indexing**

| Tier | Cities | Count | Indexing | Content |
|---|---|---|---|---|
| **Tier 1** | State capitals + top 50 cities | ~50 | `index, follow` | Full unique content + Behörde + local tips |
| **Tier 2** | Mid-size cities (>50k pop) | ~100 | `index, follow` | Template + Behörde data |
| **Tier 3** | All other cities | ~763 | `noindex, follow` | Template only — linked from hub |

Implementation:
1. Add a `cityTier` field to `CITY_ENTRIES` or to the Page model
2. Set `robots: 'noindex, follow'` in `buildSyntheticCityPage()` for Tier 3
3. Keep Tier 3 in internal linking but remove from sitemap

#### Fix M5: Add Genuinely Unique City Content

For Tier 1 cities, add to `cityPageContent.ts` or as DB content:
- Zulassungsstelle opening hours (from Behörde CSV)
- Appointment booking links (where available)
- City-specific processing times
- Local parking tips near Zulassungsstelle
- Population-adjusted demand messaging

### Phase 3: Technical Cleanup (Week 3-4)

#### Fix C3: URL Consolidation Strategy

**Long-term**: Migrate to a single URL pattern. Recommended: `/{city-name}` (bare slug).

For existing URLs: add redirects from old patterns to new bare slugs. But given the 913 city count and existing Google signals, this is risky. **Alternative**: Accept the current pattern diversity but ensure all patterns are canonical and unique.

**Immediate**: Ensure no two patterns point to the same city. Audit:
```sql
SELECT cityName, COUNT(*) as cnt FROM Page 
WHERE isCity = true 
GROUP BY cityName HAVING cnt > 1;
```

#### Fix H1: Pre-render Key City Pages

Add top cities to `generateStaticParams()`:
```typescript
export async function generateStaticParams() {
  const pageSlugs = await getAllPageSlugs();
  const topCitySlugs = Array.from(CITY_SLUGS).slice(0, 200); // Top 200
  
  const allSlugs = new Set([...pageSlugs, ...topCitySlugs]);
  return Array.from(allSlugs)
    .filter(slug => !RESERVED_SLUGS.has(slug))
    .map(slug => ({ slug }));
}
```

#### Fix H2: Create Proper Migrations

```bash
npx prisma migrate dev --name add_city_fields
```

This will generate a migration for all schema drift.

#### Fix H4: Implement Sitemap Index

Split into multiple sitemaps:
- `sitemap-static.xml` — homepage, products, hub pages
- `sitemap-cities-1.xml` through `sitemap-cities-N.xml` — 200 cities each
- `sitemap-blog.xml` — blog posts

Use Next.js `generateSitemaps()` function.

#### Fix H6: Create Regional Hub Pages

Create intermediate pages:
- `/kfz-zulassung-bayern` — all Bavarian cities
- `/kfz-zulassung-nrw` — all NRW cities
- etc.

This creates a proper topical cluster: Hub → Regional → City

### Phase 4: Monitoring & Recovery (Ongoing)

#### SEO Recovery Plan

1. **Week 1**: Deploy 410 Gone fix + canonical audit + noindex Tier 3 cities
2. **Week 2**: Submit updated sitemap (now only Tier 1+2 cities) in GSC
3. **Week 2**: Request re-indexing for top 50 Tier 1 cities via GSC URL Inspection
4. **Week 3**: Monitor Coverage report — expect "Crawled — not indexed" to decrease
5. **Week 4**: Add unique content to Tier 1 cities
6. **Week 5**: Monitor impression recovery in GSC Performance report
7. **Week 6+**: Gradually promote Tier 3 cities to Tier 2 as unique content is added

#### Key Metrics to Track

| Metric | Target | Current (estimated) |
|---|---|---|
| Indexed city pages | 150+ (Tier 1+2) | ~100-200 |
| "Crawled — not indexed" | <100 | ~400-500 |
| Avg. city page impressions | Baseline +50% in 8 weeks | Declining |
| Crawl budget waste | <50 wasted crawls/day | ~295/day |
| TTFB for city pages | <500ms | Variable (cold cache) |

---

## Summary

The cities system is architecturally sound in concept but has accumulated significant technical debt through rapid expansion and incomplete migration. The core problems are:

1. **Too many near-identical pages** (913) that Google's NLP trivially identifies as duplicates
2. **No consistent URL pattern** across city pages
3. **Split data authority** between code (`CITY_ENTRIES`), database (`Page` table), and aliases
4. **Unimplemented 410 Gone** for 225 deleted slugs
5. **Static lastModified** dates in sitemap provide no freshness signals

The fix strategy is **tiered indexing** (index top 150, noindex rest) combined with **genuine unique content** for indexed cities and proper **technical SEO hygiene** (410s, canonical audit, sitemap splitting, pre-rendering).

The system's saving grace is that KFZ-Abmeldung is a genuinely location-relevant service — each German city has its own Zulassungsstelle — which provides legitimate intent defense against a doorway pages classification. The Behörde lookup data is the single most valuable differentiator and should be expanded.
