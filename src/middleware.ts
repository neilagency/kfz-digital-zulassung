import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getCustomerSessionFromRequest } from '@/lib/customer-auth';

// ═══════════════════════════════════════════════════════════════════════════
// SEO LOCK LAYER
// All WordPress / WooCommerce / spam routes → 410 Gone (never 404).
// 410 = "permanently deleted" → Google deindexes faster than 404.
// Applies before any Next.js routing, so no legacy URL can reach real content.
// ═══════════════════════════════════════════════════════════════════════════

/** Builds a 410 Gone response with full SEO-safe headers. */
function gone(reason = 'legacy-cleanup'): NextResponse {
  return new NextResponse('Gone', {
    status: 410,
    headers: {
      'Content-Type': 'text/plain',
      'X-Robots-Tag': 'noindex, nofollow',
      // no-store: CDN/proxy must never cache a 410 page positively
      'Cache-Control': 'no-store',
      'X-Removed-Reason': reason,
    },
  });
}

// ── Exact paths that are permanently gone ─────────────────────────────────
const GONE_EXACT = new Set([
  '/xmlrpc.php',
  '/license.txt',
  '/readme.html',
  // WooCommerce checkout / cart / account (service never existed here)
  '/shop',
  '/cart',
  '/kasse',
  '/checkout',
  '/warenkorb',
  '/mein-konto',
  '/my-account',
  // Dead WP system URL
  '/ihre_url_zum_upgrade_checkout',
  // Dead product page — no replacement
  '/gebrauchtwagen-ankauf-digital',
  // Language pages — permanently removed
  '/online-arac-kayittan-duesuerme-almanya',
  '/ar-ilgha-tasjeel-al-sayara',
  '/online-car-deregistration-en',
]);

// ── Prefix patterns — any path starting with these is 410 ─────────────────
// Add new entries here to extend coverage without touching middleware logic.
const GONE_PREFIXES = [
  '/wp-',              // wp-content, wp-includes, wp-admin, wp-json, wp-login.php…
  '/wordpress',
  '/my-account/',      // /my-account/orders, /my-account/edit-account…
  '/product-category/',
  '/product-tag/',
  // Spam / gambling / bot injection patterns
  '/casino',
  '/ceriabet',
  '/klikwin88',
  '/slot-',
  '/togel',
  '/gacor',
  '/pragmatic',
  '/sbobet',
];

// ── Safe multi-segment prefixes ────────────────────────────────────────────
// Valid Next.js routes that have sub-paths. Any two-or-more segment path
// NOT starting with one of these cannot be a real page → smart-fallback 410.
const SAFE_MULTI_PREFIXES = [
  '/product/',
  '/insiderwissen/',
  '/admin/',
  '/konto/',
  '/api/',
  '/rechnung/',
  '/.well-known/',
];

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;
  const lowerPath = pathname.toLowerCase();

  // ── RSC header restoration ───────────────────────────────────────────────
  // Hostinger CDN (hcdn) strips non-standard request headers including
  // "RSC: 1", "Next-Router-State-Tree", and "Next-Router-Prefetch".
  // Next.js decides RSC vs HTML based on the "RSC: 1" header, NOT the
  // ?_rsc= query param. Without this header the server returns full HTML
  // and the browser gets wrong content-type → Safari "access control checks"
  // + "Failed to fetch RSC payload" errors on every client-side navigation.
  // We detect RSC requests via ?_rsc= (URL param, CDN cannot strip it) and
  // restore the missing headers before the request reaches the router.
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

  // ── 0. SEO Lock Layer: known-bad paths → 410 Gone ───────────────────────
  if (
    GONE_EXACT.has(lowerPath) ||
    GONE_PREFIXES.some(p => lowerPath.startsWith(p)) ||
    lowerPath.endsWith('.php')
  ) {
    return gone();
  }

  // ── 0b. Smart Fallback: deep paths with no known handler → 410 ──────────
  // All valid app routes are either single-segment (handled by [slug]) or
  // under a known prefix listed in SAFE_MULTI_PREFIXES.
  // A multi-segment path not under any known prefix cannot be a valid page.
  const segments = pathname.split('/').filter(Boolean);
  if (
    segments.length >= 2 &&
    !SAFE_MULTI_PREFIXES.some(p => pathname.startsWith(p))
  ) {
    return gone('unknown-deep-path');
  }

  // 1. www → non-www 301 redirect
  if (host.startsWith('www.')) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, '');
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  // 2. WordPress legacy query params → redirect to homepage
  const wpParam = request.nextUrl.searchParams.get('p') || request.nextUrl.searchParams.get('page_id');
  if (wpParam && pathname === '/') {
    const url = new URL('/', request.url);
    url.search = '';
    return NextResponse.redirect(url, 301);
  }

  // 3. Admin route protection (skip login page)
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

  // 4. Customer account route protection (/konto/*)
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
    // Admin routes (auth check)
    '/admin/((?!login).*)',
    '/api/admin/(.*)',
    // Customer account routes
    '/konto/(.*)',
    '/konto',
    '/api/customer/(.*)',
    // www redirect — exclude static assets and Next.js internals
    '/((?!_next/static|_next/image|favicon\\.ico|images/|uploads/|robots\\.txt|sitemap\\.xml|site\\.webmanifest).*)',
  ],
};
