import { Routes, Route } from "react-router-dom";

// ---------- صفحات ----------
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

// ======================================================
// AppRoutes
// تعریف تمام مسیرهای اپلیکیشن
// ======================================================

export default function AppRoutes() {
  return (
    <Routes>
      {/* صفحه اصلی */}
      <Route path="/" element={<Home />} />

      {/* لیست محصولات */}
      <Route path="/products" element={<Products />} />

      {/* جزئیات یک محصول (با پارامتر id) */}
      <Route path="/products/:id" element={<ProductDetails />} />

      {/* سبد خرید */}
      <Route path="/cart" element={<Cart />} />

      {/* تکمیل خرید - فقط برای کاربر لاگین‌شده */}
      <Route
        path="/checkout"
        element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        }
      />

      {/* تایید سفارش - این هم باید محافظت‌شده باشه، چون خودِ
          فرآیند ثبت سفارش به لاگین بودن نیاز داره */}
      <Route
        path="/order-success"
        element={
          <RequireAuth>
            <OrderSuccess />
          </RequireAuth>
        }
      />

      {/* علاقه‌مندی‌ها */}
      <Route path="/favorites" element={<Favorites />} />

      {/* درباره ما */}
      <Route path="/about" element={<About />} />

      {/* تماس با ما */}
      <Route path="/contact" element={<Contact />} />

      {/* ورود و ثبت‌نام */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* پنل مدیریت - فقط برای کاربر با نقش ادمین */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />

      {/* صفحه ۴۰۴ - برای مسیرهای نامعتبر */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}