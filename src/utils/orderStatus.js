// ======================================================
// Order Status — single source of truth
//
// وضعیت‌های سفارش و قواعد transition در یک جا تعریف می‌شن
// تا هم Admin و هم User از منطق واحدی استفاده کنن.
// ======================================================

export const STATUS_PROCESSING = "در حال پردازش";
export const STATUS_SHIPPED = "ارسال شد";
export const STATUS_DELIVERED = "تحویل داده شد";
export const STATUS_CANCELLED = "لغو شده";

export const ORDER_STATUSES = [
  STATUS_PROCESSING,
  STATUS_SHIPPED,
  STATUS_DELIVERED,
  STATUS_CANCELLED,
];

// جدول مجاز: هر وضعیت فقط می‌تونه به وضعیت‌های لیست زیر تغییر کنه
// حالت‌های پایانی (Delivered, Cancelled) هیچ خروجی ندارن.
const VALID_TRANSITIONS = {
  [STATUS_PROCESSING]: [STATUS_SHIPPED, STATUS_DELIVERED, STATUS_CANCELLED],
  [STATUS_SHIPPED]:    [STATUS_DELIVERED, STATUS_CANCELLED],
  [STATUS_DELIVERED]:  [],
  [STATUS_CANCELLED]:  [],
};

export const getAllowedTransitions = (currentStatus) =>
  VALID_TRANSITIONS[currentStatus] ?? [];

export const canTransition = (from, to) =>
  getAllowedTransitions(from).includes(to);

export const isTerminal = (status) =>
  getAllowedTransitions(status).length === 0;
