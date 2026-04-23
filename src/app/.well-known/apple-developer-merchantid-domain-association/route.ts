/**
 * Apple Pay Domain Verification
 * ===============================
 * Serves the Apple Pay domain association file required by Mollie for Apple Pay.
 *
 * Steps to configure:
 * 1. Go to Mollie Dashboard → Settings → Apple Pay
 * 2. Add your domain: onlineautoabmelden.com
 * 3. Download the domain verification file from Mollie
 * 4. Replace APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT below with the file's content
 *
 * Mollie docs: https://docs.mollie.com/payments/apple-pay-direct-integration
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const applePayVerification = process.env.APPLE_PAY_DOMAIN_ASSOCIATION || '';

  if (!applePayVerification) {
    console.warn(
      '[apple-pay] APPLE_PAY_DOMAIN_ASSOCIATION env var is not set. ' +
        'Download the verification file from Mollie Dashboard → Settings → Apple Pay ' +
        'and set it as an environment variable.',
    );
    return new NextResponse('Not configured', { status: 404 });
  }

  return new NextResponse(applePayVerification, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
