'use client';

import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { BlogFormData, PublishMode } from '@/hooks/useBlogEditor';

interface BlogPublishProps {
  form: BlogFormData;
  updateField: (field: keyof BlogFormData, value: string) => void;
  publishMode: PublishMode;
  setPublishMode: (mode: PublishMode) => void;
  saving: boolean;
  isNew: boolean;
  isDirty: boolean;
  handleSave: (e?: React.FormEvent, mode?: 'stay' | 'redirect') => Promise<void>;
  onPublishModeChange?: (mode: PublishMode) => void;
}

export default function BlogPublish({
  form,
  updateField,
  publishMode,
  setPublishMode,
  saving,
  isNew,
  isDirty,
  handleSave,
  onPublishModeChange,
}: BlogPublishProps) {
  const handleModeChange = (mode: PublishMode) => {
    setPublishMode(mode);
    onPublishModeChange?.(mode);
  };
  return (
    <div className="space-y-6">
      {/* Publish Panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Veröffentlichung</h3>

        {/* Current status */}
        {!isNew && form.status === 'publish' && (
          <div className="text-xs text-gray-500 bg-emerald-50 rounded-lg px-3 py-2">
            ✅ Veröffentlicht
          </div>
        )}
        {!isNew && form.status === 'scheduled' && form.scheduledAt && (
          <div className="text-xs text-gray-500 bg-blue-50 rounded-lg px-3 py-2">
            🕐 Geplant für:{' '}
            {format(new Date(form.scheduledAt), 'dd.MM.yyyy HH:mm', { locale: de })}
          </div>
        )}

        {/* Publish mode selector */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Modus</label>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="publishMode"
                value="draft"
                checked={publishMode === 'draft'}
                onChange={() => handleModeChange('draft')}
                className="text-[#0D5581] focus:ring-[#0D5581]"
              />
              <span className="text-sm text-gray-700">Entwurf speichern</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="publishMode"
                value="publish"
                checked={publishMode === 'publish'}
                onChange={() => handleModeChange('publish')}
                className="text-[#0D5581] focus:ring-[#0D5581]"
              />
              <span className="text-sm text-gray-700">Jetzt veröffentlichen</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="publishMode"
                value="schedule"
                checked={publishMode === 'schedule'}
                onChange={() => handleModeChange('schedule')}
                className="text-[#0D5581] focus:ring-[#0D5581]"
              />
              <span className="text-sm text-gray-700">Planen</span>
            </label>
          </div>
        </div>

        {/* Schedule date picker */}
        {publishMode === 'schedule' && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">Veröffentlichungsdatum</label>
            <input
              type="datetime-local"
              value={form.scheduledAt ? form.scheduledAt.slice(0, 16) : ''}
              onChange={(e) => updateField('scheduledAt', e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Zeitzone: Europe/Berlin (MEZ/MESZ)</p>
            {form.scheduledAt && new Date(form.scheduledAt) <= new Date() && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Datum liegt in der Vergangenheit — wird sofort veröffentlicht.
              </p>
            )}
          </div>
        )}

        {/* Primary save button — always redirects */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#0D5581] hover:bg-[#0a4468] text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Speichern…
            </>
          ) : publishMode === 'draft'
            ? (isNew ? 'Entwurf speichern' : 'Entwurf aktualisieren')
            : publishMode === 'schedule'
              ? 'Planen'
              : isNew
                ? 'Veröffentlichen'
                : 'Aktualisieren'}
        </button>

        {/* Secondary actions */}
        <div className="flex gap-2">
          {!isNew && (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(undefined, 'stay')}
              className="flex-1 text-sm text-gray-500 hover:text-[#0D5581] hover:bg-gray-50 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              Nur speichern
            </button>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(undefined, 'redirect')}
            className="flex-1 text-sm text-gray-500 hover:text-[#0D5581] hover:bg-gray-50 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            Speichern & Zurück
          </button>
        </div>

        {/* Dirty indicator */}
        {isDirty && (
          <p className="text-xs text-amber-500 text-center">● Ungespeicherte Änderungen</p>
        )}

        {/* Keyboard shortcut hint */}
        <p className="text-xs text-gray-300 text-center">⌘S / Ctrl+S zum Speichern</p>
      </div>

      {/* Category / Tags */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
            placeholder="z.B. Ratgeber"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => updateField('tags', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
            placeholder="Kommagetrennt..."
          />
        </div>
      </div>
    </div>
  );
}
