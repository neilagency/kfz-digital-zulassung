import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCustomerSession } from '@/lib/customer-auth';
import { generateInvoiceToken } from '@/lib/invoice-token';

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

  const order = await prisma.order.findFirst({
    where: {
      id: params.id,
      OR: [
        { customerId: customer.id },
        { billingEmail: customer.email },
      ],
      deletedAt: null,
    },
    include: {
      items: true,
      payments: {
        select: {
          id: true,
          status: true,
          method: true,
          amount: true,
          paidAt: true,
        },
      },
      invoices: {
        select: {
          id: true,
          invoiceNumber: true,
          total: true,
          paymentStatus: true,
          createdAt: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Bestellung nicht gefunden.' }, { status: 404 });
  }

  const orderWithTokens = {
    ...order,
    invoices: order.invoices.map((inv) => ({
      ...inv,
      pdfToken: generateInvoiceToken(inv.invoiceNumber),
    })),
  };

  return NextResponse.json({ order: orderWithTokens });
}
