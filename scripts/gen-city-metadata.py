#!/usr/bin/env python3
"""
Generates src/lib/city-metadata.ts from KBA CSV + CITY_ENTRIES.
Each city slug gets:
- state
- region
- nearby
- areaType
- localHint
"""

import csv, re, unicodedata
from pathlib import Path

ROOT = Path(__file__).parent.parent
CSV_PATH = ROOT / 'src/data/av1_2026_04_csv.csv'
CITY_SLUGS_PATH = ROOT / 'src/lib/city-slugs.ts'
OUT_PATH = ROOT / 'src/lib/city-metadata.ts'

BL_NAMES = {
    'BW': 'Baden-Württemberg', 'BY': 'Bayern', 'BE': 'Berlin',
    'BB': 'Brandenburg', 'HB': 'Bremen', 'HH': 'Hamburg',
    'HE': 'Hessen', 'MV': 'Mecklenburg-Vorpommern', 'NI': 'Niedersachsen',
    'NW': 'Nordrhein-Westfalen', 'RP': 'Rheinland-Pfalz', 'SL': 'Saarland',
    'SN': 'Sachsen', 'ST': 'Sachsen-Anhalt', 'SH': 'Schleswig-Holstein',
    'TH': 'Thüringen',
}

def normalize_strict(s: str) -> str:
    s = s.lower()
    s = s.replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue').replace('ß', 'ss')
    s = unicodedata.normalize('NFD', s)
    s = re.sub(r'[\u0300-\u036f]', '', s)
    s = re.sub(r'[()]', ' ', s)
    s = re.sub(r'[/_,.;:]+', ' ', s)
    s = s.replace('-', ' ')
    return re.sub(r'\s+', ' ', s).strip()

LOOSE_WORDS = r'\b(?:landkreis|kreis|lk|lra|stadt|nebenstelle|hauptstelle|zentrale)\b'

