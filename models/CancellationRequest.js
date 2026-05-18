import mongoose from 'mongoose';

const cancellationRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tiffinRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'TiffinRequest' },
    dates: [{ type: Date, required: true }],
    reason: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('CancellationRequest', cancellationRequestSchema);
