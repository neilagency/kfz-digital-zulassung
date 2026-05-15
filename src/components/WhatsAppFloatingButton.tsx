'use client';

import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface WhatsAppFloatingButtonProps {
  whatsappUrl?: string;
}

/**
 * WhatsApp Floating Contact Button
 *
 * Appears fixed at the bottom-right on all public pages.
 * Uses the configured WhatsApp number from site settings.
 * Styled with the brand's design system — green WhatsApp color with
 * hover states, shadow, and a subtle pulse to draw attention.
 *
 * Z-index: 50 — below cookie banner (z-[10000]) and navbar dropdowns,
 * above regular page content. Safe on mobile (bottom-20 leaves room
 * for cookie banner + no overlap with bottom nav if added later).
 */
export default function WhatsAppFloatingButton({
  whatsappUrl = 'https://wa.me/4915224999190',
}: WhatsAppFloatingButtonProps) {
  const [visible, setVisible] = useState(false);

  /* Delay appearance so it doesn't distract on immediate load */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => {
    analytics.trackWhatsAppClick('floating_button');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="WhatsApp öffnen"
      className={`
        fixed z-50 flex items-center gap-2
        bottom-5 right-5 sm:bottom-6 sm:right-6
        rounded-full shadow-lg shadow-black/20
        bg-[#25D366] text-white
        transition-all duration-300 ease-out
        hover:bg-[#128C7E] hover:shadow-xl hover:shadow-black/25 hover:-translate-y-1
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      style={{ padding: '14px' }}
    >
      {/* WhatsApp SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7 sm:w-8 sm:h-8"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>

      {/* Label — hidden on smallest screens, visible on sm+ */}
      <span className="hidden sm:inline text-sm font-semibold pr-1">
        WhatsApp
      </span>

      {/* Subtle pulse ring */}
      <span
        className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/30"
        aria-hidden="true"
        style={{ animationDuration: '3s', animationIterationCount: '3' }}
      />
    </button>
  );
}
