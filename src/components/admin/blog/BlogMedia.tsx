'use client';

import { memo } from 'react';
import type { BlogFormData, ImageSource } from '@/hooks/useBlogEditor';

interface BlogMediaProps {
  form: BlogFormData;
  imageSource: ImageSource;
  selectedMediaName: string;
  onSwitchSource: (source: ImageSource) => void;
  onOpenPicker: () => void;
  onClearImage: () => void;
  onUpdateField: (field: keyof BlogFormData, value: string) => void;
}

function BlogMedia({
  form,
  imageSource,
  selectedMediaName,
  onSwitchSource,
  onOpenPicker,
  onClearImage,
  onUpdateField,
}: BlogMediaProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Beitragsbild</h3>

      {/* Source selector */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            if (imageSource === 'media') {
              onOpenPicker();
            } else {
              onSwitchSource('media');
            }
          }}
          className={`flex-1 text-xs font-medium px-3 py-2 rounded-lg border transition ${
            imageSource === 'media'
              ? 'bg-[#0D5581] text-white border-[#0D5581]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D5581] hover:text-[#0D5581]'
          }`}
        >
          📷 Aus Mediathek
        </button>
        <button
          type="button"
          onClick={() => {
            if (imageSource !== 'url') {
              onSwitchSource('url');
            }
          }}
          className={`flex-1 text-xs font-medium px-3 py-2 rounded-lg border transition ${
            imageSource === 'url'
              ? 'bg-[#0D5581] text-white border-[#0D5581]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D5581] hover:text-[#0D5581]'
          }`}
        >
          🔗 URL eingeben
        </button>
      </div>

      {/* Media mode */}
      {imageSource === 'media' && (
        <div className="space-y-3">
          {form.featuredImageId ? (
            <div className="relative">
              <img
                src={form.featuredImage}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
              />
              {/* Always-visible overlay buttons (mobile-friendly) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg flex items-end justify-between p-2">
                <button
                  type="button"
                  onClick={onOpenPicker}
                  className="bg-white/90 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-sm transition hover:bg-white"
                >
                  Ändern
                </button>
                <button
                  type="button"
                  onClick={onClearImage}
                  className="bg-red-500/90 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-sm backdrop-blur-sm transition hover:bg-red-600"
                  aria-label="Bild entfernen"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenPicker}
              className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer transition border-gray-300 hover:border-[#0D5581] hover:bg-gray-50"
            >
              <span className="text-sm text-gray-500">Bild aus Mediathek wählen</span>
            </button>
          )}
          {selectedMediaName && (
            <p className="text-xs text-gray-400 truncate">📎 {selectedMediaName}</p>
          )}
        </div>
      )}

      {/* URL mode */}
      {imageSource === 'url' && (
        <div className="space-y-3">
          <input
            type="url"
            value={form.featuredImage}
            onChange={(e) => {
              onUpdateField('featuredImage', e.target.value);
              onUpdateField('featuredImageId', '');
            }}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
            placeholder="https://..."
          />
          {form.featuredImage && (
            <div className="relative">
              <img
                src={form.featuredImage}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={onClearImage}
                className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-sm backdrop-blur-sm transition hover:bg-red-600"
                aria-label="Bild entfernen"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* No source selected */}
      {imageSource === 'none' && (
        <p className="text-xs text-gray-400 text-center py-2">
          Wähle eine Quelle für das Beitragsbild
        </p>
      )}
    </div>
  );
}

export default memo(BlogMedia);
