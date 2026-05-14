# 🚀 Production Deployment Guide
**Last Updated:** May 12, 2026  
**Target:** onlineautoabmelden.com (Hostinger + Passenger)

---

## Quick Start

```bash
# 1. Validate environment
npm run validate-env

# 2. Pre-deployment checks
npm run pre-deploy

# 3. Deploy to production
bash deploy/hostinger-deploy.sh

# 4. Validate deployment
bash deploy/test-city-pages.sh
```

---

## Prerequisites

### 1. Server Access
- **Host:** 88.223.85.114
- **Port:** 65002
- **User:** u104276643
- **App Directory:** `/home/u104276643/domains/onlineautoabmelden.com/nodejs`

**Test SSH Connection:**
```bash
ssh -p 65002 u104276643@88.223.85.114 "echo 'Connection OK'"
```

### 2. Environment Variables

**Server Location:** `/home/u104276643/env/onlineautoabmelden.env`

**Required Variables:**
```bash
# Database
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=eyJ...

# Email
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=noreply@onlineautoabmelden.com
SMTP_PASS_B64=...

# Security
CRON_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://onlineautoabmelden.com

# Payment
MOLLIE_API_KEY=live_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_WEBHOOK_ID=...

# Analytics
NEXT_PUBLIC_GTM_ID=GTM-...
NEXT_PUBLIC_GA_ID=G-...

# Site
NEXT_PUBLIC_SITE_URL=https://onlineautoabmelden.com
NODE_ENV=production
```

**Setup:**
```bash
# Copy .env.production.example to server
scp -P 65002 .env.production.example u104276643@88.223.85.114:/home/u104276643/env/onlineautoabmelden.env

# Edit on server
ssh -p 65002 u104276643@88.223.85.114
nano /home/u104276643/env/onlineautoabmelden.env
# Fill in all values, then save

# Secure the file
chmod 600 /home/u104276643/env/onlineautoabmelden.env
```

### 3. Local Environment

**Required Tools:**
- Node.js 20+ ✅
- npm ✅
- rsync ✅
- ssh ✅
- tsx ✅

**Verify:**
```bash
node --version  # v20+
npm --version   # 10+
rsync --version # 3.x+
ssh -V          # OpenSSH
```

---

## Deployment Process

### Step 1: Pre-Deployment Validation

```bash
# 1. Load local environment (for validation)
cp .env.local .env  # or create from .env.production.example

# 2. Validate environment variables
npm run validate-env

# Expected output:
# ✅ Valid Environment Variables:
#   TURSO_DATABASE_URL             = libsql://...
#   TURSO_AUTH_TOKEN               = ***...
#   ...
# ✅ Environment validation PASSED.

# 3. TypeScript compilation check
npx tsc --noEmit

# Expected output: (no errors)

# 4. Run linter (optional but recommended)
npm run lint

# 5. Test build locally
npm run build

# Expected output:
#   Route (app)                              Size     First Load JS
#   ┌ ○ /                                    ...      ...
#   ...
#   ✓ Compiled successfully
```

### Step 2: Deploy to Production

```bash
# Full deployment (recommended for first deploy or major changes)
bash deploy/hostinger-deploy.sh

# Quick deployment (skip build, just upload existing .next/standalone)
bash deploy/hostinger-deploy.sh --quick
```

**Deployment Steps (Automated):**
1. ✅ Preflight checks (SSH, rsync, project structure)
2. ✅ Build production app (Prisma generate + Next.js build)
3. ✅ Schema guard (validates Prisma ↔ Turso alignment)
4. ✅ SEO quick check (non-blocking)
5. ✅ Prepare deploy package (copy static assets, public files)
6. ✅ Pre-bundle Linux native binaries (sharp, better-sqlite3, @libsql)
7. ✅ Clear old build on server (cache busting)
8. ✅ Upload to server via rsync (with --delete and --checksum)
9. ✅ Setup environment & native dependencies
10. ✅ Kill stale next-server processes
11. ✅ Trigger Passenger restart (touch tmp/restart.txt)
12. ✅ Health check (6 attempts, HTTP 200)
13. ✅ System check (validates DB, API, routes)
14. ✅ Show server logs

