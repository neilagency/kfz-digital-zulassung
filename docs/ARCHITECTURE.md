# Architecture — onlineautoabmelden.com

> Last updated: 2026-04-20

## System Overview

German vehicle deregistration/registration service (KFZ Abmeldung/Anmeldung) with admin dashboard, order management, blog, and payment processing.

**Stack:** Next.js 14 (App Router) + Prisma 7 + Turso (libSQL) + Hostinger Shared Hosting

---

## Request Lifecycle

```
Browser → Hostinger LiteSpeed → Passenger → server.js (Next.js standalone)
                                                │
                                    ┌───────────┼───────────┐
                                    │           │           │
                                SSR/ISR    API Routes    Static
                                    │           │
                                    └─────┬─────┘
                                          │
                                    Prisma Client
                                          │
                                    Turso (libSQL)
                                  (remote, eu-west-1)
```

- **No Nginx, No PM2** — LiteSpeed Passenger runs `server.js` directly
- **Restart mechanism:** `touch tmp/restart.txt` (Passenger watches this)
- **ISR:** `revalidate = 60` on most pages

---

## Routing System

### Public Pages (App Router)

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Homepage |
| `/auto-online-abmelden` | Static | Abmeldung landing |
| `/auto-abmelden-online` | Static | Alternate landing |
| `/online-auto-abmelden` | Static | Alternate landing |
| `/anmelden` | Static | Anmeldung landing |
| `/auto-online-abmelden-kosten` | Static | Pricing page |
| `/auto-online-abmelden-unterlagen` | Static | Documents info |
| `/product/[slug]` | Dynamic | Product detail + order form |
| `/product/fahrzeugabmeldung` | Static | Abmeldung product |
| `/product/auto-online-anmelden` | Static | Anmeldung product |
| `/kfz-zulassung-abmeldung-in-deiner-stadt` | SSG | City comparison page |
| `/insiderwissen` | ISR | Blog listing |
| `/insiderwissen/[slug]` | ISR | Blog post |
| `/[slug]` | ISR | Dynamic pages (legal, etc.) |
| `/bestellung-erfolgreich` | Static | Order success |
| `/zahlung-fehlgeschlagen` | Static | Payment failed |
| `/rechnung/[invoiceNumber]` | SSR | Public invoice view |
| `/konto` | SSR | Customer portal |
| `/konto/bestellungen` | SSR | Customer orders |
| `/konto/bestellungen/[id]` | SSR | Order detail |

### City Pages System

The city comparison page at `/kfz-zulassung-abmeldung-in-deiner-stadt` uses a **static content approach** — all city data is defined in `src/lib/cityPageContent.ts` (no database involvement). This is a single page that compares all cities, not individual city routes.

### Admin Dashboard (`/admin/*`)

Route group `(dashboard)` with auth middleware. Manages:
- Orders, Invoices, Payments
- Blog posts, Pages
- Products, Coupons
- Customers, Media library
- Email campaigns, Settings

### API Routes (`/api/*`)

- `/api/checkout` — Order creation + payment initiation
- `/api/payment/paypal/*` — PayPal create/capture/webhook
- `/api/payment/webhook` — Mollie webhook
- `/api/admin/*` — CRUD for all admin resources (auth-protected)
- `/api/cron/*` — Scheduled tasks (publish-scheduled, send-scheduled, sync-orders)
- `/api/customer/*` — Customer portal APIs
- `/api/invoice/*` — Public invoice access
- `/api/documents/*` — Document download
- `/api/track/*` — Email open/click tracking
- `/api/unsubscribe/*` — Email unsubscribe

---

## Database Usage

All data is stored in **Turso (libSQL)** — a remote SQLite-compatible database.

- **20 tables** — see [DB-BASELINE.md](DB-BASELINE.md) for full schema
- **Prisma is the contract layer** — schema.prisma defines the expected schema
- **No ORM-level migrations to production** — schema changes go through controlled SQL

Key data flows:
1. **Order flow:** Checkout API → Order + OrderItem + Payment → Invoice (auto-generated)
2. **Blog:** Admin creates/edits → ISR serves with 60s revalidation
3. **Payments:** PayPal/Mollie → webhook → Payment record update → Order status change
4. **Email campaigns:** Admin creates → cron sends scheduled → track open/click

---

## Key Directories

```
src/
├── app/           # Next.js App Router pages + API routes
├── components/    # React components (admin/, checkout/, ui/)
├── data/          # Static data (currently unused by most features)
├── hooks/         # React hooks
├── lib/           # Shared utilities, DB helpers, email, payment logic
├── generated/     # Prisma generated client
prisma/
├── schema.prisma  # THE source of truth for DB schema
├── seed.ts        # Development seed data
scripts/           # Operational scripts (schema-guard, migration runner, SEO audits)
migrations/sql/    # Versioned SQL migrations for production
deploy/            # Deployment scripts
docs/              # Technical documentation
```

---

## Environment

| Context | Runtime | DB |
|---------|---------|-----|
| Local dev | Node v25.x, macOS | `file:./dev.db` (local SQLite) |
| Production | Node v20.x, Hostinger | Turso (remote libSQL, eu-west-1) |
| Build | Local macOS | N/A (standalone output) |

Prisma `prisma.config.ts` points to `file:./dev.db` for local — `prisma db push` only affects local.
Production schema changes go through `migrations/sql/` + `scripts/run-migration.ts`.
