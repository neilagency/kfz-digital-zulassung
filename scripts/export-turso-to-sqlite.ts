#!/usr/bin/env tsx
/**
 * Export Turso Production DB to SQLite File
 *
 * This script exports all data from Turso to a local SQLite file.
 * Useful for migrating from Turso cloud to local SQLite on Hostinger.
 *
 * Usage:
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/export-turso-to-sqlite.ts
 */

import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

const OUTPUT_DB = join(process.cwd(), 'production-db-backup.db');

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url || !token) {
    console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════');
  console.log('  Turso → SQLite Export');
  console.log('═══════════════════════════════════════════\n');

  // Remove existing output file if present
  if (existsSync(OUTPUT_DB)) {
    console.log(`🗑️  Removing existing ${OUTPUT_DB}`);
    unlinkSync(OUTPUT_DB);
  }

  console.log('🔗 Connecting to Turso production...');
  const turso = createClient({ url, authToken: token });

  console.log('📦 Creating local SQLite file...');
  const sqlite = new Database(OUTPUT_DB);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = OFF');

  // Get all tables
  console.log('📋 Fetching table list from Turso...');
  const tablesResult = await turso.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' ORDER BY name"
  );
  const tables = tablesResult.rows.map(r => String(r.name));
  console.log(`   Found ${tables.length} tables: ${tables.join(', ')}\n`);

  // For each table: get schema, create in SQLite, then copy data
  for (const table of tables) {
    console.log(`📥 Processing table: ${table}`);

    // Get table schema (CREATE TABLE statement)
    const schemaResult = await turso.execute(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name='${table}'`
    );
    const createSql = schemaResult.rows[0]?.sql as string;

    if (!createSql) {
      console.log(`   ⚠️  No CREATE TABLE statement found, skipping`);
      continue;
    }

    // Create table in SQLite
    try {
      sqlite.exec(createSql);
      console.log(`   ✅ Schema created`);
    } catch (e: any) {
      console.log(`   ⚠️  Schema creation failed (may already exist): ${e.message}`);
    }

    // Get all data from Turso
    const dataResult = await turso.execute(`SELECT * FROM "${table}"`);
    const rows = dataResult.rows;
    console.log(`   📊 ${rows.length} rows to copy`);

    if (rows.length === 0) {
      console.log(`   ⏭️  No data, skipping copy\n`);
      continue;
    }

    // Insert into SQLite
    const columns = Object.keys(rows[0] as object);
    const placeholders = columns.map(() => '?').join(',');
    const quotedColumns = columns.map(c => `"${c}"`).join(', ');
    const insert = sqlite.prepare(
      `INSERT OR REPLACE INTO "${table}" (${quotedColumns}) VALUES (${placeholders})`
    );
    const insertMany = sqlite.transaction((rows: any[]) => {
      for (const row of rows) {
        const values = columns.map(col => row[col]);
        insert.run(values);
      }
    });

    try {
      insertMany(rows);
      console.log(`   ✅ Data copied\n`);
    } catch (e: any) {
      console.log(`   ❌ Copy failed: ${e.message}\n`);
    }
  }

  // Copy indexes
  console.log('📋 Copying indexes...');
  const idxResult = await turso.execute(
    "SELECT sql FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' AND sql IS NOT NULL"
  );
  const indexes = idxResult.rows.map(r => String(r.sql));

  for (const idxSql of indexes) {
    try {
      sqlite.exec(idxSql);
    } catch (e: any) {
      // Index may already exist or conflict, ignore
    }
  }
  console.log(`   ✅ ${indexes.length} indexes processed\n`);

  // Cleanup
  sqlite.close();
  await turso.close();

  console.log('═══════════════════════════════════════════');
  console.log(`  ✅ Export complete`);
  console.log(`  📁 Output: ${OUTPUT_DB}`);
  console.log(`  📊 Size: ${(existsSync(OUTPUT_DB) ? require('fs').statSync(OUTPUT_DB).size / 1024 / 1024 : 0).toFixed(2)} MB`);
  console.log('═══════════════════════════════════════════\n');
  console.log('Next steps:');
  console.log('  1. Review the exported file');
  console.log('  2. Upload to Hostinger server');
  console.log('  3. Update .env to use DATABASE_URL=file:./production-db-backup.db');
  console.log('  4. Update src/lib/prisma.ts to use better-sqlite3 adapter');
}

main().catch((e) => {
  console.error('❌ Export failed:', e);
  process.exit(1);
});
