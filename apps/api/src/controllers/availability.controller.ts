import { Request, Response } from 'express';
import { availabilityService } from '../services';

export class AvailabilityController {
  // Public - Get available slots
  async getSlots(req: Request, res: Response) {
    const { serviceId, date } = req.query as { serviceId: string; date: string };
    const slots = await availabilityService.getAvailableSlots(serviceId, date);
    res.json(slots);
  }

  // Admin - Rules
  async getAllRules(req: Request, res: Response) {
    const rules = await availabilityService.getAllRules();
    res.json(rules);
  }

  async getRuleById(req: Request, res: Response) {
    const rule = await availabilityService.getRuleById(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: 'Règle non trouvée' });
    }
    res.json(rule);
  }

  async createRule(req: Request, res: Response) {
    const rule = await availabilityService.createRule(req.body);
    res.status(201).json(rule);
  }

  async updateRule(req: Request, res: Response) {
    const rule = await availabilityService.updateRule(req.params.id, req.body);
    res.json(rule);
  }

  async deleteRule(req: Request, res: Response) {
    await availabilityService.deleteRule(req.params.id);
    res.status(204).send();
  }

  // Admin - Exceptions
  async getAllExceptions(req: Request, res: Response) {
    const exceptions = await availabilityService.getAllExceptions();
    res.json(exceptions);
  }

  async getExceptionById(req: Request, res: Response) {
    const exception = await availabilityService.getExceptionById(req.params.id);
    if (!exception) {
      return res.status(404).json({ message: 'Exception non trouvée' });
    }
    res.json(exception);
  }

  async createException(req: Request, res: Response) {
    const exception = await availabilityService.createException(req.body);
    res.status(201).json(exception);
  }

  async updateException(req: Request, res: Response) {
    const exception = await availabilityService.updateException(req.params.id, req.body);
    res.json(exception);
  }

  async deleteException(req: Request, res: Response) {
    await availabilityService.deleteException(req.params.id);
    res.status(204).send();
  }
}

export const availabilityController = new AvailabilityController();
