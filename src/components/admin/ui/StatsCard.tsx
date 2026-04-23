import { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  sub?: string;
}

export default function StatsCard({ label, value, icon, iconBg, iconColor, sub }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100/80 hover:border-gray-200/80 transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 truncate tracking-tight">{value}</p>
          {sub && <p className="text-[11px] text-gray-400 mt-1.5 font-medium">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} group-hover:scale-105 transition-transform`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
    </div>
  );
}
