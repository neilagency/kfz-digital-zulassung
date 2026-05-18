import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';

const GTM_ID_REGEX = /^GTM-[A-Z0-9]{4,10}$/;
const GA4_ID_REGEX = /^G-[A-Z0-9]{8,12}$/;

function getCurrentEnv(): string {
  const env = (process.env.NODE_ENV as string) || 'development';
  if (env === 'production') return 'production';
  if (env === 'test') return 'staging';
  return 'development';
}

export interface TrackingConfig {
  gtm_id: string | null;
  ga4_id: string | null;
  flags: {
    gtm_enabled: boolean;
    ga4_enabled: boolean;
    ga4_send_page_view: boolean;
    anonymize_ip: boolean;
    cookie_consent_required: boolean;
    environment: string;
  };
}

export const getTrackingConfig = unstable_cache(
  async (): Promise<TrackingConfig> => {
    const row = await prisma.trackingSettings.findUnique({
      where: { id: 'default' },
    });

    if (!row) {
      return {
        gtm_id: null,
        ga4_id: null,
        flags: {
          gtm_enabled: false,
          ga4_enabled: false,
          ga4_send_page_view: true,
          anonymize_ip: true,
          cookie_consent_required: true,
          environment: getCurrentEnv(),
        },
      };
    }

    const env = getCurrentEnv();
    let envOverrides: Record<string, boolean> = {};
    try {
      envOverrides = JSON.parse(row.environments || '{}');
    } catch {
      envOverrides = {};
    }

    const envEnabled = envOverrides[env] ?? (env === 'production');

    const gtmId =
      row.gtmEnabled && envEnabled && GTM_ID_REGEX.test(row.gtmContainerId)
        ? row.gtmContainerId
        : null;

    const ga4Id =
      row.ga4Enabled && envEnabled && GA4_ID_REGEX.test(row.ga4MeasurementId)
        ? row.ga4MeasurementId
        : null;

    return {
      gtm_id: gtmId,
      ga4_id: ga4Id,
      flags: {
        gtm_enabled: !!gtmId,
        ga4_enabled: !!ga4Id,
        ga4_send_page_view: row.ga4SendPageView,
        anonymize_ip: row.anonymizeIp,
        cookie_consent_required: row.cookieConsentRequired,
        environment: env,
      },
    };
  },
  ['tracking-config'],
  { tags: ['tracking-config'], revalidate: 60 }
);
