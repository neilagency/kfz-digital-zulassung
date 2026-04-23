import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  CheckCircle,
  Star,
  Euro,
  HelpCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  CreditCard,
  Banknote,
  Wallet,
} from 'lucide-react';
import { getProductBySlug, getAllProductSlugs, stripHtml, getSiteSettings } from '@/lib/db';
import { sanitizeHtml } from '@/lib/sanitize';
import ServiceForm from '@/components/ServiceForm';
import RegistrationForm from '@/components/RegistrationForm';

export const revalidate = 60;

// ─── Static Params ──────────────────────────────
// Exclude slugs that already have dedicated static routes
const STATIC_PRODUCT_SLUGS = ['fahrzeugabmeldung', 'auto-online-anmelden'];

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs
    .filter((s) => !STATIC_PRODUCT_SLUGS.includes(s))
    .map((slug) => ({ slug }));
}

// ─── Dynamic Metadata ───────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.isActive) return { title: 'Nicht gefunden' };

  const settings = await getSiteSettings();
  const title = product.metaTitle || `${product.name} – ab ${product.price.toFixed(2).replace('.', ',')} €`;
  const description =
    product.metaDescription ||
    (product.description ? stripHtml(product.description).slice(0, 160) : product.name);
  // Always auto-generate canonical from slug to avoid stale DB values
  const canonicalUrl = `${settings.siteUrl}/product/${product.slug}`;
  const image = product.ogImage || product.featuredImage || '';

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots:
      process.env.NODE_ENV !== 'production' || process.env.PREVIEW_MODE
        ? { index: false, follow: false }
        : { index: true, follow: true },
    openGraph: {
      title: product.ogTitle || title,
      description: product.ogDescription || description,
      url: canonicalUrl,
      type: 'website',
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.ogTitle || title,
      description: product.ogDescription || description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

// ─── Page Component ─────────────────────────────
export default async function DynamicProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.isActive) notFound();

  const settings = await getSiteSettings();

  const options = (() => {
    try {
      return JSON.parse(product.options);
    } catch {
      return [];
    }
  })();

  const faqItems = (() => {
    try {
      const parsed = JSON.parse(product.faqItems);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  // JSON-LD Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: product.name,
    description: product.description || product.metaDescription || '',
    provider: {
      '@type': 'Organization',
      name: settings.siteName,
      url: settings.siteUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'DE',
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: settings.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.name,
        item: `${settings.siteUrl}/product/${product.slug}`,
      },
    ],
  };

  const faqSchema =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((faq: { q: string; a: string }) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        }
      : null;

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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

      <main className="pb-20 bg-gray-50 min-h-screen">
        {/* ===== Hero Header ===== */}
        <section className="bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-32 pb-14">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-bold">Offiziell &amp; amtlich anerkannt</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              {product.heroTitle || product.name}
            </h1>
            {(product.heroSubtitle || product.description) && (
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                {product.heroSubtitle || product.description}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                { icon: CheckCircle, text: 'Sofortige Bestätigung per E-Mail' },
                { icon: Shield, text: '100% offizieller Service' },
                { icon: Star, text: 'Persönlicher Live-Support' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2"
                >
                  <Icon className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Form Section (if applicable) ===== */}
        {product.formType && (
          <div id="formular" className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
            {product.formType === 'abmeldung' && <ServiceForm contactPhone={settings.phone} contactPhoneLink={settings.phoneLink} contactWhatsapp={settings.whatsapp} />}
            {product.formType === 'anmeldung' && <RegistrationForm contactPhone={settings.phone} contactPhoneLink={settings.phoneLink} contactWhatsapp={settings.whatsapp} contactEmail={settings.email} />}
          </div>
        )}

        {/* ===== Google Trust Badge ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-10">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <strong className="text-primary">5.0</strong> – Bestbewerteter Service 2026 · verifiziert
              von Trustindex
            </p>
          </div>
        </section>

        {/* ===== Pricing Section ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="bg-gradient-to-br from-primary to-primary-800 rounded-2xl p-8 md:p-10 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-10 -mb-10" />
            <div className="relative">
              <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
                <Euro className="w-7 h-7 text-accent" />
                Preise &amp; Leistungen
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Base price */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <p className="text-white/70 text-sm mb-1">{product.name}</p>
                  <p className="text-2xl font-extrabold text-accent">
                    ab {product.price.toFixed(2).replace('.', ',')} €
                  </p>
                  <p className="text-xs text-white/50 mt-1">Grundpreis</p>
                </div>

                {/* Options as price cards */}
                {options.map((opt: { name: string; price: number; key: string }, i: number) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                    <p className="text-white/70 text-sm mb-1">{opt.name}</p>
                    <p className="text-2xl font-extrabold text-accent">
                      {opt.price.toFixed(2).replace('.', ',')} €
                    </p>
                    <p className="text-xs text-white/50 mt-1">Optional</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Rich Content Section ===== */}
        {product.content && (
          <section className="max-w-4xl mx-auto px-4 mt-12">
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
              <div
                className="prose prose-primary max-w-none
                  prose-headings:font-extrabold prose-headings:text-primary
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900
                  prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.content) }}
              />
            </div>
          </section>
        )}

        {/* ===== Payment Methods ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-extrabold text-primary mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-accent" />
              Zahlungsmöglichkeiten
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: CreditCard, title: 'Kredit- & Debitkarte', text: 'Direkt online bezahlen' },
                { icon: Banknote, title: 'PayPal', text: 'Schnell & sicher zahlen' },
                {
                  icon: Euro,
                  title: 'Banküberweisung',
                  text: 'Start nach Eingang oder Screenshot per WhatsApp',
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Contact Section ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="bg-gradient-to-r from-dark to-primary-900 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <h2 className="text-xl font-extrabold mb-2">Hilfe &amp; Kontakt</h2>
              <p className="text-white/60 text-sm mb-6">
                Unser Team ist für Sie da – persönlich und direkt.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href={settings.phoneLink}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Telefon</p>
                    <p className="font-bold text-sm">{settings.phone}</p>
                  </div>
                </a>
                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-[#25D366]/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">WhatsApp</p>
                    <p className="font-bold text-sm">Live-Chat starten</p>
                  </div>
                </a>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">E-Mail</p>
                    <p className="font-bold text-sm">{settings.email}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ Section ===== */}
        {faqItems.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 mt-12">
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-3">
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-sm font-bold">FAQ</span>
                </div>
                <h2 className="text-2xl font-extrabold text-primary">
                  Häufige Fragen zu {product.name}
                </h2>
              </div>
              <div className="space-y-3">
                {faqItems.map(({ q, a }: { q: string; a: string }) => (
                  <details
                    key={q}
                    className="group border border-gray-200 rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-5 hover:bg-gray-50 transition-colors font-bold text-gray-900">
                      {q}
                      <span className="w-8 h-8 rounded-full bg-primary/10 group-open:bg-primary group-open:text-white text-primary flex items-center justify-center flex-shrink-0 ml-3 transition-all">
                        <svg
                          className="w-4 h-4 group-open:rotate-180 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== Cross-sell CTA ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12 mb-4">
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-8 md:p-10 border border-accent/20 text-center">
            <CheckCircle className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-primary mb-2">
              Weitere Services entdecken
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Ob An-, Ab- oder Ummeldung – alle KFZ-Services bequem online erledigen.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/product/fahrzeugabmeldung"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 text-sm"
              >
                Fahrzeug abmelden
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/product/auto-online-anmelden"
                className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Fahrzeug anmelden
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== Privacy Note ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-4">
          <p className="text-xs text-gray-400 text-center">
            Hinweis: Ihre Daten werden nur für den Auftrag verarbeitet. Details siehe{' '}
            <Link href="/datenschutzhinweise" className="text-primary hover:underline">
              Datenschutzhinweise
            </Link>
            .
          </p>
        </section>
      </main>
    </>
  );
}
