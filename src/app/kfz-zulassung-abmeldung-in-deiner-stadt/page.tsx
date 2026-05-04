import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  Shield,
  CheckCircle,
  Headphones,
  KeyRound,
  ShieldCheck,
  Search,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { getHomepagePricing, getSiteSettings } from '@/lib/db';
import {
  CITY_ENTRIES,
  isCitySlug,
  getResolvedCitySlug,
  getCityNameBySlug,
} from '@/lib/city-slugs';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/kfz-zulassung-abmeldung-in-deiner-stadt`;

  const title = 'KFZ abmelden – Alle Städte Deutschlands';
  const description =
    'Auto online abmelden in vielen Städten und Landkreisen in Deutschland. Finden Sie Ihre Stadt oder Ihren Landkreis – bundesweit, ohne Termin und einfach online.';

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: settings.siteName,
      type: 'website',
      locale: 'de_DE',
      images: [
        {
          url: `${baseUrl}/logo.webp`,
          width: 1920,
          height: 1080,
          alt: 'Online Auto Abmelden – KFZ online abmelden in Deutschland',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/logo.webp`],
    },
  };
}

interface CityLink {
  name: string;
  slug: string;
}

const EXCLUDED_SLUGS = new Set<string>([
  'widerrufsbelehrung',
  'geschaftsbedingungen',
  'allgemeine-geschaeftsbedingungen',
  'datenschutzhinweise',
  'erklaervideo',
  'digital-erklart',
  'ueber-uns',
  'impressum',
  'kostenlose-kennzeichenreservierung',
  'kosten-autoabmeldung-online',
  'auto-abmelden-in-2-minuten',
  'auto-abmelden-ohne-ausweis',
  'auto-abmelden-ohne-termin',
  'auto-digital-abmelden',
  'abmeldung-digital',
  'auto-sofort-abmelden',
  'auto-schnell-abmelden',
  'lkw-abmelden-online',
  'anhaenger-abmelden-online',
  'motorrad-online-abmelden',
  'pkw-online-abmelden',
  'fahrzeug-abmelden-online',
  'kfz-abmeldung-online',
  'auto-fix-abmelden',
  'anhaenger-online-abmelden',
  'anhaenger-abmelden',
  'motorrad-abmelden-online',
  'online-kfz-abmelden',
  'auto-abmelden',
  'online-auto-anmelden',
  'online-zulassung-kfz',
  'kfz-zulassung-online',
  'online-car-deregistration-en',
  'online-arac-kayittan-duesuerme-almanya',
  'ar-ilgha-tasjeel-al-sayara',
  'evb',
]);

const NAME_FIXES: Record<string, string> = {
  krichheim: 'Kirchheim',
  'rott-weil': 'Rottweil',
  koegen: 'Kögen',
  'landkreise-in-rheinland-pfalz': 'Rheinland-Pfalz',
  'in-nordrhein-westfalen': 'Nordrhein-Westfalen',
  'zulassungsstelle-duesseldorf-termin': 'Stadt Düsseldorf',
};

function buildCityLinks(): CityLink[] {
  const map = new Map<string, CityLink>();

  for (const [name, rawSlug] of CITY_ENTRIES) {
    const finalSlug = getResolvedCitySlug(rawSlug) || rawSlug;

    if (EXCLUDED_SLUGS.has(rawSlug) || EXCLUDED_SLUGS.has(finalSlug)) continue;
    if (!isCitySlug(finalSlug)) continue;

    const fixedName =
      NAME_FIXES[finalSlug] ||
      NAME_FIXES[rawSlug] ||
      getCityNameBySlug(finalSlug) ||
      name;

    map.set(finalSlug, {
      name: fixedName,
      slug: finalSlug,
    });
  }

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name, 'de'),
  );
}

