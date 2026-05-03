/** @type {import('next').NextConfig} */

// Add CDN domain to remotePatterns if CDN_BASE_URL is configured
const cdnRemotePattern = (() => {
  const cdnBase = process.env.CDN_BASE_URL || '';
  if (!cdnBase) return null;
  try {
    const url = new URL(cdnBase);
    return {
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      pathname: '/**',
    };
  } catch {
    return null;
  }
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
  },

  serverExternalPackages: [
    'better-sqlite3',
    '@libsql/client',
    '@prisma/adapter-libsql',
    '@prisma/adapter-better-sqlite3',
  ],

  async redirects() {
    return [
      // -----------------------------
      // Priority 1: GSC 404 Fixes
      // -----------------------------
      {
        source: '/alle-staedte',
        destination: '/kfz-zulassung-abmeldung-in-deiner-stadt',
        permanent: true,
      },
       {
        source: '/anhaenger-abmelden-online',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/anhaenger-abmelden-online/:path*',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/lkw-abmelden-online',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/lkw-abmelden-online/:path*',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/muhelos-abmelden',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/muhelos-abmelden/:path*',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/nuertingen',
        destination: '/kfz-zulassung-abmeldung-in-deiner-stadt',
        permanent: true,
      },
      {
        source: '/nuertingen/:path*',
        destination: '/kfz-zulassung-abmeldung-in-deiner-stadt',
        permanent: true,
      },
      {
        source: '/kfz-abmeldung',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/kfz-abmelden',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/kfz-abmelden/:path*',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
       {
        source: '/auto-fix-abmelden',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/auto-fix-abmelden/',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/baden-wuerttemberg',
        destination: '/kfz-zulassung-abmeldung-in-deiner-stadt',
        permanent: true,
      },
      {
        source: '/kurzzeitkennzeichen/49',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/online-zulassung-kfz/46',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/auto-abmelden-ohne-termin/3',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/anhaenger-abmelden-2/4',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/anhaenger-abmelden-2/31',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/kfz-anmelden/3',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/online-kfz-abmelden/23',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/kann-ich-mein-fahrzeug-angemeldet-ubergeben',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/kfz-online-anmelden',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/$',
        destination: '/',
        permanent: true,
      },
      {
        source: '/kosten-autoabmeldung-online',
        destination: '/insiderwissen/was-kostet-auto-abmelden-online-vs-zulassungsstelle',
        permanent: true,
      },
      {
        source: '/kosten-autoabmeldung-online/:path*',
        destination: '/insiderwissen/was-kostet-auto-abmelden-online-vs-zulassungsstelle',
        permanent: true,
      },
      {
        source: '/online-auto-anmelden',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/rotes-kennzeichen-beantragen',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/anhaenger-abmelden-2',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/anhaenger-abmelden-2/:path*',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/kurzzeitkennzeichen/:path*',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/kurzzeitkennzeichen-lkw/:path*',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },

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
      // Blog / Archive / Feed remnants
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
      // Product / Taxonomy / Embed remnants
      // -----------------------------
      {
        source: '/product',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/product/auto-online-abmelden',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/product/fahrzeug-online-anmelden',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
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
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/kosten-der-fahrzeugabmeldung',
        destination: '/insiderwissen/was-kostet-auto-abmelden',
        permanent: true,
      },
      {
        source: '/abmeldung-digital/:id(\\d+)',
        destination: '/insiderwissen/zulassung-digital',
        permanent: true,
      },
      {
        source: '/online-zulassung-kfz/:id(\\d+)',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/online-kfz-abmelden/:id(\\d+)',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/online-auto-abmelden-ikfz/:id(\\d+)',
        destination: '/insiderwissen/wie-melde-ich-mein-auto-online-ab',
        permanent: true,
      },
      {
        source: '/motorrad-abmelden-online/:id(\\d+)',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/wohnmobil-abmelden/:id(\\d+)',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
            {
        source: '/lkw-abmelden-online/:id(\\d+)',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },

      // -----------------------------
      // City / Local redirects
      // -----------------------------
      {
        source: '/essen',
        destination: '/kfz-online-abmelden-essen',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-essen',
        destination: '/kfz-online-abmelden-essen',
        permanent: true,
      },
      {
        source: '/auto-abmelden-essen',
        destination: '/kfz-online-abmelden-essen',
        permanent: true,
      },
      {
        source: '/kfz-abmelden-essen',
        destination: '/kfz-online-abmelden-essen',
        permanent: true,
      },
      {
        source: '/fahrzeug-abmelden-essen',
        destination: '/kfz-online-abmelden-essen',
        permanent: true,
      },
      {
        source: '/fahrzeug-online-abmelden-essen',
        destination: '/kfz-online-abmelden-essen',
        permanent: true,
      },
      {
        source: '/kfz-online-abmelden-in-essen',
        destination: '/kfz-online-abmelden-essen',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-in-essen',
        destination: '/kfz-online-abmelden-essen',
        permanent: true,
      },
      {
        source: '/berlin',
        destination: '/berlin-zulassungsstelle',
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
        source: '/kfz-online-abmelden-hamburg',
        destination: '/kfz-online-abmelden-in-hamburg',
        permanent: true,
      },
      {
        source: '/hamburg',
        destination: '/kfz-online-abmelden-in-hamburg',
        permanent: true,
      },
      {
        source: '/auto-abmelden-hamburg',
        destination: '/kfz-online-abmelden-in-hamburg',
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
        source: '/bochum',
        destination: '/auto-online-abmelden-in-bochum',
        permanent: true,
      },
      {
        source: '/gelsenkirchen',
        destination: '/auto-abmelden-online-in-gelsenkirchen',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-in-gelsenkirchen',
        destination: '/insiderwissen/auto-abmelden-gelsenkirchen',
        permanent: true,
      },
      {
        source: '/wuppertal',
        destination: '/auto-online-abmelden-in-wuppertal',
        permanent: true,
      },
      {
        source: '/rhein-kreis-neuss',
        destination: '/auto-online-abmelden-in-neuss',
        permanent: true,
      },
      {
        source: '/zulassungsservice-bremen',
        destination: '/kfz-online-abmelden-bremen',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-in-laupheim',
        destination: '/laupheim',
        permanent: true,
      },
      {
        source: '/laupenheim',
        destination: '/laupheim',
        permanent: true,
      },
      {
        source: '/laichingen-stadt',
        destination: '/auto-online-abmelden-in-laichingen',
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

      // -----------------------------
      // Other safe mappings
      // -----------------------------
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
        source: '/idioten-test',
        destination: '/',
        permanent: true,
      },
      {
        source: '/leichlingen',
        destination: '/insiderwissen',
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
      {
        source: '/mercedes-rueckruf-lenkprobleme',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/auto-verkaufen-tuev-pflicht',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/wo-ist-der-7-stellige-sicherheitscode-im-fahrzeugschein-einfach-erklaert',
        destination: '/insiderwissen/wo-ist-der-7-stellige-sicherheitscode-im-fahrzeugschein',
        permanent: true,
      },
      {
        source: '/probleme-mit-zulassung-digital-blackbird',
        destination: '/insiderwissen/online-zulassung-funktioniert-nicht',
        permanent: true,
      },
      {
        source: '/kfz',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/ist-der-halter-im-fahrzeugbrief-auch-der-eigentuemer',
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/evb-nummer-anfordern',
        destination: '/evb',
        permanent: true,
      },
      {
        source: '/ikfz-kosten-preise',
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/online-auto-abmelden-2024',
        destination: '/insiderwissen/auto-online-abmelden-2026',
        permanent: true,
      },
      {
        source: '/kfz-online-abmelden-2-0',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
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
        destination: '/product/auto-online-anmelden',
        permanent: true,
      },
      {
        source: '/auto-online-ummelden-wie-geht-das',
        destination: '/insiderwissen/fahrzeug-ummelden',
        permanent: true,
      },
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
        destination: '/insiderwissen',
        permanent: true,
      },
      {
        source: '/erklaervideo',
        destination: '/vedio',
        permanent: true,
      },
      {
        source: '/auto-online-abmelden-im-winter',
        destination: '/insiderwissen/kfz-abmelden-im-winter',
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
      // Important: direct targets only, no redirect chains.
      // -----------------------------
      {
        source: '/auto-abmelden/:id(\\d+)',
        destination: '/product/fahrzeugabmeldung',
        permanent: true,
      },
      {
        source: '/anhaenger-abmelden/:id(\\d+)',
        destination: '/product/fahrzeugabmeldung',
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
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
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
