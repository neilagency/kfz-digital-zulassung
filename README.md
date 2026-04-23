# Online Auto Abmelden – Next.js

Vollständige Migration der WordPress-Website [onlineautoabmelden.com](https://onlineautoabmelden.com) zu Next.js 14 mit App Router, SSR, Tailwind CSS und automatischer WordPress-Content-Migration.

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server-Side Rendering)
- **Sprache:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3.4
- **Animationen:** Framer Motion
- **Formular:** React Hook Form + Zod Validation
- **Icons:** Lucide React
- **CMS-Anbindung:** WordPress REST API (`/wp-json/wp/v2/`)

## Projektstruktur

```
src/
├── app/
│   ├── page.tsx                        # Homepage
│   ├── layout.tsx                      # Root Layout (Navbar, Footer, WhatsApp)
│   ├── globals.css                     # Global styles
│   ├── sitemap.ts                      # Dynamic XML Sitemap
│   ├── robots.ts                       # robots.txt
│   ├── not-found.tsx                   # 404-Seite
│   ├── insiderwissen/
│   │   └── page.tsx                    # Blog-Listing mit Pagination
│   ├── [slug]/
│   │   └── page.tsx                    # Blog-Artikel (dynamisch via WP API)
│   └── product/
│       └── fahrzeugabmeldung/
│           └── page.tsx                # Service-Formular
├── components/
│   ├── Navbar.tsx                      # Navigation mit Mobile-Menü
│   ├── Footer.tsx                      # Footer mit Zahlungsmethoden
│   ├── Hero.tsx                        # Hero mit Animationen
│   ├── BlogCard.tsx                    # Blog-Karte
│   ├── FAQ.tsx                         # FAQ-Akkordeon mit Schema
│   ├── Steps.tsx                       # 6-Schritte-Prozess
│   ├── PricingBox.tsx                  # Pricing-CTA
│   └── ServiceForm.tsx                 # Multi-Step Formular
└── lib/
    ├── wordpress.ts                    # WP REST API Client
    └── constants.ts                    # Site-Konstanten
scripts/
└── migrate-wp.ts                       # WordPress-Daten-Export
```

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## WordPress-Migration

Export aller WordPress-Inhalte als JSON:

```bash
npm run migrate
```

Erzeugt `data/`-Ordner mit:
- `posts.json` – Alle Blog-Artikel
- `categories.json` – Alle Kategorien
- `tags.json` – Alle Tags
- `media.json` – Alle Medien
- `pages.json` – Alle Seiten
- `slug-map.json` – Slug-zu-ID Zuordnung

## Build & Production

```bash
npm run build
npm start
```

## Deployment (Vercel)

1. Repository auf GitHub pushen
2. [Vercel](https://vercel.com) verbinden
3. Environment Variables setzen:
   - `WP_API_URL` = `https://onlineautoabmelden.com/wp-json/wp/v2`
   - `NEXT_PUBLIC_SITE_URL` = `https://onlineautoabmelden.com`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional)
   - `STRIPE_SECRET_KEY` (optional)
4. Deploy!

## SEO Features

- ✅ Server-Side Rendering für alle Seiten
- ✅ Dynamic Sitemap (`/sitemap.xml`)
- ✅ robots.txt
- ✅ OpenGraph & Twitter Meta-Tags
- ✅ JSON-LD Schema (Organization, Article, Service, FAQ)
- ✅ Canonical URLs auf allen Seiten
- ✅ Bestehende URL-Struktur beibehalten (`/[slug]` für Blog)
- ✅ ISR (Incremental Static Regeneration) für Blog-Seiten

## Umgebungsvariablen

| Variable | Beschreibung | Default |
|---|---|---|
| `WP_API_URL` | WordPress REST API URL | `https://onlineautoabmelden.com/wp-json/wp/v2` |
| `NEXT_PUBLIC_SITE_URL` | Öffentliche Site-URL | `https://onlineautoabmelden.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Public Key | – |
| `STRIPE_SECRET_KEY` | Stripe Secret Key | – |

## Lizenz

Privat – Alle Rechte vorbehalten.
