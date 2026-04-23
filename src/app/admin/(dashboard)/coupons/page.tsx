'use client';

import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Plus, Pencil, Trash2, ChevronRight, Copy, Check, Tag, Percent, DollarSign } from 'lucide-react';
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
  ConfirmModal,
} from '@/components/admin/ui';
import { useCoupons } from '@/lib/admin-api';

const statusFilters = [
  { value: 'all', label: 'Alle' },
  { value: 'active', label: 'Aktiv' },
  { value: 'inactive', label: 'Inaktiv' },
  { value: 'expired', label: 'Abgelaufen' },
];

function getCouponStatus(coupon: any): string {
  if (!coupon.isActive) return 'inactive';
  if (coupon.endDate && new Date(coupon.endDate) < new Date()) return 'expired';
  if (coupon.startDate && new Date(coupon.startDate) > new Date()) return 'scheduled';
  return 'active';
}

const ROW_HEIGHT = 56;

const COLUMNS = [
  { key: 'code', label: 'Code', flex: '20%' },
  { key: 'discount', label: 'Rabatt', flex: '14%' },
  { key: 'products', label: 'Produkte', flex: '16%' },
  { key: 'status', label: 'Status', flex: '12%' },
  { key: 'usage', label: 'Nutzung', flex: '12%' },
  { key: 'dates', label: 'Zeitraum', flex: '16%' },
  { key: 'actions', label: 'Aktionen', flex: '10%' },
];

