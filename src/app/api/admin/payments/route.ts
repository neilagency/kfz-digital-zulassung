import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const gateways = await prisma.paymentGateway.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    // Also get payment stats per gateway
    const payments = await prisma.payment.groupBy({
      by: ['gatewayId'],
      _sum: { amount: true },
      _count: true,
    });

    return NextResponse.json({ gateways, paymentStats: payments });
  } catch (error) {
    console.error('Payments API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const gateway = await prisma.paymentGateway.update({
      where: { id: body.id },
      data: {
        isEnabled: body.isEnabled,
        fee: body.fee,
        apiKey: body.apiKey,
        secretKey: body.secretKey,
        mode: body.mode,
        sortOrder: body.sortOrder,
      },
    });

    // Purge cached checkout page so it reflects the new gateway state
    try {
      revalidatePath('/rechnung');
      revalidatePath('/');
      revalidateTag('payment-gateways');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json(gateway);
  } catch (error) {
    console.error('Gateway update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
