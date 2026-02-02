import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  code?: string;
  details?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const path = e.path.join('.');
      if (!details[path]) {
        details[path] = [];
      }
      details[path].push(e.message);
    });

    return res.status(400).json({
      message: 'Erreur de validation',
      code: 'VALIDATION_ERROR',
      details,
    });
  }

  // Custom app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      details: err.details,
    });
  }

  // Default error
  return res.status(500).json({
    message: 'Une erreur interne est survenue',
    code: 'INTERNAL_ERROR',
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    message: 'Route non trouvée',
    code: 'NOT_FOUND',
  });
}

// Async wrapper to catch errors
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
