/**
 * Shared Media Utilities
 * ======================
 * URL helpers, formatters, and common logic used across
 * MediaPage, MediaPicker, BlogMedia, and visitor frontend.
 */

import type { MediaItem } from './types';

/** Ensure path starts with / for browser (unless it's an absolute URL) */
export function ensureSlash(p: string): string {
  if (!p) return '';
  return p.startsWith('/') || p.startsWith('http') ? p : `/${p}`;
}

/** Get the best thumbnail URL for grid/list display */
export function getThumbUrl(item: Pick<MediaItem, 'thumbnailUrl' | 'sourceUrl' | 'localPath'>): string {
  if (item.thumbnailUrl) return ensureSlash(item.thumbnailUrl);
  if (item.sourceUrl) return ensureSlash(item.sourceUrl);
  if (item.localPath) return ensureSlash(item.localPath);
  return '';
}

/** Get the best full-resolution URL (prefers localPath over CDN sourceUrl) */
export function getOriginalUrl(item: Pick<MediaItem, 'localPath' | 'sourceUrl'>): string {
  if (item.localPath) return ensureSlash(item.localPath);
  if (item.sourceUrl) {
    // Strip CDN domain to get relative path for our own uploads
    const relative = item.sourceUrl.replace(/^https?:\/\/[^/]+(?=\/uploads\/media\/)/i, '');
    return ensureSlash(relative || item.sourceUrl);
  }
  return '';
}

/** Get medium variant URL (fallback to original) */
export function getMediumUrl(item: Pick<MediaItem, 'mediumUrl' | 'localPath' | 'sourceUrl'>): string {
  if (item.mediumUrl) return ensureSlash(item.mediumUrl);
  return getOriginalUrl(item);
}

/** Format byte count to human-readable string */
export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/** Check if a media item is still being processed */
export function isProcessing(item: Pick<MediaItem, 'processingStatus'>): boolean {
  return item.processingStatus === 'pending' || item.processingStatus === 'processing';
}

/** Check if processing failed */
export function isFailed(item: Pick<MediaItem, 'processingStatus'>): boolean {
  return item.processingStatus === 'failed';
}

/** Safely parse usedIn JSON string */
export function parseUsedIn(usedIn: string | undefined): { type: string; id: string; field: string; title: string }[] {
  if (!usedIn) return [];
  try { return JSON.parse(usedIn); } catch { return []; }
}

/** Max upload file size (10 MB) */
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

/** Allowed image MIME types */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif',
  'image/webp', 'image/svg+xml', 'image/avif',
];

/** Validate a file for upload */
export function validateUploadFile(file: File): string | null {
  if (file.size > MAX_UPLOAD_SIZE) {
    return `"${file.name}" ist zu groß (max. 10 MB).`;
  }
  if (!file.type.startsWith('image/')) {
    return `"${file.name}" ist kein Bild.`;
  }
  return null;
}
