/**
 * Local database access layer — replaces wordpress.ts
 * All data served from local SQLite via Prisma.
 * Zero runtime dependency on WordPress.
 */

import prisma from './prisma';
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  PHONE_NUMBER,
  PHONE_LINK,
  WHATSAPP_LINK,
  EMAIL,
  SOCIAL_LINKS,
} from './constants';
import { unstable_cache } from 'next/cache';
import { CITY_SLUG_ALIASES, getResolvedCitySlug } from '@/lib/city-slugs';

const ALIAS_SOURCE_SLUGS = new Set(Object.keys(CITY_SLUG_ALIASES));

// ─── Types ──────────────────────────────────────
export interface LocalPost {
  id: string;
  wpPostId: number | null;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  status: string;
  author: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonical: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  category: string;
  tags: string;
  views: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalPage {
  id: string;
  wpPageId: number | null;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  status: string;
  author: string;
  template: string;
  parent: number;
  menuOrder: number;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string;
  seoScore: number;
  canonical: string;
  robots: string;
  schemaType: string;
  schemaData: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterCard: string;
  internalLinks: number;
  externalLinks: number;
  isFooterPage: boolean;
  pageType: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Blog Posts ─────────────────────────────────

export async function getAllPosts(
  page = 1,
  perPage = 12,
  categoryFilter?: string,
): Promise<{ posts: LocalPost[]; totalPages: number; total: number }> {
  const cacheKey = `posts-p${page}-pp${perPage}-cat${categoryFilter || 'all'}`;

  return unstable_cache(
    async () => {
      const where: any = { status: 'publish' };

      if (categoryFilter) {
        where.category = { contains: categoryFilter };
      }

      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          orderBy: { publishedAt: 'desc' },
          skip: (page - 1) * perPage,
          take: perPage,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            featuredImage: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
            category: true,
            status: true,
          },
        }),
        prisma.blogPost.count({ where }),
      ]);

      return {
        posts: posts as LocalPost[],
        totalPages: Math.ceil(total / perPage),
        total,
      };
    },
    [cacheKey],
    { tags: ['blog-posts'], revalidate: 300 },
  )();
}

export async function getPostBySlug(slug: string): Promise<LocalPost | null> {
  return unstable_cache(
    async () => {
      const post = await prisma.blogPost.findUnique({ where: { slug } });
      return post as LocalPost | null;
    },
    [`post-${slug}`],
    { tags: ['blog-posts'], revalidate: 60 },
  )();
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'publish' },
    select: { slug: true },
  });

  return posts.map((p) => p.slug);
}

export const getCategories = unstable_cache(
  async (): Promise<{ id: string; name: string; slug: string; count: number }[]> => {
    return prisma.category.findMany({
      where: { count: { gt: 0 } },
      orderBy: { count: 'desc' },
      select: { id: true, name: true, slug: true, count: true },
    });
  },
  ['blog-categories'],
  { tags: ['blog-categories'], revalidate: 300 },
);

// ─── Pages ──────────────────────────────────────

export async function getPageBySlug(slug: string): Promise<LocalPage | null> {
  const effectiveSlug = getResolvedCitySlug(slug) || slug;

  return unstable_cache(
    async () => {
      const page = await prisma.page.findUnique({ where: { slug: effectiveSlug } });
      return page as LocalPage | null;
    },
    [`page-${effectiveSlug}`],
    { tags: ['pages'], revalidate: 60 },
  )();
}

export async function getAllPageSlugs(): Promise<string[]> {
  const pages = await prisma.page.findMany({
    where: { status: 'publish' },
    select: { slug: true },
  });

  return pages
    .map((p) => p.slug)
    .filter((slug) => !ALIAS_SOURCE_SLUGS.has(slug));
}

export const getFooterPages = unstable_cache(
  async (): Promise<{ slug: string; title: string }[]> => {
    return prisma.page.findMany({
      where: { isFooterPage: true, status: 'publish' },
      select: { slug: true, title: true },
      orderBy: { menuOrder: 'asc' },
    });
  },
  ['footer-pages'],
  { revalidate: 300 },
);

// ─── Sitemap Data ───────────────────────────────

export async function getSitemapData(): Promise<{
  pages: { slug: string; updatedAt: Date }[];
  posts: { slug: string; updatedAt: Date }[];
  products: { slug: string; updatedAt: Date }[];
}> {
  return unstable_cache(
    async () => {
      const [pages, posts, products] = await Promise.all([
        prisma.page.findMany({
          where: { status: 'publish' },
          select: { slug: true, updatedAt: true },
        }),
        prisma.blogPost.findMany({
          where: { status: 'publish' },
          select: { slug: true, updatedAt: true },
        }),
        prisma.product.findMany({
          where: { isActive: true },
          select: { slug: true, updatedAt: true },
        }),
      ]);

      return {
        pages: pages.filter((p) => !ALIAS_SOURCE_SLUGS.has(p.slug)),
        posts,
        products,
      };
    },
    ['sitemap-data'],
    { tags: ['pages', 'blog-posts', 'products'], revalidate: 300 },
  )();
}

