'use client';

import { useState, useCallback, memo } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Users, Mail, Phone, MapPin, ShoppingBag, UserCheck, UserX } from 'lucide-react';
import { FixedSizeList as VList } from 'react-window';
import {
  PageHeader,
  SearchInput,
  Pagination,
  EmptyState,
  TableSkeleton,
} from '@/components/admin/ui';
import { useCustomers } from '@/lib/admin-api';

const COL_STYLE = 'px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left';
const COLUMNS = [
  { label: 'Name', flex: '22%' },
  { label: 'E-Mail', flex: '20%' },
  { label: 'Telefon', flex: '11%' },
  { label: 'Stadt', flex: '11%' },
  { label: 'Status', flex: '9%' },
  { label: 'Bestellungen', flex: '9%' },
  { label: 'Umsatz', flex: '9%' },
  { label: 'Erstellt', flex: '9%' },
];
const ROW_HEIGHT = 48;

const CustomerRow = memo(function CustomerRow({ index, style, data }: {
  index: number; style: React.CSSProperties; data: { customers: any[] };
}) {
  const c = data.customers[index];
  return (
    <div style={style} className="flex items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-sm">
      <div className="px-6 py-2" style={{ width: '22%' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary text-xs font-bold">
              {(c.firstName?.[0] || '?').toUpperCase()}
            </span>
          </div>
          <span className="font-medium text-gray-900 truncate">{c.firstName} {c.lastName}</span>
        </div>
      </div>
      <div className="px-6 py-2 text-gray-500 truncate" style={{ width: '20%' }}>{c.email}</div>
      <div className="px-6 py-2 text-gray-500" style={{ width: '11%' }}>{c.phone || '-'}</div>
      <div className="px-6 py-2 text-gray-500" style={{ width: '11%' }}>{c.city || '-'}</div>
      <div className="px-6 py-2" style={{ width: '9%' }}>
        {c.hasAccount ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
            <UserCheck className="w-3 h-3" /> Registriert
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
            <UserX className="w-3 h-3" /> Gast
          </span>
        )}
      </div>
      <div className="px-6 py-2" style={{ width: '9%' }}>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          {c.totalOrders}
        </span>
      </div>
      <div className="px-6 py-2 font-semibold text-gray-900" style={{ width: '9%' }}>€{c.totalSpent?.toFixed(2)}</div>
      <div className="px-6 py-2 text-gray-400" style={{ width: '9%' }}>
        {format(new Date(c.createdAt), 'dd.MM.yy', { locale: de })}
      </div>
    </div>
  );
});

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');

  const { data, isLoading: loading } = useCustomers({ page, search, limit });
  const customers: any[] = data?.customers ?? [];
  const pagination = data?.pagination ?? { page: 1, pages: 1, total: 0 };

  const handleSearchChange = useCallback((v: string) => { setSearch(v); setPage(1); }, []);

  const listHeight = Math.min(customers.length * ROW_HEIGHT, 600);

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader title="Kunden" badge={pagination.total} />

      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100/80">
        <div className="w-full max-w-sm">
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Name oder E-Mail suchen..." />
        </div>
      </div>

      {/* ═══ MOBILE: Card View ═══ */}
      <div className="md:hidden space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100/80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 admin-skeleton rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-32 admin-skeleton rounded-md" />
                    <div className="h-3 w-44 admin-skeleton rounded-md" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-3 w-20 admin-skeleton rounded-md" />
                  <div className="h-3 w-16 admin-skeleton rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100/80">
            <EmptyState
              title="Keine Kunden gefunden"
              description="Kunden werden automatisch bei neuen Bestellungen angelegt."
              icon={<Users className="w-7 h-7 text-gray-300" />}
            />
          </div>
        ) : (
          customers.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-4 border border-gray-100/80 admin-card-touch"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-sm font-bold">
                    {(c.firstName?.[0] || '?').toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.firstName} {c.lastName}</p>
                  <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    {c.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
                {c.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {c.phone}
                  </span>
                )}
                {c.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {c.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" />
                  {c.totalOrders} Bestellungen
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    Seit {format(new Date(c.createdAt), 'dd.MM.yy', { locale: de })}
                  </span>
                  {c.hasAccount ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700">
                      <UserCheck className="w-2.5 h-2.5" /> Registriert
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                      <UserX className="w-2.5 h-2.5" /> Gast
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-gray-900">€{c.totalSpent?.toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
        <div className="bg-white rounded-2xl border border-gray-100/80">
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            pageSize={limit}
            onPageChange={setPage}
            itemLabel="Kunden"
          />
        </div>
      </div>

      {/* ═══ DESKTOP: Table View ═══ */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        {loading ? (
          <TableSkeleton rows={10} columns={7} />
        ) : customers.length === 0 ? (
          <EmptyState
            title="Keine Kunden gefunden"
            description="Kunden werden automatisch bei neuen Bestellungen angelegt."
            icon={<Users className="w-7 h-7 text-gray-300" />}
          />
        ) : (
          <>
            <div className="flex border-b border-gray-100/80 bg-gray-50/50">
              {COLUMNS.map((col) => (
                <div key={col.label} className={COL_STYLE} style={{ width: col.flex }}>{col.label}</div>
              ))}
            </div>
            <VList
              height={listHeight}
              itemCount={customers.length}
              itemSize={ROW_HEIGHT}
              width="100%"
              itemData={{ customers }}
              overscanCount={10}
            >
              {CustomerRow}
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
          itemLabel="Kunden"
        />
      </div>
    </div>
  );
}
