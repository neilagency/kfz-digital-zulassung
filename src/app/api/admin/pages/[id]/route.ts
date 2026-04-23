import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { pageCreateSchema, formatZodErrors } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await prisma.page.findUnique({ where: { id: params.id } });
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    console.error('Page detail error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Zod validation (reuse page schema, add links fields)
    const parsed = pageCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
    }
    const data = parsed.data;

    const page = await prisma.page.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        status: data.status,
        author: data.author,
        template: data.template,
        parent: data.parent,
        menuOrder: data.menuOrder,
        featuredImage: data.featuredImage,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        focusKeywords: data.focusKeywords,
        seoScore: data.seoScore,
        canonical: data.canonical,
        robots: data.robots,
        schemaType: data.schemaType,
        schemaData: data.schemaData,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        ogType: data.ogType,
        twitterTitle: data.twitterTitle,
        twitterDescription: data.twitterDescription,
        twitterImage: data.twitterImage,
        twitterCard: data.twitterCard,
        internalLinks: body.internalLinks,
        externalLinks: body.externalLinks,
        publishedAt: data.status === 'publish' ? new Date() : undefined,
      },
    });

    // Revalidate the page on the live site so changes appear immediately
    try {
      revalidatePath(`/${page.slug}`);
      revalidatePath('/sitemap.xml');
      revalidateTag('pages');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Page update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await prisma.page.findUnique({ where: { id: params.id } });
    await prisma.page.delete({ where: { id: params.id } });

    try {
      if (page) revalidatePath(`/${page.slug}`);
      revalidatePath('/sitemap.xml');
      revalidateTag('pages');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Page delete error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
