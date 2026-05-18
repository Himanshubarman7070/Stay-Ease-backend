import mongoose from 'mongoose';

const tiffinPaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    chargePerTiffin: { type: Number, default: 60 },
    tiffinCount: { type: Number, default: 0 },
    breakdown: {
      breakfast: { type: Number, default: 0 },
      lunch: { type: Number, default: 0 },
      dinner: { type: Number, default: 0 },
      morning: { type: Number, default: 0 },
      night: { type: Number, default: 0 },
    },
    paymentDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Rejected'], default: 'Pending' },
    notes: { type: String, default: '' },
    adminNote: { type: String, default: '' },
    cancellationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealCancellation' }],
  },
  { timestamps: true }
);

export default mongoose.model('TiffinPayment', tiffinPaymentSchema);
