import { Metadata, Viewport } from 'next';
import RegistrationForm from '@/components/RegistrationForm';
import { getProductBySlug, getSiteSettings, getHomepagePricing } from '@/lib/db';
import {
  Shield,
  CheckCircle,
  CreditCard,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  ScanLine,
  Send,
  Banknote,
  FileCheck,
  Star,
  ArrowRight,
  Euro,
  Wallet,
  HelpCircle,
  Fingerprint,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug('auto-online-anmelden');
  const settings = await getSiteSettings();

  const baseUrl = settings.siteUrl.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/product/auto-online-anmelden`;

  const options = (() => {
    try {
      return JSON.parse(product?.options || '[]');
    } catch {
      return [];
    }
  })();

  const lowestPrice =
    options.length > 0 ? Math.min(...options.map((o: any) => o.price)) : 99.7;

  const priceStr = lowestPrice.toFixed(2).replace('.', ',');

  const rawTitle =
    product?.metaTitle || `Auto online anmelden – ab ${priceStr} €`;

  const title =
    rawTitle.length > 60
      ? rawTitle.slice(0, 59).replace(/\s+\S*$/, '') + '…'
      : rawTitle;

  const description =
    product?.metaDescription ||
    'Fahrzeug online anmelden, ummelden oder wieder zulassen. Digital vorbereitet, persönliche Hilfe per WhatsApp und bundesweit nutzbar.';

  const ogTitle =
    product?.ogTitle || `Auto online anmelden – ab ${priceStr} €`;

  const ogDescription =
    product?.ogDescription ||
    'Fahrzeug online anmelden, ummelden oder wieder zulassen. Digital vorbereitet, bundesweit nutzbar und mit persönlicher Hilfe.';

  const ogImage = product?.ogImage
    ? product.ogImage.startsWith('http')
      ? product.ogImage
      : `${baseUrl}${product.ogImage.startsWith('/') ? product.ogImage : `/${product.ogImage}`}`
    : `${baseUrl}/logo.webp`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: settings.siteName,
      type: 'website',
      locale: 'de_DE',
      images: [
        {
          url: ogImage,
          width: 1920,
          height: 1080,
          alt: 'Auto online anmelden – Online Auto Abmelden',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    other: {
      'next-size-adjust': '',
    },
  };
}

export default async function AutoOnlineAnmeldenPage() {
  const showFullContent = false;

  const [product, settings, pricing] = await Promise.all([
    getProductBySlug('auto-online-anmelden'),
    getSiteSettings(),
    getHomepagePricing(),
  ]);

  const options: { name: string; price: number; key: string }[] = (() => {
    try {
      return JSON.parse(product?.options || '[]');
    } catch {
      return [];
    }
  })();

  const KEY_TO_LABEL: Record<string, string> = {
    neuzulassung: 'Anmelden',
    ummeldung: 'Ummelden',
    wiederzulassung: 'Wiederzulassen',
    neuwagen: 'Neuwagen Zulassung',
  };

  const serviceFormOptions = options
    .filter((o) =>
      ['neuzulassung', 'ummeldung', 'wiederzulassung', 'neuwagen'].includes(o.key),
    )
    .map((o) => ({
      value: o.key,
      label: KEY_TO_LABEL[o.key] || o.name,
      price: o.price,
    }));

  const kennzeichenReserviertOpt = options.find(
    (o) => o.key === 'kennzeichen_reserviert',
  );

  const kennzeichenBestellenOpt = options.find(
    (o) => o.key === 'kennzeichen_bestellen',
  );

  const kennzeichenReserviertPrice = kennzeichenReserviertOpt?.price ?? 24.7;
  const kennzeichenBestellenPrice = kennzeichenBestellenOpt?.price ?? 29.7;

  const neuzulassungPrice =
    options.find((o) => o.key === 'neuzulassung')?.price ?? 124.7;

  const ummeldungPrice =
    options.find((o) => o.key === 'ummeldung')?.price ?? 119.7;

  const fmt = (n: number) => n.toFixed(2).replace('.', ',');

  const baseUrl = settings.siteUrl.replace(/\/$/, '');
  const pageUrl = `${baseUrl}/product/auto-online-anmelden`;

  const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: 'Auto online anmelden',
      description:
        'Fahrzeug online anmelden, ummelden oder wieder zulassen. Online-Zulassung mit persönlicher Hilfe, bundesweit nutzbar und digital vorbereitet.',
      inLanguage: 'de-DE',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${baseUrl}#website`,
        url: baseUrl,
        name: settings.siteName,
        publisher: {
          '@id': `${baseUrl}#organization`,
        },
      },
      about: {
        '@id': `${pageUrl}#service`,
      },
      breadcrumb: {
        '@id': `${pageUrl}#breadcrumb`,
      },
    },
    {
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: 'Auto online anmelden',
      alternateName: [
        'KFZ online anmelden',
        'Fahrzeug online anmelden',
        'Auto online zulassen',
        'KFZ online zulassen',
        'Fahrzeug online zulassen',
        'Online Zulassungsdienst',
        'KFZ Zulassungsservice',
        'Digitale Fahrzeugzulassung',
        'Online Ummeldung',
        'Wiederzulassung online',
      ],
      description:
        'Online-Zulassung Ihres Fahrzeugs. Anmeldung, Ummeldung oder Wiederzulassung digital vorbereiten. Persönlicher Support per Telefon und WhatsApp.',
      serviceType: 'Digitale Fahrzeugzulassung',
      category: 'KFZ-Zulassung',
      url: pageUrl,
      provider: {
        '@type': 'Organization',
        '@id': `${baseUrl}#organization`,
        name: settings.siteName,
        url: baseUrl,
      },
      areaServed: {
        '@type': 'Country',
        name: 'Deutschland',
      },
      audience: {
        '@type': 'Audience',
        audienceType: 'Fahrzeughalter in Deutschland',
      },
      offers: {
        '@type': 'Offer',
        '@id': `${pageUrl}#offer`,
        url: pageUrl,
        price: neuzulassungPrice.toFixed(2),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          '@id': `${baseUrl}#organization`,
        },
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Startseite',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Auto online anmelden',
          item: pageUrl,
        },
      ],
    },
  ],
};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-gray-50 pb-20">
        {!showFullContent && <h1 className="sr-only">Auto online anmelden</h1>}

        <div className="bg-gradient-to-br from-dark via-primary-900 to-dark pb-14 pt-28 md:pt-32">
          {showFullContent && (
            <div className="mx-auto max-w-4xl px-4 text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-accent">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-bold">
                  i-Kfz &ndash; Offiziell über das KBA
                </span>
              </div>

              <h1 className="mb-4 text-3xl font-extrabold text-white md:text-5xl">
                KFZ jetzt online anmelden
                <br />
                <span className="text-accent">in 5 Minuten erledigt!</span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg text-white/70">
                Nach der Anmeldung erhalten Sie sofort Ihre 10-Tage-Zulassungsbestätigung
                als PDF – einfach ausdrucken und losfahren.
              </p>

              <p className="mx-auto mt-3 max-w-xl text-sm text-white/50">
                Ihr Wunschkennzeichen können Sie direkt anbringen. Original-Dokumente und
                Siegel folgen automatisch per Post.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {[
                  { icon: FileCheck, text: '10-Tage-PDF sofort per E-Mail' },
                  { icon: Shield, text: 'Amtlich über i-Kfz / KBA' },
                  { icon: Truck, text: 'Siegel & Dokumente per Post' },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"
                  >
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-white/90">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div id="anmeldeformular" className="relative z-10 mx-auto -mt-8 max-w-4xl px-4">
          <RegistrationForm
            serviceOptions={serviceFormOptions.length > 0 ? serviceFormOptions : undefined}
            kennzeichenReserviertPrice={kennzeichenReserviertPrice}
            kennzeichenBestellenPrice={kennzeichenBestellenPrice}
            contactPhone="+49 1522 4999190"
            contactPhoneLink="tel:+4915224999190"
            contactWhatsapp={settings.whatsapp}
            contactEmail={settings.email}
          />
        </div>

        {showFullContent && (
          <div>
            <section className="mx-auto mt-10 max-w-4xl px-4">
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <strong className="text-primary">5.0</strong> – Bestbewerteter Service 2026 ·
                  verifiziert von Trustindex
                </p>
              </div>
            </section>

            <section className="mx-auto mt-12 max-w-4xl px-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a
                  href="#anmeldeformular"
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-700 p-6 text-white transition-all hover:shadow-xl hover:shadow-primary/20"
                >
                  <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-white/5" />
                  <FileCheck className="mb-3 h-8 w-8 text-accent" />
                  <h3 className="mb-1 text-lg font-bold">Variante 1: Formular ausfüllen</h3>
                  <p className="text-sm text-white/70">
                    Fahrzeug jetzt online anmelden – Formular starten
                  </p>
                  <ArrowRight className="mt-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>

                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] p-6 text-white transition-all hover:shadow-xl hover:shadow-[#25D366]/20"
                >
                  <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-white/5" />
                  <MessageCircle className="mb-3 h-8 w-8" />
                  <h3 className="mb-1 text-lg font-bold">Variante 2: Per WhatsApp</h3>
                  <p className="text-sm text-white/70">
                    Fahrzeug jetzt online anmelden per WhatsApp
                  </p>
                  <ArrowRight className="mt-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </section>

            <section className="mx-auto mt-12 max-w-4xl px-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
                <h2 className="mb-4 text-2xl font-extrabold text-primary md:text-3xl">
                  Fahrzeug jetzt online anmelden – einfach, offiziell &amp; schnell
                </h2>
                <p className="leading-relaxed text-gray-600">
                  Mit unserem Service können Sie Ihr <strong>Fahrzeug jetzt online anmelden</strong>{' '}
                  – ganz ohne Termin oder Behörde. Nach der Anmeldung erhalten Sie sofort Ihre
                  10-Tage-Zulassungsbestätigung als PDF zum Ausdrucken. Bringen Sie Ihr Kennzeichen
                  an und fahren Sie direkt los. Die amtlichen Siegel kommen automatisch per Post.
                </p>
              </div>
            </section>

            <section className="mx-auto mt-12 max-w-4xl px-4">
              <h2 className="mb-8 text-center text-2xl font-extrabold text-primary">
                So funktioniert Fahrzeug jetzt online anmelden
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: Send,
                    title: 'Daten einreichen',
                    text: 'Formular ausfüllen oder per WhatsApp senden, um Ihr Fahrzeug online anzumelden.',
                    num: '1',
                  },
                  {
                    icon: ScanLine,
                    title: 'Unterlagen fotografieren',
                    text: 'Fahrzeugschein und Fahrzeugbrief mit Sicherheitscodes vorbereiten.',
                    num: '2',
                  },
                  {
                    icon: FileText,
                    title: 'eVB-Nummer & IBAN',
                    text: 'Versicherung und Kfz-Steuer einfach angeben.',
                    num: '3',
                  },
                  {
                    icon: Fingerprint,
                    title: 'Identität bestätigen',
                    text: 'Online-Verifizierung durchführen, damit Ihr Fahrzeug freigeschaltet werden kann.',
                    num: '4',
                  },
                  {
                    icon: Banknote,
                    title: 'Zahlung',
                    text: 'PayPal, Karte oder Überweisung. Bei Überweisung kann ein Screenshot helfen.',
                    num: '5',
                  },
                  {
                    icon: FileCheck,
                    title: 'Fertig – losfahren!',
                    text: 'PDF-Zulassungsbestätigung per Mail. Siegel und Dokumente folgen per Post.',
                    num: '6',
                  },
                ].map(({ icon: Icon, title, text, num }) => (
                  <div
                    key={num}
                    className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="absolute right-4 top-4 text-5xl font-extrabold text-primary/5 transition-colors group-hover:text-primary/10">
                      {num}
                    </div>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mx-auto mt-12 max-w-4xl px-4">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-800 p-8 text-white md:p-10">
                <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/5" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/5" />

                <div className="relative">
                  <h2 className="mb-6 flex items-center gap-3 text-2xl font-extrabold">
                    <Euro className="h-7 w-7 text-accent" />
                    Preise &amp; Leistungen
                  </h2>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        label: 'Fahrzeug anmelden',
                        price: `ab ${fmt(neuzulassungPrice)} €`,
                        sub: 'Neuzulassung',
                      },
                      {
                        label: 'Ummeldung',
                        price: `ab ${fmt(ummeldungPrice)} €`,
                        sub: 'Halterwechsel',
                      },
                      {
                        label: 'Kennzeichen\ninkl. Versand',
                        price: `${fmt(kennzeichenBestellenPrice)} €`,
                        sub: 'Optional',
                      },
                      {
                        label: 'Wunschkennzeichen\nPIN',
                        price: `${fmt(kennzeichenReserviertPrice)} €`,
                        sub: 'Optional',
                      },
                    ].map(({ label, price, sub }) => (
                      <div key={label} className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                        <p className="mb-1 whitespace-pre-line text-sm text-white/70">{label}</p>
                        <p className="text-2xl font-extrabold text-accent">{price}</p>
                        <p className="mt-1 text-xs text-white/50">{sub}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-sm text-white/60">
                    <strong className="text-white/80">Hinweis:</strong> Bitte senden Sie Ihre Fotos
                    per WhatsApp oder E-Mail.
                  </p>
                </div>
              </div>
            </section>

            <section className="mx-auto mt-12 max-w-4xl px-4">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-primary/5 px-8 py-5">
                  <h2 className="flex items-center gap-2 text-xl font-extrabold text-primary">
                    <Shield className="h-5 w-5 text-accent" />
                    Wichtig für Fahrzeug jetzt online anmelden
                  </h2>
                </div>

                <div className="p-8">
                  <ul className="space-y-3">
                    {[
                      'Teil II (Fahrzeugbrief) mit Sicherheitscode erforderlich.',
                      'Alle Daten müssen korrekt und vollständig sein.',
                      'Optional: Kennzeichen direkt bei uns bestellen oder beim Schildermacher prägen.',
                      'Ohne Sicherheitscodes ist die Online-Zulassung nicht möglich.',
                    ].map((note) => (
                      <li key={note} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                        <span className="text-gray-600">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="mx-auto mt-12 max-w-4xl px-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
                <h2 className="mb-6 text-2xl font-extrabold text-primary">
                  Die i-Kfz Online-Zulassung: So fahren Sie sofort los
                </h2>

                <p className="mb-6 leading-relaxed text-gray-600">
                  Die internetbasierte Fahrzeugzulassung läuft amtlich über das digitale System.
                  Sie sparen sich den Termin bei der Zulassungsstelle und erledigen viele Schritte
                  bequem online.
                </p>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {[
                    {
                      icon: FileText,
                      title: '1. Vorbereiten',
                      text: 'Ausweis, Zulassungsbescheinigung Teil I und II, eVB-Nummer und IBAN bereithalten.',
                    },
                    {
                      icon: Send,
                      title: '2. Online beantragen',
                      text: 'Formular ausfüllen, Identität digital bestätigen und Fahrzeugdaten eintragen.',
                    },
                    {
                      icon: FileCheck,
                      title: '3. Freigabe & PDF',
                      text: 'Nach Prüfung und Zahlung erhalten Sie den vorläufigen Zulassungsnachweis per E-Mail.',
                    },
                    {
                      icon: Truck,
                      title: '4. Losfahren',
                      text: 'PDF mitführen und Kennzeichen anbringen. Original-Dokumente folgen per Post.',
                    },
                  ].map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex items-start gap-4 rounded-xl bg-primary/5 p-5">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="mb-1 font-bold text-gray-900">{title}</p>
                        <p className="text-sm leading-relaxed text-gray-600">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Wichtig:</strong> Das Kennzeichen muss physisch am Fahrzeug angebracht
                    sein. Handschriftliche Zettel sind nicht zulässig.
                  </p>
                </div>
              </div>
            </section>

            <section className="mx-auto mt-12 max-w-4xl px-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold text-primary">
                  <Wallet className="h-5 w-5 text-accent" />
                  Zahlungsmöglichkeiten
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                    <div key={title} className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{title}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mx-auto mt-12 max-w-4xl px-4">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-dark to-primary-900 p-8 text-white md:p-10">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-accent/10" />
                <div className="relative">
                  <h2 className="mb-2 text-xl font-extrabold">Hilfe &amp; Live-Support</h2>
                  <p className="mb-6 text-sm text-white/60">
                    Haben Sie Fragen? Wir helfen sofort – persönlich und direkt.
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <a
                      href="tel:+4915224999190"
                      className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/15"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                        <Phone className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Telefon</p>
                        <p className="text-sm font-bold">+49 1522 4999190</p>
                      </div>
                    </a>

                    <a
                      href={settings.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/15"
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
                      className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/15"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/30">
                        <Mail className="h-5 w-5 text-white/80" />
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

            <section className="mx-auto mt-4 max-w-4xl px-4">
              <p className="text-center text-xs text-gray-400">
                Hinweis: Ihre Daten werden nur für die Zulassung verarbeitet. Details siehe{' '}
                <Link href="/datenschutzhinweise" className="text-primary hover:underline">
                  Datenschutzhinweise
                </Link>
                .
              </p>
            </section>

            <section className="mx-auto mt-12 max-w-4xl px-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
                <div className="mb-8 text-center">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-sm font-bold">FAQ</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-primary">
                    Häufige Fragen zum Fahrzeug online anmelden
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      q: 'Wie schnell kann ich nach der Online-Anmeldung fahren?',
                      a: 'Nach erfolgreicher Prüfung erhalten Sie ein vorläufiges PDF. Damit können Sie im erlaubten Rahmen starten, bis die Original-Unterlagen folgen.',
                    },
                    {
                      q: 'Was benötige ich für die Online-Zulassung?',
                      a: 'Sie benötigen in der Regel Ausweis oder Aufenthaltstitel, Fahrzeugschein, Fahrzeugbrief, eVB-Nummer und IBAN für die Kfz-Steuer.',
                    },
                    {
                      q: 'Was kostet die Online-Anmeldung?',
                      a: `Die Neuzulassung kostet ab ${fmt(neuzulassungPrice)} €, Ummeldung ab ${fmt(ummeldungPrice)} €. Optional: Wunschkennzeichen +${fmt(kennzeichenReserviertPrice)} €, Kennzeichen-Bestellung mit Versand +${fmt(kennzeichenBestellenPrice)} €.`,
                    },
                    {
                      q: 'Kann ich mein Wunschkennzeichen behalten?',
                      a: 'Ja. Wenn Sie ein Kennzeichen reserviert haben, können Sie es im Formular angeben. Alternativ kann ein Kennzeichen zugeteilt werden.',
                    },
                    {
                      q: 'Muss ich zur Zulassungsstelle gehen?',
                      a: 'In vielen Fällen ist kein Termin vor Ort nötig. Der Antrag wird digital vorbereitet und weiterverarbeitet.',
                    },
                  ].map(({ q, a }) => (
                    <details
                      key={q}
                      className="group overflow-hidden rounded-xl border border-gray-200 transition-colors hover:border-primary/30"
                    >
                      <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-gray-900 transition-colors hover:bg-gray-50">
                        {q}
                        <span className="ml-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-open:bg-primary group-open:text-white">
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

                      <div className="border-t border-gray-100 px-5 pb-5 pt-4 leading-relaxed text-gray-600">
                        {a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            <section className="mx-auto mb-4 mt-12 max-w-4xl px-4">
              <div className="rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/10 to-primary/10 p-8 text-center md:p-10">
                <CheckCircle className="mx-auto mb-4 h-10 w-10 text-accent" />
                <h2 className="mb-2 text-xl font-extrabold text-primary">
                  Auch Fahrzeug abmelden?
                </h2>
                <p className="mx-auto mb-6 max-w-lg text-gray-600">
                  Sie möchten stattdessen Ihr Fahrzeug abmelden? Auch das geht bequem online – ab
                  nur {pricing.abmeldungPriceFormatted} mit offizieller Bestätigung.
                </p>

                <Link
                  href="/product/fahrzeugabmeldung"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-lg hover:shadow-primary/25"
                >
                  Jetzt Auto online abmelden
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
