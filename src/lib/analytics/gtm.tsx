import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Inline synchronous script injected into <head> BEFORE GTM loads.
 *
 * Responsibilities:
 * 1. Initialises window.dataLayer
 * 2. Sets Google Consent Mode v2 defaults (all denied) — this must happen
 *    before the GTM script evaluates so that GTM respects the defaults.
 * 3. Enables Consent Mode Basic via url_passthrough + ads_data_redaction
 *    so anonymised measurement continues even without explicit consent.
 * 4. For returning visitors: immediately reads localStorage and upgrades
 *    consent to their saved preferences so no analytics hits are blocked
 *    on page load.
 *
 * STORAGE_KEY and CONSENT_VERSION must stay in sync with
 * src/lib/cookie-consent.tsx (currently 'cookie_consent' / 2).
 */
export function GTMConsentInit() {
  return (
    <script
      id="gtm-consent-init"
      dangerouslySetInnerHTML={{
        __html: `
(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;

  /* --- Consent Mode v2: deny everything by default --- */
  /* wait_for_update:2000 gives the cookie banner enough time to show */
  /* and restore saved preferences before GTM fires any tags.        */
  gtag('consent','default',{
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied',
    analytics_storage:'denied',
    functionality_storage:'granted',
    personalization_storage:'denied',
    security_storage:'granted',
    wait_for_update:2000
  });

  /* --- Consent Mode Basic: allow anonymised measurement without consent --- */
  gtag('set',{
    url_passthrough:true,
    ads_data_redaction:true
  });

  /* --- Returning visitor: restore saved consent instantly --- */
  try {
    var raw = localStorage.getItem('cookie_consent');
    if(raw){
      var saved = JSON.parse(raw);
      if(saved && saved.version===2 && saved.preferences && saved.timestamp){
        var age = Date.now() - saved.timestamp;
        if(age < 1000*60*60*24*180){
          var p = saved.preferences;
          gtag('consent','update',{
            ad_storage: p.marketing ? 'granted':'denied',
            ad_user_data: p.marketing ? 'granted':'denied',
            ad_personalization: p.marketing ? 'granted':'denied',
            analytics_storage: p.analytics ? 'granted':'denied',
            functionality_storage:'granted',
            personalization_storage: p.external_media ? 'granted':'denied',
            security_storage:'granted'
          });
        }
      }
    }
  }catch(e){}
})();
        `.trim(),
      }}
    />
  );
}

/**
 * GTM loader script — loaded via next/script afterInteractive using the
 * direct src attribute (more reliable than dangerouslySetInnerHTML in
 * Next.js App Router).
 * Renders nothing if NEXT_PUBLIC_GTM_ID is not set (safe for local dev).
 */
export function GTMScript() {
  if (!GTM_ID) return null;
  return (
    <Script
      id="gtm-script"
      src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
      strategy="afterInteractive"
    />
  );
}

/**
 * GTM <noscript> iframe fallback — must be placed as close to the opening
 * <body> tag as possible.  Renders nothing when GTM_ID is not configured.
 */
export function GTMNoscript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
