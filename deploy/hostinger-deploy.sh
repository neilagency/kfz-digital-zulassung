#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# FILE-BASED DEPLOYMENT - onlineautoabmelden.com (Hostinger + LiteSpeed Passenger)
# ═══════════════════════════════════════════════════════════════════
#
# Server setup (Hostinger shared Node.js via Passenger):
#   - App root:   /home/u104276643/domains/onlineautoabmelden.com/nodejs/
#   - Startup:    server.js  (set in .htaccess PassengerStartupFile)
#   - Restart:    touch nodejs/tmp/restart.txt  (PassengerRestartDir)
#   - NO pm2, NO atomic swap — rsync directly into nodejs/, then touch restart
#
# Usage:
#   bash deploy/hostinger-deploy.sh          # Full build + deploy
#   bash deploy/hostinger-deploy.sh --quick  # Skip build, just upload + restart
#
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────
SSH_HOST="88.223.85.114"
SSH_PORT="65002"
SSH_USER="u104276643"
# Passenger app root — this is where server.js must live
REMOTE_APP_DIR="/home/u104276643/domains/onlineautoabmelden.com/nodejs"
# Persistent env file on the server (set once, never overwritten by deploy)
REMOTE_ENV_FILE="/home/u104276643/env/onlineautoabmelden.env"

# Local paths (relative to project root)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STANDALONE_DIR="$PROJECT_ROOT/.next/standalone"
STATIC_DIR="$PROJECT_ROOT/.next/static"
PUBLIC_DIR="$PROJECT_ROOT/public"

# SSH command shortcut
SSH_CMD="ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_HOST"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }
step() { echo -e "\n${BLUE}━━━ $1 ━━━${NC}"; }

# ── Parse Args ────────────────────────────────────────────────────
SKIP_BUILD=false
if [[ "${1:-}" == "--quick" ]]; then
    SKIP_BUILD=true
    warn "Quick mode: skipping build, uploading existing .next/standalone/"
fi

# ── Preflight Checks ─────────────────────────────────────────────
step "1/7 · Preflight Checks"

cd "$PROJECT_ROOT"
echo "  Project root: $PROJECT_ROOT"

echo -n "  Testing SSH connection... "
if $SSH_CMD "echo ok" 2>/dev/null; then
    log "SSH connection OK"
else
    err "Cannot connect to $SSH_HOST:$SSH_PORT — check your SSH credentials"
fi

command -v rsync >/dev/null 2>&1 || err "rsync not found — install it first"

# ── Load Environment Variables ────────────────────────────────────
for envfile in "$PROJECT_ROOT/.env" "$PROJECT_ROOT/.env.local"; do
    if [ -f "$envfile" ]; then
        set -a; source "$envfile"; set +a
    fi
done

# ── Build ─────────────────────────────────────────────────────────
if [ "$SKIP_BUILD" = false ]; then
    step "2/7 · Building Production App"

    echo "  Generating Prisma client..."
    npx prisma generate

    # ── Schema Guard: validate Prisma ↔ Turso alignment ──
    echo "  Running schema guard (Prisma ↔ Turso validation)..."
    if [ -z "${TURSO_DATABASE_URL:-}" ] || [ -z "${TURSO_AUTH_TOKEN:-}" ]; then
        err "Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN — cannot validate schema. Add them to .env.local"
    fi
    npx tsx scripts/schema-guard.ts || err "Schema guard failed — fix drift before deploying"

    # ── SEO Quick Check (optional, non-blocking) ──
    if [ -f "$PROJECT_ROOT/scripts/seo-quick-audit.mjs" ]; then
        echo "  Running SEO quick check..."
        node scripts/seo-quick-audit.mjs 2>/dev/null || warn "SEO quick check had issues (non-blocking)"
    fi

    echo "  Building Next.js (standalone mode)..."
    npm run build

    [ -d "$STANDALONE_DIR" ] || err "Standalone dir not found at $STANDALONE_DIR"
    [ -f "$STANDALONE_DIR/server.js" ] || err "server.js not found in standalone dir"

    log "Build complete — BUILD_ID: $(cat .next/BUILD_ID)"
else
    step "2/7 · Build (SKIPPED)"
    [ -d "$STANDALONE_DIR" ] || err "No standalone build found. Run without --quick first."
fi

# ── Prepare Deploy Package ────────────────────────────────────────
step "3/7 · Preparing Deploy Package"

