import dotenv from 'dotenv';
import dns from 'dns';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);

const ADMIN_EMAIL = 'admin@stayease.com';
const ADMIN_PASSWORD = 'admin123';

try {
  await mongoose.connect(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
  });
  console.log('MongoDB connected');

  let admin = await User.findOne({ email: ADMIN_EMAIL });
  if (admin) {
    admin.password = ADMIN_PASSWORD;
    admin.role = 'admin';
    admin.isBlocked = false;
    await admin.save();
    console.log('Admin password reset successfully');
  } else {
    admin = await User.create({
      name: 'Admin User',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      phone: '9876543210',
      address: 'StayEase HQ',
    });
    console.log('Admin user created successfully');
  }

  console.log('\nLogin with:');
  console.log('  Email:   ', ADMIN_EMAIL);
  console.log('  Password:', ADMIN_PASSWORD);
  process.exit(0);
} catch (e) {
  console.error('\nFailed:', e.message);
  console.error('\nFix MongoDB first:');
  console.error('  1. Atlas → Network Access → Add your IP (or 0.0.0.0/0 for dev)');
  console.error('  2. Verify password in backend/.env MONGODB_URI');
  console.error('  3. Or use local MongoDB: MONGODB_URI=mongodb://127.0.0.1:27017/stayease');
  process.exit(1);
}
