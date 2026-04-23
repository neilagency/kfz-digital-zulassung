#!/usr/bin/env node
/**
 * Fast SEO Audit Script for onlineautoabmelden.com
 */

const SITE_URL = 'https://onlineautoabmelden.com';

async function fetchManual(url, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'manual', headers: { 'User-Agent': 'SEO-Audit-Bot/1.0' } });
    clearTimeout(id);
    return res;
  } catch (e) { clearTimeout(id); return { status: 0, error: e.message, ok: false, headers: { get: () => null }, text: () => '' }; }
}

async function fetchFollow(url, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'follow', headers: { 'User-Agent': 'SEO-Audit-Bot/1.0' } });
    clearTimeout(id);
    return res;
  } catch (e) { clearTimeout(id); return { status: 0, error: e.message, ok: false, headers: { get: () => null }, text: () => '' }; }
}

async function main() {
  console.log('🚀 FAST SEO AUDIT for onlineautoabmelden.com');

  // ── 1. SITEMAP ──
  console.log('\n══ SITEMAP ══');
  const sitemapRes = await fetchFollow(SITE_URL + '/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  const ct = sitemapRes.headers.get('content-type') || '';
  console.log(`Status: ${sitemapRes.status}, Content-Type: ${ct}`);
  
  const urls = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let m;
  while ((m = locRegex.exec(sitemapText)) !== null) urls.push(m[1]);
  console.log(`URLs in sitemap: ${urls.length}`);

  // ── 2. ROBOTS.TXT ──
  console.log('\n══ ROBOTS.TXT ══');
  const robotsRes = await fetchFollow(SITE_URL + '/robots.txt');
  const robotsText = await robotsRes.text();
  console.log(robotsText.trim());
  if (robotsText.includes('Disallow: /_next')) console.log('❌ CRITICAL: /_next blocked!');
  else console.log('✅ /_next NOT blocked');

  // ── 3. CHECK ALL SITEMAP URLs (batch of 20) ──
  console.log('\n══ URL STATUS CHECK (all sitemap URLs) ══');
  const errors = { err4xx: [], err5xx: [], timeout: [], redirect: [] };
  
  for (let i = 0; i < urls.length; i += 20) {
    const batch = urls.slice(i, i + 20);
    const results = await Promise.all(batch.map(async url => {
      const r = await fetchManual(url, 8000);
      return { url: url.replace(SITE_URL, ''), status: r.status, loc: r.headers?.get?.('location') || '' };
    }));
    
    for (const r of results) {
      if (r.status >= 400 && r.status < 500) errors.err4xx.push(r);
      else if (r.status >= 500) errors.err5xx.push(r);
      else if (r.status === 0) errors.timeout.push(r);
      else if (r.status >= 300 && r.status < 400) errors.redirect.push(r);
    }
    if ((i + 20) % 100 === 0) process.stdout.write(`  ${Math.min(i+20,urls.length)}/${urls.length}\n`);
  }
  
  const ok = urls.length - errors.err4xx.length - errors.err5xx.length - errors.timeout.length - errors.redirect.length;
  console.log(`✅ 200: ${ok} | ↪️ 3xx: ${errors.redirect.length} | ❌ 4xx: ${errors.err4xx.length} | 💥 5xx: ${errors.err5xx.length} | ⏱️ timeout: ${errors.timeout.length}`);
  
  if (errors.err4xx.length) { console.log('\n4xx errors:'); errors.err4xx.forEach(r => console.log(`  ${r.status} ${r.url}`)); }
  if (errors.err5xx.length) { console.log('\n5xx errors:'); errors.err5xx.forEach(r => console.log(`  ${r.status} ${r.url}`)); }
  if (errors.redirect.length) { console.log('\nRedirects in sitemap (should remove):'); errors.redirect.forEach(r => console.log(`  ${r.status} ${r.url} → ${r.loc}`)); }
  if (errors.timeout.length) { console.log('\nTimeouts:'); errors.timeout.forEach(r => console.log(`  ${r.url}`)); }

  // ── 4. META TAGS on key pages ──
  console.log('\n══ META TAG AUDIT (key pages) ══');
  const keyPages = ['/', '/product/fahrzeugabmeldung', '/product/auto-online-anmelden', '/insiderwissen', '/kfz-zulassung-abmeldung-in-deiner-stadt', '/impressum', '/agb', '/datenschutzhinweise'];
  
  // Add 10 random non-key pages from sitemap
  const samplePages = urls.filter(u => !keyPages.some(k => u.endsWith(k))).slice(0, 10).map(u => u.replace(SITE_URL, ''));
  const allMeta = [...keyPages, ...samplePages];
  
  for (const path of allMeta) {
    const r = await fetchFollow(SITE_URL + path, 10000);
    if (r.status !== 200) { console.log(`❌ ${path} → ${r.status}`); continue; }
    const html = await r.text();
    
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
    const desc = (html.match(/<meta\s+name="description"\s+content="(.*?)"/s) || html.match(/<meta\s+content="(.*?)"\s+name="description"/s))?.[1];
    const canonical = (html.match(/<link\s+rel="canonical"\s+href="(.*?)"/s) || html.match(/<link\s+href="(.*?)"\s+rel="canonical"/s))?.[1];
    const robotsMeta = (html.match(/<meta\s+name="robots"\s+content="(.*?)"/s) || html.match(/<meta\s+content="(.*?)"\s+name="robots"/s))?.[1];
    
    const issues = [];
    if (!title || title.length < 10) issues.push('NO_TITLE');
    if (title && title.length > 70) issues.push(`TITLE_LONG(${title.length})`);
    if (!desc) issues.push('NO_DESC');
    if (desc && desc.length > 160) issues.push(`DESC_LONG(${desc.length})`);
    if (!canonical) issues.push('NO_CANONICAL');
    if (robotsMeta?.includes('noindex')) issues.push('NOINDEX!');
    
    if (issues.length) {
      console.log(`⚠️ ${path}: ${issues.join(', ')}`);
      if (!canonical) console.log(`   canonical: ${canonical || 'MISSING'}`);
    } else {
      console.log(`✅ ${path}`);
    }
  }

  // ── 5. WORDPRESS REDIRECT CHECK ──
  console.log('\n══ WORDPRESS REDIRECTS ══');
  const wpPaths = ['/blog', '/blog/test-post', '/shop', '/kasse', '/my-account', '/warenkorb', '/mein-konto', '/wp-admin', '/wp-login.php', '/feed', '/category/allgemein', '/tag/auto', '/author/admin', '/sitemap_index.xml', '/wp-sitemap.xml', '/orte', '/orte/muenchen', '/fahrzeugabmeldung', '/index.php/test', '/datenschutz', '/gebrauchtwagen-ankauf-digital', '/product/fahrzeug-online-anmelden', '/wp-json/wp/v2/posts', '/xmlrpc.php', '/?p=123', '/kfz-online-abmelden-hamburg', '/kfz-abmelden-berlin', '/wp-content/uploads/2024/test.jpg', '/wp-includes/js/jquery.min.js'];
  
  const missing404 = [];
  for (const path of wpPaths) {
    const r = await fetchManual(SITE_URL + path, 5000);
    const s = r.status;
    const loc = r.headers?.get?.('location') || '';
    const icon = s >= 300 && s < 400 ? '✅→' : s === 200 ? '⚠️200' : s === 404 ? '❌404' : `❓${s}`;
    console.log(`${icon} ${path} ${loc ? '→ ' + loc : ''}`);
    if (s === 404) missing404.push(path);
  }

  // ── 6. INTERNAL LINKS from homepage ──
  console.log('\n══ INTERNAL LINKS CHECK ══');
  const homeRes = await fetchFollow(SITE_URL);
  const homeHtml = await homeRes.text();
  const internalLinks = new Set();
  const hrefRx = /href="(\/[^"]*?)"/g;
  while ((m = hrefRx.exec(homeHtml)) !== null) {
    const p = m[1].split('#')[0].split('?')[0];
    if (p && !p.startsWith('/api/') && !p.startsWith('/admin/') && !p.startsWith('/_next/')) internalLinks.add(p);
  }
  
  console.log(`Found ${internalLinks.size} internal links on homepage`);
  const brokenLinks = [];
  const linkArr = [...internalLinks];
  
  for (let i = 0; i < linkArr.length; i += 20) {
    const batch = linkArr.slice(i, i + 20);
    const results = await Promise.all(batch.map(async p => {
      const r = await fetchFollow(SITE_URL + p, 8000);
      return { path: p, status: r.status };
    }));
    for (const r of results) {
      if (r.status === 404 || r.status === 0) brokenLinks.push(r);
    }
  }
  
  if (brokenLinks.length) {
    console.log(`❌ ${brokenLinks.length} broken links from homepage:`);
    brokenLinks.forEach(r => console.log(`  ${r.status} ${r.path}`));
  } else {
    console.log('✅ No broken internal links from homepage');
  }

  // ── 7. ADDITIONAL CHECKS ──
  console.log('\n══ ADDITIONAL ══');
  
  // www redirect
  const wwwRes = await fetchManual('https://www.onlineautoabmelden.com/', 5000);
  console.log(`www redirect: ${wwwRes.status} → ${wwwRes.headers?.get?.('location') || 'none'}`);
  
  // Check key pages for noindex in HTML
  for (const path of ['/', '/product/fahrzeugabmeldung', '/insiderwissen']) {
    const r = await fetchFollow(SITE_URL + path);
    const html = await r.text();
    if (html.includes('noindex')) {
      const idx = html.indexOf('noindex');
      console.log(`❌ NOINDEX on ${path}: ...${html.substring(idx-80, idx+30)}...`);
    }
  }

  // ── SUMMARY ──
  console.log('\n══════════════════════════════════');
  console.log('📊 FINAL SUMMARY');
  console.log('══════════════════════════════════');
  console.log(`Sitemap URLs: ${urls.length}`);
  console.log(`Sitemap 4xx: ${errors.err4xx.length}`);
  console.log(`Sitemap 5xx: ${errors.err5xx.length}`);
  console.log(`Sitemap redirects: ${errors.redirect.length}`);
  console.log(`WP URLs getting 404: ${missing404.length}`);
  if (missing404.length) console.log(`  → ${missing404.join(', ')}`);
  console.log(`Broken homepage links: ${brokenLinks.length}`);
  console.log('Done:', new Date().toISOString());
}

main().catch(console.error);
