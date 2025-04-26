import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import * as process from 'node:process';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import NotFoundError from './errors/not-found-error';

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static Resources
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(requestLogger);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use(
  '*',
  (
    req,
    _res,
    next,
  ) => next(new NotFoundError(`Путь ${req.path} не Найден`)),
);

app.use(errors);
app.use(errorLogger);
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(DB_ADDRESS)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

app.listen(PORT, () => {
  console.log('Сервер запущен на порту 3000');
});
