import { PrismaClient } from '@prisma/client';

// Mock prisma for tests
jest.mock('../prisma', () => ({
  __esModule: true,
  default: new PrismaClient(),
  prisma: new PrismaClient(),
}));

// Silence console in tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
