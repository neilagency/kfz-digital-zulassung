'use client';

import { useState, useMemo, memo } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Upload, Search, Grid, List, Trash2, Edit3, Copy, Check,
  X, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight,
  BarChart3, Replace, AlertTriangle, CheckSquare, Scan,
  SlidersHorizontal, ExternalLink,
} from 'lucide-react';
import {
  MediaThumb, useMediaLibrary,
  getThumbUrl, getOriginalUrl, getMediumUrl, formatBytes,
} from '@/lib/media';
import type { MediaItem } from '@/lib/media';

/* ── Memoized grid item ── */
const MediaGridItem = memo(function MediaGridItem({
  item, isSelected, isMultiSelected, multiSelect, onSelect,
}: {
  item: MediaItem; isSelected: boolean; isMultiSelected: boolean;
  multiSelect: boolean; onSelect: (item: MediaItem) => void;
}) {
  const active = isSelected || isMultiSelected;
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`group relative aspect-square rounded-xl overflow-hidden transition-all duration-150 ${
        active ? 'ring-2 ring-[#0D5581] ring-offset-1 scale-[0.98]' : 'hover:scale-[1.02]'
      }`}
    >
      <MediaThumb src={getThumbUrl(item)} fallbackSrc={getOriginalUrl(item)} alt={item.altText || item.title || ''} className="w-full h-full object-cover bg-gray-100" />
      {item.processingStatus === 'pending' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="w-5 h-5 text-white animate-spin" /></div>
      )}
      {item.processingStatus === 'failed' && (
        <div className="absolute inset-0 bg-red-500/60 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-white" /></div>
      )}
      {multiSelect && (
        <div className="absolute top-1.5 left-1.5">
          {isMultiSelected
            ? <div className="w-5 h-5 bg-[#0D5581] rounded-full flex items-center justify-center shadow"><Check className="w-3 h-3 text-white" /></div>
            : <div className="w-5 h-5 bg-white/90 rounded-full shadow border border-gray-200" />}
        </div>
      )}
      {item.useCount > 0 && !multiSelect && (
        <div className="absolute top-1.5 right-1.5 bg-[#0D5581] text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
          {item.useCount}
        </div>
      )}
      {!item.altText && !multiSelect && (
        <div className="absolute bottom-1.5 right-1.5 bg-amber-400 rounded-full p-0.5"><AlertTriangle className="w-2.5 h-2.5 text-white" /></div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-4 pb-1.5 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <p className="text-white text-[10px] leading-tight truncate">{item.fileName || item.title}</p>
      </div>
    </button>
  );
});

