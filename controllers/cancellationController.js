import CancellationRequest from '../models/CancellationRequest.js';
import TiffinRequest from '../models/TiffinRequest.js';

export const createCancellation = async (req, res) => {
  const plan = await TiffinRequest.findOne({
    userId: req.user._id,
    isActive: true,
    status: 'Accepted',
  });
  if (!plan) {
    return res.status(400).json({ success: false, message: 'No active tiffin plan' });
  }
  const cancellation = await CancellationRequest.create({
    userId: req.user._id,
    tiffinRequestId: plan._id,
    dates: req.body.dates,
    reason: req.body.reason,
  });
  res.status(201).json({ success: true, data: cancellation });
};

export const getMyCancellations = async (req, res) => {
  const list = await CancellationRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: list });
};

export const getAllCancellations = async (req, res) => {
  const list = await CancellationRequest.find()
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: list });
};

export const updateCancellation = async (req, res) => {
  const item = await CancellationRequest.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Not found' });
  item.status = req.body.status;
  if (req.body.adminNote) item.adminNote = req.body.adminNote;
  await item.save();
  res.json({ success: true, data: item });
};
