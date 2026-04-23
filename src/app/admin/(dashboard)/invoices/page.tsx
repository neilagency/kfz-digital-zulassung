'use client';

import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Plus, Eye, Download, FileText, Loader2, ChevronRight } from 'lucide-react';
import { FixedSizeList as VList } from 'react-window';
import {
  PageHeader,
  StatusBadge,
  SearchInput,
  FilterTabs,
  Pagination,
  EmptyState,
  TableSkeleton,
  Toast,
} from '@/components/admin/ui';
import { useInvoices } from '@/lib/admin-api';

const statusFilters = [
  { value: 'all', label: 'Alle Status' },
  { value: 'paid', label: 'Bezahlt' },
  { value: 'pending', label: 'Ausstehend' },
  { value: 'refunded', label: 'Erstattet' },
  { value: 'cancelled', label: 'Storniert' },
];

const ROW_HEIGHT = 52;
const COL_STYLE = 'py-3.5 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider';
const COLUMNS = [
  { label: 'Rechnungsnr.', flex: '14%', align: 'text-left' },
  { label: 'Bestellung', flex: '12%', align: 'text-left' },
  { label: 'Kunde', flex: '22%', align: 'text-left' },
  { label: 'Datum', flex: '14%', align: 'text-left' },
  { label: 'Betrag', flex: '12%', align: 'text-right' },
  { label: 'Status', flex: '14%', align: 'text-center' },
  { label: 'Aktionen', flex: '12%', align: 'text-center' },
];

