import { Request, Response } from 'express';
import { bookingService } from '../services';
import { BookingFilters } from '@bookeasy/shared';

export class BookingController {
  // Public
  async create(req: Request, res: Response) {
    const booking = await bookingService.create(req.body);
    res.status(201).json(booking);
  }

  async getPublicById(req: Request, res: Response) {
    const booking = await bookingService.getPublicById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json(booking);
  }

  // Admin
  async getAll(req: Request, res: Response) {
    const {
      status,
      serviceId,
      dateFrom,
      dateTo,
      search,
      page = '1',
      limit = '20',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as Record<string, string>;

    const filters: BookingFilters = {
      status: status as any,
      serviceId,
      dateFrom,
      dateTo,
      search,
    };

    const result = await bookingService.getAll(
      filters,
      parseInt(page),
      parseInt(limit),
      sortBy,
      sortOrder as 'asc' | 'desc'
    );

    res.json(result);
  }

  async getById(req: Request, res: Response) {
    const booking = await bookingService.getById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json(booking);
  }

  async update(req: Request, res: Response) {
    const booking = await bookingService.update(req.params.id, req.body);
    res.json(booking);
  }

  async addNote(req: Request, res: Response) {
    const note = await bookingService.addNote(req.params.id, req.body);
    res.status(201).json(note);
  }

  async cancel(req: Request, res: Response) {
    const booking = await bookingService.cancel(req.params.id);
    res.json(booking);
  }

  async getDashboardStats(req: Request, res: Response) {
    const stats = await bookingService.getDashboardStats();
    res.json(stats);
  }

  async exportCsv(req: Request, res: Response) {
    const csv = await bookingService.exportToCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
    res.send('\ufeff' + csv); // BOM for Excel
  }
}

export const bookingController = new BookingController();
