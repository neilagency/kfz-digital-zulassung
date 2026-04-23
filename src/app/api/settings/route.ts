import { NextResponse } from 'next/server';
import { getSiteSettings, getHomepagePricing } from '@/lib/db';

export async function GET() {
  try {
    const [settings, pricing] = await Promise.all([getSiteSettings(), getHomepagePricing()]);
    return NextResponse.json({
      ...settings,
      abmeldungPrice: pricing.abmeldungPriceFormatted,
      anmeldungPrice: pricing.anmeldungPriceFormatted,
    });
  } catch (e) {
    console.error('Settings API error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