const InvoiceRow = memo(function InvoiceRow({ index, style, data }: {
  index: number; style: React.CSSProperties; data: { invoices: any[] };
}) {
  const inv = data.invoices[index];
  return (
    <div style={style} className="flex items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-sm">
      <div className="py-2 px-6" style={{ width: '14%' }}>
        <Link href={`/admin/invoices/${inv.id}`} className="font-semibold text-primary hover:underline text-sm">
          {inv.invoiceNumber}
        </Link>
      </div>
      <div className="py-2 px-6" style={{ width: '12%' }}>
        <Link href={`/admin/orders/${inv.orderId}`} className="text-sm text-gray-600 hover:text-primary">
          #{inv.order?.orderNumber}
        </Link>
      </div>
      <div className="py-2 px-6" style={{ width: '22%' }}>
        <p className="text-sm font-medium text-gray-900 truncate">{inv.billingName}</p>
        <p className="text-xs text-gray-500 truncate">{inv.billingEmail}</p>
      </div>
      <div className="py-2 px-6 text-sm text-gray-500" style={{ width: '14%' }}>
        {format(new Date(inv.invoiceDate), 'dd.MM.yyyy', { locale: de })}
      </div>
      <div className="py-2 px-6 text-sm font-semibold text-gray-900 text-right" style={{ width: '12%' }}>
        €{inv.total?.toFixed(2)}
      </div>
      <div className="py-2 px-6 text-center" style={{ width: '14%' }}>
        <StatusBadge status={inv.paymentStatus} />
      </div>
      <div className="py-2 px-6" style={{ width: '12%' }}>
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/admin/invoices/${inv.id}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-50 transition"
            title="Ansehen"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <a
            href={`/api/admin/invoices/${inv.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
            title="PDF herunterladen"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
});

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data, isLoading: loading, mutate } = useInvoices({ page, status, search, limit });
  const invoices: any[] = data?.invoices ?? [];
  const pagination = data?.pagination ?? { pages: 1, total: 0 };

  const handleStatusChange = useCallback((v: string) => { setStatus(v); setPage(1); }, []);
  const handleSearchChange = useCallback((v: string) => { setSearch(v); setPage(1); }, []);

  const generateAll = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/invoices/generate-all', { method: 'POST' });
      const d = await res.json();
      setToast({ message: `${d.created} Rechnungen erstellt!`, type: 'success' });
      mutate();
    } catch {
      setToast({ message: 'Fehler beim Erstellen', type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <PageHeader
        title="Rechnungen"
        badge={pagination.total}
        actions={
          <button
            onClick={generateAll}
            disabled={generating}
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{generating ? 'Wird erstellt...' : 'Alle generieren'}</span>
            <span className="sm:hidden">{generating ? '...' : 'Generieren'}</span>
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100/80 flex flex-col lg:flex-row gap-3 sm:gap-4 items-start lg:items-center">
        <div className="flex gap-1 overflow-x-auto admin-hide-scrollbar -mx-1 px-1 w-full lg:w-auto">
          <FilterTabs tabs={statusFilters} active={status} onChange={handleStatusChange} />
        </div>
        <div className="w-full lg:w-80 lg:ml-auto">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Rechnungsnr., Name, E-Mail..."
          />
        </div>
      </div>

      {/* ═══ MOBILE: Card View ═══ */}
      <div className="md:hidden space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100/80">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-28 admin-skeleton rounded-md" />
                  <div className="h-5 w-20 admin-skeleton rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-36 admin-skeleton rounded-md" />
                  <div className="flex justify-between">
                    <div className="h-3 w-20 admin-skeleton rounded-md" />
                    <div className="h-4 w-16 admin-skeleton rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100/80">
            <EmptyState
              icon={<FileText className="w-7 h-7 text-gray-300" />}
              title="Keine Rechnungen gefunden"
              description="Klicke auf 'Generieren' um Rechnungen für bestehende Bestellungen zu erstellen."
            />
          </div>
        ) : (
          invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-2xl p-4 border border-gray-100/80 admin-card-touch"
            >
              <div className="flex items-center justify-between mb-2.5">
                <Link href={`/admin/invoices/${inv.id}`} className="text-sm font-bold text-primary">
                  {inv.invoiceNumber}
                </Link>
                <StatusBadge status={inv.paymentStatus} />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-0.5 truncate">{inv.billingName}</p>
              <p className="text-xs text-gray-400 mb-2 truncate">{inv.billingEmail}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {format(new Date(inv.invoiceDate), 'dd.MM.yyyy', { locale: de })}
                </span>
                <span className="text-sm font-bold text-gray-900">€{inv.total?.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                <Link
                  href={`/admin/invoices/${inv.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50 text-sm font-medium text-gray-600 active:bg-gray-100 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ansehen
                </Link>
                <a
                  href={`/api/admin/invoices/${inv.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 text-sm font-medium text-emerald-700 active:bg-emerald-100 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </a>
              </div>
            </div>
          ))
        )}
        {/* Mobile Pagination */}
        <div className="bg-white rounded-2xl border border-gray-100/80">
          <Pagination
            page={page}
            pages={pagination.pages}
            total={pagination.total}
            pageSize={limit}
            onPageChange={setPage}
            itemLabel="Rechnungen"
          />
        </div>
      </div>

      {/* ═══ DESKTOP: Table View ═══ */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        {loading ? (
          <TableSkeleton rows={10} columns={7} />
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-7 h-7 text-gray-300" />}
            title="Keine Rechnungen gefunden"
            description="Klicke auf 'Alle generieren' um Rechnungen für bestehende Bestellungen zu erstellen."
          />
        ) : (
          <>
            <div className="flex border-b border-gray-100/80 bg-gray-50/50">
              {COLUMNS.map((col) => (
                <div key={col.label} className={`${COL_STYLE} ${col.align}`} style={{ width: col.flex }}>{col.label}</div>
              ))}
            </div>
            <VList
              height={Math.min(invoices.length * ROW_HEIGHT, 600)}
              itemCount={invoices.length}
              itemSize={ROW_HEIGHT}
              width="100%"
              itemData={{ invoices }}
              overscanCount={10}
            >
              {InvoiceRow}
            </VList>
          </>
        )}

        <Pagination
          page={page}
          pages={pagination.pages}
          total={pagination.total}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setLimit(size); setPage(1); }}
          itemLabel="Rechnungen"
        />
      </div>
    </div>
  );
}
