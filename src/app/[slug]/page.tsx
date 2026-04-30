import type { Metadata } from 'next';
import {
  getPageBySlug,
  getPostBySlug,
  getAllPageSlugs,
  buildSEOMetadata,
  getSiteSettings,
  getHomepagePricing,
} from '@/lib/db';
import type { LocalPage } from '@/lib/db';
import { sanitizeHtml } from '@/lib/sanitize';
import { notFound, permanentRedirect } from 'next/navigation';
import CityPageView from '@/components/CityPageView';
import { isCitySlug, getResolvedCitySlug } from '@/lib/city-slugs';
import { getCityPageForSlug } from '@/lib/city-page-data';
import {
  isBundeslandSlug,
  getStateForHubSlug,
  getCitiesForState,
  ALL_BUNDESLAND_SLUGS,
} from '@/lib/bundesland-slugs';
import StateHubView from '@/components/StateHubView';

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;
export const dynamicParams = true;

const RESERVED_SLUGS = new Set([
  'insiderwissen',
  'rechnung',
  'bestellung-erfolgreich',
  'kfz-zulassung-abmeldung-in-deiner-stadt',
  'admin',
  'product',
  'api',
]);

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

function buildCityPage(slug: string): LocalPage {
  const { cityName, model, input } = getCityPageForSlug(slug);
  const now = new Date();

  return {
    id: `city-${slug}`,
    wpPageId: null,
    slug,
    title: model.metaTitle,
    content: '',
    excerpt: '',
    status: 'publish',
    author: '',
    template: '',
    parent: 0,
    menuOrder: 0,
    featuredImage: '',
    metaTitle: model.metaTitle,
    metaDescription: model.metaDescription,
    focusKeywords: '',
    seoScore: 0,
    canonical: '',
    robots: 'index, follow',
    schemaType: '',
    schemaData: '',
    ogTitle: model.metaTitle,
    ogDescription: model.metaDescription,
    ogImage: '',
    ogType: 'website',
    twitterTitle: model.metaTitle,
    twitterDescription: model.metaDescription,
    twitterImage: '',
    twitterCard: 'summary',
    internalLinks: 0,
    externalLinks: 0,
    isFooterPage: false,
    pageType: 'city',
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    ...(input.region && input.region !== cityName ? { region: input.region } : {}),
    ...(input.state ? { state: input.state } : {}),
    ...(input.nearbySlugs?.length ? { nearby: input.nearbySlugs } : {}),
  };
}

export async function generateStaticParams() {
  const pageSlugs = await getAllPageSlugs();

  const TOP_CITY_SLUGS = [
    'berlin-zulassungsstelle',
    'auto-online-abmelden-muenchen',
    'kfz-online-abmelden-koeln',
    'kfz-online-abmelden-dortmund',
    'kfz-online-abmelden-essen',
    'zulassungsservice-stuttgart',
    'zulassungsservice-duesseldorf',
    'kfz-online-abmelden-in-hamburg',
    'zulassungsservice-hannover',
    'zulassungsservice-nuernberg',
    'frankfurt',
    'zulassungsservice-mannheim',
    'kfz-online-abmelden-bremen',
    'dresden-kfz-zulassungsstelle',
    'leipzig',
    'zulassungsservice-bielefeld',
    'auto-online-abmelden-in-bochum',
    'duisburg',
    'zulassungsservice-muenster',
    'aachen',
  ];

  const allSlugs = new Set([
    ...pageSlugs,
    ...TOP_CITY_SLUGS,
    ...ALL_BUNDESLAND_SLUGS,
  ]);

  return Array.from(allSlugs)
    .filter((slug) => slug && !RESERVED_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) return {};

  const settings = await getSiteSettings();
  const baseUrl = stripTrailingSlash(settings.siteUrl);
  const effectiveSlug = getResolvedCitySlug(slug) || slug;

  if (isBundeslandSlug(effectiveSlug)) {
    const stateName = getStateForHubSlug(effectiveSlug);

    if (!stateName) return {};

    const title = `KFZ abmelden in ${stateName} – online ab 19,70 €`;
    const description = `Fahrzeug online abmelden in ${stateName}. Ohne Termin, digital ab 19,70 € und mit offizieller Bestätigung per E-Mail.`;

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      alternates: {
        canonical: `${baseUrl}/${effectiveSlug}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/${effectiveSlug}`,
        siteName: settings.siteName,
        type: 'website',
        locale: 'de_DE',
        images: [
          {
            url: `${baseUrl}/logo.svg`,
            width: 1200,
            height: 630,
            alt: `${settings.siteName} – KFZ online abmelden in ${stateName}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${baseUrl}/logo.svg`],
      },
    };
  }

  if (isCitySlug(effectiveSlug)) {
    const cityPage = buildCityPage(effectiveSlug);
    return buildSEOMetadata(cityPage, baseUrl);
  }

  const page = await getPageBySlug(effectiveSlug);

  if (page && page.status === 'publish') {
    return buildSEOMetadata(page, baseUrl);
  }

  return {};
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) {
    notFound();
  }

  const effectiveSlug = getResolvedCitySlug(slug) || slug;

  if (effectiveSlug !== slug) {
    permanentRedirect(`/${effectiveSlug}`);
  }

  if (isBundeslandSlug(effectiveSlug)) {
    const stateName = getStateForHubSlug(effectiveSlug);

    if (!stateName) {
      notFound();
    }

    const [settings, pricing] = await Promise.all([
      getSiteSettings(),
      getHomepagePricing(),
    ]);

    const cities = getCitiesForState(stateName);

    return (
      <StateHubView
        stateName={stateName}
        hubSlug={effectiveSlug}
        cities={cities}
        settings={settings}
        pricing={pricing}
      />
    );
  }

  if (isCitySlug(effectiveSlug)) {
    const [settings, pricing] = await Promise.all([
      getSiteSettings(),
      getHomepagePricing(),
    ]);

    const cityPage = buildCityPage(effectiveSlug);

    return (
      <CityPageView
        page={cityPage}
        settings={settings}
        pricing={pricing}
      />
    );
  }

  const page = await getPageBySlug(effectiveSlug);

  if (!page || page.status !== 'publish') {
    const post = await getPostBySlug(effectiveSlug);

    if (post && post.status === 'publish') {
      permanentRedirect(`/insiderwissen/${effectiveSlug}`);
    }

    notFound();
  }

  const settings = await getSiteSettings();
  const baseUrl = stripTrailingSlash(settings.siteUrl);

  return <PageView page={page} baseUrl={baseUrl} siteName={settings.siteName} />;
}

function PageView({
  page,
  baseUrl,
  siteName,
}: {
  page: LocalPage;
  baseUrl: string;
  siteName: string;
}) {
  const pageUrl = `${baseUrl}/${page.slug}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: page.metaTitle || page.title,
        description: page.metaDescription || page.excerpt || page.title,
        inLanguage: 'de-DE',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}#website`,
          name: siteName,
          url: baseUrl,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${baseUrl}#organization`,
          name: siteName,
          url: baseUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Startseite',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="bg-gradient-to-br from-dark via-primary-900 to-dark pb-12 pt-28 md:pt-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="mb-4 text-3xl font-extrabold text-white md:text-4xl">
            {page.title}
          </h1>
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
          />
        </div>
      </div>
    </main>
  );
}
