import DeliverySchedule from '../models/DeliverySchedule.js';
import MealCancellation from '../models/MealCancellation.js';
import MealDeliveryStatus from '../models/MealDeliveryStatus.js';
import TiffinRequest from '../models/TiffinRequest.js';
import TiffinPayment from '../models/TiffinPayment.js';
import {
  TIFFIN_CHARGE,
  MEAL_TO_SLOT,
  getMealsForPlan,
  getDeliveryMealsForPlan,
  canCancelBeforeDeadline,
  getDateRange,
  startOfDay,
  normalizeTime,
} from '../utils/mealUtils.js';

const getScheduleDoc = async () => {
  let schedule = await DeliverySchedule.findOne();
  if (!schedule) {
    schedule = await DeliverySchedule.create({});
  }
  return schedule;
};

const getDeliveryTimeForMeal = (schedule, mealType) => {
  const slot = MEAL_TO_SLOT[mealType];
  return schedule[slot];
};

export const getDeliverySchedule = async (req, res) => {
  const schedule = await getScheduleDoc();
  res.json({ success: true, data: schedule });
};

export const updateDeliverySchedule = async (req, res) => {
  const schedule = await getScheduleDoc();
  if (req.body.breakfast) schedule.breakfast = normalizeTime(req.body.breakfast);
  if (req.body.lunch) schedule.lunch = normalizeTime(req.body.lunch);
  if (req.body.dinner) schedule.dinner = normalizeTime(req.body.dinner);
  await schedule.save();
  res.json({ success: true, data: schedule });
};

const getActivePlan = async (userId) =>
  TiffinRequest.findOne({ userId, isActive: true, status: 'Accepted' });

const validateMealForPlan = (plan, mealType) => {
  const allowed = getMealsForPlan(plan.planType);
  return allowed.includes(mealType);
};

const createMealCancellation = async (userId, plan, date, mealType, period, reason, schedule) => {
  const day = startOfDay(date);
  if (day < startOfDay()) {
    throw new Error('Cannot cancel past dates');
  }
  if (!validateMealForPlan(plan, mealType)) {
    throw new Error(`${mealType} is not included in your ${plan.planType} plan`);
  }
  const deliveryTime = getDeliveryTimeForMeal(schedule, mealType);
  if (!canCancelBeforeDeadline(day, deliveryTime, 3)) {
    throw new Error(
      `Cannot cancel ${mealType} — must be at least 3 hours before delivery (${deliveryTime})`
    );
  }
  const exists = await MealCancellation.findOne({ userId, date: day, mealType });
  if (exists) {
    throw new Error(`Already cancelled ${mealType} on ${day.toLocaleDateString()}`);
  }
  return MealCancellation.create({
    userId,
    tiffinRequestId: plan._id,
    date: day,
    mealType,
    period,
    chargeAmount: TIFFIN_CHARGE,
    reason,
  });
};

