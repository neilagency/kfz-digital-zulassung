'use client';

import { useState } from 'react';
import type { BlogFormData } from '@/hooks/useBlogEditor';

interface BlogSEOProps {
  form: BlogFormData;
  updateField: (field: keyof BlogFormData, value: string) => void;
  siteUrl: string;
  seoOpen: boolean;
  setSeoOpen: (open: boolean) => void;
}

export default function BlogSEO({ form, updateField, siteUrl, seoOpen, setSeoOpen }: BlogSEOProps) {
  const domain = siteUrl.replace(/^https?:\/\//, '');

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setSeoOpen(!seoOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[#0D5581]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">SEO-Einstellungen</h2>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${seoOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {seoOpen && (
        <div className="px-6 pb-6 space-y-4 border-t">
          {/* Snippet Preview — dynamic URL from siteUrl */}
          <div className="border rounded-lg p-4 bg-gray-50 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Snippet-Vorschau</h3>
            <div className="bg-white border rounded-lg p-4 space-y-1">
              <div className="text-sm text-green-700 truncate">
                {domain}/{form.slug || 'beitrag'}
              </div>
              <div className="text-lg text-[#1a0dab] font-medium truncate hover:underline cursor-pointer">
                {form.metaTitle || form.title || 'Beitragstitel'}
              </div>
              <div className="text-sm text-gray-600 line-clamp-2">
                {form.metaDescription || form.excerpt || 'Keine Beschreibung vorhanden.'}
              </div>
            </div>
          </div>

          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta-Titel</label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => updateField('metaTitle', e.target.value)}
              className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
              placeholder="SEO-Titel (leer = Beitragstitel)"
            />
            <div className="flex items-center justify-between mt-1">
              <div className="h-1.5 flex-1 bg-gray-200 rounded-full mr-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    form.metaTitle.length <= 60 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (form.metaTitle.length / 60) * 100)}%` }}
                />
              </div>
              <span
                className={`text-xs ${form.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}
              >
                {form.metaTitle.length}/60
              </span>
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta-Beschreibung
            </label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => updateField('metaDescription', e.target.value)}
              className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none h-20"
              placeholder="SEO-Beschreibung..."
            />
            <div className="flex items-center justify-between mt-1">
              <div className="h-1.5 flex-1 bg-gray-200 rounded-full mr-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    form.metaDescription.length <= 160 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (form.metaDescription.length / 160) * 100)}%`,
                  }}
                />
              </div>
              <span
                className={`text-xs ${form.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}
              >
                {form.metaDescription.length}/160
              </span>
            </div>
          </div>

          {/* Canonical */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
            <input
              type="url"
              value={form.canonical}
              onChange={(e) => updateField('canonical', e.target.value)}
              className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
              placeholder={`${siteUrl}/...`}
            />
            <p className="text-xs text-gray-400 mt-1">Leer lassen für Standard-URL</p>
          </div>

          {/* Open Graph */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>📱</span> Open Graph (Social Media)
            </h3>
            {/* OG Preview */}
            <div className="border rounded-lg overflow-hidden bg-gray-50 mb-4">
              <div className="mx-3 my-3 bg-white border rounded-lg overflow-hidden">
                {form.featuredImage && (
                  <img src={form.featuredImage} alt="" className="w-full h-32 object-cover" />
                )}
                <div className="p-3">
                  <div className="text-xs text-gray-400 uppercase">{domain}</div>
                  <div className="font-semibold text-sm text-gray-900 mt-0.5">
                    {form.ogTitle || form.metaTitle || form.title || 'Beitragstitel'}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {form.ogDescription || form.metaDescription || 'Beschreibung...'}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OG Titel</label>
              <input
                type="text"
                value={form.ogTitle}
                onChange={(e) => updateField('ogTitle', e.target.value)}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
                placeholder="Open Graph Titel (leer = Meta-Titel)"
              />
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Beschreibung
              </label>
              <textarea
                value={form.ogDescription}
                onChange={(e) => updateField('ogDescription', e.target.value)}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none h-20"
                placeholder="Open Graph Beschreibung (leer = Meta-Beschreibung)"
              />
            </div>
          </div>

          {/* Focus Keyword */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fokus-Keyword</label>
            <input
              type="text"
              value={form.focusKeyword}
              onChange={(e) => updateField('focusKeyword', e.target.value)}
              className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
              placeholder="z.B. Auto online abmelden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
