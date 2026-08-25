// ======================================================
// Admin Helpers
//
// توابع و ثابت‌های مخصوص پنل ادمین.
// قواعد وضعیت سفارش در utils/orderStatus.js تعریف شدن
// و از اونجا re-export می‌شن.
//
// استایل‌های فرم (input, label, error) حالا توی
// styles/components/forms.css تعریف شدن و با CSS classes
// استفاده می‌شن — دیگه نیازی به توابع inline style نیست.
// ======================================================

export { ORDER_STATUSES, STATUS_PROCESSING, STATUS_CANCELLED } from "../../utils/orderStatus";

import { STATUS_DELIVERED, STATUS_CANCELLED, STATUS_SHIPPED } from "../../utils/orderStatus";

export const statusColor = (status) => {
  if (status === STATUS_DELIVERED) return { bg: "var(--color-success-light)", text: "var(--color-success)" };
  if (status === STATUS_CANCELLED) return { bg: "var(--color-error-light)", text: "var(--color-error)" };
  if (status === STATUS_SHIPPED) return { bg: "var(--color-primary-light)", text: "var(--color-primary)" };
  return { bg: "var(--color-warning-light)", text: "var(--color-warning-dark)" };
};

export const formatOrderDate = (isoString) => {
  try {
    return new Date(isoString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

export const emptyForm = {
  name: "",
  brand: "",
  category: "",
  price: "",
  oldPrice: "",
  rating: "4.5",
  stock: "0",
  isNew: false,
  description: "",
  image: "",
};
