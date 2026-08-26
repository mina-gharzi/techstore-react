// ======================================================
// constants.js
// مقادیر ثابت پروژه
// ======================================================

export const APP_NAME = "TechStore";

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