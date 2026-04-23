#!/usr/bin/env tsx
/**
 * SEO Similarity Audit — pre-deploy gate (Google-ish Jaccard on normalized text)
 *
 * Modes:
 *   local (default) — buildCityPageModel; gate `full` = intro + FAQ + nearbyIntro only.
 *     Extended metrics (intro+FAQ+nearby + section bodies + hero) print in local mode as `fullExtended`.
 *   live — fetch HTML, extract <main>, strip tags (`full` = main text; `fullExtended` = same)
 *
 * Env:
 *   SEO_AUDIT_MODE=local|live
 *   SEO_AUDIT_SLUGS=slug1,slug2,...   (local; default: 10 test cities)
 *   SEO_AUDIT_URLS=url1,url2,...      (live; full page URLs)
 *   SEO_AUDIT_MAX_FULL_JACCARD        (default 0.55) — fail if any pair gate-full Jaccard exceeds this
 *   SEO_AUDIT_MAX_AVG_FULL_JACCARD    (default 0.38) — fail if average gate-full Jaccard exceeds this
 *   SEO_AUDIT_MAX_PAIRS_FULL_ABOVE_030 (default 20) — fail if more than this many pairs have gate-full > 0.30
 *   SEO_AUDIT_GATE_EXTENDED=1       — also fail on extended-corpus thresholds (same env keys with Ex suffix planned off)
 *
 * Usage:
 *   npx tsx scripts/seo-similarity-audit.ts
 */

import { buildCityModelInputForSlug } from '../src/lib/city-model-input';
import { buildCityPageModel, type CityPageModel } from '../src/lib/city-intelligence';

/** Body copy used for extended “full page” similarity (local mode). */
function flattenBodySections(model: CityPageModel): string {
  const s = model.sections;
  const h = model.hero;
  const parts: string[] = [
    h.summary,
    h.detail,
    s.benefits.heading,
    s.benefits.intro,
    ...s.benefits.items,
    s.preparation.heading,
    ...s.preparation.paragraphs,
    s.trust.heading,
    ...s.trust.paragraphs,
    s.documents.heading,
    s.documents.intro,
    ...s.documents.items,
    s.process.heading,
    s.process.intro,
    ...s.process.steps,
    s.compare.heading,
    s.compare.intro,
    s.compare.note,
    s.target.heading,
    s.target.intro,
    s.target.actionText,
    ...s.target.items,
    s.local.heading,
    s.local.intro,
    ...s.local.paragraphs,
    s.local.alternativeText,
    s.note.heading,
    ...s.note.paragraphs,
    s.cta.heading,
    s.cta.text,
  ];
  return parts.filter(Boolean).join('\n');
}

// ─── Stopwords (DE + generic) — small deterministic list ───────────────────
const STOP = new Set(
  [
    'der', 'die', 'das', 'und', 'oder', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
    'ist', 'sind', 'war', 'wurde', 'werden', 'wird', 'im', 'in', 'am', 'an', 'auf', 'aus',
    'bei', 'mit', 'nach', 'von', 'zu', 'zum', 'zur', 'als', 'auch', 'nicht', 'nur', 'wie',
    'was', 'wenn', 'dass', 'den', 'dem', 'des', 'für', 'über', 'unter', 'vor', 'durch',
    'the', 'a', 'an', 'and', 'or', 'is', 'are', 'to', 'of', 'in', 'on', 'for', 'with',
    'be', 'as', 'at', 'by', 'from', 'that', 'this', 'it', 'you', 'we', 'can', 'may',
  ].map((w) => w.toLowerCase()),
);

const DEFAULT_SLUGS = [
  'berlin-zulassungsstelle',
  'kfz-online-abmelden-in-hamburg',
  'auto-online-abmelden-muenchen',
  'kfz-online-abmelden-koeln',
  'frankfurt-am-main',
  'karlsruhe',
  'krefeld',
  'aichtal',
  'aachen',
  'duesseldorf',
];

