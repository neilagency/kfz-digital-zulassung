import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface PricingBoxProps {
  price?: string;
  paymentMethods?: string[];
}

export default function PricingBox({ price = '19,70 €', paymentMethods = [] }: PricingBoxProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary-700 to-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left: Features */}
            <div className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-6">
                Fahrzeug online abmelden
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  'Offizielle Bestätigung als PDF',
                  'Steuer & Versicherung automatisch informiert',
                  '24/7 verfügbar – auch Wochenende',
                  'Kein Termin, keine Registrierung',
                  'Kostenloser Experten-Support',
                  '100% Geld-zurück-Garantie',
                  'Bundesweit gültig',
                  'KBA §34 FZV registriert',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Price CTA */}
            <div className="bg-primary p-8 md:p-12 flex flex-col items-center justify-center text-center">
              <p className="text-white/80 text-sm font-medium mb-2">Alle Gebühren inklusive</p>
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-2">
                {price}
              </div>
              <p className="text-white/60 text-sm mb-8">Einmaliger Festpreis · Keine versteckten Kosten</p>

              <Link
                href="/product/fahrzeugabmeldung"
                className="w-full max-w-xs bg-accent hover:bg-accent-600 text-primary font-extrabold py-4 px-8 rounded-full text-lg transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 text-center block"
              >
                Jetzt abmelden
              </Link>

              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {paymentMethods.slice(0, 4).map((method: string) => (
                  <span key={method} className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
