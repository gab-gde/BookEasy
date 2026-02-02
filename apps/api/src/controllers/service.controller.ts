import { Request, Response } from 'express';
import { serviceService } from '../services';

export class ServiceController {
  // Public
  async getAll(req: Request, res: Response) {
    const services = await serviceService.getAll(false);
    res.json(services);
  }

  // Admin
  async getAllAdmin(req: Request, res: Response) {
    const services = await serviceService.getAll(true);
    res.json(services);
  }

  async getById(req: Request, res: Response) {
    const service = await serviceService.getById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    res.json(service);
  }

  async create(req: Request, res: Response) {
    const service = await serviceService.create(req.body);
    res.status(201).json(service);
  }

  async update(req: Request, res: Response) {
    const service = await serviceService.update(req.params.id, req.body);
    res.json(service);
  }

  async delete(req: Request, res: Response) {
    await serviceService.delete(req.params.id);
    res.status(204).send();
  }
}

export const serviceController = new ServiceController();
