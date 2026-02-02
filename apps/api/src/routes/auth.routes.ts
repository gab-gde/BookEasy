import { Router } from 'express';
import { authController } from '../controllers';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/error';
import { loginSchema, registerSchema } from '@bookeasy/shared';
import rateLimit from 'express-rate-limit';
import { config } from '../config';

const router = Router();

// Rate limit for login
const loginLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.loginMax,
  message: { message: 'Trop de tentatives de connexion. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  asyncHandler(authController.login.bind(authController))
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Email already exists
 */
router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(authController.register.bind(authController))
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current admin info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin info
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, asyncHandler(authController.me.bind(authController)));

export default router;
