#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# CITY PAGES REAL TEST — HTTP status + content correctness
# ═══════════════════════════════════════════════════════════════════
#
# Usage:
#   bash deploy/test-city-pages.sh
#   bash deploy/test-city-pages.sh --local
#
# ═══════════════════════════════════════════════════════════════════

set -eo pipefail

SITE="${SITE_URL:-https://onlineautoabmelden.com}"
[[ "${1:-}" == "--local" ]] && SITE="http://localhost:3000"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

PASS=0; FAIL=0; WARN=0

TMPDIR_PAGES=$(mktemp -d /tmp/city_test_XXXXXX)
trap 'rm -rf "$TMPDIR_PAGES"' EXIT

# Format: "slug:CityName"
CITY_PAIRS=(
  "berlin-zulassungsstelle:Berlin"
  "kfz-online-abmelden-in-hamburg:Hamburg"
  "auto-online-abmelden-muenchen:München"
  "kfz-online-abmelden-koeln:Köln"
  "frankfurt:Frankfurt"
  "karlsruhe:Karlsruhe"
  "krefeld:Krefeld"
  "aichtal:Aichtal"
  "aachen:Aachen"
  "duesseldorf:Düsseldorf"
)

page_file() { echo "$TMPDIR_PAGES/${1}.html"; }
page_code() { cat "$TMPDIR_PAGES/${1}.code" 2>/dev/null || echo "000"; }

# ── Download all pages once ───────────────────────────────────────
echo ""
echo -e "${BLUE}━━━ City Pages Real Test: $SITE ━━━${NC}"
echo ""
echo -e "${CYAN}Downloading ${#CITY_PAIRS[@]} city pages...${NC}"

for pair in "${CITY_PAIRS[@]}"; do
  slug="${pair%%:*}"; city="${pair##*:}"
  outfile=$(page_file "$slug")
  codefile="$TMPDIR_PAGES/${slug}.code"
  code=$(curl -sL --max-time 30 -w '%{http_code}' -o "$outfile" "$SITE/$slug" 2>/dev/null || echo "000")
  echo "$code" > "$codefile"
  echo -e "  [$code] $city ($slug) — $(wc -c < "$outfile" | tr -d ' ') bytes"
done
echo ""

# ── Helper ────────────────────────────────────────────────────────
check() {
  local slug="$1" pattern="$2" label="$3"
  if grep -qi "$pattern" "$(page_file "$slug")"; then
    echo -e "  ${GREEN}✅ OK${NC}   $label"; PASS=$((PASS+1))
  else
    echo -e "  ${RED}❌ MISS${NC} $label — «$pattern»"; FAIL=$((FAIL+1))
  fi
}

# ── 1) HTTP 200 ───────────────────────────────────────────────────
echo -e "${CYAN}1) HTTP Status (expect 200)${NC}"
for pair in "${CITY_PAIRS[@]}"; do
  slug="${pair%%:*}"; city="${pair##*:}"
  code=$(page_code "$slug")
  if [ "$code" = "200" ]; then
    echo -e "  ${GREEN}✅ 200${NC}  $city"; PASS=$((PASS+1))
  else
    echo -e "  ${RED}❌ $code${NC}  $city"; FAIL=$((FAIL+1))
  fi
done; echo ""

# ── 2) City name present ──────────────────────────────────────────
echo -e "${CYAN}2) اسم المدينة موجود في الصفحة${NC}"
for pair in "${CITY_PAIRS[@]}"; do
  slug="${pair%%:*}"; city="${pair##*:}"
  check "$slug" "$city" "$city"
done; echo ""

# ── 3) Price ──────────────────────────────────────────────────────
echo -e "${CYAN}3) السعر ظاهر (19,70)${NC}"
for pair in "${CITY_PAIRS[@]}"; do
  slug="${pair%%:*}"; city="${pair##*:}"
  check "$slug" "19,70" "$city"
done; echo ""

# ── 4) WhatsApp ───────────────────────────────────────────────────
echo -e "${CYAN}4) WhatsApp موجود${NC}"
for pair in "${CITY_PAIRS[@]}"; do
  slug="${pair%%:*}"; city="${pair##*:}"
  check "$slug" "wa\.me" "$city"
