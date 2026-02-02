'use client';
import { useState, useEffect } from 'react';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, Tag, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Calendar, Copy, Home } from 'lucide-react';
import { Service, TimeSlot, Booking } from '@bookeasy/shared';
import { api } from '@/lib/api';
import { useBookingStore } from '@/lib/booking-store';
import { formatCurrency, formatDuration, formatTime, cn, generateBookingRef } from '@/lib/utils';
import { Button, Input, SkeletonCard } from '@/components/ui';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Stepper
export function BookingStepper() {
  const { currentStep } = useBookingStore();
  const steps = [{ n: 1, label: 'Service' }, { n: 2, label: 'Date' }, { n: 3, label: 'Infos' }, { n: 4, label: 'Confirmé' }];
  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm', currentStep > s.n ? 'bg-primary-600 text-white' : currentStep === s.n ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-slate-200 text-slate-500')}>{currentStep > s.n ? '✓' : s.n}</div>
            <span className={cn('text-xs mt-2 hidden sm:block', (currentStep >= s.n) ? 'text-primary-600' : 'text-slate-400')}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className={cn('w-12 sm:w-20 h-1 mx-2 rounded', currentStep > s.n ? 'bg-primary-600' : 'bg-slate-200')} />}
        </div>
      ))}
    </div>
  );
}

// Step 1: Service Selection
export function ServiceSelection() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedService, setSelectedService, setCurrentStep } = useBookingStore();
  useEffect(() => { api.get<Service[]>('/services').then(setServices).finally(() => setIsLoading(false)); }, []);
  if (isLoading) return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>;
  return (
    <div>
      <div className="text-center mb-8"><h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Choisissez votre prestation</h2></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {services.map(s => (
          <button key={s.id} onClick={() => setSelectedService(s)} className={cn('card-hover p-6 text-left', selectedService?.id === s.id && 'ring-2 ring-primary-500 bg-primary-50')}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{s.name}</h3>
            {s.description && <p className="text-slate-600 text-sm mb-4 line-clamp-2">{s.description}</p>}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-slate-500"><Clock className="w-4 h-4" />{formatDuration(s.durationMin)}</div>
              <div className="flex items-center gap-1.5 text-primary-600 font-medium"><Tag className="w-4 h-4" />{s.priceCents === 0 ? 'Gratuit' : formatCurrency(s.priceCents)}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex justify-end"><Button onClick={() => setCurrentStep(2)} disabled={!selectedService}>Continuer<ArrowRight className="w-4 h-4" /></Button></div>
    </div>
  );
}

// Step 2: Date & Time Selection
export function DateTimeSelection() {
  const [weekStart, setWeekStart] = useState(() => startOfDay(new Date()));
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedService, selectedDate, setSelectedDate, selectedSlot, setSelectedSlot, setCurrentStep } = useBookingStore();
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    if (!selectedService || !selectedDate) return;
    setIsLoading(true);
    api.get<TimeSlot[]>(`/availability?serviceId=${selectedService.id}&date=${format(selectedDate, 'yyyy-MM-dd')}`).then(setSlots).finally(() => setIsLoading(false));
  }, [selectedService, selectedDate]);

  const isPast = (d: Date) => startOfDay(d) < startOfDay(new Date());
  const availableSlots = slots.filter(s => s.available);

  return (
    <div>
      <div className="text-center mb-8"><h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Choisissez votre créneau</h2></div>
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="p-2 rounded-lg hover:bg-slate-100"><ChevronLeft className="w-5 h-5" /></button>
          <span className="text-lg font-semibold">{format(weekStart, 'MMMM yyyy', { locale: fr })}</span>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="p-2 rounded-lg hover:bg-slate-100"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map(d => (
            <button key={d.toISOString()} onClick={() => !isPast(d) && (setSelectedDate(d), setSelectedSlot(null))} disabled={isPast(d)} className={cn('flex flex-col items-center py-3 rounded-xl transition-all', isPast(d) && 'opacity-40', selectedDate && isSameDay(d, selectedDate) && 'bg-primary-600 text-white', !isPast(d) && !(selectedDate && isSameDay(d, selectedDate)) && 'hover:bg-slate-100')}>
              <span className="text-xs font-medium uppercase">{format(d, 'EEE', { locale: fr })}</span>
              <span className="text-lg font-bold mt-1">{format(d, 'd')}</span>
            </button>
          ))}
        </div>
      </div>
      {selectedDate && (
        <div className="card p-6 mb-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary-500" />Créneaux le {format(selectedDate, 'EEEE d MMMM', { locale: fr })}</h3>
          {isLoading ? <p>Chargement...</p> : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {availableSlots.map(slot => <button key={slot.startTime} onClick={() => setSelectedSlot(slot)} className={cn('py-3 px-4 rounded-lg font-medium text-sm', selectedSlot?.startTime === slot.startTime ? 'bg-primary-600 text-white' : 'bg-slate-100 hover:bg-primary-100')}>{formatTime(slot.startTime)}</button>)}
            </div>
          ) : <p className="text-slate-500 text-center py-8">Aucun créneau disponible.</p>}
        </div>
      )}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setCurrentStep(1)}><ArrowLeft className="w-4 h-4" />Retour</Button>
        <Button onClick={() => setCurrentStep(3)} disabled={!selectedSlot}>Continuer<ArrowRight className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

