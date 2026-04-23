import { MetadataRoute } from 'next';
import { getSiteSettings } from '@/lib/db';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await getSiteSettings();

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
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/konto',
          '/rechnung',
          '/bestellung-erfolgreich',
          '/anmelden',
          // WordPress remnants
          '/wp-*',
          '/xmlrpc.php',
          '/feed',
          '/category/',
          '/tag/',
          '/author/',
          // WooCommerce
          '/shop',
          '/cart',
          '/checkout',
          '/kasse',
          '/warenkorb',
          '/my-account',
          '/mein-konto',
          '/product-category/',
          '/product-tag/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
