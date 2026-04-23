#!/usr/bin/env tsx
/**
 * Intro paragraph diversity — sentence overlap across a small city sample.
 *
 * Usage:
 *   npx tsx scripts/test-intro-diversity.ts
 *   npx tsx scripts/test-intro-diversity.ts slug1 slug2 …
 */
import { buildCityModelInputForSlug } from '../src/lib/city-model-input';
import { buildCityPageModel } from '../src/lib/city-intelligence';

const DEFAULT_SLUGS = [
  'berlin-zulassungsstelle',
  'auto-online-abmelden-muenchen',
  'kfz-online-abmelden-koeln',
  'aichtal',
  'frankfurt-am-main',
];

function introsForSlug(slug: string): string[] {
  const { input } = buildCityModelInputForSlug(slug);
  return buildCityPageModel(input).intro.paragraphs;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function main() {
  const cities =
    process.argv.length > 2
      ? process.argv.slice(2).map((s) => s.trim()).filter(Boolean)
      : DEFAULT_SLUGS;

  console.log('Intro paragraph diversity (sentence-level)\n');

  const allSentences: string[] = [];
  for (const slug of cities) {
    const paras = introsForSlug(slug);
    for (const p of paras) {
      allSentences.push(...splitSentences(p));
    }
  }

  const uniqueSentences = new Set(allSentences);
  const duplicationRate =
    allSentences.length === 0
      ? 0
      : ((allSentences.length - uniqueSentences.size) / allSentences.length) * 100;

  console.log(`Cities: ${cities.length}`);
  console.log(`Total sentences: ${allSentences.length}`);
  console.log(`Unique sentences: ${uniqueSentences.size}`);
  console.log(`Duplication: ${duplicationRate.toFixed(1)}%`);
  console.log(`Status: ${duplicationRate < 40 ? 'PASS' : 'FAIL'} (target <40%)\n`);

  for (const slug of cities) {
    const { cityName } = buildCityModelInputForSlug(slug);
    const paras = introsForSlug(slug);
    console.log(`${cityName} (${slug}):`);
    paras.slice(0, 4).forEach((p, i) => {
      const preview = p.length > 100 ? `${p.slice(0, 100)}…` : p;
      console.log(`  ${i + 1}. ${preview}`);
    });
    console.log('');
  }
}

main();
