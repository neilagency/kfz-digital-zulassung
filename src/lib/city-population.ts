/**
 * City Population & Stadttyp Engine
 *
 * Maps city slugs to accurate population + Stadttyp classification.
 * Used to derive `areaType` for CityPageData — ensures factually correct
 * content framing (no "Großstadt" for a 40k Landkreis seat).
 *
 * Classification rules:
 *   hauptstadt  → Berlin, Stadtstaaten (Hamburg, Bremen)
 *   grossstadt  → pop > 100,000
 *   mittelstadt → pop 20,000–100,000
 *   kleinstadt  → pop < 20,000
 *   landkreis   → Kreisbehörde, covers surrounding district
 *
 * AreaType mapping:
 *   hauptstadt  → "urban"
 *   grossstadt  → "urban"
 *   mittelstadt → "suburban"
 *   kleinstadt  → "rural"
 *   landkreis   → "regional_center"
 *
 * Sources: Statistisches Bundesamt / Wikipedia 2023–2024 official figures.
 */

import type { AreaType } from './cityPageContent';

export type Stadttyp =
  | 'hauptstadt'
  | 'grossstadt'
  | 'mittelstadt'
  | 'kleinstadt'
  | 'landkreis';

export type CityPopEntry = {
  pop: number;
  stadttyp: Stadttyp;
};

