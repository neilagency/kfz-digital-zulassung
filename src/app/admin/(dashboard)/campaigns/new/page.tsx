'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Toast } from '@/components/admin/ui';

const TEMPLATES = [
  { id: 'empty', name: 'Leere Vorlage', description: 'Starten Sie von Grund auf', icon: '📄' },
  { id: 'welcome', name: 'Willkommen', description: 'Begrüßung neuer Kunden', icon: '👋' },
  { id: 'discount', name: 'Rabatt-Aktion', description: 'Sonderangebot oder Rabattcode', icon: '🏷️' },
  { id: 'reminder', name: 'Erinnerung', description: 'Kunden an offene Aufgaben erinnern', icon: '🔔' },
  { id: 'newsletter', name: 'Newsletter', description: 'Allgemeine Neuigkeiten & Updates', icon: '📰' },
  { id: 'feedback', name: 'Feedback anfragen', description: 'Kundenbewertung einholen', icon: '⭐' },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('empty');
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setToast({ message: 'Kampagnen-Name ist erforderlich', type: 'error' });
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/admin/email-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          templateId: selectedTemplate !== 'empty' ? selectedTemplate : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ message: data.error || 'Fehler beim Erstellen', type: 'error' });
        return;
      }
      router.push(`/admin/campaigns/${data.id}`);
    } catch {
      setToast({ message: 'Fehler beim Erstellen', type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/campaigns"
          className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-primary-50 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Neue Kampagne erstellen</h1>
      </div>

      {/* Campaign name */}
      <div className="bg-white rounded-2xl border border-gray-100/80 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Kampagnen-Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          placeholder="z.B. Sommer-Angebot 2025"
          autoFocus
        />
      </div>

      {/* Template selection */}
      <div className="bg-white rounded-2xl border border-gray-100/80 p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Vorlage wählen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplate(template.id)}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition ${
                selectedTemplate === template.id
                  ? 'border-primary bg-primary-50'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl mt-0.5">{template.icon}</span>
              <div>
                <p className="font-medium text-gray-900 text-sm">{template.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Create button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating || !name.trim()}
          className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition flex items-center gap-2 disabled:opacity-50"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Kampagne erstellen
        </button>
      </div>
    </div>
  );
}
