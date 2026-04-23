'use client';

import { AlertCircle, X } from 'lucide-react';

interface FormErrorBannerProps {
  message: string | null;
  onDismiss?: () => void;
}

/** Inline error banner for visitor-facing forms. Shows above or below form content. */
export function FormErrorBanner({ message, onDismiss }: FormErrorBannerProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-700">Fehler</p>
        <p className="text-sm text-red-600 mt-0.5">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="w-6 h-6 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
