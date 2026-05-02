/**
 * HTML Sanitizer
 * ===============
 * Server-safe HTML sanitization using isomorphic-dompurify.
 * Use this to sanitize all user/CMS content before rendering
 * with dangerouslySetInnerHTML.
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Fix broken WordPress thumbnail URLs.
 * Converts old WordPress thumbnail URLs (e.g., image-1024x576.jpeg) to original URLs.
 *
 * Pattern: {filename}-{number}x{number}.{ext} -> {filename}.{ext}
 * Example: /uploads/wp/2024/01/WhatsApp-Image-2024-01-06-at-3.21.48-PM-1024x576.jpeg
 *          -> /uploads/wp/2024/01/WhatsApp-Image-2024-01-06-at-3.21.48-PM.jpeg
 *
 * Also handles: {filename}-{digit}-{number}x{number}.{ext} -> {filename}-{digit}.{ext}
 * Example: /uploads/wp/2024/01/WhatsApp-Image-2024-01-06-at-3.21.48-PM-1-1260x708.jpeg
 *          -> /uploads/wp/2024/01/WhatsApp-Image-2024-01-06-at-3.21.48-PM-1.jpeg
 */
function fixWordPressImageUrls(html: string): string {
  if (!html) return html;

  // First handle WebP variants: image-1024x576.jpeg.webp -> image.jpeg
  let result = html.replace(
    /(\/uploads\/wp\/\d{4}\/\d{2}\/[^"'\s<>]+)-(\d+ x \d+|\d+x\d+)\.(jpeg|jpg|png|gif)\.webp/gi,
    (match, basePath, dimensions, ext) => {
      const numberedMatch = basePath.match(/-([12])$/);
      if (numberedMatch) {
        return `${basePath}.${ext}`;
      }
      return `${basePath}.${ext}`;
    }
  );

  // Then handle regular images: image-1024x576.jpeg -> image.jpeg
  result = result.replace(
    /(\/uploads\/wp\/\d{4}\/\d{2}\/[^"'\s<>]+)-(\d+ x \d+|\d+x\d+)\.(jpeg|jpg|png|webp|gif)/gi,
    (match, basePath, dimensions, ext) => {
      const numberedMatch = basePath.match(/-([12])$/);
      if (numberedMatch) {
        // It's a numbered variant like image-1-1260x708.jpeg -> keep the -1
        return `${basePath}.${ext}`;
      }
      // Regular case: image-1024x576.jpeg -> image.jpeg
      return `${basePath}.${ext}`;
    }
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
