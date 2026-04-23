import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Cached health check (5s) to avoid DB spam
let healthCache: { ok: boolean; ts: number } | null = null;

export async function GET() {
  const now = Date.now();
  if (healthCache && now - healthCache.ts < 5000) {
    return NextResponse.json({ status: 'ok', cached: true }, { status: 200 });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    healthCache = { ok: true, ts: now };
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 503 });
  }
}
