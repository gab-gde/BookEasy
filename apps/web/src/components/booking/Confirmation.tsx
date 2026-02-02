'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle2, Calendar, Clock, Tag, User, Mail, Phone, Copy, Home } from 'lucide-react';
import { useBookingStore } from '@/lib/booking-store';
import { formatCurrency, formatDuration, formatTime, generateBookingRef, cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

export function Confirmation() {
  const { confirmedBooking, selectedService, reset } = useBookingStore();

  if (!confirmedBooking || !selectedService) {
    return null;
  }

  const bookingRef = generateBookingRef(confirmedBooking.id);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(bookingRef);
    toast.success('Référence copiée !');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success message */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Réservation confirmée !
        </h2>
        <p className="text-slate-600">
          Vous recevrez un email de confirmation à{' '}
          <span className="font-medium text-slate-900">
            {confirmedBooking.customerEmail}
          </span>
        </p>
      </div>

      {/* Booking reference */}
      <div className="card p-6 mb-6 bg-primary-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-600 font-medium mb-1">
              Numéro de réservation
            </p>
            <p className="text-2xl font-bold text-primary-900">{bookingRef}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopyRef}>
            <Copy className="w-4 h-4" />
            Copier
          </Button>
        </div>
      </div>

      {/* Booking details */}
      <div className="card p-6 mb-8">
        <h3 className="font-semibold text-slate-900 mb-6">Détails de la réservation</h3>

        <div className="space-y-5">
          <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Tag className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Service</p>
              <p className="font-medium text-slate-900">{selectedService.name}</p>
              <p className="text-sm text-slate-600">
                {selectedService.priceCents === 0
                  ? 'Gratuit'
                  : formatCurrency(selectedService.priceCents)}{' '}
                • {formatDuration(selectedService.durationMin)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-medium text-slate-900">
                {format(new Date(confirmedBooking.startAt), 'EEEE d MMMM yyyy', {
                  locale: fr,
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Horaire</p>
              <p className="font-medium text-slate-900">
                {formatTime(confirmedBooking.startAt)} -{' '}
                {formatTime(confirmedBooking.endAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Nom</p>
              <p className="font-medium text-slate-900">
                {confirmedBooking.customerName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium text-slate-900">
                {confirmedBooking.customerEmail}
              </p>
            </div>
          </div>

          {confirmedBooking.customerPhone && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Téléphone</p>
                <p className="font-medium text-slate-900">
                  {confirmedBooking.customerPhone}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/">
          <Button variant="secondary" onClick={reset}>
            <Home className="w-4 h-4" />
            Retour à l&apos;accueil
          </Button>
        </Link>
        <Link href="/booking">
          <Button onClick={reset}>
            <Calendar className="w-4 h-4" />
            Nouvelle réservation
          </Button>
        </Link>
      </div>
    </div>
  );
}
