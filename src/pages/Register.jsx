import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, Phone, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TIMEOUT_REGISTER } from "../utils/constants";
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
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
        if (!mountedRef.current) return;
        setErrors({ email: result.message });
        setIsSubmitting(false);
        return;
      }

      // register() در AuthContext بعد از ثبت‌نام موفق خودکار لاگین هم می‌کند
      if (!mountedRef.current) return;
      navigate("/", { replace: true });
    }, TIMEOUT_REGISTER);
  };

  return (
    <section className="auth-page">
      <div className="auth-container auth-register-container">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-header-icon">
            <UserPlus size={23} />
          </div>

          <h1 className="auth-header__title">ساخت حساب کاربری</h1>

          <p className="auth-header__subtitle">
            حساب خود را بسازید و خریدتان را شروع کنید
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="auth-field">
            <label className="form-label" htmlFor="fullName">
              نام و نام خانوادگی
            </label>

            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />

              <input
                type="text"
                name="fullName"
                id="fullName"
                aria-describedby={
                  errors.fullName ? "reg-fullName-error" : undefined
                }
                aria-invalid={!!errors.fullName}
                value={formData.fullName}
                onChange={handleChange}
                placeholder="مثلاً:    مینا قارزی  "
                className={
                  errors.fullName
                    ? "form-input form-input--error"
                    : "form-input"
                }
              />
            </div>

            {errors.fullName && (
              <span className="form-error" id="reg-fullName-error">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="form-label" htmlFor="email">
              ایمیل
            </label>

            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />

              <input
                type="email"
                name="email"
                id="email"
                aria-describedby={errors.email ? "reg-email-error" : undefined}
                aria-invalid={!!errors.email}
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className={
                  errors.email ? "form-input form-input--error" : "form-input"
                }
              />
            </div>

            {errors.email && (
              <span className="form-error" id="reg-email-error">
                {errors.email}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="auth-field">
            <label className="form-label" htmlFor="phone">
              شماره موبایل
            </label>

            <div className="auth-input-wrapper">
              <Phone size={18} className="auth-input-icon" />

              <input
                type="tel"
                name="phone"
                id="phone"
                aria-describedby={errors.phone ? "reg-phone-error" : undefined}
                aria-invalid={!!errors.phone}
                value={formData.phone}
                onChange={handleChange}
                placeholder="09xxxxxxxxx"
                className={
                  errors.phone ? "form-input form-input--error" : "form-input"
                }
              />
            </div>

            {errors.phone && (
              <span className="form-error" id="reg-phone-error">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="form-label" htmlFor="password">
              رمز عبور
            </label>

            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />

              <input
                type="password"
                name="password"
                id="password"
                aria-describedby={
                  errors.password ? "reg-password-error" : undefined
                }
                aria-invalid={!!errors.password}
                value={formData.password}
                onChange={handleChange}
                placeholder="حداقل ۶ کاراکتر"
                className={
                  errors.password
                    ? "form-input form-input--error"
                    : "form-input"
                }
              />
            </div>

            {errors.password && (
              <span className="form-error" id="reg-password-error">
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label className="form-label" htmlFor="confirmPassword">
              تکرار رمز عبور
            </label>

            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />

              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                aria-describedby={
                  errors.confirmPassword
                    ? "reg-confirmPassword-error"
                    : undefined
                }
                aria-invalid={!!errors.confirmPassword}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={
                  errors.confirmPassword
                    ? "form-input form-input--error"
                    : "form-input"
                }
              />
            </div>

            {errors.confirmPassword && (
              <span className="form-error" id="reg-confirmPassword-error">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn--primary"
          >
            {isSubmitting ? "در حال ساخت حساب..." : "ساخت حساب کاربری"}
          </button>
        </form>

        {/* Login link */}
        <p className="auth-switch">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link to="/login" className="auth-switch__link">
            وارد شوید
          </Link>
        </p>
      </div>
    </section>
  );
}
