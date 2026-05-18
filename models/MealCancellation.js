import mongoose from 'mongoose';

const mealCancellationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tiffinRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'TiffinRequest' },
    date: { type: Date, required: true },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'morning', 'night'],
      required: true,
    },
    period: { type: String, enum: ['single', 'week1', 'week2'], default: 'single' },
    chargeAmount: { type: Number, default: 60 },
    isPaid: { type: Boolean, default: false },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'TiffinPayment' },
    reason: { type: String, default: '' },
    status: { type: String, enum: ['Cancelled'], default: 'Cancelled' },
  },
  { timestamps: true }
);

mealCancellationSchema.index({ userId: 1, date: 1, mealType: 1 }, { unique: true });

export default mongoose.model('MealCancellation', mealCancellationSchema);
