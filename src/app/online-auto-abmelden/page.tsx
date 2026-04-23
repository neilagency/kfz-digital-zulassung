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
    title: 'Online Auto abmelden – schnell & offiziell ab 19,70 €',
    description:
      'Online Auto abmelden ohne Termin. Schnell, einfach und offiziell über das KBA. Jetzt starten ab 19,70 €.',
    alternates: {
      canonical: `${settings.siteUrl}/online-auto-abmelden`,
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
            <span className="text-white">Online Auto abmelden</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Online Auto abmelden – einfach, schnell und ohne Termin
          </h1>

          <p className="text-white/70 text-lg mb-8">
            Online Auto abmelden spart Zeit, Stress und unnötige Wege. Sie müssen
            keinen Termin bei der Zulassungsstelle buchen und vermeiden lange
            Wartezeiten. Alles läuft digital und wird offiziell über das System
            bearbeitet.
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

        {/* TEXT BLOCK */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Warum online Auto abmelden die beste Lösung ist
          </h2>

          <p className="mb-4">
            Viele Fahrzeughalter möchten ihr Auto schnell abmelden, ohne sich mit
            Terminen und Behörden auseinanderzusetzen. Genau hier kommt die
            Online-Abmeldung ins Spiel. Sie sparen Zeit und erledigen alles bequem
            von zu Hause aus.
          </p>

          <p className="mb-4">
            Online Auto abmelden bedeutet, dass Sie Ihr Fahrzeug digital außer
            Betrieb setzen können. Sie brauchen keine Wartezeiten einplanen und
            können den gesamten Prozess innerhalb weniger Minuten starten.
          </p>

          <p>
            Besonders praktisch: Sie erhalten nach erfolgreicher Bearbeitung eine
            offizielle Bestätigung per E-Mail. Damit ist Ihr Fahrzeug sofort
            abgemeldet und alles ist erledigt.
          </p>
        </section>

        {/* VORTEILE */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-6">
            Ihre Vorteile bei der Online-Abmeldung
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Kein Termin bei der Zulassungsstelle notwendig',
              'Schnelle Bearbeitung ohne Wartezeit',
              'Bestätigung direkt per E-Mail',
              '24 Stunden verfügbar – auch am Wochenende',
              'Einfacher Ablauf ohne komplizierte Schritte',
              'Fester Preis ohne versteckte Kosten',
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <CheckCircle className="text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ABLAUF */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-6">
            So funktioniert online Auto abmelden
          </h2>

          <ol className="space-y-4">
            <li>1. Sicherheitscodes auf Dokumenten freilegen</li>
            <li>2. Fotos und Daten senden</li>
            <li>3. Zahlung abschließen</li>
            <li>4. Bestätigung per E-Mail erhalten</li>
          </ol>

          <p className="mt-4">
            Der Ablauf ist bewusst einfach gehalten, damit jeder ihn problemlos
            durchführen kann. Sie müssen nichts kompliziert einstellen oder lange
            warten.
          </p>
        </section>

        {/* KOSTEN */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Was kostet online Auto abmelden?
          </h2>

          <p className="mb-4">
            Die Kosten für die Online-Abmeldung sind klar und transparent.
          </p>

          <p>
            Sie zahlen nur <strong>{pricing.abmeldungPriceFormatted}</strong> und
            erhalten dafür den kompletten Service inklusive Bearbeitung und
            Bestätigung.
          </p>
        </section>

        {/* UNTERLAGEN */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Welche Unterlagen werden benötigt?
          </h2>

          <p className="mb-4">
            Für die Online-Abmeldung benötigen Sie nur wenige Dinge:
          </p>

          <ul className="space-y-2">
            <li>• Fahrzeugschein</li>
            <li>• Kennzeichen</li>
            <li>• Sicherheitscodes</li>
          </ul>

          <p className="mt-4">
            Mehr brauchen Sie nicht. Alles Weitere übernehmen wir für Sie.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-primary text-white p-10 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            Jetzt Auto online abmelden
          </h2>

          <p className="mb-6">
            Starten Sie jetzt und erledigen Sie alles in wenigen Minuten – ohne
            Termin und ohne Wartezeit.
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