**Expected Output:**
```
━━━ 1/7 · Preflight Checks ━━━
  Project root: /Users/.../onlin abmelden
✅ SSH connection OK

━━━ 2/7 · Building Production App ━━━
  Generating Prisma client...
  Running schema guard (Prisma ↔ Turso validation)...
  Building Next.js (standalone mode)...
✅ Build complete — BUILD_ID: abc123xyz

━━━ 3/7 · Preparing Deploy Package ━━━
  Copying .next/static → standalone/.next/static...
  Copying public/ → standalone/public...
  📦 Pre-bundling @libsql/linux-x64-gnu...
  📦 Pre-bundling sharp linux-x64...
  📦 Pre-bundling better-sqlite3 linux-x64...
✅ Deploy package ready: 363M

━━━ 4/7 · Clearing Old Build on Server ━━━
  Removing old .next/ cache and build files on server...
✅ Old build cleared on server

━━━ 5/7 · Uploading to Server via rsync ━━━
  Target: u104276643@88.223.85.114:/home/.../nodejs/
  (rsync with --delete — this will replace all files in nodejs/)
✅ Upload complete

━━━ 6/7 · Setting Up Environment & Triggering Passenger Restart ━━━
  ✅ .env copied from /home/.../env/onlineautoabmelden.env
  ✅ Verified: node_modules/next exists
  ✅ @libsql/linux-x64-gnu already present
  🧹 Killing stale next-server processes (keeping newest PID 12345)
  ✅ Passenger restart triggered (tmp/restart.txt touched)
  🔖 New BUILD_ID on server: abc123xyz
✅ Restart triggered

━━━ 7/7 · Health Check ━━━
  Warming Passenger and waiting for HTTP 200...
✅ External health check: HTTP 200 ✓ (attempt 2/6)

  Latest server logs:
  [2026-05-12T13:00:00.000Z] App started on port 3000
  [2026-05-12T13:00:01.000Z] Database connected
  [2026-05-12T13:00:01.000Z] Server ready

━━━ 7.5/7 · System Check ━━━
✅ System check passed

═══════════════════════════════════════════════════════════════
  ✅ DEPLOYMENT COMPLETE
═══════════════════════════════════════════════════════════════

  🌐 Site:      https://onlineautoabmelden.com
  📁 App dir:   /home/.../nodejs
  🔖 BUILD_ID:  abc123xyz

  To view logs:
    ssh -p 65002 u104276643@88.223.85.114 'tail -f /home/.../nodejs/console.log'

  To force restart:
    ssh -p 65002 u104276643@88.223.85.114 'touch /home/.../nodejs/tmp/restart.txt'

  Post-deploy validation:
    bash deploy/validate-deploy.sh
```

### Step 3: Post-Deployment Validation

