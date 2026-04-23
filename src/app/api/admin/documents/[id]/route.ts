/**
 * Admin Document Delete + Resend Email API
 * DELETE /api/admin/documents/:id — Delete a document
 * POST   /api/admin/documents/:id — Resend email for a document
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { unlink } from 'fs/promises';
import path from 'path';
import { readFile } from 'fs/promises';
import { sendDocumentEmail } from '@/lib/document-email';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const doc = await prisma.orderDocument.findUnique({
    where: { id: params.id },
    include: {
      order: {
        select: { id: true, orderNumber: true },
      },
    },
  });

  if (!doc) {
    return NextResponse.json({ error: 'Dokument nicht gefunden.' }, { status: 404 });
  }

  // Delete file from disk
  try {
    const filePath = path.join(process.cwd(), 'public', doc.fileUrl);
    await unlink(filePath);
  } catch {
    // File may already be deleted — continue
  }

  // Delete DB record
  await prisma.orderDocument.delete({ where: { id: params.id } });

  // Add order note
  await prisma.orderNote.create({
    data: {
      orderId: doc.orderId,
      note: `Dokument "${doc.fileName}" gelöscht.`,
      author: 'admin',
    },
  });

  return NextResponse.json({ success: true });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const doc = await prisma.orderDocument.findUnique({
    where: { id: params.id },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          billingEmail: true,
          billingFirst: true,
          billingLast: true,
        },
      },
    },
  });

  if (!doc) {
    return NextResponse.json({ error: 'Dokument nicht gefunden.' }, { status: 404 });
  }

  // Read PDF from disk for attachment
  let pdfBuffer: Buffer | undefined;
  try {
    const filePath = path.join(process.cwd(), 'public', doc.fileUrl);
    pdfBuffer = await readFile(filePath);
  } catch {
    // File may not exist; send email with download link only
  }

  const customerName = `${doc.order.billingFirst} ${doc.order.billingLast}`.trim() || 'Kunde';

  const result = await sendDocumentEmail({
    to: doc.order.billingEmail,
    customerName,
    orderNumber: doc.order.orderNumber,
    fileName: doc.fileName,
    downloadToken: doc.token,
    documentId: doc.id,
    pdfBuffer,
  });

  if (result.success) {
    await prisma.orderNote.create({
      data: {
        orderId: doc.orderId,
        note: `Dokument "${doc.fileName}" erneut per E-Mail an ${doc.order.billingEmail} gesendet.`,
        author: 'admin',
      },
    });
  }

  return NextResponse.json({
    success: result.success,
    error: result.error,
  });
}
