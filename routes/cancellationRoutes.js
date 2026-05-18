import express from 'express';
import {
  createCancellation,
  getMyCancellations,
  getAllCancellations,
  updateCancellation,
} from '../controllers/cancellationController.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), asyncHandler(createCancellation));
router.get('/my', protect, authorize('customer'), asyncHandler(getMyCancellations));
router.get('/', protect, authorize('admin'), asyncHandler(getAllCancellations));
router.put('/:id', protect, authorize('admin'), asyncHandler(updateCancellation));

export default router;
