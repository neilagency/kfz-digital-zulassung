#!/usr/bin/env node
/**
 * Full SEO Audit Script for onlineautoabmelden.com
 * Crawls sitemap, checks all pages, validates meta tags, finds broken links
 */

const SITE_URL = 'https://onlineautoabmelden.com';

async function fetchWithTimeout(url, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'manual',
      headers: { 'User-Agent': 'SEO-Audit-Bot/1.0' }
    });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    return { status: 0, error: e.message, ok: false, headers: { get: () => null }, text: () => '' };
  }
}

async function fetchFollow(url, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'SEO-Audit-Bot/1.0' }
    });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    return { status: 0, error: e.message, ok: false, headers: { get: () => null }, text: () => '' };
  }
}

// ── STEP 1: Fetch and parse sitemap ──
async function parseSitemap() {
  console.log('\n═══════════════════════════════════════');
  console.log('📋 STEP 1: SITEMAP ANALYSIS');
  console.log('═══════════════════════════════════════\n');
  
  const res = await fetchFollow(SITE_URL + '/sitemap.xml');
  const text = await res.text();
  
  // Check content type
  const contentType = res.headers.get('content-type') || '';
  console.log(`Content-Type: ${contentType}`);
  console.log(`Status: ${res.status}`);
  
  const isXml = contentType.includes('xml') || text.trim().startsWith('<?xml') || text.trim().startsWith('<urlset');
  console.log(`Valid XML: ${isXml}`);
  
  if (!isXml) {
    console.log('❌ CRITICAL: Sitemap is returning HTML instead of XML!');
    console.log('First 500 chars:', text.substring(0, 500));
    return [];
  }
  
  // Parse URLs
  const urls = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(text)) !== null) {
    urls.push(match[1]);
  }
  
  console.log(`\nTotal URLs in sitemap: ${urls.length}`);
  
  // Categorize
  const products = urls.filter(u => u.includes('/product/'));
  const blog = urls.filter(u => u.includes('/insiderwissen'));
  const city = urls.filter(u => u.includes('/kfz-zulassung'));
  const other = urls.filter(u => !u.includes('/product/') && !u.includes('/insiderwissen') && !u.includes('/kfz-zulassung'));
  
  console.log(`  Products: ${products.length}`);
  console.log(`  Blog (insiderwissen): ${blog.length}`);
  console.log(`  City pages: ${city.length}`);
  console.log(`  Other pages: ${other.length}`);
  
  return urls;
}

// ── STEP 2: Check robots.txt ──
async function checkRobots() {
  console.log('\n═══════════════════════════════════════');
  console.log('🤖 STEP 2: ROBOTS.TXT ANALYSIS');
  console.log('═══════════════════════════════════════\n');
  
  const res = await fetchFollow(SITE_URL + '/robots.txt');
  const text = await res.text();
  
  console.log('robots.txt content:');
  console.log('---');
  console.log(text);
  console.log('---');
  
  const issues = [];
  
  // Check for _next blocking
  if (text.includes('Disallow: /_next')) {
    issues.push('❌ CRITICAL: /_next/ is blocked - Google cannot load CSS/JS');
  } else {
    console.log('✅ /_next/ is NOT blocked');
  }
  
  // Check for sitemap
  if (text.includes('sitemap.xml')) {
    console.log('✅ Sitemap reference found');
  } else {
    issues.push('❌ No sitemap reference in robots.txt');
  }
  
  // Check for blanket disallow
  if (text.includes('Disallow: /\n') && !text.includes('Allow: /')) {
    issues.push('❌ CRITICAL: Entire site is blocked!');
  }
  
  // Check allow/disallow rules
  if (text.includes('Allow: /')) {
    console.log('✅ Site is allowed for crawling');
  }
  
  if (text.includes('Disallow: /api/')) {
    console.log('✅ /api/ correctly disallowed');
  }
  
  if (text.includes('Disallow: /admin/')) {
    console.log('✅ /admin/ correctly disallowed');
  }
  
  // Check for empty sitemap line 
  const sitemapLine = text.split('\n').find(l => l.includes('Sitemap'));
  if (sitemapLine && !sitemapLine.includes('https://')) {
    issues.push('⚠️ Sitemap line format issue: ' + sitemapLine);
  }
  
  return issues;
}