```bash
# 1. Test city pages (validates content, SEO, meta tags)
bash deploy/test-city-pages.sh

# Expected output:
# ━━━ City Pages Real Test: https://onlineautoabmelden.com ━━━
# 
# Downloading 10 city pages...
#   [200] Berlin (berlin-zulassungsstelle) — 45234 bytes
#   [200] Hamburg (kfz-online-abmelden-in-hamburg) — 43567 bytes
#   ...
# 
# 1) HTTP Status (expect 200)
#   ✅ 200  Berlin
#   ✅ 200  Hamburg
#   ...
# 
# 2) اسم المدينة موجود في الصفحة
#   ✅ OK   Berlin
#   ✅ OK   Hamburg
#   ...
# 
# 3) السعر ظاهر (19,70)
#   ✅ OK   Berlin
#   ✅ OK   Hamburg
#   ...
# 
# 4) WhatsApp موجود
#   ✅ OK   Berlin
#   ✅ OK   Hamburg
#   ...
# 
# 5) لا يوجد noindex
#   ✅ INDEX  Berlin
#   ✅ INDEX  Hamburg
#   ...
# 
# 6) Meta title صح (اسم + سعر)
#   ✅ OK  Berlin — "Auto online abmelden Berlin – 19,70 €"
#   ✅ OK  Hamburg — "KFZ online abmelden Hamburg – 19,70 €"
#   ...
# 
# 7) Schema.org JSON-LD
#   ✅ OK   berlin-zulassungsstelle
#   ✅ OK   karlsruhe
#   ...
# 
# 8) Alias redirects
#   ✅ 301  berlin → berlin-zulassungsstelle
#   ✅ 301  kfz-online-abmelden-hamburg → kfz-online-abmelden-in-hamburg
# 
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#   ✅ 80 PASSED  /  ❌ 0 FAILED  /  ⚠️  0 WARNINGS  (total 80)
# 
#   🎉 ALL CRITICAL CHECKS PASSED — ready for users

# 2. Manual checks
# Visit the following URLs and verify:

# Homepage
open https://onlineautoabmelden.com

# Product pages
open https://onlineautoabmelden.com/product/fahrzeugabmeldung
open https://onlineautoabmelden.com/product/auto-online-anmelden

# Blog
open https://onlineautoabmelden.com/insiderwissen

# City pages
open https://onlineautoabmelden.com/berlin-zulassungsstelle
open https://onlineautoabmelden.com/auto-online-abmelden-muenchen

# SEO
open https://onlineautoabmelden.com/sitemap.xml
open https://onlineautoabmelden.com/robots.txt

# Admin (verify login works)
open https://onlineautoabmelden.com/admin/login

# 3. Test checkout flow
# - Add product to cart
# - Fill in customer details
# - Test payment (use test mode if available)
# - Verify order confirmation email
# - Verify invoice generation

# 4. Verify analytics
# - Open GTM preview mode: https://tagmanager.google.com
# - Visit site and trigger events
# - Verify events fire correctly

# 5. Check server logs
ssh -p 65002 u104276643@88.223.85.114 'tail -50 /home/u104276643/domains/onlineautoabmelden.com/nodejs/console.log'

# Look for:
# - No errors
# - Successful database connections
# - Successful email sends (if any orders)
```

---

## First-Time Setup (One-Time Tasks)

### 1. Setup Cron Jobs

```bash
# SSH to server
ssh -p 65002 u104276643@88.223.85.114

# Run setup script
cd /home/u104276643/domains/onlineautoabmelden.com/nodejs
bash deploy/setup-cron.sh

# Verify cron jobs
crontab -l

# Expected output:
# ── onlineautoabmelden.com cron jobs ──────────────────────────────
# */5 * * * * curl -s -H "Authorization: Bearer ..." "https://onlineautoabmelden.com/api/cron/publish-scheduled" > /dev/null 2>&1
```

### 2. Configure Payment Webhooks

**Mollie:**
1. Go to: https://www.mollie.com/dashboard/developers/webhooks
2. Add webhook URL: `https://onlineautoabmelden.com/api/payment/webhook`
3. Copy webhook secret to `.env` (if required)

**PayPal:**
1. Go to: https://developer.paypal.com/dashboard/webhooks
2. Add webhook URL: `https://onlineautoabmelden.com/api/payment/paypal/webhook`
3. Select events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.REFUNDED`
4. Copy webhook ID to `.env` as `PAYPAL_WEBHOOK_ID`

### 3. Verify DNS & SSL

```bash
# Check DNS
dig onlineautoabmelden.com

# Expected output:
# onlineautoabmelden.com.  300  IN  A  88.223.85.114

# Check SSL
curl -I https://onlineautoabmelden.com

# Expected output:
# HTTP/2 200
# server: LiteSpeed
# ...
```

### 4. Submit Sitemap to Google

1. Go to: https://search.google.com/search-console
2. Add property: `https://onlineautoabmelden.com`
3. Verify ownership (DNS TXT record or HTML file)
4. Submit sitemap: `https://onlineautoabmelden.com/sitemap.xml`

---

## Troubleshooting

### Deployment Fails at Build Step

**Error:** `Schema guard failed — fix drift before deploying`

