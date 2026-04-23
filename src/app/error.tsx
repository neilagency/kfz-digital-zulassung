'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Ein Fehler ist aufgetreten
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Bitte laden Sie die Seite erneut.
        </p>
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Seite neu laden
        </button>
      </div>
    </div>
  );
}
