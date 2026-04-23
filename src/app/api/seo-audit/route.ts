/**
 * GET /api/seo-audit
 *
 * Returns a quick snapshot of the site's SEO health:
 * - weakNodes: city pages whose city model fails the SEO gate
 * - topPriorityUrls: top-50 city slugs with full URLs (daily crawl candidates)
 * - contentBlockUsage: usage counts of the new content architecture blocks
 * - contentBlockPatterns: most common content-block signatures across city pages
 * - bundeslandHubs: all 13 state hub page URLs
 * - summary: aggregate counts
 *
 * Used for monitoring and programmatic audits. Admin-only via secret header.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSeoAuditSnapshot } from '@/lib/seo-audit';

export async function GET(req: NextRequest) {
  // Require secret header to prevent public data exposure
  const secret = req.headers.get('x-audit-secret');
  const expectedSecret = process.env.AUDIT_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(await getSeoAuditSnapshot());
}
