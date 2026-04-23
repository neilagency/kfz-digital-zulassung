import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSiteSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/invoices/[id]/pdf – generate invoice PDF (HTML for print)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        order: { select: { orderNumber: true, serviceData: true, productName: true } },
      },
    });

    if (!invoice) {
      return new NextResponse('Invoice not found', { status: 404 });
    }

    const items = JSON.parse(invoice.items || '[]') as Array<{
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;

    const formatDate = (d: Date | string) => {
      const date = new Date(d);
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatCurrency = (n: number) => {
      return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    };

    const netTotal = (invoice.total / 1.19).toFixed(2);

    const settings = await getSiteSettings();

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Rechnung ${invoice.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; font-size: 13px; line-height: 1.5; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #0D5581; padding-bottom: 20px; }
    .logo { font-size: 22px; font-weight: 700; color: #0D5581; }
    .logo small { display: block; font-size: 11px; font-weight: 400; color: #666; margin-top: 2px; }
    .company-info { text-align: right; font-size: 11px; color: #666; line-height: 1.6; }
    .addresses { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .address-block h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 6px; }
    .address-block p { font-size: 13px; line-height: 1.6; }
    .invoice-meta { background: #f8f9fa; border-radius: 8px; padding: 16px 20px; margin-bottom: 30px; display: flex; gap: 40px; }
    .invoice-meta div { }
    .invoice-meta label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; display: block; }
    .invoice-meta span { font-size: 14px; font-weight: 600; color: #1a1a1a; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead th { background: #0D5581; color: white; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    thead th:last-child, thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
    tbody td { padding: 10px 12px; border-bottom: 1px solid #eee; }
    tbody td:last-child, tbody td:nth-child(3), tbody td:nth-child(4) { text-align: right; }
    tbody tr:nth-child(even) { background: #fafafa; }
    .totals { margin-left: auto; width: 280px; }
    .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .totals .row.total { border-top: 2px solid #0D5581; margin-top: 6px; padding-top: 10px; font-size: 16px; font-weight: 700; color: #0D5581; }
    .payment-info { margin-top: 30px; padding: 16px 20px; background: #f0f7f0; border-radius: 8px; border-left: 4px solid #22c55e; }
    .payment-info h4 { font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #166534; }
    .payment-info p { font-size: 12px; color: #333; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #999; text-align: center; line-height: 1.8; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align:center;margin-bottom:20px;">
    <button onclick="window.print()" style="background:#0D5581;color:white;border:none;padding:10px 30px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600;">
      🖨️ PDF drucken / speichern
    </button>
  </div>

  <div class="header">
    <div class="logo">
      ${settings.companyName}
      <small>${settings.siteName} &amp; Anmelden</small>
    </div>
    <div class="company-info">
      ${settings.companyName}<br>
      ${settings.email}<br>
      ${settings.siteUrl.replace('https://', 'www.')}<br>
      Tel: ${settings.phone}
    </div>
  </div>

  <div class="addresses">
    <div class="address-block">
      <h3>Rechnungsadresse</h3>
      <p>
        <strong>${invoice.billingName}</strong><br>
        ${invoice.billingAddress ? invoice.billingAddress + '<br>' : ''}
        ${invoice.billingPostcode} ${invoice.billingCity}<br>
        ${invoice.billingEmail}
      </p>
    </div>
  </div>

  <div class="invoice-meta">
    <div>
      <label>Rechnungsnr.</label>
      <span>${invoice.invoiceNumber}</span>
    </div>
    <div>
      <label>Rechnungsdatum</label>
      <span>${formatDate(invoice.invoiceDate)}</span>
    </div>
    <div>
      <label>Bestellnr.</label>
      <span>#${invoice.order?.orderNumber || '-'}</span>
    </div>
    <div>
      <label>Zahlungsstatus</label>
      <span style="color:${invoice.paymentStatus === 'paid' ? '#22c55e' : '#f59e0b'}">${invoice.paymentStatus === 'paid' ? 'Bezahlt' : 'Ausstehend'}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:10%">Pos.</th>
        <th style="width:45%">Beschreibung</th>
        <th style="width:10%">Menge</th>
        <th style="width:15%">Einzelpreis</th>
        <th style="width:20%">Gesamt</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((item, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${item.name}</td>
        <td style="text-align:right">${item.quantity}</td>
        <td style="text-align:right">${formatCurrency(item.price)}</td>
        <td style="text-align:right">${formatCurrency(item.total)}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="row">
      <span>Nettobetrag</span>
      <span>${formatCurrency(parseFloat(netTotal))}</span>
    </div>
    <div class="row">
      <span>USt. ${invoice.taxRate}%</span>
      <span>${formatCurrency(invoice.taxAmount)}</span>
    </div>
    <div class="row total">
      <span>Gesamtbetrag</span>
      <span>${formatCurrency(invoice.total)}</span>
    </div>
  </div>

  ${invoice.paymentStatus === 'paid' ? `
  <div class="payment-info">
    <h4>✓ Zahlung erhalten</h4>
    <p>Bezahlt via ${invoice.paymentMethod}${invoice.transactionId ? ` (Transaktions-ID: ${invoice.transactionId})` : ''}</p>
  </div>` : ''}

  <div class="footer">
    ${settings.companyName} · ${settings.email} · ${settings.siteUrl.replace('https://', 'www.')} · Tel: ${settings.phone}<br>
    Gemäß §19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Invoice PDF error:', error);
    return new NextResponse('Server error', { status: 500 });
  }
}
