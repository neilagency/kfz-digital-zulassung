import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/invoice';
import { verifyInvoiceToken } from '@/lib/invoice-token';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceNumber: string }> }
) {
  const { invoiceNumber } = await params;

  // Validate invoiceNumber format (e.g. RE-2026-2067)
  if (!/^RE-\d{4}-\d+$/.test(invoiceNumber)) {
    return NextResponse.json({ error: 'Invalid invoice number' }, { status: 400 });
  }

  // Security: Require valid access token
  const token = request.nextUrl.searchParams.get('token');
  if (!token || !verifyInvoiceToken(invoiceNumber, token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: { invoiceNumber },
    select: { orderId: true, invoiceNumber: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  try {
    const { pdfBuffer } = await generateInvoicePDF(invoice.orderId);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Rechnung-${invoiceNumber}.pdf"`,
        'Cache-Control': 'private, no-cache',
      },
    });
  } catch (err) {
    console.error('[api/invoice/pdf] Failed:', err);
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    );
  }
}
