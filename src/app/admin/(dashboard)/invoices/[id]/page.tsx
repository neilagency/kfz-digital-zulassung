'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const statusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  refunded: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  paid: 'Bezahlt',
  pending: 'Ausstehend',
  refunded: 'Erstattet',
  cancelled: 'Storniert',
};

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('iKFZ Digital Zulassung');
  const [siteName, setSiteName] = useState('Online Auto Abmelden');

  useEffect(() => {
    fetch(`/api/admin/invoices/${id}`)
      .then((r) => r.json())
      .then(setInvoice)
      .catch(console.error)
      .finally(() => setLoading(false));
    fetch('/api/settings')
      .then((r) => r.json())
      .then((s) => {
        if (s?.companyName) setCompanyName(s.companyName);
        if (s?.siteName) setSiteName(s.siteName);
      })
      .catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="bg-white rounded-xl p-8 shadow-sm animate-pulse space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!invoice) {
    return <p className="text-red-500">Rechnung nicht gefunden</p>;
  }

  const items = JSON.parse(invoice.items || '[]') as Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;

  const netTotal = (invoice.total / 1.19).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Rechnung {invoice.invoiceNumber}
          </h1>
          <p className="text-sm text-gray-500">
            {format(new Date(invoice.invoiceDate), 'dd. MMMM yyyy', { locale: de })}
          </p>
        </div>
        <span className={`ml-auto px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[invoice.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
          {statusLabels[invoice.paymentStatus] || invoice.paymentStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Preview Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Invoice Header */}
            <div className="bg-[#0D5581] px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-white text-lg font-bold">RECHNUNG</h2>
                <p className="text-blue-200 text-sm">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right text-white">
                <p className="font-bold">{companyName}</p>
                <p className="text-sm text-blue-200">{siteName} & Anmelden</p>
              </div>
            </div>

            {/* Billing Info */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Rechnungsadresse</p>
                  <p className="font-semibold text-gray-900">{invoice.billingName}</p>
                  {invoice.billingAddress && <p className="text-sm text-gray-600">{invoice.billingAddress}</p>}
                  <p className="text-sm text-gray-600">{invoice.billingPostcode} {invoice.billingCity}</p>
                  <p className="text-sm text-gray-600">{invoice.billingEmail}</p>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">Rechnungsdatum</p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(invoice.invoiceDate), 'dd.MM.yyyy', { locale: de })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">Bestellnr.</p>
                      <Link href={`/admin/orders/${invoice.orderId}`} className="font-medium text-[#0D5581] hover:underline">
                        #{invoice.order?.orderNumber}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="px-6 py-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Pos.</th>
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Beschreibung</th>
                    <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Menge</th>
                    <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Preis</th>
                    <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Gesamt</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-500">{i + 1}</td>
                      <td className="py-3 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                      <td className="py-3 text-sm text-gray-600 text-right">€{item.price?.toFixed(2)}</td>
                      <td className="py-3 text-sm font-medium text-gray-900 text-right">€{item.total?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="ml-auto w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Nettobetrag</span>
                  <span className="text-gray-900">€{parseFloat(netTotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">USt. {invoice.taxRate}%</span>
                  <span className="text-gray-900">€{invoice.taxAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Gesamtbetrag</span>
                  <span className="text-[#0D5581]">€{invoice.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Status Banner */}
            {invoice.paymentStatus === 'paid' && (
              <div className="px-6 py-3 bg-green-50 border-t border-green-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-700">
                  Bezahlt via {invoice.paymentMethod}
                  {invoice.transactionId && ` · Transaktions-ID: ${invoice.transactionId}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Aktionen</h3>
            <a
              href={`/api/admin/invoices/${id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0D5581] text-white rounded-lg text-sm font-medium hover:bg-[#0a4468] transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF anzeigen / drucken
            </a>
            <Link
              href={`/admin/orders/${invoice.orderId}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Bestellung anzeigen
            </Link>
          </div>

          {/* Invoice Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Details</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Rechnungsnr.</span>
                <span className="font-medium font-mono">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Erstellt am</span>
                <span className="font-medium">{format(new Date(invoice.createdAt), 'dd.MM.yyyy HH:mm', { locale: de })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Zahlungsart</span>
                <span className="font-medium">{invoice.paymentMethod || '-'}</span>
              </div>
              {invoice.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Transakt. ID</span>
                  <span className="text-xs font-mono">{invoice.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          {invoice.customer && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Kunde</h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{invoice.customer.firstName} {invoice.customer.lastName}</p>
                <p className="text-gray-500">{invoice.customer.email}</p>
                {invoice.customer.phone && <p className="text-gray-500">{invoice.customer.phone}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
