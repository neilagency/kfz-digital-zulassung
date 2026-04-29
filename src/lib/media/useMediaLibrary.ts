'use client';

/**
 * useMediaLibrary Hook
 * ====================
 * Extracted from the 1027-line MediaPage monolith.
 * Encapsulates all media library state, SWR fetching,
 * upload/delete/edit logic, and optimistic UI.
 *
 * Fixes:
 * - Removes localStorage cache buster hack → uses SWR mutate() properly
 * - Proper debounced search
 * - Controlled concurrent uploads (max 3)
 * - Optimistic delete with rollback
 */

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useMedia } from '@/lib/admin-api';
import type { MediaItem, MediaPagination, MediaStats, UploadProgress, OptimisticMediaItem } from './types';
import { parseUsedIn, isProcessing } from './utils';

export interface UseMediaLibraryOptions {
  /** Items per page */
  defaultLimit?: number;
  /** Default view mode */
  defaultViewMode?: 'grid' | 'list';
}

export function useMediaLibrary(options: UseMediaLibraryOptions = {}) {
  const { defaultLimit = 24, defaultViewMode = 'grid' } = options;

  // ── Pagination & Filtering ──
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [imagesOnly, setImagesOnly] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultViewMode);

  // ── Selection ──
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ── Editing ──
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fileName: '', altText: '', title: '' });
  const [saving, setSaving] = useState(false);

  // ── Upload ──
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // ── Actions ──
  const [deleting, setDeleting] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── UI ──
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<{ item: MediaItem; usedIn: any[] } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ── Optimistic state ──
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(new Set());
  const [optimisticUploads, setOptimisticUploads] = useState<OptimisticMediaItem[]>([]);

  // ── Refs ──
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  // ── SWR Data Fetching (no cache buster hack — use mutate() properly) ──
  const { data: mediaData, isLoading: loading, mutate, error: swrError } = useMedia(
    { page, limit, search, imagesOnly: imagesOnly ? undefined : false },
  );

  // ── Derived Data ──
  const media: MediaItem[] = useMemo(() => {
    const base: MediaItem[] = mediaData?.media ?? [];
    const filtered = base.filter((m: MediaItem) => !pendingDeleteIds.has(m.id));
    return [...optimisticUploads, ...filtered];
  }, [mediaData, pendingDeleteIds, optimisticUploads]);

  const pagination: MediaPagination = mediaData?.pagination ?? { page: 1, limit: defaultLimit, total: 0, pages: 0 };

  // Auto-refresh while items are processing in background
  const hasPending = useMemo(
    () => media.some((m) => isProcessing(m)),
    [media],
  );

  useEffect(() => {
    if (!hasPending) return;
    const timer = setTimeout(() => mutate(), 4000);
    return () => clearTimeout(timer);
  }, [hasPending, mutate]);

  // Parsed usedIn for the selected item
  const selectedUsedIn = useMemo(() => parseUsedIn(selected?.usedIn), [selected?.usedIn]);

  // ── Toast helper ──
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Search (debounced) ──
  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 300);
  }, []);

  // ── Select Media ──
  const selectMedia = useCallback((item: MediaItem) => {
    if (multiSelect) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.has(item.id) ? next.delete(item.id) : next.add(item.id);
        return next;
      });
      return;
    }
    setSelected(item);
    setEditing(false);
    setEditForm({ fileName: item.fileName, altText: item.altText, title: item.title });
  }, [multiSelect]);

  // ── Upload ──
  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    setUploading(true);
    const tempIds = fileArray.map(() => `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

    setUploadProgress(fileArray.map((f, i) => ({ name: f.name, status: 'uploading' as const, id: tempIds[i] })));

    // Optimistic items
    setOptimisticUploads((prev) => [
      ...prev,
      ...fileArray.map((f, i) => ({
        id: tempIds[i],
        fileName: f.name,
        originalName: f.name,
        title: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').trim(),
        altText: '',
        sourceUrl: '',
        localPath: '',
        thumbnailUrl: '',
        mediumUrl: '',
        largeUrl: '',
        webpUrl: '',
        avifUrl: '',
        mimeType: f.type,
        width: 0,
        height: 0,
        fileSize: f.size,
        folder: '',
        usedIn: '[]',
        useCount: 0,
        processingStatus: 'pending' as const,
        createdAt: new Date().toISOString(),
        optimistic: true as const,
      })),
    ]);

    // Controlled concurrency: max 3 parallel uploads
    const CONCURRENCY = 3;
    const uploadOne = async (file: File, tempId: string) => {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        setUploadProgress((prev) => prev.map((p) => p.id === tempId ? { ...p, status: 'done' as const } : p));
        setOptimisticUploads((prev) => prev.filter((u) => u.id !== tempId));
        return { success: true, data };
      } catch {
        setUploadProgress((prev) => prev.map((p) => p.id === tempId ? { ...p, status: 'error' as const } : p));
        return { success: false, tempId };
      }
    };

    const queue = fileArray.map((f, i) => () => uploadOne(f, tempIds[i]));
    const results: { success: boolean; data?: any; tempId?: string }[] = [];
    for (let i = 0; i < queue.length; i += CONCURRENCY) {
      const batch = queue.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.allSettled(batch.map((fn) => fn()));
      batchResults.forEach((r, idx) => {
        if (r.status === 'fulfilled') results.push(r.value);
        else {
          setUploadProgress((prev) => prev.map((p, j) => j === i + idx ? { ...p, status: 'error' as const } : p));
          results.push({ success: false, tempId: tempIds[i + idx] });
        }
      });
    }

    // Clean up optimistic items
    const failedTempIds = new Set(results.filter((r) => !r.success).map((r) => r.tempId).filter(Boolean));
    setOptimisticUploads((prev) => prev.filter((u) => !tempIds.includes(u.id) || failedTempIds.has(u.id)));
    setTimeout(() => {
      setOptimisticUploads((prev) => prev.filter((u) => !failedTempIds.has(u.id)));
      setUploadProgress((prev) => prev.filter((p) => p.status === 'error'));
    }, 3000);

    setUploading(false);
    setPage(1);
    // Properly revalidate SWR cache — no localStorage hack
    mutate();

    const failedCount = results.filter((r) => !r.success).length;
    if (failedCount > 0) {
      showToast(`${failedCount} Upload(s) fehlgeschlagen`, 'error');
    } else {
      showToast(`${results.length} Bilder erfolgreich hochgeladen`, 'success');
    }
  }, [mutate, showToast]);

  // ── Drag & Drop ──
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
  }, [handleUpload]);

  // ── Edit ──
  const startEdit = useCallback(() => {
    if (!selected) return;
    setEditing(true);
    setEditForm({ fileName: selected.fileName, altText: selected.altText, title: selected.title });
  }, [selected]);

  const saveEdit = useCallback(async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, ...editForm }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelected((prev) => prev ? { ...prev, ...updated } : prev);
        setEditing(false);
        mutate();
      }
    } catch { /* silent */ } finally { setSaving(false); }
  }, [selected, editForm, mutate]);

  // ── Delete ──
  const deleteMedia = useCallback(async (item?: MediaItem, force = false) => {
    const target = item || selected;
    if (!target) return;

    // Optimistic: hide immediately
    setPendingDeleteIds((prev) => new Set(prev).add(target.id));
    if (selected?.id === target.id) setSelected(null);
    setDeleteWarning(null);

    setDeleting(true);
    try {
      const params = new URLSearchParams({ id: target.id });
      if (force) params.set('force', 'true');

      const res = await fetch(`/api/admin/media?${params}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.status === 409 && data.requireForce) {
        // Rollback
        setPendingDeleteIds((prev) => {
          const next = new Set(prev);
          next.delete(target.id);
          return next;
        });
        setDeleteWarning({ item: target, usedIn: data.usedIn });
        setDeleting(false);
        return;
      }

      if (!res.ok) {
        setPendingDeleteIds((prev) => {
          const next = new Set(prev);
          next.delete(target.id);
          return next;
        });
        showToast(`Löschen fehlgeschlagen: ${target.fileName}`, 'error');
      } else {
        showToast(`${target.fileName || 'Bild'} gelöscht`, 'success');
        mutate();
      }
    } catch {
      setPendingDeleteIds((prev) => {
        const next = new Set(prev);
        next.delete(target.id);
        return next;
      });
      showToast('Netzwerkfehler beim Löschen', 'error');
    } finally { setDeleting(false); }
  }, [selected, mutate, showToast]);

  // ── Bulk Delete ──
  const bulkDelete = useCallback(async () => {
    if (!selectedIds.size || !confirm(`${selectedIds.size} Bilder wirklich löschen?`)) return;

    // Optimistic
    setPendingDeleteIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(id));
      return next;
    });

    const ids = Array.from(selectedIds);
    setMultiSelect(false);
    setSelectedIds(new Set());

    const results = await Promise.allSettled(
      ids.map((id) => fetch(`/api/admin/media?id=${id}&force=true`, { method: 'DELETE' }))
    );

    const failedIds = new Set<string>();
    results.forEach((r, i) => {
      if (r.status === 'rejected' || (r.status === 'fulfilled' && !(r.value as Response).ok)) {
        failedIds.add(ids[i]);
      }
    });

    if (failedIds.size > 0) {
      setPendingDeleteIds((prev) => {
        const next = new Set(prev);
        failedIds.forEach((id) => next.delete(id));
        return next;
      });
      showToast(`${failedIds.size} Löschvorgänge fehlgeschlagen`, 'error');
    } else {
      showToast(`${ids.length} Bilder gelöscht`, 'success');
    }

    mutate();
  }, [selectedIds, mutate, showToast]);

  // ── Replace Image ──
  const replaceImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selected) return;
    setReplacing(true);
    try {
      const formData = new FormData();
      formData.append('id', selected.id);
      formData.append('file', file);
      const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
      if (res.ok) {
        const updated = await res.json();
        setSelected((prev) => prev ? { ...prev, ...updated } : prev);
        mutate();
      }
    } catch { /* silent */ } finally { setReplacing(false); }
  }, [selected, mutate]);

  // ── Scan Usage ──
  const scanUsage = useCallback(async () => {
    setScanning(true);
    try {
      await fetch('/api/admin/media', { method: 'PUT' });
      mutate();
    } catch { /* silent */ } finally { setScanning(false); }
  }, [mutate]);

  // ── Fetch Stats ──
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media?stats=true');
      const data = await res.json();
      setStats(data);
      setShowStats(true);
    } catch { /* silent */ }
  }, []);

  // ── Copy URL ──
  const copyUrl = useCallback(() => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.sourceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selected]);

  // ── Toggle helpers ──
  const toggleMultiSelect = useCallback(() => {
    setMultiSelect((prev) => !prev);
    setSelectedIds(new Set());
  }, []);

  const toggleImagesOnly = useCallback(() => {
    setImagesOnly((prev) => !prev);
    setPage(1);
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  return {
    // Data
    media,
    pagination,
    loading,
    swrError,
    selected,
    selectedUsedIn,
    stats,

    // Pagination & Filtering
    page, setPage,
    limit, changeLimit,
    search, searchInput, handleSearch,
    imagesOnly, toggleImagesOnly,
    viewMode, setViewMode,

    // Selection
    selectMedia,
    multiSelect, toggleMultiSelect,
    selectedIds,

    // Editing
    editing, setEditing,
    editForm, setEditForm,
    saving,
    startEdit, saveEdit,

    // Upload
    uploading,
    uploadProgress,
    dragOver, setDragOver,
    handleUpload, handleDrop,
    fileInputRef,

    // Actions
    deleteMedia, deleting,
    bulkDelete,
    replaceImage, replacing,
    replaceInputRef,
    scanUsage, scanning,
    copyUrl, copied,

    // UI
    toast,
    showStats, setShowStats,
    fetchStats,
    deleteWarning, setDeleteWarning,
    setSelected,

    // SWR
    mutate,
  };
}
