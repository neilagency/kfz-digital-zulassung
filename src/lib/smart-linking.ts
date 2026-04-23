import { getCityNameBySlug } from './city-slugs';

/**
 * Enhanced internal linking system for better topical clustering and authority distribution
 */

// Strategic anchor text variations for different contexts
const ANCHOR_TEXT_VARIATIONS = {
  anmelden: [
    'Auto anmelden',
    'Fahrzeugzulassung',
    'KFZ-Anmeldung',
    'Neuzulassung',
    'Fahrzeug zulassen',
  ],
  abmelden: [
    'Auto abmelden', 
    'Fahrzeug stilllegen',
    'KFZ-Abmeldung',
    'Abmeldeprozess',
    'digitale Abmeldung',
  ],
  zulassungsstelle: [
    'Zulassungsstelle',
    'KFZ-Zulassungsbehörde',
    'örtliche Behörde',
    'Zulassungsamt',
    'Straßenverkehrsamt',
  ],
  kfzZulassung: [
    'KFZ-Zulassung',
    'Fahrzeugzulassung',
    'Zulassungsverfahren',
    'Zulassungssystem',
    'Fahrzeugregistrierung',
  ],
  unterlagen: [
    'erforderliche Unterlagen',
    'benötigte Dokumente',
    'Abmeldeunterlagen',
    'notwendige Papiere',
    'Zulassungspapiere',
  ],
  kosten: [
    'Abmeldekosten',
    'Gebühren',
    'Kosten der Abmeldung',
    'Preise für die Abmeldung',
    'Abmeldegebühren',
  ],
};

// Context-aware link suggestions based on content type
const CONTEXTUAL_LINKS = {
  // When discussing administrative processes
  administrative: [
    { pattern: /zulassungsstelle|behörde|amt/gi, links: ['/zulassungsstelle', '/kfz-zulassung'] },
    { pattern: /anmeld/gi, links: ['/anmelden', '/kfz-zulassung'] },
    { pattern: /abmeld/gi, links: ['/auto-abmelden', '/auto-online-abmelden'] },
  ],
  
  // When discussing digital services
  digital: [
    { pattern: /online|digital|internet/gi, links: ['/auto-online-abmelden', '/auto-online-abmelden-kosten'] },
    { pattern: /unterlagen|dokument|papier/gi, links: ['/auto-online-abmelden-unterlagen'] },
  ],
  
  // When discussing local aspects
  local: [
    { pattern: /stadt|region|ort|gemeinde/gi, links: ['/kfz-zulassung-abmeldung-in-deiner-stadt'] },
    { pattern: /bundesland|land/gi, links: ['/zulassungsstelle'] },
  ],
};

// Hub pages that should be linked strategically
const AUTHORITY_HUBS = [
  { url: '/auto-abmelden', topics: ['abmeldung', 'stilllegung', 'außerbetriebsetzung'] },
  { url: '/kfz-zulassung', topics: ['zulassung', 'anmeldung', 'ummeldung', 'fahrzeugzulassung'] },
  { url: '/zulassungsstelle', topics: ['behörde', 'zulassungsstelle', 'amt', 'verwaltung'] },
];

export function enhanceTextWithStrategicLinks(
  text: string, 
  context: 'city' | 'authority' | 'general' = 'general',
  citySlug?: string
): string {
  let enhancedText = text;
  const usedPositions = new Set<number>();
  
  // Add authority hub links
  AUTHORITY_HUBS.forEach((hub) => {
    hub.topics.forEach((topic) => {
      const regex = new RegExp(`\\b${topic}\\b`, 'gi');
      const matches = [...enhancedText.matchAll(regex)];
      
      // Link first occurrence if not already used
      matches.forEach((match) => {
        const position = match.index;
        if (position !== undefined && !usedPositions.has(position)) {
          const anchorTexts = getAnchorTextForUrl(hub.url);
          if (anchorTexts.length > 0) {
            const anchorText = anchorTexts[0]; // Use first variation
            enhancedText = enhancedText.replace(match[0], `[[${anchorText}|${hub.url}]]`);
            usedPositions.add(position);
          }
        }
      });
    });
  });
  
  // Add contextual links based on content patterns
  const patterns = context === 'city' 
    ? [...CONTEXTUAL_LINKS.administrative, ...CONTEXTUAL_LINKS.digital, ...CONTEXTUAL_LINKS.local]
    : CONTEXTUAL_LINKS.administrative;
    
  patterns.forEach(({ pattern, links }) => {
    const matches = [...enhancedText.matchAll(pattern)];
    matches.slice(0, 1).forEach((match) => { // Limit to first match per pattern
      const position = match.index;
      if (position !== undefined && !usedPositions.has(position) && links.length > 0) {
        const targetUrl = links[0];
        const anchorText = match[0];
        enhancedText = enhancedText.replace(match[0], `[[${anchorText}|${targetUrl}]]`);
        usedPositions.add(position);
      }
    });
  });
  
  return enhancedText;
}

export function getAnchorTextForUrl(url: string): string[] {
  if (url.includes('/anmelden')) return ANCHOR_TEXT_VARIATIONS.anmelden;
  if (url.includes('/auto-abmelden')) return ANCHOR_TEXT_VARIATIONS.abmelden;
  if (url.includes('/zulassungsstelle')) return ANCHOR_TEXT_VARIATIONS.zulassungsstelle;
  if (url.includes('/kfz-zulassung')) return ANCHOR_TEXT_VARIATIONS.kfzZulassung;
  if (url.includes('/unterlagen')) return ANCHOR_TEXT_VARIATIONS.unterlagen;
  if (url.includes('/kosten')) return ANCHOR_TEXT_VARIATIONS.kosten;
  return [];
}

export function generateCrossCityLinks(currentCitySlug: string, nearbyCity: string): Array<{name: string, slug: string, anchor: string}> {
  const cityName = getCityNameBySlug(currentCitySlug) || currentCitySlug;
  const variations = [
    `KFZ abmelden in ${nearbyCity}`,
    `Zulassungsstelle ${nearbyCity}`,
    `Auto online abmelden ${nearbyCity}`,
    `Fahrzeugabmeldung ${nearbyCity}`,
  ];
  
  return [{
    name: nearbyCity,
    slug: currentCitySlug, // This would be replaced with actual nearby city slug
    anchor: variations[Math.floor(Math.random() * variations.length)],
  }];
}

export function buildAuthorityDistributionLinks(contentType: 'intro' | 'process' | 'faq'): string[] {
  const linksByType = {
    intro: [
      'Erfahren Sie mehr über das [[deutsche KFZ-Zulassungssystem|/kfz-zulassung]]',
      'Alle [[Zulassungsstellen bundesweit|/zulassungsstelle]] arbeiten nach einheitlichen Standards',
      'Die [[digitale Abmeldung|/auto-online-abmelden]] ist rund um die Uhr verfügbar',
    ],
    process: [
      'Der [[Abmeldeprozess|/auto-abmelden]] ist bundesweit standardisiert',
      'Alternative: [[Online-Abmeldung ohne Terminbindung|/auto-online-abmelden]]',
      'Benötigte [[Unterlagen für die Abmeldung|/auto-online-abmelden-unterlagen]]',
    ],
    faq: [
      'Detaillierte Informationen zur [[Fahrzeugzulassung in Deutschland|/kfz-zulassung]]',
      'Übersicht aller [[deutschen Zulassungsstellen|/zulassungsstelle]]',
      'Kosten und Gebühren für die [[Online-Abmeldung|/auto-online-abmelden-kosten]]',
    ],
  };
  
  return linksByType[contentType] || [];
}