// ── STEP 3: Check all sitemap URLs for status ──
async function checkAllUrls(urls) {
  console.log('\n═══════════════════════════════════════');
  console.log('🔍 STEP 3: URL STATUS CHECK');
  console.log('═══════════════════════════════════════\n');
  
  const results = {
    ok200: [],
    redirect3xx: [],
    error4xx: [],
    error5xx: [],
    timeout: [],
  };
  
  // Process in batches of 5
  for (let i = 0; i < urls.length; i += 5) {
    const batch = urls.slice(i, i + 5);
    const promises = batch.map(async (url) => {
      const res = await fetchWithTimeout(url);
      const status = res.status;
      const location = res.headers?.get?.('location') || '';
      return { url, status, location };
    });
    
    const batchResults = await Promise.all(promises);
    
    for (const r of batchResults) {
      if (r.status === 200) results.ok200.push(r);
      else if (r.status >= 300 && r.status < 400) results.redirect3xx.push(r);
      else if (r.status >= 400 && r.status < 500) results.error4xx.push(r);
      else if (r.status >= 500) results.error5xx.push(r);
      else results.timeout.push(r);
    }
    
    // Progress
    if ((i + 5) % 25 === 0 || i + 5 >= urls.length) {
      console.log(`  Checked ${Math.min(i + 5, urls.length)}/${urls.length} URLs...`);
    }
  }
  
  console.log('\n--- Results ---');
  console.log(`✅ 200 OK: ${results.ok200.length}`);
  console.log(`↪️  3xx Redirects: ${results.redirect3xx.length}`);
  console.log(`❌ 4xx Errors: ${results.error4xx.length}`);
  console.log(`💥 5xx Errors: ${results.error5xx.length}`);
  console.log(`⏱️  Timeouts: ${results.timeout.length}`);
  
  if (results.redirect3xx.length > 0) {
    console.log('\n--- Redirects in Sitemap (should be removed) ---');
    results.redirect3xx.forEach(r => console.log(`  ${r.status} ${r.url} → ${r.location}`));
  }
  
  if (results.error4xx.length > 0) {
    console.log('\n--- 4xx Errors ---');
    results.error4xx.forEach(r => console.log(`  ${r.status} ${r.url}`));
  }
  
  if (results.error5xx.length > 0) {
    console.log('\n--- 5xx Errors ---');
    results.error5xx.forEach(r => console.log(`  ${r.status} ${r.url}`));
  }
  
  if (results.timeout.length > 0) {
    console.log('\n--- Timeouts ---');
    results.timeout.forEach(r => console.log(`  ${r.url}`));
  }
  
  return results;
}

