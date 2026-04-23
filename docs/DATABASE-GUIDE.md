# Database Guide — Schema Management Rules

> Last updated: 2026-04-20

## Architecture

```
┌─────────────────────┐
│  prisma/schema.prisma│  ← Design Contract (source of truth)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  scripts/schema-guard│  ← Enforcement Layer (blocks bad deploys)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  migrations/sql/     │  ← Controlled SQL Migrations
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Turso Production DB │  ← Execution Layer
└─────────────────────┘
```

---

## Roles

### Prisma (`prisma/schema.prisma`)

- **Source of truth** for what the schema SHOULD look like
- Generates the TypeScript client used by application code
- Defines all models, fields, types, defaults, indexes, and relations
- Changes here drive everything downstream

### Turso (Production DB)

- Remote SQLite-compatible database (libSQL)
- Hosts the actual production data
- Schema changes are applied via versioned SQL only
- Never modified directly or via `prisma db push`

### Schema Guard (`scripts/schema-guard.ts`)

- Runs automatically before every deploy
- Compares Prisma schema against Turso production
- Classifies drift: **SAFE** / **WARNING** / **DESTRUCTIVE**
- Blocks deployment if destructive drift exists
- Flags: `--strict` (fail on warnings), `--json` (machine output)

### Migration Runner (`scripts/run-migration.ts`)

- Applies versioned SQL files from `migrations/sql/`
- Supports `--dry-run` for preview
- Tracks execution via console output (no migration table)

---

## Rules

### Absolute Rules

```
❌ No direct DB edits (no Turso shell modifications)
❌ No `prisma migrate` on production (we don't use Prisma Migrate)
❌ No `prisma db push` to production (it only touches local dev.db)
❌ No schema changes without a guard pass
✅ All production schema changes go through migrations/sql/
✅ Schema guard must pass before every deploy
✅ Prisma schema.prisma is always the contract — update it FIRST
```

### How to Make a Schema Change

1. **Edit `prisma/schema.prisma`** — add/modify your model
2. **Run `prisma db push`** locally — updates your `dev.db` for testing
3. **Run `npx prisma generate`** — regenerate the TypeScript client
4. **Test locally** — make sure your app code works with the new schema
5. **Create a SQL migration** in `migrations/sql/`:
   ```
   migrations/sql/002_add_feature.sql
   ```
   ```sql
   -- UP
   ALTER TABLE "MyTable" ADD COLUMN "newField" TEXT NOT NULL DEFAULT '';
   CREATE INDEX IF NOT EXISTS "MyTable_newField_idx" ON "MyTable"("newField");

   -- DOWN
   -- (manual rollback steps, not auto-executed)
   ```
6. **Apply the migration to Turso**:
   ```bash
   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/run-migration.ts 002_add_feature.sql
   ```
7. **Run schema guard** to verify alignment:
   ```bash
   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/schema-guard.ts
   ```
8. **Deploy** — the guard runs automatically in the deploy pipeline

### Migration File Rules

- **Naming:** `NNN_description.sql` (e.g., `001_baseline.sql`, `002_add_tracking.sql`)
- **Monotonic numbering** — never reuse or reorder
- **Idempotent:** Use `IF NOT EXISTS` / `IF EXISTS` where possible
- **UP section only** is executed; DOWN section is for manual rollback reference
- **No destructive operations** without explicit confirmation

---

## Schema Guard Classification

| Severity | What It Catches | Deploy? |
|----------|----------------|---------|
| **SAFE** | Missing index, redundant index, extra DB column | ✅ Allowed |
| **WARNING** | Extra DB table not in Prisma | ✅ Allowed (logged) |
| **DESTRUCTIVE** | Missing table, missing column | ❌ BLOCKED |

### Examples

```
SAFE:
  ✔ [REDUNDANT_INDEX] Invoice_invoiceNumber_idx — covered by unique index
  ✔ [MISSING_INDEX] MyTable_field_idx — perf only, not data integrity

WARNING:
  ⚠ [EXTRA_DB_TABLE] _legacy_table exists in DB but not in Prisma

DESTRUCTIVE:
  ❌ [MISSING_TABLE] NewModel defined in Prisma but missing from DB
  ❌ [MISSING_COLUMN] Order.newField defined in Prisma but missing from DB
```

---

## SQLite / Turso Notes

- **Boolean storage:** SQLite uses INTEGER (0/1) for Boolean. Prisma coerces automatically.
- **No ALTER COLUMN:** SQLite doesn't support column type changes. Workaround: create new table, copy data, drop old, rename.
- **No DROP COLUMN** in older SQLite versions. Turso supports it but use with caution.
- **JSON stored as TEXT:** Fields like `serviceData`, `options`, `faqItems` are TEXT columns containing JSON strings.
- **CUID primary keys:** All tables use TEXT PKs with Prisma-generated CUIDs.
