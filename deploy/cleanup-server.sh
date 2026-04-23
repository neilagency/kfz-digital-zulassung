#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# FULL SERVER CLEANUP + SECURITY HARDENING
# ═══════════════════════════════════════════════════════════════════
#
# Production-grade script that:
#   Phase 2: Eradicates ALL WordPress remnants (zero tolerance)
#   Phase 3: Hardens server security (permissions, PHP blocking, cron audit)
#   Phase 5: Performs full file system audit
#
# Usage:
#   bash deploy/cleanup-server.sh           # Dry run (scan + report)
#   bash deploy/cleanup-server.sh --execute # Actually delete + harden
#
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────
SSH_HOST="88.223.85.114"
SSH_PORT="65002"
SSH_USER="u104276643"
SSH_CMD="ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_HOST"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DRY_RUN=true
if [[ "${1:-}" == "--execute" ]]; then
    DRY_RUN=false
    echo -e "${RED}⚠️  EXECUTE MODE — Files will be permanently deleted + security hardened!${NC}"
    echo ""
    read -p "Are you sure? Type 'yes' to continue: " CONFIRM
    if [[ "$CONFIRM" != "yes" ]]; then
        echo "Aborted."
        exit 0
    fi
else
    echo -e "${YELLOW}🔍 DRY RUN MODE — No changes will be made.${NC}"
    echo -e "${YELLOW}   Run with --execute to apply changes.${NC}"
    echo ""
fi

# ── Test SSH ──────────────────────────────────────────────────────
echo -e "\n${BLUE}━━━ Preflight: Testing SSH Connection ━━━${NC}"
if $SSH_CMD "echo ok" 2>/dev/null; then
    echo -e "${GREEN}  ✅ SSH connection OK${NC}"
else
    echo -e "${RED}  ❌ Cannot connect to $SSH_HOST:$SSH_PORT${NC}"
    exit 1
fi

# ── Create remote script as temp file ─────────────────────────────
# Using scp + remote execution avoids all heredoc escaping issues
REMOTE_SCRIPT=$(mktemp)
cat > "$REMOTE_SCRIPT" << 'ENDSCRIPT'
#!/bin/bash
set -euo pipefail

DOMAIN_ROOT="/home/u104276643/domains/onlineautoabmelden.com"
PUBLIC_HTML="$DOMAIN_ROOT/public_html"
NODEJS_DIR="$DOMAIN_ROOT/nodejs"
HOME_DIR="/home/u104276643"
DRY_RUN="${1:-true}"

DELETED_COUNT=0
FOUND_COUNT=0

delete_path() {
    local target="$1"
    local type="$2"
    if [ "$type" = "dir" ] && [ -d "$target" ]; then
        local SIZE
        SIZE=$(du -sh "$target" 2>/dev/null | cut -f1)
        FOUND_COUNT=$((FOUND_COUNT + 1))
        echo "  FOUND $type: $target ($SIZE)"
        if [ "$DRY_RUN" = "false" ]; then
            rm -rf "$target"
            DELETED_COUNT=$((DELETED_COUNT + 1))
            echo "     -> DELETED"
        fi
    elif [ "$type" = "file" ] && [ -f "$target" ]; then
        FOUND_COUNT=$((FOUND_COUNT + 1))
        echo "  FOUND $type: $target"
        if [ "$DRY_RUN" = "false" ]; then
            rm -f "$target"
            DELETED_COUNT=$((DELETED_COUNT + 1))
            echo "     -> DELETED"
        fi
    fi
}

# ══════════════════════════════════════════════════════════════════
# PHASE 2: WORDPRESS COMPLETE ERADICATION
# ══════════════════════════════════════════════════════════════════

echo ""
echo "================================================================"
echo "  PHASE 2: WORDPRESS ERADICATION (ZERO TOLERANCE)"
echo "================================================================"

echo ""
echo "--- 2.1: WordPress Directories ---"
for dir in wp-content wp-includes wp-admin wp wordpress wp-snapshots; do
    for base in "$PUBLIC_HTML" "$DOMAIN_ROOT" "$HOME_DIR"; do
        delete_path "$base/$dir" "dir"
    done
done

echo ""
echo "--- 2.2: Spam/Hacker Directories ---"
for dir in ceriabet klikwin88 slot poker casino togel gacor maxwin pragmatic joker sbobet; do
    for base in "$PUBLIC_HTML" "$DOMAIN_ROOT"; do
        delete_path "$base/$dir" "dir"
    done
done

echo ""
echo "--- 2.3: Deep Scan for WordPress Indicators ---"
WP_INDICATORS=$(find "$DOMAIN_ROOT" -maxdepth 4 \( -name "wp-config.php" -o -name "wp-load.php" -o -name "wp-settings.php" \) 2>/dev/null || true)
if [ -n "$WP_INDICATORS" ]; then
    echo "$WP_INDICATORS" | while read -r wpfile; do
        echo "  WP indicator: $wpfile"
        if [ "$DRY_RUN" = "false" ]; then
            rm -f "$wpfile"
            echo "     -> DELETED"
        fi
    done
