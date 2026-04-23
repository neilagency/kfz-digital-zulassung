#!/usr/bin/env tsx
/**
 * SQL Migration Runner — applies a migration file to production Turso.
 *
 * Usage:
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/run-migration.ts 001_baseline.sql
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/run-migration.ts 001_baseline.sql --dry-run
 */

import { createClient } from '@libsql/client';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations', 'sql');

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const fileName = args.find(a => !a.startsWith('--'));

  if (!fileName) {
    console.error('Usage: npx tsx scripts/run-migration.ts <filename.sql> [--dry-run]');
    process.exit(1);
  }

  const filePath = join(MIGRATIONS_DIR, fileName);
  if (!existsSync(filePath)) {
    console.error(`❌ Migration file not found: ${filePath}`);
    process.exit(1);
  }

  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url || !token) {
    console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
    process.exit(1);
  }

  const sql = readFileSync(filePath, 'utf-8');

  // Extract executable statements (skip comments, empty lines, DOWN section)
  const statements = sql
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      // Stop at DOWN section
      if (trimmed.startsWith('-- DOWN')) return false;
      // Skip comments and empty lines
      if (trimmed.startsWith('--') || trimmed === '') return false;
      return true;
    })
    .join('\n')
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Actually, re-parse more carefully: read up to the DOWN marker
  const upSection = sql.split(/^-- DOWN/m)[0];
  const upStatements = upSection
    .split(';')
    .map(s => {
      // Remove comment lines from each statement
      return s
        .split('\n')
        .filter(l => !l.trim().startsWith('--'))
        .join('\n')
        .trim();
    })
    .filter(s => s.length > 0);

  console.log('═══════════════════════════════════════════');
  console.log(`  SQL Migration Runner`);
  console.log(`  File: ${fileName}`);
  console.log(`  Mode: ${dryRun ? '🔍 DRY RUN' : '🔴 LIVE'}`);
  console.log(`  Statements: ${upStatements.length}`);
  console.log('═══════════════════════════════════════════\n');

  for (const [i, stmt] of upStatements.entries()) {
    const preview = stmt.length > 100 ? stmt.substring(0, 100) + '...' : stmt;
    console.log(`  [${i + 1}/${upStatements.length}] ${preview}`);
  }

  if (dryRun) {
    console.log('\n🔍 DRY RUN — no changes made.');
    return;
  }

  const db = createClient({ url, authToken: token });

  for (const [i, stmt] of upStatements.entries()) {
    try {
      await db.execute(stmt);
      console.log(`  ✅ [${i + 1}] OK`);
    } catch (e: any) {
      console.error(`  ❌ [${i + 1}] FAILED: ${e.message}`);
      console.error(`     Statement: ${stmt}`);
      db.close();
      process.exit(1);
    }
  }

  db.close();
  console.log(`\n✅ Migration ${fileName} applied successfully.`);
}

main();
