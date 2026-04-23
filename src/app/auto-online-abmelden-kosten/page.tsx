import { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle,
  Shield,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import { getHomepagePricing, getSiteSettings } from '@/lib/db';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: 'Auto online abmelden Kosten – Preis ab 19,70 € erklärt',
    description:
      'Was kostet Auto online abmelden? Alle Kosten einfach erklärt. Jetzt Fahrzeug abmelden ab 19,70 € – ohne Termin und Wartezeit.',
    alternates: {
      canonical: `${settings.siteUrl}/auto-online-abmelden-kosten`,
    },
  };
}

export default async function Page() {
  const [settings, pricing] = await Promise.all([
    getSiteSettings(),
    getHomepagePricing(),
  ]);

  return (
    <main className="pb-20">

      {/* HERO */}
      <section className="bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 pb-14">
        <div className="max-w-5xl mx-auto px-4">

          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/">Startseite</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Kosten Auto abmelden</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Auto online abmelden Kosten – einfach erklärt
          </h1>

          <p className="text-white/70 text-lg mb-8">
            Viele fragen sich: Was kostet Auto online abmelden wirklich?
            Hier finden Sie eine klare und einfache Erklärung aller Kosten – ohne versteckte Gebühren.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link
              href="/product/fahrzeugabmeldung"
              className="bg-accent text-primary px-6 py-3 rounded-full font-bold"
            >
              Jetzt abmelden – {pricing.abmeldungPriceFormatted}
            </Link>

            <a
              href={settings.whatsapp}
              className="bg-white/10 text-white px-6 py-3 rounded-full"
            >
              WhatsApp Hilfe
            </a>
          </div>

        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-10">

        {/* EINLEITUNG */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Was kostet Auto online abmelden?
          </h2>

          <p className="mb-4">
            Die Kosten für die Online-Abmeldung sind oft unklar. Viele denken,
            dass zusätzliche Gebühren entstehen oder versteckte Kosten kommen.
          </p>

          <p className="mb-4">
            Bei uns ist das einfach: Sie zahlen nur einen festen Preis und
            erhalten den kompletten Service inklusive Bearbeitung.
          </p>

          <p>
            Der Preis beträgt aktuell <strong>{pricing.abmeldungPriceFormatted}</strong>.
          </p>
        </section>

        {/* PREIS */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-6">
            Preisübersicht
          </h2>

          <div className="bg-primary text-white p-6 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-2">
              {pricing.abmeldungPriceFormatted}
            </h3>
            <p>Einmalig – alle Gebühren inklusive</p>
          </div>

          <ul className="mt-6 space-y-2">
            <li>• Keine versteckten Kosten</li>
            <li>• Bearbeitung inklusive</li>
            <li>• Offizielle Abmeldung</li>
            <li>• Bestätigung per E-Mail</li>
          </ul>
        </section>

        {/* WARUM */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Warum lohnt sich die Online-Abmeldung?
          </h2>

          <p className="mb-4">
            Im Vergleich zur klassischen Abmeldung sparen Sie Zeit und Aufwand.
            Sie müssen keinen Termin vereinbaren und vermeiden lange Wartezeiten.
          </p>

          <p>
            Die Online-Abmeldung ist die schnellste Lösung für alle, die ihr
            Fahrzeug einfach und bequem abmelden möchten.
          </p>
        </section>

        {/* VORTEILE */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-6">
            Vorteile im Überblick
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Fester Preis ohne Überraschungen',
              'Kein Termin notwendig',
              'Schnelle Bearbeitung',
              'Bestätigung per E-Mail',
              'Einfacher Ablauf',
              '24/7 verfügbar',
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <CheckCircle className="text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* VERGLEICH */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Online vs. Zulassungsstelle
          </h2>

          <p className="mb-4">
            Bei der klassischen Abmeldung müssen Sie Zeit einplanen,
            warten und oft mehrfach zur Behörde gehen.
          </p>

          <p>
            Online erledigen Sie alles in wenigen Minuten – bequem von zu Hause.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-primary text-white p-10 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            Jetzt Auto online abmelden
          </h2>

          <p className="mb-6">
            Starten Sie jetzt und sparen Sie Zeit und Aufwand.
          </p>

          <Link
            href="/product/fahrzeugabmeldung"
            className="bg-accent text-primary px-8 py-4 rounded-full font-bold"
          >
            Jetzt starten
          </Link>
        </section>

      </div>
    </main>
  );
}