type PageSections = {
  id: string;
  /** Used only to strip city-specific tokens in normalize (local slugs). */
  cityName: string;
  intro: string;
  faq: string;
  nearby: string;
  /** Gate corpus (same as original audit): intro + FAQ + nearby only. */
  full: string;
  /** Optional wider corpus for reporting: sections + hero (local mode). */
  fullExtended: string;
};

/** Lowercase, PLZ→num, city→city token, strip punctuation, stopwords, collapse space */
export function normalize(text: string, cityName: string): string {
  let t = text.toLowerCase();
  const cityEsc = cityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (cityEsc.length > 0) {
    t = t.replace(new RegExp(cityEsc, 'gi'), ' city ');
  }
  t = t.replace(/\b\d{5}\b/g, ' num ');
  t = t.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  const parts = t.split(/\s+/).filter((w) => w.length > 0 && !STOP.has(w));
  return parts.join(' ');
}

export function tokenize(text: string): Set<string> {
  const s = new Set<string>();
  for (const w of text.split(/\s+/)) {
    if (w) s.add(w);
  }
  return s;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) {
    if (b.has(x)) inter++;
  }
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function buildLocalPage(slug: string): PageSections {
  const { input, cityName } = buildCityModelInputForSlug(slug.trim());
  const model = buildCityPageModel(input);
  const intro = model.content.intro.join('\n');
  const faq = model.content.faq.map((f) => `${f.q}\n${f.a}`).join('\n\n');
  const nearby = model.content.nearbyIntro || '';
  const sectionsBlob = flattenBodySections(model);
  const full = `${intro}\n\n${faq}\n\n${nearby}`;
  const fullExtended = `${full}\n\n${sectionsBlob}`;
  return { id: input.slug, cityName, intro, faq, nearby, full, fullExtended };
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMain(html: string): string {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : html;
}

async function fetchLivePage(url: string): Promise<{ id: string; raw: string }> {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  const main = extractMain(html);
  return { id: url, raw: stripHtml(main) };
}

/** Heuristic: split live blob into intro / faq / nearby by FAQ heading if present */
function splitLiveBlob(raw: string): PageSections {
  const faqIdx = raw.search(/\bFAQ\b|Häufige Fragen|häufig gestellte Fragen/i);
  const nearIdx = raw.search(
    /\b(Nachbarorte|Städte in der Nähe|Orte in der Nähe|in der Umgebung)\b/i,
  );
  let intro = raw;
  let faq = '';
  let nearby = '';
  if (faqIdx >= 0) {
    intro = raw.slice(0, faqIdx).trim();
    const afterFaq = nearIdx > faqIdx ? raw.slice(faqIdx, nearIdx) : raw.slice(faqIdx);
    faq = afterFaq.trim();
    if (nearIdx > faqIdx) nearby = raw.slice(nearIdx).trim();
  } else {
    intro = raw;
  }
  const full = raw;
  return { id: '', cityName: '', intro, faq, nearby, full, fullExtended: full };
}

function pairRisk(intro: number, faq: number, nearby: number, full: number): string {
  const bits: string[] = [];
  if (full > 0.4) bits.push('HIGH');
  else if (full >= 0.3) bits.push('MEDIUM');
  else bits.push('OK');
  if (intro > 0.35) bits.push('FLAG:intro');
  if (faq > 0.35) bits.push('FLAG:faq');
  if (nearby > 0.5) bits.push('CRITICAL:nearby');
  return bits.join('+');
}

function pct(x: number): string {
  return `${(x * 100).toFixed(1)}%`;
}

/** Same as normalize but no city token (cross-page boilerplate fingerprint). */
function normalizeForDedup(text: string): string {
  return normalize(text, '');
}

/** Bonus: normalized sentences appearing in 3+ pages */
function auditRepeatedSentences(pages: PageSections[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const p of pages) {
    const blob = `${p.intro}\n${p.faq}\n${p.nearby}`;
    const sents = blob.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 20);
    const seen = new Set<string>();
    for (const s of sents) {
      const n = normalizeForDedup(s);
      if (n.length < 12) continue;
      if (seen.has(n)) continue;
      seen.add(n);
      counts.set(n, (counts.get(n) ?? 0) + 1);
    }
  }
  return new Map([...counts.entries()].filter(([, c]) => c >= 3));
}

