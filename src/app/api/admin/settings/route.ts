import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body as { settings: Array<{ key: string; value: string; group: string }> };

    // Batch all upserts in a single transaction
    await prisma.$transaction(
      settings.map((s) =>
        prisma.setting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value, group: s.group },
        })
      )
    );

    const updated = await prisma.setting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });

    // Revalidate key pages so settings changes show up immediately on server-rendered pages.
    // We revalidate the homepage, checkout and a couple of known product pages.
    try {
      revalidatePath('/');
      revalidatePath('/rechnung');
      revalidatePath('/product/fahrzeugabmeldung');
      revalidatePath('/product/auto-online-anmelden');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
