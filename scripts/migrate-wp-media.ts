#!/usr/bin/env tsx
/**
 * WP Media Migration Script
 * ==========================
 * Migrates all WordPress media files from:
 *   /public/uploads/wp/ → /public/uploads/media/migrated/
 *
 * What this script does (in order):
 *   1. Pre-flight checks (paths, DB existence)
 *   2. Backup  — copy dev.db + export affected DB rows to JSON
 *   3. File copy — copy image files, skip non-images, handle conflicts
 *   4. Generate mapping file (old → new paths)
 *   5. Update database — Media, BlogPost, Page, Product tables
 *   6. Validate — confirm no remaining /uploads/wp/ refs in DB
 *   7. Write final report
 *
 * Safe to re-run: idempotent (skips already-copied files, re-checks DB).
 * Does NOT delete /uploads/wp/ — that is the cleanup phase.
 *
 * Usage:
 *   npx tsx scripts/migrate-wp-media.ts
 *   npx tsx scripts/migrate-wp-media.ts --dry-run   (no writes)
 */

import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';

// ─── Config ───────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes('--dry-run');

const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DIR   = path.join(PROJECT_ROOT, 'public');
const WP_SOURCE    = path.join(PUBLIC_DIR, 'uploads', 'wp');
const MEDIA_DEST   = path.join(PUBLIC_DIR, 'uploads', 'media', 'migrated');
const BACKUPS_DIR  = path.join(PROJECT_ROOT, 'backups');
const DB_PATH      = path.join(PROJECT_ROOT, 'dev.db');

const OLD_PREFIX = '/uploads/wp/';
const NEW_PREFIX = '/uploads/media/migrated/';

/** Extensions treated as migratable image/media files */
const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif',
  '.bmp', '.ico', '.tiff', '.tif',
]);

/** Files/dirs to skip entirely */
const SKIP_NAMES = new Set(['.DS_Store', 'Thumbs.db', '.gitkeep']);

// ─── Utilities ────────────────────────────────────────────────────────────────

