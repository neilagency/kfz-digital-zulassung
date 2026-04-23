# Cookie Consent Banner & System — Full Technical Report

> **Purpose:** This document describes the complete cookie consent system so another developer can replicate it exactly.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [File Structure](#file-structure)
4. [Cookie Categories](#cookie-categories)
5. [Data Storage](#data-storage)
6. [Google Consent Mode v2 Integration](#google-consent-mode-v2-integration)
7. [Component 1: CookieConsentProvider (Context)](#component-1-cookieconsentprovider)
8. [Component 2: CookieBanner (UI)](#component-2-cookiebanner)
9. [Component 3: ConsentYouTube (Consent-Gated Embed)](#component-3-consentyoutube)
10. [Component 4: ConditionalLayout (Integration)](#component-4-conditionallayout)
11. [UI/UX Design Spec](#uiux-design-spec)
12. [GDPR Compliance Checklist](#gdpr-compliance-checklist)
13. [Full Source Code](#full-source-code)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  RootLayout (src/app/layout.tsx)                    │
│  └── ConditionalLayout                              │
│       └── CookieConsentProvider  ← React Context    │
│            ├── Navbar                               │
│            ├── Page Content                         │
│            ├── Footer                               │
│            └── CookieBanner (lazy, SSR: false)      │
│                 └── SettingsPanel (modal)            │
└─────────────────────────────────────────────────────┘

Data flow:
  localStorage ("cookie_consent")
       ↕
  CookieConsentProvider (React Context)
       ↕
  CookieBanner UI  ←→  User actions (accept/reject/customize)
       ↕
  Google Consent Mode v2 (window.dataLayer → gtag)
       ↕
  ConsentYouTube / any consent-gated component
```

**Key principle:** No tracking scripts fire until the user gives explicit consent. Google Consent Mode v2 is set to "denied" by default on page load, then updated when user interacts.

---

## Technology Stack

| Item | Technology |
|------|-----------|
| Framework | Next.js 14 (App Router, `'use client'`) |
| UI Styling | Tailwind CSS 3.4 |
| Icons | `lucide-react` (Shield, Settings, Cookie, ChevronDown, ChevronUp, X, Play) |
| State Management | React Context API (`createContext` / `useContext`) |
| Storage | `localStorage` (no external cookie library) |
| Analytics Consent | Google Consent Mode v2 via `window.dataLayer` + `gtag()` |
| Loading | `next/dynamic` with `ssr: false` (lazy loaded) |

**No external cookie libraries needed** (no `js-cookie`, `nookies`, `cookies-next`, etc.)

---

## File Structure

```
src/
├── lib/
│   └── cookie-consent.tsx        ← Context Provider + Logic + Google Consent Mode
├── components/
│   ├── CookieBanner.tsx          ← Banner UI + Settings Modal
│   ├── ConsentYouTube.tsx        ← YouTube embed with consent gate
│   └── ConditionalLayout.tsx     ← Wraps app with CookieConsentProvider
```

---

## Cookie Categories

| Category | Key | German Label | Description (DE) | Always On? | Google Consent Mapping |
|----------|-----|-------------|-------------------|------------|----------------------|
| Necessary | `necessary` | Notwendig | Grundfunktionen der Website | ✅ Yes (cannot disable) | `functionality_storage: granted`, `security_storage: granted` |
| Analytics | `analytics` | Analyse & Statistik | Google Analytics tracking | ❌ No | `analytics_storage` |
| Marketing | `marketing` | Marketing & Werbung | Google Ads, Facebook Pixel | ❌ No | `ad_storage`, `ad_user_data`, `ad_personalization` |
| External Media | `external_media` | Externe Medien | YouTube, Google Maps embeds | ❌ No | `personalization_storage` |

---

## Data Storage

**Storage mechanism:** `localStorage`  
**Storage key:** `cookie_consent`  
**Consent version:** `1` (bump to invalidate old consents)

### Stored JSON Structure

```json
{
  "version": 1,
  "status": "accepted_all",
  "preferences": {
    "necessary": true,
    "analytics": true,
    "marketing": true,
    "external_media": true
  },
  "timestamp": 1712275200000
}
```

### Possible `status` values

| Status | Meaning |
|--------|---------|
| `pending` | User hasn't interacted yet |
| `accepted_all` | User clicked "Alle akzeptieren" |
| `rejected_all` | User clicked "Nur notwendige" |
| `custom` | User customized preferences via settings modal |

### Behavior on Page Load

1. Push Google Consent Mode **default** (all denied except functionality/security)
2. Check `localStorage` for saved consent
3. If found & version matches → restore preferences & push consent **update** to Google
4. If not found → show banner after idle (via `requestIdleCallback` with 1200ms timeout, or `setTimeout` 800ms fallback)

---

## Google Consent Mode v2 Integration

### Default State (fires immediately on load, BEFORE user decision)

```javascript
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
```

### Update State (fires after user makes a choice)

```javascript
gtag('consent', 'update', {
  ad_storage:           prefs.marketing ? 'granted' : 'denied',
  ad_user_data:         prefs.marketing ? 'granted' : 'denied',
  ad_personalization:   prefs.marketing ? 'granted' : 'denied',
  analytics_storage:    prefs.analytics ? 'granted' : 'denied',
  personalization_storage: prefs.external_media ? 'granted' : 'denied',
});
```

The `gtag` function pushes to `window.dataLayer`, which Google Tag Manager / Google Analytics reads.

---

## Component 1: CookieConsentProvider

**File:** `src/lib/cookie-consent.tsx`

### Exported Types

```typescript
type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'external_media';

interface CookiePreferences {
  necessary: boolean;     // always true
  analytics: boolean;
  marketing: boolean;
  external_media: boolean;
}

type ConsentStatus = 'pending' | 'accepted_all' | 'rejected_all' | 'custom';
```

### Exported Context API

```typescript
interface CookieConsentState {
  status: ConsentStatus;
  preferences: CookiePreferences;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;           // Accept all categories
  rejectAll: () => void;           // Only necessary cookies
  acceptSelected: (prefs: Partial<CookiePreferences>) => void;  // Custom selection
  openSettings: () => void;        // Show settings modal
  closeSettings: () => void;       // Hide settings modal
  reopenBanner: () => void;        // Re-show banner (e.g. from footer link)
  hasConsent: (category: CookieCategory) => boolean;  // Check specific category
}
```

### Hook

```typescript
// Use inside any component wrapped by CookieConsentProvider
const { hasConsent, acceptAll, rejectAll, ... } = useCookieConsent();
```

---

## Component 2: CookieBanner

**File:** `src/components/CookieBanner.tsx`

### Banner (bottom of screen)

- Shows when `showBanner === true` and `showSettings === false`
- Fixed position at bottom (`z-index: 10000`)
- Contains:
  - Cookie icon + heading "Wir respektieren Ihre Privatsphäre"
  - Description text with link to `/datenschutzhinweise` (privacy policy page)
  - Three trust badges: "DSGVO-konform", "Keine Weitergabe an Dritte", "Jederzeit widerrufbar"
  - Three buttons:
    1. **"Alle akzeptieren"** — primary blue button → `acceptAll()`
    2. **"Nur notwendige"** — gray button → `rejectAll()`
    3. **"Einstellungen"** — outlined button with gear icon → `openSettings()`

### Settings Modal (overlay)

- Shows when `showSettings === true`
- Full-screen overlay with `z-index: 10001` (above banner)
- Semi-transparent backdrop `bg-black/60`
- Contains:
  - Title "Cookie-Einstellungen" with Settings icon
  - Close button (X icon)
  - Description text
  - Accordion-style category list with custom toggle switches
  - Each category has: toggle, label, "Immer aktiv" badge (if locked), expand/collapse arrow
  - Expanded state shows category description
  - Two buttons: "Abbrechen" (cancel) and "Auswahl speichern" (save selection)

### Loading Strategy

```typescript
// In ConditionalLayout.tsx — lazy loaded, no SSR
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), {
  ssr: false,
});
```

---

## Component 3: ConsentYouTube

**File:** `src/components/ConsentYouTube.tsx`

A consent-gated YouTube embed wrapper:

- **If `external_media` consent granted:** Renders a standard YouTube iframe using `youtube-nocookie.com` domain
- **If NOT consented:** Shows a blurred thumbnail placeholder with:
  - Play icon
  - Message: "Externer Inhalt – YouTube"
  - Explanation: "Dieses Video wird von YouTube bereitgestellt. Beim Laden werden Daten an YouTube übertragen."
  - Button: "Video laden & Cookies akzeptieren" → calls `acceptSelected({ ...preferences, external_media: true })`

### Usage

```tsx
<ConsentYouTube videoId="dQw4w9WgXcQ" title="My Video" />
```

---

## Component 4: ConditionalLayout

**File:** `src/components/ConditionalLayout.tsx`

Wraps the entire public-facing site:

```
CustomerAuthProvider
  └── CookieConsentProvider       ← consent context available to entire site
       ├── PromoBanner
       ├── Navbar
       ├── {children}             ← page content
       ├── {footer}
       ├── WhatsApp button
       └── CookieBanner           ← lazy loaded at bottom
```

**Important:** Admin routes (`/admin/*`) are excluded — they render without the cookie consent system.

---

## UI/UX Design Spec

### Color Palette

| Element | Color |
|---------|-------|
| Primary (buttons, links, toggles) | `#0d5581` (dark blue) |
| Primary hover | `#0d5581` at 90% opacity |
| Trust badge icons | `#aad137` (lime green) |
| Banner background | `white` |
| Modal overlay | `black` at 60% opacity |
| "Reject" button | `gray-100` background, `gray-700` text |
| "Settings" button | `#0d5581` border at 30% opacity |

### Z-Index Layering

| Element | z-index |
|---------|---------|
| Cookie Banner | `10000` |
| Settings Modal | `10001` |
| WhatsApp button | `50` |

### Responsive Behavior

- Banner buttons: `flex-col` on mobile, `flex-row` on `sm:` screens
- Settings modal: `max-w-lg` with `max-h-[85vh]` and internal scroll
- Banner container: `max-w-4xl mx-auto` with `p-4` padding

### Animations

- Banner: `animate-in slide-in-from-bottom duration-500`
- Settings modal: `animate-in fade-in slide-in-from-bottom-4 duration-300`

### Icons Used (from `lucide-react`)

| Icon | Where |
|------|-------|
| `Cookie` | Banner heading, ConsentYouTube button |
| `Shield` | Trust badges (×3) |
| `Settings` | "Einstellungen" button, Settings modal header |
| `X` | Settings modal close button |
| `ChevronDown` | Category accordion (collapsed) |
| `ChevronUp` | Category accordion (expanded) |
| `Play` | ConsentYouTube placeholder |

### Toggle Switch (Custom CSS, no library)

```
Width: w-10 (2.5rem)
Height: h-5 (1.25rem)
Knob: w-4 h-4 white circle with shadow
Active: bg-[#0d5581], knob translated 1.25rem right
Inactive: bg-gray-300, knob at left
Disabled (locked): bg-[#0d5581], cursor-not-allowed
Focus ring: ring-2 ring-[#0d5581]/30
```

### Accessibility

- `role="dialog"` and `aria-modal="true"` on settings modal
- `aria-labelledby` connecting to modal title
- `aria-label` on close button
- `aria-expanded` / `aria-controls` on accordion toggles
- `sr-only` class on checkbox inputs (visually hidden, accessible)
- All interactive elements are `<button>` with proper `type="button"`

---

## GDPR Compliance Checklist

| Requirement | Status |
|-------------|--------|
| Explicit consent before tracking | ✅ All tracking denied by default |
| "Reject All" option equally prominent | ✅ Same row as "Accept All" |
| Granular category control | ✅ 4 categories with individual toggles |
| Necessary cookies cannot be disabled | ✅ Locked toggle with "Immer aktiv" badge |
| Link to privacy policy | ✅ Links to `/datenschutzhinweise` |
| Consent is revocable | ✅ `reopenBanner()` method available |
| Consent is persisted | ✅ localStorage with version + timestamp |
| Google Consent Mode v2 | ✅ Default denied, update on consent |
| No cookies before consent | ✅ Only localStorage used, no HTTP cookies set |
| German language UI | ✅ All text in German |
| Trust indicators | ✅ "DSGVO-konform", "Keine Weitergabe an Dritte", "Jederzeit widerrufbar" |

---

## Full Source Code

### File 1: `src/lib/cookie-consent.tsx`

```tsx
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
  hasConsent: (category: CookieCategory) => boolean;
}

const STORAGE_KEY = 'cookie_consent';
const CONSENT_VERSION = 1;

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

/* ── Google Consent Mode v2 helpers ────────────── */
function pushConsentDefault() {
  if (typeof window === 'undefined') return;

  const w = window as any;
  w.dataLayer = w.dataLayer || [];

  function gtag(...args: any[]) {
    w.dataLayer.push(args);
  }

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
  if (typeof window === 'undefined') return;

  const w = window as any;
  w.dataLayer = w.dataLayer || [];

  function gtag(...args: any[]) {
    w.dataLayer.push(args);
  }

  gtag('consent', 'update', {
    ad_storage: prefs.marketing ? 'granted' : 'denied',
    ad_user_data: prefs.marketing ? 'granted' : 'denied',
    ad_personalization: prefs.marketing ? 'granted' : 'denied',
    analytics_storage: prefs.analytics ? 'granted' : 'denied',
    personalization_storage: prefs.external_media ? 'granted' : 'denied',
  });
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

    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const saved = JSON.parse(raw);

        if (saved.version === CONSENT_VERSION && saved.preferences) {
          const normalizedPrefs: CookiePreferences = {
            ...DEFAULT_PREFS,
            ...saved.preferences,
            necessary: true,
          };

          setPreferences(normalizedPrefs);
          setStatus(saved.status || 'custom');
          pushConsentUpdate(normalizedPrefs);
          return;
        }
      }
    } catch {}

    let timeoutId: any = null;

    const show = () => setShowBanner(true);

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(show, { timeout: 1200 });
    } else if (typeof window !== 'undefined') {
      timeoutId = setTimeout(show, 800);
    }

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const saveConsent = useCallback(
    (prefs: CookiePreferences, newStatus: ConsentStatus) => {
      const normalizedPrefs: CookiePreferences = {
        ...DEFAULT_PREFS,
        ...prefs,
        necessary: true,
      };

      const data = {
        version: CONSENT_VERSION,
        status: newStatus,
        preferences: normalizedPrefs,
        timestamp: Date.now(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setPreferences(normalizedPrefs);
      setStatus(newStatus);
      setShowBanner(false);
      setShowSettings(false);
      pushConsentUpdate(normalizedPrefs);
    },
    []
  );

  const acceptAll = useCallback(() => {
    saveConsent(ALL_ACCEPTED, 'accepted_all');
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    saveConsent(DEFAULT_PREFS, 'rejected_all');
  }, [saveConsent]);

  const acceptSelected = useCallback(
    (partial: Partial<CookiePreferences>) => {
      const merged: CookiePreferences = {
        ...DEFAULT_PREFS,
        ...partial,
        necessary: true,
      };
      saveConsent(merged, 'custom');
    },
    [saveConsent]
  );

  const hasConsent = useCallback(
    (cat: CookieCategory) => {
      if (cat === 'necessary') return true;
      return preferences[cat] === true;
    },
    [preferences]
  );

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
        openSettings: () => setShowSettings(true),
        closeSettings: () => setShowSettings(false),
        reopenBanner: () => setShowBanner(true),
        hasConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}
```

---

### File 2: `src/components/CookieBanner.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useCookieConsent, type CookiePreferences } from '@/lib/cookie-consent';
import { Shield, Settings, Cookie, ChevronDown, ChevronUp, X } from 'lucide-react';
import Link from 'next/link';

/* ── Category definitions ─────────────────────── */
const CATEGORIES = [
  {
    key: 'necessary' as const,
    label: 'Notwendig',
    description:
      'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
    locked: true,
  },
  {
    key: 'analytics' as const,
    label: 'Analyse & Statistik',
    description:
      'Helfen uns zu verstehen, wie Besucher unsere Website nutzen (z.B. Google Analytics).',
    locked: false,
  },
  {
    key: 'marketing' as const,
    label: 'Marketing & Werbung',
    description:
      'Werden verwendet, um Besuchern relevante Werbung anzuzeigen (z.B. Google Ads, Facebook Pixel).',
    locked: false,
  },
  {
    key: 'external_media' as const,
    label: 'Externe Medien',
    description:
      'Erlaubt das Laden externer Inhalte wie YouTube-Videos, Google Maps und ähnlicher Dienste.',
    locked: false,
  },
];

/* ── Settings Panel ───────────────────────────── */
function SettingsPanel({
  onSave,
  onClose,
}: {
  onSave: (prefs: Partial<CookiePreferences>) => void;
  onClose: () => void;
}) {
  const { preferences } = useCookieConsent();
  const [local, setLocal] = useState<CookiePreferences>({ ...preferences });
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0d5581]" />
            <h2 id="cookie-settings-title" className="text-lg font-bold text-gray-900">
              Cookie-Einstellungen
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cookie-Einstellungen schließen"
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Hier können Sie auswählen, welche Arten von Cookies Sie zulassen möchten.
            Notwendige Cookies sind immer aktiv.
          </p>

          {CATEGORIES.map((cat) => {
            const checkboxId = `cookie-${cat.key}`;
            const panelId = `cookie-panel-${cat.key}`;
            const isExpanded = expanded === cat.key;

            return (
              <div key={cat.key} className="border border-gray-200 rounded-xl overflow-hidden">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : cat.key)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <label
                      htmlFor={checkboxId}
                      className="relative inline-flex items-center cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        id={checkboxId}
                        type="checkbox"
                        aria-label={cat.label}
                        checked={local[cat.key]}
                        disabled={cat.locked}
                        onChange={() => {
                          if (!cat.locked) {
                            setLocal((p) => ({ ...p, [cat.key]: !p[cat.key] }));
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-10 h-5 rounded-full peer-focus:ring-2 peer-focus:ring-[#0d5581]/30 transition-colors ${
                          cat.locked
                            ? 'bg-[#0d5581] cursor-not-allowed'
                            : local[cat.key]
                            ? 'bg-[#0d5581]'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            local[cat.key] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </label>

                    <span className="font-medium text-sm text-gray-900">{cat.label}</span>

                    {cat.locked && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Immer aktiv
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label={
                      isExpanded
                        ? `${cat.label} Beschreibung ausblenden`
                        : `${cat.label} Beschreibung anzeigen`
                    }
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(isExpanded ? null : cat.key);
                    }}
                    className="ml-2 p-1"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div
                    id={panelId}
                    className="px-4 pb-3 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-2"
                  >
                    {cat.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>

          <button
            type="button"
            onClick={() => onSave(local)}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#0d5581] rounded-xl hover:bg-[#0d5581]/90 transition-colors"
          >
            Auswahl speichern
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Banner ──────────────────────────────── */
export default function CookieBanner() {
  const consent = useCookieConsent();

  return (
    <>
      {consent.showSettings && (
        <SettingsPanel
          onSave={(prefs) => consent.acceptSelected(prefs)}
          onClose={consent.closeSettings}
        />
      )}

      {consent.showBanner && !consent.showSettings && (
        <div className="fixed bottom-0 inset-x-0 z-[10000] p-4 animate-in slide-in-from-bottom duration-500">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-[#0d5581]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-[#0d5581]" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Wir respektieren Ihre Privatsphäre
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website
                    zu bieten. Einige Cookies sind technisch notwendig, andere helfen uns, die
                    Website zu verbessern oder personalisierte Inhalte anzuzeigen.{' '}
                    <Link
                      href="/datenschutzhinweise"
                      className="text-[#0d5581] hover:underline font-medium"
                    >
                      Datenschutzerklärung
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5 text-[#aad137]" />
                  DSGVO-konform
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5 text-[#aad137]" />
                  Keine Weitergabe an Dritte
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5 text-[#aad137]" />
                  Jederzeit widerrufbar
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={consent.acceptAll}
                  className="flex-1 px-6 py-3 text-sm font-bold text-white bg-[#0d5581] rounded-xl hover:bg-[#0d5581]/90 transition-all hover:shadow-lg"
                >
                  Alle akzeptieren
                </button>

                <button
                  type="button"
                  onClick={consent.rejectAll}
                  className="flex-1 px-6 py-3 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Nur notwendige
                </button>

                <button
                  type="button"
                  onClick={consent.openSettings}
                  className="flex-1 px-6 py-3 text-sm font-medium text-[#0d5581] border border-[#0d5581]/30 rounded-xl hover:bg-[#0d5581]/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Einstellungen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

---

### File 3: `src/components/ConsentYouTube.tsx`

```tsx
'use client';

import { useCookieConsent } from '@/lib/cookie-consent';
import { Play, Cookie } from 'lucide-react';

interface ConsentYouTubeProps {
  videoId: string;
  title?: string;
  className?: string;
}

export default function ConsentYouTube({ videoId, title = 'YouTube Video', className = '' }: ConsentYouTubeProps) {
  const { hasConsent, acceptSelected, preferences } = useCookieConsent();

  if (hasConsent('external_media')) {
    return (
      <div className={`relative w-full aspect-video rounded-xl overflow-hidden ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center ${className}`}>
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover blur-lg opacity-30"
        loading="lazy"
      />
      <div className="relative z-10 text-center px-6">
        <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
          <Play className="w-8 h-8 text-white" />
        </div>
        <p className="text-white font-bold text-sm mb-2">
          Externer Inhalt – YouTube
        </p>
        <p className="text-white/70 text-xs mb-4 max-w-sm mx-auto">
          Dieses Video wird von YouTube bereitgestellt. Beim Laden werden Daten an YouTube übertragen.
        </p>
        <button
          onClick={() => acceptSelected({ ...preferences, external_media: true })}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Cookie className="w-4 h-4" />
          Video laden & Cookies akzeptieren
        </button>
      </div>
    </div>
  );
}
```

---

## How to Integrate in Another Project

### Step-by-step:

1. **Install dependencies:**
   ```bash
   npm install lucide-react
   ```

2. **Copy the 3 core files** into your project:
   - `src/lib/cookie-consent.tsx`
   - `src/components/CookieBanner.tsx`
   - `src/components/ConsentYouTube.tsx` (optional, for YouTube embeds)

3. **Wrap your app** with `CookieConsentProvider` in your layout:
   ```tsx
   import { CookieConsentProvider } from '@/lib/cookie-consent';
   import CookieBanner from '@/components/CookieBanner';

   export default function Layout({ children }) {
     return (
       <CookieConsentProvider>
         {children}
         <CookieBanner />
       </CookieConsentProvider>
     );
   }
   ```

4. **Use `hasConsent()` anywhere** to conditionally load tracking:
   ```tsx
   const { hasConsent } = useCookieConsent();
   
   if (hasConsent('analytics')) {
     // Load Google Analytics
   }
   if (hasConsent('marketing')) {
     // Load Facebook Pixel
   }
   ```

5. **Add a "Cookie Settings" link** in your footer (optional):
   ```tsx
   const { reopenBanner } = useCookieConsent();
   
   <button onClick={reopenBanner}>Cookie-Einstellungen</button>
   ```

6. **Update the privacy policy link** in CookieBanner.tsx to match your site's privacy page URL.

7. **Ensure Tailwind CSS animations** are configured:
   - The `animate-in`, `slide-in-from-bottom`, `fade-in` classes require `tailwindcss-animate` plugin or equivalent keyframes.

---

*Generated on April 13, 2026*
