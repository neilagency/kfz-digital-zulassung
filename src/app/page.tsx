import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import Steps from '@/components/Steps';
import PricingBox from '@/components/PricingBox';
import BlogCard from '@/components/BlogCard';
import {
  getAllPosts,
  getSiteSettings,
  getHomepagePricing,
  getPaymentMethodLabels,
} from '@/lib/db';
import {
  Shield,
  Headphones,
  Clock,
  FileCheck,
  Phone,
  MessageCircle,
  Camera,
  Mail,
  BadgeCheck,
  Banknote,
  Truck,
  PlayCircle,
  Youtube,
  HelpCircle,
  CheckCircle,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: true });

const PAGE_TITLE = 'Auto online abmelden ab 19,70 € | Schnell & sicher';
const PAGE_DESCRIPTION =
  'Auto online abmelden ab 19,70 €. Ohne Ausweis & PIN. Offizielle Bestätigung per E-Mail. Steuer & Versicherung automatisch informiert. 24/7 möglich.';

const CITY_LINKS = [
  { name: 'Berlin', slug: 'berlin-zulassungsstelle' },
  { name: 'München', slug: 'auto-online-abmelden-muenchen' },
  { name: 'Hamburg', slug: 'kfz-online-abmelden-in-hamburg' },
  { name: 'Köln', slug: 'kfz-online-abmelden-koeln' },
  { name: 'Frankfurt', slug: 'frankfurt' },
  { name: 'Stuttgart', slug: 'zulassungsservice-stuttgart' },
  { name: 'Düsseldorf', slug: 'duesseldorf' },
  { name: 'Dortmund', slug: 'kfz-online-abmelden-dortmund' },
  { name: 'Essen', slug: 'kfz-online-abmelden-essen' },
  { name: 'Leipzig', slug: 'leipzig' },
  { name: 'Bremen', slug: 'kfz-online-abmelden-bremen' },
  { name: 'Dresden', slug: 'dresden-kfz-zulassungsstelle' },
  { name: 'Hannover', slug: 'zulassungsservice-hannover' },
  { name: 'Nürnberg', slug: 'nuernberg' },
  { name: 'Duisburg', slug: 'duisburg' },
  { name: 'Bochum', slug: 'auto-online-abmelden-in-bochum' },
  { name: 'Bielefeld', slug: 'bielefeld' },
  { name: 'Münster', slug: 'muenster' },
  { name: 'Aachen', slug: 'aachen' },
  { name: 'Bonn', slug: 'bonn' },
];

const BUNDESLAND_LINKS = [
  { name: 'Bayern', slug: 'kfz-abmelden-in-bayern' },
  { name: 'NRW', slug: 'kfz-abmelden-in-nrw' },
  { name: 'Baden-Württemberg', slug: 'kfz-abmelden-in-bw' },
  { name: 'Hessen', slug: 'kfz-abmelden-in-hessen' },
  { name: 'Niedersachsen', slug: 'kfz-abmelden-in-niedersachsen' },
  { name: 'Sachsen', slug: 'kfz-abmelden-in-sachsen' },
  { name: 'Thüringen', slug: 'kfz-abmelden-in-thueringen' },
  { name: 'Sachsen-Anhalt', slug: 'kfz-abmelden-in-sachsen-anhalt' },
  { name: 'Rheinland-Pfalz', slug: 'kfz-abmelden-in-rheinland-pfalz' },
  { name: 'Schleswig-Holstein', slug: 'kfz-abmelden-in-schleswig-holstein' },
  { name: 'Mecklenburg-Vorpommern', slug: 'kfz-abmelden-in-mecklenburg-vorpommern' },
  { name: 'Saarland', slug: 'kfz-abmelden-in-saarland' },
  { name: 'Brandenburg', slug: 'kfz-abmelden-in-brandenburg' },
];