async function main() {
  const mode = (process.env.SEO_AUDIT_MODE || 'local').toLowerCase();
  let pages: PageSections[] = [];

  if (mode === 'live') {
    const urls = (process.env.SEO_AUDIT_URLS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (urls.length < 2) {
      console.error('SEO_AUDIT_MODE=live requires SEO_AUDIT_URLS with at least 2 comma-separated URLs');
      process.exit(1);
    }
    for (const url of urls) {
      const { id, raw } = await fetchLivePage(url);
      const split = splitLiveBlob(raw);
      split.id = id;
      split.cityName = '';
      split.fullExtended = split.full;
      pages.push(split);
    }
  } else {
    const slugs = (process.env.SEO_AUDIT_SLUGS || DEFAULT_SLUGS.join(','))
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (slugs.length < 2) {
      console.error('Need at least 2 slugs in SEO_AUDIT_SLUGS');
      process.exit(1);
    }
    for (const slug of slugs) {
      pages.push(buildLocalPage(slug));
    }
  }

  type PairRow = {
    a: string;
    b: string;
    intro: number;
    faq: number;
    nearby: number;
    full: number;
    fullExtended: number;
    risk: string;
  };

  const rows: PairRow[] = [];
  let maxFull = 0;
  let sumFull = 0;
  let maxFullEx = 0;
  let sumFullEx = 0;
  let pairCount = 0;
  let above030 = 0;
  let above030Ex = 0;

  for (let i = 0; i < pages.length; i++) {
    for (let j = i + 1; j < pages.length; j++) {
      const A = pages[i];
      const B = pages[j];
      const na = normalize(A.intro, A.cityName);
      const nb = normalize(B.intro, B.cityName);
      const nfa = normalize(A.faq, A.cityName);
      const nfb = normalize(B.faq, B.cityName);
      const nneara = normalize(A.nearby, A.cityName);
      const nnearb = normalize(B.nearby, B.cityName);
      const nfulla = normalize(A.full, A.cityName);
      const nfullb = normalize(B.full, B.cityName);
      const nfullExA = normalize(A.fullExtended, A.cityName);
      const nfullExB = normalize(B.fullExtended, B.cityName);

      const intro = jaccard(tokenize(na), tokenize(nb));
      const faq = jaccard(tokenize(nfa), tokenize(nfb));
      const nearby = jaccard(tokenize(nneara), tokenize(nnearb));
      const full = jaccard(tokenize(nfulla), tokenize(nfullb));
      const fullExtended = jaccard(tokenize(nfullExA), tokenize(nfullExB));

      const risk = pairRisk(intro, faq, nearby, full);
      rows.push({
        a: A.id,
        b: B.id,
        intro,
        faq,
        nearby,
        full,
        fullExtended,
        risk,
      });
      pairCount++;
      sumFull += full;
      sumFullEx += fullExtended;
      if (full > maxFull) maxFull = full;
      if (fullExtended > maxFullEx) maxFullEx = fullExtended;
      if (full > 0.3) above030++;
      if (fullExtended > 0.3) above030Ex++;
    }
  }

  const avgFull = pairCount ? sumFull / pairCount : 0;
  const avgFullEx = pairCount ? sumFullEx / pairCount : 0;
  const frac030 = pairCount ? above030 / pairCount : 0;
  const frac030Ex = pairCount ? above030Ex / pairCount : 0;
  const gateExtended = (process.env.SEO_AUDIT_GATE_EXTENDED || '').toLowerCase() === '1' || process.env.SEO_AUDIT_GATE_EXTENDED === 'true';

  const maxFullLimit = Number(process.env.SEO_AUDIT_MAX_FULL_JACCARD ?? '0.55');
  const maxAvgFullLimit = Number(process.env.SEO_AUDIT_MAX_AVG_FULL_JACCARD ?? '0.38');
  const maxPairsAbove030 = Number(process.env.SEO_AUDIT_MAX_PAIRS_FULL_ABOVE_030 ?? '20');

  console.log('\n━━ SEO Similarity Audit ━━');
  console.log(`Mode: ${mode} | Pages: ${pages.length} | Pairs: ${pairCount}\n`);

  const w = [36, 9, 9, 10, 9, 26];
  const line = (cells: string[]) =>
    cells.map((c, i) => (c.length > w[i] ? c.slice(0, w[i] - 1) + '…' : c.padEnd(w[i]))).join(' | ');
  console.log(line(['Pair', 'Intro %', 'FAQ %', 'Nearby %', 'Full %', 'Risk']));
  console.log(w.map((n) => '-'.repeat(n)).join('-+-'));

  for (const r of rows) {
    console.log(line([`${r.a} ↔ ${r.b}`, pct(r.intro), pct(r.faq), pct(r.nearby), pct(r.full), r.risk]));
  }

  const riskyPairs = rows.filter((r) => r.full > 0.3 || r.intro > 0.35 || r.faq > 0.35 || r.nearby > 0.5);

  console.log('\n── Summary ──');
  console.log(
    `Gate limits: max pair FULL ≤ ${pct(maxFullLimit)} | avg FULL ≤ ${pct(maxAvgFullLimit)} | pairs FULL>30% ≤ ${maxPairsAbove030}`,
  );
  console.log(`Max full Jaccard (intro+FAQ+nearby, gate): ${pct(maxFull)}`);
  console.log(`Avg full Jaccard (gate): ${pct(avgFull)}`);
  console.log(`Pairs with full > 30% (gate): ${above030} / ${pairCount} (${pct(frac030)})`);
  console.log(
    `\n── Extended corpus (gate + section bodies + hero; ${mode === 'live' ? 'N/A live' : 'local only'}) ──`,
  );
  if (mode !== 'live') {
    console.log(`Max extended Jaccard: ${pct(maxFullEx)}`);
    console.log(`Avg extended Jaccard: ${pct(avgFullEx)}`);
    console.log(`Pairs with extended > 30%: ${above030Ex} / ${pairCount} (${pct(frac030Ex)})`);
    console.log(`Gate on extended: ${gateExtended ? 'ON (SEO_AUDIT_GATE_EXTENDED=1)' : 'OFF'}`);
  }
  console.log(`Flagged pairs (intro>35% OR faq>35% OR nearby>50% OR full>30%): ${riskyPairs.length}`);

  const dupSents = auditRepeatedSentences(pages);
  if (dupSents.size > 0) {
    console.log('\n── Repeated normalized sentences (≥3 pages) ──');
    for (const [s, c] of [...dupSents.entries()].slice(0, 15)) {
      console.log(`  [${c}×] ${s.slice(0, 100)}${s.length > 100 ? '…' : ''}`);
    }
    if (dupSents.size > 15) console.log(`  … and ${dupSents.size - 15} more`);
  }

  const anyFullAboveMax = rows.some((r) => r.full > maxFullLimit);
  const anyFullExAbove55 = rows.some((r) => r.fullExtended > 0.55);
  const failOnExtended =
    gateExtended && (anyFullExAbove55 || above030Ex > maxPairsAbove030 || avgFullEx > maxAvgFullLimit);
  let fail = false;
  let reason = '';
  if (failOnExtended) {
    fail = true;
    reason =
      'Extended corpus gate failed (SEO_AUDIT_GATE_EXTENDED=1): max fullExtended > 55%, or too many pairs >30%, or avg too high.';
  } else if (anyFullAboveMax) {
    fail = true;
    reason = `At least one pair has gate FULL Jaccard > ${pct(maxFullLimit)}.`;
  } else if (avgFull > maxAvgFullLimit) {
    fail = true;
    reason = `Average gate FULL Jaccard ${pct(avgFull)} exceeds limit ${pct(maxAvgFullLimit)}.`;
  } else if (above030 > maxPairsAbove030) {
    fail = true;
    reason = `Too many pairs (${above030}) have gate FULL > 30% (max allowed ${maxPairsAbove030}).`;
  }

  if (fail) {
    console.error(`\n❌ SEO AUDIT FAIL: ${reason}\n`);
    process.exit(1);
  }
  console.log('\n✅ SEO audit passed thresholds.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
