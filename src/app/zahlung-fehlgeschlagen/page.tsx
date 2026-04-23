import { Metadata } from 'next';
import Link from 'next/link';
import { XCircle, RefreshCw, Phone, Mail, ChevronRight } from 'lucide-react';
import { getSiteSettings } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Zahlung fehlgeschlagen',
  robots: { index: false, follow: false },
};

const FAILURE_MESSAGES: Record<string, string> = {
  insufficient_funds: 'Ihre Karte hat nicht genügend Guthaben. Bitte verwenden Sie eine andere Zahlungsmethode.',
  card_declined: 'Ihre Karte wurde abgelehnt. Bitte kontaktieren Sie Ihre Bank oder verwenden Sie eine andere Karte.',
  card_expired: 'Ihre Karte ist abgelaufen. Bitte verwenden Sie eine gültige Karte.',
  authentication_failed: 'Die 3D-Secure-Authentifizierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.',
  canceled: 'Die Zahlung wurde abgebrochen.',
  expired: 'Die Zahlungssitzung ist abgelaufen. Bitte versuchen Sie es erneut.',
  failed: 'Die Zahlung konnte nicht verarbeitet werden.',
  'server-error': 'Ein technischer Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
};

export default async function PaymentFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; reason?: string; error?: string }>;
}) {
  const { order, reason, error } = await searchParams;
  const failureKey = reason || error || 'failed';
  const message = FAILURE_MESSAGES[failureKey] || FAILURE_MESSAGES.failed;
  const settings = await getSiteSettings();

  return (
    <main className="pb-20 min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-dark via-red-900/30 to-dark pt-28 md:pt-32 pb-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Zahlung fehlgeschlagen
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            {message}
          </p>
          {order && (
            <p className="text-red-300 font-bold text-xl mt-4">
              Bestellnummer: #{order}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 mt-10 space-y-6">
        {/* What to do */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            Was können Sie tun?
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Versuchen Sie es erneut mit einer <strong>anderen Zahlungsmethode</strong> (PayPal, Kreditkarte, SEPA).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Überprüfen Sie, ob Ihre Karte für <strong>Online-Zahlungen freigeschaltet</strong> ist.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Kontaktieren Sie Ihre <strong>Bank</strong>, falls das Problem weiterhin besteht.</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Brauchen Sie Hilfe?</h2>
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

        {/* Retry */}
        <div className="text-center pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/product/fahrzeugabmeldung"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Erneut versuchen
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-8 py-3.5 rounded-xl transition-colors"
          >
            Zurück zur Startseite
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
