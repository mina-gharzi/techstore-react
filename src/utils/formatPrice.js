// ======================================================
// formatPrice.js
// تبدیل عدد به قیمت قابل نمایش فارسی
// ======================================================

/**
 * قیمت را به فرمت فارسی با جداکننده هزارگان تبدیل می‌کند
 * قبلاً فقط typeof "number" قبول می‌شد؛ اگه یه روز از یک API
 * قیمت به‌صورت رشته ("79900000") بیاد، همیشه "۰ تومان" نشون
 * داده می‌شد. حالا با Number() هر دو حالت پشتیبانی می‌شه.
 * @param {number|string} price - قیمت
 * @returns {string} قیمت فرمت‌شده
 */
export function formatPrice(price) {
  const num = Number(price);

  if (Number.isNaN(num)) {
    return "۰ تومان";
  }

  return `${new Intl.NumberFormat("fa-IR").format(num)} تومان`;
}