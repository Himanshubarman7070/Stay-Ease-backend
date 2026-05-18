import express from "express";
import {
  getDashboardStats,
  getCustomers,
  toggleBlockUser,
  getCustomerHistory,
  deactivateCustomerPlan,
  activateCustomerPlan,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", asyncHandler(getDashboardStats));
router.get("/customers", asyncHandler(getCustomers));
router.put("/customers/:id/block", asyncHandler(toggleBlockUser));
router.get("/customers/:id/history", asyncHandler(getCustomerHistory));
router.put(
  "/customers/:id/deactivate-plan",
  asyncHandler(deactivateCustomerPlan),
);
router.put("/customers/:id/activate-plan", asyncHandler(activateCustomerPlan));

export default router;
