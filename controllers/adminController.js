import User from '../models/User.js';
import TiffinRequest from '../models/TiffinRequest.js';
import GroceryOrder from '../models/GroceryOrder.js';
import Complaint from '../models/Complaint.js';
import CancellationRequest from '../models/CancellationRequest.js';

export const getDashboardStats = async (req, res) => {
  const [
    totalCustomers,
    activePlans,
    pendingRequests,
    groceryOrders,
    openComplaints,
    pendingCancellations,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    TiffinRequest.countDocuments({ isActive: true, status: 'Accepted' }),
    TiffinRequest.countDocuments({ status: 'Pending' }),
    GroceryOrder.countDocuments(),
    Complaint.countDocuments({ status: { $ne: 'Resolved' } }),
    CancellationRequest.countDocuments({ status: 'Pending' }),
  ]);

  const revenueResult = await GroceryOrder.aggregate([
    { $match: { deliveryStatus: { $ne: 'Cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
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
  const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: customers });
};

export const toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role === 'admin') {
    return res.status(400).json({ success: false, message: 'Invalid user' });
  }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ success: true, data: { _id: user._id, isBlocked: user.isBlocked } });
};
