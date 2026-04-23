import { getLokaleBehoerde } from './behoerde';
import { getCityMeta } from './city-metadata';
import { getCityNameBySlug, getResolvedCitySlug, SLUG_CITY_MAP } from './city-slugs';
import { type CityPageModelInput } from './cityPageContent';

type AreaType = 'urban' | 'suburban' | 'rural';

const URBAN_SLUGS = new Set([
  'berlin-zulassungsstelle',
  'kfz-online-abmelden-in-hamburg',
  'auto-online-abmelden-muenchen',
  'kfz-online-abmelden-koeln',
  'zulassungsservice-stuttgart',
  'frankfurt',
  'frankfurt-am-main',
  'duesseldorf',
  'duisburg',
  'leipzig',
  'dresden-kfz-zulassungsstelle',
  'hannover-muenden',
  'zulassungsservice-hannover',
  'bremen',
  'kfz-online-abmelden-bremen',
  'essen',
  'kfz-online-abmelden-essen',
  'dortmund',
  'kfz-online-abmelden-dortmund',
  'bochum',
  'auto-online-abmelden-in-bochum',
  'bonn',
  'muenster',
  'bielefeld',
  'mannheim',
  'nuernberg',
  'nuernberg-zulassungsstelle',
  'augsburg',
  'wiesbaden',
  'karlsruhe',
  'aachen',
  'wuppertal',
  'auto-online-abmelden-in-wuppertal',
  'moenchengladbach',
  'solingen',
  'remscheid',
  'chemnitz',
  'rostock',
  'freiburg',
  'freiburg-breisgau',
  'regensburg',
  'ingolstadt',
  'heilbronn',
  'auto-online-abmelden-heilbronn',
  'krefeld',
  'oberhausen',
  'gelsenkirchen',
  'auto-abmelden-online-in-gelsenkirchen',
  'mainz',
  'saarbruecken',
  'luebeck',
  'kassel',
  'potsdam',
  'erfurt',
  'zulassungsservice-erfurt',
]);

const RURAL_REGION_PATTERNS = [
  /^landkreis\b/i,
  /\bkreis\b/i,
  /\bkreisfreie\b/i,
  /\bamberg-sulzbach\b/i,
  /\bbitburg-pruem\b/i,
  /\bbreisgau-hochschwarzwald\b/i,
  /\bberchtesgadener land\b/i,
  /\bmain-tauber\b/i,
  /\bneckar-odenwald\b/i,
  /\boberbergischer\b/i,
  /\brhein-sieg\b/i,
  /\brhein-erft\b/i,
  /\brhein-lahn\b/i,
  /\brhein-hunsrueck\b/i,
  /\brhein-pfalz\b/i,
  /\bsaale-orla\b/i,
  /\bsaale-holzland\b/i,
  /\bwerra-meissner\b/i,
  /\bweimarer land\b/i,
  /\bvogelsbergkreis\b/i,
  /\bwartburgkreis\b/i,
  /\bunterallgaeu\b/i,
  /\boberallgaeu\b/i,
  /\bzollernalbkreis\b/i,
  /\boerden\w*\b/i,
];

const RURAL_SLUG_HINTS = [
  'landkreis-',
  '-kreis',
  'kreis-',
  'kreis',
  'oberbergischer-kreis',
  'rhein-sieg-kreis',
  'rhein-erft-kreis',
  'rhein-lahn-kreis',
  'rhein-hunsrueck-kreis',
  'rhein-pfalz-kreis',
  'saale-orla-kreis',
  'saale-holzland-kreis',
  'main-tauber-kreis',
  'main-tauber',
  'neckar-odenwald-kreis',
  'zollernalbkreis',
  'vogelsbergkreis',
  'wartburgkreis',
  'weimarer-land',
  'hochsauerlandkreis',
  'burgenlandkreis',
  'ennepe-ruhr-kreis',
  'kyffhaeuserkreis',
  'oberallgaeu',
  'unterallgaeu',
  'berchtesgadener-land',
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveCityNameFromSlug(resolvedSlug: string): string {
  const mapped =
    SLUG_CITY_MAP[resolvedSlug] ||
    resolvedSlug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  return getCityNameBySlug(resolvedSlug) || mapped;
}

function inferAreaType(
  resolvedSlug: string,
  cityName: string,
  region?: string,
  nearbyCount = 0,
): AreaType {
  const slugNorm = normalizeText(resolvedSlug);
  const cityNorm = normalizeText(cityName);
  const regionNorm = normalizeText(region || '');

  if (URBAN_SLUGS.has(resolvedSlug)) {
    return 'urban';
  }

  if (
    /^stadt\b/.test(regionNorm) ||
    cityNorm === 'berlin' ||
    cityNorm === 'hamburg' ||
    cityNorm === 'bremen'
  ) {
    if (nearbyCount >= 4) return 'urban';
  }

  if (RURAL_SLUG_HINTS.some((hint) => slugNorm.includes(normalizeText(hint)))) {
    return 'rural';
  }

  if (RURAL_REGION_PATTERNS.some((pattern) => pattern.test(regionNorm))) {
    return 'rural';
  }

  if (nearbyCount <= 1) {
    return 'rural';
  }

  if (nearbyCount >= 4) {
    return 'suburban';
  }

  return 'suburban';
}

function buildLocalHint(cityName: string, region?: string, state?: string): string {
  const parts = [cityName, region, state].filter((value): value is string => !!value && value.trim().length > 0);
  return parts.join(', ');
}

export function buildCityModelInputForSlug(slug: string): {
  cityName: string;
  resolvedSlug: string;
  authority: ReturnType<typeof getLokaleBehoerde>;
  input: CityPageModelInput;
} {
  const resolvedSlug = getResolvedCitySlug(slug) || slug;
  const cityName = resolveCityNameFromSlug(resolvedSlug);
  const meta = getCityMeta(resolvedSlug);

  const state = meta?.state || '';
  const region = meta?.region || cityName;

  const authority = getLokaleBehoerde(cityName, state);
  const nearbySlugs = meta?.nearby || [];
  const nearbyNames = nearbySlugs
    .map((item) => getCityNameBySlug(item))
    .filter((item): item is string => !!item);

  const areaType = inferAreaType(resolvedSlug, cityName, region, nearbyNames.length);
  const localHint = buildLocalHint(cityName, region, state);

  return {
    cityName,
    resolvedSlug,
    authority,
    input: {
      slug: resolvedSlug,
      city: cityName,
      region,
      state,
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
