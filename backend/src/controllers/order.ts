import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import { Error as MongoError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

const { ObjectId } = require('mongoose').Types;

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body;
    const id = faker.string.uuid();
    let totalDb = 0;

    // Fetch all products in one query
    const productIds = items.map((itemID: string) => new ObjectId(itemID));
    const products = await Product.find({ _id: { $in: productIds } });

    // Create a map for quick lookup
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    // eslint-disable-next-line no-restricted-syntax
    for (const itemID of items) {
      const product = productMap.get(itemID);

      if (!product) {
        return next(new BadRequestError(`Товар с ID: ${itemID} Не Найден.`));
      }

      if (product.price === null || product.price === undefined) {
        return next(new BadRequestError(`Для Товара с ID: ${itemID} Не Указана Цена Товара.`));
      }

      totalDb += product.price;
    }

    if (total !== totalDb) {
      return next(new BadRequestError('Итоговая Стоимость Товара не Совпадает.'));
    }

    return res.status(201).send({ id, total: totalDb });
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError(`Ошибка: ${error.message}`));
    }

    if (error instanceof MongoError.ValidationError) {
      return next(new BadRequestError(`Ошибка: ${error.message}`));
    }

    return next(new BadRequestError(`Ошибка Создания Товара: ${error.message}`));
  }
};

export default createOrder;
