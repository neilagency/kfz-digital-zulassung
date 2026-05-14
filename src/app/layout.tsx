import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import ConditionalLayout from '@/components/ConditionalLayout';
import Footer from '@/components/Footer';
import { getSiteSettings } from '@/lib/db';
import { GTMConsentInit, GTMScript, GTMNoscript } from '@/lib/analytics/gtm';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  preload: true,
});

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const siteUrl = stripTrailingSlash(s.siteUrl);

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default: `${s.siteName} – KFZ online abmelden`,
      template: `%s`,
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
      'Zulassungsdienst',
      'Zulassungsservice',
      'Online Zulassungsdienst',
      'Digitale Fahrzeugabmeldung',
    ],

    openGraph: {
      type: 'website',
      locale: 'de_DE',
      siteName: s.siteName,
      title: `${s.siteName} – KFZ online abmelden`,
      description: s.siteDescription,
      url: siteUrl,
      images: [
        {
          url: `${siteUrl}/logo.webp`,
          width: 1920,
          height: 1080,
          alt: `${s.siteName} – KFZ online abmelden`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${s.siteName} – KFZ online abmelden`,
      description: s.siteDescription,
      images: [`${siteUrl}/logo.webp`],
    },

    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
        { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        {
          url: '/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
        },
      ],
    },

    manifest: '/site.webmanifest',

    robots:
      process.env.NODE_ENV !== 'production' || process.env.PREVIEW_MODE
        ? { index: false, follow: false }
        : { index: true, follow: true },

    other: {
      google: 'notranslate',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  const siteUrl = stripTrailingSlash(settings.siteUrl);
  const companyName =
    settings.companyName || 'iKFZ Digital Zulassung UG (haftungsbeschränkt)';
  const siteName = settings.siteName || 'Online Auto Abmelden';

  const sameAs = Object.values(settings.social ?? {}).filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  );

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,

    name: siteName,
    legalName: companyName,

    description:
      'Privater Online-Service für digitale Fahrzeugabmeldung und Fahrzeuganmeldung in Deutschland. Die Abmeldung wird über eine GKS-Anbindung gemäß § 34 FZV verarbeitet. Nutzer erhalten die amtliche Bestätigung nach erfolgreicher Bearbeitung per E-Mail.',

    alternateName: [
      'Online Auto Abmelden',
      'iKFZ Digital Zulassung',
      'iKfz Digitalzulassung',
      'KFZ Digital Zulassung',
      'Digitaler Zulassungsdienst',
      'Online Zulassungsdienst',
      'KFZ Zulassungsservice',
      'Auto online abmelden',
      'KFZ online abmelden',
      'Fahrzeug online abmelden',
      'Kfz-Abmeldung online',
    ],

    url: siteUrl,

    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.svg`,
    },

    image: `${siteUrl}/logo.svg`,

    email: settings.email,
    telephone: '+4915224999190',

    areaServed: {
      '@type': 'Country',
      name: 'Deutschland',
    },

    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Fahrzeugabmeldung online',
          serviceType: 'Digitale Fahrzeugabmeldung',
          areaServed: {
            '@type': 'Country',
            name: 'Deutschland',
          },
          url: `${siteUrl}/product/fahrzeugabmeldung`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Fahrzeuganmeldung online',
          serviceType: 'Digitale Fahrzeuganmeldung',
          areaServed: {
            '@type': 'Country',
            name: 'Deutschland',
          },
          url: `${siteUrl}/product/auto-online-anmelden`,
        },
      },
    ],

    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+4915224999190',
        email: settings.email,
        contactType: 'customer support',
        areaServed: 'DE',
        availableLanguage: ['de', 'ar', 'tr', 'en'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+4915224999190',
        contactType: 'WhatsApp support',
        areaServed: 'DE',
        availableLanguage: ['de', 'ar', 'tr', 'en'],
      },
    ],

    knowsAbout: [
      'Auto online abmelden',
      'KFZ online abmelden',
      'Fahrzeug online abmelden',
      'Digitale Fahrzeugabmeldung',
      'Digitale Fahrzeuganmeldung',
      'i-Kfz',
      'Sicherheitscode Fahrzeugschein',
      'Sicherheitscode Kennzeichen',
      'Zulassungsservice',
      'Zulassungsdienst',
      'KBA',
      'GKS-Anbindung',
      '§ 34 FZV',
    ],

    sameAs,
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,

    url: siteUrl,
    name: siteName,

    alternateName: [
      'Online Auto Abmelden',
      'iKFZ Digital Zulassung',
      'KFZ online abmelden',
      'Auto online abmelden',
    ],

    description: settings.siteDescription,
    inLanguage: 'de-DE',

    publisher: {
      '@id': `${siteUrl}#organization`,
    },
  };

  return (
    <html lang="de" className={inter.variable} suppressHydrationWarning translate="no">
      <head>
        {/* Google Consent Mode v2 defaults — must run before GTM */}
        <GTMConsentInit />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* GTM noscript fallback — as close to opening <body> as possible */}
        <GTMNoscript />
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

        {/* Google Tag Manager */}
        <GTMScript />

        <script dangerouslySetInnerHTML={{ __html: `window.tidioChatLang="de";window.tidioChatColor="#8BC34A";` }} />
        <Script src="//code.tidio.co/4yyybrqvm02lhxkpgcemrjqiesnpkcv3.js" strategy="afterInteractive" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                function handleChunkError(msg) {
                  if (
                    msg &&
                    (
                      msg.indexOf('ChunkLoadError') !== -1 ||
                      msg.indexOf('Loading chunk') !== -1 ||
                      msg.indexOf('Loading CSS chunk') !== -1
                    )
                  ) {
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
                  handleChunkError(
                    e.reason && (e.reason.message || String(e.reason)) || ''
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