// ─── Products ──────────────────────────────────

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
  });
}

export async function getAllActiveProducts() {
  return unstable_cache(
    async () => {
      return prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    },
    ['all-active-products'],
    { tags: ['products'], revalidate: 60 },
  )();
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return products.map((p) => p.slug);
}

// ─── Payment Gateways ───────────────────────────

// Map DB gatewayId to checkout paymentMethod ID (Mollie-friendly)
const GATEWAY_ID_MAP: Record<string, string> = {
  mollie_creditcard: 'credit_card',
  mollie_applepay: 'apple_pay',
  mollie_klarna: 'klarna',
  paypal: 'paypal',
  sepa: 'sepa',
};

// Reverse map: checkout ID → DB gatewayId
const REVERSE_GATEWAY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(GATEWAY_ID_MAP).map(([dbId, checkoutId]) => [checkoutId, dbId]),
);

export function getCheckoutIdForGateway(dbGatewayId: string): string {
  return GATEWAY_ID_MAP[dbGatewayId] || dbGatewayId;
}

export function getDbGatewayId(checkoutId: string): string {
  return REVERSE_GATEWAY_MAP[checkoutId] || checkoutId;
}

export async function getEnabledPaymentMethods() {
  const gateways = await prisma.paymentGateway.findMany({
    where: { isEnabled: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      gatewayId: true,
      name: true,
      description: true,
      fee: true,
      icon: true,
    },
  });

  return gateways.map((g) => ({
    id: GATEWAY_ID_MAP[g.gatewayId] || g.gatewayId,
    label: g.name,
    description: g.description,
    fee: g.fee,
    icon: g.icon,
  }));
}

/**
 * Get a payment gateway config by checkout method ID (e.g. 'credit_card').
 * Used server-side in checkout to get the fee & label from DB (NOT hardcoded).
 */
export async function getPaymentGatewayByCheckoutId(checkoutId: string) {
  const dbId = REVERSE_GATEWAY_MAP[checkoutId] || checkoutId;

  const gw = await prisma.paymentGateway.findUnique({
    where: { gatewayId: dbId },
  });

  if (!gw || !gw.isEnabled) return null;

  return {
    id: checkoutId,
    dbGatewayId: gw.gatewayId,
    label: gw.name,
    fee: gw.fee,
    description: gw.description,
    icon: gw.icon,
  };
}

// ─── Product Pricing (cached) ───────────────────

/**
 * Get the base pricing info for products shown on the homepage.
 * Cached with tag 'products' for quick revalidation.
 */
export const getHomepagePricing = unstable_cache(
  async () => {
    const [abmeldung, anmeldung] = await Promise.all([
      prisma.product.findUnique({
        where: { slug: 'fahrzeugabmeldung' },
        select: { price: true, name: true, slug: true },
      }),
      prisma.product.findUnique({
        where: { slug: 'auto-online-anmelden' },
        select: { price: true, name: true, slug: true },
      }),
    ]);

    return {
      abmeldungPrice: abmeldung?.price ?? 19.7,
      abmeldungPriceFormatted: formatPrice(abmeldung?.price ?? 19.7),
      anmeldungPrice: anmeldung?.price ?? 99.7,
      anmeldungPriceFormatted: formatPrice(anmeldung?.price ?? 99.7),
    };
  },
  ['homepage-pricing'],
  { tags: ['products'], revalidate: 60 },
);

/**
 * Get enabled payment method labels for display purposes (e.g. PricingBox).
 * Cached with tag 'payment-gateways'.
 */
export const getPaymentMethodLabels = unstable_cache(
  async () => {
    const methods = await getEnabledPaymentMethods();
    return methods.map((m) => m.label);
  },
  ['payment-method-labels'],
  { tags: ['payment-gateways'], revalidate: 60 },
);

/**
 * Read site settings from the Setting table and return a normalized object
 * with sensible fallbacks to constants defined in `src/lib/constants.ts`.
 */
