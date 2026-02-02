import request from 'supertest';
import app from '../app';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';

describe('Services API', () => {
  let authToken: string;
  let testServiceId: string;

  const testAdmin = {
    email: 'servicetest@bookeasy.com',
    password: 'testpassword123',
  };

  beforeAll(async () => {
    // Clean up
    await prisma.booking.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.adminUser.deleteMany({
      where: { email: testAdmin.email },
    });

    // Create test admin
    const passwordHash = await bcrypt.hash(testAdmin.password, 10);
    await prisma.adminUser.create({
      data: {
        email: testAdmin.email,
        passwordHash,
      },
    });

    // Login to get token
    const res = await request(app)
      .post('/auth/login')
      .send(testAdmin);
    authToken = res.body.token;

    // Create a test service
    const service = await prisma.service.create({
      data: {
        name: 'Test Service',
        durationMin: 60,
        priceCents: 5000,
        description: 'Test service description',
        isActive: true,
      },
    });
    testServiceId = service.id;
  });

  afterAll(async () => {
    await prisma.booking.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.adminUser.deleteMany({
      where: { email: testAdmin.email },
    });
    await prisma.$disconnect();
  });

  describe('GET /services (public)', () => {
    it('should return active services', async () => {
      const res = await request(app).get('/services');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('durationMin');
      expect(res.body[0]).toHaveProperty('priceCents');
    });

    it('should not return inactive services', async () => {
      // Create inactive service
      await prisma.service.create({
        data: {
          name: 'Inactive Service',
          durationMin: 30,
          priceCents: 1000,
          isActive: false,
        },
      });

      const res = await request(app).get('/services');

      expect(res.status).toBe(200);
      const inactiveService = res.body.find((s: any) => s.name === 'Inactive Service');
      expect(inactiveService).toBeUndefined();
    });
  });

  describe('POST /admin/services', () => {
    it('should create a new service', async () => {
      const newService = {
        name: 'New Test Service',
        durationMin: 45,
        priceCents: 7500,
        description: 'A brand new service',
      };

      const res = await request(app)
        .post('/admin/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newService);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe(newService.name);
      expect(res.body.durationMin).toBe(newService.durationMin);
      expect(res.body.priceCents).toBe(newService.priceCents);
      expect(res.body.isActive).toBe(true);
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .post('/admin/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'A', // Too short
          durationMin: 2, // Too short
        });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without auth', async () => {
      const res = await request(app)
        .post('/admin/services')
        .send({
          name: 'Test',
          durationMin: 30,
          priceCents: 1000,
        });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /admin/services/:id', () => {
    it('should update a service', async () => {
      const res = await request(app)
        .patch(`/admin/services/${testServiceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Service Name',
          priceCents: 6000,
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Service Name');
      expect(res.body.priceCents).toBe(6000);
    });

    it('should return 404 for non-existent service', async () => {
      const res = await request(app)
        .patch('/admin/services/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test' });

      expect(res.status).toBe(404);
    });
  });
});
