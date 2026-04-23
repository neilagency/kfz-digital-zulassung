import { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle,
  Clock,
  Shield,
  MessageCircle,
  FileText,
  Phone,
  ChevronRight,
} from 'lucide-react';
import { getHomepagePricing, getSiteSettings } from '@/lib/db';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: 'Auto online abmelden – sofort & offiziell ab 19,70 €',
    description:
      'Auto online abmelden in wenigen Minuten – ohne Termin, ohne Wartezeit. Offiziell über das KBA. Jetzt starten ab 19,70 € inkl. Bestätigung per E-Mail.',
    alternates: {
      canonical: `${settings.siteUrl}/auto-online-abmelden`,
    },
    openGraph: {
      title: 'Auto online abmelden – sofort & offiziell ab 19,70 €',
      description:
        'Auto online abmelden in wenigen Minuten – ohne Termin, ohne Wartezeit. Offiziell über das KBA. Jetzt starten ab 19,70 € inkl. Bestätigung per E-Mail.',
      url: `${settings.siteUrl}/auto-online-abmelden`,
      siteName: settings.siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Auto online abmelden – sofort & offiziell ab 19,70 €',
      description:
        'Auto online abmelden in wenigen Minuten – ohne Termin, ohne Wartezeit. Offiziell über das KBA. Jetzt starten ab 19,70 € inkl. Bestätigung per E-Mail.',
    },
  };
}

