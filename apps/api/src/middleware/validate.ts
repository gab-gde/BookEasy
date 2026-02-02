import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[target]);
      req[target] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details: Record<string, string[]> = {};
        error.errors.forEach((e) => {
          const path = e.path.join('.') || 'root';
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
      next(error);
    }
  };
}
