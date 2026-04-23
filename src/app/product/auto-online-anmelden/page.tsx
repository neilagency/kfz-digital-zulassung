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

  const options = (() => {
    try {
      return JSON.parse(product?.options || '[]');
    } catch {
      return [];
    }
  })();

  const lowestPrice =
    options.length > 0 ? Math.min(...options.map((o: any) => o.price)) : 124.7;

  const priceStr = lowestPrice.toFixed(2).replace('.', ',');
  const rawTitle = product?.metaTitle || `Auto Online Anmelden – ab ${priceStr} €`;

  const title =
    rawTitle.length > 46
      ? rawTitle.slice(0, 45).replace(/\s+\S*$/, '') + '…'
      : rawTitle;

  return {
    title,
    description:
      product?.metaDescription ||
      'Fahrzeug jetzt online anmelden in 5 Minuten. 10-Tage-Zulassungsbestätigung sofort per PDF. Ohne Termin, ohne Behördengang. Bundesweit gültig.',
    alternates: {
      canonical: `${settings.siteUrl}/product/auto-online-anmelden`,
    },
    openGraph: {
      title: product?.ogTitle || `Auto Online Anmelden – KFZ Zulassung ab ${priceStr} €`,
      description:
        product?.ogDescription ||
        'Fahrzeug jetzt online anmelden – Sofort-PDF, losfahren, Siegel per Post.',
      url: `${settings.siteUrl}/product/auto-online-anmelden`,
      images: [
        {
          url: product?.ogImage || `${settings.siteUrl}/logo.webp`,
          width: 1920,
          height: 1080,
          alt: 'Auto online anmelden',
        },
      ],
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
      ['neuzulassung', 'ummeldung', 'wiederzulassung', 'neuwagen'].includes(o.key)
    )
    .map((o) => ({
      value: o.key,
      label: KEY_TO_LABEL[o.key] || o.name,
      price: o.price,
    }));

  const kennzeichenReserviertOpt = options.find(
    (o) => o.key === 'kennzeichen_reserviert'
  );
  const kennzeichenBestellenOpt = options.find(
    (o) => o.key === 'kennzeichen_bestellen'
  );

  const kennzeichenReserviertPrice = kennzeichenReserviertOpt?.price ?? 24.7;
  const kennzeichenBestellenPrice = kennzeichenBestellenOpt?.price ?? 29.7;

  const neuzulassungPrice =
    options.find((o) => o.key === 'neuzulassung')?.price ?? 124.7;
  const ummeldungPrice =
    options.find((o) => o.key === 'ummeldung')?.price ?? 119.7;

  const fmt = (n: number) => n.toFixed(2).replace('.', ',');

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Auto Online Anmelden – KFZ Zulassung',
    description:
      'Online-Zulassung Ihres Fahrzeugs beim KBA. 10-Tage-PDF sofort, Original per Post in 2–3 Werktagen.',
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
      price: neuzulassungPrice.toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'iKFZ Digital Zulassung UG',
    url: settings.siteUrl,
    logo: `${settings.siteUrl}/logo.svg`,
    telephone: '+4915224999190',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+4915224999190',
      contactType: 'customer service',
      availableLanguage: 'German',
    },
    sameAs: [
      'https://www.facebook.com/ikfzdigitalzulassung',
      'https://www.instagram.com/ikfz_digital_zulassung/',
      'https://www.youtube.com/@ikfzdigitalzulassung',
      'https://www.tiktok.com/@meldino_kfz',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <main className="pb-20 bg-gray-50 min-h-screen">
        <h1 className="sr-only">Auto online anmelden</h1>

        <div className="bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-32 pb-14">
          {showFullContent && (
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent rounded-full px-4 py-1.5 mb-6">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-bold">
                  i-Kfz &ndash; Offiziell über das KBA
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                KFZ jetzt online anmelden
                <br />
                <span className="text-accent">in 5 Minuten erledigt!</span>
              </h1>

              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Nach der Anmeldung erhalten Sie sofort Ihre 10-Tage-Zulassungsbestätigung
                (PDF) – einfach ausdrucken und losfahren.
              </p>

              <p className="text-white/50 text-sm mt-3 max-w-xl mx-auto">
                Ihr Wunschkennzeichen (ungestempelt) können Sie direkt anbringen.
                Original-Dokumente &amp; Siegel folgen automatisch per Post in 2–3 Werktagen.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-8">
                {[
                  { icon: FileCheck, text: '10-Tage-PDF sofort per E-Mail' },
                  { icon: Shield, text: 'Amtlich über i-Kfz / KBA' },
                  { icon: Truck, text: 'Siegel & Dokumente per Post' },
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

        <div id="anmeldeformular" className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
          <RegistrationForm
            serviceOptions={serviceFormOptions.length > 0 ? serviceFormOptions : undefined}
            kennzeichenReserviertPrice={kennzeichenReserviertPrice}
            kennzeichenBestellenPrice={kennzeichenBestellenPrice}
            contactPhone={'+49 1522 4999190'}
            contactPhoneLink="tel:+4915224999190"
            contactWhatsapp={settings.whatsapp}
            contactEmail={settings.email}
          />
        </div>

        {showFullContent && (
          <div>
            <section className="max-w-4xl mx-auto px-4 mt-10">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <strong className="text-primary">5.0</strong> – Bestbewerteter Service 2026 ·
                  verifiziert von Trustindex
                </p>
              </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 mt-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="#anmeldeformular"
                  className="group relative bg-gradient-to-br from-primary to-primary-700 text-white rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/20 transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
                  <FileCheck className="w-8 h-8 mb-3 text-accent" />
                  <h3 className="text-lg font-bold mb-1">Variante 1: Formular ausfüllen</h3>
                  <p className="text-white/70 text-sm">
                    Fahrzeug jetzt online anmelden – Formular starten
                  </p>
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
                    Fahrzeug jetzt online anmelden per WhatsApp
                  </p>
                  <ArrowRight className="w-5 h-5 mt-3 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 mt-12">
              <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-4">
                  Fahrzeug jetzt online anmelden – einfach, offiziell &amp; schnell
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Mit unserem Service können Sie Ihr <strong>Fahrzeug jetzt online anmelden</strong>{' '}
                  – ganz ohne Termin oder Behörde. Nach der Anmeldung erhalten Sie sofort Ihre
                  10-Tage-Zulassungsbestätigung als PDF zum Ausdrucken. Bringen Sie Ihr
                  Kennzeichen an und fahren Sie direkt los. Die amtlichen Siegel kommen
                  automatisch in 2–3 Werktagen per Post.
                </p>
              </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 mt-12">
              <h2 className="text-2xl font-extrabold text-primary mb-8 text-center">
                So funktioniert Fahrzeug jetzt online anmelden
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    icon: Send,
                    title: 'Daten einreichen',
                    text: 'Formular ausfüllen oder per WhatsApp senden, um Ihr Fahrzeug jetzt online anmelden.',
                    num: '1',
                  },
                  {
                    icon: ScanLine,
                    title: 'Unterlagen fotografieren',
                    text: 'Fahrzeugschein & Fahrzeugbrief mit Sicherheitscodes – notwendig für die Zulassung.',
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
                    text: 'Online-Verifizierung dauert nur wenige Minuten – dann wird Ihr Fahrzeug freigeschaltet.',
                    num: '4',
                  },
                  {
                    icon: Banknote,
                    title: 'Zahlung',
                    text: 'PayPal, Karte oder Überweisung. Screenshot genügt für Sofortstart.',
                    num: '5',
                  },
                  {
                    icon: FileCheck,
                    title: 'Fertig – losfahren!',
                    text: 'PDF-Zulassungsbestätigung per Mail. Siegel & Kennzeichen folgen per Post.',
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

            <section className="max-w-4xl mx-auto px-4 mt-12">
              <div className="bg-gradient-to-br from-primary to-primary-800 rounded-2xl p-8 md:p-10 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-10 -mb-10" />

                <div className="relative">
                  <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
                    <Euro className="w-7 h-7 text-accent" />
                    Preise &amp; Leistungen
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                        <p className="text-white/70 text-sm mb-1 whitespace-pre-line">{label}</p>
                        <p className="text-2xl font-extrabold text-accent">{price}</p>
                        <p className="text-xs text-white/50 mt-1">{sub}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-white/60 mt-5">
                    <strong className="text-white/80">Hinweis:</strong> Bitte senden Sie Ihre
                    Fotos (Fahrzeugschein, Fahrzeugbrief) per WhatsApp oder E-Mail.
                  </p>
                </div>
              </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 mt-12">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-primary/5 px-8 py-5 border-b border-gray-100">
                  <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent" />
                    Wichtig für Fahrzeug jetzt online anmelden
                  </h2>
                </div>

                <div className="p-8">
                  <ul className="space-y-3">
                    {[
                      'Teil II (Fahrzeugbrief) mit Sicherheitscode erforderlich.',
                      'Alle Daten müssen mit Ausweis übereinstimmen.',
                      'Optional: Kennzeichen direkt bei uns bestellen (29,70 €) oder beim Schildermacher prägen.',
                      'Ohne Codes ist Fahrzeug jetzt online anmelden nicht möglich.',
                    ].map((note) => (
                      <li key={note} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 mt-12">
              <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-extrabold text-primary mb-6">
                  Die i-Kfz Online-Zulassung: So fahren Sie sofort los
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Die internetbasierte Fahrzeugzulassung (i-Kfz) läuft amtlich über das System des
                  Kraftfahrt-Bundesamts (KBA). Sie sparen sich den Termin bei der Zulassungsstelle
                  und erledigen alles digital.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    {
                      icon: FileText,
                      title: '1. Vorbereiten',
                      text: 'Personalausweis (mit Online-Funktion), Zulassungsbescheinigung Teil I & II (mit Sicherheitscodes), eVB-Nummer und IBAN bereithalten.',
                    },
                    {
                      icon: Send,
                      title: '2. Online beantragen',
                      text: 'Formular ausfüllen, Identität digital bestätigen, Fahrzeugdaten & Codes eintragen. Wunschkennzeichen angeben (falls reserviert).',
                    },
                    {
                      icon: FileCheck,
                      title: '3. Freigabe & PDF',
                      text: 'Nach automatischer Prüfung und Zahlung erhalten Sie den vorläufigen Zulassungsnachweis (PDF, 10 Tage gültig) per E-Mail.',
                    },
                    {
                      icon: Truck,
                      title: '4. Losfahren!',
                      text: 'PDF mitführen und ungestempeltes Kennzeichen anbringen – so dürfen Sie bis zu 10 Tage fahren. Original-Dokumente kommen in 2–3 Werktagen per Post.',
                    },
                  ].map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex items-start gap-4 bg-primary/5 rounded-xl p-5">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 mb-1">{title}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                  <p className="text-sm text-amber-800">
                    <strong>Wichtig:</strong> Das Kennzeichen muss physisch am Fahrzeug angebracht
                    sein (ungestempelt ist erlaubt). Handschriftliche Zettel sind nicht zulässig.
                  </p>
                </div>
              </div>
            </section>

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

            <section className="max-w-4xl mx-auto px-4 mt-12">
              <div className="bg-gradient-to-r from-dark to-primary-900 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <h2 className="text-xl font-extrabold mb-2">Hilfe &amp; Live-Support</h2>
                  <p className="text-white/60 text-sm mb-6">
                    Haben Sie Fragen? Wir helfen sofort – persönlich und direkt.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a
                      href="tel:+4915224999190"
                      className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-4 transition-colors"
                    >
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Telefon</p>
                        <p className="font-bold text-sm">+49 1522 4999190</p>
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
                Hinweis: Ihre Daten werden nur für die Zulassung verarbeitet. Details siehe{' '}
                <Link href="/datenschutzhinweise" className="text-primary hover:underline">
                  Datenschutzhinweise
                </Link>
                .
              </p>
            </section>

            <section className="max-w-4xl mx-auto px-4 mt-12">
              <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-3">
                    <HelpCircle className="w-4 h-4" />
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
                      a: 'Sofort! Nach Prüfung erhalten Sie ein 10-Tage-PDF zum Ausdrucken. Mit dem ungestempelten Kennzeichen am Fahrzeug dürfen Sie direkt losfahren. Die Original-Plaketten kommen in 2–3 Werktagen per Post.',
                    },
                    {
                      q: 'Was benötige ich für die Online-Zulassung?',
                      a: 'Personalausweis (mit Online-Funktion) oder Aufenthaltstitel, Fahrzeugschein (Teil I) mit Sicherheitscode, Fahrzeugbrief (Teil II) mit Sicherheitscode, eVB-Nummer Ihrer Versicherung und IBAN für die KFZ-Steuer.',
                    },
                    {
                      q: 'Was kostet die Online-Anmeldung?',
                      a: `Die Neuzulassung kostet ab ${fmt(neuzulassungPrice)} €, Ummeldung ab ${fmt(ummeldungPrice)} €. Optional: Wunschkennzeichen +${fmt(kennzeichenReserviertPrice)} €, Kennzeichen-Bestellung mit Versand +${fmt(kennzeichenBestellenPrice)} €.`,
                    },
                    {
                      q: 'Kann ich mein Wunschkennzeichen behalten?',
                      a: 'Ja! Wählen Sie bei der Bestellung „Reserviertes Kennzeichen". Wenn Sie Ihr Kennzeichen bereits reserviert haben, tragen Sie es einfach ein. Alternativ können Sie sich auch automatisch ein Kennzeichen zuteilen lassen.',
                    },
                    {
                      q: 'Muss ich zur Zulassungsstelle gehen?',
                      a: 'Nein! Die gesamte Anmeldung läuft über die i-Kfz-Schnittstelle des Kraftfahrt-Bundesamts (KBA). Kein Termin, kein Behördenbesuch nötig – alles 100% digital.',
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
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
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

            <section className="max-w-4xl mx-auto px-4 mt-12 mb-4">
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-8 md:p-10 border border-accent/20 text-center">
                <CheckCircle className="w-10 h-10 text-accent mx-auto mb-4" />
                <h2 className="text-xl font-extrabold text-primary mb-2">
                  Auch Fahrzeug abmelden?
                </h2>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  Sie möchten stattdessen Ihr Fahrzeug abmelden? Auch das geht bequem online – ab
                  nur {pricing.abmeldungPriceFormatted} mit sofortiger Bestätigung.
                </p>

                <Link
                  href="/product/fahrzeugabmeldung"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  Jetzt Auto online abmelden
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
