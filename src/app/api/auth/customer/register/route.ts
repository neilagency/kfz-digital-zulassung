import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createCustomerToken, setCustomerCookie } from '@/lib/customer-auth';
import { rateLimit, getClientIP } from '@/lib/rate-limit';
import { linkGuestOrders } from '@/lib/link-guest-orders';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein.'),
  password: z
    .string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein.'),
  firstName: z.string().min(1, 'Vorname ist erforderlich.').max(100),
  lastName: z.string().min(1, 'Nachname ist erforderlich.').max(100),
});

const RATE_LIMIT = { maxRequests: 5, windowMs: 60_000 };

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const rl = rateLimit(ip, RATE_LIMIT);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Ungültige Eingabe.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password, firstName, lastName } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if customer exists and already has a password
    const existing = await prisma.customer.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing?.password) {
      return NextResponse.json(
        { error: 'Ein Konto mit dieser E-Mail existiert bereits. Bitte melden Sie sich an.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Upsert: if guest customer exists, upgrade; otherwise create
    const customer = await prisma.customer.upsert({
      where: { email: normalizedEmail },
      update: {
        password: hashedPassword,
        firstName: firstName || existing?.firstName || '',
        lastName: lastName || existing?.lastName || '',
        lastLoginAt: new Date(),
      },
      create: {
        email: normalizedEmail,
        password: hashedPassword,
        firstName,
        lastName,
        lastLoginAt: new Date(),
      },
    });

    // Link any guest orders to this newly registered account
    const linkedOrders = await linkGuestOrders(normalizedEmail, customer.id);

    const token = await createCustomerToken({
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    });

    const response = NextResponse.json(
      {
        success: true,
        linkedOrders,
        customer: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
        },
      },
      { status: 201 }
    );

    return setCustomerCookie(response, token);
  } catch (error) {
    console.error('[customer-register]', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    );
  }
}
