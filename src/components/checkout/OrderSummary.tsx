'use client';

import React, { memo, useState, useCallback, useRef } from 'react';
import {
  Shield,
  Lock,
  ShieldCheck,
  BadgeCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  X,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

const TRUST_BADGES = [
  { icon: ShieldCheck, text: 'SSL-verschlüsselt' },
  { icon: BadgeCheck, text: 'DSGVO-konform' },
  { icon: Lock, text: 'Sicher bezahlen' },
];

interface AppliedCoupon {
  code: string;
  discountAmount: number;
  discountType: string;
  discountValue: number;
}

interface OrderSummaryProps {
  productName: string;
  productPrice: number;
  subtotal: number;
  paymentFee: number;
  total: number;
  selectedPayment: string;
  isSubmitting: boolean;
  apiError: string | null;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  discountAmount?: number;
  appliedCoupon?: AppliedCoupon | null;
  onApplyCoupon?: (coupon: AppliedCoupon) => void;
  onRemoveCoupon?: () => void;
  email?: string;
  productSlug?: string;
}

function OrderSummaryInner({
  productName,
  productPrice,
  subtotal,
  paymentFee,
  total,
  selectedPayment,
  isSubmitting,
  apiError,
  register,
  errors,
  discountAmount = 0,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  email,
  productSlug,
}: OrderSummaryProps) {
  return (
    <div className="lg:sticky lg:top-28 space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-dark to-dark/90 px-6 py-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Ihre Bestellung
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm leading-snug">{productName}</p>
              <p className="text-xs text-gray-400 mt-1">× 1</p>
            </div>
            <p className="font-bold text-gray-800 whitespace-nowrap">
              {productPrice.toFixed(2).replace('.', ',')} €
            </p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Zwischensumme</span>
            <span className="font-semibold text-gray-700">
              {subtotal.toFixed(2).replace('.', ',')} €
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Zahlungsgebühr</span>
            <span className={`font-semibold ${paymentFee > 0 ? 'text-amber-600' : 'text-accent'}`}>
              {paymentFee > 0 ? `${paymentFee.toFixed(2).replace('.', ',')} €` : 'Kostenlos'}
            </span>
          </div>

          {onApplyCoupon && (
            <CouponInput
              appliedCoupon={appliedCoupon ?? null}
              onApplyCoupon={onApplyCoupon}
              onRemoveCoupon={onRemoveCoupon!}
              email={email || ''}
              productSlug={productSlug || ''}
              subtotal={subtotal}
            />
          )}

          {appliedCoupon && discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Gutschein ({appliedCoupon.code})
              </span>
              <span className="font-semibold text-green-600">
                -{discountAmount.toFixed(2).replace('.', ',')} €
              </span>
            </div>
          )}

          <div className="border-t-2 border-dashed border-gray-100" />

          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-gray-900">Gesamtsumme</span>
            <span className="text-2xl font-extrabold text-primary">
              {total.toFixed(2).replace('.', ',')} €
            </span>
          </div>

          <p className="text-[11px] text-gray-400 text-center">inkl. MwSt.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-5">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              {...register('agb')}
              className="w-5 h-5 rounded-md border-2 border-gray-300 text-primary focus:ring-primary/20 focus:ring-2 cursor-pointer transition-colors"
            />
          </div>
          <span className="text-sm text-gray-600 leading-relaxed">
            Bitte akzeptieren Sie unsere AGB, um mit Ihrer Bestellung fortzufahren.
            <br />
            Mit Ihrer Bestellung erklären Sie sich mit unseren{' '}
            <Link
              href="/allgemeine-geschaeftsbedingungen"
              className="text-primary font-semibold hover:underline"
              target="_blank"
            >
              Allgemeine Geschäftsbedingungen
            </Link>{' '}
            und{' '}
            <Link
              href="/datenschutzhinweise"
              className="text-primary font-semibold hover:underline"
              target="_blank"
            >
              Datenschutzerklärung
            </Link>{' '}
            einverstanden. <span className="text-red-500">*</span>
          </span>
        </label>

        {errors.agb && (
          <p className="text-red-500 text-sm flex items-center gap-1.5 -mt-2 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            {(errors.agb as any).message}
          </p>
        )}

        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Fehler bei der Bestellung</p>
              <p className="text-sm text-red-600 mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        <SubmitButton selectedPayment={selectedPayment} isSubmitting={isSubmitting} />

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL-verschlüsselte Verbindung</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-center gap-6">
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.text} className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-medium text-gray-500 leading-tight">
                  {badge.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 bg-accent/[0.06] rounded-xl p-4 border border-accent/10">
        <div className="w-10 h-10 bg-accent/15 rounded-full flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">Faire und transparente Prüfung</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Sollte es bei der Bearbeitung Probleme geben, informieren wir Sie transparent über den
            nächsten Schritt.
          </p>
        </div>
      </div>
    </div>
  );
}

function CouponInput({
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  email,
  productSlug,
  subtotal,
}: {
  appliedCoupon: AppliedCoupon | null;
  onApplyCoupon: (coupon: AppliedCoupon) => void;
  onRemoveCoupon: () => void;
  email: string;
  productSlug: string;
  subtotal: number;
}) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleApply = useCallback(async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, email, productSlug, subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setError(data.error || 'Ungültiger Gutscheincode');
        return;
      }
      onApplyCoupon({
        code: data.code,
        discountAmount: data.discountAmount,
        discountType: data.discountType,
        discountValue: data.discountValue,
      });
      setCode('');
    } catch {
      setError('Fehler bei der Überprüfung');
    } finally {
      setLoading(false);
    }
  }, [code, email, productSlug, subtotal, onApplyCoupon]);

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">{appliedCoupon.code}</span>
        </div>
        <button
          type="button"
          onClick={onRemoveCoupon}
          className="text-green-600 hover:text-red-500 transition-colors p-0.5"
          aria-label="Gutschein entfernen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleApply();
            }
          }}
          placeholder="Gutscheincode"
          maxLength={50}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          disabled={loading}
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="text-sm font-semibold text-primary border border-primary/30 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-3 py-2 transition-all flex items-center gap-1"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Einlösen'}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton({
  selectedPayment,
  isSubmitting,
}: {
  selectedPayment: string;
  isSubmitting: boolean;
}) {
  if (selectedPayment === 'paypal') {
    return (
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#FFC439] hover:bg-[#f0b828] disabled:opacity-70 disabled:cursor-not-allowed text-[#003087] font-extrabold text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Wird weitergeleitet…
          </>
        ) : (
          <>
            <span className="text-[#003087] font-extrabold text-xl tracking-tight">
              Pay<span className="text-[#009cde]">Pal</span>
            </span>{' '}
            Jetzt kaufen
          </>
        )}
      </button>
    );
  }

  if (selectedPayment === 'apple_pay') {
    return (
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black hover:bg-gray-900 disabled:opacity-70 disabled:cursor-not-allowed text-white font-extrabold text-lg py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Wird weitergeleitet…
          </>
        ) : (
          <>Mit Apple Pay bezahlen</>
        )}
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-gradient-to-r from-accent to-green-500 hover:from-accent/90 hover:to-green-500/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-extrabold text-lg py-4 px-6 rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 flex items-center justify-center gap-3 group"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" /> Bestellung wird erstellt…
        </>
      ) : (
        <>
          <Lock className="w-5 h-5" />
          Zahlungspflichtig bestellen
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}

export const OrderSummary = memo(OrderSummaryInner);
