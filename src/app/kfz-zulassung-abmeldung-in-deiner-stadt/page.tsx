import { Metadata } from 'next';
import { getSiteSettings, getHomepagePricing } from '@/lib/db';
import Link from 'next/link';
import {
  MapPin,
  Shield,
  CheckCircle,
  Headphones,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { CITY_ENTRIES, isCitySlug } from '@/lib/city-slugs';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();

  return {
    title: 'KFZ abmelden – Alle Städte Deutschlands',
    description:
      'Auto online abmelden in vielen Städten und Landkreisen in Deutschland. Finde deine Stadt oder deinen Landkreis – bundesweit, ohne Termin, ohne Ausweis-App.',
    alternates: {
      canonical: `${s.siteUrl}/kfz-zulassung-abmeldung-in-deiner-stadt`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface CityLink {
  name: string;
  slug: string;
}

const EXCLUDED_SLUGS = new Set<string>([
  'widerrufsbelehrung',
  'geschaftsbedingungen',
  'allgemeine-geschaeftsbedingungen',
  'datenschutzhinweise',
  'erklaervideo',
  'digital-erklart',
  'ueber-uns',
  'impressum',
  'kostenlose-kennzeichenreservierung',
  'kosten-autoabmeldung-online',
  'auto-abmelden-in-2-minuten',
  'auto-abmelden-ohne-ausweis',
  'auto-abmelden-ohne-termin',
  'auto-digital-abmelden',
  'abmeldung-digital',
  'auto-sofort-abmelden',
  'auto-schnell-abmelden',
  'lkw-abmelden-online',
  'anhaenger-abmelden-online',
  'motorrad-online-abmelden',
  'pkw-online-abmelden',
  'fahrzeug-abmelden-online',
  'kfz-abmeldung-online',
  'auto-fix-abmelden',
  'anhaenger-online-abmelden',
  'anhaenger-abmelden',
  'motorrad-abmelden-online',
  'online-kfz-abmelden',
  'auto-abmelden',
  'online-auto-anmelden',
  'online-zulassung-kfz',
  'kfz-zulassung-online',
  'online-car-deregistration-en',
  'online-arac-kayittan-duesuerme-almanya',
  'ar-ilgha-tasjeel-al-sayara',
  'evb',
]);

const NAME_FIXES: Record<string, string> = {
  krichheim: 'Kirchheim',
  'rott-weil': 'Rottweil',
  koegen: 'Kögen',
  'landkreise-in-rheinland-pfalz': 'Rheinland-Pfalz',
  'in-nordrhein-westfalen': 'Nordrhein-Westfalen',
  'zulassungsstelle-duesseldorf-termin': 'Stadt Düsseldorf',
};

function buildCityLinks(): CityLink[] {
  return Array.from(
    new Map<string, CityLink>(
      CITY_ENTRIES.filter(
        ([, slug]) => !EXCLUDED_SLUGS.has(slug) && isCitySlug(slug)
      ).map(([name, slug]) => {
        const fixedName = NAME_FIXES[slug] || name;
        return [slug, { name: fixedName, slug }];
      })
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

export default async function AlleStaedtePage() {
  const pricing = await getHomepagePricing();
  const cities = buildCityLinks();

  const grouped: Record<string, CityLink[]> = {};

  for (const city of cities) {
    const letter = city.name.charAt(0).toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(city);
  }

  const sortedLetters = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'de'));

  return (
    <main className="pb-20">
      <section className="bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent rounded-full px-4 py-1.5 mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-bold">Bundesweit verfügbar</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            KFZ online abmelden – Alle Städte
          </h1>

          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Hier findest du viele Städte und Landkreise in Deutschland, in denen du
            dein Auto online abmelden kannst – ganz bequem von zu Hause aus.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Shield, text: 'Offiziell über GKS/KBA' },
              { icon: CheckCircle, text: 'Ohne Ausweis-App' },
              { icon: Headphones, text: 'Gratis Support' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2"
              >
                <Icon className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-primary mb-6 text-center">
            Warum unser Service in ganz Deutschland funktioniert
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary" />
                Kein Ausweis nötig
              </h3>
              <p className="text-sm text-gray-600">
                Du brauchst keine Ausweis-App. Die Sicherheitscodes vom
                Fahrzeugschein und Kennzeichen reichen aus.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Datenschutz beim Amt
              </h3>
              <p className="text-sm text-gray-600">
                Die Stadt verlangt gesetzlich keine E-Mail von dir. Wir nutzen deine
                Daten nur, damit wir dir bei Fehlern helfen können.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Unser Versprechen
              </h3>
              <p className="text-sm text-gray-600">
                Wir sind offiziell über die GKS direkt an das KBA angebunden. Deine
                Abmeldung ist rechtssicher und bundesweit möglich.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-4 text-gray-600 leading-relaxed">
            <h3 className="text-xl font-bold text-primary">
              KFZ online abmelden – bundesweit in vielen Städten und Landkreisen
            </h3>

            <p>
              Auf dieser Seite findest du eine große Übersicht vieler Städte und
              Landkreise in Deutschland, in denen du dein Fahrzeug online abmelden
              kannst. Unser Service funktioniert über die amtliche
              Großkundenschnittstelle des Kraftfahrt-Bundesamtes und ist deshalb
              bundesweit nutzbar.
            </p>

            <p>
              Die Online-Abmeldung spart dir den Weg zur Zulassungsstelle,
              Terminbuchungen und lange Wartezeiten. Egal ob Berlin, Hamburg,
              München, Köln oder Landkreis – der Ablauf ist einfach und jederzeit
              online möglich.
            </p>

            <p>
              Für die Abmeldung brauchst du nur die nötigen Unterlagen und
              Sicherheitscodes. Nach erfolgreicher Bearbeitung erhältst du die
              Bestätigung per E-Mail. Kfz-Steuer und Versicherung werden automatisch
              informiert.
            </p>

            <p>
              Wähle unten deine Stadt oder deinen Landkreis aus. Dort findest du die
              passende lokale Seite mit weiteren Informationen und häufigen Fragen.
            </p>
          </div>
        </div>
      </section>

      <div className="sticky top-20 z-30 bg-white border-b border-gray-200 py-3">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap gap-1 justify-center">
          {sortedLetters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold text-primary hover:bg-primary hover:text-white transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-primary mb-8 text-center">
            Finde deine Stadt oder deinen Landkreis
          </h2>

          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Egal ob Großstadt wie{' '}
            <Link
              href="/berlin-zulassungsstelle"
              className="text-primary font-medium hover:underline"
            >
              Berlin
            </Link>
            ,{' '}
            <Link
              href="/kfz-online-abmelden-in-hamburg"
              className="text-primary font-medium hover:underline"
            >
              Hamburg
            </Link>
            ,{' '}
            <Link
              href="/auto-online-abmelden-muenchen"
              className="text-primary font-medium hover:underline"
            >
              München
            </Link>{' '}
            oder in einem Landkreis – unser Service funktioniert bundesweit.
          </p>

          {sortedLetters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="mb-10 scroll-mt-32">
              <h3 className="text-xl font-extrabold text-primary mb-4 border-b border-primary/20 pb-2">
                {letter}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {grouped[letter].map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/5 text-gray-700 hover:text-primary transition-colors text-sm before:content-['📍'] before:text-xs before:flex-shrink-0"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-extrabold text-primary mb-4">
              Häufige Fragen zur Online-Abmeldung nach Stadt
            </h3>

            <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
              <p>
                <strong>Muss ich zur Zulassungsstelle meiner Stadt gehen?</strong> Nein.
                Dank der digitalen Großkundenschnittstelle des KBA kannst du dein
                Fahrzeug komplett online abmelden. Der Service funktioniert
                bundesweit.
              </p>

              <p>
                <strong>Funktioniert die Online-Abmeldung auch für Landkreise?</strong>{' '}
                Ja. Unser Service funktioniert für Zulassungsbezirke in Deutschland –
                sowohl für Städte als auch für Landkreise.
              </p>

              <p>
                <strong>Was kostet die Online-Abmeldung?</strong> Die Abmeldung startet
                ab {pricing.abmeldungPriceFormatted}. In Einzelfällen können bei direkter
                KBA-/GKS-Abwicklung zusätzliche Gebühren anfallen.
              </p>

              <p>
                <strong>Wie schnell erhalte ich die Bestätigung?</strong> Die
                amtliche Abmeldebestätigung erhältst du nach erfolgreicher Bearbeitung
                per E-Mail.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-extrabold text-primary mb-3">
              Deine Stadt nicht gefunden?
            </h3>

            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Kein Problem. Unser Service funktioniert bundesweit. Starte einfach
              direkt und melde dein KFZ online ab.
            </p>

            <Link
              href="/product/fahrzeugabmeldung"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-lg"
            >
              Jetzt für {pricing.abmeldungPriceFormatted} abmelden →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