// ── STEP 4: Check meta tags on key pages ──
async function checkMetaTags(urls) {
  console.log('\n═══════════════════════════════════════');
  console.log('🏷️  STEP 4: META TAG AUDIT');
  console.log('═══════════════════════════════════════\n');
  
  // Sample some key pages
  const keyPages = [
    SITE_URL,
    SITE_URL + '/product/fahrzeugabmeldung',
    SITE_URL + '/product/auto-online-anmelden',
    SITE_URL + '/insiderwissen',
    SITE_URL + '/kfz-zulassung-abmeldung-in-deiner-stadt',
    SITE_URL + '/impressum',
    SITE_URL + '/agb',
    SITE_URL + '/datenschutzhinweise',
  ];
  
  // Also add first 10 blog/page URLs
  const additionalUrls = urls.filter(u => !keyPages.includes(u)).slice(0, 15);
  const allCheckUrls = [...keyPages, ...additionalUrls];
  
  const issues = [];
  
  for (const url of allCheckUrls) {
    const res = await fetchFollow(url);
    if (res.status !== 200) {
      if (res.status === 404) {
        issues.push({ url, issue: `Returns ${res.status}` });
      }
      continue;
    }
    
    const html = await res.text();
    
    // Check title
    const titleMatch = html.match(/<title>(.*?)<\/title>/s);
    const title = titleMatch ? titleMatch[1].trim() : null;
    
    // Check meta description
    const descMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/s) ||
                      html.match(/<meta\s+content="(.*?)"\s+name="description"/s);
    const desc = descMatch ? descMatch[1].trim() : null;
    
    // Check canonical
    const canonMatch = html.match(/<link\s+rel="canonical"\s+href="(.*?)"/s) ||
                       html.match(/<link\s+href="(.*?)"\s+rel="canonical"/s);
    const canonical = canonMatch ? canonMatch[1].trim() : null;
    
    // Check robots meta
    const robotsMatch = html.match(/<meta\s+name="robots"\s+content="(.*?)"/s) ||
                        html.match(/<meta\s+content="(.*?)"\s+name="robots"/s);
    const robots = robotsMatch ? robotsMatch[1].trim() : null;
    
    // Check OG tags
    const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="(.*?)"/s);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : null;
    
    const pageIssues = [];
    
    if (!title || title.length < 10) pageIssues.push('Missing/short title');
    if (title && title.length > 70) pageIssues.push(`Title too long (${title.length} chars)`);
    if (!desc) pageIssues.push('Missing meta description');
    if (desc && desc.length < 50) pageIssues.push(`Description too short (${desc.length} chars)`);
    if (desc && desc.length > 160) pageIssues.push(`Description too long (${desc.length} chars)`);
    if (!canonical) pageIssues.push('Missing canonical URL');
    if (canonical && !canonical.startsWith('https://')) pageIssues.push(`Canonical not HTTPS: ${canonical}`);
    if (robots && robots.includes('noindex')) pageIssues.push(`❌ NOINDEX flag: ${robots}`);
    if (!ogTitle) pageIssues.push('Missing og:title');
    
    if (pageIssues.length > 0) {
      issues.push({ url, issues: pageIssues, title, canonical, robots });
    } else {
      console.log(`✅ ${url.replace(SITE_URL, '')|| '/'} — OK`);
    }
  }
  
  if (issues.length > 0) {
    console.log('\n--- Meta Tag Issues ---');
    issues.forEach(i => {
      console.log(`\n❌ ${i.url.replace(SITE_URL, '') || '/'}`);
      if (i.issues) i.issues.forEach(iss => console.log(`   ${iss}`));
      if (i.issue) console.log(`   ${i.issue}`);
      if (i.title) console.log(`   Title: ${i.title.substring(0, 70)}`);
      if (i.canonical) console.log(`   Canonical: ${i.canonical}`);
      if (i.robots) console.log(`   Robots: ${i.robots}`);
    });
  }
  
  return issues;
}

// ── STEP 5: Check WordPress redirect coverage ──
async function checkWordPressRedirects() {
  console.log('\n═══════════════════════════════════════');
  console.log('🔁 STEP 5: WORDPRESS REDIRECT CHECK');
  console.log('═══════════════════════════════════════\n');
  
  // Common WordPress URLs that should redirect
  const wpUrls = [
    '/blog',
    '/blog/auto-abmelden-berlin',
    '/shop',
    '/kasse',
    '/my-account',
    '/warenkorb',
    '/mein-konto',
    '/wp-admin',
    '/wp-login.php',
    '/feed',
    '/feed/rss',
    '/category/allgemein',
    '/tag/auto',
    '/author/admin',
    '/sitemap_index.xml',
    '/wp-sitemap.xml',
    '/orte',
    '/orte/berlin',
    '/fahrzeugabmeldung',
    '/index.php/test',
    '/datenschutz',
    '/gebrauchtwagen-ankauf-digital',
    '/404-seite-nicht-gefunden',
    '/product/fahrzeug-online-anmelden',
    '/wp-content/uploads/test.jpg',
    // Additional WP URLs
    '/wp-json/wp/v2/posts',
    '/wp-includes/js/jquery/jquery.min.js',
    '/xmlrpc.php',
    '/?p=123',
    '/?page_id=456',
    '/kfz-online-abmelden-hamburg',
    '/kfz-abmelden-berlin',
  ];
  
  const results = [];
  
  for (const path of wpUrls) {
    const res = await fetchWithTimeout(SITE_URL + path);
    const status = res.status;
    const location = res.headers?.get?.('location') || '';
    const isRedirect = status >= 300 && status < 400;
    const is404 = status === 404;
    const is200 = status === 200;
    
    results.push({ path, status, location, isRedirect, is404, is200 });
    
    const icon = isRedirect ? '✅ →' : is200 ? '⚠️ 200' : is404 ? '❌ 404' : '❓';
    console.log(`${icon} ${path} [${status}] ${location ? '→ ' + location : ''}`);
  }
  
  const missing = results.filter(r => r.is404);
  if (missing.length > 0) {
    console.log(`\n❌ ${missing.length} WordPress URLs returning 404 (need redirects):`);
    missing.forEach(r => console.log(`   ${r.path}`));
  }
  
  return results;
}

