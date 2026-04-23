#!/usr/bin/env node
// Quick targeted SEO checks - skip full crawl

const SITE = 'https://onlineautoabmelden.com';
const f = (u,t=8000) => { const c=new AbortController(); const id=setTimeout(()=>c.abort(),t); return fetch(u,{signal:c.signal,redirect:'manual',headers:{'User-Agent':'SEO-Bot/1.0'}}).then(r=>{clearTimeout(id);return r}).catch(e=>{clearTimeout(id);return{status:0,headers:{get:()=>null},text:()=>''}}) };
const ff = (u,t=8000) => { const c=new AbortController(); const id=setTimeout(()=>c.abort(),t); return fetch(u,{signal:c.signal,redirect:'follow',headers:{'User-Agent':'SEO-Bot/1.0'}}).then(r=>{clearTimeout(id);return r}).catch(e=>{clearTimeout(id);return{status:0,headers:{get:()=>null},text:()=>''}}) };

async function main() {
  // ── 1: Sitemap basic check ──
  console.log('═══ SITEMAP ═══');
  const sr = await ff(SITE+'/sitemap.xml');
  const st = await sr.text();
  console.log(`Status: ${sr.status}, CT: ${sr.headers.get('content-type')}`);
  const urls = [...st.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
  console.log(`URLs: ${urls.length}`);
  
  // Check for dupes
  const dupes = urls.filter((u,i) => urls.indexOf(u) !== i);
  if (dupes.length) console.log(`❌ Duplicate URLs: ${dupes.length}`, dupes);
  else console.log('✅ No duplicates');
  
  // Check for non-https
  const nonHttps = urls.filter(u => !u.startsWith('https://'));
  if (nonHttps.length) console.log(`❌ Non-HTTPS: ${nonHttps.length}`);
  
  // Spot check 30 random URLs from sitemap
  console.log('\n═══ SPOT CHECK 30 SITEMAP URLs ═══');
  const sample = [];
  for (let i = 0; i < 30; i++) sample.push(urls[Math.floor(Math.random()*urls.length)]);
  
  const spot4xx = [];
  const results = await Promise.all(sample.map(async u => {
    const r = await f(u, 5000);
    return { url: u.replace(SITE,''), status: r.status };
  }));
  for (const r of results) {
    if (r.status >= 400) { spot4xx.push(r); console.log(`❌ ${r.status} ${r.url}`); }
    else if (r.status >= 300) console.log(`→ ${r.status} ${r.url}`);
  }
  console.log(`Result: ${results.filter(r=>r.status===200).length}/30 OK, ${spot4xx.length} errors`);

  // ── 2: WordPress Redirects ──  
  console.log('\n═══ WP REDIRECTS ═══');
  const wpPaths = ['/blog','/blog/test-post','/shop','/kasse','/my-account','/warenkorb','/mein-konto','/wp-admin/','/wp-login.php','/feed','/category/allgemein','/tag/auto','/author/admin','/sitemap_index.xml','/wp-sitemap.xml','/orte','/orte/muenchen','/fahrzeugabmeldung','/index.php/test','/datenschutz','/gebrauchtwagen-ankauf-digital','/product/fahrzeug-online-anmelden','/wp-json/wp/v2/posts','/xmlrpc.php','/kfz-online-abmelden-hamburg','/kfz-abmelden-berlin','/wp-content/uploads/2024/test.jpg'];
  
  const missing = [];
  for (const p of wpPaths) {
    const r = await f(SITE+p, 5000);
    const s = r.status;
    const loc = r.headers?.get?.('location') || '';
    if (s === 404) { missing.push(p); console.log(`❌ 404 ${p}`); }
    else if (s >= 300 && s < 400) console.log(`✅→ ${s} ${p} → ${loc.replace(SITE,'')}`);
    else console.log(`⚠️ ${s} ${p}`);
  }
  if (missing.length) console.log(`\n❌ MISSING REDIRECTS: ${missing.join(', ')}`);

  // ── 3: Meta Tags ──
  console.log('\n═══ META TAGS (key pages) ═══');
  const keyPages = ['/','/product/fahrzeugabmeldung','/product/auto-online-anmelden','/insiderwissen','/kfz-zulassung-abmeldung-in-deiner-stadt','/impressum','/agb','/datenschutzhinweise'];
  
  for (const p of keyPages) {
    const r = await ff(SITE+p, 10000);
    if (r.status !== 200) { console.log(`❌ ${p} → ${r.status}`); continue; }
    const h = await r.text();
    const title = h.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
    const desc = (h.match(/<meta\s+name="description"\s+content="(.*?)"/s)||h.match(/<meta\s+content="(.*?)"\s+name="description"/s))?.[1];
    const can = (h.match(/<link\s+rel="canonical"\s+href="(.*?)"/s)||h.match(/<link\s+href="(.*?)"\s+rel="canonical"/s))?.[1];
    const rob = (h.match(/<meta\s+name="robots"\s+content="(.*?)"/s)||h.match(/<meta\s+content="(.*?)"\s+name="robots"/s))?.[1];
    
    const iss = [];
    if (!title || title.length < 10) iss.push('NO_TITLE');
    if (!desc) iss.push('NO_DESC');
    if (!can) iss.push('NO_CANONICAL');
    if (rob?.includes('noindex')) iss.push('NOINDEX!');
    
    if (iss.length) console.log(`⚠️ ${p}: ${iss.join(', ')} | title="${(title||'').substring(0,50)}" | can=${can||'NONE'}`);
    else console.log(`✅ ${p} | title="${title?.substring(0,50)}"`);
  }

  // ── 4: Homepage links ──
  console.log('\n═══ HOMEPAGE LINKS ═══');
  const hr = await ff(SITE);
  const hh = await hr.text();
  const links = new Set();
  for (const m of hh.matchAll(/href="(\/[^"]*?)"/g)) {
    const p = m[1].split('#')[0].split('?')[0];
    if (p && !p.startsWith('/api/') && !p.startsWith('/admin/') && !p.startsWith('/_next/')) links.add(p);
  }
  console.log(`Internal links: ${links.size}`);
  
  const broken = [];
  const la = [...links];
  for (let i = 0; i < la.length; i += 10) {
    const batch = la.slice(i, i+10);
    const res = await Promise.all(batch.map(async p => {
      const r = await ff(SITE+p, 5000);
      return { path: p, status: r.status };
    }));
    for (const r of res) if (r.status === 404 || r.status === 0) broken.push(r);
  }
  
  if (broken.length) { console.log(`❌ Broken: ${broken.length}`); broken.forEach(r => console.log(`  ${r.status} ${r.path}`)); }
  else console.log('✅ No broken links');

  // ── 5: www + noindex ──
  console.log('\n═══ MISC ═══');
  const ww = await f('https://www.onlineautoabmelden.com/', 5000);
  console.log(`www: ${ww.status} → ${ww.headers?.get?.('location')||'none'}`);
  
  // Check noindex  
  for (const p of ['/','/product/fahrzeugabmeldung']) {
    const r = await ff(SITE+p);
    const h = await r.text();
    const ni = h.includes('noindex');
    console.log(`noindex on ${p}: ${ni}`);
    if (ni) {
      const idx = h.indexOf('noindex');
      console.log(`  context: ${h.substring(Math.max(0,idx-100),idx+50)}`);
    }
  }

  // ── 6: Check blog posts listed in sitemap ──
  console.log('\n═══ BLOG POSTS IN SITEMAP ═══');
  // blog posts are direct slugs (not under /product/ or /insiderwissen/ or /kfz-)
  const blogLike = urls.filter(u => {
    const p = u.replace(SITE,'');
    return p.startsWith('/') && !p.includes('/product/') && !p.includes('/insiderwissen') && !p.includes('/kfz-zulassung') && p !== '/';
  });
  console.log(`Non-product/blog pages in sitemap: ${blogLike.length}`);
  // Show first 20
  blogLike.slice(0,20).forEach(u => console.log(`  ${u.replace(SITE,'')}`));
  if (blogLike.length > 20) console.log(`  ... and ${blogLike.length-20} more`);

  // ── SUMMARY ──
  console.log('\n════════════════════════');
  console.log('📊 SUMMARY');
  console.log('════════════════════════');
  console.log(`Sitemap URLs: ${urls.length}`);
  console.log(`Duplicate sitemap URLs: ${dupes.length}`);
  console.log(`WP paths missing redirect: ${missing.length} → ${missing.join(', ') || 'none'}`);
  console.log(`Broken homepage links: ${broken.length}`);
  console.log(`Spot check errors: ${spot4xx.length}/30`);
}

main().catch(console.error);
