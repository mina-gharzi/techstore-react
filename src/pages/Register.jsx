import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, Phone, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

// ======================================================
// Register
// صفحه ثبت‌نام
// ======================================================

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "نام و نام خانوادگی را وارد کنید";
    }

    if (!formData.email.trim()) {
      newErrors.email = "ایمیل را وارد کنید";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "ایمیل معتبر نیست";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "شماره موبایل را وارد کنید";
    } else if (!/^09\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود";
    }

    if (!formData.password) {
      newErrors.password = "رمز عبور را وارد کنید";
    } else if (formData.password.length < 6) {
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "رمز عبور و تکرار آن یکسان نیستند";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const result = register(formData);

      if (!result.success) {
        setErrors({ email: result.message });
        setIsSubmitting(false);
        return;
      }

      // register() در AuthContext بعد از ثبت‌نام موفق خودکار لاگین هم می‌کند
      navigate("/", { replace: true });
    }, 500);
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    height: "50px",
    padding: "0 44px 0 16px",
    border: `1.5px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
    borderRadius: "12px",
    fontSize: "0.95rem",
    outline: "none",
    background: hasError ? "#fef2f2" : "#f8fafc",
    fontFamily: "inherit",
    color: "#0f172a",
  });

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: 700,
    color: "#1e293b",
    fontSize: "0.9rem",
  };

  const errorStyle = {
    display: "block",
    marginTop: "6px",
    color: "#ef4444",
    fontSize: "0.82rem",
    fontWeight: 600,
  };

  const iconStyle = {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
  };

  return (
    <section className="auth-page">
      <div className="auth-container auth-register-container">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-brand">
            <div className="auth-brand-mark">
              <UserPlus size={17} />
            </div>

            <span>TechStore</span>
          </div>

          <div className="auth-header-icon">
            <UserPlus size={23} />
          </div>

          <h1>ساخت حساب کاربری</h1>

          <p>حساب خود را بسازید و خریدتان را شروع کنید</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="auth-field">
            <label className="auth-label">نام و نام خانوادگی</label>

            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="مثلاً: مینا قارزی "
                className={`auth-input ${
                  errors.fullName ? "auth-input-error" : ""
                }`}
              />
            </div>

            {errors.fullName && (
              <span className="auth-error">{errors.fullName}</span>
            )}
          </div>

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
                className={`auth-input ${
                  errors.email ? "auth-input-error" : ""
                }`}
              />
            </div>

            {errors.email && <span className="auth-error">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="auth-field">
            <label className="auth-label">شماره موبایل</label>

            <div className="auth-input-wrapper">
              <Phone size={18} className="auth-input-icon" />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="09xxxxxxxxx"
                className={`auth-input ${
                  errors.phone ? "auth-input-error" : ""
                }`}
              />
            </div>

            {errors.phone && <span className="auth-error">{errors.phone}</span>}
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
                placeholder="حداقل ۶ کاراکتر"
                className={`auth-input ${
                  errors.password ? "auth-input-error" : ""
                }`}
              />
            </div>

            {errors.password && (
              <span className="auth-error">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label className="auth-label">تکرار رمز عبور</label>

            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`auth-input ${
                  errors.confirmPassword ? "auth-input-error" : ""
                }`}
              />
            </div>

            {errors.confirmPassword && (
              <span className="auth-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting} className="auth-submit">
            {isSubmitting ? "در حال ساخت حساب..." : "ساخت حساب کاربری"}
          </button>
        </form>

        {/* Login link */}
        <p className="auth-switch">
          قبلاً ثبت‌نام کرده‌اید؟ <Link to="/login">وارد شوید</Link>
        </p>
      </div>
    </section>
  );
}
