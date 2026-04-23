import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { getSiteSettings } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';
import { verifyInvoiceToken } from '@/lib/invoice-token';
import {
  FileText,
  Building2,
  CreditCard,
  Clock,
  CheckCircle,
  Phone,
  ArrowLeft,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rechnung – SEPA-Überweisung',
  robots: { index: false, follow: false },
};

/* ── Company bank details (SEPA) ─────────────────────────── */
const BANK_DETAILS = {
  accountHolder: 'ikfz Digital-Zulassung UG (haftungsbeschränkt)',
  iban: 'DE70 3002 0900 5320 8804 65',
  bic: 'CMCIDEDD',
  bankName: 'Targobank',
  reference: 'Bestellnr.', // + order number
};

export const revalidate = 60; // Cache for 60s — invoice data rarely changes

interface InvoicePageProps {
  params: Promise<{ invoiceNumber: string }>;
  searchParams: Promise<{ order?: string; token?: string }>;
}

export default async function InvoicePage({ params, searchParams }: InvoicePageProps) {
  const { invoiceNumber } = await params;
  const { order: orderParam, token } = await searchParams;

  // Security: Require a valid HMAC token to access the invoice
  const decodedInvoiceNumber = decodeURIComponent(invoiceNumber);
  if (!token || !verifyInvoiceToken(decodedInvoiceNumber, token)) {
    return notFound();
  }

  // Look up invoice + order in one query to avoid N+1
  const invoice = await prisma.invoice.findFirst({
    where: { invoiceNumber: decodeURIComponent(invoiceNumber) },
    include: {
      order: {
        select: {
          orderNumber: true,
          billingFirst: true,
          billingLast: true,
          billingEmail: true,
          billingStreet: true,
          billingCity: true,
          billingPostcode: true,
          billingPhone: true,
          productName: true,
          total: true,
          subtotal: true,
          paymentFee: true,
          createdAt: true,
        },
      },
    },
  });

  if (!invoice || !invoice.order) return notFound();

  const dbOrder = invoice.order;

  const settings = await getSiteSettings();
  const items = JSON.parse(invoice.items || '[]') as Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;

  const orderNumber = dbOrder.orderNumber;
  const transferReference = `${orderNumber} - ${dbOrder.billingLast || invoiceNumber}`;
  const formattedDate = dbOrder.createdAt.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* ─── Header ─── */}
      <section className="bg-gradient-to-br from-dark via-primary-900 to-dark pt-28 md:pt-32 pb-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-6">
            <FileText className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Rechnung {invoiceNumber}
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Vielen Dank für Ihre Bestellung! Bitte überweisen Sie den Gesamtbetrag
            auf unser Bankkonto.
          </p>
          <p className="text-accent font-bold text-xl mt-4">
            Bestellnummer: #{orderNumber}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 -mt-6 space-y-6 relative z-10">

        {/* ─── Bank Transfer Details (Main Card) ─── */}
        <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bankverbindung</h2>
              <p className="text-sm text-gray-500">SEPA-Überweisung</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-sm text-gray-500 font-medium">Kontoinhaber</span>
              <span className="text-base font-bold text-gray-900">{BANK_DETAILS.accountHolder}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-sm text-gray-500 font-medium">IBAN</span>
              <span className="text-base font-bold text-gray-900 font-mono tracking-wider">
                {BANK_DETAILS.iban}
              </span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-sm text-gray-500 font-medium">BIC / SWIFT</span>
              <span className="text-base font-bold text-gray-900 font-mono">{BANK_DETAILS.bic}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-sm text-gray-500 font-medium">Bank</span>
              <span className="text-base font-bold text-gray-900">{BANK_DETAILS.bankName}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-sm text-gray-500 font-medium">Verwendungszweck</span>
              <span className="text-base font-bold text-primary font-mono">{transferReference}</span>
            </div>
          </div>

          {/* Amount to transfer */}
          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Zu überweisender Betrag</p>
              <p className="text-xs text-gray-400 mt-0.5">inkl. 19% MwSt.</p>
            </div>
            <p className="text-3xl font-extrabold text-primary">
              {invoice.total.toFixed(2).replace('.', ',')} €
            </p>
          </div>

          {/* Important notice */}
          <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-bold mb-1">Wichtiger Hinweis:</p>
              <p>
                Bitte geben Sie im Verwendungszweck unbedingt <strong>„{transferReference}"</strong> an,
                damit wir Ihre Zahlung zuordnen können. Die Bearbeitung Ihrer Bestellung beginnt
                unmittelbar nach Zahlungseingang.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Invoice Details ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Rechnungsdetails
          </h2>

          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Rechnungsnummer</p>
              <p className="text-sm font-bold text-gray-900">{invoiceNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Datum</p>
              <p className="text-sm font-bold text-gray-900">{formattedDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Kunde</p>
              <p className="text-sm font-bold text-gray-900">
                {dbOrder.billingFirst} {dbOrder.billingLast}
              </p>
              {dbOrder.billingStreet && (
                <p className="text-sm text-gray-500">{dbOrder.billingStreet}</p>
              )}
              {(dbOrder.billingPostcode || dbOrder.billingCity) && (
                <p className="text-sm text-gray-500">
                  {dbOrder.billingPostcode} {dbOrder.billingCity}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">E-Mail</p>
              <p className="text-sm font-bold text-gray-900">{dbOrder.billingEmail}</p>
            </div>
          </div>

          {/* Line items */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Beschreibung</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Menge</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Betrag</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">
                      {item.total.toFixed(2).replace('.', ',')} €
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td colSpan={2} className="px-4 py-2 text-right text-gray-500 text-sm">
                    Nettobetrag
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-gray-700">
                    {(invoice.total / 1.19).toFixed(2).replace('.', ',')} €
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={2} className="px-4 py-2 text-right text-gray-500 text-sm">
                    MwSt. (19%)
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-gray-700">
                    {invoice.taxAmount.toFixed(2).replace('.', ',')} €
                  </td>
                </tr>
                <tr className="border-t-2 border-primary/20 bg-primary/5">
                  <td colSpan={2} className="px-4 py-3 text-right font-bold text-gray-900">
                    Gesamtbetrag
                  </td>
                  <td className="px-4 py-3 text-right font-extrabold text-primary text-lg">
                    {invoice.total.toFixed(2).replace('.', ',')} €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Zahlungsmethode: {invoice.paymentMethod} • Zahlungsstatus: Ausstehend
          </p>
        </div>

        {/* ─── What happens next ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-accent" />
            Wie geht es weiter?
          </h2>
          <ol className="space-y-4 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>
                Überweisen Sie <strong>{invoice.total.toFixed(2).replace('.', ',')} €</strong> an
                die oben genannte Bankverbindung mit dem Verwendungszweck{' '}
                <strong>„{transferReference}"</strong>.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>
                Sobald Ihre Zahlung bei uns eingegangen ist (in der Regel{' '}
                <strong>1–2 Werktage</strong>), erhalten Sie eine Bestätigung per E-Mail.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>
                Unser Team beginnt dann <strong>sofort</strong> mit der Bearbeitung Ihrer
                Fahrzeugabmeldung.
              </span>
            </li>
          </ol>
        </div>

        {/* ─── Actions ─── */}
        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <PrintButton invoiceNumber={invoiceNumber} />
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-4 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück zur Startseite
          </Link>
        </div>

        {/* ─── Support ─── */}
        <div className="bg-gradient-to-r from-primary/[0.04] to-accent/[0.04] rounded-2xl border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Phone className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Fragen zur Überweisung?</h3>
            <p className="text-sm text-gray-500">
              Unser Support-Team hilft Ihnen gerne weiter.
            </p>
          </div>
          <a
            href={settings.phoneLink}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            {settings.phone}
          </a>
        </div>
      </div>
    </main>
  );
}
