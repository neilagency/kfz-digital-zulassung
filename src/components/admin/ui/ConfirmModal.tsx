'use client';

import { ReactNode } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  iconBg?: string;
  children?: ReactNode;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  description,
  icon,
  iconBg = 'bg-red-100',
  children,
  confirmLabel = 'Bestätigen',
  confirmVariant = 'danger',
  cancelLabel = 'Abbrechen',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmColor =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      : 'bg-primary hover:bg-primary-600 focus:ring-primary';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
          >
            {icon || <AlertTriangle className="w-5 h-5 text-red-600" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        {/* Content */}
        {children && <div className="px-6 pb-5">{children}</div>}

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50/80 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2.5 text-sm font-medium text-white rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 ${confirmColor}`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
