import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Clock, ChevronRight, Shield, Mail, Phone } from 'lucide-react';
import { getSiteSettings } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Bestellung erfolgreich',
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; status?: string }>;
}) {
  const { order, status } = await searchParams;
  const isPending = status === 'pending';
  const settings = await getSiteSettings();

  return (
    <main className="pb-20 min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-32 pb-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-6">
            {isPending ? (
              <Clock className="w-10 h-10 text-yellow-400" />
            ) : (
              <CheckCircle className="w-10 h-10 text-accent" />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {isPending ? 'Bestellung wird bearbeitet' : 'Bestellung erfolgreich!'}
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            {isPending
              ? 'Ihre Zahlung wird noch verarbeitet. Sie erhalten eine Bestätigung per E-Mail, sobald die Zahlung eingegangen ist.'
              : 'Vielen Dank für Ihre Bestellung. Wir haben Ihren Auftrag erhalten und werden ihn umgehend bearbeiten.'}
          </p>
          {order && (
            <p className="text-accent font-bold text-xl mt-4">
              Bestellnummer: #{order}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 mt-10 space-y-6">
        {/* What happens next */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Wie geht es weiter?
          </h2>
          <ol className="space-y-4 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Sie erhalten eine <strong>Bestätigungs-E-Mail</strong> mit allen Details zu Ihrer Bestellung.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Unser Team beginnt nach Eingang <strong>schnellstmöglich mit der Bearbeitung</strong>.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Sie erhalten die <strong>offizielle Bestätigung</strong> direkt per E-Mail oder WhatsApp.</span>
            </li>
          </ol>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Fragen zu Ihrer Bestellung?</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-3 rounded-xl font-semibold hover:bg-accent/20 transition"
            >
              <Phone className="w-4 h-4" />
              WhatsApp Support
            </a>
            <a
              href={settings.phoneLink}
              className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-3 rounded-xl font-semibold hover:bg-primary/20 transition"
            >
              <Phone className="w-4 h-4" />
              {settings.phone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              <Mail className="w-4 h-4" />
              E-Mail schreiben
            </a>
          </div>
        </div>

        {/* Create Account CTA */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10 p-6 md:p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Konto erstellen?</h2>
          <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
            Erstellen Sie ein kostenloses Konto, um Ihre Bestellungen jederzeit einzusehen und den Status zu verfolgen.
          </p>
          <Link
            href="/anmelden"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Kostenloses Konto erstellen
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Back to home */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
          >
            Zurück zur Startseite
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
