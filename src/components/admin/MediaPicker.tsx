'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { X, Search, Upload, Loader2, Check, ImageIcon, AlertTriangle } from 'lucide-react';
import { useMedia } from '@/lib/admin-api';

interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  title: string;
  altText: string;
  sourceUrl: string;
  thumbnailUrl: string;
  localPath: string;
  mimeType: string;
  width: number;
  height: number;
  fileSize: number;
  processingStatus: string;
  createdAt: string;
}

function getThumbUrl(item: MediaItem): string {
  if (item.thumbnailUrl) return item.thumbnailUrl;
  if (item.sourceUrl) return item.sourceUrl;
  if (item.localPath) return item.localPath.startsWith('/') ? item.localPath : `/${item.localPath}`;
  return '';
}

function getBestUrl(item: MediaItem): string {
  // Always prefer localPath (relative /uploads/media/ path) over sourceUrl.
  // sourceUrl may contain an absolute CDN URL that Next.js Image rejects with 400
  // unless the CDN hostname is in next.config.js remotePatterns.
  if (item.localPath) return item.localPath.startsWith('/') ? item.localPath : `/${item.localPath}`;
  // Fallback: strip CDN domain from sourceUrl to get a relative path
  if (item.sourceUrl) {
    const relative = item.sourceUrl.replace(/^https?:\/\/[^/]+(?=\/uploads\/media\/)/i, '');
    return relative || item.sourceUrl;
  }
  return '';
}

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: { url: string; alt: string; id: string }) => void;
  title?: string;
}

function MediaThumb({ src, fallbackSrc, alt }: { src: string; fallbackSrc?: string; alt: string }) {
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  if (error || !currentSrc) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <ImageIcon className="w-6 h-6 text-gray-300" />
      </div>
    );
  }
  return (
    <img
      src={currentSrc}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        } else {
          setError(true);
        }
      }}
    />
  );
}

export default function MediaPicker({ open, onClose, onSelect, title = 'Bild auswählen' }: MediaPickerProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [tab, setTab] = useState<'library' | 'upload'>('library');
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  // Shared SWR cache with MediaPage
  const { data: mediaData, isLoading: loading, error: swrError, mutate } = useMedia(
    { page, limit: 30, search },
  );
  const media: MediaItem[] = mediaData?.media ?? [];
  const pages = mediaData?.pagination?.pages ?? 0;

  // Auto-refresh while items are still being processed by Sharp
  const hasPending = useMemo(
    () => media.some((m) => m.processingStatus === 'pending' || m.processingStatus === 'processing'),
    [media],
  );
  useEffect(() => {
    if (!hasPending || !open) return;
    const timer = setTimeout(() => mutate(), 3500);
    return () => clearTimeout(timer);
  }, [hasPending, open, mutate]);

  useEffect(() => {
    if (open) {
      setSelected(null);
      setSearch('');
      setPage(1);
      setTab('library');
    }
  }, [open]);

  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setPage(1), 300);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setUploadError(null);
    const uploaded: MediaItem[] = [];
    let failCount = 0;
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" ist zu groß (max. 10 MB).`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        setUploadError(`"${file.name}" ist kein Bild.`);
        continue;
      }
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error();
        const data = await res.json();
        // Normalize upload response → MediaItem (API returns 'url'/'size', not 'sourceUrl'/'fileSize')
        const mediaItem: MediaItem = {
          id: data.id,
          fileName: data.fileName || '',
          originalName: data.fileName || '',
          title: data.title || '',
          altText: '',
          sourceUrl: data.url || data.sourceUrl || '',
          thumbnailUrl: data.thumbnailUrl || data.url || '',
          localPath: '',
          mimeType: data.mimeType || '',
          width: data.width || 0,
          height: data.height || 0,
          fileSize: data.size || data.fileSize || 0,
          processingStatus: data.processingStatus || 'pending',
          createdAt: new Date().toISOString(),
        };
        uploaded.push(mediaItem);
      } catch {
        failCount++;
      }
    }
    if (failCount > 0 && !uploadError) {
      setUploadError(`${failCount} Datei(en) konnten nicht hochgeladen werden.`);
    }
    setUploading(false);
    if (uploaded.length > 0) {
      setTab('library');
      setPage(1);
      mutate();
      setSelected(uploaded[0]);
    }
  };

  const confirm = () => {
    if (!selected) return;
    onSelect({
      url: getBestUrl(selected),
      alt: selected.altText || selected.title || selected.fileName,
      id: selected.id,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-4xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6">
          <button
            type="button"
            onClick={() => setTab('library')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === 'library' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Mediathek
          </button>
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Hochladen
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {tab === 'library' && (
            <>
              {/* Search */}
              <div className="px-6 py-3 border-b">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Bilder suchen..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : swrError ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-3">
                    <p className="text-sm text-red-500">Bilder konnten nicht geladen werden.</p>
                    <button
                      type="button"
                      onClick={() => mutate()}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Erneut versuchen
                    </button>
                  </div>
                ) : media.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <p className="text-sm">Keine Bilder gefunden</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                      {media.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setSelected(item)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selected?.id === item.id
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          <MediaThumb
                            src={getThumbUrl(item)}
                            fallbackSrc={getBestUrl(item)}
                            alt={item.altText || item.title}
                          />
                          {(item.processingStatus === 'pending' || item.processingStatus === 'processing') && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                          )}
                          {item.processingStatus === 'failed' && (
                            <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                              <AlertTriangle className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {selected?.id === item.id && (
                            <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {pages > 1 && (
                      <div className="flex items-center justify-center gap-3 mt-4">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page <= 1}
                          className="text-sm text-primary disabled:text-gray-300"
                        >
                          ← Zurück
                        </button>
                        <span className="text-xs text-gray-500">{page} / {pages}</span>
                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.min(pages, p + 1))}
                          disabled={page >= pages}
                          className="text-sm text-primary disabled:text-gray-300"
                        >
                          Weiter →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {tab === 'upload' && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div
                className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-primary/50 transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleUpload(e.dataTransfer.files);
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Wird hochgeladen...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-base font-medium text-gray-700 mb-1">Dateien ablegen oder klicken</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP, SVG — max. 10 MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </div>
              {uploadError && (
                <p className="text-sm text-red-500 mt-3 text-center">{uploadError}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {selected ? (
              <span className="truncate max-w-[300px] inline-block">{selected.fileName || selected.originalName}</span>
            ) : (
              'Kein Bild ausgewählt'
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50 transition"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={confirm}
              disabled={!selected}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-40 font-medium transition"
            >
              Auswählen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
