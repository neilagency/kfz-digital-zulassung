'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Ein Fehler ist aufgetreten
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {error.message || 'Bitte versuchen Sie es erneut.'}
        </p>
        <button
          onClick={reset}
          className="bg-[#0D5581] hover:bg-[#0a4468] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}
