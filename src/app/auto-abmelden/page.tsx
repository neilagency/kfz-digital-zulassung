import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/db';
import { CITY_METADATA } from '@/lib/city-metadata';
import { getCityNameBySlug } from '@/lib/city-slugs';

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
  FileCheck,
  Building2,
  Shield,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  Info,
  BookOpen,
  Scale,
} from 'lucide-react';

export const revalidate = 3600;

type CityGroup = {
  bundesland: string;
  cities: Array<{ name: string; slug: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: 'Auto abmelden in Deutschland – Kompletter Leitfaden 2026',
    description:
      'Alles über Fahrzeugabmeldung in Deutschland: Von Zulassungsstellen bis zur digitalen Abmeldung. Bundesweite Informationen für alle 16 Bundesländer.',
    alternates: {
      canonical: `${settings.siteUrl}/auto-abmelden`,
    },
    openGraph: {
      title: 'Auto abmelden in Deutschland – Kompletter Leitfaden 2026',
      description:
        'Alles über Fahrzeugabmeldung in Deutschland: Von Zulassungsstellen bis zur digitalen Abmeldung. Bundesweite Informationen für alle 16 Bundesländer.',
      url: `${settings.siteUrl}/auto-abmelden`,
      siteName: settings.siteName,
      type: 'article',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function groupCitiesByBundesland(): CityGroup[] {
  const grouped = new Map<string, Array<{ name: string; slug: string }>>();
  
  for (const [slug, meta] of Object.entries(CITY_METADATA)) {
    if (!meta.state) continue;
    
    if (!grouped.has(meta.state)) {
      grouped.set(meta.state, []);
    }
    
    grouped.get(meta.state)!.push({
      name: getCityNameBySlug(slug) || slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
    });
  }

  return Array.from(grouped.entries())
    .map(([bundesland, cities]) => ({
      bundesland,
      cities: cities.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 8), // Top 8 pro Bundesland
    }))
    .sort((a, b) => a.bundesland.localeCompare(b.bundesland));
}

export default async function AutoAbmeldenPage() {
  const settings = await getSiteSettings();
  const cityGroups = groupCitiesByBundesland();
  
  const majorCities = [
    { name: 'Berlin', slug: 'berlin-zulassungsstelle' },
    { name: 'München', slug: 'auto-online-abmelden-muenchen' },
    { name: 'Hamburg', slug: 'kfz-online-abmelden-in-hamburg' },
    { name: 'Köln', slug: 'kfz-online-abmelden-koeln' },
    { name: 'Frankfurt', slug: 'frankfurt' },
    { name: 'Stuttgart', slug: 'zulassungsservice-stuttgart' },
    { name: 'Düsseldorf', slug: 'zulassungsservice-duesseldorf' },
    { name: 'Dortmund', slug: 'kfz-online-abmelden-dortmund' },
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
        name: 'Auto abmelden',
        item: `${settings.siteUrl}/auto-abmelden`,
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Auto abmelden in Deutschland – Kompletter Leitfaden 2026',
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
      '@id': `${settings.siteUrl}/auto-abmelden`,
    },
    articleSection: 'Fahrzeugabmeldung',
    keywords: 'Auto abmelden, Fahrzeugabmeldung, Zulassungsstelle, KBA, Deutschland',
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
              <div className="inline-flex items-center gap-2 bg-primary-50 rounded-full px-4 py-2 mb-6">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">
                  Offizieller Leitfaden für Deutschland
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Auto abmelden in Deutschland
              </h1>
              
              <p className="text-xl text-gray-600 leading-8 mb-8">
                Kompletter Leitfaden zur Fahrzeugabmeldung: Von der klassischen Zulassungsstelle bis zur 
                modernen Online-Abmeldung. Alle Informationen für alle 16 Bundesländer und über 750 Städte.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/auto-online-abmelden"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-full transition-all"
                >
                  <FileCheck className="w-4 h-4" />
                  Online abmelden
                </Link>
                <Link
                  href="/kfz-zulassung-abmeldung-in-deiner-stadt"
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium px-6 py-3 rounded-full transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  Stadt finden
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Überblick */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Überblick: Fahrzeugabmeldung in Deutschland
                </h2>
                
                <div className="prose prose-lg max-w-none">
                  <p>
                    {renderInlineLinkedText('Die Abmeldung eines Kraftfahrzeugs in Deutschland ist ein standardisierter Verwaltungsakt, der bundesweit nach einheitlichen Regeln abläuft. Grundlage bildet die Fahrzeug-Zulassungsverordnung (FZV), die sowohl die [[klassische Abmeldung bei der Zulassungsstelle|/zulassungsstelle]] als auch moderne [[digitale Verfahren|/auto-online-abmelden]] regelt.')}
                  </p>
                  
                  <p>
                    {renderInlineLinkedText('Jeder Fahrzeughalter hat grundsätzlich drei Möglichkeiten: den persönlichen Gang zur [[zuständigen Zulassungsstelle|/zulassungsstelle]], die Beauftragung eines Zulassungsdienstes oder die [[Nutzung digitaler Abmeldeverfahren|/auto-online-abmelden]] über autorisierte Online-Dienste.')}
                  </p>
                  
                  <p>
                    {renderInlineLinkedText('Unabhängig vom gewählten Weg sind die [[erforderlichen Unterlagen|/auto-online-abmelden-unterlagen]] identisch: Zulassungsbescheinigung Teil I (Fahrzeugschein), beide Kennzeichen sowie die entsprechenden Sicherheitscodes. Die Abmeldung wird zentral im Kraftfahrt-Bundesamt (KBA) registriert und führt automatisch zur Beendigung der Versicherungs- und Steuerpflicht.')}
                  </p>
                </div>
              </section>

              {/* Rechtliche Grundlagen */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Scale className="w-6 h-6 text-primary" />
                  Rechtliche Grundlagen und Vorschriften
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      Fahrzeug-Zulassungsverordnung (FZV)
                    </h3>
                    <p className="text-blue-800">
                      {renderInlineLinkedText('Die FZV regelt bundesweit einheitlich alle Aspekte der [[Fahrzeugzulassung und -abmeldung|/kfz-zulassung]]. Sie definiert sowohl die Zuständigkeiten der örtlichen [[Zulassungsbehörden|/zulassungsstelle]] als auch die Anforderungen an [[digitale Abmeldeverfahren|/auto-online-abmelden]].')}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">
                      Kraftfahrt-Bundesamt (KBA)
                    </h3>
                    <p className="text-green-800">
                      Das KBA führt das zentrale Fahrzeugregister und autorisiert alle Stellen, die 
                      Fahrzeugabmeldungen durchführen dürfen. Jede Abmeldung wird hier registriert und 
                      ist damit bundesweit wirksam.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">
                      Örtliche Zuständigkeit
                    </h3>
                    <p className="text-purple-800">
                      {renderInlineLinkedText('Während jeder Fahrzeughalter grundsätzlich bei [[jeder deutschen Zulassungsstelle|/zulassungsstelle]] sein Fahrzeug abmelden kann, haben sich in der Praxis regionale Zuständigkeiten etabliert, die auf Kreisebene organisiert sind.')}
                    </p>
                  </div>
                </div>
              </section>

              {/* Abmeldeverfahren */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FileCheck className="w-6 h-6 text-primary" />
                  Abmeldeverfahren im Detail
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Klassische Abmeldung vor Ort
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        Termin bei der Zulassungsstelle
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        Persönliche Vorsprache erforderlich
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        Sofortige Bearbeitung vor Ort
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        Direkter Erhalt der Bestätigung
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-primary-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-primary-900 mb-4">
                      Digitale Abmeldung
                    </h3>
                    <ul className="space-y-2 text-primary-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                        Keine Terminbindung erforderlich
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                        24/7 Verfügbarkeit
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                        Bearbeitung durch autorisierten Dienst
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                        Bestätigung per E-Mail
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h4 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Wichtige Hinweise für alle Verfahren
                  </h4>
                  <ul className="space-y-2 text-yellow-800">
                    <li>• Sicherheitscodes müssen vor der Abmeldung freigerubbelt werden</li>
                    <li>• Beide Kennzeichen sind zwingend erforderlich</li>
                    <li>• Die Abmeldung wird automatisch an Versicherung und Steuerbehörde übermittelt</li>
                    <li>• Eine Rückgängigmachung ist nicht möglich - nur Neuanmeldung</li>
                  </ul>
                </div>
              </section>

              {/* Bundesweite Abdeckung */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  Bundesweite Abdeckung: Alle 16 Bundesländer
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Das deutsche Zulassungswesen ist auf Länderebene organisiert, folgt jedoch bundesweit 
                  einheitlichen Standards. Jedes Bundesland verfügt über ein Netz von Zulassungsstellen, 
                  die in der Regel auf Landkreis- oder Stadtebene angesiedelt sind.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {cityGroups.slice(0, 8).map((group) => (
                    <div key={group.bundesland} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        {group.bundesland}
                      </h3>
                      <div className="space-y-1">
                        {group.cities.slice(0, 4).map((city) => (
                          <Link
                            key={city.slug}
                            href={`/${city.slug}`}
                            className="block text-sm text-primary hover:text-primary-700 transition-colors"
                          >
                            Auto abmelden in {city.name}
                          </Link>
                        ))}
                        {group.cities.length > 4 && (
                          <div className="text-xs text-gray-500 mt-2">
                            +{group.cities.length - 4} weitere Städte
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link
                    href="/kfz-zulassung-abmeldung-in-deiner-stadt"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary-700 font-medium"
                  >
                    <MapPin className="w-4 h-4" />
                    Alle Städte anzeigen →
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Schnelle Abmeldung
                </h3>
                
                <div className="space-y-3">
                  <Link
                    href="/auto-online-abmelden"
                    className="block w-full bg-primary hover:bg-primary-600 text-white text-center font-medium px-4 py-3 rounded-lg transition-all"
                  >
                    Jetzt online abmelden
                  </Link>
                  
                  <Link
                    href="/auto-online-abmelden-kosten"
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-center font-medium px-4 py-3 rounded-lg transition-all"
                  >
                    Kosten & Preise
                  </Link>
                  
                  <Link
                    href="/auto-online-abmelden-unterlagen"
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-center font-medium px-4 py-3 rounded-lg transition-all"
                  >
                    Benötigte Unterlagen
                  </Link>
                </div>
              </div>

              {/* Major Cities */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Großstädte
                </h3>
                
                <div className="space-y-2">
                  {majorCities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/${city.slug}`}
                      className="block text-sm text-gray-700 hover:text-primary transition-colors py-1"
                    >
                      Auto abmelden in {city.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200 p-6">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">
                  Deutschlandweit verfügbar
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-800">16</div>
                    <div className="text-xs text-primary-700">Bundesländer</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-800">750+</div>
                    <div className="text-xs text-primary-700">Städte</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-800">24/7</div>
                    <div className="text-xs text-primary-700">Verfügbar</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-800">KBA</div>
                    <div className="text-xs text-primary-700">Registriert</div>
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