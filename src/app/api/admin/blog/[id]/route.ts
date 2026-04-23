import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { blogPostUpdateSchema, formatZodErrors } from '@/lib/validations';
import { sanitizeHtml } from '@/lib/sanitize';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });
    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({
      ...post,
      scheduledAt: post.scheduledAt?.toISOString() ?? null,
      publishedAt: post.publishedAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error('Blog detail error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Zod validation
    const parsed = blogPostUpdateSchema.safeParse({ ...body, id: params.id });
    if (!parsed.success) {
      return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
    }
    const data = parsed.data;

    // Fetch existing post to preserve publishedAt
    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });

    // Resolve scheduling logic
    let finalStatus = data.status || 'draft';
    let publishedAt: Date | null | undefined = undefined; // undefined = don't change
    let scheduledAt: Date | null = null;

    if (data.scheduledAt) {
      const scheduledDate = new Date(data.scheduledAt);
      if (scheduledDate <= new Date()) {
        finalStatus = 'publish';
        publishedAt = existing?.publishedAt ?? new Date();
        scheduledAt = null;
      } else {
        finalStatus = 'scheduled';
        scheduledAt = scheduledDate;
        publishedAt = null;
      }
    } else if (finalStatus === 'publish') {
      publishedAt = existing?.publishedAt ?? new Date();
      scheduledAt = null;
    } else if (finalStatus === 'draft') {
      scheduledAt = null;
    }

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content ? sanitizeHtml(data.content) : data.content,
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
        publishedAt,
        scheduledAt,
      },
    });

    // Revalidate the post on the live site
    try {
      revalidatePath(`/${post.slug}`);
      revalidatePath('/insiderwissen');
      revalidatePath('/sitemap.xml');
      revalidateTag('blog');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
    await prisma.blogPost.delete({ where: { id: params.id } });

    try {
      if (post) revalidatePath(`/${post.slug}`);
      revalidatePath('/insiderwissen');
      revalidatePath('/sitemap.xml');
      revalidateTag('blog');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog delete error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
