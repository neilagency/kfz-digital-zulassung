import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  FileCheck,
  Headphones,
  HelpCircle,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Star,
  BadgeEuro,
  MailCheck,
  type LucideIcon,
} from 'lucide-react';
import {
  buildCityPageModel,
  buildFaqSchema,
  compareTable,
  type CityPageModelInput,
} from '@/lib/cityPageContent';
import { getLokaleBehoerde } from '@/lib/behoerde';
import { getCityMeta } from '@/lib/city-metadata';
import { type SectionKey } from '@/lib/cityPageContent';
import { type LocalPage } from '@/lib/db';
import { getCityNameBySlug } from '@/lib/city-slugs';
import AuthorityHubsSection from '@/components/AuthorityHubsSection';
import { CITY_AUTHORITY_HUBS_ENABLED } from '@/lib/city-feature-flags';

type SiteSettings = {
  siteName: string;
  siteUrl: string;
  phone: string;
  phoneLink: string;
  whatsapp: string;
  email: string;
  siteDescription: string;
};

type Pricing = {
  abmeldungPriceFormatted: string;
  anmeldungPriceFormatted: string;
};

type FeatureCard = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: Shield,
    title: 'Offiziell & rechtssicher',
    desc: 'Amtlich über unsere GKS-Anbindung verarbeitet. Bundesweit nutzbar.',
  },
  {
    icon: Headphones,
    title: 'Persönlicher Support',
    desc: 'Support per Telefon und WhatsApp, wenn Unterlagen oder Ablauf lokal Fragen aufwerfen.',
  },
  {
    icon: Clock,
    title: '24/7 vorbereitbar',
    desc: 'Digitale Abmeldung ohne Bindung an Öffnungszeiten der lokalen Behörde.',
  },
  {
    icon: MailCheck,
    title: 'Bestätigung per E-Mail',
    desc: 'Klare digitale Rückmeldung, sobald der Vorgang abgeschlossen ist.',
  },
];

const PRICE_FEATURES = [
  'Offizielle Bestätigung per E-Mail',
  'Steuer & Versicherung werden informiert',
  'Kein Ausweis / AusweisApp nötig',
  'Digitale Abwicklung',
] as const;
  const CITY_GUIDE_LINKS = [
  {
    href: "/insiderwissen/kfz-abmeldung-fehler-sicherheitscode",
    title: "Kfz-Abmeldung Fehler Sicherheitscode",
    text: "Wenn der Sicherheitscode nicht klappt oder eine Fehlermeldung erscheint, hilft diese Anleitung oft sofort weiter.",
  },
  {
    href: "/insiderwissen/auto-abmelden-ohne-tuev-anleitung",
    title: "Auto abmelden ohne TÜV",
    text: "Hier sehen Nutzer schnell, ob und wie die Abmeldung auch ohne gültigen TÜV möglich ist.",
  },
  {
    href: "/insiderwissen/kfz-online-abmeldung-funktioniert-nicht",
    title: "Kfz online abmelden funktioniert nicht",
    text: "Hilfreich bei technischen Problemen, Fehlermeldungen oder wenn die Online-Abmeldung nicht richtig startet.",
  },
  {
    href: "/insiderwissen/ikfz-funktioniert-nicht",
    title: "iKFZ funktioniert nicht",
    text: "Dieser Ratgeber hilft weiter, wenn iKFZ Probleme macht oder der digitale Ablauf unerwartet abbricht.",
  },
  {
    href: "/kosten-autoabmeldung-online/",
    title: "Kosten Autoabmeldung online",
    text: "Wer vor dem Start die Kosten wissen möchte, findet hier eine einfache und klare Übersicht.",
  },
  {
    href: "/wo-ist-der-7-stellige-sicherheitscode-im-fahrzeugschein/",
    title: "Wo ist der 7-stellige Sicherheitscode im Fahrzeugschein",
    text: "Besonders hilfreich, wenn Nutzer nicht wissen, wo der benötigte Code auf den Unterlagen zu finden ist.",
  },
];
function normalizeCompareText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupeStrings(values: string[] | undefined): string[] {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    const normalized = normalizeCompareText(trimmed);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(trimmed);
  }

  return result;
}

function dedupeFaq(
  items: Array<{ q: string; a: string }> | undefined,
): Array<{ q: string; a: string }> {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const result: Array<{ q: string; a: string }> = [];

  for (const item of items) {
    if (!item?.q?.trim() || !item?.a?.trim()) continue;
    const key = normalizeCompareText(item.q);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push({ q: item.q.trim(), a: item.a.trim() });
  }

  return result;
}

