import Link from 'next/link';
import {
  CheckCircle,
  Shield,
  Clock,
  Lightbulb,
  Star,
  MailCheck,
  BadgeEuro,
} from 'lucide-react';
import DynamicContact from './DynamicContact';

interface HeroProps {
  abmeldungPrice?: string;
  anmeldungPrice?: string;
}

export default function Hero({
  abmeldungPrice = '19,70 €',
  anmeldungPrice = '99,70 €',
}: HeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-dark via-primary-900 to-dark"
      aria-labelledby="hero-title"
    >
      {/* Background pattern */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute right-20 top-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 md:pb-20 md:pt-28 lg:px-8 lg:pb-18 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                <Shield className="h-3.5 w-3.5" />
                Offiziell · Bundesweit · Sicher
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/15 px-3 py-1.5 text-xs font-bold text-accent backdrop-blur">
                <BadgeEuro className="h-3.5 w-3.5" />
                Ab {abmeldungPrice}
              </span>
            </div>

            <h1
              id="hero-title"
              className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl"
            >
              Auto online abmelden – schnell & offiziell
            </h1>

            <p className="mb-8 max-w-lg text-lg font-medium text-white/80 md:text-xl">
              Jetzt offiziell ab {abmeldungPrice}. Kein Ausweis nötig. Bestätigung direkt per
              E-Mail.
            </p>

            {/* Feature list */}
            <ul className="mb-8 space-y-3">
              {[
                { icon: Clock, text: '24/7 möglich – ohne Termin bei der Zulassungsstelle' },
                { icon: MailCheck, text: 'Offizielle Bestätigung direkt per E-Mail' },
                { icon: CheckCircle, text: 'Steuer & Versicherung werden automatisch informiert' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                  <span className="text-sm text-white/90 md:text-base">{text}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/product/fahrzeugabmeldung"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-lg font-extrabold text-primary transition-all hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-xl hover:shadow-accent/30"
              >
                Jetzt abmelden — {abmeldungPrice}
              </Link>

              <Link
                href="/product/auto-online-anmelden"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-6 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10"
              >
                KFZ online anmelden
              </Link>
            </div>

            {/* Trust badge */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur animate-fade-in">
              <div className="flex items-center gap-1" aria-label="5 von 5 Sterne">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div>
                <span className="text-sm font-bold text-white">5.0</span>
                <span className="ml-1 text-xs text-white/60">
                  Google · Bestbewerteter Service 2026
                </span>
              </div>
            </div>
          </div>

          {/* Right side: Info card */}
          <div className="hidden animate-fade-in-right lg:block">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
              <h2 className="mb-2 text-xl font-bold text-accent">Steuer & Sicherheit</h2>

              <p className="mb-6 text-sm text-white/70">
                Wichtig ist die offizielle Bestätigung. Danach werden die zuständigen Stellen
                automatisch informiert.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: 'Kfz-Steuer endet',
                    desc: 'ab dem Tag der offiziellen Bestätigung.',
                  },
                  {
                    title: 'Versicherung & Hauptzollamt',
                    desc: 'werden automatisch informiert.',
                  },
                  {
                    title: 'E-Mail & Telefon',
                    desc: 'nutzen wir nur für Bestätigung und Hilfe bei Rückfragen.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-green-400" />
                    <div>
                      <span className="text-sm font-semibold text-white">{item.title}</span>
                      <span className="text-sm text-white/60"> {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <DynamicContact />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tip bar */}
      <div className="border-t border-white/10 bg-white/5 py-3 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-white/60">
            <Lightbulb className="mr-1 inline-block h-4 w-4 text-accent" />
            Sicherheitscode schlecht lesbar? Einfach Foto per WhatsApp senden – wir prüfen kostenlos vor dem Start.
          </p>
        </div>
      </div>
    </section>
  );
}