export const getSiteSettings = unstable_cache(
  async () => {
    const rows = await prisma.setting.findMany();
    const map: Record<string, string> = {};

    for (const r of rows) {
      map[`${r.group}/${r.key}`] = r.value;
      map[r.key] = r.value;
    }

    const siteName = map['general/site_name'] || map['site_name'] || SITE_NAME;
    const siteDescription =
      map['general/site_description'] || map['site_description'] || SITE_DESCRIPTION;

    // Always use production URL — never expose localhost in live responses
    const rawSiteUrl = map['general/site_url'] || map['site_url'] || SITE_URL;
    const siteUrl =
      rawSiteUrl.includes('localhost') || rawSiteUrl.includes('127.0.0.1')
        ? SITE_URL
        : rawSiteUrl.replace(/\/$/, '');

    const companyName = map['general/company_name'] || SITE_NAME;

    const phone = map['contact/phone'] || PHONE_NUMBER;
    const phoneLink = map['contact/phone']
      ? `tel:${map['contact/phone'].replace(/\s+/g, '')}`
      : PHONE_LINK;
    const whatsapp = map['contact/whatsapp'] || WHATSAPP_LINK;
    const email = map['contact/email'] || EMAIL;

    const social = {
      facebook: map['social/facebook'] || SOCIAL_LINKS.facebook,
      instagram: map['social/instagram'] || SOCIAL_LINKS.instagram,
      youtube: map['social/youtube'] || SOCIAL_LINKS.youtube,
      tiktok: map['social/tiktok'] || SOCIAL_LINKS.tiktok,
    };

    return {
      siteName,
      siteDescription,
      siteUrl,
      companyName,
      phone,
      phoneLink,
      whatsapp,
      email,
      social,
    };
  },
  ['site-settings'],
  { tags: ['site-settings'], revalidate: 300 },
);

// ─── Helpers ────────────────────────────────────

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

/** Decode common HTML entities in titles/descriptions */
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…');
}

export function formatDate(dateInput: string | Date): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a number as a German-style price string (e.g. "19,70 €").
 */
export function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

/**
 * Build SEO metadata for a page or post.
 * Respects item.canonical first; otherwise falls back to siteUrl + slug.
 */
export function buildSEOMetadata(
  item: {
    title: string;
    slug: string;
    excerpt?: string;
    metaTitle?: string;
    metaDescription?: string;
    canonical?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    twitterCard?: string;
    robots?: string;
    featuredImage?: string;
    publishedAt?: Date | null;
    updatedAt?: Date;
  },
  siteUrl: string,
) {
  const rawTitle = decodeHtmlEntities(item.metaTitle || item.title);
  const maxTitleLen = 60;

  const title =
    rawTitle.length > maxTitleLen
      ? rawTitle.slice(0, maxTitleLen - 1).replace(/\s+\S*$/, '') + '…'
      : rawTitle;

  const description = decodeHtmlEntities(
    item.metaDescription || (item.excerpt ? stripHtml(item.excerpt).slice(0, 160) : ''),
  );

  const cleanSiteUrl = siteUrl.replace(/\/$/, '');
  const cleanSlug = item.slug.replace(/^\/|\/$/g, '');

  const canonicalUrl = item.canonical
    ? item.canonical.startsWith('http://') || item.canonical.startsWith('https://')
      ? item.canonical.replace(/\/$/, '')
      : `${cleanSiteUrl}/${item.canonical.replace(/^\/|\/$/g, '')}`
    : `${cleanSiteUrl}/${cleanSlug}`;

  const image = item.ogImage || item.featuredImage || '';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots:
      process.env.NODE_ENV !== 'production' || process.env.PREVIEW_MODE
        ? { index: false, follow: false }
        : item.robots && item.robots !== 'index, follow'
          ? {
              index: !item.robots.includes('noindex'),
              follow: !item.robots.includes('nofollow'),
            }
          : { index: true, follow: true },
    openGraph: {
      title: item.ogTitle || title,
      description: item.ogDescription || description,
      url: canonicalUrl,
      type: (
        [
          'website',
          'article',
          'book',
          'profile',
          'music.song',
          'music.album',
          'music.playlist',
          'music.radio_station',
          'video.movie',
          'video.episode',
          'video.tv_show',
          'video.other',
        ].includes(item.ogType || '')
          ? (item.ogType as any)
          : 'article'
      ),
      ...(item.publishedAt && {
        publishedTime: new Date(item.publishedAt).toISOString(),
      }),
      ...(item.updatedAt && {
        modifiedTime: new Date(item.updatedAt).toISOString(),
      }),
      ...(image && {
        images: [{ url: image, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: (item.twitterCard as any) || 'summary_large_image',
      title: item.twitterTitle || item.ogTitle || title,
      description: item.twitterDescription || item.ogDescription || description,
      ...(item.twitterImage || image ? { images: [item.twitterImage || image] } : {}),
    },
  };
}