// Step 3: Customer Form
export function CustomerForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedService, selectedDate, selectedSlot, formData, setFormData, setConfirmedBooking, setCurrentStep } = useBookingStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedSlot) return;
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Nom requis';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email requis';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setIsSubmitting(true);
    try {
      const booking = await api.post<Booking>('/bookings', { serviceId: selectedService.id, startAt: selectedSlot.startTime, customerName: formData.customerName, customerEmail: formData.customerEmail, customerPhone: formData.customerPhone || undefined, customerNote: formData.customerNote || undefined });
      setConfirmedBooking(booking);
      setCurrentStep(4);
      toast.success('Réservation confirmée !');
    } catch (err: any) { toast.error(err.message || 'Erreur'); }
    finally { setIsSubmitting(false); }
  };

  if (!selectedService || !selectedDate || !selectedSlot) return null;
  return (
    <div>
      <div className="text-center mb-8"><h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Vos informations</h2></div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="card p-6 bg-slate-50 lg:col-span-1">
          <h3 className="font-semibold mb-4">Récapitulatif</h3>
          <p className="font-medium">{selectedService.name}</p>
          <p className="text-sm text-slate-500">{selectedService.priceCents === 0 ? 'Gratuit' : formatCurrency(selectedService.priceCents)}</p>
          <p className="mt-2">{format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</p>
          <p className="text-sm text-slate-500">{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 lg:col-span-2 space-y-5">
          <Input label="Nom complet *" value={formData.customerName} onChange={e => setFormData({ customerName: e.target.value })} error={errors.customerName} />
          <Input label="Email *" type="email" value={formData.customerEmail} onChange={e => setFormData({ customerEmail: e.target.value })} error={errors.customerEmail} />
          <Input label="Téléphone" type="tel" value={formData.customerPhone} onChange={e => setFormData({ customerPhone: e.target.value })} />
          <div><label className="label">Note</label><textarea className="input min-h-[80px]" value={formData.customerNote} onChange={e => setFormData({ customerNote: e.target.value })} /></div>
          <div className="flex justify-between pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setCurrentStep(2)}><ArrowLeft className="w-4 h-4" />Retour</Button>
            <Button type="submit" isLoading={isSubmitting}>Confirmer<ArrowRight className="w-4 h-4" /></Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Step 4: Confirmation
export function Confirmation() {
  const { confirmedBooking, selectedService, reset } = useBookingStore();
  if (!confirmedBooking || !selectedService) return null;
  const ref = generateBookingRef(confirmedBooking.id);
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6"><CheckCircle2 className="w-10 h-10 text-emerald-600" /></div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Réservation confirmée !</h2>
      <p className="text-slate-600 mb-8">Confirmation envoyée à {confirmedBooking.customerEmail}</p>
      <div className="card p-6 mb-6 bg-primary-50 border-primary-200">
        <p className="text-sm text-primary-600 font-medium mb-1">Référence</p>
        <p className="text-2xl font-bold text-primary-900">{ref}</p>
      </div>
      <div className="card p-6 mb-8 text-left">
        <p><strong>Service:</strong> {selectedService.name}</p>
        <p><strong>Date:</strong> {format(new Date(confirmedBooking.startAt), 'EEEE d MMMM yyyy', { locale: fr })}</p>
        <p><strong>Horaire:</strong> {formatTime(confirmedBooking.startAt)} - {formatTime(confirmedBooking.endAt)}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/"><Button variant="secondary" onClick={reset}><Home className="w-4 h-4" />Accueil</Button></Link>
        <Link href="/booking"><Button onClick={reset}><Calendar className="w-4 h-4" />Nouvelle réservation</Button></Link>
      </div>
    </div>
  );
}
