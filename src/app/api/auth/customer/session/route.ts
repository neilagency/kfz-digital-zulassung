import { NextResponse } from 'next/server';
import { getCustomerSession, clearCustomerCookie } from '@/lib/customer-auth';

export async function GET() {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  return NextResponse.json({
    authenticated: true,
    customer: session,
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  return clearCustomerCookie(response);
}
