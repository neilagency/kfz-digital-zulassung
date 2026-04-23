import Image from 'next/image';
import { Lightbulb } from 'lucide-react';
import { STEPS } from '@/lib/constants';

export default function Steps() {
  return (
    <section id="ablauf" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            Online-Auto abmelden – in 6 Schritten
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Der gesamte Prozess dauert nur 2 Minuten. Kein Termin, keine Registrierung nötig.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image for steps that have one */}
              {'image' in step && step.image && (
                <div className="relative w-full aspect-video">
                  <Image
                    src={step.image}
                    alt={('imageAlt' in step && step.imageAlt) || step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    priority={index < 3}
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold text-lg shrink-0 group-hover:bg-accent group-hover:text-primary transition-colors">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>

                {/* Tip or note text for steps 4-6 */}
                {'tip' in step && step.tip && (
                  <p className="mt-3 text-xs text-accent font-semibold flex items-start gap-1.5">
                    <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {step.tip}
                  </p>
                )}
                {'note' in step && step.note && (
                  <p className="mt-3 text-xs text-gray-500 italic leading-relaxed">
                    {step.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
