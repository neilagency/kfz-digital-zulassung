'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

/* ── Cookie categories ─────────────────────────── */
export type CookieCategory =
  | 'necessary'
  | 'analytics'
  | 'marketing'
  | 'external_media';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  external_media: boolean;
}

export type ConsentStatus = 'pending' | 'accepted_all' | 'rejected_all' | 'custom';

export interface CookieConsentState {
  status: ConsentStatus;
  preferences: CookiePreferences;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  acceptSelected: (prefs: Partial<CookiePreferences>) => void;
  openSettings: () => void;
  closeSettings: () => void;
  reopenBanner: () => void;
  resetConsent: () => void;
  hasConsent: (category: CookieCategory) => boolean;
}

type StoredConsent = {
  version: number;
  status: ConsentStatus;
  preferences: Partial<CookiePreferences>;
  timestamp: number;
};

const STORAGE_KEY = 'cookie_consent';
const CONSENT_VERSION = 2;

/*
  180 Tage sind sauberer als "für immer".
  Danach wird der Banner erneut angezeigt.
*/
const CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180;

const DEFAULT_PREFS: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  external_media: false,
};

const ALL_ACCEPTED: CookiePreferences = {
  necessary: true,
  analytics: true,
  marketing: true,
  external_media: true,
};

/* ── Helpers ───────────────────────────────────── */
function normalizePreferences(prefs?: Partial<CookiePreferences>): CookiePreferences {
  return {
    ...DEFAULT_PREFS,
    ...(prefs || {}),
    necessary: true,
  };
}

function safeGetStorage(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function safeSetStorage(data: StoredConsent): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /*
      Wenn localStorage blockiert ist, soll die Seite trotzdem laufen.
      Dann wird die Auswahl nur für die aktuelle Session im State gehalten.
    */
  }
}

function safeRemoveStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function isValidStoredConsent(saved: unknown): saved is StoredConsent {
  if (!saved || typeof saved !== 'object') return false;

  const item = saved as Partial<StoredConsent>;

  if (item.version !== CONSENT_VERSION) return false;
  if (!item.preferences || typeof item.preferences !== 'object') return false;
  if (!item.timestamp || typeof item.timestamp !== 'number') return false;

  const allowedStatus: ConsentStatus[] = ['pending', 'accepted_all', 'rejected_all', 'custom'];
  if (!item.status || !allowedStatus.includes(item.status)) return false;

  const age = Date.now() - item.timestamp;
  if (age > CONSENT_MAX_AGE_MS) return false;

  return true;
}

/* ── Google Consent Mode v2 helpers ────────────── */
function getGtag() {
  if (typeof window === 'undefined') return null;

  const w = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  w.dataLayer = w.dataLayer || [];

  if (typeof w.gtag === 'function') {
    return w.gtag;
  }

  const gtag = (...args: unknown[]) => {
    w.dataLayer?.push(args);
  };

  w.gtag = gtag;

  return gtag;
}

function pushConsentDefault() {
  const gtag = getGtag();
  if (!gtag) return;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500,
  });
}

function pushConsentUpdate(prefs: CookiePreferences) {
  const gtag = getGtag();
  if (!gtag) return;

  gtag('consent', 'update', {
    ad_storage: prefs.marketing ? 'granted' : 'denied',
    ad_user_data: prefs.marketing ? 'granted' : 'denied',
    ad_personalization: prefs.marketing ? 'granted' : 'denied',
    analytics_storage: prefs.analytics ? 'granted' : 'denied',
    functionality_storage: 'granted',
    personalization_storage: prefs.external_media ? 'granted' : 'denied',
    security_storage: 'granted',
  });
}

function dispatchConsentEvent(prefs: CookiePreferences, status: ConsentStatus) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent('cookie-consent-updated', {
      detail: {
        status,
        preferences: prefs,
      },
    }),
  );
}

/* ── Context ───────────────────────────────────── */
const CookieConsentContext = createContext<CookieConsentState | null>(null);

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);

  if (!ctx) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }

  return ctx;
}

/* ── Provider ──────────────────────────────────── */
export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFS);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    pushConsentDefault();

    const raw = safeGetStorage();

    if (raw) {
      try {
        const saved = JSON.parse(raw);

        if (isValidStoredConsent(saved)) {
          const normalizedPrefs = normalizePreferences(saved.preferences);

          setPreferences(normalizedPrefs);
          setStatus(saved.status);
          setShowBanner(false);
          setShowSettings(false);

          pushConsentUpdate(normalizedPrefs);
          dispatchConsentEvent(normalizedPrefs, saved.status);

          return;
        }

        safeRemoveStorage();
      } catch {
        safeRemoveStorage();
      }
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const show = () => setShowBanner(true);

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(show, { timeout: 1200 });
    } else if (typeof window !== 'undefined') {
      timeoutId = setTimeout(show, 800);
    }

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      if (
        idleId !== null &&
        typeof window !== 'undefined' &&
        'cancelIdleCallback' in window
      ) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  const saveConsent = useCallback((prefs: CookiePreferences, newStatus: ConsentStatus) => {
    const normalizedPrefs = normalizePreferences(prefs);

    const data: StoredConsent = {
      version: CONSENT_VERSION,
      status: newStatus,
      preferences: normalizedPrefs,
      timestamp: Date.now(),
    };

    safeSetStorage(data);

    setPreferences(normalizedPrefs);
    setStatus(newStatus);
    setShowBanner(false);
    setShowSettings(false);

    pushConsentUpdate(normalizedPrefs);
    dispatchConsentEvent(normalizedPrefs, newStatus);
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent(ALL_ACCEPTED, 'accepted_all');
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    saveConsent(DEFAULT_PREFS, 'rejected_all');
  }, [saveConsent]);

  const acceptSelected = useCallback(
    (partial: Partial<CookiePreferences>) => {
      const merged = normalizePreferences(partial);
      saveConsent(merged, 'custom');
    },
    [saveConsent],
  );

  const hasConsent = useCallback(
    (cat: CookieCategory) => {
      if (cat === 'necessary') return true;
      return preferences[cat] === true;
    },
    [preferences],
  );

  const openSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const closeSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const reopenBanner = useCallback(() => {
    setShowBanner(true);
    setShowSettings(false);
  }, []);

  const resetConsent = useCallback(() => {
    safeRemoveStorage();

    setStatus('pending');
    setPreferences(DEFAULT_PREFS);
    setShowBanner(true);
    setShowSettings(false);

    pushConsentDefault();
    dispatchConsentEvent(DEFAULT_PREFS, 'pending');
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        status,
        preferences,
        showBanner,
        showSettings,
        acceptAll,
        rejectAll,
        acceptSelected,
        openSettings,
        closeSettings,
        reopenBanner,
        resetConsent,
        hasConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}
