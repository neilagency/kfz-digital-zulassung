import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { logAudit } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const GTM_ID_REGEX = /^GTM-[A-Z0-9]{4,10}$/;
const GA4_ID_REGEX = /^G-[A-Z0-9]{8,12}$/;

async function requireAdmin(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (token.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return token;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const row = await prisma.trackingSettings.findUnique({
    where: { id: 'default' },
  });

  if (!row) {
    return NextResponse.json({
      gtm_enabled: false,
      gtm_container_id: '',
      ga4_enabled: false,
      ga4_measurement_id: '',
      ga4_send_page_view: true,
      anonymize_ip: true,
      cookie_consent_required: true,
      environments: {},
      updated_at: null,
      updated_by_id: null,
    });
  }

  let environments: Record<string, boolean> = {};
  try {
    environments = JSON.parse(row.environments || '{}');
  } catch {
    environments = {};
  }

  return NextResponse.json({
    gtm_enabled: row.gtmEnabled,
    gtm_container_id: row.gtmContainerId,
    ga4_enabled: row.ga4Enabled,
    ga4_measurement_id: row.ga4MeasurementId,
    ga4_send_page_view: row.ga4SendPageView,
    anonymize_ip: row.anonymizeIp,
    cookie_consent_required: row.cookieConsentRequired,
    environments,
    updated_at: row.updatedAt?.toISOString() || null,
    updated_by_id: row.updatedById,
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));

  // Fetch current record for diff + optimistic locking
  const current = await prisma.trackingSettings.findUnique({
    where: { id: 'default' },
  });

  if (!current) {
    return NextResponse.json({ error: 'Tracking settings not found' }, { status: 404 });
  }

  const payload: Record<string, unknown> = {};

  if (typeof body.gtm_enabled === 'boolean') payload.gtmEnabled = body.gtm_enabled;
  if (typeof body.ga4_enabled === 'boolean') payload.ga4Enabled = body.ga4_enabled;
  if (typeof body.ga4_send_page_view === 'boolean') payload.ga4SendPageView = body.ga4_send_page_view;
  if (typeof body.anonymize_ip === 'boolean') payload.anonymizeIp = body.anonymize_ip;
  if (typeof body.cookie_consent_required === 'boolean') payload.cookieConsentRequired = body.cookie_consent_required;

  if ('gtm_container_id' in body) {
    const id = String(body.gtm_container_id || '').trim().toUpperCase();
    if (id && !GTM_ID_REGEX.test(id)) {
      return NextResponse.json({ error: 'Ungültige GTM Container ID. Format: GTM-XXXXXXX' }, { status: 422 });
    }
    payload.gtmContainerId = id;
  }

  if ('ga4_measurement_id' in body) {
    const id = String(body.ga4_measurement_id || '').trim().toUpperCase();
    if (id && !GA4_ID_REGEX.test(id)) {
      return NextResponse.json({ error: 'Ungültige GA4 Measurement ID. Format: G-XXXXXXXXXX' }, { status: 422 });
    }
    payload.ga4MeasurementId = id;
  }

  if (body.environments && typeof body.environments === 'object') {
    payload.environments = JSON.stringify(body.environments);
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
  }

  // Optimistic locking: if client sent updated_at, verify it matches
  if (body.updated_at && current.updatedAt) {
    const clientTs = new Date(body.updated_at).getTime();
    const serverTs = new Date(current.updatedAt).getTime();
    if (clientTs !== serverTs) {
      return NextResponse.json(
        { error: 'Die Einstellungen wurden zwischenzeitlich von einem anderen Admin geändert. Bitte lade die Seite neu.' },
        { status: 409 }
      );
    }
  }

  payload.updatedById = auth.sub as string;

  const updated = await prisma.trackingSettings.update({
    where: { id: 'default' },
    data: payload as any,
  });

  // Audit log
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip || '';
  await logAudit({
    adminId: auth.sub as string,
    action: 'tracking_settings_update',
    resource: 'tracking_settings',
    diff: { before: current, after: updated },
    ipAddress: ip,
    userAgent: request.headers.get('user-agent') || '',
  });

  // Revalidate caches
  try {
    revalidatePath('/');
    revalidateTag('tracking-config');
  } catch {
    // ignore revalidation errors
  }

  let environments: Record<string, boolean> = {};
  try {
    environments = JSON.parse(updated.environments || '{}');
  } catch {
    environments = {};
  }

  return NextResponse.json({
    success: true,
    data: {
      gtm_enabled: updated.gtmEnabled,
      gtm_container_id: updated.gtmContainerId,
      ga4_enabled: updated.ga4Enabled,
      ga4_measurement_id: updated.ga4MeasurementId,
      ga4_send_page_view: updated.ga4SendPageView,
      anonymize_ip: updated.anonymizeIp,
      cookie_consent_required: updated.cookieConsentRequired,
      environments,
      updated_at: updated.updatedAt?.toISOString() || null,
      updated_by_id: updated.updatedById,
    },
  });
}
