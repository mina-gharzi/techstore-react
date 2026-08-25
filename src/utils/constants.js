// ======================================================
// constants.js
// مقادیر ثابت پروژه
// ======================================================

export const APP_NAME = "TechStore";

// ---------- Timeouts ----------
export const TIMEOUT_LOGIN = 500;
export const TIMEOUT_REGISTER = 500;
export const TIMEOUT_PASSWORD_RESET = 600;
export const TIMEOUT_CHECKOUT = 900;
export const TIMEOUT_REVIEW_SAVED = 2000;
export const TIMEOUT_PROFILE_SAVED = 2500;
export const TIMEOUT_PASSWORD_SAVED = 3000;
export const TIMEOUT_CONTACT_SUBMIT = 3500;
export const TIMEOUT_ADDED_TO_CART = 1500;

// ---------- Stock ----------
export const DEFAULT_STOCK = 10;
export const LOW_STOCK_THRESHOLD = 5;

// نکته: ROUTES.PRODUCT_DETAILS قبلاً یک رشته‌ی ثابت "/products/:id" بود.
// این فرمت برای تعریف <Route path="..."> توی routes.jsx درسته، ولی وقتی
// بخوای واقعاً به یک محصول خاص لینک بدی (مثلاً <Link to={...}>) به‌کارت
// نمی‌اومد چون ":id" یک پارامتر واقعی نیست، نه مقدار محصول.
//
// الان به‌صورت تابع تعریفش کردیم تا هم برای Route (با رشته‌ی خام
// "/products/:id") و هم برای Link (با PRODUCT_DETAILS(product.id))
// قابل استفاده باشه.
export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAILS: (id) => `/products/${id}`,
  CART: "/cart",
  FAVORITES: "/favorites",
  ABOUT: "/about",
  CONTACT: "/contact",
  LOGIN: "/login",
  REGISTER: "/register",
};

// اگه routes.jsx به رشته‌ی خام برای تعریف <Route path=...> نیاز داشت
// (چون اونجا الگو لازمه، نه مقدار واقعی)، از همین ثابت استفاده کن:
export const PRODUCT_DETAILS_ROUTE_PATTERN = "/products/:id";