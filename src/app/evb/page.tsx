import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import {
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  FileText,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { getSiteSettings } from '@/lib/db';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: 'EVB – Kfz-Versicherung für die Zulassung',
    description:
      'EVB für die Kfz-Zulassung benötigt? Füllen Sie das Formular aus und erhalten Sie Unterstützung für Versicherung und Fahrzeugzulassung.',
    alternates: {
      canonical: `${settings.siteUrl}/evb`,
    },
    openGraph: {
      title: 'EVB – Kfz-Versicherung für die Zulassung',
      description:
        'EVB für Auto anmelden, ummelden oder wieder zulassen. Formular ausfüllen und Unterstützung erhalten.',
      url: `${settings.siteUrl}/evb`,
      type: 'website',
    },
  };
}

export default async function Page() {
  const settings = await getSiteSettings();

  return (
    <main className="pb-20">
      {/* HERO */}
      <section className="bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 pb-14">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/">Startseite</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">EVB</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6 text-sm font-semibold">
            <ShieldCheck className="w-4 h-4 text-accent" />
            Für Kfz-Zulassung, Ummeldung & Wiederzulassung
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            EVB für Ihre Kfz-Zulassung
          </h1>

          <p className="text-white/75 text-lg mb-8 max-w-3xl">
            Sie möchten ein Fahrzeug anmelden, ummelden oder wieder zulassen?
            Dafür wird in der Regel eine EVB benötigt. Füllen Sie einfach das
            Formular aus und starten Sie den nächsten Schritt für Ihre
            Kfz-Versicherung und Zulassung.
          </p>

          <div className="flex gap-4 flex-wrap">
            <a
              href="#evb-formular"
              className="bg-accent text-primary px-6 py-3 rounded-full font-bold"
            >
              EVB Formular öffnen
            </a>

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
        {/* INFO BLOCK */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">
            Was ist eine EVB?
          </h2>

          <p className="mb-4">
            Die EVB ist die elektronische Versicherungsbestätigung. Sie wird
            benötigt, wenn ein Fahrzeug zugelassen, umgemeldet oder erneut
            zugelassen werden soll. Die EVB zeigt, dass für das Fahrzeug eine
            passende Kfz-Versicherung vorhanden ist.
          </p>

          <p>
            Wenn Sie Ihr Auto online anmelden möchten, ist die EVB ein wichtiger
            Teil des Zulassungsprozesses. Über das Formular können Sie Ihre
            Anfrage schnell und einfach starten.
          </p>
        </section>

        {/* VORTEILE */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-6">
            Wann wird eine EVB benötigt?
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Für die Anmeldung eines Fahrzeugs',
              'Für die Ummeldung eines Fahrzeugs',
              'Für die Wiederzulassung eines Fahrzeugs',
              'Für die Kfz-Zulassung nach Fahrzeugkauf',
              'Für viele Zulassungsvorgänge in Deutschland',
              'Als Nachweis der Kfz-Haftpflichtversicherung',
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <CheckCircle className="text-green-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FORMULAR */}
        <section
          id="evb-formular"
          className="bg-white p-4 md:p-8 rounded-2xl border"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-3">
              EVB Formular ausfüllen
            </h2>

            <p className="text-gray-700">
              Tragen Sie Ihre Daten im Formular ein. Danach können Sie den
              passenden Tarif prüfen und Ihre Anfrage absenden.
            </p>
          </div>

          <div className="rounded-2xl border bg-gray-50 p-3 md:p-6 overflow-hidden">
            <div style={{ width: '100%' }} id="tcpp-iframe-kfz"></div>

            <Script
              src="https://form.partner-versicherung.de/widgets/184294/tcpp-iframe-kfz/kfz-iframe.js"
              strategy="afterInteractive"
            />
          </div>
        </section>

        {/* ABLAUF */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-6">
            So funktioniert es
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border p-6">
              <FileText className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-bold mb-2">1. Formular ausfüllen</h3>
              <p className="text-gray-700">
                Geben Sie die wichtigsten Daten für Ihre Kfz-Versicherung ein.
              </p>
            </div>

            <div className="rounded-2xl border p-6">
              <ShieldCheck className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-bold mb-2">2. Tarif prüfen</h3>
              <p className="text-gray-700">
                Sie sehen passende Möglichkeiten für Ihre Fahrzeugversicherung.
              </p>
            </div>

            <div className="rounded-2xl border p-6">
              <Clock className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-bold mb-2">3. Zulassung vorbereiten</h3>
              <p className="text-gray-700">
                Danach kann die EVB für Ihre Zulassung genutzt werden.
              </p>
            </div>
          </div>
        </section>

        {/* HINWEIS */}
        <section className="bg-primary text-white p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">
            Wichtig für Ihre Fahrzeugzulassung
          </h2>

          <p className="text-white/80 mb-4">
            Für eine Fahrzeugzulassung wird neben der EVB auch der eigentliche
            Zulassungsprozess benötigt. Wenn Sie zusätzlich Hilfe bei der
            Online-Zulassung brauchen, können Sie uns direkt kontaktieren.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link
              href="/product/auto-online-anmelden"
              className="bg-accent text-primary px-6 py-3 rounded-full font-bold"
            >
              Kfz online anmelden
            </Link>

            <a
              href={settings.whatsapp}
              className="bg-white/10 text-white px-6 py-3 rounded-full inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Hilfe
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-6">
            Häufige Fragen zur EVB
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">
                Brauche ich eine EVB für die Auto-Anmeldung?
              </h3>
              <p className="text-gray-700">
                Ja, für die Zulassung eines Fahrzeugs wird in der Regel eine
                gültige EVB benötigt.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">
                Kann ich mit der EVB mein Auto online anmelden?
              </h3>
              <p className="text-gray-700">
                Ja, die EVB kann im Zulassungsprozess verwendet werden, wenn die
                weiteren Voraussetzungen für die Zulassung erfüllt sind.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">
                Was bedeutet EVB?
              </h3>
              <p className="text-gray-700">
                EVB bedeutet elektronische Versicherungsbestätigung. Sie dient
                als Nachweis für die Kfz-Haftpflichtversicherung.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
