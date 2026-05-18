import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected:', mongoose.connection.host);
  const admin = await User.findOne({ email: 'admin@stayease.com' });
  const count = await User.countDocuments();
  console.log('Total users:', count);
  console.log('Admin exists:', !!admin);
  if (admin) console.log('Admin role:', admin.role);
  process.exit(0);
} catch (e) {
  console.error('Error:', e.message);
  process.exit(1);
}
