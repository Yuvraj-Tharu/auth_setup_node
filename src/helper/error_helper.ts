import { Request, Response, NextFunction } from 'express';
import { apiError } from '@utils/response';
import config from '@utils/config';

interface Error {
  status?: number;
  message?: string;
  stack?: string;
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (config.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  const errorResponse = apiError(message, err, statusCode);
  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
