import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCustomerSession } from '@/lib/customer-auth';

export async function GET(request: NextRequest) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const skip = (page - 1) * limit;

  const customer = await prisma.customer.findUnique({
    where: { id: session.id },
    select: { id: true, email: true },
  });

  if (!customer) {
    return NextResponse.json({ error: 'Konto nicht gefunden.' }, { status: 404 });
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: {
        OR: [
          { customerId: customer.id },
          { billingEmail: customer.email },
        ],
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        currency: true,
        productName: true,
        paymentTitle: true,
        createdAt: true,
        datePaid: true,
        dateCompleted: true,
      },
    }),
    prisma.order.count({
      where: {
        OR: [
          { customerId: customer.id },
          { billingEmail: customer.email },
        ],
        deletedAt: null,
      },
    }),
  ]);

  return NextResponse.json({
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
