/**
 * State Hub Pages — bundesland-slugs.ts
 *
 * Maps URL slugs like /kfz-abmelden-in-bayern to their state name,
 * and provides utilities for building + linking to state-level SEO hub pages.
 *
 * These pages act as topical authority hubs:
 *   /kfz-abmelden-in-[state] → lists all cities in that state
 *   Each city page links back to the state hub → strong internal graph
 */

import { CITY_METADATA } from './city-metadata';
import { SLUG_CITY_MAP } from './city-slugs';

// ── Hub Slug → State Name ────────────────────────────────────────────────────

export const BUNDESLAND_SLUG_MAP: Record<string, string> = {
  'kfz-abmelden-in-bayern':                  'Bayern',
  'kfz-abmelden-in-nrw':                     'Nordrhein-Westfalen',
  'kfz-abmelden-in-bw':                      'Baden-Württemberg',
  'kfz-abmelden-in-hessen':                  'Hessen',
  'kfz-abmelden-in-niedersachsen':           'Niedersachsen',
  'kfz-abmelden-in-sachsen':                 'Sachsen',
  'kfz-abmelden-in-thueringen':              'Thüringen',
  'kfz-abmelden-in-sachsen-anhalt':          'Sachsen-Anhalt',
  'kfz-abmelden-in-rheinland-pfalz':         'Rheinland-Pfalz',
  'kfz-abmelden-in-schleswig-holstein':      'Schleswig-Holstein',
  'kfz-abmelden-in-mecklenburg-vorpommern':  'Mecklenburg-Vorpommern',
  'kfz-abmelden-in-saarland':                'Saarland',
  'kfz-abmelden-in-brandenburg':             'Brandenburg',
  // Stadtstaaten
  'kfz-abmelden-in-berlin':                  'Berlin',
  'kfz-abmelden-in-hamburg':                 'Hamburg',
  'kfz-abmelden-in-bremen':                  'Bremen',
};

// ── State Name → Hub Slug ────────────────────────────────────────────────────

export const STATE_TO_HUB_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(BUNDESLAND_SLUG_MAP).map(([slug, state]) => [state, slug])
);

export const ALL_BUNDESLAND_SLUGS: string[] = Object.keys(BUNDESLAND_SLUG_MAP);

// ── Utilities ────────────────────────────────────────────────────────────────

export function isBundeslandSlug(slug: string): boolean {
  return slug in BUNDESLAND_SLUG_MAP;
}

export function getStateForHubSlug(slug: string): string | null {
  return BUNDESLAND_SLUG_MAP[slug] ?? null;
}

export function getHubSlugForState(state: string): string | null {
  return STATE_TO_HUB_SLUG[state] ?? null;
}

/** Get all city slugs for a given state, alphabetically sorted */
export function getCitiesForState(state: string): Array<{ slug: string; name: string }> {
  return Object.entries(CITY_METADATA)
    .filter(([, meta]) => meta.state === state)
    .map(([slug]) => ({
      slug,
      name:
        SLUG_CITY_MAP[slug] ||
        slug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

/** Short description text for each state hub page (for meta + intro) */
export const BUNDESLAND_DESCRIPTIONS: Record<string, string> = {
  Bayern:
    'Bayern ist das flächenmäßig größte Bundesland Deutschlands mit über 2.000 Städten und Gemeinden. Für die Kfz-Abmeldung sind dort je nach Wohnort unterschiedliche Zulassungsstellen zuständig.',
  'Nordrhein-Westfalen':
    'Nordrhein-Westfalen ist das bevölkerungsreichste Bundesland mit Städten wie Köln, Dortmund, Essen und Düsseldorf. Fahrzeugabmeldungen laufen über die zuständigen Kfz-Zulassungsstellen der jeweiligen Stadt oder des Landkreises.',
  'Baden-Württemberg':
    'Baden-Württemberg ist ein wirtschaftsstarkes Bundesland im Südwesten. Von Stuttgart über Freiburg bis Mannheim – die Kfz-Abmeldung ist in vielen Städten über unseren Online-Service möglich.',
  Hessen:
    'Hessen liegt im Herzen Deutschlands mit Frankfurt als internationalem Zentrum. Für die Kfz-Abmeldung sind die Zulassungsstellen der Städte und Landkreise zuständig.',
  Niedersachsen:
    'Niedersachsen ist das zweitgrößte Bundesland nach Fläche mit dem Volkswagen-Stammwerk in Wolfsburg. Fahrzeugabmeldungen in Hannover, Braunschweig und vielen weiteren Orten sind über unseren Service möglich.',
  Sachsen:
    'Sachsen mit seinen Städten Leipzig, Dresden und Chemnitz bietet viele Möglichkeiten für die digitale Kfz-Abmeldung. Unser Service deckt alle wichtigen sächsischen Städte ab.',
  Thüringen:
    'Thüringen liegt im Herzen Deutschlands. Von Erfurt über Jena bis Gera – die Kfz-Abmeldung im Freistaat ist auch digital möglich.',
  'Sachsen-Anhalt':
    'Sachsen-Anhalt mit Halle, Magdeburg und Dessau bietet über die zuständigen Zulassungsstellen die Möglichkeit zur Fahrzeugabmeldung – auch digital über unseren Service.',
  'Rheinland-Pfalz':
    'Rheinland-Pfalz erstreckt sich vom Moseltal bis an den Rhein. Für Kfz-Abmeldungen in Mainz, Kaiserslautern, Trier und weiteren Städten ist unser Online-Service verfügbar.',
  'Schleswig-Holstein':
    'Schleswig-Holstein liegt zwischen Nord- und Ostsee. Von Kiel bis Lübeck – die digitale Kfz-Abmeldung ist auch im nördlichsten Bundesland über unseren Service möglich.',
  'Mecklenburg-Vorpommern':
    'Mecklenburg-Vorpommern mit Rostock, Schwerin und Greifswald bietet über die zuständigen Stellen eine reguläre Kfz-Abmeldung. Unser Online-Service ergänzt diese Möglichkeiten digital.',
  Saarland:
    'Das Saarland ist das kleinste Flächenbundesland mit Saarbrücken als Landeshauptstadt. Die Kfz-Abmeldung in Saarbrücken und weiteren Städten ist auch über unseren Service digital möglich.',
  Brandenburg:
    'Brandenburg umgibt die Bundeshauptstadt Berlin. Von Potsdam bis Cottbus – für die Kfz-Abmeldung sind die jeweiligen Zulassungsstellen zuständig, die unser digitaler Service ergänzt.',
  Berlin:
    'Berlin ist die Bundeshauptstadt und ein Stadtstaat mit über 3,6 Millionen Einwohnern. Für Kfz-Abmeldungen ist das Landesamt für Bürger- und Ordnungsangelegenheiten (LABO) zuständig – unser digitaler Service bietet eine komfortable Alternative.',
  Hamburg:
    'Hamburg ist Deutschlands zweitgrößte Stadt und Stadtstaat. Die Kfz-Zulassung läuft über den Landesbetrieb Verkehr (LBV). Unser Online-Service ermöglicht die digitale Fahrzeugabmeldung ohne Behördenbesuch.',
  Bremen:
    'Bremen ist der kleinste Stadtstaat Deutschlands mit den Städten Bremen und Bremerhaven. Für die Kfz-Abmeldung sind die jeweiligen Zulassungsstellen zuständig – ergänzt durch unseren digitalen Service.',
};
