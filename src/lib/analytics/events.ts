/**
 * Analytics Event Tracking Utilities
 *
 * All events are pushed to window.dataLayer and processed by GTM.
 * GTM then forwards them to GA4 (and any other configured tags).
 *
 * Usage:
 *   import { analytics } from '@/lib/analytics';
 *   analytics.trackWhatsAppClick('navbar');
 *
 * GTM configuration required:
 *   - Create a "Custom Event" trigger for each event name below
 *   - Map event parameters to GA4 event parameters in your GA4 tag
 */

/* ── Types ──────────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export interface PurchaseItem {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_category?: string;
}

/* ── Core push helper ───────────────────────────────────────────────────── */

function push(event: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

/* ── Event tracking functions ───────────────────────────────────────────── */

/**
 * Generic button click — use for any clickable element that isn't a CTA,
 * form submit, or specialised action below.
 */
function trackButtonClick(label: string, category?: string, location?: string): void {
  push({
    event: 'button_click',
    button_label: label,
    button_category: category ?? undefined,
    click_location: location ?? undefined,
  });
}

/**
 * CTA click — for primary call-to-action buttons (e.g. "Jetzt abmelden",
 * "Zum Angebot", hero buttons, pricing cards).
 */
function trackCTAClick(label: string, location?: string): void {
  push({
    event: 'cta_click',
    cta_label: label,
    cta_location: location ?? undefined,
  });
}

/**
 * Form submission — fire when a form is successfully submitted (not on
 * validation errors).  Use formId to match up with GTM form triggers.
 */
function trackFormSubmit(formName: string, formId?: string, formLocation?: string): void {
  push({
    event: 'form_submit',
    form_name: formName,
    form_id: formId ?? undefined,
    form_location: formLocation ?? undefined,
  });
}

/**
 * Lead generation — fire whenever a user takes an action that signals intent
 * (e.g. starts checkout, requests a quote, submits contact form).
 */
function trackLeadGeneration(leadType: string, source?: string): void {
  push({
    event: 'generate_lead',
    lead_type: leadType,
    lead_source: source ?? undefined,
  });
}

/**
 * WhatsApp click — fire on any WhatsApp link/button click.
 */
function trackWhatsAppClick(source?: string): void {
  push({
    event: 'whatsapp_click',
    click_source: source ?? undefined,
    contact_method: 'whatsapp',
  });
}

/**
 * Phone click — fire on `tel:` link clicks.
 */
function trackPhoneClick(phoneNumber?: string, source?: string): void {
  push({
    event: 'phone_click',
    phone_number: phoneNumber ?? undefined,
    click_source: source ?? undefined,
    contact_method: 'phone',
  });
}

/**
 * Email click — fire on `mailto:` link clicks.
 */
function trackEmailClick(email?: string, source?: string): void {
  push({
    event: 'email_click',
    email_address: email ?? undefined,
    click_source: source ?? undefined,
    contact_method: 'email',
  });
}

/**
 * Contact action — convenience wrapper for any contact channel.
 * Fires both a specific event (whatsapp_click / phone_click / email_click)
 * AND a unified contact_action event for easy funnel analysis.
 */
function trackContactAction(
  method: 'whatsapp' | 'phone' | 'email',
  source?: string,
  detail?: string,
): void {
  push({
    event: 'contact_action',
    contact_method: method,
    click_source: source ?? undefined,
    contact_detail: detail ?? undefined,
  });
}

/**
 * Outbound link click — fire when navigating away from the site.
 */
function trackOutboundLink(url: string, linkText?: string, source?: string): void {
  push({
    event: 'outbound_link_click',
    link_url: url,
    link_text: linkText ?? undefined,
    click_source: source ?? undefined,
  });
}

/**
 * Newsletter signup — fire on successful newsletter form submission.
 */
function trackNewsletterSignup(source?: string): void {
  push({
    event: 'newsletter_signup',
    signup_source: source ?? undefined,
  });
}

/**
 * Product/service view — fire when a user views a product or service page.
 */
function trackProductView(productName: string, productId?: string, price?: number): void {
  push({
    event: 'view_item',
    ecommerce: {
      currency: 'EUR',
      value: price ?? undefined,
      items: [
        {
          item_id: productId ?? productName,
          item_name: productName,
          price: price ?? undefined,
          quantity: 1,
        },
      ],
    },
  });
}

/**
 * Begin checkout — fire when user starts the order/payment flow.
 */
function trackBeginCheckout(productName: string, productId?: string, value?: number): void {
  push({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'EUR',
      value: value ?? undefined,
      items: [
        {
          item_id: productId ?? productName,
          item_name: productName,
          price: value ?? undefined,
          quantity: 1,
        },
      ],
    },
  });
}

/**
 * Add to cart / add payment info / checkout step events.
 */
function trackAddPaymentInfo(paymentType: string, value?: number): void {
  push({
    event: 'add_payment_info',
    payment_type: paymentType,
    ecommerce: {
      currency: 'EUR',
      value: value ?? undefined,
    },
  });
}

/**
 * Purchase / order complete — fire on the /bestellung-erfolgreich page
 * after successful payment confirmation.
 *
 * @param orderId   - Order/transaction ID (required by GA4 ecommerce)
 * @param value     - Order total in EUR
 * @param items     - Line items (optional but recommended for GA4 ecommerce)
 */
function trackPurchase(orderId: string, value?: number, items?: PurchaseItem[]): void {
  push({
    event: 'purchase',
    ecommerce: {
      transaction_id: orderId,
      value: value ?? undefined,
      currency: 'EUR',
      items: items ?? [],
    },
  });
}

/**
 * Search — fire when user uses an internal search.
 */
function trackSearch(searchTerm: string, resultsCount?: number): void {
  push({
    event: 'search',
    search_term: searchTerm,
    search_results_count: resultsCount ?? undefined,
  });
}

/**
 * Custom event — escape hatch for one-off events not covered above.
 * Use this sparingly; prefer named functions above.
 */
function trackCustomEvent(eventName: string, params?: Record<string, unknown>): void {
  push({
    event: eventName,
    ...params,
  });
}

/* ── Named export ───────────────────────────────────────────────────────── */

export const analytics = {
  trackButtonClick,
  trackCTAClick,
  trackFormSubmit,
  trackLeadGeneration,
  trackWhatsAppClick,
  trackPhoneClick,
  trackEmailClick,
  trackContactAction,
  trackOutboundLink,
  trackNewsletterSignup,
  trackProductView,
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackPurchase,
  trackSearch,
  trackCustomEvent,
};
