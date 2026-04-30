import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getCustomerSessionFromRequest } from '@/lib/customer-auth';

// ═══════════════════════════════════════════════════════════════════════════
// SEO LOCK LAYER
// WordPress / WooCommerce / Spam / Casino / Porn / Bot-Reste → 410 Gone.
// 410 = dauerhaft entfernt. Google entfernt solche URLs schneller als bei 404.
// ═══════════════════════════════════════════════════════════════════════════

function gone(reason = 'legacy-cleanup'): NextResponse {
  return new NextResponse('Gone', {
    status: 410,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'X-Removed-Reason': reason,
    },
  });
}

function normalizePath(pathname: string): string {
  const lower = pathname.toLowerCase();
  if (lower === '/') return '/';
  return lower.replace(/\/+$/, '');
}

// Exakte alte / tote URLs
const GONE_EXACT = new Set([
  '/xmlrpc.php',
  '/license.txt',
  '/readme.html',

  // WooCommerce / Konto / Checkout-Reste
  '/shop',
  '/cart',
  '/kasse',
  '/checkout',
  '/warenkorb',
  '/mein-konto',
  '/my-account',

  // Tote WP/System/Import-Reste
  '/ihre_url_zum_upgrade_checkout',
  '/gebrauchtwagen-ankauf-digital',

  // Entfernte Sprachseiten
  '/online-arac-kayittan-duesuerme-almanya',
  '/ar-ilgha-tasjeel-al-sayara',
  '/online-car-deregistration-en',
]);

// Alles, was mit diesen Pfaden beginnt, ist dauerhaft weg
const GONE_PREFIXES = [
  // WordPress / alte CMS-Reste
  '/wp-',
  '/wordpress',
  '/wp-admin',
  '/wp-content',
  '/wp-includes',
  '/wp-json',

  // WooCommerce / Shop-Reste
  '/shop/',
  '/cart/',
  '/kasse/',
  '/checkout/',
  '/warenkorb/',
  '/mein-konto/',
  '/my-account/',
  '/product-category/',
  '/product-tag/',

  // Alte Taxonomien / Archive
  '/category/',
  '/tag/',
  '/author/',

  // Bekannte Spam- und Casino-Muster
  '/casino',
  '/ceriabet',
  '/klikwin88',
  '/slot-',
  '/togel',
  '/gacor',
  '/pragmatic',
  '/sbobet',
  '/bet-',
  '/bonus-',
];

// Wenn diese Wörter irgendwo im Pfad auftauchen → 410
// bewusst nur harte Spam-/Hack-Begriffe, damit echte Seiten nicht betroffen sind
const GONE_CONTAINS = [
  'casino',
  'ceriabet',
  'klikwin88',
  'togel',
  'gacor',
  'pragmatic',
  'sbobet',
  'gambling',
  'jackpot',
  'porno',
  'porn',
  'xxx',
  'sexcam',
  'escort',
  'viagra',
  'cialis',
  'levitra',
  'pharmacy',
  'backlink',
];

function isGonePath(pathname: string): boolean {
  const cleanPath = normalizePath(pathname);

  if (GONE_EXACT.has(cleanPath)) return true;

  if (GONE_PREFIXES.some((prefix) => cleanPath.startsWith(prefix))) {
    return true;
  }

  if (cleanPath.endsWith('.php')) return true;

  if (cleanPath.includes('/feed')) return true;

  if (GONE_CONTAINS.some((word) => cleanPath.includes(word))) {
    return true;
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // 1. Bekannte kaputte / gehackte / alte URLs sofort 410
  if (isGonePath(pathname)) {
    return gone();
  }

  // 2. www → non-www 301
  if (host.startsWith('www.')) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, '');
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  // 3. WordPress Query-Reste wie /?p=123 oder /?page_id=123 → Startseite
  const wpParam =
    request.nextUrl.searchParams.get('p') ||
    request.nextUrl.searchParams.get('page_id');

  if (wpParam && pathname === '/') {
    const url = new URL('/', request.url);
    url.search = '';
    return NextResponse.redirect(url, 301);
  }

  // 4. RSC Header Restoration für Hostinger/CDN
  // Wichtig für Next.js Client-Navigation, wenn CDN Header entfernt.
  if (request.nextUrl.searchParams.has('_rsc') && !request.headers.get('rsc')) {
    const headers = new Headers(request.headers);
    headers.set('rsc', '1');

    if (!headers.has('next-router-prefetch')) {
      headers.set('next-router-prefetch', '1');
    }

    const response = NextResponse.next({ request: { headers } });

    response.headers.set(
      'Vary',
      'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding',
    );

    return response;
  }

  // 5. Admin schützen
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPage || isAdminApi) {
    const token = await getToken({ req: request });

    if (!token) {
      if (isAdminApi) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 6. Kundenkonto schützen
  const isKontoPage = pathname.startsWith('/konto');
  const isCustomerApi = pathname.startsWith('/api/customer');

  if (isKontoPage || isCustomerApi) {
    const session = await getCustomerSessionFromRequest(request);

    if (!session) {
      if (isCustomerApi) {
        return new NextResponse(JSON.stringify({ error: 'Nicht angemeldet.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const loginUrl = new URL('/anmelden', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/((?!login).*)',
    '/api/admin/(.*)',

    '/konto/(.*)',
    '/konto',
    '/api/customer/(.*)',

    '/((?!_next/static|_next/image|favicon\\.ico|images/|uploads/|robots\\.txt|sitemap\\.xml|site\\.webmanifest|icon-.*\\.png|apple-touch-icon\\.png).*)',
  ],
};
