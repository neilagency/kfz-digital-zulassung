import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/publish-scheduled
 * Auto-publishes blog posts whose scheduledAt has passed.
 * Called by cron job every 1-5 minutes.
 * Protected by CRON_SECRET header.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    // Find all scheduled posts whose time has come
    const postsToPublish = await prisma.blogPost.findMany({
      where: {
        status: 'scheduled',
        scheduledAt: { lte: now },
      },
      select: { id: true, slug: true, title: true },
    });

    if (postsToPublish.length === 0) {
      return NextResponse.json({ published: 0, message: 'No posts to publish' });
    }

    // Process each post independently — one failure doesn't block others
    const published: typeof postsToPublish = [];
    const failed: { id: string; slug: string; error: string }[] = [];

    for (const post of postsToPublish) {
      try {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: {
            status: 'publish',
            publishedAt: now,
            scheduledAt: null,
          },
        });
        published.push(post);

        try {
          revalidatePath(`/${post.slug}`);
        } catch (e) {
          console.warn(`Revalidation warning for /${post.slug}:`, e);
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`[cron] Failed to publish post ${post.id} (${post.slug}):`, errMsg);
        failed.push({ id: post.id, slug: post.slug, error: errMsg });
      }
    }

    try {
      revalidatePath('/insiderwissen');
      revalidatePath('/sitemap.xml');
      revalidateTag('blog');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    console.log(`[cron] Published ${published.length} scheduled posts:`, published.map(p => p.title));
    if (failed.length > 0) {
      console.error(`[cron] Failed to publish ${failed.length} posts:`, failed);
    }

    return NextResponse.json({
      published: published.length,
      failed: failed.length,
      posts: published.map((p) => ({ id: p.id, slug: p.slug, title: p.title })),
      errors: failed,
    });
  } catch (error) {
    console.error('Cron publish-scheduled error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
