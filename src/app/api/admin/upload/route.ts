/**
 * Advanced Media Upload API
 * =========================
 * POST /api/admin/upload
 *
 * - Saves original to /public/uploads/media/YYYY/MM/
 * - Generates optimized variants via sharp:
 *   • thumbnail (150px), medium (500px), large (1200px)
 *   • WebP and AVIF conversions
 * - SEO-friendly slugified filenames (German umlaut-safe)
 * - Registers all variants in the Media table
 * - Supports single and multi-file upload
 * - CDN_BASE_URL support for external CDN delivery
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

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

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const CDN_BASE = process.env.CDN_BASE_URL || '';  // e.g. https://cdn.onlineautoabmelden.com

// Variant sizes
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

async function generateVariants(
  buffer: Buffer,
  dirAbsolute: string,
  dirRelative: string,
  baseName: string,
  uniqueSuffix: string,
  mimeType: string,
) {
  const isSvg = mimeType === 'image/svg+xml';
  const isGif = mimeType === 'image/gif';

  // SVGs and GIFs: no optimization, return original paths
  if (isSvg || isGif) {
    return { variants: {}, metadata: { width: 0, height: 0 } };
  }

  const sharpModule = await getSharp();
  if (!sharpModule) {
    // sharp not available — skip optimization, save original only
    return { variants: {}, metadata: { width: 0, height: 0 } };
  }

  const image = (sharpModule as any)(buffer);
  const metadata = await image.metadata();
  const origWidth = metadata.width || 0;
  const origHeight = metadata.height || 0;

  const variants: Record<string, string> = {};

  // Generate sized variants (as WebP for best compression)
  for (const variant of VARIANTS) {
    if (origWidth <= variant.width) continue; // Skip if original is smaller

    const variantFileName = `${baseName}-${uniqueSuffix}-${variant.name}.webp`;
    const variantPath = path.join(dirAbsolute, variantFileName);

    await (sharpModule as any)(buffer)
      .resize(variant.width, null, { withoutEnlargement: true })
      .webp({ quality: variant.quality })
      .toFile(variantPath);

    variants[`${variant.name}Url`] = cdnUrl(`${dirRelative}/${variantFileName}`);
  }

  // Generate WebP version at original size
  const webpFileName = `${baseName}-${uniqueSuffix}.webp`;
  const webpPath = path.join(dirAbsolute, webpFileName);
  await (sharpModule as any)(buffer)
    .webp({ quality: 85 })
    .toFile(webpPath);
  variants.webpUrl = cdnUrl(`${dirRelative}/${webpFileName}`);

  // Generate AVIF version at original size
  try {
    const avifFileName = `${baseName}-${uniqueSuffix}.avif`;
    const avifPath = path.join(dirAbsolute, avifFileName);
    await (sharpModule as any)(buffer)
      .avif({ quality: 65 })
      .toFile(avifPath);
    variants.avifUrl = cdnUrl(`${dirRelative}/${avifFileName}`);
  } catch {
    // AVIF encoding may fail on some systems — silently skip
  }

  return { variants, metadata: { width: origWidth, height: origHeight } };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        results.push({ error: `${file.name}: Invalid type. Allowed: JPG, PNG, GIF, WebP, SVG, AVIF` });
        continue;
      }
      if (file.size > MAX_SIZE) {
        results.push({ error: `${file.name}: Too large. Max 10MB` });
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const origExt = path.extname(file.name).toLowerCase() || '.jpg';

      // Date-based directory
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const dirRelative = `uploads/media/${year}/${month}`;
      const dirAbsolute = path.join(process.cwd(), 'public', dirRelative);

      if (!existsSync(dirAbsolute)) {
        await mkdir(dirAbsolute, { recursive: true });
      }

      // SEO-friendly filename with unique suffix
      const baseName = slugify(file.name);
      const uniqueSuffix = Date.now().toString(36);
      const originalFileName = `${baseName}-${uniqueSuffix}${origExt}`;

      // Write original file to disk
      await writeFile(path.join(dirAbsolute, originalFileName), buffer);

      const sourceUrl = cdnUrl(`${dirRelative}/${originalFileName}`);

      // Generate optimized variants
      const { variants, metadata } = await generateVariants(
        buffer, dirAbsolute, dirRelative, baseName, uniqueSuffix, file.type,
      );

      // Register in Media table
      const media = await prisma.media.create({
        data: {
          fileName: `${baseName}${origExt}`,
          originalName: file.name,
          title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').trim(),
          sourceUrl,
          localPath: `${dirRelative}/${originalFileName}`,
          thumbnailUrl: variants.thumbnailUrl || sourceUrl,
          mediumUrl: variants.mediumUrl || '',
          largeUrl: variants.largeUrl || '',
          webpUrl: variants.webpUrl || '',
          avifUrl: variants.avifUrl || '',
          mimeType: file.type,
          width: metadata.width,
          height: metadata.height,
          fileSize: file.size,
        },
      });

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
        width: metadata.width,
        height: metadata.height,
        size: file.size,
      });
    }

    // Single file → return object directly for backward compatibility
    if (files.length === 1 && results.length === 1) {
      const r = results[0];
      if ('error' in r) return NextResponse.json(r, { status: 400 });
      return NextResponse.json(r);
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 },
    );
  }
}
