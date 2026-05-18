import express from 'express';
import { getDashboardStats, getCustomers, toggleBlockUser } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', asyncHandler(getDashboardStats));
router.get('/customers', asyncHandler(getCustomers));
router.put('/customers/:id/block', asyncHandler(toggleBlockUser));

export default router;
