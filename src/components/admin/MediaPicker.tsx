'use client';

import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { X, Search, Upload, Loader2, Check, AlertTriangle, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { useMedia } from '@/lib/admin-api';
import { MediaThumb, getThumbUrl, getOriginalUrl, isProcessing, isFailed, validateUploadFile } from '@/lib/media';
import type { MediaItem, MediaSelectResult } from '@/lib/media';

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaSelectResult) => void;
  selectedId?: string;
  title?: string;
}

/** Memoised grid cell — only re-renders when its own props change */
const GridItem = memo(function GridItem({
  item,
  isSelected,
  onSelect,
}: {
  item: MediaItem;
  isSelected: boolean;
  onSelect: (item: MediaItem) => void;
}) {
  return (
    <button
      type="button"
      title={item.title || item.fileName}
      onClick={() => onSelect(item)}
      className={`group relative aspect-square rounded-lg overflow-hidden transition-all duration-150 focus:outline-none ${
        isSelected
          ? 'ring-2 ring-primary ring-offset-2'
          : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
      }`}
    >
      <MediaThumb
        src={getThumbUrl(item)}
        fallbackSrc={getOriginalUrl(item)}
        alt={item.altText || item.title}
        className="w-full h-full object-cover"
      />
      {isProcessing(item) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        </div>
      )}
      {isFailed(item) && (
        <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-white" />
        </div>
      )}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 bg-primary rounded-full p-0.5 shadow-md">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      {/* Hover name tooltip */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-4 pb-1 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <p className="text-[10px] text-white truncate leading-tight">
          {item.title || item.fileName}
        </p>
      </div>
    </button>
  );
});

