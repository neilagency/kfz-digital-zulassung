'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { PaymentMethodSelector } from './checkout/PaymentMethodSelector';
import { OrderSummary } from './checkout/OrderSummary';

const FALLBACK_PRODUCT_NAME = 'Fahrzeug jetzt online abmelden';
const FALLBACK_PRODUCT_PRICE = 19.7;

interface PaymentMethodDef {
  id: string;
  label: string;
  icon: string;
  fee: number;
  description: string;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethodDef[] = [
  {
    id: 'paypal',
    label: 'PayPal',
    icon: '/images/payment/paypal.svg',
    fee: 0.0,
    description: 'Sicher & schnell mit PayPal bezahlen',
  },
  {
    id: 'apple_pay',
    label: 'Apple Pay',
    icon: '/images/payment/applepay.svg',
    fee: 0.0,
    description: 'Bezahlen mit Apple Pay',
  },
  {
    id: 'credit_card',
    label: 'Kredit- und Debitkarte',
    icon: '/images/payment/card.svg',
    fee: 0.5,
    description: 'Visa, Mastercard, American Express',
  },
  {
    id: 'klarna',
    label: 'Klarna',
    icon: '/images/payment/klarna.svg',
    fee: 0.0,
    description: 'Sofort bezahlen, später zahlen oder in Raten',
  },
  {
    id: 'sepa',
    label: 'SEPA Überweisung',
    icon: '/images/payment/sepa.svg',
    fee: 0.0,
    description: 'Direkte Banküberweisung',
  },
];

const checkoutSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    nameOrCompany: z.string().optional(),
    company: z.string().optional(),
    street: z.string().optional(),
    postcode: z.string().optional(),
    city: z.string().optional(),
    phone: z
      .string()
      .min(6, 'Bitte geben Sie eine gültige Telefonnummer ein')
      .regex(/^[0-9+\-\s()]+$/, 'Ungültige Telefonnummer'),
    email: z
      .string()
      .min(1, 'E-Mail-Adresse ist erforderlich')
      .email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
    paymentMethod: z.string().min(1, 'Bitte wählen Sie eine Zahlungsmethode'),
    agb: z.literal(true, {
      errorMap: () => ({ message: 'Bitte akzeptieren Sie die AGB' }),
    }),
  })
  .superRefine((data, ctx) => {
    const isKlarna = data.paymentMethod === 'klarna';

    if (!data.phone?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'Bitte Telefonnummer eingeben',
      });
    }

    if (!data.email?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: 'Bitte E-Mail-Adresse eingeben',
      });
    }

    if (isKlarna) {
      if (!data.firstName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['firstName'],
          message: 'Bitte Vornamen eingeben',
        });
      }

      if (!data.lastName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lastName'],
          message: 'Bitte Nachnamen eingeben',
        });
      }

      if (!data.street?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['street'],
          message: 'Bitte Straße und Hausnummer eingeben',
        });
      }

      if (!data.postcode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['postcode'],
          message: 'Bitte Postleitzahl eingeben',
        });
      } else if (!/^\d{5}$/.test(data.postcode.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['postcode'],
          message: 'Bitte eine gültige Postleitzahl eingeben',
        });
      }

      if (!data.city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['city'],
          message: 'Bitte Stadt eingeben',
        });
      }
    }
  });

export type CheckoutData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  paymentMethods?: PaymentMethodDef[];
}

