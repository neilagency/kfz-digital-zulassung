#!/usr/bin/env tsx
/**
 * Fix Orders Without Items — One-time resolution script
 *
 * Classification:
 *   A (Recoverable): Has payment or meaningful data → mark status='failed' + add note
 *   B (Invalid):     Empty shell, no payment, no data → soft-delete
 *
 * Usage:
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/fix-orphan-orders.ts
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/fix-orphan-orders.ts --dry-run
 */

import { createClient } from '@libsql/client';
import { writeFileSync } from 'fs';
import { join } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');

interface AuditEntry {
  orderNumber: number;
  orderId: string;
  status: string;
  total: number;
  hasPayment: boolean;
  hasInvoice: boolean;
  hasCustomer: boolean;
  hasServiceData: boolean;
  classification: 'A_RECOVERABLE' | 'B_INVALID';
  action: string;
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url || !token) {
    console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
    process.exit(1);
  }

  const db = createClient({ url, authToken: token });
  const audit: AuditEntry[] = [];

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  FIX ORPHAN ORDERS ${DRY_RUN ? '(DRY RUN)' : '(LIVE)'}`);
  console.log(`  ${new Date().toISOString()}`);
  console.log(`${'═'.repeat(60)}\n`);

  // Find all orders without items
  const orphans = await db.execute(`
    SELECT o.id, o.orderNumber, o.status, o.total, o.customerId, o.serviceData,
           o.billingEmail, o.paymentMethod, o.transactionId, o.deletedAt
    FROM "Order" o
    LEFT JOIN "OrderItem" oi ON oi.orderId = o.id
    WHERE oi.id IS NULL
    ORDER BY o.orderNumber
  `);

  if (orphans.rows.length === 0) {
    console.log('✅ No orders without items found. Nothing to fix.\n');
    db.close();
    return;
  }

  console.log(`Found ${orphans.rows.length} order(s) without items:\n`);

  for (const r of orphans.rows) {
    const orderId = r.id as string;
    const orderNum = r.orderNumber as number;
    const status = r.status as string;
    const total = r.total as number;

    // Check related data
    const payments = await db.execute(`SELECT id, amount, status FROM "Payment" WHERE orderId = ?`, [orderId]);
    const invoices = await db.execute(`SELECT id, invoiceNumber FROM "Invoice" WHERE orderId = ?`, [orderId]);

    const hasPayment = payments.rows.length > 0;
    const hasPaidPayment = payments.rows.some(p => p.status === 'paid' || p.status === 'completed');
    const hasInvoice = invoices.rows.length > 0;
    const hasCustomer = !!r.customerId;
    const serviceData = String(r.serviceData || '{}');
    const hasServiceData = serviceData !== '{}' && serviceData !== '';

    // Classify
    const isRecoverable = hasPaidPayment || hasServiceData;

    const entry: AuditEntry = {
      orderNumber: orderNum,
      orderId,
      status,
      total,
      hasPayment,
      hasInvoice,
      hasCustomer,
      hasServiceData,
      classification: isRecoverable ? 'A_RECOVERABLE' : 'B_INVALID',
      action: '',
    };

    if (isRecoverable) {
      // Case A: Mark as failed + add note
      entry.action = 'MARKED_FAILED';
      console.log(`  Order #${orderNum}: Category A (Recoverable) → mark as 'failed'`);
      console.log(`    Payment: ${hasPayment ? 'YES' : 'NO'}, ServiceData: ${hasServiceData ? 'YES' : 'NO'}`);

      if (!DRY_RUN) {
        await db.execute(`UPDATE "Order" SET status = 'failed' WHERE id = ?`, [orderId]);
        await db.execute(
          `INSERT INTO "OrderNote" (id, orderId, note, author, createdAt)
           VALUES (lower(hex(randomblob(12))), ?, 'Order has no items — marked as failed by system cleanup (fix-orphan-orders)', 'system', datetime('now'))`,
          [orderId]
        );
      }
    } else {
      // Case B: Soft-delete (set deletedAt)
      entry.action = 'SOFT_DELETED';
      console.log(`  Order #${orderNum}: Category B (Invalid) → soft-delete`);
      console.log(`    Payment: ${hasPayment ? 'YES' : 'NO'}, ServiceData: ${hasServiceData ? 'YES' : 'NO'}`);

      if (!DRY_RUN) {
        await db.execute(`UPDATE "Order" SET deletedAt = datetime('now'), status = 'cancelled' WHERE id = ?`, [orderId]);
        await db.execute(
          `INSERT INTO "OrderNote" (id, orderId, note, author, createdAt)
           VALUES (lower(hex(randomblob(12))), ?, 'Order has no items, no payment, no data — soft-deleted by system cleanup (fix-orphan-orders)', 'system', datetime('now'))`,
          [orderId]
        );
      }
    }

    audit.push(entry);
  }

  // Summary
  const recoverable = audit.filter(a => a.classification === 'A_RECOVERABLE');
  const invalid = audit.filter(a => a.classification === 'B_INVALID');

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  SUMMARY ${DRY_RUN ? '(DRY RUN — no changes made)' : ''}`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`  Total affected:      ${audit.length}`);
  console.log(`  Marked as failed:    ${recoverable.length} (Category A)`);
  console.log(`  Soft-deleted:        ${invalid.length} (Category B)`);
  console.log(`${'═'.repeat(60)}\n`);

  // Write audit JSON
  const auditPath = join(__dirname, '..', `orphan-orders-audit-${new Date().toISOString().slice(0, 10)}.json`);
  const auditReport = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    totalAffected: audit.length,
    markedFailed: recoverable.length,
    softDeleted: invalid.length,
    orders: audit,
  };
  writeFileSync(auditPath, JSON.stringify(auditReport, null, 2));
  console.log(`📋 Audit report saved: ${auditPath}`);

  db.close();
}

main();
