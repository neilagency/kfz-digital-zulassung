import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string | number;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, badge, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pt-14 md:pt-0 mb-6 sm:mb-8">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight leading-none">{title}</h1>
          {badge !== undefined && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary ring-1 ring-primary/20">
              {badge}
            </span>
          )}
        </div>
        {description && <p className="text-sm text-gray-500 leading-relaxed max-w-lg">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 sm:gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
