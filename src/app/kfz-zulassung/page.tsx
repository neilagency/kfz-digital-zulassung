import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/db';
import { CITY_METADATA } from '@/lib/city-metadata';

// Helper function to render inline linked text
function renderInlineLinkedText(text: string) {
  const tokens = [...text.matchAll(/\[\[([^|\]]+)\|([^\]]+)\]\]/g)];
  if (tokens.length === 0) return text;

  const parts: Array<string | JSX.Element> = [];
  let lastIndex = 0;

  tokens.forEach((match, index) => {
    const fullMatch = match[0];
    const anchorText = match[1];
    const href = match[2];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <Link key={`${href}-${index}`} href={href} className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
        {anchorText}
      </Link>,
    );

    lastIndex = start + fullMatch.length;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
import {
  Car,
  Building2,
  Shield,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  Info,
  BookOpen,
  Scale,
  FileText,
  Settings,
} from 'lucide-react';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: 'KFZ-Zulassung in Deutschland – Komplette Übersicht 2026',
    description:
      'Alles über KFZ-Zulassung in Deutschland: Anmeldung, Ummeldung, Abmeldung. Alle Zulassungsstellen, Verfahren und digitale Services deutschlandweit.',
    alternates: {
      canonical: `${settings.siteUrl}/kfz-zulassung`,
    },
    openGraph: {
      title: 'KFZ-Zulassung in Deutschland – Komplette Übersicht 2026',
      description:
        'Alles über KFZ-Zulassung in Deutschland: Anmeldung, Ummeldung, Abmeldung. Alle Zulassungsstellen, Verfahren und digitale Services deutschlandweit.',
      url: `${settings.siteUrl}/kfz-zulassung`,
      siteName: settings.siteName,
      type: 'article',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function KfzZulassungPage() {
  const settings = await getSiteSettings();
  
  const services = [
    {
      title: 'Fahrzeug anmelden',
      description: 'Neuwagen oder Gebrauchtwagen erstmals zulassen',
      href: '/anmelden',
      icon: Car,
      color: 'green',
    },
    {
      title: 'Fahrzeug abmelden',
      description: 'Auto dauerhaft oder vorübergehend stillegen',
      href: '/auto-abmelden',
      icon: FileText,
      color: 'red',
    },
    {
      title: 'Fahrzeug ummelden',
      description: 'Bei Umzug oder Halterwechsel ummelden',
      href: '/auto-ummelden',
      icon: Settings,
      color: 'blue',
    },
  ];

  const bundeslaender = [
    'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 
    'Bremen', 'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern',
    'Niedersachsen', 'Nordrhein-Westfalen', 'Rheinland-Pfalz', 
    'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: settings.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'KFZ-Zulassung',
        item: `${settings.siteUrl}/kfz-zulassung`,
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'KFZ-Zulassung in Deutschland – Komplette Übersicht 2026',
    author: {
      '@type': 'Organization',
      name: settings.siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.siteName,
      url: settings.siteUrl,
    },
    datePublished: '2026-04-21',
    dateModified: '2026-04-21',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${settings.siteUrl}/kfz-zulassung`,
    },
    articleSection: 'KFZ-Zulassung',
    keywords: 'KFZ-Zulassung, Fahrzeugzulassung, Anmeldung, Abmeldung, Ummeldung, Zulassungsstelle',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-6">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 text-sm font-medium">
                  Offizieller Zulassungsratgeber
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
                KFZ-Zulassung in Deutschland
              </h1>
              
              <p className="text-xl text-gray-600 leading-8 mb-8">
                Umfassender Ratgeber für alle Aspekte der Fahrzeugzulassung: Von der Erstanmeldung 
                über Ummeldungen bis zur Abmeldung. Für alle Bundesländer und Zulassungsstellen.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/anmelden"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full transition-all"
                >
                  <Car className="w-4 h-4" />
                  Auto anmelden
                </Link>
                <Link
                  href="/auto-abmelden"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Auto abmelden
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Alle KFZ-Zulassungsservices im Überblick
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Von der Anmeldung bis zur Abmeldung – alle Services rund um die Fahrzeugzulassung 
              in Deutschland, sowohl klassisch als auch digital verfügbar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {services.map((service) => {
              const Icon = service.icon;
              const colorClasses = {
                green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
                red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
                blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
              };
              
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className={`block rounded-2xl border-2 p-8 transition-all hover:shadow-lg ${colorClasses[service.color as keyof typeof colorClasses]}`}
                >
                  <Icon className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-sm opacity-80">{service.description}</p>
                </Link>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Überblick */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Das deutsche KFZ-Zulassungssystem
                </h2>
                
                <div className="prose prose-lg max-w-none">
                  <p>
                    {renderInlineLinkedText('Das deutsche KFZ-Zulassungssystem basiert auf der Fahrzeug-Zulassungsverordnung (FZV) und wird zentral vom Kraftfahrt-Bundesamt (KBA) koordiniert. Jedes in Deutschland betriebene Kraftfahrzeug muss ordnungsgemäß zugelassen sein, um am Straßenverkehr teilnehmen zu dürfen.')}
                  </p>
                  
                  <p>
                    {renderInlineLinkedText('Die Zulassung erfolgt dezentral über etwa [[700 Zulassungsstellen bundesweit|/zulassungsstelle]], die in der Regel bei Landkreisen und kreisfreien Städten angesiedelt sind. Seit 2015 ermöglicht die [[Online-Zulassung|/auto-online-abmelden]] auch digitale Verfahren für bestimmte Zulassungsvorgänge.')}
                  </p>
                  
                  <p>
                    {renderInlineLinkedText('Grundsätzlich wird unterschieden zwischen Erstanmeldung (Neuzulassung), Ummeldung (bei Halterwechsel oder Umzug) und [[Abmeldung|/auto-abmelden]] (bei Stilllegung oder Außerbetriebsetzung). Jeder Vorgang wird zentral registriert und führt zu entsprechenden steuer- und versicherungsrechtlichen Konsequenzen.')}
                  </p>
                </div>
              </section>

              {/* Zulassungsverfahren */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-blue-600" />
                  Zulassungsverfahren im Detail
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">
                      Anmeldung (Neuzulassung)
                    </h3>
                    <p className="text-green-800 mb-4">
                      {renderInlineLinkedText('Erstmalige Zulassung eines Fahrzeugs zum Straßenverkehr. [[Erforderlich bei Neuwagen|/anmelden]] und Gebrauchtwagen ohne gültige Zulassung.')}
                    </p>
                    <div className="text-sm text-green-700">
                      <strong>Unterlagen:</strong> Fahrzeugbrief/COC, Versicherungsbestätigung (eVB), 
                      Personalausweis, SEPA-Mandat für Kfz-Steuer
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      Ummeldung
                    </h3>
                    <p className="text-blue-800 mb-4">
                      Änderung der Zulassungsdaten bei Halterwechsel, Umzug oder Änderung der 
                      Fahrzeugdaten. Das Fahrzeug bleibt weiterhin zugelassen.
                    </p>
                    <div className="text-sm text-blue-700">
                      <strong>Unterlagen:</strong> Zulassungsbescheinigungen I+II, neue Versicherung 
                      (bei Halterwechsel), Personalausweis, ggf. Kennzeichen
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-900 mb-3">
                      Abmeldung
                    </h3>
                    <p className="text-red-800 mb-4">
                      {renderInlineLinkedText('[[Stilllegung des Fahrzeugs|/auto-abmelden]] und Beendigung der Zulassung. Das Fahrzeug darf nicht mehr am öffentlichen Straßenverkehr teilnehmen.')}
                    </p>
                    <div className="text-sm text-red-700">
                      {renderInlineLinkedText('**Unterlagen:** Zulassungsbescheinigung Teil I (Fahrzeugschein), beide Kennzeichen, [[Sicherheitscodes|/auto-online-abmelden-unterlagen]]')}
                    </div>
                  </div>
                </div>
              </section>

              {/* Digitale Services */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Digitale Zulassungsservices
                </h2>
                
                <div className="prose prose-lg max-w-none">
                  <p>
                    {renderInlineLinkedText('Seit der Einführung der Online-Zulassung können viele Zulassungsvorgänge digital abgewickelt werden. Dies betrifft insbesondere Ummeldungen bei Umzug und [[Fahrzeugabmeldungen|/auto-online-abmelden]]. Die digitalen Services sind rund um die Uhr verfügbar und ersparen den Gang zur [[Zulassungsstelle|/zulassungsstelle]].')}
                  </p>
                  
                  <p>
                    {renderInlineLinkedText('Voraussetzung für digitale Zulassungsvorgänge ist ein Fahrzeugschein mit Sicherheitsmerkmalen (ausgestellt ab 2015) sowie die entsprechenden [[Sicherheitscodes|/auto-online-abmelden-unterlagen]]. Autorisierte Dienstleister können im Auftrag des Fahrzeughalters die Zulassungsvorgänge digital durchführen.')}
                  </p>
                </div>
                
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Verfügbar digital:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Fahrzeugabmeldung</li>
                      <li>• Ummeldung bei Umzug</li>
                      <li>• Adressänderung</li>
                      <li>• Kennzeichenreservierung</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Weiterhin vor Ort:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Neuanmeldung von Fahrzeugen</li>
                      <li>• Halterwechsel mit Kennzeichenwechsel</li>
                      <li>• Saisonkennzeichen</li>
                      <li>• Oldtimer-Zulassung</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Bundesweite Struktur */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  Zulassungsstellen in allen Bundesländern
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Deutschland verfügt über ein flächendeckendes Netz von Zulassungsstellen. 
                  Jedes Bundesland organisiert seine Zulassungsstellen eigenständig, folgt 
                  jedoch bundesweit einheitlichen Vorschriften und Standards.
                </p>
                
                <div className="grid md:grid-cols-4 gap-4">
                  {bundeslaender.map((land) => (
                    <div key={land} className="bg-blue-50 rounded-lg p-3 text-center">
                      <span className="text-sm font-medium text-blue-900">{land}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Wichtige Kennzahlen:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">~700</div>
                      <div className="text-sm text-gray-600">Zulassungsstellen</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">16</div>
                      <div className="text-sm text-gray-600">Bundesländer</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">47M</div>
                      <div className="text-sm text-gray-600">Zugelassene PKW</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">24/7</div>
                      <div className="text-sm text-gray-600">Online verfügbar</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Schnelle Hilfe
                </h3>
                
                <div className="space-y-3">
                  <Link
                    href="/auto-online-abmelden"
                    className="block w-full bg-red-100 hover:bg-red-200 text-red-800 text-center font-medium px-4 py-3 rounded-lg transition-all"
                  >
                    Jetzt Auto abmelden
                  </Link>
                  
                  <Link
                    href="/anmelden"
                    className="block w-full bg-green-100 hover:bg-green-200 text-green-800 text-center font-medium px-4 py-3 rounded-lg transition-all"
                  >
                    Auto anmelden
                  </Link>
                  
                  <Link
                    href="/kfz-zulassung-abmeldung-in-deiner-stadt"
                    className="block w-full bg-blue-100 hover:bg-blue-200 text-blue-800 text-center font-medium px-4 py-3 rounded-lg transition-all"
                  >
                    Zulassungsstelle finden
                  </Link>
                </div>
              </div>

              {/* Popular Topics */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Beliebte Themen
                </h3>
                
                <div className="space-y-2">
                  <Link
                    href="/auto-abmelden"
                    className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    → Auto abmelden Schritt für Schritt
                  </Link>
                  <Link
                    href="/auto-online-abmelden-kosten"
                    className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    → Kosten der Abmeldung
                  </Link>
                  <Link
                    href="/auto-online-abmelden-unterlagen"
                    className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    → Benötigte Unterlagen
                  </Link>
                  <Link
                    href="/kfz-zulassung-abmeldung-in-deiner-stadt"
                    className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    → Zulassungsstellen Übersicht
                  </Link>
                </div>
              </div>

              {/* Legal Info */}
              <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Rechtliche Grundlage
                </h3>
                
                <div className="space-y-3 text-sm text-yellow-800">
                  <div>
                    <strong>FZV:</strong> Fahrzeug-Zulassungsverordnung regelt alle Zulassungsverfahren
                  </div>
                  <div>
                    <strong>KBA:</strong> Kraftfahrt-Bundesamt als zentrale Registrierungsstelle
                  </div>
                  <div>
                    <strong>StVZO:</strong> Straßenverkehrs-Zulassungs-Ordnung für technische Anforderungen
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}