// ── STEP 6: Check for broken internal links ──
async function checkInternalLinks(urls) {
  console.log('\n═══════════════════════════════════════');
  console.log('🔗 STEP 6: INTERNAL LINK CHECK');
  console.log('═══════════════════════════════════════\n');
  
  // Check links from key pages
  const keyPages = [
    SITE_URL,
    SITE_URL + '/product/fahrzeugabmeldung',
    SITE_URL + '/insiderwissen',
    SITE_URL + '/kfz-zulassung-abmeldung-in-deiner-stadt',
  ];
  
  const allInternalLinks = new Set();
  const externalLinks = new Set();
  
  for (const url of keyPages) {
    const res = await fetchFollow(url);
    if (res.status !== 200) continue;
    const html = await res.text();
    
    // Extract all href
    const hrefRegex = /href="(.*?)"/g;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      const href = match[1];
      if (href.startsWith('/') && !href.startsWith('//')) {
        allInternalLinks.add(href.split('#')[0].split('?')[0]);
      } else if (href.startsWith('https://onlineautoabmelden.com')) {
        const path = href.replace('https://onlineautoabmelden.com', '').split('#')[0].split('?')[0] || '/';
        allInternalLinks.add(path);
      } else if (href.startsWith('http')) {
        externalLinks.add(href);
      }
    }
  }
  
  console.log(`Found ${allInternalLinks.size} unique internal links`);
  console.log(`Found ${externalLinks.size} unique external links`);
  
  // Check internal links
  const brokenInternal = [];
  const linkArray = [...allInternalLinks].filter(l => 
    !l.startsWith('/api/') && 
    !l.startsWith('/admin/') && 
    !l.startsWith('/_next/') &&
    !l.endsWith('.xml') &&
    !l.endsWith('.txt') &&
    l !== ''
  );
  
  console.log(`\nChecking ${linkArray.length} internal links...`);
  
  for (let i = 0; i < linkArray.length; i += 5) {
    const batch = linkArray.slice(i, i + 5);
    const promises = batch.map(async (path) => {
      const res = await fetchFollow(SITE_URL + path, 10000);
      return { path, status: res.status };
    });
    
    const batchRes = await Promise.all(promises);
    for (const r of batchRes) {
      if (r.status === 404 || r.status === 0) {
        brokenInternal.push(r);
      }
    }
    
    if ((i + 5) % 25 === 0) {
      console.log(`  Checked ${Math.min(i + 5, linkArray.length)}/${linkArray.length}...`);
    }
  }
  
  if (brokenInternal.length > 0) {
    console.log(`\n❌ ${brokenInternal.length} broken internal links:`);
    brokenInternal.forEach(r => console.log(`   ${r.status} ${r.path}`));
  } else {
    console.log('✅ No broken internal links found');
  }
  
  // Check a sample of external links
  console.log('\nChecking external links (sample)...');
  const extSample = [...externalLinks].slice(0, 20);
  const brokenExternal = [];
  
  for (const url of extSample) {
    try {
      const res = await fetchFollow(url, 10000);
      if (res.status >= 400) {
        brokenExternal.push({ url, status: res.status });
      }
    } catch (e) {
      brokenExternal.push({ url, status: 0, error: e.message });
    }
  }
  
  if (brokenExternal.length > 0) {
    console.log(`\n⚠️ ${brokenExternal.length} potentially broken external links:`);
    brokenExternal.forEach(r => console.log(`   ${r.status} ${r.url}`));
  }
  
  return { brokenInternal, brokenExternal, allInternalLinks: linkArray, externalLinks: [...externalLinks] };
}

