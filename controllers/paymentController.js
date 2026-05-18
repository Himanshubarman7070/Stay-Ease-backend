import MealCancellation from '../models/MealCancellation.js';
import TiffinPayment from '../models/TiffinPayment.js';
import { TIFFIN_CHARGE } from '../utils/mealUtils.js';

const buildBreakdown = (cancellations) => {
  const breakdown = { breakfast: 0, lunch: 0, dinner: 0, morning: 0, night: 0 };
  cancellations.forEach((c) => {
    if (breakdown[c.mealType] !== undefined) breakdown[c.mealType]++;
  });
  return breakdown;
};

export const submitPayment = async (req, res) => {
  const { paymentDate, notes } = req.body;
  const pendingPayment = await TiffinPayment.findOne({ userId: req.user._id, status: 'Pending' });
  if (pendingPayment) {
    return res.status(400).json({ success: false, message: 'You already have a pending payment awaiting admin approval' });
  }
  const unpaid = await MealCancellation.find({ userId: req.user._id, isPaid: false });
  if (!unpaid.length) {
    return res.status(400).json({ success: false, message: 'No pending charges' });
  }
  const breakdown = buildBreakdown(unpaid);
  const amount = unpaid.length * TIFFIN_CHARGE;
  const payment = await TiffinPayment.create({
    userId: req.user._id,
    amount,
    chargePerTiffin: TIFFIN_CHARGE,
    tiffinCount: unpaid.length,
    breakdown,
    paymentDate: paymentDate || new Date(),
    status: 'Pending',
    notes: notes || '',
    cancellationIds: unpaid.map((c) => c._id),
  });
  res.status(201).json({ success: true, data: payment });
};

export const getMyPayments = async (req, res) => {
  const payments = await TiffinPayment.find({ userId: req.user._id }).sort({ createdAt: -1 });
  const unpaid = await MealCancellation.find({ userId: req.user._id, isPaid: false });
  const totalDue = unpaid.reduce((s, c) => s + c.chargeAmount, 0);
  const pendingPayments = payments.filter((p) => p.status === 'Pending');
  const pendingAmount = pendingPayments.reduce((s, p) => s + p.amount, 0);
  res.json({
    success: true,
    data: payments,
    meta: {
      totalDue,
      unpaidCount: unpaid.length,
      pendingPaymentCount: pendingPayments.length,
      pendingPaymentAmount: pendingAmount,
    },
  });
};

export const getAllPayments = async (req, res) => {
  const payments = await TiffinPayment.find()
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: payments });
};

export const updatePaymentStatus = async (req, res) => {
  const payment = await TiffinPayment.findById(req.params.id);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

  const { status, adminNote } = req.body;
  if (!['Pending', 'Completed', 'Rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const prevStatus = payment.status;
  payment.status = status;
  if (adminNote) payment.adminNote = adminNote;

  if (status === 'Completed' && prevStatus !== 'Completed') {
    await MealCancellation.updateMany(
      { _id: { $in: payment.cancellationIds } },
      { isPaid: true, paymentId: payment._id }
    );
  }

  if (status === 'Rejected' && prevStatus === 'Pending') {
    payment.cancellationIds = [];
  }

  await payment.save();
  res.json({ success: true, data: payment });
};

export const getPaymentStats = async (req, res) => {
  const pending = await TiffinPayment.countDocuments({ status: 'Pending' });
  const completed = await TiffinPayment.aggregate([
    { $match: { status: 'Completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const allUnpaid = await MealCancellation.find({ isPaid: false });
  const totalDueAll = allUnpaid.reduce((s, c) => s + c.chargeAmount, 0);

  res.json({
    success: true,
    data: {
      pendingPayments: pending,
      collectedRevenue: completed[0]?.total || 0,
      totalDueAllCustomers: totalDueAll,
      unpaidTiffins: allUnpaid.length,
    },
  });
};
