/**
 * City Content Intelligence Engine
 *
 * Programmatic SEO content block system:
 * - Fully deterministic (seed-based, zero Math.random())
 * - Condition-aware blocks (behoerde, state, city size)
 * - CSV-driven real data injection ({{behoerde_name}}, {{behoerde_adresse}}, …)
 * - Nearby-city contextual paragraphs
 * - State-specific content for all 16 Bundesländer
 * - Dynamic FAQ powered by real office data
 *
 * No circular imports: only imports from cityPageContent (which does NOT import this file).
 */

import { hashString, replaceTokens } from './cityPageContent';
import type { CityPageData, FaqItem } from './cityPageContent';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type ContentBlock = {
  id: string;
  variants: string[];
  condition?: (city: CityPageData) => boolean;
};

export type DynamicContent = {
  /** Prose paragraph describing the real-world Zulassungsstelle (CSV data). */
  behoerdeBlock: string;
  /** Short contact sentence for the office phone number. */
  behoerdeContactBlock: string;
  /** Contextual paragraph about nearby cities / alternative offices. */
  nearbyContextParagraph: string;
  /** State-specific paragraph (different per Bundesland). */
  stateGuide: string;
  /** Extended guide for high-traffic urban cities. */
  extendedGuide: string;
  /** Condition-gated FAQ items drawn from real CSV data. */
  dynamicFaqItems: FaqItem[];
  // ── Intent-based blocks ─────────────────────────────────────────────────
  /** Informational block: "how to" angle unique per city. */
  intentInformational: string;
  /** Transactional block: action-oriented CTA context. */
  intentTransactional: string;
  /** Alternative block: what to do when no appointment available. */
  intentAlternative: string;
  /** Problem-solving block: edge cases (no nearby, rural, etc.). */
  intentProblemSolving: string;
  // ── City Scenario block ─────────────────────────────────────────────────
  /** Dynamic scenario text that reacts to real city characteristics. */
  scenarioBlock: string;
  // ── Section mix: which optional sections to show ────────────────────────
  /** Seed-selected booleans controlling which optional blocks appear. */
  sectionMix: {
    showIntentInfo: boolean;
    showIntentTransact: boolean;
    showIntentAlt: boolean;
    showScenario: boolean;
  };
};

// ─── DETERMINISTIC HELPERS ───────────────────────────────────────────────────

/**
 * Pick one item from an array using a deterministic seed.
 * Never uses Math.random(). Stable across renders / SSG.
 */
export function deterministicSelect<T>(items: readonly T[], seed: number, offset = 0): T {
  return items[Math.abs(seed + offset) % items.length];
}

/**
 * Return a deterministically ordered copy of an array.
 * Never shuffles randomly. Order is stable per slug.
 */
export function deterministicOrder<T>(items: T[], seed: number): T[] {
  return [...items].sort((a, b) => {
    const aScore = hashString(`${seed}-${JSON.stringify(a)}`);
    const bScore = hashString(`${seed}-${JSON.stringify(b)}`);
    return aScore - bScore;
  });
}

// ─── BLOCK DEFINITIONS ────────────────────────────────────────────────────────

// ── 1. Behörde Detail Block ──────────────────────────────────────────────────
// Renders only when CSV data is available (behoerde matched).
// Injects real address + office name → unique per city.
const BEHOERDE_DETAIL_BLOCK: ContentBlock = {
  id: 'behoerde_detail',
  condition: (city) => !!city.behoerde,
  variants: [
    'Die Kfz-Zulassungsstelle für {{city}} ist {{behoerde_name}}, erreichbar unter der Adresse {{behoerde_adresse}}, {{behoerde_plz}} {{behoerde_ort}}. Wer klassisch abmelden möchte, kann sich dort persönlich vorstellen. Mit unserem digitalen Service lässt sich dieser Weg in vielen Fällen vermeiden.',
    'Für Fahrzeughalter in {{city}} ist {{behoerde_name}} die zuständige Behörde für Kfz-An- und Abmeldungen. Die Zulassungsstelle befindet sich in {{behoerde_adresse}}, {{behoerde_plz}} {{behoerde_ort}}. Unser Online-Service ermöglicht es, die Abmeldung ohne persönlichen Behördenbesuch vorzubereiten.',
    'In {{city}} ist {{behoerde_name}} für die Fahrzeugabmeldung zuständig. Standort: {{behoerde_adresse}}, {{behoerde_plz}} {{behoerde_ort}}. Wer die Fahrt dorthin sparen möchte, kann viele Schritte auch digital vorbereiten und abwickeln.',
    'Die zuständige Behörde für die Kfz-Abmeldung in {{city}} ist {{behoerde_name}} in {{behoerde_ort}}. Persönliche Vorsprachen sind dort unter der Adresse {{behoerde_adresse}}, {{behoerde_plz}} {{behoerde_ort}} möglich. Für die digitale Abmeldung ist der direkte Behördengang in vielen Fällen nicht notwendig.',
    'Wer in {{city}} sein Fahrzeug klassisch abmelden möchte, wendet sich an {{behoerde_name}}, {{behoerde_adresse}}, {{behoerde_plz}} {{behoerde_ort}}. Für viele ist der digitale Weg jedoch die einfachere Alternative zu diesem Behördengang.',
    '{{behoerde_name}} ist die offizielle Kfz-Zulassungsstelle für {{city}} und hat ihren Sitz in {{behoerde_adresse}}, {{behoerde_plz}} {{behoerde_ort}}. Unser digitaler Service bietet für viele eine Alternative, ohne diese Stelle persönlich aufsuchen zu müssen.',
  ],
};

