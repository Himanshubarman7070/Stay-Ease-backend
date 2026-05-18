import express from 'express';
import {
  createRequest,
  getMyRequests,
  getMyActivePlan,
  getAllRequests,
  updateRequestStatus,
  activatePlan,
} from '../controllers/tiffinController.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), asyncHandler(createRequest));
router.get('/my', protect, authorize('customer'), asyncHandler(getMyRequests));
router.get('/active', protect, authorize('customer'), asyncHandler(getMyActivePlan));
router.get('/all', protect, authorize('admin'), asyncHandler(getAllRequests));
router.put('/:id/status', protect, authorize('admin'), asyncHandler(updateRequestStatus));
router.put('/:id/activate', protect, authorize('admin'), asyncHandler(activatePlan));

export default router;
