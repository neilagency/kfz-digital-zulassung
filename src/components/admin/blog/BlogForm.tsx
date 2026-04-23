'use client';

import { memo, useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { BlogFormData } from '@/hooks/useBlogEditor';

const TiptapEditor = dynamic(() => import('@/components/admin/TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] border rounded-lg bg-gray-50 shimmer" />
  ),
});

interface BlogFormProps {
  form: BlogFormData;
  updateField: (field: keyof BlogFormData, value: string) => void;
  handleTitleChange: (title: string) => void;
  htmlMode: boolean;
  setHtmlMode: (v: boolean) => void;
  wordCount: number;
  readingTime: number;
}

function BlogForm({
  form,
  updateField,
  handleTitleChange,
  htmlMode,
  setHtmlMode,
  wordCount,
  readingTime,
}: BlogFormProps) {
  // Debounce HTML textarea content to avoid re-render on every keystroke
  const [localContent, setLocalContent] = useState(form.content);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when form.content changes externally (e.g. switching from editor to HTML mode)
  useEffect(() => {
    setLocalContent(form.content);
  }, [form.content]);

  const handleHtmlContentChange = useCallback((value: string) => {
    setLocalContent(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateField('content', value);
    }, 300);
  }, [updateField]);
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
          placeholder="Beitragstitel eingeben..."
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <span>/insiderwissen/</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            className="flex-1 px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
            required
          />
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Inhalt</label>
          <div className="flex items-center gap-3">
            {/* Word count / reading time */}
            {wordCount > 0 && (
              <span className="text-xs text-gray-400">
                {wordCount} Wörter · {readingTime} Min. Lesezeit
              </span>
            )}
            <button
              type="button"
              onClick={() => setHtmlMode(!htmlMode)}
              className={
                'text-xs px-2 py-1 rounded transition ' +
                (htmlMode
                  ? 'bg-gray-800 text-green-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
              }
            >
              {htmlMode ? '</> HTML' : 'Editor'}
            </button>
          </div>
        </div>
        {htmlMode ? (
          <textarea
            value={localContent}
            onChange={(e) => handleHtmlContentChange(e.target.value)}
            className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none min-h-[400px] font-mono text-sm bg-gray-900 text-green-400"
            placeholder="HTML-Inhalt eingeben..."
          />
        ) : (
          <TiptapEditor
            content={form.content}
            onChange={(html) => updateField('content', html)}
            placeholder="Beitragsinhalt schreiben..."
          />
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Auszug</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => updateField('excerpt', e.target.value)}
          className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none h-24"
          placeholder="Kurze Beschreibung..."
        />
      </div>
    </div>
  );
}

export default memo(BlogForm);
