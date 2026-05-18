-- ═══════════════════════════════════════════════════════════════
-- Migration 002: Tracking Settings + Audit Log
-- Date: 2026-05-18
-- Author: admin-controlled-tracking feature
-- ═══════════════════════════════════════════════════════════════
-- Context:
--   Adds singleton tracking_settings table and audit_log for
--   admin-controlled GA4 / GTM configuration.
--
-- Reversible: YES
-- ═══════════════════════════════════════════════════════════════

-- UP ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "tracking_settings" (
  "id"                    TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
  "gtm_enabled"           INTEGER NOT NULL DEFAULT 0,
  "gtm_container_id"      TEXT NOT NULL DEFAULT '',
  "ga4_enabled"           INTEGER NOT NULL DEFAULT 0,
  "ga4_measurement_id"    TEXT NOT NULL DEFAULT '',
  "ga4_send_page_view"    INTEGER NOT NULL DEFAULT 1,
  "anonymize_ip"          INTEGER NOT NULL DEFAULT 1,
  "cookie_consent_required" INTEGER NOT NULL DEFAULT 1,
  "environments"          TEXT NOT NULL DEFAULT '{}',
  "updated_at"            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by_id"         TEXT
);

CREATE TABLE IF NOT EXISTS "audit_log" (
  "id"          TEXT NOT NULL PRIMARY KEY,
  "admin_id"    TEXT NOT NULL,
  "action"      TEXT NOT NULL,
  "resource"    TEXT NOT NULL DEFAULT '',
  "diff"        TEXT NOT NULL DEFAULT '{}',
  "ip_address"  TEXT NOT NULL DEFAULT '',
  "user_agent"  TEXT NOT NULL DEFAULT '',
  "created_at"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "audit_log_admin_id_idx"
  ON "audit_log"("admin_id");

CREATE INDEX IF NOT EXISTS "audit_log_action_idx"
  ON "audit_log"("action");

CREATE INDEX IF NOT EXISTS "audit_log_created_at_idx"
  ON "audit_log"("created_at");

-- Seed default row
INSERT OR IGNORE INTO "tracking_settings" ("id") VALUES ('default');

-- DOWN ────────────────────────────────────────────────────────────
-- DROP TABLE IF EXISTS "audit_log";
-- DROP TABLE IF EXISTS "tracking_settings";
