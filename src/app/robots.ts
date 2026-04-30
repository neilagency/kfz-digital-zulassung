import { MetadataRoute } from 'next';
import { getSiteSettings } from '@/lib/db';

function cleanSiteUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await getSiteSettings();

  const SITE_URL = cleanSiteUrl(siteUrl);

  const isProduction =
    process.env.NODE_ENV === 'production' && !process.env.PREVIEW_MODE;

  if (!isProduction) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/',
          '/logo.svg',
          '/favicon.ico',
          '/icon-48x48.png',
          '/icon-192x192.png',
          '/icon-512x512.png',
          '/apple-touch-icon.png',
          '/site.webmanifest',
        ],
        disallow: [
          // Interne Bereiche
          '/api/',
          '/admin/',
          '/konto',
          '/rechnung',
          '/bestellung-erfolgreich',
          '/anmelden',

          // WordPress Altlasten / bekannte Angriffsziele
          '/wp-*',
          '/wp-admin/',
          '/wp-content/',
          '/wp-includes/',
          '/xmlrpc.php',
          '/wp-login.php',
          '/wp-json/',
          '/wp-cron.php',

          // WordPress Archive / Feed / unnötige Indexseiten
          '/feed',
          '/feed/',
          '/*/feed/',
          '/category/',
          '/tag/',
          '/author/',
          '/comments/',
          '/*?replytocom=',

          // WooCommerce Altlasten / Transaktionsseiten
          '/shop',
          '/cart',
          '/checkout',
          '/kasse',
          '/warenkorb',
          '/my-account',
          '/mein-konto',
          '/product-category/',
          '/product-tag/',

          // Suche, Filter, Parameter-Müll
          '/search',
          '/suche',
          '/*?s=',
          '/*?orderby=',
          '/*?filter',
          '/*?add-to-cart=',
          '/*?utm_',
          '/*?fbclid=',
          '/*?gclid=',
          '/*?msclkid=',

          // Typische Spam-/Hack-Muster
          '/casino/',
          '/slot/',
          '/slots/',
          '/togel/',
          '/gacor/',
          '/maxwin/',
          '/jackpot/',
          '/bet/',
          '/betting/',
          '/poker/',
          '/porn/',
          '/porno/',
          '/sex/',
          '/adult/',
          '/escort/',
          '/viagra/',
          '/cialis/',
          '/levitra/',
          '/pharma/',
          '/loan/',
          '/payday/',
          '/crypto-scam/',
          '/ceriabet/',
          '/klikwin88/',

          // Dateitypen, die nicht in den Index sollen
          '/*.php$',
          '/*.asp$',
          '/*.aspx$',
          '/*.cgi$',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
