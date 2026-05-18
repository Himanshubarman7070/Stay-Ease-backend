import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaint,
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), asyncHandler(createComplaint));
router.get('/my', protect, authorize('customer'), asyncHandler(getMyComplaints));
router.get('/', protect, authorize('admin'), asyncHandler(getAllComplaints));
router.put('/:id', protect, authorize('admin'), asyncHandler(updateComplaint));

export default router;
