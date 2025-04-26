import type { ErrorRequestHandler } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: number | string;
  details?: any;
}

const errorHandler: ErrorRequestHandler = (
  error: CustomError,
  _req,
  res,
  _next,
) => {
  res.status(error.statusCode || 500).json({ message: error.message });
};

export default errorHandler;
