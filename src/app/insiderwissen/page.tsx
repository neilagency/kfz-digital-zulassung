import { Metadata } from 'next';
import { getAllPosts, getCategories, getSiteSettings } from '@/lib/db';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

/* ── Category descriptions for SEO ─────────────────── */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'auto-abmelden':
    'Erfahren Sie alles rund um das Thema Auto abmelden – von den benötigten Unterlagen über die Kosten bis zur Schritt-für-Schritt-Anleitung. Wir erklären, wie Sie Ihr Fahrzeug schnell und bequem online abmelden können, ohne einen Termin bei der Zulassungsstelle zu benötigen. Lesen Sie unsere Experten-Ratgeber und sparen Sie Zeit und Geld bei der Fahrzeugabmeldung.',
  'auto-abmelden-online':
    'Online Auto abmelden – so funktioniert die digitale Fahrzeugabmeldung über das iKFZ-Portal. Hier finden Sie aktuelle Anleitungen, Tipps und Erfahrungsberichte zur Online-Abmeldung Ihres PKW. Erfahren Sie, welche Voraussetzungen erfüllt sein müssen und wie der gesamte Prozess in wenigen Minuten erledigt ist.',
  'kennzeichen-abmeldung':
    'Alles zum Thema Kennzeichen und Abmeldung: Müssen Sie die Kennzeichen abgeben? Was passiert mit Wunschkennzeichen? Hier erfahren Sie die Regeln zur Kennzeichenrückgabe, Reservierung und Entstempelung bei der Fahrzeugabmeldung in Deutschland.',
  'fahrzeugstilllegung':
    'Fahrzeugstilllegung einfach erklärt: Unterschied zwischen vorübergehender und endgültiger Stilllegung, Kosten, Fristen und Versicherungsfragen. Unsere Ratgeber helfen Ihnen, die richtige Entscheidung für Ihr Fahrzeug zu treffen.',
  'fahrzeugexport-abmeldung':
    'Fahrzeug ins Ausland exportieren? Hier finden Sie alle Informationen zur Abmeldung bei Fahrzeugexport, Ausfuhrkennzeichen, Zollbestimmungen und den notwendigen Dokumenten für den grenzüberschreitenden Fahrzeugverkauf.',
  'fehler-abmeldung':
    'Typische Fehler bei der Fahrzeugabmeldung vermeiden: Von fehlenden Unterlagen über abgelaufene HU bis zu Problemen mit dem Sicherheitscode. Lernen Sie aus den häufigsten Fehlern anderer Fahrzeughalter und melden Sie Ihr Auto beim ersten Versuch erfolgreich ab.',
  'abmeldung-bei-fahrzeugverkauf':
    'Auto verkauft – und jetzt? Erfahren Sie, wer das Fahrzeug abmelden muss, welche Fristen gelten und wie Sie sich rechtlich absichern. Tipps zur Abmeldung beim Privatverkauf, Händlerverkauf und bei Inzahlungnahme.',
  'abmeldung-beim-strassenverkehrsamt':
    'So läuft die Abmeldung beim Straßenverkehrsamt ab: Öffnungszeiten, Wartezeiten, benötigte Dokumente und Gebühren. Vergleichen Sie den Weg zur Behörde mit der schnellen Online-Abmeldung und entscheiden Sie, was für Sie am besten passt.',
  'abmeldung-ohne-fahrzeugbrief':
    'Fahrzeugbrief verloren? So melden Sie Ihr Auto auch ohne Zulassungsbescheinigung Teil II ab. Wir erklären die Ersatzausstellung, Kosten und das Verfahren bei Verlust des Fahrzeugbriefs.',
  'kosten-der-fahrzeugabmeldung':
    'Was kostet die Fahrzeugabmeldung? Hier finden Sie eine aktuelle Übersicht aller Gebühren – online und beim Amt. Erfahren Sie, wie Sie bei der Abmeldung sparen können und welche versteckten Kosten es gibt.',
  'kfz-abmeldung':
    'KFZ-Abmeldung in Deutschland: Umfassender Ratgeber mit allen Informationen zu Voraussetzungen, Ablauf, Kosten und häufigen Fragen. Ob online oder persönlich – hier finden Sie alles, was Sie wissen müssen.',
  'ikfz-kosten-preise':
    'iKFZ Kosten und Preise im Überblick: Was kostet die Online-Abmeldung über das iKFZ-Portal? Vergleich der Gebühren zwischen verschiedenen Anbietern und der Behörde. Transparente Preisübersicht für alle digitalen KFZ-Dienstleistungen.',
};

const DEFAULT_CAT_DESCRIPTION =
  'Lesen Sie unsere Experten-Artikel und Ratgeber zu diesem Thema. Hier finden Sie aktuelle Informationen, praktische Anleitungen und Tipps rund um die Fahrzeugabmeldung und KFZ-Zulassung in Deutschland. Unsere Redaktion recherchiert und aktualisiert alle Beiträge regelmäßig, damit Sie stets gut informiert sind.';

interface BlogPageProps {
  searchParams: Promise<{ page?: string; cat?: string }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const catFilter = params.cat;
  const pageNum = Number(params.page) || 1;

  // Always use sanitized siteUrl (never localhost)
  const { siteUrl } = await getSiteSettings();
  const canonicalBase = siteUrl + '/insiderwissen';

