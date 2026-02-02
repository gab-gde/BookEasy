import prisma from '../prisma';
import { AppError } from '../middleware/error';
import { Service, ServiceCreateInput, ServiceUpdateInput } from '@bookeasy/shared';

export class ServiceService {
  async getAll(includeInactive = false): Promise<Service[]> {
    const services = await prisma.service.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { name: 'asc' },
    });
    return services as Service[];
  }

  async getById(id: string): Promise<Service | null> {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    return service as Service | null;
  }

  async create(data: ServiceCreateInput): Promise<Service> {
    const service = await prisma.service.create({
      data: {
        name: data.name,
        durationMin: data.durationMin,
        priceCents: data.priceCents,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
    return service as Service;
  }

  async update(id: string, data: ServiceUpdateInput): Promise<Service> {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Service non trouvé', 404, 'NOT_FOUND');
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        durationMin: data.durationMin,
        priceCents: data.priceCents,
        description: data.description,
        isActive: data.isActive,
      },
    });
    return service as Service;
  }

  async delete(id: string): Promise<void> {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Service non trouvé', 404, 'NOT_FOUND');
    }

    // Check if there are bookings for this service
    const bookingsCount = await prisma.booking.count({
      where: { serviceId: id },
    });

    if (bookingsCount > 0) {
      // Soft delete - just deactivate
      await prisma.service.update({
        where: { id },
        data: { isActive: false },
      });
    } else {
      await prisma.service.delete({ where: { id } });
    }
  }
}

export const serviceService = new ServiceService();
