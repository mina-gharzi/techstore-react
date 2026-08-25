import { Component } from "react";
import { AlertOctagon, RefreshCcw, Home } from "lucide-react";

// ======================================================
// ErrorBoundary
//
// React فقط با یک کامپوننت کلاسی (نه تابعی) می‌تونه خطاهای
// رندر رو "بگیره". بدون این کامپوننت، اگه یه جای کد یه خطای
// غیرمنتظره بده (مثلاً یه undefined.property)، کل اپ سفید و
// خالی می‌مونه و کاربر هیچ سرنخی نمی‌بینه که چی شده.
//
// این کامپوننت باید یک‌بار، دور کل <AppRoutes /> توی App.jsx
// بپیچه. Navbar/Footer عمداً بیرون این باندری موندن تا حتی اگه
// یک صفحه کرش کرد، هدر و فوتر (و لینک بازگشت به خانه) همچنان
// در دسترس باشه.
// ======================================================

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // در یک پروژه‌ی واقعی، اینجا جای فرستادن خطا به یک سرویس
    // مانیتورینگ (مثل Sentry) است. فعلاً فقط توی کنسول لاگ می‌کنیم.
    console.error("خطای غیرمنتظره در رندر:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section
          style={{
            padding: "100px 20px",
            textAlign: "center",
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "var(--color-error-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <AlertOctagon size={38} color="var(--color-error)" />
          </div>

          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "var(--color-text)",
              marginBottom: "12px",
            }}
          >
            یک مشکل پیش آمد
          </h1>

          <p style={{ color: "var(--color-text-muted)", marginBottom: "32px", maxWidth: "440px", lineHeight: 1.9 }}>
            متأسفانه در نمایش این صفحه خطایی رخ داد. می‌توانید صفحه را دوباره
            بارگذاری کنید یا به صفحه‌ی اصلی بازگردید.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={this.handleReload}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 28px",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                color: "var(--color-bg-white)",
                borderRadius: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <RefreshCcw size={17} />
              بارگذاری مجدد
            </button>

            {/*
              اینجا از تگ <a> ساده استفاده شده، نه <Link> از
              react-router - چون بعد از یک خطای رندر، بهترین کار
              یک navigation کامل (رفرش واقعی صفحه) است، نه یک
              جابه‌جایی نرم داخل همون اپلیکیشنی که کرش کرده.
            */}
            <a
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 28px",
                background: "var(--color-bg-white)",
                color: "var(--color-text-secondary)",
                border: "1.5px solid var(--color-border)",
                borderRadius: "12px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Home size={17} />
              بازگشت به صفحه اصلی
            </a>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}