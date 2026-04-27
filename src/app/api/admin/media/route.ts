/**
 * Advanced Media Library API
 * ==========================
 * GET    /api/admin/media              — List media (paginated, searchable, filterable)
 * GET    /api/admin/media?stats=true   — Media analytics (storage, counts, most used)
 * POST   /api/admin/media              — Update metadata OR replace image
 * DELETE /api/admin/media?id=xxx       — Safe delete (warns if in use)
 * PUT    /api/admin/media              — Scan & update usage tracking across all content
 */

import { NextRequest, NextResponse } from 'next/server';
import { unlink, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

// Path traversal guard: ensure resolved path stays inside public/
function resolvePublicPath(urlPath: string): string {
  const abs = path.join(process.cwd(), 'public', urlPath.replace(/^\//, ''));
  const resolved = path.resolve(abs);
  const publicRoot = path.resolve(path.join(process.cwd(), 'public'));
  if (!resolved.startsWith(publicRoot + path.sep)) {
    throw new Error('Path traversal detected');
  }
  return resolved;
}

function safePublicPath(urlPath: string): string | null {
  try { return resolvePublicPath(urlPath); } catch { return null; }
}

// Dynamic import: sharp may not be available on all platforms
let _sharp: typeof import('sharp') | null = null;
async function getSharp() {
  if (_sharp !== null) return _sharp;
  try {
    _sharp = (await import('sharp')).default as any;
    return _sharp;
  } catch {
    _sharp = null as any;
    return null;
  }
}

const CDN_BASE = (process.env.CDN_BASE_URL || '').replace(/\/+$/, '');

function cdnUrl(localPath: string): string {
  return CDN_BASE ? `${CDN_BASE}/${localPath}` : `/${localPath}`;
}

// ── GET: List media or fetch analytics ──────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Analytics mode
    if (searchParams.get('stats') === 'true') {
      const [totalCount, totalSizeResult, topUsed, byType] = await Promise.all([
        prisma.media.count(),
        prisma.media.aggregate({ _sum: { fileSize: true } }),
        prisma.media.findMany({
          where: { useCount: { gt: 0 } },
          orderBy: { useCount: 'desc' },
          take: 10,
          select: { id: true, fileName: true, thumbnailUrl: true, sourceUrl: true, useCount: true },
        }),
        prisma.media.groupBy({
          by: ['mimeType'],
          _count: true,
          _sum: { fileSize: true },
        }),
      ]);

      return NextResponse.json({
        totalFiles: totalCount,
        totalStorage: totalSizeResult._sum.fileSize || 0,
        topUsed,
        byType: byType.map((t) => ({
          type: t.mimeType,
          count: t._count,
          size: t._sum.fileSize || 0,
        })),
      });
    }

    // Normal list mode
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);
    const search = searchParams.get('search') || '';
    const imagesOnly = searchParams.get('imagesOnly') !== 'false';
    const folder = searchParams.get('folder') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDir = (searchParams.get('sortDir') || 'desc') as 'asc' | 'desc';
    const stats = searchParams.get('stats') === 'true';
    const _t = searchParams.get('_t');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { fileName: { contains: search } },
        { title: { contains: search } },
        { altText: { contains: search } },
        { originalName: { contains: search } },
      ];
    }
    if (folder) where.folder = folder;
    if (imagesOnly) {
      where.mimeType = { startsWith: 'image/' };
    }

    const [folders, media, total] = await Promise.all([
      prisma.$queryRaw<{ folder: string; cnt: bigint }[]>`
        SELECT "folder", COUNT(*) as cnt FROM "Media" WHERE "folder" != '' GROUP BY "folder"
      `.then((raw) => raw.map((f) => ({ name: f.folder, count: Number(f.cnt) }))),
      prisma.media.findMany({
        where,
        select: {
          id: true,
          fileName: true,
          originalName: true,
          title: true,
          altText: true,
          sourceUrl: true,
          localPath: true,
          thumbnailUrl: true,
          mediumUrl: true,
          largeUrl: true,
          webpUrl: true,
          avifUrl: true,
          mimeType: true,
          width: true,
          height: true,
          fileSize: true,
          folder: true,
          usedIn: true,
          useCount: true,
          processingStatus: true,
          createdAt: true,
        },
        orderBy: { [sortBy]: sortDir },
        skip,
        take: limit,
      }),
      prisma.media.count({ where }),
    ]);
    const pages = Math.ceil(total / limit);
    const pagination = { page, limit, total, pages };

    const responseData = { media, folders, pagination };

    return NextResponse.json(responseData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=5, stale-while-revalidate=30',
      },
    });
  } catch (error: any) {
    console.error('[MEDIA_GET] ERROR:', error?.message, error?.stack);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// ── POST: Update metadata OR replace image ──────────────────
export async function POST(request: NextRequest) {
  console.log('[media POST] Request received');
  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('[media POST] Content-Type:', contentType);

    // Replace image (multipart form with file + id)
    if (contentType.includes('multipart/form-data')) {
      console.log('[media POST] Replace image mode');
      const formData = await request.formData();
      const id = formData.get('id') as string;
      const file = formData.get('file') as File;
      console.log('[media POST] Replace params:', { id, fileName: file?.name, fileSize: file?.size });

      if (!id || !file) {
        return NextResponse.json({ error: 'ID and file required for replace' }, { status: 400 });
      }

      const existing = await prisma.media.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: 'Media not found' }, { status: 404 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Overwrite the original file at the SAME path (keeps same URL)
      const absPath = safePublicPath(existing.localPath);
      if (!absPath) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
      }
      await writeFile(absPath, buffer);

      // Get new dimensions
      let width = existing.width;
      let height = existing.height;
      const isSvg = file.type === 'image/svg+xml';
      const isGif = file.type === 'image/gif';

      if (!isSvg && !isGif) {
        const sharpModule = await getSharp();
        if (sharpModule) {
          const meta = await (sharpModule as any)(buffer).metadata();
          width = meta.width || 0;
          height = meta.height || 0;

          // Regenerate variants at existing paths
          if (existing.thumbnailUrl && existing.thumbnailUrl !== existing.sourceUrl) {
            const thumbAbs = safePublicPath(existing.thumbnailUrl);
            if (!thumbAbs) return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
            await (sharpModule as any)(buffer).resize(150, null, { withoutEnlargement: true }).webp({ quality: 70 }).toFile(thumbAbs);
          }
          if (existing.mediumUrl) {
            const medAbs = safePublicPath(existing.mediumUrl);
            if (!medAbs) return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
            await (sharpModule as any)(buffer).resize(500, null, { withoutEnlargement: true }).webp({ quality: 80 }).toFile(medAbs);
          }
          if (existing.largeUrl) {
            const lgAbs = safePublicPath(existing.largeUrl);
            if (!lgAbs) return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
            await (sharpModule as any)(buffer).resize(1200, null, { withoutEnlargement: true }).webp({ quality: 85 }).toFile(lgAbs);
          }
          if (existing.webpUrl) {
            const webpAbs = safePublicPath(existing.webpUrl);
            if (!webpAbs) return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
            await (sharpModule as any)(buffer).webp({ quality: 85 }).toFile(webpAbs);
          }
          if (existing.avifUrl) {
            try {
              const avifAbs = safePublicPath(existing.avifUrl);
              if (!avifAbs) return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
              await (sharpModule as any)(buffer).avif({ quality: 65 }).toFile(avifAbs);
            } catch { /* avif may not be supported */ }
          }
        }
      }

      const updated = await prisma.media.update({
        where: { id },
        data: { width, height, fileSize: file.size, mimeType: file.type },
      });
        revalidateTag('media');
      return NextResponse.json(updated);
    }

    // Update metadata (JSON body)
    const body = await request.json();
    const { id, fileName, altText, title, folder } = body;

    if (!id) {
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
    }

    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const data: any = {};
    if (fileName !== undefined) {
      data.fileName = fileName
        .toLowerCase()
        .replace(/[^a-z0-9.-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (altText !== undefined) data.altText = altText;
    if (title !== undefined) data.title = title;
    if (folder !== undefined) data.folder = folder;

    const updated = await prisma.media.update({ where: { id }, data });
    revalidateTag('media');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[media POST] Error:', error);
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

// ── DELETE: Safe delete with usage check ────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const force = searchParams.get('force') === 'true';
    console.log('[DELETE] Params:', { id, force, fullUrl: request.url });

    if (!id) {
      console.warn('[DELETE] No ID provided');
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
    }

    console.log(`[DELETE] Looking up media ID: ${id}`);
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      console.warn(`[DELETE] Media NOT FOUND: ${id}`);
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }
    console.log('[DELETE] Media found:', {
      id: media.id,
      fileName: media.fileName,
      localPath: media.localPath,
      useCount: media.useCount,
      usedIn: media.usedIn,
    });

    // Check usage — block delete if in use (unless force=true)
    let usedIn: any[] = [];
    try {
      usedIn = JSON.parse(media.usedIn || '[]');
    } catch {
      usedIn = [];
    }
    if (usedIn.length > 0 && !force) {
      return NextResponse.json({
        error: 'Bild wird noch verwendet',
        usedIn,
        useCount: usedIn.length,
        requireForce: true,
      }, { status: 409 });
    }

    // Delete all variant files from disk
    const urlsToDelete = [
      media.localPath,
      media.thumbnailUrl,
      media.mediumUrl,
      media.largeUrl,
      media.webpUrl,
      media.avifUrl,
    ].filter(Boolean);
    console.log('[DELETE] Files to delete:', urlsToDelete);

    for (const urlPath of urlsToDelete) {
      let absPath: string | null;
      try {
        absPath = resolvePublicPath(urlPath);
      } catch {
        console.error(`[DELETE] Invalid path: ${urlPath}`);
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
      }
      if (existsSync(absPath)) {
        try {
          await unlink(absPath);
          console.log(`[DELETE] File deleted: ${absPath}`);
        } catch (err: any) {
          console.warn(`[DELETE] File delete failed (non-critical): ${absPath}`, err?.message);
        }
      } else {
        }
    }

    await prisma.media.delete({ where: { id } });

    revalidateTag('media');

    // Cascade cleanup: clear featuredImage/ogImage in blog posts that reference deleted URLs
    const deletedUrls = [
      media.sourceUrl,
      media.localPath,
      media.thumbnailUrl,
      media.mediumUrl,
      media.largeUrl,
      media.webpUrl,
      media.avifUrl,
    ].filter((u): u is string => Boolean(u));

    if (deletedUrls.length > 0) {
      const affectedPosts = await prisma.blogPost.findMany({
        where: { featuredImage: { in: deletedUrls } },
        select: { id: true, slug: true },
      });
      if (affectedPosts.length > 0) {
        await prisma.blogPost.updateMany({
          where: { featuredImage: { in: deletedUrls } },
          data: { featuredImage: '' },
        });
        for (const p of affectedPosts) {
          try { revalidatePath(`/insiderwissen/${p.slug}`); } catch {}
        }
        revalidatePath('/insiderwissen', 'page');
        revalidateTag('blog-posts');
        console.log(`[DELETE] Cascade-cleared featuredImage in ${affectedPosts.length} post(s)`);
      }
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error('[DELETE] ERROR:', error?.message, error?.stack);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}

// ── PUT: Scan & update usage tracking (batched, low-memory) ──
export async function PUT() {
  try {
    const CONTENT_BATCH = 200;
    const UPDATE_BATCH = 50;

    const allMedia = await prisma.media.findMany({
      select: { id: true, sourceUrl: true, thumbnailUrl: true, webpUrl: true },
    });

    const mediaDedup = new Map<string, Set<string>>();
    const mediaRefs = new Map<string, { type: string; id: string; field: string; title: string }[]>();

    for (const m of allMedia) {
      mediaDedup.set(m.id, new Set());
      mediaRefs.set(m.id, []);
    }

    async function* paginateContent<T>(
      query: (args: { skip: number; take: number }) => Promise<T[]>
    ) {
      let skip = 0;
      while (true) {
        const chunk = await query({ skip, take: CONTENT_BATCH });
        if (chunk.length === 0) break;
        yield chunk;
        skip += CONTENT_BATCH;
      }
    }

    async function scanType(
      type: string,
      query: (args: { skip: number; take: number }) => Promise<any[]>,
      titleKey: string,
    ) {
      for await (const chunk of paginateContent(query)) {
        for (const c of chunk) {
          const title = c[titleKey] || '';
          const fields = [
            { name: 'featuredImage', value: c.featuredImage || '' },
            { name: 'content', value: c.content || '' },
            { name: 'ogImage', value: c.ogImage || '' },
          ];
          for (const m of allMedia) {
            const urls = [m.sourceUrl, m.thumbnailUrl, m.webpUrl].filter(Boolean);
            if (!urls.length) continue;

            for (const field of fields) {
              if (urls.some((url) => field.value.includes(url))) {
                const dedupKey = `${type}:${c.id}:${field.name}`;
                const set = mediaDedup.get(m.id)!;
                if (!set.has(dedupKey)) {
                  set.add(dedupKey);
                  mediaRefs.get(m.id)!.push({ type, id: c.id, field: field.name, title });
                }
              }
            }
          }
        }
      }
    }

    await scanType('blog', (args) =>
      prisma.blogPost.findMany({
        ...args,
        select: { id: true, title: true, featuredImage: true, content: true, ogImage: true },
      }),
      'title',
    );

    await scanType('page', (args) =>
      prisma.page.findMany({
        ...args,
        select: { id: true, title: true, featuredImage: true, content: true, ogImage: true },
      }),
      'title',
    );

    await scanType('product', (args) =>
      prisma.product.findMany({
        ...args,
        select: { id: true, name: true, featuredImage: true, content: true, ogImage: true },
      }),
      'name',
    );

    const updates: { id: string; usedIn: string; useCount: number }[] = [];
    for (const m of allMedia) {
      const refs = mediaRefs.get(m.id)!;
      updates.push({ id: m.id, usedIn: JSON.stringify(refs), useCount: refs.length });
    }

    for (let i = 0; i < updates.length; i += UPDATE_BATCH) {
      const batch = updates.slice(i, i + UPDATE_BATCH);
      await prisma.$transaction(
        batch.map((u) =>
          prisma.media.update({
            where: { id: u.id },
            data: { usedIn: u.usedIn, useCount: u.useCount },
          }),
        ),
      );
    }

    return NextResponse.json({ success: true, scanned: allMedia.length, updated: updates.length });
  } catch (error) {
    console.error('Usage scan error:', error);
    return NextResponse.json({ error: 'Failed to scan usage' }, { status: 500 });
  }
}
