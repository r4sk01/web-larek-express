import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import { Error as MongoError } from 'mongoose';
import Product from '../models/product';

const { ObjectId } = require('mongoose').Types;

const createOrder = async (req: Request, res: Response) => {
  const { total, items } = req.body;
  const id = faker.string.uuid();
  let totalDb = 0;

  await Promise.allSettled(
    items.map(async (itemId: string) => {
      const product = await Product.findById({ _id: new ObjectId(itemId) });
      if (!product) {
        console.log(`Товар с ID: ${itemId} не найден.`);
      }
      // @ts-ignore
      if (product.price === null) {
        console.log(`Для товара с ID: ${itemId} не указана цена товара.`);
      }
      // @ts-ignore
      totalDb += product.price;
      return totalDb;
    }),
  )
    .then(() => {
      console.log(total);
      console.log(totalDb);
      if (total !== totalDb) {
        console.log('Ошибка! Не Совпадает Итоговая Стоимость Товара.');
      }
      return res.status(201).send({ id, total: totalDb });
    })
    .catch((error) => {
      if (error instanceof Error && error.message.includes('E11000')) {
        console.log(`Ошибка: ${error.message}`);
      }
      if (error instanceof MongoError.ValidationError) {
        console.log(`Ошибка: ${error.message}`);
      }
      console.log(`Ошибка создания товара: ${error.message}`);
    });
};

export default createOrder;
