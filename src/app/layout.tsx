import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ConditionalLayout from '@/components/ConditionalLayout';
import Footer from '@/components/Footer';
import { getSiteSettings } from '@/lib/db';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    metadataBase: new URL(s.siteUrl),
    title: {
      default: `${s.siteName} – KFZ online abmelden in 2 Minuten`,
      template: `%s | ${s.siteName}`,
    },
    description: s.siteDescription,
    keywords: [
      'Auto abmelden',
      'KFZ abmelden',
      'Online Abmeldung',
      'Fahrzeug abmelden',
      'Auto online abmelden',
      'KFZ online abmelden',
      'Fahrzeugabmeldung',
      'iKFZ',
    ],
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      siteName: s.siteName,
      title: `${s.siteName} – KFZ online abmelden in 2 Minuten`,
      description: s.siteDescription,
      images: [{ url: '/logo.webp', width: 1920, height: 1080, alt: `${s.siteName} – KFZ online abmelden` }],
    },
    twitter: {
      card: 'summary_large_image',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
        { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/site.webmanifest',
    robots:
      process.env.NODE_ENV !== 'production' || process.env.PREVIEW_MODE
        ? { index: false, follow: false }
        : { index: true, follow: true },
    other: {
      'google': 'notranslate',
    },
    // NOTE: Do NOT set a global canonical here — each page sets its own via alternates.
    // Setting canonical: '/' here would cause Next.js to output it on every page
    // before the page-level canonical overrides it, which confuses crawlers.
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="de" className={inter.variable} suppressHydrationWarning translate="no">
      <body className={inter.className} suppressHydrationWarning>
        <ConditionalLayout
          footer={<Footer />}
          navProps={{
            phone: settings.phone,
            phoneLink: settings.phoneLink,
            whatsapp: settings.whatsapp,
          }}
        >
          {children}
        </ConditionalLayout>

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: settings.companyName,
              url: settings.siteUrl,
              logo: settings.siteUrl + '/logo.svg',
              contactPoint: {
  '@type': 'ContactPoint',
  telephone: '+4915224999190',
  contactType: 'customer service',
  availableLanguage: ['German'],
},
              sameAs: Object.values(settings.social).filter(Boolean),
            }),
          }}
        />

        {/* Auto-reload on ChunkLoadError (stale cache after deploy) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                function handleChunkError(msg) {
                  if (msg && (msg.indexOf('ChunkLoadError') !== -1 || msg.indexOf('Loading chunk') !== -1 || msg.indexOf('Loading CSS chunk') !== -1)) {
                    var reloaded = sessionStorage.getItem('chunk_reload');
                    if (!reloaded) {
                      sessionStorage.setItem('chunk_reload', '1');
                      window.location.reload();
                    }
                  }
                }
                window.addEventListener('error', function(e) {
                  handleChunkError(e.message || (e.target && e.target.src) || '');
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  handleChunkError(e.reason && (e.reason.message || String(e.reason)) || '');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