// ── 2. Behörde Contact Block ─────────────────────────────────────────────────
// Renders only when a phone number is available from the CSV.
const BEHOERDE_CONTACT_BLOCK: ContentBlock = {
  id: 'behoerde_contact',
  condition: (city) => !!(city.behoerde?.telefon),
  variants: [
    'Die Zulassungsstelle {{behoerde_name}} in {{city}} ist telefonisch unter {{behoerde_telefon}} erreichbar. Für Fragen zur klassischen Abmeldung vor Ort ist das der direkte Kontaktweg zur Behörde.',
    'Bei Rückfragen zur persönlichen Abmeldung in {{city}} ist {{behoerde_name}} unter {{behoerde_telefon}} erreichbar. Wer die Abmeldung lieber digital vorbereiten möchte, kann diesen Weg über unseren Online-Service nutzen.',
    '{{behoerde_name}} in {{city}} ist unter der Telefonnummer {{behoerde_telefon}} zu erreichen. Für die meisten Online-Abmeldungen ist dieser Kontakt nicht erforderlich.',
  ],
};

// ── 3. Nearby Context Block ──────────────────────────────────────────────────
// Renders when ≥2 nearby cities are known. Unique per city due to real neighbor names.
const NEARBY_CONTEXT_BLOCK: ContentBlock = {
  id: 'nearby_context',
  condition: (city) => (city.nearby?.length ?? 0) >= 2,
  variants: [
    'Wer in {{city}} keinen freien Termin bei der Zulassungsstelle bekommt oder eine Alternative sucht, findet in der Region auch Anlaufstellen in {{nearby1}} und {{nearby2}}. Für viele ist aber der digitale Weg der einfachste Einstieg, ohne Anfahrt zu einem anderen Ort.',
    'In der Umgebung von {{city}} gibt es weitere Zulassungsstellen, zum Beispiel in {{nearby1}} oder {{nearby2}}. Falls Sie jedoch keinen Behördengang wünschen, bietet die Online-Abmeldung eine einfache standortunabhängige Alternative.',
    'Neben {{city}} stehen in der Region auch die Zulassungsstellen in {{nearby1}} und {{nearby2}} zur Verfügung. Viele Fahrzeughalter wählen jedoch den digitalen Weg, um Anfahrten insgesamt zu vermeiden.',
    'Wer Flexibilität bei der Zulassung in der Region rund um {{city}} sucht, kann auch die Anlaufstellen in {{nearby1}} oder {{nearby2}} in Betracht ziehen. Die Online-Abmeldung bleibt dabei für viele die direkteste Lösung ohne zusätzliche Wege.',
    'Die Region rund um {{city}} bietet mehrere Zulassungsstellen, darunter in {{nearby1}} und {{nearby2}}. Viele Fahrzeughalter entscheiden sich dennoch für den Online-Weg, weil er ohne Anfahrt und Terminabsprache auskommt.',
    'Alternativ zu {{city}} können Fahrzeughalter auch die Behörden in {{nearby1}} oder {{nearby2}} aufsuchen. Wer den Weg zur Zulassungsstelle ganz vermeiden möchte, findet im digitalen Service eine passende Lösung.',
  ],
};

