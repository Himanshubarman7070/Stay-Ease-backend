import express from 'express';
import {
  getDeliverySchedule,
  updateDeliverySchedule,
  cancelMeal,
  cancelMealBulk,
  getMyMealCancellations,
  getAllMealCancellations,
  getMySummary,
  getUserSummary,
  getMyTodayMealStatus,
  getAdminTodayDeliveries,
  updateMealDeliveryStatus,
} from '../controllers/mealController.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/schedule', asyncHandler(getDeliverySchedule));
router.put('/schedule', protect, authorize('admin'), asyncHandler(updateDeliverySchedule));

router.get('/summary', protect, authorize('customer'), asyncHandler(getMySummary));
router.get('/summary/:userId', protect, authorize('admin'), asyncHandler(getUserSummary));

router.post('/cancel', protect, authorize('customer'), asyncHandler(cancelMeal));
router.post('/cancel-bulk', protect, authorize('customer'), asyncHandler(cancelMealBulk));
router.get('/cancellations/my', protect, authorize('customer'), asyncHandler(getMyMealCancellations));
router.get('/cancellations', protect, authorize('admin'), asyncHandler(getAllMealCancellations));

router.get('/today-status', protect, authorize('customer'), asyncHandler(getMyTodayMealStatus));
router.get('/today-deliveries', protect, authorize('admin'), asyncHandler(getAdminTodayDeliveries));
router.put('/delivery-status', protect, authorize('admin'), asyncHandler(updateMealDeliveryStatus));

export default router;
