'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';

interface OrderDoc {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function OrderDocuments({ orderId }: { orderId: string }) {
  const [docs, setDocs] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [resending, setResending] = useState<string | null>(null);
  const [resendResult, setResendResult] = useState<{ id: string; success: boolean; message: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/documents`);
      const data = await res.json();
      setDocs(data.documents || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploadError(null);
    setUploading(true);

    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf') {
        setUploadError(`"${file.name}" ist keine PDF-Datei.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" ist zu groß (max. 10 MB).`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch(`/api/admin/orders/${orderId}/documents`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setUploadError(data?.error || 'Upload fehlgeschlagen.');
        }
      } catch {
        setUploadError('Netzwerkfehler beim Upload.');
      }
    }

    setUploading(false);
    fetchDocs();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm('Dokument wirklich löschen?')) return;
    setDeleting(docId);
    try {
      await fetch(`/api/admin/documents/${docId}`, { method: 'DELETE' });
      setDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch {
      // silent
    } finally {
      setDeleting(null);
    }
  };

  const handleResend = async (docId: string) => {
    setResending(docId);
    setResendResult(null);
    try {
      const res = await fetch(`/api/admin/documents/${docId}`, { method: 'POST' });
      const data = await res.json();
      setResendResult({
        id: docId,
        success: data.success,
        message: data.success ? 'E-Mail gesendet' : (data.error || 'Fehler'),
      });
    } catch {
      setResendResult({ id: docId, success: false, message: 'Netzwerkfehler' });
    } finally {
      setResending(null);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Dokumente</h2>

      {/* Upload area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer mb-4 ${
          dragOver
            ? 'border-[#0D5581] bg-blue-50'
            : 'border-gray-300 hover:border-[#0D5581] hover:bg-gray-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin text-[#0D5581]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm text-gray-600">Wird hochgeladen...</span>
          </div>
        ) : (
          <>
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 font-medium">PDF hierher ziehen oder klicken</p>
            <p className="text-xs text-gray-400 mt-1">Nur PDF · max. 10 MB</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ❌ {uploadError}
        </div>
      )}

      {/* Document list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">Noch keine Dokumente hochgeladen</p>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{doc.fileName}</p>
                <p className="text-xs text-gray-400">
                  {formatSize(doc.fileSize)} · {format(new Date(doc.createdAt), 'dd.MM.yy HH:mm')}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Download */}
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-[#0D5581] hover:bg-blue-50 rounded-lg transition"
                  title="Herunterladen"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
                {/* Resend email */}
                <button
                  onClick={() => handleResend(doc.id)}
                  disabled={resending === doc.id}
                  className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition disabled:opacity-50"
                  title="E-Mail erneut senden"
                >
                  {resending === doc.id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                {/* Delete */}
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deleting === doc.id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                  title="Löschen"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              {/* Resend result for this doc */}
              {resendResult?.id === doc.id && (
                <span className={`text-xs ${resendResult.success ? 'text-green-600' : 'text-red-500'}`}>
                  {resendResult.success ? '✅' : '❌'} {resendResult.message}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
