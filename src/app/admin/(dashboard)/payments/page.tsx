'use client';

import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Activity, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PageHeader, StatsCard, Toast } from '@/components/admin/ui';
import { usePayments } from '@/lib/admin-api';

export default function PaymentsPage() {
  const { data, isLoading: loading, mutate } = usePayments();
  const [gateways, setGateways] = useState<any[]>([]);
  const [paymentStats, setPaymentStats] = useState<any[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (data) {
      setGateways(data.gateways || []);
      setPaymentStats(data.paymentStats || []);
    }
  }, [data]);

  const toggleGateway = async (gateway: any) => {
    setSaving(gateway.id);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: gateway.id, isEnabled: !gateway.isEnabled }),
      });
      if (res.ok) {
        const updated = await res.json();
        setGateways(gateways.map((g) => (g.id === updated.id ? updated : g)));
        setToast({ message: `${gateway.name} ${!gateway.isEnabled ? 'aktiviert' : 'deaktiviert'}`, type: 'success' });
      }
    } catch {
      setToast({ message: 'Fehler beim Aktualisieren', type: 'error' });
    } finally {
      setSaving(null);
    }
  };

  const updateFee = async (gateway: any, fee: number) => {
    setSaving(gateway.id);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: gateway.id, fee }),
      });
      if (res.ok) {
        const updated = await res.json();
        setGateways(gateways.map((g) => (g.id === updated.id ? updated : g)));
        setToast({ message: 'Gebühr aktualisiert', type: 'success' });
      }
    } catch {
      setToast({ message: 'Fehler beim Speichern', type: 'error' });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 admin-skeleton rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100/80">
              <div className="h-4 w-20 admin-skeleton rounded-md mb-3" />
              <div className="h-7 w-28 admin-skeleton rounded-md mb-2" />
              <div className="h-3 w-24 admin-skeleton rounded-md" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100/80 h-48 admin-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  const totalRevenue = paymentStats.reduce((sum, s) => sum + (s._sum?.amount || 0), 0);
  const totalTransactions = paymentStats.reduce((sum, s) => sum + (s._count || 0), 0);

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <PageHeader title="Zahlungsgateways" description="Verwalte deine Zahlungsmethoden und Gebühren" />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          label="Gesamtumsatz"
          value={`€${totalRevenue.toFixed(2)}`}
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          label="Transaktionen"
          value={String(totalTransactions)}
          icon={<Activity className="w-5 h-5" />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatsCard
          label="Aktive Gateways"
          value={String(gateways.filter(g => g.isEnabled).length)}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          label="Inaktive Gateways"
          value={String(gateways.filter(g => !g.isEnabled).length)}
          icon={<AlertCircle className="w-5 h-5" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Per-Gateway Stats */}
      {paymentStats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {paymentStats.map((stat) => (
            <div key={stat.gateway} className="bg-white rounded-2xl p-4 border border-gray-100/80">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{stat.gateway}</p>
              <p className="text-xl font-bold text-gray-900">€{stat._sum?.amount?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-gray-400 mt-1">{stat._count} Transaktionen</p>
            </div>
          ))}
        </div>
      )}

      {/* Gateways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gateways.map((gw) => (
          <div key={gw.id} className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    gw.isEnabled ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-gray-50 ring-1 ring-gray-200'
                  }`}>
                    <CreditCard className={`w-5 h-5 ${gw.isEnabled ? 'text-emerald-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{gw.name}</h3>
                    <p className="text-xs text-gray-400 font-mono">{gw.gatewayId}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleGateway(gw)}
                  disabled={saving === gw.id}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    gw.isEnabled ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  {saving === gw.id ? (
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin absolute left-1/2 -translate-x-1/2" />
                  ) : (
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      gw.isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-4">{gw.description}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block mb-1.5">Gebühr</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-sm">€</span>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={gw.fee}
                      onBlur={(e) => {
                        const newFee = parseFloat(e.target.value);
                        if (newFee !== gw.fee) updateFee(gw, newFee);
                      }}
                      className="w-16 px-1.5 py-0.5 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block mb-1.5">Modus</span>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                    gw.mode === 'live' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${gw.mode === 'live' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {gw.mode === 'live' ? 'Live' : 'Test'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
