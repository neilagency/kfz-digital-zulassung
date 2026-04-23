#!/usr/bin/env bash
# Live SEO similarity on MAJOR_URBAN-style cluster (requires network).
set -euo pipefail
cd "$(dirname "$0")/.."
export SEO_AUDIT_MODE=live
export SEO_AUDIT_URLS="https://onlineautoabmelden.com/auto-online-abmelden-muenchen,https://onlineautoabmelden.com/duesseldorf,https://onlineautoabmelden.com/kfz-online-abmelden-koeln,https://onlineautoabmelden.com/frankfurt-am-main,https://onlineautoabmelden.com/karlsruhe"
npm run seo-similarity-audit
