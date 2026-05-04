import { Metadata } from 'next';
import {
  getPostBySlug,
  getAllPostSlugs,
  formatDate,
  stripHtml,
  buildSEOMetadata,
  getSiteSettings,
  getHomepagePricing,
  LocalPost,
} from '@/lib/db';
import { sanitizeHtml } from '@/lib/sanitize';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  ArrowLeft,
  Clock,
  Share2,
  ChevronRight,
  Shield,
  Phone,
  MessageCircle,
  CheckCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';

interface BlogSlugPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

function cleanText(value: string) {
  return stripHtml(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildMetaDescription(post: LocalPost) {
  const excerpt = cleanText(post.excerpt || '');

  if (excerpt) {
    return excerpt.slice(0, 155);
  }

  const content = cleanText(post.content || '');
  const firstSentences = content
    .split('.')
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join('. ');

  return (firstSentences ? `${firstSentences}.` : content).slice(0, 155);
}

function extractAiAnswerBox(html: string) {
  const aiAnswerRegex =
    /<div\b[^>]*(?:class="[^"]*\bai-answer-box\b[^"]*"|style="[^"]*(?:background:\s*#f0f9ff|border-left:\s*5px\s+solid\s+#0284c7)[^"]*")[^>]*>[\s\S]*?<\/div>/i;

  const match = html.match(aiAnswerRegex);
  const aiAnswerHtml = match?.[0] || '';
  const contentWithoutAiAnswer = aiAnswerHtml
    ? html.replace(aiAnswerHtml, '')
    : html;

  return {
    aiAnswerHtml,
    contentWithoutAiAnswer,
  };
}

function extractFaqSchema(html: string) {
  const faqSectionMatch =
    html.match(/<section\b[^>]*class="[^"]*\bfaq-section\b[^"]*"[^>]*>[\s\S]*?<\/section>/i) ||
    html.match(/<section\b[^>]*id="faq"[^>]*>[\s\S]*?<\/section>/i);

  const faqSource = faqSectionMatch?.[0] || '';

  if (!faqSource) return null;

  const faqMatches = [
    ...faqSource.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi),
  ];

  const mainEntity = faqMatches
    .map(([, question, answer]) => ({
      '@type': 'Question',
      name: cleanText(question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: cleanText(answer).slice(0, 300),
      },
    }))
    .filter(
      (item) =>
        item.name.length > 5 &&
        item.acceptedAnswer.text.length > 10 &&
        item.name.includes('?'),
    )
    .slice(0, 8);

  if (mainEntity.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

function getModifiedDate(post: LocalPost, publishDate: string | Date) {
  if (!post.updatedAt) return publishDate;

  const publishedTime = new Date(publishDate).getTime();
  const updatedTime = new Date(post.updatedAt).getTime();

  if (!Number.isFinite(updatedTime)) return publishDate;

  return updatedTime > publishedTime ? post.updatedAt : publishDate;
}

export async function generateMetadata({
  params,
}: BlogSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const settings = await getSiteSettings();

  const post = await getPostBySlug(slug);
  if (!post || post.status !== 'publish') return {};

  const baseMeta = buildSEOMetadata(post, settings.siteUrl);
  const canonicalUrl = `${settings.siteUrl.replace(/\/$/, '')}/insiderwissen/${slug}`;
  const description = buildMetaDescription(post);

  return {
    ...baseMeta,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...baseMeta.openGraph,
      url: canonicalUrl,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogSlugPageProps) {
  const { slug } = await params;

  const [post, settings, pricing] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
    getHomepagePricing(),
  ]);

  if (!post || post.status !== 'publish') {
    notFound();
  }

  return (
    <BlogPostView
      post={post}
      slug={slug}
      settings={settings}
      pricing={pricing}
    />
  );
}

type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;
type Pricing = Awaited<ReturnType<typeof getHomepagePricing>>;

function BlogPostView({
  post,
  slug,
  settings,
  pricing,
}: {
  post: LocalPost;
  slug: string;
  settings: SiteSettings;
  pricing: Pricing;
}) {
  const title = stripHtml(post.title);
  const cleanContentText = stripHtml(post.content);
  const wordCount = cleanContentText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const headings: { level: number; id: string; text: string }[] = [];

  const baseUrl = settings.siteUrl.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/insiderwissen/${slug}`;

  const normalizedFeaturedImage = post.featuredImage
    ? post.featuredImage.replace(/^https?:\/\/[^/]+(?=\/uploads\/media\/)/i, '')
    : '';

  const featuredImageReady = !!normalizedFeaturedImage;

  const absoluteImageUrl = normalizedFeaturedImage
    ? normalizedFeaturedImage.startsWith('/')
      ? `${baseUrl}${normalizedFeaturedImage}`
      : normalizedFeaturedImage
    : `${baseUrl}/logo.svg`;

  const metaDescription = buildMetaDescription(post);

  const sanitizedContent = sanitizeHtml(post.content);

  const contentWithoutH1 = sanitizedContent.replace(
    /<h1([^>]*)>([\s\S]*?)<\/h1>/gi,
    '<h2$1>$2</h2>',
  );

  const contentWithLazyImages = contentWithoutH1.replace(
  /<img\b(?![^>]*\bloading\s*=)([^>]*?)(\s*\/?>)/gi,
  '<img loading="lazy" decoding="async"$1$2',
  );

  const contentWithIds = contentWithLazyImages.replace(
    /<h([23])([^>]*)>(.*?)<\/h[23]>/gi,
    (_full: string, level: string, attrs: string, inner: string) => {
      const existingId = attrs.match(/id="([^"]*)"/)?.[1];
      const id =
        existingId ||
        stripHtml(inner)
          .toLowerCase()
          .replace(/[^a-z0-9äöüß]+/g, '-')
          .replace(/(^-|-$)/g, '');

      headings.push({
        level: Number(level),
        id,
        text: stripHtml(inner),
      });

      return `<h${level} id="${id}"${attrs.replace(/id="[^"]*"/, '')}>${inner}</h${level}>`;
    },
  );

  const { aiAnswerHtml, contentWithoutAiAnswer } =
    extractAiAnswerBox(contentWithIds);

  const articleContentHtml = contentWithoutAiAnswer;
  const faqSchema = extractFaqSchema(articleContentHtml);

  const publishDate = post.publishedAt || post.createdAt;
  const modifiedDate = getModifiedDate(post, publishDate);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    headline: title,
    description: metaDescription,
    image: absoluteImageUrl,
    datePublished: new Date(publishDate).toISOString(),
    dateModified: new Date(modifiedDate).toISOString(),
    inLanguage: 'de-DE',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
    },
    author: {
      '@type': 'Person',
      name: 'Redaktion OnlineAutoAbmelden',
      url: `${baseUrl}/ueber-uns`,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}#organization`,
      name: settings.siteName,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`,
      },
    },
    about: [
      'Auto online abmelden',
      'KFZ online abmelden',
      'Digitale Fahrzeugabmeldung',
      'i-Kfz',
      'Zulassungsservice',
      'Zulassungsdienst',
      'Sicherheitscode Fahrzeugschein',
      'Sicherheitscode Kennzeichen',
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description: metaDescription,
    inLanguage: 'de-DE',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      url: baseUrl,
      name: settings.siteName,
      publisher: {
        '@id': `${baseUrl}#organization`,
      },
    },
    about: {
      '@id': `${canonicalUrl}#article`,
    },
    breadcrumb: {
      '@id': `${canonicalUrl}#breadcrumb`,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteImageUrl,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Start',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Insiderwissen',
        item: `${baseUrl}/insiderwissen`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="pb-20">
        <section className="relative overflow-hidden bg-gradient-to-br from-dark via-primary-900 to-dark pb-12 pt-28 md:pt-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-20 top-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
            <nav className="mb-8 flex items-center gap-2 text-sm text-white/50">
              <Link href="/" className="transition-colors hover:text-white/80">
                Startseite
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link
                href="/insiderwissen"
                className="transition-colors hover:text-white/80"
              >
                Blog
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="max-w-[200px] truncate text-white/70 md:max-w-xs">
                {title}
              </span>
            </nav>

            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-white/50">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(publishDate)}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} Min. Lesezeit
              </span>
            </div>

            <h1 className="mb-6 max-w-4xl text-3xl font-extrabold leading-[1.15] text-white md:text-5xl lg:text-[3.25rem]">
              {title}
            </h1>

            {aiAnswerHtml && (
              <div
                className="mb-6 max-w-4xl [&_*]:!text-slate-900"
                dangerouslySetInnerHTML={{ __html: aiAnswerHtml }}
              />
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/product/fahrzeugabmeldung"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-accent-600 hover:shadow-lg hover:shadow-accent/20"
              >
                <CheckCircle className="h-4 w-4" />
                Fahrzeug online abmelden
              </Link>

              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Hilfe
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-8 max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            <article className="min-w-0 flex-1">
              {featuredImageReady && (
                <div className="relative mb-8 aspect-[2/1] w-full overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={normalizedFeaturedImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 720px"
                    unoptimized={normalizedFeaturedImage.startsWith('/uploads/')}
                  />
                </div>
              )}

              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-6 shadow-sm sm:px-6 md:p-10">
                <div
                  className="blog-content prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: articleContentHtml }}
                />
              </div>

              <div className="mt-8 rounded-2xl border border-gray-100 bg-white px-4 py-6 shadow-sm sm:px-6 md:p-8">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <Share2 className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">
                      Teilen:
                    </span>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + canonicalUrl)}`}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-colors hover:bg-green-100"
                      title="WhatsApp"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>

                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                      title="Facebook"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                  </div>

                  <Link
                    href="/product/fahrzeugabmeldung"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-primary transition-all hover:bg-accent-600 hover:shadow-lg"
                  >
                    Jetzt Auto abmelden
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-800 to-dark px-4 py-8 text-center sm:px-6 md:p-10">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
                </div>

                <div className="relative">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
                    <Shield className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-white/90">
                      GKS-angebundenes Verfahren
                    </span>
                  </div>

                  <h3 className="mb-3 text-2xl font-extrabold text-white md:text-3xl">
                    Fahrzeug online abmelden – nur {pricing.abmeldungPriceFormatted}
                  </h3>

                  <p className="mx-auto mb-8 max-w-lg text-white/60">
                    Keine Wartezeit, kein Termin. Offizielle Bestätigung sofort per E-Mail.
                    Deutschlandweit gültig.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/product/fahrzeugabmeldung"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-primary transition-all hover:bg-accent-600 hover:shadow-lg hover:shadow-accent/20"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Jetzt Abmeldung starten
                    </Link>

                    <Link
                      href="/product/auto-online-anmelden"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                    >
                      KFZ Sofort Online anmelden
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            <aside className="w-full flex-shrink-0 space-y-6 lg:w-80 xl:w-[340px]">
              <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-800 p-6 text-white shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Direkt starten</p>
                    <p className="text-xs text-white/60">In wenigen Minuten erledigt</p>
                  </div>
                </div>

                <Link
                  href="/product/fahrzeugabmeldung"
                  className="mb-3 block w-full rounded-xl bg-accent py-3 text-center text-sm font-bold text-primary transition-all hover:bg-accent-600 hover:shadow-lg"
                >
                  Auto abmelden – {pricing.abmeldungPriceFormatted}
                </Link>

                <Link
                  href="/product/auto-online-anmelden"
                  className="block w-full rounded-xl border border-white/20 bg-white/10 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-white/20"
                >
                  Auto anmelden – ab {pricing.anmeldungPriceFormatted}
                </Link>
              </div>

              {headings.length > 2 && (
                <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
                    Inhaltsverzeichnis
                  </h4>

                  <nav className="-mr-1 max-h-[60vh] space-y-0.5 overflow-y-auto pr-1">
                    {headings.map((h, i) => (
                      <a
                        key={`${h.id}-${i}`}
                        href={`#${h.id}`}
                        className={
                          'block rounded-lg px-3 py-2 text-[13px] leading-snug transition-colors hover:bg-primary-50 hover:text-primary ' +
                          (h.level === 3
                            ? 'pl-6 text-gray-500'
                            : 'font-medium text-gray-700')
                        }
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h4 className="mb-4 text-sm font-bold text-gray-900">
                  Hilfe benötigt?
                </h4>
                <p className="mb-5 text-sm text-gray-500">
                  Unser Team hilft dir gerne persönlich weiter – kostenlos und ohne Warteschleife.
                </p>

                <div className="space-y-3">
                  <a
                    href={settings.phoneLink}
                    className="flex items-center gap-3 rounded-xl bg-primary-50 px-4 py-3 transition-colors hover:bg-primary-100"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Telefon</p>
                      <p className="text-sm font-bold text-primary">{settings.phone}</p>
                    </div>
                  </a>

                  <a
                    href={settings.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 transition-colors hover:bg-green-100"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">WhatsApp</p>
                      <p className="text-sm font-bold text-green-700">Live-Chat starten</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  {[
                    {
                      icon: Shield,
                      label: 'GKS-angebundenes Verfahren',
                      sub: 'Offiziell & rechtssicher',
                    },
                    {
                      icon: Clock,
                      label: '24/7 verfügbar',
                      sub: '365 Tage im Jahr',
                    },
                    {
                      icon: CheckCircle,
                      label: 'Offizielle Bestätigung',
                      sub: 'Per E-Mail als PDF',
                    },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <Icon className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{label}</p>
                        <p className="text-xs text-gray-500">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl px-2 sm:px-6 lg:px-8">
          <Link
            href="/insiderwissen"
            className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Alle Artikel ansehen
          </Link>
        </div>
      </main>
    </>
  );
}