**Solution:**
```bash
# Run schema guard locally to see the issue
npx tsx scripts/schema-guard.ts

# If Prisma schema is out of sync with Turso:
# 1. Update Prisma schema
# 2. Generate migration
# 3. Apply to Turso
# 4. Re-run deployment
```

### Deployment Fails at Upload Step

**Error:** `rsync: connection unexpectedly closed`

**Solution:**
```bash
# 1. Check SSH connection
ssh -p 65002 u104276643@88.223.85.114 "echo OK"

# 2. Check disk space on server
ssh -p 65002 u104276643@88.223.85.114 "df -h"

# 3. Check server load
ssh -p 65002 u104276643@88.223.85.114 "uptime"

# 4. Retry deployment
bash deploy/hostinger-deploy.sh --quick
```

### Site Returns 502 Bad Gateway

**Cause:** Passenger failed to start the app

**Solution:**
```bash
# 1. Check server logs
ssh -p 65002 u104276643@88.223.85.114 'tail -100 /home/u104276643/domains/onlineautoabmelden.com/nodejs/console.log'

# 2. Check for missing environment variables
ssh -p 65002 u104276643@88.223.85.114 'cat /home/u104276643/domains/onlineautoabmelden.com/nodejs/.env'

# 3. Check for missing native modules
ssh -p 65002 u104276643@88.223.85.114 'ls -la /home/u104276643/domains/onlineautoabmelden.com/nodejs/node_modules/@libsql'

# 4. Force restart
ssh -p 65002 u104276643@88.223.85.114 'touch /home/u104276643/domains/onlineautoabmelden.com/nodejs/tmp/restart.txt'

# 5. Wait 30 seconds and check again
sleep 30
curl -I https://onlineautoabmelden.com
```

### Site is Slow

**Cause:** Multiple stale next-server processes

**Solution:**
```bash
# 1. Check running processes
ssh -p 65002 u104276643@88.223.85.114 'ps aux | grep next-server'

# 2. Kill stale processes (deployment script does this automatically)
bash deploy/hostinger-deploy.sh --quick

# 3. Or manually:
ssh -p 65002 u104276643@88.223.85.114
ps aux | grep next-server
kill <old-pids>  # Keep the newest one
touch /home/u104276643/domains/onlineautoabmelden.com/nodejs/tmp/restart.txt
```

### Images Not Loading

**Cause:** Missing sharp native module or CDN misconfiguration

**Solution:**
```bash
# 1. Check sharp module
ssh -p 65002 u104276643@88.223.85.114 'ls -la /home/u104276643/domains/onlineautoabmelden.com/nodejs/node_modules/@img'

# 2. Re-deploy with fresh native modules
bash deploy/hostinger-deploy.sh

# 3. Check CDN_BASE_URL in .env (if using CDN)
ssh -p 65002 u104276643@88.223.85.114 'grep CDN_BASE_URL /home/u104276643/domains/onlineautoabmelden.com/nodejs/.env'
```

### Emails Not Sending

**Cause:** SMTP credentials incorrect or SMTP server blocking

**Solution:**
```bash
# 1. Test SMTP connection locally
node -e "
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'noreply@onlineautoabmelden.com',
    pass: Buffer.from('YOUR_SMTP_PASS_B64', 'base64').toString('utf-8')
  }
});
transport.verify().then(() => console.log('✅ SMTP OK')).catch(err => console.error('❌ SMTP FAILED:', err));
"

# 2. Check server logs for email errors
ssh -p 65002 u104276643@88.223.85.114 'grep -i "email" /home/u104276643/domains/onlineautoabmelden.com/nodejs/console.log | tail -20'

# 3. Verify SMTP credentials in .env
ssh -p 65002 u104276643@88.223.85.114 'grep SMTP /home/u104276643/env/onlineautoabmelden.env'
```

---

## Rollback Procedure

If deployment fails and site is broken:

