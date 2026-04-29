'use client';

import { memo, useCallback } from 'react';
import { FolderOpen, X, Image as ImageIcon } from 'lucide-react';
import { useMedia } from '@/lib/admin-api';
import { getThumbUrl, getOriginalUrl } from '@/lib/media';
import type { BlogFormData } from '@/hooks/useBlogEditor';
import type { MediaListItem, MediaSelectResult } from '@/lib/media';

interface BlogMediaProps {
  form: BlogFormData;
  onOpenPicker: () => void;
  onClearImage: () => void;
  onUpdateField: (field: keyof BlogFormData, value: string) => void;
  onSelectMedia: (media: MediaSelectResult) => void;
}

function BlogMedia({
  form,
  onOpenPicker,
  onClearImage,
  onUpdateField,
  onSelectMedia,
}: BlogMediaProps) {
  // Preload page 1 with limit 24 — SAME SWR cache key as MediaPicker drawer page 1.
  // When user opens the drawer it is already cached → zero loading time.
  const { data } = useMedia({ page: 1, limit: 24 });
  const recentImages = ((data?.media ?? []) as MediaListItem[]).slice(0, 8);

  const hasImage = !!(form.featuredImage || form.featuredImageId);

  const handleQuickPick = useCallback(
    (item: MediaListItem) => {
      onSelectMedia({
        url: getOriginalUrl(item),
        alt: item.altText || item.title || item.fileName || '',
        id: item.id,
      });
    },
    [onSelectMedia],
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Beitragsbild</h3>
        {hasImage && (
          <button
            type="button"
            onClick={onClearImage}
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition"
          >
            <X className="w-3 h-3" />
            Entfernen
          </button>
        )}
      </div>

      {/* ── Current image preview ── */}
      {hasImage ? (
        <div className="relative rounded-xl overflow-hidden bg-gray-100 shadow-sm ring-1 ring-gray-100">
          <img
            src={form.featuredImage}
            alt="Vorschau"
            className="w-full aspect-video object-cover"
          />
          {/* Always-visible change button */}
          <button
            type="button"
            onClick={onOpenPicker}
            className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-black/70 transition backdrop-blur-sm shadow-lg"
          >
            Ändern
          </button>
        </div>
      ) : (
        <>
          {/* ── Quick-pick strip: 8 most recent images, zero clicks to select ── */}
          {recentImages.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Zuletzt hinzugefügt
              </p>
              <div className="grid grid-cols-4 gap-2">
                {recentImages.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    title={item.title || item.fileName}
                    onClick={() => handleQuickPick(item)}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-primary hover:ring-offset-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                  >
                    <img
                      src={getThumbUrl(item)}
                      alt={item.altText || item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Browse all button → opens the drawer ── */}
          <button
            type="button"
            onClick={onOpenPicker}
            className="w-full flex items-center justify-center gap-2 h-14 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all"
          >
            {recentImages.length > 0 ? (
              <>
                <FolderOpen className="w-4 h-4" />
                <span>Alle anzeigen</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                <span>Mediathek öffnen</span>
              </>
            )}
          </button>
        </>
      )}

      {/* ── URL input — always available as a fallback ── */}
      <div className="space-y-2 border-t border-gray-100 pt-5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Oder externe URL
        </label>
        <input
          type="url"
          value={form.featuredImageId ? '' : form.featuredImage}
          onChange={(e) => {
            onUpdateField('featuredImage', e.target.value);
            onUpdateField('featuredImageId', '');
          }}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder:text-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
          placeholder="https://..."
        />
      </div>
    </div>
  );
}

export default memo(BlogMedia);
