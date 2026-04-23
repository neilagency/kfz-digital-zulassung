#!/usr/bin/env tsx
/**
 * FAQ diversity smoke test — compares question strings across city slugs.
 *
 * Usage:
 *   npx tsx scripts/test-faq-diversity.ts
 *   npx tsx scripts/test-faq-diversity.ts slug1 slug2 …
 *   TEST_FAQ_SLUGS=slug1,slug2 npx tsx scripts/test-faq-diversity.ts
 *
 * Without args: 10 random slugs from CITY_SLUGS (deterministic enough for smoke).
 */
import { buildCityModelInputForSlug } from '../src/lib/city-model-input';
import { buildCityPageModel } from '../src/lib/city-intelligence';
import { CITY_SLUGS } from '../src/lib/city-slugs';

function resolveTestSlugs(): string[] {
  const fromEnv = (process.env.TEST_FAQ_SLUGS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromEnv.length) return fromEnv;

  const fromArgv = process.argv.slice(2).map((s) => s.trim()).filter(Boolean);
  if (fromArgv.length) return fromArgv;

  const arr = [...CITY_SLUGS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 10);
}

function loadModel(slug: string) {
  const { input, cityName } = buildCityModelInputForSlug(slug);
  const model = buildCityPageModel(input);
  return { model, cityName };
}

function main() {
  const testSlugs = resolveTestSlugs();
  console.log(`FAQ diversity test — ${testSlugs.length} cities\n`);
  console.log(`Slugs: ${testSlugs.join(', ')}\n`);

  const allQuestions: string[] = [];

  for (const slug of testSlugs) {
    const { model, cityName } = loadModel(slug);
    const faqQuestions = model.content.faq.map((item) => item.q.trim());
    allQuestions.push(...faqQuestions);

    console.log(`${cityName} (${model.archetype}) — ${faqQuestions.length} questions`);
    faqQuestions.forEach((q, i) => {
      const preview = q.length > 72 ? `${q.slice(0, 72)}…` : q;
      console.log(`  ${i + 1}. ${preview}`);
    });
    console.log('');
  }

  const unique = new Set(allQuestions);
  const dupRatio =
    allQuestions.length === 0 ? 0 : ((allQuestions.length - unique.size) / allQuestions.length) * 100;

  console.log(`Duplicate question ratio (exact string match): ${dupRatio.toFixed(1)}%`);
  console.log(`Unique questions: ${unique.size} / ${allQuestions.length}`);
}

main();
