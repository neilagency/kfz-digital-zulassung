/**
 * Admin Order Documents API
 * POST /api/admin/orders/:id/documents — Upload PDF document
 * GET  /api/admin/orders/:id/documents — List documents for order
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import crypto from 'crypto';
import { sendDocumentEmail } from '@/lib/document-email';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = await prisma.order.findUnique({
    where: { id: params.id, deletedAt: null },
    select: {
      id: true,
      orderNumber: true,
      billingEmail: true,
      billingFirst: true,
      billingLast: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Bestellung nicht gefunden.' }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Keine Datei hochgeladen.' }, { status: 400 });
  }

  // Validate MIME type (check both declared and magic bytes)
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Nur PDF-Dateien sind erlaubt.' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'Datei ist zu groß (max. 10 MB).' }, { status: 400 });
  }

  // Validate PDF magic bytes
  const headerBytes = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const magic = String.fromCharCode(...headerBytes);
  if (!magic.startsWith('%PDF')) {
    return NextResponse.json({ error: 'Ungültige PDF-Datei.' }, { status: 400 });
  }

  // Store file
  const now = new Date();
  const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const dirPath = path.join(process.cwd(), 'public', 'uploads', 'order-documents', yearMonth);
  await mkdir(dirPath, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60);
  const randomSuffix = crypto.randomBytes(8).toString('hex');
  const fileName = `order-${order.orderNumber}_${randomSuffix}_${safeName}`;
  const filePath = path.join(dirPath, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const fileUrl = `/uploads/order-documents/${yearMonth}/${fileName}`;

  // Generate unique download token
  const downloadToken = crypto.randomBytes(24).toString('hex');

  const doc = await prisma.orderDocument.create({
    data: {
      orderId: order.id,
      fileName: file.name,
      fileUrl,
      fileSize: file.size,
      token: downloadToken,
    },
  });

  // Add order note
  await prisma.orderNote.create({
    data: {
      orderId: order.id,
      note: `Dokument "${file.name}" hochgeladen.`,
      author: 'admin',
    },
  });

  // Send email notification (async, don't block response)
  const customerName = `${order.billingFirst} ${order.billingLast}`.trim() || 'Kunde';
  sendDocumentEmail({
    to: order.billingEmail,
    customerName,
    orderNumber: order.orderNumber,
    fileName: file.name,
    downloadToken,
    documentId: doc.id,
    pdfBuffer: buffer,
  }).catch((err: unknown) => {
    console.error('[document-upload] Email send failed:', err);
  });

  return NextResponse.json({
    document: {
      id: doc.id,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      createdAt: doc.createdAt,
    },
    emailSent: true, // async — optimistic
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = await prisma.order.findUnique({
    where: { id: params.id, deletedAt: null },
    select: { id: true },
  });

  if (!order) {
    return NextResponse.json({ error: 'Bestellung nicht gefunden.' }, { status: 404 });
  }

  const documents = await prisma.orderDocument.findMany({
    where: { orderId: order.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fileName: true,
      fileUrl: true,
      fileSize: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ documents });
}
