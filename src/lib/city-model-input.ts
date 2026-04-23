import { getLokaleBehoerde } from './behoerde';
import { getCityMeta } from './city-metadata';
import { getCityNameBySlug, getResolvedCitySlug, SLUG_CITY_MAP } from './city-slugs';
import { type CityPageModelInput } from './cityPageContent';

type AreaType = 'urban' | 'suburban' | 'rural';

const URBAN_STATE_CITIES = new Set([
  'Berlin',
  'Hamburg',
  'Bremen',
]);

const LARGE_CITY_SLUGS = new Set([
  'berlin-zulassungsstelle',
  'auto-online-abmelden-muenchen',
  'kfz-online-abmelden-koeln',
  'kfz-online-abmelden-dortmund',
  'kfz-online-abmelden-essen',
  'kfz-online-abmelden-in-hamburg',
  'duesseldorf',
  'duisburg',
  'frankfurt',
  'leipzig',
  'aachen',
  'bonn',
  'bielefeld',
  'muenster',
  'karlsruhe',
  'mannheim',
  'wiesbaden',
  'augsburg',
  'chemnitz',
  'dresden-kfz-zulassungsstelle',
  'zulassungsservice-stuttgart',
  'zulassungsservice-hannover',
]);

function buildFallbackCityName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeNearby(nearbySlugs: string[]): string[] {
  return Array.from(
    new Set(
      nearbySlugs
        .map((item) => getResolvedCitySlug(item) || item)
        .filter(Boolean),
    ),
  );
}

function deriveAreaType(params: {
  slug: string;
  cityName: string;
  state?: string;
  region?: string;
  nearbyCount: number;
}): AreaType {
  const { slug, cityName, state, region, nearbyCount } = params;
  const regionText = (region || '').toLowerCase();
  const cityText = cityName.toLowerCase();

  if (LARGE_CITY_SLUGS.has(slug)) return 'urban';
  if (URBAN_STATE_CITIES.has(cityName)) return 'urban';

  if (
    regionText.startsWith('stadt ') ||
    cityText.includes('berlin') ||
    cityText.includes('hamburg') ||
    cityText.includes('münchen') ||
    cityText.includes('koeln') ||
    cityText.includes('köln') ||
    cityText.includes('frankfurt') ||
    cityText.includes('dortmund') ||
    cityText.includes('duesseldorf') ||
    cityText.includes('düsseldorf') ||
    cityText.includes('stuttgart') ||
    cityText.includes('essen') ||
    cityText.includes('bremen') ||
    cityText.includes('hannover') ||
    cityText.includes('leipzig')
  ) {
    return 'urban';
  }

  if (
    regionText.includes('kreis') ||
    regionText.includes('landkreis') ||
    regionText.includes('region') ||
    regionText.includes('verband')
  ) {
    if (nearbyCount <= 2) return 'rural';
    return 'suburban';
  }

  if (state === 'Brandenburg' || state === 'Mecklenburg-Vorpommern' || state === 'Thüringen') {
    if (nearbyCount <= 2) return 'rural';
  }

  return 'suburban';
}

function buildLocalHint(params: {
  cityName: string;
  state?: string;
  region?: string;
  authorityName?: string;
  nearbyNames: string[];
  areaType: AreaType;
}): string {
  const { cityName, state, region, authorityName, nearbyNames, areaType } = params;

  if (authorityName) {
    if (areaType === 'urban') {
      return `${cityName} gehört zu den stärker nachgefragten Standorten. Zuständig ist ${authorityName}${state ? ` in ${state}` : ''}.`;
    }

    if (areaType === 'rural') {
      return `${cityName} gehört eher zu den kleineren bzw. regional angebundenen Standorten. Zuständig ist ${authorityName}${region ? ` im Bereich ${region}` : ''}.`;
    }

    return `${cityName} wird verwaltungstechnisch über ${authorityName}${region ? ` im Bereich ${region}` : ''} betreut.`;
  }

  if (nearbyNames.length >= 2) {
    return `Für ${cityName} sind regionale Bezüge wichtig, unter anderem zu ${nearbyNames[0]} und ${nearbyNames[1]}.`;
  }

  return `Für ${cityName}${state ? ` in ${state}` : ''} wird die lokale Zuständigkeit regional zugeordnet.`;
}

export function buildCityModelInputForSlug(slug: string): {
  cityName: string;
  resolvedSlug: string;
  authority: ReturnType<typeof getLokaleBehoerde>;
  input: CityPageModelInput;
} {
  const resolvedSlug = getResolvedCitySlug(slug) || slug;

  const rawName =
    SLUG_CITY_MAP[resolvedSlug] ||
    buildFallbackCityName(resolvedSlug);

  const cityName = getCityNameBySlug(resolvedSlug) || rawName;
  const meta = getCityMeta(resolvedSlug);

  const nearbySlugs = normalizeNearby(meta?.nearby || []);
  const nearbyNames = nearbySlugs
    .map((item) => getCityNameBySlug(item))
    .filter((item): item is string => !!item);

  const authority = getLokaleBehoerde(cityName, meta?.state);

  const areaType = deriveAreaType({
    slug: resolvedSlug,
    cityName,
    state: meta?.state,
    region: meta?.region,
    nearbyCount: nearbySlugs.length,
  });

  const localHint = buildLocalHint({
    cityName,
    state: meta?.state,
    region: meta?.region,
    authorityName: authority?.name,
    nearbyNames,
    areaType,
  });

  return {
    cityName,
    resolvedSlug,
    authority,
    input: {
      slug: resolvedSlug,
      city: cityName,
      region: meta?.region || cityName,
      state: meta?.state || '',
      areaType,
      localHint,
      nearby: nearbyNames,
      nearbySlugs,
      behoerde: authority
        ? {
            name: authority.name,
            adresse: authority.adresse,
            plz: authority.plz,
            ort: authority.ort,
            telefon: authority.telefon,
            email: authority.email,
          }
        : undefined,
    },
  };
}
