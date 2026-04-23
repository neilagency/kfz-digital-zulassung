#!/usr/bin/env node
/**
 * Live production audit: fetch <main>, normalize, Jaccard pairs, section order from data-page-section-order.
 * Usage: node scripts/live-main-seo-audit.mjs
 */
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
  `der die das und oder ein eine einen einem einer eines ist sind war wurde werden wird im in am an auf aus bei mit nach von zu zum zur als auch nicht nur wie was wenn dass den dem des für über unter vor durch`.split(
    /\s+/,
  ),
);

function slugFromUrl(u) {
  try {
    return new URL(u).pathname.replace(/^\//, '') || u;
  } catch {
    return u;
  }
}

function extractMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : '';
}

function extractSectionOrder(mainHtml) {
  const m = mainHtml.match(/data-page-section-order="([^"]+)"/i);
  return m ? m[1].split(',').map((s) => s.trim()) : null;
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Known city tokens from URLs + common variants (minimal set for this audit batch). */
const CITY_NAMES = [
  'Berlin',
  'München',
  'Muenchen',
  'Frankfurt',
  'Düsseldorf',
  'Duesseldorf',
  'Karlsruhe',
  'Köln',
  'Koeln',
  'Aichtal',
  'Soltau',
  'Heinsberg',
  'Weil der Stadt',
  'Weil Der Stadt',
];

function normalize(text, cityHints) {
  let t = text.toLowerCase();
  for (const c of cityHints) {
    if (!c || c.length < 2) continue;
    const esc = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(new RegExp(esc, 'gi'), ' city ');
  }
  for (const c of CITY_NAMES) {
    const esc = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(new RegExp(`\\b${esc}\\b`, 'gi'), ' city ');
  }
  t = t.replace(/\b\d{5}\b/g, ' plz ');
  t = t.replace(/\b\d+[,.]\d{2}\s*€/g, ' price ');
  t = t.replace(/\b\d+\s*€/g, ' price ');
  t = t.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  const parts = t.split(/\s+/).filter((w) => w.length > 0 && !STOP.has(w));
  return parts.join(' ');
}

function tokenize(norm) {
  const s = new Set();
  for (const w of norm.split(/\s+/)) if (w) s.add(w);
  return s;
}

function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** First substantial block: text before first FAQ-ish h2 (heuristic on raw main text). */
function splitIntroFaqPost(rawText) {
  const lower = rawText.toLowerCase();
  const faqMarkers = [
    /\bhäufige fragen\b/i,
    /\bfaq\b/i,
    /\bhäufig gestellte fragen\b/i,
  ];
  let faqStart = -1;
  for (const re of faqMarkers) {
    const idx = rawText.search(re);
    if (idx >= 0 && (faqStart < 0 || idx < faqStart)) faqStart = idx;
  }
  if (faqStart < 0) {
    return { intro: rawText, faq: '', postFaq: '' };
  }
  const intro = rawText.slice(0, faqStart).trim();
  const fromFaq = rawText.slice(faqStart);
  const postMarkers = [
    /\b(nachbarorte|städte in der nähe|orte in der nähe|weitere städte)\b/i,
    /\b(kontakt|über uns|newsletter)\b/i,
  ];
  let postStart = -1;
  for (const re of postMarkers) {
    const idx = fromFaq.search(re);
    if (idx > 400 && (postStart < 0 || idx < postStart)) postStart = idx;
  }
  if (postStart < 0) {
    return { intro, faq: fromFaq.trim(), postFaq: '' };
  }
  return {
    intro,
    faq: fromFaq.slice(0, postStart).trim(),
    postFaq: fromFaq.slice(postStart).trim(),
  };
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; SEOAuditBot/1.0; +https://onlineautoabmelden.com)',
      accept: 'text/html,application/xhtml+xml',
    },
  });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

async function main() {
  const pages = [];
  for (const url of URLS) {
    const html = await fetchHtml(url);
    const mainHtml = extractMain(html);
    const rawText = stripTags(mainHtml);
    const slug = slugFromUrl(url);
    const cityHints = [slug.replace(/-/g, ' '), slug.split('-')[0]];
    const { intro, faq, postFaq } = splitIntroFaqPost(rawText);
    const order = extractSectionOrder(mainHtml);
    pages.push({
      url,
      slug,
      rawText,
      intro,
      faq,
      postFaq,
      full: rawText,
      sectionOrder: order,
    });
  }

  const normalized = pages.map((p) => ({
    ...p,
    nIntro: normalize(p.intro, [p.slug]),
    nFaq: normalize(p.faq, [p.slug]),
    nPost: normalize(p.postFaq, [p.slug]),
    nFull: normalize(p.full, [p.slug]),
  }));

  const pairs = [];
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const A = normalized[i];
      const B = normalized[j];
      const intro = jaccard(tokenize(A.nIntro), tokenize(B.nIntro));
      const faq = jaccard(tokenize(A.nFaq), tokenize(B.nFaq));
      const post = jaccard(tokenize(A.nPost), tokenize(B.nPost));
      const full = jaccard(tokenize(A.nFull), tokenize(B.nFull));
      pairs.push({
        a: A.slug,
        b: B.slug,
        intro,
        faq,
        postFaq: post,
        full,
      });
    }
  }

  pairs.sort((x, y) => y.full - x.full);
  const mostSim = pairs.slice(0, 5);
  const leastSim = [...pairs].sort((x, y) => x.full - y.full).slice(0, 5);
  const avgFull = pairs.reduce((s, p) => s + p.full, 0) / pairs.length;
  const maxFull = pairs[0]?.full ?? 0;

  const out = {
    pages: normalized.map((p) => ({
      slug: p.slug,
      url: p.url,
      charCounts: {
        main: p.full.length,
        intro: p.intro.length,
        faq: p.faq.length,
        postFaq: p.postFaq.length,
      },
      sectionOrder: p.sectionOrder,
    })),
    pairMetrics: pairs,
    summary: {
      pairCount: pairs.length,
      avgFullJaccard: avgFull,
      maxFullJaccard: maxFull,
      top5Similar: mostSim,
      top5Different: leastSim,
    },
  };

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
