/** @type {import('next').NextConfig} */

// Add CDN domain to remotePatterns if CDN_BASE_URL is configured
const cdnRemotePattern = (() => {
  const cdnBase = process.env.CDN_BASE_URL || '';
  if (!cdnBase) return null;
  try {
    const url = new URL(cdnBase);
    return { protocol: url.protocol.replace(':', ''), hostname: url.hostname, pathname: '/**' };
  } catch { return null; }
})();

const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  eslint: { ignoreDuringBuilds: true },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [384, 640, 828, 1080, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'onlineautoabmelden.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.onlineautoabmelden.com', pathname: '/**' },
      ...(cdnRemotePattern ? [cdnRemotePattern] : []),
    ],
  },

  experimental: {
    instrumentationHook: false,
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
    serverComponentsExternalPackages: [
      'better-sqlite3',
      '@libsql/client',
      '@prisma/adapter-libsql',
      '@prisma/adapter-better-sqlite3',
    ],
  },

  async redirects() {
    return [
      // -----------------------------
      // Sitemaps
      // -----------------------------
      {
        source: '/sitemap_index.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/wp-sitemap.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/wp-sitemap:path*',
        destination: '/sitemap.xml',
        permanent: true,
      },

      // -----------------------------
      // Blog / archive / feed remnants
      // -----------------------------
      {
        source: '/blog',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/insiderwissen/:path*',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/feed/:path*',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/comments/feed',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/:slug/feed',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/category/:path*',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/tag/:path*',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/author/:path*',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/page/:id(\\d+)',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/insiderwissen/page/:id(\\d+)',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/insiderwissen/:id(\\d+)',
        destination: '/insiderwissen',
        permanent: true,
      },

      // -----------------------------
      // Product / taxonomy / embed remnants
      // -----------------------------
      {
        source: '/zulassungsservice-bremen',
        destination: '/kfz-online-abmelden-bremen',
        permanent: true,
      },
      {
        source: '/bochum',
        destination: '/auto-online-abmelden-in-bochum',
        permanent: true,
      },
      {
        source: '/hamburg',
        destination: '/kfz-online-abmelden-in-hamburg',
        permanent: true,
      },
      {
        source: '/darmstadt',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/offenbach-am-main',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/kusel-2',
        destination: '/kusel',
        permanent: true,
      },
      {
        source: '/test-cron-e2e',
        destination: '/',
        permanent: true,
      },
      {
        source: '/laichingen-stadt',
        destination: '/auto-online-abmelden-in-laichingen',
        permanent: true,
      },
      {
        source: '/rhein-kreis-neuss',
        destination: '/auto-online-abmelden-in-neuss',
        permanent: true,
      },
      {
        source: '/idioten-test',
        destination: '/',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-in-laupheim',
        destination: '/laupheim',
        permanent: true,
      },
      {
        source: '/gelsenkirchen',
        destination: '/auto-abmelden-online-in-gelsenkirchen',
        permanent: true,
      },
      {
        source: '/auto-abmelden-hamburg',
        destination: '/kfz-online-abmelden-in-hamburg',
        permanent: true,
      },
      {
  source: '/mercedes-rueckruf-lenkprobleme',
  destination: '/insiderwissen',
  permanent: true,
},
{
  source: '/auto-verkaufen-tuev-pflicht',
  destination: '/auto-verkaufen',
  permanent: true,
},
{
  source: '/wo-ist-der-7-stellige-sicherheitscode-im-fahrzeugschein-einfach-erklaert',
  destination: '/insiderwissen/wo-ist-der-7-stellige-sicherheitscode-im-fahrzeugschein',
  permanent: true,
},
{
  source: '/$',
  destination: '/',
  permanent: true,
},
      {
        source: '/leichlingen',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/probleme-mit-zulassung-digital-blackbird',
        destination: '/insiderwissen/online-zulassung-funktioniert-nicht',
        permanent: true,
      },
      {
        source: '/kfz',
        destination: '/kfz-abmelden',
        permanent: true,
      },
      {
        source: '/wuppertal',
        destination: '/auto-online-abmelden-in-wuppertal',
        permanent: true,
      },
      {
        source: '/ist-der-halter-im-fahrzeugbrief-auch-der-eigentuemer',
        destination: '/insiderwissen',
        permanent: true,
      },
      // NOTE: /product-category/*, /product-tag/* → 410 Gone (middleware)
      {
        source: '/product/:slug/embed',
        destination: '/product/:slug',
        permanent: true,
      },
      {
        source: '/:slug/embed',
        destination: '/:slug',
        permanent: true,
      },

      // NOTE: /Ihre_URL_zum_Upgrade_Checkout → 410 Gone (middleware)
      {
        source: '/kfz-abmelden/Ihre_URL_zum_Upgrade_Checkout',
        destination: '/kfz-abmelden',
        permanent: true,
      },

      // -----------------------------
      // Core legacy pages
      // -----------------------------
      {
        source: '/orte',
        destination: '/kfz-zulassung-abmeldung-in-deiner-stadt',
        permanent: true,
      },
      {
        source: '/orte/muenchen',
        destination: '/auto-online-abmelden-muenchen',
        permanent: true,
      },
      {
        source: '/index.php/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/fahrzeugabmeldung',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/product/fahrzeug-online-anmelden',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/product/auto-online-abmelden',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/datenschutz',
        destination: '/datenschutzhinweise',
        permanent: true,
      },
      {
        source: '/agb',
        destination: '/allgemeine-geschaeftsbedingungen',
        permanent: true,
      },

      // -----------------------------
      // Commerce leftovers
      // NOTE: /shop, /kasse, /warenkorb, /mein-konto, /my-account → 410 Gone (middleware)
      // -----------------------------
      {
        source: '/product',
        destination: '/product/fahrzeugabmeldung',
        permanent: false,
      },

      // NOTE: /wp-admin, system URLs → 410 Gone (middleware)

      // -----------------------------
      // Old category / taxonomy pages
      // -----------------------------
      {
        source: '/ratgeber-abmeldung',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-entsorgung',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-erbrecht',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-gebuehren',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-kauf',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-kennzeichen',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-leasing',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-probleme',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-service',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-termine',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-verkauf',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-versicherung',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-vollmachten',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/ratgeber-zubehoer',
        destination: '/insiderwissen',
        permanent: true,
      },

      // -----------------------------
      // Old content pages -> new posts
      // -----------------------------
      {
        source: '/abmeldung-bei-fahrzeugverkauf',
        destination: '/insiderwissen/auto-abmelden-nach-verkauf-anleitung',
        permanent: true,
      },
      {
        source: '/abmeldung-beim-strassenverkehrsamt',
        destination: '/insiderwissen/zulassungsstelle-online-abmelden',
        permanent: true,
      },
      {
        source: '/abmeldung-ohne-fahrzeugbrief',
        destination: '/insiderwissen/auto-abmelden-ohne-brief-ist-das-moeglich',
        permanent: true,
      },
      {
        source: '/auto-abmelden-online',
        destination: '/insiderwissen/auto-online-abmelden-so-geht-es-einfach-sofort',
        permanent: true,
      },
      {
        source: '/fahrzeugexport-abmeldung',
        destination: '/insiderwissen/auto-online-abmelden-aus-dem-ausland-2',
        permanent: true,
      },
      {
        source: '/fahrzeugstilllegung',
        destination: '/insiderwissen/fahrzeug-ausser-betrieb-setzen',
        permanent: true,
      },
      {
        source: '/fehler-abmeldung',
        destination: '/insiderwissen/kfz-abmeldung-fehler-sicherheitscode',
        permanent: true,
      },
      {
        source: '/kennzeichen-abmeldung',
        destination: '/insiderwissen/kennzeichen-behalten-bei-abmeldung',
        permanent: true,
      },
      {
        source: '/kfz-abmeldung-2',
        destination: '/kfz-abmeldung',
        permanent: true,
      },
      {
        source: '/kosten-der-fahrzeugabmeldung',
        destination: '/insiderwissen/was-kostet-auto-abmelden',
        permanent: true,
      },

      // -----------------------------
      // Important SEO redirects
      // -----------------------------
      {
        source: '/kfz-online-abmelden-hamburg',
        destination: '/kfz-online-abmelden-in-hamburg',
        permanent: true,
      },
      {
        source: '/kfz-abmelden-berlin',
        destination: '/berlin-zulassungsstelle',
        permanent: true,
      },
      {
        source: '/kfz-online-abmelden-berlin',
        destination: '/berlin-zulassungsstelle',
        permanent: true,
      },
      {
        source: '/kfz-online-abmelden-muenchen',
        destination: '/auto-online-abmelden-muenchen',
        permanent: true,
      },
      {
        source: '/kfz-online-anmelden',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/evb-nummer-anfordern',
        destination: '/evb',
        permanent: true,
      },
      {
        source: '/ikfz-kosten-preise',
        destination: '/online-zulassung-kfz',
        permanent: true,
      },
      {
        source: '/online-auto-abmelden-2024',
        destination: '/insiderwissen/auto-online-abmelden-2026',
        permanent: true,
      },
      {
        source: '/kfz-online-abmelden-2-0',
        destination: '/kfz-abmelden-online',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-koeln',
        destination: '/kfz-online-abmelden-koeln',
        permanent: true,
      },
      {
        source: '/zulassungstelle-dortmund',
        destination: '/kfz-online-abmelden-dortmund',
        permanent: true,
      },
      {
        source: '/blackbird-gmbh',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blackbird-gmbh-telefonnummer',
        destination: '/insiderwissen/abmeldung-digital-telefonnummer',
        permanent: true,
      },
      {
        source: '/unsere-partner',
        destination: '/',
        permanent: true,
      },

      // -----------------------------
      // Duplicate / imported slugs
      // -----------------------------
      {
        source: '/kfz-zulassung-abmeldung-in-deiner-stadt-2',
        destination: '/kfz-zulassung-abmeldung-in-deiner-stadt',
        permanent: true,
      },
      {
        source: '/kuenzelsau-2',
        destination: '/kuenzelsau',
        permanent: true,
      },
      {
        source: '/kuenzelsau-3',
        destination: '/kuenzelsau',
        permanent: true,
      },
      {
        source: '/ehrenkirchen-2',
        destination: '/ehrenkirchen',
        permanent: true,
      },
      {
        source: '/landau-in-der-pfalz-2',
        destination: '/landau-in-der-pfalz',
        permanent: true,
      },
      {
        source: '/wiesbaden-2',
        destination: '/wiesbaden',
        permanent: true,
      },
      {
        source: '/lueneburg-2',
        destination: '/lueneburg',
        permanent: true,
      },
      {
        source: '/paderborn-2',
        destination: '/paderborn',
        permanent: true,
      },
      {
        source: '/paderborn-3',
        destination: '/paderborn',
        permanent: true,
      },
      {
        source: '/bernkastel-wittlich-2',
        destination: '/bernkastel-wittlich',
        permanent: true,
      },
      {
        source: '/ettlingen-2',
        destination: '/ettlingen',
        permanent: true,
      },
      {
        source: '/kyffhaeuserkreis-2',
        destination: '/kyffhaeuserkreis',
        permanent: true,
      },
      {
        source: '/kraichtal-2',
        destination: '/kraichtal',
        permanent: true,
      },
      {
        source: '/recklinghausen-2',
        destination: '/recklinghausen',
        permanent: true,
      },
      {
        source: '/anhaenger-abmelden-2',
        destination: '/anhaenger-abmelden',
        permanent: true,
      },
      {
        source: '/laupenheim',
        destination: '/laupheim',
        permanent: true,
      },
      {
        source: '/hagen-2',
        destination: '/hagen',
        permanent: true,
      },
      {
        source: '/worms-2',
        destination: '/worms',
        permanent: true,
      },
      {
        source: '/oestringen-2',
        destination: '/oestringen',
        permanent: true,
      },
      {
        source: '/bonn-2',
        destination: '/bonn',
        permanent: true,
      },
      {
        source: '/oberhausen-2',
        destination: '/oberhausen',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-muenchen-2',
        destination: '/auto-online-abmelden-muenchen',
        permanent: true,
      },
      {
        source: '/berlin',
        destination: '/berlin-zulassungsstelle',
        permanent: true,
      },

      // -----------------------------
      // Spelling / older variant fixes
      // -----------------------------
      {
        source: '/kfz-zulassung-online-schritt-fuer-schritt-erklaert',
        destination: '/insiderwissen/kfz-zulassung-online-schritt-fuer-schritt',
        permanent: true,
      },
      {
        source: '/was-benotige-ich-fur-eine-autoanmeldung',
        destination: '/insiderwissen/was-benoetige-ich-fuer-ein-autoanmeldung',
        permanent: true,
      },
      {
        source: '/kann-ich-mein-fahrzeug-angemeldet-ubergeben',
        destination: '/auto-verkaufen',
        permanent: true,
      },
      {
        source: '/rotes-kennzeichen-beantragen',
        destination: '/kurzzeitkennzeichen',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-im-winter',
        destination: '/insiderwissen/kfz-abmelden-im-winter',
        permanent: true,
      },

      // -----------------------------
      // Redirect fixes from GSC / Ahrefs
      // -----------------------------
      {
        source: '/auto-online-abmelden-erfahrungen-risiken-sicherheit',
        destination: '/insiderwissen/auto-online-abmelden-erfahrungen',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-alle-seiten',
        destination: '/kfz-zulassung-abmeldung-in-deiner-stadt',
        permanent: true,
      },
      {
        source: '/zulassung-digital-fehler',
        destination: '/insiderwissen/online-zulassung-funktioniert-nicht',
        permanent: true,
      },
      {
        source: '/kfz-voruebergehend-stilllegen-online',
        destination: '/insiderwissen/kfz-voruebergehend-stilllegen-online',
        permanent: true,
      },
      {
        source: '/kfz-zulassung',
        destination: '/kfz-zulassung-online',
        permanent: true,
      },
      {
        source: '/auto-online-ummelden-wie-geht-das',
        destination: '/insiderwissen/fahrzeug-ummelden',
        permanent: true,
      },

      // -----------------------------
      // Root old blog URLs -> Insiderwissen
      // -----------------------------
      {
        source: '/sicherheitscode-kennzeichen-freilegen',
        destination: '/insiderwissen/sicherheitscode',
        permanent: true,
      },
      {
        source: '/auto-abmelden-herne',
        destination: '/insiderwissen/auto-abmelden-herne',
        permanent: true,
      },
      {
        source: '/fahrzeugzulassung-online',
        destination: '/insiderwissen/fahrzeugzulassung-online',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-ohne-ausweis',
        destination: '/insiderwissen/auto-online-abmelden-ohne-ausweis',
        permanent: true,
      },
      {
        source: '/sicherheitscode',
        destination: '/insiderwissen/sicherheitscode',
        permanent: true,
      },
      {
        source: '/fahrzeugschein',
        destination: '/insiderwissen/fahrzeugschein',
        permanent: true,
      },
      {
        source: '/zulassungsstelle',
        destination: '/insiderwissen/zulassungsstelle',
        permanent: true,
      },
      {
        source: '/ausserbetriebsetzung-eines-fahrzeuges',
        destination: '/insiderwissen/ausserbetriebsetzung-eines-fahrzeuges',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-ikfz-anleitung',
        destination: '/insiderwissen/wie-melde-ich-mein-auto-online-ab',
        permanent: true,
      },
      {
        source: '/online-auto-abmelden-ikfz',
        destination: '/insiderwissen/wie-melde-ich-mein-auto-online-ab',
        permanent: true,
      },
      {
        source: '/auto-abmelden-leverkusen',
        destination: '/insiderwissen/auto-abmelden-leverkusen',
        permanent: true,
      },
      {
        source: '/vollmacht-auto-anmelden',
        destination: '/insiderwissen/vollmacht-fuer-die-kfz-zulassung-online',
        permanent: true,
      },
      {
        source: '/zulassung-digital',
        destination: '/insiderwissen/zulassung-digital',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-aus-dem-ausland',
        destination: '/insiderwissen/auto-online-abmelden-aus-dem-ausland-2',
        permanent: true,
      },
      {
        source: '/auto-abmelden-paderborn',
        destination: '/insiderwissen/auto-abmelden-paderborn',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-in-gelsenkirchen',
        destination: '/insiderwissen/auto-abmelden-gelsenkirchen',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-ohne-elster',
        destination: '/insiderwissen/wie-melde-ich-mein-auto-online-ab',
        permanent: true,
      },
      {
        source: '/online-abmelden-kfz',
        destination: '/insiderwissen/online-abmelden-kfz',
        permanent: true,
      },
      {
        source: '/kfz-kennzeichen-online-bestellen-anleitung',
        destination: '/insiderwissen/wunschkennzeichen-online-reservieren-ikfz',
        permanent: true,
      },

      // -----------------------------
      // Insiderwissen safe redirects
      // -----------------------------
      {
        source: '/insiderwissen/ikfz-online',
        destination: '/insiderwissen/wie-melde-ich-mein-auto-online-ab',
        permanent: true,
      },
      {
        source: '/insiderwissen/auto-abmelden',
        destination: '/insiderwissen/wie-melde-ich-mein-auto-online-ab',
        permanent: true,
      },
      {
        source: '/insiderwissen/online-abmeldung-funktioniert-nicht',
        destination: '/insiderwissen/online-zulassung-funktioniert-nicht',
        permanent: true,
      },
      {
        source: '/insiderwissen/kfz-online-abmelden',
        destination: '/insiderwissen/wie-melde-ich-mein-auto-online-ab',
        permanent: true,
      },
      {
        source: '/insiderwissen/auto-online-abmelden',
        destination: '/insiderwissen/auto-online-abmelden-erfahrungen',
        permanent: true,
      },
      {
        source: '/insiderwissen/was-kostet-die-abmeldung-eines-autos',
        destination: '/insiderwissen/was-kostet-auto-online-abmelden',
        permanent: true,
      },
      {
        source: '/insiderwissen/auto-online-abmelden-erfahrungen-risiken-sicherheit',
        destination: '/insiderwissen/auto-online-abmelden-erfahrungen',
        permanent: true,
      },
      {
        source: '/insiderwissen/fin-fahrzeugschein',
        destination: '/insiderwissen/fahrzeugschein',
        permanent: true,
      },

      // -----------------------------
      // Existing safe page mappings
      // -----------------------------
      {
        source: '/insiderwissen/auto-abmelden-duisburg',
        destination: '/duisburg',
        permanent: true,
      },
      {
        source: '/insiderwissen/auto-abmelden-oberhausen',
        destination: '/oberhausen',
        permanent: true,
      },

      // -----------------------------
      // Numeric leftovers - keep last
      // -----------------------------
      {
        source: '/auto-abmelden/:id(\\d+)',
        destination: '/auto-abmelden',
        permanent: true,
      },
      {
        source: '/kosten-autoabmeldung-online/:id(\\d+)',
        destination: '/kosten-autoabmeldung-online',
        permanent: true,
      },
      {
        source: '/anhaenger-abmelden/:id(\\d+)',
        destination: '/anhaenger-abmelden',
        permanent: true,
      },
      {
        source: '/kurzzeitkennzeichen/:id(\\d+)',
        destination: '/kurzzeitkennzeichen',
        permanent: true,
      },
      {
        source: '/:slug/:id(\\d+)',
        destination: '/:slug',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [];
  },

  async headers() {
    return [
      {
        source: '/logo.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/logo.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/insiderwissen',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/insiderwissen/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