export default async function AutoOnlineAbmeldenPage() {
  const [settings, pricing] = await Promise.all([
    getSiteSettings(),
    getHomepagePricing(),
  ]);

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
        name: 'Auto online abmelden',
        item: `${settings.siteUrl}/auto-online-abmelden`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Wie kann ich mein Auto online abmelden?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sie rubbeln die Sicherheitscodes frei, senden uns die nötigen Fotos und Daten, schließen die Zahlung ab und erhalten danach Ihre offizielle Bestätigung per E-Mail.',
        },
      },
      {
        '@type': 'Question',
        name: 'Was kostet die Online-Abmeldung?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Die Online-Abmeldung kostet bei uns ${pricing.abmeldungPriceFormatted}. Alle Gebühren sind bereits enthalten.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Brauche ich einen Termin bei der Zulassungsstelle?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nein. Die komplette Abmeldung läuft digital, ohne Termin und ohne Wartezeit bei der Zulassungsstelle.',
        },
      },
      {
        '@type': 'Question',
        name: 'Wie erhalte ich die Bestätigung?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nach erfolgreicher Bearbeitung erhalten Sie die offizielle Bestätigung direkt per E-Mail als PDF.',
        },
      },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Auto online abmelden',
    provider: {
      '@type': 'Organization',
      name: settings.siteName,
      url: settings.siteUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Deutschland',
    },
    serviceType: 'Online Fahrzeugabmeldung',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: '19.70',
      availability: 'https://schema.org/InStock',
      url: `${settings.siteUrl}/auto-online-abmelden`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <main className="pb-20">
        <section className="relative bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-32 pb-14 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
              <Link href="/" className="hover:text-white/80 transition-colors">
                Startseite
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/70">Auto online abmelden</span>
            </nav>

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">
                  Offiziell, sicher und bundesweit
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-6">
                Auto online abmelden – in wenigen Minuten erledigt
              </h1>

              <p className="text-white/70 text-lg md:text-xl leading-8 max-w-3xl mb-8">
                Auto online abmelden ohne Termin und ohne Wartezeit. Sie senden
                uns einfach Ihre Daten und Fotos, wir kümmern uns um den Rest.
                Die offizielle Bestätigung erhalten Sie direkt per E-Mail.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
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

              <div className="flex flex-wrap gap-3">
                {[
                  'Sofortige Abmelde-Bestätigung',
                  '100% KBA-registrierter Service',
                  '24/7 – auch am Wochenende',
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm px-4 py-2 rounded-full border border-white/10"
                  >
                    <CheckCircle className="w-4 h-4 text-accent" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <article className="flex-1 min-w-0 space-y-8">
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-5">
                  Warum Auto online abmelden?
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p>
                    Wer sein Auto online abmelden möchte, spart Zeit, Nerven und
                    den Weg zur Zulassungsstelle. Statt auf einen Termin zu
                    warten, erledigen Sie alles bequem von zu Hause. Unser
                    Service ist deutschlandweit nutzbar und die Abmeldung
                    erfolgt offiziell über die amtliche Schnittstelle.
                  </p>
                  <p>
                    Gerade wenn es schnell gehen muss, ist die digitale Lösung
                    ideal. Keine langen Wartezeiten, kein unnötiger Papierkram
                    und kein komplizierter Ablauf. Sie senden Ihre Unterlagen,
                    wir übernehmen die Bearbeitung, und Sie erhalten die
                    Bestätigung direkt per E-Mail.
                  </p>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-6">
                  Ihre Vorteile auf einen Blick
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Kein Termin bei der Zulassungsstelle',
                    'Deutschlandweit nutzbar',
                    'Offizielle Bestätigung per E-Mail',
                    'Schnelle und einfache Bearbeitung',
                    'Persönlicher Support per Telefon und WhatsApp',
                    'Transparenter Festpreis ohne versteckte Kosten',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl bg-primary-50 px-4 py-4"
                    >
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-6">
                  So funktioniert die Online-Abmeldung
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    {
                      step: '1',
                      title: 'Sicherheitscodes freilegen',
                      text: 'Rubbeln Sie den Sicherheitscode im Fahrzeugschein und auf den Kennzeichen frei.',
                    },
                    {
                      step: '2',
                      title: 'Fotos senden',
                      text: 'Senden Sie uns die erforderlichen Fotos bequem per WhatsApp oder E-Mail.',
                    },
                    {
                      step: '3',
                      title: 'Zahlung abschließen',
                      text: 'Nach Prüfung erhalten Sie Ihren Zahlungslink und schließen die Zahlung sicher ab.',
                    },
                    {
                      step: '4',
                      title: 'Bestätigung erhalten',
                      text: 'Nach der Bearbeitung erhalten Sie die offizielle Bestätigung direkt per E-Mail.',
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent text-primary font-extrabold flex items-center justify-center mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-7">{item.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-5">
                  Was kostet Auto online abmelden?
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p>
                    Die Auto Online Abmeldung kostet bei uns nur{' '}
                    <strong>{pricing.abmeldungPriceFormatted}</strong>. Alle
                    Gebühren sind bereits enthalten. Sie wissen also von Anfang
                    an genau, womit Sie rechnen können.
                  </p>
                  <p>
                    Keine versteckten Zusatzkosten, keine unnötigen Extras. Sie
                    erhalten einen klaren Festpreis und eine schnelle
                    Bearbeitung.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href="/product/fahrzeugabmeldung"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-primary font-bold px-6 py-3 rounded-full transition-all"
                  >
                    Jetzt starten
                  </Link>
                  <Link
                    href="/auto-online-abmelden-kosten"
                    className="inline-flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary font-bold px-6 py-3 rounded-full transition-all"
                  >
                    Mehr zu den Kosten
                  </Link>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-6">
                  Häufige Fragen
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      q: 'Wie kann ich mein Auto online abmelden?',
                      a: 'Sie legen die Sicherheitscodes frei, senden Ihre Fotos und Daten an uns, schließen die Zahlung ab und erhalten danach die Bestätigung per E-Mail.',
                    },
                    {
                      q: 'Brauche ich einen Termin bei der Zulassungsstelle?',
                      a: 'Nein. Die Abmeldung läuft komplett digital. Ein Termin bei der Zulassungsstelle ist nicht nötig.',
                    },
                    {
                      q: 'Wie schnell bekomme ich die Bestätigung?',
                      a: 'Nach erfolgreicher Bearbeitung erhalten Sie Ihre offizielle Bestätigung direkt per E-Mail.',
                    },
                    {
                      q: 'Welche Unterlagen brauche ich?',
                      a: 'Sie benötigen in der Regel den Fahrzeugschein mit Sicherheitscode sowie die Kennzeichen mit freigelegten Siegelcodes.',
                    },
                  ].map((item) => (
                    <div
                      key={item.q}
                      className="rounded-2xl border border-gray-100 p-5"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.q}
                      </h3>
                      <p className="text-gray-600 leading-7">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-800 to-dark rounded-2xl p-8 md:p-10 text-center">
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

                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                    Jetzt Auto online abmelden – nur{' '}
                    {pricing.abmeldungPriceFormatted}
                  </h2>
                  <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                    Keine Wartezeit, kein Termin und eine offizielle
                    Bestätigung direkt per E-Mail. Starten Sie jetzt.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/product/fahrzeugabmeldung"
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-primary font-bold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Jetzt Abmeldung starten
                    </Link>

                    <a
                      href={settings.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-full transition-all backdrop-blur-sm"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp Hilfe
                    </a>
                  </div>
                </div>
              </section>
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

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">
                  Hilfe benötigt?
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  Unser Team hilft Ihnen persönlich weiter – schnell und direkt.
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
                      <p className="text-sm font-bold text-primary">
                        {settings.phone}
                      </p>
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
                      <p className="text-sm font-bold text-green-700">
                        Live-Chat starten
                      </p>
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
                      sub: 'Auch am Wochenende',
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
                        <p className="text-sm font-semibold text-gray-900">
                          {label}
                        </p>
                        <p className="text-xs text-gray-500">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
