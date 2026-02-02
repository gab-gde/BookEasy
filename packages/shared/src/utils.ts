// ==========================================
// BookEasy Shared Utilities
// ==========================================

import { DAYS_OF_WEEK, BookingStatus, BOOKING_STATUS } from './types';

/**
 * Format price from cents to readable string
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
}

/**
 * Format date to French locale
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format date to short format
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Format time from Date
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Format datetime
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDateShort(d)} à ${formatTime(d)}`;
}

/**
 * Get day name from day index
 */
export function getDayName(dayIndex: number): string {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  return days[dayIndex] || '';
}

/**
 * Get day index from Date (Monday = 0, Sunday = 6)
 */
export function getDayOfWeek(date: Date): number {
  const jsDay = date.getDay(); // 0 = Sunday
  return jsDay === 0 ? 6 : jsDay - 1;
}

/**
 * Get status label in French
 */
export function getStatusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    [BOOKING_STATUS.PENDING]: 'En attente',
    [BOOKING_STATUS.CONFIRMED]: 'Confirmée',
    [BOOKING_STATUS.CANCELLED]: 'Annulée',
    [BOOKING_STATUS.COMPLETED]: 'Terminée',
  };
  return labels[status];
}

/**
 * Get status color class for Tailwind
 */
export function getStatusColor(status: BookingStatus): string {
  const colors: Record<BookingStatus, string> = {
    [BOOKING_STATUS.PENDING]: 'bg-amber-100 text-amber-800',
    [BOOKING_STATUS.CONFIRMED]: 'bg-emerald-100 text-emerald-800',
    [BOOKING_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
    [BOOKING_STATUS.COMPLETED]: 'bg-blue-100 text-blue-800',
  };
  return colors[status];
}

/**
 * Generate a short booking reference
 */
export function generateBookingRef(id: string): string {
  return `BK-${id.substring(0, 8).toUpperCase()}`;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get start of week (Monday)
 */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of week (Sunday)
 */
export function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Get start of month
 */
export function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Parse time string to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
