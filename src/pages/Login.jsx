import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { TIMEOUT_LOGIN } from "../utils/constants";
import "../styles/auth.css";

export default function Login() {
  usePageTitle("ورود");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError("ایمیل و رمز عبور را وارد کنید");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(formData);

      if (!result.success) {
        if (!mountedRef.current) return;

        setError(result.message);
        setIsSubmitting(false);
        return;
      }

      if (!mountedRef.current) return;

      navigate(redirectTo, {
        replace: true,
      });
    }, TIMEOUT_LOGIN);
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        {/* Brand */}
        <header className="auth-header">
          <h1 className="auth-header__title">ورود به حساب</h1>

          <p className="auth-header__description">
            برای ادامه خرید، وارد حساب کاربری خود شوید.
          </p>
        </header>

        {/* Error */}
        {error && (
          <div className="auth-general-error" id="login-error" role="alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              ایمیل
            </label>

            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" aria-hidden="true" />

              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="password">
                رمز عبور
              </label>
            </div>

            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" aria-hidden="true" />

              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="auth-input"
              />
              <Link to="/forgot-password" className="auth-forgot-link">
                فراموش کرده‌اید؟
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting} className="auth-submit">
            <span>{isSubmitting ? "در حال ورود..." : "ورود به حساب"}</span>

            {!isSubmitting && <ArrowLeft size={18} aria-hidden="true" />}
          </button>
        </form>

        {/* Register */}
        <footer className="auth-switch">
          <span>حساب کاربری ندارید؟</span>

          <Link to="/register" className="auth-switch__link">
            ثبت‌نام کنید
          </Link>
        </footer>
      </div>
    </main>
  );
}
