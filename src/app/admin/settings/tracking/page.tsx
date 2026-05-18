'use client';

import { useEffect, useState } from 'react';
import {
  Settings,
  Save,
  Loader2,
  ExternalLink,
  Eye,
  Tag,
  BarChart3,
  Shield,
  Globe,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader, Toast, StatusBadge } from '@/components/admin/ui';

interface TrackingSettings {
  gtm_enabled: boolean;
  gtm_container_id: string;
  ga4_enabled: boolean;
  ga4_measurement_id: string;
  ga4_send_page_view: boolean;
  anonymize_ip: boolean;
  cookie_consent_required: boolean;
  environments: Record<string, boolean>;
  updated_at: string | null;
  updated_by_id: string | null;
}

const ENV_LABELS: Record<string, string> = {
  development: 'Entwicklung',
  staging: 'Staging',
  production: 'Produktion',
};

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex items-center pt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:bg-primary transition-colors" />
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
      </div>
      <div>
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">{icon}</div>
        <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-5 sm:p-6 space-y-5">{children}</div>
    </div>
  );
}

export default function TrackingSettingsPage() {
  const [settings, setSettings] = useState<TrackingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState(false);
  const [envOpen, setEnvOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/admin/tracking-settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setToast({ message: 'Fehler beim Laden der Tracking-Einstellungen', type: 'error' });
      });
  }, []);

  const update = <K extends keyof TrackingSettings>(key: K, value: TrackingSettings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : null));
    setChanged(true);
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/tracking-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          environments: settings.environments,
          updated_at: settings.updated_at,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data.data);
        setChanged(false);
        setToast({ message: 'Tracking-Einstellungen gespeichert!', type: 'success' });
      } else {
        setToast({ message: data.error || 'Fehler beim Speichern', type: 'error' });
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
        <div className="h-8 w-56 bg-gray-200 rounded-lg animate-pulse" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 animate-pulse h-48" />
        ))}
      </div>
    );
  }

  if (!settings) {
    return <p className="text-red-500">Fehler beim Laden der Tracking-Einstellungen</p>;
  }

  const [envLabel, setEnvLabel] = useState('Entwicklung');

  useEffect(() => {
    // Client-side only to avoid hydration mismatch
    setEnvLabel(
      process.env.NODE_ENV === 'production'
        ? 'Produktion'
        : process.env.NODE_ENV === 'test'
        ? 'Staging'
        : 'Entwicklung'
    );
  }, []);
  const isAnyActive = settings.gtm_enabled || settings.ga4_enabled;

  return (
    <div className="space-y-5 sm:space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <PageHeader
        title="Tracking-Einstellungen"
        actions={
          changed ? (
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Speichern...' : 'Speichern'}
            </button>
          ) : undefined
        }
      />

      {/* Status Banner */}
      <div className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isAnyActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Scripts sind {isAnyActive ? 'AKTIV' : 'INAKTIV'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Umgebung: <span className="font-medium text-gray-700">{envLabel}</span>
              {settings.updated_at && (
                <>
                  {' · '}
                  Zuletzt geändert: {new Date(settings.updated_at).toLocaleString('de-DE')}
                </>
              )}
            </p>
          </div>
        </div>
        {changed && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-xl">
            <AlertCircle className="w-4 h-4" />
            Änderungen werden in ~60 Sekunden auf der Website sichtbar.
          </div>
        )}
      </div>

      {/* Google Tag Manager */}
      <SectionCard icon={<Tag className="w-5 h-5 text-primary" />} title="Google Tag Manager">
        <Toggle
          checked={settings.gtm_enabled}
          onChange={(v) => update('gtm_enabled', v)}
          label="GTM aktivieren"
          description="Google Tag Manager auf allen Seiten laden"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
          <label className="text-sm font-medium text-gray-600 md:pt-2.5">Container ID</label>
          <div className="md:col-span-2">
            <input
              type="text"
              value={settings.gtm_container_id}
              onChange={(e) => update('gtm_container_id', e.target.value)}
              placeholder="GTM-XXXXXXX"
              className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/15 focus:border-primary/40 outline-none transition uppercase"
            />
            <p className="text-xs text-gray-400 mt-1.5">Format: GTM-XXXXXXX</p>
          </div>
        </div>
      </SectionCard>

      {/* Google Analytics 4 */}
      <SectionCard icon={<BarChart3 className="w-5 h-5 text-violet-600" />} title="Google Analytics 4">
        <Toggle
          checked={settings.ga4_enabled}
          onChange={(v) => update('ga4_enabled', v)}
          label="GA4 aktivieren"
          description="Google Analytics 4 auf allen Seiten laden"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
          <label className="text-sm font-medium text-gray-600 md:pt-2.5">Measurement ID</label>
          <div className="md:col-span-2">
            <input
              type="text"
              value={settings.ga4_measurement_id}
              onChange={(e) => update('ga4_measurement_id', e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl text-sm focus:ring-2 focus:ring-primary/15 focus:border-primary/40 outline-none transition uppercase"
            />
            <p className="text-xs text-gray-400 mt-1.5">Format: G-XXXXXXXXXX</p>
          </div>
        </div>
        <Toggle
          checked={settings.ga4_send_page_view}
          onChange={(v) => update('ga4_send_page_view', v)}
          label="Automatische Page Views senden"
        />
        <Toggle
          checked={settings.anonymize_ip}
          onChange={(v) => update('anonymize_ip', v)}
          label="IP-Anonymisierung aktivieren"
          description="Besucher-IP wird anonymisiert bevor Daten an GA4 gesendet werden"
        />
      </SectionCard>

      {/* Privacy & Consent */}
      <SectionCard icon={<Shield className="w-5 h-5 text-emerald-600" />} title="Datenschutz & Consent">
        <Toggle
          checked={settings.cookie_consent_required}
          onChange={(v) => update('cookie_consent_required', v)}
          label="Cookie-Zustimmung erforderlich"
          description="Tracking-Scripts erst nach Cookie-Zustimmung laden"
        />
      </SectionCard>

      {/* Environment Overrides */}
      <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        <button
          onClick={() => setEnvOpen(!envOpen)}
          className="w-full px-5 sm:px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-[15px] font-semibold text-gray-900">Umgebungs-Overrides</h2>
          </div>
          {envOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        {envOpen && (
          <div className="px-5 sm:px-6 pb-6 space-y-4">
            <p className="text-sm text-gray-500">
              Steuere, ob Tracking in bestimmten Umgebungen aktiv ist. Standard: nur in Produktion aktiv.
            </p>
            {(['development', 'staging', 'production'] as const).map((e) => (
              <Toggle
                key={e}
                checked={settings.environments[e] ?? (e === 'production')}
                onChange={(v) =>
                  update('environments', { ...settings.environments, [e]: v })
                }
                label={ENV_LABELS[e]}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-gray-500" />
          </div>
          <h2 className="text-[15px] font-semibold text-gray-900">Aktionen</h2>
        </div>
        <div className="p-5 sm:p-6 flex flex-wrap gap-3">
          <a
            href="https://tagassistant.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
          >
            <Tag className="w-4 h-4 text-gray-400" />
            GTM testen
          </a>
          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-gray-400" />
            GA4 öffnen
          </a>
          <a
            href="/?gtm_preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-gray-400" />
            Vorschau
          </a>
        </div>
      </div>

      {/* Sticky Save */}
      {changed && (
        <div className="sticky bottom-20 md:bottom-4 flex justify-end">
          <button
            onClick={save}
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
