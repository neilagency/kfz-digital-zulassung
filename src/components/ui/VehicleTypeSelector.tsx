'use client';

import { type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Vehicle type definitions – add new types here to extend            */
/* ------------------------------------------------------------------ */
export type VehicleType =
  | 'auto'
  | 'motorrad'
  | 'anhaenger'
  | 'leichtkraftrad'
  | 'lkw'
  | 'andere';

interface VehicleTypeConfig {
  id: VehicleType;
  label: string;
  icon: ReactNode;
}

/* Simple SVG icons matching lucide style (24×24, 2px stroke) */
const IconAuto = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M5 17h14M5 17a2 2 0 01-2-2v-3a1 1 0 011-1l2.3-4.6A2 2 0 018.1 5h7.8a2 2 0 011.8 1.1L20 10.6a1 1 0 011 1V15a2 2 0 01-2 2M5 17a2 2 0 002 2h1a2 2 0 002-2M14 17a2 2 0 002 2h1a2 2 0 002-2" />
    <circle cx="7.5" cy="17" r="1.5" fill="currentColor" opacity="0.3" />
    <circle cx="16.5" cy="17" r="1.5" fill="currentColor" opacity="0.3" />
  </svg>
);

const IconMotorrad = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <circle cx="5.5" cy="17" r="3" />
    <circle cx="18.5" cy="17" r="3" />
    <path d="M15 6h2l3 5.5M5.5 14l3.5-8h3l2 4" />
    <path d="M8.5 6L12 14h6.5" />
    <path d="M14 10l-1.5 4" />
  </svg>
);

const IconAnhaenger = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <rect x="3" y="6" width="15" height="11" rx="1.5" />
    <path d="M18 14h3" />
    <circle cx="8" cy="19" r="2" />
    <circle cx="14" cy="19" r="2" />
    <path d="M8 17v-2M14 17v-2" />
  </svg>
);

const IconLeichtkraftrad = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <circle cx="6" cy="17.5" r="2.5" />
    <circle cx="18" cy="17.5" r="2.5" />
    <path d="M8 15l4-9h2l1 4" />
    <path d="M15 10l3 5" />
    <path d="M6 15l6 0h3" />
    <rect x="10" y="4.5" width="5" height="2.5" rx="1" />
  </svg>
);

const IconLkw = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <rect x="1" y="5" width="14" height="10" rx="1.5" />
    <path d="M15 9h4l3 4v2a1.5 1.5 0 01-1.5 1.5H15V9z" />
    <circle cx="6" cy="17.5" r="2" />
    <circle cx="18.5" cy="17.5" r="2" />
  </svg>
);

const IconAndere = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 014.8 1c0 1.5-2.3 2-2.3 3.5" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
  </svg>
);

export const VEHICLE_TYPES: VehicleTypeConfig[] = [
  { id: 'auto', label: 'Auto', icon: <IconAuto /> },
  { id: 'motorrad', label: 'Motorrad', icon: <IconMotorrad /> },
  { id: 'anhaenger', label: 'Anhänger', icon: <IconAnhaenger /> },
  { id: 'leichtkraftrad', label: 'Leichtkraftrad', icon: <IconLeichtkraftrad /> },
  { id: 'lkw', label: 'LKW', icon: <IconLkw /> },
  { id: 'andere', label: 'Andere', icon: <IconAndere /> },
];

/* Plate placeholder text per vehicle type */
export const PLATE_PLACEHOLDERS: Record<VehicleType, { city: string; letters: string; numbers: string }> = {
  auto: { city: 'BIE', letters: 'NE', numbers: '74' },
  motorrad: { city: 'B', letters: 'MR', numbers: '12' },
  anhaenger: { city: 'M', letters: 'AH', numbers: '99' },
  leichtkraftrad: { city: 'K', letters: 'LK', numbers: '5' },
  lkw: { city: 'HH', letters: 'LW', numbers: '500' },
  andere: { city: 'BIE', letters: 'NE', numbers: '74' },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
interface VehicleTypeSelectorProps {
  value: VehicleType;
  onChange: (type: VehicleType) => void;
}

export function VehicleTypeSelector({ value, onChange }: VehicleTypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
      {VEHICLE_TYPES.map((vt) => {
        const isSelected = value === vt.id;
        return (
          <button
            key={vt.id}
            type="button"
            onClick={() => onChange(vt.id)}
            className={`
              group relative flex flex-col items-center gap-1.5 sm:gap-2 
              px-2 py-3 sm:py-4 rounded-xl border-2 
              transition-all duration-200 cursor-pointer
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
              ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 text-primary'
                  : 'border-gray-200 bg-white hover:border-primary/30 hover:bg-primary/[0.02] text-gray-500 hover:text-gray-700'
              }
            `}
            aria-pressed={isSelected}
            aria-label={`Fahrzeugtyp: ${vt.label}`}
          >
            {/* Selection indicator */}
            {isSelected && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6l3 3 5-5" />
                </svg>
              </span>
            )}

            <span className={`transition-transform duration-200 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
              {vt.icon}
            </span>
            <span className={`text-xs sm:text-sm font-semibold leading-tight text-center ${isSelected ? 'text-primary' : ''}`}>
              {vt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
