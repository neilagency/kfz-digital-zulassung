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

// Folders cache (60s TTL) - avoids expensive groupBy on every list request
let foldersCache: { data: { name: string; count: number }[]; ts: number } | null = null;
const FOLDERS_CACHE_TTL = 60_000;

// Media list cache (10s TTL)
let mediaListCache: Map<string, { data: any; ts: number }> = new Map();
const MEDIA_CACHE_TTL = 30_000;

// Total count cache (30s TTL)
let mediaTotalCache: Map<string, { total: number; ts: number }> = new Map();
const MEDIA_TOTAL_TTL = 30_000;

async function getCachedFolders() {
  if (foldersCache && Date.now() - foldersCache.ts < FOLDERS_CACHE_TTL) {
    return foldersCache.data;
  }
  const raw = await prisma.$queryRaw<{ folder: string; cnt: bigint }[]>`
    SELECT "folder", COUNT(*) as cnt FROM "Media" WHERE "folder" != '' GROUP BY "folder"
  `;
  const folders = raw.map((f) => ({ name: f.folder, count: Number(f.cnt) }));
  foldersCache = { data: folders, ts: Date.now() };
  return folders;
}

function getFreshMediaTotal(cacheKey: string) {
  const cached = mediaTotalCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < MEDIA_TOTAL_TTL) {
    return cached.total;
  }
  return null;
}

