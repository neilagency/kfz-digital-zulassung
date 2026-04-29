'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBlogEditor } from '@/hooks/useBlogEditor';
import { Toast } from '@/components/admin/ui';
import BlogForm from '@/components/admin/blog/BlogForm';
import BlogSEO from '@/components/admin/blog/BlogSEO';
import BlogPublish from '@/components/admin/blog/BlogPublish';
import BlogMedia from '@/components/admin/blog/BlogMedia';

const MediaPicker = dynamic(() => import('@/components/admin/MediaPicker'), { ssr: false });

export default function BlogEditorPage() {
  const router = useRouter();
  const editor = useBlogEditor();
  const [mobileTab, setMobileTab] = useState<'inhalt' | 'optionen'>('inhalt');

  if (editor.loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-8 bg-gray-200 rounded-xl w-48 animate-pulse" />
        <div className="bg-white rounded-2xl p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (editor.loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">{editor.loadError}</p>
        <button onClick={() => router.push('/admin/blog')} className="text-sm text-[#0D5581] hover:underline">
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    editor.handleSave(e, editor.isNew ? 'redirect' : editor.publishMode === 'draft' ? 'stay' : 'redirect');
  };

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 lg:pb-0">

      {/* ── STICKY HEADER (mobile) ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 pt-14 md:pt-0 lg:static lg:bg-transparent lg:border-none lg:px-0 lg:pt-0">
        <div className="flex items-center gap-3 h-14">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900 truncate lg:text-2xl">
              {editor.isNew ? 'Neuer Beitrag' : (editor.form.title || 'Beitrag bearbeiten')}
            </h1>
          </div>
          {editor.isDirty && (
            <span className="text-xs text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
              Ungespeichert
            </span>
          )}
          {editor.previewUrl && !editor.isNew && (
            <a
              href={editor.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0D5581] border border-gray-200 rounded-lg px-2.5 py-1.5 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Vorschau
            </a>
          )}
          {/* Mobile quick-save button */}
          <button
            type="button"
            onClick={(e) => editor.handleSave(e as any, 'stay')}
            disabled={editor.saving || !editor.isDirty}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#0D5581] text-white rounded-xl text-sm font-semibold hover:bg-[#0D5581]/90 disabled:opacity-40 active:scale-95 transition-all shrink-0"
          >
            {editor.saving ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>{editor.saving ? '...' : 'Speichern'}</span>
          </button>
        </div>

        {/* Mobile tab bar */}
        <div className="lg:hidden flex border-t border-gray-100">
          <button
            type="button"
            onClick={() => setMobileTab('inhalt')}
            className={`flex-1 py-2.5 text-sm font-semibold transition border-b-2 ${
              mobileTab === 'inhalt'
                ? 'text-[#0D5581] border-[#0D5581]'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            ✏️ Inhalt
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('optionen')}
            className={`flex-1 py-2.5 text-sm font-semibold transition border-b-2 ${
              mobileTab === 'optionen'
                ? 'text-[#0D5581] border-[#0D5581]'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            ⚙️ Optionen
            {editor.isDirty && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />}
          </button>
        </div>
      </div>

      {/* ── AUTOSAVE BANNER ── */}
      {editor.hasAutosave && editor.isNew && (
        <div className="mx-4 lg:mx-0 mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-sm text-amber-800">📝 Ungespeicherter Entwurf gefunden.</p>
          <div className="flex gap-3 shrink-0">
            <button type="button" onClick={editor.restoreAutosave} className="text-sm font-semibold text-[#0D5581] hover:underline">
              Wiederherstellen
            </button>
            <button type="button" onClick={editor.dismissAutosave} className="text-sm text-gray-400 hover:text-gray-600">
              Verwerfen
            </button>
          </div>
        </div>
      )}

      {/* ── FORM ── */}
      <form
        onSubmit={handleFormSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
            e.preventDefault();
          }
        }}
        className="p-4 lg:p-0 lg:mt-6 lg:grid lg:grid-cols-3 lg:gap-6"
      >
        {/* ── MAIN CONTENT (Inhalt tab on mobile) ── */}
        <div className={`lg:col-span-2 space-y-4 lg:space-y-6 ${mobileTab === 'optionen' ? 'hidden lg:block' : ''}`}>
          <BlogForm
            form={editor.form}
            updateField={editor.updateField}
            handleTitleChange={editor.handleTitleChange}
            htmlMode={editor.htmlMode}
            setHtmlMode={editor.setHtmlMode}
            wordCount={editor.wordCount}
            readingTime={editor.readingTime}
          />
          <BlogSEO
            form={editor.form}
            updateField={editor.updateField}
            siteUrl={editor.siteUrl}
            seoOpen={editor.seoOpen}
            setSeoOpen={editor.setSeoOpen}
          />
        </div>

        {/* ── SIDEBAR (Optionen tab on mobile) ── */}
        <div className={`space-y-4 lg:space-y-6 ${mobileTab === 'inhalt' ? 'hidden lg:block' : ''}`}>
          <BlogPublish
            form={editor.form}
            updateField={editor.updateField}
            publishMode={editor.publishMode}
            setPublishMode={editor.setPublishMode}
            saving={editor.saving}
            isNew={editor.isNew}
            isDirty={editor.isDirty}
            handleSave={editor.handleSave}
            onPublishModeChange={(mode) => {
              if (mode === 'publish' || mode === 'schedule') {
                editor.setSeoOpen(true);
              }
            }}
          />
          <BlogMedia
            form={editor.form}
            onOpenPicker={() => editor.setMediaPickerOpen(true)}
            onClearImage={editor.clearImage}
            onUpdateField={editor.updateField}
            onSelectMedia={editor.handleMediaSelect}
          />
        </div>

        {/* MediaPicker drawer — always rendered */}
        <MediaPicker
          open={editor.mediaPickerOpen}
          onClose={() => editor.setMediaPickerOpen(false)}
          onSelect={editor.handleMediaSelect}
          selectedId={editor.form.featuredImageId}
          title="Beitragsbild auswählen"
        />
      </form>

      {/* Toast */}
      {editor.toast && (
        <Toast
          message={editor.toast.message}
          type={editor.toast.type}
          onClose={() => editor.setToast(null)}
        />
      )}
    </div>
  );
}