// ─── POPULATION LOOKUP BY SLUG ────────────────────────────────────────────────
// Key: canonical city slug (as used in city-metadata.ts and [slug]/page.tsx)
// Value: official population + stadttyp classification
export const CITY_POPULATION: Record<string, CityPopEntry> = {
  // ── Bundeshauptstadt & Stadtstaaten ────────────────────────────────────────
  'berlin-zulassungsstelle':             { pop: 3_645_000, stadttyp: 'hauptstadt' },
  'kfz-online-abmelden-in-hamburg':      { pop: 1_906_000, stadttyp: 'hauptstadt' },
  'kfz-online-abmelden-bremen':          { pop:   563_000, stadttyp: 'hauptstadt' },

  // ── Großstädte > 100k ─────────────────────────────────────────────────────
  'auto-online-abmelden-muenchen':       { pop: 1_512_000, stadttyp: 'grossstadt' },
  'kfz-online-abmelden-koeln':           { pop: 1_084_000, stadttyp: 'grossstadt' },
  'kfz-online-abmelden-dortmund':        { pop:   587_000, stadttyp: 'grossstadt' },
  'zulassungsservice-stuttgart':         { pop:   634_000, stadttyp: 'grossstadt' },
  'duesseldorf':                         { pop:   620_000, stadttyp: 'grossstadt' },
  'duisburg':                            { pop:   501_000, stadttyp: 'grossstadt' },
  'zulassungsservice-nuernberg':         { pop:   515_000, stadttyp: 'grossstadt' },
  'nuernberg':                           { pop:   515_000, stadttyp: 'grossstadt' },
  'frankfurt':                           { pop:   764_000, stadttyp: 'grossstadt' },
  'auto-online-abmelden-in-bochum':      { pop:   365_000, stadttyp: 'grossstadt' },
  'auto-online-abmelden-in-wuppertal':   { pop:   355_000, stadttyp: 'grossstadt' },
  'zulassungsservice-bielefeld':         { pop:   334_000, stadttyp: 'grossstadt' },
  'bielefeld':                           { pop:   334_000, stadttyp: 'grossstadt' },
  'bonn':                                { pop:   334_000, stadttyp: 'grossstadt' },
  'zulassungsservice-muenster':          { pop:   316_000, stadttyp: 'grossstadt' },
  'muenster':                            { pop:   316_000, stadttyp: 'grossstadt' },
  'zulassungsservice-mannheim':          { pop:   314_000, stadttyp: 'grossstadt' },
  'mannheim':                            { pop:   314_000, stadttyp: 'grossstadt' },
  'karlsruhe':                           { pop:   308_000, stadttyp: 'grossstadt' },
  'augsburg':                            { pop:   296_000, stadttyp: 'grossstadt' },
  'wiesbaden':                           { pop:   281_000, stadttyp: 'grossstadt' },
  'zulassungsservice-wiesbaden':         { pop:   281_000, stadttyp: 'grossstadt' },
  'moenchengladbach':                    { pop:   261_000, stadttyp: 'grossstadt' },
  'zulassungsservice-moenchengladbach':  { pop:   261_000, stadttyp: 'grossstadt' },
  'auto-abmelden-online-in-gelsenkirchen': { pop: 262_000, stadttyp: 'grossstadt' },
  'magdeburg':                           { pop:   236_000, stadttyp: 'grossstadt' },
  'braunschweig':                        { pop:   249_000, stadttyp: 'grossstadt' },
  'aachen':                              { pop:   249_000, stadttyp: 'grossstadt' },
  'chemnitz':                            { pop:   247_000, stadttyp: 'grossstadt' },
  'zulassungsservice-chemnitz':          { pop:   247_000, stadttyp: 'grossstadt' },
  'halle-saale':                         { pop:   240_000, stadttyp: 'grossstadt' },
  'halle':                               { pop:   240_000, stadttyp: 'grossstadt' },
  'freiburg':                            { pop:   230_000, stadttyp: 'grossstadt' },
  'zulassungsservice-freiburg':          { pop:   230_000, stadttyp: 'grossstadt' },
  'krefeld':                             { pop:   226_000, stadttyp: 'grossstadt' },
  'mainz':                               { pop:   218_000, stadttyp: 'grossstadt' },
  'zulassungsservice-mainz':             { pop:   218_000, stadttyp: 'grossstadt' },
  'luebeck':                             { pop:   217_000, stadttyp: 'grossstadt' },
  'luebeck-zulassungsstelle':            { pop:   217_000, stadttyp: 'grossstadt' },
  'erfurt':                              { pop:   214_000, stadttyp: 'grossstadt' },
  'oberhausen':                          { pop:   211_000, stadttyp: 'grossstadt' },
  'zulassungsservice-oberhausen':        { pop:   211_000, stadttyp: 'grossstadt' },
  'rostock':                             { pop:   210_000, stadttyp: 'grossstadt' },
  'zulassungsservice-rostock':           { pop:   210_000, stadttyp: 'grossstadt' },
  'kassel':                              { pop:   204_000, stadttyp: 'grossstadt' },
  'potsdam':                             { pop:   183_000, stadttyp: 'grossstadt' },
  'hagen':                               { pop:   191_000, stadttyp: 'grossstadt' },
  'hamm':                                { pop:   180_000, stadttyp: 'grossstadt' },
  'saarbruecken':                        { pop:   176_000, stadttyp: 'grossstadt' },
  'ludwigshafen-am-rhein':               { pop:   173_000, stadttyp: 'grossstadt' },
  'ludwigshafen':                        { pop:   173_000, stadttyp: 'grossstadt' },
  'oldenburg':                           { pop:   168_000, stadttyp: 'grossstadt' },
  'leverkusen':                          { pop:   163_000, stadttyp: 'grossstadt' },
  'heidelberg':                          { pop:   161_000, stadttyp: 'grossstadt' },
  'solingen':                            { pop:   160_000, stadttyp: 'grossstadt' },
  'darmstadt':                           { pop:   160_000, stadttyp: 'grossstadt' },
  'neuss':                               { pop:   155_000, stadttyp: 'grossstadt' },
  'auto-online-abmelden-in-neuss':       { pop:   155_000, stadttyp: 'grossstadt' },
  'regensburg':                          { pop:   153_000, stadttyp: 'grossstadt' },
  'paderborn':                           { pop:   152_000, stadttyp: 'grossstadt' },
  'ingolstadt':                          { pop:   138_000, stadttyp: 'grossstadt' },
  'fuerth':                              { pop:   128_000, stadttyp: 'grossstadt' },
  'wolfsburg':                           { pop:   126_000, stadttyp: 'grossstadt' },
  'ulm':                                 { pop:   126_000, stadttyp: 'grossstadt' },
  'auto-online-abmelden-heilbronn':      { pop:   126_000, stadttyp: 'grossstadt' },
  'heilbronn':                           { pop:   126_000, stadttyp: 'grossstadt' },
  'pforzheim':                           { pop:   125_000, stadttyp: 'grossstadt' },
  'erlangen':                            { pop:   113_000, stadttyp: 'grossstadt' },
  'koblenz':                             { pop:   113_000, stadttyp: 'grossstadt' },
  'trier':                               { pop:   110_000, stadttyp: 'grossstadt' },
  'recklinghausen':                      { pop:   115_000, stadttyp: 'grossstadt' },
  'siegen':                              { pop:   101_000, stadttyp: 'grossstadt' },
  'cottbus':                             { pop:   101_000, stadttyp: 'grossstadt' },
  'hildesheim':                          { pop:   102_000, stadttyp: 'grossstadt' },
  'salzgitter':                          { pop:   101_000, stadttyp: 'grossstadt' },
  'moers':                               { pop:   104_000, stadttyp: 'grossstadt' },
  'goettingen':                          { pop:   118_000, stadttyp: 'grossstadt' },
  'remscheid':                           { pop:   109_000, stadttyp: 'grossstadt' },
  'offenbach':                           { pop:   130_000, stadttyp: 'grossstadt' },
  'zulassungsservice-augsburg':          { pop:   296_000, stadttyp: 'grossstadt' },
  'zulassungsservice-braunschweig':      { pop:   249_000, stadttyp: 'grossstadt' },
  'kfz-online-abmelden-essen':           { pop:   590_000, stadttyp: 'grossstadt' },
  'auto-online-abmelden-landshut':       { pop:    79_000, stadttyp: 'mittelstadt' },
  'auto-online-abmelden-muenchen-2':     { pop: 1_512_000, stadttyp: 'grossstadt' },
  'leipzig':                             { pop:   620_000, stadttyp: 'grossstadt' },
  'dresden-kfz-zulassungsstelle':        { pop:   556_000, stadttyp: 'grossstadt' },
  'auto-online-abmelden-pfullendorf':    { pop:    13_000, stadttyp: 'kleinstadt' },
  'auto-online-abmelden-in-kuenzelsau':  { pop:    14_000, stadttyp: 'kleinstadt' },
  'auto-online-abmelden-in-laichingen':  { pop:    12_000, stadttyp: 'kleinstadt' },
  'auto-online-abmelden-in-neumarkt-in-der-oberpfalz': { pop: 42_000, stadttyp: 'mittelstadt' },
  'zulassungsservice-hannover':          { pop:   532_000, stadttyp: 'grossstadt' },
  'hannover':                            { pop:   532_000, stadttyp: 'grossstadt' },

  // ── Mittelstädte 20k–100k ─────────────────────────────────────────────────
  'weimar':         { pop:  66_000, stadttyp: 'mittelstadt' },
  'passau':         { pop:  53_000, stadttyp: 'mittelstadt' },
  'bamberg':        { pop:  77_000, stadttyp: 'mittelstadt' },
  'bayreuth':       { pop:  74_000, stadttyp: 'mittelstadt' },
  'ansbach':        { pop:  41_000, stadttyp: 'mittelstadt' },
  'aschaffenburg':  { pop:  70_000, stadttyp: 'mittelstadt' },
  'amberg':         { pop:  42_000, stadttyp: 'mittelstadt' },
  'landshut':       { pop:  79_000, stadttyp: 'mittelstadt' },
  'rosenheim':      { pop:  64_000, stadttyp: 'mittelstadt' },
  'albstadt':       { pop:  43_000, stadttyp: 'mittelstadt' },
  'kempten':        { pop:  68_000, stadttyp: 'mittelstadt' },
  'memmingen':      { pop:  44_000, stadttyp: 'mittelstadt' },
  'schweinfurt':    { pop:  52_000, stadttyp: 'mittelstadt' },
  'wuerzburg':      { pop: 128_000, stadttyp: 'grossstadt' },
  'norderstedt':    { pop:  77_000, stadttyp: 'mittelstadt' },
  'reutlingen':     { pop: 116_000, stadttyp: 'grossstadt' },
  'flensburg':      { pop:  89_000, stadttyp: 'mittelstadt' },
  'lueneburg':      { pop:  77_000, stadttyp: 'mittelstadt' },
  'wilhelmshaven':  { pop:  76_000, stadttyp: 'mittelstadt' },
  'trossingen':     { pop:  15_000, stadttyp: 'kleinstadt' },
  'rastatt':        { pop:  50_000, stadttyp: 'mittelstadt' },
  'bregenz':        { pop:  31_000, stadttyp: 'mittelstadt' }, // Austrian city, edge case
  'arnsberg':       { pop:  73_000, stadttyp: 'mittelstadt' },
  'iserlohn':       { pop:  94_000, stadttyp: 'mittelstadt' },
  'velbert':        { pop:  80_000, stadttyp: 'mittelstadt' },
  'viersen':        { pop:  76_000, stadttyp: 'mittelstadt' },
  'herford':        { pop:  66_000, stadttyp: 'mittelstadt' },
  'minden':         { pop:  81_000, stadttyp: 'mittelstadt' },
  'guetersloh':     { pop: 100_000, stadttyp: 'mittelstadt' },
  'detmold':        { pop:  73_000, stadttyp: 'mittelstadt' },
  'luedenscheid':   { pop:  73_000, stadttyp: 'mittelstadt' },
  'witten':         { pop:  99_000, stadttyp: 'mittelstadt' },
  'marl':           { pop:  83_000, stadttyp: 'mittelstadt' },
  'castrop-rauxel': { pop:  72_000, stadttyp: 'mittelstadt' },
  'oberhavel':      { pop: 211_000, stadttyp: 'landkreis' },
  'barnim':         { pop: 188_000, stadttyp: 'landkreis' },
  'jena':           { pop: 110_000, stadttyp: 'grossstadt' },
  'erfurt-2':       { pop: 214_000, stadttyp: 'grossstadt' },
  'gera':           { pop:  94_000, stadttyp: 'mittelstadt' },
  'zwickau':        { pop:  88_000, stadttyp: 'mittelstadt' },
  'goerlitz':       { pop:  56_000, stadttyp: 'mittelstadt' },
  'apolda':         { pop:  21_000, stadttyp: 'mittelstadt' },
  'arnstadt':       { pop:  25_000, stadttyp: 'mittelstadt' },
  'bad-salzungen':  { pop:  16_000, stadttyp: 'kleinstadt' },
  'eisenach':       { pop:  42_000, stadttyp: 'mittelstadt' },
  'nordhausen':     { pop:  41_000, stadttyp: 'mittelstadt' },
  'saalfeld':       { pop:  26_000, stadttyp: 'mittelstadt' },
  'pfarrkirchen':   { pop:  12_000, stadttyp: 'kleinstadt' },
  'hauzenberg':     { pop:  11_000, stadttyp: 'kleinstadt' },
  'pocking':        { pop:  14_000, stadttyp: 'kleinstadt' },
  'freyung':        { pop:   7_000, stadttyp: 'kleinstadt' },
  'regen':          { pop:   8_000, stadttyp: 'kleinstadt' },
  'bogen':          { pop:   9_000, stadttyp: 'kleinstadt' },
  'starnberg':      { pop:  24_000, stadttyp: 'mittelstadt' },
  'fuerstenfeldbruck': { pop: 38_000, stadttyp: 'mittelstadt' },
  'weilheim':       { pop:  21_000, stadttyp: 'mittelstadt' },
  'meerbusch':      { pop:  55_000, stadttyp: 'mittelstadt' },
  'mettmann':       { pop:  38_000, stadttyp: 'mittelstadt' },
  'juelich':        { pop:  32_000, stadttyp: 'mittelstadt' },
  'dueren':         { pop: 100_000, stadttyp: 'mittelstadt' },

  // ── Landkreise (county-level authorities) ─────────────────────────────────
  // These pages represent the Landkreis authority, not just the city
  'heinsberg':               { pop:  41_000, stadttyp: 'landkreis' },  // LK Heinsberg ~255k
  'alb-donau-kreis':         { pop: 193_000, stadttyp: 'landkreis' },
  'anhalt-bitterfeld':       { pop: 155_000, stadttyp: 'landkreis' },
  'altenburger-land':        { pop:  88_000, stadttyp: 'landkreis' },
  'ammerland':               { pop: 124_000, stadttyp: 'landkreis' },
  'aichach':                 { pop: 136_000, stadttyp: 'landkreis' },
  'altoetting':              { pop: 110_000, stadttyp: 'landkreis' },
  'augsburg-landkreis':      { pop: 263_000, stadttyp: 'landkreis' },
  'aurich':                  { pop: 189_000, stadttyp: 'landkreis' },
  'bad-kissingen':           { pop:  99_000, stadttyp: 'landkreis' },
  'barntrup':                { pop:  11_000, stadttyp: 'kleinstadt' },
  'weimarer-land':           { pop:  79_000, stadttyp: 'landkreis' },
  'ilm-kreis':               { pop: 107_000, stadttyp: 'landkreis' },
  'hochsauerlandkreis':      { pop: 262_000, stadttyp: 'landkreis' },
  'lippe':                   { pop: 344_000, stadttyp: 'landkreis' },
  'landkreis-ansbach':       { pop: 182_000, stadttyp: 'landkreis' },
  'landkreis-augsburg':      { pop: 263_000, stadttyp: 'landkreis' },
  'landkreis-bad-kissingen': { pop:  99_000, stadttyp: 'landkreis' },
  'oberbergischer-kreis':    { pop: 272_000, stadttyp: 'landkreis' },
  'rhein-kreis-neuss':       { pop: 453_000, stadttyp: 'landkreis' },
  'siegen-wittgenstein':     { pop: 277_000, stadttyp: 'landkreis' },
  'warendorf':               { pop: 278_000, stadttyp: 'landkreis' },
  'hochsauerlandkreis-2':    { pop: 262_000, stadttyp: 'landkreis' },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * Detect if a Behörde name indicates a Landkreis authority.
 * Used as fallback when slug isn't in the explicit lookup.
 */
export function isLandkreisBehoerde(behoerdeName?: string): boolean {
  if (!behoerdeName) return false;
  const n = behoerdeName.toLowerCase();
  return (
    n.startsWith('lra ') ||
    n.startsWith('lk ') ||
    n.startsWith('landkreis ') ||
    n.includes('landratsamt') ||
    n.includes('kreisverwaltung') ||
    /\blra\b/.test(n) ||
    /\blk\b/.test(n)
  );
}

/**
 * Convert Stadttyp to AreaType for content engine.
 */
export function stadtTypToAreaType(stadttyp: Stadttyp): AreaType {
  switch (stadttyp) {
    case 'hauptstadt':
    case 'grossstadt':
      return 'urban';
    case 'mittelstadt':
      return 'suburban';
    case 'kleinstadt':
      return 'rural';
    case 'landkreis':
      return 'regional_center';
  }
}

/**
 * Derive AreaType for a city page.
 *
 * Priority order:
 * 1. Explicit slug entry in CITY_POPULATION
 * 2. Behörde name contains Landkreis indicators → regional_center
 * 3. Default → suburban (safe mid-tier fallback; avoids false "Großstadt" claims)
 */
export function deriveAreaType(slug: string, behoerdeName?: string): AreaType {
  const entry = CITY_POPULATION[slug];
  if (entry) return stadtTypToAreaType(entry.stadttyp);

  if (isLandkreisBehoerde(behoerdeName)) return 'regional_center';

  // Default to suburban — never defaults to urban, preventing "Großstadt" errors
  return 'suburban';
}

/**
 * Get Stadttyp string for use in content templates.
 * Returns human-readable German label.
 */
export function getStadttypLabel(slug: string, behoerdeName?: string): string {
  const entry = CITY_POPULATION[slug];
  if (entry) {
    switch (entry.stadttyp) {
      case 'hauptstadt':  return 'Bundeshauptstadt';
      case 'grossstadt':  return 'Großstadt';
      case 'mittelstadt': return 'Stadt';
      case 'kleinstadt':  return 'Kleinstadt';
      case 'landkreis':   return 'Landkreis';
    }
  }
  if (isLandkreisBehoerde(behoerdeName)) return 'Landkreis';
  return 'Stadt';
}
