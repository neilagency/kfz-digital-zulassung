import { ALL_BUNDESLAND_SLUGS } from '@/lib/bundesland-slugs';
import { CITY_METADATA } from '@/lib/city-metadata';
import {
  buildCityPageContent,
  type BuiltCityPageContent,
} from '@/lib/cityPageContent';
import { buildCityModelInputForSlug } from '@/lib/city-model-input';
import { getSiteSettings } from '@/lib/db';
import { getResolvedCitySlug } from '@/lib/city-slugs';

type ContentBlock =
  | 'LOCAL_CONTEXT'
  | 'USER_BEHAVIOR'
  | 'PROCESS_REALITY'
  | 'DIGITAL_ADVANTAGE'
  | 'REGIONAL_LOGIC';
type LocalSignalLevel = 'high' | 'medium' | 'low';
type OfficeLoad = 'fast' | 'moderate' | 'busy';
type NearbyDensity = 'low' | 'medium' | 'high';
type LocalSignal = {
  trafficLevel: LocalSignalLevel;
  officeLoad: OfficeLoad;
  digitalAdoption: LocalSignalLevel;
  nearbyDensity: NearbyDensity;
};

function inferContentBlocks(content: BuiltCityPageContent): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const order = content.sectionOrder || [];

  if (order.includes('local') || order.includes('links')) blocks.push('LOCAL_CONTEXT');
  if (order.includes('target')) blocks.push('USER_BEHAVIOR');
  if (order.includes('process') || order.includes('documents') || order.includes('preparation')) {
    blocks.push('PROCESS_REALITY');
  }
  if (order.includes('benefits') || order.includes('compare')) blocks.push('DIGITAL_ADVANTAGE');
  if (order.includes('note') || order.includes('faq')) blocks.push('REGIONAL_LOGIC');

  return blocks.length > 0
    ? blocks
    : ['LOCAL_CONTEXT', 'USER_BEHAVIOR', 'PROCESS_REALITY', 'DIGITAL_ADVANTAGE', 'REGIONAL_LOGIC'];
}

function inferLocalSignal(nearbyCount: number): LocalSignal {
  if (nearbyCount >= 6) {
    return {
      trafficLevel: 'high',
      officeLoad: 'busy',
      digitalAdoption: 'high',
      nearbyDensity: 'high',
    };
  }

  if (nearbyCount >= 3) {
    return {
      trafficLevel: 'medium',
      officeLoad: 'moderate',
      digitalAdoption: 'medium',
      nearbyDensity: 'medium',
    };
  }

  return {
    trafficLevel: 'low',
    officeLoad: 'fast',
    digitalAdoption: 'low',
    nearbyDensity: 'low',
  };
}

export const TOP_PRIORITY_CITY_SLUGS = [
  'berlin-zulassungsstelle',
  'auto-online-abmelden-muenchen',
  'kfz-online-abmelden-in-hamburg',
  'kfz-online-abmelden-koeln',
  'frankfurt',
  'zulassungsservice-stuttgart',
  'zulassungsservice-duesseldorf',
  'kfz-online-abmelden-dortmund',
  'kfz-online-abmelden-essen',
  'leipzig',
  'kfz-online-abmelden-bremen',
  'dresden-kfz-zulassungsstelle',
  'zulassungsservice-hannover',
  'zulassungsservice-nuernberg',
  'duisburg',
  'auto-online-abmelden-in-bochum',
  'zulassungsservice-wuppertal',
  'zulassungsservice-bielefeld',
  'bonn',
  'zulassungsservice-muenster',
  'karlsruhe',
  'zulassungsservice-mannheim',
  'augsburg',
  'wiesbaden',
  'auto-abmelden-online-in-gelsenkirchen',
  'moenchengladbach',
  'braunschweig',
  'chemnitz',
  'kiel',
  'aachen',
  'halle',
  'magdeburg',
  'freiburg',
  'krefeld',
  'mainz',
  'luebeck',
  'erfurt',
  'oberhausen',
  'rostock',
  'kassel',
  'hagen',
  'hamm',
  'saarbruecken',
  'muelheim',
  'potsdam',
  'ludwigshafen',
  'oldenburg',
  'leverkusen',
  'osnabrueck',
  'solingen',
] as const;

