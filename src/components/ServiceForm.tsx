'use client';

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle,
  Shield,
  Lock,
  AlertCircle,
  Phone,
  MessageCircle,
  Play,
  HelpCircle,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  Car,
  FileText,
  CreditCard,
} from 'lucide-react';
import Image from 'next/image';
import { FormErrorBanner } from './ui/FormErrorBanner';
import { VehicleTypeSelector, PLATE_PLACEHOLDERS, type VehicleType } from './ui/VehicleTypeSelector';

/* ------------------------------------------------------------------ */
/*  Zod Schema – mirrors every required WAPF field in WordPress       */
/* ------------------------------------------------------------------ */
const formSchema = z.object({
  fahrzeugTyp: z.enum(['auto', 'motorrad', 'anhaenger', 'leichtkraftrad', 'lkw', 'andere']).default('auto'),
  kennzeichen: z.string().min(3, 'Bitte geben Sie ein gültiges Kennzeichen ein'),
  fin: z.string().min(6, 'Bitte geben Sie die FIN (Feld E) ein'),
  sicherheitscode: z
    .string()
    .min(7, 'Bitte geben Sie den 7-stelligen Sicherheitscode ein')
    .max(7, 'Der Sicherheitscode muss genau 7 Zeichen haben'),
  stadtKreis: z.string().min(2, 'Bitte geben Sie Ihre Stadt / Ihren Kreis ein'),
  codeVorne: z
    .string()
    .min(3, 'Bitte geben Sie den 3-stelligen Code ein')
    .max(3, 'Der Code muss genau 3 Zeichen haben'),
  codeHinten: z
    .string()
    .min(3, 'Bitte geben Sie den 3-stelligen Code ein')
    .max(3, 'Der Code muss genau 3 Zeichen haben'),
  reservierung: z.enum(['keine', 'einJahr'], {
    required_error: 'Bitte wählen Sie eine Option',
  }).default('keine'),
});

type FormData = z.infer<typeof formSchema>;

/* ------------------------------------------------------------------ */
/*  Image URLs from WordPress media library                           */
/* ------------------------------------------------------------------ */
const FAHRZEUGSCHEIN_IMAGE =
  '/uploads/wp/2024/01/WhatsApp-Image-2024-01-06-at-3.21.48-PM.jpeg';
const PLAKETTE_IMAGE =
  '/uploads/wp/2024/10/WhatsApp-Image-2024-10-28-at-23.51.02.jpeg';
const CODE_HINT_IMAGE =
  '/uploads/wp/2024/01/WhatsApp-Image-2024-01-06-at-3.21.48-PM-1.jpeg';

const VIDEO_FAHRZEUGSCHEIN = 'https://www.youtube.com/watch?v=u38keaF1QKU';
const VIDEO_PLAKETTE = 'https://www.youtube.com/watch?v=3nsdJSvKAtE';

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base bg-white';

