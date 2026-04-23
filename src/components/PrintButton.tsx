'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export default function PrintButton({ invoiceNumber }: { invoiceNumber: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoice/${encodeURIComponent(invoiceNumber)}/pdf`);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rechnung-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert('PDF konnte nicht heruntergeladen werden. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold px-6 py-4 rounded-xl transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
      {loading ? 'Wird erstellt...' : 'Rechnung drucken'}
    </button>
  );
}
