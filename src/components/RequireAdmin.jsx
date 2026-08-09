import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ======================================================
// RequireAdmin
// مثل RequireAuth، ولی یک لایه‌ی سخت‌گیرانه‌تر: هم کاربر باید
// لاگین باشه، هم نقشش "admin" باشه.
//
// - اگر اصلاً لاگین نیست → به /login هدایت می‌شه (مثل RequireAuth)
// - اگر لاگینه ولی ادمین نیست → به‌جای هدایت خاموش، یک پیام واضح
//   "دسترسی محدود" نشون داده می‌شه؛ چون silent redirect برای این
//   حالت گمراه‌کننده‌ست (کاربر فکر می‌کنه یه باگه، نه یه محدودیت).
// ======================================================

export default function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  }

  if (!isAdmin) {
    return (
      <section style={{ padding: "100px 20px", textAlign: "center" }}>
        <ShieldAlert size={64} color="#f59e0b" style={{ margin: "0 auto 24px" }} />
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: "12px",
          }}
        >
          دسترسی محدود
        </h1>
        <p style={{ color: "#64748b", marginBottom: "28px" }}>
          این بخش فقط برای مدیر فروشگاه در دسترس است.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "12px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          بازگشت به صفحه اصلی
        </Link>
      </section>
    );
  }

  return children;
}