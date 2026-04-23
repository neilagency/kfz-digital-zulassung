import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createCustomerToken, setCustomerCookie } from '@/lib/customer-auth';
import { rateLimit, getClientIP } from '@/lib/rate-limit';
import { linkGuestOrders } from '@/lib/link-guest-orders';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein.'),
  password: z.string().min(1, 'Passwort ist erforderlich.'),
});

const RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const rl = rateLimit(ip, RATE_LIMIT);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Ungültige Eingabe.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const customer = await prisma.customer.findUnique({
      where: { email: normalizedEmail },
    });

    // Generic error to prevent email enumeration
    const genericError = 'E-Mail oder Passwort ist falsch.';

    if (!customer || !customer.password) {
      return NextResponse.json({ error: genericError }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, customer.password);
    if (!isValid) {
      return NextResponse.json({ error: genericError }, { status: 401 });
    }

    // Update last login + link any unlinked guest orders
    const [, linkedOrders] = await Promise.all([
      prisma.customer.update({
        where: { id: customer.id },
        data: { lastLoginAt: new Date() },
      }),
      linkGuestOrders(normalizedEmail, customer.id),
    ]);

    const token = await createCustomerToken({
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    });

    const response = NextResponse.json({
      success: true,
      linkedOrders,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    });

    return setCustomerCookie(response, token);
  } catch (error) {
    console.error('[customer-login]', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    );
  }
}
