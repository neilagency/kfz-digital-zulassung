'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const MediaPicker = dynamic(() => import('@/components/admin/MediaPicker'), { ssr: false });

const TiptapEditor = dynamic(() => import('@/components/admin/TiptapEditor'), {
  ssr: false,
  loading: () => <div className="h-[400px] border rounded-lg animate-pulse bg-gray-50" />,
});

const defaultForm = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  status: 'draft',
  author: '',
  template: '',
  parent: '',
  menuOrder: 0,
  featuredImage: '',
  // SEO fields
  metaTitle: '',
  metaDescription: '',
  focusKeywords: '',
  seoScore: 0,
  canonical: '',
  robots: '',
  schemaType: '',
  schemaData: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogType: 'website',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  twitterCard: 'summary_large_image',
  internalLinks: 0,
  externalLinks: 0,
};

function SEOScoreCircle({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#f97316' : '#ef4444';
  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="transform -rotate-90 w-24 h-24" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{pct}</span>
        <span className="text-xs text-gray-400 ml-0.5">/100</span>
      </div>
    </div>
  );
}

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [htmlMode, setHtmlMode] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerField, setMediaPickerField] = useState<string>('featuredImage');
  const [seoTab, setSeoTab] = useState<'general' | 'social' | 'advanced'>('general');
  const [form, setForm] = useState({ ...defaultForm });
  const [siteUrl, setSiteUrl] = useState('');

  // Debounced content update for HTML textarea (prevents re-render on every keystroke)
  const contentDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localContent, setLocalContent] = useState('');
  const localContentInitRef = useRef(false);

  // Sync localContent when form.content changes externally (e.g. load from API)
  useEffect(() => {
    if (!localContentInitRef.current || !htmlMode) {
      setLocalContent(form.content);
      localContentInitRef.current = true;
    }
  }, [form.content, htmlMode]);

  const handleContentChange = useCallback((value: string) => {
    setLocalContent(value);
    if (contentDebounceRef.current) clearTimeout(contentDebounceRef.current);
    contentDebounceRef.current = setTimeout(() => {
      setForm(prev => ({ ...prev, content: value }));
    }, 300);
  }, []);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      setSiteUrl(d.siteUrl || '');
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isNew) {
      fetch('/api/admin/pages/' + params.id)
        .then((r) => r.json())
        .then((page) => {
          const f: any = {};
          Object.keys(defaultForm).forEach((key) => {
            f[key] = page[key] ?? (defaultForm as any)[key];
          });
          setForm(f);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isNew, params.id]);

  const generateSlug = (title: string) =>
    title.toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');

  const handleTitleChange = (title: string) => {
    setForm({ ...form, title, slug: isNew ? generateSlug(title) : form.slug });
  };



  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isNew ? '/api/admin/pages' : '/api/admin/pages/' + params.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          menuOrder: Number(form.menuOrder) || 0,
          seoScore: Number(form.seoScore) || 0,
          internalLinks: Number(form.internalLinks) || 0,
          externalLinks: Number(form.externalLinks) || 0,
        }),
      });
      if (res.ok) {
        const page = await res.json();
        if (isNew) router.push('/admin/pages/' + page.id);
        alert('Gespeichert!');
      } else { alert('Fehler beim Speichern'); }
    } catch (err) { console.error(err); alert('Fehler beim Speichern'); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded" />)}
        </div>
      </div>
    );
  }

  const snippetTitle = form.metaTitle || form.title || 'Seitentitel';
  const snippetDesc = form.metaDescription || form.excerpt || 'Keine Beschreibung vorhanden.';
  const snippetUrl = `${siteUrl.replace(/^https?:\/\//, '')}/${form.slug || 'seite'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/admin/pages')} className="text-gray-400 hover:text-gray-600 transition">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Neue Seite' : 'Seite bearbeiten'}
        </h1>
        {!isNew && form.slug && (
          <a href={`${siteUrl}/${form.slug}/`} target="_blank" rel="noopener"
            className="text-xs text-[#0D5581] hover:underline flex items-center gap-1 ml-auto">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Live anzeigen
          </a>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* =================== MAIN CONTENT =================== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title / Slug / Content */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
              <input type="text" value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                placeholder="Seitentitel eingeben..." required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <span>{siteUrl.replace(/^https?:\/\//, '')}/</span>
                <input type="text" value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="flex-1 px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                  required />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Inhalt</label>
                <button type="button" onClick={() => setHtmlMode(!htmlMode)}
                  className={'text-xs px-2 py-1 rounded transition ' + (htmlMode ? 'bg-gray-800 text-green-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                  {htmlMode ? '</> HTML' : 'Editor'}
                </button>
              </div>
              {htmlMode ? (
                <textarea value={localContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none min-h-[400px] font-mono text-sm bg-gray-900 text-green-400"
                  placeholder="HTML-Inhalt eingeben..." />
              ) : (
                <TiptapEditor content={form.content}
                  onChange={(html) => setForm({ ...form, content: html })}
                  placeholder="Seiteninhalt schreiben..." />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auszug</label>
              <textarea value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none h-24"
                placeholder="Kurze Beschreibung der Seite..." />
            </div>
          </div>

          {/* =================== SEO PANEL =================== */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Panel Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#4e8cca] to-[#0D5581] flex items-center gap-3">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h2 className="text-lg font-semibold text-white">SEO-Einstellungen</h2>
            </div>

            {/* SEO Tabs */}
            <div className="flex border-b">
              {[
                { key: 'general', label: 'Allgemein', icon: '🎯' },
                { key: 'social', label: 'Social', icon: '📱' },
                { key: 'advanced', label: 'Erweitert', icon: '⚙️' },
              ].map((tab) => (
                <button key={tab.key} type="button"
                  onClick={() => setSeoTab(tab.key as any)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition border-b-2 ${
                    seoTab === tab.key
                      ? 'border-[#0D5581] text-[#0D5581] bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}>
                  <span className="mr-1">{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-5">
              {/* ---- GENERAL TAB ---- */}
              {seoTab === 'general' && (
                <>
                  {/* Snippet Preview */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Snippet-Vorschau</h3>
                    <div className="bg-white border rounded-lg p-4 space-y-1">
                      <div className="text-sm text-green-700 truncate">{snippetUrl}</div>
                      <div className="text-lg text-[#1a0dab] font-medium truncate hover:underline cursor-pointer">
                        {snippetTitle}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2">{snippetDesc}</div>
                    </div>
                  </div>

                  {/* SEO Score */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SEO-Score</label>
                    <div className="flex items-center gap-4">
                      <SEOScoreCircle score={form.seoScore} />
                      <input type="number" min="0" max="100" value={form.seoScore}
                        onChange={(e) => setForm({ ...form, seoScore: Number(e.target.value) })}
                        className="w-20 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none" />
                    </div>
                  </div>

                  {/* Focus Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fokus-Keywords
                      <span className="text-gray-400 font-normal ml-1">(kommagetrennt)</span>
                    </label>
                    <input type="text" value={form.focusKeywords}
                      onChange={(e) => setForm({ ...form, focusKeywords: e.target.value })}
                      className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                      placeholder="z.B. auto abmelden, kfz abmeldung" />
                    {form.focusKeywords && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {form.focusKeywords.split(',').map((kw, i) => kw.trim() && (
                          <span key={i} className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-[#0D5581] rounded-full text-xs font-medium">
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta-Titel</label>
                    <input type="text" value={form.metaTitle}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                      placeholder="SEO-Titel (leer = Seitentitel)" />
                    <div className="flex items-center justify-between mt-1">
                      <div className="h-1.5 flex-1 bg-gray-200 rounded-full mr-3 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${
                          form.metaTitle.length <= 60 ? 'bg-green-500' : 'bg-red-500'
                        }`} style={{ width: `${Math.min(100, (form.metaTitle.length / 60) * 100)}%` }} />
                      </div>
                      <span className={`text-xs ${form.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                        {form.metaTitle.length}/60
                      </span>
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta-Beschreibung</label>
                    <textarea value={form.metaDescription}
                      onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                      className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none h-24"
                      placeholder="SEO-Beschreibung..." />
                    <div className="flex items-center justify-between mt-1">
                      <div className="h-1.5 flex-1 bg-gray-200 rounded-full mr-3 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${
                          form.metaDescription.length <= 160 ? 'bg-green-500' : 'bg-red-500'
                        }`} style={{ width: `${Math.min(100, (form.metaDescription.length / 160) * 100)}%` }} />
                      </div>
                      <span className={`text-xs ${form.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                        {form.metaDescription.length}/160
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* ---- SOCIAL TAB ---- */}
              {seoTab === 'social' && (
                <>
                  {/* OG Preview */}
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase px-4 pt-3 pb-2">Facebook / Open Graph Vorschau</h3>
                    <div className="mx-4 mb-4 bg-white border rounded-lg overflow-hidden">
                      {(form.ogImage || form.featuredImage) && (
                        <img src={form.ogImage || form.featuredImage} alt="" className="w-full h-40 object-cover" />
                      )}
                      <div className="p-3">
                        <div className="text-xs text-gray-400 uppercase">{snippetUrl}</div>
                        <div className="font-semibold text-sm text-gray-900 mt-0.5">{form.ogTitle || form.metaTitle || form.title || 'Seitentitel'}</div>
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{form.ogDescription || form.metaDescription || 'Beschreibung...'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OG Titel</label>
                      <input type="text" value={form.ogTitle}
                        onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                        placeholder="Open Graph Titel" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OG Typ</label>
                      <select value={form.ogType}
                        onChange={(e) => setForm({ ...form, ogType: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none">
                        <option value="website">website</option>
                        <option value="article">article</option>
                        <option value="product">product</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OG Beschreibung</label>
                    <textarea value={form.ogDescription}
                      onChange={(e) => setForm({ ...form, ogDescription: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none h-20"
                      placeholder="Open Graph Beschreibung" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OG Bild URL</label>
                    <div className="flex gap-2">
                      <input type="url" value={form.ogImage}
                        onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                        placeholder="https://..." />
                      <button type="button" onClick={() => { setMediaPickerField('ogImage'); setMediaPickerOpen(true); }}
                        className="px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap">Mediathek</button>
                    </div>
                  </div>

                  <hr className="my-2" />

                  {/* Twitter */}
                  <h3 className="text-sm font-semibold text-gray-700">Twitter Card</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Titel</label>
                      <input type="text" value={form.twitterTitle}
                        onChange={(e) => setForm({ ...form, twitterTitle: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                        placeholder="Twitter Card Titel" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Typ</label>
                      <select value={form.twitterCard}
                        onChange={(e) => setForm({ ...form, twitterCard: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none">
                        <option value="summary_large_image">Summary Large Image</option>
                        <option value="summary">Summary</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Beschreibung</label>
                    <textarea value={form.twitterDescription}
                      onChange={(e) => setForm({ ...form, twitterDescription: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none h-20"
                      placeholder="Twitter Card Beschreibung" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Bild URL</label>
                    <div className="flex gap-2">
                      <input type="url" value={form.twitterImage}
                        onChange={(e) => setForm({ ...form, twitterImage: e.target.value })}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                        placeholder="https://..." />
                      <button type="button" onClick={() => { setMediaPickerField('twitterImage'); setMediaPickerOpen(true); }}
                        className="px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap">Mediathek</button>
                    </div>
                  </div>
                </>
              )}

              {/* ---- ADVANCED TAB ---- */}
              {seoTab === 'advanced' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                    <input type="url" value={form.canonical}
                      onChange={(e) => setForm({ ...form, canonical: e.target.value })}
                      className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                      placeholder={`${siteUrl}/...`} />
                    <p className="text-xs text-gray-400 mt-1">Leer lassen fuer Standard-URL</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Robots</label>
                    <select value={form.robots}
                      onChange={(e) => setForm({ ...form, robots: e.target.value })}
                      className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none">
                      <option value="">Standard (index, follow)</option>
                      <option value="index, follow">index, follow</option>
                      <option value="noindex, follow">noindex, follow</option>
                      <option value="index, nofollow">index, nofollow</option>
                      <option value="noindex, nofollow">noindex, nofollow</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Schema Typ</label>
                    <select value={form.schemaType}
                      onChange={(e) => setForm({ ...form, schemaType: e.target.value })}
                      className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none">
                      <option value="">Kein Schema</option>
                      <option value="WebPage">WebPage</option>
                      <option value="Article">Article</option>
                      <option value="FAQPage">FAQPage</option>
                      <option value="Product">Product</option>
                      <option value="LocalBusiness">LocalBusiness</option>
                      <option value="Organization">Organization</option>
                      <option value="HowTo">HowTo</option>
                      <option value="BreadcrumbList">BreadcrumbList</option>
                      <option value="Service">Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schema JSON-LD
                      <span className="text-gray-400 font-normal ml-1">(Structured Data)</span>
                    </label>
                    <textarea value={form.schemaData}
                      onChange={(e) => setForm({ ...form, schemaData: e.target.value })}
                      className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none h-40 font-mono text-xs bg-gray-50"
                      placeholder='{"@context":"https://schema.org",...}' />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Interne Links</label>
                      <input type="number" min="0" value={form.internalLinks}
                        onChange={(e) => setForm({ ...form, internalLinks: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Externe Links</label>
                      <input type="number" min="0" value={form.externalLinks}
                        onChange={(e) => setForm({ ...form, externalLinks: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* =================== SIDEBAR =================== */}
        <div className="space-y-6">
          {/* Publish */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Veroeffentlichung</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none">
                <option value="draft">Entwurf</option>
                <option value="publish">Veroeffentlicht</option>
                <option value="private">Privat</option>
              </select>
            </div>
            <button type="submit" disabled={saving}
              className="w-full bg-[#0D5581] hover:bg-[#0a4468] text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50">
              {saving ? 'Speichern...' : isNew ? 'Veroeffentlichen' : 'Aktualisieren'}
            </button>
          </div>

          {/* SEO Quick Score */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">SEO-Score</h3>
            <SEOScoreCircle score={form.seoScore} />
            {form.focusKeywords && (
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-400">Fokus-Keyword</p>
                <p className="text-sm font-medium text-[#0D5581]">{form.focusKeywords.split(',')[0]}</p>
              </div>
            )}
          </div>

          {/* Page Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Seiten-Einstellungen</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Autor</label>
              <input type="text" value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                placeholder="Autor" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Template</label>
              <input type="text" value={form.template}
                onChange={(e) => setForm({ ...form, template: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                placeholder="z.B. default, full-width" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Reihenfolge</label>
              <input type="number" value={form.menuOrder}
                onChange={(e) => setForm({ ...form, menuOrder: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none" />
            </div>
          </div>

          {/* Featured Image with Media Picker */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Beitragsbild</h3>
            <div>
              <button
                type="button"
                onClick={() => { setMediaPickerField('featuredImage'); setMediaPickerOpen(true); }}
                className="flex items-center justify-center w-full h-10 border-2 border-dashed rounded-lg cursor-pointer transition border-gray-300 hover:border-[#0D5581] hover:bg-gray-50"
              >
                <span className="text-sm text-gray-500">Aus Mediathek wählen</span>
              </button>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">oder URL eingeben</label>
              <input type="url" value={form.featuredImage}
                onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                placeholder="https://..." />
            </div>
            {form.featuredImage && (
              <div className="relative group">
                <img src={form.featuredImage} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                <button type="button" onClick={() => setForm({ ...form, featuredImage: '' })}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">
                  X
                </button>
              </div>
            )}
          </div>
          <MediaPicker
            open={mediaPickerOpen}
            onClose={() => setMediaPickerOpen(false)}
            onSelect={(media) => setForm({ ...form, [mediaPickerField]: media.url })}
            title="Bild auswählen"
          />
        </div>
      </form>
    </div>
  );
}
