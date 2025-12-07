import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

export type WrappedResponse<T = unknown> = Response<ApiResponse<T>>;