const SERVICE_LINKS = [
  { name: 'Auto online abmelden', href: '/auto-online-abmelden' },
  { name: 'Kosten Auto online abmelden', href: '/auto-online-abmelden-kosten' },
  { name: 'Unterlagen für die Abmeldung', href: '/auto-online-abmelden-unterlagen' },
  { name: 'Online Auto abmelden', href: '/online-auto-abmelden' },
];

const GUIDE_LINKS = [
  {
    name: 'Sicherheitscode im Fahrzeugschein finden',
    href: '/insiderwissen/wo-ist-der-7-stellige-sicherheitscode-im-fahrzeugschein',
  },
  {
    name: 'Kfz-Abmeldung Fehler Sicherheitscode',
    href: '/insiderwissen/kfz-abmeldung-fehler-sicherheitscode',
  },
  {
    name: 'Kfz online abmelden funktioniert nicht',
    href: '/insiderwissen/kfz-online-abmeldung-funktioniert-nicht',
  },
  {
    name: 'Auto abmelden ohne TÜV',
    href: '/insiderwissen/auto-abmelden-ohne-tuev-anleitung',
  },
  {
    name: 'Kosten Autoabmeldung online 2026',
    href: '/insiderwissen/auto-online-abmelden-kosten-2026',
  },
  {
    name: 'iKFZ funktioniert nicht',
    href: '/insiderwissen/ikfz-funktioniert-nicht',
  },
];

const VIDEO_ITEMS = [
  {
    title: 'Sicherheitscode am Kennzeichen freilegen',
    embedUrl: 'https://www.youtube-nocookie.com/embed/3nsdJSvKAtE',
    thumbnailUrl: 'https://i.ytimg.com/vi/3nsdJSvKAtE/hqdefault.jpg',
    uploadDate: '2026-04-27T08:00:00+02:00',
    description:
      'Kurze Video-Hilfe, damit Kunden den Sicherheitscode am Kennzeichen richtig finden und Fehler vermeiden.',
  },
  {
    title: 'Sicherheitscode im Fahrzeugschein freilegen',
    embedUrl: 'https://www.youtube-nocookie.com/embed/u38keaF1QKU',
    thumbnailUrl: 'https://i.ytimg.com/vi/u38keaF1QKU/hqdefault.jpg',
    uploadDate: '2026-04-27T08:00:00+02:00',
    description:
      'Einfach erklärt, welche Stelle im Fahrzeugschein wichtig ist und worauf Kunden achten sollten.',
  },
];

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

