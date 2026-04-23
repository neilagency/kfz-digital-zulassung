import { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { getHomepagePricing, getSiteSettings } from '@/lib/db';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: 'Auto online abmelden Unterlagen – was wird benötigt?',
    description:
      'Welche Unterlagen braucht man für die Online-Abmeldung? Einfach erklärt – schnell vorbereiten und sofort abmelden.',
    alternates: {
      canonical: `${settings.siteUrl}/auto-online-abmelden-unterlagen`,
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
            <span className="text-white">Unterlagen</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Auto online abmelden – diese Unterlagen brauchen Sie
          </h1>

          <p className="text-white/70 text-lg mb-8">
            Viele fragen sich: Welche Unterlagen braucht man für die Online-Abmeldung?
            Hier finden Sie eine einfache Übersicht – ohne komplizierte Begriffe.
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
            Welche Unterlagen werden benötigt?
          </h2>

          <p className="mb-4">
            Für die Online-Abmeldung brauchen Sie nur wenige Dinge.
            Der Ablauf ist einfach und schnell vorbereitet.
          </p>

          <p>
            Sie müssen keine komplizierten Dokumente einreichen und auch keinen Termin vereinbaren.
          </p>
        </section>

        {/* LISTE */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-6">
            Diese Unterlagen brauchen Sie
          </h2>

          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle className="text-green-500" />
              <div>
                <strong>Fahrzeugschein</strong>
                <p>Die Zulassungsbescheinigung Teil 1</p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="text-green-500" />
              <div>
                <strong>Kennzeichen</strong>
                <p>Beide Kennzeichen vom Fahrzeug</p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="text-green-500" />
              <div>
                <strong>Sicherheitscodes</strong>
                <p>Freigerubbelt auf Dokumenten und Kennzeichen</p>
              </div>
            </div>
          </div>
        </section>

        {/* ERKLÄRUNG */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Was sind Sicherheitscodes?
          </h2>

          <p className="mb-4">
            Die Sicherheitscodes sind kleine Felder auf Ihren Dokumenten.
            Diese müssen freigerubbelt werden.
          </p>

          <p>
            Sie dienen zur Identifikation des Fahrzeugs und ersetzen den Besuch bei der Behörde.
          </p>
        </section>

        {/* WICHTIG */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Wichtig zu beachten
          </h2>

          <ul className="space-y-2">
            <li>• Codes müssen vollständig sichtbar sein</li>
            <li>• Fotos müssen gut lesbar sein</li>
            <li>• Nach dem Freilegen sind Dokumente nicht mehr gültig</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-6">
            Häufige Fragen
          </h2>

          <div className="space-y-4">
            <div>
              <strong>Brauche ich einen Ausweis?</strong>
              <p>Nein, für die Online-Abmeldung ist kein Ausweis nötig.</p>
            </div>

            <div>
              <strong>Geht das ohne Sicherheitscode?</strong>
              <p>Nein, die Codes sind zwingend notwendig.</p>
            </div>

            <div>
              <strong>Wie schnell geht das?</strong>
              <p>In der Regel innerhalb kurzer Zeit abgeschlossen.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-white p-10 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            Jetzt Auto online abmelden
          </h2>

          <p className="mb-6">
            Bereiten Sie Ihre Unterlagen vor und starten Sie direkt.
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
