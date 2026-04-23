/**
 * Sync local dev.db from production Turso database.
 * Usage: npx tsx scripts/sync-from-turso.ts
 */

const TURSO_URL = process.env.TURSO_DATABASE_URL?.replace('libsql://', 'https://') 
  || 'https://kfz-digital-zulassung-omnianeil.aws-eu-west-1.turso.io';
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN!;

if (!TURSO_TOKEN) {
  console.error('❌ TURSO_AUTH_TOKEN is required. Set it as env var or in .env');
  process.exit(1);
}

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'dev.db');

interface TursoValue {
  type: string;
  value?: string;
}

interface TursoResult {
  cols: { name: string; decltype: string | null }[];
  rows: TursoValue[][];
}

async function tursoQuery(sql: string): Promise<TursoResult> {
  const res = await fetch(`${TURSO_URL}/v2/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        { type: 'execute', stmt: { sql } },
        { type: 'close' },
      ],
    }),
  });
  const data = await res.json();
  if (data.results[0].type === 'error') {
    throw new Error(`Turso error: ${data.results[0].error.message}`);
  }
  return data.results[0].response.result;
}

async function getTableNames(): Promise<string[]> {
  const result = await tursoQuery(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_prisma%' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream%' ORDER BY name"
  );
  return result.rows.map((r) => r[0].value!);
}

async function getTableSchema(table: string): Promise<string> {
  const result = await tursoQuery(
    `SELECT sql FROM sqlite_master WHERE type='table' AND name='${table}'`
  );
  return result.rows[0][0].value!;
}

async function getIndexes(table: string): Promise<string[]> {
  const result = await tursoQuery(
    `SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='${table}' AND sql IS NOT NULL`
  );
  return result.rows.map((r) => r[0].value!);
}

async function getRowCount(table: string): Promise<number> {
  const result = await tursoQuery(`SELECT COUNT(*) FROM "${table}"`);
  return parseInt(result.rows[0][0].value!, 10);
}

async function getAllRows(table: string): Promise<TursoResult> {
  return tursoQuery(`SELECT * FROM "${table}"`);
}

function tursoValueToSqlite(val: TursoValue): any {
  if (val.type === 'null') return null;
  if (val.type === 'integer') return parseInt(val.value!, 10);
  if (val.type === 'float') return parseFloat(val.value!);
  if (val.type === 'text') return val.value!;
  if (val.type === 'blob') return Buffer.from(val.value!, 'base64');
  return val.value;
}

async function main() {
  console.log('🔄 Syncing local dev.db from production Turso...\n');

  // Backup existing dev.db
  if (fs.existsSync(DB_PATH)) {
    const backupPath = DB_PATH + '.backup-' + new Date().toISOString().replace(/[:.]/g, '-');
    fs.copyFileSync(DB_PATH, backupPath);
    console.log(`📦 Backed up existing dev.db → ${path.basename(backupPath)}`);
  }

  // Get tables from production
  const tables = await getTableNames();
  console.log(`\n📋 Found ${tables.length} tables in production: ${tables.join(', ')}\n`);

  // Delete and recreate local db
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = OFF'); // Disable FK during import

  // Also sync _prisma_migrations table
  const allTables = [...tables, '_prisma_migrations'];

  for (const table of allTables) {
    try {
      // Get CREATE TABLE statement from production
      const createSQL = await getTableSchema(table);
      if (!createSQL) {
        console.log(`⏩ Skipping ${table} (no schema)`);
        continue;
      }

      // Create table locally
      db.exec(createSQL);

      // Get indexes
      const indexes = await getIndexes(table);
      for (const idx of indexes) {
        try {
          db.exec(idx);
        } catch (e: any) {
          // Ignore duplicate index errors
        }
      }

      // Get row count
      const count = await getRowCount(table);
      if (count === 0) {
        console.log(`✅ ${table}: 0 rows (schema only)`);
        continue;
      }

      // Fetch all rows
      process.stdout.write(`⬇️  ${table}: fetching ${count} rows...`);
      const result = await getAllRows(table);
      const colNames = result.cols.map((c) => c.name);
      const placeholders = colNames.map(() => '?').join(', ');
      const insertSQL = `INSERT INTO "${table}" (${colNames.map((c) => `"${c}"`).join(', ')}) VALUES (${placeholders})`;

      const insert = db.prepare(insertSQL);
      const insertMany = db.transaction((rows: any[][]) => {
        for (const row of rows) {
          insert.run(row);
        }
      });

      const convertedRows = result.rows.map((row) =>
        row.map((val) => tursoValueToSqlite(val))
      );
      insertMany(convertedRows);
      console.log(` ✅ (${convertedRows.length} rows)`);
    } catch (err: any) {
      console.error(`\n❌ Error syncing ${table}: ${err.message}`);
    }
  }

  db.pragma('foreign_keys = ON');
  db.close();

  // Final comparison
  const verifyDb = new Database(DB_PATH);
  const localPageCount = verifyDb.prepare('SELECT COUNT(*) as c FROM Page').get() as any;
  const localLandingCount = verifyDb.prepare("SELECT COUNT(*) as c FROM Page WHERE pageType='landing'").get() as any;
  const localCityCount = verifyDb.prepare('SELECT COUNT(*) as c FROM Page WHERE isCity=1').get() as any;
  verifyDb.close();

  console.log('\n═══════════════════════════════════════════');
  console.log('  ✅ SYNC COMPLETE');
  console.log('═══════════════════════════════════════════');
  console.log(`  Total pages:   ${localPageCount.c}`);
  console.log(`  Landing pages: ${localLandingCount.c}`);
  console.log(`  City pages:    ${localCityCount.c}`);
  console.log('═══════════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
