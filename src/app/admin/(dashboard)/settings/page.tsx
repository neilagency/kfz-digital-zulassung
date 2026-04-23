'use client';

import { useEffect, useState } from 'react';
import { Settings, Phone, Globe, CreditCard, Save, Loader2 } from 'lucide-react';
import { PageHeader, Toast } from '@/components/admin/ui';
import { useSettings } from '@/lib/admin-api';

interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
}

const groupLabels: Record<string, string> = {
  general: 'Allgemein',
  contact: 'Kontakt',
  social: 'Social Media',
  payment: 'Zahlungen',
};

const groupIcons: Record<string, React.ReactNode> = {
  general: <Settings className="w-5 h-5 text-primary" />,
  contact: <Phone className="w-5 h-5 text-emerald-600" />,
  social: <Globe className="w-5 h-5 text-violet-600" />,
  payment: <CreditCard className="w-5 h-5 text-amber-600" />,
};

const groupIconBg: Record<string, string> = {
  general: 'bg-primary-50',
  contact: 'bg-emerald-50',
  social: 'bg-violet-50',
  payment: 'bg-amber-50',
};

const settingLabels: Record<string, string> = {
  site_name: 'Website-Name',
  site_url: 'Website-URL',
  site_description: 'Website-Beschreibung',
  company_name: 'Firmenname',
  phone: 'Telefon',
  email: 'E-Mail',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  mollie_mode: 'Mollie Modus',
  paypal_mode: 'PayPal Modus',
};

export default function SettingsPage() {
  const { data: settingsData, isLoading: loading, mutate } = useSettings();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (settingsData && Array.isArray(settingsData)) setSettings(settingsData);
  }, [settingsData]);

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map((s) => (s.key === key ? { ...s, value } : s)));
    setChanged(true);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: settings.map((s) => ({ key: s.key, value: s.value, group: s.group })),
        }),
      });
      if (res.ok) {
        setChanged(false);
        setToast({ message: 'Einstellungen gespeichert!', type: 'success' });
      } else {
        setToast({ message: 'Fehler beim Speichern', type: 'error' });
      }
    } catch {
      setToast({ message: 'Fehler beim Speichern', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="h-5 w-32 bg-gray-200 rounded" />
            </div>
            <div className="p-6 space-y-4">
              {[...Array(3)].map((__, j) => (
                <div key={j} className="grid grid-cols-3 gap-4 items-center">
                  <div className="h-4 w-28 admin-skeleton rounded-md" />
                  <div className="col-span-2 h-10 admin-skeleton rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const groups = settings.reduce<Record<string, Setting[]>>((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-5 sm:space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <PageHeader
        title="Einstellungen"
        actions={
          changed ? (
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Speichern...' : 'Speichern'}
            </button>
          ) : undefined
        }
      />

      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100/80 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${groupIconBg[group] || 'bg-gray-50'}`}>
              {groupIcons[group] || <Settings className="w-4 h-4 text-gray-400" />}
            </div>
            <h2 className="text-[15px] font-semibold text-gray-900">
              {groupLabels[group] || group}
            </h2>
          </div>
          <div className="p-5 sm:p-6 space-y-5">
            {items.map((setting) => (
              <div key={setting.key} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                <label className="text-sm font-medium text-gray-600 md:pt-2.5">
                  {settingLabels[setting.key] || setting.key}
                </label>
                <div className="md:col-span-2">
                  {setting.key.includes('description') ? (
                    <textarea
                      value={setting.value}
                      onChange={(e) => updateSetting(setting.key, e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/15 focus:border-primary/40 outline-none h-20 transition"
                    />
                  ) : setting.key.endsWith('_mode') ? (
                    <select
                      value={setting.value}
                      onChange={(e) => updateSetting(setting.key, e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary/15 focus:border-primary/40 outline-none transition"
                    >
                      <option value="live">Live</option>
                      <option value="test">Test / Sandbox</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={setting.value}
                      onChange={(e) => updateSetting(setting.key, e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/15 focus:border-primary/40 outline-none transition"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Sticky Save Button (bottom) */}
      {changed && (
        <div className="sticky bottom-20 md:bottom-4 flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-3 bg-primary text-white rounded-2xl font-medium hover:bg-primary-600 transition disabled:opacity-50 shadow-xl shadow-primary/20 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Speichern...' : 'Alle Änderungen speichern'}
          </button>
        </div>
      )}
    </div>
  );
}
