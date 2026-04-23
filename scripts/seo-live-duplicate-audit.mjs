#!/usr/bin/env node
/**
 * One-off: live production SEO near-duplicate audit (10 URLs).
 * Run: node scripts/seo-live-duplicate-audit.mjs
 */
const BASE = 'https://onlineautoabmelden.com';
const URLS = [
  `${BASE}/berlin-zulassungsstelle`,
  `${BASE}/kfz-online-abmelden-in-hamburg`,
  `${BASE}/auto-online-abmelden-muenchen`,
  `${BASE}/kfz-online-abmelden-koeln`,
  `${BASE}/frankfurt`,
  `${BASE}/karlsruhe`,
  `${BASE}/krefeld`,
  `${BASE}/aichtal`,
  `${BASE}/aachen`,
  `${BASE}/duesseldorf`,
];

const STOP = new Set(
  `der die das und oder ein eine einen einem einer eines ist sind war wurde werden wird im in am an auf aus bei mit nach von zu zum zur als auch nicht nur wie was wenn dass den dem des für über unter vor durch`.split(' '),
);

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : '';
}

const SLUG_CITIES = {
  'berlin-zulassungsstelle': 'Berlin',
  'kfz-online-abmelden-in-hamburg': 'Hamburg',
  'auto-online-abmelden-muenchen': 'München',
  'kfz-online-abmelden-koeln': 'Köln',
  frankfurt: 'Frankfurt am Main',
  karlsruhe: 'Karlsruhe',
  krefeld: 'Krefeld',
  aichtal: 'Aichtal',
  aachen: 'Aachen',
  duesseldorf: 'Düsseldorf',
};

function cityFromPath(url) {
  const path = new URL(url).pathname.replace(/\/$/, '');
  const seg = path.split('/').filter(Boolean).pop() || '';
  return SLUG_CITIES[seg] || seg.replace(/-/g, ' ');
}

/**
 * @param {string} text
 * @param {string} cityName
 */
function normalize(text, cityName) {
  let t = text.toLowerCase();
  if (cityName && cityName.length > 2) {
    const cityEsc = cityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(new RegExp(cityEsc, 'gi'), ' city ');
  }
  t = t.replace(/\b\d{5}\b/g, ' num ');
  t = t.replace(/\b\d{1,2}[.,]\d{2}\s*€/g, ' price ');
  t = t.replace(/€\s*\d+[.,]?\d*/g, ' price ');
  t = t.replace(/ab\s*\d+[.,]?\d*\s*€/gi, ' price ');
  t = t.replace(/\b19[,.]7[0-9]\b/g, ' price ');
  t = t.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  const parts = t.split(/\s+/).filter((w) => w.length > 0 && !STOP.has(w));
  return parts.join(' ');
}

function tokenize(n) {
  return new Set(n.split(/\s+/).filter(Boolean));
}

function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const u = a.size + b.size - inter;
  return u ? inter / u : 0;
}

/** Split main text: intro / faq / postFaq / nearby (production layout). */
function splitSections(raw) {
  const postStartRe =
    /(Offiziell\s*&\s*rechtssicher|BESTER PREIS|FIXPREIS|KOMPLETT INKLUSIVE|KOMPLETT INKL)/i;
  const nearRe =
    /(Weitere Zulassungsstellen|Regionale Zulassungsstellen|Städte & Orte in Ihrer Nähe)/i;
  const faqStartRe = /\b(Lokale Fragen|Typische Fragen|Zuständigkeit, Ablauf|Dauer, Unterlagen)\b/i;

  let faqIdx = raw.search(faqStartRe);
  if (faqIdx < 0) {
    const m = raw.match(/\bFAQ\b/);
    faqIdx = m ? m.index : -1;
  }

  const postM = raw.match(postStartRe);
  const postIdx = postM ? postM.index : -1;
  const nearM = raw.match(nearRe);
  const nearIdx = nearM ? nearM.index : -1;

  let intro = raw;
  let faq = '';
  let postFaq = '';
  let nearby = '';

  if (faqIdx < 0 && postIdx < 0) {
    return { intro: raw, faq: '', postFaq: '', nearby: '' };
  }

  if (faqIdx >= 0) intro = raw.slice(0, faqIdx).trim();
  else if (postIdx > 0) intro = raw.slice(0, postIdx).trim();

  if (faqIdx >= 0 && postIdx > faqIdx) {
    faq = raw.slice(faqIdx, postIdx).trim();
  } else if (faqIdx >= 0 && postIdx < 0) {
    if (nearIdx > faqIdx) {
      faq = raw.slice(faqIdx, nearIdx).trim();
    } else {
      faq = raw.slice(faqIdx).trim();
    }
  }

  if (postIdx >= 0) {
    const postEnd = nearIdx > postIdx ? nearIdx : raw.length;
    postFaq = raw.slice(postIdx, postEnd).trim();
  }
  if (nearIdx >= 0) nearby = raw.slice(nearIdx).trim();

  return { intro, faq, postFaq, nearby };
}

