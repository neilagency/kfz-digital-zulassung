import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCustomerSession } from '@/lib/customer-auth';

export async function GET() {
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

  const where = {
    OR: [
      { customerId: customer.id },
      { billingEmail: customer.email },
    ],
    deletedAt: null,
  };

  const [total, completed, pending, processing] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.count({ where: { ...where, status: 'completed' } }),
    prisma.order.count({ where: { ...where, status: 'pending' } }),
    prisma.order.count({ where: { ...where, status: 'processing' } }),
  ]);

  // Also get last 3 orders for the dashboard preview
  const recentOrders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      productName: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    stats: { total, completed, pending, processing },
    recentOrders,
  });
}
