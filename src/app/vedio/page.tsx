import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  PlayCircle,
  Youtube,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import { getHomepagePricing, getSiteSettings } from '@/lib/db';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: 'Unsere Videos – Hilfe zur Auto-Abmeldung online',
    description:
      'Unsere Erklärvideos zeigen, wie Sie Sicherheitscodes am Kennzeichen und im Fahrzeugschein freilegen. Jetzt ansehen und Auto online abmelden.',
    alternates: {
      canonical: `${settings.siteUrl}/vedio`,
    },
    openGraph: {
      title: 'Unsere Videos – Auto online abmelden einfach erklärt',
      description:
        'Erklärvideos zur Online-Auto-Abmeldung, Kennzeichen-Code und Sicherheitscode im Fahrzeugschein.',
      url: `${settings.siteUrl}/vedio`,
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
            <span className="text-white">Unsere Videos</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6 text-sm font-semibold">
            <PlayCircle className="w-4 h-4 text-accent" />
            Erklärvideos zur Online-Auto-Abmeldung
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Unsere Videos zur Auto-Abmeldung
          </h1>

          <p className="text-white/75 text-lg mb-8 max-w-3xl">
            Auf dieser Seite finden Sie hilfreiche Videos zur Online-Auto-Abmeldung.
            Wir zeigen Ihnen einfach und verständlich, wie Sie den Sicherheitscode
            am Kennzeichen und den Sicherheitscode im Fahrzeugschein freilegen.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link
              href="/product/fahrzeugabmeldung"
              className="bg-accent text-primary px-6 py-3 rounded-full font-bold"
            >
              Jetzt Auto abmelden – {pricing.abmeldungPriceFormatted}
            </Link>

            <a
              href="https://www.youtube.com/@ikfzdigitalzulassung"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="bg-white/10 text-white px-6 py-3 rounded-full inline-flex items-center gap-2"
            >
              <Youtube className="w-5 h-5" />
              YouTube-Kanal besuchen
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-10">
        {/* INTRO */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Hilfe per Video: So funktioniert die Online-Abmeldung
          </h2>

          <p className="mb-4">
            Viele Kunden möchten vor der Online-Abmeldung kurz sehen, was genau
            gemacht werden muss. Deshalb haben wir einfache Erklärvideos erstellt.
            Dort zeigen wir die wichtigsten Schritte rund um Kennzeichen,
            Fahrzeugschein und Sicherheitscodes.
          </p>

          <p>
            Wenn Sie Ihr Auto online abmelden möchten, können Sie sich die Videos
            zuerst ansehen und danach direkt mit der Abmeldung starten.
          </p>
        </section>

        {/* VIDEOS */}
        <section className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl border">
            <div className="aspect-video rounded-xl overflow-hidden bg-black mb-5">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/3nsdJSvKAtE"
                title="Kennzeichen Sicherheitscode freilegen"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <h2 className="text-xl font-bold mb-3">
              Sicherheitscode am Kennzeichen freilegen
            </h2>

            <p className="text-gray-700">
              In diesem Video wird erklärt, wie Sie den Sicherheitscode am
              Kennzeichen freilegen. Dieser Code wird für die Online-Abmeldung
              benötigt.
            </p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl border">
            <div className="aspect-video rounded-xl overflow-hidden bg-black mb-5">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/u38keaF1QKU"
                title="Sicherheitscode im Fahrzeugschein freilegen"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <h2 className="text-xl font-bold mb-3">
              Sicherheitscode im Fahrzeugschein freilegen
            </h2>

            <p className="text-gray-700">
              In diesem Video sehen Sie, wie der Sicherheitscode im Fahrzeugschein
              freigelegt wird. Es gibt verschiedene Varianten, je nachdem wie Ihr
              Fahrzeugschein aussieht.
            </p>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-6">
            Warum diese Videos wichtig sind
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Sie sehen genau, wo der Sicherheitscode ist',
              'Sie vermeiden Fehler beim Freilegen',
              'Sie können die Online-Abmeldung besser vorbereiten',
              'Sie sparen Zeit beim Ausfüllen',
              'Sie verstehen den Ablauf einfacher',
              'Sie können danach direkt die Abmeldung starten',
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <CheckCircle className="text-green-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-white p-8 md:p-10 rounded-2xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-accent font-bold mb-4">
              <ShieldCheck className="w-5 h-5" />
              Online Auto abmelden
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Sicherheitscodes gefunden? Dann können Sie direkt starten.
            </h2>

            <p className="text-white/80 mb-6">
              Wenn Sie den Sicherheitscode am Kennzeichen und im Fahrzeugschein
              freigelegt haben, können Sie Ihre Online-Abmeldung direkt bei uns
              starten. Die Bestätigung erhalten Sie nach erfolgreicher Bearbeitung
              per E-Mail.
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

        {/* YOUTUBE CHANNEL */}
        <section className="bg-white p-8 rounded-2xl border text-center">
          <Youtube className="w-12 h-12 mx-auto text-red-600 mb-4" />

          <h2 className="text-2xl font-bold mb-4">
            Mehr Videos auf unserem YouTube-Kanal
          </h2>

          <p className="text-gray-700 mb-6">
            Auf unserem YouTube-Kanal finden Sie weitere Videos rund um
            Online-Auto-Abmeldung, Kfz-Zulassung und wichtige Schritte für Ihre
            Fahrzeugunterlagen.
          </p>

          <a
            href="https://www.youtube.com/@ikfzdigitalzulassung"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold"
          >
            <Youtube className="w-5 h-5" />
            YouTube-Kanal öffnen
          </a>
        </section>
      </div>
    </main>
  );
}
