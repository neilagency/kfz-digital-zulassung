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
} from 'lucide-react';

const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: true });

const PAGE_TITLE = 'Auto online abmelden ab 19,70 € | Offiziell & in 2 Min.';
const PAGE_DESCRIPTION =
  'Auto online abmelden ab 19,70 €. Ohne Ausweis & PIN. Offizielle Bestätigung per E-Mail. Steuer & Versicherung automatisch informiert. 24/7 möglich.';

const CITY_LINKS = [
  { name: 'Berlin', slug: 'berlin-zulassungsstelle' },
  { name: 'München', slug: 'auto-online-abmelden-muenchen' },
  { name: 'Hamburg', slug: 'kfz-online-abmelden-in-hamburg' },
  { name: 'Köln', slug: 'kfz-online-abmelden-koeln' },
  { name: 'Frankfurt', slug: 'frankfurt' },
  { name: 'Stuttgart', slug: 'zulassungsservice-stuttgart' },
  { name: 'Düsseldorf', slug: 'zulassungsservice-duesseldorf' },
  { name: 'Dortmund', slug: 'kfz-online-abmelden-dortmund' },
  { name: 'Essen', slug: 'kfz-online-abmelden-essen' },
  { name: 'Leipzig', slug: 'leipzig' },
  { name: 'Bremen', slug: 'kfz-online-abmelden-bremen' },
  { name: 'Dresden', slug: 'dresden-kfz-zulassungsstelle' },
  { name: 'Hannover', slug: 'zulassungsservice-hannover' },
  { name: 'Nürnberg', slug: 'zulassungsservice-nuernberg' },
  { name: 'Duisburg', slug: 'duisburg' },
  { name: 'Bochum', slug: 'auto-online-abmelden-in-bochum' },
  { name: 'Bielefeld', slug: 'zulassungsservice-bielefeld' },
  { name: 'Münster', slug: 'zulassungsservice-muenster' },
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
      canonical: s.siteUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: s.siteUrl,
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
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${settings.siteUrl}#organization`,
        name: settings.siteName,
        url: settings.siteUrl,
        logo: `${settings.siteUrl}/logo.webp`,
        email: settings.email,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+4915224999190',
            email: settings.email,
            contactType: 'customer support',
            areaServed: 'DE',
            availableLanguage: ['de', 'ar'],
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${settings.siteUrl}#website`,
        url: settings.siteUrl,
        name: settings.siteName,
        description: settings.siteDescription,
        inLanguage: 'de-DE',
        publisher: {
          '@id': `${settings.siteUrl}#organization`,
        },
      },
      {
        '@type': 'Service',
        '@id': `${settings.siteUrl}#service`,
        name: 'Auto online abmelden',
        serviceType: 'Digitale Fahrzeugabmeldung',
        url: settings.siteUrl,
        description: PAGE_DESCRIPTION,
        provider: {
          '@id': `${settings.siteUrl}#organization`,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Deutschland',
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Fahrzeughalter in Deutschland',
        },
      },
      
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

        <Steps />

        <section
          className="py-14 md:py-16 bg-gray-50"
          aria-labelledby="warum-online-auto-abmelden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <h2
                id="warum-online-auto-abmelden"
                className="text-3xl md:text-4xl font-extrabold text-primary mb-4"
              >
                Warum Online Auto Abmelden?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Offiziell, schnell und bundesweit – mit persönlichem Support per Telefon und
                WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Offiziell & rechtssicher',
                  desc: 'Digitale Bearbeitung über unsere GKS-Anbindung. Bundesweit zuverlässig und offiziell.',
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
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PricingBox price={pricing.abmeldungPriceFormatted} paymentMethods={paymentLabels} />

        <section
          className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
          aria-labelledby="so-funktioniert-die-digitale-fahrzeugabmeldung"
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/[0.03] rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-20">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-5 py-2 rounded-full mb-5 border border-primary/10">
                <BadgeCheck className="w-4 h-4" />
                So funktioniert&apos;s
              </span>
              <h2
                id="so-funktioniert-die-digitale-fahrzeugabmeldung"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 leading-tight"
              >
                Auto online abmelden –{' '}
                <span className="text-primary bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                  So funktioniert die digitale Fahrzeugabmeldung
                </span>
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Offiziell, sicher und in wenigen Minuten erledigt.
              </p>
            </div>

            {/* Benefits Grid — 3 columns on desktop */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {[
                {
                  icon: BadgeCheck,
                  title: 'Amtlich anerkannt & bundesweit gültig',
                  desc: 'Unser Service nutzt die direkte GKS-Anbindung zum Kraftfahrt-Bundesamt. Ihre Online-Abmeldung wird offiziell digital eingereicht.',
                  color: 'primary' as const,
                },
                {
                  icon: Banknote,
                  title: 'Steuer & Versicherung automatisch informiert',
                  desc: 'Nach der Abmeldung werden Kfz-Steuer und Versicherung automatisch informiert. Zu viel gezahlte Beträge werden erstattet.',
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
                  className={`group relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                    index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  {/* Top accent line */}
                  <div
                    className={`absolute top-0 left-8 right-8 h-[3px] rounded-b-full ${
                      color === 'accent' ? 'bg-accent' : 'bg-primary'
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 ${
                      color === 'accent'
                        ? 'bg-accent/10 group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/20'
                        : 'bg-primary/10 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/20'
                    }`}
                  >
                    <Icon
                      className={`w-7 h-7 transition-colors duration-500 ${
                        color === 'accent'
                          ? 'text-accent group-hover:text-white'
                          : 'text-primary group-hover:text-white'
                      }`}
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2.5">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}

              {/* Wichtige Information — premium card */}
              <div className="relative bg-gradient-to-br from-dark via-primary-900 to-dark rounded-2xl p-7 text-white shadow-xl overflow-hidden md:col-span-2 lg:col-span-1">
                {/* Decorative glow */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />

                <div className="relative">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 border border-white/10">
                    <Shield className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <h3 className="font-bold text-white text-lg">Wichtige Information</h3>
                    <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Hinweis
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-5">
                    Nicht jede Stadt oder jeder Landkreis hat ein eigenes Online-Portal. Wenn
                    die Abmeldung direkt über unsere GKS/KBA-Anbindung eingereicht werden muss,
                    können zusätzlich 10,00 € KBA/GKS-Gebühr anfallen. Wir informieren Sie
                    immer vorher.
                  </p>
                  <a
                    href={settings.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Jetzt kostenlos per WhatsApp prüfen lassen"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-white font-semibold text-sm px-6 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Kostenlos prüfen
                  </a>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="grid lg:grid-cols-2 gap-6">
              <section
                className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                aria-labelledby="weitere-informationen-zur-online-abmeldung"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h3
                    id="weitere-informationen-zur-online-abmeldung"
                    className="text-xl font-bold text-gray-900"
                  >
                    Weitere Informationen zur Online-Abmeldung
                  </h3>
                </div>
                <nav aria-label="Weitere Informationen zur Online-Abmeldung">
                  <div className="grid md:grid-cols-2 gap-3">
                    {SERVICE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors group/link"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover/link:bg-accent transition-colors flex-shrink-0" />
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </nav>
              </section>

              <section
                className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                aria-labelledby="beliebte-seiten-zur-fahrzeugabmeldung"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-accent" />
                  </div>
                  <h3
                    id="beliebte-seiten-zur-fahrzeugabmeldung"
                    className="text-xl font-bold text-gray-900"
                  >
                    Beliebte Seiten zur Fahrzeugabmeldung
                  </h3>
                </div>
                <nav aria-label="Beliebte Seiten zur Fahrzeugabmeldung">
                  <div className="grid md:grid-cols-2 gap-3">
                    {CITY_LINKS.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${city.slug}`}
                        className="flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors group/link"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover/link:bg-primary transition-colors flex-shrink-0" />
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </nav>

                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Bundesland-Übersichten</p>
                  <div className="flex flex-wrap gap-2">
                    {BUNDESLAND_LINKS.map((bl) => (
                      <Link
                        key={bl.slug}
                        href={`/${bl.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary/70 hover:text-primary bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full transition-colors"
                      >
                        {bl.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-5 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary/40" />
                  Unser Service funktioniert bundesweit in jeder Stadt und in jedem Landkreis.
                </p>
              </section>
            </div>
          </div>
        </section>

        <section id="ueber-uns" className="py-14 md:py-16 bg-white" aria-labelledby="support-hilfe">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              id="support-hilfe"
              className="text-3xl md:text-4xl font-extrabold text-primary mb-6"
            >
              Kostenloser Experten-Support bei Fragen und Problemen
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
              Für die Abmeldung brauchen Sie bei uns in vielen Fällen keinen Ausweis-Upload. Meist
              reichen Fahrzeugschein, Kennzeichenfotos und die benötigten Codes. Wenn etwas unklar
              ist, helfen wir sofort per Telefon oder WhatsApp.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={settings.phoneLink}
                aria-label={`Jetzt anrufen unter ${settings.phone}`}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                {settings.phone}
              </a>

              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Live-Chat öffnen"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Live-Chat
              </a>
            </div>
          </div>
        </section>

        <FAQ items={homepageFaqItems} withSchema />

        {posts.length > 0 && (
          <section className="py-14 md:py-16 bg-gray-50" aria-labelledby="ratgeber-online-auto-abmelden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-10 md:mb-12">
                <div>
                  <h2
                    id="ratgeber-online-auto-abmelden"
                    className="text-3xl md:text-4xl font-extrabold text-primary"
                  >
                    Ratgeber zu Online Auto Abmelden
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Aktuelle Artikel und Ratgeber rund um die digitale Fahrzeugabmeldung
                  </p>
                </div>

                <Link
                  href="/insiderwissen"
                  className="hidden md:inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors"
                >
                  Alle Artikel →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/insiderwissen"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold"
                >
                  Jetzt noch mehr zu Online Auto Abmelden
                </Link>
              </div>
            </div>
          </section>
        )}

        <section
          className="py-14 md:py-16 bg-gradient-to-br from-dark via-primary-900 to-dark text-center"
          aria-labelledby="jetzt-auto-online-abmelden"
        >
          <div className="max-w-3xl mx-auto px-4">
            <h2
              id="jetzt-auto-online-abmelden"
              className="text-3xl md:text-4xl font-extrabold text-white mb-6"
            >
              Bereit? Jetzt Auto online abmelden!
            </h2>
            <p className="text-white/70 text-lg mb-8">
              In nur 2 Minuten erledigt. In vielen Fällen kein Ausweis-Upload nötig. Offizielle
              Bestätigung direkt erhalten.
            </p>
            <Link
              href="/product/fahrzeugabmeldung"
              aria-label={`Jetzt Auto online abmelden für ${pricing.abmeldungPriceFormatted}`}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-primary font-extrabold px-10 py-5 rounded-full text-xl transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Jetzt für {pricing.abmeldungPriceFormatted} abmelden
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
