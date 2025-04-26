import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import createOrder from '../controllers/order';

const orderSchema = Joi.object({
  payment: Joi.string().valid('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/i)
    .required(),
  address: Joi.string().required(),
  total: Joi.number().min(1).required(),
  items: Joi.array().items(Joi.string()).required(),
});

const validateOrder = celebrate({
  [Segments.BODY]: orderSchema,
});

const orderRoutes = Router();

orderRoutes.post('/', validateOrder, createOrder);

export default orderRoutes;
