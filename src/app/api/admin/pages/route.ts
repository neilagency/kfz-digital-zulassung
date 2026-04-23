import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { pageCreateSchema, formatZodErrors } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;

  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { slug: { contains: search } },
      { metaTitle: { contains: search } },
      { focusKeywords: { contains: search } },
    ];
  }

  try {
    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          wpPageId: true,
          title: true,
          slug: true,
          status: true,
          author: true,
          template: true,
          metaTitle: true,
          metaDescription: true,
          seoScore: true,
          robots: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.page.count({ where }),
    ]);

    return NextResponse.json({
      pages,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Pages API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod validation
    const parsed = pageCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
    }
    const data = parsed.data;

    const page = await prisma.page.create({
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
        publishedAt: data.status === 'publish' ? new Date() : null,
      },
    });

    try {
      revalidatePath(`/${page.slug}`);
      revalidatePath('/sitemap.xml');
      revalidateTag('pages');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Page create error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
