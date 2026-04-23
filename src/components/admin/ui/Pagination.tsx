'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
}

export default function Pagination({
  page,
  pages,
  total,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  itemLabel = 'Einträge',
}: PaginationProps) {
  if (pages <= 1 && !onPageSizeChange) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Generate page numbers with ellipsis
  const getPageNumbers = (): (number | '...')[] => {
    const items: (number | '...')[] = [];
    const delta = 1;

    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) items.push(i);
      return items;
    }

    items.push(1);
    if (page > 3) items.push('...');

    const start = Math.max(2, page - delta);
    const end = Math.min(pages - 1, page + delta);

    for (let i = start; i <= end; i++) items.push(i);

    if (page < pages - 2) items.push('...');
    items.push(pages);

    return items;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-100/80">
      <p className="text-sm text-gray-400">
        <span className="font-medium text-gray-600">{from}–{to}</span> von{' '}
        <span className="font-medium text-gray-600">{total}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          title="Erste Seite"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          title="Zurück"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((item, idx) =>
          item === '...' ? (
            <span key={`dots-${idx}`} className="px-1 text-gray-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`min-w-[32px] h-8 px-2 rounded-xl text-sm font-medium transition ${
                item === page
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          title="Weiter"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(pages)}
          disabled={page >= pages}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          title="Letzte Seite"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Per-page size selector */}
      {onPageSizeChange && (
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          className="text-sm border border-gray-200/80 rounded-xl px-2.5 py-1.5 text-gray-600 bg-white outline-none hover:border-gray-300 transition"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>{size} / Seite</option>
          ))}
        </select>
      )}
    </div>
  );
}
