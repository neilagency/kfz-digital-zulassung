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
import { existsSync } from 'fs';
import path from 'path';
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

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const settings = await getSiteSettings();

  const post = await getPostBySlug(slug);
  if (!post || post.status !== 'publish') return {};

  const baseMeta = buildSEOMetadata(post, settings.siteUrl);

  return {
    ...baseMeta,
    alternates: {
      canonical: `${settings.siteUrl}/insiderwissen/${slug}`,
    },
    openGraph: {
      ...baseMeta.openGraph,
      url: `${settings.siteUrl}/insiderwissen/${slug}`,
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
  const wordCount = stripHtml(post.content).split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const headings: { level: number; id: string; text: string }[] = [];

  const normalizedFeaturedImage = post.featuredImage
    ? post.featuredImage.replace(/^https?:\/\/(www\.)?onlineautoabmelden\.com/i, '')
    : '';
  const featuredImageReady =
    normalizedFeaturedImage &&
    (normalizedFeaturedImage.startsWith('/uploads/')
      ? existsSync(path.join(process.cwd(), 'public', normalizedFeaturedImage.slice(1)))
      : true);

  const sanitizedContent = sanitizeHtml(post.content);

  // Strip srcset attributes that reference local /uploads/ paths.
  // Variant files (thumbnails, medium, large) may not exist on the server
  // after a deploy; removing the srcset avoids 404 spam while keeping the
  // main <img src> intact so the original (or re-uploaded) file still loads.
  const sanitizedNoLocalSrcset = sanitizedContent.replace(
    /\s+srcset="([^"]*)"/gi,
    (match, srcsetValue: string) =>
      srcsetValue.includes('/uploads/') ? '' : match
  );

  const contentWithIds = sanitizedNoLocalSrcset.replace(
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
    }
  );

  const publishDate = post.publishedAt || post.createdAt;
  const canonicalUrl = `${settings.siteUrl}/insiderwissen/${slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    datePublished: new Date(publishDate).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    ...(post.featuredImage && { image: post.featuredImage }),
    author: {
      '@type': 'Organization',
      name: settings.siteName,
      url: settings.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.siteName,
      url: settings.siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Start',
        item: settings.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Insiderwissen',
        item: `${settings.siteUrl}/insiderwissen`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="pb-20">
        <section className="relative bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-32 pb-12 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
              <Link href="/" className="hover:text-white/80 transition-colors">
                Startseite
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href="/insiderwissen"
                className="hover:text-white/80 transition-colors"
              >
                Blog
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/70 truncate max-w-[200px] md:max-w-xs">
                {title}
              </span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 text-white/50 text-xs uppercase tracking-wider mb-5">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(publishDate)}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {readingTime} Min. Lesezeit
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.15] mb-6 max-w-4xl">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/product/fahrzeugabmeldung"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-primary font-bold text-sm px-6 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                <CheckCircle className="w-4 h-4" />
                Jetzt Auto abmelden – {pricing.abmeldungPriceFormatted}
              </Link>

              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-5 py-3 rounded-full transition-all backdrop-blur-sm border border-white/10"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Hilfe
              </a>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <article className="flex-1 min-w-0">
              {featuredImageReady && (
                <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-xl mb-8">
                  <Image
                    src={normalizedFeaturedImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 720px"
                  />
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <div
                  className="blog-content prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: contentWithIds }}
                />
              </div>

              <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-500 text-sm font-medium">
                      Teilen:
                    </span>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + canonicalUrl)}`}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>

                    <a
  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
  target="_blank"
  rel="nofollow noopener noreferrer"
  className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
  title="Facebook"
>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                  </div>

                  <Link
                    href="/product/fahrzeugabmeldung"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-primary font-extrabold px-6 py-3 rounded-full transition-all hover:shadow-lg text-sm"
                  >
                    Jetzt Auto abmelden
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-8 relative overflow-hidden bg-gradient-to-br from-primary via-primary-800 to-dark rounded-2xl p-8 md:p-10 text-center">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
                </div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
                    <Shield className="w-4 h-4 text-accent" />
                    <span className="text-white/90 text-sm font-medium">
                      Offiziell über das KBA
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                    Fahrzeug online abmelden – nur {pricing.abmeldungPriceFormatted}
                  </h3>

                  <p className="text-white/60 mb-8 max-w-lg mx-auto">
                    Keine Wartezeit, kein Termin. Offizielle Bestätigung sofort per E-Mail. Deutschlandweit gültig.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/product/fahrzeugabmeldung"
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-primary font-bold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Jetzt Abmeldung starten
                    </Link>

                    <Link
                      href="/product/auto-online-anmelden"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-full transition-all backdrop-blur-sm"
                    >
                      KFZ Sofort Online anmelden
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            <aside className="w-full lg:w-80 xl:w-[340px] flex-shrink-0 space-y-6">
              <div className="bg-gradient-to-br from-primary to-primary-800 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Direkt starten</p>
                    <p className="text-white/60 text-xs">In 5 Minuten erledigt</p>
                  </div>
                </div>

                <Link
                  href="/product/fahrzeugabmeldung"
                  className="block w-full bg-accent hover:bg-accent-600 text-primary font-bold text-center py-3 rounded-xl transition-all hover:shadow-lg text-sm mb-3"
                >
                  Auto abmelden – {pricing.abmeldungPriceFormatted}
                </Link>

                <Link
                  href="/product/auto-online-anmelden"
                  className="block w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-center py-3 rounded-xl transition-all text-sm"
                >
                  Auto anmelden – ab {pricing.anmeldungPriceFormatted}
                </Link>
              </div>

              {headings.length > 2 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">
                    Inhaltsverzeichnis
                  </h4>

                  <nav className="space-y-0.5 max-h-[60vh] overflow-y-auto pr-1 -mr-1">
                    {headings.map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.id}`}
                        className={
                          'block text-[13px] leading-snug rounded-lg px-3 py-2 transition-colors hover:bg-primary-50 hover:text-primary ' +
                          (h.level === 3
                            ? 'pl-6 text-gray-500'
                            : 'text-gray-700 font-medium')
                        }
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-bold text-gray-900 mb-4">
                  Hilfe benötigt?
                </h4>
                <p className="text-sm text-gray-500 mb-5">
                  Unser Team hilft dir gerne persönlich weiter – kostenlos und ohne Warteschleife.
                </p>

                <div className="space-y-3">
                  <a
                    href={settings.phoneLink}
                    className="flex items-center gap-3 bg-primary-50 hover:bg-primary-100 rounded-xl px-4 py-3 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
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
                    className="flex items-center gap-3 bg-green-50 hover:bg-green-100 rounded-xl px-4 py-3 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">WhatsApp</p>
                      <p className="text-sm font-bold text-green-700">Live-Chat starten</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-4">
                  {[
                    {
                      icon: Shield,
                      label: 'KBA-registrierter Service',
                      sub: 'Offiziell & rechtssicher',
                    },
                    {
                      icon: Clock,
                      label: '24/7 verfügbar',
                      sub: '365 Tage im Jahr',
                    },
                    {
                      icon: CheckCircle,
                      label: 'Sofortbestätigung',
                      sub: 'Per E-Mail als PDF',
                    },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-accent" />
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <Link
            href="/insiderwissen"
            className="inline-flex items-center gap-2 text-primary hover:text-accent font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Alle Artikel ansehen
          </Link>
        </div>
      </main>
    </>
  );
}