const CouponRow = memo(function CouponRow({ index, style, data }: {
  index: number;
  style: React.CSSProperties;
  data: { coupons: any[]; onDelete: (c: any) => void; onCopy: (code: string) => void };
}) {
  const { coupons, onDelete, onCopy } = data;
  const coupon = coupons[index];
  const st = getCouponStatus(coupon);

  return (
    <div style={style} className="flex items-center text-sm hover:bg-gray-50/50 transition-colors group border-b border-gray-50">
      <div className="px-6 py-2" style={{ width: '20%' }}>
        <div className="flex items-center gap-2">
          <Link href={`/admin/coupons/${coupon.id}`} className="font-mono font-bold text-primary hover:underline">
            {coupon.code}
          </Link>
          <button
            type="button"
            onClick={() => onCopy(coupon.code)}
            className="p-1 rounded text-gray-300 hover:text-primary transition opacity-0 group-hover:opacity-100"
            title="Code kopieren"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
        {coupon.description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{coupon.description}</p>
        )}
      </div>
      <div className="px-6 py-2 font-semibold" style={{ width: '14%' }}>
        {coupon.discountType === 'percentage' ? (
          <span className="text-purple-600">{coupon.discountValue}%</span>
        ) : (
          <span className="text-green-600">{coupon.discountValue.toFixed(2).replace('.', ',')} €</span>
        )}
      </div>
      <div className="px-6 py-2 text-gray-500 text-xs truncate" style={{ width: '16%' }}>
        {coupon.productSlugs || 'Alle Produkte'}
      </div>
      <div className="px-6 py-2" style={{ width: '12%' }}>
        <StatusBadge status={st} />
      </div>
      <div className="px-6 py-2 text-gray-500" style={{ width: '12%' }}>
        <span className="font-medium">{coupon.usageCount}</span>
        {coupon.maxUsageTotal > 0 && (
          <span className="text-gray-400"> / {coupon.maxUsageTotal}</span>
        )}
      </div>
      <div className="px-6 py-2 text-xs text-gray-500" style={{ width: '16%' }}>
        {coupon.startDate && format(new Date(coupon.startDate), 'dd.MM.yy', { locale: de })}
        {coupon.startDate && coupon.endDate && ' – '}
        {coupon.endDate && format(new Date(coupon.endDate), 'dd.MM.yy', { locale: de })}
        {!coupon.startDate && !coupon.endDate && 'Unbegrenzt'}
      </div>
      <div className="px-6 py-2" style={{ width: '10%' }}>
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/admin/coupons/${coupon.id}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-50 transition"
            title="Bearbeiten"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(coupon)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
            title="Löschen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data, isLoading: loading, mutate } = useCoupons({ page, status, search, limit });
  const coupons: any[] = data?.coupons ?? [];
  const pagination = data?.pagination ?? { page: 1, pages: 1, total: 0 };

  const handleStatusChange = useCallback((v: string) => { setStatus(v); setPage(1); }, []);
  const handleSearchChange = useCallback((v: string) => { setSearch(v); setPage(1); }, []);

  const handleCopy = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setToast({ message: `Code "${code}" kopiert`, type: 'success' });
    } catch {
      setToast({ message: 'Kopieren fehlgeschlagen', type: 'error' });
    }
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/coupons/${deleteTarget.id}`, { method: 'DELETE' });
      setToast({ message: 'Gutschein gelöscht', type: 'success' });
      mutate();
    } catch {
      setToast({ message: 'Fehler beim Löschen', type: 'error' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {deleteTarget && (
        <ConfirmModal
          title="Gutschein löschen?"
          description={`Code "${deleteTarget.code}" wird endgültig gelöscht.`}
          confirmLabel="Löschen"
          confirmVariant="danger"
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}

      <PageHeader
        title="Gutscheine & Rabatte"
        badge={pagination.total}
        actions={
          <Link
            href="/admin/coupons/new"
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Neuer Gutschein
          </Link>
        }
      />

      {/* Filters + Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100/80 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <FilterTabs tabs={statusFilters} active={status} onChange={handleStatusChange} />
        <div className="w-full lg:w-72 ml-auto">
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Code suchen..." />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100/80 p-4">
                <div className="h-4 w-3/4 admin-skeleton rounded-md mb-2" />
                <div className="h-3 w-1/2 admin-skeleton rounded-md mb-3" />
                <div className="flex gap-2">
                  <div className="h-5 w-20 admin-skeleton rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100/80">
            <EmptyState
              title="Keine Gutscheine"
              description="Erstelle deinen ersten Gutscheincode."
              action={
                <Link href="/admin/coupons/new" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition">
                  Neuer Gutschein
                </Link>
              }
            />
          </div>
        ) : (
          <>
            {coupons.map((coupon) => {
              const st = getCouponStatus(coupon);
              return (
                <Link key={coupon.id} href={`/admin/coupons/${coupon.id}`} className="block bg-white rounded-2xl border border-gray-100/80 p-4 active:bg-gray-50 transition admin-card-touch">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono font-bold text-primary text-sm">{coupon.code}</p>
                      {coupon.description && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{coupon.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={st} />
                        <span className="text-xs font-semibold">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}%`
                            : `${coupon.discountValue.toFixed(2).replace('.', ',')} €`}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {coupon.usageCount} Nutzungen
                        {coupon.maxUsageTotal > 0 && ` / ${coupon.maxUsageTotal}`}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 mt-1 shrink-0" />
                  </div>
                </Link>
              );
            })}
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              pageSize={limit}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setLimit(size); setPage(1); }}
              itemLabel="Gutscheine"
            />
          </>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        {loading ? (
          <TableSkeleton rows={10} columns={7} />
        ) : coupons.length === 0 ? (
          <EmptyState
            title="Keine Gutscheine"
            description="Erstelle deinen ersten Gutscheincode."
            action={
              <Link
                href="/admin/coupons/new"
                className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition"
              >
                Neuer Gutschein
              </Link>
            }
          />
        ) : (
          <>
            <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100/80 bg-gray-50/50">
              {COLUMNS.map((col) => (
                <div key={col.key} className={`px-6 py-3 ${col.key === 'actions' ? 'text-center' : 'text-left'}`} style={{ width: col.flex }}>
                  {col.label}
                </div>
              ))}
            </div>

            <VList
              height={Math.min(coupons.length * ROW_HEIGHT, ROW_HEIGHT * 15)}
              width="100%"
              itemCount={coupons.length}
              itemSize={ROW_HEIGHT}
              itemData={{ coupons, onDelete: setDeleteTarget, onCopy: handleCopy }}
            >
              {CouponRow}
            </VList>

            <div className="border-t border-gray-100/80">
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                pageSize={limit}
                onPageChange={setPage}
                onPageSizeChange={(size) => { setLimit(size); setPage(1); }}
                itemLabel="Gutscheine"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
