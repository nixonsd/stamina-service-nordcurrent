import { Response } from 'express';
import { ApiResponse } from '../types/api-response.type';

export function sendApi<T>(
  res: Response,
  status: number,
  message: string,
  data: T | undefined = undefined
): Response<ApiResponse<T | undefined>> {
  const body: ApiResponse<T | undefined> = { status, message, data };
  return res.status(status).json(body);
}
