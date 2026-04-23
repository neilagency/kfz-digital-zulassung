'use client';

import { lazy, Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  TrendingUp,
  Package,
  Clock,
  Users,
  BookOpen,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { StatsCard, StatusBadge, EmptyState, TableSkeleton } from '@/components/admin/ui';
import { useDashboard } from '@/lib/admin-api';

const LazyChart = lazy(() => import('./DashboardChart'));

interface DashboardData {
  stats: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    pendingOrders: number;
    totalCustomers: number;
    totalBlogPosts: number;
    totalRevenue: number;
  };
  recentOrders: any[];
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
}

function useTodayDate() {
  const [date, setDate] = useState('');
  useEffect(() => {
    setDate(format(new Date(), 'EEEE, dd. MMMM yyyy', { locale: de }));
  }, []);
  return date;
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboard();
  const todayDate = useTodayDate();

  if (isLoading) {
    return (
      <div className="space-y-6 pt-14 md:pt-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 admin-skeleton rounded-lg w-36 mb-2" />
            <div className="h-4 admin-skeleton rounded-md w-48" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100/80">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-3 admin-skeleton rounded-md w-16" />
                  <div className="h-7 admin-skeleton rounded-md w-12" />
                </div>
                <div className="w-11 h-11 admin-skeleton rounded-xl" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100/80">
          <div className="h-5 admin-skeleton rounded-md w-40 mb-6" />
          <div className="h-[240px] sm:h-[300px] admin-skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-red-500">Fehler beim Laden der Daten</p>;

  const { stats, recentOrders, monthlyRevenue } = data;

  const statCards = [
    {
      label: 'Umsatz (Gesamt)',
      value: `€${stats.totalRevenue.toFixed(2)}`,
      icon: <TrendingUp className="w-5 h-5" />,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      sub: `${stats.completedOrders} abgeschlossen`,
    },
    {
      label: 'Bestellungen',
      value: stats.totalOrders,
      icon: <Package className="w-5 h-5" />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      sub: `${stats.completedOrders} abgeschlossen`,
    },
    {
      label: 'Ausstehend',
      value: stats.pendingOrders,
      icon: <Clock className="w-5 h-5" />,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Kunden',
      value: stats.totalCustomers,
      icon: <Users className="w-5 h-5" />,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Blog-Beiträge',
      value: stats.totalBlogPosts,
      icon: <BookOpen className="w-5 h-5" />,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Storniert',
      value: stats.cancelledOrders,
      icon: <XCircle className="w-5 h-5" />,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-14 md:pt-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          {todayDate && (
            <p className="text-sm text-gray-400 mt-0.5">{todayDate}</p>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </div>

      {/* Revenue Chart - Lazy Loaded */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100/80">
        <h2 className="text-[15px] font-semibold text-gray-900 mb-4">Monatlicher Umsatz</h2>
        <Suspense
          fallback={
            <div className="h-[240px] sm:h-[300px] admin-skeleton rounded-xl flex items-center justify-center text-gray-400 text-sm">
              Chart wird geladen...
            </div>
          }
        >
          <LazyChart data={monthlyRevenue} />
        </Suspense>
      </div>

      {/* Recent Orders — Mobile: Cards, Desktop: Table */}
      <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100/80 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-gray-900">Letzte Bestellungen</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:text-primary-600 font-medium flex items-center gap-1 transition"
          >
            Alle
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <>
            {/* Mobile: Cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between px-5 py-3.5 active:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-primary">#{order.orderNumber}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {order.billingFirstName} {order.billingLastName}
                    </p>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">€{order.total?.toFixed(2)}</p>
                    <p className="text-[11px] text-gray-400">
                      {format(new Date(order.createdAt), 'dd.MM.yy', { locale: de })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100/80 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Kunde</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Summe</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Datum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <Link href={`/admin/orders/${order.id}`} className="text-primary font-semibold hover:underline">
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-gray-700">
                        {order.billingFirstName} {order.billingLastName}
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-gray-900">€{order.total?.toFixed(2)}</td>
                      <td className="px-6 py-3.5 text-gray-400">
                        {format(new Date(order.createdAt), 'dd.MM.yyyy', { locale: de })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState
            title="Noch keine Bestellungen"
            description="Importiere Bestellungen aus WordPress oder warte auf neue Bestellungen."
            icon={<Package className="w-7 h-7 text-gray-300" />}
          />
        )}
      </div>
    </div>
  );
}
