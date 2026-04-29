/**
 * Shared Media Types
 * ==================
 * Single source of truth for all media-related interfaces.
 * Used by: MediaPage, MediaPicker, BlogMedia, useBlogEditor, API routes.
 */

export interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  title: string;
  altText: string;
  sourceUrl: string;
  localPath: string;
  thumbnailUrl: string;
  mediumUrl: string;
  largeUrl: string;
  webpUrl: string;
  avifUrl: string;
  mimeType: string;
  width: number;
  height: number;
  fileSize: number;
  folder: string;
  usedIn: string;
  useCount: number;
  processingStatus: 'ready' | 'pending' | 'processing' | 'failed';
  createdAt: string;
}

/** Lightweight version returned by list API (no heavy usedIn field) */
export type MediaListItem = Omit<MediaItem, 'usedIn'>;

export interface MediaPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface MediaFolder {
  name: string;
  count: number;
}

export interface MediaListResponse {
  media: MediaItem[];
  folders: MediaFolder[];
  pagination: MediaPagination;
}

export interface MediaStats {
  totalFiles: number;
  totalStorage: number;
  topUsed: { id: string; fileName: string; thumbnailUrl: string; sourceUrl: string; useCount: number }[];
  byType: { type: string; count: number; size: number }[];
}

export interface UploadProgress {
  id: string;
  name: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
}

/** Optimistic upload item — same shape as MediaItem but flagged */
export interface OptimisticMediaItem extends MediaItem {
  optimistic: true;
}

export interface MediaSelectResult {
  url: string;
  alt: string;
  id: string;
}
