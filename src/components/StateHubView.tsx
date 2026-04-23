/**
 * StateHubView — SEO Authority Hub for each Bundesland
 *
 * Renders a structured hub page for one German state:
 * - Lists all city pages in that state
 * - Structured data: CollectionPage
 * - Internal links to city pages + product page
 * - Topical authority for "kfz abmelden [state]" queries
 */

import Link from 'next/link';
import { MapPin, CheckCircle, Shield, ArrowRight, ChevronRight } from 'lucide-react';
import { ALL_BUNDESLAND_SLUGS, BUNDESLAND_DESCRIPTIONS } from '@/lib/bundesland-slugs';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StateHubCity {
  slug: string;
  name: string;
}

export interface StateHubViewProps {
  stateName: string;
  hubSlug: string;
  cities: StateHubCity[];
  settings: {
    siteUrl: string;
    siteName: string;
  };
  pricing: {
    abmeldungPriceFormatted: string;
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StateHubView({
  stateName,
  hubSlug,
  cities,
  settings,
  pricing,
}: StateHubViewProps) {
  const pageUrl = `${settings.siteUrl}/${hubSlug}`;
  const description =
    BUNDESLAND_DESCRIPTIONS[stateName] ??
    `Fahrzeug online abmelden in ${stateName} – alle Städte und Landkreise im Überblick. Digitale Kfz-Abmeldung ohne Termin ab ${pricing.abmeldungPriceFormatted}.`;

  // ── Structured Data ──────────────────────────────────────────────────────

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `KFZ abmelden in ${stateName} – alle Städte und Landkreise`,
    description,
    url: pageUrl,
    inLanguage: 'de-DE',
    publisher: {
      '@type': 'Organization',
      name: settings.siteName,
      url: settings.siteUrl,
    },
    about: {
      '@type': 'Service',
      name: 'Digitale Fahrzeugabmeldung',
      serviceType: 'KFZ Abmeldung',
      areaServed: {
        '@type': 'State',
        name: stateName,
        containedInPlace: {
          '@type': 'Country',
          name: 'Deutschland',
        },
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start', item: settings.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Alle Städte', item: `${settings.siteUrl}/kfz-zulassung-abmeldung-in-deiner-stadt` },
      { '@type': 'ListItem', position: 3, name: `${stateName}`, item: pageUrl },
    ],
  };

  // ── City grid letter grouping ─────────────────────────────────────────────

  const grouped: Record<string, StateHubCity[]> = {};
  for (const city of cities) {
    const letter = city.name[0]?.toUpperCase() ?? '#';
    (grouped[letter] ??= []).push(city);
  }
  const letters = Object.keys(grouped).sort();

  // ── Benefits list ─────────────────────────────────────────────────────────

  const benefits = [
    `Ohne Termin bei der Kfz-Stelle in ${stateName}`,
    `Offizielle Bestätigung per E-Mail`,
    `Steuer & Versicherung werden automatisch informiert`,
    `Gilt für alle Städte und Landkreise in ${stateName}`,
  ];

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-primary to-primary-800 text-white py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <nav className="mb-6 flex items-center gap-2 text-sm text-white/60" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white">Start</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/kfz-zulassung-abmeldung-in-deiner-stadt" className="hover:text-white">Alle Städte</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">{stateName}</span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wide">Bundesland-Übersicht</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              KFZ abmelden in {stateName}
            </h1>

            <p className="text-white/75 text-lg max-w-2xl mb-8 leading-relaxed">
              Digitale Fahrzeugabmeldung ohne Termin – in allen Städten und Landkreisen in{' '}
              {stateName}. Ab {pricing.abmeldungPriceFormatted}, offiziell und mit Bestätigung per
              E-Mail.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {benefits.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 text-sm bg-white/10 text-white/90 px-3 py-1.5 rounded-full"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  {b}
                </span>
              ))}
            </div>

            <Link
              href="/product/fahrzeugabmeldung"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-primary font-extrabold px-8 py-4 rounded-full text-lg transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Jetzt online abmelden – {pricing.abmeldungPriceFormatted}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* ── Info block ───────────────────────────────────────────────────── */}
        <section className="py-10 bg-gray-50 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <p className="text-gray-700 leading-relaxed max-w-3xl">
              {description}
            </p>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed max-w-3xl">
              Unser Service funktioniert bundesweit für alle Städte und Landkreise. Wählen Sie
              unten Ihre Stadt aus, um zur spezifischen Seite zu gelangen — oder starten Sie
              direkt mit der digitalen Abmeldung.
            </p>
          </div>
        </section>

        {/* ── City grid ────────────────────────────────────────────────────── */}
        <section className="py-14" aria-labelledby="staedte-übersicht">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2
              id="staedte-übersicht"
              className="text-2xl font-extrabold text-primary mb-2"
            >
              Alle Städte und Landkreise in {stateName}
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              {cities.length} Standorte verfügbar – wählen Sie Ihre Stadt für lokale Informationen
              zur Fahrzeugabmeldung.
            </p>

            {letters.map((letter) => (
              <div key={letter} className="mb-8">
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2 mb-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">{letter}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {grouped[letter].map((city) => (
                    <Link
                      key={city.slug}
                      href={`/${city.slug}`}
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent hover:bg-accent/5 px-3 py-2 rounded-lg transition-colors group"
                    >
                      <MapPin className="w-3 h-3 text-primary/30 group-hover:text-accent flex-shrink-0" />
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Other Bundesland hubs ─────────────────────────────────────────── */}
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-lg font-bold text-primary mb-4">
              Übersichten für andere Bundesländer
            </h2>
            <div className="flex flex-wrap gap-2">
              {ALL_BUNDESLAND_SLUGS.filter((s) => s !== hubSlug).map((s) => {
                const label = s
                  .replace('kfz-abmelden-in-', '')
                  .replace(/-/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <Link
                    key={s}
                    href={`/${s}`}
                    className="inline-flex items-center gap-1 text-sm text-primary/70 hover:text-primary bg-white border border-gray-200 hover:border-primary/30 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-14 bg-gradient-to-br from-dark via-primary-900 to-dark text-center">
          <div className="max-w-2xl mx-auto px-4">
            <Shield className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
              Fahrzeug jetzt digital abmelden
            </h2>
            <p className="text-white/70 mb-8">
              Gilt bundesweit – auch für alle Städte in {stateName}. Ohne Termin, ohne
              Ausweis-App, offizielle Bestätigung per E-Mail.
            </p>
            <Link
              href="/product/fahrzeugabmeldung"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-primary font-extrabold px-10 py-5 rounded-full text-xl transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Jetzt für {pricing.abmeldungPriceFormatted} abmelden
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
