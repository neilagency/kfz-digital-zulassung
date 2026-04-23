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

  const title = 'Auto abmelden online – offiziell & schnell ab 19,70 €';
  const description =
    'Auto abmelden online ohne Termin und ohne Wartezeit. Offizielle digitale Abmeldung mit Bestätigung per E-Mail. Jetzt starten ab 19,70 €.';

  return {
    title,
    description,
    alternates: {
      canonical: `${settings.siteUrl}/auto-abmelden-online`,
    },
    openGraph: {
      title,
      description,
      url: `${settings.siteUrl}/auto-abmelden-online`,
      siteName: settings.siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function AutoAbmeldenOnlinePage() {
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
        name: 'Auto abmelden online',
        item: `${settings.siteUrl}/auto-abmelden-online`,
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
          text: 'Sie legen die Sicherheitscodes frei, senden uns Ihre Fotos und Daten, schließen die Zahlung ab und erhalten danach Ihre offizielle Bestätigung per E-Mail.',
        },
      },
      {
        '@type': 'Question',
        name: 'Was kostet Auto abmelden online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Auto abmelden online kostet bei uns ${pricing.abmeldungPriceFormatted}. Alle Gebühren sind bereits enthalten.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Brauche ich einen Termin?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nein. Sie brauchen keinen Termin bei der Zulassungsstelle. Die komplette Abmeldung läuft online.',
        },
      },
      {
        '@type': 'Question',
        name: 'Wie schnell bekomme ich die Bestätigung?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nach erfolgreicher Bearbeitung erhalten Sie die offizielle Bestätigung direkt per E-Mail.',
        },
      },
    ],
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
              <span className="text-white/70">Auto abmelden online</span>
            </nav>

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">
                  Offiziell, digital und ohne Termin
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] mb-6">
                Auto abmelden online – schnell, offiziell und ohne Wartezeit
              </h1>

              <p className="text-white/70 text-lg md:text-xl leading-8 max-w-3xl mb-8">
                Auto abmelden online ist für viele der einfachste Weg, das
                Fahrzeug bequem von zu Hause abzumelden. Kein Termin, keine
                Anfahrt, keine unnötige Wartezeit. Sie senden Ihre Daten und
                Fotos digital und erhalten nach erfolgreicher Bearbeitung die
                offizielle Bestätigung per E-Mail.
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
                  'Ohne Termin',
                  'Offizielle Bestätigung per E-Mail',
                  '24/7 digital vorbereitbar',
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
                  Warum Auto abmelden online für viele die beste Lösung ist
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p>
                    Wer sein Auto online abmelden möchte, will den Vorgang
                    einfach, schnell und sicher erledigen. Genau dafür ist die
                    digitale Abmeldung gemacht. Statt einen Termin bei der
                    Zulassungsstelle zu suchen und vor Ort zu warten, starten
                    Sie direkt online.
                  </p>
                  <p>
                    Auto abmelden online spart vielen Fahrzeughaltern Zeit,
                    Wege und unnötigen Aufwand. Sie können alles in Ruhe von zu
                    Hause vorbereiten, die benötigten Daten digital senden und
                    erhalten nach erfolgreicher Bearbeitung Ihre offizielle
                    Bestätigung per E-Mail.
                  </p>
                  <p>
                    Besonders wichtig: Der Ablauf ist klar aufgebaut und für
                    viele deutlich angenehmer als der klassische Weg vor Ort.
                    Genau deshalb wird Auto abmelden online immer häufiger
                    genutzt.
                  </p>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-6">
                  Ihre Vorteile bei der Online-Abmeldung
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Auto online abmelden ohne Termin bei der Zulassungsstelle',
                    'Keine unnötige Anfahrt und keine Wartezeit',
                    'Offizielle Bestätigung direkt per E-Mail',
                    'Einfacher digitaler Ablauf mit klaren Schritten',
                    'Persönlicher Support per WhatsApp und Telefon',
                    'Fester Preis von nur ' + pricing.abmeldungPriceFormatted,
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
                  So funktioniert Auto abmelden online
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    {
                      step: '1',
                      title: 'Sicherheitscodes freilegen',
                      text: 'Legen Sie die Sicherheitscodes auf Fahrzeugschein und Kennzeichen frei.',
                    },
                    {
                      step: '2',
                      title: 'Fotos und Daten senden',
                      text: 'Senden Sie uns die benötigten Unterlagen und Angaben digital zu.',
                    },
                    {
                      step: '3',
                      title: 'Zahlung abschließen',
                      text: 'Sie schließen die Zahlung einfach online ab und wir bearbeiten den Vorgang.',
                    },
                    {
                      step: '4',
                      title: 'Bestätigung per E-Mail erhalten',
                      text: 'Nach erfolgreicher Bearbeitung erhalten Sie Ihre offizielle Bestätigung direkt per E-Mail.',
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
                  Was kostet Auto abmelden online?
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p>
                    Auto abmelden online kostet bei uns nur{' '}
                    <strong>{pricing.abmeldungPriceFormatted}</strong>. Der Preis
                    ist klar, transparent und ohne versteckte Zusatzkosten.
                  </p>
                  <p>
                    Viele Nutzer möchten vor dem Start genau wissen, was sie
                    zahlen. Genau deshalb setzen wir auf eine einfache und
                    verständliche Preisstruktur. Sie wissen sofort, woran Sie
                    sind, und können den Vorgang direkt online starten.
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
                    Kosten im Detail
                  </Link>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-5">
                  Welche Unterlagen brauchen Sie?
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p>
                    Damit Sie Ihr Auto online abmelden können, sollten die
                    wichtigsten Unterlagen vor dem Start bereitliegen. Je
                    vollständiger die Angaben sind, desto einfacher läuft der
                    gesamte Ablauf.
                  </p>
                </div>

                <ul className="mt-6 space-y-3">
                  {[
                    'Fahrzeugschein',
                    'Kennzeichen',
                    'Sicherheitscodes',
                    'Gut lesbare Fotos der benötigten Unterlagen',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-gray-600 leading-7">
                  Wenn alles bereitliegt, können Sie den Vorgang direkt online
                  beginnen und vermeiden unnötige Rückfragen oder Verzögerungen.
                </p>
              </section>

              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-6">
                  Häufige Fragen zu Auto abmelden online
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      q: 'Wie funktioniert Auto abmelden online?',
                      a: 'Sie legen die Sicherheitscodes frei, senden Ihre Daten und Fotos, schließen die Zahlung ab und erhalten danach Ihre Bestätigung per E-Mail.',
                    },
                    {
                      q: 'Brauche ich einen Termin?',
                      a: 'Nein, ein Termin bei der Zulassungsstelle ist nicht nötig. Die komplette Abmeldung läuft digital.',
                    },
                    {
                      q: 'Was kostet Auto abmelden online?',
                      a: `Bei uns kostet die Online-Abmeldung ${pricing.abmeldungPriceFormatted}.`,
                    },
                    {
                      q: 'Wie schnell bekomme ich die Bestätigung?',
                      a: 'Nach erfolgreicher Bearbeitung erhalten Sie Ihre offizielle Bestätigung direkt per E-Mail.',
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

              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-6">
                  Weitere wichtige Seiten rund um die Online-Abmeldung
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Beliebte Abmeldeseiten
                    </h3>
                    <ul className="space-y-3">
                      {[
                        { href: '/auto-sofort-abmelden', label: 'Auto sofort abmelden' },
                        { href: '/auto-schnell-abmelden', label: 'Auto schnell abmelden' },
                        { href: '/auto-fix-abmelden', label: 'Auto fix abmelden' },
                        { href: '/auto-abmelden-in-2-minuten', label: 'Auto abmelden in 2 Minuten' },
                        { href: '/auto-abmelden-ohne-ausweis', label: 'Auto abmelden ohne Ausweis' },
                        { href: '/kosten-autoabmeldung-online', label: 'Kosten Autoabmeldung online' },
                      ].map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="inline-flex items-center gap-2 text-primary hover:text-primary-700 font-medium"
                          >
                            <ChevronRight className="w-4 h-4" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Weitere Themen
                    </h3>
                    <ul className="space-y-3">
                      {[
                        { href: '/anhaenger-abmelden', label: 'Anhänger abmelden' },
                        { href: '/anhaenger-online-abmelden', label: 'Anhänger online abmelden' },
                        { href: '/motorrad-abmelden-online', label: 'Motorrad online abmelden' },
                        { href: '/kurzzeitkennzeichen', label: 'Kurzzeitkennzeichen' },
                        { href: '/kurzzeitkennzeichen-lkw', label: 'Kurzzeitkennzeichen LKW' },
                        { href: '/kostenlose-kennzeichenreservierung', label: 'Kostenlose Kennzeichenreservierung' },
                      ].map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="inline-flex items-center gap-2 text-primary hover:text-primary-700 font-medium"
                          >
                            <ChevronRight className="w-4 h-4" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                    Jetzt Auto abmelden online – nur{' '}
                    {pricing.abmeldungPriceFormatted}
                  </h2>
                  <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                    Schnell, einfach und ohne Termin. Starten Sie jetzt und
                    erhalten Sie Ihre offizielle Bestätigung direkt per E-Mail.
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
                    <p className="text-white/60 text-xs">
                      Auto online abmelden in wenigen Minuten
                    </p>
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
                      label: 'Offiziell & rechtssicher',
                      sub: 'Digitale Bearbeitung',
                    },
                    {
                      icon: Clock,
                      label: '24/7 vorbereitbar',
                      sub: 'Auch am Wochenende',
                    },
                    {
                      icon: CheckCircle,
                      label: 'Bestätigung per E-Mail',
                      sub: 'Nach erfolgreicher Bearbeitung',
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