function dedupeTextObjects<T extends { slug: string; name: string }>(items: T[] | undefined): T[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    if (!item?.slug || !item?.name) continue;
    const key = `${item.slug}::${normalizeCompareText(item.name)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

function excludeExisting(values: string[], existing: string[]): string[] {
  const blocked = new Set(existing.map((item) => normalizeCompareText(item)).filter(Boolean));
  return values.filter((item) => !blocked.has(normalizeCompareText(item)));
}

function renderInlineLinkedText(text: string) {
  const tokens = [...text.matchAll(/\[\[([^|\]]+)\|([^\]]+)\]\]/g)];
  if (tokens.length === 0) return text;

  const parts: Array<string | JSX.Element> = [];
  let lastIndex = 0;

  tokens.forEach((match, index) => {
    const fullMatch = match[0];
    const anchorText = match[1];
    const href = match[2];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <Link key={`${href}-${index}`} href={href} className="font-semibold text-primary hover:underline">
        {anchorText}
      </Link>,
    );

    lastIndex = start + fullMatch.length;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function getExtraString(page: LocalPage, key: string): string | undefined {
  const value = (page as unknown as Record<string, unknown>)[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getExtraStringArray(page: LocalPage, key: string): string[] | undefined {
  const value = (page as unknown as Record<string, unknown>)[key];
  if (!Array.isArray(value)) return undefined;

  const cleaned = value.filter((item): item is string => typeof item === 'string' && !!item.trim());
  return cleaned.length ? cleaned : undefined;
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

function formatOfferPrice(price: string): string {
  const cleaned = price.replace(/[^\d,]/g, '').replace(',', '.');
  return cleaned || '0';
}

function withPrice(label: string, price: string): string {
  return label.includes('€') ? label : `${label} – ${price}`;
}

function buildStrongHeroSummary(cityName: string, existing?: string): string {
  const strongLead = `Auto online abmelden in ${cityName} – offiziell, bundesweit und ohne Termin.`;
  if (!existing?.trim()) {
    return `${strongLead} Starten Sie jetzt digital ab 19,70 € und erhalten Sie die Bestätigung per E-Mail.`;
  }

  const normalized = normalizeCompareText(existing);
  if (normalized.includes('19 70') || normalized.includes('19 70 eur') || normalized.includes('ohne termin')) {
    return existing.trim();
  }

  return `${existing.trim()} Offizielle Bestätigung per E-Mail, bundesweit nutzbar und ab 19,70 €.`;
}

function buildStrongHeroDetail(cityName: string, existing?: string): string {
  if (existing?.trim()) {
    return existing.trim();
  }

  return `Viele Kunden aus ${cityName} nutzen den digitalen Weg, um Anfahrt, Termin und Wartezeit zu vermeiden. Unser Service begleitet Sie Schritt für Schritt bis zur offiziellen Bestätigung per E-Mail.`;
}

function buildCityInput(page: LocalPage): {
  cityName: string;
  authority: ReturnType<typeof getLokaleBehoerde>;
  input: CityPageModelInput;
} {
  const slug = page.slug || '';
  const meta = getCityMeta(slug);
  const cityName = getCityNameBySlug(slug) || slug;
  const state = getExtraString(page, 'state') || meta?.state || '';
  const region = getExtraString(page, 'region') || meta?.region || cityName;
  const authority = getLokaleBehoerde(cityName, state);
  const nearbySlugs = getExtraStringArray(page, 'nearby') || meta?.nearby || [];
  const nearbyNames = nearbySlugs
    .map((item) => getCityNameBySlug(item))
    .filter((item): item is string => !!item);

  const input: CityPageModelInput = {
    slug,
    city: cityName,
    region,
    state,
    nearby: nearbyNames,
    nearbySlugs,
    localHint: getExtraString(page, 'localHint'),
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
  };

  return { cityName, authority, input };
}

export default function CityPageView({
  page,
  settings,
  pricing,
}: {
  page: LocalPage;
  settings: SiteSettings;
  pricing: Pricing;
}) {
  const slug = page.slug || '';
  const { cityName, authority, input } = buildCityInput(page);
  const model = buildCityPageModel(input) as any;

  const legacyContent = model.content ?? {};
  model.content ??= {};
  model.content.intro = Array.isArray(model.content.intro)
    ? dedupeStrings(model.content.intro)
    : typeof legacyContent.intro === 'string' && legacyContent.intro.trim().length > 0
      ? [legacyContent.intro.trim()]
      : [];
  model.content.intent = Array.isArray(model.content.intent) ? dedupeStrings(model.content.intent) : [];
  model.content.faq = Array.isArray(model.content.faq) ? dedupeFaq(model.content.faq) : [];
  model.content.nearbyIntro =
    typeof model.content.nearbyIntro === 'string' ? model.content.nearbyIntro : '';

  model.hero ??= {
    badge: 'Offiziell & digital',
    summary: legacyContent.preparation || `Fahrzeug online in ${cityName} abmelden.`,
    detail: legacyContent.trust || 'Ohne Termin und mit offizieller Bestätigung per E-Mail.',
    chips: ['Ohne Termin', 'Bundesweit', 'Ab 19,70 EUR'],
    primaryCtaLabel: legacyContent.ctaButton || 'Jetzt online abmelden',
  };

  model.hero.badge = 'Offiziell & digital';
  model.hero.summary = buildStrongHeroSummary(cityName, model.hero.summary);
  model.hero.detail = buildStrongHeroDetail(cityName, model.hero.detail);
  model.hero.chips = dedupeStrings([
    'Ohne Termin',
    'Bundesweit',
    'Ab 19,70 €',
    'Offizielle Bestätigung',
    ...(Array.isArray(model.hero.chips) ? model.hero.chips : []),
  ]).slice(0, 4);
  model.hero.primaryCtaLabel = 'Jetzt loslegen';

  model.intro ??= {
    heading: 'So funktioniert die Online-Abmeldung',
    paragraphs: model.content.intro,
  };

  model.intentBullets = Array.isArray(model.intentBullets) ? dedupeStrings(model.intentBullets) : [];
  model.localInsights = Array.isArray(model.localInsights) ? model.localInsights : [];
  model.sectionOrder = Array.isArray(model.sectionOrder)
    ? model.sectionOrder
    : Array.isArray(model.content?.sectionOrder)
      ? model.content.sectionOrder
      : [
  'benefits',
  'preparation',
  'trust',
  'documents',
  'expertHelp',
  'process',
  'compare',
  'target',
  'local',
  'note',
  'faq',
  'links',
  'cta',
];
  model.archetype = typeof model.archetype === 'string' ? model.archetype : 'default';
  model.layoutStrategy = typeof model.layoutStrategy === 'string' ? model.layoutStrategy : 'default';
  model.seoGate ??= { indexable: true };
  model.authority ??= {
    narrative: authority
      ? `${authority.name} ist die zuständige Behörde für die Kfz-Abmeldung in ${cityName}.`
      : `Die zuständige Behörde für ${cityName} wird je nach Kennzeichenbezirk ermittelt.`,
    processNote:
      'Unser digitaler Prozess begleitet Sie durch alle Schritte, ohne dass ein Vor-Ort-Termin notwendig ist.',
  };

  model.sections ??= {};
  model.sections.benefits ??= {
    heading: 'Vorteile der Online-Abmeldung',
    intro: '',
    items: Array.isArray(legacyContent.benefits) ? legacyContent.benefits : [],
  };
  model.sections.preparation ??= {
    heading: 'Vorbereitung',
    paragraphs:
      typeof legacyContent.preparation === 'string' && legacyContent.preparation.trim().length > 0
        ? [legacyContent.preparation]
        : [],
  };
  model.sections.trust ??= {
    heading: 'Sicherheit & Datenschutz',
    paragraphs: typeof legacyContent.trust === 'string' && legacyContent.trust.trim().length > 0
      ? [legacyContent.trust]
      : [],
  };
  model.sections.documents ??= {
    heading: 'Erforderliche Unterlagen',
    intro: legacyContent.documentsIntro || '',
    items: Array.isArray(legacyContent.documentsList) ? legacyContent.documentsList : [],
  };
  model.sections.process ??= {
    heading: 'Ablauf der Abmeldung',
    intro: legacyContent.processIntro || '',
    steps: Array.isArray(legacyContent.processList) ? legacyContent.processList : [],
  };
  model.sections.compare ??= {
    heading: 'Online vs. Vor Ort',
    intro: legacyContent.compareIntro || '',
    note: legacyContent.note || '',
    ctaLabel: legacyContent.ctaButton || 'Jetzt online abmelden',
  };
  model.sections.target ??= {
    heading: 'Für wen ist diese Abmeldung?',
    intro: legacyContent.targetIntro || '',
    actionText: '',
    ctaLabel: legacyContent.ctaButton || 'Online starten',
    items: Array.isArray(legacyContent.targetList) ? legacyContent.targetList : [],
  };
  model.sections.local ??= {
    heading: `Zuständige Behörde in ${cityName}`,
    intro: legacyContent.localBlockText || '',
    paragraphs: [],
    alternativeText: '',
  };
  model.sections.note ??= {
    heading: 'Wichtige Hinweise',
    paragraphs: typeof legacyContent.note === 'string' && legacyContent.note.trim().length > 0
      ? [legacyContent.note]
      : [],
  };
  model.sections.faq ??= {
    heading: 'Häufig gestellte Fragen',
    items: Array.isArray(model.content.faq) ? model.content.faq : [],
  };
  model.sections.links ??= {
    heading: 'Weitere Städte',
    intro: '',
    relationshipExplanation: '',
    contextText: '',
    links: Array.isArray(input.nearbySlugs)
      ? input.nearbySlugs.map((item) => ({
          slug: item,
          name: getCityNameBySlug(item) || item.replace(/-/g, ' '),
          source: 'adjacent',
        }))
      : [],
    closingText: '',
    stateHubHref: '',
    stateHubLabel: '',
  };
  model.sections.cta ??= {
    heading: 'Jetzt Fahrzeug online abmelden',
    text: legacyContent.ctaText || '',
    buttonLabel: legacyContent.ctaButton || 'Jetzt online abmelden',
  };
  const datenschutzJoker =
  typeof model.content?.datenschutzJoker === 'string'
    ? model.content.datenschutzJoker
    : '';

  model.sections.benefits.items = dedupeStrings(model.sections.benefits.items);
  model.sections.preparation.paragraphs = dedupeStrings(model.sections.preparation.paragraphs);
  model.sections.trust.paragraphs = dedupeStrings(model.sections.trust.paragraphs);
  model.sections.documents.items = dedupeStrings(model.sections.documents.items);
  model.sections.process.steps = dedupeStrings(model.sections.process.steps);
  model.sections.target.items = dedupeStrings(model.sections.target.items);
  model.sections.note.paragraphs = dedupeStrings(model.sections.note.paragraphs);
  model.sections.faq.items = dedupeFaq(model.sections.faq.items);
  model.sections.links.links = dedupeTextObjects(model.sections.links.links);

  const contentIntro = Array.isArray(model.content?.intro) ? dedupeStrings(model.content.intro) : [];
  const fallbackIntro = Array.isArray(model.intro?.paragraphs)
    ? dedupeStrings(model.intro.paragraphs)
    : [model.hero?.detail].filter((value): value is string => !!value);
  const introParagraphs = contentIntro.length > 0 ? contentIntro : fallbackIntro;

  const contentIntent = Array.isArray(model.content?.intent) ? dedupeStrings(model.content.intent) : [];
  const fallbackIntent = Array.isArray(model.intentBullets) ? dedupeStrings(model.intentBullets) : [];
  const intentLines = contentIntent.length > 0 ? contentIntent : fallbackIntent;

  const contentFaq = Array.isArray(model.content?.faq) ? dedupeFaq(model.content.faq) : [];
  const fallbackFaq = Array.isArray(model.sections?.faq?.items) ? dedupeFaq(model.sections.faq.items) : [];
  const faqItems = contentFaq.length > 0 ? contentFaq : fallbackFaq;

  const contentNearbyIntro =
    typeof model.content?.nearbyIntro === 'string' ? model.content.nearbyIntro : '';
  const nearbyIntro =
    contentNearbyIntro.trim().length > 0 ? contentNearbyIntro : (model.sections?.links?.intro ?? '');

  const prepParagraphs = model.sections.preparation.paragraphs;
  const trustParagraphs = excludeExisting(
    model.sections.trust.paragraphs,
    prepParagraphs,
  );
  const noteParagraphs = excludeExisting(
    model.sections.note.paragraphs,
    [...prepParagraphs, ...trustParagraphs, model.sections.compare.note || ''],
  );
  const localParagraphs = excludeExisting(
    dedupeStrings(model.sections.local.paragraphs),
    [model.sections.local.intro || ''],
  );

  const baseUrl = stripTrailingSlash(settings.siteUrl);

  const heroCtaText = withPrice('Jetzt loslegen', pricing.abmeldungPriceFormatted);
  const compareCtaText = withPrice('Jetzt online abmelden', pricing.abmeldungPriceFormatted);
  const targetCtaText = withPrice('Jetzt online starten', pricing.abmeldungPriceFormatted);
  const closingCtaText = withPrice('Jetzt online abmelden', pricing.abmeldungPriceFormatted);

  const faqSchema = buildFaqSchema(faqItems);
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Fahrzeugabmeldung Online ${cityName}`,
    description: model.metaDescription,
    serviceType: 'KFZ Abmeldung',
    provider: {
      '@type': 'Organization',
      name: settings.siteName,
      url: baseUrl,
    },
    areaServed: [
      { '@type': 'City', name: cityName },
      ...(input.state ? [{ '@type': 'State', name: input.state }] : []),
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceType: 'Online',
      serviceUrl: `${baseUrl}/product/fahrzeugabmeldung`,
      availableLanguage: { '@type': 'Language', name: 'German' },
    },
    offers: {
      '@type': 'Offer',
      price: formatOfferPrice(pricing.abmeldungPriceFormatted),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  };

  const governmentOfficeSchema = authority
    ? {
        '@context': 'https://schema.org',
        '@type': 'GovernmentOffice',
        name: authority.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: authority.adresse,
          postalCode: authority.plz,
          addressLocality: authority.ort || cityName,
          addressCountry: 'DE',
        },
        telephone: authority.telefon || undefined,
        email: authority.email || undefined,
        areaServed: {
          '@type': 'City',
          name: cityName,
        },
      }
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Start',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Städte',
        item: `${baseUrl}/kfz-zulassung-abmeldung-in-deiner-stadt`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Auto online abmelden in ${cityName}`,
        item: `${baseUrl}/${slug}`,
      },
    ],
  };

  const sectionMap: Record<SectionKey, JSX.Element> = {
    benefits: (
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="benefits">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-800 p-8 text-white md:p-10">
          <h2 className="mb-3 text-2xl font-extrabold md:text-3xl">{model.sections.benefits.heading}</h2>
          <p className="mb-8 text-sm leading-relaxed text-white/75">
            {model.sections.benefits.intro || `Viele Kunden aus ${cityName} entscheiden sich für den digitalen Weg, weil er klar, schnell und ohne Termin vorbereitet werden kann.`}
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {model.sections.benefits.items.map((item: string) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <span className="text-sm leading-relaxed text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),

    preparation: (
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="preparation">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
          <h2 className="mb-4 text-2xl font-extrabold text-primary">{model.sections.preparation.heading}</h2>
          <div className="space-y-4">
            {prepParagraphs.map((paragraph: string) => (
              <p key={paragraph} className="leading-relaxed text-gray-600">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    ),

    trust: (
  <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="trust">
    <div className="rounded-2xl border border-primary/10 bg-primary/5 p-8 md:p-10">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
        <Shield className="h-4 w-4" />
        <span className="text-sm font-bold">Trust & Sicherheit</span>
      </div>
      <h2 className="mb-4 text-2xl font-extrabold text-primary">
        {model.sections.trust.heading}
      </h2>

      <div className="space-y-4">
        {trustParagraphs.length > 0 ? (
          trustParagraphs.map((paragraph: string) => (
            <p key={paragraph} className="leading-relaxed text-gray-700">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="leading-relaxed text-gray-700">
            Viele Kunden möchten vor dem Start wissen, dass der Ablauf klar, sicher und verständlich ist. Genau deshalb setzen wir auf einfache Schritte, offiziellen Ablauf und direkte Hilfe per WhatsApp oder Telefon.
          </p>
        )}

        {datenschutzJoker && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="leading-relaxed text-gray-700">
              {datenschutzJoker}
            </p>
          </div>
        )}
      </div>
    </div>
  </section>
),

    documents: (
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="documents">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
          <h2 className="mb-4 text-2xl font-extrabold text-primary">{model.sections.documents.heading}</h2>
          <p className="mb-6 leading-relaxed text-gray-600">{model.sections.documents.intro}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            {model.sections.documents.items.map((item: string) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <span className="text-sm leading-relaxed text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
expertHelp: (
  <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="expertHelp">
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
        <HelpCircle className="h-4 w-4" />
        <span className="text-sm font-bold">Praxis-Hilfe</span>
      </div>

      <h2 className="mb-4 text-2xl font-extrabold text-primary">
        Wichtige Hinweise zur Online-Abmeldung in {cityName}
      </h2>

      <p className="mb-8 leading-relaxed text-gray-600">
        {renderInlineLinkedText(model.content.expertAccordionIntro)}
      </p>

      <div className="space-y-3">
        {model.content.expertAccordionItems?.map(
          (item: { title: string; paragraphs: string[] }) => (
            <details
              key={item.title}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-gray-900">
                {item.title}
                <span className="ml-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    className="h-4 w-4 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>

              <div className="space-y-4 border-t border-gray-200 bg-white px-5 pb-5 pt-4">
                {item.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-gray-600">
                    {renderInlineLinkedText(paragraph)}
                  </p>
                ))}
              </div>
            </details>
          ),
        )}
      </div>

      <p className="mt-8 leading-relaxed text-gray-600">
        {renderInlineLinkedText(model.content.expertAccordionOutro)}
      </p>
    </div>
  </section>
),
    process: (
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="process">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
            <FileCheck className="h-4 w-4" />
            <span className="text-sm font-bold">Schritt für Schritt</span>
          </div>

          <h2 className="mb-4 text-2xl font-extrabold text-primary md:text-3xl">
            {model.sections.process.heading}
          </h2>

          <p className="mb-8 leading-relaxed text-gray-600">{model.sections.process.intro}</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {model.sections.process.steps.map((step: string, index: number) => (
              <div
                key={step}
                className="relative rounded-2xl border border-gray-100 bg-gray-50 p-6"
              >
                <div className="absolute right-4 top-4 text-5xl font-extrabold text-primary/5">
                  {index + 1}
                </div>
                <h3 className="mb-2 font-bold text-gray-900">Schritt {index + 1}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),

    compare: (
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="compare">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
          <h2 className="mb-4 text-2xl font-extrabold text-primary">{model.sections.compare.heading}</h2>
          <p className="mb-6 leading-relaxed text-gray-600">{model.sections.compare.intro}</p>

          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50">
                  {compareTable.headers.map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-sm font-bold text-gray-900"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareTable.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-gray-100">
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${index}`} className="px-4 py-3 text-sm text-gray-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {model.sections.compare.note ? (
            <p className="mt-6 leading-relaxed text-gray-600">{model.sections.compare.note}</p>
          ) : null}

          <Link
            href="/product/fahrzeugabmeldung"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            {compareCtaText}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    ),

    target: (
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="target">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
          <h2 className="mb-4 text-2xl font-extrabold text-primary">{model.sections.target.heading}</h2>
          <p className="mb-6 leading-relaxed text-gray-600">{model.sections.target.intro}</p>

          <div className="mb-6 border-l-4 border-accent/30 pl-4">
            <p className="text-sm leading-relaxed text-gray-500">
              {model.sections.target.actionText || `Wer sein Fahrzeug in ${cityName} bequem, schnell und ohne Vor-Ort-Termin abmelden möchte, kann jetzt direkt digital starten.`}
            </p>
            <Link
              href="/product/fahrzeugabmeldung"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              {targetCtaText}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {model.sections.target.items.map((item: string) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <span className="text-sm leading-relaxed text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),

    local: (
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="local">
        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-8 md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-bold">Lokale Differenzierung</span>
          </div>
          <h2 className="mb-4 text-2xl font-extrabold text-primary">{model.sections.local.heading}</h2>
          <p className="leading-relaxed text-gray-700">{model.sections.local.intro}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {model.localInsights.map((insight: any) => (
              <div key={insight.id} className="rounded-2xl border border-primary/10 bg-white/70 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60">
                  {insight.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{renderInlineLinkedText(insight.text)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {localParagraphs.map((paragraph: string) => (
              <p key={paragraph} className="leading-relaxed text-gray-700">
                {renderInlineLinkedText(paragraph)}
              </p>
            ))}
          </div>

          {model.sections.local.alternativeText ? (
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {renderInlineLinkedText(model.sections.local.alternativeText)}
            </p>
          ) : null}
        </div>
      </section>
    ),

    note: (
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="note">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 shadow-sm md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-amber-700">
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-bold">Bitte beachten</span>
          </div>
          <h2 className="mb-4 text-2xl font-extrabold text-amber-900">{model.sections.note.heading}</h2>
          {noteParagraphs.length > 0 ? (
            noteParagraphs.map((paragraph: string) => (
              <p key={paragraph} className="leading-relaxed text-amber-900/80">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="leading-relaxed text-amber-900/80">
              Prüfen Sie Kennzeichen, Fahrzeugschein, Sicherheitscodes und Fahrzeugdaten vor dem Absenden noch einmal sorgfältig. Gut lesbare und vollständige Angaben vermeiden unnötige Rückfragen.
            </p>
          )}
        </div>
      </section>
    ),

    faq: (
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="faq">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm font-bold">FAQ</span>
            </div>
            <h2 className="text-2xl font-extrabold text-primary">{model.sections.faq.heading}</h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item: { q: string; a: string }) => (
              <details
                key={item.q}
                className="group overflow-hidden rounded-xl border border-gray-200"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-gray-900">
                  {item.q}
                  <span className="ml-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-gray-100 px-5 pb-5 pt-4 leading-relaxed text-gray-600">
                  {renderInlineLinkedText(item.a)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),

    authorityHubs: (
      <AuthorityHubsSection
        key="authorityHubs"
        cityName={cityName}
        state={input.state}
        className="mt-16"
      />
    ),

    links: (
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="links">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-extrabold text-primary">{model.sections.links.heading}</h2>
          <p className="mb-4 text-gray-600">
            {nearbyIntro || 'Diese Seiten können ebenfalls hilfreich sein:'}
          </p>

          {model.sections.links.relationshipExplanation ? (
            <p className="mb-4 text-sm leading-relaxed text-gray-700">
              {renderInlineLinkedText(model.sections.links.relationshipExplanation)}
            </p>
          ) : model.sections.links.links[0] ? (
            <p className="mb-4 text-xs text-gray-400">
              {model.sections.links.links[0].source === 'regional_pool' ||
              model.sections.links.links[0].source === 'second_hop'
                ? 'Hinweis: Teile der Liste können aus regionaler Ergänzung stammen, wenn direkte Peers nicht ausreichen.'
                : 'Hinweis: Die Auswahl folgt dem lokalen Nachbarschaftsgraph (unmittelbare Behörden-Peers).'}
            </p>
          ) : null}

          {model.sections.links.contextText ? (
            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              {model.sections.links.contextText}
            </p>
          ) : null}

          {model.sections.links.links.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-3">
              {model.sections.links.links.map((item: { slug: string; name: string }) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-gray-500">
              Für diese Seite konnten noch nicht genug gleichrangige Peer-Behörden validiert werden. Der Nearby-Graph bleibt daher bewusst leer.
            </p>
          )}

          {model.sections.links.closingText ? (
            <p className="mt-6 text-sm text-gray-500">{model.sections.links.closingText}</p>
          ) : null}

          {model.sections.links.stateHubHref && model.sections.links.stateHubLabel && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <Link
                href={model.sections.links.stateHubHref}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary/70 transition-colors hover:text-primary"
              >
                <MapPin className="h-3.5 w-3.5" />
                {model.sections.links.stateHubLabel} →
              </Link>
            </div>
          )}
        </div>
      </section>
    ),

    cta: (
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6" key="cta">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-800 to-dark p-8 text-center md:p-12">
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-white/90">
                Offiziell über unsere GKS-Anbindung
              </span>
            </div>

            <h2 className="mb-3 text-2xl font-extrabold text-white md:text-3xl">
              {model.sections.cta.heading}
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-white/70">
              {model.sections.cta.text || `Wer sein Fahrzeug in ${cityName} schnell, offiziell und ohne Termin abmelden möchte, kann jetzt direkt digital starten.`}
            </p>

            <Link
              href="/product/fahrzeugabmeldung"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-primary transition-all hover:bg-accent-600 hover:shadow-lg hover:shadow-accent/20"
            >
              <CheckCircle className="h-5 w-5" />
              {closingCtaText}
            </Link>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {governmentOfficeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentOfficeSchema) }}
        />
      )}

      <main
        className="min-h-screen bg-gray-50 pb-20"
        data-archetype={model.archetype}
        data-layout={model.layoutStrategy}
        data-indexable={model.seoGate.indexable ? 'true' : 'false'}
      >
        <section className="relative overflow-hidden bg-gradient-to-br from-dark via-primary-900 to-dark pb-16 pt-28 md:pt-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-20 top-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
            <nav className="mb-8 flex items-center gap-2 text-sm text-white/50">
              <Link href="/" className="transition-colors hover:text-white/80">
                Startseite
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link
                href="/kfz-zulassung-abmeldung-in-deiner-stadt"
                className="transition-colors hover:text-white/80"
              >
                Alle Städte
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-white/70">{cityName}</span>
            </nav>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-accent">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-bold">{model.hero.badge}</span>
            </div>

            <h1 className="mb-5 max-w-4xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
              Auto online abmelden in {cityName}
            </h1>

            <p className="mb-4 max-w-3xl text-lg leading-relaxed text-white/75">
              {renderInlineLinkedText(model.hero.summary)}
            </p>
            <p className="mb-8 max-w-3xl text-sm leading-relaxed text-white/65 md:text-base">
              {renderInlineLinkedText(model.hero.detail)}
            </p>

            <div className="mb-6 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-white/90">Ohne Termin</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-white/90">Bundesweit nutzbar</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                <BadgeEuro className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-white/90">Ab {pricing.abmeldungPriceFormatted}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                <MailCheck className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-white/90">Bestätigung per E-Mail</span>
              </div>
            </div>

            {intentLines.length > 0 && (
              <div className="mb-10 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur md:p-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent/90">
                  Typische Ausgangslagen
                </p>
                <ul className="space-y-3 text-sm leading-relaxed text-white/85 md:text-base">
                  {intentLines.map((line: string) => (
                    <li key={line} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{renderInlineLinkedText(line)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <Link
                href="/product/fahrzeugabmeldung"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-lg font-extrabold text-primary transition-all hover:bg-accent-600 hover:shadow-xl hover:shadow-accent/20"
              >
                {heroCtaText}
              </Link>

              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-lg font-bold text-white transition-all hover:border-accent hover:bg-accent/10"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Hilfe
              </a>
            </div>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <div>
                <span className="text-sm font-bold text-white">5.0</span>
                <span className="ml-1 text-xs text-white/60">Google · 5,0 Sterne</span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-6 max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg md:p-10">
            <h2 className="mb-4 text-2xl font-extrabold text-primary md:text-3xl">
              {model.intro.heading}
            </h2>

            <div className="space-y-4">
              {introParagraphs.map((paragraph: string) => (
                <p key={paragraph} className="leading-relaxed text-gray-600">
                  {renderInlineLinkedText(paragraph)}
                </p>
              ))}
            </div>
          </div>
        </section>

        {authority && (
          <section className="relative z-10 mx-auto mt-12 max-w-5xl px-4 sm:px-6">
            <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:flex-row">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-bold">Zuständige Behörde in {cityName}</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{authority.name}</h3>
                <p className="mb-1 text-gray-600">{authority.adresse}</p>
                <p className="mb-4 text-gray-600">
                  {authority.plz} {authority.ort || cityName}
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 md:w-auto">
                {authority.telefon && (
                  <a
                    href={`tel:${authority.telefon}`}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-medium text-gray-700">{authority.telefon}</span>
                  </a>
                )}

                {authority.email && (
                  <a
                    href={`mailto:${authority.email}`}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  >
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium text-gray-700">{authority.email}</span>
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-bold">Verwaltungsbezug vor Ort</span>
            </div>
            <p className="font-medium leading-relaxed text-gray-700">{model.authority.narrative}</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{model.authority.processNote}</p>
          </div>
        </section>

        {model.sectionOrder
          .filter(
            (sectionKey: keyof typeof sectionMap) =>
              CITY_AUTHORITY_HUBS_ENABLED || sectionKey !== 'authorityHubs',
          )
          .map((sectionKey: keyof typeof sectionMap) => sectionMap[sectionKey])
          .filter(Boolean)}

        <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURE_CARDS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-sm font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
  <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
      <HelpCircle className="h-4 w-4" />
      <span className="text-sm font-bold">Insider-Wissen</span>
    </div>

    <h2 className="mb-4 text-2xl font-extrabold text-primary">
      Hilfreiche Anleitungen zur Online-Abmeldung
    </h2>

    <p className="mb-8 leading-relaxed text-gray-600">
      Viele Fragen lassen sich vor dem Start schnell klären. Diese Beiträge helfen oft weiter, wenn Codes,
      Kosten, Unterlagen oder technische Probleme unklar sind.
    </p>

    <div className="grid gap-4 md:grid-cols-2">
      {CITY_GUIDE_LINKS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:border-primary/20 hover:bg-white"
        >
          <h3 className="mb-2 text-base font-bold text-gray-900">{item.title}</h3>
          <p className="text-sm leading-relaxed text-gray-600">{item.text}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Jetzt lesen
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      ))}
    </div>
  </div>
</section>
        <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="grid items-center md:grid-cols-2">
              <div className="p-8 md:p-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-accent">
                  <span className="text-xs font-bold">BESTER PREIS</span>
                </div>

                <h2 className="mb-3 text-2xl font-extrabold text-primary md:text-3xl">
                  Auto online abmelden in {cityName}
                </h2>

                <p className="mb-6 text-gray-600">
                  Einmalig nur {pricing.abmeldungPriceFormatted} – alle Gebühren inklusive.
                </p>

                <div className="mb-6 space-y-3">
                  {PRICE_FEATURES.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-accent" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/product/fahrzeugabmeldung"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-primary transition-all hover:bg-accent-600 hover:shadow-lg hover:shadow-accent/20"
                >
                  {closingCtaText}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="bg-gradient-to-br from-primary to-dark p-8 text-center md:p-10">
                <p className="mb-2 text-sm text-white/60">Abmeldung ab</p>
                <p className="mb-2 text-5xl font-extrabold text-accent md:text-6xl">
                  {pricing.abmeldungPriceFormatted}
                </p>
                <p className="text-sm text-white/50">Einmalig · Alle Gebühren inklusive</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-dark to-primary-900 p-8 text-white md:p-10">
            <div className="relative">
              <h2 className="mb-2 text-xl font-extrabold">Hilfe & Kontakt</h2>
              <p className="mb-6 text-sm text-white/70">
                Unser Team ist für Sie da – persönlich und direkt, auch für Kunden aus {cityName}.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <a
                  href={settings.phoneLink}
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Telefon</p>
                    <p className="text-sm font-bold">{settings.phone}</p>
                  </div>
                </a>

                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/20">
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">WhatsApp</p>
                    <p className="text-sm font-bold">Live-Chat starten</p>
                  </div>
                </a>

                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/30">
                    <MessageCircle className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">E-Mail</p>
                    <p className="text-sm font-bold">{settings.email}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <Link
              href="/kfz-zulassung-abmeldung-in-deiner-stadt"
              className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-accent"
            >
              <MapPin className="h-4 w-4" />
              Alle verfügbaren Städte ansehen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
