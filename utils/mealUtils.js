export const TIFFIN_CHARGE = 60;

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'morning', 'night'];

export const MEAL_TO_SLOT = {
  breakfast: 'breakfast',
  morning: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  night: 'dinner',
};

export const getMealsForPlan = (planType) => {
  if (planType === 'Morning') return ['breakfast', 'morning'];
  if (planType === 'Night') return ['dinner', 'night'];
  return ['breakfast', 'lunch', 'dinner', 'morning', 'night'];
};

export const getDeliveryMealsForPlan = (planType) => {
  if (planType === 'Morning') return ['breakfast'];
  if (planType === 'Night') return ['dinner'];
  return ['breakfast', 'lunch', 'dinner'];
};

export const parseTime = (timeStr) => {
  const parts = (timeStr || '08:00').split(':');
  return { hour: Number(parts[0]) || 0, minute: Number(parts[1]) || 0 };
};

export const normalizeTime = (timeStr) => {
  const { hour, minute } = parseTime(timeStr);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const getDeliveryDateTime = (date, timeStr) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const { hour, minute } = parseTime(timeStr);
  d.setHours(hour, minute, 0, 0);
  return d;
};

export const canCancelBeforeDeadline = (mealDate, deliveryTimeStr, hoursBefore = 3) => {
  const deliveryAt = getDeliveryDateTime(mealDate, deliveryTimeStr);
  const deadline = new Date(deliveryAt.getTime() - hoursBefore * 60 * 60 * 1000);
  return new Date() < deadline;
};

export const getDateRange = (startDate, days) => {
  const dates = [];
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
};

export const startOfDay = (d = new Date()) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};
