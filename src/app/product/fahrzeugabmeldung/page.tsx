import { Metadata } from 'next';
import ServiceForm from '@/components/ServiceForm';
import { getSiteSettings, getHomepagePricing } from '@/lib/db';
import { getProductBySlug } from '@/lib/db';
import {
  Shield,
  CheckCircle,
  Headphones,
  CreditCard,
  MessageCircle,
  Phone,
  Mail,
  Camera,
  ScanLine,
  Bookmark,
  Send,
  Banknote,
  FileCheck,
  Star,
  ArrowRight,
  Euro,
  Wallet,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug('fahrzeugabmeldung');
  const settings = await getSiteSettings();
  const price = product?.price?.toFixed(2).replace('.', ',') ?? '19,70';
  const rawTitle = product?.metaTitle || `Fahrzeugabmeldung – ab ${price} € abmelden`;
  const title = rawTitle.length > 46 ? rawTitle.slice(0, 45).replace(/\s+\S*$/, '') + '…' : rawTitle;
  return {
    title,
    description: product?.metaDescription || 'KFZ online abmelden in nur 2 Minuten. Ohne Termin, ohne Registrierung. Offizielle Bestätigung sofort per E-Mail. Bundesweit gültig.',
    alternates: { canonical: `${settings.siteUrl}/product/fahrzeugabmeldung` },
    openGraph: {
      title: product?.ogTitle || `Fahrzeugabmeldung online – nur ${price} €`,
      description: product?.ogDescription || 'Auto online abmelden in nur 2 Minuten. Bundesweit gültig.',
      url: `${settings.siteUrl}/product/fahrzeugabmeldung`,
      images: [{ url: product?.ogImage || `${settings.siteUrl}/logo.webp`, width: 1920, height: 1080, alt: 'Fahrzeugabmeldung online' }],
    },
  };
}

