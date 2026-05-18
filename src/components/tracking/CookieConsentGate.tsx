'use client';

import { useState, useEffect } from 'react';

interface CookieConsentGateProps {
  children: React.ReactNode;
  required?: boolean;
  storageKey?: string;
}

/**
 * CookieConsentGate
 *
 * If cookie consent is required, this client component gates children
 * until the user has accepted cookies (stored in localStorage).
 *
 * If not required, children are rendered immediately.
 */
export default function CookieConsentGate({
  children,
  required = true,
  storageKey = 'cookie_consent',
}: CookieConsentGateProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!required) {
      setHasConsent(true);
      setChecked(true);
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.version === 2 && saved.preferences) {
          setHasConsent(!!saved.preferences.analytics || !!saved.preferences.marketing);
        } else if (raw === 'true') {
          // Legacy or simple boolean consent
          setHasConsent(true);
        }
      }
    } catch {
      // ignore parse errors
    }
    setChecked(true);

    // Listen for consent updates from the cookie banner
    const handler = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved && saved.preferences) {
            setHasConsent(!!saved.preferences.analytics || !!saved.preferences.marketing);
          } else if (raw === 'true') {
            setHasConsent(true);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('cookie-consent-updated', handler);
    return () => window.removeEventListener('cookie-consent-updated', handler);
  }, [required, storageKey]);

  if (!checked) return null;

  if (required && !hasConsent) {
    return null;
  }

  return <>{children}</>;
}
