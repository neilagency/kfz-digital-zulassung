const variants: Record<string, string> = {
  // Order statuses
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  processing: 'bg-blue-50 text-blue-700 ring-blue-600/10',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  'on-hold': 'bg-orange-50 text-orange-700 ring-orange-600/10',
  cancelled: 'bg-red-50 text-red-700 ring-red-600/10',
  refunded: 'bg-purple-50 text-purple-700 ring-purple-600/10',

  // Blog/page statuses
  publish: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  draft: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  scheduled: 'bg-blue-50 text-blue-700 ring-blue-600/10',
  private: 'bg-gray-100 text-gray-700 ring-gray-600/10',
  trash: 'bg-red-50 text-red-700 ring-red-600/10',

  // Invoice statuses
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',

  // Generic
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  inactive: 'bg-gray-100 text-gray-500 ring-gray-500/10',

  // Default
  default: 'bg-gray-100 text-gray-700 ring-gray-600/10',
};

const labels: Record<string, string> = {
  completed: 'Abgeschlossen',
  processing: 'In Bearbeitung',
  pending: 'Ausstehend',
  'on-hold': 'Zurückgestellt',
  cancelled: 'Storniert',
  refunded: 'Erstattet',
  publish: 'Veröffentlicht',
  draft: 'Entwurf',
  scheduled: 'Geplant',
  private: 'Privat',
  trash: 'Papierkorb',
  paid: 'Bezahlt',
  active: 'Aktiv',
  inactive: 'Inaktiv',
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const variant = variants[status] || variants.default;
  const displayLabel = label || labels[status] || status;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset ${variant} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {displayLabel}
    </span>
  );
}
