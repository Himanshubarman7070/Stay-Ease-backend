import Complaint from '../models/Complaint.js';

export const createComplaint = async (req, res) => {
  const complaint = await Complaint.create({
    userId: req.user._id,
    type: req.body.type || 'complaint',
    subject: req.body.subject,
    message: req.body.message,
  });
  res.status(201).json({ success: true, data: complaint });
};

export const getMyComplaints = async (req, res) => {
  const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: complaints });
};

export const getAllComplaints = async (req, res) => {
  const complaints = await Complaint.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: complaints });
};

export const updateComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });
  if (req.body.adminReply) complaint.adminReply = req.body.adminReply;
  if (req.body.status) complaint.status = req.body.status;
  await complaint.save();
  res.json({ success: true, data: complaint });
};
