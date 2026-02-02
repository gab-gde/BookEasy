'use client';
import { create } from 'zustand';
import { Service, TimeSlot, Booking } from '@bookeasy/shared';

interface BookingState {
  currentStep: number;
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedSlot: TimeSlot | null;
  formData: { customerName: string; customerEmail: string; customerPhone: string; customerNote: string };
  confirmedBooking: Booking | null;
  setCurrentStep: (step: number) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  setFormData: (data: Partial<BookingState['formData']>) => void;
  setConfirmedBooking: (booking: Booking | null) => void;
  reset: () => void;
}

const initialState = { currentStep: 1, selectedService: null, selectedDate: null, selectedSlot: null, formData: { customerName: '', customerEmail: '', customerPhone: '', customerNote: '' }, confirmedBooking: null };

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,
  setCurrentStep: (step) => set({ currentStep: step }),
  setSelectedService: (service) => set({ selectedService: service }),
  setSelectedDate: (date) => set({ selectedDate: date, selectedSlot: null }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setConfirmedBooking: (booking) => set({ confirmedBooking: booking }),
  reset: () => set(initialState),
}));