```bash
# 1. SSH to server
ssh -p 65002 u104276643@88.223.85.114

# 2. Check if backup exists
ls -la /home/u104276643/domains/onlineautoabmelden.com/nodejs-backup-*

# 3. If backup exists, restore it
cd /home/u104276643/domains/onlineautoabmelden.com
mv nodejs nodejs-broken
mv nodejs-backup-YYYY-MM-DD nodejs
touch nodejs/tmp/restart.txt

# 4. If no backup, re-deploy previous BUILD_ID
# (requires keeping previous .next/standalone locally)
bash deploy/hostinger-deploy.sh --quick

# 5. Verify site is back up
curl -I https://onlineautoabmelden.com
```

---

## Monitoring & Maintenance

### Daily Checks

```bash
# 1. Check site is up
curl -I https://onlineautoabmelden.com

# 2. Check server logs for errors
ssh -p 65002 u104276643@88.223.85.114 'grep -i "error" /home/u104276643/domains/onlineautoabmelden.com/nodejs/console.log | tail -20'

# 3. Check disk space
ssh -p 65002 u104276643@88.223.85.114 'df -h | grep home'
```

### Weekly Checks

```bash
# 1. Check database size
ssh -p 65002 u104276643@88.223.85.114 'du -sh /home/u104276643/domains/onlineautoabmelden.com/nodejs/*.db'

# 2. Check upload folder size
ssh -p 65002 u104276643@88.223.85.114 'du -sh /home/u104276643/domains/onlineautoabmelden.com/nodejs/public/uploads'

# 3. Check for stale processes
ssh -p 65002 u104276643@88.223.85.114 'ps aux | grep next-server | wc -l'
# Should be 1-2 processes max

# 4. Run system check
SITE_URL=https://onlineautoabmelden.com npm run system-check
```

### Monthly Checks

```bash
# 1. Update dependencies (test locally first!)
npm outdated
npm update

# 2. Run security audit
npm audit

# 3. Check Core Web Vitals
# Visit: https://pagespeed.web.dev/analysis?url=https://onlineautoabmelden.com

# 4. Check Google Search Console
# Visit: https://search.google.com/search-console
# - Check for crawl errors
# - Check for security issues
# - Check for manual actions

# 5. Backup database
npm run backup
```

---

## Performance Optimization

### Enable CDN (Optional)

```bash
# 1. Setup CDN (e.g., Cloudflare, BunnyCDN)
# 2. Point CDN to: https://onlineautoabmelden.com/uploads
# 3. Add CDN_BASE_URL to .env
echo "CDN_BASE_URL=https://cdn.onlineautoabmelden.com" >> /home/u104276643/env/onlineautoabmelden.env

# 4. Re-deploy
bash deploy/hostinger-deploy.sh --quick
```

### Enable Compression

Already enabled via Next.js and LiteSpeed.

### Enable HTTP/2

Already enabled via LiteSpeed.

---

## Security Checklist

- [x] HTTPS enabled (SSL certificate)
- [x] Security headers configured (HSTS, X-Frame-Options, etc.)
- [x] Admin routes protected (NextAuth)
- [x] Customer routes protected (custom auth)
- [x] API routes protected (Bearer tokens, signatures)
- [x] Environment variables secured (chmod 600)
- [x] Database credentials not in git
- [x] SMTP credentials base64 encoded
- [x] CRON_SECRET set (32+ characters)
- [x] NEXTAUTH_SECRET set (32+ characters)
- [x] Payment webhooks verified (signatures)
- [x] File uploads validated (type, size)
- [x] SQL injection prevented (Prisma ORM)
- [x] XSS prevented (React escaping, DOMPurify)
- [x] CSRF prevented (NextAuth CSRF tokens)

---

## Support & Contacts

**Server Provider:** Hostinger  
**Database:** Turso (libsql)  
**Email:** SMTP via Hostinger  
**Payment:** Mollie + PayPal  
**Analytics:** Google Tag Manager + GA4  

**Emergency Contacts:**
- Server issues: Hostinger support
- Database issues: Turso support
- Payment issues: Mollie/PayPal support

---

**Last Updated:** May 12, 2026  
**Next Review:** After first production deployment
