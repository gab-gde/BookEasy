import { z } from 'zod';
import { BOOKING_STATUS } from './types';

// ==========================================
// Common Validators
// ==========================================

export const emailSchema = z.string().email('Email invalide');

export const phoneSchema = z
  .string()
  .regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide')
  .optional()
  .or(z.literal(''));

export const timeSchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format horaire invalide (HH:mm)');

export const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: 'Date invalide',
});

// ==========================================
// Auth Validators
// ==========================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// ==========================================
// Service Validators
// ==========================================

export const serviceCreateSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  durationMin: z.number().int().min(5, 'Durée minimum 5 minutes').max(480, 'Durée maximum 8 heures'),
  priceCents: z.number().int().min(0, 'Le prix ne peut pas être négatif'),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional().default(true),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

// ==========================================
// Availability Rule Validators
// ==========================================

export const availabilityRuleCreateSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: timeSchema,
    endTime: timeSchema,
    slotStepMin: z.number().int().min(5).max(120).optional().default(30),
    capacity: z.number().int().min(1).max(100).optional().default(1),
  })
  .refine(
    (data) => {
      const start = data.startTime.split(':').map(Number);
      const end = data.endTime.split(':').map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      return endMinutes > startMinutes;
    },
    {
      message: "L'heure de fin doit être après l'heure de début",
    }
  );

export const availabilityRuleUpdateSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6).optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    slotStepMin: z.number().int().min(5).max(120).optional(),
    capacity: z.number().int().min(1).max(100).optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const start = data.startTime.split(':').map(Number);
        const end = data.endTime.split(':').map(Number);
        const startMinutes = start[0] * 60 + start[1];
        const endMinutes = end[0] * 60 + end[1];
        return endMinutes > startMinutes;
      }
      return true;
    },
    {
      message: "L'heure de fin doit être après l'heure de début",
    }
  );

// ==========================================
// Availability Exception Validators
// ==========================================

export const availabilityExceptionCreateSchema = z
  .object({
    date: dateSchema,
    isClosed: z.boolean().optional().default(false),
    customStartTime: timeSchema.optional(),
    customEndTime: timeSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.customStartTime && data.customEndTime) {
        const start = data.customStartTime.split(':').map(Number);
        const end = data.customEndTime.split(':').map(Number);
        const startMinutes = start[0] * 60 + start[1];
        const endMinutes = end[0] * 60 + end[1];
        return endMinutes > startMinutes;
      }
      return true;
    },
    {
      message: "L'heure de fin doit être après l'heure de début",
    }
  );

export const availabilityExceptionUpdateSchema = z
  .object({
    date: dateSchema.optional(),
    isClosed: z.boolean().optional(),
    customStartTime: timeSchema.optional().or(z.literal('')),
    customEndTime: timeSchema.optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.customStartTime && data.customEndTime) {
        const start = data.customStartTime.split(':').map(Number);
        const end = data.customEndTime.split(':').map(Number);
        const startMinutes = start[0] * 60 + start[1];
        const endMinutes = end[0] * 60 + end[1];
        return endMinutes > startMinutes;
      }
      return true;
    },
    {
      message: "L'heure de fin doit être après l'heure de début",
    }
  );

// ==========================================
// Booking Validators
// ==========================================

export const bookingCreateSchema = z.object({
  serviceId: z.string().uuid('ID de service invalide'),
  startAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Date de début invalide',
  }),
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  customerEmail: emailSchema,
  customerPhone: phoneSchema,
  customerNote: z.string().max(500).optional(),
});

export const bookingUpdateSchema = z.object({
  status: z
    .enum([
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.CANCELLED,
      BOOKING_STATUS.COMPLETED,
    ])
    .optional(),
  customerName: z.string().min(2).max(100).optional(),
  customerEmail: emailSchema.optional(),
  customerPhone: phoneSchema,
  customerNote: z.string().max(500).optional(),
});

export const bookingNoteCreateSchema = z.object({
  content: z.string().min(1, 'La note ne peut pas être vide').max(1000),
});

// ==========================================
// Query Validators
// ==========================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const bookingFiltersSchema = z.object({
  status: z
    .enum([
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.CANCELLED,
      BOOKING_STATUS.COMPLETED,
    ])
    .optional(),
  serviceId: z.string().uuid().optional(),
  dateFrom: dateSchema.optional(),
  dateTo: dateSchema.optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['createdAt', 'startAt', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const availabilityQuerySchema = z.object({
  serviceId: z.string().uuid('ID de service invalide'),
  date: dateSchema,
});

// ==========================================
// Type Exports from Schemas
// ==========================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
export type AvailabilityRuleCreateInput = z.infer<typeof availabilityRuleCreateSchema>;
export type AvailabilityRuleUpdateInput = z.infer<typeof availabilityRuleUpdateSchema>;
export type AvailabilityExceptionCreateInput = z.infer<typeof availabilityExceptionCreateSchema>;
export type AvailabilityExceptionUpdateInput = z.infer<typeof availabilityExceptionUpdateSchema>;
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type BookingUpdateInput = z.infer<typeof bookingUpdateSchema>;
export type BookingNoteCreateInput = z.infer<typeof bookingNoteCreateSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type BookingFiltersInput = z.infer<typeof bookingFiltersSchema>;
export type AvailabilityQueryInput = z.infer<typeof availabilityQuerySchema>;
