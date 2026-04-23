'use client';

import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Plus, Pencil, Trash2, ChevronRight, Send, Users, CheckCircle, AlertCircle, Clock } from 'lucide-react';
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
import { useCampaigns } from '@/lib/admin-api';

const statusFilters = [
  { value: 'all', label: 'Alle' },
  { value: 'draft', label: 'Entwurf' },
  { value: 'scheduled', label: 'Geplant' },
  { value: 'sending', label: 'Wird gesendet' },
  { value: 'sent', label: 'Gesendet' },
  { value: 'failed', label: 'Fehlgeschlagen' },
];

const statusMap: Record<string, { label: string; color: string }> = {
  draft: { label: 'Entwurf', color: 'gray' },
  scheduled: { label: 'Geplant', color: 'amber' },
  sending: { label: 'Wird gesendet', color: 'blue' },
  sent: { label: 'Gesendet', color: 'green' },
  failed: { label: 'Fehlgeschlagen', color: 'red' },
};

const ROW_HEIGHT = 56;

const COLUMNS = [
  { key: 'name', label: 'Kampagne', flex: '30%' },
  { key: 'status', label: 'Status', flex: '14%' },
  { key: 'recipients', label: 'Empfänger', flex: '16%' },
  { key: 'progress', label: 'Fortschritt', flex: '16%' },
  { key: 'date', label: 'Datum', flex: '14%' },
  { key: 'actions', label: 'Aktionen', flex: '10%' },
];

const CampaignRow = memo(function CampaignRow({ index, style, data }: {
  index: number;
  style: React.CSSProperties;
  data: { campaigns: any[]; onDelete: (c: any) => void };
}) {
  const { campaigns, onDelete } = data;
  const campaign = campaigns[index];
  const st = statusMap[campaign.status] || statusMap.draft;

  return (
    <div style={style} className="flex items-center text-sm hover:bg-gray-50/50 transition-colors group border-b border-gray-50">
      <div className="px-6 py-2 truncate" style={{ width: '30%' }}>
        <Link href={`/admin/campaigns/${campaign.id}`} className="font-medium text-primary hover:underline line-clamp-1">
          {campaign.name}
        </Link>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{campaign.subject || 'Kein Betreff'}</p>
      </div>
      <div className="px-6 py-2" style={{ width: '14%' }}>
        <StatusBadge status={campaign.status} />
      </div>
      <div className="px-6 py-2 text-gray-500" style={{ width: '16%' }}>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>{campaign.totalRecipients || '-'}</span>
        </div>
      </div>
      <div className="px-6 py-2" style={{ width: '16%' }}>
        {campaign.status === 'sending' || campaign.status === 'sent' || campaign.status === 'failed' ? (
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-600">{campaign.sentCount} ✓</span>
              {campaign.failedCount > 0 && (
                <span className="text-red-500">{campaign.failedCount} ✗</span>
              )}
            </div>
            {campaign.totalRecipients > 0 && (
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                <div
                  className={`h-1.5 rounded-full ${campaign.status === 'failed' ? 'bg-red-400' : 'bg-green-400'}`}
                  style={{ width: `${Math.round(((campaign.sentCount + campaign.failedCount) / campaign.totalRecipients) * 100)}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </div>
      <div className="px-6 py-2 text-gray-500 text-xs" style={{ width: '14%' }}>
        {campaign.sentAt
          ? format(new Date(campaign.sentAt), 'dd.MM.yy HH:mm', { locale: de })
          : format(new Date(campaign.createdAt), 'dd.MM.yy', { locale: de })}
      </div>
      <div className="px-6 py-2" style={{ width: '10%' }}>
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/admin/campaigns/${campaign.id}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-50 transition"
            title="Bearbeiten"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          {campaign.status === 'draft' && (
            <button
              type="button"
              onClick={() => onDelete(campaign)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
              title="Löschen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default function CampaignsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data, isLoading: loading, mutate } = useCampaigns({ page, status, search, limit });
  const campaigns: any[] = data?.campaigns ?? [];
  const pagination = data?.pagination ?? { page: 1, pages: 1, total: 0 };

  const handleStatusChange = useCallback((v: string) => { setStatus(v); setPage(1); }, []);
  const handleSearchChange = useCallback((v: string) => { setSearch(v); setPage(1); }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/email-campaigns/${deleteTarget.id}`, { method: 'DELETE' });
      setToast({ message: 'Kampagne gelöscht', type: 'success' });
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
          title="Kampagne löschen?"
          description={`"${deleteTarget.name}" wird endgültig gelöscht.`}
          confirmLabel="Löschen"
          confirmVariant="danger"
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}

      <PageHeader
        title="E-Mail-Kampagnen"
        badge={pagination.total}
        actions={
          <Link
            href="/admin/campaigns/new"
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Neue Kampagne
          </Link>
        }
      />

      {/* Filters + Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100/80 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <FilterTabs tabs={statusFilters} active={status} onChange={handleStatusChange} />
        <div className="w-full lg:w-72 ml-auto">
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Kampagne suchen..." />
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
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100/80">
            <EmptyState
              title="Keine Kampagnen"
              description="Erstelle deine erste E-Mail-Kampagne."
              action={
                <Link href="/admin/campaigns/new" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition">
                  Neue Kampagne
                </Link>
              }
            />
          </div>
        ) : (
          <>
            {campaigns.map((campaign) => (
              <Link key={campaign.id} href={`/admin/campaigns/${campaign.id}`} className="block bg-white rounded-2xl border border-gray-100/80 p-4 active:bg-gray-50 transition admin-card-touch">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{campaign.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{campaign.subject || 'Kein Betreff'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={campaign.status} />
                      {campaign.totalRecipients > 0 && (
                        <span className="text-xs text-gray-400">
                          {campaign.sentCount}/{campaign.totalRecipients}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {campaign.sentAt
                        ? format(new Date(campaign.sentAt), 'dd.MM.yy HH:mm', { locale: de })
                        : format(new Date(campaign.createdAt), 'dd.MM.yy', { locale: de })}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 mt-1 shrink-0" />
                </div>
              </Link>
            ))}
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              pageSize={limit}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setLimit(size); setPage(1); }}
              itemLabel="Kampagnen"
            />
          </>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        {loading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : campaigns.length === 0 ? (
          <EmptyState
            title="Keine Kampagnen"
            description="Erstelle deine erste E-Mail-Kampagne."
            action={
              <Link
                href="/admin/campaigns/new"
                className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition"
              >
                Neue Kampagne
              </Link>
            }
          />
        ) : (
          <>
            {/* Flex Header */}
            <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100/80 bg-gray-50/50">
              {COLUMNS.map((col) => (
                <div key={col.key} className={`px-6 py-3 ${col.key === 'actions' ? 'text-center' : 'text-left'}`} style={{ width: col.flex }}>
                  {col.label}
                </div>
              ))}
            </div>

            {/* Virtualized rows */}
            <VList
              height={Math.min(campaigns.length * ROW_HEIGHT, ROW_HEIGHT * 15)}
              width="100%"
              itemCount={campaigns.length}
              itemSize={ROW_HEIGHT}
              itemData={{ campaigns, onDelete: setDeleteTarget }}
            >
              {CampaignRow}
            </VList>

            <div className="border-t border-gray-100/80">
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                pageSize={limit}
                onPageChange={setPage}
                onPageSizeChange={(size) => { setLimit(size); setPage(1); }}
                itemLabel="Kampagnen"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