export default function MediaPage() {
  const lib = useMediaLibrary();
  const {
    media, pagination, loading, selected, selectedUsedIn, stats,
    page, setPage, limit, changeLimit,
    searchInput, handleSearch,
    imagesOnly, toggleImagesOnly,
    viewMode, setViewMode,
    selectMedia, multiSelect, toggleMultiSelect, selectedIds,
    editing, setEditing, editForm, setEditForm, saving, startEdit, saveEdit,
    uploading, uploadProgress, dragOver, setDragOver, handleUpload, handleDrop,
    fileInputRef,
    deleteMedia, deleting, bulkDelete,
    replaceImage, replacing, replaceInputRef,
    scanUsage, scanning, copyUrl, copied,
    toast, showStats, setShowStats, fetchStats,
    deleteWarning, setDeleteWarning, setSelected,
  } = lib;

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const formattedDates = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of media) {
      map.set(m.id, format(new Date(m.createdAt), 'dd.MM.yy', { locale: de }));
    }
    return map;
  }, [media]);

  const isDetailOpen = !!(selected && !multiSelect);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50/30 overflow-hidden">

      {/* ── MAIN COLUMN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── HEADER ── */}
        <div className="bg-white border-b border-gray-100 px-5 sm:px-6 pt-14 md:pt-0">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">Mediathek</h1>
                {pagination.total > 0 && <p className="text-sm text-gray-400 mt-1">{pagination.total} Dateien</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop secondary actions */}
              <div className="hidden sm:flex items-center gap-1">
                <button onClick={fetchStats} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition" title="Statistiken">
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button onClick={scanUsage} disabled={scanning} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition" title="Nutzung scannen">
                  {scanning ? <Loader2 className="w-4 h-4 animate-spin text-[#0D5581]" /> : <Scan className="w-4 h-4" />}
                </button>
                <div className="w-px h-5 bg-gray-200 mx-1" />
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleMultiSelect}
                  className={`p-2 rounded-lg transition ${multiSelect ? 'bg-[#0D5581]/10 text-[#0D5581]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                >
                  <CheckSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleImagesOnly}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${!imagesOnly ? 'bg-[#0D5581]/10 border-[#0D5581]/30 text-[#0D5581]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  {imagesOnly ? 'Nur Bilder' : 'Alle Dateien'}
                </button>
              </div>
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowMobileFilters((v) => !v)}
                className={`sm:hidden p-2 rounded-lg transition ${showMobileFilters ? 'bg-[#0D5581]/10 text-[#0D5581]' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              {/* Primary CTA */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#0D5581] text-white rounded-xl text-sm font-semibold hover:bg-[#0D5581]/90 active:scale-95 transition-all shadow-sm hover:shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>Hochladen</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
            </div>
          </div>

          {/* Search row */}
          <div className="pb-4 flex items-center gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-[#0D5581]" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Bilder suchen..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5581]/15 focus:border-[#0D5581]/40 focus:bg-white transition-all hover:border-gray-300"
              />
            </div>
          </div>

          {/* Mobile filter row */}
          {showMobileFilters && (
            <div className="sm:hidden flex items-center gap-2 pb-3 flex-wrap">
              <button onClick={toggleImagesOnly} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition ${!imagesOnly ? 'bg-[#0D5581]/10 border-[#0D5581]/30 text-[#0D5581]' : 'border-gray-200 text-gray-500'}`}>
                Alle Dateien
              </button>
              <button onClick={toggleMultiSelect} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition ${multiSelect ? 'bg-[#0D5581]/10 border-[#0D5581]/30 text-[#0D5581]' : 'border-gray-200 text-gray-500'}`}>
                <CheckSquare className="w-3.5 h-3.5" /> Auswählen
              </button>
              <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium border-gray-200 text-gray-500 transition hover:bg-gray-100">
                {viewMode === 'grid' ? <><List className="w-3.5 h-3.5" /> Liste</> : <><Grid className="w-3.5 h-3.5" /> Raster</>}
              </button>
              <button onClick={fetchStats} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium border-gray-200 text-gray-500 transition hover:bg-gray-100">
                <BarChart3 className="w-3.5 h-3.5" /> Statistiken
              </button>
            </div>
          )}
        </div>

        {/* ── STATS PANEL ── */}
        {showStats && stats && (
          <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">Statistiken</p>
              <button onClick={() => setShowStats(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xl font-bold text-gray-900">{stats.totalFiles}</p>
                <p className="text-xs text-gray-500 mt-0.5">Dateien gesamt</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xl font-bold text-gray-900">{formatBytes(stats.totalStorage)}</p>
                <p className="text-xs text-gray-500 mt-0.5">Speicher belegt</p>
              </div>
              {stats.byType.slice(0, 2).map((t: any, i: number) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-bold text-gray-900">{t.count}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.type.split('/')[1]?.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MULTI-SELECT BAR ── */}
        {multiSelect && selectedIds.size > 0 && (
          <div className="bg-[#0D5581] px-4 sm:px-6 py-2.5 flex items-center gap-3 shrink-0">
            <span className="text-sm font-semibold text-white">{selectedIds.size} ausgewählt</span>
            <div className="flex-1" />
            <button onClick={toggleMultiSelect} className="text-white/70 text-sm hover:text-white transition">Abbrechen</button>
            <button onClick={bulkDelete} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition">
              <Trash2 className="w-3.5 h-3.5" /> Löschen
            </button>
          </div>
        )}

        {/* ── GRID / LIST AREA ── */}
        <div
          className="flex-1 overflow-y-auto relative"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false); }}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {dragOver && (
            <div className="absolute inset-0 z-20 bg-[#0D5581]/5 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-[#0D5581]/40 px-12 py-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-[#0D5581]/10 rounded-2xl flex items-center justify-center">
                  <Upload className="w-7 h-7 text-[#0D5581]" />
                </div>
                <p className="text-base font-semibold text-gray-800">Dateien hier ablegen</p>
                <p className="text-sm text-gray-400">WebP + AVIF Optimierung automatisch</p>
              </div>
            </div>
          )}

          {/* Skeleton loading */}
          {loading && !media.length && (
            <div className="p-4 sm:p-5 lg:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && media.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full min-h-64 gap-4 px-4 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                <ImageIcon className="w-9 h-9 text-gray-300" />
              </div>
              <div>
                <p className="font-semibold text-gray-600">{searchInput ? 'Keine Treffer' : 'Noch keine Bilder'}</p>
                <p className="text-sm text-gray-400 mt-1">{searchInput ? 'Suchbegriff anpassen' : 'Bilder hochladen um zu starten'}</p>
              </div>
              {!searchInput && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0D5581] text-white rounded-xl text-sm font-semibold hover:bg-[#0D5581]/90 transition shadow-sm"
                >
                  <Upload className="w-4 h-4" /> Jetzt hochladen
                </button>
              )}
            </div>
          )}

          {/* Grid view */}
          {!loading && media.length > 0 && viewMode === 'grid' && (
            <div className="p-4 sm:p-5 lg:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {media.map((item) => (
                <MediaGridItem
                  key={item.id}
                  item={item}
                  isSelected={selected?.id === item.id}
                  isMultiSelected={selectedIds.has(item.id)}
                  multiSelect={multiSelect}
                  onSelect={selectMedia}
                />
              ))}
            </div>
          )}

          {/* List view — mobile-optimised rows, not a table */}
          {!loading && media.length > 0 && viewMode === 'list' && (
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                {media.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectMedia(item)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                      selected?.id === item.id ? 'bg-[#0D5581]/5' : 'hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <MediaThumb
                      src={getThumbUrl(item)}
                      fallbackSrc={getOriginalUrl(item)}
                      alt=""
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.fileName || item.originalName}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {formatBytes(item.fileSize)} · {formattedDates.get(item.id)}
                        {item.width > 0 && ` · ${item.width}×${item.height}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!item.altText && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      {item.useCount > 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full hidden sm:inline">{item.useCount}×</span>}
                      {item.webpUrl && <span className="text-[10px] bg-green-100 text-green-700 rounded px-1 hidden md:inline">WebP</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-5 sm:px-6 pb-6 pt-4 flex-wrap gap-4">
              <p className="text-xs text-gray-400">
                {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} von {pagination.total}
              </p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500 px-2 tabular-nums">
                  {pagination.page} / {pagination.pages}
                </span>
                <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <select value={limit} onChange={(e) => changeLimit(parseInt(e.target.value))}
                className="text-xs border border-gray-200 rounded-xl px-2.5 py-2 text-gray-600 bg-white outline-none focus:ring-2 focus:ring-[#0D5581]/20 cursor-pointer">
                {[12, 24, 48, 96].map((n) => <option key={n} value={n}>{n} / Seite</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── DETAIL PANEL (slide-in drawer) ── */}

      {/* Mobile backdrop */}
      {isDetailOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSelected(null)}
        />
      )}

      {/* Panel itself */}
      <aside
        className={`
          fixed md:relative inset-y-0 right-0 z-40 md:z-auto
          w-[88vw] max-w-[340px] md:w-80 xl:w-96
          bg-white border-l border-gray-100
          flex flex-col shadow-xl md:shadow-none
          transition-transform duration-300 ease-out
          ${isDetailOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:hidden'}
        `}
      >
        {selected && !multiSelect && (
          <>
            {/* Preview */}
            <div className="relative bg-gray-50 aspect-video flex items-center justify-center shrink-0">
              <MediaThumb
                src={getMediumUrl(selected)}
                fallbackSrc={getOriginalUrl(selected)}
                alt={selected.altText || selected.title || ''}
                className="max-w-full max-h-full object-contain p-3"
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2.5 right-2.5 w-7 h-7 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
              <a
                href={selected.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2.5 right-2.5 w-7 h-7 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition"
                title="Original öffnen"
              >
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </a>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">

                {/* Variant badges */}
                <div className="flex flex-wrap gap-1">
                  {selected.webpUrl && <span className="text-[10px] bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-medium">WebP</span>}
                  {selected.avifUrl && <span className="text-[10px] bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-medium">AVIF</span>}
                  {selected.thumbnailUrl && selected.thumbnailUrl !== selected.sourceUrl && <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">150px</span>}
                  {selected.mediumUrl && <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">500px</span>}
                  {selected.largeUrl && <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">1200px</span>}
                </div>

                {/* Meta info */}
                <div className="space-y-2 text-sm divide-y divide-gray-50">
                  {[
                    { label: 'Typ', value: selected.mimeType },
                    ...(selected.width > 0 ? [{ label: 'Maße', value: `${selected.width} × ${selected.height} px` }] : []),
                    { label: 'Dateigröße', value: formatBytes(selected.fileSize) },
                    { label: 'Hochgeladen', value: format(new Date(selected.createdAt), 'dd.MM.yyyy HH:mm', { locale: de }) },
                    { label: 'Verwendet', value: selected.useCount > 0 ? `${selected.useCount}×` : '–' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-2 py-1.5 first:pt-0">
                      <span className="text-gray-400 shrink-0">{label}</span>
                      <span className={`text-right text-gray-700 ${label === 'Verwendet' && selected.useCount > 0 ? 'text-green-600 font-medium' : ''}`}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Usage refs */}
                {selectedUsedIn.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs font-semibold text-green-700 mb-1.5">Verwendet in:</p>
                    {selectedUsedIn.map((ref: any, i: number) => (
                      <p key={i} className="text-xs text-green-600 leading-relaxed">
                        <span className="font-medium">{ref.type}</span>: {ref.title}
                        <span className="text-green-400 ml-1">({ref.field})</span>
                      </p>
                    ))}
                  </div>
                )}

                {/* URL copy */}
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1.5">URL</p>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={selected.sourceUrl}
                      className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 truncate text-gray-600 outline-none"
                    />
                    <button onClick={copyUrl} className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition shrink-0">
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {/* Edit form */}
                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">Dateiname (SEO)</label>
                      <input type="text" value={editForm.fileName} onChange={(e) => setEditForm({ ...editForm, fileName: e.target.value })}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D5581]/20 focus:border-[#0D5581]/50"
                        placeholder="auto-abmeldung-berlin.jpg" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">Titel</label>
                      <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D5581]/20 focus:border-[#0D5581]/50" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">Alt-Text (SEO)</label>
                      <textarea value={editForm.altText} onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })} rows={2}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0D5581]/20 focus:border-[#0D5581]/50 resize-none"
                        placeholder="Bildbeschreibung für Suchmaschinen" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} disabled={saving}
                        className="flex-1 py-2.5 bg-[#0D5581] text-white rounded-xl text-sm font-semibold hover:bg-[#0D5581]/90 disabled:opacity-50 transition">
                        {saving ? 'Speichern...' : 'Speichern'}
                      </button>
                      <button onClick={() => setEditing(false)} className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200 transition">✕</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Dateiname</p>
                      <p className="text-sm text-gray-800 break-all mt-0.5">{selected.fileName || selected.originalName || '—'}</p>
                    </div>
                    {selected.title && (
                      <div>
                        <p className="text-xs text-gray-400">Titel</p>
                        <p className="text-sm text-gray-800 mt-0.5">{selected.title}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-400">Alt-Text</p>
                      {selected.altText
                        ? <p className="text-sm text-gray-800 mt-0.5">{selected.altText}</p>
                        : <p className="text-sm text-amber-500 mt-0.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Fehlt — schlecht für SEO</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {!editing && (
              <div className="p-4 border-t border-gray-100 space-y-2 shrink-0">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={startEdit} className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition font-medium">
                    <Edit3 className="w-3.5 h-3.5" /> Bearbeiten
                  </button>
                  <button onClick={() => replaceInputRef.current?.click()} disabled={replacing} className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition font-medium">
                    <Replace className="w-3.5 h-3.5" /> {replacing ? '...' : 'Ersetzen'}
                  </button>
                  <input ref={replaceInputRef} type="file" accept="image/*" className="hidden" onChange={replaceImage} />
                </div>
                <button onClick={() => deleteMedia()} disabled={deleting}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-red-200 bg-red-50/50 rounded-xl text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 active:bg-red-100 transition font-medium">
                  <Trash2 className="w-3.5 h-3.5" /> {deleting ? 'Wird gelöscht...' : 'Löschen'}
                </button>
              </div>
            )}
          </>
        )}
      </aside>

      {/* ── UPLOAD PROGRESS — floating card bottom-right ── */}
      {(uploading || uploadProgress.some((p) => p.status === 'error')) && (
        <div className="fixed bottom-4 right-4 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className={`px-4 py-2.5 flex items-center gap-2 ${uploading ? 'bg-[#0D5581]' : 'bg-gray-800'}`}>
            {uploading ? <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" /> : <Check className="w-4 h-4 text-green-400 shrink-0" />}
            <p className="text-sm font-semibold text-white">{uploading ? 'Wird hochgeladen...' : 'Upload abgeschlossen'}</p>
          </div>
          <div className="px-4 py-3 space-y-1.5 max-h-44 overflow-y-auto">
            {uploadProgress.map((p) => (
              <div key={p.id || p.name} className="flex items-center gap-2 text-xs">
                {p.status === 'done'
                  ? <Check className="w-3 h-3 text-green-500 shrink-0" />
                  : p.status === 'error'
                    ? <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                    : <Loader2 className="w-3 h-3 text-[#0D5581] animate-spin shrink-0" />}
                <span className="truncate text-gray-600">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium transition-all pointer-events-none ${
          toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4 text-green-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          {toast.message}
        </div>
      )}

      {/* ── DELETE WARNING MODAL ── */}
      {deleteWarning && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={() => setDeleteWarning(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Bild wird verwendet</p>
                <p className="text-xs text-gray-500 mt-0.5">An {deleteWarning.usedIn.length} Stelle(n) referenziert — wirklich löschen?</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-4 max-h-36 overflow-y-auto space-y-1">
              {deleteWarning.usedIn.map((ref: any, i: number) => (
                <p key={i} className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-medium">{ref.type}</span> · {ref.title}
                </p>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteWarning(null)} className="flex-1 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition">Abbrechen</button>
              <button
                onClick={() => { deleteMedia(deleteWarning.item, true); setDeleteWarning(null); }}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition"
              >
                Trotzdem löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
