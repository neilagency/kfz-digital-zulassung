#!/usr/bin/env tsx
/**
 * Production-only: fetch <main> from 10 URLs, normalize, Jaccard pairs,
 * structural h2 order, heuristic intro/FAQ/post splits.
 *
 * postUi (FAQ→nearby gap) only fills when stripped text contains "Noch Fragen"
 * before the nearby marker; on current live HTML this is often absent, so
 * post pairs are usually both empty → jaccardContent returns null (not 100%).
 */
import { getCityNameBySlug, getResolvedCitySlug } from '../src/lib/city-slugs';

const URLS = [
  'https://onlineautoabmelden.com/berlin-zulassungsstelle',
  'https://onlineautoabmelden.com/auto-online-abmelden-muenchen',
  'https://onlineautoabmelden.com/frankfurt',
  'https://onlineautoabmelden.com/duesseldorf',
  'https://onlineautoabmelden.com/karlsruhe',
  'https://onlineautoabmelden.com/kfz-online-abmelden-koeln',
  'https://onlineautoabmelden.com/aichtal',
  'https://onlineautoabmelden.com/soltau',
  'https://onlineautoabmelden.com/heinsberg',
  'https://onlineautoabmelden.com/weil-der-stadt',
];

const STOP = new Set(
  ['der', 'die', 'das', 'und', 'oder', 'ein', 'eine', 'einen', 'im', 'in', 'am', 'an', 'auf', 'aus', 'bei', 'mit', 'nach', 'von', 'zu', 'zur', 'zum', 'ist', 'sind', 'für', 'über'].map((w) => w.toLowerCase()),
);