done; echo ""

# ── 5) No noindex ─────────────────────────────────────────────────
echo -e "${CYAN}5) لا يوجد noindex${NC}"
for pair in "${CITY_PAIRS[@]}"; do
  slug="${pair%%:*}"; city="${pair##*:}"
  if grep -qi 'name="robots".*noindex' "$(page_file "$slug")"; then
    echo -e "  ${RED}❌ NOINDEX${NC} $city"; FAIL=$((FAIL+1))
  else
    echo -e "  ${GREEN}✅ INDEX${NC}  $city"; PASS=$((PASS+1))
  fi
done; echo ""

# ── 6) Meta title: city name + price ─────────────────────────────
echo -e "${CYAN}6) Meta title صح (اسم + سعر)${NC}"
for pair in "${CITY_PAIRS[@]}"; do
  slug="${pair%%:*}"; city="${pair##*:}"
  title=$(grep -oi '<title>[^<]*</title>' "$(page_file "$slug")" | head -1 | sed 's/<[^>]*>//g' || echo "")
  if [ -z "$title" ]; then
    echo -e "  ${RED}❌ NO TITLE${NC} $city"; FAIL=$((FAIL+1))
  elif echo "$title" | grep -qi "$city" && echo "$title" | grep -q "19,70"; then
    echo -e "  ${GREEN}✅ OK${NC}  $city — \"$title\""; PASS=$((PASS+1))
  elif echo "$title" | grep -qi "$city"; then
    echo -e "  ${YELLOW}⚠️  TITLE${NC} $city: بدون سعر — \"$title\""; WARN=$((WARN+1))
  else
    echo -e "  ${RED}❌ TITLE${NC} $city: اسم مفقود — \"$title\""; FAIL=$((FAIL+1))
  fi
done; echo ""

# ── 7) Schema JSON-LD ─────────────────────────────────────────────
echo -e "${CYAN}7) Schema.org JSON-LD${NC}"
for slug in "berlin-zulassungsstelle" "karlsruhe" "aichtal"; do
  check "$slug" "application/ld" "$slug"
done; echo ""

# ── 8) Redirects ──────────────────────────────────────────────────
echo -e "${CYAN}8) Alias redirects${NC}"
ALIAS_PAIRS=(
  "berlin:berlin-zulassungsstelle"
  "kfz-online-abmelden-hamburg:kfz-online-abmelden-in-hamburg"
)
for alias_pair in "${ALIAS_PAIRS[@]}"; do
  alias_slug="${alias_pair%%:*}"; expected="${alias_pair##*:}"
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$SITE/$alias_slug" 2>/dev/null || echo "000")
  final=$(curl -s -o /dev/null -w '%{url_effective}' -L --max-time 15 "$SITE/$alias_slug" 2>/dev/null || echo "")
  if [[ "$code" =~ ^30[1-8]$ ]] && echo "$final" | grep -q "$expected"; then
    echo -e "  ${GREEN}✅ $code${NC}  $alias_slug → $expected"; PASS=$((PASS+1))
  elif [[ "$code" =~ ^30[1-8]$ ]]; then
    echo -e "  ${YELLOW}⚠️  $code${NC}  $alias_slug → $final"; WARN=$((WARN+1))
  else
    echo -e "  ${RED}❌ $code${NC}  $alias_slug (لا redirect)"; FAIL=$((FAIL+1))
  fi
done; echo ""

# ── Summary ───────────────────────────────────────────────────────
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
TOTAL=$((PASS + FAIL + WARN))
echo -e "  ${GREEN}✅ $PASS PASSED${NC}  /  ${RED}❌ $FAIL FAILED${NC}  /  ${YELLOW}⚠️  $WARN WARNINGS${NC}  (total $TOTAL)"
echo ""
if [ "$FAIL" -eq 0 ]; then
  echo -e "${GREEN}  🎉 ALL CRITICAL CHECKS PASSED — ready for users${NC}"
  exit 0
else
  echo -e "${RED}  ❌ $FAIL critical check(s) failed${NC}"
  exit 1
fi
