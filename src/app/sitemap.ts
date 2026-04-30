import { MetadataRoute } from 'next';
import { getSitemapData, getSiteSettings } from '@/lib/db';
import { CITY_SLUGS, isCitySlug, getResolvedCitySlug } from '@/lib/city-slugs';
import { ALL_BUNDESLAND_SLUGS } from '@/lib/bundesland-slugs';

export const revalidate = 300;

const STATIC_LAST_MODIFIED = new Date('2026-04-16T00:00:00.000Z');

/**
 * Top-priority city slugs:
 * Wichtige Städte bekommen höhere Priorität und daily changeFrequency.
 * Das ist kein Ranking-Trick, aber hilft Google bei Crawl-Priorisierung.
 */
const TOP_PRIORITY_CITY_SLUGS = new Set([
  'berlin-zulassungsstelle',
  'auto-online-abmelden-muenchen',
  'kfz-online-abmelden-in-hamburg',
  'kfz-online-abmelden-koeln',
  'frankfurt',
  'zulassungsservice-stuttgart',
  'zulassungsservice-duesseldorf',
  'kfz-online-abmelden-dortmund',
  'kfz-online-abmelden-essen',
  'leipzig',
  'kfz-online-abmelden-bremen',
  'dresden-kfz-zulassungsstelle',
  'zulassungsservice-hannover',
  'zulassungsservice-nuernberg',
  'duisburg',
  'auto-online-abmelden-in-bochum',
  'zulassungsservice-wuppertal',
  'zulassungsservice-bielefeld',
  'bonn',
  'zulassungsservice-muenster',
  'karlsruhe',
  'zulassungsservice-mannheim',
  'augsburg',
  'wiesbaden',
  'auto-abmelden-online-in-gelsenkirchen',
  'moenchengladbach',
  'braunschweig',
  'chemnitz',
  'kiel',
  'aachen',
  'halle',
  'magdeburg',
  'freiburg',
  'krefeld',
  'mainz',
  'luebeck',
  'erfurt',
  'oberhausen',
  'rostock',
  'kassel',
  'hagen',
  'hamm',
  'saarbruecken',
  'muelheim',
  'potsdam',
  'ludwigshafen',
  'oldenburg',
  'leverkusen',
  'osnabrueck',
  'solingen',
]);

/**
 * Diese Slugs dürfen NICHT in die Sitemap:
 * - Systemseiten
 * - alte WordPress/WooCommerce-Seiten
 * - gelöschte/weitergeleitete URLs
 * - alte Duplicate-Seiten
 */
const EXCLUDED_SLUGS = new Set([
  'blog',
  'shop',
  'kasse',
  'my-account',
  'warenkorb',
  'mein-konto',
  'bestellung-erfolgreich',
  'admin',
  'api',
  'product',
  'insiderwissen',
  'kfz-zulassung-abmeldung-in-deiner-stadt',
  'rechnung',
  'orte',
  'fahrzeugabmeldung',
  '404-seite-nicht-gefunden',
  'datenschutz',
  'feed',

  // Alte / doppelte Stadt-URLs
  'kfz-online-abmelden-hamburg',
  'kfz-abmelden-berlin',
  'kfz-online-abmelden-berlin',
  'kfz-online-abmelden-muenchen',
  'auto-online-abmelden-muenchen-2',
  'bernkastel-wittlich-2',
  'bonn-2',
  'ehrenkirchen-2',
  'ettlingen-2',
  'hagen-2',
  'kraichtal-2',
  'kuenzelsau-2',
  'kuenzelsau-3',
  'kusel-2',
  'kyffhaeuserkreis-2',
  'landau-in-der-pfalz-2',
  'lueneburg-2',
  'oberhausen-2',
  'oestringen-2',
  'paderborn-2',
  'paderborn-3',
  'recklinghausen-2',
  'wiesbaden-2',
  'worms-2',

  // Alte Ratgeber-/Service-Seiten, die nicht mehr als Hauptseiten indexiert werden sollen
  'anhaenger-abmelden-2',
  'fahrzeugzulassung-online',
  'auto-online-abmelden-ohne-ausweis',
  'sicherheitscode',
  'sicherheitscode-kennzeichen-freilegen',
  'fahrzeugschein',
  'auto-abmelden-leverkusen',
  'vollmacht-auto-anmelden',
  'zulassung-digital',
  'auto-online-abmelden-aus-dem-ausland',
  'auto-abmelden-paderborn',
  'auto-online-abmelden-in-gelsenkirchen',
  'auto-online-abmelden-ohne-elster',
  'zulassungsstelle',
  'online-abmelden-kfz',
  'kfz-kennzeichen-online-bestellen-anleitung',
  'ausserbetriebsetzung-eines-fahrzeuges',
  'online-auto-abmelden-ikfz',
  'ikfz-online',
  'auto-online-abmelden-alle-seiten',

  // Gelöschte Sprachseiten
  'online-arac-kayittan-duesuerme-almanya',
  'ar-ilgha-tasjeel-al-sayara',
  'online-car-deregistration-en',

  // Gelöschte Produkt-/Projektseite
  'gebrauchtwagen-ankauf-digital',
]);

