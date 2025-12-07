import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { sendApi } from '../helpers/send-api.helper';
import { logger } from '../logger';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    // Unexpected error - log it
    logger.error(err);
  }

  const debugInfo = process.env.NODE_ENV === 'development' && err instanceof Error ? { stack: err.stack } : null;

  sendApi(res, status, message, debugInfo);
}
