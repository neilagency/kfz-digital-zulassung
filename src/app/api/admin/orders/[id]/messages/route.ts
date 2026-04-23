/**
 * Admin Order Messages API
 * GET  /api/admin/orders/:id/messages — List messages for order
 * POST /api/admin/orders/:id/messages — Send message to customer (with optional attachments)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import crypto from 'crypto';
import { sendOrderMessageEmail } from '@/lib/order-message-email';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
const MAX_FILES = 5;
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.webp']);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messages = await prisma.orderMessage.findMany({
      where: { orderId: params.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      messages: messages.map((m) => ({
        ...m,
        attachments: JSON.parse(m.attachments),
      })),
    });
  } catch (error) {
    console.error('[order-messages] GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Load order
    const order = await prisma.order.findUnique({
      where: { id: params.id, deletedAt: null },
      select: {
        id: true,
        orderNumber: true,
        billingEmail: true,
        billingFirst: true,
        billingLast: true,
        productName: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Bestellung nicht gefunden.' }, { status: 404 });
    }

    if (!order.billingEmail || !order.billingEmail.includes('@')) {
      return NextResponse.json({ error: 'Keine gültige E-Mail-Adresse vorhanden.' }, { status: 400 });
    }

    const formData = await request.formData();
    const message = formData.get('message') as string | null;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Nachricht darf nicht leer sein.' }, { status: 400 });
    }

    // Process file uploads
    const files = formData.getAll('files') as File[];
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximal ${MAX_FILES} Dateien erlaubt.` }, { status: 400 });
    }

    const attachments: { name: string; url: string; size: number }[] = [];
    const emailAttachments: { filename: string; content: Buffer }[] = [];

    for (const file of files) {
      if (!(file instanceof File) || file.size === 0) continue;

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Datei "${file.name}" ist zu groß (max. 10 MB).` },
          { status: 400 }
        );
      }

      // Validate type by extension and MIME
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { error: `Dateityp "${ext}" ist nicht erlaubt. Erlaubt: PDF, JPG, PNG, WEBP.` },
          { status: 400 }
        );
      }

      // Validate PDF magic bytes
      if (file.type === 'application/pdf' || ext === '.pdf') {
        const headerBytes = new Uint8Array(await file.slice(0, 5).arrayBuffer());
        const magic = String.fromCharCode(...headerBytes);
        if (!magic.startsWith('%PDF')) {
          return NextResponse.json(
            { error: `Datei "${file.name}" ist keine gültige PDF.` },
            { status: 400 }
          );
        }
      }

      // Store file
      const now = new Date();
      const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
      const dirPath = path.join(process.cwd(), 'public', 'uploads', 'order-messages', yearMonth);
      await mkdir(dirPath, { recursive: true });

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60);
      const randomSuffix = crypto.randomBytes(8).toString('hex');
      const fileName = `msg-${order.orderNumber}_${randomSuffix}_${safeName}`;
      const filePath = path.join(dirPath, fileName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      const fileUrl = `/uploads/order-messages/${yearMonth}/${fileName}`;

      attachments.push({
        name: file.name,
        url: fileUrl,
        size: file.size,
      });

      emailAttachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    // Save message to DB
    const orderMessage = await prisma.orderMessage.create({
      data: {
        orderId: order.id,
        message: message.trim(),
        attachments: JSON.stringify(attachments),
        sentBy: 'admin',
      },
    });

    // Add order note
    await prisma.orderNote.create({
      data: {
        orderId: order.id,
        note: `Nachricht an Kunden gesendet${attachments.length > 0 ? ` (${attachments.length} Anhang/Anhänge)` : ''}`,
        author: 'Admin',
      },
    });

    // Send email (async — don't block response)
    const customerName = `${order.billingFirst} ${order.billingLast}`.trim() || undefined;

    sendOrderMessageEmail({
      to: order.billingEmail,
      customerName,
      orderNumber: order.orderNumber,
      productName: order.productName,
      message: message.trim(),
      attachments: emailAttachments,
    })
      .then((result: { success: boolean; error?: string }) => {
        if (result.success) {
          console.log(`[order-messages] Email sent for order #${order.orderNumber} → ${order.billingEmail}`);
        } else {
          console.error(`[order-messages] Email failed for order #${order.orderNumber}: ${result.error}`);
        }
      })
      .catch((err: unknown) => {
        console.error('[order-messages] Email error:', err);
      });

    return NextResponse.json({
      message: {
        id: orderMessage.id,
        orderId: orderMessage.orderId,
        message: orderMessage.message,
        attachments,
        sentBy: orderMessage.sentBy,
        createdAt: orderMessage.createdAt,
      },
      emailSent: true, // optimistic — async
    });
  } catch (error) {
    console.error('[order-messages] POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