// ── 4. State Guide Blocks ────────────────────────────────────────────────────
// Per-Bundesland content — uses {{region}} (always available) for uniqueness.
// Mention {{behoerde_name}} only in variants where fallback to empty string is graceful.
const STATE_GUIDE_BLOCKS: Partial<Record<string, ContentBlock>> = {
  'Bayern': {
    id: 'state_guide_bavaria',
    condition: (city) => city.state === 'Bayern',
    variants: [
      'In Bayern ist die Kfz-Zulassung Aufgabe der Landkreise und kreisfreien Städte. Das zuständige Amt für {{city}} ist {{region}}. Das bayerische Kraftfahrzeugwesen folgt den bundesweit geltenden Regelungen der Fahrzeug-Zulassungsverordnung (FZV).',
      'Das Zulassungswesen in Bayern wird durch die jeweiligen Landratsämter und Stadtverwaltungen geregelt. In {{city}} ist das {{region}}. Viele Fahrzeughalter in Bayern nutzen digitale Angebote, um Behördengänge zu vermeiden.',
      'Bayerische Kfz-Zulassungsstellen sind an die bundesweiten KBA-Systeme angebunden. In {{city}} übernimmt {{region}} diese Aufgabe. Unser Service arbeitet über die GKS-Anbindung bundesweit — also auch für Fahrzeuge mit bayerischen Kennzeichen.',
      'Wer in Bayern ein Fahrzeug abmelden möchte, wendet sich klassisch an das zuständige Landratsamt oder die Stadtverwaltung. In {{city}} ist das die {{region}}. Alternativ steht der digitale Weg offen.',
    ],
  },
  'Nordrhein-Westfalen': {
    id: 'state_guide_nrw',
    condition: (city) => city.state === 'Nordrhein-Westfalen',
    variants: [
      'In Nordrhein-Westfalen wird die Fahrzeugzulassung durch Straßenverkehrsämter und Kreisbehörden verwaltet. In {{city}} ist {{region}} zuständig. Das bevölkerungsreichste Bundesland bietet über seine Zulassungsstellen landesweit Kfz-Abmeldungen an.',
      'NRW-Fahrzeughalter wenden sich bei der klassischen Abmeldung an die jeweils zuständige Straßenverkehrsbehörde. Für {{city}} übernimmt {{region}} diese Aufgabe. Wer digitale Wege bevorzugt, kann die Abmeldung online vorbereiten.',
      'Die Zulassungsstellen in Nordrhein-Westfalen sind nach Kreisen und kreisfreien Städten organisiert. In {{city}} ist {{region}} die zuständige Behörde. Neben dem persönlichen Behördenweg stehen in NRW auch digitale Abmeldemöglichkeiten zur Verfügung.',
      'Als bevölkerungsreichstes Bundesland verfügt NRW über ein dichtes Netz an Kfz-Zulassungsstellen. In {{city}} ist das {{region}}. Wer den Gang zur Behörde meiden möchte, kann von unserem Online-Service profitieren.',
    ],
  },
  'Berlin': {
    id: 'state_guide_berlin',
    condition: (city) => city.state === 'Berlin',
    variants: [
      'In Berlin ist das Landesamt für Bürger- und Ordnungsangelegenheiten (LABO) für Kfz-Zulassungen zuständig. Das LABO betreibt mehrere Zulassungsstellen für alle Berliner Bezirke. Wer die Abmeldung digital vorbereiten möchte, kann unseren Online-Service nutzen.',
      'Das LABO Berlin verwaltet als Stadtstaatbehörde die Kfz-Zulassung für alle Bezirke. Fahrzeughalter können sich für die klassische Abmeldung direkt ans LABO wenden. Unser digitaler Service ergänzt diesen Weg mit einer bequemeren Online-Alternative.',
      'Berlin hat als Stadtsat eine zentral organisierte Zulassungsverwaltung. Zuständige Behörde für Kfz-Abmeldungen ist das Landesamt für Bürger- und Ordnungsangelegenheiten. Viele Berliner Fahrzeughalter nutzen mittlerweile den digitalen Weg, um Wartezeiten und Anfahrten einzusparen.',
    ],
  },
  'Hamburg': {
    id: 'state_guide_hamburg',
    condition: (city) => city.state === 'Hamburg',
    variants: [
      'In Hamburg ist die Kfz-Zulassung bei der Kraftfahrzeugzulassungsstelle Hamburg angesiedelt. Als Stadtstat verfügt Hamburg über eine zentral organisierte Kfz-Zulassung. Digitale Abmeldemöglichkeiten ergänzen das klassische Angebot.',
      'Als Stadtstat verfügt Hamburg über eine zentrale Kfz-Zulassungsstelle. Für Fahrzeughalter in {{city}} bedeutet das: alle Zulassungsangelegenheiten laufen über dieselbe Hamburger Behörde. Unser Online-Service bietet eine bequeme Alternative zum persönlichen Behördengang.',
    ],
  },
  'Bremen': {
    id: 'state_guide_bremen',
    condition: (city) => city.state === 'Bremen',
    variants: [
      'Im Bundesland Bremen ist das Amt für Straßen und Verkehr für Kfz-Zulassungen zuständig. Als Zwei-Städte-Staat mit Bremen und Bremerhaven hat das Land eine überschaubare Verwaltungsstruktur. Neben dem klassischen Weg vor Ort steht der digitale Abmeldeservice zur Verfügung.',
    ],
  },
  'Hessen': {
    id: 'state_guide_hessen',
    condition: (city) => city.state === 'Hessen',
    variants: [
      'In Hessen werden Kfz-Zulassungen durch die jeweiligen Kreise und kreisfreien Städte verwaltet. Für {{city}} ist {{region}} zuständig. Das hessische Zulassungswesen folgt den bundesweit geltenden Regelungen der FZV.',
      'Hessische Fahrzeughalter wenden sich bei der klassischen Abmeldung an die zuständige Zulassungsstelle ihres Kreises oder ihrer Stadt. In {{city}} ist das {{region}}. Digitale Alternativen ermöglichen den Prozess ohne Behördenbesuch.',
      'Das Zulassungswesen in Hessen ist dezentral auf Kreise und kreisfreie Städte verteilt. In {{city}} ist {{region}} die zuständige Behörde. Neben dem Amt vor Ort bietet die Online-Abmeldung eine zeitgemäße Alternative.',
    ],
  },
  'Baden-Württemberg': {
    id: 'state_guide_bw',
    condition: (city) => city.state === 'Baden-Württemberg',
    variants: [
      'In Baden-Württemberg ist die Kfz-Zulassung Aufgabe der Stadt- und Landkreise. Für {{city}} ist {{region}} zuständig. Ergänzend zu den klassischen Zulassungsstellen stehen in BW digitale Abmeldemöglichkeiten zur Verfügung.',
      'Baden-württembergische Kfz-Zulassungen laufen über die jeweiligen Kfz-Zulassungsstellen der Kreise. In {{city}} übernimmt {{region}} diese Aufgabe. Viele Fahrzeughalter wählen den digitalen Weg, um Fahrten zur Behörde zu sparen.',
      'In BW regeln die Landkreise und Stadtkreise eigenverantwortlich das Kfz-Zulassungswesen. Für {{city}} ist {{region}} verantwortlich. Digitale Services ergänzen das Angebot für Fahrzeughalter, die den Amtsweg meiden möchten.',
    ],
  },
  'Niedersachsen': {
    id: 'state_guide_niedersachsen',
    condition: (city) => city.state === 'Niedersachsen',
    variants: [
      'In Niedersachsen sind die Landkreise und kreisfreien Städte für das Kfz-Zulassungswesen verantwortlich. In {{city}} übernimmt {{region}} diese Aufgabe. Fahrzeughalter können die Abmeldung klassisch vor Ort oder über digitale Services vorbereiten.',
      'Das niedersächsische Zulassungswesen ist auf Kreisebene organisiert. Für {{city}} ist {{region}} zuständig. Viele Fahrzeughalter in Niedersachsen nutzen inzwischen den digitalen Weg, um Anfahrten zu vermeiden.',
    ],
  },
  'Sachsen': {
    id: 'state_guide_sachsen',
    condition: (city) => city.state === 'Sachsen',
    variants: [
      'In Sachsen ist die Kfz-Zulassung Aufgabe der Landkreise und kreisfreien Städte. Zuständige Behörde für {{city}} ist {{region}}. Das sächsische Zulassungswesen folgt den bundesweit geltenden Vorschriften der FZV.',
      'Sächsische Fahrzeughalter wenden sich für Kfz-Angelegenheiten an die zuständige Kreisbehörde. In {{city}} ist das {{region}}. Digitale Abmeldemöglichkeiten ergänzen das klassische Angebot.',
    ],
  },
  'Rheinland-Pfalz': {
    id: 'state_guide_rlp',
    condition: (city) => city.state === 'Rheinland-Pfalz',
    variants: [
      'In Rheinland-Pfalz verwalten die Kreise und kreisfreien Städte die Kfz-Zulassung. Für {{city}} ist {{region}} zuständig. Neben dem klassischen Behördengang bietet die Online-Abmeldung eine flexible Alternative.',
    ],
  },
  'Schleswig-Holstein': {
    id: 'state_guide_sh',
    condition: (city) => city.state === 'Schleswig-Holstein',
    variants: [
      'In Schleswig-Holstein ist die Kfz-Zulassung auf die Kreise und kreisfreien Städte verteilt. Für {{city}} ist {{region}} die zuständige Behörde. Digitale Services ermöglichen Fahrzeughaltern in SH eine bequeme Alternative zum Amtsbesuch.',
    ],
  },
  'Thüringen': {
    id: 'state_guide_thueringen',
    condition: (city) => city.state === 'Thüringen',
    variants: [
      'In Thüringen regeln die Landkreise und kreisfreien Städte das Kfz-Zulassungswesen eigenverantwortlich. Für {{city}} ist {{region}} die zuständige Behörde. Neben dem Gang zur Zulassungsstelle steht der digitale Abmeldeweg offen.',
    ],
  },
  'Brandenburg': {
    id: 'state_guide_brandenburg',
    condition: (city) => city.state === 'Brandenburg',
    variants: [
      'Brandenburgs Kfz-Zulassungswesen ist auf Kreisebene organisiert. Für {{city}} ist {{region}} zuständig. Digitale Abmeldungen bieten Fahrzeughaltern im Flächenland Brandenburg eine zeitsparende Alternative zu langen Anfahrten.',
    ],
  },
  'Mecklenburg-Vorpommern': {
    id: 'state_guide_mv',
    condition: (city) => city.state === 'Mecklenburg-Vorpommern',
    variants: [
      'In Mecklenburg-Vorpommern übernehmen die Landkreise und kreisfreien Städte die Kfz-Zulassung. Für {{city}} ist {{region}} zuständig. Im dünn besiedelten MV ist der digitale Abmeldeweg besonders praktisch, weil Fahrzeuge dann ohne lange Anfahrt abgemeldet werden können.',
    ],
  },
  'Sachsen-Anhalt': {
    id: 'state_guide_st',
    condition: (city) => city.state === 'Sachsen-Anhalt',
    variants: [
      'In Sachsen-Anhalt liegt die Kfz-Zulassung in der Verantwortung der Landkreise und kreisfreien Städte. Für {{city}} ist {{region}} die zuständige Stelle. Digitale Services ergänzen das klassische Angebot für Fahrzeughalter in Sachsen-Anhalt.',
    ],
  },
  'Saarland': {
    id: 'state_guide_saarland',
    condition: (city) => city.state === 'Saarland',
    variants: [
      'Im Saarland ist die Kfz-Zulassung auf die Landkreise und den Regionalverband Saarbrücken aufgeteilt. Für {{city}} ist {{region}} zuständig. Neben dem Behördengang bietet der digitale Abmeldeweg eine bequeme Alternative.',
    ],
  },
};

