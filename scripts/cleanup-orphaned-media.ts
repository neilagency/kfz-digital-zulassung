/**
 * Database Cleanup Script: Remove Orphaned Media References
 * ===========================================================
 * Removes Media table entries where the actual files no longer exist
 * Helps resolve 400 errors from image optimization when files are missing
 */

import prisma from '@/lib/prisma';
import { existsSync } from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

export async function cleanupOrphanedMedia() {
  try {
    console.log('🔍 Scanning for orphaned media files...');
    
    const allMedia = await prisma.media.findMany({
      select: { id: true, localPath: true, sourceUrl: true, fileName: true },
    });

    console.log(`Found ${allMedia.length} media entries in database`);

    let orphanedCount = 0;
    const orphanedIds: string[] = [];

    for (const media of allMedia) {
      if (!media.localPath) continue;
      
      const fullPath = path.join(PUBLIC_DIR, media.localPath);
      if (!existsSync(fullPath)) {
        orphanedIds.push(media.id);
        orphanedCount++;
        console.log(`❌ Missing: ${media.localPath} (ID: ${media.id})`);
      }
    }

    if (orphanedIds.length === 0) {
      console.log('✅ No orphaned media found. Database is clean!');
      return;
    }

    console.log(`\n⚠️  Found ${orphanedCount} orphaned media entries`);
    console.log(`IDs to delete: ${orphanedIds.join(', ')}\n`);

    // Delete orphaned entries
    const deleted = await prisma.media.deleteMany({
      where: { id: { in: orphanedIds } },
    });

    console.log(`✅ Deleted ${deleted.count} orphaned media entries`);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  cleanupOrphanedMedia()
    .then(() => {
      console.log('\n✓ Cleanup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('✗ Cleanup failed:', error);
      process.exit(1);
    });
}

export default cleanupOrphanedMedia;
