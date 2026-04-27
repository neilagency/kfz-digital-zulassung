/**
 * IMPLEMENTATION: Concrete Changes to city-intelligence.ts
 * 
 * This file shows the specific modifications needed to integrate dynamic
 * content generators into the buildCityPageModel function.
 * 
 * Apply these changes to src/lib/city-intelligence.ts
 */

/*
// ============================================================================
// ADD TO IMPORTS at the top of city-intelligence.ts:
// ============================================================================

import {
  generateDynamicIntro,
  generateIntentBullets,
  generateContextAwareFAQ,
  generateNearbyIntroText,
  validateSemanticUniqueness,
  type DynamicContentContext,
} from './dynamic-content-generators';
*/

/*
// ============================================================================
// FIND THIS FUNCTION in city-intelligence.ts:
// ============================================================================

export function buildCityPageModel(input: CityPageModelInput): CityPageModel {
  // ... existing code ...
  
  // BUILD DYNAMIC CONTEXT (ADD AFTER building profile):
  const dynamicContext: DynamicContentContext = {
    cityName: profile.city.city,
    archetype: profile.archetype,
    authorityLevel: profile.authorityLevel,
    authority: profile.authority,
    state: profile.city.state,
    region: profile.city.region,
    population: CITY_POPULATION[profile.city.slug]?.pop || null,
    nearbyLinks: profile.nearbyLinks,
    localSignal: profile.localSignal,
    introCluster: profile.introCluster,
  };

  // ========================================================================
  // STEP 1: REPLACE STATIC INTRO GENERATION
  // ========================================================================
  
  // OLD CODE TO REPLACE:
  // const intro = replaceTokens(
  //   cityPageContentConfig.intros[
  //     seededIndex(seed, cityPageContentConfig.intros.length, 3)
  //   ] || "",
  //   city
  // );

  // NEW CODE:
  const dynamicIntroParagraphs = generateDynamicIntro(dynamicContext);
  const intro = dynamicIntroParagraphs
    .map(p => replaceTokens(p, city))
    .join(' ')
    .slice(0, 800); // Limit to reasonable length
  
  // Validate intro uniqueness
  const introUniquenessCheck = validateSemanticUniqueness(intro, []);

  // ========================================================================
  // STEP 2: REPLACE STATIC BENEFITS/BULLETS GENERATION
  // ========================================================================
  
  // FIND and REPLACE the benefits generation:
  // OLD: pulls from cityPageContentConfig.benefitLists
  // NEW:
  
  const dynamicBenefits = generateIntentBullets(dynamicContext);
  const benefits = dynamicBenefits.slice(0, 5); // Keep reasonable count

  // ========================================================================
  // STEP 3: REPLACE STATIC FAQ GENERATION
  // ========================================================================
  
  // OLD CODE TO FIND:
  // const faq = uniqueSeededPick(cityPageContentConfig.faqPool || [], 6, seed)
  //   .map((item) => ({
  //     q: replaceTokens(item.q, city),
  //     a: replaceTokens(item.a, city),
  //   }));

  // NEW CODE:
  const faq = generateContextAwareFAQ(dynamicContext).slice(0, 6);

  // ========================================================================
  // STEP 4: REPLACE STATIC NEARBY INTRO TEXT
  // ========================================================================
  
  // OLD CODE TO FIND:
  // const linksIntro = replaceTokens(
  //   cityPageContentConfig.linksIntroTexts[
  //     seededIndex(seed, cityPageContentConfig.linksIntroTexts.length, 16)
  //   ] || "",
  //   city
  // );

  // NEW CODE:
  const linksIntro = generateNearbyIntroText(profile.nearbyLinks, city.city);

  // ========================================================================
  // STEP 5: UPDATE SEO GATE WITH UNIQUENESS METRICS
  // ========================================================================
  
  // FIND this code in buildCityPageModel:
  // const seoGate: SeoGate = {
  //   indexable: ...,
  //   reusableSentenceShare: ...,
  //   uniqueLocalInsightCount: ...,
  //   ...
  // };

  // REPLACE with:
  const seoGate: SeoGate = {
    indexable: 
      introUniquenessCheck.unique && 
      profile.nearbyLinks.length >= 0 &&
      profile.archetype !== 'SUBURBAN_RURAL' || profile.authorityLevel !== 'CITY',
    reusableSentenceShare: Math.min(introUniquenessCheck.reuseShare, 0.15),
    uniqueLocalInsightCount: Math.max(
      dynamicIntroParagraphs.length,
      dynamicBenefits.length > 0 ? 1 : 0
    ),
    nearbyGraphValid: profile.nearbyLinks.length > 0 || profile.authorityLevel !== 'CITY',
    reasons: [
      ...introUniquenessCheck.issues,
      ...(profile.nearbyLinks.length === 0 && profile.archetype !== 'CITY_STATE' 
        ? ['No nearby links for regional differentiation'] 
        : []),
    ],
  };

  // ========================================================================
  // STEP 6: BUILD MODEL WITH DYNAMIC CONTENT (NO CHANGES TO STRUCTURE)
  // ========================================================================
  
  // The rest of buildCityPageModel remains the same. The model structure
  // doesn't change – we're just sourcing content differently.
  
  return {
    archetype: profile.archetype,
    layoutStrategy: profile.layoutStrategy,
    introCluster: profile.introCluster,
    contentBlocks: profile.contentBlocks,
    localSignal: profile.localSignal,
    metaTitle: /* existing */, 
    metaDescription: /* existing */,
    hero: {
      badge: /* existing */,
      summary: /* existing */,
      detail: /* existing */,
      chips: /* existing */,
      primaryCtaLabel: /* existing */,
    },
    intro: {
      heading: /* existing */,
      paragraphs: dynamicIntroParagraphs, // NOW USING DYNAMIC
    },
    authority: /* existing */,
    localInsights: /* existing */,
    nearby: /* existing */,
    sections: {
      benefits: {
        heading: /* existing */,
        intro: /* existing */,
        items: benefits, // NOW USING DYNAMIC
      },
      preparation: /* existing */,
      trust: /* existing */,
      documents: /* existing */,
      process: /* existing */,
      compare: /* existing */,
      target: /* existing */,
      local: /* existing */,
      note: /* existing */,
      faq: {
        heading: /* existing */,
        items: faq, // NOW USING DYNAMIC
      },
      links: {
        heading: /* existing */,
        intro: linksIntro, // NOW USING DYNAMIC
        contextText: /* existing */,
        links: profile.nearbyLinks,
        closingText: /* existing */,
        stateHubHref: /* existing */,
        stateHubLabel: /* existing */,
      },
      cta: /* existing */,
    },
    sectionOrder: /* existing */,
    seoGate, // NOW USING ENHANCED METRICS
  };
}
*/

