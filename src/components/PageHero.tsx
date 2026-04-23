'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  variant?: 'light' | 'dark';
  actions?: React.ReactNode;
  compact?: boolean;
}

export default function PageHero({
  title,
  subtitle,
  breadcrumbs,
  variant = 'light',
  actions,
  compact = false,
}: PageHeroProps) {
  const isDark = variant === 'dark';

  return (
    <section
      className={`relative overflow-hidden ${
        compact ? 'pt-24 pb-8 sm:pt-28 sm:pb-10' : 'pt-24 pb-12 sm:pt-28 sm:pb-14'
      } ${
        isDark
          ? 'bg-gradient-to-br from-dark via-primary-900 to-dark'
          : 'bg-gray-50 border-b border-gray-200'
      }`}
    >
      {/* Background decoration (dark only) */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-64 h-64 bg-accent/10 rounded-full blur-[120px]" />
        </div>
      )}

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-sm mb-4">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}
                  />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className={`transition ${
                      isDark
                        ? 'text-white/40 hover:text-white/70'
                        : 'text-gray-400 hover:text-primary'
                    }`}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={`font-medium ${
                      isDark ? 'text-white/80' : 'text-gray-700'
                    }`}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={`mt-2 text-sm sm:text-base ${
                  isDark ? 'text-white/50' : 'text-gray-500'
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