function formatOfferPrice(price: string): string {
  const cleaned = price.replace(/[^\d,]/g, '').replace(',', '.');
  return cleaned || '0';
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();

  return {
    metadataBase: new URL(s.siteUrl),
    title: { absolute: PAGE_TITLE },
    description: PAGE_DESCRIPTION,
    keywords: [
      'auto online abmelden',
      'online auto abmelden',
      'kfz online abmelden',
      'fahrzeug online abmelden',
      'auto abmelden online',
      'kfz abmeldung online',
      'auto online abmelden deutschland',
    ],
    alternates: {
      canonical: s.siteUrl.replace(/\/$/, ''),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: s.siteUrl.replace(/\/$/, ''),
      siteName: s.siteName,
      type: 'website',
      locale: 'de_DE',
      images: [
        {
          url: `${s.siteUrl}/logo.webp`,
          width: 1920,
          height: 1080,
          alt: 'Online Auto Abmelden – Offizielle digitale Fahrzeugabmeldung',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      images: [`${s.siteUrl}/logo.webp`],
    },
  };
}

export default async function HomePage() {
  const [{ posts }, settings, pricing, paymentLabels] = await Promise.all([
    getAllPosts(1, 6),
    getSiteSettings(),
    getHomepagePricing(),
    getPaymentMethodLabels(),
  ]);

  const baseUrl = stripTrailingSlash(settings.siteUrl);
  const offerPrice = formatOfferPrice(pricing.abmeldungPriceFormatted);

  const homepageFaqItems = [
    {
      question: 'Was kostet die Online-Abmeldung?',
      answer: `Die Online-Abmeldung kostet ${pricing.abmeldungPriceFormatted}. Wenn die Abmeldung nicht über das normale Stadt-Portal möglich ist und direkt über unsere GKS/KBA-Anbindung eingereicht werden muss, können zusätzlich 10,00 € KBA/GKS-Gebühr anfallen. Wir prüfen das vorab kostenlos und informieren Sie immer vorher.`,
    },
    {
      question: 'Was brauche ich für die Online-Abmeldung?',
      answer:
        'Sie brauchen in der Regel den Fahrzeugschein mit Sicherheitscode, Fotos der Kennzeichen mit freigelegten Siegeln und Ihre Kontaktdaten für Rückfragen und Bestätigung. Wenn ein Code schwer lesbar ist, schicken Sie uns einfach ein Foto per WhatsApp. Wir prüfen kostenlos.',
    },
    {
      question: 'Was passiert nach der Abmeldung?',
      answer:
        'Nach erfolgreicher Abmeldung erhalten Sie die offizielle Bestätigung direkt als PDF. Versicherung und Kfz-Steuer werden automatisch informiert. Zu viel gezahlte Beträge werden in der Regel entsprechend verarbeitet oder erstattet.',
    },
    {
      question: 'Kann ich mein Auto ohne Termin online abmelden?',
      answer:
        'Ja, in vielen Fällen ist kein Termin bei der Zulassungsstelle nötig. Sie starten den Vorgang online und erhalten die Bestätigung nach erfolgreicher Bearbeitung per E-Mail.',
    },
    {
      question: 'Gibt es Hilfe, wenn ein Sicherheitscode nicht lesbar ist?',
      answer:
        'Ja. Wenn ein Sicherheitscode schwer lesbar ist, können Sie uns ein Foto per WhatsApp senden. Wir prüfen kostenlos und helfen beim weiteren Ablauf.',
    },
  ];

    const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}#webpage`,
        url: baseUrl,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        inLanguage: 'de-DE',
        isPartOf: {
          '@id': `${baseUrl}#website`,
        },
        about: {
          '@id': `${baseUrl}#service`,
        },
        breadcrumb: {
          '@id': `${baseUrl}#breadcrumb`,
        },
      },
      {
        '@type': 'Service',
        '@id': `${baseUrl}#service`,
        name: 'Auto online abmelden',
        alternateName: [
          'KFZ online abmelden',
          'Fahrzeug online abmelden',
          'Auto abmelden online',
          'Digitale Fahrzeugabmeldung',
          'PKW online abmelden',
          'Motorrad online abmelden',
          'Anhänger online abmelden',
        ],
        serviceType: 'Digitale Fahrzeugabmeldung',
        category: 'KFZ-Abmeldung',
        url: `${baseUrl}/product/fahrzeugabmeldung`,
        description:
          'Online-Abmeldung eines Fahrzeugs in Deutschland. Der Service unterstützt Fahrzeughalter bei der digitalen Fahrzeugabmeldung und stellt nach erfolgreicher Bearbeitung eine amtliche Bestätigung per E-Mail bereit.',
        provider: {
          '@id': `${baseUrl}#organization`,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Deutschland',
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Fahrzeughalter in Deutschland',
        },
        offers: {
          '@type': 'Offer',
          '@id': `${baseUrl}/product/fahrzeugabmeldung#offer`,
          url: `${baseUrl}/product/fahrzeugabmeldung`,
          price: offerPrice,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          seller: {
            '@id': `${baseUrl}#organization`,
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Startseite',
            item: baseUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}#faq`,
        mainEntity: homepageFaqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      ...VIDEO_ITEMS.map((video, index) => ({
        '@type': 'VideoObject',
        '@id': `${baseUrl}#video-${index + 1}`,
        name: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        uploadDate: video.uploadDate,
        embedUrl: video.embedUrl,
        publisher: {
          '@id': `${baseUrl}#organization`,
        },
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main id="main-content">
        <Hero
          abmeldungPrice={pricing.abmeldungPriceFormatted}
          anmeldungPrice={pricing.anmeldungPriceFormatted}
        />

        <section
          className="bg-white py-12 md:py-14"
          aria-labelledby="auto-online-abmelden-kurz-erklaert"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 via-white to-accent/5 p-6 shadow-sm md:p-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/10 px-4 py-1.5 text-primary">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-bold">Kurz erklärt</span>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                <div>
                  <h2
                    id="auto-online-abmelden-kurz-erklaert"
                    className="mb-4 text-3xl font-extrabold leading-tight text-primary md:text-4xl"
                  >
                    Auto online abmelden: Das Wichtigste auf einen Blick
                  </h2>

                  <p className="max-w-3xl text-lg leading-relaxed text-gray-600">
                    Mit unserem Service können Sie Ihr Auto online abmelden, ohne Termin bei der
                    Zulassungsstelle. Die Abmeldung startet digital, kostet ab{' '}
                    {pricing.abmeldungPriceFormatted} und die offizielle Bestätigung kommt nach
                    erfolgreicher Bearbeitung per E-Mail.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/product/fahrzeugabmeldung"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-extrabold text-primary transition hover:bg-accent-600 hover:shadow-lg hover:shadow-accent/20"
                    >
                      Jetzt abmelden – {pricing.abmeldungPriceFormatted}
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <a
                      href={settings.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-7 py-3 font-bold text-primary transition hover:bg-primary/5"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp Hilfe
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {[
                    {
                      title: 'Preis',
                      text: `Online-Abmeldung ab ${pricing.abmeldungPriceFormatted}. Zusätzliche KBA/GKS-Gebühren werden vorher transparent erklärt.`,
                    },
                    {
                      title: 'Unterlagen',
                      text: 'Fahrzeugschein, Kennzeichenfotos, Sicherheitscodes und Kontaktdaten reichen in vielen Fällen aus.',
                    },
                    {
                      title: 'Bestätigung',
                      text: 'Nach erfolgreicher Bearbeitung erhalten Sie die offizielle Bestätigung direkt per E-Mail.',
                    },
                    {
                      title: 'Hilfe',
                      text: 'Bei schwer lesbaren Codes helfen wir per WhatsApp und prüfen Fotos kostenlos vor.',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                      <h3 className="mb-2 font-bold text-gray-900">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <PricingBox price={pricing.abmeldungPriceFormatted} paymentMethods={paymentLabels} />

        <Steps />

        <section
          className="bg-gray-50 py-14 md:py-16"
          aria-labelledby="warum-online-auto-abmelden"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center md:mb-12">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
                <BadgeCheck className="h-4 w-4" />
                Vertrauen & Sicherheit
              </span>

              <h2
                id="warum-online-auto-abmelden"
                className="mb-4 text-3xl font-extrabold text-primary md:text-4xl"
              >
                Warum Online Auto Abmelden?
              </h2>

              <p className="mx-auto max-w-2xl text-gray-600">
                Offiziell, schnell und bundesweit – mit persönlichem Support per Telefon und
                WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {[
                {
                  icon: Shield,
                  title: 'Offiziell eingereicht',
                  desc: 'Digitale Bearbeitung über unsere GKS-Anbindung nach §34 FZV.',
                },
                {
                  icon: Headphones,
                  title: 'Schneller Support',
                  desc: 'Direkte Hilfe per Telefon und WhatsApp, wenn etwas unklar ist.',
                },
                {
                  icon: Clock,
                  title: '24/7 verfügbar',
                  desc: 'Auch am Wochenende und an Feiertagen. Kein Termin nötig.',
                },
                {
                  icon: FileCheck,
                  title: 'Offizielle Bestätigung',
                  desc: 'Nach erfolgreicher Bearbeitung direkt als PDF per E-Mail.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="bg-white py-14 md:py-16"
          aria-labelledby="videos-auto-online-abmelden"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
                  <PlayCircle className="h-4 w-4" />
                  Video-Hilfe zur Online-Abmeldung
                </span>

                <h2
                  id="videos-auto-online-abmelden"
                  className="mb-5 text-3xl font-extrabold leading-tight text-primary md:text-4xl"
                >
                  Sicherheitscodes einfach per Video erklärt
                </h2>

                <p className="mb-6 text-lg leading-relaxed text-gray-600">
                  Viele Kunden möchten vorher genau sehen, wo der Sicherheitscode am Kennzeichen
                  und im Fahrzeugschein zu finden ist. Unsere Erklärvideos zeigen die wichtigsten
                  Schritte einfach und verständlich.
                </p>

                <div className="mb-8 space-y-3">
                  {[
                    'Sicherheitscode am Kennzeichen richtig freilegen',
                    'Sicherheitscode im Fahrzeugschein finden',
                    'Fehler beim Freilegen vermeiden',
                    'Danach direkt online abmelden',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/vedio"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary-600"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Videos ansehen
                  </Link>

                  <a
                    href="https://www.youtube.com/@ikfzdigitalzulassung"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-700"
                  >
                    <Youtube className="h-5 w-5" />
                    YouTube öffnen
                  </a>
                </div>
              </div>

              <div className="grid gap-5">
                {VIDEO_ITEMS.map((video) => (
                  <div
                    key={video.embedUrl}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm"
                  >
                    <div className="mb-4 aspect-video overflow-hidden rounded-xl bg-black">
                      <iframe
                        className="h-full w-full"
                        src={video.embedUrl}
                        title={video.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>

                    <h3 className="mb-2 font-bold text-gray-900">{video.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{video.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 py-14 md:py-20"
          aria-labelledby="so-funktioniert-die-digitale-fahrzeugabmeldung"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/[0.03] blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/[0.03] blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center md:mb-16">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
                <BadgeCheck className="h-4 w-4" />
                So funktioniert&apos;s
              </span>

              <h2
                id="so-funktioniert-die-digitale-fahrzeugabmeldung"
                className="mb-5 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-5xl"
              >
                Auto online abmelden –{' '}
                <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                  einfach, offiziell und verständlich
                </span>
              </h2>

              <p className="mx-auto max-w-2xl text-lg text-gray-500">
                Der Ablauf ist klar aufgebaut: Unterlagen prüfen, Daten eingeben, Vorgang absenden
                und die offizielle Bestätigung per E-Mail erhalten.
              </p>
            </div>

            <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  icon: BadgeCheck,
                  title: 'Bundesweit gültige Abmeldung',
                  desc: 'Unser Service nutzt eine GKS-Anbindung für die digitale Fahrzeugabmeldung. Ihre Online-Abmeldung wird offiziell digital eingereicht.',
                  color: 'primary' as const,
                },
                {
                  icon: Banknote,
                  title: 'Steuer & Versicherung automatisch informiert',
                  desc: 'Nach der Abmeldung werden Kfz-Steuer und Versicherung automatisch informiert. Zu viel gezahlte Beträge werden in der Regel verarbeitet oder erstattet.',
                  color: 'accent' as const,
                },
                {
                  icon: Camera,
                  title: 'Nur wenige Unterlagen nötig',
                  desc: 'In vielen Fällen reichen Fahrzeugschein, Sicherheitscodes und Fotos der Kennzeichen. Bei Fragen helfen wir per WhatsApp.',
                  color: 'primary' as const,
                },
                {
                  icon: Mail,
                  title: 'Offizielle Bestätigung als PDF',
                  desc: 'Nach erfolgreicher Bearbeitung erhalten Sie die offizielle Bestätigung direkt per E-Mail – schnell und unkompliziert.',
                  color: 'accent' as const,
                },
                {
                  icon: Truck,
                  title: 'Viele Fahrzeugtypen & ganz Deutschland',
                  desc: 'PKW, Motorrad, Anhänger, Wohnmobil und weitere Fahrzeugtypen können in vielen Fällen digital abgemeldet werden – bundesweit.',
                  color: 'primary' as const,
                },
              ].map(({ icon: Icon, title, desc, color }, index) => (
                <div
                  key={title}
                  className={`group relative rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                    index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div
                    className={`absolute left-8 right-8 top-0 h-[3px] rounded-b-full ${
                      color === 'accent' ? 'bg-accent' : 'bg-primary'
                    } opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 ${
                      color === 'accent'
                        ? 'bg-accent/10 group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/20'
                        : 'bg-primary/10 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/20'
                    }`}
                  >
                    <Icon
                      className={`h-7 w-7 transition-colors duration-500 ${
                        color === 'accent'
                          ? 'text-accent group-hover:text-white'
                          : 'text-primary group-hover:text-white'
                      }`}
                    />
                  </div>
                  <h3 className="mb-2.5 text-lg font-bold text-gray-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
                </div>
              ))}

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark via-primary-900 to-dark p-7 text-white shadow-xl md:col-span-2 lg:col-span-1">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />

                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
                    <Shield className="h-7 w-7 text-accent" />
                  </div>

                  <div className="mb-2.5 flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Wichtige Information</h3>
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                      Hinweis
                    </span>
                  </div>

                  <p className="mb-5 text-sm leading-relaxed text-white/70">
                    Nicht jede Stadt oder jeder Landkreis hat ein eigenes Online-Portal. Wenn die
                    Abmeldung direkt über unsere GKS/KBA-Anbindung eingereicht werden muss, können
                    zusätzlich 10,00 € KBA/GKS-Gebühr anfallen. Wir informieren Sie immer vorher.
                  </p>

                  <a
                    href={settings.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Jetzt kostenlos per WhatsApp prüfen lassen"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-lg hover:shadow-accent/30"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Kostenlos prüfen
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg md:p-8"
                aria-labelledby="weitere-informationen-zur-online-abmeldung"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </div>
                  <h3
                    id="weitere-informationen-zur-online-abmeldung"
                    className="text-xl font-bold text-gray-900"
                  >
                    Weitere Informationen zur Online-Abmeldung
                  </h3>
                </div>

                <nav aria-label="Weitere Informationen zur Online-Abmeldung">
                  <div className="grid gap-3 md:grid-cols-2">
                    {SERVICE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group/link flex items-center gap-2 font-semibold text-primary transition-colors hover:text-accent"
                      >
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary transition-colors group-hover/link:bg-accent" />
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </nav>

                <div className="mt-8 border-t border-gray-100 pt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Häufig gesuchte Ratgeber
                  </p>

                  <div className="grid gap-3 md:grid-cols-2">
                    {GUIDE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm font-semibold text-gray-600 transition hover:text-primary hover:underline"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              <section
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg md:p-8"
                aria-labelledby="beliebte-seiten-zur-fahrzeugabmeldung"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Truck className="h-5 w-5 text-accent" />
                  </div>
                  <h3
                    id="beliebte-seiten-zur-fahrzeugabmeldung"
                    className="text-xl font-bold text-gray-900"
                  >
                    Beliebte Seiten zur Fahrzeugabmeldung
                  </h3>
                </div>

                <nav aria-label="Beliebte Seiten zur Fahrzeugabmeldung">
                  <div className="grid gap-3 md:grid-cols-2">
                    {CITY_LINKS.slice(0, 8).map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${city.slug}`}
                        className="group/link flex items-center gap-2 font-semibold text-primary transition-colors hover:text-accent"
                      >
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent transition-colors group-hover/link:bg-primary" />
                        {city.name}
                      </Link>
                    ))}
                  </div>

                  {CITY_LINKS.length > 8 && (
                    <details className="group/details mt-5">
                      <summary className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-gray-100">
                        Weitere Städte anzeigen
                      </summary>

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {CITY_LINKS.slice(8).map((city) => (
                          <Link
                            key={city.slug}
                            href={`/${city.slug}`}
                            className="group/link flex items-center gap-2 font-semibold text-primary transition-colors hover:text-accent"
                          >
                            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent transition-colors group-hover/link:bg-primary" />
                            {city.name}
                          </Link>
                        ))}
                      </div>
                    </details>
                  )}
                </nav>

                <div className="mt-6 border-t border-gray-100 pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Bundesland-Übersichten
                  </p>

                  <details>
                    <summary className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-gray-100">
                      Bundesländer anzeigen
                    </summary>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {BUNDESLAND_LINKS.map((bl) => (
                        <Link
                          key={bl.slug}
                          href={`/${bl.slug}`}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-primary/70 transition-colors hover:bg-gray-100 hover:text-primary"
                        >
                          {bl.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                </div>

                <p className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4 text-primary/40" />
                  Unser Service funktioniert bundesweit in jeder Stadt und in jedem Landkreis.
                </p>
              </section>
            </div>
          </div>
        </section>

        <section
          id="ueber-uns"
          className="bg-white py-14 md:py-16"
          aria-labelledby="support-hilfe"
        >
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
              <HelpCircle className="h-4 w-4" />
              Persönliche Hilfe
            </span>

            <h2
              id="support-hilfe"
              className="mb-6 text-3xl font-extrabold text-primary md:text-4xl"
            >
              Kostenloser Experten-Support bei Fragen und Problemen
            </h2>

            <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600">
              Für die Abmeldung brauchen Sie bei uns in vielen Fällen keinen Ausweis-Upload. Meist
              reichen Fahrzeugschein, Kennzeichenfotos und die benötigten Codes. Wenn etwas unklar
              ist, helfen wir sofort per Telefon oder WhatsApp.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={settings.phoneLink}
                aria-label={`Jetzt anrufen unter ${settings.phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary-600"
              >
                <Phone className="h-5 w-5" />
                {settings.phone}
              </a>

              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Live-Chat öffnen"
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 font-bold text-white transition-colors hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Live-Chat
              </a>
            </div>
          </div>
        </section>

        <FAQ items={homepageFaqItems} />

        {posts.length > 0 && (
          <section
            className="bg-gray-50 py-14 md:py-16"
            aria-labelledby="ratgeber-online-auto-abmelden"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex items-end justify-between md:mb-12">
                <div>
                  <h2
                    id="ratgeber-online-auto-abmelden"
                    className="text-3xl font-extrabold text-primary md:text-4xl"
                  >
                    Ratgeber zu Online Auto Abmelden
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Aktuelle Artikel und Ratgeber rund um die digitale Fahrzeugabmeldung
                  </p>
                </div>

                <Link
                  href="/insiderwissen"
                  className="hidden font-bold text-primary transition-colors hover:text-accent md:inline-flex md:items-center md:gap-2"
                >
                  Alle Artikel →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/insiderwissen"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white"
                >
                  Jetzt noch mehr zu Online Auto Abmelden
                </Link>
              </div>
            </div>
          </section>
        )}

        <section
          className="bg-gradient-to-br from-dark via-primary-900 to-dark py-14 text-center md:py-16"
          aria-labelledby="jetzt-auto-online-abmelden"
        >
          <div className="mx-auto max-w-3xl px-4">
            <h2
              id="jetzt-auto-online-abmelden"
              className="mb-6 text-3xl font-extrabold text-white md:text-4xl"
            >
              Bereit? Jetzt Auto online abmelden!
            </h2>

            <p className="mb-8 text-lg text-white/70">
              In wenigen Minuten vorbereitet. In vielen Fällen kein Ausweis-Upload nötig. Bestätigung nach erfolgreicher Bearbeitung erhalten.
            </p>

            <Link
              href="/product/fahrzeugabmeldung"
              aria-label={`Jetzt Auto online abmelden für ${pricing.abmeldungPriceFormatted}`}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-10 py-5 text-xl font-extrabold text-primary transition-all hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-xl hover:shadow-accent/30"
            >
              Jetzt für {pricing.abmeldungPriceFormatted} abmelden
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
