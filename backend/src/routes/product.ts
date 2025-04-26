import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { getAllProducts, createProduct } from '../controllers/product';

const productSchema = Joi.object({
  title: Joi.string().min(2).max(30).required(),
  image: Joi.object().required().keys({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }),
  category: Joi.string().min(2).max(30).required(),
  description: Joi.string().min(2).max(100).required(),
  price: Joi.number(),
});

const validateProduct = celebrate({
  [Segments.BODY]: productSchema,
});

const productRoutes = Router();

productRoutes.get('/', getAllProducts);
productRoutes.post('/', validateProduct, createProduct);

export default productRoutes;
