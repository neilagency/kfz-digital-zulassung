/**
 * Resend Invoice Email API
 * ========================
 * POST /api/admin/orders/[id]/resend-invoice
 * 
 * Regenerates the PDF and resends the invoice email to the customer.
 * Requires admin authentication.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAndSendInvoice } from '@/lib/invoice';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, orderNumber: true, billingEmail: true, billingFirst: true, billingLast: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.billingEmail) {
      return NextResponse.json({ error: 'Order has no billing email' }, { status: 400 });
    }

    console.log(`[resend-invoice] Resending invoice for Order #${order.orderNumber} to ${order.billingEmail}`);

    // Generate PDF + send email
    const result = await generateAndSendInvoice(orderId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Invoice generation failed' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber: order.orderNumber,
      invoiceNumber: result.invoiceNumber,
      emailSent: result.emailSent,
      recipient: order.billingEmail,
      ...(result.error ? { emailError: result.error } : {}),
    });
  } catch (error) {
    console.error('[resend-invoice] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
