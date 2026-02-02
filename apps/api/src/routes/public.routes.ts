import { Router } from 'express';
import { serviceController, availabilityController, bookingController } from '../controllers';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/error';
import { bookingCreateSchema, availabilityQuerySchema } from '@bookeasy/shared';

const router = Router();

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all active services
 *     tags: [Public - Services]
 *     responses:
 *       200:
 *         description: List of active services
 */
router.get('/services', asyncHandler(serviceController.getAll.bind(serviceController)));

/**
 * @swagger
 * /availability:
 *   get:
 *     summary: Get available time slots for a service on a date
 *     tags: [Public - Availability]
 *     parameters:
 *       - in: query
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of time slots
 */
router.get(
  '/availability',
  validate(availabilityQuerySchema, 'query'),
  asyncHandler(availabilityController.getSlots.bind(availabilityController))
);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Public - Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceId
 *               - startAt
 *               - customerName
 *               - customerEmail
 *             properties:
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *               startAt:
 *                 type: string
 *                 format: date-time
 *               customerName:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *                 format: email
 *               customerPhone:
 *                 type: string
 *               customerNote:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Validation error or slot unavailable
 */
router.post(
  '/bookings',
  validate(bookingCreateSchema),
  asyncHandler(bookingController.create.bind(bookingController))
);

/**
 * @swagger
 * /bookings/public/{id}:
 *   get:
 *     summary: Get booking details (public view)
 *     tags: [Public - Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */
router.get(
  '/bookings/public/:id',
  asyncHandler(bookingController.getPublicById.bind(bookingController))
);

export default router;
