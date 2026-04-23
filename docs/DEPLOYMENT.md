# Deployment Guide — onlineautoabmelden.com

> Last updated: 2026-04-21

## Quick Reference

```bash
# Standard deploy (build + upload + restart)
bash deploy/hostinger-deploy.sh

# Quick deploy (skip build, re-upload existing build)
bash deploy/hostinger-deploy.sh --quick

# Post-deploy validation
bash deploy/validate-deploy.sh
```

---

## Deploy Pipeline (7 Phases)

```
Phase 1: Preflight Checks
  └─ SSH connectivity test
  └─ rsync availability

Phase 2: Build
  └─ npx prisma generate
  └─ Schema Guard (Prisma ↔ Turso validation) ← CRITICAL GATE
  └─ npm run build (Next.js standalone)

Phase 3: Package
  └─ Copy .next/static → standalone
  └─ Copy public/ → standalone

Phase 4: Clear Remote
  └─ Remove old .next/ and node_modules/ on server

Phase 5: Upload
  └─ rsync --delete --checksum to server

Phase 6: Server Setup
  └─ Copy .env from persistent location
  └─ Reduce stale next-server process buildup
  └─ Install Linux-native binaries (libsql, sharp)
  └─ Passenger restart (touch tmp/restart.txt)

Phase 7: Health Check
  └─ Retry external warmup/health checks until HTTP 200
  └─ Run system-check.ts with retry/backoff for Passenger cold starts
  └─ Show server logs
```

### Schema Guard Gate (Phase 2)

The schema guard runs automatically during build. If it detects **destructive drift** (missing tables/columns), the deploy is **immediately aborted**.

```
✅ SAFE issues    → deploy continues
🟡 WARNING issues → deploy continues (logged)
❌ DESTRUCTIVE    → deploy BLOCKED (exit 1)
```

To fix a blocked deploy:
1. Create a SQL migration in `migrations/sql/`
2. Apply it: `npx tsx scripts/run-migration.ts <file.sql>`
3. Re-run deploy

---

## Environment Variables

The server reads env vars from `/home/u104276643/env/onlineautoabmelden.env` (persisted on server, never overwritten by deploy).

### Required Variables

| Variable | Purpose |
|----------|---------|
| `TURSO_DATABASE_URL` | Turso connection URL |
| `TURSO_AUTH_TOKEN` | Turso auth token |
| `NEXTAUTH_SECRET` | NextAuth.js session secret |
| `NEXTAUTH_URL` | `https://onlineautoabmelden.com` |
| `PAYPAL_CLIENT_ID` | PayPal API client ID |
| `PAYPAL_SECRET` | PayPal API secret |
| `MOLLIE_API_KEY` | Mollie payment API key |
| `SMTP_HOST` | Email SMTP server |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | Sender email address |
| `CRON_SECRET` | Secret for cron API endpoints |

### Local Development

For local schema guard / migration runs, set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in your shell or `.env` file.

---

## Server Details

| | |
|---|---|
| **Host** | Hostinger Shared Hosting |
| **SSH** | `ssh -p 65002 u104276643@88.223.85.114` |
| **App Directory** | `/home/u104276643/domains/onlineautoabmelden.com/nodejs` |
| **Node Version** | v20.x (server), v25.x (build machine) |
| **Web Server** | LiteSpeed + Passenger |
| **Startup File** | `server.js` (Next.js standalone) |
| **Restart** | `touch nodejs/tmp/restart.txt` |
| **Logs** | `tail -f nodejs/console.log` |

### Passenger Runtime Note

Hostinger Passenger can leave old `next-server` workers behind across repeated deploys. If these accumulate, the server can hit process limits and start returning `504` or `fork: Resource temporarily unavailable`.

`deploy/hostinger-deploy.sh` now reduces duplicate `next-server` workers before restart and uses retry-based warmup checks instead of a single fixed wait.

---

## Rollback Strategy

### Quick Rollback (< 2 min)

If a deploy causes issues, re-deploy the previous build:

```bash
# If you still have the previous .next/standalone/ locally:
bash deploy/hostinger-deploy.sh --quick
```

### Code Rollback

```bash
# Revert to previous commit
git checkout <previous-commit>

# Rebuild and deploy
bash deploy/hostinger-deploy.sh
```

### Database Rollback

SQL migrations include a `-- DOWN` section with manual rollback steps. Execute them via:

```bash
# Connect to Turso and run rollback SQL manually
# Always verify the DOWN steps before executing
```

> There is no automatic DB rollback. Schema changes should be **additive** (add columns, add tables) rather than destructive. This makes rollback unnecessary in most cases.

---

## Post-Deploy Validation

```bash
bash deploy/validate-deploy.sh
```

This runs 25 checks:
- HTTP status codes for key pages
- 404 verification for removed routes
- API health endpoint
- SSL certificate validity

---

## Operational Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `scripts/schema-guard.ts` | Prisma ↔ Turso validation | Before every deploy (automatic) |
| `scripts/run-migration.ts` | Apply SQL migrations to Turso | When schema changes are needed |
| `scripts/sync-from-turso.ts` | Sync Turso → local dev.db | Refresh local dev data |
| `scripts/reset-coupons.ts` | Reset coupon usage counts | Maintenance |
| `scripts/seo-fast-audit.mjs` | Quick SEO check | Before deploy (optional) |
| `scripts/seo-full-audit.mjs` | Full SEO audit | Periodic checks |
| `scripts/seo-quick-audit.mjs` | SEO quick check | Ad-hoc |
