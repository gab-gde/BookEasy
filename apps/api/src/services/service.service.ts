import prisma from '../prisma';
import { AppError } from '../middleware/error';

export const serviceService = {
  async getAll(includeInactive = false) {
    return prisma.service.findMany({ where: includeInactive ? {} : { isActive: true }, orderBy: { name: 'asc' } });
  },
  async getById(id: string) {
    return prisma.service.findUnique({ where: { id } });
  },
  async create(data: { name: string; durationMin: number; priceCents: number; description?: string; isActive?: boolean }) {
    return prisma.service.create({ data });
  },
  async update(id: string, data: any) {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) throw new AppError('Service non trouvé', 404);
    return prisma.service.update({ where: { id }, data });
  },
  async delete(id: string) {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) throw new AppError('Service non trouvé', 404);
    const bookings = await prisma.booking.count({ where: { serviceId: id } });
    if (bookings > 0) return prisma.service.update({ where: { id }, data: { isActive: false } });
    return prisma.service.delete({ where: { id } });
  },
};
