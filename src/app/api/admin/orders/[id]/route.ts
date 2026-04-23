import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendCompletionEmail } from '@/lib/completion-email';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true, payments: true, notes: { orderBy: { createdAt: 'desc' } } },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order detail error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, note } = body;

    const updates: any = {};
    if (status) updates.status = status;

    // When marking order as completed or processing, also set datePaid if not already set
    if (status === 'completed' || status === 'processing') {
      const existing = await prisma.order.findUnique({ where: { id: params.id } });
      if (existing && !existing.datePaid) {
        updates.datePaid = new Date();
      }
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updates,
    });

    // Sync payment status with order status
    if (status) {
      let paymentStatus: string | null = null;
      if (status === 'completed' || status === 'processing') {
        paymentStatus = 'paid';
      } else if (status === 'cancelled') {
        paymentStatus = 'cancelled';
      } else if (status === 'refunded') {
        paymentStatus = 'refunded';
      }

      if (paymentStatus) {
        // Update all pending/outstanding payments for this order
        await prisma.payment.updateMany({
          where: {
            orderId: params.id,
            status: { notIn: [paymentStatus] }, // Don't update if already correct
          },
          data: {
            status: paymentStatus,
            ...(paymentStatus === 'paid' ? { paidAt: new Date() } : {}),
          },
        });

        // Also update invoice payment status
        await prisma.invoice.updateMany({
          where: { orderId: params.id },
          data: { paymentStatus },
        });
      }
    }

    if (note) {
      await prisma.orderNote.create({
        data: {
          orderId: params.id,
          note: note,
          author: 'Admin',
        },
      });
    }

    if (status) {
      await prisma.orderNote.create({
        data: {
          orderId: params.id,
          note: `Status geändert zu: ${status}`,
          author: 'System',
        },
      });
    }

    // Send completion email when status changes to "completed" (fire-and-forget)
    let completionEmailResult: { success: boolean; error?: string; skipped?: boolean } | null = null;
    if (status === 'completed') {
      // Run async but await result so we can report back to admin
      completionEmailResult = await sendCompletionEmail(params.id);
    }

    return NextResponse.json({
      ...order,
      completionEmailResult,
    });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { payments: true, invoices: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Already deleted?
    if (order.deletedAt) {
      return NextResponse.json({ error: 'Order already deleted' }, { status: 400 });
    }

    const now = new Date();

    // Soft-delete the order
    await prisma.order.update({
      where: { id: params.id },
      data: { deletedAt: now, status: 'deleted' },
    });

    // Log deletion as order note
    await prisma.orderNote.create({
      data: {
        orderId: params.id,
        note: `Order gelöscht (soft delete) am ${now.toISOString()}. Vorheriger Status: ${order.status}`,
        author: 'Admin',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
      orderId: params.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('Order delete error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
