import { Schema, model } from 'mongoose';

export interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price: number | null;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Обязательное Поле'],
    minlength: [2, 'Минимальная Длина: 2'],
    maxlength: [30, 'Максимальная Длина: 30'],
    unique: true,
  },
  image: {
    type: { fileName: String, originalName: String },
    required: [true, 'Обязательное Поле'],
  },
  category: {
    type: String,
    required: [true, 'Обязательное Поле'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default model<IProduct>('Product', productSchema);
