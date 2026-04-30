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
      'Diese Cookies sind für Grundfunktionen der Website erforderlich, zum Beispiel Sicherheit, Warenkorb, Formularfunktionen oder Cookie-Auswahl. Sie können nicht deaktiviert werden.',
    locked: true,
  },
  {
    key: 'analytics' as const,
    label: 'Analyse & Statistik',
    description:
      'Diese Cookies helfen uns zu verstehen, wie Besucher unsere Website nutzen. Dadurch können wir Inhalte, Bedienung und Ladezeiten verbessern.',
    locked: false,
  },
  {
    key: 'marketing' as const,
    label: 'Marketing & Werbung',
    description:
      'Diese Cookies können verwendet werden, um Werbung und Kampagnen besser auszuwerten und relevanter zu gestalten, zum Beispiel über Google Ads oder ähnliche Dienste.',
    locked: false,
  },
  {
    key: 'external_media' as const,
    label: 'Externe Medien',
    description:
      'Diese Einstellung erlaubt das Laden externer Inhalte, zum Beispiel YouTube-Videos oder andere eingebettete Medien.',
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
  const [local, setLocal] = useState<CookiePreferences>({
    ...preferences,
    necessary: true,
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  function saveSelection() {
    onSave({
      ...local,
      necessary: true,
    });
  }

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 p-3 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        aria-describedby="cookie-settings-description"
        className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#0d5581]" />
            <h2 id="cookie-settings-title" className="text-lg font-bold text-gray-900">
              Cookie-Einstellungen
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cookie-Einstellungen schließen"
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 sm:px-6">
          <p id="cookie-settings-description" className="mb-4 text-sm leading-relaxed text-gray-600">
            Hier können Sie auswählen, welche Cookies und Dienste Sie zulassen möchten.
            Notwendige Cookies sind immer aktiv.
          </p>

          {CATEGORIES.map((cat) => {
            const checkboxId = `cookie-${cat.key}`;
            const panelId = `cookie-panel-${cat.key}`;
            const isExpanded = expanded === cat.key;

            return (
              <div key={cat.key} className="overflow-hidden rounded-xl border border-gray-200">
                <div
                  className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50"
                  onClick={() => setExpanded(isExpanded ? null : cat.key)}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <label
                      htmlFor={checkboxId}
                      className="relative inline-flex cursor-pointer items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        id={checkboxId}
                        type="checkbox"
                        aria-label={cat.label}
                        checked={cat.locked ? true : Boolean(local[cat.key])}
                        disabled={cat.locked}
                        onChange={() => {
                          if (!cat.locked) {
                            setLocal((p) => ({
                              ...p,
                              necessary: true,
                              [cat.key]: !p[cat.key],
                            }));
                          }
                        }}
                        className="peer sr-only"
                      />

                      <span
                        className={`relative block h-5 w-10 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-[#0d5581]/30 ${
                          cat.locked
                            ? 'cursor-not-allowed bg-[#0d5581]'
                            : local[cat.key]
                              ? 'bg-[#0d5581]'
                              : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            cat.locked || local[cat.key] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </span>
                    </label>

                    <span className="text-sm font-semibold text-gray-900">{cat.label}</span>

                    {cat.locked && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
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
                    className="ml-2 rounded-lg p-1 transition-colors hover:bg-gray-100"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div
                    id={panelId}
                    className="border-t border-gray-100 px-4 pb-3 pt-2 text-xs leading-relaxed text-gray-500"
                  >
                    {cat.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Abbrechen
          </button>

          <button
            type="button"
            onClick={saveSelection}
            className="flex-1 rounded-xl bg-[#0d5581] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0d5581]/90"
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
        <div className="fixed inset-x-0 bottom-3 z-[10000] px-3 sm:bottom-4 sm:px-4">
          <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-banner-title"
            aria-describedby="cookie-banner-description"
            className="mx-auto max-h-[78vh] max-w-4xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="p-4 sm:p-6">
              <div className="mb-4 flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0d5581]/10">
                  <Cookie className="h-5 w-5 text-[#0d5581]" />
                </div>

                <div className="flex-1">
                  <h3 id="cookie-banner-title" className="mb-1 text-base font-bold text-gray-900">
                    Wir respektieren Ihre Privatsphäre
                  </h3>

                  <p
                    id="cookie-banner-description"
                    className="text-sm leading-relaxed text-gray-600"
                  >
                    Wir verwenden notwendige Cookies für den Betrieb der Website. Mit Ihrer
                    Zustimmung nutzen wir zusätzlich Analyse-, Marketing- und externe Medien-Dienste,
                    um unsere Website zu verbessern und Inhalte wie Videos einzubinden. Details
                    finden Sie in unseren{' '}
                    <Link
                      href="/datenschutzhinweise"
                      className="font-semibold text-[#0d5581] hover:underline"
                    >
                      Datenschutzhinweisen
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="mb-5 flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="h-3.5 w-3.5 text-[#aad137]" />
                  DSGVO-orientiert
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="h-3.5 w-3.5 text-[#aad137]" />
                  Optionale Dienste nur mit Zustimmung
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="h-3.5 w-3.5 text-[#aad137]" />
                  Jederzeit widerrufbar
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={consent.acceptAll}
                  className="flex-1 rounded-xl bg-[#0d5581] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#0d5581]/90 hover:shadow-lg"
                >
                  Alle akzeptieren
                </button>

                <button
                  type="button"
                  onClick={consent.rejectAll}
                  className="flex-1 rounded-xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Nur notwendige
                </button>

                <button
                  type="button"
                  onClick={consent.openSettings}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0d5581]/30 px-6 py-3 text-sm font-semibold text-[#0d5581] transition-colors hover:bg-[#0d5581]/5"
                >
                  <Settings className="h-4 w-4" />
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
