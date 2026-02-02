import { Request, Response } from 'express';
import { authService, serviceService, availabilityService, bookingService } from '../services';
import { AuthRequest } from '../middleware/auth';

export const authController = {
  async login(req: Request, res: Response) { res.json(await authService.login(req.body.email, req.body.password)); },
  async me(req: AuthRequest, res: Response) { const admin = await authService.getAdminById(req.adminId!); admin ? res.json(admin) : res.status(404).json({ message: 'Not found' }); },
};

export const serviceController = {
  async getAll(req: Request, res: Response) { res.json(await serviceService.getAll(false)); },
  async getAllAdmin(req: Request, res: Response) { res.json(await serviceService.getAll(true)); },
  async getById(req: Request, res: Response) { const s = await serviceService.getById(req.params.id); s ? res.json(s) : res.status(404).json({ message: 'Not found' }); },
  async create(req: Request, res: Response) { res.status(201).json(await serviceService.create(req.body)); },
  async update(req: Request, res: Response) { res.json(await serviceService.update(req.params.id, req.body)); },
  async delete(req: Request, res: Response) { await serviceService.delete(req.params.id); res.status(204).send(); },
};

export const availabilityController = {
  async getSlots(req: Request, res: Response) { res.json(await availabilityService.getAvailableSlots(req.query.serviceId as string, req.query.date as string)); },
  async getAllRules(req: Request, res: Response) { res.json(await availabilityService.getAllRules()); },
  async createRule(req: Request, res: Response) { res.status(201).json(await availabilityService.createRule(req.body)); },
  async updateRule(req: Request, res: Response) { res.json(await availabilityService.updateRule(req.params.id, req.body)); },
  async deleteRule(req: Request, res: Response) { await availabilityService.deleteRule(req.params.id); res.status(204).send(); },
  async getAllExceptions(req: Request, res: Response) { res.json(await availabilityService.getAllExceptions()); },
  async createException(req: Request, res: Response) { res.status(201).json(await availabilityService.createException(req.body)); },
  async deleteException(req: Request, res: Response) { await availabilityService.deleteException(req.params.id); res.status(204).send(); },
};

export const bookingController = {
  async create(req: Request, res: Response) { res.status(201).json(await bookingService.create(req.body)); },
  async getPublicById(req: Request, res: Response) { const b = await bookingService.getPublicById(req.params.id); b ? res.json(b) : res.status(404).json({ message: 'Not found' }); },
  async getAll(req: Request, res: Response) { const { status, serviceId, dateFrom, dateTo, search, page = '1', limit = '20', sortBy = 'createdAt', sortOrder = 'desc' } = req.query as any; res.json(await bookingService.getAll({ status, serviceId, dateFrom, dateTo, search }, parseInt(page), parseInt(limit), sortBy, sortOrder)); },
  async getById(req: Request, res: Response) { const b = await bookingService.getById(req.params.id); b ? res.json(b) : res.status(404).json({ message: 'Not found' }); },
  async update(req: Request, res: Response) { res.json(await bookingService.update(req.params.id, req.body)); },
  async addNote(req: Request, res: Response) { res.status(201).json(await bookingService.addNote(req.params.id, req.body.content)); },
  async cancel(req: Request, res: Response) { res.json(await bookingService.cancel(req.params.id)); },
  async getDashboardStats(req: Request, res: Response) { res.json(await bookingService.getDashboardStats()); },
  async exportCsv(req: Request, res: Response) { res.setHeader('Content-Type', 'text/csv; charset=utf-8'); res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv'); res.send('\ufeff' + await bookingService.exportCsv()); },
};
