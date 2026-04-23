import { cache } from 'react';
import { buildCityModelInputForSlug } from './city-model-input';
import { buildCityPageModel, type CityPageModel, type CityPageModelInput } from './cityPageContent';

/**
 * Eine RSC-Anfrage pro Slug: einheitliches City-Model für Metadata, LocalPage-Build und CityPageView.
 * Vermeidet doppelte buildCityPageModel-Ausführung und abweichende Input-Quellen.
 */
export const getCityPageForSlug = cache(
  (slug: string): {
    model: CityPageModel;
    input: CityPageModelInput;
    cityName: string;
    resolvedSlug: string;
    authority: ReturnType<typeof buildCityModelInputForSlug>['authority'];
  } => {
    const { input, cityName, authority, resolvedSlug } = buildCityModelInputForSlug(slug);
    const model = buildCityPageModel(input);
    return { model, input, cityName, authority, resolvedSlug };
  },
);