// ── 5. Extended Guide Block ──────────────────────────────────────────────────
// Renders only for urban (large city) areaType.
const EXTENDED_GUIDE_BLOCK: ContentBlock = {
  id: 'extended_guide',
  variants: [
    '{{city}} gehört zu den größeren Städten, in denen die Nachfrage nach Kfz-Abmeldungen besonders hoch ist. Lange Wartezeiten an der Zulassungsstelle sind dort keine Seltenheit. Genau deshalb ist die digitale Abmeldung für viele Fahrzeughalter in {{city}} besonders attraktiv.',
    'In Großstädten wie {{city}} ist der persönliche Behördengang wegen hohem Aufkommen oft zeitaufwendig. Viele Fahrzeughalter wählen deshalb den Online-Weg als bequemere Alternative zur Abmeldung vor Ort.',
    'Als größere Stadt verfügt {{city}} über ein hohes Aufkommen an Kfz-Anmeldungen und -abmeldungen. Für Fahrzeughalter bedeutet das oft längere Wartezeiten beim direkten Amtsgang. Der digitale Abmeldeweg bietet hier eine zeitsparende Lösung.',
    'In {{city}} ist die Zulassungsstelle aufgrund der Einwohnerzahl stark frequentiert. Viele Fahrzeughalter meiden den direkten Gang zur Behörde deshalb bewusst und bevorzugen den digitalen Weg ohne Wartezeit.',
  ],
};

// ── 6. Dynamic FAQ Items ─────────────────────────────────────────────────────
// Structured as grouped variants — deterministic per city seed.
type FaqVariantGroup = {
  condition?: (city: CityPageData) => boolean;
  variants: Array<{ q: string; a: string }>;
};

