import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type RouteCtx = { params: Promise<{ token: string }> };

const SITE_URL =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://onlineautoabmelden.com';

/** GET /api/unsubscribe/[token] – unsubscribe customer from emails */
export async function GET(_req: NextRequest, ctx: RouteCtx) {
  const { token } = await ctx.params;

  if (!token || token.length < 10) {
    return new NextResponse(buildHtml('Ungültiger Link', 'Der Abmeldelink ist ungültig.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  try {
    const customer = await prisma.customer.findFirst({
      where: { unsubscribeToken: token },
    });

    if (!customer) {
      return new NextResponse(buildHtml('Nicht gefunden', 'Der Abmeldelink ist ungültig oder abgelaufen.'), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (!customer.emailSubscribed) {
      return new NextResponse(buildHtml('Bereits abgemeldet', 'Sie sind bereits vom Newsletter abgemeldet.'), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: { emailSubscribed: false },
    });

    return new NextResponse(
      buildHtml('Erfolgreich abgemeldet', 'Sie erhalten keine Marketing-E-Mails mehr von uns. Service-E-Mails (Bestellbestätigungen, Rechnungen) werden weiterhin gesendet.'),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new NextResponse(buildHtml('Fehler', 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}

function buildHtml(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${title} - Online Auto Abmelden</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f4f6f9; color: #1a1a1a; }
    .container { max-width: 500px; margin: 80px auto; padding: 40px; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); text-align: center; }
    .logo { width: 160px; margin-bottom: 20px; }
    h1 { color: #0D5581; font-size: 22px; margin-bottom: 12px; }
    p { color: #555; font-size: 15px; line-height: 1.6; }
    .back-link { display: inline-block; margin-top: 24px; padding: 12px 28px; background: #0D5581; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; }
    .back-link:hover { background: #094266; }
  </style>
</head>
<body>
  <div class="container">
    <img src="${SITE_URL}/logo.webp" alt="Online Auto Abmelden" class="logo" />
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${SITE_URL}" class="back-link">Zur Startseite</a>
  </div>
</body>
</html>`;
}
