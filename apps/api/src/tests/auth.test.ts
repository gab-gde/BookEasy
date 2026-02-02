import request from 'supertest';
import app from '../app';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';

describe('Auth API', () => {
  const testAdmin = {
    email: 'test@bookeasy.com',
    password: 'testpassword123',
  };

  beforeAll(async () => {
    // Clean and create test admin
    await prisma.adminUser.deleteMany({
      where: { email: testAdmin.email },
    });
    
    const passwordHash = await bcrypt.hash(testAdmin.password, 10);
    await prisma.adminUser.create({
      data: {
        email: testAdmin.email,
        passwordHash,
      },
    });
  });

  afterAll(async () => {
    await prisma.adminUser.deleteMany({
      where: { email: testAdmin.email },
    });
    await prisma.$disconnect();
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send(testAdmin);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('admin');
      expect(res.body.admin.email).toBe(testAdmin.email);
    });

    it('should return 401 with invalid password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testAdmin.email,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('incorrect');
    });

    it('should return 401 with non-existent email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@bookeasy.com',
          password: testAdmin.password,
        });

      expect(res.status).toBe(401);
    });

    it('should return validation error with invalid email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: testAdmin.password,
        });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /auth/me', () => {
    let authToken: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/auth/login')
        .send(testAdmin);
      authToken = res.body.token;
    });

    it('should return admin info with valid token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(testAdmin.email);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(401);
    });
  });
});
