import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/admin/invoices/generate-all – generate invoices for all orders that don't have one
export async function POST() {
  try {
    // Find all orders that don't have an invoice yet
    const ordersWithoutInvoice = await prisma.order.findMany({
      where: {
        deletedAt: null,
        invoices: { none: {} },
      },
      include: { items: true, customer: true },
      orderBy: { createdAt: 'asc' },
    });

    if (ordersWithoutInvoice.length === 0) {
      return NextResponse.json({ message: 'All orders already have invoices', created: 0 });
    }

    // Get the current year and find the last invoice number
    const year = new Date().getFullYear();
    const prefix = `RE-${year}-`;
    const lastInvoice = await prisma.invoice.findFirst({
      where: { invoiceNumber: { startsWith: prefix } },
      orderBy: { invoiceNumber: 'desc' },
    });

    let nextNum = 1;
    if (lastInvoice) {
      nextNum = parseInt(lastInvoice.invoiceNumber.replace(prefix, ''), 10) + 1;
    }

    let created = 0;

    for (const order of ordersWithoutInvoice) {
      const invoiceNumber = `${prefix}${String(nextNum).padStart(4, '0')}`;

      const invoiceItems = order.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      }));

      if (order.paymentFee > 0) {
        invoiceItems.push({
          name: 'Zahlungsgebühr',
          quantity: 1,
          price: order.paymentFee,
          total: order.paymentFee,
        });
      }

      const taxAmount = parseFloat((order.total - order.total / 1.19).toFixed(2));

      await prisma.invoice.create({
        data: {
          invoiceNumber,
          orderId: order.id,
          customerId: order.customerId,
          billingName: `${order.billingFirst} ${order.billingLast}`.trim(),
          billingEmail: order.billingEmail,
          billingAddress: order.billingStreet,
          billingCity: order.billingCity,
          billingPostcode: order.billingPostcode,
          items: JSON.stringify(invoiceItems),
          subtotal: order.subtotal || order.total,
          taxRate: 19,
          taxAmount,
          total: order.total,
          paymentMethod: order.paymentTitle || order.paymentMethod,
          paymentStatus: order.status === 'completed' ? 'paid' : 'pending',
          transactionId: order.transactionId,
          invoiceDate: order.datePaid || order.createdAt,
        },
      });

      nextNum++;
      created++;
    }

    return NextResponse.json({
      message: `Successfully created ${created} invoices`,
      created,
      total: ordersWithoutInvoice.length,
    });
  } catch (error) {
    console.error('Generate all invoices error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
