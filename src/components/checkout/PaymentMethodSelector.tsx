'use client';

import React, { memo } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import {
  CreditCard,
  Lock,
  Banknote,
  AlertCircle,
  Building2,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

interface PaymentMethodDef {
  id: string;
  label: string;
  icon: string;
  fee: number;
  description: string;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethodDef[];
  register: UseFormRegister<any>;
  selectedPayment: string;
  error?: string;
  errors: FieldErrors;
}

const INPUT_CLASS =
  'w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base bg-white placeholder:text-gray-400';

const LABEL_CLASS = 'block text-sm font-semibold text-gray-700 mb-1.5';

const PAYMENT_DESCRIPTIONS: Record<string, React.ReactNode> = {
  paypal: (
    <p>
      Zahlen Sie sicher und schnell mit PayPal. Nach Klick auf „PayPal Jetzt kaufen" werden Sie
      automatisch zur sicheren PayPal-Zahlung weitergeleitet.
    </p>
  ),
  apple_pay: (
    <p>
      Bezahlen Sie bequem und sicher mit Apple Pay. Nach Klick auf „Mit Apple Pay bezahlen" werden
      Sie zur sicheren Zahlungsseite weitergeleitet.
    </p>
  ),
  credit_card: (
    <div className="space-y-3">
      <p>
        Zahlen Sie sicher per Kredit- oder Debitkarte. Nach Klick auf
        „Zahlungspflichtig bestellen" werden Sie zur sicheren Zahlungsseite weitergeleitet.
      </p>
      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5" />
        Sichere Zahlungen bereitgestellt durch{' '}
        <span className="font-bold text-gray-500">mollie</span>
      </p>
    </div>
  ),
  sepa: (
    <div className="space-y-2">
      <p>
        Bitte überweisen Sie den Gesamtbetrag auf unser Bankkonto. Die Bearbeitung beginnt nach
        Zahlungseingang.
      </p>
    </div>
  ),
  klarna: (
    <div className="space-y-3">
      <p>Bezahlen Sie flexibel mit Klarna – sofort, später oder in Raten.</p>
      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5" />
        Sichere Zahlungen bereitgestellt durch{' '}
        <span className="font-bold text-gray-500">Klarna</span> via{' '}
        <span className="font-bold text-gray-500">mollie</span>
      </p>
    </div>
  ),
};

function PaymentBrandIcon({ methodId }: { methodId: string }) {
  switch (methodId) {
    case 'paypal':
      return (
        <span className="text-[#003087] font-extrabold text-base tracking-tight">
          Pay<span className="text-[#009cde]">Pal</span>
        </span>
      );
    case 'apple_pay':
      return <span className="text-black font-bold text-lg">Apple Pay</span>;
    case 'credit_card':
      return (
        <div className="flex gap-1">
          <span className="text-xs font-bold">Karte</span>
        </div>
      );
    case 'sepa':
      return <Banknote className="w-6 h-6 text-gray-400" />;
    case 'klarna':
      return (
        <span className="bg-[#FFB3C7] text-[#0A0B09] text-[10px] font-extrabold px-2 py-1 rounded-md tracking-tight">
          Klarna.
        </span>
      );
    default:
      return null;
  }
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1.5">
      <AlertCircle className="w-3.5 h-3.5" />
      {message}
    </p>
  );
}

