'use client';

import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Plus, Pencil, Trash2, ChevronRight } from 'lucide-react';
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
import { useBlogPosts } from '@/lib/admin-api';

const statusFilters = [
  { value: 'all', label: 'Alle' },
  { value: 'publish', label: 'Veröffentlicht' },
  { value: 'scheduled', label: 'Geplant' },
  { value: 'draft', label: 'Entwurf' },
];

const ROW_HEIGHT = 52;

const BLOG_COLUMNS = [
  { key: 'title', label: 'Titel', flex: '30%' },
  { key: 'status', label: 'Status', flex: '14%' },
  { key: 'category', label: 'Kategorie', flex: '16%' },
  { key: 'views', label: 'Views', flex: '10%' },
  { key: 'date', label: 'Datum', flex: '18%' },
  { key: 'actions', label: 'Aktionen', flex: '12%' },
];

const BlogRow = memo(function BlogRow({ index, style, data }: {
  index: number; style: React.CSSProperties;
  data: { posts: any[]; onDelete: (p: any) => void };
}) {
  const { posts, onDelete } = data;
  const post = posts[index];
  return (
    <div style={style} className="flex items-center text-sm hover:bg-gray-50/50 transition-colors group border-b border-gray-50">
      <div className="px-6 py-2 truncate" style={{ width: '30%' }}>
        <Link href={`/admin/blog/${post.id}`} className="font-medium text-primary hover:underline line-clamp-1">
          {post.title}
        </Link>
        <p className="text-xs text-gray-400 mt-0.5 truncate">/{post.slug}</p>
      </div>
      <div className="px-6 py-2" style={{ width: '14%' }}>
        <StatusBadge status={post.status} />
      </div>
      <div className="px-6 py-2 text-gray-500 truncate" style={{ width: '16%' }}>{post.category || '-'}</div>
      <div className="px-6 py-2 text-gray-500" style={{ width: '10%' }}>{post.views}</div>
      <div className="px-6 py-2 text-gray-500" style={{ width: '18%' }}>
        {post.status === 'scheduled' && post.scheduledAt ? (
          <span className="text-blue-600" title="Geplant">
            🕐 {format(new Date(post.scheduledAt), 'dd.MM.yy HH:mm', { locale: de })}
          </span>
        ) : post.publishedAt ? (
          format(new Date(post.publishedAt), 'dd.MM.yy', { locale: de })
        ) : (
          format(new Date(post.createdAt), 'dd.MM.yy', { locale: de })
        )}
      </div>
      <div className="px-6 py-2" style={{ width: '12%' }}>
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/admin/blog/${post.id}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-50 transition"
            title="Bearbeiten"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(post)}
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

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data, isLoading: loading, mutate } = useBlogPosts({ page, status, search, limit });
  const posts: any[] = data?.posts ?? [];
  const pagination = data?.pagination ?? { page: 1, pages: 1, total: 0 };

  const handleStatusChange = useCallback((v: string) => { setStatus(v); setPage(1); }, []);
  const handleSearchChange = useCallback((v: string) => { setSearch(v); setPage(1); }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/blog/${deleteTarget.id}`, { method: 'DELETE' });
      setToast({ message: 'Beitrag gelöscht', type: 'success' });
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
          title="Beitrag löschen?"
          description={`"${deleteTarget.title}" wird endgültig gelöscht.`}
          confirmLabel="Löschen"
          confirmVariant="danger"
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}

      <PageHeader
        title="Blog-Beiträge"
        badge={pagination.total}
        actions={
          <Link
            href="/admin/blog/new"
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Neuer Beitrag
          </Link>
        }
      />

      {/* Filters + Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100/80 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <FilterTabs tabs={statusFilters} active={status} onChange={handleStatusChange} />
        <div className="w-full lg:w-72 ml-auto">
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Beitrag suchen..." />
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
                  <div className="h-5 w-16 admin-skeleton rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100/80">
            <EmptyState
              title="Keine Beiträge gefunden"
              description="Erstelle deinen ersten Blog-Beitrag."
              action={
                <Link href="/admin/blog/new" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition">
                  Neuer Beitrag
                </Link>
              }
            />
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <Link key={post.id} href={`/admin/blog/${post.id}`} className="block bg-white rounded-2xl border border-gray-100/80 p-4 active:bg-gray-50 transition admin-card-touch">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">/{post.slug}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={post.status} />
                      {post.category && <span className="text-xs text-gray-400">{post.category}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{post.views} Views</span>
                      <span>
                        {post.publishedAt
                          ? format(new Date(post.publishedAt), 'dd.MM.yy', { locale: de })
                          : format(new Date(post.createdAt), 'dd.MM.yy', { locale: de })}
                      </span>
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
              itemLabel="Beiträge"
            />
          </>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        {loading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : posts.length === 0 ? (
          <EmptyState
            title="Keine Beiträge gefunden"
            description="Erstelle deinen ersten Blog-Beitrag."
            action={
              <Link
                href="/admin/blog/new"
                className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition"
              >
                Neuer Beitrag
              </Link>
            }
          />
        ) : (
          <>
            {/* Flex Header */}
            <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100/80 bg-gray-50/50">
              {BLOG_COLUMNS.map((col) => (
                <div key={col.key} className={`px-6 py-3 ${col.key === 'actions' ? 'text-center' : 'text-left'}`} style={{ width: col.flex }}>
                  {col.label}
                </div>
              ))}
            </div>
            {/* Virtualized Rows */}
            <VList
              height={Math.min(posts.length * ROW_HEIGHT, 600)}
              itemCount={posts.length}
              itemSize={ROW_HEIGHT}
              width="100%"
              overscanCount={10}
              itemData={{ posts, onDelete: setDeleteTarget }}
            >
              {BlogRow}
            </VList>
          </>
        )}

        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setLimit(size); setPage(1); }}
          itemLabel="Beiträge"
        />
      </div>
    </div>
  );
}
