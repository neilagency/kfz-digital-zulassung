'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { CustomerAuthProvider } from '@/components/CustomerAuthProvider';
import { CookieConsentProvider } from '@/lib/cookie-consent';
import { WHATSAPP_LINK } from '@/lib/constants';
import { MessageCircle } from 'lucide-react';

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

        {/* WhatsApp floating button */}
        <a
          href={navProps?.whatsapp || WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          aria-label="WhatsApp Live-Chat"
        >
          <MessageCircle className="w-7 h-7" />
        </a>

        {/* Cookie Consent Banner — lazy loaded */}
        <CookieBanner />
      </CookieConsentProvider>
    </CustomerAuthProvider>
  );
}
