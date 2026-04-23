import { BookOpen } from 'lucide-react';

export default function InsiderwissenLoading() {
  return (
    <main className="pb-20 animate-pulse">
      {/* Hero header skeleton */}
      <section className="bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-32 pb-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-white/90 text-sm font-medium">Blog &amp; Ratgeber</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Insiderwissen
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Alles was Sie über die Fahrzeugabmeldung, Stilllegung und KFZ-Ummeldung wissen müssen.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Categories skeleton */}
        <div className="flex flex-wrap gap-2 mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-gray-200"
              style={{ width: `${70 + i * 20}px` }}
            />
          ))}
        </div>

        {/* Posts grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
