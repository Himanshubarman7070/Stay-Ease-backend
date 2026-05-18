import mongoose from 'mongoose';

const groceryProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, default: 'General' },
  },
  { timestamps: true }
);

export default mongoose.model('GroceryProduct', groceryProductSchema);
