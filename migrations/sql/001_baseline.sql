-- ═══════════════════════════════════════════════════════════════
-- Migration 001: Baseline — align Turso production with Prisma schema
-- Date: 2026-04-20
-- Author: schema-guard audit
-- ═══════════════════════════════════════════════════════════════
-- Context:
--   After city system deprecation + column cleanup, the production
--   Turso DB was missing 3 indexes that exist in the Prisma schema.
--   This migration adds them. Also drops the vestigial _prisma_migrations
--   table left over from the old prisma-migrate workflow.
--
-- Reversible: YES
-- ═══════════════════════════════════════════════════════════════

-- UP ──────────────────────────────────────────────────────────────

-- 1. Missing compound index on Order (deletedAt + status + createdAt)
CREATE INDEX IF NOT EXISTS "Order_deletedAt_status_createdAt_idx"
  ON "Order"("deletedAt", "status", "createdAt");

-- 2. Missing index on Setting.group
CREATE INDEX IF NOT EXISTS "Setting_group_idx"
  ON "Setting"("group");

-- 3. Missing compound index on BlogPost (status + createdAt)
CREATE INDEX IF NOT EXISTS "BlogPost_status_createdAt_idx"
  ON "BlogPost"("status", "createdAt");

-- 4. Drop vestigial _prisma_migrations table (no longer used)
DROP TABLE IF EXISTS "_prisma_migrations";

-- DOWN (rollback) ─────────────────────────────────────────────────
-- DROP INDEX IF EXISTS "Order_deletedAt_status_createdAt_idx";
-- DROP INDEX IF EXISTS "Setting_group_idx";
-- DROP INDEX IF EXISTS "BlogPost_status_createdAt_idx";
-- CREATE TABLE IF NOT EXISTS "_prisma_migrations" ( ... );
