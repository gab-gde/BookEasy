import { Router } from 'express';
import { authController, serviceController, availabilityController, bookingController } from '../controllers';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/error';
import { loginSchema, serviceCreateSchema, serviceUpdateSchema, bookingCreateSchema, bookingUpdateSchema, bookingNoteCreateSchema, availabilityRuleCreateSchema, availabilityExceptionCreateSchema, availabilityQuerySchema } from '@bookeasy/shared';
import rateLimit from 'express-rate-limit';

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { message: 'Trop de tentatives' } });

// Auth
router.post('/auth/login', loginLimiter, validate(loginSchema), asyncHandler(authController.login));
router.get('/auth/me', authMiddleware, asyncHandler(authController.me));

// Public
router.get('/services', asyncHandler(serviceController.getAll));
router.get('/availability', validate(availabilityQuerySchema, 'query'), asyncHandler(availabilityController.getSlots));
router.post('/bookings', validate(bookingCreateSchema), asyncHandler(bookingController.create));
router.get('/bookings/public/:id', asyncHandler(bookingController.getPublicById));

// Admin
router.get('/admin/dashboard', authMiddleware, asyncHandler(bookingController.getDashboardStats));
router.get('/admin/bookings', authMiddleware, asyncHandler(bookingController.getAll));
router.get('/admin/bookings/:id', authMiddleware, asyncHandler(bookingController.getById));
router.patch('/admin/bookings/:id', authMiddleware, validate(bookingUpdateSchema), asyncHandler(bookingController.update));
router.post('/admin/bookings/:id/notes', authMiddleware, validate(bookingNoteCreateSchema), asyncHandler(bookingController.addNote));
router.post('/admin/bookings/:id/cancel', authMiddleware, asyncHandler(bookingController.cancel));
router.get('/admin/export/bookings.csv', authMiddleware, asyncHandler(bookingController.exportCsv));
router.get('/admin/services', authMiddleware, asyncHandler(serviceController.getAllAdmin));
router.get('/admin/services/:id', authMiddleware, asyncHandler(serviceController.getById));
router.post('/admin/services', authMiddleware, validate(serviceCreateSchema), asyncHandler(serviceController.create));
router.patch('/admin/services/:id', authMiddleware, validate(serviceUpdateSchema), asyncHandler(serviceController.update));
router.delete('/admin/services/:id', authMiddleware, asyncHandler(serviceController.delete));
router.get('/admin/availability-rules', authMiddleware, asyncHandler(availabilityController.getAllRules));
router.post('/admin/availability-rules', authMiddleware, validate(availabilityRuleCreateSchema), asyncHandler(availabilityController.createRule));
router.patch('/admin/availability-rules/:id', authMiddleware, asyncHandler(availabilityController.updateRule));
router.delete('/admin/availability-rules/:id', authMiddleware, asyncHandler(availabilityController.deleteRule));
router.get('/admin/availability-exceptions', authMiddleware, asyncHandler(availabilityController.getAllExceptions));
router.post('/admin/availability-exceptions', authMiddleware, validate(availabilityExceptionCreateSchema), asyncHandler(availabilityController.createException));
router.delete('/admin/availability-exceptions/:id', authMiddleware, asyncHandler(availabilityController.deleteException));

export default router;
