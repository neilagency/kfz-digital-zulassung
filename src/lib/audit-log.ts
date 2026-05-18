import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export interface AuditEntry {
  adminId: string;
  action: string;
  resource?: string;
  diff?: { before: unknown; after: unknown };
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        id: crypto.randomUUID(),
        adminId: entry.adminId,
        action: entry.action,
        resource: entry.resource || '',
        diff: JSON.stringify(entry.diff || {}),
        ipAddress: entry.ipAddress || '',
        userAgent: entry.userAgent || '',
      },
    });
  } catch (err) {
    logger.error('Failed to write audit log', err, { action: entry.action });
  }
}
