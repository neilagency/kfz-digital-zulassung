'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { CustomerAuthProvider } from '@/components/CustomerAuthProvider';
import { CookieConsentProvider } from '@/lib/cookie-consent';
import { PageViewTracker } from '@/lib/analytics/pageview';

const CookieBanner = dynamic(() => import('@/components/CookieBanner'), {
  ssr: false,
});

const PromoBanner = dynamic(() => import('@/components/PromoBanner'), {
  ssr: false,
});

export interface NavProps {
  phone: string;
  phoneLink: string;
  whatsapp: string;
}

export default function ConditionalLayout({
  children,
  footer,
  navProps,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  navProps?: NavProps;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CustomerAuthProvider>
      <CookieConsentProvider>
        <PromoBanner />
        <div style={{ height: 'var(--promo-banner-height, 0px)' }} />
        <Navbar navProps={navProps} />
        {children}
        {footer}


        {/* Cookie Consent Banner — lazy loaded */}
        <CookieBanner />

        {/* SPA page view tracking — fires on every route change */}
        <PageViewTracker />
      </CookieConsentProvider>
    </CustomerAuthProvider>
  );
}
