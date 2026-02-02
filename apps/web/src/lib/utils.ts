import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatCurrency(cents: number) { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100); }
export function formatDuration(min: number) { return min < 60 ? `${min} min` : min % 60 === 0 ? `${min / 60}h` : `${Math.floor(min / 60)}h${(min % 60).toString().padStart(2, '0')}`; }
export function formatTime(dateStr: string | Date) { return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
export function getStatusLabel(s: string) { return { PENDING: 'En attente', CONFIRMED: 'Confirmée', CANCELLED: 'Annulée', COMPLETED: 'Terminée' }[s] || s; }
export function getStatusColor(s: string) { return { PENDING: 'bg-amber-100 text-amber-800', CONFIRMED: 'bg-emerald-100 text-emerald-800', CANCELLED: 'bg-red-100 text-red-800', COMPLETED: 'bg-blue-100 text-blue-800' }[s] || 'bg-slate-100 text-slate-800'; }
export function generateBookingRef(id: string) { return `BK-${id.slice(0, 8).toUpperCase()}`; }
export function getDayName(i: number) { return ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][i] || ''; }
