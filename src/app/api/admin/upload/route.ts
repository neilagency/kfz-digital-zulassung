/**
 * Async Media Upload API
 * ======================
 * POST /api/admin/upload
 *
 * - Saves original to /public/uploads/media/YYYY/MM/
 * - Creates DB record immediately with processingStatus='pending'
 * - Returns instantly (no blocking sharp processing)
 * - Spawns background worker for variant generation
 * - Supports single and multi-file upload
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const CDN_BASE = (process.env.CDN_BASE_URL || '').replace(/\/+$/, '');

function detectMimeFromName(name: string): string | null {
  const ext = path.extname(name).toLowerCase();
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
  };
  return map[ext] || null;
}

const VARIANTS = [
  { name: 'thumbnail', width: 150, quality: 70 },
  { name: 'medium', width: 500, quality: 80 },
  { name: 'large', width: 1200, quality: 85 },
] as const;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'upload';
}

function cdnUrl(localPath: string): string {
  return CDN_BASE ? `${CDN_BASE}/${localPath}` : `/${localPath}`;
}

async function runSharpAsync(payload: {
  mediaId: string;
  localPath: string;
  thumbnailUrl: string;
  mediumUrl: string;
  largeUrl: string;
  webpUrl: string;
  avifUrl: string;
  mimeType: string;
}): Promise<{ success: boolean; mediaId: string; error?: string; width?: number; height?: number }> {
  // Inline fallback: run sharp processing directly (non-blocking via promises)
  try {
    const sharp = (await import('sharp')).default;
    const { readFile, writeFile } = await import('fs/promises');
    const { localPath, thumbnailUrl, mediumUrl, largeUrl, webpUrl, avifUrl } = payload;
    const inputPath = path.join(process.cwd(), 'public', localPath);
    const buffer = await readFile(inputPath);
    const meta = await sharp(buffer).metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;

    const dir = path.dirname(inputPath);
    const base = path.basename(localPath, path.extname(localPath));

    // Thumbnail
    await sharp(buffer)
      .resize(150, undefined, { withoutEnlargement: true })
      .webp({ quality: 70, effort: 4 })
      .toFile(path.join(dir, `${base}-thumbnail.webp`));

    // Medium
    await sharp(buffer)
      .resize(500, undefined, { withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toFile(path.join(dir, `${base}-medium.webp`));

    // Large
    await sharp(buffer)
      .resize(1200, undefined, { withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toFile(path.join(dir, `${base}-large.webp`));

    // WebP copy
    await sharp(buffer)
      .webp({ quality: 85, effort: 4 })
      .toFile(path.join(dir, `${base}.webp`));

    // AVIF copy
    await sharp(buffer)
      .avif({ quality: 75, effort: 4 })
      .toFile(path.join(dir, `${base}.avif`));

    return { success: true, mediaId: payload.mediaId, width, height };
  } catch (err: any) {
    console.error('runSharpAsync error:', err?.message);
    return { success: false, mediaId: payload.mediaId, error: err?.message };
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Processing timeout')), ms)),
  ]);
}

async function processMediaAsync(mediaId: string, localPath: string, mimeType: string, baseName: string, uniqueSuffix: string, dirRelative: string) {
  const isSvg = mimeType === 'image/svg+xml';
  const isGif = mimeType === 'image/gif';

  if (isSvg || isGif) {
    await prisma.media.update({
      where: { id: mediaId },
      data: { processingStatus: 'ready' },
    });
    return;
  }

  const thumbnailUrl = cdnUrl(`${dirRelative}/${baseName}-${uniqueSuffix}-thumbnail.webp`);
  const mediumUrl = cdnUrl(`${dirRelative}/${baseName}-${uniqueSuffix}-medium.webp`);
  const largeUrl = cdnUrl(`${dirRelative}/${baseName}-${uniqueSuffix}-large.webp`);
  const webpUrl = cdnUrl(`${dirRelative}/${baseName}-${uniqueSuffix}.webp`);
  const avifUrl = cdnUrl(`${dirRelative}/${baseName}-${uniqueSuffix}.avif`);

  await prisma.media.update({
    where: { id: mediaId },
    data: {
      thumbnailUrl,
      mediumUrl,
      largeUrl,
      webpUrl,
      avifUrl,
      processingStatus: 'processing',
    },
  });

  try {
    const result = await withTimeout(
      runSharpAsync({
        mediaId,
        localPath,
        thumbnailUrl,
        mediumUrl,
        largeUrl,
        webpUrl,
        avifUrl,
        mimeType,
      }),
      30_000,
    );

    if (result.success) {
      await prisma.media.update({
        where: { id: mediaId },
        data: {
          width: result.width ?? 0,
          height: result.height ?? 0,
          processingStatus: 'ready',
        },
      });
    } else {
      await prisma.media.update({
        where: { id: mediaId },
        data: { processingStatus: 'failed' },
      });
      console.error(`Media worker failed for ${mediaId}:`, result.error);
    }
  } catch (err: any) {
    await prisma.media.update({
      where: { id: mediaId },
      data: { processingStatus: 'failed' },
    });
    console.error(`Media worker error for ${mediaId}:`, err?.message);
  }
}

export async function POST(request: NextRequest) {
  console.time('[UPLOAD] Total');
  console.log('[UPLOAD] === POST request received ===');
  console.log('[UPLOAD] Request URL:', request.url);
  console.log('[UPLOAD] Content-Type:', request.headers.get('content-type'));
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];
    console.log('[UPLOAD] Files received:', files.length);
    files.forEach((f, i) => {
      console.log(`[UPLOAD] File[${i}]:`, { name: f.name, size: f.size, type: f.type, lastModified: f.lastModified });
    });

    if (!files.length) {
      console.warn('[upload] No files in formData');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const results = [];
    const processingPromises: Promise<void>[] = [];

    for (const file of files) {
      const detectedMime = file.type || detectMimeFromName(file.name);
      console.log(`[UPLOAD] Processing file: ${file.name}`);
      console.log(`[UPLOAD]   - size: ${file.size} bytes`);
      console.log(`[UPLOAD]   - client type: ${file.type}`);
      console.log(`[UPLOAD]   - detected MIME: ${detectedMime}`);

      if (!detectedMime || !ALLOWED_TYPES.includes(detectedMime)) {
        console.warn(`[upload] Rejected: ${file.name} — type=${file.type} detected=${detectedMime}`);
        results.push({ error: `${file.name}: Invalid type (${file.type || 'unknown'}). Allowed: JPG, PNG, GIF, WebP, SVG, AVIF` });
        continue;
      }
      if (file.size > MAX_SIZE) {
        console.warn(`[upload] Rejected: ${file.name} — size=${file.size} > ${MAX_SIZE}`);
        results.push({ error: `${file.name}: Too large. Max 10MB` });
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const origExt = path.extname(file.name).toLowerCase() || '.jpg';

      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const dirRelative = `uploads/media/${year}/${month}`;
      const dirAbsolute = path.join(process.cwd(), 'public', dirRelative);

      if (!existsSync(dirAbsolute)) {
        await mkdir(dirAbsolute, { recursive: true });
      }

      const baseName = slugify(file.name);
      const uniqueSuffix = Date.now().toString(36);
      const originalFileName = `${baseName}-${uniqueSuffix}${origExt}`;
      const targetPath = path.join(dirAbsolute, originalFileName);
      const relativePath = `${dirRelative}/${originalFileName}`;

      console.log(`[UPLOAD]   - baseName: ${baseName}`);
      console.log(`[UPLOAD]   - uniqueSuffix: ${uniqueSuffix}`);
      console.log(`[UPLOAD]   - originalFileName: ${originalFileName}`);
      console.log(`[UPLOAD]   - targetPath (absolute): ${targetPath}`);
      console.log(`[UPLOAD]   - relativePath: ${relativePath}`);

      const resolvedTarget = path.resolve(targetPath);
      const publicRoot = path.resolve(path.join(process.cwd(), 'public'));
      if (!resolvedTarget.startsWith(publicRoot + path.sep)) {
        console.error(`[UPLOAD]   - PATH TRAVERSAL BLOCKED: ${resolvedTarget} not in ${publicRoot}`);
        results.push({ error: `${file.name}: Invalid path` });
        continue;
      }

      const sourceUrl = cdnUrl(relativePath);
      console.log(`[UPLOAD]   - sourceUrl: ${sourceUrl}`);

      // For SVG/GIF, thumbnail = sourceUrl (no variants)
      const isSvgOrGif = detectedMime === 'image/svg+xml' || detectedMime === 'image/gif';

      const media = await prisma.media.create({
        data: {
          fileName: `${baseName}${origExt}`,
          originalName: file.name,
          title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').trim(),
          sourceUrl,
          localPath: `${dirRelative}/${originalFileName}`,
          thumbnailUrl: isSvgOrGif ? sourceUrl : '',
          mediumUrl: '',
          largeUrl: '',
          webpUrl: '',
          avifUrl: '',
          mimeType: detectedMime,
          width: 0,
          height: 0,
          fileSize: file.size,
          processingStatus: isSvgOrGif ? 'ready' : 'pending',
        },
      });
      console.log('[UPLOAD] DB record CREATED:', {
        id: media.id,
        fileName: media.fileName,
        originalName: media.originalName,
        sourceUrl: media.sourceUrl,
        localPath: media.localPath,
        mimeType: media.mimeType,
        fileSize: media.fileSize,
        processingStatus: media.processingStatus,
        createdAt: media.createdAt,
      });

      try {
        console.log(`[UPLOAD] Writing file to disk: ${targetPath}`);
        await writeFile(targetPath, buffer);
        console.log(`[UPLOAD] File WRITE SUCCESS: ${targetPath}`);
      } catch (writeErr: any) {
        console.error(`[UPLOAD] File WRITE FAILED: ${targetPath}`, writeErr?.message, writeErr?.code);
        await prisma.media.delete({ where: { id: media.id } }).catch(() => {});
        results.push({ error: `${file.name}: File write failed` });
        continue;
      }

      revalidateTag('media');
      console.log('[UPLOAD] revalidateTag("media") called');

      if (!isSvgOrGif) {
        processingPromises.push(
          processMediaAsync(
            media.id,
            media.localPath,
            detectedMime,
            baseName,
            uniqueSuffix,
            dirRelative,
          ).catch((err) => {
            console.error('Processing error:', err);
          })
        );
      }

      results.push({
        id: media.id,
        url: sourceUrl,
        thumbnailUrl: media.thumbnailUrl,
        mediumUrl: media.mediumUrl,
        largeUrl: media.largeUrl,
        webpUrl: media.webpUrl,
        avifUrl: media.avifUrl,
        fileName: media.fileName,
        title: media.title,
        width: media.width,
        height: media.height,
        size: file.size,
        processingStatus: media.processingStatus,
      });
    }

    // Fire-and-forget: Sharp runs in background; response already sent
    Promise.allSettled(processingPromises).catch(() => {});

    console.timeEnd('[UPLOAD] Total');
    console.log('[UPLOAD] Upload complete. Results count:', results.length);
    const successCount = results.filter(r => !('error' in r)).length;
    const errorCount = results.filter(r => 'error' in r).length;
    console.log(`[UPLOAD] Success: ${successCount}, Errors: ${errorCount}`);

    if (files.length === 1 && results.length === 1) {
      const r = results[0];
      if ('error' in r) {
        console.log('[UPLOAD] Returning SINGLE ERROR:', r);
        return NextResponse.json(r, { status: 400 });
      }
      console.log('[UPLOAD] Returning SINGLE SUCCESS:', JSON.stringify(r, null, 2));
      return NextResponse.json(r);
    }
    console.log('[UPLOAD] Returning MULTIPLE results:', JSON.stringify({ results }, null, 2));
    return NextResponse.json({ results });
  } catch (error: any) {
    console.timeEnd('[UPLOAD] Total');
    console.error('[UPLOAD] UNEXPECTED ERROR:', error?.message, error?.stack);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
