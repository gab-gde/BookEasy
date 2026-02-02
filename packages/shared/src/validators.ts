import { z } from 'zod';
import { BOOKING_STATUS } from './types';

export const emailSchema = z.string().email('Email invalide');
export const phoneSchema = z.string().optional().or(z.literal(''));
export const timeSchema = z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format HH:mm');
export const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Date invalide' });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Minimum 6 caractères'),
});

export const serviceCreateSchema = z.object({
  name: z.string().min(2).max(100),
  durationMin: z.number().int().min(5).max(480),
  priceCents: z.number().int().min(0),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional().default(true),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const bookingCreateSchema = z.object({
  serviceId: z.string().uuid(),
  startAt: z.string(),
  customerName: z.string().min(2).max(100),
  customerEmail: emailSchema,
  customerPhone: phoneSchema,
  customerNote: z.string().max(500).optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum([BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CANCELLED, BOOKING_STATUS.COMPLETED]).optional(),
  customerName: z.string().min(2).max(100).optional(),
  customerEmail: emailSchema.optional(),
  customerPhone: phoneSchema,
  customerNote: z.string().max(500).optional(),
});

export const bookingNoteCreateSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const availabilityRuleCreateSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: timeSchema,
  endTime: timeSchema,
  slotStepMin: z.number().int().min(5).max(120).optional().default(30),
  capacity: z.number().int().min(1).max(100).optional().default(1),
});

export const availabilityRuleUpdateSchema = availabilityRuleCreateSchema.partial();

export const availabilityExceptionCreateSchema = z.object({
  date: dateSchema,
  isClosed: z.boolean().optional().default(false),
  customStartTime: timeSchema.optional(),
  customEndTime: timeSchema.optional(),
});

export const availabilityQuerySchema = z.object({
  serviceId: z.string().uuid(),
  date: dateSchema,
});
