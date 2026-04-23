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
  MapPin,
  Building2,
  Shield,
  Clock,
  Users,
  Phone,
  CheckCircle,
  Info,
  BookOpen,
  Navigation,
  Search,
  Star,
} from 'lucide-react';

export const revalidate = 3600;

type ZulassungsstelleInfo = {
  bundesland: string;
  cities: Array<{
    name: string;
    slug: string;
    region?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: 'Zulassungsstelle finden – Alle 700+ Standorte in Deutschland',
    description:
      'Zulassungsstelle in Ihrer Nähe finden: Adressen, Öffnungszeiten und Services aller deutschen Zulassungsstellen. Für alle Bundesländer und Städte.',
    alternates: {
      canonical: `${settings.siteUrl}/zulassungsstelle`,
    },
    openGraph: {
      title: 'Zulassungsstelle finden – Alle 700+ Standorte in Deutschland',
      description:
        'Zulassungsstelle in Ihrer Nähe finden: Adressen, Öffnungszeiten und Services aller deutschen Zulassungsstellen. Für alle Bundesländer und Städte.',
      url: `${settings.siteUrl}/zulassungsstelle`,
      siteName: settings.siteName,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function groupZulassungsstellenByBundesland(): ZulassungsstelleInfo[] {
  const grouped = new Map<string, Array<{ name: string; slug: string; region?: string }>>();
  
  for (const [slug, meta] of Object.entries(CITY_METADATA)) {
    if (!meta.state) continue;
    
    if (!grouped.has(meta.state)) {
      grouped.set(meta.state, []);
    }
    
    grouped.get(meta.state)!.push({
      name: getCityNameBySlug(slug) || slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      region: meta.region,
    });
  }

  return Array.from(grouped.entries())
    .map(([bundesland, cities]) => ({
      bundesland,
      cities: cities.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.bundesland.localeCompare(b.bundesland));
}

export default async function ZulassungsstellePage() {
  const settings = await getSiteSettings();
  const zulassungsstellen = groupZulassungsstellenByBundesland();
  
  const popularCities = [
    { name: 'Berlin', slug: 'berlin-zulassungsstelle', population: '3.7M' },
    { name: 'Hamburg', slug: 'kfz-online-abmelden-in-hamburg', population: '1.9M' },
    { name: 'München', slug: 'auto-online-abmelden-muenchen', population: '1.5M' },
    { name: 'Köln', slug: 'kfz-online-abmelden-koeln', population: '1.1M' },
    { name: 'Frankfurt', slug: 'frankfurt', population: '760k' },
    { name: 'Stuttgart', slug: 'zulassungsservice-stuttgart', population: '630k' },
    { name: 'Düsseldorf', slug: 'zulassungsservice-duesseldorf', population: '620k' },
    { name: 'Dortmund', slug: 'kfz-online-abmelden-dortmund', population: '590k' },
  ];

  const services = [
    'Fahrzeug anmelden',
    'Fahrzeug ummelden', 
    'Fahrzeug abmelden',
    'Kennzeichen reservieren',
    'Adresse ändern',
    'Kurzzeitkennzeichen',
    'Ausfuhrkennzeichen',
    'Saisonkennzeichen',
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
        name: 'Zulassungsstelle',
        item: `${settings.siteUrl}/zulassungsstelle`,
      },
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: 'Deutsche Zulassungsstellen',
    description: 'Übersicht aller Zulassungsstellen in Deutschland für KFZ-Anmeldung, -Ummeldung und -Abmeldung',
    areaServed: {
      '@type': 'Country',
      name: 'Deutschland',
    },
    serviceType: 'Fahrzeugzulassung',
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'Deutsche Zulassungsbehörden',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  700+ Zulassungsstellen bundesweit
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
                Zulassungsstelle in Ihrer Nähe finden
              </h1>
              
              <p className="text-xl text-blue-100 leading-8 mb-8">
                Alle deutschen Zulassungsstellen im Überblick: Adressen, Services und 
                digitale Alternativen für Anmeldung, Ummeldung und Abmeldung.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/kfz-zulassung-abmeldung-in-deiner-stadt"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-blue-700 font-bold px-6 py-3 rounded-full transition-all"
                >
                  <Search className="w-4 h-4" />
                  Stadt suchen
                </Link>
                <Link
                  href="/auto-online-abmelden"
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-medium px-6 py-3 rounded-full transition-all border border-white/20"
                >
                  <Clock className="w-4 h-4" />
                  Online abmelden
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Cities */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Star className="w-7 h-7 text-yellow-500" />
              Beliebte Zulassungsstellen
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Die meistgefragten Zulassungsstellen in deutschen Großstädten mit 
              allen wichtigen Informationen und digitalen Alternativen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {popularCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="block bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {city.name}
                    </h3>
                    <span className="text-sm text-gray-500">{city.population} Einwohner</span>
                  </div>
                  <MapPin className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Zulassungsstelle {city.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    Online-Services verfügbar
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Bundesländer Übersicht */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  Alle Bundesländer im Überblick
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {zulassungsstellen.map((bundesland) => (
                    <div key={bundesland.bundesland} className="border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-blue-600" />
                        {bundesland.bundesland}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        {bundesland.cities.slice(0, 6).map((city) => (
                          <Link
                            key={city.slug}
                            href={`/${city.slug}`}
                            className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
                          >
                            → Zulassungsstelle {city.name}
                          </Link>
                        ))}
                      </div>
                      
                      {bundesland.cities.length > 6 && (
                        <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                          +{bundesland.cities.length - 6} weitere Städte in {bundesland.bundesland}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Übersicht */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Services bei deutschen Zulassungsstellen
                </h2>
                
                <div className="prose prose-lg max-w-none mb-8">
                  <p>
                    {renderInlineLinkedText('Alle deutschen Zulassungsstellen bieten die gleichen Grundservices an, da sie nach [[bundesweit einheitlichen Vorschriften|/kfz-zulassung]] arbeiten. Die Öffnungszeiten und zusätzlichen Services können jedoch variieren.')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-3"
                    >
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{service}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Digitale Alternative
                  </h4>
                  <p className="text-yellow-800 text-sm mb-4">
                    {renderInlineLinkedText('Viele Services sind inzwischen auch digital verfügbar, ohne dass Sie zur Zulassungsstelle fahren müssen. Besonders die [[Fahrzeugabmeldung|/auto-abmelden]] lässt sich vollständig [[online erledigen|/auto-online-abmelden]].')}
                  </p>
                  <Link
                    href="/auto-online-abmelden"
                    className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 py-2 rounded-lg transition-all text-sm"
                  >
                    Jetzt online abmelden
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Schnelle Services
                </h3>
                
                <div className="space-y-3">
                  <Link
                    href="/kfz-zulassung-abmeldung-in-deiner-stadt"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium px-4 py-3 rounded-lg transition-all"
                  >
                    Zulassungsstelle suchen
                  </Link>
                  
                  <Link
                    href="/auto-online-abmelden"
                    className="block w-full bg-red-100 hover:bg-red-200 text-red-800 text-center font-medium px-4 py-3 rounded-lg transition-all"
                  >
                    Online abmelden
                  </Link>
                  
                  <Link
                    href="/kfz-zulassung"
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-center font-medium px-4 py-3 rounded-lg transition-all"
                  >
                    KFZ-Zulassung Info
                  </Link>
                </div>
              </div>

              {/* Statistiken */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Deutschlandweit
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">700+</div>
                    <div className="text-xs text-blue-700">Zulassungsstellen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">16</div>
                    <div className="text-xs text-blue-700">Bundesländer</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">400+</div>
                    <div className="text-xs text-blue-700">Landkreise</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">24/7</div>
                    <div className="text-xs text-blue-700">Online Service</div>
                  </div>
                </div>
              </div>

              {/* Hilfreiche Links */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Hilfreiche Themen
                </h3>
                
                <div className="space-y-2">
                  <Link
                    href="/auto-abmelden"
                    className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    → Auto abmelden Anleitung
                  </Link>
                  <Link
                    href="/auto-online-abmelden-unterlagen"
                    className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    → Benötigte Unterlagen
                  </Link>
                  <Link
                    href="/auto-online-abmelden-kosten"
                    className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    → Kosten & Gebühren
                  </Link>
                  <Link
                    href="/anmelden"
                    className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    → Auto anmelden
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}