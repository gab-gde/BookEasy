import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  await prisma.bookingNote.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilityException.deleteMany();
  await prisma.availabilityRule.deleteMany();
  await prisma.service.deleteMany();
  await prisma.adminUser.deleteMany();

  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.create({ data: { email: 'admin@bookeasy.com', passwordHash } });

  const services = await Promise.all([
    prisma.service.create({ data: { name: 'Consultation découverte', durationMin: 30, priceCents: 0, description: 'Premier rendez-vous gratuit', isActive: true } }),
    prisma.service.create({ data: { name: 'Coaching individuel', durationMin: 60, priceCents: 8000, description: 'Séance de coaching personnalisé', isActive: true } }),
    prisma.service.create({ data: { name: 'Coaching premium', durationMin: 90, priceCents: 12000, description: 'Séance approfondie avec suivi', isActive: true } }),
    prisma.service.create({ data: { name: 'Atelier groupe', durationMin: 120, priceCents: 4500, description: 'Atelier collectif', isActive: true } }),
  ]);

  for (let day = 0; day < 5; day++) {
    await prisma.availabilityRule.create({ data: { dayOfWeek: day, startTime: '09:00', endTime: '18:00', slotStepMin: 30, capacity: 1 } });
  }

  const customerNames = ['Marie Dupont', 'Jean Martin', 'Sophie Bernard', 'Pierre Leroy', 'Claire Moreau'];
  for (let i = 0; i < 5; i++) {
    const service = services[i % services.length];
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + i + 1);
    bookingDate.setHours(9 + i, 0, 0, 0);
    while (bookingDate.getDay() === 0 || bookingDate.getDay() === 6) bookingDate.setDate(bookingDate.getDate() + 1);
    const endDate = new Date(bookingDate);
    endDate.setMinutes(endDate.getMinutes() + service.durationMin);
    await prisma.booking.create({
      data: {
        serviceId: service.id, startAt: bookingDate, endAt: endDate,
        customerName: customerNames[i], customerEmail: `${customerNames[i].toLowerCase().replace(' ', '.')}@example.com`,
        status: i === 0 ? 'PENDING' : 'CONFIRMED',
      },
    });
  }

  console.log('✅ Seeding done!');
  console.log('📧 Admin: admin@bookeasy.com / admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
