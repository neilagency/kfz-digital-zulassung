import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Clock,
  MailCheck,
  Phone,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  FileCheck,
  Languages,
  Users,
} from 'lucide-react';
import { getSiteSettings, getHomepagePricing } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Über uns | OnlineAutoAbmelden.com',
  description:
    'OnlineAutoAbmelden.com ist ein deutscher Online-Service für digitale Fahrzeugabmeldung. Betrieben von der iKFZ Digital Zulassung UG.',
  alternates: {
    canonical: 'https://onlineautoabmelden.com/ueber-uns',
  },
  openGraph: {
    title: 'Über uns | OnlineAutoAbmelden.com',
    description:
      'OnlineAutoAbmelden.com unterstützt Fahrzeughalter in Deutschland bei der digitalen Fahrzeugabmeldung – einfach, verständlich und offiziell.',
    url: 'https://onlineautoabmelden.com/ueber-uns',
    type: 'website',
  },
};

export default async function UeberUnsPage() {
  const [settings, pricing] = await Promise.all([
    getSiteSettings(),
    getHomepagePricing(),
  ]);

  const baseUrl = settings.siteUrl.replace(/\/$/, '');

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${baseUrl}/ueber-uns#aboutpage`,
    url: `${baseUrl}/ueber-uns`,
    name: 'Über uns',
    description:
      'OnlineAutoAbmelden.com ist ein deutscher Online-Service für digitale Fahrzeugabmeldung.',
    inLanguage: 'de-DE',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      url: baseUrl,
      name: settings.siteName,
    },
    about: {
      '@id': `${baseUrl}#organization`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />

      <main className="bg-gray-50 pb-20">
        <section className="relative overflow-hidden bg-gradient-to-br from-dark via-primary-900 to-dark pb-16 pt-28 md:pt-36">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-20 top-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Über OnlineAutoAbmelden.com
            </p>

            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Wir machen digitale Fahrzeugabmeldung einfacher
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
              OnlineAutoAbmelden.com ist ein deutscher Online-Service für die digitale
              Fahrzeugabmeldung. Unser Ziel ist es, Fahrzeughaltern in Deutschland
              eine einfache, verständliche und schnelle Lösung für die Online-Abmeldung
              zu bieten – ohne Termin, ohne Wartezeit und ohne Behördengang.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/product/fahrzeugabmeldung"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-bold text-primary transition-all hover:bg-accent-600 hover:shadow-lg"
              >
                <CheckCircle className="h-5 w-5" />
                Fahrzeug online abmelden
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

        <section className="mx-auto -mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Offizieller Ablauf',
                text: 'Wir arbeiten mit digitalen Abläufen rund um i-Kfz, Sicherheitscodes und Fahrzeugabmeldung.',
              },
              {
                icon: Clock,
                title: '24/7 online möglich',
                text: 'Kunden können die Abmeldung online vorbereiten – ohne Termin und ohne Wartezeit vor Ort.',
              },
              {
                icon: MailCheck,
                title: 'Bestätigung per E-Mail',
                text: 'Nach erfolgreicher Bearbeitung erhalten Kunden die Bestätigung digital per E-Mail.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h2 className="mb-2 text-xl font-extrabold text-gray-900">
                  {title}
                </h2>
                <p className="text-sm leading-6 text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-100 bg-white px-5 py-8 shadow-sm sm:px-8 md:p-12">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              Wer wir sind
            </p>

            <h2 className="mb-5 text-3xl font-extrabold text-gray-900 md:text-4xl">
              Ein spezialisierter Online-Service für Fahrzeugabmeldung
            </h2>

            <div className="space-y-5 text-lg leading-8 text-gray-700">
              <p>
                OnlineAutoAbmelden.com wird betrieben von der iKFZ Digital Zulassung UG
                (haftungsbeschränkt), die seit 2024 Fahrzeughaltern in Deutschland bei
                der digitalen Fahrzeugabmeldung hilft. Unsere Hauptplattform{' '}
                <a
                  href="https://ikfzdigitalzulassung.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:text-accent"
                >
                  ikfzdigitalzulassung.de
                </a>{' '}
                bietet zusätzlich die vollständige Online-Zulassung an.
                OnlineAutoAbmelden.com ist speziell auf die schnelle und unkomplizierte
                Online-Abmeldung ausgerichtet.
              </p>

              <p>
                Die Fahrzeugabmeldung erfolgt über eine GKS-Anbindung gemäß §34 FZV –
                rechtssicher, offiziell und direkt mit dem Kraftfahrt-Bundesamt verbunden.
                Kunden erhalten nach erfolgreicher Bearbeitung die offizielle Bestätigung
                per E-Mail als PDF.
              </p>

              <p>
                Seit unserer Gründung haben wir tausenden Fahrzeughaltern in Deutschland
                geholfen, ihr Fahrzeug schnell und unkompliziert online abzumelden –
                ohne Behördengang, ohne lange Wartezeiten und ohne komplizierte
                technische Begriffe.
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-primary-50 p-6">
              <h3 className="mb-3 text-xl font-extrabold text-primary">
                Unser Service kurz erklärt
              </h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  'Digitale Fahrzeugabmeldung deutschlandweit',
                  `Abmeldung ab ${pricing.abmeldungPriceFormatted}`,
                  'GKS-angebunden gemäß §34 FZV – offiziell und rechtssicher',
                  'Offizielle Bestätigung per E-Mail als PDF',
                  '24/7 verfügbar – kein Termin nötig',
                  'Hilfe bei Sicherheitscodes und typischen Eingabefehlern',
                  'Persönliche Unterstützung per Telefon und WhatsApp',
                  'Mehrsprachiger Support – Deutsch, Arabisch, Türkisch, Englisch',
                  'Seit 2024 aktiv – tausende erfolgreiche Abmeldungen',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-100 bg-white px-5 py-8 shadow-sm sm:px-8 md:p-12">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              Unsere Redaktion
            </p>

            <h2 className="mb-5 text-3xl font-extrabold text-gray-900 md:text-4xl">
              Geprüfte Ratgeber rund um die Online-Abmeldung
            </h2>

            <div className="space-y-5 text-lg leading-8 text-gray-700">
              <p>
                Unsere Ratgeber werden von unserem Team geprüft und regelmäßig
                aktualisiert. Alle Inhalte basieren auf den aktuellen gesetzlichen
                Vorgaben zur digitalen Fahrzeugabmeldung gemäß §34 FZV.
              </p>

              <p>
                Wenn sich Gesetze oder Abläufe ändern, passen wir unsere Artikel
                zeitnah an – damit Nutzer immer aktuelle und verlässliche Informationen
                erhalten.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-100 bg-white px-5 py-8 shadow-sm sm:px-8 md:p-12">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Languages className="h-6 w-6 text-primary" />
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              Zwei Plattformen – ein Team
            </p>

            <h2 className="mb-5 text-3xl font-extrabold text-gray-900 md:text-4xl">
              Digitale Fahrzeugservices aus einer Hand
            </h2>

            <p className="mb-6 text-lg leading-8 text-gray-700">
              Die iKFZ Digital Zulassung UG betreibt zwei spezialisierte
              Online-Plattformen für digitale Fahrzeugservices in Deutschland:
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="mb-2 text-xl font-extrabold text-gray-900">
                  OnlineAutoAbmelden.com
                </h3>
                <p className="text-gray-700">
                  Spezialisiert auf die schnelle digitale Fahrzeugabmeldung ab{' '}
                  {pricing.abmeldungPriceFormatted}.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="mb-2 text-xl font-extrabold text-gray-900">
                  ikfzdigitalzulassung.de
                </h3>
                <p className="text-gray-700">
                  Hauptplattform für digitale Fahrzeugabmeldung und Fahrzeuganmeldung.
                </p>
              </div>
            </div>

            <p className="mt-6 text-lg leading-8 text-gray-700">
              Beide Plattformen nutzen dieselbe GKS-Anbindung und bieten denselben
              persönlichen Support per Telefon und WhatsApp.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-white px-5 py-8 shadow-sm sm:px-8">
              <h2 className="mb-4 text-2xl font-extrabold text-gray-900">
                Warum wir Ratgeber veröffentlichen
              </h2>
              <p className="leading-7 text-gray-700">
                Viele Probleme bei der Online-Abmeldung entstehen durch falsch gelesene
                Sicherheitscodes, unklare Unterlagen oder komplizierte Behördenportale.
                Unsere Ratgeber erklären diese Themen einfach und Schritt für Schritt –
                auf Deutsch, Arabisch, Türkisch und Englisch. Unser Support-Team steht
                zusätzlich persönlich per WhatsApp und Telefon zur Verfügung – kostenlos
                und ohne Warteschleife.
              </p>
              <Link
                href="/insiderwissen"
                className="mt-6 inline-flex items-center gap-2 font-bold text-primary hover:text-accent"
              >
                Zum Insiderwissen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white px-5 py-8 shadow-sm sm:px-8">
              <h2 className="mb-4 text-2xl font-extrabold text-gray-900">
                Kontakt und Hilfe
              </h2>
              <p className="mb-6 leading-7 text-gray-700">
                Wenn Fragen zur Online-Abmeldung, zu Sicherheitscodes oder zum Ablauf
                entstehen, helfen wir persönlich weiter.
              </p>

              <div className="space-y-3">
                <a
                  href={settings.phoneLink}
                  className="flex items-center gap-3 rounded-xl bg-primary-50 px-4 py-3 transition-colors hover:bg-primary-100"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Telefon</p>
                    <p className="font-bold text-primary">{settings.phone}</p>
                  </div>
                </a>

                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 transition-colors hover:bg-green-100"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="font-bold text-green-700">Live-Chat starten</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-100 bg-white px-5 py-8 text-center shadow-sm sm:px-8">
            <p className="text-lg leading-8 text-gray-700">
              Für An- und Abmeldungen besuchen Sie auch unsere Hauptplattform:{' '}
              <a
                href="https://ikfzdigitalzulassung.de"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-primary hover:text-accent"
              >
                ikfzdigitalzulassung.de
              </a>
            </p>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-800 to-dark px-5 py-10 text-center shadow-xl sm:px-8 md:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
                <FileCheck className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-white/90">
                  Digitale Fahrzeugabmeldung
                </span>
              </div>

              <h2 className="mb-4 text-3xl font-extrabold text-white md:text-4xl">
                Fahrzeug online abmelden
              </h2>

              <p className="mx-auto mb-8 max-w-xl text-white/70">
                Beauftragen Sie Ihre Fahrzeugabmeldung online – deutschlandweit,
                verständlich erklärt und mit digitaler Bestätigung per E-Mail.
              </p>

              <Link
                href="/product/fahrzeugabmeldung"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-primary transition-all hover:bg-accent-600 hover:shadow-lg"
              >
                <CheckCircle className="h-5 w-5" />
                Jetzt Fahrzeug abmelden
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
