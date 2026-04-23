import { NextResponse } from 'next/server';
import { getSeoAuditSnapshot } from '@/lib/seo-audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getSeoAuditSnapshot());
  } catch (error) {
    console.error('Admin SEO audit API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}