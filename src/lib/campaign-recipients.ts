/**
 * Shared helpers for resolving campaign recipients based on targeting mode.
 */
import prisma from '@/lib/prisma';
import crypto from 'crypto';

/**
 * Basic email format validation.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Parse emails from a string that may use commas, newlines, or semicolons as separators.
 * Returns deduplicated, trimmed, lowercased, valid emails.
 */
function parseEmails(raw: string): string[] {
  const emails = raw
    .split(/[,;\n\r]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .filter(isValidEmail);

  return [...new Set(emails)];
}

/**
 * Resolve recipients for a campaign based on targetMode.
 * For 'specific' mode: supports both DB customers AND external emails.
 * Also ensures each customer has an unsubscribe token.
 */
export async function resolveRecipients(campaign: {
  targetMode: string;
  targetEmails: string;
  targetSegment: string;
}): Promise<{ email: string; unsubscribeToken: string }[]> {
  // --- Specific emails (custom recipients) ---
  if (campaign.targetMode === 'specific') {
    const emails = parseEmails(campaign.targetEmails);
    if (emails.length === 0) return [];

    // Find which emails exist in DB
    const customers = await prisma.customer.findMany({
      where: { email: { in: emails } },
      select: { id: true, email: true, unsubscribeToken: true },
    });

    const customerMap = new Map<string, { id: string; email: string; unsubscribeToken: string | null }>();
    for (const c of customers) {
      customerMap.set(c.email.toLowerCase(), c);
    }

    const recipients: { email: string; unsubscribeToken: string }[] = [];

    for (const email of emails) {
      const customer = customerMap.get(email);
      if (customer) {
        // DB customer — ensure they have an unsubscribe token
        let token = customer.unsubscribeToken;
        if (!token) {
          token = crypto.randomUUID();
          await prisma.customer.update({
            where: { id: customer.id },
            data: { unsubscribeToken: token },
          });
        }
        recipients.push({ email: customer.email, unsubscribeToken: token });
      } else {
        // External email — generate a one-time token (not stored in DB)
        const token = crypto.randomUUID();
        recipients.push({ email, unsubscribeToken: token });
      }
    }

    return recipients;
  }

  // --- Segment or All modes (DB-only) ---
  let whereClause: Record<string, unknown> = {
    email: { not: '' },
    emailSubscribed: true,
  };

  if (campaign.targetMode === 'segment') {
    try {
      const segment = JSON.parse(campaign.targetSegment || '{}');
      const segmentFilter = buildSegmentFilter(segment);
      whereClause = { ...whereClause, ...segmentFilter };
    } catch {
      // Invalid segment JSON, use default (all subscribed)
    }
  }
  // targetMode === 'all' uses default filter (all subscribed customers)

  const customers = await prisma.customer.findMany({
    where: whereClause,
    select: { id: true, email: true, unsubscribeToken: true },
  });

  // Ensure each customer has an unsubscribe token
  const recipients: { email: string; unsubscribeToken: string }[] = [];
  const seen = new Set<string>();

  for (const c of customers) {
    const emailLower = c.email.toLowerCase();
    if (seen.has(emailLower)) continue;
    seen.add(emailLower);

    let token = c.unsubscribeToken;
    if (!token) {
      token = crypto.randomUUID();
      await prisma.customer.update({
        where: { id: c.id },
        data: { unsubscribeToken: token },
      });
    }

    recipients.push({ email: c.email, unsubscribeToken: token });
  }

  return recipients;
}

/**
 * Count recipients for a campaign's target without resolving tokens.
 */
export async function countRecipients(campaign: {
  targetMode: string;
  targetEmails: string;
  targetSegment: string;
}): Promise<number> {
  let whereClause: Record<string, unknown> = {
    email: { not: '' },
    emailSubscribed: true,
  };

  if (campaign.targetMode === 'specific') {
    const emails = parseEmails(campaign.targetEmails);
    return emails.length;
  } else if (campaign.targetMode === 'segment') {
    try {
      const segment = JSON.parse(campaign.targetSegment || '{}');
      const segmentFilter = buildSegmentFilter(segment);
      whereClause = { ...whereClause, ...segmentFilter };
    } catch {
      // Invalid segment
    }
  }

  return prisma.customer.count({ where: whereClause });
}

/**
 * Predefined segment definitions for the UI.
 */
export const SEGMENT_DEFINITIONS = [
  { type: 'newCustomers30d', label: 'Neue Kunden (letzte 30 Tage)', icon: '🆕' },
  { type: 'repeatCustomers', label: 'Wiederkehrende Kunden (2+ Bestellungen)', icon: '🔄' },
  { type: 'highValue', label: 'Premium-Kunden (50€+ ausgegeben)', icon: '💎' },
  { type: 'inactive90d', label: 'Inaktive Kunden (90+ Tage)', icon: '😴' },
  { type: 'recentOrders30d', label: 'Aktive Kunden (Bestellung letzte 30 Tage)', icon: '🛒' },
] as const;

/**
 * Build Prisma where-clause from segment rules.
 */
function buildSegmentFilter(segment: { type?: string }): Record<string, unknown> {
  const now = new Date();

  switch (segment.type) {
    case 'newCustomers30d': {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { createdAt: { gte: thirtyDaysAgo } };
    }
    case 'repeatCustomers':
      return { totalOrders: { gte: 2 } };
    case 'highValue':
      return { totalSpent: { gte: 50 } };
    case 'inactive90d': {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      return { createdAt: { lt: ninetyDaysAgo }, totalOrders: { lte: 1 } };
    }
    case 'recentOrders30d': {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { totalOrders: { gte: 1 }, updatedAt: { gte: thirtyDaysAgo } };
    }
    default:
      return {};
  }
}
