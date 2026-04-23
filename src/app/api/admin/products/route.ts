import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';
import { productCreateSchema, productUpdateSchema, formatZodErrors } from '@/lib/validations';

export const dynamic = 'force-dynamic';

// In-memory cache for product list (10s TTL)
let productListCache: Map<string, { data: any; ts: number }> = new Map();
const PRODUCT_CACHE_TTL = 30_000;

// Total count cache (30s TTL)
let productTotalCache: Map<string, { total: number; ts: number }> = new Map();
const PRODUCT_TOTAL_TTL = 30_000;

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

function getFreshProductTotal(cacheKey: string) {
  const cached = productTotalCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < PRODUCT_TOTAL_TTL) {
    return cached.total;
  }
  return null;
}

function storeProductTotal(cacheKey: string, total: number) {
  productTotalCache.set(cacheKey, { total, ts: Date.now() });
  if (productTotalCache.size > 30) {
    const now = Date.now();
    for (const [key, value] of productTotalCache) {
      if (now - value.ts > PRODUCT_TOTAL_TTL) productTotalCache.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Single product by ID (for edit form)
  const id = searchParams.get('id');
  if (id) {
    try {
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(product);
    } catch (error) {
      console.error('Product fetch error:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || undefined;

  // If ?all=true, return all products (for dropdowns etc.)
  const fetchAll = searchParams.get('all') === 'true';

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { slug: { contains: search } },
      { serviceType: { contains: search } },
    ];
  }

  try {
    if (fetchAll) {
      const cacheKey = 'products:all';
      const cached = productListCache.get(cacheKey);
      if (cached && Date.now() - cached.ts < PRODUCT_CACHE_TTL) {
        return jsonResponse(cached.data, 5, true);
      }
      const products = await prisma.product.findMany({
        select: { id: true, name: true, slug: true, price: true, isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 500, // Safety cap
      });
      productListCache.set(cacheKey, { data: products, ts: Date.now() });
      return jsonResponse(products);
    }

    const cacheKey = `products:${page}:${limit}:${search || ''}`;
    const cached = productListCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < PRODUCT_CACHE_TTL) {
      return jsonResponse(cached.data, 5, true);
    }

    const totalCacheKey = `products-total:${search || ''}`;
    const cachedTotal = getFreshProductTotal(totalCacheKey);

    let products;
    let total;

    if (cachedTotal != null) {
      products = await prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          isActive: true,
          serviceType: true,
          formType: true,
          featuredImage: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });
      total = cachedTotal;
    } else {
      [products, total] = await prisma.$transaction([
        prisma.product.findMany({
          where,
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            isActive: true,
            serviceType: true,
            formType: true,
            featuredImage: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.product.count({ where }),
      ]);
      storeProductTotal(totalCacheKey, total);
    }

    const result = {
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };

    productListCache.set(cacheKey, { data: result, ts: Date.now() });
    if (productListCache.size > 30) {
      const now = Date.now();
      for (const [k, v] of productListCache) {
        if (now - v.ts > PRODUCT_CACHE_TTL) productListCache.delete(k);
      }
    }

    return jsonResponse(result);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod validation
    const parsed = productCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
    }
    const data = parsed.data;

    // Generate slug from name if not provided
    const slug = data.slug || data.name
      .toLowerCase()
      .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        price: data.price,
        description: data.description,
        options: data.options,
        isActive: data.isActive,
        serviceType: data.serviceType,
        content: data.content,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        featuredImage: data.featuredImage,
        faqItems: data.faqItems,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        canonical: data.canonical,
        robots: data.robots,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        formType: data.formType,
      },
    });

    productListCache.clear();
    productTotalCache.clear();
    try {
      revalidatePath('/');
      revalidatePath('/sitemap.xml');
      revalidateTag('products');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod validation
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
    }
    const data = parsed.data;

    const product = await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug,
        price: data.price,
        description: data.description,
        options: data.options,
        isActive: data.isActive,
        serviceType: data.serviceType,
        content: data.content,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        featuredImage: data.featuredImage,
        faqItems: data.faqItems,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        canonical: data.canonical,
        robots: data.robots,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        formType: data.formType,
      },
    });

    productListCache.clear();
    productTotalCache.clear();
    try {
      revalidatePath('/');
      revalidatePath(`/product/${product.slug}`);
      revalidatePath('/sitemap.xml');
      revalidateTag('products');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });

    productListCache.clear();
    productTotalCache.clear();
    try {
      revalidatePath('/');
      revalidatePath('/sitemap.xml');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
