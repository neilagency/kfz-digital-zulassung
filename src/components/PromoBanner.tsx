'use client';

import { useEffect, useState, useCallback, useRef, memo } from 'react';
import useSWR from 'swr';
import { X, Sparkles } from 'lucide-react';

interface PromoData {
  code: string;
  bannerText: string;
  discountType: string;
  discountValue: number;
  updatedAt: string;
}

const fetcher = (url: string) =>
  fetch(url, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : { promo: null }));

/**
 * Build a dismiss key unique to this version of the promo so
 * re-enabling the same coupon (new updatedAt) resets the dismiss.
 */
function dismissKey(promo: PromoData): string {
  return `promo-dismissed:${promo.code}:${promo.updatedAt}`;
}

function PromoBannerInner() {
  const { data } = useSWR<{ promo: PromoData | null }>(
    '/api/active-promo',
    fetcher,
    {
      refreshInterval: 10_000,     // poll every 10s for near-real-time
      revalidateOnFocus: true,
      dedupingInterval: 5_000,
      revalidateOnReconnect: true,
      errorRetryCount: 2,
    },
  );

  const promo = data?.promo ?? null;
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Reset dismiss state when promo changes (different code or updatedAt)
  useEffect(() => {
    if (!promo) {
      setDismissed(false);
      return;
    }
    try {
      const isDismissed = sessionStorage.getItem(dismissKey(promo)) === '1';
      setDismissed(isDismissed);
    } catch {
      setDismissed(false);
    }
  }, [promo?.code, promo?.updatedAt]);

  // Set CSS variable for navbar offset
  useEffect(() => {
    if (promo && !dismissed) {
      const updateHeight = () => {
        const h = bannerRef.current?.offsetHeight || 0;
        document.documentElement.style.setProperty('--promo-banner-height', `${h}px`);
      };
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => {
        window.removeEventListener('resize', updateHeight);
        document.documentElement.style.setProperty('--promo-banner-height', '0px');
      };
    } else {
      document.documentElement.style.setProperty('--promo-banner-height', '0px');
    }
  }, [promo, dismissed]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    if (promo) {
      try {
        sessionStorage.setItem(dismissKey(promo), '1');
      } catch {}
    }
  }, [promo]);

  const handleCopy = useCallback(async () => {
    if (!promo) return;
    try {
      await navigator.clipboard.writeText(promo.code);
    } catch {
      const input = document.createElement('input');
      input.value = promo.code;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [promo]);

  if (!promo || dismissed) return null;

  const discountLabel =
    promo.discountType === 'percentage'
      ? `${promo.discountValue}%`
      : `${promo.discountValue.toFixed(2).replace('.', ',')} €`;

  const defaultText = `Jetzt ${discountLabel} sparen`;
  const displayText = promo.bannerText?.trim() || defaultText;
  const textLines = displayText.split(/\\n|\n/);

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-accent/90 via-accent to-accent/90 text-dark shadow-sm transition-all duration-300"
    >
      <div
        className="max-w-7xl mx-auto px-10 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center relative"
        dir="auto"
      >
        <Sparkles className="w-5 h-5 flex-shrink-0 hidden sm:block text-dark/70" />
        <span className="font-semibold text-sm sm:text-[15px] leading-snug break-words max-w-[calc(100%-3rem)] sm:max-w-none">
          {textLines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
          {' '}— Code:
        </span>
        <button
          onClick={handleCopy}
          className="bg-dark text-accent hover:bg-dark/90 font-extrabold tracking-widest px-4 py-1 rounded-md text-xs sm:text-sm transition-all shadow-sm flex-shrink-0"
        >
          {copied ? '✓ Kopiert!' : promo.code}
        </button>
        <button
          onClick={handleDismiss}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark transition-colors p-1 rounded-full hover:bg-dark/5"
          aria-label="Banner schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default memo(PromoBannerInner);
