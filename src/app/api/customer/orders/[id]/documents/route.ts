/**
 * Customer Order Documents API
 * GET /api/customer/orders/:id/documents — List documents for order (customer auth)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCustomerSession } from '@/lib/customer-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }

  const customer = await prisma.customer.findUnique({
    where: { id: session.id },
    select: { id: true, email: true },
  });

  if (!customer) {
    return NextResponse.json({ error: 'Konto nicht gefunden.' }, { status: 404 });
  }

  // Verify order belongs to customer (by customerId or billingEmail)
  const order = await prisma.order.findFirst({
    where: {
      id: params.id,
      OR: [
        { customerId: customer.id },
        { billingEmail: customer.email },
      ],
      deletedAt: null,
    },
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
      fileSize: true,
      token: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ documents });
}
