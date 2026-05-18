import express from 'express';
import {
  getTodayFood,
  getFoodByDate,
  getAllFood,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/foodController.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/today', asyncHandler(getTodayFood));
router.get('/date', asyncHandler(getFoodByDate));
router.get('/', protect, authorize('admin'), asyncHandler(getAllFood));
router.post('/', protect, authorize('admin'), asyncHandler(createFood));
router.put('/:id', protect, authorize('admin'), asyncHandler(updateFood));
router.delete('/:id', protect, authorize('admin'), asyncHandler(deleteFood));

export default router;
