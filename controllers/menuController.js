import Menu from '../models/Menu.js';

export const getMenus = async (req, res) => {
  const menus = await Menu.find().sort({ createdAt: -1 });
  res.json({ success: true, data: menus });
};

export const createMenu = async (req, res) => {
  const menu = await Menu.create(req.body);
  res.status(201).json({ success: true, data: menu });
};

export const updateMenu = async (req, res) => {
  const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!menu) return res.status(404).json({ success: false, message: 'Menu not found' });
  res.json({ success: true, data: menu });
};

export const deleteMenu = async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Menu deleted' });
};