const EXCLUDED_POST_SLUGS = new Set([
  'ikfz-online',
  'auto-abmelden',
  'online-abmeldung-funktioniert-nicht',
  'kfz-online-abmelden',
  'auto-online-abmelden',
  'was-kostet-die-abmeldung-eines-autos',
  'auto-online-abmelden-erfahrungen-risiken-sicherheit',

  'vollmacht-auto-anmelden',
  'zulassungsservice',
  'online-pkw-abmelden',
  'auto-online-abmelden-aus-dem-ausland',
  'auto-abmelden-leverkusen',
  'auto-abmelden-gelsenkirchen',
  'auto-online-abmelden-ohne-elster',
  'auto-online-abmelden-ohne-ausweis',
  'zulassungsstelle',
  'fahrzeug-online-zulassen',
  'ausserbetriebsetzung-eines-fahrzeuges',
  'kfz-kennzeichen-online-bestellen-anleitung',
  'sicherheitscode',
  'fin-fahrzeugschein',
  'auto-abmelden-duisburg',
  'auto-abmelden-oberhausen',
]);

const EXCLUDED_PRODUCT_SLUGS = new Set([
  'fahrzeug-online-anmelden',
  'fahrzeugabmeldung',
  'auto-online-anmelden',
]);

/**
 * Harte Spam-/Hack-Filter:
 * Diese Muster dürfen niemals in die Sitemap.
 * Wichtig gegen alte WordPress-Hacks, Casino-Spam, Porno-Spam, Pharma-Spam usw.
 */
const BLOCKED_SLUG_PATTERNS = [
  // WordPress / alte Systemreste
  'wp-admin',
  'wp-content',
  'wp-includes',
  'xmlrpc',
  'wp-json',
  'wp-login',
  'wp-config',
  'readme.html',

  // WooCommerce / Taxonomien / Feed-Reste
  'product-category',
  'product-tag',
  'feed',
  'comments',
  'trackback',

  // Casino / Gambling / Betting
  'casino',
  'slot',
  'slots',
  'gacor',
  'togel',
  'bet',
  'betting',
  'bonus',
  'jackpot',
  'poker',
  'blackjack',
  'roulette',
  'ceriabet',
  'klikwin',
  'win88',
  'qq',
  'judi',
  'taruhan',

  // Adult / Porn
  'porn',
  'porno',
  'sex',
  'xxx',
  'escort',
  'erotik',
  'adult',
  'camgirl',
  'onlyfans',
  'nude',
  'nudes',

  // Pharma / Scam
  'viagra',
  'cialis',
  'pharma',
  'loan',
  'payday',
  'crypto-scam',
  'airdrop',
  'wallet-drain',
  'hack',
] as const;

