import Link from 'next/link';
import {
  BookOpen,
  Building2,
  Car,
  FileText,
  MapPin,
  Shield,
  ExternalLink,
} from 'lucide-react';

type AuthorityHubsProps = {
  cityName: string;
  state?: string;
  className?: string;
};

const AUTHORITY_HUBS = [
  {
    title: 'Auto abmelden',
    description: 'Kompletter Leitfaden zur Fahrzeugabmeldung in Deutschland',
    href: '/auto-abmelden',
    icon: FileText,
    color: 'red',
    keywords: ['Abmeldung', 'Stilllegung', 'Außerbetriebsetzung'],
  },
  {
    title: 'KFZ-Zulassung Übersicht',
    description: 'Alles über Anmeldung, Ummeldung und Abmeldung von Fahrzeugen',
    href: '/kfz-zulassung',
    icon: Car,
    color: 'blue',
    keywords: ['Zulassung', 'Anmeldung', 'Ummeldung'],
  },
  {
    title: 'Zulassungsstellen finden',
    description: 'Alle 700+ Zulassungsstellen in Deutschland im Überblick',
    href: '/zulassungsstelle',
    icon: Building2,
    color: 'green',
    keywords: ['Zulassungsstelle', 'Behörde', 'Standorte'],
  },
];

const COLOR_CLASSES = {
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    accent: 'text-red-600',
    hover: 'hover:bg-red-100',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200', 
    text: 'text-blue-900',
    accent: 'text-blue-600',
    hover: 'hover:bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900', 
    accent: 'text-green-600',
    hover: 'hover:bg-green-100',
  },
};

export default function AuthorityHubsSection({ 
  cityName, 
  state,
  className = '' 
}: AuthorityHubsProps) {
  return (
    <section className={`mx-auto max-w-5xl px-4 sm:px-6 ${className}`}>
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-4 py-1.5 text-blue-700">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-bold">Ratgeber & Guides</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            Umfassende KFZ-Ratgeber für {cityName}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Detaillierte Anleitungen und Informationen zu allen Aspekten der 
            Fahrzeugzulassung{state ? ` in ${state}` : ' in Deutschland'}.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {AUTHORITY_HUBS.map((hub) => {
            const Icon = hub.icon;
            const colors = COLOR_CLASSES[hub.color as keyof typeof COLOR_CLASSES];
            
            return (
              <Link
                key={hub.href}
                href={hub.href}
                className={`block ${colors.bg} ${colors.border} border-2 rounded-xl p-6 transition-all ${colors.hover} hover:shadow-md group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${colors.bg} p-3 rounded-lg border ${colors.border}`}>
                    <Icon className={`w-6 h-6 ${colors.accent}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold ${colors.text} mb-2 group-hover:${colors.accent} transition-colors`}>
                      {hub.title}
                    </h3>
                    
                    <p className={`text-sm ${colors.text}/70 leading-relaxed mb-3`}>
                      {hub.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {hub.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className={`inline-block px-2 py-1 ${colors.bg} border ${colors.border} rounded text-xs font-medium ${colors.text}/60`}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <ExternalLink className={`w-4 h-4 ${colors.accent} opacity-50 group-hover:opacity-100 transition-opacity`} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Alle Ratgeber basieren auf aktuellen deutschen Gesetzen und Verordnungen</span>
            </div>
            
            <Link
              href="/kfz-zulassung-abmeldung-in-deiner-stadt"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Alle Städte durchsuchen →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}