/* ------------------------------------------------------------------ */
/*  Step definitions                                                  */
/* ------------------------------------------------------------------ */
const FORM_STEPS = [
  {
    title: 'Fahrzeugdaten',
    description: 'Kennzeichen & FIN',
    icon: Car,
  },
  {
    title: 'Fahrzeugschein-Code',
    description: 'Code vom Fahrzeugschein',
    icon: FileText,
  },
  {
    title: 'Kennzeichen-Code(s)',
    description: 'Code(s) von den Kennzeichen',
    icon: Shield,
  },
  {
    title: 'Reservierung',
    description: 'Reservierung wählen',
    icon: CreditCard,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
interface ServiceFormProps {
  basePrice?: number;
  reservierungPrice?: number;
  contactPhone?: string;
  contactPhoneLink?: string;
  contactWhatsapp?: string;
}

export default function ServiceForm({
  basePrice: propBasePrice,
  reservierungPrice: propReservierungPrice,
  contactPhone = '01522 4999190',
  contactPhoneLink = 'tel:015224999190',
  contactWhatsapp = 'https://wa.me/4915224999190',
}: ServiceFormProps = {}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step4Visited, setStep4Visited] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const formTopRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fahrzeugTyp: 'auto' as const,
      kennzeichen: '',
      fin: '',
      sicherheitscode: '',
      stadtKreis: '',
      codeVorne: '',
      codeHinten: '',
      reservierung: 'keine',
    },
  });

  const reservierung = watch('reservierung');
  const fahrzeugTyp = watch('fahrzeugTyp') as VehicleType;

  /* Price calculation – memoized to avoid recalculation on unrelated re-renders */
  const basePrice = propBasePrice ?? 19.7;
  const reservierungUnitPrice = propReservierungPrice ?? 4.7;
  const { reservierungPrice, totalPrice } = useMemo(() => {
    const rp = reservierung === 'einJahr' ? reservierungUnitPrice : 0;
    return { reservierungPrice: rp, totalPrice: basePrice + rp };
  }, [reservierung, reservierungUnitPrice, basePrice]);

  /* Fields to validate per step */
  const stepFields: (keyof FormData)[][] = [
    ['fahrzeugTyp', 'kennzeichen', 'fin'],
    ['sicherheitscode', 'stadtKreis'],
    ['codeVorne', 'codeHinten'],
    ['reservierung'],
  ];

  const nextStep = async () => {
    const valid = await trigger(stepFields[currentStep]);
    if (valid && currentStep < FORM_STEPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      if (next === 3) {
        /* Mark Step 4 as visited after a short delay so the user
           actually sees the reservation options before submitting. */
        setTimeout(() => setStep4Visited(true), 500);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const onSubmit = async (data: FormData) => {
    /* Guard: only allow submission if the user has actually seen Step 4 */
    if (currentStep !== 3 || !step4Visited) return;
    if (submittingRef.current) return; // Prevent double submission
    submittingRef.current = true;
    setIsSubmitting(true);
    setFormError(null);

    // Store service form data in sessionStorage so the checkout page can send it
    try {
      sessionStorage.setItem('serviceData', JSON.stringify({
        formType: 'fahrzeugabmeldung',
        productId: 'abmeldung',
        productPrice: totalPrice.toFixed(2),
        fahrzeugTyp: data.fahrzeugTyp,
        kennzeichen: data.kennzeichen.toUpperCase(),
        fin: data.fin.toUpperCase(),
        sicherheitscode: data.sicherheitscode,
        stadtKreis: data.stadtKreis,
        codeVorne: data.codeVorne,
        codeHinten: data.codeHinten,
        reservierung: data.reservierung,
      }));
    } catch (err) {
      setFormError('Daten konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.');
      setIsSubmitting(false);
      submittingRef.current = false;
      return;
    }

    setIsSubmitting(false);
    submittingRef.current = false;
    router.push('/rechnung');
  };

  /* ---- Main form ---- */
  return (
    <div ref={formTopRef} className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
      >
        {/* ============ FORM HEADER ============ */}
        <div className="bg-gradient-to-r from-primary to-primary-700 px-6 md:px-10 py-6 text-white">
          <h2 className="text-xl md:text-2xl font-extrabold">
            Jetzt Formular ausfüllen – in 2 Minuten offiziell abgemeldet
          </h2>
        </div>

        {/* ============ STEP INDICATOR ============ */}
        <div className="px-4 md:px-10 pt-8 pb-2">
          <div className="flex items-center">
            {FORM_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isDone = index < currentStep;
              return (
                <div key={step.title} className="flex items-center flex-1 last:flex-initial min-w-0">
                  {/* Step circle */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isDone) setCurrentStep(index);
                    }}
                    className={`relative flex items-center gap-1 md:gap-1.5 px-2 md:px-2.5 py-1 md:py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : isDone
                        ? 'bg-accent/15 text-accent cursor-pointer hover:bg-accent/25'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle className="w-4 h-4 shrink-0" />
                    ) : (
                      <StepIcon className="w-4 h-4 shrink-0" />
                    )}
                    <span className="hidden xl:inline">{step.title}</span>
                    <span className="xl:hidden">{index + 1}</span>
                  </button>
                  {/* Connector line */}
                  {index < FORM_STEPS.length - 1 && (
                    <div className="flex-1 mx-1 md:mx-2">
                      <div
                        className={`h-0.5 rounded-full transition-all ${
                          isDone ? 'bg-accent' : 'bg-gray-200'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Step description (mobile & desktop) */}
          <p className="text-xs text-gray-400 mt-3 text-center md:text-left">
            Schritt {currentStep + 1} von {FORM_STEPS.length}:{' '}
            <span className="text-gray-600 font-medium">{FORM_STEPS[currentStep].description}</span>
          </p>
        </div>

        {/* ============ ANIMATED STEP CONTENT ============ */}
        <div className="px-6 md:px-10 py-6">
          <div
            key={currentStep}
            className="animate-in fade-in slide-in-from-right-4 duration-300"
          >
              {/* ========== STEP 1: Fahrzeugdaten ========== */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  {/* Vehicle Type Selector */}
                  <FieldGroup
                    label="Fahrzeugtyp wählen"
                    description="Wählen Sie den Typ Ihres Fahrzeugs"
                  >
                    <VehicleTypeSelector
                      value={fahrzeugTyp}
                      onChange={(t) => setValue('fahrzeugTyp', t, { shouldValidate: true })}
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Kennzeichen eintragen"
                    required
                    description="Bei E-, H- oder Saisonkennzeichen bitte nur das normale Kennzeichen eingeben."
                    error={errors.kennzeichen?.message}
                  >
                    <input
                      {...register('kennzeichen')}
                      placeholder={`z. B. ${PLATE_PLACEHOLDERS[fahrzeugTyp].city}-${PLATE_PLACEHOLDERS[fahrzeugTyp].letters}-${PLATE_PLACEHOLDERS[fahrzeugTyp].numbers}`}
                      autoCapitalize="characters"
                      autoCorrect="off"
                      spellCheck={false}
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.toUpperCase();
                      }}
                      className={`${INPUT_CLASS} font-mono uppercase`}
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Fahrzeug-Identnummer (FIN)"
                    required
                    description="Die FIN steht im Fahrzeugschein in Feld E. (Siehe Bild)"
                    error={errors.fin?.message}
                  >
                    <input
  {...register('fin')}
  placeholder="z. B. WBA71AUU805U1111"
  autoCapitalize="none"
  autoCorrect="off"
  spellCheck={false}
  onInput={(e) => {
    e.currentTarget.value = e.currentTarget.value.toUpperCase();
  }}
  className={`${INPUT_CLASS} font-mono uppercase`}
/>
                  </FieldGroup>

                  {/* Helper image – Kennzeichen & FIN */}
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <div className="px-4 py-3 bg-primary/5 border-b border-gray-200">
                      <p className="text-sm font-semibold text-primary flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Hier finden Sie Kennzeichen &amp; FIN im Fahrzeugschein
                      </p>
                    </div>
                    <div className="p-4">
                      <Image
                        src={FAHRZEUGSCHEIN_IMAGE}
                        alt="Kennzeichen und FIN im Fahrzeugschein - Feld E markiert"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-lg"
                        priority
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========== STEP 2: Sicherheitscode (Fahrzeugschein) ========== */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <FieldGroup
                    label="Code vom Fahrzeugschein"
                    required
                    description="7-stellig, auf der Rückseite. Groß-/Kleinschreibung beachten"
                    error={errors.sicherheitscode?.message}
                  >
                    <input
  {...register('sicherheitscode')}
  placeholder="z. B. YKeqT2v"
  maxLength={7}
  autoCapitalize="none"
  autoCorrect="off"
  spellCheck={false}
  className={`${INPUT_CLASS} font-mono`}
/>
                  </FieldGroup>

                  <FieldGroup
                    label="Stadt/Kreis"
                    required
                    description="Steht direkt unter dem Sicherheitscode"
                    error={errors.stadtKreis?.message}
                  >
                    <input
  {...register('stadtKreis')}
  placeholder="z. B. Neckar-Odenwald-Kreis"
  autoCapitalize="none"
  autoCorrect="off"
  spellCheck={false}
  className={INPUT_CLASS}
/>
                  </FieldGroup>

                  {/* Video – Fahrzeugschein-Codes */}
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <div className="px-4 py-3 bg-primary/5 border-b border-gray-200">
                      <p className="text-sm font-semibold text-primary">
                        Anleitung zum Freilegen des Fahrzeugschein-Codes
                      </p>
                    </div>
                    <div className="p-4 space-y-4">
                      <a
                        href={VIDEO_FAHRZEUGSCHEIN}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-primary hover:text-primary-600 font-bold transition-colors group"
                      >
                        <span className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
                          <Play className="w-5 h-5 text-primary" />
                        </span>
                        <span className="text-sm md:text-base">
                          Hier klicken: Video-Anleitung zum Freilegen des Fahrzeugschein-Codes (2 Varianten)
                        </span>
                      </a>
                      <Image
                        src={PLAKETTE_IMAGE}
                        alt="Anleitung Sicherheitscode freilegen auf dem Fahrzeugschein"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========== STEP 3: Kennzeichen-Codes ========== */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Info note about plates */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      3-stelliger Code (Kennzeichen-Vorne / Hinten)
                    </p>
                    <p className="text-sm text-gray-600">
                      Entfernen Sie die Plakette vorsichtig, um den 3-stelligen Code freizulegen.
                      Achten Sie unbedingt auf Groß-/Kleinschreibung
                    </p>
                    <p className="text-xs text-amber-700 mt-2 font-medium">
                      {fahrzeugTyp === 'motorrad' || fahrzeugTyp === 'leichtkraftrad' || fahrzeugTyp === 'anhaenger'
                        ? 'Ihr Fahrzeugtyp hat in der Regel nur ein Kennzeichen: Geben Sie den Code bitte doppelt ein'
                        : 'Fahrzeuge mit nur einem Kennzeichen (z.\u00a0B. Motorrad, Anhänger): Geben Sie den Code bitte doppelt ein'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FieldGroup
                      label="Code vom vorderen Kennzeichen"
                      required
                      error={errors.codeVorne?.message}
                    >
                      <input
  {...register('codeVorne')}
  placeholder="z. B. jA4"
  maxLength={3}
  autoCapitalize="none"
  autoCorrect="off"
  spellCheck={false}
  className={`${INPUT_CLASS} font-mono`}
/>
                    </FieldGroup>

                    <FieldGroup
                      label="Code vom hinteren Kennzeichen"
                      required
                      error={errors.codeHinten?.message}
                    >
                      <input
  {...register('codeHinten')}
  placeholder="z. B. a1B"
  maxLength={3}
  autoCapitalize="none"
  autoCorrect="off"
  spellCheck={false}
  className={`${INPUT_CLASS} font-mono`}
/>
                    </FieldGroup>
                  </div>

                  {/* Video – Plakette entfernen */}
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <div className="px-4 py-3 bg-primary/5 border-b border-gray-200">
                      <p className="text-sm font-semibold text-primary">
                        Anleitung zum Entfernen der Plakette auf den Kennzeichen
                      </p>
                    </div>
                    <div className="p-4 space-y-4">
                      <a
                        href={VIDEO_PLAKETTE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-primary hover:text-primary-600 font-bold transition-colors group"
                      >
                        <span className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
                          <Play className="w-5 h-5 text-primary" />
                        </span>
                        <span className="text-sm md:text-base">
                          Hier klicken: Video-Anleitung zum Freilegen des Codes
                        </span>
                      </a>
                      <Image
                        src={CODE_HINT_IMAGE}
                        alt="Anleitung Plakette vom Kennzeichen entfernen"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========== STEP 4: Reservierung ========== */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Kennzeichen reservieren */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                      Kennzeichen reservieren?{' '}
                      <abbr className="text-amber-400" title="Pflichtfeld">*</abbr>
                    </label>
                    <div className="space-y-3">
                      <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          reservierung === 'keine'
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          {...register('reservierung')}
                          type="radio"
                          value="keine"
                          className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="font-medium text-gray-800">Keine Reservierung</span>
                      </label>

                      <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          reservierung === 'einJahr'
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          {...register('reservierung')}
                          type="radio"
                          value="einJahr"
                          className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                        />
                        <div>
                          <span className="font-medium text-gray-800">
                            1 Jahr reservieren - für dieses Fahrzeug.{' '}
                          </span>
                          <span className="text-accent font-bold">(+{reservierungUnitPrice.toFixed(2).replace('.', ',')}&nbsp;€)</span>
                        </div>
                      </label>
                    </div>
                    {errors.reservierung && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.reservierung.message}
                      </p>
                    )}
                  </div>

                  {/* Price totals */}
                  <div className="bg-gradient-to-br from-gray-50 to-primary/5 rounded-xl border border-gray-200 p-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Dienstleistungskosten</span>
                      <span className="font-semibold text-gray-800">
                        {basePrice.toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                    {reservierungPrice > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Zusatzoptionen</span>
                        <span className="font-semibold text-gray-800">
                          {reservierungPrice.toFixed(2).replace('.', ',')} €
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-lg">Endbetrag</span>
                      <span className="text-3xl font-extrabold text-primary">
                        {totalPrice.toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                  </div>

                  {/* Help section */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <p className="font-bold text-primary mb-3 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      Fragen? Sofort-Hilfe:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={contactPhoneLink}
                        className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors font-medium text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        {contactPhone}
                      </a>
                      <a
                        href={`${contactWhatsapp}${contactWhatsapp.includes('?') ? '&' : '?'}text=Hallo,+ich+brauche+Hilfe+bei+der+KFZ-Abmeldung`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-lg hover:bg-[#20BD5A] transition-colors font-medium text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Live-Chat über WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* ============ NAVIGATION BUTTONS ============ */}
        <div className="px-6 md:px-10 pb-8">
          {formError && (
            <div className="mb-4">
              <FormErrorBanner message={formError} onDismiss={() => setFormError(null)} />
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={prevStep}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </button>

            {currentStep < FORM_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                Weiter
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !step4Visited}
                className="flex items-center gap-2 bg-accent hover:bg-accent-600 text-white px-8 py-3.5 rounded-xl font-extrabold text-lg transition-all hover:shadow-lg hover:shadow-accent/30 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Wird bearbeitet…
                  </span>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Zur Kasse
                  </>
                )}
              </button>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-xs text-gray-400 mt-6 pt-6 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" /> SSL verschlüsselt
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4" /> Sichere Zahlung
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Sichere Abwicklung
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable Field Group                                              */
/* ------------------------------------------------------------------ */
function FieldGroup({
  label,
  required,
  description,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-2">
        {label}{' '}
        {required && (
          <abbr className="text-amber-400" title="Pflichtfeld">
            *
          </abbr>
        )}
      </label>
      {children}
      {description && <p className="mt-1.5 text-xs text-gray-500">{description}</p>}
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
