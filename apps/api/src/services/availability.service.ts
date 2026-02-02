import prisma from '../prisma';
import { AppError } from '../middleware/error';
import {
  AvailabilityRule,
  AvailabilityRuleCreateInput,
  AvailabilityRuleUpdateInput,
  AvailabilityException,
  AvailabilityExceptionCreateInput,
  AvailabilityExceptionUpdateInput,
  TimeSlot,
  getDayOfWeek,
  timeToMinutes,
  minutesToTime,
} from '@bookeasy/shared';

export class AvailabilityService {
  // ==========================================
  // Rules CRUD
  // ==========================================
  
  async getAllRules(): Promise<AvailabilityRule[]> {
    const rules = await prisma.availabilityRule.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });
    return rules as AvailabilityRule[];
  }

  async getRuleById(id: string): Promise<AvailabilityRule | null> {
    const rule = await prisma.availabilityRule.findUnique({
      where: { id },
    });
    return rule as AvailabilityRule | null;
  }

  async createRule(data: AvailabilityRuleCreateInput): Promise<AvailabilityRule> {
    // Check if rule for this day already exists
    const existing = await prisma.availabilityRule.findUnique({
      where: { dayOfWeek: data.dayOfWeek },
    });
    
    if (existing) {
      throw new AppError('Une règle existe déjà pour ce jour', 400, 'RULE_EXISTS');
    }

    const rule = await prisma.availabilityRule.create({
      data: {
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        slotStepMin: data.slotStepMin ?? 30,
        capacity: data.capacity ?? 1,
      },
    });
    return rule as AvailabilityRule;
  }

  async updateRule(id: string, data: AvailabilityRuleUpdateInput): Promise<AvailabilityRule> {
    const existing = await prisma.availabilityRule.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Règle non trouvée', 404, 'NOT_FOUND');
    }

    // If changing day, check for conflicts
    if (data.dayOfWeek !== undefined && data.dayOfWeek !== existing.dayOfWeek) {
      const conflict = await prisma.availabilityRule.findUnique({
        where: { dayOfWeek: data.dayOfWeek },
      });
      if (conflict) {
        throw new AppError('Une règle existe déjà pour ce jour', 400, 'RULE_EXISTS');
      }
    }

    const rule = await prisma.availabilityRule.update({
      where: { id },
      data: {
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        slotStepMin: data.slotStepMin,
        capacity: data.capacity,
      },
    });
    return rule as AvailabilityRule;
  }

  async deleteRule(id: string): Promise<void> {
    const existing = await prisma.availabilityRule.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Règle non trouvée', 404, 'NOT_FOUND');
    }
    await prisma.availabilityRule.delete({ where: { id } });
  }

  // ==========================================
  // Exceptions CRUD
  // ==========================================

  async getAllExceptions(): Promise<AvailabilityException[]> {
    const exceptions = await prisma.availabilityException.findMany({
      orderBy: { date: 'asc' },
    });
    return exceptions as AvailabilityException[];
  }

  async getExceptionById(id: string): Promise<AvailabilityException | null> {
    const exception = await prisma.availabilityException.findUnique({
      where: { id },
    });
    return exception as AvailabilityException | null;
  }

  async createException(data: AvailabilityExceptionCreateInput): Promise<AvailabilityException> {
    const date = new Date(data.date);
    date.setHours(0, 0, 0, 0);

    // Check if exception for this date already exists
    const existing = await prisma.availabilityException.findUnique({
      where: { date },
    });
    
    if (existing) {
      throw new AppError('Une exception existe déjà pour cette date', 400, 'EXCEPTION_EXISTS');
    }

    const exception = await prisma.availabilityException.create({
      data: {
        date,
        isClosed: data.isClosed ?? false,
        customStartTime: data.customStartTime,
        customEndTime: data.customEndTime,
      },
    });
    return exception as AvailabilityException;
  }

  async updateException(id: string, data: AvailabilityExceptionUpdateInput): Promise<AvailabilityException> {
    const existing = await prisma.availabilityException.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Exception non trouvée', 404, 'NOT_FOUND');
    }

    let date = existing.date;
    if (data.date) {
      date = new Date(data.date);
      date.setHours(0, 0, 0, 0);
      
      // Check for conflicts
      const conflict = await prisma.availabilityException.findFirst({
        where: { date, id: { not: id } },
      });
      if (conflict) {
        throw new AppError('Une exception existe déjà pour cette date', 400, 'EXCEPTION_EXISTS');
      }
    }

    const exception = await prisma.availabilityException.update({
      where: { id },
      data: {
        date,
        isClosed: data.isClosed,
        customStartTime: data.customStartTime,
        customEndTime: data.customEndTime,
      },
    });
    return exception as AvailabilityException;
  }

  async deleteException(id: string): Promise<void> {
    const existing = await prisma.availabilityException.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Exception non trouvée', 404, 'NOT_FOUND');
    }
    await prisma.availabilityException.delete({ where: { id } });
  }

  // ==========================================
  // Slot Generation
  // ==========================================

  async getAvailableSlots(serviceId: string, dateStr: string): Promise<TimeSlot[]> {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
    const dayOfWeek = getDayOfWeek(date);

    // Get the service to know duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new AppError('Service non trouvé', 404, 'NOT_FOUND');
    }

    // Get rule for this day
    const rule = await prisma.availabilityRule.findUnique({
      where: { dayOfWeek },
    });

    if (!rule) {
      return []; // No availability this day
    }

    // Check for exception
    const exception = await prisma.availabilityException.findUnique({
      where: { date },
    });

    if (exception?.isClosed) {
      return []; // Closed this day
    }

    // Determine working hours
    const startTime = exception?.customStartTime || rule.startTime;
    const endTime = exception?.customEndTime || rule.endTime;
    const capacity = rule.capacity;
    const slotStep = rule.slotStepMin;

    // Get existing bookings for this day
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const existingBookings = await prisma.booking.findMany({
      where: {
        startAt: { gte: dayStart, lte: dayEnd },
        status: { not: 'CANCELLED' },
      },
    });

    // Generate slots
    const slots: TimeSlot[] = [];
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const serviceDuration = service.durationMin;

    for (let slotStart = startMinutes; slotStart + serviceDuration <= endMinutes; slotStart += slotStep) {
      const slotEnd = slotStart + serviceDuration;
      
      const slotStartDate = new Date(date);
      slotStartDate.setHours(Math.floor(slotStart / 60), slotStart % 60, 0, 0);
      
      const slotEndDate = new Date(date);
      slotEndDate.setHours(Math.floor(slotEnd / 60), slotEnd % 60, 0, 0);

      // Count overlapping bookings
      const overlappingBookings = existingBookings.filter((booking) => {
        const bookingStart = new Date(booking.startAt);
        const bookingEnd = new Date(booking.endAt);
        return bookingStart < slotEndDate && bookingEnd > slotStartDate;
      });

      const remainingCapacity = capacity - overlappingBookings.length;
      const available = remainingCapacity > 0 && slotStartDate > new Date();

      slots.push({
        startTime: slotStartDate.toISOString(),
        endTime: slotEndDate.toISOString(),
        available,
        remainingCapacity: Math.max(0, remainingCapacity),
      });
    }

    return slots;
  }
}

export const availabilityService = new AvailabilityService();