function slugFromUrl(url: string): string {
  const p = new URL(url).pathname.replace(/^\//, '').replace(/\/$/, '');
  return getResolvedCitySlug(p) || p;
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
  return m ? m[1] : '';
}

function extractH2Sequence(mainHtml: string): string[] {
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const out: string[] = [];
  let m;
  while ((m = re.exec(mainHtml)) !== null) {
    const t = stripHtml(m[1]).replace(/\s+/g, ' ').trim();
    if (t.length > 2) out.push(t);
  }
  return out;
}

/** City + common variants from slug (substring replace for compound names). */
function cityTokensForSlug(slug: string, displayCity: string): string[] {
  const parts = slug.split('-').filter(Boolean);
  const title = parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const set = new Set<string>([displayCity, title]);
  if (displayCity.includes(' ')) {
    for (const w of displayCity.split(/\s+/)) if (w.length > 2) set.add(w);
  }
  return [...set];
}

function normalizeForCompare(raw: string, tokens: string[]): string {
  let t = raw.toLowerCase();
  for (const tok of tokens.sort((a, b) => b.length - a.length)) {
    if (tok.length < 3) continue;
    const esc = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(new RegExp(esc, 'gi'), ' city ');
  }
  t = t.replace(/\b\d{5}\b/g, ' plz ');
  t = t.replace(/\b\d{1,3}(?:[.,]\d{1,2})?\s*€\b/g, ' price ');
  t = t.replace(/\b\d+[.,]\d{2}\b/g, ' num ');
  t = t.replace(/\b\d{3,6}\b/g, ' num ');
  t = t.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  const parts = t.split(/\s+/).filter((w) => w.length > 0 && !STOP.has(w));
  return parts.join(' ');
}

function tokenize(norm: string): Set<string> {
  const s = new Set<string>();
  for (const w of norm.split(/\s+/)) if (w) s.add(w);
  return s;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const u = a.size + b.size - inter;
  return u === 0 ? 0 : inter / u;
}

/** Pairwise content Jaccard: two empty segments → null (exclude from segment averages). */
function jaccardContent(a: Set<string>, b: Set<string>): number | null {
  if (a.size === 0 && b.size === 0) return null;
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const u = a.size + b.size - inter;
  return u === 0 ? 0 : inter / u;
}

/** Proxy for “first visible content block” before FAQ: first N words of pre-FAQ text. */
function firstIntroBlockWords(rawIntro: string, maxWords: number): string {
  const w = rawIntro.trim().split(/\s+/).filter(Boolean);
  return w.slice(0, maxWords).join(' ');
}

function splitRegions(raw: string): { intro: string; faq: string; postUi: string; nearby: string } {
  const faqIdx = raw.search(/\bHäufige Fragen\b|\bFAQ\b|häufig gestellte fragen/i);
  const nearIdx = raw.search(
    /\b(Weitere Zulassungsstellen|Nachbarorte|Städte in der Nähe|Orte in der Nähe|Auch in diesen Städten)\b/i,
  );
  const helpIdx = raw.search(/\bNoch Fragen\b/i);

  if (faqIdx < 0) return { intro: raw.trim(), faq: '', postUi: '', nearby: '' };

  const intro = raw.slice(0, faqIdx).trim();
  let faq = '';
  let postUi = '';
  let nearby = '';

  if (nearIdx > faqIdx) {
    nearby = raw.slice(nearIdx).trim();
    if (helpIdx > faqIdx && helpIdx < nearIdx) {
      faq = raw.slice(faqIdx, helpIdx).trim();
      postUi = raw.slice(helpIdx, nearIdx).trim();
    } else {
      faq = raw.slice(faqIdx, nearIdx).trim();
    }
  } else {
    faq = raw.slice(faqIdx).trim();
  }
  return { intro, faq, postUi, nearby };
}

type PageData = {
  url: string;
  slug: string;
  city: string;
  rawMain: string;
  h2: string[];
  intro: string;
  faq: string;
  postUi: string;
  nearby: string;
  fullNorm: string;
  introNorm: string;
  /** First ~150 words of pre-FAQ main text (proxy for first content block). */
  introHeadNorm: string;
  faqNorm: string;
  postNorm: string;
  nearbyNorm: string;
};

async function fetchPage(url: string): Promise<PageData> {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; OAInternalSEOAudit/1.0)' },
  });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const html = await res.text();
  const mainHtml = extractMain(html);
  if (!mainHtml) throw new Error(`${url} → no <main>`);
  const rawMain = stripHtml(mainHtml);
  const slug = slugFromUrl(url);
  const city = getCityNameBySlug(slug) || slug.replace(/-/g, ' ');
  const tokens = cityTokensForSlug(slug, city);
  const { intro, faq, postUi, nearby } = splitRegions(rawMain);
  const h2 = extractH2Sequence(mainHtml);
  return {
    url,
    slug,
    city,
    rawMain,
    h2,
    intro,
    faq,
    postUi,
    nearby,
    fullNorm: normalizeForCompare(rawMain, tokens),
    introNorm: normalizeForCompare(intro, tokens),
    introHeadNorm: normalizeForCompare(firstIntroBlockWords(intro, 150), tokens),
    faqNorm: normalizeForCompare(faq, tokens),
    postNorm: normalizeForCompare(postUi, tokens),
    nearbyNorm: normalizeForCompare(nearby, tokens),
  };
}

