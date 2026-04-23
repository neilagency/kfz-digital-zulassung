#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# Server Crontab Setup — onlineautoabmelden.com
# ═══════════════════════════════════════════════════════════════════
#
# Replaces GitHub Actions cron jobs with server-side crontab entries.
# Run this ONCE on the Hostinger server after deployment.
#
# Usage (on server):
#   bash setup-cron.sh
#
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Read CRON_SECRET from env file ────────────────────────────────
ENV_FILE="/home/u104276643/env/onlineautoabmelden.env"
if [ -f "$ENV_FILE" ]; then
    CRON_SECRET=$(grep '^CRON_SECRET=' "$ENV_FILE" | cut -d'=' -f2-)
else
    echo "❌ Env file not found at $ENV_FILE"
    echo "   Please create it first (see deploy/server.env template)"
    exit 1
fi

if [ -z "$CRON_SECRET" ] || [ "$CRON_SECRET" = "<CHANGE_ME_RANDOM_STRING>" ]; then
    echo "❌ CRON_SECRET is not set in $ENV_FILE"
    echo "   Generate one: openssl rand -base64 32"
    exit 1
fi

SITE="https://onlineautoabmelden.com"

# ── Define cron entries ───────────────────────────────────────────
# 1. Publish scheduled posts — every 5 minutes
# Note: sync-orders (WooCommerce) removed — WC integration no longer active
CRON_ENTRIES=$(cat <<EOF
# ── onlineautoabmelden.com cron jobs ──────────────────────────────
*/5 * * * * curl -s -H "Authorization: Bearer $CRON_SECRET" "$SITE/api/cron/publish-scheduled" > /dev/null 2>&1
EOF
)

# ── Remove old entries and add new ones ───────────────────────────
# Backup current crontab
crontab -l > /tmp/crontab-backup.txt 2>/dev/null || true

# Remove any existing onlineautoabmelden entries
crontab -l 2>/dev/null | grep -v 'onlineautoabmelden' | grep -v '^#.*onlineautoabmelden' > /tmp/crontab-clean.txt || true

# Append new entries
echo "$CRON_ENTRIES" >> /tmp/crontab-clean.txt

# Install
crontab /tmp/crontab-clean.txt

echo "✅ Crontab updated successfully!"
echo ""
echo "Current cron jobs:"
crontab -l