const DYNAMIC_FAQ_GROUPS: FaqVariantGroup[] = [
  {
    condition: (city) => !!city.behoerde,
    variants: [
      {
        q: 'Welche Behörde ist für die Kfz-Abmeldung in {{city}} zuständig?',
        a: 'Für die Kfz-Abmeldung in {{city}} ist {{behoerde_name}} zuständig. Die Behörde befindet sich in {{behoerde_adresse}}, {{behoerde_plz}} {{behoerde_ort}}. Unser Online-Service ermöglicht in vielen Fällen eine Abmeldung ohne persönlichen Behördenbesuch.',
      },
      {
        q: 'Wo befindet sich die Zulassungsstelle in {{city}}?',
        a: '{{behoerde_name}} ist die zuständige Kfz-Zulassungsstelle für {{city}}. Sie befindet sich unter der Adresse {{behoerde_adresse}}, {{behoerde_plz}} {{behoerde_ort}}. Mit unserem digitalen Service ist ein Besuch in vielen Fällen nicht notwendig.',
      },
      {
        q: 'Muss ich für die Abmeldung in {{city}} persönlich erscheinen?',
        a: 'Bei Nutzung unseres Online-Services ist ein persönlicher Gang zu {{behoerde_name}} in {{city}} in vielen Fällen nicht notwendig. Die Abmeldung kann bequem digital vorbereitet werden.',
      },
    ],
  },
  {
    condition: (city) => !!(city.behoerde?.telefon),
    variants: [
      {
        q: 'Wie erreiche ich die Zulassungsstelle in {{city}} telefonisch?',
        a: '{{behoerde_name}} ist in {{city}} unter {{behoerde_telefon}} telefonisch erreichbar. Für die Online-Abmeldung ist dieser Kontakt in der Regel nicht erforderlich.',
      },
    ],
  },
  {
    condition: (city) => (city.nearby?.length ?? 0) >= 2,
    variants: [
      {
        q: 'Kann ich mein Fahrzeug auch in einer Nachbarstadt abmelden?',
        a: 'Klassisch können Fahrzeughalter aus der Region auch die Zulassungsstellen in {{nearby1}} oder {{nearby2}} aufsuchen. Mit unserem Online-Service ist die Abmeldung standortunabhängig möglich.',
      },
      {
        q: 'Gibt es Alternativen zur Zulassungsstelle in {{city}}?',
        a: 'In der Region stehen zum Beispiel die Stellen in {{nearby1}} und {{nearby2}} als Alternativen zur Verfügung. Noch einfacher ist die digitale Abmeldung über unseren Online-Service.',
      },
    ],
  },
  {
    condition: (city) => !!city.state,
    variants: [
      {
        q: 'Wie ist die Kfz-Abmeldung in {{state}} geregelt?',
        a: 'In {{state}} sind die Kreise und kreisfreien Städte für das Kfz-Zulassungswesen verantwortlich. Für {{city}} ist {{region}} die zuständige Stelle. Unser Service bietet eine digitale Alternative zur klassischen Abmeldung vor Ort.',
      },
    ],
  },
];

// ── 7. Intent — Informational ────────────────────────────────────────────────
// Paragraph targeting "how does X work in {{city}}" queries.
// Structurally different per variant to avoid pattern repetition.
const INTENT_INFORMATIONAL_BLOCK: ContentBlock = {
  id: 'intent_informational',
  variants: [
    // Variant A: question → answer → advantage (3-sentence paragraph)
    'Wie funktioniert die Kfz-Abmeldung in {{city}} genau? Fahrzeughalter, die klassisch vorgehen, wenden sich an {{behoerde_name}} — die zuständige Stelle für {{city}} in {{state}}. Wer den Ablauf lieber digital starten möchte, kann unseren Online-Service nutzen: Daten eingeben, Formular absenden, Bestätigung erhalten.',
    // Variant B: context → process → digital alternative
    'In {{city}} läuft die Fahrzeugabmeldung wie in allen deutschen Städten über die zuständige Kfz-Zulassungsstelle. Klassisch bedeutet das: Termin bei {{region}}, Unterlagen mitbringen, persönlich erscheinen. Unser digitaler Abmeldeservice macht den Gang dorthin in vielen Fällen überflüssig.',
    // Variant C: state context → office → digital offer
    '{{state}} regelt die Kfz-Zulassung auf Kreisebene — in {{city}} ist das {{region}}. Um ein Fahrzeug abzumelden, sind neben dem Fahrzeugschein auch Kennzeichen und Sicherheitscode erforderlich. Mit unserem Online-Service lässt sich dieser Prozess bequem von zuhause starten.',
    // Variant D: step-by-step framing
    'Wer in {{city}} ein Fahrzeug abmelden möchte, hat zwei Wege: erstens der persönliche Besuch bei {{behoerde_name}}, zweitens die digitale Abmeldung über unseren Online-Service. Für beide Wege werden Fahrzeugschein, Kennzeichen und der Sicherheitscode der Zulassungsbescheinigung Teil I benötigt. Viele wählen den zweiten Weg, weil er ohne Wartezeit und ohne Anfahrt auskommt.',
    // Variant E: "Wer fragt" opening (different structure)
    'Wer nach der Kfz-Abmeldung in {{city}} sucht, fragt oft auch: Muss ich zur {{behoerde_name}} gehen? Die Antwort hängt vom Weg ab. Klassisch: ja. Digital über unseren Service: in vielen Fällen nein — der Ablauf läuft online, Bestätigung kommt per E-Mail.',
    // Variant F: Micro-details — office hours + processing time
    'In {{city}} ist {{behoerde_name}} die zuständige Kfz-Stelle, werktags in der Regel zwischen 8:00 und 16:00 Uhr erreichbar. Wer keinen Termin vereinbaren möchte oder außerhalb dieser Zeiten plant, kann den digitalen Abmeldeweg nutzen — jederzeit und ohne Öffnungszeiten.',
    // Variant G: Processing time comparison (micro-detail)
    'Kfz-Abmeldungen über {{behoerde_name}} dauern vor Ort inklusive Anfahrt und Wartezeit häufig 30 bis 90 Minuten. Die digitale Alternative lässt sich dagegen oft in wenigen Minuten vorbereiten — die Bearbeitung läuft anschließend ohne weiteren persönlichen Aufwand.',
    // Variant H: Entity expansion — administrative level
    'Als Teil des Verwaltungsgebiets {{region}} gehört {{city}} zu den Orten, für die {{behoerde_name}} die Kfz-Zulassung übernimmt. Innerhalb dieser Verwaltungsstruktur gilt: Fahrzeugabmeldungen können klassisch vor Ort oder digital über zugelassene Online-Services eingeleitet werden.',
    // Variant I: Q&A structure (different sentence pattern entirely)
    'Welche Stelle ist in {{city}} für Kfz-Abmeldungen zuständig? Offizielle Anlaufstelle ist {{behoerde_name}} im Verwaltungsbereich {{region}}, {{state}}. Wie lange dauert es? Vor Ort rechnen viele mit 30 bis 60 Minuten. Digital: deutlich kürzer, ohne Terminbindung.',
  ],
};

