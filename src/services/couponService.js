// ======================================================
// couponService
// سرویس مدیریت کدهای تخفیف - جدا از کامپوننت‌ها
//
// در یک پروژه واقعی این اطلاعات باید سمت سرور باشه
// و اعتبارسنجی از طریق API انجام بشه. فعلاً فقط
// برای دمو در فرانت‌اند ذخیره شده.
// ======================================================

const COUPONS = {
  WELCOME10: { type: "percent", value: 10, description: "۱۰٪ تخفیف" },
  TECH50: { type: "fixed", value: 5000000, description: "۵,۰۰۰,۰۰۰ تومان تخفیف" },
};

/**
 * اعتبارسنجی و اعمال کد تخفیف
 * @param {string} code - کد تخفیف وارد شده توسط کاربر
 * @returns {{ success: boolean, coupon?: object, error?: string }}
 */
export function applyCoupon(code) {
  const normalized = code.trim().toUpperCase();

  if (!normalized) {
    return { success: false, error: "کد تخفیف را وارد کنید" };
  }

  const coupon = COUPONS[normalized];
  if (!coupon) {
    return { success: false, error: "کد تخفیف معتبر نیست" };
  }

  return { success: true, coupon: { code: normalized, ...coupon } };
}

/**
 * محاسبه مبلغ تخفیف بر اساس کد اعمال شده
 * @param {object|null} coupon - آبجکت کد تخفیف اعمال شده
 * @param {number} totalPrice - مبلغ کل سبد خرید
 * @returns {number} مبلغ تخفیف
 */
export function calculateDiscount(coupon, totalPrice) {
  if (!coupon) return 0;

  if (coupon.type === "percent") {
    return Math.round((totalPrice * coupon.value) / 100);
  }

  // تخفیف ثابت - نباید از مبلغ کل بیشتر بشه
  return Math.min(coupon.value, totalPrice);
}