export type SeoAuditNode = {
  slug: string;
  name: string;
  url: string;
  indexable: boolean;
  reasons: string[];
  nearbyCount: number;
  nearbyGraphValid: boolean;
  uniqueLocalInsightCount: number;
  reusableSentenceShare: number;
  semanticDepthScore: number;  introCluster: string;
  contentBlocks: ContentBlock[];
  contentBlockSignature: string;
};

export type SeoAuditSummary = {
  totalCities: number;
  weakNodeCount: number;
  weakNodePercent: number;
  indexableCityCount: number;
  topPriorityCount: number;
  bundeslandHubCount: number;
  statesCovered: number;
  nearbyGraphFailures: number;
  lowLocalInsightCount: number;
  highReusableShareThreshold: number;
  highReusableShareCount: number;
  averageReusableShare: number;
  maxReusableShare: number;
  contentBlockPatternCount: number;
  generatedAt: string;
};

export type TopPriorityUrl = {
  slug: string;
  sourceSlug?: string;
  name: string;
  url: string;
  indexable: boolean;
  reasons: string[];
  nearbyCount: number;
  nearbyGraphValid: boolean;
  uniqueLocalInsightCount: number;
  reusableSentenceShare: number;  introCluster: string;
  contentBlocks: ContentBlock[];
  contentBlockSignature: string;
};

export type SeoAuditSnapshot = {
  summary: SeoAuditSummary;
  topPriorityUrls: TopPriorityUrl[];
  contentBlockUsage: Record<ContentBlock, number>;
  contentBlockPatterns: Array<{ signature: string; count: number }>;  localSignalUsage: {
    trafficLevel: Record<LocalSignalLevel, number>;
    officeLoad: Record<OfficeLoad, number>;
    digitalAdoption: Record<LocalSignalLevel, number>;
    nearbyDensity: Record<NearbyDensity, number>;
  };
  bundeslandHubs: Array<{ slug: string; url: string }>;
  weakNodes: SeoAuditNode[];
};

const REUSE_THRESHOLD = 0.25;
const CACHE_TTL = 60_000;

let seoAuditCache: { data: SeoAuditSnapshot; ts: number } | null = null;

type ComputedSeoAuditNode = SeoAuditNode & {
  localSignal: LocalSignal;
};