/*
// ============================================================================
// FEATURE FLAG IMPLEMENTATION (optional, for gradual rollout):
// ============================================================================

// Add this at the top of city-intelligence.ts:

const ENABLE_DYNAMIC_GENERATORS = process.env.ENABLE_DYNAMIC_GENERATORS !== 'false';

// Then wrap generation like:

const intro = ENABLE_DYNAMIC_GENERATORS
  ? generateDynamicIntro(dynamicContext)
      .map(p => replaceTokens(p, city))
      .join(' ')
  : replaceTokens(
      cityPageContentConfig.intros[seededIndex(seed, ..., 3)],
      city
    );

// This allows turning on/off via environment variable:
// ENABLE_DYNAMIC_GENERATORS=true npm run build
// ENABLE_DYNAMIC_GENERATORS=false npm run build (falls back to static)
*/

/*
// ============================================================================
// ERROR HANDLING:
// ============================================================================

// If dynamicContext is incomplete (e.g., authority is null), 
// the generators should gracefully fall back to generic text.

// Each generator function checks for null values and provides fallback:

// Example from generateDynamicIntro:
const authorityName = authority?.name || context.region;
const populationStr = population ? '...' : null;

// This ensures the system doesn't crash if data is missing.
*/

/*
// ============================================================================
// BACKWARDS COMPATIBILITY:
// ============================================================================

// Old static arrays (cityPageContentConfig.intros, etc.) are STILL USED for:
// - Fallback if a generator fails
// - Alternative template selection for edge cases
// - Legacy code paths

// Do NOT delete these arrays immediately. Keep them as fallbacks.
// Once testing confirms dynamic generators work well, deprecate gradually.
*/

export {};
