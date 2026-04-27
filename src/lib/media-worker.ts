/**
 * Media Processing Worker — Background Sharp Pipeline
 * Spawned via worker_threads from upload route.
 * Processes: thumbnail, medium, large, webp, avif variants.
 */
import { parentPort, workerData } from 'worker_threads';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

interface WorkerPayload {
  mediaId: string;
  localPath: string;
  thumbnailUrl: string;
  mediumUrl: string;
  largeUrl: string;
  webpUrl: string;
  avifUrl: string;
  mimeType: string;
}

async function run() {
  const {
    mediaId,
    localPath,
    thumbnailUrl,
    mediumUrl,
    largeUrl,
    webpUrl,
    avifUrl,
    mimeType,
  } = workerData as WorkerPayload;

  try {
    const sharpModule = await import('sharp').then((m) => m.default).catch(() => null);
    if (!sharpModule) {
      parentPort?.postMessage({ success: false, mediaId, error: 'sharp not available' });
      return;
    }

    const isSvg = mimeType === 'image/svg+xml';
    const isGif = mimeType === 'image/gif';

    if (isSvg || isGif) {
      parentPort?.postMessage({ success: true, mediaId });
      return;
    }

    const absOriginal = path.join(process.cwd(), 'public', localPath.replace(/^\//, ''));
    const buffer = await readFile(absOriginal);
    const image = sharpModule(buffer);
    const meta = await image.metadata();
    const origWidth = meta.width || 0;

    const variants: { name: string; url: string; width?: number; quality?: number }[] = [];

    if (thumbnailUrl && thumbnailUrl !== localPath) {
      variants.push({ name: 'thumbnail', url: thumbnailUrl, width: 150, quality: 70 });
    }
    if (mediumUrl) {
      variants.push({ name: 'medium', url: mediumUrl, width: 500, quality: 80 });
    }
    if (largeUrl) {
      variants.push({ name: 'large', url: largeUrl, width: 1200, quality: 85 });
    }

    // Sized variants
    for (const v of variants) {
      if (!v.width || origWidth <= v.width) continue;
      const outAbs = path.join(process.cwd(), 'public', v.url.replace(/^\//, ''));
      await sharpModule(buffer)
        .resize(v.width, null, { withoutEnlargement: true })
        .webp({ quality: v.quality || 80 })
        .toFile(outAbs);
    }

    // WebP original size
    if (webpUrl) {
      const outAbs = path.join(process.cwd(), 'public', webpUrl.replace(/^\//, ''));
      await sharpModule(buffer).webp({ quality: 85 }).toFile(outAbs);
    }

    // AVIF original size
    if (avifUrl) {
      try {
        const outAbs = path.join(process.cwd(), 'public', avifUrl.replace(/^\//, ''));
        await sharpModule(buffer).avif({ quality: 65 }).toFile(outAbs);
      } catch {
        /* AVIF may not be supported on this platform */
      }
    }

    parentPort?.postMessage({ success: true, mediaId, width: origWidth, height: meta.height || 0 });
  } catch (err: any) {
    parentPort?.postMessage({ success: false, mediaId, error: err?.message || 'unknown' });
  }
}

run();