export default async function FahrzeugabmeldungPage() {
  // Toggle to true to show full page (Hero + Content). false = Form-only landing page.
  const showFullContent = false;

  const [product, settings, pricing] = await Promise.all([
    getProductBySlug('fahrzeugabmeldung'),
    getSiteSettings(),
    getHomepagePricing(),
  ]);
  const basePrice = product?.price ?? 19.7;
  const options = (() => { try { return JSON.parse(product?.options || '[]'); } catch { return []; } })();
  const reservierungOption = options.find((o: any) => o.key === 'reservierung');
  const reservierungPrice = reservierungOption?.price ?? 4.7;
  const priceFormatted = basePrice.toFixed(2).replace('.', ',');
  const reservierungFormatted = reservierungPrice.toFixed(2).replace('.', ',');

  const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Fahrzeugabmeldung Online',
  description:
    'Online-Abmeldung Ihres Fahrzeugs bei der zuständigen Zulassungsstelle. Amtlich anerkannt, bundesweit gültig.',
  provider: {
    '@type': 'Organization',
    name: settings.siteName,
    url: settings.siteUrl,
  },
  areaServed: {
    '@type': 'Country',
    name: 'DE',
  },
  offers: {
    '@type': 'Offer',
    price: basePrice.toFixed(2),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <main className="pb-20 bg-gray-50 min-h-screen">
        {/* Page header — gradient background always visible, text only when showFullContent */}
        <div className="bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-36 pb-8">
          {showFullContent && (
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-bold">Offiziell &amp; amtlich anerkannt</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Fahrzeug jetzt online abmelden
            </h1>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                { icon: CheckCircle, text: 'Sofortige Abmelde-Bestätigung per E-Mail' },
                { icon: Shield, text: '100% KBA-registrierter Service' },
                { icon: Headphones, text: 'Persönlicher Live-Support bei Fragen' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2"
                >
                  <Icon className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Form section */}
        <div id="abmeldeformular" className="max-w-4xl mx-auto px-4 mt-12 md:-mt-8 relative z-10">
          <ServiceForm basePrice={basePrice} reservierungPrice={reservierungPrice} contactPhone={settings.phone} contactPhoneLink={settings.phoneLink} contactWhatsapp={settings.whatsapp} />
        </div>

        {/* ===== Additional content sections ===== */}
        {showFullContent && <div>

        {/* ===== Google Trust Badge ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-10">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <strong className="text-primary">5.0</strong> – Bestbewerteter Service 2026 · verifiziert von Trustindex
            </p>
          </div>
        </section>

        {/* ===== Two Variant CTAs ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="#abmeldeformular"
              className="group relative bg-gradient-to-br from-primary to-primary-700 text-white rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/20 transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
              <FileCheck className="w-8 h-8 mb-3 text-accent" />
              <h3 className="text-lg font-bold mb-1">Variante 1: Formular ausfüllen</h3>
              <p className="text-white/70 text-sm">PKW jetzt online abmelden – Formular starten</p>
              <ArrowRight className="w-5 h-5 mt-3 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-2xl p-6 hover:shadow-xl hover:shadow-[#25D366]/20 transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
              <MessageCircle className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-bold mb-1">Variante 2: Per WhatsApp</h3>
              <p className="text-white/70 text-sm">
                Abmeldung per WhatsApp – Auto online abmelden in Minuten
              </p>
              <ArrowRight className="w-5 h-5 mt-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>

        {/* ===== SEO Intro ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-4">
              Fahrzeug jetzt online abmelden – einfach, offiziell &amp; schnell
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Mit unserem digitalen Service können Sie Ihr <strong>KFZ jetzt online abmelden</strong> –
                egal ob <strong>Auto online abmelden</strong>, <strong>KFZ online abmelden</strong>,{' '}
                <strong>PKW online abmelden</strong> oder <strong>LKW online abmelden</strong>.
                Auch <strong>Motorrad</strong>, <strong>Anhänger</strong> oder <strong>Quad</strong>{' '}
                können Sie hier bequem digital außer Betrieb setzen.
              </p>
              <p>
                Die Abmeldung erfolgt über die amtliche Großkundenschnittstelle (GKS) des
                Kraftfahrt-Bundesamtes (KBA) gemäß § 34 der Fahrzeug-Zulassungsverordnung.
                Das bedeutet: Ihre Online-Abmeldung hat die gleiche Rechtsgültigkeit wie ein
                persönlicher Besuch bei Ihrer Zulassungsstelle. Die amtliche Bestätigung erhalten
                Sie unmittelbar nach Bearbeitung als PDF per E-Mail.
              </p>
              <p>
                Sie benötigen lediglich Ihre Zulassungsbescheinigung Teil I (Fahrzeugschein) mit
                freigerubbeltem Sicherheitscode sowie Fotos beider Kennzeichen mit freigerubbelten
                Siegeln. Keinen Personalausweis, keine AusweisApp – einfach Fotos per WhatsApp oder
                E-Mail senden und die Bestätigung erhalten. Steuer und Versicherung werden automatisch
                informiert.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Step-by-Step Process ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <h2 className="text-2xl font-extrabold text-primary mb-8 text-center">
            So funktioniert Auto online abmelden
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: ScanLine,
                title: 'Sicherheitscodes freilegen',
                text: 'Rubbeln Sie den Code im Fahrzeugschein (Teil I) frei und fotografieren Sie Vorder- und Rückseite.',
                num: '1',
              },
              {
                icon: Camera,
                title: 'Kennzeichen freilegen',
                text: 'Entfernen Sie die Siegel, fotografieren Sie beide Kennzeichen.',
                num: '2',
              },
              {
                icon: Bookmark,
                title: 'Reservierung wählen',
                text: 'Möchten Sie Ihr Kennzeichen nach der Abmeldung behalten? Teilen Sie uns das mit.',
                num: '3',
              },
              {
                icon: Send,
                title: 'Fotos übermitteln',
                text: `Senden Sie alles per WhatsApp oder E-Mail an ${settings.email}.`,
                num: '4',
              },
              {
                icon: Banknote,
                title: 'Zahlung',
                text: 'Nach Prüfung erhalten Sie einen Zahlungslink (PayPal, Karte, Überweisung).',
                num: '5',
              },
              {
                icon: FileCheck,
                title: 'Bestätigung erhalten',
                text: 'Sie erhalten eine offizielle PDF-Bestätigung der Behörde per E-Mail.',
                num: '6',
              },
            ].map(({ icon: Icon, title, text, num }) => (
              <div
                key={num}
                className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="absolute top-4 right-4 text-5xl font-extrabold text-primary/5 group-hover:text-primary/10 transition-colors">
                  {num}
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Cost Overview ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="bg-gradient-to-br from-primary to-primary-800 rounded-2xl p-8 md:p-10 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-10 -mb-10" />
            <div className="relative">
              <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
                <Euro className="w-7 h-7 text-accent" />
                Kostenübersicht
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Abmeldung', price: `ab ${priceFormatted} €`, sub: 'Einmalige Gebühr' },
                  { label: 'Kennzeichen\nreservierung', price: `${reservierungFormatted} €`, sub: 'Optional für 1 Jahr' },
                  { label: 'Anmeldung / Wiederzulassung', price: `ab ${pricing.anmeldungPriceFormatted}`, sub: 'Separater Service' },
                ].map(({ label, price, sub }) => (
                  <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                    <p className="text-white/70 text-sm mb-1 whitespace-pre-line">{label}</p>
                    <p className="text-2xl font-extrabold text-accent">{price}</p>
                    <p className="text-xs text-white/50 mt-1">{sub}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60 mt-5">
                <strong className="text-white/80">Hinweis:</strong> Im Formular gibt es keinen
                Foto-Upload. Bitte senden Sie Ihre Bilder per WhatsApp oder E-Mail.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Kennzeichen-Reservierung Info ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-primary/5 px-8 py-5 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-accent" />
                Kennzeichenreservierung nach der Abmeldung
              </h2>
            </div>
            <div className="p-8">
              <p className="text-gray-600 mb-5 leading-relaxed">
                Nach dem <strong>Fahrzeug jetzt online abmelden</strong> bleibt Ihr Kennzeichen 3–11
                Tage gesperrt. Danach kann es neu vergeben werden. Zwei Optionen:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                  <p className="font-bold text-primary mb-2">Reservierung über uns</p>
                  <p className="text-sm text-gray-600">
                    Wir sichern das Kennzeichen für bis zu 1 Jahr – perfekt für Wiederzulassung des
                    selben Fahrzeugs.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <p className="font-bold text-gray-800 mb-2">Selbst reservieren</p>
                  <p className="text-sm text-gray-600">
                    Reservieren Sie das Kennzeichen auf der Webseite Ihrer Zulassungsstelle für ein
                    anderes Fahrzeug.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Payment Methods ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-extrabold text-primary mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-accent" />
              Zahlungsmöglichkeiten
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: CreditCard,
                  title: 'Kredit- & Debitkarte',
                  text: 'Direkt online bezahlen',
                },
                {
                  icon: Banknote,
                  title: 'PayPal',
                  text: 'Schnell & sicher zahlen',
                },
                {
                  icon: Euro,
                  title: 'Banküberweisung',
                  text: 'Start nach Eingang oder Screenshot per WhatsApp',
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Contact Section ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="bg-gradient-to-r from-dark to-primary-900 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <h2 className="text-xl font-extrabold mb-2">Hilfe &amp; Kontakt</h2>
              <p className="text-white/60 text-sm mb-6">
                Unser Team ist für Sie da – persönlich und direkt.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href={settings.phoneLink}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Telefon</p>
                    <p className="font-bold text-sm">{settings.phone}</p>
                  </div>
                </a>
                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-[#25D366]/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">WhatsApp</p>
                    <p className="font-bold text-sm">Live-Chat starten</p>
                  </div>
                </a>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">E-Mail</p>
                    <p className="font-bold text-sm">{settings.email}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 mt-4">
          <p className="text-xs text-gray-400 text-center">
            Hinweis: Ihre Daten werden nur für den Auftrag Fahrzeug jetzt online abmelden verarbeitet.
            Details siehe{' '}
            <Link href="/datenschutzhinweise" className="text-primary hover:underline">
              Datenschutzhinweise
            </Link>
            .
          </p>
        </section>

        {/* ===== Mini-FAQ ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-3">
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-bold">FAQ</span>
              </div>
              <h2 className="text-2xl font-extrabold text-primary">
                Häufige Fragen zum Fahrzeug jetzt online abmelden
              </h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  q: 'Wie lange dauert Fahrzeug jetzt online abmelden?',
                  a: 'In der Regel nur wenige Minuten – egal ob Sie ein Auto online abmelden, ein KFZ online abmelden oder ein Motorrad online abmelden. Sie erhalten die amtliche Bestätigung sofort per E-Mail oder WhatsApp.',
                },
                {
                  q: 'Welche Fahrzeuge kann ich online abmelden?',
                  a: 'Sie können bei uns Fahrzeug jetzt online abmelden für alle Typen: PKW, LKW, Motorrad, Anhänger und Quad. Unser Service deckt jede Zulassungsart ab – offiziell über das KBA.',
                },
                {
                  q: 'Muss ich Originale einschicken, um Auto online abmelden zu können?',
                  a: 'Nein. Auto online abmelden und KFZ online abmelden funktionieren vollständig digital. Fotos vom Fahrzeugschein und den Kennzeichen reichen aus.',
                },
                {
                  q: 'Was passiert mit dem Kennzeichen nach der Online-Abmeldung?',
                  a: 'Nach dem Fahrzeug jetzt online abmelden bleibt das Kennzeichen 3–11 Tage gesperrt. Danach kann es neu vergeben oder reserviert werden – z. B. für eine neue KFZ Online-Zulassung.',
                },
                {
                  q: 'Kann ich auch ein Motorrad oder Quad online abmelden?',
                  a: 'Ja, Sie können nicht nur Ihr Auto, sondern auch Motorrad online abmelden, Quad online abmelden oder einen Anhänger online abmelden – alles über dasselbe Formular.',
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="group border border-gray-200 rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-5 hover:bg-gray-50 transition-colors font-bold text-gray-900">
                    {q}
                    <span className="w-8 h-8 rounded-full bg-primary/10 group-open:bg-primary group-open:text-white text-primary flex items-center justify-center flex-shrink-0 ml-3 transition-all">
                      <svg
                        className="w-4 h-4 group-open:rotate-180 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA: Auto online anmelden ===== */}
        <section className="max-w-4xl mx-auto px-4 mt-12 mb-4">
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-8 md:p-10 border border-accent/20 text-center">
            <CheckCircle className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-primary mb-2">Auch Fahrzeug anmelden?</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Nach der erfolgreichen Abmeldung können Sie bei uns auch ganz bequem Ihr Fahrzeug oder
              Auto online anmelden – schnell &amp; offiziell.
            </p>
            <Link
              href="/product/auto-online-anmelden"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Jetzt Auto online anmelden
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
        </div>}{/* end additional content */}
      </main>
    </>
  );
}
