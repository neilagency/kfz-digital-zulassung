'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Plus, ExternalLink, Link2, BarChart3, ChevronRight } from 'lucide-react';
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
import { usePages as useAdminPages } from '@/lib/admin-api';

function SEOScoreBadge({ score }: { score: number }) {
  if (!score) return <span className="text-xs text-gray-400">–</span>;
  const color = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <span className={`inline-flex items-center justify-center w-10 h-6 text-xs font-bold text-white rounded-md ${color}`}>
      {score}
    </span>
  );
}

const statusFilters = [
  { value: 'all', label: 'Alle' },
  { value: 'publish', label: 'Veröffentlicht' },
  { value: 'draft', label: 'Entwurf' },
];

export default function PagesListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [siteUrl, setSiteUrl] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      setSiteUrl(d.siteUrl || '');
    }).catch(() => {});
  }, []);

  const { data, isLoading: loading, mutate } = useAdminPages({ page, status, search, limit });
  const pages: any[] = data?.pages ?? [];
  const pagination = data?.pagination ?? { page: 1, pages: 1, total: 0 };

  const handleStatusChange = useCallback((v: string) => { setStatus(v); setPage(1); }, []);
  const handleSearchChange = useCallback((v: string) => { setSearch(v); setPage(1); }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/pages/${deleteTarget.id}`, { method: 'DELETE' });
      setToast({ message: 'Seite gelöscht', type: 'success' });
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
          title="Seite löschen?"
          description={`"${deleteTarget.title}" wird in den Papierkorb verschoben.`}
          confirmLabel="Löschen"
          confirmVariant="danger"
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}

      <PageHeader
        title="Seiten"
        badge={pagination.total}
        actions={
          <Link
            href="/admin/pages/new"
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Neue Seite
          </Link>
        }
      />

      {/* Filters + Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100/80 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <FilterTabs tabs={statusFilters} active={status} onChange={handleStatusChange} />
        <div className="w-full lg:w-72 ml-auto">
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Seite suchen..." />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100/80 p-4">
                <div className="h-4 w-3/4 admin-skeleton rounded-md mb-2" />
                <div className="h-3 w-1/3 admin-skeleton rounded-md mb-3" />
                <div className="flex gap-2">
                  <div className="h-5 w-20 admin-skeleton rounded-full" />
                  <div className="h-5 w-12 admin-skeleton rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100/80">
            <EmptyState
              title="Keine Seiten gefunden"
              description="Erstelle deine erste Seite."
              action={
                <Link href="/admin/pages/new" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition">
                  Neue Seite
                </Link>
              }
            />
          </div>
        ) : (
          <>
            {pages.map((pg) => (
              <Link key={pg.id} href={`/admin/pages/${pg.id}`} className="block bg-white rounded-2xl border border-gray-100/80 p-4 active:bg-gray-50 transition admin-card-touch">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{pg.title || '(Kein Titel)'}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StatusBadge status={pg.status} size="sm" />
                      {pg.author && <span className="text-xs text-gray-400">{pg.author}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <SEOScoreBadge score={pg.seoScore} />
                      {pg.focusKeywords && (
                        <span className="text-[11px] text-gray-500 truncate">
                          {pg.focusKeywords.split(',')[0]}
                        </span>
                      )}
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
              itemLabel="Seiten"
            />
          </>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        {loading ? (
          <TableSkeleton rows={10} columns={4} />
        ) : pages.length === 0 ? (
          <EmptyState
            title="Keine Seiten gefunden"
            description="Erstelle deine erste Seite."
            action={
              <Link
                href="/admin/pages/new"
                className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition"
              >
                Neue Seite
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[35%]">Titel</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Autor</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[30%]">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                      SEO Details
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pages.map((pg) => (
                  <tr key={pg.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-3.5">
                      <div>
                        <Link href={`/admin/pages/${pg.id}`} className="font-medium text-primary hover:underline line-clamp-1">
                          {pg.title || '(Kein Titel)'}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={pg.status} size="sm" />
                          <div className="hidden group-hover:flex gap-2 text-xs">
                            <Link href={`/admin/pages/${pg.id}`} className="text-primary hover:underline">Bearbeiten</Link>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setDeleteTarget(pg)} className="text-red-500 hover:underline">Papierkorb</button>
                            <span className="text-gray-300">|</span>
                            <a href={`${siteUrl}/${pg.slug}/`} target="_blank" rel="noopener" className="text-gray-500 hover:underline">Anzeigen</a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 text-xs">{pg.author}</td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">
                      {pg.publishedAt ? format(new Date(pg.publishedAt), 'dd.MM.yyyy', { locale: de }) : '–'}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <SEOScoreBadge score={pg.seoScore} />
                          {pg.focusKeywords && (
                            <span className="text-[11px] text-gray-500">
                              Keyword: <span className="font-medium text-gray-700">{pg.focusKeywords.split(',')[0]}</span>
                            </span>
                          )}
                        </div>
                        {pg.schemaType && (
                          <div className="text-[11px] text-gray-400">
                            Schema: <span className="text-gray-600">{pg.schemaType}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                          {pg.internalLinks > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Link2 className="w-3 h-3" />
                              {pg.internalLinks}
                            </span>
                          )}
                          {pg.externalLinks > 0 && (
                            <span className="flex items-center gap-0.5">
                              <ExternalLink className="w-3 h-3" />
                              {pg.externalLinks}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setLimit(size); setPage(1); }}
          itemLabel="Seiten"
        />
      </div>
    </div>
  );
}
