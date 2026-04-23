/**
 * Direct Payment Checkout API
 * ============================
 * Creates order in local DB ONLY + initiates Mollie payment.
 * NO WooCommerce dependency.
 *
 * SECURITY:
 * - Server-side price validation from DB (never trust client price)
 * - Rate limiting per IP
 * - Zod input validation
 * - Payment gateway validation from DB
 *
 * PERFORMANCE:
 * - Parallel DB queries where possible to stay within Hostinger timeout
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createMolliePayment, createMollieOrder, getMollieMethod } from '@/lib/payments';
import { createPayPalOrder } from '@/lib/paypal';
import { triggerInvoiceEmail } from '@/lib/trigger-invoice';
import { getPaymentGatewayByCheckoutId } from '@/lib/db';
import { rateLimit, getClientIP } from '@/lib/rate-limit';
import { checkoutDirectSchema, formatZodErrors } from '@/lib/validations';
import { paymentLog } from '@/lib/payment-logger';

export const runtime = 'nodejs';

const RATE_LIMIT_CONFIG = { maxRequests: 8, windowMs: 60_000 }; // 8 per minute

/* ── In-memory cache for near-static data (gateway + product) ── */
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  ts: number;
}

const gatewayCache = new Map<
  string,
  CacheEntry<Awaited<ReturnType<typeof getPaymentGatewayByCheckoutId>>>
>();
const productCache = new Map<
  string,
  CacheEntry<{ price: number; name: string; isActive: boolean } | null>
>();

async function getCachedGateway(checkoutId: string) {
  const cached = gatewayCache.get(checkoutId);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const data = await getPaymentGatewayByCheckoutId(checkoutId);
  gatewayCache.set(checkoutId, { data, ts: Date.now() });
  return data;
}

async function getCachedProduct(slug: string) {
  const cached = productCache.get(slug);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const data = await prisma.product.findUnique({
    where: { slug },
    select: { price: true, name: true, isActive: true },
  });

  productCache.set(slug, { data, ts: Date.now() });
  return data;
}

function splitFullName(fullName: string) {
  const cleaned = fullName.trim().replace(/\s+/g, ' ');
  if (!cleaned) {
    return { firstName: '', lastName: '' };
  }

  const parts = cleaned.split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';

  return { firstName, lastName };
}

