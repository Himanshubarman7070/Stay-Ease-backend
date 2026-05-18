import TiffinRequest from '../models/TiffinRequest.js';

export const createRequest = async (req, res) => {
  const active = await TiffinRequest.findOne({
    userId: req.user._id,
    isActive: true,
    status: 'Accepted',
  });
  if (active) {
    return res.status(400).json({ success: false, message: 'You already have an active tiffin plan' });
  }
  const pending = await TiffinRequest.findOne({ userId: req.user._id, status: 'Pending' });
  if (pending) {
    return res.status(400).json({ success: false, message: 'You already have a pending request' });
  }
  const request = await TiffinRequest.create({
    userId: req.user._id,
    planType: req.body.planType,
    duration: req.body.duration,
    address: req.body.address,
    phone: req.body.phone,
    status: 'Pending',
    isActive: false,
  });
  res.status(201).json({ success: true, data: request });
};

export const getMyRequests = async (req, res) => {
  const requests = await TiffinRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: requests });
};

export const getMyActivePlan = async (req, res) => {
  const plan = await TiffinRequest.findOne({
    userId: req.user._id,
    status: 'Accepted',
    isActive: true,
  });
  res.json({ success: true, data: plan });
};

export const getAllRequests = async (req, res) => {
  const requests = await TiffinRequest.find()
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: requests });
};

export const updateRequestStatus = async (req, res) => {
  const request = await TiffinRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

  const { status, adminNote } = req.body;
  request.status = status;
  if (adminNote) request.adminNote = adminNote;

  if (status === 'Accepted') {
    request.isActive = false;
  } else if (status === 'Rejected') {
    request.isActive = false;
  }

  await request.save();
  res.json({ success: true, data: request });
};

export const activatePlan = async (req, res) => {
  const request = await TiffinRequest.findById(req.params.id);
  if (!request || request.status !== 'Accepted') {
    return res.status(400).json({ success: false, message: 'Only accepted requests can be activated' });
  }
  const start = new Date();
  request.isActive = true;
  request.startDate = start;
  const days = request.duration === 'Weekly' ? 7 : 30;
  request.endDate = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
  await TiffinRequest.updateMany(
    { userId: request.userId, _id: { $ne: request._id }, isActive: true },
    { isActive: false }
  );
  await request.save();
  res.json({ success: true, data: request });
};