else
    echo "  OK: No WordPress indicators found"
fi

echo ""
echo "--- 2.4: WordPress PHP Files ---"
for file in wp-login.php wp-config.php wp-cron.php wp-comments-post.php \
            wp-settings.php wp-load.php wp-blog-header.php wp-links-opml.php \
            wp-mail.php wp-signup.php wp-trackback.php wp-activate.php \
            xmlrpc.php wp-config-sample.php license.txt readme.html; do
    for base in "$PUBLIC_HTML" "$DOMAIN_ROOT"; do
        delete_path "$base/$file" "file"
    done
done

echo ""
echo "--- 2.5: Full PHP File Scan (recursive under public_html) ---"
PHP_FILES=$(find "$PUBLIC_HTML" -name "*.php" -type f 2>/dev/null || true)
if [ -n "$PHP_FILES" ]; then
    PHP_COUNT=$(echo "$PHP_FILES" | wc -l | tr -d ' ')
    echo "  Found $PHP_COUNT PHP files under public_html:"
    echo "$PHP_FILES" | head -50 | while read -r phpfile; do
        echo "     $phpfile"
    done
    if [ "$DRY_RUN" = "false" ]; then
        find "$PUBLIC_HTML" -name "*.php" -type f -delete 2>/dev/null || true
        echo "  -> All PHP files deleted from public_html"
    fi
else
    echo "  OK: No PHP files found under public_html"
fi

echo ""
echo "--- 2.6: Hidden Files & Backup Archives ---"
HIDDEN=$(find "$PUBLIC_HTML" -maxdepth 2 -name ".*" \
    -not -name ".htaccess" -not -name ".htpasswd" \
    -not -name ".well-known" -not -name ".builds" \
    -not -name "." -not -name ".." 2>/dev/null || true)
if [ -n "$HIDDEN" ]; then
    echo "$HIDDEN" | while read -r hfile; do
        echo "  Hidden: $hfile"
    done
else
    echo "  OK: No suspicious hidden files"
fi

ARCHIVES=$(find "$DOMAIN_ROOT" -maxdepth 3 \
    \( -name "*.sql" -o -name "*.sql.gz" -o -name "*.tar.gz" \
       -o -name "*.zip" -o -name "*.bak" -o -name "*backup*" \) \
    -type f 2>/dev/null || true)
if [ -n "$ARCHIVES" ]; then
    echo "$ARCHIVES" | while read -r archive; do
        SIZE=$(du -sh "$archive" 2>/dev/null | cut -f1)
        echo "  Archive: $archive ($SIZE)"
        if [ "$DRY_RUN" = "false" ]; then
            rm -f "$archive"
            echo "     -> DELETED"
        fi
    done
else
    echo "  OK: No backup archives found"
fi

