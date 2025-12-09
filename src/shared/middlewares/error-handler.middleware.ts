import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { sendApi } from '../helpers/send-api.helper';
import { logger } from '../logger';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  let status = 500;
  let message = 'Internal Server Error';
  let data: unknown = undefined;

  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
    data = err.data;
  } else if (err instanceof Error) {
    logger.error(err);
  }

  sendApi(res, status, message, data);
}
