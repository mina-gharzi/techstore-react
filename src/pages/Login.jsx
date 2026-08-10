import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

// ======================================================
// Login
// صفحه ورود
// ======================================================

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // اگر کاربر از یک صفحه‌ی محافظت‌شده به اینجا هدایت شده،
  // بعد از لاگین موفق به همون صفحه برگرده (مثلاً از Checkout)
  const redirectTo = location.state?.from || "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError("ایمیل و رمز عبور را وارد کنید");
      return;
    }

    setIsSubmitting(true);

    // یک تاخیر کوتاه شبیه درخواست به سرور (چون بک‌اند واقعی نداریم)
    setTimeout(() => {
      const result = login(formData);

      if (!result.success) {
        setError(result.message);
        setIsSubmitting(false);
        return;
      }

      navigate(redirectTo, { replace: true });
    }, 500);
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        {/* Brand */}
        <div className="auth-header">
          <div className="auth-brand">
            <div className="auth-brand-mark">
              <LogIn size={17} />
            </div>

            <span>TechStore</span>
          </div>

          <div className="auth-header-icon">
            <LogIn size={23} />
          </div>

          <h1>ورود به حساب کاربری</h1>

          <p>برای ادامه‌ی خرید وارد حساب خود شوید</p>
        </div>

        {/* Error */}
        {error && <div className="auth-general-error">{error}</div>}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">ایمیل</label>

            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label">رمز عبور</label>

            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="auth-input"
              />
            </div>

            <div style={{ textAlign: "left", marginTop: "8px" }}>
              <Link
                to="/forgot-password"
                style={{ color: "#2563eb", fontSize: "0.82rem", fontWeight: 700 }}
              >
                رمز عبور را فراموش کرده‌اید؟
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting} className="auth-submit">
            {isSubmitting ? "در حال ورود..." : "ورود به حساب"}
          </button>
        </form>

        {/* Register link */}
        <p className="auth-switch">
          حساب کاربری ندارید؟{" "}
          <Link to="/register">ثبت‌نام کنید</Link>
        </p>
      </div>
    </section>
  );
}