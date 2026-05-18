-- ═══════════════════════════════════════════════════════════════
-- Migration 003: Recreate tracking tables with camelCase columns
-- Date: 2026-05-18
-- Author: align with Prisma convention (no @map)
-- ═══════════════════════════════════════════════════════════════
-- Context:
--   Removed @@map/@map from Prisma models. SQLite columns now
--   match Prisma field names exactly.
--
-- Reversible: YES
-- ═══════════════════════════════════════════════════════════════

-- UP ──────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS "tracking_settings";
DROP TABLE IF EXISTS "audit_log";

CREATE TABLE IF NOT EXISTS "TrackingSettings" (
  "id"                    TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
  "gtmEnabled"            INTEGER NOT NULL DEFAULT 0,
  "gtmContainerId"        TEXT NOT NULL DEFAULT '',
  "ga4Enabled"            INTEGER NOT NULL DEFAULT 0,
  "ga4MeasurementId"      TEXT NOT NULL DEFAULT '',
  "ga4SendPageView"       INTEGER NOT NULL DEFAULT 1,
  "anonymizeIp"           INTEGER NOT NULL DEFAULT 1,
  "cookieConsentRequired" INTEGER NOT NULL DEFAULT 1,
  "environments"          TEXT NOT NULL DEFAULT '{}',
  "updatedAt"             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedById"           TEXT
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "adminId"   TEXT NOT NULL,
  "action"    TEXT NOT NULL,
  "resource"  TEXT NOT NULL DEFAULT '',
  "diff"      TEXT NOT NULL DEFAULT '{}',
  "ipAddress" TEXT NOT NULL DEFAULT '',
  "userAgent" TEXT NOT NULL DEFAULT '',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "AuditLog_adminId_idx"
  ON "AuditLog"("adminId");

CREATE INDEX IF NOT EXISTS "AuditLog_action_idx"
  ON "AuditLog"("action");

CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx"
  ON "AuditLog"("createdAt");

-- Seed default row
INSERT OR IGNORE INTO "TrackingSettings" ("id") VALUES ('default');

-- DOWN ────────────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS "AuditLog";
-- DROP TABLE IF EXISTS "TrackingSettings";
