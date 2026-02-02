import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { config } from '../config';
import { AppError } from '../middleware/error';
import { AdminUser, AuthResponse } from '@bookeasy/shared';

export class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new AppError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    };
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new AppError('Cet email est déjà utilisé', 400, 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
      },
    });

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    };
  }

  async getAdminById(id: string): Promise<AdminUser | null> {
    const admin = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!admin) return null;

    return {
      id: admin.id,
      email: admin.email,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}

export const authService = new AuthService();
