'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import OrderDocuments from '@/components/admin/OrderDocuments';
import OrderCommunication from '@/components/admin/OrderCommunication';

function InvoiceLink({ orderId, orderNumber }: { orderId: string; orderNumber: number }) {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendResult, setResendResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/invoices?search=${orderNumber}`)
      .then((r) => r.json())
      .then((data) => {
        const match = data.invoices?.find((inv: any) => inv.orderId === orderId);
        if (match) setInvoice(match);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId, orderNumber]);

  const createInvoice = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (res.ok) {
        setInvoice(data);
      } else if (res.status === 409 && data.invoice) {
        setInvoice(data.invoice);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const resendInvoice = async () => {
    setResending(true);
    setResendResult(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/resend-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.emailSent) {
        setResendResult({ success: true, message: `E-Mail an ${data.recipient} gesendet` });
      } else if (res.ok && !data.emailSent) {
        setResendResult({ success: false, message: data.emailError || 'E-Mail konnte nicht gesendet werden' });
      } else {
        setResendResult({ success: false, message: data.error || 'Fehler beim Senden' });
      }
    } catch (e) {
      setResendResult({ success: false, message: 'Netzwerkfehler' });
    } finally {
      setResending(false);
    }
  };

  if (loading) return <div className="h-4 admin-skeleton rounded-md w-32" />;

  if (invoice) {
    return (
      <div className="space-y-2">
        <Link
          href={`/admin/invoices/${invoice.id}`}
          className="text-sm text-[#0D5581] hover:underline font-medium"
        >
          {invoice.invoiceNumber} anzeigen →
        </Link>
        <a
          href={`/api/admin/invoices/${invoice.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-green-600 hover:underline"
        >
          PDF herunterladen →
        </a>
        <button
          onClick={resendInvoice}
          disabled={resending}
          className="block text-sm text-orange-600 hover:underline disabled:opacity-50"
        >
          {resending ? 'Wird gesendet...' : '📧 Rechnung erneut senden'}
        </button>
        {resendResult && (
          <p className={`text-xs mt-1 ${resendResult.success ? 'text-green-600' : 'text-red-500'}`}>
            {resendResult.success ? '✅' : '❌'} {resendResult.message}
          </p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={createInvoice}
      disabled={creating}
      className="text-sm text-[#0D5581] hover:underline disabled:opacity-50"
    >
      {creating ? 'Wird erstellt...' : 'Rechnung erstellen →'}
    </button>
  );
}

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  'on-hold': 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
};

const statusLabels: Record<string, string> = {
  completed: 'Abgeschlossen',
  processing: 'In Bearbeitung',
  pending: 'Ausstehend',
  'on-hold': 'Zurückgestellt',
  cancelled: 'Storniert',
  refunded: 'Erstattet',
};

const allStatuses = ['pending', 'processing', 'on-hold', 'completed', 'cancelled'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');

  // Refund state
  const [refundAmount, setRefundAmount] = useState('');
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundResult, setRefundResult] = useState<{ success: boolean; message: string } | null>(null);
  const [refundHistory, setRefundHistory] = useState<any[]>([]);
  const [showRefundForm, setShowRefundForm] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  // Auto-dismiss toast after 6 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      // Show toast for completion email result
      if (newStatus === 'completed' && data.completionEmailResult) {
        const emailResult = data.completionEmailResult;
        if (emailResult.success && !emailResult.skipped) {
          setToast({ type: 'success', message: 'Status aktualisiert & Abschluss-E-Mail erfolgreich an den Kunden gesendet ✅' });
        } else if (emailResult.success && emailResult.skipped) {
          setToast({ type: 'warning', message: 'Status aktualisiert. Abschluss-E-Mail wurde bereits zuvor gesendet.' });
        } else {
          setToast({ type: 'error', message: `Status aktualisiert, aber E-Mail-Versand fehlgeschlagen: ${emailResult.error}` });
        }
      }

      // Refetch full order (including payments) so payment status is in sync
      const refetchRes = await fetch(`/api/admin/orders/${id}`);
      const updated = await refetchRes.json();
      setOrder(updated);
    } catch (e) {
      console.error(e);
      setToast({ type: 'error', message: 'Fehler beim Aktualisieren des Status' });
    } finally {
      setUpdating(false);
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      // Refetch order
      const res = await fetch(`/api/admin/orders/${id}`);
      const updated = await res.json();
      setOrder(updated);
      setNote('');
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch refund history when order is loaded
  const fetchRefundHistory = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}/refund`);
      const data = await res.json();
      if (data.refunds) setRefundHistory(data.refunds);
    } catch {
      // silent
    }
  }, [id]);

  useEffect(() => {
    if (order && (order.status === 'refunded' || order.payments?.some((p: any) => p.status === 'refunded' || p.status === 'partially_refunded'))) {
      fetchRefundHistory();
    }
  }, [order, fetchRefundHistory]);

  const executeRefund = async () => {
    setRefundLoading(true);
    setRefundResult(null);
    try {
      const body: any = {};
      if (refundAmount.trim()) {
        body.amount = refundAmount.trim();
      }
      const res = await fetch(`/api/admin/orders/${id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRefundResult({
          success: true,
          message: `Erstattung erfolgreich (${data.provider === 'paypal' ? 'PayPal' : 'Mollie'}): €${data.amount} (${data.isFullRefund ? 'Vollständig' : 'Teilweise'}) – Refund-ID: ${data.refundId}`,
        });
        setRefundAmount('');
        setShowRefundForm(false);
        // Refetch order to update status
        const orderRes = await fetch(`/api/admin/orders/${id}`);
        const updated = await orderRes.json();
        setOrder(updated);
        fetchRefundHistory();
      } else {
        setRefundResult({ success: false, message: data.error || 'Erstattung fehlgeschlagen' });
      }
    } catch {
      setRefundResult({ success: false, message: 'Netzwerkfehler bei der Erstattung' });
    } finally {
      setRefundLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return <p className="text-red-500">Bestellung nicht gefunden</p>;
  }

  const serviceData = order.serviceData ? JSON.parse(order.serviceData) : null;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 max-w-md px-4 py-3 rounded-lg shadow-lg border text-sm font-medium flex items-start gap-3 animate-in slide-in-from-top-2 ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          toast.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
          'bg-red-50 border-red-200 text-red-800'
        }`}>
          <span className="text-lg flex-shrink-0">
            {toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : '❌'}
          </span>
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">✕</button>
        </div>
      )}

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
            Bestellung #{order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500">
            {format(new Date(order.createdAt), 'dd. MMMM yyyy, HH:mm', { locale: de })} Uhr
          </p>
        </div>
        <span className={`ml-auto px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
          {statusLabels[order.status] || order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kundendaten</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <p className="font-medium">{order.billingFirst || order.billingFirstName} {order.billingLast || order.billingLastName}</p>
              </div>
              <div>
                <span className="text-gray-500">E-Mail:</span>
                <p className="font-medium">{order.billingEmail}</p>
              </div>
              <div>
                <span className="text-gray-500">Telefon:</span>
                <p className="font-medium">{order.billingPhone || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">Adresse:</span>
                <p className="font-medium">
                  {order.billingStreet || order.billingAddress || '-'}
                  {order.billingCity && `, ${order.billingPostcode} ${order.billingCity}`}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Positionen</h2>
            {order.items?.length > 0 ? (
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-xs text-gray-500">Menge: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">€{item.total?.toFixed(2)}</p>
                  </div>
                ))}

                {/* Pricing breakdown */}
                <div className="pt-3 border-t-2 border-gray-200 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Zwischensumme</span>
                    <span className="font-medium">€{order.subtotal?.toFixed(2)}</span>
                  </div>
                  {order.paymentFee > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Zahlungsgebühr</span>
                      <span className="font-medium">€{order.paymentFee?.toFixed(2)}</span>
                    </div>
                  )}
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                        Rabatt {order.couponCode ? `(${order.couponCode})` : ''}
                      </span>
                      <span className="font-medium text-green-600">-€{order.discountAmount?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <p className="font-bold text-gray-900">Gesamt</p>
                    <p className="text-xl font-bold text-[#0D5581]">€{order.total?.toFixed(2)}</p>
                  </div>
                  {order.discountAmount > 0 && order.total <= 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 text-xs text-green-700 text-center font-medium">
                      Vollständig per Gutschein bezahlt (100% Rabatt)
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Keine Positionen</p>
            )}
          </div>

          {/* Service Data */}
          {serviceData && Object.keys(serviceData).length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {serviceData.formType === 'autoanmeldung' ? 'Anmeldung – Formulardaten' : 'Abmeldung – Fahrzeugdaten'}
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {serviceData.formType && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Formular:</span>
                    <p className="font-medium">{serviceData.formType === 'autoanmeldung' ? 'Auto Online Anmelden' : 'Fahrzeugabmeldung'}</p>
                  </div>
                )}
                {serviceData.kennzeichen && (
                  <div>
                    <span className="text-gray-500">Kennzeichen:</span>
                    <p className="font-medium">{serviceData.kennzeichen}</p>
                  </div>
                )}
                {serviceData.fin && (
                  <div>
                    <span className="text-gray-500">FIN:</span>
                    <p className="font-medium font-mono text-xs">{serviceData.fin}</p>
                  </div>
                )}
                {serviceData.sicherheitscode && (
                  <div>
                    <span className="text-gray-500">Sicherheitscode:</span>
                    <p className="font-medium font-mono">{serviceData.sicherheitscode}</p>
                  </div>
                )}
                {serviceData.stadtKreis && (
                  <div>
                    <span className="text-gray-500">Stadt/Kreis:</span>
                    <p className="font-medium">{serviceData.stadtKreis}</p>
                  </div>
                )}
                {serviceData.codeVorne && (
                  <div>
                    <span className="text-gray-500">Code vorne:</span>
                    <p className="font-medium font-mono">{serviceData.codeVorne}</p>
                  </div>
                )}
                {serviceData.codeHinten && (
                  <div>
                    <span className="text-gray-500">Code hinten:</span>
                    <p className="font-medium font-mono">{serviceData.codeHinten}</p>
                  </div>
                )}
                {serviceData.reservierung && (
                  <div>
                    <span className="text-gray-500">Kennzeichen-Reservierung:</span>
                    <p className="font-medium">{serviceData.reservierung === 'einJahr' ? 'Ja (1 Jahr)' : 'Keine'}</p>
                  </div>
                )}
                {/* Registration form fields */}
                {serviceData.service && (
                  <div>
                    <span className="text-gray-500">Service:</span>
                    <p className="font-medium capitalize">{serviceData.service}</p>
                  </div>
                )}
                {serviceData.ausweis && (
                  <div>
                    <span className="text-gray-500">Ausweis:</span>
                    <p className="font-medium capitalize">{serviceData.ausweis}</p>
                  </div>
                )}
                {serviceData.evbNummer && (
                  <div>
                    <span className="text-gray-500">eVB-Nummer:</span>
                    <p className="font-medium font-mono">{serviceData.evbNummer}</p>
                  </div>
                )}
                {serviceData.kennzeichenWahl && (
                  <div>
                    <span className="text-gray-500">Kennzeichen-Wahl:</span>
                    <p className="font-medium capitalize">{serviceData.kennzeichenWahl}</p>
                  </div>
                )}
                {serviceData.wunschkennzeichen && (
                  <div>
                    <span className="text-gray-500">Wunschkennzeichen:</span>
                    <p className="font-medium">{serviceData.wunschkennzeichen}</p>
                  </div>
                )}
                {serviceData.kennzeichenBestellen && (
                  <div>
                    <span className="text-gray-500">Kennzeichen bestellen:</span>
                    <p className="font-medium">{serviceData.kennzeichenBestellen === 'ja' ? 'Ja' : 'Nein'}</p>
                  </div>
                )}
                {serviceData.kontoinhaber && (
                  <div>
                    <span className="text-gray-500">Kontoinhaber:</span>
                    <p className="font-medium">{serviceData.kontoinhaber}</p>
                  </div>
                )}
                {serviceData.iban && (
                  <div>
                    <span className="text-gray-500">IBAN:</span>
                    <p className="font-medium font-mono text-xs">{serviceData.iban}</p>
                  </div>
                )}
                {/* Uploaded files with download links */}
                {serviceData.uploadedFiles && Object.keys(serviceData.uploadedFiles).length > 0 && (
                  <div className="col-span-2 mt-2">
                    <span className="text-gray-500 block mb-2">Hochgeladene Dokumente:</span>
                    <div className="space-y-2">
                      {Object.entries(serviceData.uploadedFiles).map(([key, file]: [string, any]) => {
                        const fileLabel: Record<string, string> = {
                          fahrzeugscheinVorne: 'Fahrzeugschein (Vorderseite)',
                          fahrzeugscheinHinten: 'Fahrzeugschein (Rückseite)',
                          fahrzeugbriefVorne: 'Fahrzeugbrief (Vorderseite)',
                        };
                        const label = fileLabel[key] || key;
                        const hasUrl = !!file.url;
                        return (
                          <div key={key} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 text-sm">
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-700">{label}</p>
                              <p className="text-xs text-gray-400 truncate">{file.name} ({(file.size / 1024).toFixed(0)} KB)</p>
                            </div>
                            {hasUrl ? (
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D5581] text-white text-xs font-medium rounded-lg hover:bg-[#0a4468] transition-colors flex-shrink-0"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Herunterladen
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400 flex-shrink-0">Kein Download</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          <OrderDocuments orderId={order.id} />

          {/* Customer Communication */}
          <OrderCommunication orderId={order.id} />

          {/* Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notizen</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {order.notes?.length > 0 ? (
                order.notes.map((n: any) => (
                  <div key={n.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-700">{n.author}</span>
                      <span className="text-xs text-gray-400">
                        {format(new Date(n.createdAt), 'dd.MM.yy HH:mm')}
                      </span>
                    </div>
                    <p className="text-gray-600">{n.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Keine Notizen</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Notiz hinzufügen..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0D5581] focus:border-transparent outline-none"
              />
              <button
                onClick={addNote}
                className="px-4 py-2 bg-[#0D5581] text-white rounded-lg text-sm hover:bg-[#0a4468] transition"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Change */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status ändern</h3>
            <div className="space-y-2">
              {allStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updating}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    order.status === s
                      ? 'bg-[#0D5581] text-white font-medium'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  } disabled:opacity-50`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Zahlung</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Methode</span>
                <span className="font-medium capitalize">{order.paymentMethod || '-'}</span>
              </div>
              {order.payments?.map((p: any) => (
                <div key={p.id} className="bg-gray-50 rounded-lg p-3 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium ${p.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-500">Betrag</span>
                    <span className="font-medium">€{p.amount?.toFixed(2)}</span>
                  </div>
                  {p.transactionId && (
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-500">Transakt. ID</span>
                      <span className="text-xs font-mono">{p.transactionId}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Link */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Rechnung</h3>
            <InvoiceLink orderId={order.id} orderNumber={order.orderNumber} />
          </div>

          {/* Refund Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Erstattung ({order.paymentMethod === 'paypal' ? 'PayPal' : 'Mollie'})</h3>

            {/* Refund result message */}
            {refundResult && (
              <div className={`mb-3 p-3 rounded-lg text-sm ${
                refundResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {refundResult.success ? '✅' : '❌'} {refundResult.message}
              </div>
            )}

            {/* Refund history */}
            {refundHistory.length > 0 && (
              <div className="mb-3 space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Erstattungsverlauf</p>
                {refundHistory.map((r: any) => (
                  <div key={r.id} className="bg-gray-50 rounded-lg p-2.5 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Betrag</span>
                      <span className="font-medium">{'\u20AC'}{parseFloat(r.amount?.value || '0').toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className={`font-medium ${
                        r.status === 'refunded' ? 'text-green-600'
                          : r.status === 'pending' ? 'text-yellow-600'
                          : r.status === 'processing' ? 'text-blue-600'
                          : 'text-gray-600'
                      }`}>{r.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID</span>
                      <span className="font-mono text-gray-500">{r.id}</span>
                    </div>
                    {r.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Datum</span>
                        <span className="text-gray-500">{format(new Date(r.createdAt), 'dd.MM.yy HH:mm')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Show refund form or button */}
            {order.status === 'refunded' ? (
              <p className="text-sm text-purple-600 font-medium">Bestellung vollständig erstattet</p>
            ) : !showRefundForm ? (
              <button
                onClick={() => { setShowRefundForm(true); setRefundResult(null); }}
                className="w-full px-3 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium hover:bg-purple-100 transition"
              >
                Erstattung durchführen
              </button>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Betrag (leer = Gesamtbetrag {'\u20AC'}{order.total?.toFixed(2)})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'\u20AC'}</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={order.total}
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      placeholder={order.total?.toFixed(2)}
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={executeRefund}
                    disabled={refundLoading}
                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {refundLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Wird erstattet...
                      </>
                    ) : (
                      'Erstattung bestätigen'
                    )}
                  </button>
                  <button
                    onClick={() => { setShowRefundForm(false); setRefundAmount(''); setRefundResult(null); }}
                    disabled={refundLoading}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50 transition"
                  >
                    Abbrechen
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Die Erstattung wird direkt über {order.paymentMethod === 'paypal' ? 'PayPal' : 'Mollie'} ausgeführt. Der Betrag wird dem Kunden zurückerstattet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
