import GroceryProduct from '../models/GroceryProduct.js';
import GroceryOrder from '../models/GroceryOrder.js';

export const getProducts = async (req, res) => {
  const products = await GroceryProduct.find({ stock: { $gt: 0 } }).sort({ name: 1 });
  res.json({ success: true, data: products });
};

export const getAllProducts = async (req, res) => {
  const products = await GroceryProduct.find().sort({ name: 1 });
  res.json({ success: true, data: products });
};

export const createProduct = async (req, res) => {
  const product = await GroceryProduct.create(req.body);
  res.status(201).json({ success: true, data: product });
};

export const updateProduct = async (req, res) => {
  const product = await GroceryProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
};

export const deleteProduct = async (req, res) => {
  await GroceryProduct.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Product deleted' });
};

export const placeOrder = async (req, res) => {
  const { products, deliveryAddress } = req.body;
  if (!products?.length) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }
  let totalAmount = 0;
  const orderItems = [];
  for (const item of products) {
    const product = await GroceryProduct.findById(item.productId);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name || 'product'}` });
    }
    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
    totalAmount += product.price * item.quantity;
    product.stock -= item.quantity;
    await product.save();
  }
  const order = await GroceryOrder.create({
    userId: req.user._id,
    products: orderItems,
    totalAmount,
    deliveryAddress: deliveryAddress || req.user.address,
    deliveryStatus: 'Pending',
  });
  res.status(201).json({ success: true, data: order });
};

export const getMyOrders = async (req, res) => {
  const orders = await GroceryOrder.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
};

export const getAllOrders = async (req, res) => {
  const orders = await GroceryOrder.find()
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
};

export const updateOrderStatus = async (req, res) => {
  const order = await GroceryOrder.findByIdAndUpdate(
    req.params.id,
    { deliveryStatus: req.body.deliveryStatus },
    { new: true }
  );
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
};
