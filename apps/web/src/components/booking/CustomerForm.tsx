'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, User } from 'lucide-react';
import { Booking, bookingCreateSchema } from '@bookeasy/shared';
import { api } from '@/lib/api';
import { useBookingStore } from '@/lib/booking-store';
import { formatCurrency, formatDuration, formatTime, cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';

export function CustomerForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    selectedService,
    selectedDate,
    selectedSlot,
    formData,
    setFormData,
    setConfirmedBooking,
    setCurrentStep,
  } = useBookingStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!selectedService || !selectedSlot) return;

    // Validate
    const result = bookingCreateSchema.safeParse({
      serviceId: selectedService.id,
      startAt: selectedSlot.startTime,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone || undefined,
      customerNote: formData.customerNote || undefined,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const booking = await api.post<Booking>('/bookings', result.data);
      setConfirmedBooking(booking);
      setCurrentStep(4);
      toast.success('Réservation confirmée !');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la réservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedService || !selectedDate || !selectedSlot) {
    return null;
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Vos informations
        </h2>
        <p className="text-slate-600">
          Renseignez vos coordonnées pour finaliser la réservation
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Summary card */}
        <div className="lg:col-span-1">
          <div className="card p-6 bg-slate-50 sticky top-24">
            <h3 className="font-semibold text-slate-900 mb-4">Récapitulatif</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">{selectedService.name}</p>
                  <p className="text-sm text-slate-500">
                    {selectedService.priceCents === 0
                      ? 'Gratuit'
                      : formatCurrency(selectedService.priceCents)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">
                    {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">
                    {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatDuration(selectedService.durationMin)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card p-6">
            <div className="space-y-5">
              <Input
                label="Nom complet *"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Jean Dupont"
                error={errors.customerName}
              />

              <Input
                label="Email *"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="jean@example.com"
                error={errors.customerEmail}
              />

              <Input
                label="Téléphone (optionnel)"
                name="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="06 12 34 56 78"
                error={errors.customerPhone}
                helperText="Format: 06 12 34 56 78 ou +33 6 12 34 56 78"
              />

              <div>
                <label className="label">Note (optionnel)</label>
                <textarea
                  name="customerNote"
                  value={formData.customerNote}
                  onChange={handleChange}
                  placeholder="Information complémentaire pour votre rendez-vous..."
                  className={cn('input min-h-[100px] resize-none', errors.customerNote && 'input-error')}
                />
                {errors.customerNote && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.customerNote}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCurrentStep(2)}
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Confirmer la réservation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
