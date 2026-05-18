import mongoose from 'mongoose';

const deliveryScheduleSchema = new mongoose.Schema(
  {
    breakfast: { type: String, default: '08:00' },
    lunch: { type: String, default: '13:00' },
    dinner: { type: String, default: '20:00' },
  },
  { timestamps: true }
);

export default mongoose.model('DeliverySchedule', deliveryScheduleSchema);
