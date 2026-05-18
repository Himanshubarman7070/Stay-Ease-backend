import express from 'express';
import {
  getProducts,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/groceryController.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/products', asyncHandler(getProducts));
router.get('/products/all', protect, authorize('admin'), asyncHandler(getAllProducts));
router.post('/products', protect, authorize('admin'), asyncHandler(createProduct));
router.put('/products/:id', protect, authorize('admin'), asyncHandler(updateProduct));
router.delete('/products/:id', protect, authorize('admin'), asyncHandler(deleteProduct));
router.post('/orders', protect, authorize('customer'), asyncHandler(placeOrder));
router.get('/orders/my', protect, authorize('customer'), asyncHandler(getMyOrders));
router.get('/orders', protect, authorize('admin'), asyncHandler(getAllOrders));
router.put('/orders/:id/status', protect, authorize('admin'), asyncHandler(updateOrderStatus));

export default router;
