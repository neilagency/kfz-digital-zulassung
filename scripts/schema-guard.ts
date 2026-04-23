#!/usr/bin/env tsx
/**
 * Schema Guard — Pre-Deploy Enforcement Layer
 *
 * Validates Prisma schema (contract) matches Turso production DB (execution layer).
 * Classifies every drift into SAFE / WARNING / DESTRUCTIVE and blocks deploy on destructive changes.
 *
 * Exit codes:
 *   0 = safe to deploy (SAFE + WARNING only)
 *   1 = destructive drift detected — deployment blocked
 *
 * Flags:
 *   --strict   Fail on WARNING (not just DESTRUCTIVE)
 *   --json     Machine-readable JSON output
 *
 * Usage:
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/schema-guard.ts
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/schema-guard.ts --strict
 *   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/schema-guard.ts --json
 */

import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

// ─── Types ───────────────────────────────────────────────────────

type Severity = 'safe' | 'warning' | 'destructive';

interface DriftIssue {
  severity: Severity;
  category: string;
  table: string;
  detail: string;
}

interface PrismaModel {
  name: string;
  columns: string[];
  indexes: string[];
}

interface DbTable {
  name: string;
  columns: string[];
  columnTypes: Map<string, string>;
}

interface DbIndex {
  name: string;
  table: string;
}

interface GuardReport {
  timestamp: string;
  prismaModels: number;
  dbTables: number;
  dbIndexes: number;
  safe: DriftIssue[];
  warnings: DriftIssue[];
  destructive: DriftIssue[];
  result: 'PASS' | 'WARN' | 'BLOCKED';
}

// ─── Parse Prisma Schema ─────────────────────────────────────────

