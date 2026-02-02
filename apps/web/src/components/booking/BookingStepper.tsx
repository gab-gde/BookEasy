'use client';

import { Check } from 'lucide-react';
import { useBookingStore } from '@/lib/booking-store';
import { cn } from '@/lib/utils';

const steps = [
  { number: 1, label: 'Service' },
  { number: 2, label: 'Date & heure' },
  { number: 3, label: 'Vos infos' },
  { number: 4, label: 'Confirmation' },
];

export function BookingStepper() {
  const { currentStep } = useBookingStore();

  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all',
                  isCompleted && 'bg-primary-600 text-white',
                  isCurrent && 'bg-primary-600 text-white ring-4 ring-primary-100',
                  !isCompleted && !isCurrent && 'bg-slate-200 text-slate-500'
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <span
                className={cn(
                  'text-xs font-medium mt-2 hidden sm:block',
                  (isCompleted || isCurrent) && 'text-primary-600',
                  !isCompleted && !isCurrent && 'text-slate-400'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  'w-12 sm:w-20 h-1 mx-2 rounded transition-all',
                  isCompleted ? 'bg-primary-600' : 'bg-slate-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