export const cancelMeal = async (req, res) => {
  const plan = await getActivePlan(req.user._id);
  if (!plan) {
    return res.status(400).json({ success: false, message: 'No active tiffin plan' });
  }
  const schedule = await getScheduleDoc();
  const { date, mealType, reason } = req.body;
  if (!date || !mealType) {
    return res.status(400).json({ success: false, message: 'Date and meal type required' });
  }
  try {
    const cancellation = await createMealCancellation(
      req.user._id,
      plan,
      date,
      mealType,
      'single',
      reason,
      schedule
    );
    res.status(201).json({ success: true, data: cancellation, message: `₹${TIFFIN_CHARGE} added to due` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const cancelMealBulk = async (req, res) => {
  const plan = await getActivePlan(req.user._id);
  if (!plan) {
    return res.status(400).json({ success: false, message: 'No active tiffin plan' });
  }
  const schedule = await getScheduleDoc();
  const { startDate, period, mealTypes, reason } = req.body;
  const days = period === 'week2' ? 14 : 7;
  if (!startDate || !mealTypes?.length) {
    return res.status(400).json({ success: false, message: 'Start date and meal types required' });
  }
  const dates = getDateRange(startDate, days);
  const allowed = getMealsForPlan(plan.planType);
  const types = mealTypes.filter((t) => allowed.includes(t));
  const created = [];
  const errors = [];

  for (const date of dates) {
    for (const mealType of types) {
      try {
        const c = await createMealCancellation(
          req.user._id,
          plan,
          date,
          mealType,
          period === 'week2' ? 'week2' : 'week1',
          reason,
          schedule
        );
        created.push(c);
      } catch (e) {
        errors.push({ date, mealType, message: e.message });
      }
    }
  }

  res.status(201).json({
    success: true,
    data: { created, errors },
    message: `${created.length} meal(s) cancelled. ₹${created.length * TIFFIN_CHARGE} added to due`,
  });
};

export const getMyMealCancellations = async (req, res) => {
  const list = await MealCancellation.find({ userId: req.user._id }).sort({ date: -1 });
  res.json({ success: true, data: list });
};

export const getAllMealCancellations = async (req, res) => {
  const list = await MealCancellation.find()
    .populate('userId', 'name email phone')
    .sort({ date: -1 });
  res.json({ success: true, data: list });
};

const resolveMealStatus = async (userId, date, mealType) => {
  const day = startOfDay(date);
  const cancelled = await MealCancellation.findOne({
    userId,
    date: day,
    $or: [{ mealType }, { mealType: mealType === 'breakfast' ? 'morning' : mealType === 'dinner' ? 'night' : mealType }],
  });
  if (cancelled) return 'Cancelled';
  const delivery = await MealDeliveryStatus.findOne({ userId, date: day, mealType });
  if (delivery) return delivery.status;
  return 'Pending';
};

export const getMyTodayMealStatus = async (req, res) => {
  const plan = await getActivePlan(req.user._id);
  if (!plan) {
    return res.json({ success: true, data: { meals: [], planType: null } });
  }
  const today = startOfDay();
  const mealTypes = getDeliveryMealsForPlan(plan.planType);
  const schedule = await getScheduleDoc();
  const meals = await Promise.all(
    mealTypes.map(async (mealType) => ({
      mealType,
      deliveryTime: getDeliveryTimeForMeal(schedule, mealType),
      status: await resolveMealStatus(req.user._id, today, mealType),
    }))
  );
  res.json({ success: true, data: { meals, planType: plan.planType, date: today } });
};

export const getAdminTodayDeliveries = async (req, res) => {
  const today = startOfDay();
  const plans = await TiffinRequest.find({ isActive: true, status: 'Accepted' }).populate('userId', 'name email phone');
  const schedule = await getScheduleDoc();
  const list = await Promise.all(
    plans.map(async (plan) => {
      const userId = plan.userId._id;
      const mealTypes = getDeliveryMealsForPlan(plan.planType);
      const meals = await Promise.all(
        mealTypes.map(async (mealType) => {
          const status = await resolveMealStatus(userId, today, mealType);
          const record = await MealDeliveryStatus.findOne({ userId, date: today, mealType });
          return {
            mealType,
            status,
            deliveryTime: getDeliveryTimeForMeal(schedule, mealType),
            recordId: record?._id,
          };
        })
      );
      return {
        userId,
        customer: plan.userId,
        planType: plan.planType,
        meals,
      };
    })
  );
  res.json({ success: true, data: list, date: today });
};

export const updateMealDeliveryStatus = async (req, res) => {
  const { userId, mealType, date, status } = req.body;
  if (!['Pending', 'Delivered', 'Cancelled'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  const day = startOfDay(date || new Date());
  const mealTypes = ['breakfast', 'lunch', 'dinner'];
  if (!mealTypes.includes(mealType)) {
    return res.status(400).json({ success: false, message: 'Invalid meal type' });
  }
  let record = await MealDeliveryStatus.findOne({ userId, date: day, mealType });
  if (!record) {
    record = new MealDeliveryStatus({ userId, date: day, mealType, status });
  } else {
    record.status = status;
  }
  if (status === 'Delivered') record.deliveredAt = new Date();
  record.updatedBy = req.user._id;
  await record.save();
  res.json({ success: true, data: record });
};

export const buildSummary = async (userId) => {
  const cancellations = await MealCancellation.find({ userId });
  const unpaid = cancellations.filter((c) => !c.isPaid);
  const pendingPayments = await TiffinPayment.find({ userId, status: 'Pending' });
  const pendingPaymentAmount = pendingPayments.reduce((s, p) => s + p.amount, 0);
  const breakdown = { breakfast: 0, lunch: 0, dinner: 0, morning: 0, night: 0, total: 0 };

  cancellations.forEach((c) => {
    if (breakdown[c.mealType] !== undefined) breakdown[c.mealType]++;
    breakdown.total++;
  });

  const unpaidBreakdown = { breakfast: 0, lunch: 0, dinner: 0, morning: 0, night: 0, total: 0 };
  unpaid.forEach((c) => {
    if (unpaidBreakdown[c.mealType] !== undefined) unpaidBreakdown[c.mealType]++;
    unpaidBreakdown.total++;
  });

  const totalDue = unpaid.reduce((sum, c) => sum + c.chargeAmount, 0);
  const schedule = await getScheduleDoc();
  const plan = await getActivePlan(userId);

  return {
    breakdown,
    unpaidBreakdown,
    totalDue,
    chargePerTiffin: TIFFIN_CHARGE,
    totalCancellations: cancellations.length,
    unpaidCount: unpaid.length,
    pendingPayments: pendingPayments.length,
    pendingPaymentAmount,
    deliverySchedule: schedule,
    planType: plan?.planType || null,
    allowedMeals: plan ? getMealsForPlan(plan.planType) : [],
  };
};

export const getMySummary = async (req, res) => {
  const summary = await buildSummary(req.user._id);
  res.json({ success: true, data: summary });
};

export const getUserSummary = async (req, res) => {
  const summary = await buildSummary(req.params.userId);
  res.json({ success: true, data: summary });
};