export default async function AlleStaedtePage() {
  const [settings, pricing] = await Promise.all([
    getSiteSettings(),
    getHomepagePricing(),
  ]);

  const baseUrl = settings.siteUrl.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/kfz-zulassung-abmeldung-in-deiner-stadt`;

  const cities = buildCityLinks();

  const grouped: Record<string, CityLink[]> = {};

  for (const city of cities) {
    const letter = city.name.charAt(0).toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(city);
  }

  const sortedLetters = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, 'de'),
  );

  const faqItems = [
    {
      question: 'Kann ich mein Auto in jeder Stadt online abmelden?',
      answer:
        'Ja, die Online-Abmeldung ist grundsätzlich deutschlandweit möglich, wenn die nötigen Unterlagen und Sicherheitscodes vorhanden sind.',
    },
    {
      question: 'Muss ich zur Zulassungsstelle meiner Stadt gehen?',
      answer:
        'In vielen Fällen ist kein Besuch bei der Zulassungsstelle nötig. Der Vorgang kann online vorbereitet und digital eingereicht werden.',
    },
    {
      question: 'Funktioniert die Online-Abmeldung auch für Landkreise?',
      answer:
        'Ja, die Online-Abmeldung funktioniert für viele Zulassungsbezirke in Deutschland, also für Städte und Landkreise.',
    },
    {
      question: 'Was kostet die Online-Abmeldung?',
      answer: `Die Online-Abmeldung startet bei unserem Service ab ${pricing.abmeldungPriceFormatted}. In Sonderfällen können zusätzliche Gebühren entstehen, über die vorher informiert wird.`,
    },
    {
      question: 'Was brauche ich für die Online-Abmeldung?',
      answer:
        'Benötigt werden in der Regel der Fahrzeugschein, beide Kennzeichen, die freigelegten Sicherheitscodes und eine E-Mail-Adresse für die Bestätigung.',
    },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#collectionpage`,
        url: canonicalUrl,
        name: 'KFZ abmelden – Alle Städte Deutschlands',
        description:
          'Übersicht vieler Städte und Landkreise in Deutschland für die Online-Abmeldung von Fahrzeugen.',
        inLanguage: 'de-DE',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}#website`,
          url: baseUrl,
          name: settings.siteName,
        },
        about: {
          '@type': 'Service',
          name: 'Auto online abmelden',
          serviceType: 'Digitale Fahrzeugabmeldung',
          url: `${baseUrl}/product/fahrzeugabmeldung`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
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
            name: 'Alle Städte',
            item: canonicalUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="pb-20">
        <section className="bg-gradient-to-br from-dark via-primary-900 to-dark pb-16 pt-28 md:pt-32">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-accent">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-bold">Bundesweit verfügbar</span>
            </div>

            <h1 className="mb-6 text-3xl font-extrabold leading-tight text-white md:text-5xl">
              KFZ online abmelden – alle Städte und Landkreise
            </h1>

            <div className="mx-auto mb-6 max-w-3xl rounded-2xl border border-sky-200 bg-sky-50 p-5 text-left">
              <p className="text-base leading-7 text-slate-900 md:text-lg">
                <strong>Kurzantwort:</strong> Die Online-Abmeldung ist in Deutschland
                grundsätzlich bundesweit möglich. Entscheidend ist nicht nur die Stadt,
                sondern ob Fahrzeugschein, Kennzeichen und Sicherheitscodes für die
                digitale Abmeldung geeignet sind.
              </p>
            </div>

            <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-white/70">
              Finden Sie Ihre Stadt oder Ihren Landkreis und starten Sie die
              Fahrzeugabmeldung online – ohne Termin, ohne Wartezeit und mit
              persönlicher Hilfe bei Fragen.
            </p>

            <div className="mb-8 flex flex-wrap justify-center gap-4">
              {[
                { icon: Shield, text: 'Offizieller digitaler Ablauf' },
                { icon: CheckCircle, text: 'Deutschlandweit möglich' },
                { icon: Headphones, text: 'Persönlicher Support' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"
                >
                  <Icon className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-white/90">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/product/fahrzeugabmeldung"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-bold text-primary transition-all hover:bg-accent-600 hover:shadow-lg"
              >
                Jetzt abmelden – {pricing.abmeldungPriceFormatted}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Hilfe
              </a>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="mb-6 text-center text-3xl font-extrabold text-primary">
              Warum unser Service in ganz Deutschland funktioniert
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                  <KeyRound className="h-5 w-5 text-primary" />
                  Sicherheitscodes wichtig
                </h3>
                <p className="text-sm leading-6 text-gray-600">
                  Für die Online-Abmeldung sind die Sicherheitscodes auf dem
                  Fahrzeugschein und den Kennzeichen entscheidend.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Digitaler Ablauf
                </h3>
                <p className="text-sm leading-6 text-gray-600">
                  Die Fahrzeugabmeldung kann digital vorbereitet und nach erfolgreicher
                  Bearbeitung bestätigt werden.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Bundesweit nutzbar
                </h3>
                <p className="text-sm leading-6 text-gray-600">
                  Der Service ist nicht auf eine einzelne Stadt beschränkt, sondern für
                  viele Zulassungsbezirke in Deutschland nutzbar.
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-5 rounded-3xl border border-gray-100 bg-white p-6 leading-8 text-gray-700 shadow-sm md:p-10">
              <h2 className="text-2xl font-extrabold text-primary">
                KFZ online abmelden – bundesweit in vielen Städten und Landkreisen
              </h2>

              <p>
                Auf dieser Seite finden Sie eine große Übersicht vieler Städte und
                Landkreise in Deutschland, in denen Fahrzeughalter nach Informationen
                zur Online-Abmeldung suchen. Der Ablauf ist für viele Nutzer ähnlich:
                Unterlagen prüfen, Sicherheitscodes freilegen, Daten eingeben und die
                Bestätigung nach erfolgreicher Bearbeitung erhalten.
              </p>

              <p>
                Die Online-Abmeldung spart den Weg zur Zulassungsstelle, Terminbuchungen
                und lange Wartezeiten. Egal ob Berlin, Hamburg, München, Köln oder ein
                Landkreis – wichtig ist, dass die Unterlagen für die digitale Abmeldung
                geeignet sind.
              </p>

              <p>
                Für die Abmeldung brauchen Sie in der Regel den Fahrzeugschein, beide
                Kennzeichen und die passenden Sicherheitscodes. Nach erfolgreicher
                Bearbeitung erhalten Sie die Bestätigung per E-Mail.
              </p>

              <p>
                Wählen Sie unten Ihre Stadt oder Ihren Landkreis aus. Dort finden Sie
                die passende lokale Seite mit weiteren Informationen und häufigen Fragen.
              </p>
            </div>
          </div>
        </section>

        <div className="sticky top-20 z-30 border-b border-gray-200 bg-white py-3">
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-1 px-4">
            {sortedLetters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>

        <section className="py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                <Search className="h-4 w-4" />
                Stadt suchen
              </div>

              <h2 className="mb-4 text-3xl font-extrabold text-primary">
                Finden Sie Ihre Stadt oder Ihren Landkreis
              </h2>

              <p className="mx-auto max-w-2xl text-gray-600">
                Egal ob Großstadt wie{' '}
                <Link
                  href="/berlin-zulassungsstelle"
                  className="font-medium text-primary hover:underline"
                >
                  Berlin
                </Link>
                ,{' '}
                <Link
                  href="/kfz-online-abmelden-in-hamburg"
                  className="font-medium text-primary hover:underline"
                >
                  Hamburg
                </Link>
                ,{' '}
                <Link
                  href="/auto-online-abmelden-muenchen"
                  className="font-medium text-primary hover:underline"
                >
                  München
                </Link>{' '}
                oder ein Landkreis – unser Service funktioniert bundesweit.
              </p>
            </div>

            {sortedLetters.map((letter) => (
              <div key={letter} id={`letter-${letter}`} className="mb-10 scroll-mt-32">
                <h3 className="mb-4 border-b border-primary/20 pb-2 text-xl font-extrabold text-primary">
                  {letter}
                </h3>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {grouped[letter].map((city) => (
                    <Link
                      key={city.slug}
                      href={`/${city.slug}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-primary/5 hover:text-primary"
                    >
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/50" />
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <section className="mt-12 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
              <h2 className="mb-6 text-3xl font-extrabold text-primary">
                Häufige Fragen zur Online-Abmeldung nach Stadt
              </h2>

              <div className="space-y-6">
                {faqItems.map((item) => (
                  <div key={item.question}>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      {item.question}
                    </h3>
                    <p className="leading-7 text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 rounded-3xl bg-gradient-to-br from-primary-50 to-accent-50 p-8 text-center md:p-10">
              <h2 className="mb-3 text-3xl font-extrabold text-primary">
                Ihre Stadt nicht gefunden?
              </h2>

              <p className="mx-auto mb-6 max-w-xl text-gray-600">
                Kein Problem. Unser Service funktioniert bundesweit. Starten Sie
                einfach direkt und melden Sie Ihr Fahrzeug online ab.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/product/fahrzeugabmeldung"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-lg"
                >
                  Jetzt für {pricing.abmeldungPriceFormatted} abmelden
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-8 py-4 font-bold text-primary transition hover:bg-primary/5"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Hilfe
                </a>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
