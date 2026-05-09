'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  className?: string;
}

export default function YouTubeFacade({ videoId, title, thumbnailUrl, className = '' }: YouTubeFacadeProps) {
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <div className={`relative aspect-video overflow-hidden rounded-xl bg-black ${className}`}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          loading="eager"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      className={`group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black ${className}`}
      aria-label={`${title} abspielen`}
    >
      <img
        src={thumbnailUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        width={480}
        height={270}
      />
      <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/50" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform duration-200 group-hover:scale-110">
        <Play className="h-7 w-7 translate-x-0.5 fill-current" />
      </div>
    </button>
  );
}
