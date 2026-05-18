import mongoose from 'mongoose';

const mealDeliveryStatusSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' },
    deliveredAt: { type: Date },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

mealDeliveryStatusSchema.index({ userId: 1, date: 1, mealType: 1 }, { unique: true });

export default mongoose.model('MealDeliveryStatus', mealDeliveryStatusSchema);
