'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

export interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  category: string;
  featuredImage: string;
  featuredImageId: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  tags: string;
  scheduledAt: string;
}

export type PublishMode = 'draft' | 'publish' | 'schedule';
export type ImageSource = 'none' | 'media' | 'url';

const INITIAL_FORM: BlogFormData = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  status: 'draft',
  category: '',
  featuredImage: '',
  featuredImageId: '',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  canonical: '',
  ogTitle: '',
  ogDescription: '',
  tags: '',
  scheduledAt: '',
};

const AUTOSAVE_KEY = 'blog-editor-autosave';
const AUTOSAVE_INTERVAL = 30_000; // 30 seconds

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function useBlogEditor() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  const [form, setForm] = useState<BlogFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [htmlMode, setHtmlMode] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');
  const [imageSource, setImageSourceState] = useState<ImageSource>('none');
  const [selectedMediaName, setSelectedMediaName] = useState('');
  const [publishMode, setPublishMode] = useState<PublishMode>('draft');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [seoOpen, setSeoOpen] = useState(false);
  const [hasAutosave, setHasAutosave] = useState(false);

  const initialFormRef = useRef<BlogFormData>(INITIAL_FORM);
  const redirectingRef = useRef(false);
  const lastSavedRef = useRef<BlogFormData>(INITIAL_FORM);

  // isDirty — compare against last successful save snapshot
  const isDirty = useMemo(() => {
    const saved = lastSavedRef.current;
    return Object.keys(form).some(
      (key) => form[key as keyof BlogFormData] !== saved[key as keyof BlogFormData]
    );
  }, [form]);

  // Word count & reading time
  const wordCount = useMemo(() => {
    const text = stripHtml(form.content);
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  }, [form.content]);

  const readingTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);

  // ─── Autosave: Check for recovery draft ───
  useEffect(() => {
    if (!isNew) return;
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        setHasAutosave(true);
      }
    } catch { /* ignore */ }
  }, [isNew]);

  // ─── Autosave: Periodic save to localStorage ───
  useEffect(() => {
    if (!isNew || redirectingRef.current) return;
    const interval = setInterval(() => {
      if (form.title || form.content) {
        try {
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form));
        } catch { /* quota exceeded — ignore */ }
      }
    }, AUTOSAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [form, isNew]);

  const restoreAutosave = useCallback(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as BlogFormData;
        setForm(parsed);
        setHasAutosave(false);
        setToast({ message: 'Entwurf wiederhergestellt.', type: 'success' });
      }
    } catch { /* ignore */ }
  }, []);

  const dismissAutosave = useCallback(() => {
    setHasAutosave(false);
    try { localStorage.removeItem(AUTOSAVE_KEY); } catch { /* ignore */ }
  }, []);

  // ─── Load post ───
  useEffect(() => {
    if (!isNew) {
      fetch('/api/admin/blog/' + params.id)
        .then((r) => {
          if (!r.ok) throw new Error('Beitrag nicht gefunden (HTTP ' + r.status + ')');
          return r.json();
        })
        .then((post) => {
          const loadedForm: BlogFormData = {
            title: post.title || '',
            slug: post.slug || '',
            content: post.content || '',
            excerpt: post.excerpt || '',
            status: post.status || 'draft',
            category: post.category || '',
            featuredImage: post.featuredImage || '',
            featuredImageId: post.featuredImageId || '',
            metaTitle: post.metaTitle || '',
            metaDescription: post.metaDescription || '',
            focusKeyword: post.focusKeyword || '',
            canonical: post.canonical || '',
            ogTitle: post.ogTitle || '',
            ogDescription: post.ogDescription || '',
            tags: post.tags || '',
            scheduledAt: post.scheduledAt || '',
          };
          setForm(loadedForm);
          initialFormRef.current = loadedForm;
          lastSavedRef.current = loadedForm;

          if (post.featuredImageId) {
            setImageSourceState('media');
          } else if (post.featuredImage) {
            setImageSourceState('url');
          }

          if (post.status === 'scheduled' && post.scheduledAt) {
            setPublishMode('schedule');
          } else if (post.status === 'publish') {
            setPublishMode('publish');
          }
        })
        .catch((err) => {
          setLoadError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [isNew, params.id]);

  // ─── Load site URL ───
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => setSiteUrl(d.siteUrl || ''))
      .catch(() => {});
  }, []);

  // ─── Unsaved changes warning ───
  useEffect(() => {
    if (!isDirty || redirectingRef.current) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // ─── Update a single field ───
  const updateField = useCallback((field: keyof BlogFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ─── Title change with auto-slug for new posts ───
  const handleTitleChange = useCallback(
    (title: string) => {
      setForm((prev) => ({
        ...prev,
        title,
        slug: isNew ? generateSlug(title) : prev.slug,
      }));
    },
    [isNew]
  );

  // ─── Switch image source ───
  const switchImageSource = useCallback(
    (newSource: ImageSource) => {
      if (
        (imageSource === 'media' && form.featuredImageId) ||
        (imageSource === 'url' && form.featuredImage)
      ) {
        if (!window.confirm('Bild wird entfernt. Fortfahren?')) return;
      }
      setImageSourceState(newSource);
      // Always clear both fields when switching — single source of truth
      setForm((prev) => ({ ...prev, featuredImage: '', featuredImageId: '' }));
      setSelectedMediaName('');
      if (newSource === 'media') {
        setMediaPickerOpen(true);
      }
    },
    [imageSource, form.featuredImageId, form.featuredImage]
  );

  // ─── Media select handler ───
  const handleMediaSelect = useCallback((media: { url: string; alt: string; id: string }) => {
    setForm((prev) => ({ ...prev, featuredImage: media.url, featuredImageId: media.id }));
    setImageSourceState('media');
    setSelectedMediaName(media.alt || '');
  }, []);

  // ─── Clear image ───
  const clearImage = useCallback(() => {
    setForm((prev) => ({ ...prev, featuredImage: '', featuredImageId: '' }));
    setSelectedMediaName('');
    setImageSourceState('none');
  }, []);

  // ─── Save handler ───
  const handleSave = useCallback(
    async (e?: React.FormEvent, mode: 'stay' | 'redirect' = 'redirect') => {
      if (e) e.preventDefault();
      if (saving) return;
      setSaving(true);

      try {
        const url = isNew ? '/api/admin/blog' : '/api/admin/blog/' + params.id;
        const method = isNew ? 'POST' : 'PUT';

        const payload: Record<string, unknown> = { ...form };

        // Enforce single source of truth for image fields
        if (imageSource === 'url') {
          payload.featuredImageId = '';
        } else if (imageSource === 'media') {
          // Keep both — URL is the display URL, ID is the reference
        } else {
          payload.featuredImage = '';
          payload.featuredImageId = '';
        }

        // Set status based on publish mode
        if (publishMode === 'draft') {
          payload.status = 'draft';
          payload.scheduledAt = null;
        } else if (publishMode === 'publish') {
          payload.status = 'publish';
          payload.scheduledAt = null;
        } else if (publishMode === 'schedule') {
          if (!form.scheduledAt) {
            setToast({
              message: 'Bitte wähle ein Datum und eine Uhrzeit für die Planung.',
              type: 'error',
            });
            setSaving(false);
            return;
          }
          payload.status = 'scheduled';
          payload.scheduledAt = new Date(form.scheduledAt).toISOString();
        }

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const result = await res.json();
          const label =
            publishMode === 'draft'
              ? 'Entwurf gespeichert'
              : publishMode === 'schedule'
                ? 'Beitrag geplant'
                : 'Beitrag veröffentlicht';
          setToast({ message: label, type: 'success' });

          // Mark form as clean — only on SUCCESS
          const savedSnapshot = { ...form };
          initialFormRef.current = savedSnapshot;
          lastSavedRef.current = savedSnapshot;

          // Clear autosave on successful save
          try { localStorage.removeItem(AUTOSAVE_KEY); } catch { /* ignore */ }

          if (mode === 'redirect' || isNew) {
            redirectingRef.current = true;
            setTimeout(() => router.push('/admin/blog'), 600);
          } else {
            setSaving(false);
          }
        } else {
          const errData = await res.json().catch(() => null);
          setToast({ message: errData?.error || 'Fehler beim Speichern', type: 'error' });
          // isDirty stays true — lastSavedRef NOT updated
          setSaving(false);
        }
      } catch {
        setToast({ message: 'Netzwerkfehler beim Speichern', type: 'error' });
        setSaving(false);
      }
    },
    [form, isNew, params.id, publishMode, imageSource, saving, router]
  );

  // ─── Keyboard shortcut: Ctrl/Cmd+S → save & stay ───
  const handleSaveRef = useRef(handleSave);
  handleSaveRef.current = handleSave;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveRef.current(undefined, 'stay');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ─── Preview URL ───
  const previewUrl = useMemo(() => {
    if (!form.slug) return null;
    const base = siteUrl || '';
    return `${base}/insiderwissen/${form.slug}`;
  }, [form.slug, siteUrl]);

  return {
    form,
    isNew,
    loading,
    loadError,
    saving,
    isDirty,
    htmlMode,
    mediaPickerOpen,
    siteUrl,
    imageSource,
    selectedMediaName,
    publishMode,
    toast,
    wordCount,
    readingTime,
    seoOpen,
    previewUrl,
    hasAutosave,

    updateField,
    handleTitleChange,
    handleSave,
    setHtmlMode,
    setMediaPickerOpen,
    setPublishMode,
    setToast,
    handleMediaSelect,
    clearImage,
    switchImageSource,
    setSeoOpen,
    restoreAutosave,
    dismissAutosave,
  };
}
