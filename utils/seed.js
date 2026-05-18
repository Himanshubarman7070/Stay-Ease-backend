import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Food from '../models/Food.js';
import Menu from '../models/Menu.js';
import GroceryProduct from '../models/GroceryProduct.js';
import TiffinRequest from '../models/TiffinRequest.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected for seeding...');

  await User.deleteMany({});
  await Food.deleteMany({});
  await Menu.deleteMany({});
  await GroceryProduct.deleteMany({});
  await TiffinRequest.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@stayease.com',
    password: 'admin123',
    role: 'admin',
    phone: '9876543210',
    address: 'StayEase HQ, Main Street',
  });

  const customer = await User.create({
    name: 'Rahul Sharma',
    email: 'customer@stayease.com',
    password: 'customer123',
    role: 'customer',
    phone: '9123456789',
    address: '42 Green Park, Delhi',
    addresses: [
      { label: 'Home', address: '42 Green Park, Delhi' },
      { label: 'Office', address: 'Tech Park, Noida' },
    ],
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await Food.insertMany([
    {
      title: 'Masala Dosa',
      category: 'breakfast',
      description: 'Crispy dosa with coconut chutney and sambar',
      image: 'https://images.unsplash.com/photo-1630384060420-c20d5c802e3f?w=400',
      price: 60,
      date: today,
    },
    {
      title: 'Paneer Thali',
      category: 'lunch',
      description: 'Paneer curry, dal, rice, roti, salad',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      price: 120,
      date: today,
    },
    {
      title: 'Veg Biryani',
      category: 'dinner',
      description: 'Aromatic basmati rice with mixed vegetables',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400',
      price: 100,
      date: today,
    },
  ]);

  await Menu.insertMany([
    { name: 'Chole Bhature', description: 'North Indian classic', category: 'lunch', price: 80, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400' },
    { name: 'Poha', description: 'Light breakfast', category: 'breakfast', price: 40, image: 'https://images.unsplash.com/photo-1606491956689-2ea866e0d6b8?w=400' },
    { name: 'Dal Makhani', description: 'Creamy lentils', category: 'dinner', price: 90, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
  ]);

  await GroceryProduct.insertMany([
    { name: 'Fresh Milk 1L', price: 55, stock: 50, category: 'Dairy', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
    { name: 'Whole Wheat Bread', price: 40, stock: 30, category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
    { name: 'Basmati Rice 5kg', price: 450, stock: 20, category: 'Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { name: 'Fresh Tomatoes 1kg', price: 35, stock: 40, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400' },
    { name: 'Organic Eggs (12)', price: 90, stock: 25, category: 'Dairy', image: 'https://images.unsplash.com/photo-1582722874045-44a05badb2f7?w=400' },
    { name: 'Olive Oil 500ml', price: 320, stock: 15, category: 'Oils', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
  ]);

  console.log('Seed completed!');
  console.log('Admin: admin@stayease.com / admin123');
  console.log('Customer: customer@stayease.com / customer123');
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
