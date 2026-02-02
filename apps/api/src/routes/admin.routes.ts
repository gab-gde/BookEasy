import { Router } from 'express';
import {
  serviceController,
  availabilityController,
  bookingController,
} from '../controllers';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/error';
import {
  serviceCreateSchema,
  serviceUpdateSchema,
  availabilityRuleCreateSchema,
  availabilityRuleUpdateSchema,
  availabilityExceptionCreateSchema,
  availabilityExceptionUpdateSchema,
  bookingUpdateSchema,
  bookingNoteCreateSchema,
} from '@bookeasy/shared';

const router = Router();

// All admin routes require authentication
router.use(authMiddleware);

// ==========================================
// Dashboard
// ==========================================

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get(
  '/dashboard',
  asyncHandler(bookingController.getDashboardStats.bind(bookingController))
);

// ==========================================
// Bookings
// ==========================================

/**
 * @swagger
 * /admin/bookings:
 *   get:
 *     summary: Get all bookings with filters
 *     tags: [Admin - Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, startAt, status]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Paginated bookings list
 */
router.get('/bookings', asyncHandler(bookingController.getAll.bind(bookingController)));

/**
 * @swagger
 * /admin/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Admin - Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Booking details with notes
 *       404:
 *         description: Booking not found
 */
router.get('/bookings/:id', asyncHandler(bookingController.getById.bind(bookingController)));

/**
 * @swagger
 * /admin/bookings/{id}:
 *   patch:
 *     summary: Update booking
 *     tags: [Admin - Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *               customerName:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *               customerNote:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated booking
 */
router.patch(
  '/bookings/:id',
  validate(bookingUpdateSchema),
  asyncHandler(bookingController.update.bind(bookingController))
);

/**
 * @swagger
 * /admin/bookings/{id}/notes:
 *   post:
 *     summary: Add internal note to booking
 *     tags: [Admin - Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note added
 */
router.post(
  '/bookings/:id/notes',
  validate(bookingNoteCreateSchema),
  asyncHandler(bookingController.addNote.bind(bookingController))
);

/**
 * @swagger
 * /admin/bookings/{id}/cancel:
 *   post:
 *     summary: Cancel booking and notify customer
 *     tags: [Admin - Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Booking cancelled
 */
router.post('/bookings/:id/cancel', asyncHandler(bookingController.cancel.bind(bookingController)));

/**
 * @swagger
 * /admin/export/bookings.csv:
 *   get:
 *     summary: Export all bookings as CSV
 *     tags: [Admin - Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/export/bookings.csv', asyncHandler(bookingController.exportCsv.bind(bookingController)));

// ==========================================
// Services
// ==========================================

/**
 * @swagger
 * /admin/services:
 *   get:
 *     summary: Get all services (including inactive)
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all services
 */
router.get('/services', asyncHandler(serviceController.getAllAdmin.bind(serviceController)));

/**
 * @swagger
 * /admin/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Service details
 */
router.get('/services/:id', asyncHandler(serviceController.getById.bind(serviceController)));

/**
 * @swagger
 * /admin/services:
 *   post:
 *     summary: Create new service
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - durationMin
 *               - priceCents
 *             properties:
 *               name:
 *                 type: string
 *               durationMin:
 *                 type: integer
 *               priceCents:
 *                 type: integer
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Service created
 */
router.post(
  '/services',
  validate(serviceCreateSchema),
  asyncHandler(serviceController.create.bind(serviceController))
);

/**
 * @swagger
 * /admin/services/{id}:
 *   patch:
 *     summary: Update service
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Updated service
 */
router.patch(
  '/services/:id',
  validate(serviceUpdateSchema),
  asyncHandler(serviceController.update.bind(serviceController))
);

/**
 * @swagger
 * /admin/services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Service deleted
 */
router.delete('/services/:id', asyncHandler(serviceController.delete.bind(serviceController)));

// ==========================================
// Availability Rules
// ==========================================

/**
 * @swagger
 * /admin/availability-rules:
 *   get:
 *     summary: Get all availability rules
 *     tags: [Admin - Availability]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of availability rules
 */
router.get(
  '/availability-rules',
  asyncHandler(availabilityController.getAllRules.bind(availabilityController))
);

/**
 * @swagger
 * /admin/availability-rules:
 *   post:
 *     summary: Create availability rule
 *     tags: [Admin - Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dayOfWeek
 *               - startTime
 *               - endTime
 *             properties:
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *               startTime:
 *                 type: string
 *                 pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
 *               endTime:
 *                 type: string
 *                 pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
 *               slotStepMin:
 *                 type: integer
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Rule created
 */
router.post(
  '/availability-rules',
  validate(availabilityRuleCreateSchema),
  asyncHandler(availabilityController.createRule.bind(availabilityController))
);

/**
 * @swagger
 * /admin/availability-rules/{id}:
 *   patch:
 *     summary: Update availability rule
 *     tags: [Admin - Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rule updated
 */
router.patch(
  '/availability-rules/:id',
  validate(availabilityRuleUpdateSchema),
  asyncHandler(availabilityController.updateRule.bind(availabilityController))
);

/**
 * @swagger
 * /admin/availability-rules/{id}:
 *   delete:
 *     summary: Delete availability rule
 *     tags: [Admin - Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Rule deleted
 */
router.delete(
  '/availability-rules/:id',
  asyncHandler(availabilityController.deleteRule.bind(availabilityController))
);

// ==========================================
// Availability Exceptions
// ==========================================

/**
 * @swagger
 * /admin/availability-exceptions:
 *   get:
 *     summary: Get all availability exceptions
 *     tags: [Admin - Availability]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exceptions
 */
router.get(
  '/availability-exceptions',
  asyncHandler(availabilityController.getAllExceptions.bind(availabilityController))
);

/**
 * @swagger
 * /admin/availability-exceptions:
 *   post:
 *     summary: Create availability exception
 *     tags: [Admin - Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               isClosed:
 *                 type: boolean
 *               customStartTime:
 *                 type: string
 *               customEndTime:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exception created
 */
router.post(
  '/availability-exceptions',
  validate(availabilityExceptionCreateSchema),
  asyncHandler(availabilityController.createException.bind(availabilityController))
);

/**
 * @swagger
 * /admin/availability-exceptions/{id}:
 *   patch:
 *     summary: Update availability exception
 *     tags: [Admin - Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Exception updated
 */
router.patch(
  '/availability-exceptions/:id',
  validate(availabilityExceptionUpdateSchema),
  asyncHandler(availabilityController.updateException.bind(availabilityController))
);

/**
 * @swagger
 * /admin/availability-exceptions/{id}:
 *   delete:
 *     summary: Delete availability exception
 *     tags: [Admin - Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Exception deleted
 */
router.delete(
  '/availability-exceptions/:id',
  asyncHandler(availabilityController.deleteException.bind(availabilityController))
);

export default router;