function isValidSlug(slug?: string | null): boolean {
  if (!slug) return false;

  const lower = slug.trim().toLowerCase();

  if (!lower) return false;

  // Keine kaputten oder gefährlichen Zeichen in Sitemap-URLs
  if (
    lower.includes('%') ||
    lower.includes('?') ||
    lower.includes('#') ||
    lower.includes('&') ||
    lower.includes('=') ||
    lower.includes('\\') ||
    lower.includes('//') ||
    lower.includes('..')
  ) {
    return false;
  }

  // Keine Dateien / PHP / alte Script-Reste
  if (
    lower.endsWith('.php') ||
    lower.endsWith('.asp') ||
    lower.endsWith('.aspx') ||
    lower.endsWith('.jsp') ||
    lower.endsWith('.cgi') ||
    lower.endsWith('.zip') ||
    lower.endsWith('.rar') ||
    lower.endsWith('.7z') ||
    lower.endsWith('.tar') ||
    lower.endsWith('.gz') ||
    lower.endsWith('.sql') ||
    lower.endsWith('.env')
  ) {
    return false;
  }

  // Keine WooCommerce-/Systemseiten
  if (
    [
      'shop',
      'cart',
      'checkout',
      'kasse',
      'warenkorb',
      'mein-konto',
      'my-account',
      'admin',
      'api',
      'feed',
      'xmlrpc',
    ].includes(lower)
  ) {
    return false;
  }

  // Keine bekannten Spam-/Hack-Muster
  if (BLOCKED_SLUG_PATTERNS.some((pattern) => lower.includes(pattern))) {
    return false;
  }

  return true;
}

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/+$/, '');
}

function cleanDate(date: Date | string | null | undefined): Date {
  if (!date) return STATIC_LAST_MODIFIED;

  const parsed = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return STATIC_LAST_MODIFIED;
  }

  return parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ pages, posts, products }, settings] = await Promise.all([
    getSitemapData(),
    getSiteSettings(),
  ]);

  const SITE_URL = normalizeSiteUrl(settings.siteUrl);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/product/fahrzeugabmeldung`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/product/auto-online-anmelden`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/insiderwissen`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/kfz-zulassung-abmeldung-in-deiner-stadt`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const productEntries: MetadataRoute.Sitemap = products
    .filter((p) => isValidSlug(p.slug))
    .filter((p) => !EXCLUDED_PRODUCT_SLUGS.has(p.slug))
    .map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: cleanDate(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  const pageEntries: MetadataRoute.Sitemap = pages
    .filter((p) => isValidSlug(p.slug))
    .filter((p) => !EXCLUDED_SLUGS.has(p.slug))
    .filter((p) => !isCitySlug(p.slug))
    .map((p) => ({
      url: `${SITE_URL}/${p.slug}`,
      lastModified: cleanDate(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  /**
   * City pages:
   * Nur echte Ziel-URLs aufnehmen.
   * Weiterleitungs-/Alias-Slugs bleiben draußen, damit Google nur die Canonical-Ziele sieht.
   */
  const cityEntries: MetadataRoute.Sitemap = Array.from(CITY_SLUGS)
    .filter((slug) => isValidSlug(slug))
    .filter((slug) => !EXCLUDED_SLUGS.has(slug))
    .filter((slug) => getResolvedCitySlug(slug) === slug)
    .map((slug) => {
      const isTopCity = TOP_PRIORITY_CITY_SLUGS.has(slug);

      return {
        url: `${SITE_URL}/${slug}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: isTopCity ? ('daily' as const) : ('weekly' as const),
        priority: isTopCity ? 0.9 : 0.7,
      };
    });

  /**
   * Bundesland-Hubseiten:
   * Wichtig für semantische Struktur: Stadt → Bundesland → Deutschland.
   */
  const bundeslandEntries: MetadataRoute.Sitemap = ALL_BUNDESLAND_SLUGS
    .filter((slug) => isValidSlug(slug))
    .map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));

  const blogEntries: MetadataRoute.Sitemap = posts
    .filter((p) => isValidSlug(p.slug))
    .filter((p) => !EXCLUDED_POST_SLUGS.has(p.slug))
    .map((p) => ({
      url: `${SITE_URL}/insiderwissen/${p.slug}`,
      lastModified: cleanDate(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  const allEntries: MetadataRoute.Sitemap = [
    ...staticRoutes,
    ...productEntries,
    ...pageEntries,
    ...cityEntries,
    ...bundeslandEntries,
    ...blogEntries,
  ];

  const seen = new Set<string>();

  return allEntries.filter((entry) => {
    const normalized = normalizeUrl(entry.url);

    if (seen.has(normalized)) return false;

    seen.add(normalized);
    return true;
  });
}
