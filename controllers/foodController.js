import Food from '../models/Food.js';

const startOfDay = (d = new Date()) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (d = new Date()) => {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const getTodayFood = async (req, res) => {
  const today = startOfDay();
  const foods = await Food.find({
    date: { $gte: today, $lte: endOfDay() },
  }).sort({ category: 1 });
  res.json({ success: true, data: foods });
};

export const getFoodByDate = async (req, res) => {
  const date = startOfDay(new Date(req.query.date || Date.now()));
  const foods = await Food.find({
    date: { $gte: date, $lte: endOfDay(date) },
  });
  res.json({ success: true, data: foods });
};

export const getAllFood = async (req, res) => {
  const foods = await Food.find().sort({ date: -1 }).limit(50);
  res.json({ success: true, data: foods });
};

export const createFood = async (req, res) => {
  const food = await Food.create(req.body);
  res.status(201).json({ success: true, data: food });
};

export const updateFood = async (req, res) => {
  const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
  res.json({ success: true, data: food });
};

export const deleteFood = async (req, res) => {
  const food = await Food.findByIdAndDelete(req.params.id);
  if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
  res.json({ success: true, message: 'Food deleted' });
};
