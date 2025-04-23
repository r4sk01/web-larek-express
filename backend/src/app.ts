import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/product', productRoutes);
app.use('/order', orderRoutes);

// Static Resources
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/weblarek')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

app.listen(3000, () => { console.log('Server running on port 3000'); });
