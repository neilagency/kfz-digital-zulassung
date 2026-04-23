/**
 * Secure Document Download API
 * GET /api/documents/:id/download?token=xxx — Download document with token auth
 *
 * Token-based access: no login required, but the token is unique per document
 * and shared only via email or customer account.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token || token.length < 10) {
    return NextResponse.json({ error: 'Ungültiger Token.' }, { status: 403 });
  }

  const doc = await prisma.orderDocument.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      token: true,
      fileName: true,
      fileUrl: true,
    },
  });

  if (!doc) {
    return NextResponse.json({ error: 'Dokument nicht gefunden.' }, { status: 404 });
  }

  // Constant-time comparison to prevent timing attacks
  if (token.length !== doc.token.length) {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 });
  }

  const crypto = await import('crypto');
  const isValid = crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(doc.token)
  );

  if (!isValid) {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 });
  }

  // Read file from disk
  try {
    const filePath = path.join(process.cwd(), 'public', doc.fileUrl);
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(doc.fileName)}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'private, no-cache',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Datei nicht gefunden.' }, { status: 404 });
  }
}