echo "  Copying .next/static → standalone/.next/static..."
rm -rf "$STANDALONE_DIR/.next/static"
cp -r "$STATIC_DIR" "$STANDALONE_DIR/.next/static"

echo "  Copying public/ → standalone/public..."
rm -rf "$STANDALONE_DIR/public"
cp -r "$PUBLIC_DIR" "$STANDALONE_DIR/public"

# Ensure tmp/ dir exists for Passenger restart trigger
mkdir -p "$STANDALONE_DIR/tmp"

# Remove any local dev artifacts
rm -f "$STANDALONE_DIR/.env" "$STANDALONE_DIR/dev.db"

# ── Pre-bundle Linux native binaries (installed locally, uploaded via rsync) ──
# This avoids running npm on the server (which fails under load / resource limits).

# @libsql/linux-x64-gnu
LIBSQL_VERSION=$(cat "$STANDALONE_DIR/node_modules/libsql/package.json" 2>/dev/null | grep '"version"' | head -1 | sed 's/.*"\([0-9.]*\)".*/\1/')
if [ -n "$LIBSQL_VERSION" ] && [ ! -d "$STANDALONE_DIR/node_modules/@libsql/linux-x64-gnu" ]; then
    echo "  📦 Pre-bundling @libsql/linux-x64-gnu@$LIBSQL_VERSION for linux-x64..."
    TMPDIR_LIBSQL=$(mktemp -d)
    echo '{"private":true}' > "$TMPDIR_LIBSQL/package.json"
    npm install "@libsql/linux-x64-gnu@$LIBSQL_VERSION" --ignore-scripts --no-save --prefix "$TMPDIR_LIBSQL" 2>/dev/null || true
    if [ -d "$TMPDIR_LIBSQL/node_modules/@libsql/linux-x64-gnu" ]; then
        mkdir -p "$STANDALONE_DIR/node_modules/@libsql"
        cp -r "$TMPDIR_LIBSQL/node_modules/@libsql/linux-x64-gnu" "$STANDALONE_DIR/node_modules/@libsql/linux-x64-gnu"
        echo "  ✅ @libsql/linux-x64-gnu pre-bundled"
    else
        warn "@libsql/linux-x64-gnu pre-bundle failed — will attempt on server"
    fi
    rm -rf "$TMPDIR_LIBSQL"
fi

# sharp for linux-x64
if [ ! -d "$STANDALONE_DIR/node_modules/@img/sharp-linux-x64" ]; then
    echo "  📦 Pre-bundling sharp linux-x64..."
    TMPDIR_SHARP=$(mktemp -d)
    echo '{"private":true}' > "$TMPDIR_SHARP/package.json"
    # Get sharp version from standalone
    SHARP_VERSION=$(cat "$STANDALONE_DIR/node_modules/sharp/package.json" 2>/dev/null | python3 -c "import json,sys; print(json.load(sys.stdin)['version'])" 2>/dev/null || echo "")
    LIBVIPS_VERSION=$(cat "$STANDALONE_DIR/node_modules/sharp/package.json" 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['optionalDependencies']['@img/sharp-libvips-linux-x64'])" 2>/dev/null || echo "")
    if [ -n "$SHARP_VERSION" ] && [ -n "$LIBVIPS_VERSION" ]; then
        npm install "@img/sharp-linux-x64@$SHARP_VERSION" "@img/sharp-libvips-linux-x64@$LIBVIPS_VERSION" --ignore-scripts --no-save --os=linux --cpu=x64 --libc=glibc --force --prefix "$TMPDIR_SHARP" 2>/dev/null || true
    else
        npm install --os=linux --cpu=x64 --libc=glibc --force sharp --no-save --prefix "$TMPDIR_SHARP" 2>/dev/null || true
    fi
    if [ -d "$TMPDIR_SHARP/node_modules/@img/sharp-linux-x64" ]; then
        mkdir -p "$STANDALONE_DIR/node_modules/@img"
        cp -r "$TMPDIR_SHARP/node_modules/@img/sharp-linux-x64" "$STANDALONE_DIR/node_modules/@img/"
        cp -r "$TMPDIR_SHARP/node_modules/@img/sharp-libvips-linux-x64" "$STANDALONE_DIR/node_modules/@img/" 2>/dev/null || true
        echo "  ✅ sharp linux-x64 pre-bundled"
    else
        warn "sharp pre-bundle failed — images may not resize on server"
    fi
    rm -rf "$TMPDIR_SHARP"
fi

DEPLOY_SIZE=$(du -sh "$STANDALONE_DIR" | cut -f1)
log "Deploy package ready: $DEPLOY_SIZE"

