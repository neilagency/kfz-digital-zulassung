#!/usr/bin/env tsx
/**
 * Automated Backup — Full SQL dump from Turso production
 *
 * Dumps all schema (CREATE TABLE/INDEX) + all row data (INSERT) to:
 *   /backups/db-YYYY-MM-DD-HH-mm.sql
 *
 * Retention: keeps last 7 days, deletes older backups.
 *
 * Usage:
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/backup-db.ts
 */

import { createClient } from '@libsql/client';
import { writeFileSync, mkdirSync, readdirSync, unlinkSync, statSync } from 'fs';
import { join } from 'path';

const BACKUPS_DIR = join(__dirname, '..', 'backups');
const RETENTION_DAYS = 7;

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

function escapeSQL(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number' || typeof val === 'bigint') return String(val);
  const s = String(val).replace(/'/g, "''");
  return `'${s}'`;
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url || !token) {
    console.error('❌ BACKUP FAILED: Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
    process.exit(1);
  }

  console.log('🔄 Starting database backup...');

  const db = createClient({ url, authToken: token });

  try {
    // ── Ensure backups dir exists ──
    mkdirSync(BACKUPS_DIR, { recursive: true });

    const lines: string[] = [];
    lines.push('-- ═══════════════════════════════════════════════════════════');
    lines.push(`-- FULL BACKUP — Turso Production`);
    lines.push(`-- Generated: ${new Date().toISOString()}`);
    lines.push('-- ═══════════════════════════════════════════════════════════');
    lines.push('');

    // ── 1. Schema: CREATE TABLE ──
    const tables = await db.execute(
      "SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    lines.push('-- SCHEMA');
    lines.push('');
    for (const row of tables.rows) {
      lines.push(`${row.sql};`);
      lines.push('');
    }

    // ── 2. Schema: CREATE INDEX ──
    const indexes = await db.execute(
      "SELECT sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL AND name NOT LIKE 'sqlite_autoindex_%' ORDER BY name"
    );
    lines.push('-- INDEXES');
    lines.push('');
    for (const row of indexes.rows) {
      lines.push(`${row.sql};`);
    }
    lines.push('');

    // ── 3. Data: INSERT statements per table ──
    lines.push('-- DATA');
    lines.push('');
    let totalRows = 0;

    for (const tableRow of tables.rows) {
      const tableName = tableRow.name as string;
      const data = await db.execute(`SELECT * FROM "${tableName}"`);
      if (data.rows.length === 0) continue;

      const columns = data.columns;
      lines.push(`-- ${tableName} (${data.rows.length} rows)`);

      for (const row of data.rows) {
        const values = columns.map((col) => escapeSQL((row as Record<string, unknown>)[col]));
        lines.push(`INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});`);
        totalRows++;
      }
      lines.push('');
    }

    // ── 4. Write file ──
    const fileName = `db-${timestamp()}.sql`;
    const filePath = join(BACKUPS_DIR, fileName);
    writeFileSync(filePath, lines.join('\n'), 'utf-8');
    const sizeKB = Math.round(statSync(filePath).size / 1024);

    console.log(`✅ Backup saved: backups/${fileName} (${sizeKB} KB, ${totalRows} rows, ${tables.rows.length} tables)`);

    // ── 5. Retention: delete backups older than 7 days ──
    const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const files = readdirSync(BACKUPS_DIR).filter(f => f.startsWith('db-') && f.endsWith('.sql'));
    let deleted = 0;

    for (const file of files) {
      const fPath = join(BACKUPS_DIR, file);
      const mtime = statSync(fPath).mtimeMs;
      if (mtime < cutoff) {
        unlinkSync(fPath);
        deleted++;
      }
    }

    if (deleted > 0) {
      console.log(`🗑  Cleaned ${deleted} backup(s) older than ${RETENTION_DAYS} days`);
    }
  } catch (error) {
    console.error('❌ BACKUP FAILED:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    db.close();
  }
}

main();
