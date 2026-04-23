import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';

// Lazy-load heavy modules only when needed (POST/PUT/DELETE)
let _validations: typeof import('@/lib/validations') | null = null;
let _sanitize: typeof import('@/lib/sanitize') | null = null;

async function getValidations() {
  if (!_validations) _validations = await import('@/lib/validations');
  return _validations;
}
async function getSanitize() {
  if (!_sanitize) _sanitize = await import('@/lib/sanitize');
  return _sanitize;
}

// In-memory cache for blog list (10s TTL)
let blogListCache: Map<string, { data: any; ts: number }> = new Map();
const BLOG_CACHE_TTL = 30_000;

// Total count cache (30s TTL)
let blogTotalCache: Map<string, { total: number; ts: number }> = new Map();
const BLOG_TOTAL_TTL = 30_000;

function jsonResponse(data: unknown, cacheSecs = 5, cacheHit = false) {
  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `private, max-age=${cacheSecs}, stale-while-revalidate=${cacheSecs * 6}`,
      ...(cacheHit ? { 'X-Cache': 'HIT' } : {}),
    },
  });
}

function getFreshBlogTotal(cacheKey: string) {
  const cached = blogTotalCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < BLOG_TOTAL_TTL) {
    return cached.total;
  }
  return null;
}

function storeBlogTotal(cacheKey: string, total: number) {
  blogTotalCache.set(cacheKey, { total, ts: Date.now() });
  if (blogTotalCache.size > 30) {
    const now = Date.now();
    for (const [key, value] of blogTotalCache) {
      if (now - value.ts > BLOG_TOTAL_TTL) blogTotalCache.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;

  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { slug: { contains: search } },
    ];
  }

  try {
    // Check cache
    const cacheKey = `blog:${page}:${limit}:${status || ''}:${search || ''}`;
    const cached = blogListCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < BLOG_CACHE_TTL) {
      return jsonResponse(cached.data, 5, true);
    }

    const totalCacheKey = `blog-total:${status || ''}:${search || ''}`;
    const cachedTotal = getFreshBlogTotal(totalCacheKey);

    let posts;
    let total;

    if (cachedTotal != null) {
      posts = await prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          category: true,
          featuredImage: true,
          featuredImageId: true,
          views: true,
          publishedAt: true,
          scheduledAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      total = cachedTotal;
    } else {
      [posts, total] = await prisma.$transaction([
        prisma.blogPost.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            category: true,
            featuredImage: true,
            featuredImageId: true,
            views: true,
            publishedAt: true,
            scheduledAt: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.blogPost.count({ where }),
      ]);
      storeBlogTotal(totalCacheKey, total);
    }

    const result = {
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };

    blogListCache.set(cacheKey, { data: result, ts: Date.now() });
    // Prune old cache entries
    if (blogListCache.size > 30) {
      const now = Date.now();
      for (const [k, v] of blogListCache) {
        if (now - v.ts > BLOG_CACHE_TTL) blogListCache.delete(k);
      }
    }

    return jsonResponse(result);
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Invalidate cache on creation
  blogListCache.clear();
  blogTotalCache.clear();
  try {
    const body = await request.json();

    // Lazy-load validation & sanitization
    const { blogPostCreateSchema, formatZodErrors } = await getValidations();
    const { sanitizeHtml } = await getSanitize();

    // Zod validation
    const parsed = blogPostCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
    }
    const data = parsed.data;

    // Resolve scheduling logic
    let finalStatus = data.status || 'draft';
    let publishedAt: Date | null = null;
    let scheduledAt: Date | null = null;

    if (data.scheduledAt) {
      const scheduledDate = new Date(data.scheduledAt);
      if (scheduledDate <= new Date()) {
        // Past or now → publish immediately
        finalStatus = 'publish';
        publishedAt = new Date();
      } else {
        finalStatus = 'scheduled';
        scheduledAt = scheduledDate;
      }
    } else if (finalStatus === 'publish') {
      publishedAt = new Date();
    }

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content ? sanitizeHtml(data.content) : '',
        excerpt: data.excerpt,
        status: finalStatus,
        category: data.category,
        featuredImage: data.featuredImage,
        featuredImageId: data.featuredImageId,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        focusKeyword: data.focusKeyword,
        canonical: data.canonical,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        tags: data.tags,
        author: 'Admin',
        publishedAt,
        scheduledAt,
      },
    });

    try {
      revalidatePath(`/${post.slug}`);
      revalidatePath('/insiderwissen');
      revalidatePath('/sitemap.xml');
      revalidateTag('blog');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Blog create error:', error);
    if (error?.message?.includes('UNIQUE constraint failed') || error?.message?.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Ein Beitrag mit diesem Slug existiert bereits. Bitte wähle einen anderen Slug.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
