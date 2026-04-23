'use client';

/**
 * OptimizedImage — Responsive, SEO-optimized image component
 * ===========================================================
 * Uses <picture> with AVIF/WebP sources and srcset for responsive sizes.
 * Falls back gracefully to original format.
 *
 * Usage:
 *   <OptimizedImage
 *     src="/uploads/media/2026/03/auto-abmelden-abc123.jpg"
 *     alt="Auto Abmeldung Berlin"
 *     width={1200}
 *     height={800}
 *     thumbnailSrc="/uploads/media/2026/03/auto-abmelden-abc123-thumbnail.webp"
 *     mediumSrc="/uploads/media/2026/03/auto-abmelden-abc123-medium.webp"
 *     largeSrc="/uploads/media/2026/03/auto-abmelden-abc123-large.webp"
 *     webpSrc="/uploads/media/2026/03/auto-abmelden-abc123.webp"
 *     avifSrc="/uploads/media/2026/03/auto-abmelden-abc123.avif"
 *     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
 *   />
 */

import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  thumbnailSrc?: string;
  mediumSrc?: string;
  largeSrc?: string;
  webpSrc?: string;
  avifSrc?: string;
  sizes?: string;
  priority?: boolean; // Above-the-fold images: skip lazy loading
  fill?: boolean;     // CSS object-fit: cover with absolute positioning
  onClick?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  thumbnailSrc,
  mediumSrc,
  largeSrc,
  webpSrc,
  avifSrc,
  sizes = '100vw',
  priority = false,
  fill = false,
  onClick,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If already cached/loaded before component mounts
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  // Build srcset for WebP variants (sized)
  const webpSrcSet = [
    thumbnailSrc && `${thumbnailSrc} 150w`,
    mediumSrc && `${mediumSrc} 500w`,
    largeSrc && `${largeSrc} 1200w`,
    webpSrc && `${webpSrc} ${width || 1920}w`,
  ].filter(Boolean).join(', ');

  // AVIF source (full size only — browser will pick based on <source>)
  const avifSrcSet = avifSrc ? `${avifSrc} ${width || 1920}w` : '';

  // Fallback srcset using original format
  const fallbackSrcSet = [
    thumbnailSrc && `${thumbnailSrc} 150w`,
    mediumSrc && `${mediumSrc} 500w`,
    largeSrc && `${largeSrc} 1200w`,
    `${src} ${width || 1920}w`,
  ].filter(Boolean).join(', ');

  const imgStyle: React.CSSProperties = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
    : {};

  const wrapperStyle: React.CSSProperties = fill
    ? { position: 'relative', overflow: 'hidden' }
    : {};

  const aspectRatio = width && height && !fill
    ? { aspectRatio: `${width}/${height}` }
    : {};

  const hasVariants = webpSrcSet || avifSrcSet;

  return (
    <div style={wrapperStyle} className={fill ? className : undefined}>
      {hasVariants ? (
        <picture>
          {avifSrcSet && (
            <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
          )}
          {webpSrcSet && (
            <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
          )}
          <img
            ref={imgRef}
            src={src}
            srcSet={fallbackSrcSet || undefined}
            sizes={sizes}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : undefined}
            onLoad={() => setLoaded(true)}
            onClick={onClick}
            className={`${!fill ? className : ''} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ ...imgStyle, ...aspectRatio }}
          />
        </picture>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : undefined}
          onLoad={() => setLoaded(true)}
          onClick={onClick}
          className={`${!fill ? className : ''} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ ...imgStyle, ...aspectRatio }}
        />
      )}
    </div>
  );
}
