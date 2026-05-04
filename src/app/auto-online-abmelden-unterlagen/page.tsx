
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle,
  ChevronRight,
  MessageCircle,
  FileText,
  ShieldCheck,
  KeyRound,
  Camera,
  MailCheck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { getHomepagePricing, getSiteSettings } from '@/lib/db';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/auto-online-abmelden-unterlagen`;

  const title = 'Auto online abmelden Unterlagen – was wird benötigt?';
  const description =
    'Welche Unterlagen braucht man für die Online-Abmeldung? Einfach erklärt: Fahrzeugschein, Kennzeichen, Sicherheitscodes und Bestätigung per E-Mail.';

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
          alt: 'Online Auto Abmelden – Unterlagen für die Online-Abmeldung',
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
  const canonicalUrl = `${baseUrl}/auto-online-abmelden-unterlagen`;

  const faqItems = [
    {
      question: 'Welche Unterlagen brauche ich für die Online-Abmeldung?',
      answer:
        'Für die Online-Abmeldung benötigen Sie in der Regel den Fahrzeugschein, beide Kennzeichen, die freigelegten Sicherheitscodes und eine E-Mail-Adresse für die Bestätigung.',
    },
    {
      question: 'Brauche ich den Fahrzeugbrief für die Online-Abmeldung?',
      answer:
        'Nein. Für die normale Fahrzeugabmeldung wird meistens nur die Zulassungsbescheinigung Teil I, also der Fahrzeugschein, benötigt. Der Fahrzeugbrief ist in der Regel nicht nötig.',
    },
    {
      question: 'Brauche ich einen Personalausweis oder die AusweisApp?',
      answer:
        'Bei unserem Service ist für die reine Online-Abmeldung in vielen Fällen keine AusweisApp nötig. Wichtig sind die richtigen Sicherheitscodes vom Fahrzeugschein und von den Kennzeichen.',
    },
    {
      question: 'Was passiert, wenn ein Sicherheitscode schlecht lesbar ist?',
      answer:
        'Wenn ein Sicherheitscode schlecht lesbar ist, sollten Sie nicht raten. Sie können ein Foto per WhatsApp senden und den Code prüfen lassen.',
    },
    {
      question: 'Bekomme ich eine offizielle Bestätigung?',
      answer:
        'Ja. Nach erfolgreicher Bearbeitung erhalten Sie die offizielle Abmeldebestätigung digital per E-Mail als PDF.',
    },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: 'Auto online abmelden Unterlagen – was wird benötigt?',
        description:
          'Welche Unterlagen braucht man für die Online-Abmeldung? Einfach erklärt: Fahrzeugschein, Kennzeichen, Sicherheitscodes und Bestätigung per E-Mail.',
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
            name: 'Auto online abmelden Unterlagen',
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
              <span className="text-white/80">Unterlagen</span>
            </nav>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
              <FileText className="h-4 w-4 text-accent" />
              Einfach erklärt
            </div>

            <h1 className="mb-6 max-w-4xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
              Auto online abmelden – diese Unterlagen brauchen Sie
            </h1>

            <div className="mb-6 max-w-4xl rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-base leading-7 text-slate-900 md:text-lg">
                <strong>Kurzantwort:</strong> Für die Online-Abmeldung brauchen Sie
                meistens den Fahrzeugschein, beide Kennzeichen und die freigelegten
                Sicherheitscodes. Der Fahrzeugbrief ist für die normale Abmeldung in
                der Regel nicht nötig. Nach erfolgreicher Bearbeitung erhalten Sie die
                offizielle Bestätigung per E-Mail.
              </p>
            </div>

            <p className="mb-8 max-w-3xl text-lg leading-8 text-white/70">
              Viele Autofahrer sind unsicher, welche Unterlagen für die
              Online-Abmeldung wirklich nötig sind. Hier finden Sie eine einfache
              Übersicht ohne komplizierte Begriffe.
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
              Welche Unterlagen werden für die Online-Abmeldung benötigt?
            </h2>

            <p className="mb-4 text-lg leading-8 text-gray-700">
              Für die Online-Abmeldung eines Fahrzeugs brauchen Sie nur wenige
              Angaben und Unterlagen. Wichtig ist vor allem, dass die Sicherheitscodes
              vollständig sichtbar und richtig lesbar sind.
            </p>

            <p className="text-lg leading-8 text-gray-700">
              Sie müssen keinen Termin bei der Zulassungsstelle buchen und die
              Unterlagen nicht persönlich abgeben. Der Vorgang kann digital
              vorbereitet und eingereicht werden.
            </p>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-6 text-3xl font-extrabold text-gray-900">
              Diese Unterlagen brauchen Sie
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  icon: FileText,
                  title: 'Fahrzeugschein',
                  text: 'Benötigt wird die Zulassungsbescheinigung Teil I. Dort befindet sich der wichtige Sicherheitscode.',
                },
                {
                  icon: Camera,
                  title: 'Kennzeichen',
                  text: 'In der Regel werden beide Kennzeichen benötigt. Auf den Plaketten befinden sich weitere Sicherheitscodes.',
                },
                {
                  icon: KeyRound,
                  title: 'Sicherheitscodes',
                  text: 'Die Codes müssen vorsichtig freigelegt werden. Sie müssen vollständig und gut lesbar sein.',
                },
                {
                  icon: MailCheck,
                  title: 'E-Mail-Adresse',
                  text: 'Die offizielle Bestätigung wird nach erfolgreicher Bearbeitung digital per E-Mail gesendet.',
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
            <h2 className="mb-5 text-3xl font-extrabold text-gray-900">
              Brauche ich den Fahrzeugbrief?
            </h2>

            <p className="mb-4 text-lg leading-8 text-gray-700">
              Für die normale Abmeldung eines Fahrzeugs wird der Fahrzeugbrief,
              also die Zulassungsbescheinigung Teil II, in der Regel nicht benötigt.
              Wichtig ist vor allem der Fahrzeugschein mit dem passenden Sicherheitscode.
            </p>

            <p className="text-lg leading-8 text-gray-700">
              Der Fahrzeugbrief ist eher bei Zulassung, Ummeldung, Verkauf oder
              Eigentumsfragen wichtig. Für die reine Abmeldung reicht meistens der
              Fahrzeugschein zusammen mit den Kennzeichen und Sicherheitscodes.
            </p>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-5 text-3xl font-extrabold text-gray-900">
              Was sind Sicherheitscodes?
            </h2>

            <p className="mb-4 text-lg leading-8 text-gray-700">
              Sicherheitscodes sind verdeckte Codes auf dem Fahrzeugschein und auf
              den Kennzeichen. Diese Codes zeigen, dass die Unterlagen für die
              digitale Abmeldung geeignet sind.
            </p>

            <p className="text-lg leading-8 text-gray-700">
              Die Codes müssen vorsichtig freigelegt werden. Wenn ein Code beschädigt
              oder falsch gelesen wird, kann die Online-Abmeldung scheitern.
            </p>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-600" />
                <p className="leading-7 text-amber-900">
                  <strong>Wichtig:</strong> Bitte raten Sie nicht, wenn ein Code
                  schlecht lesbar ist. Ähnliche Zeichen wie 0 und O oder I und l
                  werden oft verwechselt.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-6 text-3xl font-extrabold text-gray-900">
              Schritt für Schritt vorbereiten
            </h2>

            <ol className="space-y-4">
              {[
                'Fahrzeugschein bereitlegen.',
                'Kennzeichen bereitlegen.',
                'Sicherheitscode im Fahrzeugschein vorsichtig freilegen.',
                'Sicherheitscodes auf den Kennzeichen vorsichtig freilegen.',
                'Alle Codes gut lesbar prüfen.',
                'Bei Unsicherheit ein Foto per WhatsApp senden.',
                'Online-Abmeldung starten und Bestätigung per E-Mail erhalten.',
              ].map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-lg leading-7 text-gray-700">{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="mb-6 text-3xl font-extrabold text-gray-900">
              Häufige Fragen zu den Unterlagen
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
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-white/90">
                Offiziell digital abmelden
              </span>
            </div>

            <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
              Unterlagen bereit? Jetzt Auto online abmelden
            </h2>

            <p className="mx-auto mb-8 max-w-xl text-white/70">
              Starten Sie die Online-Abmeldung direkt. Bei schlecht lesbaren Codes
              hilft unser Team persönlich per WhatsApp.
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
