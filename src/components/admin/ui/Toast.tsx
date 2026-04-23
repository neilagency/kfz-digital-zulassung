'use client';

import { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[100] admin-toast-enter">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-xl text-sm font-medium ${
          type === 'success'
            ? 'bg-emerald-600 text-white shadow-emerald-600/20'
            : 'bg-red-600 text-white shadow-red-600/20'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 flex-shrink-0" />
        )}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:opacity-70 transition rounded-lg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
