import { describe, it, expect } from 'vitest';
import {
  cn,
  formatCurrency,
  formatDuration,
  getStatusLabel,
  getStatusColor,
  generateBookingRef,
  getDayName,
} from '@/lib/utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'active', false && 'inactive')).toBe('base active');
    });

    it('should handle tailwind merge', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
    });
  });

  describe('formatCurrency', () => {
    it('should format cents to euros', () => {
      expect(formatCurrency(5000)).toContain('50');
      expect(formatCurrency(0)).toContain('0');
    });
  });

  describe('formatDuration', () => {
    it('should format minutes correctly', () => {
      expect(formatDuration(30)).toBe('30 min');
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(90)).toBe('1h30');
      expect(formatDuration(120)).toBe('2h');
    });
  });

  describe('getStatusLabel', () => {
    it('should return French labels', () => {
      expect(getStatusLabel('PENDING')).toBe('En attente');
      expect(getStatusLabel('CONFIRMED')).toBe('Confirmée');
      expect(getStatusLabel('CANCELLED')).toBe('Annulée');
      expect(getStatusLabel('COMPLETED')).toBe('Terminée');
    });
  });

  describe('getStatusColor', () => {
    it('should return appropriate color classes', () => {
      expect(getStatusColor('PENDING')).toContain('amber');
      expect(getStatusColor('CONFIRMED')).toContain('emerald');
      expect(getStatusColor('CANCELLED')).toContain('red');
      expect(getStatusColor('COMPLETED')).toContain('blue');
    });
  });

  describe('generateBookingRef', () => {
    it('should generate a formatted reference', () => {
      const ref = generateBookingRef('123e4567-e89b-12d3-a456-426614174000');
      expect(ref).toMatch(/^BK-[A-Z0-9]{8}$/);
    });
  });

  describe('getDayName', () => {
    it('should return French day names', () => {
      expect(getDayName(0)).toBe('Lundi');
      expect(getDayName(6)).toBe('Dimanche');
    });
  });
});
