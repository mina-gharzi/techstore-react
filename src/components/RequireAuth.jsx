import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ======================================================
// RequireAuth
// یک Route "محافظت‌شده" - فقط کاربر لاگین‌شده اجازه‌ی عبور داره.
//
// استفاده در routes.jsx:
//   <Route
//     path="/checkout"
//     element={
//       <RequireAuth>
//         <Checkout />
//       </RequireAuth>
//     }
//   />
//
// اگر کاربر لاگین نبود، به /login هدایت می‌شه و مسیر فعلی
// (مثلاً "/checkout") توی location.state.from ذخیره می‌شه.
// Login.jsx از قبل همین state رو می‌خونه و بعد از ورود موفق
// کاربر رو دقیقاً به همون صفحه برمی‌گردونه.
// ======================================================

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  }

  return children;
}