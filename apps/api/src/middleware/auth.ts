import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthRequest extends Request { adminId?: string; }

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Format invalide' });
  try {
    const decoded = jwt.verify(parts[1], config.jwt.secret) as { adminId: string };
    req.adminId = decoded.adminId;
    next();
  } catch { return res.status(401).json({ message: 'Token invalide' }); }
}