function main() {
  void (async () => {
    const pages: PageData[] = [];
    for (const url of URLS) {
      pages.push(await fetchPage(url));
    }

    const n = pages.length;
    type PairM = {
      a: string;
      b: string;
      full: number;
      intro: number;
      introHead: number;
      faq: number;
      post: number | null;
      nearby: number | null;
    };
    const pairs: PairM[] = [];
    let sumFull = 0;
    let maxFull = 0;
    let sumIntro = 0;
    let sumIntroHead = 0;
    let sumFaq = 0;
    let sumPost = 0;
    let sumNearby = 0;
    let cPost = 0;
    let cNearby = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const A = pages[i]!;
        const B = pages[j]!;
        const full = jaccard(tokenize(A.fullNorm), tokenize(B.fullNorm));
        const intro = jaccard(tokenize(A.introNorm), tokenize(B.introNorm));
        const introHead = jaccard(tokenize(A.introHeadNorm), tokenize(B.introHeadNorm));
        const faq = jaccard(tokenize(A.faqNorm), tokenize(B.faqNorm));
        const post = jaccardContent(tokenize(A.postNorm), tokenize(B.postNorm));
        const nearby = jaccardContent(tokenize(A.nearbyNorm), tokenize(B.nearbyNorm));
        pairs.push({ a: A.slug, b: B.slug, full, intro, introHead, faq, post, nearby });
        sumFull += full;
        sumIntro += intro;
        sumIntroHead += introHead;
        sumFaq += faq;
        if (post !== null) {
          sumPost += post;
          cPost++;
        }
        if (nearby !== null) {
          sumNearby += nearby;
          cNearby++;
        }
        if (full > maxFull) maxFull = full;
      }
    }
    const pc = (n * (n - 1)) / 2;
    const avgFull = sumFull / pc;
    const avgIntro = sumIntro / pc;
    const avgIntroHead = sumIntroHead / pc;
    const avgFaq = sumFaq / pc;
    const avgPost = cPost > 0 ? sumPost / cPost : null;
    const avgNearby = cNearby > 0 ? sumNearby / cNearby : null;

    const byFull = [...pairs].sort((x, y) => y.full - x.full);
    const byDiff = [...pairs].sort((x, y) => x.full - y.full);

    const h2Sigs = pages.map((p) => p.h2.join(' → '));
    const uniqueH2 = new Set(h2Sigs);
    const structuralSame = uniqueH2.size === 1;

    const scores = pages.map((p) => {
      const others = pairs.filter((x) => x.a === p.slug || x.b === p.slug);
      const avg = others.reduce((s, x) => s + x.full, 0) / others.length;
      const mx = Math.max(...others.map((x) => x.full));
      const uniqueness = Math.round(10 * (1 - avg));
      const templateDep = Math.round(10 * avg);
      const clusterRisk = Math.round(10 * mx);
      return { slug: p.slug, uniqueness, templateDep, clusterRisk, avgWithOthers: avg };
    });

    console.log(
      JSON.stringify(
        {
          pages: n,
          pairs: pc,
          avgFull,
          maxFull,
          avgIntro_preFaq: avgIntro,
          avgIntro_first150Words: avgIntroHead,
          avgFaq: avgFaq,
          avgPost_faqToNearby: avgPost,
          avgNearby: avgNearby,
          postPairsWithBothEmpty: pc - cPost,
          nearbyPairsWithBothEmpty: pc - cNearby,
          structuralH2Variants: uniqueH2.size,
        },
        null,
        2,
      ),
    );

    console.log('\n=== TOP 5 MOST SIMILAR (full main, normalized) ===');
    const pct = (x: number | null) => (x === null ? 'n/a' : `${(x * 100).toFixed(1)}%`);
    byFull.slice(0, 5).forEach((r) =>
      console.log(
        `${r.a} ↔ ${r.b}  full=${(r.full * 100).toFixed(1)}% intro=${(r.intro * 100).toFixed(1)}% introHead=${(r.introHead * 100).toFixed(1)}% faq=${(r.faq * 100).toFixed(1)}% post=${pct(r.post)} nearby=${pct(r.nearby)}`,
      ),
    );

    console.log('\n=== TOP 5 MOST DIFFERENT ===');
    byDiff.slice(0, 5).forEach((r) => console.log(`${r.a} ↔ ${r.b}  full=${(r.full * 100).toFixed(1)}%`));

    console.log('\n=== PER-PAGE SCORES (0–10) ===');
    scores.forEach((s) =>
      console.log(
        `${s.slug}: uniqueness=${s.uniqueness} template_dependency=${s.templateDep} clustering_risk=${s.clusterRisk} (avg J vs others ${(s.avgWithOthers * 100).toFixed(1)}%)`,
      ),
    );

    console.log('\n=== H2 ORDER (first 12 per page) ===');
    pages.forEach((p) => {
      console.log(`\n[${p.slug}]`);
      p.h2.slice(0, 12).forEach((h, i) => console.log(`  ${i + 1}. ${h.slice(0, 100)}${h.length > 100 ? '…' : ''}`));
    });

    console.log('\n=== STRUCTURAL NOTE ===');
    console.log(
      structuralSame
        ? 'All pages share identical h2 sequence (same section order).'
        : `h2 sequence varies across ${uniqueH2.size} distinct pattern(s).`,
    );
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

main();
