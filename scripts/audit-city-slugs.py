#!/usr/bin/env python3
"""Audit city-slugs.ts for duplicates, broken aliases, and overlap with DB city pages."""
import re
import sys

ROOT = '/Users/omnianeil/المانيا'

with open(f'{ROOT}/src/lib/city-slugs.ts', encoding='utf-8') as f:
    text = f.read()

# ── CITY_ENTRIES ──────────────────────────────────────────────────────────────
start = text.find('export const CITY_ENTRIES = [')
end = text.find('] as const;', start) + 11
block = text[start:end]
entries = re.findall(r"\['([^']+)',\s*'([^']+)'\]", block)
print(f'CITY_ENTRIES: {len(entries)} pairs')

slugs = [s for n,s in entries]
slug_set = set(slugs)
print(f'  Unique slugs: {len(slug_set)}')
if len(slugs) != len(slug_set):
    dupes = sorted(set(s for s in slugs if slugs.count(s) > 1))
    print(f'  ⚠ DUPLICATE slugs in CITY_ENTRIES ({len(dupes)}): {dupes}')
else:
    print('  ✅ No duplicate slugs in CITY_ENTRIES')

# Check for duplicate city names
names = [n for n,s in entries]
name_set = set(names)
if len(names) != len(name_set):
    dup_names = sorted(set(n for n in names if names.count(n) > 1))
    print(f'  ⚠ DUPLICATE city names ({len(dup_names)}): {dup_names}')
else:
    print(f'  ✅ No duplicate city names')

# ── CITY_SLUG_ALIASES ─────────────────────────────────────────────────────────
alias_start = text.find('export const CITY_SLUG_ALIASES: Record')
alias_end = text.find('};', alias_start) + 2
alias_block = text[alias_start:alias_end]
aliases = re.findall(r"'([^']+)':\s*'([^']+)'", alias_block)
print(f'\nCITY_SLUG_ALIASES: {len(aliases)} pairs')

alias_sources = set(k for k,v in aliases)
alias_targets = set(v for k,v in aliases)

# Alias targets not in CITY_ENTRIES
missing_targets = alias_targets - slug_set
if missing_targets:
    print(f'  ⚠ Alias targets NOT in CITY_ENTRIES ({len(missing_targets)}):')
    for t in sorted(missing_targets):
        sources = [k for k,v in aliases if v == t]
        print(f'    {sources} → {t}')
else:
    print(f'  ✅ All alias targets exist in CITY_ENTRIES')

# Alias sources that are also in CITY_ENTRIES (canonical conflict)
conflict = alias_sources & slug_set
if conflict:
    print(f'  ⚠ Alias sources that ALSO exist as canonical slugs ({len(conflict)}):')
    for c in sorted(conflict):
        target = next(v for k,v in aliases if k == c)
        print(f'    {c} → {target}  ← BOTH alias and canonical!')
else:
    print(f'  ✅ No alias/canonical conflicts')

# Circular aliases
print(f'\n── Alias chain analysis ─────────────────────────────────────')
alias_map = dict(aliases)
for src, tgt in aliases:
    chain = [src]
    cur = tgt
    seen = {src}
    while cur in alias_map and cur not in seen:
        seen.add(cur)
        chain.append(cur)
        cur = alias_map[cur]
    chain.append(cur)
    if len(chain) > 3:
        print(f'  Long chain: {" → ".join(chain)}')

# ── Overlap: alias sources that are in sitemap EXCLUDED_SLUGS ─────────────────
with open(f'{ROOT}/src/app/sitemap.ts', encoding='utf-8') as f:
    sitemap_text = f.read()

excluded_start = sitemap_text.find('const EXCLUDED_SLUGS = new Set([')
excluded_end = sitemap_text.find(']);', excluded_start) + 2
excluded_block = sitemap_text[excluded_start:excluded_end]
excluded_slugs = set(re.findall(r"'([^']+)'", excluded_block))
print(f'\n── Sitemap EXCLUDED_SLUGS: {len(excluded_slugs)} entries ─────────────')

# Are there excluded slugs that are still valid canonical city slugs?
excluded_canonical = excluded_slugs & slug_set
if excluded_canonical:
    print(f'  ⚠ EXCLUDED but canonical ({len(excluded_canonical)}): {sorted(excluded_canonical)}')
else:
    print(f'  ✅ No canonical city slugs are excluded from sitemap')

# ── city-metadata.ts coverage ────────────────────────────────────────────────
try:
    with open(f'{ROOT}/src/lib/city-metadata.ts', encoding='utf-8') as f:
        meta_text = f.read()
    meta_slugs = set(re.findall(r"'([a-z0-9-]+)': \{ state:", meta_text))
    print(f'\n── city-metadata.ts: {len(meta_slugs)} entries ──────────────────')
    
    in_entries_not_meta = slug_set - meta_slugs
    print(f'  In CITY_ENTRIES but NOT in city-metadata: {len(in_entries_not_meta)}')
    if in_entries_not_meta:
        sample = sorted(in_entries_not_meta)[:20]
        print(f'  Sample: {sample}')
    
    in_meta_not_entries = meta_slugs - slug_set
    print(f'  In city-metadata but NOT in CITY_ENTRIES: {len(in_meta_not_entries)}')
    if in_meta_not_entries:
        sample = sorted(in_meta_not_entries)[:10]
        print(f'  Sample: {sample}')
except FileNotFoundError:
    print('  city-metadata.ts not found')

print('\nDone.')