// ── 8. Intent — Transactional ────────────────────────────────────────────────
// Action-oriented paragraph for users ready to act now.
// Uses varying sentence structures to avoid template feel.
const INTENT_TRANSACTIONAL_BLOCK: ContentBlock = {
  id: 'intent_transactional',
  variants: [
    // Variant A: direct CTA with state context
    'Jetzt in {{city}} digital abmelden: Fahrzeugschein bereitstellen, Daten eingeben, absenden — fertig. Kein Termin bei {{region}}, keine Anfahrt, keine Wartezeit. Der gesamte Ablauf ist auf Schnelligkeit und Klarheit ausgelegt.',
    // Variant B: "viele wählen" social proof → action
    'Viele Fahrzeughalter in {{city}} starten die Abmeldung direkt online, weil kein Termin bei {{behoerde_name}} nötig ist. Das Formular ist innerhalb von Minuten ausgefüllt. Einmal abgesendet, läuft die Bearbeitung digital weiter.',
    // Variant C: conditions → clear CTA
    'Wer in {{city}} bereit ist, benötigt: Fahrzeugschein Teil I, Kennzeichen, Sicherheitscode. Alles vorhanden? Dann kann die Online-Abmeldung jetzt gestartet werden — ohne Gang zur {{region}} und ohne Wartezeit.',
    // Variant D: contrast old vs. new
    'Früher: Termin ausmachen, zur {{behoerde_name}} fahren, warten. Heute: Formular online öffnen, Daten eingeben, Bestätigung erhalten. In {{city}} entscheiden sich immer mehr Fahrzeughalter für den zweiten Weg.',
    // Variant E: urgency + simplicity
    'Fahrzeug in {{city}} abmelden geht schneller als viele denken. Unser Online-Service führt Schritt für Schritt durch den Ablauf — ohne Behördengang, ohne Termin, direkt für Fahrzeuge mit {{state}}er Kennzeichen.',
  ],
};

// ── 9. Intent — Alternative ──────────────────────────────────────────────────
// For users who can't get an appointment or want a second option.
// Highlights nearby + digital path.
const INTENT_ALTERNATIVE_BLOCK: ContentBlock = {
  id: 'intent_alternative',
  condition: (city) => (city.nearby?.length ?? 0) >= 1,
  variants: [
    // Variant A: appointment problem → nearby → online
    'Kein freier Termin bei der Zulassungsstelle in {{city}} bekommen? In der Region gibt es Alternativen — zum Beispiel in {{nearby1}} oder {{nearby2}}. Noch einfacher: die Abmeldung digital über unseren Online-Service starten, ganz ohne Terminsuche.',
    // Variant B: nearby context → digital wins
    'Neben {{city}} sind auch die Stellen in {{nearby1}} und {{nearby2}} für Fahrzeughalter aus der Region zuständig. Wer jedoch komplett auf Fahrten verzichten möchte, wählt die digitale Abmeldung — standortunabhängig und ohne Wartezeit.',
    // Variant C: "alternative" framing with state context
    'In {{state}} gibt es mehrere Wege zur Kfz-Abmeldung. Neben {{region}} in {{city}} stehen in der Umgebung auch Stellen in {{nearby1}} zur Verfügung. Die dritte Option — und oft die einfachste — ist die Online-Abmeldung über unseren Service.',
    // Variant D: direct list of options (different structure)
    'Wer in {{city}} keine passende Alternative findet, hat weitere Möglichkeiten: {{nearby1}}, {{nearby2}} — oder die digitale Abmeldung, bei der der Standort gar keine Rolle spielt.',
  ],
};

