import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Banknote,
  Clock,
  MailCheck,
  AlertTriangle,
  ArrowRight,
  ReceiptText,
  Building2,
} from 'lucide-react';
import { getHomepagePricing, getSiteSettings } from '@/lib/db';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/auto-online-abmelden-kosten`;

  const title = 'Auto online abmelden Kosten – Preis ab 19,70 € erklärt';
  const description =
    'Was kostet Auto online abmelden? Alle Kosten einfach erklärt: Online-Service, mögliche Zusatzgebühren und Bestätigung per E-Mail.';

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
          alt: 'Online Auto Abmelden – Kosten der Online-Abmeldung',
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

export default async function Page() {
  const [settings, pricing] = await Promise.all([
    getSiteSettings(),
    getHomepagePricing(),
  ]);

  const baseUrl = settings.siteUrl.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/auto-online-abmelden-kosten`;

  const faqItems = [
    {
      question: 'Was kostet Auto online abmelden?',
      answer: `Die Online-Abmeldung kostet bei unserem Service ab ${pricing.abmeldungPriceFormatted}. Der Preis wird vor dem Start klar angezeigt.`,
    },
    {
      question: 'Gibt es versteckte Kosten?',
      answer:
        'Nein. Der Preis wird transparent angezeigt. Falls in einem Sonderfall zusätzliche KBA- oder GKS-Gebühren nötig werden, informieren wir vorher.',
    },
    {
      question: 'Warum kostet ein privater Online-Service mehr als das Amt?',
      answer:
        'Ein privater Online-Service übernimmt den digitalen Ablauf, prüft Eingaben, hilft bei Fehlern und stellt persönliche Unterstützung bereit. Dafür fällt eine Servicegebühr an.',
    },
    {
      question: 'Bekomme ich eine Rechnung oder Bestätigung?',
      answer:
        'Nach erfolgreicher Bearbeitung erhalten Sie die offizielle Abmeldebestätigung digital per E-Mail. Je nach Bestellung erhalten Sie außerdem eine Rechnung oder Zahlungsbestätigung.',
    },
    {
      question: 'Wird die Kfz-Steuer nach der Abmeldung automatisch beendet?',
      answer:
        'Nach der erfolgreichen Abmeldung werden die zuständigen Stellen informiert. Zu viel gezahlte Kfz-Steuer wird in der Regel entsprechend verarbeitet oder erstattet.',
    },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: 'Auto online abmelden Kosten – Preis ab 19,70 € erklärt',
        description:
          'Was kostet Auto online abmelden? Alle Kosten einfach erklärt: Online-Service, mögliche Zusatzgebühren und Bestätigung per E-Mail.',
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
            name: 'Auto online abmelden Kosten',
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
        <section className="bg-gradient-to-br from-dark via-primary-900 to-dark pb-14 pt-28 md:pt-32">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <nav className="mb-6 flex items-center gap-2 text-sm text-white/50">
              <Link href="/" className="transition-colors hover:text-white/80">
                Startseite
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-white/80">Kosten</span>
            </nav>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
              <Banknote className="h-4 w-4 text-accent" />
              Preis transparent erklärt
            </div>

            <h1 className="mb-6 max-w-4xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
              Auto online abmelden Kosten – einfach erklärt
            </h1>

            <div className="mb-6 max-w-4xl rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base leading-7 text-slate-900 md:text-lg">
                <strong>Kurzantwort:</strong> Die Online-Abmeldung kostet bei
                unserem Service ab {pricing.abmeldungPriceFormatted}. Der Preis
                wird vor dem Start klar angezeigt. In Sonderfällen können zusätzliche
                KBA- oder GKS-Gebühren entstehen, über die vorher informiert wird.
              </p>
            </div>

            <p className="mb-8 max-w-3xl text-lg leading-8 text-white/70">
              Viele möchten vor der Abmeldung wissen, welche Kosten wirklich entstehen.
              Hier finden Sie eine einfache Übersicht ohne versteckte Begriffe und ohne
              komplizierte Erklärung.
            </p>

            <div className="flex flex-wrap gap-4">
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

        <div className="mx-auto mt-10 max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-5 text-3xl font-extrabold text-gray-900">
              Was kostet Auto online abmelden?
            </h2>

            <p className="mb-4 text-lg leading-8 text-gray-700">
              Die Kosten für die Online-Abmeldung hängen davon ab, ob Sie den
              Vorgang selbst über ein Behördenportal erledigen oder einen
              spezialisierten Online-Service beauftragen.
            </p>

            <p className="text-lg leading-8 text-gray-700">
              Bei unserem Service startet die digitale Fahrzeugabmeldung ab{' '}
              <strong>{pricing.abmeldungPriceFormatted}</strong>. Der Preis wird
              vor dem Start klar angezeigt.
            </p>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-6 text-3xl font-extrabold text-gray-900">
              Preisübersicht
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-primary/10 bg-primary p-7 text-white">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <ReceiptText className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-3xl font-extrabold">
                  {pricing.abmeldungPriceFormatted}
                </h3>
                <p className="text-white/80">
                  Startpreis für die digitale Fahrzeugabmeldung über unseren Service.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-7">
                <h3 className="mb-4 text-xl font-extrabold text-gray-900">
                  Enthaltene Leistungen
                </h3>

                <ul className="space-y-3 text-gray-700">
                  {[
                    'Digitale Vorbereitung der Abmeldung',
                    'Prüfung der wichtigsten Angaben',
                    'Hilfe bei typischen Code-Problemen',
                    'Persönliche Unterstützung per WhatsApp',
                    'Offizielle Bestätigung nach erfolgreicher Bearbeitung',
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-600" />
                <p className="leading-7 text-amber-900">
                  <strong>Wichtig:</strong> Wenn eine Abmeldung nicht über den normalen
                  digitalen Ablauf möglich ist und direkt über eine KBA- oder GKS-Abwicklung
                  eingereicht werden muss, können zusätzliche Gebühren entstehen. In solchen
                  Fällen informieren wir vorher.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-6 text-3xl font-extrabold text-gray-900">
              Behörde oder Online-Service: Wo liegt der Unterschied?
            </h2>

            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="bg-gray-50 p-5 font-bold text-gray-900">
                  Punkt
                </div>
                <div className="bg-gray-50 p-5 font-bold text-gray-900">
                  Behörde
                </div>
                <div className="bg-gray-50 p-5 font-bold text-gray-900">
                  Online-Service
                </div>

                {[
                  ['Preis', 'meist günstiger', `ab ${pricing.abmeldungPriceFormatted}`],
                  ['Termin', 'je nach Stadt nötig', 'online möglich'],
                  ['Hilfe bei Fehlern', 'oft begrenzt', 'persönlicher Support'],
                  ['Bedienung', 'oft technisch', 'einfach erklärt'],
                  ['Bestätigung', 'digital oder über Portal', 'per E-Mail nach Bearbeitung'],
                ].map(([label, office, service]) => (
                  <div key={label} className="contents">
                    <div className="border-t border-gray-100 p-5 font-semibold text-gray-900">
                      {label}
                    </div>
                    <div className="border-t border-gray-100 p-5 text-gray-700">
                      {office}
                    </div>
                    <div className="border-t border-gray-100 p-5 text-gray-700">
                      {service}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-5 text-3xl font-extrabold text-gray-900">
              Warum kostet ein Online-Service mehr als das Amt?
            </h2>

            <p className="mb-4 text-lg leading-8 text-gray-700">
              Die offizielle Behördenseite ist in vielen Fällen günstiger. Dafür ist
              der Ablauf dort oft technischer und nicht immer für jeden Nutzer einfach.
            </p>

            <p className="text-lg leading-8 text-gray-700">
              Ein Online-Service übernimmt den Ablauf, erklärt die Schritte einfacher,
              hilft bei typischen Fehlern und bietet persönliche Unterstützung. Genau
              dafür wird eine Servicegebühr berechnet.
            </p>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-6 text-3xl font-extrabold text-gray-900">
              Vorteile der Online-Abmeldung
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  icon: Banknote,
                  title: 'Transparenter Preis',
                  text: 'Der Preis wird vor dem Start klar angezeigt.',
                },
                {
                  icon: Clock,
                  title: 'Kein Termin nötig',
                  text: 'Der Vorgang kann online vorbereitet werden.',
                },
                {
                  icon: MailCheck,
                  title: 'Bestätigung per E-Mail',
                  text: 'Nach erfolgreicher Bearbeitung erhalten Sie die Bestätigung digital.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Offizieller Ablauf',
                  text: 'Die Abmeldung wird über den vorgesehenen digitalen Prozess bearbeitet.',
                },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
                  <p className="leading-7 text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-6 text-3xl font-extrabold text-gray-900">
              Häufige Fragen zu den Kosten
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

          <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-800 to-dark p-8 text-center text-white shadow-xl md:p-12">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
              <Building2 className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-white/90">
                Fahrzeug online abmelden
              </span>
            </div>

            <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
              Jetzt Auto online abmelden
            </h2>

            <p className="mx-auto mb-8 max-w-xl text-white/70">
              Starten Sie die digitale Abmeldung bequem online. Bei Fragen hilft
              unser Team persönlich per WhatsApp.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/product/fahrzeugabmeldung"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-primary transition-all hover:bg-accent-600 hover:shadow-lg"
              >
                Jetzt starten – {pricing.abmeldungPriceFormatted}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Hilfe
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
