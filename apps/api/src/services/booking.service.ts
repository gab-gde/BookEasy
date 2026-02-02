import prisma from '../prisma';
import { AppError } from '../middleware/error';
import {
  Booking,
  BookingCreateInput,
  BookingUpdateInput,
  BookingNote,
  BookingNoteCreateInput,
  PaginatedResponse,
  BookingFilters,
  DashboardStats,
  BookingStatus,
  BOOKING_STATUS,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
} from '@bookeasy/shared';
import { availabilityService } from './availability.service';

export class BookingService {
  async create(data: BookingCreateInput): Promise<Booking> {
    // Verify service exists and is active
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service || !service.isActive) {
      throw new AppError('Service non disponible', 400, 'SERVICE_UNAVAILABLE');
    }

    const startAt = new Date(data.startAt);
    const endAt = new Date(startAt);
    endAt.setMinutes(endAt.getMinutes() + service.durationMin);

    // Check slot availability
    const dateStr = startAt.toISOString().split('T')[0];
    const slots = await availabilityService.getAvailableSlots(data.serviceId, dateStr);
    
    const slot = slots.find(
      (s) => new Date(s.startTime).getTime() === startAt.getTime()
    );

    if (!slot || !slot.available) {
      throw new AppError('Ce créneau n\'est plus disponible', 400, 'SLOT_UNAVAILABLE');
    }

    const booking = await prisma.booking.create({
      data: {
        serviceId: data.serviceId,
        startAt,
        endAt,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || null,
        customerNote: data.customerNote || null,
        status: BOOKING_STATUS.PENDING,
      },
      include: {
        service: true,
        notes: true,
      },
    });

    return booking as unknown as Booking;
  }

  async getById(id: string): Promise<Booking | null> {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return booking as unknown as Booking | null;
  }

  async getPublicById(id: string): Promise<Booking | null> {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });
    
    if (!booking) return null;

    // Return without internal notes
    return {
      ...booking,
      notes: [],
    } as unknown as Booking;
  }

  async getAll(
    filters: BookingFilters,
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<Booking>> {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.serviceId) {
      where.serviceId = filters.serviceId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.startAt = {};
      if (filters.dateFrom) {
        where.startAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.startAt.lte = new Date(filters.dateTo);
      }
    }

    if (filters.search) {
      where.OR = [
        { customerName: { contains: filters.search } },
        { customerEmail: { contains: filters.search } },
        { customerPhone: { contains: filters.search } },
      ];
    }

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: {
          service: true,
          notes: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: bookings as unknown as Booking[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: BookingUpdateInput): Promise<Booking> {
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Réservation non trouvée', 404, 'NOT_FOUND');
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: data.status,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerNote: data.customerNote,
      },
      include: {
        service: true,
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return booking as unknown as Booking;
  }

  async addNote(bookingId: string, data: BookingNoteCreateInput): Promise<BookingNote> {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new AppError('Réservation non trouvée', 404, 'NOT_FOUND');
    }

    const note = await prisma.bookingNote.create({
      data: {
        bookingId,
        content: data.content,
      },
    });

    return note as BookingNote;
  }

  async cancel(id: string): Promise<Booking> {
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Réservation non trouvée', 404, 'NOT_FOUND');
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: BOOKING_STATUS.CANCELLED,
      },
      include: {
        service: true,
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Here you would send notification (simulated)
    console.info(`[NOTIFICATION] Booking ${id} cancelled. Email would be sent to ${booking.customerEmail}`);

    return booking as unknown as Booking;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const monthStart = startOfMonth(now);

    const [
      todayBookings,
      weekBookings,
      monthBookings,
      cancelledThisWeek,
      pendingBookings,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count({
        where: {
          startAt: { gte: todayStart, lte: todayEnd },
          status: { not: BOOKING_STATUS.CANCELLED },
        },
      }),
      prisma.booking.count({
        where: {
          startAt: { gte: weekStart, lte: weekEnd },
          status: { not: BOOKING_STATUS.CANCELLED },
        },
      }),
      prisma.booking.count({
        where: {
          startAt: { gte: monthStart },
          status: { not: BOOKING_STATUS.CANCELLED },
        },
      }),
      prisma.booking.count({
        where: {
          updatedAt: { gte: weekStart, lte: weekEnd },
          status: BOOKING_STATUS.CANCELLED,
        },
      }),
      prisma.booking.count({
        where: { status: BOOKING_STATUS.PENDING },
      }),
      prisma.booking.findMany({
        where: { status: { not: BOOKING_STATUS.CANCELLED } },
        include: { service: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      todayBookings,
      weekBookings,
      monthBookings,
      cancelledThisWeek,
      pendingBookings,
      recentBookings: recentBookings as unknown as Booking[],
    };
  }

  async exportToCsv(): Promise<string> {
    const bookings = await prisma.booking.findMany({
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'ID',
      'Service',
      'Client',
      'Email',
      'Téléphone',
      'Date',
      'Heure début',
      'Heure fin',
      'Statut',
      'Note client',
      'Créé le',
    ];

    const rows = bookings.map((b) => [
      b.id,
      b.service.name,
      b.customerName,
      b.customerEmail,
      b.customerPhone || '',
      b.startAt.toISOString().split('T')[0],
      b.startAt.toTimeString().slice(0, 5),
      b.endAt.toTimeString().slice(0, 5),
      b.status,
      b.customerNote || '',
      b.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')),
    ].join('\n');

    return csvContent;
  }
}

export const bookingService = new BookingService();
