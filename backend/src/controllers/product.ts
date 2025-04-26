import { Request, Response, NextFunction } from 'express';
import { Error as MongoError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

// DRY
const handleError = (error: any, next: NextFunction, context: string) => {
  if (error instanceof Error && error.message.includes('E11000')) {
    return next(new ConflictError(`Ошибка ${context}: ${error.message}`));
  }

  if (error instanceof MongoError.ValidationError) {
    return next(new BadRequestError(`Ошибка ${context}: ${error.message}`));
  }

  return next(new BadRequestError(`Ошибка ${context}: ${error.message}`));
};

// Get all products
export const getAllProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Product.find({});
    return res.send({ items: data, total: data.length });
  } catch (error) {
    return handleError(error, next, 'Получения Товаров');
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).send({ item: product });
  } catch (error) {
    return handleError(error, next, 'Создания Товара');
  }
};
