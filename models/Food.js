import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Food', foodSchema);