  // Category filtered pages → canonical only pointing to /insiderwissen
  // No noindex needed — canonical signal alone consolidates to main page
  // This avoids the "Canonicalised + noindex" conflict in Screaming Frog
  if (catFilter) {
    const catName = catFilter.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${catName} – Insiderwissen Blog & Ratgeber`,
      description: CATEGORY_DESCRIPTIONS[catFilter]?.slice(0, 160) || `Alle Artikel zum Thema ${catName}. Ratgeber und Anleitungen von Experten.`,
      alternates: { canonical: canonicalBase },
    };
  }

  // Pagination pages → noindex + self-canonical (no conflict: canonical is self)
  if (pageNum > 1) {
    return {
      title: `Insiderwissen – Blog & Ratgeber | Seite ${pageNum}`,
      description: 'Aktuelle Artikel, Anleitungen und Ratgeber rund um die Online-Fahrzeugabmeldung in Deutschland.',
      alternates: { canonical: `${canonicalBase}?page=${pageNum}` },
      robots: { index: false, follow: true },
    };
  }

  // Main blog page — fully indexable with self-canonical
  return {
    title: 'Insiderwissen – Blog & Ratgeber',
    description:
      'Aktuelle Artikel, Anleitungen und Ratgeber rund um die Online-Fahrzeugabmeldung in Deutschland. Insiderwissen von Experten.',
    alternates: { canonical: canonicalBase },
    robots: { index: true, follow: true },
    openGraph: {
      title: 'Insiderwissen – Blog & Ratgeber | Online Auto Abmelden',
      description:
        'Aktuelle Artikel, Anleitungen und Ratgeber rund um die Online-Fahrzeugabmeldung in Deutschland.',
      url: canonicalBase,
      type: 'website',
      images: [{ url: siteUrl + '/logo.webp', width: 1920, height: 1080 }],
    },
  };
}

// ISR: revalidate blog listing every 5 minutes
// NOTE: do NOT combine with force-dynamic — that disables ISR and hits the DB on every request
export const revalidate = 300;

export default async function InsiderwissenPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const catFilter = params.cat || undefined;
  const perPage = 9;

  const [result, categories] = await Promise.all([
    getAllPosts(currentPage, perPage, catFilter),
    getCategories(),
  ]);

  const { posts, totalPages } = result;

  return (
    <main className="pb-20">
      {/* Hero header */}
      <section className="bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-32 pb-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-white/90 text-sm font-medium">Blog &amp; Ratgeber</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {catFilter
              ? catFilter.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
              : 'Insiderwissen'}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            {catFilter
              ? `Alle Artikel und Ratgeber zum Thema ${catFilter.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}.`
              : 'Alles was Sie \u00fcber die Fahrzeugabmeldung, Stilllegung und KFZ-Ummeldung wissen m\u00fcssen.'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/insiderwissen"
              className={'px-4 py-2 rounded-full text-sm font-medium transition-colors ' +
                (!catFilter
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}
            >
              Alle
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={'/insiderwissen?cat=' + cat.slug}
                className={'px-4 py-2 rounded-full text-sm font-medium transition-colors ' +
                  (catFilter === cat.slug
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>
        )}

        {/* Category description for SEO */}
        {catFilter && (
          <div className="mb-10 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h2 className="text-xl font-bold text-primary mb-3">
              {catFilter.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} – Ratgeber &amp; Artikel
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {CATEGORY_DESCRIPTIONS[catFilter] || DEFAULT_CAT_DESCRIPTION}
            </p>
          </div>
        )}

        {/* Posts grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">Keine Artikel gefunden.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-16">
            {currentPage > 1 && (
              <Link
                href={'/insiderwissen?page=' + (currentPage - 1) + (catFilter ? '&cat=' + catFilter : '')}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors"
              >
                &larr; Zur&uuml;ck
              </Link>
            )}

            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }
              return (
                <Link
                  key={pageNum}
                  href={'/insiderwissen?page=' + pageNum + (catFilter ? '&cat=' + catFilter : '')}
                  className={'w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ' +
                    (currentPage === pageNum
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}
                >
                  {pageNum}
                </Link>
              );
            })}

            {currentPage < totalPages && (
              <Link
                href={'/insiderwissen?page=' + (currentPage + 1) + (catFilter ? '&cat=' + catFilter : '')}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors"
              >
                Weiter &rarr;
              </Link>
            )}
          </nav>
        )}

        {/* SEO text content for improved text-to-HTML ratio */}
        <div className="mt-16 bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-extrabold text-primary mb-4">
            Insiderwissen rund um die Fahrzeugabmeldung in Deutschland
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Willkommen im Insiderwissen-Blog von Online Auto Abmelden – Ihrem umfassenden
              Ratgeber rund um die Themen Fahrzeugabmeldung, KFZ-Zulassung und digitale
              Behördenservices in Deutschland. Unsere Experten-Redaktion recherchiert und
              aktualisiert regelmäßig alle Beiträge, damit Sie stets die neuesten Informationen
              zu gesetzlichen Änderungen, Kosten und Abläufen erhalten.
            </p>
            <p>
              Ob Sie erfahren möchten, wie die Online-Abmeldung Schritt für Schritt funktioniert,
              welche Unterlagen Sie benötigen, was bei Fahrzeugverkauf oder -export zu beachten ist
              oder wie Sie häufige Fehler bei der Abmeldung vermeiden – hier finden Sie die passenden
              Antworten. Alle Artikel basieren auf den aktuellen Regelungen des Kraftfahrt-Bundesamtes
              (KBA) und der Fahrzeug-Zulassungsverordnung (FZV).
            </p>
            <p>
              Nutzen Sie die Kategorie-Filter oben, um gezielt Artikel zu Ihrem Thema zu finden.
              Von der Kennzeichen-Abmeldung über die Fahrzeugstilllegung bis hin zur iKFZ-Kostenübersicht –
              unser Blog deckt alle relevanten Bereiche ab und hilft Ihnen, den Behördengang von
              zu Hause aus zu erledigen.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
