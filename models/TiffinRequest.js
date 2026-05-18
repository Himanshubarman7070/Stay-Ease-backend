import mongoose from 'mongoose';

const tiffinRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planType: { type: String, enum: ['Morning', 'Night', 'Both'], required: true },
    duration: { type: String, enum: ['Weekly', 'Monthly'], required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    startDate: { type: Date },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    endDate: { type: Date },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('TiffinRequest', tiffinRequestSchema);