// ── STEP 7: Check additional known issues ──
async function checkAdditionalIssues() {
  console.log('\n═══════════════════════════════════════');
  console.log('⚡ STEP 7: ADDITIONAL CHECKS');
  console.log('═══════════════════════════════════════\n');
  
  // Check if /_next/ resources are accessible
  const res = await fetchFollow(SITE_URL);
  const html = await res.text();
  
  // Find /_next/ URLs
  const nextUrls = [];
  const nextRegex = /\/_next\/[^"'\s]+/g;
  let match;
  while ((match = nextRegex.exec(html)) !== null) {
    nextUrls.push(match[0]);
  }
  
  console.log(`Found ${nextUrls.length} _next resource URLs`);
  
  // Check first few
  for (const path of nextUrls.slice(0, 5)) {
    const r = await fetchFollow(SITE_URL + path, 5000);
    console.log(`  ${r.status} ${path.substring(0, 80)}...`);
  }
  
  // Check important pages for noindex
  console.log('\n--- Checking for accidental noindex ---');
  const checkPages = [
    '/',
    '/product/fahrzeugabmeldung',
    '/insiderwissen',
  ];
  
  for (const path of checkPages) {
    const r = await fetchFollow(SITE_URL + path);
    const text = await r.text();
    const hasNoindex = text.includes('noindex');
    const xRobots = r.headers?.get?.('x-robots-tag') || '';
    
    console.log(`  ${path}: noindex in HTML=${hasNoindex}, X-Robots-Tag=${xRobots || 'none'}`);
    if (hasNoindex) {
      // Find the context
      const idx = text.indexOf('noindex');
      console.log(`    Context: ...${text.substring(Math.max(0, idx - 50), idx + 50)}...`);
    }
  }
  
  // Check for duplicate content / www vs non-www
  console.log('\n--- Checking www redirect ---');
  const wwwRes = await fetchWithTimeout('https://www.onlineautoabmelden.com/');
  console.log(`  www → status: ${wwwRes.status}, location: ${wwwRes.headers?.get?.('location') || 'none'}`);
  
  // Check trailing slash handling
  console.log('\n--- Checking trailing slash ---');
  const trailRes = await fetchWithTimeout(SITE_URL + '/insiderwissen/');
  console.log(`  /insiderwissen/ → status: ${trailRes.status}, location: ${trailRes.headers?.get?.('location') || 'none'}`);
}

// ══════════════════════════════════════
// MAIN
// ══════════════════════════════════════
async function main() {
  console.log('🚀 FULL SEO AUDIT for onlineautoabmelden.com');
  console.log('Started:', new Date().toISOString());
  
  const sitemapUrls = await parseSitemap();
  const robotsIssues = await checkRobots();
  const urlResults = await checkAllUrls(sitemapUrls);
  const metaIssues = await checkMetaTags(sitemapUrls);
  const wpRedirects = await checkWordPressRedirects();
  const linkResults = await checkInternalLinks(sitemapUrls);
  await checkAdditionalIssues();
  
  // ── SUMMARY ──
  console.log('\n═══════════════════════════════════════');
  console.log('📊 AUDIT SUMMARY');
  console.log('═══════════════════════════════════════\n');
  
  console.log(`Sitemap URLs: ${sitemapUrls.length}`);
  console.log(`200 OK: ${urlResults.ok200.length}`);
  console.log(`3xx Redirects in sitemap: ${urlResults.redirect3xx.length}`);
  console.log(`4xx Errors: ${urlResults.error4xx.length}`);
  console.log(`5xx Errors: ${urlResults.error5xx.length}`);
  console.log(`Timeouts: ${urlResults.timeout.length}`);
  console.log(`Meta tag issues: ${metaIssues.length}`);
  console.log(`Robots.txt issues: ${robotsIssues.length}`);
  console.log(`WP URLs returning 404: ${wpRedirects.filter(r => r.is404).length}`);
  console.log(`Broken internal links: ${linkResults.brokenInternal.length}`);
  console.log(`Broken external links: ${linkResults.brokenExternal.length}`);
  
  console.log('\nFinished:', new Date().toISOString());
}

main().catch(console.error);
