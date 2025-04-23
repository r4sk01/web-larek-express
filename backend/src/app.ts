import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';

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

app.use(errors);
app.use(errorLogger);
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/weblarek')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
