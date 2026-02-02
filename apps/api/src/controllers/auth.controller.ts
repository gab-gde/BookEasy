import { Request, Response } from 'express';
import { authService } from '../services';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  }

  async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.register(email, password);
    res.status(201).json(result);
  }

  async me(req: AuthRequest, res: Response) {
    const admin = await authService.getAdminById(req.adminId!);
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trouvé' });
    }
    res.json(admin);
  }
}

export const authController = new AuthController();
