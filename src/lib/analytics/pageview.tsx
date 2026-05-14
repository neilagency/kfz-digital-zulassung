'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Inner component — useSearchParams() requires a Suspense boundary in
 * Next.js App Router to avoid build-time static rendering errors.
 */
function PageViewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const qs = searchParams.toString();
    const url = pathname + (qs ? `?${qs}` : '');

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
      page_referrer: document.referrer || undefined,
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * PageViewTracker
 *
 * Fires a `page_view` dataLayer event on every client-side navigation in the
 * Next.js App Router (including initial load after hydration).
 *
 * Place this component once inside a layout that wraps all public pages.
 * GTM should be configured with a Custom Event trigger on `page_view` that
 * sends a GA4 "Page View" event (or use the built-in GA4 Configuration tag
 * with "Send a page view on gtag.js or GA4 library init" disabled, relying
 * solely on this custom event instead).
 *
 * Why not rely on GTM's built-in History Change trigger?
 * — Next.js App Router uses React Server Components and does not emit
 *   traditional History API events reliably across all navigation patterns.
 *   Pushing to dataLayer manually is the most reliable approach.
 */
export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  );
}
