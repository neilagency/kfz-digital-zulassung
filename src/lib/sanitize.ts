/**
 * HTML Sanitizer
 * ===============
 * Server-safe HTML sanitization using isomorphic-dompurify.
 * Use this to sanitize all user/CMS content before rendering
 * with dangerouslySetInnerHTML.
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Fix broken WordPress thumbnail URL dimension suffixes in HTML content.
 * Strips WP-generated dimension variants (e.g., image-1024x576.jpeg) back to the
 * original filename, for both the legacy /uploads/wp/ path and the migrated
 * /uploads/media/migrated/ path.
 *
 * Pattern: {filename}-{number}x{number}.{ext} -> {filename}.{ext}
 */
function fixWordPressImageUrls(html: string): string {
  if (!html) return html;

  // Matches both legacy /uploads/wp/... and migrated /uploads/media/migrated/...
  const uploadPathPattern = '(\\/uploads\\/(?:wp|media\\/migrated)\\/\\d{4}\\/\\d{2}\\/[^"\'\\s<>]+)';

  // Handle WebP double-extension variants: image-1024x576.jpeg.webp -> image.jpeg
  let result = html.replace(
    new RegExp(`${uploadPathPattern}-(\\d+x\\d+)\\.(jpeg|jpg|png|gif)\\.webp`, 'gi'),
    (_match, basePath, _dimensions, ext) => `${basePath}.${ext}`,
  );

  // Handle standard WP thumbnail suffixes: image-1024x576.jpeg -> image.jpeg
  result = result.replace(
    new RegExp(`${uploadPathPattern}-(\\d+x\\d+)\\.(jpeg|jpg|png|webp|gif)`, 'gi'),
    (_match, basePath, _dimensions, ext) => `${basePath}.${ext}`,
  );

  return result;
}

/**
 * Sanitize HTML content, allowing safe tags used in blog/CMS content.
 * Strips scripts, event handlers, and dangerous attributes.
 * Also fixes broken WordPress thumbnail URLs.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  // First fix broken WordPress image URLs
  const fixedHtml = fixWordPressImageUrls(dirty);

  return DOMPurify.sanitize(fixedHtml, {
    // Allow standard HTML tags used in blog/page content
    ALLOWED_TAGS: [
      // Structure
      'div', 'span', 'p', 'br', 'hr',
      // Headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Lists
      'ul', 'ol', 'li',
      // Text formatting
      'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'sup', 'sub', 'small',
      // Links & media
      'a', 'img', 'figure', 'figcaption', 'picture', 'source', 'video', 'audio',
      // Tables
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
      // Block content
      'blockquote', 'pre', 'code', 'details', 'summary',
      // WordPress/Tiptap specific
      'section', 'article', 'aside', 'nav', 'header', 'footer', 'main',
      'iframe', // for embedded content (YouTube, etc.) — restricted by ALLOWED_ATTR
    ],
    ALLOWED_ATTR: [
      // Global
      'id', 'class', 'style', 'title', 'lang', 'dir', 'role', 'aria-label', 'aria-hidden',
      'data-*',
      // Links
      'href', 'target', 'rel',
      // Images
      'src', 'srcset', 'alt', 'width', 'height', 'loading', 'decoding', 'sizes',
      // Tables
      'colspan', 'rowspan', 'scope',
      // Media
      'controls', 'autoplay', 'muted', 'loop', 'poster', 'preload',
      // Iframes (YouTube, etc.)
      'allow', 'allowfullscreen', 'frameborder',
    ],
    // Force safe URLs
    ALLOW_DATA_ATTR: true,
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });
}

/**
 * Sanitize content for use in JSON-LD / structured data.
 * Strips ALL HTML tags and entities.
 */
export function sanitizeForSchema(text: string): string {
  if (!text) return '';
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
