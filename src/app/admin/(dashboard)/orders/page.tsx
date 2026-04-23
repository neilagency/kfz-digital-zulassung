'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Eye, Trash2, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown,
  Calendar, X, ChevronDown, CheckSquare, Square, MinusSquare,
  ChevronRight,
} from 'lucide-react';
import { FixedSizeList as VList } from 'react-window';
import {
  PageHeader,
  StatusBadge,
  SearchInput,
  Pagination,
  EmptyState,
  TableSkeleton,
  Toast,
  ConfirmModal,
} from '@/components/admin/ui';
import { useOrders } from '@/lib/admin-api';

// ─── Constants ───

const STATUS_FILTERS = [
  { value: 'all', label: 'Alle' },
  { value: 'completed', label: 'Abgeschlossen' },
  { value: 'processing', label: 'In Bearbeitung' },
  { value: 'pending', label: 'Ausstehend' },
  { value: 'on-hold', label: 'Zurückgestellt' },
  { value: 'cancelled', label: 'Storniert' },
  { value: 'refunded', label: 'Erstattet' },
];

const PAGE_SIZES = [10, 20, 50] as const;

const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'on-hold', 'cancelled', 'refunded'];

type SortField = 'createdAt' | 'total' | 'orderNumber' | 'status';
type SortDir = 'asc' | 'desc';

// ─── Memoized Row (react-window compatible) ───

const ROW_HEIGHT = 48;

