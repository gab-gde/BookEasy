'use client';

import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useBookingStore } from '@/lib/booking-store';
import {
  BookingStepper,
  ServiceSelection,
  DateTimeSelection,
  CustomerForm,
  Confirmation,
} from '@/components/booking';
import { Button } from '@/components/ui';

export default function BookingPage() {
  const { currentStep } = useBookingStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="container-custom h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Book<span className="gradient-text">Easy</span>
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Retour au site
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="container-custom py-12">
        <BookingStepper />

        <div className="max-w-5xl mx-auto">
          {currentStep === 1 && <ServiceSelection />}
          {currentStep === 2 && <DateTimeSelection />}
          {currentStep === 3 && <CustomerForm />}
          {currentStep === 4 && <Confirmation />}
        </div>
      </main>
    </div>
  );
}