export async function getSeoAuditSnapshot(): Promise<SeoAuditSnapshot> {
  if (seoAuditCache && Date.now() - seoAuditCache.ts < CACHE_TTL) {
    return seoAuditCache.data;
  }

  const settings = await getSiteSettings();
  const siteUrl = settings.siteUrl.replace(/\/$/, '');

  const citySeoAudits: ComputedSeoAuditNode[] = Object.keys(CITY_METADATA)
    .map((slug) => {
      const { cityName, resolvedSlug, input } = buildCityModelInputForSlug(slug);
      const content = buildCityPageContent(input);
      const nearbyCount = input.nearbySlugs?.length ?? input.nearby?.length ?? 0;
      const contentBlocks = inferContentBlocks(content);
      const localSignal = inferLocalSignal(nearbyCount);

      return {
        slug: resolvedSlug,
        name: cityName,
        url: `${siteUrl}/${resolvedSlug}`,
        indexable: true,
        reasons: [],
        nearbyCount,
        nearbyGraphValid: nearbyCount > 0,
        uniqueLocalInsightCount: content.localBlockText ? 1 : 0,
        reusableSentenceShare: 0,
        semanticDepthScore: 0,
        introCluster: content.intro,
        contentBlocks,
        contentBlockSignature: contentBlocks.join(' > '),
        localSignal,
      };
    })
    .sort((left, right) => left.slug.localeCompare(right.slug));

  const citySeoAuditMap = new Map(citySeoAudits.map((item) => [item.slug, item]));
  const weakNodes = citySeoAudits.filter((item) => !item.indexable);

  const contentBlockUsage = citySeoAudits.reduce<Record<ContentBlock, number>>(
    (acc, item) => {
      item.contentBlocks.forEach((block) => {
        acc[block] += 1;
      });
      return acc;
    },
    {
      LOCAL_CONTEXT: 0,
      USER_BEHAVIOR: 0,
      PROCESS_REALITY: 0,
      DIGITAL_ADVANTAGE: 0,
      REGIONAL_LOGIC: 0,
    },
  );

  const contentBlockPatterns = Array.from(
    citySeoAudits.reduce<Map<string, number>>((acc, item) => {
      acc.set(item.contentBlockSignature, (acc.get(item.contentBlockSignature) || 0) + 1);
      return acc;
    }, new Map<string, number>()),
  )
    .map(([signature, count]) => ({ signature, count }))
    .sort((left, right) => right.count - left.count || left.signature.localeCompare(right.signature));

  const localSignalUsage = citySeoAudits.reduce(
    (acc, item) => {
      acc.trafficLevel[item.localSignal.trafficLevel] += 1;
      acc.officeLoad[item.localSignal.officeLoad] += 1;
      acc.digitalAdoption[item.localSignal.digitalAdoption] += 1;
      acc.nearbyDensity[item.localSignal.nearbyDensity] += 1;
      return acc;
    },
    {
      trafficLevel: { low: 0, medium: 0, high: 0 },
      officeLoad: { fast: 0, moderate: 0, busy: 0 },
      digitalAdoption: { low: 0, medium: 0, high: 0 },
      nearbyDensity: { low: 0, medium: 0, high: 0 },
    } satisfies {
      trafficLevel: Record<LocalSignalLevel, number>;
      officeLoad: Record<OfficeLoad, number>;
      digitalAdoption: Record<LocalSignalLevel, number>;
      nearbyDensity: Record<NearbyDensity, number>;
    },
  );

  const topPriorityUrls: TopPriorityUrl[] = TOP_PRIORITY_CITY_SLUGS.map((sourceSlug) => {
    const resolvedSlug = getResolvedCitySlug(sourceSlug) || sourceSlug;
    const audit = citySeoAuditMap.get(resolvedSlug);

    return {
      slug: resolvedSlug,
      ...(resolvedSlug !== sourceSlug ? { sourceSlug } : {}),
      name: audit?.name || resolvedSlug,
      url: `${siteUrl}/${resolvedSlug}`,
      indexable: audit?.indexable ?? true,
      reasons: audit?.reasons ?? [],
      nearbyCount: audit?.nearbyCount ?? 0,
      nearbyGraphValid: audit?.nearbyGraphValid ?? true,
      uniqueLocalInsightCount: audit?.uniqueLocalInsightCount ?? 0,
      reusableSentenceShare: audit?.reusableSentenceShare ?? 0,
      introCluster: audit?.introCluster ?? 'unknown',
      contentBlocks: audit?.contentBlocks ?? [],
      contentBlockSignature: audit?.contentBlockSignature ?? '',
    };
  });

  const bundeslandHubs = ALL_BUNDESLAND_SLUGS.map((slug) => ({
    slug,
    url: `${siteUrl}/${slug}`,
  }));

  const states = new Set(
    Object.values(CITY_METADATA)
      .map((item) => item.state)
      .filter(Boolean),
  );

  const summary: SeoAuditSummary = {
    totalCities: citySeoAudits.length,
    weakNodeCount: weakNodes.length,
    weakNodePercent: Number(((weakNodes.length / citySeoAudits.length) * 100).toFixed(2)),
    indexableCityCount: citySeoAudits.length - weakNodes.length,
    topPriorityCount: TOP_PRIORITY_CITY_SLUGS.length,
    bundeslandHubCount: ALL_BUNDESLAND_SLUGS.length,
    statesCovered: states.size,
    nearbyGraphFailures: citySeoAudits.filter((item) => !item.nearbyGraphValid).length,
    lowLocalInsightCount: citySeoAudits.filter((item) => item.uniqueLocalInsightCount < 2).length,
    highReusableShareThreshold: REUSE_THRESHOLD,
    highReusableShareCount: citySeoAudits.filter((item) => item.reusableSentenceShare > REUSE_THRESHOLD).length,
    averageReusableShare: Number(
      (citySeoAudits.reduce((sum, item) => sum + item.reusableSentenceShare, 0) / citySeoAudits.length).toFixed(3),
    ),
    maxReusableShare: Number(
      citySeoAudits.reduce((max, item) => Math.max(max, item.reusableSentenceShare), 0).toFixed(3),
    ),
    contentBlockPatternCount: contentBlockPatterns.length,
    generatedAt: new Date().toISOString(),
  };

  const snapshot: SeoAuditSnapshot = {
    summary,
    topPriorityUrls,
    contentBlockUsage,
    contentBlockPatterns,
    localSignalUsage,
    bundeslandHubs,
    weakNodes,
  };

  seoAuditCache = { data: snapshot, ts: Date.now() };
  return snapshot;
}