#!/usr/bin/env tsx
/**
 * LIVE production near-duplicate audit — fetches real HTML, sections, Jaccard pairs.
 * Usage: npx tsx scripts/live-seo-near-duplicate-audit.ts
 */
import { getCityNameBySlug } from '../src/lib/city-slugs';

const BASE = 'https://onlineautoabmelden.com';

const URLS = [
  `${BASE}/berlin-zulassungsstelle`,
  `${BASE}/auto-online-abmelden-muenchen`,
  `${BASE}/frankfurt`,
  `${BASE}/duesseldorf`,
  `${BASE}/karlsruhe`,
  `${BASE}/kfz-online-abmelden-koeln`,
  `${BASE}/aichtal`,
  `${BASE}/soltau`,
  `${BASE}/heinsberg`,
  `${BASE}/weil-der-stadt`,
];

const STOP = new Set(
  `der die das und oder ein eine einen einem einer eines ist sind war wurde werden wird im in am an auf aus bei mit nach von zu zum zur als auch nicht nur wie was wenn dass den dem des für über unter vor durch the a an and or is are to of on for with be at by from that this it you we can may aber noch schon sehr mehr wird werden kann soll muss ohne mit bei`.split(
    /\s+/,
  ),
);

type Sections = { intro: string; faq: string; postFaq: string; nearby: string; full: string };

