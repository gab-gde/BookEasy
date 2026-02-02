'use client';

import { useState, useEffect } from 'react';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { TimeSlot } from '@bookeasy/shared';
import { api } from '@/lib/api';
import { useBookingStore } from '@/lib/booking-store';
import { formatTime, cn } from '@/lib/utils';
import { Button, Skeleton } from '@/components/ui';

export function DateTimeSelection() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfDay(new Date()));
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    selectedService,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    setCurrentStep,
  } = useBookingStore();

  // Generate 7 days starting from currentWeekStart
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedService || !selectedDate) return;

    const fetchSlots = async () => {
      setIsLoading(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const data = await api.get<TimeSlot[]>(
          `/availability?serviceId=${selectedService.id}&date=${dateStr}`
        );
        setSlots(data);
      } catch (err) {
        setSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedService, selectedDate]);

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };

  const isPastDate = (date: Date) => {
    return startOfDay(date) < startOfDay(new Date());
  };

  const availableSlots = slots.filter((s) => s.available);
  const unavailableSlots = slots.filter((s) => !s.available);

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Choisissez votre créneau
        </h2>
        <p className="text-slate-600">
          Sélectionnez une date et une heure disponible
        </p>
      </div>

      {/* Date selector */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousWeek}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            disabled={isPastDate(currentWeekStart)}
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="text-lg font-semibold text-slate-900">
            {format(currentWeekStart, 'MMMM yyyy', { locale: fr })}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPast = isPastDate(day);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isPast && handleDateSelect(day)}
                disabled={isPast}
                className={cn(
                  'flex flex-col items-center py-3 px-2 rounded-xl transition-all',
                  isPast && 'opacity-40 cursor-not-allowed',
                  isSelected && 'bg-primary-600 text-white',
                  !isSelected && !isPast && 'hover:bg-slate-100',
                  isToday && !isSelected && 'ring-2 ring-primary-300'
                )}
              >
                <span className="text-xs font-medium uppercase">
                  {format(day, 'EEE', { locale: fr })}
                </span>
                <span className="text-lg font-bold mt-1">
                  {format(day, 'd')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="card p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            Créneaux disponibles le {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
          </h3>

          {isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot?.startTime === slot.startTime;
                return (
                  <button
                    key={slot.startTime}
                    onClick={() => handleSlotSelect(slot)}
                    className={cn(
                      'py-3 px-4 rounded-lg font-medium text-sm transition-all',
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-primary-100 hover:text-primary-700'
                    )}
                  >
                    {formatTime(slot.startTime)}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">
              Aucun créneau disponible pour cette date.
              <br />
              <span className="text-sm">Essayez une autre date.</span>
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setCurrentStep(1)}>
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <Button
          onClick={() => setCurrentStep(3)}
          disabled={!selectedSlot}
          className="group"
        >
          Continuer
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
