import prisma from '../prisma';
import { AppError } from '../middleware/error';
import { getDayOfWeek, timeToMinutes } from '@bookeasy/shared';

export const availabilityService = {
  async getAllRules() { return prisma.availabilityRule.findMany({ orderBy: { dayOfWeek: 'asc' } }); },
  async createRule(data: any) {
    const existing = await prisma.availabilityRule.findUnique({ where: { dayOfWeek: data.dayOfWeek } });
    if (existing) throw new AppError('Règle existante pour ce jour', 400);
    return prisma.availabilityRule.create({ data });
  },
  async updateRule(id: string, data: any) {
    const existing = await prisma.availabilityRule.findUnique({ where: { id } });
    if (!existing) throw new AppError('Règle non trouvée', 404);
    return prisma.availabilityRule.update({ where: { id }, data });
  },
  async deleteRule(id: string) {
    const existing = await prisma.availabilityRule.findUnique({ where: { id } });
    if (!existing) throw new AppError('Règle non trouvée', 404);
    return prisma.availabilityRule.delete({ where: { id } });
  },
  async getAllExceptions() { return prisma.availabilityException.findMany({ orderBy: { date: 'asc' } }); },
  async createException(data: any) {
    const date = new Date(data.date); date.setHours(0, 0, 0, 0);
    return prisma.availabilityException.create({ data: { ...data, date } });
  },
  async deleteException(id: string) {
    const existing = await prisma.availabilityException.findUnique({ where: { id } });
    if (!existing) throw new AppError('Exception non trouvée', 404);
    return prisma.availabilityException.delete({ where: { id } });
  },
  async getAvailableSlots(serviceId: string, dateStr: string) {
    const date = new Date(dateStr); date.setHours(0, 0, 0, 0);
    const dayOfWeek = getDayOfWeek(date);
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new AppError('Service non trouvé', 404);
    const rule = await prisma.availabilityRule.findUnique({ where: { dayOfWeek } });
    if (!rule) return [];
    const exception = await prisma.availabilityException.findUnique({ where: { date } });
    if (exception?.isClosed) return [];
    const startTime = exception?.customStartTime || rule.startTime;
    const endTime = exception?.customEndTime || rule.endTime;
    const dayStart = new Date(date); const dayEnd = new Date(date); dayEnd.setHours(23, 59, 59, 999);
    const existingBookings = await prisma.booking.findMany({ where: { startAt: { gte: dayStart, lte: dayEnd }, status: { not: 'CANCELLED' } } });
    const slots = [];
    const startMin = timeToMinutes(startTime); const endMin = timeToMinutes(endTime);
    for (let slotStart = startMin; slotStart + service.durationMin <= endMin; slotStart += rule.slotStepMin) {
      const slotStartDate = new Date(date); slotStartDate.setHours(Math.floor(slotStart / 60), slotStart % 60, 0, 0);
      const slotEndDate = new Date(date); slotEndDate.setHours(Math.floor((slotStart + service.durationMin) / 60), (slotStart + service.durationMin) % 60, 0, 0);
      const overlapping = existingBookings.filter(b => new Date(b.startAt) < slotEndDate && new Date(b.endAt) > slotStartDate);
      const remaining = rule.capacity - overlapping.length;
      slots.push({ startTime: slotStartDate.toISOString(), endTime: slotEndDate.toISOString(), available: remaining > 0 && slotStartDate > new Date(), remainingCapacity: Math.max(0, remaining) });
    }
    return slots;
  },
};
