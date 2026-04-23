'use client';

import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';

interface Attachment {
  name: string;
  url: string;
  size: number;
}

interface Message {
  id: string;
  orderId: string;
  message: string;
  attachments: Attachment[];
  sentBy: string;
  createdAt: string;
}

interface PendingFile {
  file: File;
  id: string;
}

const QUICK_TEMPLATES = [
  { label: 'Fehlende Daten', text: 'Leider fehlen uns für die Bearbeitung Ihres Auftrags noch einige Daten. Bitte senden Sie uns folgende Informationen:\n\n- \n\nVielen Dank für Ihre Mithilfe!' },
  { label: 'Falsche Daten', text: 'Bei der Überprüfung Ihrer Bestellung haben wir festgestellt, dass einige Angaben nicht korrekt sind. Bitte überprüfen Sie folgende Daten und senden Sie uns die korrekten Informationen:\n\n- \n\nVielen Dank!' },
  { label: 'Dokument erneut hochladen', text: 'Leider konnten wir das hochgeladene Dokument nicht verarbeiten. Bitte laden Sie das Dokument erneut hoch. Achten Sie bitte darauf, dass:\n\n- Das Dokument gut lesbar ist\n- Alle Seiten vollständig sind\n- Das Format PDF, JPG oder PNG ist\n\nVielen Dank!' },
  { label: 'Verzögerung', text: 'Wir möchten Sie darüber informieren, dass es bei der Bearbeitung Ihres Auftrags zu einer leichten Verzögerung kommt. Wir arbeiten mit Hochdruck daran und werden Sie umgehend informieren, sobald der Vorgang abgeschlossen ist.\n\nVielen Dank für Ihre Geduld!' },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function OrderCommunication({ orderId }: { orderId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/messages`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const newFiles: PendingFile[] = [];
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setResult({ type: 'error', text: `"${file.name}" — Dateityp nicht erlaubt.` });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setResult({ type: 'error', text: `"${file.name}" — Datei zu groß (max. 10 MB).` });
        continue;
      }
      newFiles.push({ file, id: crypto.randomUUID() });
    }

    const total = pendingFiles.length + newFiles.length;
    if (total > MAX_FILES) {
      setResult({ type: 'error', text: `Maximal ${MAX_FILES} Dateien erlaubt.` });
      return;
    }

    setPendingFiles((prev) => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSend = async () => {
    if (!messageText.trim()) {
      setResult({ type: 'error', text: 'Bitte geben Sie eine Nachricht ein.' });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('message', messageText.trim());
      for (const pf of pendingFiles) {
        formData.append('files', pf.file);
      }

      const res = await fetch(`/api/admin/orders/${orderId}/messages`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ type: 'success', text: 'Nachricht erfolgreich an den Kunden gesendet ✅' });
        setMessageText('');
        setPendingFiles([]);
        fetchMessages();
      } else {
        setResult({ type: 'error', text: data.error || 'Fehler beim Senden der Nachricht.' });
      }
    } catch {
      setResult({ type: 'error', text: 'Netzwerkfehler beim Senden.' });
    } finally {
      setSending(false);
    }
  };

  const insertTemplate = (text: string) => {
    setMessageText(text);
    setShowTemplates(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#0D5581]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Kundenkommunikation
      </h2>

      {/* Quick Templates */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="text-sm text-[#0D5581] hover:underline font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Schnellvorlagen
          <svg className={`w-3 h-3 transition-transform ${showTemplates ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showTemplates && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {QUICK_TEMPLATES.map((t, i) => (
              <button
                key={i}
                onClick={() => insertTemplate(t.text)}
                className="text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#0D5581] rounded-lg text-sm text-gray-700 transition"
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Message Composer */}
      <div className="space-y-3">
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Nachricht an den Kunden schreiben..."
          rows={5}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none resize-y"
        />

        {/* File Upload */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-[#0D5581] transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            Dateien anhängen (PDF, JPG, PNG, WEBP · max. 10 MB)
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* Pending Files Preview */}
        {pendingFiles.length > 0 && (
          <div className="space-y-2">
            {pendingFiles.map((pf) => (
              <div
                key={pf.id}
                className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 text-sm"
              >
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="flex-1 truncate text-gray-700">{pf.file.name}</span>
                <span className="text-xs text-gray-400">{formatFileSize(pf.file.size)}</span>
                <button
                  onClick={() => removeFile(pf.id)}
                  className="text-red-400 hover:text-red-600 flex-shrink-0"
                  title="Entfernen"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Result Message */}
        {result && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
            result.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {result.type === 'success' ? '✅' : '❌'} {result.text}
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={sending || !messageText.trim()}
          className="w-full px-4 py-2.5 bg-[#0D5581] text-white rounded-lg text-sm font-medium hover:bg-[#0a4468] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Wird gesendet...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              An Kunden senden
            </>
          )}
        </button>
      </div>

      {/* Message History */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Nachrichtenverlauf {messages.length > 0 && `(${messages.length})`}
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Noch keine Nachrichten gesendet.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-[#0D5581] flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {msg.sentBy === 'admin' ? 'Admin' : msg.sentBy}
                  </span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(msg.createdAt), 'dd.MM.yy HH:mm')}
                  </span>
                </div>

                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>

                {msg.attachments.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {msg.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-[#0D5581] hover:underline bg-white rounded px-2.5 py-1.5 border border-blue-100"
                      >
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {att.name}
                        <span className="text-gray-400 ml-auto">{formatFileSize(att.size)}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
