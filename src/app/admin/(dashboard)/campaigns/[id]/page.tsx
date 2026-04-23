'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Copy,
  TestTube,
  Calendar,
  Target,
  BarChart3,
  Mail,
} from 'lucide-react';
import { Toast, ConfirmModal } from '@/components/admin/ui';

const TiptapEditor = dynamic(() => import('@/components/admin/TiptapEditor'), {
  ssr: false,
  loading: () => <div className="h-64 admin-skeleton rounded-xl" />,
});

// Segment definitions (matching server-side)
const SEGMENTS = [
  { type: 'newCustomers30d', label: 'Neue Kunden (letzte 30 Tage)', icon: '🆕' },
  { type: 'repeatCustomers', label: 'Wiederkehrende Kunden (2+ Bestellungen)', icon: '🔄' },
  { type: 'highValue', label: 'Premium-Kunden (50€+ ausgegeben)', icon: '💎' },
  { type: 'inactive90d', label: 'Inaktive Kunden (90+ Tage)', icon: '😴' },
  { type: 'recentOrders30d', label: 'Aktive Kunden (letzte 30 Tage)', icon: '🛒' },
];

export default function CampaignEditorPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const isNew = campaignId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [pollingStatus, setPollingStatus] = useState<any>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Test email state
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  // Duplicate state
  const [duplicating, setDuplicating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    subject: '',
    heading: '',
    content: '',
    imageUrl: '',
    ctaText: '',
    ctaUrl: '',
    targetMode: 'all',
    targetEmails: '',
    targetSegment: '',
    scheduledAt: '',
  });
  const [status, setStatus] = useState('draft');
  const [campaignData, setCampaignData] = useState<any>(null);

  // Load campaign if editing
  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/email-campaigns/${campaignId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setToast({ message: data.error, type: 'error' });
          return;
        }
        setForm({
          name: data.name || '',
          subject: data.subject || '',
          heading: data.heading || '',
          content: data.content || '',
          imageUrl: data.imageUrl || '',
          ctaText: data.ctaText || '',
          ctaUrl: data.ctaUrl || '',
          targetMode: data.targetMode || 'all',
          targetEmails: data.targetEmails || '',
          targetSegment: data.targetSegment || '',
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString().slice(0, 16) : '',
        });
        setStatus(data.status);
        setCampaignData(data);
      })
      .catch(() => setToast({ message: 'Fehler beim Laden', type: 'error' }))
      .finally(() => setLoading(false));
  }, [campaignId, isNew]);

  // Count recipients based on targeting mode
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/admin/email-campaigns/count-recipients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetMode: form.targetMode,
            targetEmails: form.targetEmails,
            targetSegment: form.targetSegment,
          }),
        });
        const data = await res.json();
        setRecipientCount(data.count ?? 0);
      } catch {
        setRecipientCount(null);
      }
    };
    fetchCount();
  }, [form.targetMode, form.targetEmails, form.targetSegment]);

  // Poll for sending progress
  useEffect(() => {
    if (status === 'sending' && !isNew) {
      pollingRef.current = setInterval(() => {
        fetch(`/api/admin/email-campaigns/${campaignId}`)
          .then((r) => r.json())
          .then((data) => {
            setPollingStatus(data);
            setCampaignData(data);
            if (data.status !== 'sending') {
              setStatus(data.status);
              if (pollingRef.current) clearInterval(pollingRef.current);
            }
          });
      }, 3000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [status, campaignId, isNew]);

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    if (!form.name.trim()) {
      setToast({ message: 'Name ist erforderlich', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const url = isNew
        ? '/api/admin/email-campaigns'
        : `/api/admin/email-campaigns/${campaignId}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        ...form,
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || 'Fehler beim Speichern', type: 'error' });
        return;
      }

      setToast({ message: 'Kampagne gespeichert', type: 'success' });
      setStatus(data.status || 'draft');
      setCampaignData(data);
      if (isNew && data.id) {
        router.replace(`/admin/campaigns/${data.id}`);
      }
    } catch {
      setToast({ message: 'Fehler beim Speichern', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    setShowSendConfirm(false);
    setSending(true);
    try {
      // Save first
      if (status === 'draft' || status === 'scheduled') {
        const payload = {
          ...form,
          scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
        };
        const saveRes = await fetch(`/api/admin/email-campaigns/${campaignId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!saveRes.ok) {
          const err = await saveRes.json();
          setToast({ message: err.error || 'Fehler beim Speichern', type: 'error' });
          setSending(false);
          return;
        }
      }

      const res = await fetch(`/api/admin/email-campaigns/${campaignId}/send`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || 'Fehler beim Senden', type: 'error' });
        setSending(false);
        return;
      }

      setToast({ message: data.message || 'Kampagne wird gesendet...', type: 'success' });
      setStatus('sending');
    } catch {
      setToast({ message: 'Fehler beim Senden', type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleTestSend = async () => {
    if (!testEmail.trim()) return;
    setSendingTest(true);
    try {
      // Save first
      if (status === 'draft' || status === 'scheduled') {
        await fetch(`/api/admin/email-campaigns/${campaignId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }

      const res = await fetch(`/api/admin/email-campaigns/${campaignId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || 'Test fehlgeschlagen', type: 'error' });
      } else {
        setToast({ message: data.message, type: 'success' });
        setShowTestModal(false);
      }
    } catch {
      setToast({ message: 'Test fehlgeschlagen', type: 'error' });
    } finally {
      setSendingTest(false);
    }
  };

  const handleDuplicate = async () => {
    setDuplicating(true);
    try {
      const res = await fetch(`/api/admin/email-campaigns/${campaignId}/duplicate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ message: data.error || 'Fehler beim Duplizieren', type: 'error' });
      } else {
        setToast({ message: 'Kampagne dupliziert', type: 'success' });
        router.push(`/admin/campaigns/${data.id}`);
      }
    } catch {
      setToast({ message: 'Fehler beim Duplizieren', type: 'error' });
    } finally {
      setDuplicating(false);
    }
  };

  const isEditable = status === 'draft' || status === 'scheduled';
  const isSending = status === 'sending';
  const isSent = status === 'sent';

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

      {showSendConfirm && (
        <ConfirmModal
          title="Kampagne senden?"
          description={`Die Kampagne "${form.name}" wird an ${recipientCount ?? '...'} Empfänger gesendet. Dieser Vorgang kann nicht rückgängig gemacht werden.`}
          confirmLabel="Jetzt senden"
          confirmVariant="danger"
          loading={sending}
          onConfirm={handleSend}
          onCancel={() => !sending && setShowSendConfirm(false)}
        />
      )}

      {/* Test Email Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <TestTube className="w-5 h-5 text-amber-500" />
                Test-E-Mail senden
              </h3>
              <button type="button" onClick={() => setShowTestModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Die Kampagne wird als Test an diese E-Mail gesendet. Der Status wird nicht geändert.
            </p>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm mb-4"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowTestModal(false)} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleTestSend}
                disabled={sendingTest || !testEmail.trim()}
                className="px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                {sendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Test senden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns"
            className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-primary-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isNew ? 'Neue Kampagne' : form.name || 'Kampagne bearbeiten'}
            </h1>
            {!isNew && campaignData && (
              <p className="text-xs text-gray-400 mt-0.5">
                Erstellt: {format(new Date(campaignData.createdAt), 'dd.MM.yyyy HH:mm', { locale: de })}
                {campaignData.sentAt && ` · Gesendet: ${format(new Date(campaignData.sentAt), 'dd.MM.yyyy HH:mm', { locale: de })}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Duplicate button */}
          {!isNew && (
            <button
              type="button"
              onClick={handleDuplicate}
              disabled={duplicating}
              className="px-3 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition flex items-center gap-1.5 disabled:opacity-50"
              title="Kampagne duplizieren"
            >
              {duplicating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">Duplizieren</span>
            </button>
          )}
          {/* Test email button */}
          {!isNew && isEditable && (
            <button
              type="button"
              onClick={() => setShowTestModal(true)}
              disabled={!form.subject || !form.heading || !form.content}
              className="px-3 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-medium hover:bg-amber-100 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <TestTube className="w-4 h-4" />
              <span className="hidden sm:inline">Test</span>
            </button>
          )}
          {/* Preview button */}
          {!isNew && (
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-3 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Vorschau</span>
            </button>
          )}
          {/* Save button */}
          {isEditable && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2.5 bg-white text-primary border border-primary/30 rounded-xl text-sm font-medium hover:bg-primary-50 transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Speichern
            </button>
          )}
          {/* Send button */}
          {!isNew && isEditable && (
            <button
              type="button"
              onClick={() => setShowSendConfirm(true)}
              disabled={sending || !form.subject || !form.heading || !form.content}
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Senden
            </button>
          )}
        </div>
      </div>

      {/* Sending progress banner */}
      {isSending && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <h3 className="font-semibold text-blue-900">Kampagne wird gesendet...</h3>
          </div>
          {(pollingStatus || campaignData) && (
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-700">
                  {(pollingStatus || campaignData).sentCount} / {(pollingStatus || campaignData).totalRecipients} gesendet
                </span>
                {(pollingStatus || campaignData).failedCount > 0 && (
                  <span className="text-red-500">
                    {(pollingStatus || campaignData).failedCount} fehlgeschlagen
                  </span>
                )}
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (((pollingStatus || campaignData).sentCount + (pollingStatus || campaignData).failedCount) /
                        Math.max((pollingStatus || campaignData).totalRecipients, 1)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sent summary with tracking stats */}
      {isSent && campaignData && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Kampagne erfolgreich gesendet</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div className="bg-white/70 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-green-700">{campaignData.sentCount}</div>
              <div className="text-xs text-green-600">Zugestellt</div>
            </div>
            <div className="bg-white/70 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-blue-700">{campaignData.openCount || 0}</div>
              <div className="text-xs text-blue-600">Geöffnet</div>
            </div>
            <div className="bg-white/70 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-purple-700">{campaignData.clickCount || 0}</div>
              <div className="text-xs text-purple-600">Geklickt</div>
            </div>
            {campaignData.failedCount > 0 && (
              <div className="bg-white/70 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-red-700">{campaignData.failedCount}</div>
                <div className="text-xs text-red-600">Fehlgeschlagen</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Failed banner */}
      {status === 'failed' && campaignData && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Kampagne fehlgeschlagen</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-red-700">
            <span>{campaignData.sentCount} gesendet</span>
            <span>{campaignData.failedCount} fehlgeschlagen</span>
          </div>
        </div>
      )}

      {/* Scheduled banner */}
      {status === 'scheduled' && form.scheduledAt && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-semibold text-amber-900">Kampagne geplant</h3>
              <p className="text-sm text-amber-700 mt-0.5">
                Wird automatisch am {format(new Date(form.scheduledAt), 'dd.MM.yyyy \'um\' HH:mm \'Uhr\'', { locale: de })} gesendet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Kampagnen-Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kampagnen-Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!isEditable}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="z.B. Sommer-Angebot 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail-Betreff *</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                disabled={!isEditable}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="z.B. 20% Rabatt auf alle Services!"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Überschrift *</label>
              <input
                type="text"
                value={form.heading}
                onChange={(e) => handleChange('heading', e.target.value)}
                disabled={!isEditable}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Die Hauptüberschrift in der E-Mail"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inhalt *</label>
              {isEditable ? (
                <TiptapEditor
                  content={form.content}
                  onChange={(html: string) => handleChange('content', html)}
                  placeholder="E-Mail-Inhalt schreiben..."
                />
              ) : (
                <div className="border rounded-xl p-4 bg-gray-50 text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: form.content }} />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Targeting */}
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" />
              Empfänger (Targeting)
            </h2>

            <div className="space-y-2">
              {[
                { value: 'all', label: 'Alle abonnierten Kunden', icon: '👥' },
                { value: 'segment', label: 'Kundensegment', icon: '🎯' },
                { value: 'specific', label: 'Bestimmte E-Mails', icon: '📧' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition border ${
                    form.targetMode === option.value
                      ? 'border-primary bg-primary-50'
                      : 'border-gray-100 hover:border-gray-200'
                  } ${!isEditable ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="targetMode"
                    value={option.value}
                    checked={form.targetMode === option.value}
                    onChange={(e) => handleChange('targetMode', e.target.value)}
                    disabled={!isEditable}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>

            {/* Segment selector */}
            {form.targetMode === 'segment' && (
              <div className="space-y-2 mt-3">
                <label className="block text-xs font-medium text-gray-500">Segment wählen:</label>
                {SEGMENTS.map((seg) => {
                  const currentType = (() => {
                    try { return JSON.parse(form.targetSegment || '{}').type; } catch { return ''; }
                  })();
                  return (
                    <label
                      key={seg.type}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm transition ${
                        currentType === seg.type
                          ? 'bg-primary-50 text-primary font-medium'
                          : 'hover:bg-gray-50 text-gray-600'
                      } ${!isEditable ? 'cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="radio"
                        name="segment"
                        value={seg.type}
                        checked={currentType === seg.type}
                        onChange={() => handleChange('targetSegment', JSON.stringify({ type: seg.type }))}
                        disabled={!isEditable}
                        className="w-3.5 h-3.5 text-primary"
                      />
                      <span>{seg.icon}</span>
                      <span>{seg.label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Specific emails input */}
            {form.targetMode === 'specific' && (
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">E-Mail-Adressen (Komma, Semikolon oder Zeilenumbruch getrennt):</label>
                <textarea
                  value={form.targetEmails}
                  onChange={(e) => handleChange('targetEmails', e.target.value)}
                  disabled={!isEditable}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-mono disabled:bg-gray-50"
                  placeholder={"email1@example.com, email2@example.com\noder je eine pro Zeile"}
                />
                <p className="text-[11px] text-gray-400 mt-1">Auch externe E-Mails (nicht in DB) werden gesendet.</p>
              </div>
            )}

            {/* Recipient count */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-sm">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-blue-800">
                <strong>{recipientCount ?? '...'}</strong> Empfänger
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Call-to-Action Button</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button-Text</label>
              <input
                type="text"
                value={form.ctaText}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                disabled={!isEditable}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="z.B. Jetzt Service buchen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button-URL</label>
              <input
                type="url"
                value={form.ctaUrl}
                onChange={(e) => handleChange('ctaUrl', e.target.value)}
                disabled={!isEditable}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="https://onlineautoabmelden.com/..."
              />
            </div>
          </div>

          {/* Hero Image */}
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Hero-Bild (optional)</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bild-URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                disabled={!isEditable}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="https://...image.jpg"
              />
            </div>

            {form.imageUrl && (
              <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imageUrl}
                  alt="Vorschau"
                  className="w-full h-auto max-h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Scheduling */}
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Zeitplan (optional)
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senden am</label>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => handleChange('scheduledAt', e.target.value)}
                disabled={!isEditable}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm disabled:bg-gray-50 disabled:text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Leer lassen = sofort senden. Geplante Kampagnen werden automatisch gesendet.
              </p>
            </div>
            {form.scheduledAt && isEditable && (
              <button
                type="button"
                onClick={() => handleChange('scheduledAt', '')}
                className="text-xs text-red-500 hover:text-red-700 transition"
              >
                Zeitplan entfernen
              </button>
            )}
          </div>

          {/* Tracking Stats (for sent campaigns) */}
          {(isSent || isSending) && campaignData && (
            <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Tracking-Statistiken
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Zugestellt</span>
                  <span className="font-semibold text-green-600">{campaignData.sentCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Geöffnet</span>
                  <span className="font-semibold text-blue-600">{campaignData.openCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Geklickt</span>
                  <span className="font-semibold text-purple-600">{campaignData.clickCount || 0}</span>
                </div>
                {campaignData.sentCount > 0 && (
                  <>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Öffnungsrate</span>
                        <span className="font-semibold text-blue-600">
                          {Math.round(((campaignData.openCount || 0) / campaignData.sentCount) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.round(((campaignData.openCount || 0) / campaignData.sentCount) * 100))}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Klickrate</span>
                        <span className="font-semibold text-purple-600">
                          {Math.round(((campaignData.clickCount || 0) / campaignData.sentCount) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.round(((campaignData.clickCount || 0) / campaignData.sentCount) * 100))}%` }} />
                      </div>
                    </div>
                  </>
                )}
                {campaignData.failedCount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fehlgeschlagen</span>
                    <span className="font-semibold text-red-500">{campaignData.failedCount}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && !isNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">E-Mail-Vorschau</h3>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2 bg-gray-100">
              <iframe
                src={`/api/admin/email-campaigns/${campaignId}/preview`}
                className="w-full h-full min-h-[500px] bg-white rounded-lg border-0"
                title="E-Mail Vorschau"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