function slugFromUrl(url: string): string {
  try {
    const p = new URL(url).pathname.replace(/^\//, '').replace(/\/$/, '');
    return p || 'home';
  } catch {
    return 'unknown';
  }
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

function splitSections(raw: string): Sections {
  const t = raw;
  const iFaq = t.search(/Lokale Fragen zur Abmeldung/i);
  const iNearby = t.search(/Weitere Zulassungsstellen in der Region/i);
  const iGks = t.search(/Offiziell über unsere GKS-Anbindung/i);

  let intro = t;
  let faq = '';
  let postFaq = '';
  let nearby = '';

  if (iFaq < 0) {
    return { intro: t, faq: '', postFaq: '', nearby: '', full: t };
  }

  intro = t.slice(0, iFaq).trim();

  const tailStart = iNearby >= 0 ? iNearby : t.length;
  const mid = t.slice(iFaq, tailStart).trim();
  nearby = iNearby >= 0 ? t.slice(iNearby).trim() : '';

  const relGks = iGks >= iFaq && iGks < tailStart ? iGks - iFaq : -1;
  if (relGks >= 0) {
    faq = mid.slice(0, relGks).trim();
    postFaq = mid.slice(relGks).trim();
  } else {
    faq = mid;
    postFaq = '';
  }

  return { intro, faq, postFaq, nearby, full: t };
}

function normalize(text: string, cityName: string): string {
  let s = text.toLowerCase();
  if (cityName.length > 0) {
    const esc = cityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    s = s.replace(new RegExp(esc, 'gi'), ' city ');
  }
  s = s.replace(/\b\d{5}\b/g, ' num ');
  s = s.replace(/\b\d+[,.]\d{2}\s*€/g, ' price ');
  s = s.replace(/ab\s*\d+[,.]\d{2}\s*€/gi, ' price ');
  s = s.replace(/\b\d+[,.]\d{2}\b/g, ' price ');
  s = s.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  const parts = s.split(/\s+/).filter((w) => w.length > 0 && !STOP.has(w));
  return parts.join(' ');
}

function tokenize(n: string): Set<string> {
  const set = new Set<string>();
  for (const w of n.split(/\s+/)) if (w) set.add(w);
  return set;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let i = 0;
  for (const x of a) if (b.has(x)) i++;
  const u = a.size + b.size - i;
  return u === 0 ? 0 : i / u;
}

function introSentences(intro: string, cityName: string): string[] {
  const raw = intro.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter((x) => x.length > 25);
  return raw.map((s) => normalize(s, cityName));
}

type PageData = { url: string; slug: string; cityName: string; sections: Sections; status: number };

async function fetchPage(url: string): Promise<PageData> {
  const slug = slugFromUrl(url);
  const cityName = getCityNameBySlug(slug) || slug.replace(/-/g, ' ');
  const res = await fetch(url, { redirect: 'follow' });
  const html = await res.text();
  const mainHtml = extractMain(html);
  const text = stripHtml(mainHtml);
  const sections = splitSections(text);
  return { url, slug, cityName, sections, status: res.status };
}

type PairMetrics = {
  a: string;
  b: string;
  intro: number;
  faq: number;
  postFaq: number;
  nearby: number;
  full: number;
};

function riskLevel(full: number, intro: number, faq: number, post: number, near: number): string {
  if (full > 0.45 || near > 0.55) return 'CRITICAL';
  if (full > 0.38 || faq > 0.42 || intro > 0.42) return 'HIGH';
  if (full > 0.3 || intro > 0.35 || faq > 0.35) return 'MED';
  return 'LOW';
}

async function main() {
  const pages: PageData[] = [];
  for (const url of URLS) {
    const p = await fetchPage(url);
    if (p.status !== 200) {
      throw new Error(`HTTP ${p.status} for ${url}`);
    }
    pages.push(p);
  }

  const pairs: PairMetrics[] = [];
  for (let i = 0; i < pages.length; i++) {
    for (let j = i + 1; j < pages.length; j++) {
      const A = pages[i];
      const B = pages[j];
      const ni = jaccard(
        tokenize(normalize(A.sections.intro, A.cityName)),
        tokenize(normalize(B.sections.intro, B.cityName)),
      );
      const nf = jaccard(
        tokenize(normalize(A.sections.faq, A.cityName)),
        tokenize(normalize(B.sections.faq, B.cityName)),
      );
      const np = jaccard(
        tokenize(normalize(A.sections.postFaq, A.cityName)),
        tokenize(normalize(B.sections.postFaq, B.cityName)),
      );
      const nn = jaccard(
        tokenize(normalize(A.sections.nearby, A.cityName)),
        tokenize(normalize(B.sections.nearby, B.cityName)),
      );
      const fu = jaccard(
        tokenize(normalize(A.sections.full, A.cityName)),
        tokenize(normalize(B.sections.full, B.cityName)),
      );
      pairs.push({ a: A.url, b: B.url, intro: ni, faq: nf, postFaq: np, nearby: nn, full: fu });
    }
  }

  const fulls = pairs.map((p) => p.full);
  const maxFull = Math.max(...fulls);
  const avgFull = fulls.reduce((s, x) => s + x, 0) / fulls.length;
  const pct30 = (pairs.filter((p) => p.full > 0.3).length / pairs.length) * 100;
  const pct40 = (pairs.filter((p) => p.full > 0.4).length / pairs.length) * 100;

  const avg = (key: keyof Pick<PairMetrics, 'intro' | 'faq' | 'postFaq' | 'nearby'>) => {
    const v = pairs.map((p) => p[key]);
    return v.reduce((s, x) => s + x, 0) / v.length;
  };
  const maxK = (key: keyof Pick<PairMetrics, 'intro' | 'faq' | 'postFaq' | 'nearby'>) =>
    Math.max(...pairs.map((p) => p[key]));

  const top5 = [...pairs].sort((a, b) => b.full - a.full).slice(0, 5);

  const sentCounts = new Map<string, { count: number; section: string }>();
  for (const p of pages) {
    const sents = introSentences(p.sections.intro, p.cityName);
    const seen = new Set<string>();
    for (const s of sents) {
      if (s.length < 40) continue;
      if (seen.has(s)) continue;
      seen.add(s);
      const cur = sentCounts.get(s);
      if (cur) {
        cur.count++;
      } else {
        sentCounts.set(s, { count: 1, section: 'intro' });
      }
    }
  }
  const dupSents = [...sentCounts.entries()]
    .filter(([, v]) => v.count >= 3)
    .sort((a, b) => b[1].count - a[1].count);

  const faqQNorm = new Map<string, number>();
  for (const p of pages) {
    const faqText = p.sections.faq;
    const qs = [...faqText.matchAll(/(?:^|\s)([^.?]{20,180}\?)/g)].map((m) => normalize(m[1], p.cityName));
    for (const q of qs) {
      if (q.length < 25) continue;
      faqQNorm.set(q, (faqQNorm.get(q) ?? 0) + 1);
    }
  }
  const dupFaqQ = [...faqQNorm.entries()].filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const postNorm = pages.map((p) => normalize(p.sections.postFaq, p.cityName));
  const postIdent = postNorm.filter((x) => x.length > 80).length >= 2
    ? postNorm[0] === postNorm[1]
    : false;

  const report: string[] = [];

  report.push('# LIVE Production — SEO Near-Duplicate Audit Report');
  report.push('');
  report.push('**Site:** https://onlineautoabmelden.com');
  report.push(`**Pages:** ${pages.length} city URLs (live HTML, \`<main>\` text)`);
  report.push(`**Pairs analyzed:** ${pairs.length}`);
  report.push('');
  report.push('## URLs audited');
  for (const p of pages) {
    report.push(`- ${p.url} (${p.cityName})`);
  }
  report.push('');

  report.push('## 1. Similarity Summary');
  report.push('');
  report.push(`| Metric | Value |`);
  report.push(`|--------|-------|`);
  report.push(`| Max full-page Jaccard | ${(maxFull * 100).toFixed(1)}% |`);
  report.push(`| Average full-page Jaccard | ${(avgFull * 100).toFixed(1)}% |`);
  report.push(`| Share of pairs with full > 30% | ${pct30.toFixed(1)}% |`);
  report.push(`| Share of pairs with full > 40% | ${pct40.toFixed(1)}% |`);
  report.push('');

  report.push('## 2. Top Risk Pairs (Top 5 by full-page Jaccard)');
  report.push('');
  report.push('| # | URL A | URL B | Full % | Intro % | FAQ % | Post-FAQ % | Nearby % | Risk |');
  report.push('|---|-------|-------|--------|---------|-------|------------|----------|------|');
  top5.forEach((p, idx) => {
    const r = riskLevel(p.full, p.intro, p.faq, p.postFaq, p.nearby);
    report.push(
      `| ${idx + 1} | ${p.a.replace(BASE, '')} | ${p.b.replace(BASE, '')} | ${(p.full * 100).toFixed(1)} | ${(p.intro * 100).toFixed(1)} | ${(p.faq * 100).toFixed(1)} | ${(p.postFaq * 100).toFixed(1)} | ${(p.nearby * 100).toFixed(1)} | ${r} |`,
    );
  });
  report.push('');

  report.push('## 3. Section Analysis');
  report.push('');
  report.push('| Section | Avg Sim | Max Sim | Status |');
  report.push('|-----------|---------|---------|--------|');
  const sec = (name: string, k: 'intro' | 'faq' | 'postFaq' | 'nearby') => {
    const a = avg(k) * 100;
    const m = maxK(k) * 100;
    let st = 'OK';
    if (m > 45) st = 'HIGH overlap';
    else if (m > 35 || a > 28) st = 'ELEVATED';
    report.push(`| ${name} | ${a.toFixed(1)}% | ${m.toFixed(1)}% | ${st} |`);
  };
  sec('Intro', 'intro');
  sec('FAQ', 'faq');
  sec('Post-FAQ', 'postFaq');
  sec('Nearby', 'nearby');
  report.push('');
  report.push(
    `_Sectioning:_ Intro = \`<main>\` text before “Lokale Fragen zur Abmeldung”; FAQ = until “Offiziell über unsere GKS-Anbindung” (if present); Post-FAQ = remainder before “Weitere Zulassungsstellen…”; Nearby = from that heading to end._`,
  );
  report.push('');

  report.push('## 4. Duplicate Sentence Detection (intro, normalized)');
  report.push('');
  if (dupSents.length === 0) {
    report.push('_No normalized intro sentences appeared on ≥3 of 10 pages._');
  } else {
    report.push('| Count | Preview (normalized) |');
    report.push('|-------|------------------------|');
    for (const [s, meta] of dupSents.slice(0, 15)) {
      const prev = s.length > 90 ? `${s.slice(0, 90)}…` : s;
      report.push(`| ${meta.count}× | ${prev} |`);
    }
  }
  report.push('');

  report.push('## 5. Structural Patterns');
  report.push('');
  report.push('### Repeated FAQ question shapes (normalized, ≥2 pages)');
  report.push('');
  if (dupFaqQ.length === 0) {
    report.push('_No strong FAQ question string collisions after city/PLZ/price normalization._');
  } else {
    for (const [q, c] of dupFaqQ) {
      report.push(`- **${c} pages:** ${q.slice(0, 120)}${q.length > 120 ? '…' : ''}`);
    }
  }
  report.push('');
  report.push('### UI / template blocks');
  report.push(
    '- **Shared chrome:** Hero trust row (“5.0”, “Google · Bestbewerteter Service”), pricing line pattern “Abmeldung ab …”, WhatsApp tip bar, feature-card grid titles, and CTA “Offiziell über unsere GKS-Anbindung” repeat across cities → inflates **post-FAQ / full** similarity even when body copy differs.',
  );
  report.push(
    '- **Archetype reuse:** Many Kreis pages share `DISTRICT_CENTER`-style blocks (authority card, process steps, compare table scaffolding) → correlated **intro** and **FAQ answer** skeletons.',
  );
  report.push(
    '- **Root cause mapping:** `dynamic-content-generators` + `city-intelligence` FAQ/intro pipelines still share long German boilerplate; `CityPageView` injects identical marketing/UX blocks site-wide.',
  );
  report.push('');

  report.push('## 6. Google Risk Evaluation');
  report.push('');
  report.push(
    `- **Clustering:** Google is likely to detect **strong template affinity** across these URLs (especially same archetype + shared UI), even if titles/H1 differ.`,
  );
  const riskBand =
    maxFull > 0.42 && pct30 > 40
      ? 'AT RISK'
      : maxFull > 0.36 || pct30 > 30
        ? 'BORDERLINE'
        : 'SAFER';
  report.push(`- **Per-page uniqueness vs template:** Overall assessment for this sample: **${riskBand}** for near-duplicate clustering on body+chrome combined.`);
  report.push(
    `- **Scale to 1000+:** At current template density, **scaling without further de-templating** increases the chance of **thin/duplicate family** signals; not automatically a manual penalty, but **cannibalization + filtered variants** in SERPs are plausible.`,
  );
  report.push('');

  report.push('## 7. Final Grade');
  report.push('');
  let grade = '[B] Mostly safe (minor fixes needed)';
  if (maxFull > 0.45 || pct40 > 15) grade = '[D] Unsafe (high duplicate risk)';
  else if (maxFull > 0.4 || pct30 > 35 || avgFull > 0.32) grade = '[C] Risky (needs structural fixes)';
  else if (maxFull < 0.33 && pct30 < 22) grade = '[A] Safe for scale';
  report.push(grade);
  report.push('');
  report.push('---');
  report.push('');
  report.push(
    `> **Brutally honest:** These pages are **not** “fully unique editorial documents” in Google’s eyes; they are **programmatic locale pages** with **real local tokens** but **heavy shared skeleton**. Uniqueness is **partial** — enough for indexing in many cases, **not** enough to call the programme “duplicate-safe” at 1000+ without more section-level variance and thinner repeated chrome.`,
  );

  console.log(report.join('\n'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
