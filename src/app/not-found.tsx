import { Metadata } from 'next';
import Link from 'next/link';

// Unknown slugs that slip through middleware still hit this page.
// noindex prevents them from being indexed even while returning 404.
export const metadata: Metadata = {
  title: 'Seite nicht gefunden',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-dark via-primary-900 to-dark">
      <div className="text-center px-4">
        <h1 className="text-8xl font-extrabold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Seite nicht gefunden</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-600 transition-colors"
          >
            Zur Startseite
          </Link>
          <Link
            href="/product/fahrzeugabmeldung"
            className="bg-accent text-primary px-8 py-3 rounded-full font-bold hover:bg-accent-600 transition-colors"
          >
            Jetzt abmelden
          </Link>
        </div>
      </div>
    </main>
  );
}