export default function CheckoutForm({ paymentMethods }: CheckoutFormProps = {}) {
  const ALL_PAYMENT_METHODS =
    paymentMethods && paymentMethods.length > 0 ? paymentMethods : DEFAULT_PAYMENT_METHODS;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [serviceData, setServiceData] = useState<Record<string, any> | null>(null);
  const [applePayAvailable, setApplePayAvailable] = useState<boolean | null>(null);
  const submittingRef = useRef(false);

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountType: string;
    discountValue: number;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('appliedCoupon');
      if (saved) setAppliedCoupon(JSON.parse(saved));
    } catch {}
  }, []);

  const handleApplyCoupon = useCallback((coupon: typeof appliedCoupon) => {
    setAppliedCoupon(coupon);
    try {
      sessionStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    } catch {}
  }, []);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    try {
      sessionStorage.removeItem('appliedCoupon');
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');

    if (error === 'payment-failed') {
      setApiError(
        'Die Zahlung war leider nicht erfolgreich. Bitte versuchen Sie es erneut oder nutzen Sie unseren Live-Chat.',
      );
    } else if (error === 'missing-order' || error === 'order-not-found') {
      setApiError('Bestellung nicht gefunden. Bitte versuchen Sie es erneut.');
    } else if (error === 'server-error') {
      setApiError('Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  }, []);

  useEffect(() => {
    try {
      if (
        typeof window !== 'undefined' &&
        (window as any).ApplePaySession &&
        (window as any).ApplePaySession.canMakePayments()
      ) {
        setApplePayAvailable(true);
      } else {
        setApplePayAvailable(false);
      }
    } catch {
      setApplePayAvailable(false);
    }
  }, []);

  const PAYMENT_METHODS = useMemo(
    () => ALL_PAYMENT_METHODS.filter((m) => !(m.id === 'apple_pay' && applePayAvailable === false)),
    [ALL_PAYMENT_METHODS, applePayAvailable],
  );

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('serviceData');
      if (raw) setServiceData(JSON.parse(raw));
    } catch {}
  }, []);

  const productId = serviceData?.productId || 'abmeldung';
  const productPrice = serviceData?.productPrice
    ? parseFloat(serviceData.productPrice)
    : FALLBACK_PRODUCT_PRICE;
  const productName = FALLBACK_PRODUCT_NAME;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      nameOrCompany: '',
      company: '',
      street: '',
      postcode: '',
      city: '',
      phone: '',
      email: '',
      paymentMethod: PAYMENT_METHODS[0]?.id || 'credit_card',
      agb: false as unknown as true,
    },
  });

  const selectedPayment = watch('paymentMethod');

  const { paymentFee, subtotal, total, discountAmount } = useMemo(() => {
    const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selectedPayment);
    const fee = selectedMethod?.fee ?? 0;
    const sub = productPrice;
    const discount = appliedCoupon?.discountAmount ?? 0;

    return {
      paymentFee: fee,
      subtotal: sub,
      total: Math.max(sub - discount + fee, 0),
      discountAmount: discount,
    };
  }, [PAYMENT_METHODS, selectedPayment, productPrice, appliedCoupon]);

  const onSubmit = useCallback(
    async (data: CheckoutData) => {
      if (submittingRef.current) return;

      submittingRef.current = true;
      setIsSubmitting(true);
      setApiError(null);

      try {
        const res = await fetch('/api/checkout/direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: data.paymentMethod === 'klarna' ? data.firstName?.trim() || '' : '',
            lastName: data.paymentMethod === 'klarna' ? data.lastName?.trim() || '' : '',
            company: data.paymentMethod === 'klarna' ? data.company?.trim() || '' : '',
            name: data.paymentMethod === 'klarna' ? '' : data.nameOrCompany?.trim() || '',
            street: data.street?.trim() || '',
            postcode: data.paymentMethod === 'klarna' ? data.postcode?.trim() || '' : '',
            city: data.paymentMethod === 'klarna' ? data.city?.trim() || '' : '',
            phone: data.phone.trim(),
            email: data.email.trim(),
            paymentMethod: data.paymentMethod,
            productId,
            productPrice: productPrice.toFixed(2),
            serviceData: serviceData || {},
            couponCode: appliedCoupon?.code || '',
          }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error(`Server-Fehler (${res.status}). Bitte versuchen Sie es erneut.`);
        }

        const result = await res.json();

        if (!res.ok || result.error) {
          throw new Error(
            result.error ||
              'Die Zahlung konnte gerade nicht gestartet werden. Bitte versuchen Sie es erneut oder nutzen Sie unseren Live-Chat.',
          );
        }

        try {
          sessionStorage.removeItem('serviceData');
          sessionStorage.removeItem('appliedCoupon');
        } catch {}

        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
          return;
        }

        if (result.invoiceUrl) {
          window.location.href = result.invoiceUrl;
          return;
        }

        setIsSubmitted(true);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
        setApiError(message);
        setIsSubmitting(false);
        submittingRef.current = false;
      }
    },
    [productId, productPrice, serviceData, appliedCoupon],
  );

  if (isSubmitted) {
    return (
      <div className="text-center py-16 md:py-24">
        <div className="w-24 h-24 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-14 h-14 text-accent" />
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
          Bestellung erfolgreich übermittelt
        </h2>

        <p className="text-gray-600 text-lg max-w-lg mx-auto mb-3">
          Vielen Dank. Wir haben Ihre Bestellung erhalten und prüfen Ihren Auftrag jetzt.
        </p>

        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Weitere Informationen senden wir Ihnen an Ihre E-Mail-Adresse.
        </p>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
          >
            Zurück zur Startseite
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="grid lg:grid-cols-5 gap-8 xl:gap-10">
        <div className="lg:col-span-3 space-y-8">
          <PaymentMethodSelector
            methods={PAYMENT_METHODS}
            register={register}
            selectedPayment={selectedPayment}
            error={errors.paymentMethod?.message as string}
            errors={errors}
          />
        </div>

        <div className="lg:col-span-2">
          <OrderSummary
            productName={productName}
            productPrice={productPrice}
            subtotal={subtotal}
            paymentFee={paymentFee}
            total={total}
            selectedPayment={selectedPayment}
            isSubmitting={isSubmitting}
            apiError={apiError}
            register={register}
            errors={errors}
            discountAmount={discountAmount}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            email={watch('email')}
            productSlug="fahrzeugabmeldung"
          />
        </div>
      </div>
    </form>
  );
}
