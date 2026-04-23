#!/usr/bin/env python3
import re

with open('/Users/omnianeil/المانيا/src/lib/city-slugs.ts', encoding='utf-8') as f:
    text = f.read()

start = text.find('export const CITY_ENTRIES = [')
end = text.find('] as const;', start) + 11
block = text[start:end]
entries = re.findall(r"\['([^']+)',\s*'([^']+)'\]", block)

print('=== Düsseldorf in CITY_ENTRIES ===')
for name, slug in entries:
    if 'sseldorf' in name.lower() or 'sseldorf' in slug.lower():
        print(f"  [{name!r}, {slug!r}]")

with open('/Users/omnianeil/المانيا/src/lib/city-metadata.ts', encoding='utf-8') as f:
    meta = f.read()
print()
print('zulassungsservice-duesseldorf in metadata:', 'zulassungsservice-duesseldorf' in meta)

for line in meta.split('\n'):
    if 'duesseldorf' in line or ('sseldorf' in line and 'state:' in line):
        print(f"  META: {line.strip()[:120]}")

# Also check the 145 unmatched slugs — is zulassungsservice-duesseldorf among them?
entry_slugs = set(s for n,s in entries)
meta_slugs = set(re.findall(r"'([a-z0-9-]+)': \{ state:", meta))
unmatched = entry_slugs - meta_slugs
print(f"\nTotal unmatched: {len(unmatched)}")
print("Düsseldorf-related unmatched:")
for s in sorted(unmatched):
    if 'sseldorf' in s or 'dorf' in s:
        print(f"  {s}")