# ── Clear old build on server (cache busting) ─────────────────────
step "4/7 · Clearing Old Build on Server"

echo "  Removing old .next/ cache and build files on server..."
$SSH_CMD bash << 'CLEAR_SCRIPT'
set -euo pipefail
REMOTE_APP_DIR="/home/u104276643/domains/onlineautoabmelden.com/nodejs"

# Remove old Next.js build cache
rm -rf "$REMOTE_APP_DIR/.next"

# Remove old node_modules (will be replaced by standalone bundle)
rm -rf "$REMOTE_APP_DIR/node_modules"

echo "  ✅ Old build cleared"
CLEAR_SCRIPT

log "Old build cleared on server"

# ── Upload to Server (rsync directly into nodejs/) ────────────────
step "5/7 · Uploading to Server via rsync"

echo "  Target: $SSH_USER@$SSH_HOST:$REMOTE_APP_DIR/"
echo "  (rsync with --delete — this will replace all files in nodejs/)"

rsync -az --delete --checksum \
    --exclude='console.log' \
    --exclude='stderr.log' \
    --exclude='.env' \
    --exclude='public/uploads/documents/' \
    --exclude='public/uploads/order-documents/' \
    -e "ssh -o StrictHostKeyChecking=no -p $SSH_PORT" \
    "$STANDALONE_DIR/" \
    "$SSH_USER@$SSH_HOST:$REMOTE_APP_DIR/"

log "Upload complete"

# ── Setup Env & Native Dependencies & Restart ────────────────────
step "6/7 · Setting Up Environment & Triggering Passenger Restart"

# Quoted heredoc: $(...) must run ON THE SERVER. Unquoted heredoc runs $(...) locally and breaks libsql install.
$SSH_CMD env REMOTE_APP_DIR="$REMOTE_APP_DIR" REMOTE_ENV_FILE="$REMOTE_ENV_FILE" bash -s <<'REMOTE_SCRIPT'
set -euo pipefail

# Hostinger non-interactive SSH: no npm/node on default PATH (see /opt/alt/alt-nodejs*)
export PATH="/opt/alt/alt-nodejs24/root/usr/bin:/opt/alt/alt-nodejs22/root/usr/bin:/opt/alt/alt-nodejs20/root/usr/bin:$PATH"

# Copy .env from persistent location
if [ -f "$REMOTE_ENV_FILE" ]; then
    cp "$REMOTE_ENV_FILE" "$REMOTE_APP_DIR/.env"
    echo "  ✅ .env copied from $REMOTE_ENV_FILE"
else
    echo "  ⚠️  No env file found at $REMOTE_ENV_FILE"
fi

# Verify critical modules exist
if [ ! -d "$REMOTE_APP_DIR/node_modules/next" ]; then
    echo "  ❌ CRITICAL: node_modules/next is missing!"
    exit 1
fi
echo "  ✅ Verified: node_modules/next exists"

# Install @libsql native Linux binary on the server if missing
if [ -d "$REMOTE_APP_DIR/node_modules/@libsql/linux-x64-gnu" ]; then
    echo "  ✅ @libsql/linux-x64-gnu already present"
else
    echo "  📦 Installing @libsql/linux-x64-gnu on server (native Linux binary)..."
    LIBSQL_PKG_VERSION=""
    if [ -f "$REMOTE_APP_DIR/node_modules/libsql/package.json" ]; then
        LIBSQL_PKG_VERSION=$(node -e "try{process.stdout.write(require(process.env.REMOTE_APP_DIR + '/node_modules/libsql/package.json').version)}catch(e){}" 2>/dev/null || echo "")
    fi
    if [ -z "$LIBSQL_PKG_VERSION" ]; then
        LIBSQL_PKG_VERSION="0.5.22"
        echo "  ℹ️  Using pinned libsql optional-binary version: $LIBSQL_PKG_VERSION"
    fi
    cd "$REMOTE_APP_DIR"
    npm install "@libsql/linux-x64-gnu@$LIBSQL_PKG_VERSION" --ignore-scripts --no-save --prefix "$REMOTE_APP_DIR" 2>&1 | tail -8 || true
    if [ -d "$REMOTE_APP_DIR/node_modules/@libsql/linux-x64-gnu" ]; then
        echo "  ✅ @libsql/linux-x64-gnu installed on server"
    else
        echo "  ⚠️  Pinned install failed — trying latest @libsql/linux-x64-gnu..."
        npm install "@libsql/linux-x64-gnu" --ignore-scripts --no-save --prefix "$REMOTE_APP_DIR" 2>&1 | tail -8 || true
    fi
