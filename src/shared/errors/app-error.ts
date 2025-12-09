export interface ErrorData {
  [key: string]: unknown;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly data?: ErrorData;

  constructor(message: string, statusCode: number, data?: ErrorData) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', data?: ErrorData) {
    super(message, 400, data);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', data?: ErrorData) {
    super(message, 401, data);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', data?: ErrorData) {
    super(message, 403, data);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found', data?: ErrorData) {
    super(message, 404, data);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', data?: ErrorData) {
    super(message, 409, data);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', data?: ErrorData) {
    super(message, 500, data);
  }
}
