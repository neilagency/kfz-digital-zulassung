/**
 * Server-side scheduler for auto-publishing scheduled blog posts.
 * Runs every 5 minutes via setInterval, started from instrumentation.ts.
 * Replaces external cron job (not available on Hostinger shared hosting).
 */
import prisma from '@/lib/prisma';

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let started = false;

async function publishScheduledPosts() {
  try {
    const now = new Date();

    const postsToPublish = await prisma.blogPost.findMany({
      where: {
        status: 'scheduled',
        scheduledAt: { lte: now },
      },
      select: { id: true, slug: true, title: true },
    });

    if (postsToPublish.length === 0) return;

    // Update each post individually so one failure doesn't block others
    const results = await Promise.allSettled(
      postsToPublish.map((post) =>
        prisma.blogPost.update({
          where: { id: post.id },
          data: {
            status: 'publish',
            publishedAt: now,
            scheduledAt: null,
          },
        })
      )
    );

    const published = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected');

    if (published > 0) {
      console.log(
        `[scheduler] Published ${published} scheduled post(s):`,
        postsToPublish.slice(0, published).map((p) => p.title)
      );
    }

    if (failed.length > 0) {
      console.error(
        `[scheduler] Failed to publish ${failed.length} post(s):`,
        failed.map((r) => (r as PromiseRejectedResult).reason?.message || 'unknown')
      );
    }
  } catch (error) {
    console.error('[scheduler] Error publishing scheduled posts:', error);
  }
}

export function startScheduler() {
  if (started) return;
  started = true;

  console.log('[scheduler] Blog post scheduler started (every 5 min)');

  // Run once immediately on startup
  publishScheduledPosts();

  // Then every 5 minutes
  setInterval(publishScheduledPosts, INTERVAL_MS);
}
