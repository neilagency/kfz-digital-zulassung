import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const WC_API = process.env.WC_API_URL || 'https://onlineautoabmelden.com/wp-json/wc/v3';
const CK = process.env.WC_CONSUMER_KEY || '';
const CS = process.env.WC_CONSUMER_SECRET || '';

/**
 * GET /api/cron/sync-orders
 * Called by cron job (Vercel CRON or system crontab via curl).
 * Protected by CRON_SECRET header.
 */
export async function GET(request: NextRequest) {
  // Verify CRON secret (works with both Vercel CRON and curl -H "Authorization: Bearer ...")
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!CK || !CS) {
    // WooCommerce integration was removed — this endpoint is a no-op.
    // Return 200 (not 500) so cron monitoring does not raise false alerts.
    return NextResponse.json({ status: 'disabled', message: 'WooCommerce integration not configured' });
  }

  try {
    // Fetch last 50 WP orders
    const url = `${WC_API}/orders?consumer_key=${CK}&consumer_secret=${CS}&per_page=50&orderby=date&order=desc`;
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: `WC API error: ${res.status}` }, { status: 502 });
    }

    const wpOrders = await res.json();
    let imported = 0;
    let updated = 0;
    let invoicesCreated = 0;

    for (const wpOrder of wpOrders) {
      const existing = await prisma.order.findFirst({ where: { wpOrderId: wpOrder.id } });

      if (existing) {
        // Update status if changed
        if (existing.status !== wpOrder.status) {
          await prisma.order.update({
            where: { id: existing.id },
            data: {
              status: wpOrder.status,
              transactionId: wpOrder.transaction_id || existing.transactionId,
              datePaid: wpOrder.date_paid ? new Date(wpOrder.date_paid) : existing.datePaid,
              dateCompleted: wpOrder.date_completed ? new Date(wpOrder.date_completed) : existing.dateCompleted,
            },
          });

          const paymentStatus = wpOrder.status === 'completed' ? 'paid'
            : wpOrder.status === 'refunded' ? 'refunded'
            : 'pending';

          await prisma.payment.updateMany({
            where: { orderId: existing.id },
            data: { status: paymentStatus },
          });

          await prisma.invoice.updateMany({
            where: { orderId: existing.id },
            data: { paymentStatus },
          });

          updated++;
        }
        continue;
      }

      // Import new order
      try {
        let customerId: string | undefined;
        if (wpOrder.billing?.email) {
          const customer = await prisma.customer.upsert({
            where: { email: wpOrder.billing.email },
            update: {
              totalOrders: { increment: 1 },
              totalSpent: { increment: parseFloat(wpOrder.total) || 0 },
            },
            create: {
              email: wpOrder.billing.email,
              firstName: wpOrder.billing.first_name || '',
              lastName: wpOrder.billing.last_name || '',
              phone: wpOrder.billing.phone || '',
              city: wpOrder.billing.city || '',
              postcode: wpOrder.billing.postcode || '',
              address: `${wpOrder.billing.address_1 || ''} ${wpOrder.billing.address_2 || ''}`.trim(),
              totalOrders: 1,
              totalSpent: parseFloat(wpOrder.total) || 0,
            },
          });
          customerId = customer.id;
        }

        const metaData: Record<string, any> = {};
        if (wpOrder.meta_data) {
          for (const meta of wpOrder.meta_data) {
            if (meta.key && !meta.key.startsWith('_')) {
              metaData[meta.key] = meta.value;
            }
          }
        }

        const maxOrder = await prisma.order.findFirst({ orderBy: { orderNumber: 'desc' } });
        const nextOrderNum = (maxOrder?.orderNumber || 0) + 1;
        const orderTotal = parseFloat(wpOrder.total) || 0;

        const newOrder = await prisma.order.create({
          data: {
            wpOrderId: wpOrder.id,
            orderNumber: nextOrderNum,
            status: wpOrder.status || 'pending',
            total: orderTotal,
            subtotal: wpOrder.line_items?.reduce((s: number, i: any) => s + parseFloat(i.subtotal || '0'), 0) || 0,
            paymentMethod: wpOrder.payment_method || '',
            paymentTitle: wpOrder.payment_method_title || '',
            transactionId: wpOrder.transaction_id || '',
            currency: wpOrder.currency || 'EUR',
            billingFirst: wpOrder.billing?.first_name || '',
            billingLast: wpOrder.billing?.last_name || '',
            billingEmail: wpOrder.billing?.email || '',
            billingPhone: wpOrder.billing?.phone || '',
            billingStreet: `${wpOrder.billing?.address_1 || ''} ${wpOrder.billing?.address_2 || ''}`.trim(),
            billingCity: wpOrder.billing?.city || '',
            billingPostcode: wpOrder.billing?.postcode || '',
            customerId,
            serviceData: Object.keys(metaData).length > 0 ? JSON.stringify(metaData) : '{}',
            datePaid: wpOrder.date_paid ? new Date(wpOrder.date_paid) : undefined,
            dateCompleted: wpOrder.date_completed ? new Date(wpOrder.date_completed) : undefined,
            createdAt: new Date(wpOrder.date_created),
            items: {
              create: (wpOrder.line_items || []).map((item: any) => ({
                productName: item.name || '',
                quantity: item.quantity || 1,
                price: parseFloat(item.price) || 0,
                total: parseFloat(item.total) || 0,
              })),
            },
            ...(wpOrder.transaction_id || wpOrder.status === 'completed'
              ? {
                  payments: {
                    create: {
                      gatewayId: wpOrder.payment_method || 'unknown',
                      amount: orderTotal,
                      currency: 'EUR',
                      status: wpOrder.status === 'completed' ? 'paid' : 'pending',
                      transactionId: wpOrder.transaction_id || '',
                    },
                  },
                }
              : {}),
          },
        });

        // Generate invoice
        const year = new Date().getFullYear();
        const prefix = `RE-${year}-`;
        const lastInvoice = await prisma.invoice.findFirst({
          where: { invoiceNumber: { startsWith: prefix } },
          orderBy: { invoiceNumber: 'desc' },
        });
        let nextInvNum = 1;
        if (lastInvoice) {
          nextInvNum = parseInt(lastInvoice.invoiceNumber.replace(prefix, ''), 10) + 1;
        }
        const invoiceNumber = `${prefix}${String(nextInvNum).padStart(4, '0')}`;

        const invoiceItems = (wpOrder.line_items || []).map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: parseFloat(item.price),
          total: parseFloat(item.total),
        }));

        const taxAmount = parseFloat((orderTotal - orderTotal / 1.19).toFixed(2));

        await prisma.invoice.create({
          data: {
            invoiceNumber,
            orderId: newOrder.id,
            customerId,
            billingName: `${wpOrder.billing?.first_name || ''} ${wpOrder.billing?.last_name || ''}`.trim(),
            billingEmail: wpOrder.billing?.email || '',
            billingAddress: `${wpOrder.billing?.address_1 || ''}`.trim(),
            billingCity: wpOrder.billing?.city || '',
            billingPostcode: wpOrder.billing?.postcode || '',
            items: JSON.stringify(invoiceItems),
            subtotal: wpOrder.line_items?.reduce((s: number, i: any) => s + parseFloat(i.subtotal || '0'), 0) || orderTotal,
            taxRate: 19,
            taxAmount,
            total: orderTotal,
            paymentMethod: wpOrder.payment_method_title || wpOrder.payment_method || '',
            paymentStatus: wpOrder.status === 'completed' ? 'paid' : 'pending',
            transactionId: wpOrder.transaction_id || '',
            invoiceDate: wpOrder.date_paid ? new Date(wpOrder.date_paid) : new Date(wpOrder.date_created),
          },
        });

        imported++;
        invoicesCreated++;
      } catch (err) {
        console.error(`CRON: Failed to import WP order #${wpOrder.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      synced: wpOrders.length,
      imported,
      updated,
      invoicesCreated,
    });
  } catch (error) {
    console.error('CRON sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
