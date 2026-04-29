'use client';

/**
 * Shared Media Components
 * =======================
 * Reusable UI primitives for media display across admin.
 */

import { memo, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

/** Thumbnail image with fallback chain and lazy loading */
interface MediaThumbProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

export const MediaThumb = memo(function MediaThumb({ src, fallbackSrc, alt, className }: MediaThumbProps) {
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  if (error || !currentSrc) {
    return (
      <div className={`${className || ''} bg-gray-100 flex items-center justify-center`}>
        <ImageIcon className="w-6 h-6 text-gray-300" />
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        } else {
          setError(true);
        }
      }}
    />
  );
});