echo ""
echo "--- 2.7: Suspicious Directory Scan ---"
if [ -d "$PUBLIC_HTML" ]; then
    for entry in "$PUBLIC_HTML"/*/; do
        [ -d "$entry" ] || continue
        dname=$(basename "$entry" 2>/dev/null || true)
        case "$dname" in
            nodejs|.well-known|cgi-bin|tmp|logs|ssl|error_docs|.builds)
                continue ;;
        esac
        SIZE=$(du -sh "$entry" 2>/dev/null | cut -f1)
        FILE_COUNT=$(find "$entry" -type f 2>/dev/null | wc -l | tr -d ' ')
        echo "  UNEXPECTED: $entry ($SIZE, $FILE_COUNT files)"
        FOUND_COUNT=$((FOUND_COUNT + 1))
        PHP_IN_DIR=$(find "$entry" -name "*.php" -type f 2>/dev/null | wc -l | tr -d ' ')
        if [ "$PHP_IN_DIR" -gt 0 ]; then
            echo "     Contains $PHP_IN_DIR PHP files — MALICIOUS"
            if [ "$DRY_RUN" = "false" ]; then
                rm -rf "$entry"
                DELETED_COUNT=$((DELETED_COUNT + 1))
                echo "     -> DELETED entire directory"
            fi
        fi
    done
fi

# ══════════════════════════════════════════════════════════════════
# PHASE 3: SECURITY HARDENING
# ══════════════════════════════════════════════════════════════════

echo ""
echo "================================================================"
echo "  PHASE 3: SECURITY HARDENING"
echo "================================================================"

echo ""
echo "--- 3.1: Block PHP Execution in public_html ---"
HTACCESS_FILE="$PUBLIC_HTML/.htaccess"
if [ -f "$HTACCESS_FILE" ] && grep -q "deny from all" "$HTACCESS_FILE" 2>/dev/null && grep -q '\.php' "$HTACCESS_FILE" 2>/dev/null; then
    echo "  OK: PHP blocking rules already in .htaccess"
else
    echo "  NEEDS FIX: .htaccess missing PHP blocking rules"
    if [ "$DRY_RUN" = "false" ]; then
        HTACCESS_CONTENT=""
        if [ -f "$HTACCESS_FILE" ]; then
            HTACCESS_CONTENT=$(cat "$HTACCESS_FILE")
        fi
        cat > "$HTACCESS_FILE" << 'HTACCESS_INNER'
# SECURITY: Block ALL PHP execution (Next.js only site)
<FilesMatch "\.php$">
    Order deny,allow
    Deny from all
</FilesMatch>

# Block access to hidden files (except .well-known)
<FilesMatch "^\.(?!well-known)">
    Order deny,allow
    Deny from all
</FilesMatch>

# Block access to backup files
<FilesMatch "\.(sql|bak|old|orig|save|swp|dist)$">
    Order deny,allow
    Deny from all
</FilesMatch>

# Prevent directory listing
Options -Indexes

# Block server info leakage
ServerSignature Off
HTACCESS_INNER
        if [ -n "$HTACCESS_CONTENT" ]; then
            printf "\n# === Original .htaccess below ===\n%s\n" "$HTACCESS_CONTENT" >> "$HTACCESS_FILE"
        fi
        echo "  -> PHP blocking + security rules applied to .htaccess"
    fi
fi

echo ""
echo "--- 3.2: File Permissions Audit ---"
WORLD_WRITABLE=$(find "$DOMAIN_ROOT" -maxdepth 4 -perm -o+w \
    -not -path "*/tmp/*" -not -path "*/logs/*" -not -name "restart.txt" \
    2>/dev/null | head -20 || true)
if [ -n "$WORLD_WRITABLE" ]; then
    echo "  World-writable files found:"
    echo "$WORLD_WRITABLE" | while read -r wfile; do
        echo "     $wfile"
    done
    if [ "$DRY_RUN" = "false" ]; then
        find "$PUBLIC_HTML" -type d -exec chmod 755 {} \; 2>/dev/null || true
        find "$PUBLIC_HTML" -type f -exec chmod 644 {} \; 2>/dev/null || true
        find "$NODEJS_DIR" -type d -exec chmod 755 {} \; 2>/dev/null || true
        find "$NODEJS_DIR" -type f -exec chmod 644 {} \; 2>/dev/null || true
        chmod 755 "$NODEJS_DIR/server.js" 2>/dev/null || true
        echo "  -> Permissions fixed (dirs: 755, files: 644, server.js: 755)"
    fi
else
    echo "  OK: No world-writable files"
fi

echo ""
echo "--- 3.3: Cron Job Audit ---"
CRONTAB_CONTENT=$(crontab -l 2>/dev/null || echo "(no crontab)")
echo "  Current crontab:"
echo "$CRONTAB_CONTENT" | while read -r line; do
    echo "     $line"
done
if echo "$CRONTAB_CONTENT" | grep -iE "(wget|curl.*php|\.php|wp-cron|wordpress)" >/dev/null 2>&1; then
    echo "  SUSPICIOUS: WordPress/PHP cron entries detected"
    if [ "$DRY_RUN" = "false" ]; then
        crontab -l 2>/dev/null | grep -viE "(wp-cron|wordpress|\.php)" | crontab - 2>/dev/null || true
        echo "  -> Removed WordPress-related cron entries"
    fi
else
    echo "  OK: No suspicious cron entries"
fi

echo ""
echo "--- 3.4: Process Audit ---"
SUSPICIOUS_PROCS=$(ps aux 2>/dev/null | grep -iE "(php-fpm|php-cgi|wordpress)" | grep -v grep || true)
if [ -n "$SUSPICIOUS_PROCS" ]; then
    echo "  Suspicious processes:"
    echo "$SUSPICIOUS_PROCS" | while read -r proc; do
        echo "     $proc"
    done
else
    echo "  OK: No suspicious processes"
fi

echo ""
echo "--- 3.5: Uploads Directory Security ---"
UPLOADS_DIR="$NODEJS_DIR/public/uploads"
if [ -d "$UPLOADS_DIR" ]; then
    if [ "$DRY_RUN" = "false" ]; then
        cat > "$UPLOADS_DIR/.htaccess" << 'UPLOADS_INNER'
# Block ALL script execution in uploads
<FilesMatch "\.(php|phtml|php3|php4|php5|php7|phps|cgi|pl|py|sh|bash)$">
    Order deny,allow
    Deny from all
</FilesMatch>
Options -Indexes -ExecCGI
UPLOADS_INNER
        echo "  -> Uploads directory hardened with .htaccess"
    else
        echo "  WILL ADD: .htaccess protection to uploads"
    fi
    EXEC_IN_UPLOADS=$(find "$UPLOADS_DIR" -type f \
        \( -name "*.php" -o -name "*.sh" -o -name "*.py" -o -name "*.cgi" -o -name "*.pl" \) \
        2>/dev/null || true)
    if [ -n "$EXEC_IN_UPLOADS" ]; then
        echo "  Executable files in uploads:"
        echo "$EXEC_IN_UPLOADS" | while read -r efile; do
            echo "     $efile"
            if [ "$DRY_RUN" = "false" ]; then rm -f "$efile"; fi
        done
    else
        echo "  OK: No executable files in uploads"
    fi
else
    echo "  OK: No uploads directory"
fi

# ══════════════════════════════════════════════════════════════════
# PHASE 5: FILE SYSTEM AUDIT
# ══════════════════════════════════════════════════════════════════

echo ""
echo "================================================================"
echo "  PHASE 5: FILE SYSTEM AUDIT"
echo "================================================================"

echo ""
echo "--- 5.1: public_html Contents ---"
ls -la "$PUBLIC_HTML/" 2>/dev/null || echo "  (not found)"

echo ""
echo "--- 5.2: nodejs/ Top-Level Contents ---"
ls -la "$NODEJS_DIR/" 2>/dev/null | head -25 || echo "  (not found)"

echo ""
echo "--- 5.3: Next.js Standalone Integrity ---"
[ -f "$NODEJS_DIR/server.js" ]         && echo "  OK: server.js"         || echo "  FAIL: server.js MISSING"
[ -d "$NODEJS_DIR/.next" ]             && echo "  OK: .next/"            || echo "  FAIL: .next/ MISSING"
[ -f "$NODEJS_DIR/.next/BUILD_ID" ]    && echo "  BUILD_ID: $(cat "$NODEJS_DIR/.next/BUILD_ID")" || true
[ -d "$NODEJS_DIR/node_modules/next" ] && echo "  OK: node_modules/next" || echo "  FAIL: node_modules/next MISSING"
[ -f "$NODEJS_DIR/.env" ]              && echo "  OK: .env"              || echo "  WARN: .env missing"

echo ""
echo "--- 5.4: Disk Usage ---"
du -sh "$DOMAIN_ROOT" 2>/dev/null || true
du -sh "$PUBLIC_HTML" 2>/dev/null || true
du -sh "$NODEJS_DIR" 2>/dev/null || true
du -sh "$NODEJS_DIR/node_modules" 2>/dev/null || true
du -sh "$NODEJS_DIR/.next" 2>/dev/null || true

echo ""
echo "--- 5.5: Final PHP File Count (must be ZERO) ---"
TOTAL_PHP=$(find "$DOMAIN_ROOT" -name "*.php" -type f 2>/dev/null | wc -l | tr -d ' ')
echo "  Total PHP files: $TOTAL_PHP"
if [ "$TOTAL_PHP" -gt 0 ]; then
    find "$DOMAIN_ROOT" -name "*.php" -type f 2>/dev/null | while read -r f; do
        echo "     $f"
    done
fi

# ══════════════════════════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════════════════════════

echo ""
echo "================================================================"
echo "  CLEANUP SUMMARY"
echo "================================================================"
if [ "$DRY_RUN" = "true" ]; then
    echo "  Mode:         DRY RUN (no changes made)"
    echo "  Items found:  $FOUND_COUNT"
    echo "  Action:       Run with --execute to apply"
else
    echo "  Mode:         EXECUTE"
    echo "  Items found:  $FOUND_COUNT"
    echo "  Items deleted: $DELETED_COUNT"
    echo "  PHP remaining: $TOTAL_PHP"
    [ "$TOTAL_PHP" -eq 0 ] && echo "  STATUS: CLEAN" || echo "  STATUS: NEEDS REVIEW"
fi
echo ""
ENDSCRIPT

# ── Upload and execute ────────────────────────────────────────────
echo -e "\n${BLUE}━━━ Running Full Cleanup + Hardening on Server ━━━${NC}"

scp -o StrictHostKeyChecking=no -P "$SSH_PORT" "$REMOTE_SCRIPT" "$SSH_USER@$SSH_HOST:/tmp/cleanup-run.sh"
$SSH_CMD "bash /tmp/cleanup-run.sh $DRY_RUN && rm -f /tmp/cleanup-run.sh"
rm -f "$REMOTE_SCRIPT"

echo ""
if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}Run with --execute to apply all changes:${NC}"
    echo "  bash deploy/cleanup-server.sh --execute"
else
    echo -e "${GREEN}✅ Full cleanup + hardening complete.${NC}"
fi
