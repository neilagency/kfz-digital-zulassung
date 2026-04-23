'use client';

import dynamic from 'next/dynamic';
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

  // Loading state
  if (editor.loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded-lg w-48 shimmer" />
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg shimmer" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (editor.loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">{editor.loadError}</p>
        <button
          onClick={() => router.push('/admin/blog')}
          className="text-sm text-[#0D5581] hover:underline"
        >
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    // New posts always redirect; existing drafts stay
    editor.handleSave(e, editor.isNew ? 'redirect' : editor.publishMode === 'draft' ? 'stay' : 'redirect');
  };

  return (
    <div className="space-y-6">
      {/* Autosave recovery banner */}
      {editor.hasAutosave && editor.isNew && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-amber-800">
            📝 Es wurde ein ungespeicherter Entwurf gefunden.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={editor.restoreAutosave}
              className="text-sm font-medium text-[#0D5581] hover:underline"
            >
              Wiederherstellen
            </button>
            <button
              type="button"
              onClick={editor.dismissAutosave}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Verwerfen
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {editor.isNew ? 'Neuer Beitrag' : 'Beitrag bearbeiten'}
        </h1>
        {editor.isDirty && (
          <span className="text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
            Ungespeichert
          </span>
        )}
        <div className="ml-auto">
          {editor.previewUrl && !editor.isNew && (
            <a
              href={editor.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0D5581] transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Vorschau
            </a>
          )}
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleFormSubmit}
        onKeyDown={(e) => {
          // Prevent Enter from submitting form in text inputs
          if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
            e.preventDefault();
          }
        }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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

        {/* Sidebar */}
        <div className="space-y-6">
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
            imageSource={editor.imageSource}
            selectedMediaName={editor.selectedMediaName}
            onSwitchSource={editor.switchImageSource}
            onOpenPicker={() => editor.setMediaPickerOpen(true)}
            onClearImage={editor.clearImage}
            onUpdateField={editor.updateField}
          />
          <MediaPicker
            open={editor.mediaPickerOpen}
            onClose={() => editor.setMediaPickerOpen(false)}
            onSelect={editor.handleMediaSelect}
            title="Beitragsbild auswählen"
          />
        </div>
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