fi

# Ensure tmp/ exists (Passenger restarts via this dir)
mkdir -p "$REMOTE_APP_DIR/tmp"

# Reduce stale next-server buildup from previous deploys.
# Keep the newest process so the current app can still serve traffic until restart.
NEXT_SERVER_TABLE=$(ps -eo pid=,etimes=,command= 2>/dev/null | awk '/next-server/ && !/awk/ {print $1 " " $2}')
NEXT_SERVER_COUNT=$(printf '%s\n' "$NEXT_SERVER_TABLE" | awk 'NF' | wc -l | tr -d ' ')
if [ "$NEXT_SERVER_COUNT" -gt 1 ]; then
    KEEP_PID=$(printf '%s\n' "$NEXT_SERVER_TABLE" | sort -k2,2n | awk 'NR==1 {print $1}')
    STALE_PIDS=$(printf '%s\n' "$NEXT_SERVER_TABLE" | sort -k2,2n | awk 'NR>1 {print $1}' | tr '\n' ' ')
    echo "  🧹 Killing stale next-server processes (keeping newest PID $KEEP_PID)"
    kill $STALE_PIDS 2>/dev/null || true
    sleep 1
elif [ "$NEXT_SERVER_COUNT" -eq 1 ]; then
    echo "  ℹ️  Single next-server process detected — no cleanup needed"
else
    echo "  ℹ️  No existing next-server processes detected"
fi

# Clear old console.log so we get fresh startup logs
rm -f "$REMOTE_APP_DIR/console.log"

# Touch restart.txt — Passenger watches this to reload the app
touch "$REMOTE_APP_DIR/tmp/restart.txt"
echo "  ✅ Passenger restart triggered (tmp/restart.txt touched)"

# Show new BUILD_ID
echo "  🔖 New BUILD_ID on server: $(cat "$REMOTE_APP_DIR/.next/BUILD_ID" 2>/dev/null || echo 'unknown')"
REMOTE_SCRIPT

log "Restart triggered"

# ── Health Check ──────────────────────────────────────────────────
step "7/7 · Health Check"

echo "  Warming Passenger and waiting for HTTP 200..."
EXT_CODE="000"
for attempt in 1 2 3 4 5 6; do
    EXT_CODE=$(curl -L -s -o /dev/null -w '%{http_code}' --max-time 20 https://onlineautoabmelden.com/ 2>/dev/null || echo "000")
    if [ "$EXT_CODE" = "200" ]; then
        log "External health check: HTTP $EXT_CODE ✓ (attempt $attempt/6)"
        break
    fi

    echo "  Attempt $attempt/6 → HTTP $EXT_CODE"
    if [ "$attempt" -lt 6 ]; then
        sleep 5
    fi
done

if [ "$EXT_CODE" != "200" ]; then
    warn "External check never reached HTTP 200 — investigate console.log and rerun validation"
fi

# Show server logs
echo ""
echo "  Latest server logs:"
$SSH_CMD "tail -15 $REMOTE_APP_DIR/console.log" 2>/dev/null || true

# ── Post-Deploy System Check ──
step "7.5/7 · System Check"
SITE_URL="https://onlineautoabmelden.com" \
SYSTEM_CHECK_ATTEMPTS=6 \
SYSTEM_CHECK_TIMEOUT_MS=20000 \
SYSTEM_CHECK_RETRY_DELAY_MS=5000 \
npx tsx scripts/system-check.ts || warn "System check reported issues — investigate"

# ── Summary ───────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ DEPLOYMENT COMPLETE${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "  🌐 Site:      https://onlineautoabmelden.com"
echo "  📁 App dir:   $REMOTE_APP_DIR"
echo "  🔖 BUILD_ID:  $(cat $PROJECT_ROOT/.next/BUILD_ID 2>/dev/null || echo 'unknown')"
echo ""
echo "  To view logs:"
echo "    ssh -p $SSH_PORT $SSH_USER@$SSH_HOST 'tail -f $REMOTE_APP_DIR/console.log'"
echo ""
echo "  To force restart:"
echo "    ssh -p $SSH_PORT $SSH_USER@$SSH_HOST 'touch $REMOTE_APP_DIR/tmp/restart.txt'"
echo ""
echo "  Post-deploy validation:"
echo "    bash deploy/validate-deploy.sh"
echo ""
