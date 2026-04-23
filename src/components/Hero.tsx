import Link from 'next/link';
import { CheckCircle, Shield, Clock, Lightbulb, Star } from 'lucide-react';
import DynamicContact from './DynamicContact';

interface HeroProps {
  abmeldungPrice?: string;
  anmeldungPrice?: string;
}

export default function Hero({ abmeldungPrice = '19,70 €' }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-start overflow-hidden bg-gradient-to-br from-dark via-primary-900 to-dark">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pt-28 md:pb-28 lg:pt-24 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-primary/30 backdrop-blur text-white text-xs font-medium px-3 py-1.5 rounded-full border border-primary/40">
                <Shield className="w-3.5 h-3.5" />
                Offiziell · Bundesweit · Sicher
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
  Auto online abmelden in 2 Minuten
</h1>

            <h2 className="text-lg md:text-xl text-white/80 font-medium mb-8 max-w-lg">
  Jetzt offiziell ab 19,70 €. Kein Ausweis nötig. Bestätigung direkt per E-Mail.
</h2>

            {/* Feature list */}
            <ul className="space-y-3 mb-8">
              {[
                { icon: Clock, text: '24/7 möglich' },
                { icon: CheckCircle, text: 'Offizielle Bestätigung direkt per E-Mail' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-white/90 text-sm md:text-base">{text}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/product/fahrzeugabmeldung"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-600 text-primary font-extrabold px-8 py-4 rounded-full text-lg transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
              >
                Jetzt abmelden — {abmeldungPrice}
              </Link>
              <Link
                href="/product/auto-online-anmelden"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-accent hover:bg-accent/10 text-white font-semibold px-6 py-4 rounded-full text-base transition-all hover:-translate-y-0.5"
              >
                Auch Auto anmelden
              </Link>
            </div>

            {/* Trust badge */}
            <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl px-4 py-3 animate-fade-in">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div>
                <span className="text-white font-bold text-sm">5.0</span>
                <span className="text-white/60 text-xs ml-1">Google · Bestbewerteter Service 2026</span>
              </div>
            </div>
          </div>

          {/* Right side: Info card */}
          <div className="hidden lg:block animate-fade-in-right">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-bold text-accent mb-2">Steuer & Sicherheit</h3>
              <p className="text-white/70 text-sm mb-6">Wichtig ist nur die offizielle Bestätigung.</p>

              <div className="space-y-4">
                {[
                  { color: 'bg-green-400', title: 'Kfz-Steuer endet', desc: 'ab dem Tag der offiziellen Bestätigung.' },
                  { color: 'bg-green-400', title: 'Versicherung & Hauptzollamt', desc: 'werden automatisch informiert.' },
                  { color: 'bg-green-400', title: 'E-Mail & Telefon', desc: 'nutzen wir nur für Bestätigung und Hilfe bei Rückfragen.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0 mt-1.5`} />
                    <div>
                      <span className="text-white font-semibold text-sm">{item.title}</span>
                      <span className="text-white/60 text-sm"> {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <DynamicContact />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tip bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur border-t border-white/10 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/60 text-sm">
            <Lightbulb className="w-4 h-4 inline-block mr-1 text-accent" />
            Code schlecht lesbar? Einfach Foto per WhatsApp senden – wir prüfen kostenlos.
          </p>
        </div>
      </div>
    </section>
  );
}
