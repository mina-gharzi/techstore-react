// ======================================================
// models/types
// تعریف نوع/مدل داده‌ها با JSDoc
//
// چون پروژه از TypeScript استفاده نمی‌کنه، این تعریف‌ها
// فقط جهت مستندسازی و IDE autocomplete هستن.
// ======================================================

/**
 * @typedef {Object} CartItem
 * @property {number} id - شناسه محصول
 * @property {string} name - نام محصول
 * @property {string} brand - برند محصول
 * @property {string} category - دسته‌بندی
 * @property {number} price - قیمت فعلی (تومان)
 * @property {number|null} oldPrice - قیمت قبل تخفیف
 * @property {number} rating - امتیاز (0-5)
 * @property {boolean} isNew - آیا جدید است؟
 * @property {string} description - توضیحات
 * @property {string} image - آدرس تصویر
 * @property {Array<{name: string, value: string}>} colors - رنگ‌های موجود
 * @property {string} cartItemId - شناسه یکتای ردیف سبد (productId-selectedColor)
 * @property {number} productId - شناسه محصول اصلی
 * @property {string|null} selectedColor - رنگ انتخاب شده
 * @property {number} quantity - تعداد
 * @property {number} stock - موجودی فعلی (زنده از ProductsContext)
 */

/**
 * @typedef {Object} OrderItem
 * @property {number} id - شناسه محصول
 * @property {string} name - نام محصول (Snapshot لحظه ثبت سفارش)
 * @property {string} brand - برند
 * @property {number} price - قیمت (Snapshot لحظه ثبت سفارش)
 * @property {number|null} oldPrice - قیمت قبل تخفیف
 * @property {string} image - آدرس تصویر
 * @property {string|null} selectedColor - رنگ انتخاب شده
 * @property {number} quantity - تعداد خریداری شده
 */

/**
 * @typedef {Object} Order
 * @property {string} id - شناسه سفارش
 * @property {string} orderNumber - شماره پیگیری (مثلاً TS-12345678)
 * @property {string} userId - شناسه کاربر
 * @property {OrderItem[]} items - آیتم‌های سفارش
 * @property {number} subtotal - مبلغ کل قبل تخفیف
 * @property {string|null} couponCode - کد تخفیف استفاده شده
 * @property {number} discountAmount - مبلغ تخفیف
 * @property {number} totalPrice - مبلغ قابل پرداخت
 * @property {number} totalItems - تعداد کل کالاها
 * @property {string} paymentMethod - روش پرداخت ("online" | "cod")
 * @property {string} customerName - نام خریدار
 * @property {{ city: string, address: string, postalCode: string, phone: string }} shippingAddress - آدرس ارسال
 * @property {string} status - وضعیت سفارش
 * @property {string} createdAt - تاریخ ثبت (ISO string)
 */

/**
 * @typedef {Object} Product
 * @property {number} id - شناسه
 * @property {string} name - نام محصول
 * @property {string} brand - برند
 * @property {string} category - شناسه دسته‌بندی
 * @property {number} price - قیمت فعلی
 * @property {number|null} oldPrice - قیمت قبل تخفیف
 * @property {number} rating - امتیاز
 * @property {boolean} isNew - آیا جدید است؟
 * @property {boolean} isFeatured - آیا ویژه است؟
 * @property {string} description - توضیحات
 * @property {string} image - آدرس تصویر
 * @property {Array<{name: string, value: string}>} colors - رنگ‌ها
 * @property {number} stock - موجودی
 */

/**
 * @typedef {Object} Coupon
 * @property {string} code - کد تخفیف
 * @property {"percent"|"fixed"} type - نوع تخفیف
 * @property {number} value - مقدار تخفیف (درصد یا مبلغ ثابت)
 * @property {string} description - توضیح
 */

/**
 * @typedef {Object} Review
 * @property {string} id - شناسه نظر
 * @property {number} productId - شناسه محصول
 * @property {string} userId - شناسه کاربر
 * @property {string} userName - نام کاربر
 * @property {number} rating - امتیاز (1-5)
 * @property {string} comment - متن نظر
 * @property {string} createdAt - تاریخ ثبت
 */

/**
 * @typedef {Object} User
 * @property {string} id - شناسه
 * @property {string} fullName - نام کامل
 * @property {string} email - ایمیل
 * @property {string} phone - شماره موبایل
 * @property {"customer"|"admin"} role - نقش کاربر
 * @property {string} createdAt - تاریخ ثبت‌نام
 */

/**
 * @typedef {Object} Category
 * @property {string} id - شناسه (slug)
 * @property {string} name - نام نمایشی
 * @property {string} icon - نام آیکون
 */