def normalize_loose(s: str) -> str:
    s = normalize_strict(s)
    s = re.sub(LOOSE_WORDS, ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

def compact(s: str) -> str:
    return normalize_strict(s).replace(' ', '')

def compact_loose(s: str) -> str:
    return normalize_loose(s).replace(' ', '')

def build_needles(city: str):
    out = []
    for fn in [normalize_strict, normalize_loose, compact, compact_loose]:
        v = fn(city)
        if v and v not in out:
            out.append(v)
    return out

rows = []
with open(CSV_PATH, encoding='utf-8') as f:
    reader = csv.reader(f)
    next(reader)
    for r in reader:
        if len(r) < 9:
            r += [''] * (9 - len(r))
        rows.append({
            'code': r[0].strip(),
            'stadt': r[1].strip(),
            'bundesland': r[2].strip(),
            'behoerde_name': r[3].strip(),
            'plz': r[4].strip(),
            'ort': r[5].strip(),
            'strasse': r[6].strip(),
            'telefon': r[7].strip(),
            'email': r[8].strip(),
        })

rows = [r for r in rows if r['stadt'] or r['ort'] or r['behoerde_name']]

text = CITY_SLUGS_PATH.read_text(encoding='utf-8')
start = text.find('export const CITY_ENTRIES')
section = text[start:]
entries = re.findall(r"\[(['\"])(.+?)\1,\s*(['\"])(.+?)\3\]", section)
city_entries = [(m[1], m[3]) for m in entries]

def score_row(row: dict, needles: list) -> int:
    candidates = [
        (normalize_strict(row['stadt']), 140, 110),
        (normalize_loose(row['stadt']), 138, 108),
        (compact(row['stadt']), 136, 106),
        (compact_loose(row['stadt']), 134, 104),
        (normalize_strict(row['ort']), 125, 100),
        (normalize_loose(row['ort']), 123, 98),
        (compact(row['ort']), 121, 96),
        (compact_loose(row['ort']), 119, 94),
        (normalize_strict(row['behoerde_name']), 115, 92),
        (normalize_loose(row['behoerde_name']), 113, 90),
        (compact(row['behoerde_name']), 111, 88),
        (compact_loose(row['behoerde_name']), 109, 86),
    ]
    best = 0
    for val, exact_s, partial_s in candidates:
        if not val:
            continue
        for needle in needles:
            if val == needle:
                best = max(best, exact_s)
            elif val in needle or needle in val:
                best = max(best, partial_s)
    if best == 0:
        return 0
    if 'nebenstelle' not in row['behoerde_name'].lower():
        best += 4
    return best

def find_row(city_name: str):
    needles = build_needles(city_name)
    best_row, best_score = None, 0
    for row in rows:
        s = score_row(row, needles)
        if s > best_score:
            best_score = s
            best_row = row
    return best_row if best_score >= 86 else None

slug_to_row = {}
for city_name, slug in city_entries:
    row = find_row(city_name)
    if row:
        slug_to_row[slug] = row

bl_slugs = {}
for slug, row in slug_to_row.items():
    bl = row['bundesland']
    bl_slugs.setdefault(bl, []).append(slug)

def get_plz_int(slug: str):
    row = slug_to_row.get(slug)
    if not row:
        return None
    try:
        return int(row['plz'])
    except (ValueError, TypeError):
        return None

def clean_region(behoerde_name: str) -> str:
    name = re.sub(r'\s*(Nebenstelle|Hauptstelle|Zentrale)\b.*', '', behoerde_name, flags=re.I)
    name = re.sub(r'^(?:lk|lra|kr)\s+', '', name, flags=re.I)
    return name.strip() or behoerde_name.strip()

def infer_area_type(slug: str, region: str, state: str) -> str:
    slug_l = slug.lower()
    region_l = region.lower()
    state_l = state.lower()

    if state_l in ['berlin', 'hamburg', 'bremen']:
        return 'urban'

    if any(x in slug_l for x in [
        'berlin', 'hamburg', 'muenchen', 'koeln', 'dortmund', 'essen',
        'duesseldorf', 'frankfurt', 'stuttgart', 'hannover', 'leipzig',
        'dresden', 'bremen', 'duisburg', 'bochum', 'wuppertal', 'bonn',
        'muenster', 'bielefeld', 'mannheim', 'nuernberg'
    ]):
        return 'urban'

    if 'landkreis' in slug_l or 'kreis' in slug_l or 'kreis' in region_l:
        return 'rural'

    if any(x in slug_l for x in [
        'aachen', 'passau', 'koblenz', 'trier', 'regensburg', 'augsburg',
        'erfurt', 'chemnitz', 'magdeburg', 'rostock', 'freiburg', 'heidelberg',
        'kassel', 'wiesbaden', 'mainz', 'saarbruecken', 'osnabrueck'
    ]):
        return 'regional_center'

    return 'suburban'

def build_local_hint(slug: str, city_name: str, region: str, area_type: str) -> str:
    city = city_name

    if area_type == 'urban':
        return f'{city} gehört zu den größeren städtischen Standorten, daher ist eine digitale Abmeldung für viele besonders alltagstauglich.'
    if area_type == 'regional_center':
        return f'{city} ist für viele Menschen aus der Umgebung ein wichtiger regionaler Bezugspunkt, nicht nur für das direkte Stadtgebiet.'
    if area_type == 'rural':
        return f'Gerade rund um {city} möchten viele Fahrzeughalter zusätzliche Wege und Vor-Ort-Termine möglichst vermeiden.'
    return f'In {city} ist für viele vor allem ein klarer, einfacher und gut planbarer digitaler Ablauf wichtig.'

metadata = {}
for city_name, slug in city_entries:
    row = slug_to_row.get(slug)
    if not row:
        continue

    bl = row['bundesland']
    state = BL_NAMES.get(bl, bl)
    region = clean_region(row['behoerde_name'])
    area_type = infer_area_type(slug, region, state)
    local_hint = build_local_hint(slug, city_name, region, area_type)

    my_plz = get_plz_int(slug)
    siblings = bl_slugs.get(bl, [])
    if my_plz is not None:
        with_dist = []
        for other in siblings:
            if other == slug:
                continue
            op = get_plz_int(other)
            if op is not None:
                with_dist.append((abs(my_plz - op), other))
        with_dist.sort()
        nearby = [s for (_, s) in with_dist[:5]]
    else:
        nearby = [s for s in siblings if s != slug][:5]

    metadata[slug] = {
        'state': state,
        'region': region,
        'nearby': nearby,
        'areaType': area_type,
        'localHint': local_hint,
    }

def ts_str(s: str) -> str:
    return s.replace('\\', '\\\\').replace("'", "\\'")

lines = [
    '// AUTO-GENERATED — do not edit manually',
    '// Source: src/data/av1_2026_04_csv.csv + src/lib/city-slugs.ts',
    '// Run: python3 scripts/gen-city-metadata.py',
    '',
    "export type AreaType = 'urban' | 'suburban' | 'rural' | 'regional_center';",
    '',
    'export type CityMeta = {',
    '  state: string;',
    '  region: string;',
    '  nearby: string[];',
    '  areaType?: AreaType;',
    '  localHint?: string;',
    '};',
    '',
    'export const CITY_METADATA: Record<string, CityMeta> = {',
]

for slug in sorted(metadata.keys()):
    m = metadata[slug]
    nearby_str = ', '.join(f"'{ts_str(s)}'" for s in m['nearby'])
    lines.append(
        f"  '{ts_str(slug)}': {{ state: '{ts_str(m['state'])}', region: '{ts_str(m['region'])}', nearby: [{nearby_str}], areaType: '{ts_str(m['areaType'])}', localHint: '{ts_str(m['localHint'])}' }},"
    )

lines += [
    '};',
    '',
    'export function getCityMeta(slug: string): CityMeta | undefined {',
    '  return CITY_METADATA[slug];',
    '}',
    '',
]

OUT_PATH.write_text('\n'.join(lines), encoding='utf-8')
print(f'Wrote {OUT_PATH}')
print(f'Done — {len(metadata)} city metadata entries generated.')