const OrderRow = memo(function OrderRow({ index, style, data }: {
  index: number; style: React.CSSProperties;
  data: { orders: any[]; selectedIds: Set<string>; onToggle: (id: string) => void; onDelete: (o: any) => void };
}) {
  const { orders, selectedIds, onToggle, onDelete } = data;
  const order = orders[index];
  const selected = selectedIds.has(order.id);
  return (
    <div style={style} className={`flex items-center text-sm transition-colors group border-b border-gray-50 ${selected ? 'bg-primary/5' : 'hover:bg-gray-50/50'}`}>
      <div className="px-3 py-2" style={{ width: '4%' }}>
        <button onClick={() => onToggle(order.id)} className="p-0.5" aria-label="Auswählen">
          {selected
            ? <CheckSquare className="w-4 h-4 text-primary" />
            : <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />}
        </button>
      </div>
      <div className="px-4 py-2" style={{ width: '8%' }}>
        <Link href={`/admin/orders/${order.id}`} className="text-primary font-medium hover:underline">
          #{order.orderNumber}
        </Link>
      </div>
      <div className="px-4 py-2 text-gray-700 truncate" style={{ width: '14%' }}>
        {order.billingFirst} {order.billingLast}
      </div>
      <div className="px-4 py-2 text-gray-500 truncate" style={{ width: '16%' }}>{order.billingEmail}</div>
      <div className="px-4 py-2" style={{ width: '12%' }}>
        <StatusBadge status={order.status} />
      </div>
      <div className="px-4 py-2 text-gray-500 capitalize truncate" style={{ width: '12%' }}>{order.paymentMethod || '-'}</div>
      <div className="px-4 py-2 font-medium text-gray-900" style={{ width: '10%' }}>{'\u20AC'}{order.total?.toFixed(2)}</div>
      <div className="px-4 py-2 text-gray-500" style={{ width: '14%' }}>
        {format(new Date(order.createdAt), 'dd.MM.yy HH:mm', { locale: de })}
      </div>
      <div className="px-4 py-2" style={{ width: '10%' }}>
        <div className="flex items-center justify-center gap-0.5">
          <Link
            href={`/admin/orders/${order.id}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition"
            title="Ansehen"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(order)}
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

// ─── Sort Header ───

function SortHeader({ field, label, sortBy, sortDir, onSort }: {
  field: SortField; label: string; sortBy: SortField; sortDir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = sortBy === field;
  return (
    <button onClick={() => onSort(field)} className="inline-flex items-center gap-1 group/sort">
      <span>{label}</span>
      {active
        ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />)
        : <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover/sort:text-gray-400" />}
    </button>
  );
}

// ─── Column definitions for header ───

const ORDER_COLUMNS = [
  { key: 'check', label: '', flex: '4%' },
  { key: 'orderNumber', label: 'Nr.', sortable: 'orderNumber' as SortField, flex: '8%' },
  { key: 'customer', label: 'Kunde', flex: '14%' },
  { key: 'email', label: 'E-Mail', flex: '16%' },
  { key: 'status', label: 'Status', sortable: 'status' as SortField, flex: '12%' },
  { key: 'payment', label: 'Zahlung', flex: '12%' },
  { key: 'total', label: 'Summe', sortable: 'total' as SortField, flex: '10%' },
  { key: 'createdAt', label: 'Datum', sortable: 'createdAt' as SortField, flex: '14%' },
  { key: 'actions', label: '', flex: '10%' },
];

// ─── Main Page ───

export default function OrdersPage() {
  // Filter / pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(20);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [syncing, setSyncing] = useState(false);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data, isLoading: loading, mutate } = useOrders({
    page, limit, status, search, dateFrom, dateTo, sortBy, sortDir,
  });
  const orders: any[] = data?.orders ?? [];
  const pagination = data?.pagination ?? { page: 1, pages: 1, total: 0, limit: 20 };
  const statusCounts: Record<string, number> = data?.statusCounts ?? {};

  // Status tabs with live counts
  const statusTabs = useMemo(() =>
    STATUS_FILTERS.map((f) => ({
      ...f,
      label: statusCounts[f.value] != null ? `${f.label} (${statusCounts[f.value]})` : f.label,
    })),
    [statusCounts],
  );

  // ─── Handlers ───

  const resetPage = useCallback(() => { setPage(1); setSelectedIds(new Set()); }, []);

  const handleStatusChange = useCallback((v: string) => { setStatus(v); resetPage(); }, [resetPage]);
  const handleSearchChange = useCallback((v: string) => { setSearch(v); resetPage(); }, [resetPage]);
  const handleLimitChange = useCallback((v: number) => { setLimit(v); resetPage(); }, [resetPage]);

  const handleSort = useCallback((field: SortField) => {
    setSortBy((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortDir('desc');
      }
      return field;
    });
    setPage(1);
  }, []);

  const clearDates = useCallback(() => { setDateFrom(''); setDateTo(''); resetPage(); }, [resetPage]);

  // ─── Selection ───

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.has(o.id));
  const someSelected = orders.some((o) => selectedIds.has(o.id));

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => o.id)));
    }
  }, [allSelected, orders]);

  // ─── Bulk Actions ───

  const executeBulk = useCallback(async () => {
    if (selectedIds.size === 0 || !bulkAction) return;
    setBulkLoading(true);
    try {
      const ids = Array.from(selectedIds);
      let body: any;
      if (bulkAction === 'delete') {
        body = { action: 'delete', ids };
      } else {
        body = { action: 'status', ids, status: bulkAction };
      }
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setToast({
          message: bulkAction === 'delete'
            ? `${d.affected} Bestellungen gelöscht`
            : `${d.affected} Bestellungen auf "${bulkAction}" gesetzt`,
          type: 'success',
        });
        setSelectedIds(new Set());
        setBulkAction('');
        mutate();
      } else {
        setToast({ message: d.error || 'Fehler', type: 'error' });
      }
    } catch {
      setToast({ message: 'Netzwerkfehler', type: 'error' });
    } finally {
      setBulkLoading(false);
    }
  }, [selectedIds, bulkAction, mutate]);

  // ─── Sync ───

  const syncOrders = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/sync-orders', { method: 'POST' });
      const d = await res.json();
      setToast({ message: `Sync: ${d.imported} neue, ${d.updated} aktualisiert`, type: 'success' });
      mutate();
    } catch {
      setToast({ message: 'Sync fehlgeschlagen', type: 'error' });
    } finally {
      setSyncing(false);
    }
  }, [mutate]);

  // ─── Single Delete ───

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${deleteTarget.id}`, { method: 'DELETE' });
      const d = await res.json();
      if (res.ok && d.success) {
        mutate();
        setToast({ message: `Bestellung #${deleteTarget.orderNumber} gelöscht`, type: 'success' });
      } else {
        setToast({ message: d.error || 'Fehler beim Löschen', type: 'error' });
      }
    } catch {
      setToast({ message: 'Netzwerkfehler beim Löschen', type: 'error' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, mutate]);

  const hasDateFilter = dateFrom || dateTo;

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Modal */}
      {deleteTarget && (
        <ConfirmModal
          title="Bestellung löschen?"
          description="Diese Aktion kann rückgängig gemacht werden (Soft Delete)."
          confirmLabel="Löschen"
          confirmVariant="danger"
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !deleting && setDeleteTarget(null)}
        >
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Bestell-Nr.</span>
              <span className="font-semibold text-gray-900">#{deleteTarget.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">E-Mail</span>
              <span className="font-medium text-gray-700">{deleteTarget.billingEmail || '\u2014'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Summe</span>
              <span className="font-semibold text-gray-900">{'\u20AC'}{deleteTarget.total?.toFixed(2)}</span>
            </div>
          </div>
        </ConfirmModal>
      )}

      {/* Header */}
      <PageHeader
        title="Bestellungen"
        badge={pagination.total}
        actions={
          <button
            onClick={syncOrders}
            disabled={syncing}
            className="px-3.5 py-2.5 text-sm font-medium bg-white border border-gray-200/80 text-gray-600 hover:bg-gray-50 rounded-xl transition disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{syncing ? 'Sync...' : 'WP Sync'}</span>
          </button>
        }
      />

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100/80 space-y-3">
        {/* Row 1: Status tabs – horizontal scroll on mobile */}
        <div className="flex gap-1 overflow-x-auto admin-hide-scrollbar pb-0.5 -mx-1 px-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                status === tab.value
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Row 2: Search + Date range + Page size */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="w-full md:w-72">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Bestellung oder Name suchen..."
            />
          </div>

          {/* Date range — hidden on mobile, use filter */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="px-2.5 py-2 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40"
            />
            <span className="text-gray-300">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="px-2.5 py-2 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40"
            />
            {hasDateFilter && (
              <button onClick={clearDates} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Page size */}
          <div className="hidden md:flex items-center gap-2 ml-auto text-sm text-gray-500">
            <span>Zeige</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-2.5 py-2 border border-gray-200/80 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span>pro Seite</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {someSelected && (
        <div className="bg-primary/5 border border-primary/15 rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="text-sm font-semibold text-primary">{selectedIds.size} ausgewählt</span>
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="px-3 py-2 border border-gray-200/80 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
          >
            <option value="">Aktion wählen...</option>
            <option value="delete">Löschen</option>
            <optgroup label="Status ändern">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </optgroup>
          </select>
          <button
            onClick={executeBulk}
            disabled={!bulkAction || bulkLoading}
            className="px-3.5 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {bulkLoading ? 'Wird ausgeführt...' : 'Ausführen'}
          </button>
          <button
            onClick={() => { setSelectedIds(new Set()); setBulkAction(''); }}
            className="text-sm text-gray-500 hover:text-gray-700 ml-auto"
          >
            Auswahl aufheben
          </button>
        </div>
      )}

      {/* ═══ MOBILE: Card View ═══ */}
      <div className="md:hidden space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100/80">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-20 admin-skeleton rounded-md" />
                  <div className="h-5 w-24 admin-skeleton rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-40 admin-skeleton rounded-md" />
                  <div className="flex justify-between">
                    <div className="h-3 w-24 admin-skeleton rounded-md" />
                    <div className="h-4 w-16 admin-skeleton rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100/80">
            <EmptyState
              title="Keine Bestellungen gefunden"
              description="Versuche einen anderen Filter oder Suchbegriff."
            />
          </div>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block bg-white rounded-2xl p-4 border border-gray-100/80 active:bg-gray-50 transition-colors admin-card-touch"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm font-bold text-primary">#{order.orderNumber}</span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {order.billingFirst} {order.billingLast}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {format(new Date(order.createdAt), 'dd.MM.yy HH:mm', { locale: de })}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{'\u20AC'}{order.total?.toFixed(2)}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
              {order.paymentMethod && (
                <p className="text-[11px] text-gray-400 mt-1.5 capitalize">{order.paymentMethod}</p>
              )}
            </Link>
          ))
        )}
      </div>

      {/* ═══ DESKTOP: Table View ═══ */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        {loading ? (
          <TableSkeleton rows={limit} columns={9} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="Keine Bestellungen gefunden"
            description="Versuche einen anderen Filter oder Suchbegriff."
          />
        ) : (
          <>
            {/* Flex Header */}
            <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100/80 bg-gray-50/50">
              <div className="px-3 py-3.5" style={{ width: '4%' }}>
                <button onClick={toggleAll} className="p-0.5" aria-label="Alle auswählen">
                  {allSelected
                    ? <CheckSquare className="w-4 h-4 text-primary" />
                    : someSelected
                      ? <MinusSquare className="w-4 h-4 text-primary" />
                      : <Square className="w-4 h-4 text-gray-300" />}
                </button>
              </div>
              {ORDER_COLUMNS.slice(1).map((col) => (
                <div key={col.key} className="px-4 py-3.5" style={{ width: col.flex }}>
                  {col.sortable ? (
                    <SortHeader field={col.sortable} label={col.label} sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  ) : col.label}
                </div>
              ))}
            </div>
            {/* Virtualized Rows */}
            <VList
              height={Math.min(orders.length * ROW_HEIGHT, 600)}
              itemCount={orders.length}
              itemSize={ROW_HEIGHT}
              width="100%"
              overscanCount={10}
              itemData={{ orders, selectedIds, onToggle: toggleSelect, onDelete: setDeleteTarget }}
            >
              {OrderRow}
            </VList>
          </>
        )}

        {/* Pagination */}
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setLimit(size); setPage(1); }}
          itemLabel="Bestellungen"
        />
      </div>

      {/* Mobile Pagination */}
      <div className="md:hidden bg-white rounded-2xl border border-gray-100/80">
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          pageSize={limit}
          onPageChange={setPage}
          itemLabel="Bestellungen"
        />
      </div>
    </div>
  );
}
