import { Request, Response } from 'express';
import { Error as MongoError } from 'mongoose';
import Product from '../models/product';

// Get all products
export const getAllProducts = (_req: Request, res: Response) => Product.find({})
  .then((data) => res.send({ items: data, total: data.length }))
  .catch((error) => {
    if (error instanceof MongoError.ValidationError) {
      console.log(`Ошибка полуения товаров - ${error.message}`);
    }
    console.log(`Ошибка полуения товаров - ${error.message}`);
  });

// Create a new product
export const createProduct = async (req: Request, res: Response) => Product.create(req.body)
  .then((product) => {
    res.status(201).send({ item: product });
  })
  .catch((error) => {
    if (error instanceof Error && error.message.includes('E11000')) {
      console.log(`Ошибка полуения товаров - ${error.message}`);
    }
    if (error instanceof MongoError.ValidationError) {
      console.log(`Ошибка полуения товаров - ${error.message}`);
    }
    console.log(`Ошибка полуения товаров - ${error.message}`);
  });
