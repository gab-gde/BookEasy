import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.bookingNote.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilityException.deleteMany();
  await prisma.availabilityRule.deleteMany();
  await prisma.service.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@bookeasy.com',
      passwordHash,
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Consultation découverte',
        durationMin: 30,
        priceCents: 0,
        description: 'Premier rendez-vous gratuit pour discuter de vos besoins',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Coaching individuel',
        durationMin: 60,
        priceCents: 8000,
        description: 'Séance de coaching personnalisé pour atteindre vos objectifs',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Coaching premium',
        durationMin: 90,
        priceCents: 12000,
        description: 'Séance approfondie avec suivi personnalisé et ressources exclusives',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Atelier groupe (4 pers.)',
        durationMin: 120,
        priceCents: 4500,
        description: 'Atelier collectif sur des thématiques clés du développement personnel',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Bilan de compétences',
        durationMin: 90,
        priceCents: 15000,
        description: 'Analyse complète de votre profil et recommandations carrière',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Suivi mensuel',
        durationMin: 45,
        priceCents: 6000,
        description: 'Point mensuel pour assurer la continuité de votre progression',
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ ${services.length} services created`);

  // Create availability rules (Monday to Friday, 9h-18h)
  const rules = await Promise.all([
    prisma.availabilityRule.create({
      data: { dayOfWeek: 0, startTime: '09:00', endTime: '18:00', slotStepMin: 30, capacity: 1 },
    }),
    prisma.availabilityRule.create({
      data: { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', slotStepMin: 30, capacity: 1 },
    }),
    prisma.availabilityRule.create({
      data: { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', slotStepMin: 30, capacity: 1 },
    }),
    prisma.availabilityRule.create({
      data: { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', slotStepMin: 30, capacity: 1 },
    }),
    prisma.availabilityRule.create({
      data: { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', slotStepMin: 30, capacity: 1 },
    }),
  ]);
  console.log(`✅ ${rules.length} availability rules created`);

  // Create some availability exceptions
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  
  await prisma.availabilityException.create({
    data: {
      date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 15),
      isClosed: true,
    },
  });
  console.log('✅ Availability exception created');

  // Create demo bookings
  const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  const customerNames = [
    'Marie Dupont',
    'Jean Martin',
    'Sophie Bernard',
    'Pierre Leroy',
    'Claire Moreau',
    'Lucas Petit',
    'Emma Garcia',
    'Hugo Thomas',
    'Léa Robert',
    'Nathan Richard',
  ];

  const bookings = [];
  for (let i = 0; i < 10; i++) {
    const service = services[i % services.length];
    const daysOffset = i - 3; // Some in past, some in future
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + daysOffset);
    bookingDate.setHours(9 + (i % 8), (i % 2) * 30, 0, 0);

    // Skip weekends
    while (bookingDate.getDay() === 0 || bookingDate.getDay() === 6) {
      bookingDate.setDate(bookingDate.getDate() + 1);
    }

    const endDate = new Date(bookingDate);
    endDate.setMinutes(endDate.getMinutes() + service.durationMin);

    let status = statuses[i % statuses.length];
    // Past bookings should be completed or cancelled
    if (daysOffset < 0 && status === 'PENDING') {
      status = 'COMPLETED';
    }
    if (daysOffset < 0 && status === 'CONFIRMED') {
      status = 'COMPLETED';
    }

    const booking = await prisma.booking.create({
      data: {
        serviceId: service.id,
        startAt: bookingDate,
        endAt: endDate,
        customerName: customerNames[i],
        customerEmail: `${customerNames[i].toLowerCase().replace(' ', '.')}@example.com`,
        customerPhone: `06${Math.floor(10000000 + Math.random() * 90000000)}`,
        customerNote: i % 3 === 0 ? 'Première visite, besoin de conseils sur mon projet.' : null,
        status,
      },
    });

    // Add some notes to certain bookings
    if (i % 2 === 0) {
      await prisma.bookingNote.create({
        data: {
          bookingId: booking.id,
          content: 'Client contacté par téléphone pour confirmation.',
        },
      });
    }

    bookings.push(booking);
  }
  console.log(`✅ ${bookings.length} demo bookings created`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📧 Admin login: admin@bookeasy.com');
  console.log('🔑 Admin password: admin123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
