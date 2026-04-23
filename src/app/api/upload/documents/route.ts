/**
 * Document Upload API
 * ====================
 * Accepts a SINGLE file per request via multipart/form-data.
 * Supports two storage backends:
 *   1. Vercel Blob (if BLOB_READ_WRITE_TOKEN is set)
 *   2. Local filesystem (default for self-hosted / Hostinger)
 *
 * POST /api/upload/documents
 * Content-Type: multipart/form-data
 * Body: file=<File>, fieldName=<string>
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIP } from '@/lib/rate-limit';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import crypto from 'crypto';

/* ── Config ───────────────────────────────────────────────── */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB (self-hosted has no body limit)
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];
const RATE_LIMIT_CONFIG = { maxRequests: 10, windowMs: 60_000 }; // 10 per minute

/* ── Upload to Vercel Blob ────────────────────────────────── */
async function uploadToVercelBlob(file: File, fieldName: string, token: string) {
  const { put } = await import('@vercel/blob');
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  const pathname = `documents/${fieldName}_${Date.now()}_${safeName}`;
  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
    token,
  });
  return blob.url;
}

/* ── Upload to Local Filesystem ───────────────────────────── */
async function uploadToLocal(file: File, fieldName: string) {
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://onlineautoabmelden.com';
  const ext = path.extname(file.name) || '.jpg';
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60);
  const randomSuffix = crypto.randomBytes(6).toString('hex');
  const fileName = `${fieldName}_${Date.now()}_${randomSuffix}_${safeName}`;

  // Store in public/uploads/documents/YYYY/MM/
  const now = new Date();
  const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const relDir = `uploads/documents/${yearMonth}`;
  const absDir = path.join(process.cwd(), 'public', relDir);

  await mkdir(absDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path.join(absDir, fileName), buffer);

  return `${SITE_URL}/${relDir}/${fileName}`;
}

/* ── Route Handler ────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  // ── Rate Limiting ─────────────────────────────
  const ip = getClientIP(request);
  const rl = rateLimit(ip, RATE_LIMIT_CONFIG);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Zu viele Upload-Anfragen. Bitte versuchen Sie es in einer Minute erneut.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.reset / 1000)) } },
    );
  }

  try {
    const formData = await request.formData();

    const foundFile = formData.get('file') as File | null;
    const fieldName = (formData.get('fieldName') as string) || 'file';

    if (!foundFile || foundFile.size === 0) {
      return NextResponse.json(
        { error: 'Keine Datei gefunden.' },
        { status: 400 }
      );
    }

    // Validate type
    const fileType = foundFile.type || (foundFile.name?.match(/\.pdf$/i) ? 'application/pdf' : 'image/jpeg');
    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: `Ungültiger Dateityp: ${fileType}. Erlaubt: PDF, JPEG, PNG.`, field: fieldName },
        { status: 400 }
      );
    }

    // Validate size
    if (foundFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Datei zu groß (${(foundFile.size / 1024 / 1024).toFixed(1)} MB). Max. 10 MB.`, field: fieldName },
        { status: 400 }
      );
    }

    // Choose storage backend
    let fileUrl: string;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (blobToken) {
      // Vercel Blob (cloud deployment)
      fileUrl = await uploadToVercelBlob(foundFile, fieldName, blobToken);
    } else {
      // Local filesystem (Hostinger / self-hosted)
      fileUrl = await uploadToLocal(foundFile, fieldName);
    }

    console.log(`[upload] Document uploaded: ${fileUrl}`);

    return NextResponse.json({
      files: [{
        fieldName,
        originalName: foundFile.name,
        url: fileUrl,
        size: foundFile.size,
        mimeType: foundFile.type,
      }],
    });
  } catch (error) {
    console.error('Upload error:', error);
    const msg = error instanceof Error ? error.message : 'Upload fehlgeschlagen';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
