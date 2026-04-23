# SQL Migration Layer

All production schema changes MUST go through versioned SQL files in this directory.

## Rules

1. **Every DB change is a numbered SQL file** — `001_baseline.sql`, `002_add_foo.sql`, etc.
2. **No direct DB changes** outside this folder — no ad-hoc ALTER TABLE in terminals
3. **Each file must be idempotent** — use `IF NOT EXISTS`, `IF EXISTS` guards
4. **Each file must document reversibility** — include DOWN section (commented) if rollback is possible
5. **Apply via `scripts/run-migration.ts`** — never paste SQL manually

## Naming Convention

```
NNN_short_description.sql
```

- `NNN` — zero-padded sequential number
- `short_description` — snake_case, max 40 chars

## Execution

```bash
# Apply a specific migration to production Turso:
TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/run-migration.ts 001_baseline.sql

# Dry-run (prints SQL without executing):
TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/run-migration.ts 001_baseline.sql --dry-run
```

## Architecture

```
Prisma Schema (Contract/Definition)
        ↓
Schema Guard (Pre-deploy validation)
        ↓
SQL Migrations (Controlled changes)
        ↓
Turso Production DB (Execution layer)
```

Prisma is the design contract. It defines WHAT the schema should be.
SQL migrations are the ONLY way to change what the production DB actually is.
Schema Guard blocks deployment if they diverge.