function storeMediaTotal(cacheKey: string, total: number) {
  mediaTotalCache.set(cacheKey, { total, ts: Date.now() });
  if (mediaTotalCache.size > 30) {
    const now = Date.now();
    for (const [key, value] of mediaTotalCache) {
      if (now - value.ts > MEDIA_TOTAL_TTL) mediaTotalCache.delete(key);
    }
  }
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

const CDN_BASE = process.env.CDN_BASE_URL || '';

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '24'), 100);
    const search = searchParams.get('search') || '';
    const folder = searchParams.get('folder') || '';
    const mimeType = searchParams.get('mimeType') || '';
    const imagesOnly = searchParams.get('imagesOnly') !== 'false'; // default: true
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDir = (searchParams.get('sortDir') || 'desc') as 'asc' | 'desc';
    const skip = (page - 1) * limit;

    // Check cache
    const cacheKey = `media:${page}:${limit}:${search}:${folder}:${mimeType}:${imagesOnly}:${sortBy}:${sortDir}`;
    const cached = mediaListCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < MEDIA_CACHE_TTL) {
      return new NextResponse(JSON.stringify(cached.data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=5, stale-while-revalidate=30',
          'X-Cache': 'HIT',
        },
      });
    }

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
    if (mimeType) {
      where.mimeType = { contains: mimeType };
    } else if (imagesOnly) {
      where.mimeType = { startsWith: 'image/' };
    }

    const totalCacheKey = `media-total:${search}:${folder}:${mimeType}:${imagesOnly}`;
    const cachedTotal = getFreshMediaTotal(totalCacheKey);

    const foldersPromise = getCachedFolders();

    let folders: { name: string; count: number }[];
    let media;
    let total;

    if (cachedTotal != null) {
      [folders, media] = await Promise.all([
        foldersPromise,
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
            mimeType: true,
            width: true,
            height: true,
            fileSize: true,
            folder: true,
            useCount: true,
            createdAt: true,
          },
          orderBy: { [sortBy]: sortDir },
          skip,
          take: limit,
        }),
      ]);
      total = cachedTotal;
    } else {
      const [resolvedFolders, queryResult] = await Promise.all([
        foldersPromise,
        prisma.$transaction([
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
              mimeType: true,
              width: true,
              height: true,
              fileSize: true,
              folder: true,
              useCount: true,
              createdAt: true,
            },
            orderBy: { [sortBy]: sortDir },
            skip,
            take: limit,
          }),
          prisma.media.count({ where }),
        ]),
      ]);
      folders = resolvedFolders;
      [media, total] = queryResult;
      storeMediaTotal(totalCacheKey, total);
    }

    // Truncate base64 data URLs in list responses for performance
    const cleanMedia = media.map((m) => ({
      ...m,
      sourceUrl: m.sourceUrl.startsWith('data:') ? m.sourceUrl.slice(0, 50) + '...' : m.sourceUrl,
    }));

    const responseData = {
      media: cleanMedia,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      folders,
    };

    // Store in cache
    mediaListCache.set(cacheKey, { data: responseData, ts: Date.now() });
    if (mediaListCache.size > 30) {
      const now = Date.now();
      for (const [k, v] of mediaListCache) {
        if (now - v.ts > MEDIA_CACHE_TTL) mediaListCache.delete(k);
      }
    }

    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=5, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Media list error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// ── POST: Update metadata OR replace image ──────────────────
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Replace image (multipart form with file + id)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const id = formData.get('id') as string;
      const file = formData.get('file') as File;

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
      const absPath = path.join(process.cwd(), 'public', existing.localPath);
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
          const dirAbsolute = path.join(process.cwd(), 'public', path.dirname(existing.localPath));
          const basePart = existing.localPath.replace(/\.[^.]+$/, ''); // without extension

          // Rebuild thumbnail
          if (existing.thumbnailUrl && existing.thumbnailUrl !== existing.sourceUrl) {
            const thumbAbs = path.join(process.cwd(), 'public', existing.thumbnailUrl.replace(/^\//, ''));
            await (sharpModule as any)(buffer).resize(150, null, { withoutEnlargement: true }).webp({ quality: 70 }).toFile(thumbAbs);
          }
          if (existing.mediumUrl) {
            const medAbs = path.join(process.cwd(), 'public', existing.mediumUrl.replace(/^\//, ''));
            await (sharpModule as any)(buffer).resize(500, null, { withoutEnlargement: true }).webp({ quality: 80 }).toFile(medAbs);
          }
          if (existing.largeUrl) {
            const lgAbs = path.join(process.cwd(), 'public', existing.largeUrl.replace(/^\//, ''));
            await (sharpModule as any)(buffer).resize(1200, null, { withoutEnlargement: true }).webp({ quality: 85 }).toFile(lgAbs);
          }
          if (existing.webpUrl) {
            const webpAbs = path.join(process.cwd(), 'public', existing.webpUrl.replace(/^\//, ''));
            await (sharpModule as any)(buffer).webp({ quality: 85 }).toFile(webpAbs);
          }
          if (existing.avifUrl) {
            try {
              const avifAbs = path.join(process.cwd(), 'public', existing.avifUrl.replace(/^\//, ''));
              await (sharpModule as any)(buffer).avif({ quality: 65 }).toFile(avifAbs);
            } catch { /* avif may not be supported */ }
          }
        }
      }

      const updated = await prisma.media.update({
        where: { id },
        data: { width, height, fileSize: file.size, mimeType: file.type },
      });

      mediaListCache.clear();
      mediaTotalCache.clear();
      foldersCache = null;
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
    mediaListCache.clear();
    mediaTotalCache.clear();
    foldersCache = null;
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Media update error:', error);
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

// ── DELETE: Safe delete with usage check ────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const force = searchParams.get('force') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
    }

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Check usage — block delete if in use (unless force=true)
    const usedIn = JSON.parse(media.usedIn || '[]');
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

    for (const urlPath of urlsToDelete) {
      const cleaned = urlPath.replace(/^\//, '');
      const absPath = path.join(process.cwd(), 'public', cleaned);
      if (existsSync(absPath)) {
        try { await unlink(absPath); } catch { /* ignore */ }
      }
    }

    await prisma.media.delete({ where: { id } });
    mediaListCache.clear();
    mediaTotalCache.clear();
    foldersCache = null;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}

// ── PUT: Scan & update usage tracking ───────────────────────
export async function PUT() {
  try {
    // Fetch all media URLs
    const allMedia = await prisma.media.findMany({
      select: { id: true, sourceUrl: true, thumbnailUrl: true, webpUrl: true },
    });

    // Fetch all content that references images
    const [posts, pages, products] = await Promise.all([
      prisma.blogPost.findMany({
        select: { id: true, title: true, featuredImage: true, content: true, ogImage: true },
      }),
      prisma.page.findMany({
        select: { id: true, title: true, featuredImage: true, content: true, ogImage: true },
      }),
      prisma.product.findMany({
        select: { id: true, name: true, featuredImage: true, content: true, ogImage: true },
      }),
    ]);

    // Build a reverse index: URL substring → media IDs
    // This avoids O(media × content) nested loops
    const allContent = [
      ...posts.map((p) => ({ ...p, type: 'blog' as const })),
      ...pages.map((p) => ({ ...p, type: 'page' as const, name: undefined })),
      ...products.map((p) => ({ ...p, type: 'product' as const, title: undefined })),
    ];

    // Concatenate all content fields per content item for fast substring search
    const contentStrings = allContent.map((c) => ({
      type: c.type,
      id: c.id,
      title: 'title' in c && c.title ? c.title : 'name' in c && c.name ? c.name : '',
      combined: [c.featuredImage || '', c.content || '', c.ogImage || ''].join('\n'),
      featuredImage: c.featuredImage || '',
      content: c.content || '',
      ogImage: c.ogImage || '',
    }));

    // Batch: compute all refs, then batch update
    const updates: { id: string; usedIn: string; useCount: number }[] = [];

    for (const m of allMedia) {
      const urls = [m.sourceUrl, m.thumbnailUrl, m.webpUrl].filter(Boolean);
      if (urls.length === 0) {
        updates.push({ id: m.id, usedIn: '[]', useCount: 0 });
        continue;
      }

      const refs: { type: string; id: string; field: string; title: string }[] = [];

      for (const c of contentStrings) {
        // Quick check: does any URL appear in the combined string?
        const hasMatch = urls.some((url) => c.combined.includes(url));
        if (!hasMatch) continue;

        // Detailed field-level matching
        for (const url of urls) {
          if (c.featuredImage.includes(url)) {
            refs.push({ type: c.type, id: c.id, field: 'featuredImage', title: c.title });
            break; // one ref per content item per field is enough
          }
        }
        for (const url of urls) {
          if (c.content.includes(url)) {
            refs.push({ type: c.type, id: c.id, field: 'content', title: c.title });
            break;
          }
        }
        for (const url of urls) {
          if (c.ogImage.includes(url)) {
            refs.push({ type: c.type, id: c.id, field: 'ogImage', title: c.title });
            break;
          }
        }
      }

      updates.push({ id: m.id, usedIn: JSON.stringify(refs), useCount: refs.length });
    }

    // Batch updates in chunks of 50 using transactions
    const BATCH_SIZE = 50;
    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
      const batch = updates.slice(i, i + BATCH_SIZE);
      await prisma.$transaction(
        batch.map((u) =>
          prisma.media.update({
            where: { id: u.id },
            data: { usedIn: u.usedIn, useCount: u.useCount },
          })
        )
      );
    }

    return NextResponse.json({ success: true, scanned: allMedia.length, updated: updates.length });
  } catch (error) {
    console.error('Usage scan error:', error);
    return NextResponse.json({ error: 'Failed to scan usage' }, { status: 500 });
  }
}
