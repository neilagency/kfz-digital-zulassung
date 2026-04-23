import { MetadataRoute } from 'next';
import { getSitemapData, getSiteSettings } from '@/lib/db';
import { CITY_SLUGS, isCitySlug, getResolvedCitySlug } from '@/lib/city-slugs';
import { ALL_BUNDESLAND_SLUGS, BUNDESLAND_SLUG_MAP } from '@/lib/bundesland-slugs';

// Top-priority city slugs (Germany's largest cities by population/traffic)
// These get priority 0.9 + changeFrequency 'daily' for faster Googlebot crawl
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

export const revalidate = 300;
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
  'gebrauchtwagen-ankauf-digital',
  '404-seite-nicht-gefunden',
  'datenschutz',
  'feed',

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
  // Deleted language pages (now 410 Gone)
  'online-arac-kayittan-duesuerme-almanya',
  'ar-ilgha-tasjeel-al-sayara',
  'online-car-deregistration-en',
  // Deleted product page
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

function isValidSlug(slug?: string | null) {
  if (!slug || slug.includes('%') || slug.includes('?') || slug.includes('#')) return false;
  const lower = slug.toLowerCase();
  // WordPress / WooCommerce remnants
  if (
    lower.startsWith('wp-') ||
    lower === 'xmlrpc' ||
    lower === 'feed' ||
    lower.startsWith('product-category') ||
    lower.startsWith('product-tag') ||
    lower.endsWith('.php')
  ) return false;
  // WooCommerce transactional pages
  if (['shop', 'cart', 'checkout', 'kasse', 'warenkorb'].includes(lower)) return false;
  // Spam / gambling patterns
  if (
    lower.startsWith('casino') ||
    lower.startsWith('slot-') ||
    lower.startsWith('ceriabet') ||
    lower.startsWith('togel') ||
    lower.startsWith('gacor')
  ) return false;
  return true;
}

function normalizeUrl(url: string) {
  return url.replace(/\/$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages, posts, products } = await getSitemapData();
  const { siteUrl } = await getSiteSettings();

  const SITE_URL = siteUrl.replace(/\/$/, '');
  const staticDate = new Date('2026-04-16T00:00:00.000Z');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: staticDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/product/fahrzeugabmeldung`,
      lastModified: staticDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/product/auto-online-anmelden`,
      lastModified: staticDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/insiderwissen`,
      lastModified: staticDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/kfz-zulassung-abmeldung-in-deiner-stadt`,
      lastModified: staticDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const productEntries: MetadataRoute.Sitemap = products
    .filter((p) => isValidSlug(p.slug))
    .filter((p) => !EXCLUDED_PRODUCT_SLUGS.has(p.slug))
    .map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt ?? staticDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }));

  const pageEntries: MetadataRoute.Sitemap = pages
    .filter((p) => isValidSlug(p.slug))
    .filter((p) => !EXCLUDED_SLUGS.has(p.slug))
    .filter((p) => !isCitySlug(p.slug))
    .map((p) => ({
      url: `${SITE_URL}/${p.slug}`,
      lastModified: p.updatedAt ?? staticDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  // City entries: dynamic priority based on city importance
  // Top 50 major cities → priority 0.9, daily (fastest indexing)
  // All other cities → priority 0.7, weekly
  const cityEntries: MetadataRoute.Sitemap = Array.from(CITY_SLUGS)
    .filter((slug) => isValidSlug(slug))
    .filter((slug) => !EXCLUDED_SLUGS.has(slug))
    .filter((slug) => getResolvedCitySlug(slug) === slug)
    .map((slug) => {
      const isTop = TOP_PRIORITY_CITY_SLUGS.has(slug);
      return {
        url: `${SITE_URL}/${slug}`,
        lastModified: staticDate,
        changeFrequency: isTop ? ('daily' as const) : ('weekly' as const),
        priority: isTop ? 0.9 : 0.7,
      };
    });

  // Bundesland hub pages: state authority pages → priority 0.85, weekly
  const bundeslandEntries: MetadataRoute.Sitemap = ALL_BUNDESLAND_SLUGS.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: staticDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts
    .filter((p) => isValidSlug(p.slug))
    .filter((p) => !EXCLUDED_POST_SLUGS.has(p.slug))
    .map((p) => ({
      url: `${SITE_URL}/insiderwissen/${p.slug}`,
      lastModified: p.updatedAt ?? staticDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  const allEntries = [
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