export default function MediaPicker({
  open,
  onClose,
  onSelect,
  selectedId,
  title = 'Bild auswählen',
}: MediaPickerProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<MediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const drawerRef = useRef<HTMLDivElement>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Shared SWR key with BlogFeaturedImage quick-pick (page 1, limit 24) → instant open on first visit
  const { data, isLoading, error, mutate } = useMedia({ page, limit: 24, search: debouncedSearch });
  const pages = data?.pagination?.pages ?? 0;
  const hasMore = page < pages;

  // Accumulate items across "load more" pages; reset on search change.
  // `open` is in deps so cached SWR data re-populates the grid when the drawer opens
  // without needing a network round-trip.
  useEffect(() => {
    if (!data?.media) return;
    const incoming: MediaItem[] = data.media;
    if (page === 1) {
      seenIdsRef.current = new Set(incoming.map((m: MediaItem) => m.id));
      setAllItems(incoming);
    } else {
      const fresh = incoming.filter((m: MediaItem) => !seenIdsRef.current.has(m.id));
      if (fresh.length > 0) {
        fresh.forEach((m: MediaItem) => seenIdsRef.current.add(m.id));
        setAllItems((prev) => [...prev, ...fresh]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, page, open]);

  // Reset on search change
  useEffect(() => {
    setPage(1);
    seenIdsRef.current = new Set();
    setAllItems([]);
  }, [debouncedSearch]);

  // Reset search/page on open — do NOT clear allItems so cached data shows instantly
  useEffect(() => {
    if (open) {
      setSearch('');
      setDebouncedSearch('');
      setPage(1);
      setUploadError(null);
      setIsDragging(false);
      setUploadProgress(0);
    }
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, y);
    };
  }, [open]);

  // Auto-refresh while items are processing
  const hasPending = useMemo(() => allItems.some(isProcessing), [allItems]);
  useEffect(() => {
    if (!hasPending || !open) return;
    const t = setTimeout(() => mutate(), 3500);
    return () => clearTimeout(t);
  }, [hasPending, open, mutate]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setDebouncedSearch(val), 300);
  }, []);

  /** Single click = instantly select and close — no confirm step */
  const handleSelectItem = useCallback(
    (item: MediaItem) => {
      onSelect({
        url: getOriginalUrl(item),
        alt: item.altText || item.title || item.fileName,
        id: item.id,
      });
      onClose();
    },
    [onSelect, onClose],
  );

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setUploading(true);
      setUploadError(null);
      setUploadProgress(0);
      setIsDragging(false);

      const fileArray = Array.from(files);
      const errors: string[] = [];
      const valid: File[] = [];
      for (const f of fileArray) {
        const e = validateUploadFile(f);
        if (e) errors.push(e);
        else valid.push(f);
      }
      if (errors.length) setUploadError(errors[0]);
      if (!valid.length) { setUploading(false); return; }

      const CONCURRENCY = 3;
      let done = 0;
      let failCount = 0;
      const uploaded: MediaItem[] = [];

      for (let i = 0; i < valid.length; i += CONCURRENCY) {
        const batch = valid.slice(i, i + CONCURRENCY);
        const results = await Promise.allSettled(
          batch.map(async (file) => {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            if (!res.ok) throw new Error();
            return res.json();
          }),
        );
        results.forEach((r) => {
          done++;
          setUploadProgress(Math.round((done / valid.length) * 100));
          if (r.status === 'fulfilled') {
            const d = r.value;
            uploaded.push({
              id: d.id,
              fileName: d.fileName || '',
              originalName: d.fileName || '',
              title: d.title || '',
              altText: '',
              sourceUrl: d.url || d.sourceUrl || '',
              localPath: d.localPath || '',
              thumbnailUrl: d.thumbnailUrl || d.url || '',
              mediumUrl: d.mediumUrl || '',
              largeUrl: d.largeUrl || '',
              webpUrl: d.webpUrl || '',
              avifUrl: d.avifUrl || '',
              mimeType: d.mimeType || '',
              width: d.width || 0,
              height: d.height || 0,
              fileSize: d.size || d.fileSize || 0,
              folder: '',
              usedIn: '[]',
              useCount: 0,
              processingStatus: d.processingStatus || 'pending',
              createdAt: new Date().toISOString(),
            } as MediaItem);
          } else {
            failCount++;
          }
        });
      }

      setUploading(false);
      if (failCount > 0) {
        setUploadError(`${failCount} Datei(en) fehlgeschlagen.`);
      }
      if (uploaded.length > 0) {
        mutate();
        if (uploaded.length === 1) {
          // Single upload → auto-select and close
          handleSelectItem(uploaded[0]);
        } else {
          // Multiple → refresh grid, let user pick
          setPage(1);
          seenIdsRef.current = new Set();
          setAllItems([]);
        }
      }
    },
    [mutate, handleSelectItem],
  );

  // Drag & drop handlers on the drawer panel itself
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!drawerRef.current?.contains(e.relatedTarget as Node)) setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleUpload(e.dataTransfer.files);
  }, [handleUpload]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) setPage((p) => p + 1);
  }, [hasMore, isLoading]);

  return (
    <>
      {/* Backdrop — semi-transparent so editor stays visible */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in drawer — right panel on all sizes, full-width on mobile */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white shadow-2xl
          w-full sm:w-[480px] transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag-over overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-10 bg-primary/10 border-2 border-dashed border-primary flex flex-col items-center justify-center gap-3 pointer-events-none">
            <Upload className="w-10 h-10 text-primary" />
            <p className="text-base font-semibold text-primary">Bilder hier ablegen</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition disabled:opacity-40"
            >
              {uploading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" />{uploadProgress}%</>
              ) : (
                <><Upload className="w-3.5 h-3.5" />Hochladen</>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Schließen"
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>

        {/* Search bar */}
        <div className="px-5 py-3 border-b shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Bilder suchen…"
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
          </div>
        </div>

        {/* Upload error */}
        {uploadError && (
          <div className="mx-5 mt-3 shrink-0 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {uploadError}
          </div>
        )}

        {/* Image grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && page === 1 ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <p className="text-sm text-red-500">Bilder konnten nicht geladen werden.</p>
              <button type="button" onClick={() => mutate()} className="text-sm text-primary hover:underline font-medium">
                Erneut versuchen
              </button>
            </div>
          ) : allItems.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-14 h-14 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center hover:border-primary/50 transition">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-sm text-center">
                {debouncedSearch ? 'Keine Treffer — Suche ändern' : 'Noch keine Bilder — jetzt hochladen'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {allItems.map((item) => (
                  <GridItem
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedId}
                    onSelect={handleSelectItem}
                  />
                ))}
                {/* Skeleton while loading next page */}
                {isLoading && page > 1 &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={`sk-${i}`} className="aspect-square rounded-lg bg-gray-100 animate-pulse" />
                  ))}
              </div>

              {hasMore && !isLoading && (
                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-primary transition rounded-lg hover:bg-gray-50"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Mehr laden
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t px-5 py-3 shrink-0 bg-gray-50">
          <p className="text-[11px] text-gray-400 text-center">
            Bild anklicken zum sofortigen Auswählen · Dateien per Drag &amp; Drop hochladen
          </p>
        </div>
      </div>
    </>
  );
}
