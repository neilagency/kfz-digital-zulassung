import { Metadata } from 'next';
import {
  getPageBySlug,
  getPostBySlug,
  getAllPageSlugs,
  buildSEOMetadata,
  getSiteSettings,
  getHomepagePricing,
  LocalPage,
} from '@/lib/db';
import { sanitizeHtml } from '@/lib/sanitize';
import { notFound, permanentRedirect } from 'next/navigation';
import CityPageView from '@/components/CityPageView';
import {
  isCitySlug,
  getResolvedCitySlug,
} from '@/lib/city-slugs';
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
    robots: model.seoGate.indexable ? 'index, follow' : 'noindex, follow',
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

  const allSlugs = new Set([...pageSlugs, ...TOP_CITY_SLUGS, ...ALL_BUNDESLAND_SLUGS]);

  return Array.from(allSlugs)
    .filter((slug) => !RESERVED_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) return {};

  const effectiveSlug = getResolvedCitySlug(slug) || slug;

  if (isBundeslandSlug(effectiveSlug)) {
    const stateName = getStateForHubSlug(effectiveSlug)!;
    const settings = await getSiteSettings();
    return {
      title: `KFZ abmelden in ${stateName} – Online, ohne Termin | ab 19,70 €`,
      description: `Fahrzeug online abmelden in allen Städten und Landkreisen in ${stateName}. Ohne Termin, ohne Ausweis-App, digital ab 19,70 €. Offizielle Bestätigung per E-Mail.`,
      alternates: { canonical: `${settings.siteUrl}/${effectiveSlug}` },
      robots: { index: true, follow: true },
      openGraph: {
        title: `KFZ abmelden in ${stateName} – alle Städte im Überblick`,
        description: `Digitale Fahrzeugabmeldung in ${stateName} – ohne Termin, ab 19,70 €.`,
        url: `${settings.siteUrl}/${effectiveSlug}`,
        type: 'website',
        locale: 'de_DE',
      },
    };
  }

  if (isCitySlug(effectiveSlug)) {
    const settings = await getSiteSettings();
    const cityPage = buildCityPage(effectiveSlug);
    return buildSEOMetadata(cityPage, settings.siteUrl);
  }

  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageBySlug(effectiveSlug),
  ]);

  if (page && page.status === 'publish') {
    return buildSEOMetadata(page, settings.siteUrl);
  }

  return {};
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) notFound();

  const effectiveSlug = getResolvedCitySlug(slug) || slug;

  if (effectiveSlug !== slug) {
    permanentRedirect(`/${effectiveSlug}`);
  }

  if (isBundeslandSlug(effectiveSlug)) {
    const stateName = getStateForHubSlug(effectiveSlug)!;
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
    return <CityPageView page={cityPage} settings={settings} pricing={pricing} />;
  }

  const [settings, pricing, page] = await Promise.all([
    getSiteSettings(),
    getHomepagePricing(),
    getPageBySlug(effectiveSlug),
  ]);

  if (!page || page.status !== 'publish') {
    const post = await getPostBySlug(effectiveSlug);
    if (post && post.status === 'publish') {
      permanentRedirect(`/insiderwissen/${effectiveSlug}`);
    }
    notFound();
  }

  return <PageView page={page} />;
}

function PageView({ page }: { page: LocalPage }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Start',
        item: 'https://onlineautoabmelden.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.title,
      },
    ],
  };

  return (
    <main className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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