// ── 10. Intent — Problem-Solving ─────────────────────────────────────────────
// Handles edge cases: isolated cities, very rural, no nearby, etc.
// Condition-aware per city type.
const INTENT_PROBLEM_SOLVING_BLOCK: ContentBlock = {
  id: 'intent_problem_solving',
  variants: [
    // Variant A: rural angle (long distance to office)
    'Für Fahrzeughalter in {{city}} kann der Weg zur zuständigen Zulassungsstelle {{behoerde_name}} mit einem längeren Fahrweg verbunden sein. Genau für diese Fälle wurde der digitale Abmeldeweg entwickelt: Unterlagen bereitstellen, Formular online ausfüllen, Bestätigung erhalten — ohne Anfahrt.',
    // Variant B: "was tun wenn" opening
    'Was tun, wenn kein Termin verfügbar ist oder der Behördenweg in {{city}} nicht klappt? Unser Online-Service arbeitet unabhängig von Öffnungszeiten und Terminverfügbarkeit bei {{region}}. Die Abmeldung läuft vollständig digital ab.',
    // Variant C: general flexibility problem → digital solution
    'Nicht immer passt der Termin bei der Kfz-Zulassungsstelle in den Alltag. In {{city}} wie in vielen anderen Städten in {{state}} lösen immer mehr Fahrzeughalter dieses Problem mit dem digitalen Abmeldeweg. Kein fester Termin, kein Warten, kein Umweg.',
    // Variant D: FAQ-style (different sentence structure)
    'Häufige Frage in {{city}}: Was brauche ich zur Abmeldung und wie lange dauert es? Benötigt werden Fahrzeugschein, Kennzeichen und Sicherheitscode. Digital über unseren Service ist der Prozess in der Regel schneller abgeschlossen als bei einem klassischen Termin bei {{behoerde_name}}.',
    // Variant E: isolated city / no alternative framing
    'Wenn die nächste Zulassungsstelle von {{city}} aus weit entfernt liegt, ist der digitale Weg besonders sinnvoll. Unser Service ist standortunabhängig — ob in einer Großstadt oder in einer kleineren Gemeinde in {{state}}, der Ablauf ist derselbe.',
  ],
};

// ── 11. Dynamic City Scenario Block ──────────────────────────────────────────
// Reacts to REAL city characteristics:
// - nearby count (isolated vs. dense)// - state (specific notes)
// - no behoerde match (gap in CSV)
// Each scenario produces a structurally different paragraph → max diversity.
function buildScenarioBlock(city: CityPageData, seed: number): string {
  const nearbyCount = city.nearby?.length ?? 0;

  // Scenario G: Bundeshauptstadt / Stadtstaat (Berlin, Hamburg, Bremen)
  // These are city-states — unique administrative structure, highest demand
  if (
    city.state === 'Berlin' ||
    city.state === 'Hamburg' ||
    city.state === 'Bremen'
  ) {
    const variants = [
      '{{city}} ist ein Bundesland und Großstadt zugleich — das macht die Verwaltungsstruktur besonders kompakt. Zuständig für Kfz-Abmeldungen ist {{behoerde_name}}, die zentrale Stelle für alle Fahrzeughalter in {{city}}. Aufgrund des hohen Aufkommens ist der digitale Weg hier besonders empfehlenswert.',
      'Als Stadtstaat vereint {{city}} Stadt und Bundesland in einer Verwaltungseinheit. {{behoerde_name}} ist die offizielle Anlaufstelle für Kfz-Abmeldungen in {{city}}. Viele Fahrzeughalter umgehen die oft langen Wartezeiten, indem sie den Online-Service nutzen.',
      'In {{city}} ist {{behoerde_name}} für alle Kfz-Zulassungsangelegenheiten zuständig. Die hohe Bevölkerungsdichte sorgt für entsprechend hohe Nachfrage — Termine sind häufig ausgebucht. Der digitale Abmeldeweg bietet hier eine klare, terminfreie Alternative.',
    ];
    return replaceTokens(deterministicSelect(variants, seed, 208), city);
  }

  // Scenario A: urban + many nearby → high-density advice

  // Scenario B: rural + no nearby → isolated city advice

  // Scenario C: rural + some nearby → regional advice

  // Scenario H: Landkreis / regional authority seat
  // Correctly frames city as Kreisstadt serving surrounding area — no Großstadt framing

  // Scenario D: Bayern / BW / NRW — state-personality note
  if (city.state === 'Bayern') {
    const variants = [
      'Bayern ist das flächenmäßig größte Bundesland — viele Fahrzeughalter in {{city}} legen für eine Kfz-Abmeldung bei {{behoerde_name}} deutliche Wege zurück. Genau deshalb ist der digitale Abmeldeweg hier besonders praktisch.',
      'In Bayern organisieren die Landkreise ihre Zulassungsstellen eigenständig. Für {{city}} bedeutet das: der zuständige Ansprechpartner ist {{region}}. Unser Service arbeitet bundesweit — auch für bayerische Kennzeichen.',
    ];
    return replaceTokens(deterministicSelect(variants, seed, 203), city);
  }

  if (city.state === 'Nordrhein-Westfalen') {
    const variants = [
      'NRW ist mit über 18 Millionen Einwohnern das bevölkerungsreichste Bundesland. In {{city}} bedeutet das: hohe Nachfrage bei {{behoerde_name}}, oft lange Wartezeiten. Viele Fahrzeughalter weichen deshalb auf den digitalen Weg aus.',
      'In der Metropolregion {{city}} in NRW sind Kfz-Zulassungsstellen oft stark ausgelastet. Neben {{region}} steht unser Online-Service als sofort verfügbare Alternative bereit.',
    ];
    return replaceTokens(deterministicSelect(variants, seed, 204), city);
  }

  // Scenario E: no behoerde data in CSV → honest framing
  if (!city.behoerde) {
    const variants = [
      'Für {{city}} konnte im KBA-Register aktuell keine direkte Zulassungsstellenzuordnung ermittelt werden. Zuständig ist in der Regel {{region}} in {{state}}. Unser Online-Service arbeitet unabhängig von dieser Zuordnung bundesweit.',
      'In {{city}} verwaltet {{region}} die Kfz-Zulassung. Da für diese Stadt keine direkten Behördendaten vorliegen, empfehlen wir, den digitalen Weg zu nutzen oder direkt bei {{region}} nachzufragen.',
    ];
    return replaceTokens(deterministicSelect(variants, seed, 205), city);
  }

  // Scenario F: default suburban / regional_center — standard but unique
  const variants = [
    '{{city}} ist ein regionaler Mittelpunkt in {{state}} mit {{behoerde_name}} als zuständiger Kfz-Stelle. Die Umgebung umfasst Orte wie {{nearby1}} und {{nearby2}}, die teils dieselbe Behörde nutzen. Unser Service deckt die gesamte Region digital ab.',
    'Fahrzeughalter aus {{city}} und der näheren Umgebung wenden sich klassisch an {{region}}. Mit unserem Online-Service ist die Abmeldung standortunabhängig möglich — auch von {{nearby1}} oder {{nearby2}} aus.',
    'Als Mittelzentrum in {{state}} zieht {{city}} auch Nutzer aus umliegenden Gemeinden an. Die Zulassungsstelle {{behoerde_name}} ist der gemeinsame Anlaufpunkt. Alternativ bietet unser digitaler Service für alle Orte der Region dieselbe einfache Lösung.',
  ];
  return replaceTokens(deterministicSelect(variants, seed, 206), city);
}

