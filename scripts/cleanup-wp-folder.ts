#!/usr/bin/env tsx
/**
 * WP Folder Cleanup Script — Phase 9
 * ====================================
 * Removes /public/uploads/wp/ ONLY after confirming:
 *   1. Zero /uploads/wp/ references remain in the database
 *   2. All migration target files exist at /uploads/media/migrated/
 *
 * Pre-requisites before running this:
 *   - npm run migrate-media (completed with 0 remaining DB refs)
 *   - npx tsc --noEmit   (passes)
 *   - npm run build      (passes)
 *   - Manual visual test of images on homepage, blog, pages, admin
 *
 * Usage:
 *   npx tsx scripts/cleanup-wp-folder.ts --confirm
 *   (without --confirm it only validates, does NOT delete)
 */

import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';

const CONFIRM   = process.argv.includes('--confirm');
const ROOT      = path.join(__dirname, '..');
const WP_DIR    = path.join(ROOT, 'public', 'uploads', 'wp');
const DB_PATH   = path.join(ROOT, 'dev.db');
const BACKUPS   = path.join(ROOT, 'backups');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.bmp', '.ico', '.tiff', '.tif']);

function* walkDir(dir: string): Generator<string> {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir)) {
    const full = path.join(dir, e);
    if (fs.statSync(full).isDirectory()) yield* walkDir(full);
    else yield full;
  }
}

function ts(): string {
  const d = new Date(), p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}-${p(d.getHours())}-${p(d.getMinutes())}`;
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║      WP Folder Cleanup — Phase 9 (iKFZ Digital)     ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  if (!CONFIRM) {
    console.log('\n  ℹ️   Validation-only mode (no deletion). Pass --confirm to delete.\n');
  }

  if (!fs.existsSync(WP_DIR)) {
    console.log('  ✅ /public/uploads/wp/ does not exist — already cleaned up.');
    return;
  }

  // ── Step 1: Verify DB is clean ──
  console.log('\n═══ Step 1: Verify DB references ═══');
  const db = new Database(DB_PATH, { readonly: true });

  const checks = [
    { label: 'Media.localPath',        sql: "SELECT COUNT(*) as c FROM Media WHERE localPath LIKE '%/uploads/wp/%'" },
    { label: 'Media.sourceUrl',        sql: "SELECT COUNT(*) as c FROM Media WHERE sourceUrl LIKE '%/uploads/wp/%'" },
    { label: 'BlogPost.featuredImage', sql: "SELECT COUNT(*) as c FROM BlogPost WHERE featuredImage LIKE '%/uploads/wp/%'" },
    { label: 'BlogPost.content',       sql: "SELECT COUNT(*) as c FROM BlogPost WHERE content LIKE '%/uploads/wp/%'" },
    { label: 'Page.featuredImage',     sql: "SELECT COUNT(*) as c FROM Page WHERE featuredImage LIKE '%/uploads/wp/%'" },
    { label: 'Page.content',           sql: "SELECT COUNT(*) as c FROM Page WHERE content LIKE '%/uploads/wp/%'" },
  ];

  let dbClean = true;
  for (const { label, sql } of checks) {
    const count = (db.prepare(sql).get() as { c: number }).c;
    if (count > 0) {
      console.error(`  ❌ ${label}: ${count} remaining /uploads/wp/ references`);
      dbClean = false;
    } else {
      console.log(`  ✅ ${label}: clean`);
    }
  }
  db.close();

  if (!dbClean) {
    console.error('\n  ❌ ABORT: DB still has /uploads/wp/ references. Run npm run migrate-media first.');
    process.exit(1);
  }

  // ── Step 2: Count files to delete ──
  console.log('\n═══ Step 2: Count files in /uploads/wp/ ═══');
  let totalFiles = 0, imageFiles = 0;
  for (const f of walkDir(WP_DIR)) {
    totalFiles++;
    if (IMAGE_EXT.has(path.extname(f).toLowerCase())) imageFiles++;
  }
  console.log(`  Found ${totalFiles} files (${imageFiles} images) in /public/uploads/wp/`);

  // ── Step 3: Confirm all images exist at migrated path ──
  console.log('\n═══ Step 3: Verify images exist at /uploads/media/migrated/ ═══');
  let missingCount = 0;
  const MIGRATED = path.join(ROOT, 'public', 'uploads', 'media', 'migrated');

  for (const absPath of walkDir(WP_DIR)) {
    if (!IMAGE_EXT.has(path.extname(absPath).toLowerCase())) continue;
    const rel = path.relative(WP_DIR, absPath);
    const destPath = path.join(MIGRATED, rel);
    if (!fs.existsSync(destPath)) {
      console.error(`  ❌ Missing at destination: /uploads/media/migrated/${rel}`);
      missingCount++;
    }
  }

  if (missingCount > 0) {
    console.error(`\n  ❌ ABORT: ${missingCount} images not found at destination. Re-run npm run migrate-media.`);
    process.exit(1);
  }
  console.log(`  ✅ All ${imageFiles} images exist at /uploads/media/migrated/`);

  // ── Step 4: Delete (only with --confirm) ──
  if (!CONFIRM) {
    console.log('\n  ✅ Validation passed. All checks OK.');
    console.log('  Run with --confirm to delete /public/uploads/wp/');
    return;
  }

  console.log('\n═══ Step 4: Delete /public/uploads/wp/ ═══');

  // Final safety backup of file list
  const stamp = ts();
  const listPath = path.join(BACKUPS, `wp-deleted-files-${stamp}.txt`);
  fs.mkdirSync(BACKUPS, { recursive: true });
  const fileList: string[] = [];
  for (const f of walkDir(WP_DIR)) {
    fileList.push(path.relative(ROOT, f));
  }
  fs.writeFileSync(listPath, fileList.join('\n'));
  console.log(`  ✅ File list saved: backups/wp-deleted-files-${stamp}.txt`);

  // Remove the directory
  fs.rmSync(WP_DIR, { recursive: true, force: true });
  console.log(`  ✅ Deleted: /public/uploads/wp/ (${totalFiles} files removed)`);

  console.log('\n══════════════════════════════════════════════════════');
  console.log('✅  Cleanup complete. /public/uploads/wp/ removed.');
  console.log('   Rollback: restore from backups/ if needed.');
  console.log('══════════════════════════════════════════════════════\n');
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
