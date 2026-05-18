import { NextResponse } from 'next/server';
import { getTrackingConfig } from '@/lib/tracking-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = await getTrackingConfig();

  return NextResponse.json(config, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  });
}