async function fetchPage(url) {
  const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'SEOAuditBot/1.0' } });
  if (res.status !== 200) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

function riskLevel(full, intro, faq, post) {
  if (full > 0.5 || (intro > 0.45 && faq > 0.4)) return 'CRITICAL';
  if (full > 0.4 || intro > 0.4 || faq > 0.38) return 'HIGH';
  if (full > 0.3 || intro > 0.35) return 'MED';
  return 'LOW';
}

function main() {
  return (async () => {
    const pages = [];
    for (const url of URLS) {
      const html = await fetchPage(url);
      const mainHtml = extractMain(html);
      if (!mainHtml) throw new Error(`No <main> for ${url}`);
      const cityName = cityFromPath(url);
      const raw = stripHtml(mainHtml);
      const s = splitSections(raw);
      if (!s.postFaq && !s.faq) {
        s.intro = raw;
        s.full = raw;
      }
      pages.push({ url, cityName, ...s, full: raw });
    }

    const pairs = [];
    let maxFull = 0;
    let sumFull = 0;
    let sumI = 0;
    let sumF = 0;
    let sumP = 0;
    let sumN = 0;
    let maxI = 0;
    let maxF = 0;
    let maxP = 0;
    let maxN = 0;
    let n = 0;
    let ab30 = 0;
    let ab40 = 0;

    for (let i = 0; i < pages.length; i++) {
      for (let j = i + 1; j < pages.length; j++) {
        const A = pages[i];
        const B = pages[j];
        const ca = A.cityName;
        const cb = B.cityName;
        const intro = jaccard(tokenize(normalize(A.intro, ca)), tokenize(normalize(B.intro, cb)));
        const faq = jaccard(tokenize(normalize(A.faq, ca)), tokenize(normalize(B.faq, cb)));
        const postFaq = jaccard(
          tokenize(normalize(A.postFaq, ca)),
          tokenize(normalize(B.postFaq, cb)),
        );
        const nearby = jaccard(
          tokenize(normalize(A.nearby, ca)),
          tokenize(normalize(B.nearby, cb)),
        );
        const full = jaccard(tokenize(normalize(A.full, ca)), tokenize(normalize(B.full, cb)));
        n++;
        sumFull += full;
        sumI += intro;
        sumF += faq;
        sumP += postFaq;
        sumN += nearby;
        maxFull = Math.max(maxFull, full);
        maxI = Math.max(maxI, intro);
        maxF = Math.max(maxF, faq);
        maxP = Math.max(maxP, postFaq);
        maxN = Math.max(maxN, nearby);
        if (full > 0.3) ab30++;
        if (full > 0.4) ab40++;
        pairs.push({ a: A.url, b: B.url, intro, faq, postFaq, nearby, full, level: riskLevel(full, intro, faq, postFaq) });
      }
    }

    pairs.sort((x, y) => y.full - x.full);
    const top5 = pairs.slice(0, 5);

    const sentCounts = new Map();
    for (const p of pages) {
      const sents = p.intro
        .split(/(?<=[.!?…])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 35);
      const seen = new Set();
      for (const s of sents) {
        const key = normalize(s, p.cityName);
        if (key.length < 25) continue;
        if (seen.has(key)) continue;
        seen.add(key);
        sentCounts.set(key, (sentCounts.get(key) || 0) + 1);
      }
    }
    const multiSents = [...sentCounts.entries()]
      .filter(([, c]) => c >= 3)
      .sort((a, b) => b[1] - a[1]);

    const out = {
      pages: pages.map((p) => ({ url: p.url, city: p.cityName, lIntro: p.intro.length, lFaq: p.faq.length, lPost: p.postFaq.length, lNear: p.nearby.length })),
      summary: {
        maxFull,
        avgFull: sumFull / n,
        pctOver30: ab30 / n,
        pctOver40: ab40 / n,
        pairs: n,
      },
      sectionAvg: {
        intro: sumI / n,
        faq: sumF / n,
        postFaq: sumP / n,
        nearby: sumN / n,
      },
      sectionMax: { intro: maxI, faq: maxF, postFaq: maxP, nearby: maxN },
      top5,
      repeatedIntroSents: multiSents.slice(0, 25),
    };
    console.log(JSON.stringify(out, null, 2));
  })();
}

main();
