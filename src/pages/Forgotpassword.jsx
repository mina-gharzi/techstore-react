import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Mail, Phone, Lock, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { TIMEOUT_PASSWORD_RESET } from "../utils/constants";
import "../styles/auth.css";

// ======================================================
// ForgotPassword
// بازیابی رمز عبور در دو مرحله
//
// چون سرویس ایمیل واقعی نداریم، به‌جای فرستادن لینک بازیابی،
// هویت کاربر با تطابق ایمیل + شماره موبایل ثبت‌شده تایید می‌شه
// (مرحله ۱)، بعد اجازه‌ی تنظیم رمز جدید داده می‌شه (مرحله ۲).
// ======================================================

export default function ForgotPassword() {
  usePageTitle("فراموشی رمز عبور");
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: تایید هویت | 2: رمز جدید
  const [identity, setIdentity] = useState({ email: "", phone: "" });
  const [newPassword, setNewPassword] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  // ---------- مرحله ۱: تایید هویت ----------
  const handleIdentityChange = (e) => {
    const { name, value } = e.target;
    setIdentity((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleIdentitySubmit = (e) => {
    e.preventDefault();

    if (!identity.email.trim() || !identity.phone.trim()) {
      setError("ایمیل و شماره موبایل را وارد کنید");
      return;
    }
    if (!/^09\d{9}$/.test(identity.phone.trim())) {
      setError("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود");
      return;
    }

    // اینجا هنوز واقعاً چک نمی‌کنیم - چک نهایی موقع submit مرحله ۲
    // انجام می‌شه (چون resetPassword هم تطابق هم تغییر رمز رو با
    // هم انجام می‌ده). فقط فرمت ورودی رو معتبر می‌کنیم و می‌ریم جلو.
    setStep(2);
  };

  // ---------- مرحله ۲: رمز جدید ----------
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setNewPassword((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!newPassword.password || newPassword.password.length < 6) {
      setError("رمز عبور جدید باید حداقل ۶ کاراکتر باشد");
      return;
    }
    if (newPassword.password !== newPassword.confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = resetPassword({
        email: identity.email,
        phone: identity.phone,
        newPassword: newPassword.password,
      });

      if (!result.success) {
        // برگرد به مرحله ۱ چون یعنی ایمیل/موبایل با هم مطابقت نداشتن
        if (!mountedRef.current) return;
        setError(result.message);
        setIsSubmitting(false);
        setStep(1);
        return;
      }

      if (!mountedRef.current) return;
      setIsSubmitting(false);
      setIsDone(true);
      setTimeout(() => {
        if (mountedRef.current) navigate("/login");
      }, 2000);
    }, TIMEOUT_PASSWORD_RESET);
  };

  if (isDone) {
    return (
      <section className="auth-page">
        <div className="auth-container" style={{ textAlign: "center" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
            }}
          >
            <Check size={26} color="var(--color-success)" />
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "10px" }}>
            رمز عبور تغییر کرد
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            در حال انتقال به صفحه‌ی ورود...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-brand">
            <div className="auth-brand-mark">
              <KeyRound size={17} />
            </div>
            <span>TechStore</span>
          </div>

          <div className="auth-header-icon">
            <KeyRound size={23} />
          </div>

          <h1 className="auth-header__title">فراموشی رمز عبور</h1>
          <p className="auth-header__subtitle">
            {step === 1
              ? "ایمیل و شماره موبایلی که با آن ثبت‌نام کرده‌اید را وارد کنید"
              : "رمز عبور جدید خود را انتخاب کنید"}
          </p>
        </div>

        {error && <div className="auth-general-error" id="forgot-error">{error}</div>}

        {step === 1 ? (
          <form className="auth-form" onSubmit={handleIdentitySubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="forgotEmail">ایمیل</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  name="email"
                  id="forgotEmail"
                  value={identity.email}
                  onChange={handleIdentityChange}
                  placeholder="example@email.com"
                  className="auth-input"
                  aria-describedby={error ? "forgot-error" : undefined}
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="forgotPhone">شماره موبایل</label>
              <div className="auth-input-wrapper">
                <Phone size={18} className="auth-input-icon" />
                <input
                  type="tel"
                  name="phone"
                  id="forgotPhone"
                  value={identity.phone}
                  onChange={handleIdentityChange}
                  placeholder="09xxxxxxxxx"
                  className="auth-input"
                  aria-describedby={error ? "forgot-error" : undefined}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit">
              ادامه
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handlePasswordSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="forgotNewPassword">رمز عبور جدید</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  name="password"
                  id="forgotNewPassword"
                  value={newPassword.password}
                  onChange={handlePasswordChange}
                  placeholder="حداقل ۶ کاراکتر"
                  className="auth-input"
                  aria-describedby={error ? "forgot-error" : undefined}
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="forgotConfirmPassword">تکرار رمز عبور جدید</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  id="forgotConfirmPassword"
                  value={newPassword.confirmPassword}
                  onChange={handlePasswordChange}
                  className="auth-input"
                  aria-describedby={error ? "forgot-error" : undefined}
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="auth-submit">
              {isSubmitting ? "در حال ثبت..." : "تغییر رمز عبور"}
            </button>
          </form>
        )}

        <p className="auth-switch">
          رمز خود را به یاد آوردید؟ <Link to="/login" className="auth-switch__link">ورود به حساب</Link>
        </p>
      </div>
    </section>
  );
}