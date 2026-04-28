import { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { getHomepagePricing, getSiteSettings } from '@/lib/db';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: 'Online Auto abmelden – offiziell & schnell ab 19,70 €',
    description:
      'Online Auto abmelden ohne Termin. Offiziell, schnell und bundesweit. Jetzt Auto online abmelden ab 19,70 € mit Bestätigung per E-Mail.',
    alternates: {
      canonical: `${settings.siteUrl}/online-auto-abmelden`,
    },
    openGraph: {
      title: 'Online Auto abmelden – offiziell & schnell ab 19,70 €',
      description:
        'Online Auto abmelden ohne Termin. Offiziell, schnell und bundesweit. Jetzt ab 19,70 € starten.',
      url: `${settings.siteUrl}/online-auto-abmelden`,
      type: 'website',
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
            Online Auto abmelden ist für viele der einfachste Weg, ein Fahrzeug
            ohne Termin und ohne unnötige Wege außer Betrieb zu setzen. Sie
            starten bequem von zu Hause, sparen Zeit und erhalten nach
            erfolgreicher Bearbeitung Ihre offizielle Bestätigung direkt per
            E-Mail.
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
            Warum online Auto abmelden für viele die beste Lösung ist
          </h2>

          <p className="mb-4">
            Viele Fahrzeughalter möchten ihr Auto schnell abmelden, ohne extra
            zur Zulassungsstelle zu fahren, ohne Terminbuchung und ohne
            Wartezeit. Genau deshalb wird das Thema{' '}
            <strong>online Auto abmelden</strong> immer wichtiger. Der Ablauf ist
            klar, bequem und für viele deutlich angenehmer als die klassische
            Abmeldung vor Ort.
          </p>

          <p className="mb-4">
            Wenn Sie Ihr <strong>Auto online abmelden</strong>, können Sie die
            wichtigsten Angaben digital vorbereiten und den Vorgang direkt
            starten. Das spart oft Zeit, reduziert organisatorischen Aufwand und
            sorgt für mehr Übersicht. Viele nutzen diesen Weg, weil er sich
            besser in den Alltag einfügt als ein Behördengang.
          </p>

          <p>
            Besonders wichtig ist dabei, dass alles verständlich bleibt. Sie
            brauchen keine komplizierten Schritte, sondern nur die nötigen
            Unterlagen und gut lesbare Angaben. Nach erfolgreicher Bearbeitung
            erhalten Sie die offizielle Bestätigung per E-Mail und Ihr Fahrzeug
            ist abgemeldet.
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
              'Schnelle digitale Vorbereitung ohne unnötige Wartezeit',
              'Offizielle Bestätigung direkt per E-Mail',
              '24 Stunden verfügbar – auch am Wochenende',
              'Einfacher Ablauf mit klaren Schritten',
              `Fester Preis ab ${pricing.abmeldungPriceFormatted} ohne versteckte Kosten`,
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <CheckCircle className="text-green-500 shrink-0" />
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
            <li>1. Sicherheitscodes auf Dokumenten und Kennzeichen freilegen</li>
            <li>2. Fotos und Fahrzeugdaten digital senden</li>
            <li>3. Auftrag abschließen und Zahlung durchführen</li>
            <li>4. Offizielle Bestätigung per E-Mail erhalten</li>
          </ol>

          <p className="mt-4">
            Der Ablauf ist bewusst einfach gehalten. Viele möchten ihr{' '}
            <strong>Auto online abmelden</strong>, ohne lange nachzulesen oder
            komplizierte Anleitungen zu verstehen. Genau deshalb ist der Prozess
            klar aufgebaut und direkt startbar.
          </p>
        </section>

        {/* KOSTEN */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Was kostet online Auto abmelden?
          </h2>

          <p className="mb-4">
            Die Kosten für <strong>online Auto abmelden</strong> sind klar und
            transparent aufgebaut.
          </p>

          <p>
            Sie zahlen nur <strong>{pricing.abmeldungPriceFormatted}</strong> und
            erhalten dafür den kompletten Service inklusive Bearbeitung und
            offizieller Bestätigung per E-Mail. Viele achten gerade hier auf
            einen festen Preis ohne Überraschungen.
          </p>
        </section>

        {/* UNTERLAGEN */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Welche Unterlagen werden benötigt?
          </h2>

          <p className="mb-4">
            Für die Online-Abmeldung benötigen Sie nur wenige Dinge. Wichtig ist
            vor allem, dass alles gut lesbar und vollständig vorliegt:
          </p>

          <ul className="space-y-2">
            <li>• Fahrzeugschein</li>
            <li>• Kennzeichen</li>
            <li>• Sicherheitscodes</li>
          </ul>

          <p className="mt-4">
            Wenn diese Angaben bereitliegen, können Sie Ihr{' '}
            <strong>Auto online abmelden</strong> und den Vorgang direkt starten.
            Mehr brauchen viele im ersten Schritt nicht.
          </p>
        </section>

        {/* VIDEO HILFE */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Video-Hilfe: Sicherheitscodes richtig freilegen
          </h2>

          <p className="text-gray-700 mb-6">
            Sie sind unsicher, wo der Sicherheitscode am Kennzeichen oder im
            Fahrzeugschein ist? In unseren kurzen Videos zeigen wir Schritt für
            Schritt, wie Sie die Codes richtig freilegen und Ihre
            Online-Abmeldung besser vorbereiten.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link
              href="/vedio"
              className="bg-primary text-white px-6 py-3 rounded-full font-bold"
            >
              Videos ansehen
            </Link>

            <Link
              href="/product/fahrzeugabmeldung"
              className="bg-accent text-primary px-6 py-3 rounded-full font-bold"
            >
              Jetzt Auto abmelden
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-white p-10 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            Jetzt Auto online abmelden
          </h2>

          <p className="mb-6">
            Starten Sie jetzt und erledigen Sie alles in wenigen Minuten – ohne
            Termin, ohne Wartezeit und bequem digital von zu Hause.
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
