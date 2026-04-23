import type { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';
import { getEnabledPaymentMethods, getSiteSettings } from '@/lib/db';
import { Shield, Lock, CheckCircle, Clock, Headphones } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */
export const metadata: Metadata = {
  title: 'Kasse – Sicher bezahlen',
  description:
    'Schließen Sie Ihren Auftrag sicher ab. SSL-verschlüsselt, DSGVO-konform. Bezahlen Sie bequem per PayPal, Kreditkarte, SEPA oder Apple/Google Pay.',
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------ */
/*  Trust features shown above the form                                */
/* ------------------------------------------------------------------ */
const CHECKOUT_FEATURES = [
  {
    icon: Shield,
    title: 'SSL-Verschlüsselung',
    desc: '256-Bit gesicherte Datenübertragung',
  },
  {
    icon: Lock,
    title: 'DSGVO-konform',
    desc: 'Ihre Daten sind sicher & geschützt',
  },
  {
    icon: CheckCircle,
    title: 'Offizielle Bearbeitung',
    desc: 'Sicher und korrekt übermittelt',
  },
  {
    icon: Clock,
    title: 'Sofort-Prüfung',
    desc: 'Direkte Bearbeitung Ihres Auftrags',
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export const revalidate = 60;

export default async function CheckoutPage() {
  const paymentMethods = await getEnabledPaymentMethods();
  const settings = await getSiteSettings();

  return (
    <>
      {/* ============ JSON-LD ============ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Kasse – Sicher bezahlen',
            description:
              'Sichere Bezahlseite für Ihre Bestellung. SSL-verschlüsselt, DSGVO-konform.',
            url: settings.siteUrl + '/rechnung/',
          }),
        }}
      />

      {/* ============ HERO ============ */}
      <section className="relative bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-32 pb-10 md:pb-14 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          {/* Lock watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
            <Lock className="w-[400px] h-[400px] text-white" />
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-sm text-white/40 mb-6">
            <a href="/" className="hover:text-white/70 transition-colors">
              Startseite
            </a>
            <span>/</span>
            <span className="text-white/70">Kasse</span>
          </nav>

          {/* Security badge */}
          <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/20 rounded-full px-4 py-1.5 mb-5">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-accent text-xs font-bold uppercase tracking-wider">
              Sichere Bezahlung
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Kasse
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto">
            Schließen Sie Ihren Auftrag sicher ab – Ihre Daten sind bei uns geschützt.
          </p>
        </div>
      </section>

      {/* ============ TRUST FEATURES BAR ============ */}
      <section className="relative -mt-6 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {CHECKOUT_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/[0.07] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-tight">
                        {feature.title}
                      </p>
                      <p className="text-[11px] text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <main className="pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-14">
          <CheckoutForm paymentMethods={paymentMethods} />
        </div>

        {/* ============ BOTTOM SUPPORT BAR ============ */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-16">
          <div className="bg-gradient-to-r from-primary/[0.04] to-accent/[0.04] rounded-2xl border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Headphones className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Brauchen Sie Hilfe bei der Bestellung?
              </h3>
              <p className="text-sm text-gray-500">
                Unser Support-Team steht Ihnen gerne zur Verfügung – per Telefon, WhatsApp oder
                E-Mail.
              </p>
            </div>
            <a
              href={settings.phoneLink}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              <Headphones className="w-4 h-4" />
              {settings.phone}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
