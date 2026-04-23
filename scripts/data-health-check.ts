#!/usr/bin/env tsx
/**
 * Data Health Checker — Detects corruption and logical inconsistencies
 *
 * Checks:
 *   - Orders without customer (ERROR)
 *   - Orders without items (WARNING)
 *   - Payments without order (ERROR)
 *   - Payment amount mismatch vs order total (WARNING)
 *   - Invoices without customer (ERROR)
 *   - BlogPosts without slug (ERROR)
 *
 * Exit codes:
 *   0 = all clean (or warnings only)
 *   1 = errors found
 *
 * Usage:
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/data-health-check.ts
 */

import { createClient } from '@libsql/client';

interface Issue {
  level: 'error' | 'warning';
  check: string;
  detail: string;
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url || !token) {
    console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
    process.exit(1);
  }

  console.log('🔍 Running data health checks...\n');

  const db = createClient({ url, authToken: token });
  const issues: Issue[] = [];

  try {
    // ── Orders without Customer ──
    const orphanOrders = await db.execute(
      `SELECT id, orderNumber FROM "Order" WHERE customerId IS NOT NULL AND customerId NOT IN (SELECT id FROM "Customer")`
    );
    for (const r of orphanOrders.rows) {
      issues.push({ level: 'error', check: 'ORDER_ORPHAN_CUSTOMER', detail: `Order #${r.orderNumber} (${r.id}) references non-existent customer` });
    }

    // ── Orders without OrderItems (active orders only — excludes failed/cancelled/soft-deleted) ──
    const emptyOrders = await db.execute(
      `SELECT o.id, o.orderNumber, o.status FROM "Order" o LEFT JOIN "OrderItem" oi ON oi.orderId = o.id WHERE oi.id IS NULL AND o.deletedAt IS NULL AND o.status NOT IN ('failed', 'cancelled')`
    );
    for (const r of emptyOrders.rows) {
      issues.push({ level: 'error', check: 'ORDER_NO_ITEMS', detail: `Order #${r.orderNumber} (${r.id}) has no items (status: ${r.status})` });
    }

    // ── Payments without Order ──
    const orphanPayments = await db.execute(
      `SELECT id, orderId FROM "Payment" WHERE orderId NOT IN (SELECT id FROM "Order")`
    );
    for (const r of orphanPayments.rows) {
      issues.push({ level: 'error', check: 'PAYMENT_ORPHAN_ORDER', detail: `Payment ${r.id} references non-existent order ${r.orderId}` });
    }

    // ── Payment amount mismatch ──
    const mismatchPayments = await db.execute(
      `SELECT p.id, p.amount, o.total, o.orderNumber FROM "Payment" p JOIN "Order" o ON p.orderId = o.id WHERE p.status = 'completed' AND ABS(p.amount - o.total) > 0.01`
    );
    for (const r of mismatchPayments.rows) {
      issues.push({ level: 'warning', check: 'PAYMENT_AMOUNT_MISMATCH', detail: `Payment ${r.id} amount ${r.amount} != Order #${r.orderNumber} total ${r.total}` });
    }

    // ── Invoices without Customer ──
    const orphanInvoices = await db.execute(
      `SELECT id, invoiceNumber FROM "Invoice" WHERE customerId IS NOT NULL AND customerId NOT IN (SELECT id FROM "Customer")`
    );
    for (const r of orphanInvoices.rows) {
      issues.push({ level: 'error', check: 'INVOICE_ORPHAN_CUSTOMER', detail: `Invoice ${r.invoiceNumber} (${r.id}) references non-existent customer` });
    }

    // ── BlogPosts without slug ──
    const noSlugPosts = await db.execute(
      `SELECT id, title FROM "BlogPost" WHERE slug IS NULL OR slug = ''`
    );
    for (const r of noSlugPosts.rows) {
      issues.push({ level: 'error', check: 'BLOGPOST_NO_SLUG', detail: `BlogPost "${r.title}" (${r.id}) has no slug` });
    }

    // ── Report ──
    const errors = issues.filter(i => i.level === 'error');
    const warnings = issues.filter(i => i.level === 'warning');

    console.log('═══════════════════════════════════════════');
    console.log('  DATA HEALTH REPORT');
    console.log(`  ${new Date().toISOString()}`);
    console.log('═══════════════════════════════════════════');
    console.log('');

    if (errors.length > 0) {
      console.log('ERRORS:');
      for (const e of errors) {
        console.log(`  ❌ [${e.check}] ${e.detail}`);
      }
      console.log('');
    }

    if (warnings.length > 0) {
      console.log('WARNINGS:');
      for (const w of warnings) {
        console.log(`  ⚠  [${w.check}] ${w.detail}`);
      }
      console.log('');
    }

    if (issues.length === 0) {
      console.log('  No issues found.');
      console.log('');
    }

    console.log('═══════════════════════════════════════════');
    if (errors.length > 0) {
      console.log(`  RESULT: ❌ FAIL — ${errors.length} error(s), ${warnings.length} warning(s)`);
      console.log('═══════════════════════════════════════════');
      process.exit(1);
    } else if (warnings.length > 0) {
      console.log(`  RESULT: ⚠ PASS — ${warnings.length} warning(s), no errors`);
    } else {
      console.log('  RESULT: ✅ PASS — all checks clean');
    }
    console.log('═══════════════════════════════════════════');
  } catch (error) {
    console.error('❌ DATA HEALTH CHECK FAILED:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    db.close();
  }
}

main();
