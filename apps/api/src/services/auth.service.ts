import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { config } from '../config';
import { AppError } from '../middleware/error';

export const authService = {
  async login(email: string, password: string) {
    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }
    const token = jwt.sign({ adminId: admin.id, email: admin.email }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    return { token, admin: { id: admin.id, email: admin.email, createdAt: admin.createdAt, updatedAt: admin.updatedAt } };
  },
  async getAdminById(id: string) {
    const admin = await prisma.adminUser.findUnique({ where: { id } });
    if (!admin) return null;
    return { id: admin.id, email: admin.email, createdAt: admin.createdAt, updatedAt: admin.updatedAt };
  },
};