function parsePrismaSchema(schemaPath: string): PrismaModel[] {
  const content = readFileSync(schemaPath, 'utf-8');
  const models: PrismaModel[] = [];
  let currentModel: PrismaModel | null = null;

  for (const line of content.split('\n')) {
    const trimmed = line.trim();

    const modelMatch = trimmed.match(/^model\s+(\w+)\s*\{/);
    if (modelMatch) {
      currentModel = { name: modelMatch[1], columns: [], indexes: [] };
      continue;
    }

    if (!currentModel) continue;

    // End of model — exactly "}" on its own line (not inside @default("{}"))
    if (trimmed === '}') {
      models.push(currentModel);
      currentModel = null;
      continue;
    }

    if (trimmed.startsWith('//') || trimmed === '') continue;

    // @@index directive
    const indexMatch = trimmed.match(/@@index\(\[([^\]]+)\]/);
    if (indexMatch) {
      const fields = indexMatch[1].split(',').map(f => f.trim().replace(/"/g, ''));
      currentModel.indexes.push(`${currentModel.name}_${fields.join('_')}_idx`);
      continue;
    }

    // @@unique compound directive
    const uniqueCompound = trimmed.match(/@@unique\(\[([^\]]+)\]/);
    if (uniqueCompound) {
      const fields = uniqueCompound[1].split(',').map(f => f.trim().replace(/"/g, ''));
      currentModel.indexes.push(`${currentModel.name}_${fields.join('_')}_key`);
      continue;
    }

    if (trimmed.startsWith('@@')) continue;

    // Column definition
    const colMatch = trimmed.match(/^(\w+)\s+(\S+)/);
    if (colMatch) {
      const fieldName = colMatch[1];
      const fieldType = colMatch[2];

      // Skip relation fields (not DB columns)
      if (trimmed.includes('@relation(')) continue;
      // Skip relation arrays (e.g. Order[], OrderItem[], Invoice[])
      if (fieldType.includes('[]')) continue;
      // Skip relation scalars (capitalized types that aren't Prisma primitives)
      const primitives = new Set(['String', 'Int', 'Float', 'Boolean', 'DateTime', 'BigInt', 'Bytes', 'Decimal', 'Json']);
      const baseType = fieldType.replace('?', '');
      if (baseType[0] === baseType[0].toUpperCase() && !primitives.has(baseType)) continue;

      // @unique → generates a _key index
      if (trimmed.includes('@unique')) {
        currentModel.indexes.push(`${currentModel.name}_${fieldName}_key`);
      }

      currentModel.columns.push(fieldName);
    }
  }

  return models;
}

// ─── Fetch Turso Schema ──────────────────────────────────────────

async function fetchTursoSchema(db: ReturnType<typeof createClient>): Promise<{
  tables: DbTable[];
  indexes: DbIndex[];
}> {
  const tablesResult = await db.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' ORDER BY name"
  );
  const tableNames = tablesResult.rows.map(r => String(r.name));

  const tables: DbTable[] = [];
  for (const name of tableNames) {
    const colResult = await db.execute(`PRAGMA table_info("${name}")`);
    const columns = colResult.rows.map(r => String(r.name));
    const columnTypes = new Map<string, string>();
    for (const r of colResult.rows) {
      columnTypes.set(String(r.name), String(r.type));
    }
    tables.push({ name, columns, columnTypes });
  }

  const idxResult = await db.execute(
    "SELECT name, tbl_name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_autoindex_%' ORDER BY name"
  );
  const indexes: DbIndex[] = idxResult.rows.map(r => ({
    name: String(r.name),
    table: String(r.tbl_name),
  }));

  return { tables, indexes };
}

// ─── Comparison Engine ───────────────────────────────────────────

function compareSchemas(
  prismaModels: PrismaModel[],
  dbTables: DbTable[],
  dbIndexes: DbIndex[]
): DriftIssue[] {
  const issues: DriftIssue[] = [];
  const dbTableMap = new Map(dbTables.map(t => [t.name, t]));
  const dbIndexSet = new Set(dbIndexes.map(i => i.name));
  const prismaTableSet = new Set(prismaModels.map(m => m.name));

  for (const model of prismaModels) {
    // Missing table = DESTRUCTIVE
    if (!dbTableMap.has(model.name)) {
      issues.push({
        severity: 'destructive',
        category: 'MISSING_TABLE',
        table: model.name,
        detail: `Table "${model.name}" defined in Prisma but missing from production DB`,
      });
      continue;
    }

    const dbTable = dbTableMap.get(model.name)!;
    const dbColSet = new Set(dbTable.columns);
    const prismaColSet = new Set(model.columns);

    // Missing column = DESTRUCTIVE
    for (const col of model.columns) {
      if (!dbColSet.has(col)) {
        issues.push({
          severity: 'destructive',
          category: 'MISSING_COLUMN',
          table: model.name,
          detail: `Column "${model.name}.${col}" defined in Prisma but missing from production DB`,
        });
      }
    }

    // Extra column in DB = SAFE (DB has more than Prisma — no harm)
    for (const col of dbTable.columns) {
      if (!prismaColSet.has(col)) {
        issues.push({
          severity: 'safe',
          category: 'EXTRA_DB_COLUMN',
          table: model.name,
          detail: `Column "${model.name}.${col}" exists in DB but not in Prisma (harmless)`,
        });
      }
    }

    // Missing indexes = SAFE (query perf, not data integrity)
    for (const idx of model.indexes) {
      if (!dbIndexSet.has(idx)) {
        // Check if there's already a unique index covering the same field
        const fieldPart = idx.replace(`${model.name}_`, '').replace('_idx', '');
        const uniqueEquivalent = `${model.name}_${fieldPart}_key`;
        if (dbIndexSet.has(uniqueEquivalent)) {
          issues.push({
            severity: 'safe',
            category: 'REDUNDANT_INDEX',
            table: model.name,
            detail: `Index "${idx}" redundant — covered by unique index "${uniqueEquivalent}"`,
          });
        } else {
          issues.push({
            severity: 'safe',
            category: 'MISSING_INDEX',
            table: model.name,
            detail: `Index "${idx}" defined in Prisma but missing from production DB`,
          });
        }
      }
    }
  }

  // Extra tables in DB (not in Prisma) = WARNING
  for (const dbTable of dbTables) {
    if (!prismaTableSet.has(dbTable.name)) {
      issues.push({
        severity: 'warning',
        category: 'EXTRA_DB_TABLE',
        table: dbTable.name,
        detail: `Table "${dbTable.name}" exists in production DB but not in Prisma schema`,
      });
    }
  }

  return issues;
}

// ─── Output Formatters ───────────────────────────────────────────

function printReport(report: GuardReport, strict: boolean): void {
  console.log('═══════════════════════════════════════════');
  console.log('  SCHEMA GUARD REPORT');
  console.log('  ' + report.timestamp);
  console.log(`  Prisma: ${report.prismaModels} models | DB: ${report.dbTables} tables, ${report.dbIndexes} indexes`);
  console.log('═══════════════════════════════════════════\n');

  if (report.safe.length > 0) {
    console.log('SAFE:');
    for (const i of report.safe) {
      console.log(`  ✔ [${i.category}] ${i.detail}`);
    }
    console.log('');
  }

  if (report.warnings.length > 0) {
    console.log('WARNING:');
    for (const i of report.warnings) {
      console.log(`  ⚠ [${i.category}] ${i.detail}`);
    }
    console.log('');
  }

  if (report.destructive.length > 0) {
    console.log('DESTRUCTIVE:');
    for (const i of report.destructive) {
      console.log(`  ❌ [${i.category}] ${i.detail}`);
    }
    console.log('');
  }

  const total = report.safe.length + report.warnings.length + report.destructive.length;

  console.log('═══════════════════════════════════════════');
  if (total === 0) {
    console.log('  RESULT: ✅ PASS — schema fully aligned');
  } else if (report.destructive.length > 0) {
    console.log(`  RESULT: ❌ DEPLOY BLOCKED — ${report.destructive.length} destructive issue(s)`);
    console.log('');
    console.log('  Fix: Create a SQL migration in migrations/sql/');
    console.log('  Run: npx tsx scripts/run-migration.ts <file.sql>');
  } else if (strict && report.warnings.length > 0) {
    console.log(`  RESULT: ❌ BLOCKED (--strict) — ${report.warnings.length} warning(s)`);
  } else if (report.warnings.length > 0) {
    console.log(`  RESULT: 🟡 PASS WITH ${report.warnings.length} WARNING(S)`);
    console.log('  Deploy allowed. Consider fixing warnings.');
  } else {
    console.log(`  RESULT: ✅ PASS — ${report.safe.length} safe note(s), no issues`);
  }
  console.log('═══════════════════════════════════════════');
}

function printJson(report: GuardReport): void {
  // Convert Map-containing objects safely
  console.log(JSON.stringify(report, null, 2));
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const json = args.includes('--json');

  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url || !token) {
    console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
    process.exit(1);
  }

  const schemaPath = join(__dirname, '..', 'prisma', 'schema.prisma');

  if (!json) {
    console.log('');
    console.log('📋 Parsing Prisma schema...');
  }
  const prismaModels = parsePrismaSchema(schemaPath);
  if (!json) console.log(`   Found ${prismaModels.length} models`);

  if (!json) console.log('🔗 Connecting to Turso production...');
  const db = createClient({ url, authToken: token });
  const { tables: dbTables, indexes: dbIndexes } = await fetchTursoSchema(db);
  db.close();
  if (!json) console.log(`   Found ${dbTables.length} tables, ${dbIndexes.length} indexes\n`);

  const issues = compareSchemas(prismaModels, dbTables, dbIndexes);

  const report: GuardReport = {
    timestamp: new Date().toISOString(),
    prismaModels: prismaModels.length,
    dbTables: dbTables.length,
    dbIndexes: dbIndexes.length,
    safe: issues.filter(i => i.severity === 'safe'),
    warnings: issues.filter(i => i.severity === 'warning'),
    destructive: issues.filter(i => i.severity === 'destructive'),
    result: 'PASS',
  };

  if (report.destructive.length > 0) {
    report.result = 'BLOCKED';
  } else if (strict && report.warnings.length > 0) {
    report.result = 'BLOCKED';
  } else if (report.warnings.length > 0) {
    report.result = 'WARN';
  }

  if (json) {
    printJson(report);
  } else {
    printReport(report, strict);
  }

  process.exit(report.result === 'BLOCKED' ? 1 : 0);
}

main();
