import User from "../models/User.js";
import TiffinRequest from "../models/TiffinRequest.js";
import GroceryOrder from "../models/GroceryOrder.js";
import Complaint from "../models/Complaint.js";
import CancellationRequest from "../models/CancellationRequest.js";
import MealCancellation from "../models/MealCancellation.js";

export const getDashboardStats = async (req, res) => {
  const [
    totalCustomers,
    activePlans,
    pendingRequests,
    groceryOrders,
    openComplaints,
    pendingCancellations,
  ] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    TiffinRequest.countDocuments({ isActive: true, status: "Accepted" }),
    TiffinRequest.countDocuments({ status: "Pending" }),
    GroceryOrder.countDocuments(),
    Complaint.countDocuments({ status: { $ne: "Resolved" } }),
    CancellationRequest.countDocuments({ status: "Pending" }),
  ]);

  const revenueResult = await GroceryOrder.aggregate([
    { $match: { deliveryStatus: { $ne: "Cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  const revenue = revenueResult[0]?.total || 0;

  res.json({
    success: true,
    data: {
      totalCustomers,
      activePlans,
      pendingRequests,
      groceryOrders,
      openComplaints,
      pendingCancellations,
      revenue,
    },
  });
};

export const getCustomers = async (req, res) => {
  const customers = await User.find({ role: "customer" })
    .select("-password")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: customers });
};

export const toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role === "admin") {
    return res.status(400).json({ success: false, message: "Invalid user" });
  }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({
    success: true,
    data: { _id: user._id, isBlocked: user.isBlocked },
  });
};

export const getCustomerHistory = async (req, res) => {
  const { id } = req.params;

  const [user, mealCancellations, groceryOrders, plan] = await Promise.all([
    User.findById(id).select("-password"),
    MealCancellation.find({ userId: id }).sort({ date: -1, createdAt: -1 }),
    GroceryOrder.find({ userId: id }).sort({ createdAt: -1 }),
    TiffinRequest.findOne({ userId: id, status: "Accepted" }).sort({
      createdAt: -1,
    }),
  ]);

  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "Customer not found" });

  const totalTiffinDue = mealCancellations
    .filter((c) => !c.isPaid)
    .reduce((sum, c) => sum + c.chargeAmount, 0);

  const totalGrocerySpent = groceryOrders
    .filter((o) => o.deliveryStatus === "Delivered")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingGroceryAmount = groceryOrders
    .filter((o) => !["Delivered", "Cancelled"].includes(o.deliveryStatus))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const groceryDue = groceryOrders
    .filter((o) => o.deliveryStatus === "Delivered" && !o.isPaid)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  res.json({
    success: true,
    data: {
      customer: user,
      plan: plan || null,
      mealCancellations,
      groceryOrders,
      totalTiffinDue,
      totalGrocerySpent,
      pendingGroceryAmount,
      groceryDue,
    },
  });
};

export const deactivateCustomerPlan = async (req, res) => {
  const plan = await TiffinRequest.findOne({
    userId: req.params.id,
    isActive: true,
  });
  if (!plan) {
    return res
      .status(404)
      .json({
        success: false,
        message: "No active plan found for this customer",
      });
  }
  plan.isActive = false;
  await plan.save();
  res.json({ success: true, data: plan, message: "Plan deactivated" });
};

export const activateCustomerPlan = async (req, res) => {
  const plan = await TiffinRequest.findOne({
    userId: req.params.id,
    status: "Accepted",
    isActive: false,
  });
  if (!plan) {
    return res
      .status(404)
      .json({ success: false, message: "No accepted inactive plan found" });
  }
  plan.isActive = true;
  if (!plan.startDate) plan.startDate = new Date();
  const days = plan.duration === "Weekly" ? 7 : 30;
  if (!plan.endDate)
    plan.endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await plan.save();
  res.json({ success: true, data: plan, message: "Plan activated" });
};