export async function POST(request: NextRequest) {
  // ── Rate Limiting ─────────────────────────────
  const ip = getClientIP(request);
  const rl = rateLimit(ip, RATE_LIMIT_CONFIG);

  if (!rl.success) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rl.reset / 1000)) },
      },
    );
  }

  try {
    const rawBody = await request.json();

    // ── Zod Validation ──────────────────────────
    const parsed = checkoutDirectSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(formatZodErrors(parsed.error), { status: 400 });
    }

    const body = parsed.data;

    // ── Namen vorbereiten ───────────────────────
    const nonKlarnaName = typeof body.name === 'string' ? body.name.trim() : '';
    const derivedName = splitFullName(nonKlarnaName);

    const finalFirstName =
      body.paymentMethod === 'klarna'
        ? body.firstName || ''
        : derivedName.firstName;

    const finalLastName =
      body.paymentMethod === 'klarna'
        ? body.lastName || ''
        : derivedName.lastName;

    // ── Verify payment method (no DB needed) ─────
    // SEPA is handled separately (bank transfer, no Mollie needed)
    // PayPal is handled directly via PayPal API (no Mollie needed)
    const isSEPA = body.paymentMethod === 'sepa';
    const isPayPal = body.paymentMethod === 'paypal';

    if (!isSEPA && !isPayPal) {
      const mollieMethod = getMollieMethod(body.paymentMethod);
      if (!mollieMethod) {
        return NextResponse.json(
          { error: 'Zahlungsmethode wird nicht unterstützt.' },
          { status: 400 },
        );
      }
    }

    // ── BATCH 1: Gateway + Product + Max Order + Last Invoice (parallel) ──
    const isAnmeldung = body.productId === 'anmeldung';
    const productSlug = isAnmeldung ? 'auto-online-anmelden' : 'fahrzeugabmeldung';
    const year = new Date().getFullYear();
    const invoicePrefix = `RE-${year}-`;

    const [gateway, dbProduct, maxOrder, lastInvoice] = await Promise.all([
      getCachedGateway(body.paymentMethod),
      getCachedProduct(productSlug),
      prisma.order.findFirst({
        orderBy: { orderNumber: 'desc' },
        select: { orderNumber: true },
      }),
      prisma.invoice.findFirst({
        where: { invoiceNumber: { startsWith: invoicePrefix } },
        orderBy: { invoiceNumber: 'desc' },
        select: { invoiceNumber: true },
      }),
    ]);

    if (!gateway) {
      return NextResponse.json(
        { error: 'Bitte wählen Sie eine gültige, aktive Zahlungsmethode.' },
        { status: 400 },
      );
    }

    if (!dbProduct || !dbProduct.isActive) {
      return NextResponse.json(
        { error: 'Produkt nicht gefunden oder nicht verfügbar.' },
        { status: 400 },
      );
    }

    // ── Prices ─────────────────────────────────
    let productPrice = dbProduct.price;
    if (body.productPrice) {
      const clientPrice = parseFloat(body.productPrice);
      if (!isNaN(clientPrice) && clientPrice >= dbProduct.price) {
        productPrice = clientPrice;
      }
    }

    const paymentFee = gateway.fee;

    // ── Coupon Validation (server-side) ──────────
    let discountAmount = 0;
    let validatedCouponId: string | null = null;
    const couponCode = (body.couponCode || '').trim().toUpperCase();

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      const now = new Date();

      if (!coupon || !coupon.isActive) {
        return NextResponse.json(
          { error: 'Ungültiger oder inaktiver Gutscheincode.' },
          { status: 400 },
        );
      }

      if (coupon.startDate && now < coupon.startDate) {
        return NextResponse.json(
          { error: 'Gutschein ist noch nicht gültig.' },
          { status: 400 },
        );
      }

      if (coupon.endDate && now > coupon.endDate) {
        return NextResponse.json(
          { error: 'Gutschein ist abgelaufen.' },
          { status: 400 },
        );
      }

      if (coupon.maxUsageTotal > 0 && coupon.usageCount >= coupon.maxUsageTotal) {
        return NextResponse.json(
          { error: 'Gutschein wurde bereits vollständig eingelöst.' },
          { status: 400 },
        );
      }

      if (coupon.maxUsagePerUser > 0 && body.email) {
        const userUsage = await prisma.couponUsage.findUnique({
          where: {
            couponId_email: {
              couponId: coupon.id,
              email: body.email,
            },
          },
        });

        if (userUsage) {
          return NextResponse.json(
            { error: 'Sie haben diesen Gutschein bereits verwendet.' },
            { status: 400 },
          );
        }
      }

      if (coupon.productSlugs) {
        const allowed = coupon.productSlugs.split(',').map((s: string) => s.trim());
        if (allowed.length > 0 && !allowed.includes(productSlug)) {
          return NextResponse.json(
            { error: 'Gutschein gilt nicht für dieses Produkt.' },
            { status: 400 },
          );
        }
      }

      if (coupon.minOrderValue > 0 && productPrice < coupon.minOrderValue) {
        return NextResponse.json(
          {
            error: `Mindestbestellwert: ${coupon.minOrderValue
              .toFixed(2)
              .replace('.', ',')} €`,
          },
          { status: 400 },
        );
      }

      if (coupon.discountType === 'percentage') {
        discountAmount =
          Math.round((productPrice * coupon.discountValue) / 100 * 100) / 100;
      } else {
        discountAmount = Math.min(coupon.discountValue, productPrice);
      }

      validatedCouponId = coupon.id;
    }

    const orderTotal = Math.max(productPrice - discountAmount + paymentFee, 0);
    const totalFormatted = orderTotal.toFixed(2);

    console.log(
      `[checkout] Price breakdown: product=${productPrice}, discount=${discountAmount}, fee=${paymentFee}, total=${totalFormatted}, coupon=${couponCode || 'none'}`,
    );

    const serviceLabel = body.serviceData?.serviceLabel || '';
    const productName = isAnmeldung
      ? serviceLabel
        ? `Fahrzeug online anmelden – ${serviceLabel}`
        : dbProduct.name
      : dbProduct.name;

    let nextOrderNum = (maxOrder?.orderNumber || 0) + 1;

    let nextInvNum = 1;
    if (lastInvoice) {
      nextInvNum = parseInt(lastInvoice.invoiceNumber.replace(invoicePrefix, ''), 10) + 1;
    }

    // ── BATCH 2: Customer upsert + Order create (with retry for race conditions) ──
    const customer = body.email
      ? await prisma.customer.upsert({
          where: { email: body.email },
          update: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: orderTotal },
          },
          create: {
            email: body.email,
            firstName: finalFirstName,
            lastName: finalLastName,
            phone: body.phone || '',
            city: body.city || '',
            postcode: body.postcode || '',
            address: body.street || '',
            totalOrders: 1,
            totalSpent: orderTotal,
          },
        })
      : null;

    let localOrder: any;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        localOrder = await prisma.order.create({
          data: {
            orderNumber: nextOrderNum,
            status: 'pending',
            total: orderTotal,
            subtotal: productPrice,
            paymentFee,
            paymentMethod: body.paymentMethod,
            paymentTitle: gateway.label,
            currency: 'EUR',
            billingFirst: finalFirstName,
            billingLast: finalLastName,
            billingEmail: body.email,
            billingPhone: body.phone || '',
            billingStreet: body.street || '',
            billingCity: body.city || '',
            billingPostcode: body.postcode || '',
            productName,
            serviceData: body.serviceData ? JSON.stringify(body.serviceData) : '{}',
            discountAmount,
            couponCode,
            customerId: customer?.id,
            items: {
              create: [
                {
                  productName,
                  quantity: 1,
                  price: productPrice,
                  total: productPrice,
                },
                ...(paymentFee > 0
                  ? [{
                      productName: 'Zahlungsgebühr',
                      quantity: 1,
                      price: paymentFee,
                      total: paymentFee,
                    }]
                  : []),
              ],
            },
            payments: {
              create: {
                gatewayId: body.paymentMethod,
                amount: orderTotal,
                currency: 'EUR',
                status: 'pending',
                method: gateway.label,
              },
            },
          },
          include: { payments: true },
        });
        break;
      } catch (err: any) {
        const msg = err?.message || '';
        if (msg.includes('UNIQUE') && msg.includes('orderNumber') && attempt < 4) {
          const freshMax = await prisma.order.findFirst({
            orderBy: { orderNumber: 'desc' },
            select: { orderNumber: true },
          });
          nextOrderNum = (freshMax?.orderNumber || nextOrderNum) + 1;
          nextInvNum += 1;
          continue;
        }
        throw err;
      }
    }

    if (!localOrder) {
      return NextResponse.json(
        { error: 'Bestellnummer konnte nicht erzeugt werden. Bitte erneut versuchen.' },
        { status: 500 },
      );
    }

    const invoiceNumber = `${invoicePrefix}${String(nextInvNum).padStart(4, '0')}`;

    const customerId = customer?.id;

    // paymentRecord extracted from atomic order creation (nested create)
    const paymentRecord = localOrder.payments[0];

    // ── Record coupon usage ──────────────────────
    if (validatedCouponId && couponCode && body.email) {
      await Promise.all([
        prisma.couponUsage.create({
          data: {
            couponId: validatedCouponId,
            email: body.email,
            orderId: localOrder.id,
          },
        }),
        prisma.coupon.update({
          where: { id: validatedCouponId },
          data: { usageCount: { increment: 1 } },
        }),
      ]);
    }

    // ── Invoice items + Invoice creation ──
    const invoiceItems = [
      { name: productName, quantity: 1, price: productPrice, total: productPrice },
      ...(paymentFee > 0
        ? [{ name: 'Zahlungsgebühr', quantity: 1, price: paymentFee, total: paymentFee }]
        : []),
      ...(discountAmount > 0
        ? [{
            name: `Gutschein (${couponCode})`,
            quantity: 1,
            price: -discountAmount,
            total: -discountAmount,
          }]
        : []),
    ];

    const taxAmount = parseFloat((orderTotal - orderTotal / 1.19).toFixed(2));

    let currentInvNumber = invoiceNumber;
    let currentInvNum = nextInvNum;

    for (let invAttempt = 0; invAttempt < 5; invAttempt++) {
      try {
        await prisma.invoice.create({
          data: {
            invoiceNumber: currentInvNumber,
            orderId: localOrder.id,
            customerId,
            billingName: `${finalFirstName} ${finalLastName}`.trim(),
            billingEmail: body.email,
            billingAddress: body.street || '',
            billingCity: body.city || '',
            billingPostcode: body.postcode || '',
            items: JSON.stringify(invoiceItems),
            subtotal: productPrice,
            taxRate: 19,
            taxAmount,
            total: orderTotal,
            paymentMethod: gateway.label,
            paymentStatus: 'pending',
          },
        });
        break;
      } catch (invErr: any) {
        const invMsg = invErr?.message || '';
        if (invMsg.includes('UNIQUE') && invMsg.includes('invoiceNumber') && invAttempt < 4) {
          currentInvNum += 1;
          currentInvNumber = `${invoicePrefix}${String(currentInvNum).padStart(4, '0')}`;
          continue;
        }
        throw invErr;
      }
    }

    console.log(`[checkout] Order #${nextOrderNum} + invoice ${currentInvNumber} created`);

    paymentLog.orderCreated({
      orderId: localOrder.id,
      orderNumber: nextOrderNum,
      total: totalFormatted,
      method: body.paymentMethod,
      invoiceNumber: currentInvNumber,
    });

    // ── FREE ORDER (coupon covers full amount) — skip all payment gateways ──
    if (orderTotal <= 0) {
      console.log(
        `[checkout] Order #${nextOrderNum} is free (coupon: ${couponCode}), skipping payment gateway`,
      );

      await Promise.all([
        prisma.order.update({
          where: { id: localOrder.id },
          data: { status: 'processing' },
        }),
        prisma.payment.update({
          where: { id: paymentRecord.id },
          data: {
            status: 'paid',
            transactionId: `FREE-${couponCode || 'COUPON'}`,
            providerData: JSON.stringify({
              provider: 'coupon',
              couponCode,
              discountAmount,
              note: 'Full discount — no payment required',
            }),
          },
        }),
        prisma.invoice.updateMany({
          where: { orderId: localOrder.id },
          data: { paymentStatus: 'paid' },
        }),
      ]);

      const emailResult = await triggerInvoiceEmail(localOrder.id);
      if (!emailResult.success) {
        console.error(
          `[checkout] Free order email failed for order #${nextOrderNum}: ${emailResult.error}`,
        );
      }

      const { generateInvoiceToken } = await import('@/lib/invoice-token');

      return NextResponse.json({
        success: true,
        orderId: localOrder.id,
        orderNumber: nextOrderNum,
        total: '0.00',
        invoiceNumber: currentInvNumber,
        invoiceUrl: `/rechnung/${currentInvNumber}?order=${nextOrderNum}&token=${generateInvoiceToken(currentInvNumber)}`,
      });
    }

    // ── SEPA: Skip Mollie — redirect to invoice page ──
    if (body.paymentMethod === 'sepa') {
      await prisma.order.update({
        where: { id: localOrder.id },
        data: { status: 'on-hold' },
      });

      const emailResult = await triggerInvoiceEmail(localOrder.id);
      if (!emailResult.success) {
        console.error(
          `[checkout] SEPA email failed for order #${nextOrderNum}: ${emailResult.error}`,
        );
      }

      return NextResponse.json({
        success: true,
        orderId: localOrder.id,
        orderNumber: nextOrderNum,
        total: totalFormatted,
        invoiceNumber: currentInvNumber,
        invoiceUrl: `/rechnung/${currentInvNumber}?order=${nextOrderNum}&token=${(await import('@/lib/invoice-token')).generateInvoiceToken(currentInvNumber)}`,
      });
    }

    // ── PayPal: Direct PayPal API (no Mollie) ──────
    if (body.paymentMethod === 'paypal') {
      try {
        const paypalResult = await createPayPalOrder({
          orderId: localOrder.id,
          orderNumber: nextOrderNum,
          amount: totalFormatted,
          description: productName,
          email: body.email,
        });

        await prisma.payment.update({
          where: { id: paymentRecord.id },
          data: {
            transactionId: paypalResult.paypalOrderId,
            providerData: JSON.stringify({
              paypalOrderId: paypalResult.paypalOrderId,
              approvalUrl: paypalResult.approvalUrl,
              provider: 'paypal',
            }),
          },
        });

        console.log(
          `[checkout] PayPal order ${paypalResult.paypalOrderId} created for Order #${nextOrderNum}`,
        );

        paymentLog.paypalCreate({
          orderId: localOrder.id,
          orderNumber: nextOrderNum,
          amount: totalFormatted,
          paypalOrderId: paypalResult.paypalOrderId,
        });

        return NextResponse.json({
          success: true,
          orderId: localOrder.id,
          orderNumber: nextOrderNum,
          total: totalFormatted,
          paymentUrl: paypalResult.approvalUrl,
          invoiceNumber: currentInvNumber,
        });
      } catch (paypalError) {
        const errorMsg =
          paypalError instanceof Error ? paypalError.message : String(paypalError);

        console.error('[checkout] PayPal order creation failed:', errorMsg);

        paymentLog.paypalFailed({
          orderId: localOrder.id,
          orderNumber: nextOrderNum,
          error: errorMsg,
        });

        await prisma.order.update({
          where: { id: localOrder.id },
          data: { status: 'on-hold' },
        });

        return NextResponse.json(
          { error: `PayPal-Fehler: ${errorMsg}` },
          { status: 502 },
        );
      }
    }

    // ── Mollie Payment (for credit card, apple pay, klarna, etc.) ──────
    paymentLog.checkoutStart({
      orderId: localOrder.id,
      orderNumber: nextOrderNum,
      method: body.paymentMethod,
      amount: totalFormatted,
      email: body.email,
      ip,
    });

    try {
      const isKlarna = body.paymentMethod === 'klarna';

      const mollieResult = isKlarna
        ? await createMollieOrder({
            firstName: body.firstName,
            lastName: body.lastName,
            company: body.company,
            street: body.street,
            postcode: body.postcode,
            city: body.city,
            phone: body.phone,
            email: body.email,
            paymentMethod: body.paymentMethod,
            productId: isAnmeldung ? 'anmeldung' : 'abmeldung',
            amount: totalFormatted,
            description: productName,
            orderId: localOrder.id,
            orderNumber: nextOrderNum,
            productName,
            productPrice,
            paymentFee,
            discountAmount,
            couponCode: body.couponCode,
          })
        : await createMolliePayment({
    firstName: finalFirstName,
    lastName: finalLastName,
    company: '',
    street: body.street,
    postcode: body.postcode,
    city: body.city,
    phone: body.phone,
    email: body.email,
    paymentMethod: body.paymentMethod,
    productId: isAnmeldung ? 'anmeldung' : 'abmeldung',
    amount: totalFormatted,
    description: productName,
    orderId: localOrder.id,
    orderNumber: nextOrderNum,
  });

      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          transactionId: mollieResult.paymentId,
          providerData: JSON.stringify({
            molliePaymentId: mollieResult.paymentId,
            checkoutUrl: mollieResult.checkoutUrl,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        orderId: localOrder.id,
        orderNumber: nextOrderNum,
        total: totalFormatted,
        paymentUrl: mollieResult.checkoutUrl,
        invoiceNumber: currentInvNumber,
      });
    } catch (mollieError) {
      const errorMsg =
        mollieError instanceof Error ? mollieError.message : String(mollieError);

      console.error('[checkout] Mollie payment creation failed:', errorMsg);

      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: 'failed',
          providerData: JSON.stringify({
            error: errorMsg,
            method: body.paymentMethod,
            failedAt: new Date().toISOString(),
          }),
        },
      });

      await prisma.order.update({
        where: { id: localOrder.id },
        data: { status: 'on-hold' },
      });

      return NextResponse.json(
        { error: `Zahlungsdienstleister-Fehler: ${errorMsg}` },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error('Direct checkout error:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Ein unerwarteter Fehler ist aufgetreten.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
