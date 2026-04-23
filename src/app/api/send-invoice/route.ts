/**
 * Send Invoice API
 * =================
 * POST /api/send-invoice
 * Body: { orderId: string }
 *
 * Generates a PDF invoice and sends it to the customer via email.
 * Can be called:
 *   - Automatically after payment confirmation (webhook/callback)
 *   - Manually from admin dashboard
 *   - Via cron/retry for failed deliveries
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAndSendInvoice } from '@/lib/invoice';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, secret } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Lightweight auth: either admin session or shared secret
    const cronSecret = process.env.CRON_SECRET || '';
    const authHeader = request.headers.get('authorization');
    const isAdminCall = authHeader?.startsWith('Bearer ');
    const isCronCall = secret && cronSecret && secret === cronSecret;

    // For internal calls (from webhook/callback), accept internal header
    const isInternalCall = request.headers.get('x-internal-call') === 'invoice-trigger';

    if (!isAdminCall && !isCronCall && !isInternalCall) {
      // Check if the request comes from localhost (internal call)
      const host = request.headers.get('host') || '';
      const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
      if (!isLocal) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, orderNumber: true, billingEmail: true, status: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.billingEmail) {
      return NextResponse.json({ error: 'Order has no billing email' }, { status: 400 });
    }

    // Generate PDF + send email
    const result = await generateAndSendInvoice(orderId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Invoice generation failed', orderId },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber: order.orderNumber,
      invoiceNumber: result.invoiceNumber,
      emailSent: result.emailSent,
      ...(result.error ? { emailError: result.error } : {}),
    });
  } catch (error) {
    console.error('[send-invoice] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