// ─── MAIN BUILD FUNCTION ──────────────────────────────────────────────────────

/**
 * Build all dynamic content for a city page, deterministically.
 *
 * @param city   Fully populated CityPageData (including behoerde when available)
 * @param seed   Integer derived from slug+city hash — stays stable across requests
 * @returns      DynamicContent with ready-to-render strings
 */
export function buildDynamicContent(city: CityPageData, seed: number): DynamicContent {
  function pickBlock(block: ContentBlock, offset: number): string {
    if (block.condition && !block.condition(city)) return '';
    const variant = deterministicSelect(block.variants, seed, offset);
    return replaceTokens(variant, city);
  }

  // 1. Behörde detail (CSV data injection)
  const behoerdeBlock = pickBlock(BEHOERDE_DETAIL_BLOCK, 100);

  // 2. Behörde contact (phone number)
  const behoerdeContactBlock = pickBlock(BEHOERDE_CONTACT_BLOCK, 101);

  // 3. Nearby context paragraph
  const nearbyContextParagraph = pickBlock(NEARBY_CONTEXT_BLOCK, 102);

  // 4. State-specific guide — find matching Bundesland block
  const stateGuide = (() => {
    if (!city.state) return '';
    const block = STATE_GUIDE_BLOCKS[city.state];
    if (!block) return '';
    return pickBlock(block, 103);
  })();

  // 5. Extended guide (urban only)
  const extendedGuide = pickBlock(EXTENDED_GUIDE_BLOCK, 104);

  // 6. Dynamic FAQ items from real office data
  const dynamicFaqItems: FaqItem[] = DYNAMIC_FAQ_GROUPS
    .filter((group) => !group.condition || group.condition(city))
    .map((group, i) => {
      const variant = deterministicSelect(group.variants, seed, 110 + i);
      return {
        q: replaceTokens(variant.q, city),
        a: replaceTokens(variant.a, city),
      };
    });

  // 7–10. Intent-based blocks
  const intentInformational = pickBlock(INTENT_INFORMATIONAL_BLOCK, 300);
  const intentTransactional = pickBlock(INTENT_TRANSACTIONAL_BLOCK, 301);
  const intentAlternative   = pickBlock(INTENT_ALTERNATIVE_BLOCK, 302);
  const intentProblemSolving = pickBlock(INTENT_PROBLEM_SOLVING_BLOCK, 303);

  // 11. Dynamic city scenario block
  const scenarioBlock = buildScenarioBlock(city, seed);

  // 12. Content Depth Variation + Content Mixing  //     rural cities show fewer (more focused content, shorter page depth).
  //     Within each depth level, which blocks appear is seed-driven per city.
  const mixSeed = Math.abs(seed) % 4;
  const hasNearby = (city.nearby?.length ?? 0) >= 1;
  const areaType = city.areaType ?? 'suburban';
  const sectionMix: DynamicContent['sectionMix'] = areaType === 'urban'
    // Urban: full depth — all 4 optional blocks always shown
    ? {
        showIntentInfo: true,
        showIntentTransact: true,
        showIntentAlt: true,
        showScenario: true,
      }
    : areaType === 'rural'
    // Rural: reduced depth — 2 most relevant blocks only
    // Scenario always shown (explains distance/isolation context)
    // Alternative shown only if nearby cities exist
    ? {
        showIntentInfo: mixSeed % 2 === 0,      // half of rural cities
        showIntentTransact: false,               // skip transact for rural (less urgency framing)
        showIntentAlt: hasNearby,                // only if there are actually nearby options
        showScenario: true,                      // always — most distinctive block for rural
      }
    // Suburban / regional_center: depth=3, one block excluded per seed
    : {
        showIntentInfo:     mixSeed !== 0,
        showIntentTransact: mixSeed !== 1,
        showIntentAlt:      mixSeed !== 2,
        showScenario:       mixSeed !== 3,
      };

  return {
    behoerdeBlock,
    behoerdeContactBlock,
    nearbyContextParagraph,
    stateGuide,
    extendedGuide,
    dynamicFaqItems,
    intentInformational,
    intentTransactional,
    intentAlternative,
    intentProblemSolving,
    scenarioBlock,
    sectionMix,
  };
}
