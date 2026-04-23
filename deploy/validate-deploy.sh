#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# POST-DEPLOY VALIDATION — Verify 200 / 404 / 410 behavior + site health
# ═══════════════════════════════════════════════════════════════════
#
# Runs after deployment to confirm:
#   - Site returns 200 for valid pages
#   - WordPress/spam/PHP URLs return proper 410
#   - Real non-existing pages return 404
#   - No soft 404s (200 or 301→homepage for invalid URLs)
#   - X-Robots-Tag: noindex on blocked URLs
#
# Usage:
#   bash deploy/validate-deploy.sh
#
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

SITE="https://onlineautoabmelden.com"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0

check_status() {
    local url="$1"
    local expected="$2"
    local label="$3"

    # Follow redirects (-L) to get the final status code
    local response
    if ! response=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 "$url" 2>/dev/null); then
        response="000"
    fi

    if [ "$response" = "$expected" ]; then
        echo -e "  ${GREEN}✅ PASS${NC} [$response] $label — $url"
        PASS=$((PASS + 1))
    else
        echo -e "  ${RED}❌ FAIL${NC} [expected $expected, got $response] $label — $url"
        FAIL=$((FAIL + 1))
    fi
}

check_header() {
    local url="$1"
    local header="$2"
    local label="$3"

    local headers
    headers=$(curl -s -I -L --max-time 10 "$url" 2>/dev/null || echo "")

    if echo "$headers" | grep -qi "$header"; then
        echo -e "  ${GREEN}✅ PASS${NC} [header present] $label — $url"
        PASS=$((PASS + 1))
    else
        echo -e "  ${RED}❌ FAIL${NC} [header missing: $header] $label — $url"
        FAIL=$((FAIL + 1))
    fi
}

echo -e "${BLUE}━━━ Post-Deploy Validation: $SITE ━━━${NC}"
echo ""

# ── Valid Pages (must return 200) ─────────────────────────────────
echo -e "${BLUE}--- Valid Pages (expect 200) ---${NC}"
check_status "$SITE/"                                "200" "Homepage"
check_status "$SITE/product/fahrzeugabmeldung"       "200" "Product page"
check_status "$SITE/insiderwissen"                   "200" "Blog listing"
check_status "$SITE/kfz-abmelden-in-bayern"          "200" "Bundesland hub"

# ── WordPress Remnants (must return 410) ──────────────────────────
echo ""
echo -e "${BLUE}--- WordPress URLs (expect 410) ---${NC}"
check_status "$SITE/wp-content/any-file"             "410" "wp-content"
check_status "$SITE/wp-admin/"                       "410" "wp-admin"
check_status "$SITE/wp-login.php"                    "410" "wp-login.php"
check_status "$SITE/wp-includes/test"                "410" "wp-includes"
check_status "$SITE/xmlrpc.php"                      "410" "xmlrpc.php"
check_status "$SITE/wp-cron.php"                     "410" "wp-cron.php"
check_status "$SITE/wp-json/wp/v2/posts"             "410" "wp-json API"
check_status "$SITE/wp-config.php"                   "410" "wp-config.php"

# ── Spam/Hacker URLs (must return 410) ─────────────────────────────
echo ""
echo -e "${BLUE}--- Spam/Hacker URLs (expect 410) ---${NC}"
check_status "$SITE/ceriabet/"                       "410" "ceriabet spam"
check_status "$SITE/ceriabet"                        "410" "ceriabet (no slash)"
check_status "$SITE/klikwin88/"                      "410" "klikwin88 spam"
check_status "$SITE/klikwin88"                       "410" "klikwin88 (no slash)"

# ── Non-Existing Pages (must return 404) ──────────────────────────
echo ""
echo -e "${BLUE}--- Non-Existing Pages (expect 404) ---${NC}"
check_status "$SITE/random-non-existing-page"        "404" "Random non-existing page"
check_status "$SITE/this-page-does-not-exist-12345"  "404" "Random slug"
check_status "$SITE/some-fake-directory/fake-page"   "410" "Blocked nested path"

# ── PHP File Access (must return 410) ──────────────────────────────
echo ""
echo -e "${BLUE}--- PHP File Access (expect 410) ---${NC}"
check_status "$SITE/test.php"                        "410" "Random PHP file"
check_status "$SITE/admin.php"                       "410" "admin.php"
check_status "$SITE/config.php"                      "410" "config.php"

# ── X-Robots-Tag Check ───────────────────────────────────────────
echo ""
echo -e "${BLUE}--- SEO Headers (X-Robots-Tag: noindex) ---${NC}"
check_header "$SITE/wp-content/test"   "x-robots-tag"  "wp-content noindex header"
check_header "$SITE/ceriabet/"         "x-robots-tag"  "ceriabet noindex header"
check_header "$SITE/test.php"          "x-robots-tag"  "PHP file noindex header"

# ── Summary ───────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
TOTAL=$((PASS + FAIL))
if [ "$FAIL" -eq 0 ]; then
    echo -e "${GREEN}  ALL $TOTAL CHECKS PASSED ✅${NC}"
else
    echo -e "${RED}  $FAIL/$TOTAL CHECKS FAILED ❌${NC}"
    echo -e "${GREEN}  $PASS/$TOTAL CHECKS PASSED${NC}"
fi
echo ""

exit "$FAIL"
