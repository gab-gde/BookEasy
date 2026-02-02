'use client';

import { create } from 'zustand';
import { Service, TimeSlot, Booking } from '@bookeasy/shared';

interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNote: string;
}

interface BookingState {
  // Steps
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Service selection
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;

  // Date & slot selection
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedSlot: TimeSlot | null;
  setSelectedSlot: (slot: TimeSlot | null) => void;

  // Customer info
  formData: BookingFormData;
  setFormData: (data: Partial<BookingFormData>) => void;

  // Result
  confirmedBooking: Booking | null;
  setConfirmedBooking: (booking: Booking | null) => void;

  // Reset
  reset: () => void;
}

const initialFormData: BookingFormData = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerNote: '',
};

export const useBookingStore = create<BookingState>((set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),

  selectedService: null,
  setSelectedService: (service) => set({ selectedService: service }),

  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date, selectedSlot: null }),

  selectedSlot: null,
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),

  formData: initialFormData,
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  confirmedBooking: null,
  setConfirmedBooking: (booking) => set({ confirmedBooking: booking }),

  reset: () =>
    set({
      currentStep: 1,
      selectedService: null,
      selectedDate: null,
      selectedSlot: null,
      formData: initialFormData,
      confirmedBooking: null,
    }),
}));
