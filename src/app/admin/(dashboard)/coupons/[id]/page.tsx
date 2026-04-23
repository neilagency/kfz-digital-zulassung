'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  ArrowLeft,
  Save,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Tag,
  ToggleLeft,
  ToggleRight,
  Eye,
  Users,
} from 'lucide-react';
import { Toast } from '@/components/admin/ui';

function generateCode(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function CouponEditorPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id as string;
  const isNew = couponId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [copied, setCopied] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'fixed' as 'fixed' | 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxUsageTotal: '',
    maxUsagePerUser: '1',
    productSlugs: '',
    isActive: true,
    showBanner: false,
    bannerText: '',
    startDate: '',
    endDate: '',
  });

  const [usages, setUsages] = useState<any[]>([]);
  const [usageCount, setUsageCount] = useState(0);

  // Load products for selector
  useEffect(() => {
    fetch('/api/admin/products?limit=100')
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  // Load coupon if editing
  useEffect(() => {
    if (isNew) {
      setForm((prev) => ({ ...prev, code: generateCode() }));
      return;
    }
    fetch(`/api/admin/coupons/${couponId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setToast({ message: data.error, type: 'error' });
          return;
        }
        setForm({
          code: data.code || '',
          description: data.description || '',
          discountType: data.discountType || 'fixed',
          discountValue: String(data.discountValue || ''),
          minOrderValue: data.minOrderValue ? String(data.minOrderValue) : '',
          maxUsageTotal: data.maxUsageTotal ? String(data.maxUsageTotal) : '',
          maxUsagePerUser: String(data.maxUsagePerUser || 1),
          productSlugs: data.productSlugs || '',
          isActive: data.isActive,
          showBanner: data.showBanner || false,
          bannerText: data.bannerText || '',
          startDate: data.startDate ? data.startDate.slice(0, 16) : '',
          endDate: data.endDate ? data.endDate.slice(0, 16) : '',
        });
        setUsages(data.usages || []);
        setUsageCount(data._count?.usages || 0);
      })
      .catch(() => setToast({ message: 'Fehler beim Laden', type: 'error' }))
      .finally(() => setLoading(false));
  }, [couponId, isNew]);

  const handleChange = useCallback((field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(form.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [form.code]);

  const handleSave = async () => {
    if (!form.code.trim()) {
      setToast({ message: 'Code ist erforderlich', type: 'error' });
      return;
    }
    if (!form.discountValue || parseFloat(form.discountValue) <= 0) {
      setToast({ message: 'Rabattwert muss größer als 0 sein', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const url = isNew ? '/api/admin/coupons' : `/api/admin/coupons/${couponId}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          discountValue: parseFloat(form.discountValue) || 0,
          minOrderValue: parseFloat(form.minOrderValue) || 0,
          maxUsageTotal: parseInt(form.maxUsageTotal) || 0,
          maxUsagePerUser: parseInt(form.maxUsagePerUser) || 1,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || 'Fehler beim Speichern', type: 'error' });
        return;
      }

      setToast({ message: 'Gutschein gespeichert', type: 'success' });
      if (isNew && data.id) {
        router.replace(`/admin/coupons/${data.id}`);
      }
    } catch {
      setToast({ message: 'Fehler beim Speichern', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Build selected product slugs
  const selectedSlugs = form.productSlugs
    ? form.productSlugs.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const toggleProductSlug = (slug: string) => {
    const current = selectedSlugs;
    if (current.includes(slug)) {
      handleChange('productSlugs', current.filter((s) => s !== slug).join(','));
    } else {
      handleChange('productSlugs', [...current, slug].join(','));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 admin-skeleton rounded-lg" />
          <div className="h-6 w-48 admin-skeleton rounded-md" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 admin-skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/coupons"
            className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-primary-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isNew ? 'Neuer Gutschein' : `${form.code}`}
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Speichern
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Code + Discount */}
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Gutschein-Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gutschein-Code *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono font-bold uppercase"
                  placeholder="z.B. SAVE10"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:text-primary hover:border-primary/30 transition"
                  title="Code kopieren"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('code', generateCode())}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:text-primary hover:border-primary/30 transition"
                  title="Code generieren"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                placeholder="z.B. Sommer-Aktion 2025"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rabatt-Typ *</label>
                <select
                  value={form.discountType}
                  onChange={(e) => handleChange('discountType', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                >
                  <option value="fixed">Fester Betrag (€)</option>
                  <option value="percentage">Prozentsatz (%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rabattwert * {form.discountType === 'percentage' ? '(%)' : '(€)'}
                </label>
                <input
                  type="number"
                  step={form.discountType === 'percentage' ? '1' : '0.01'}
                  min="0"
                  max={form.discountType === 'percentage' ? '100' : undefined}
                  value={form.discountValue}
                  onChange={(e) => handleChange('discountValue', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  placeholder={form.discountType === 'percentage' ? '15' : '10.00'}
                />
              </div>
            </div>
          </div>

          {/* Product targeting */}
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Produkt-Zuordnung</h2>
            <p className="text-xs text-gray-400">Wenn kein Produkt ausgewählt ist, gilt der Gutschein für alle Produkte.</p>

            <div className="space-y-2">
              {products.map((product) => (
                <label key={product.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedSlugs.includes(product.slug)}
                    onChange={() => toggleProductSlug(product.slug)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">{product.name}</span>
                    <span className="text-xs text-gray-400 ml-2">({product.price.toFixed(2).replace('.', ',')} €)</span>
                  </div>
                </label>
              ))}
              {products.length === 0 && (
                <p className="text-sm text-gray-400">Keine Produkte gefunden</p>
              )}
            </div>
          </div>

          {/* Usage history (for existing coupons) */}
          {!isNew && usages.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Nutzungsverlauf ({usageCount})
              </h2>
              <div className="space-y-2">
                {usages.map((u) => (
                  <div key={u.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600">{u.email}</span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(u.createdAt), 'dd.MM.yy HH:mm', { locale: de })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Limits */}
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Einschränkungen</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mindestbestellwert (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.minOrderValue}
                onChange={(e) => handleChange('minOrderValue', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                placeholder="0 = kein Minimum"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max. Nutzung gesamt</label>
              <input
                type="number"
                min="0"
                value={form.maxUsageTotal}
                onChange={(e) => handleChange('maxUsageTotal', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                placeholder="0 = unbegrenzt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max. pro E-Mail</label>
              <input
                type="number"
                min="1"
                value={form.maxUsagePerUser}
                onChange={(e) => handleChange('maxUsagePerUser', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                placeholder="1"
              />
            </div>
          </div>

          {/* Date range */}
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Zeitraum</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Startdatum</label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enddatum</label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              />
            </div>

            <p className="text-xs text-gray-400">Leer = unbegrenzt gültig. Nach Ablauf wird der Gutschein automatisch als abgelaufen angezeigt.</p>
          </div>

          {/* Status + Banner */}
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Status & Banner</h2>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Gutschein aktiv</span>
              <button
                type="button"
                onClick={() => handleChange('isActive', !form.isActive)}
                className={`w-12 h-7 rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-1 ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Promo-Banner zeigen</span>
              <button
                type="button"
                onClick={() => handleChange('showBanner', !form.showBanner)}
                className={`w-12 h-7 rounded-full transition-colors ${form.showBanner ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-1 ${form.showBanner ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </label>

            {form.showBanner && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner-Text</label>
                <textarea
                  value={form.bannerText}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      handleChange('bannerText', e.target.value);
                    }
                  }}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-y"
                  placeholder="z.B. 🔥 10€ Rabatt mit Code SAVE10"
                  dir="auto"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">Wird oben auf der Website angezeigt</p>
                  <p className={`text-xs ${(form.bannerText?.length || 0) > 150 ? 'text-amber-500 font-medium' : 'text-gray-400'}`}>
                    {form.bannerText?.length || 0}/200
                  </p>
                </div>
                {(form.bannerText?.length || 0) > 150 && (
                  <p className="text-xs text-amber-500 mt-1">⚠️ Langer Text kann auf Mobilgeräten mehrzeilig dargestellt werden</p>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          {!isNew && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-800 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Users className="w-4 h-4" />
                Statistiken
              </div>
              <p>
                <strong>{usageCount}</strong> Nutzungen
                {form.maxUsageTotal && parseInt(form.maxUsageTotal) > 0 && (
                  <> von <strong>{form.maxUsageTotal}</strong></>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
