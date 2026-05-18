import express from 'express';
import {
  submitPayment,
  getMyPayments,
  getAllPayments,
  updatePaymentStatus,
  getPaymentStats,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), asyncHandler(getPaymentStats));
router.post('/submit', protect, authorize('customer'), asyncHandler(submitPayment));
router.get('/my', protect, authorize('customer'), asyncHandler(getMyPayments));
router.get('/', protect, authorize('admin'), asyncHandler(getAllPayments));
router.put('/:id/status', protect, authorize('admin'), asyncHandler(updatePaymentStatus));

export default router;
