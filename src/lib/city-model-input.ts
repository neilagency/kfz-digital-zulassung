import { getLokaleBehoerde } from './behoerde';
import { getCityMeta } from './city-metadata';
import { getCityNameBySlug, getResolvedCitySlug, SLUG_CITY_MAP } from './city-slugs';
import { type CityPageModelInput } from './cityPageContent';

export function buildCityModelInputForSlug(slug: string): {
  cityName: string;
  resolvedSlug: string;
  authority: ReturnType<typeof getLokaleBehoerde>;
  input: CityPageModelInput;
} {
  const resolvedSlug = getResolvedCitySlug(slug) || slug;

  const rawName =
    SLUG_CITY_MAP[resolvedSlug] ||
    resolvedSlug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  const cityName = getCityNameBySlug(resolvedSlug) || rawName;
  const meta = getCityMeta(resolvedSlug);
  const authority = getLokaleBehoerde(cityName, meta?.state);
  const nearbySlugs = meta?.nearby || [];

  return {
    cityName,
    resolvedSlug,
    authority,
    input: {
      slug: resolvedSlug,
      city: cityName,
      region: meta?.region || cityName,
      state: meta?.state || '',
      areaType: 'suburban',
      localHint: '',
      nearby: nearbySlugs
        .map((item) => getCityNameBySlug(item))
        .filter((item): item is string => !!item),
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