function ts(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}-${p(d.getHours())}-${p(d.getMinutes())}`;
}

function log(msg: string) { console.log(msg); }
function info(msg: string) { console.log(`  ${msg}`); }
function ok(msg: string)   { console.log(`  ✅ ${msg}`); }
function warn(msg: string) { console.log(`  ⚠️  ${msg}`); }
function err(msg: string)  { console.error(`  ❌ ${msg}`); }

/** Replace ALL occurrences of oldStr with newStr in text */
function replaceAll(text: string, oldStr: string, newStr: string): string {
  if (!text.includes(oldStr)) return text;
  return text.split(oldStr).join(newStr);
}

/** Recursively walk a directory and yield file absolute paths */
function* walkDir(dir: string): Generator<string> {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    if (SKIP_NAMES.has(entry)) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      yield* walkDir(full);
    } else {
      yield full;
    }
  }
}

// ─── Phase 1: Pre-flight ──────────────────────────────────────────────────────

function preflight() {
  log('\n═══ Phase 1: Pre-flight checks ═══');

  if (DRY_RUN) warn('DRY-RUN mode — no files or DB records will be modified');

  if (!fs.existsSync(WP_SOURCE)) {
    err(`Source folder not found: ${WP_SOURCE}`);
    process.exit(1);
  }
  ok(`WP source: ${WP_SOURCE}`);

  if (!fs.existsSync(DB_PATH)) {
    err(`Database not found: ${DB_PATH}`);
    process.exit(1);
  }
  ok(`Database: ${DB_PATH}`);

  if (!DRY_RUN) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    fs.mkdirSync(MEDIA_DEST, { recursive: true });
  }
}

// ─── Phase 2: Backup ─────────────────────────────────────────────────────────

function backup(stamp: string): string {
  log('\n═══ Phase 2: Backup ═══');

  const dbBackupPath = path.join(BACKUPS_DIR, `dev-db-pre-wp-migration-${stamp}.db`);

  if (!DRY_RUN) {
    fs.copyFileSync(DB_PATH, dbBackupPath);
    ok(`DB backup: backups/dev-db-pre-wp-migration-${stamp}.db`);
  } else {
    info(`[DRY] Would copy dev.db → backups/dev-db-pre-wp-migration-${stamp}.db`);
  }

  // Export affected records to JSON for reference
  const db = new Database(DB_PATH, { readonly: true });

  const affectedMedia     = db.prepare("SELECT id, localPath, sourceUrl FROM Media WHERE localPath LIKE '%/uploads/wp/%' OR sourceUrl LIKE '%/uploads/wp/%'").all();
  const affectedBlogPosts = db.prepare("SELECT id, slug, featuredImage FROM BlogPost WHERE featuredImage LIKE '%/uploads/wp/%' OR content LIKE '%/uploads/wp/%'").all();
  const affectedPages     = db.prepare("SELECT id, slug, featuredImage FROM Page WHERE featuredImage LIKE '%/uploads/wp/%' OR content LIKE '%/uploads/wp/%' OR ogImage LIKE '%/uploads/wp/%'").all();

  db.close();

  const snapshotPath = path.join(BACKUPS_DIR, `wp-migration-snapshot-${stamp}.json`);
  if (!DRY_RUN) {
    fs.writeFileSync(snapshotPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      counts: {
        mediaRecords: affectedMedia.length,
        blogPosts:    affectedBlogPosts.length,
        pages:        affectedPages.length,
      },
      media:     affectedMedia,
      blogPosts: affectedBlogPosts,
      pages:     affectedPages,
    }, null, 2));
    ok(`Snapshot: backups/wp-migration-snapshot-${stamp}.json`);
  }

  info(`Affected: ${affectedMedia.length} Media, ${affectedBlogPosts.length} BlogPost, ${affectedPages.length} Page records`);

  return dbBackupPath;
}

// ─── Phase 3: File migration ──────────────────────────────────────────────────

interface FileMappingEntry {
  oldRelative: string;  // /uploads/wp/2024/01/foo.jpg
  newRelative: string;  // /uploads/media/migrated/2024/01/foo.jpg
  oldAbsolute: string;
  newAbsolute: string;
  skipped: boolean;
  skipReason?: string;
}

function migrateFiles(): FileMappingEntry[] {
  log('\n═══ Phase 3: File migration ═══');

  const mapping: FileMappingEntry[] = [];
  let copied   = 0;
  let skipped  = 0;
  let existing = 0;

  for (const absPath of walkDir(WP_SOURCE)) {
    const ext = path.extname(absPath).toLowerCase();

    // Get relative path from PUBLIC_DIR: /uploads/wp/YYYY/MM/filename.ext
    const relFromPublic = '/' + path.relative(PUBLIC_DIR, absPath).replace(/\\/g, '/');

    // Destination relative: /uploads/media/migrated/YYYY/MM/filename.ext
    const relFromWp  = path.relative(WP_SOURCE, absPath);    // YYYY/MM/filename.ext
    const destAbs    = path.join(MEDIA_DEST, relFromWp);
    const destRel    = '/' + path.relative(PUBLIC_DIR, destAbs).replace(/\\/g, '/');

    // Skip non-image files
    if (!IMAGE_EXTENSIONS.has(ext)) {
      mapping.push({
        oldRelative: relFromPublic,
        newRelative: destRel,
        oldAbsolute: absPath,
        newAbsolute: destAbs,
        skipped: true,
        skipReason: `non-image extension: ${ext || '(none)'}`,
      });
      skipped++;
      continue;
    }

    // Already migrated — skip copy but still record mapping
    if (fs.existsSync(destAbs)) {
      mapping.push({
        oldRelative: relFromPublic,
        newRelative: destRel,
        oldAbsolute: absPath,
        newAbsolute: destAbs,
        skipped: false,
      });
      existing++;
      continue;
    }

    // Copy
    if (!DRY_RUN) {
      fs.mkdirSync(path.dirname(destAbs), { recursive: true });
      fs.copyFileSync(absPath, destAbs);
    }

    mapping.push({
      oldRelative: relFromPublic,
      newRelative: destRel,
      oldAbsolute: absPath,
      newAbsolute: destAbs,
      skipped: false,
    });
    copied++;
  }

  if (DRY_RUN) {
    info(`[DRY] Would copy ${copied} images (${existing} already exist, ${skipped} non-images skipped)`);
  } else {
    ok(`Copied ${copied} image files`);
    if (existing > 0) info(`${existing} files already existed at destination (skipped copy)`);
    if (skipped > 0)  info(`${skipped} non-image files skipped`);
  }

  return mapping;
}

// ─── Phase 4: Save mapping file ───────────────────────────────────────────────

function saveMappingFile(mapping: FileMappingEntry[], stamp: string) {
  log('\n═══ Phase 4: Save path mapping ═══');

  const imageMapping = mapping.filter(e => !e.skipped);
  const pathMap: Record<string, string> = {};
  for (const e of imageMapping) {
    pathMap[e.oldRelative] = e.newRelative;
  }

  const mappingPath = path.join(BACKUPS_DIR, `wp-media-path-mapping-${stamp}.json`);
  if (!DRY_RUN) {
    fs.writeFileSync(mappingPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      oldPrefix: OLD_PREFIX,
      newPrefix: NEW_PREFIX,
      totalImages: imageMapping.length,
      mapping: pathMap,
    }, null, 2));
    ok(`Mapping file: backups/wp-media-path-mapping-${stamp}.json`);
  } else {
    info(`[DRY] Would write mapping file with ${imageMapping.length} entries`);
  }
}

// ─── Phase 5: Update database ─────────────────────────────────────────────────

interface DbUpdateStats {
  mediaUpdated:     number;
  blogPostsUpdated: number;
  pagesUpdated:     number;
  productsUpdated:  number;
}

function updateDatabase(): DbUpdateStats {
  log('\n═══ Phase 5: Update database ═══');

  const stats: DbUpdateStats = {
    mediaUpdated:     0,
    blogPostsUpdated: 0,
    pagesUpdated:     0,
    productsUpdated:  0,
  };

  if (DRY_RUN) {
    const db = new Database(DB_PATH, { readonly: true });

    stats.mediaUpdated     = (db.prepare("SELECT COUNT(*) as c FROM Media WHERE localPath LIKE '%/uploads/wp/%' OR sourceUrl LIKE '%/uploads/wp/%'").get() as { c: number }).c;
    stats.blogPostsUpdated = (db.prepare("SELECT COUNT(*) as c FROM BlogPost WHERE featuredImage LIKE '%/uploads/wp/%' OR content LIKE '%/uploads/wp/%' OR ogImage LIKE '%/uploads/wp/%'").get() as { c: number }).c;
    stats.pagesUpdated     = (db.prepare("SELECT COUNT(*) as c FROM Page WHERE featuredImage LIKE '%/uploads/wp/%' OR content LIKE '%/uploads/wp/%' OR ogImage LIKE '%/uploads/wp/%'").get() as { c: number }).c;
    stats.productsUpdated  = (db.prepare("SELECT COUNT(*) as c FROM Product WHERE featuredImage LIKE '%/uploads/wp/%' OR content LIKE '%/uploads/wp/%'").get() as { c: number }).c;
    db.close();

    info(`[DRY] Would update ~${stats.mediaUpdated} Media records`);
    info(`[DRY] Would update ~${stats.blogPostsUpdated} BlogPost records`);
    info(`[DRY] Would update ~${stats.pagesUpdated} Page records`);
    info(`[DRY] Would update ~${stats.productsUpdated} Product records`);
    return stats;
  }

  const db = new Database(DB_PATH);

  // SQLite doesn't have a native REPLACE() in all old versions but modern SQLite does.
  // Using REPLACE(field, old, new) — supported in SQLite 3.7.15+

  const OLD = OLD_PREFIX;
  const NEW = NEW_PREFIX;

  // ── Media table ──
  // Update localPath, sourceUrl, thumbnailUrl, mediumUrl, largeUrl, webpUrl, avifUrl
  const mediaFields = ['localPath', 'sourceUrl', 'thumbnailUrl', 'mediumUrl', 'largeUrl', 'webpUrl', 'avifUrl'];
  let mediaChanged = 0;

  db.transaction(() => {
    for (const field of mediaFields) {
      const result = db.prepare(`
        UPDATE Media
        SET "${field}" = REPLACE("${field}", ?, ?)
        WHERE "${field}" LIKE ?
      `).run(OLD, NEW, `%${OLD}%`);
      mediaChanged = Math.max(mediaChanged, result.changes);
    }
    // Re-count how many rows were actually updated (at least one field changed)
    stats.mediaUpdated = (db.prepare("SELECT COUNT(*) as c FROM Media WHERE localPath LIKE ? OR sourceUrl LIKE ?").get(`%${NEW}%`, `%${NEW}%`) as { c: number }).c;
  })();

  ok(`Media: updated fields for ${stats.mediaUpdated} records`);

  // ── BlogPost table ──
  db.transaction(() => {
    // featuredImage
    db.prepare(`UPDATE BlogPost SET featuredImage = REPLACE(featuredImage, ?, ?) WHERE featuredImage LIKE ?`).run(OLD, NEW, `%${OLD}%`);
    // content (HTML with embedded image srcs)
    db.prepare(`UPDATE BlogPost SET content = REPLACE(content, ?, ?) WHERE content LIKE ?`).run(OLD, NEW, `%${OLD}%`);
    // ogImage
    db.prepare(`UPDATE BlogPost SET ogImage = REPLACE(ogImage, ?, ?) WHERE ogImage LIKE ?`).run(OLD, NEW, `%${OLD}%`);

    stats.blogPostsUpdated = (db.prepare("SELECT COUNT(*) as c FROM BlogPost WHERE featuredImage LIKE ? OR content LIKE ? OR ogImage LIKE ?").get(`%${NEW}%`, `%${NEW}%`, `%${NEW}%`) as { c: number }).c;
  })();

  ok(`BlogPost: updated ${stats.blogPostsUpdated} records`);

  // ── Page table ──
  db.transaction(() => {
    db.prepare(`UPDATE Page SET featuredImage = REPLACE(featuredImage, ?, ?) WHERE featuredImage LIKE ?`).run(OLD, NEW, `%${OLD}%`);
    db.prepare(`UPDATE Page SET content = REPLACE(content, ?, ?) WHERE content LIKE ?`).run(OLD, NEW, `%${OLD}%`);
    db.prepare(`UPDATE Page SET ogImage = REPLACE(ogImage, ?, ?) WHERE ogImage LIKE ?`).run(OLD, NEW, `%${OLD}%`);
    db.prepare(`UPDATE Page SET twitterImage = REPLACE(twitterImage, ?, ?) WHERE twitterImage LIKE ?`).run(OLD, NEW, `%${OLD}%`);

    stats.pagesUpdated = (db.prepare("SELECT COUNT(*) as c FROM Page WHERE featuredImage LIKE ? OR content LIKE ? OR ogImage LIKE ?").get(`%${NEW}%`, `%${NEW}%`, `%${NEW}%`) as { c: number }).c;
  })();

  ok(`Page: updated ${stats.pagesUpdated} records`);

  // ── Product table ──
  db.transaction(() => {
    db.prepare(`UPDATE Product SET featuredImage = REPLACE(featuredImage, ?, ?) WHERE featuredImage LIKE ?`).run(OLD, NEW, `%${OLD}%`);
    db.prepare(`UPDATE Product SET content = REPLACE(content, ?, ?) WHERE content LIKE ?`).run(OLD, NEW, `%${OLD}%`);
    db.prepare(`UPDATE Product SET ogImage = REPLACE(ogImage, ?, ?) WHERE ogImage LIKE ?`).run(OLD, NEW, `%${OLD}%`);

    stats.productsUpdated = (db.prepare("SELECT COUNT(*) as c FROM Product WHERE featuredImage LIKE ? OR content LIKE ? OR ogImage LIKE ?").get(`%${NEW}%`, `%${NEW}%`, `%${NEW}%`) as { c: number }).c;
  })();

  ok(`Product: updated ${stats.productsUpdated} records`);

  db.close();

  return stats;
}

// ─── Phase 6: Validate ────────────────────────────────────────────────────────

function validate(): { clean: boolean; remaining: Record<string, number> } {
  log('\n═══ Phase 6: Validation ═══');

  if (DRY_RUN) {
    info('[DRY] Skipping validation in dry-run mode');
    return { clean: true, remaining: {} };
  }

  const db = new Database(DB_PATH, { readonly: true });

  const remaining: Record<string, number> = {
    Media_localPath:       (db.prepare("SELECT COUNT(*) as c FROM Media WHERE localPath LIKE '%/uploads/wp/%'").get()          as { c: number }).c,
    Media_sourceUrl:       (db.prepare("SELECT COUNT(*) as c FROM Media WHERE sourceUrl LIKE '%/uploads/wp/%'").get()          as { c: number }).c,
    BlogPost_featuredImage:(db.prepare("SELECT COUNT(*) as c FROM BlogPost WHERE featuredImage LIKE '%/uploads/wp/%'").get()    as { c: number }).c,
    BlogPost_content:      (db.prepare("SELECT COUNT(*) as c FROM BlogPost WHERE content LIKE '%/uploads/wp/%'").get()          as { c: number }).c,
    BlogPost_ogImage:      (db.prepare("SELECT COUNT(*) as c FROM BlogPost WHERE ogImage LIKE '%/uploads/wp/%'").get()          as { c: number }).c,
    Page_featuredImage:    (db.prepare("SELECT COUNT(*) as c FROM Page WHERE featuredImage LIKE '%/uploads/wp/%'").get()        as { c: number }).c,
    Page_content:          (db.prepare("SELECT COUNT(*) as c FROM Page WHERE content LIKE '%/uploads/wp/%'").get()              as { c: number }).c,
    Page_ogImage:          (db.prepare("SELECT COUNT(*) as c FROM Page WHERE ogImage LIKE '%/uploads/wp/%'").get()              as { c: number }).c,
    Product_featuredImage: (db.prepare("SELECT COUNT(*) as c FROM Product WHERE featuredImage LIKE '%/uploads/wp/%'").get()     as { c: number }).c,
    Product_content:       (db.prepare("SELECT COUNT(*) as c FROM Product WHERE content LIKE '%/uploads/wp/%'").get()           as { c: number }).c,
  };

  db.close();

  const totalRemaining = Object.values(remaining).reduce((a, b) => a + b, 0);

  if (totalRemaining === 0) {
    ok('DB validation passed: zero /uploads/wp/ references remain');
    return { clean: true, remaining };
  } else {
    warn(`${totalRemaining} /uploads/wp/ references still remain in DB!`);
    for (const [key, count] of Object.entries(remaining)) {
      if (count > 0) err(`  ${key}: ${count} remaining`);
    }
    return { clean: false, remaining };
  }
}

// ─── Phase 7: Validate physical files ────────────────────────────────────────

function validateFiles(mapping: FileMappingEntry[]): { missing: string[] } {
  log('\n═══ Phase 6b: Physical file validation ═══');

  if (DRY_RUN) {
    info('[DRY] Skipping file validation in dry-run mode');
    return { missing: [] };
  }

  const imageMappings = mapping.filter(e => !e.skipped);
  let ok_count = 0;
  const missing: string[] = [];

  for (const entry of imageMappings) {
    if (fs.existsSync(entry.newAbsolute)) {
      ok_count++;
    } else {
      missing.push(entry.newRelative);
      err(`Missing at destination: ${entry.newRelative}`);
    }
  }

  if (missing.length === 0) {
    ok(`All ${ok_count} migrated image files exist at destination`);
  } else {
    warn(`${missing.length} files missing at destination`);
  }

  return { missing };
}

// ─── Phase 8: Final report ────────────────────────────────────────────────────

function writeReport(stamp: string, mapping: FileMappingEntry[], dbStats: DbUpdateStats, validation: { clean: boolean; remaining: Record<string, number> }, fileMissing: string[]) {
  log('\n═══ Phase 7: Final report ═══');

  const imagesMigrated = mapping.filter(e => !e.skipped).length;
  const skippedFiles   = mapping.filter(e => e.skipped).length;

  const reportPath = path.join(BACKUPS_DIR, `wp-migration-report-${stamp}.md`);

  const lines = [
    `# WP Media Migration Report`,
    ``,
    `**Generated:** ${new Date().toISOString()}`,
    `**Mode:** ${DRY_RUN ? 'DRY RUN (no changes made)' : 'LIVE'}`,
    ``,
    `## Summary`,
    ``,
    `| Item | Value |`,
    `|------|-------|`,
    `| Old path prefix | \`/uploads/wp/\` |`,
    `| New path prefix | \`/uploads/media/migrated/\` |`,
    `| Image files migrated | ${imagesMigrated} |`,
    `| Non-image files skipped | ${skippedFiles} |`,
    `| DB: Media records updated | ${dbStats.mediaUpdated} |`,
    `| DB: BlogPost records updated | ${dbStats.blogPostsUpdated} |`,
    `| DB: Page records updated | ${dbStats.pagesUpdated} |`,
    `| DB: Product records updated | ${dbStats.productsUpdated} |`,
    `| DB validation clean | ${validation.clean ? '✅ Yes' : '❌ No'} |`,
    `| Physical files missing | ${fileMissing.length === 0 ? '✅ None' : `❌ ${fileMissing.length}`} |`,
    ``,
    `## Validation Results`,
    ``,
    `### DB Remaining /uploads/wp/ References`,
    ``,
    ...(validation.clean
      ? ['✅ Zero remaining references — DB is clean.']
      : Object.entries(validation.remaining)
          .filter(([, c]) => c > 0)
          .map(([k, c]) => `- \`${k}\`: **${c}** remaining`)
    ),
    ``,
    `### Missing Files at Destination`,
    ``,
    ...(fileMissing.length === 0
      ? ['✅ All migrated files exist at new destination.']
      : fileMissing.map(f => `- \`${f}\``)
    ),
    ``,
    `## Backup Files Created`,
    ``,
    `- \`backups/dev-db-pre-wp-migration-${stamp}.db\``,
    `- \`backups/wp-migration-snapshot-${stamp}.json\``,
    `- \`backups/wp-media-path-mapping-${stamp}.json\``,
    ``,
    `## Next Steps`,
    ``,
    ...(validation.clean && fileMissing.length === 0 ? [
      `1. ✅ Run \`npx tsc --noEmit\` to verify TypeScript`,
      `2. ✅ Run \`npm run build\` to verify production build`,
      `3. Test image rendering on homepage, blog listing, blog detail, static pages`,
      `4. Test admin media library, upload, picker, blog creation with images`,
      `5. After all tests pass — run cleanup phase to remove \`/public/uploads/wp/\``,
    ] : [
      `⚠️  Some issues were found above. Do NOT proceed to cleanup until resolved.`,
    ]),
  ];

  if (!DRY_RUN) {
    fs.writeFileSync(reportPath, lines.join('\n'));
    ok(`Report: backups/wp-migration-report-${stamp}.md`);
  }

  log('\n' + lines.join('\n'));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  log('╔══════════════════════════════════════════════════════╗');
  log('║         WP Media Migration — iKFZ Digital            ║');
  log('╚══════════════════════════════════════════════════════╝');

  const stamp = ts();

  preflight();
  backup(stamp);
  const mapping  = migrateFiles();
  saveMappingFile(mapping, stamp);
  const dbStats  = updateDatabase();
  const dbValid  = validate();
  const { missing } = validateFiles(mapping);
  writeReport(stamp, mapping, dbStats, dbValid, missing);

  log('\n══════════════════════════════════════════════════════');
  if (!DRY_RUN && dbValid.clean && missing.length === 0) {
    log('✅  Migration complete. All references updated. Run tests before cleanup.');
  } else if (DRY_RUN) {
    log('ℹ️   Dry-run complete. Re-run without --dry-run to apply changes.');
  } else {
    log('⚠️   Migration finished with warnings. Review the report above.');
  }
  log('══════════════════════════════════════════════════════\n');
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
