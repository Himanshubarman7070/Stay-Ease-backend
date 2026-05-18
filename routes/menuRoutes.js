import express from 'express';
import { getMenus, createMenu, updateMenu, deleteMenu } from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(getMenus));
router.post('/', protect, authorize('admin'), asyncHandler(createMenu));
router.put('/:id', protect, authorize('admin'), asyncHandler(updateMenu));
router.delete('/:id', protect, authorize('admin'), asyncHandler(deleteMenu));

export default router;
