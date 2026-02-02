import prisma from '../prisma';
import { AppError } from '../middleware/error';
import { availabilityService } from './availability.service';
import { BOOKING_STATUS, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth } from '@bookeasy/shared';

export const bookingService = {
  async create(data: any) {
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service || !service.isActive) throw new AppError('Service non disponible', 400);
    const startAt = new Date(data.startAt);
    const endAt = new Date(startAt); endAt.setMinutes(endAt.getMinutes() + service.durationMin);
    const dateStr = startAt.toISOString().split('T')[0];
    const slots = await availabilityService.getAvailableSlots(data.serviceId, dateStr);
    const slot = slots.find(s => new Date(s.startTime).getTime() === startAt.getTime());
    if (!slot || !slot.available) throw new AppError('Créneau non disponible', 400);
    return prisma.booking.create({ data: { ...data, startAt, endAt, status: BOOKING_STATUS.PENDING }, include: { service: true } });
  },
  async getById(id: string) {
    return prisma.booking.findUnique({ where: { id }, include: { service: true, notes: { orderBy: { createdAt: 'desc' } } } });
  },
  async getPublicById(id: string) {
    return prisma.booking.findUnique({ where: { id }, include: { service: true } });
  },
  async getAll(filters: any, page = 1, limit = 20, sortBy = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.serviceId) where.serviceId = filters.serviceId;
    if (filters.dateFrom || filters.dateTo) { where.startAt = {}; if (filters.dateFrom) where.startAt.gte = new Date(filters.dateFrom); if (filters.dateTo) where.startAt.lte = new Date(filters.dateTo); }
    if (filters.search) where.OR = [{ customerName: { contains: filters.search, mode: 'insensitive' } }, { customerEmail: { contains: filters.search, mode: 'insensitive' } }];
    const [total, bookings] = await Promise.all([prisma.booking.count({ where }), prisma.booking.findMany({ where, include: { service: true, notes: { orderBy: { createdAt: 'desc' } } }, orderBy: { [sortBy]: sortOrder }, skip: (page - 1) * limit, take: limit })]);
    return { data: bookings, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },
  async update(id: string, data: any) {
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) throw new AppError('Réservation non trouvée', 404);
    return prisma.booking.update({ where: { id }, data, include: { service: true, notes: { orderBy: { createdAt: 'desc' } } } });
  },
  async addNote(bookingId: string, content: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new AppError('Réservation non trouvée', 404);
    return prisma.bookingNote.create({ data: { bookingId, content } });
  },
  async cancel(id: string) {
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) throw new AppError('Réservation non trouvée', 404);
    console.info(`[NOTIFICATION] Booking ${id} cancelled. Email to ${existing.customerEmail}`);
    return prisma.booking.update({ where: { id }, data: { status: BOOKING_STATUS.CANCELLED }, include: { service: true } });
  },
  async getDashboardStats() {
    const now = new Date();
    const [todayBookings, weekBookings, monthBookings, cancelledThisWeek, pendingBookings, recentBookings] = await Promise.all([
      prisma.booking.count({ where: { startAt: { gte: startOfDay(now), lte: endOfDay(now) }, status: { not: BOOKING_STATUS.CANCELLED } } }),
      prisma.booking.count({ where: { startAt: { gte: startOfWeek(now), lte: endOfWeek(now) }, status: { not: BOOKING_STATUS.CANCELLED } } }),
      prisma.booking.count({ where: { startAt: { gte: startOfMonth(now) }, status: { not: BOOKING_STATUS.CANCELLED } } }),
      prisma.booking.count({ where: { updatedAt: { gte: startOfWeek(now), lte: endOfWeek(now) }, status: BOOKING_STATUS.CANCELLED } }),
      prisma.booking.count({ where: { status: BOOKING_STATUS.PENDING } }),
      prisma.booking.findMany({ where: { status: { not: BOOKING_STATUS.CANCELLED } }, include: { service: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);
    return { todayBookings, weekBookings, monthBookings, cancelledThisWeek, pendingBookings, recentBookings };
  },
  async exportCsv() {
    const bookings = await prisma.booking.findMany({ include: { service: true }, orderBy: { createdAt: 'desc' } });
    const headers = ['ID', 'Service', 'Client', 'Email', 'Date', 'Heure', 'Statut'];
    const rows = bookings.map(b => [b.id, b.service.name, b.customerName, b.customerEmail, b.startAt.toISOString().split('T')[0], b.startAt.toTimeString().slice(0, 5), b.status]);
    return [headers.join(';'), ...rows.map(r => r.map(c => `"${c}"`).join(';'))].join('\n');
  },
};