function PaymentMethodSelectorInner({
  methods,
  register,
  selectedPayment,
  error,
  errors,
}: PaymentMethodSelectorProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary/90 px-6 md:px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Zahlungsmethode</h2>
            <p className="text-white/60 text-xs">Alle Zahlungen sind SSL-verschlüsselt</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="space-y-3">
          {methods.map((method) => {
            const isSelected = selectedPayment === method.id;
            const isKlarna = method.id === 'klarna';

            return (
              <div key={method.id}>
                <label
                  className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/[0.03] shadow-sm'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                  } ${isSelected ? 'rounded-b-none' : ''}`}
                >
                  <input
                    type="radio"
                    value={method.id}
                    {...register('paymentMethod')}
                    className="sr-only"
                  />

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'border-primary' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-800 text-sm">{method.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <PaymentBrandIcon methodId={method.id} />
                  </div>
                </label>

                {isSelected && (
                  <div className="border-2 border-t-0 border-primary rounded-b-xl bg-gray-50/50 p-4 relative text-sm text-gray-600">
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-gray-50/50 border-l-2 border-t-2 border-primary rotate-45" />

                    <div className="space-y-4">
                      {PAYMENT_DESCRIPTIONS[method.id] || <p>{method.description}</p>}

                      {isKlarna ? (
                        <>
                          <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                              <label className={LABEL_CLASS}>
                                Vorname <span className="text-red-500">*</span>
                              </label>
                              <input
                                {...register('firstName')}
                                className={`${INPUT_CLASS} ${
                                  errors.firstName
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                    : ''
                                }`}
                                placeholder="Max"
                              />
                              <ErrorMessage message={errors.firstName?.message as string} />
                            </div>

                            <div>
                              <label className={LABEL_CLASS}>
                                Nachname <span className="text-red-500">*</span>
                              </label>
                              <input
                                {...register('lastName')}
                                className={`${INPUT_CLASS} ${
                                  errors.lastName
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                    : ''
                                }`}
                                placeholder="Mustermann"
                              />
                              <ErrorMessage message={errors.lastName?.message as string} />
                            </div>
                          </div>

                          <div>
                            <label className={LABEL_CLASS}>Firma</label>
                            <div className="relative">
                              <Building2 className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                {...register('company')}
                                className={`${INPUT_CLASS} pl-11`}
                                placeholder="Firma (optional)"
                              />
                            </div>
                            <ErrorMessage message={errors.company?.message as string} />
                          </div>

                          <div>
                            <label className={LABEL_CLASS}>
                              Straße und Hausnummer <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register('street')}
                              className={`${INPUT_CLASS} ${
                                errors.street
                                  ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                  : ''
                              }`}
                              placeholder="Musterstraße 14"
                            />
                            <ErrorMessage message={errors.street?.message as string} />
                          </div>

                          <div className="grid sm:grid-cols-[140px_minmax(0,1fr)] gap-5">
                            <div>
                              <label className={LABEL_CLASS}>
                                PLZ <span className="text-red-500">*</span>
                              </label>
                              <input
                                {...register('postcode')}
                                className={`${INPUT_CLASS} ${
                                  errors.postcode
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                    : ''
                                }`}
                                placeholder="45141"
                              />
                              <ErrorMessage message={errors.postcode?.message as string} />
                            </div>

                            <div>
                              <label className={LABEL_CLASS}>
                                Stadt <span className="text-red-500">*</span>
                              </label>
                              <input
                                {...register('city')}
                                className={`${INPUT_CLASS} ${
                                  errors.city
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                    : ''
                                }`}
                                placeholder="Essen"
                              />
                              <ErrorMessage message={errors.city?.message as string} />
                            </div>
                          </div>

                          <div>
                            <label className={LABEL_CLASS}>
                              Telefon <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                {...register('phone')}
                                type="tel"
                                className={`${INPUT_CLASS} pl-11 ${
                                  errors.phone
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                    : ''
                                }`}
                                placeholder="+49 152 24999190"
                              />
                            </div>
                            <ErrorMessage message={errors.phone?.message as string} />
                          </div>

                          <div>
                            <label className={LABEL_CLASS}>
                              E-Mail-Adresse <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                {...register('email')}
                                type="email"
                                className={`${INPUT_CLASS} pl-11 ${
                                  errors.email
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                    : ''
                                }`}
                                placeholder="max@beispiel.de"
                              />
                            </div>
                            <ErrorMessage message={errors.email?.message as string} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className={LABEL_CLASS}>Name / Firma</label>
                            <div className="relative">
                              <Building2 className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                {...register('nameOrCompany')}
                                className={`${INPUT_CLASS} pl-11 ${
                                  errors.nameOrCompany
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                    : ''
                                }`}
                                placeholder="Max Mustermann oder Firma"
                              />
                            </div>
                            <ErrorMessage message={errors.nameOrCompany?.message as string} />
                          </div>

                          <div>
                            <label className={LABEL_CLASS}>Adresse</label>
                            <div className="relative">
                              <MapPin className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                {...register('street')}
                                className={`${INPUT_CLASS} pl-11 ${
                                  errors.street
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                    : ''
                                }`}
                                placeholder="Musterstraße 14, 45141 Essen"
                              />
                            </div>
                            <ErrorMessage message={errors.street?.message as string} />
                          </div>

                          <div>
                            <label className={LABEL_CLASS}>
                              Telefon <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                {...register('phone')}
                                type="tel"
                                className={`${INPUT_CLASS} pl-11 ${
                                  errors.phone
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                    : ''
                                }`}
                                placeholder="+49 152 24999190"
                              />
                            </div>
                            <ErrorMessage message={errors.phone?.message as string} />
                          </div>

                          <div>
                            <label className={LABEL_CLASS}>
                              E-Mail-Adresse <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                {...register('email')}
                                type="email"
                                className={`${INPUT_CLASS} pl-11 ${
                                  errors.email
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                    : ''
                                }`}
                                placeholder="max@beispiel.de"
                              />
                            </div>
                            <ErrorMessage message={errors.email?.message as string} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export const PaymentMethodSelector = memo(PaymentMethodSelectorInner);
