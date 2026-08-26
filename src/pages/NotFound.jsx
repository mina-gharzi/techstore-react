import { Link } from "react-router-dom";

// ======================================================
// NotFound
// صفحه ۴۰۴ - وقتی مسیر اشتباه وارد شود
// ======================================================

export default function NotFound() {
  return (
    <section
      style={{
        padding: "120px 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "6rem",
          fontWeight: 900,
          color: "var(--color-primary)",
          marginBottom: "10px",
          lineHeight: 1,
        }}
      >
        ۴۰۴
      </h1>

      <h2
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "var(--color-text)",
          marginBottom: "14px",
        }}
      >
        صفحه پیدا نشد
      </h2>

      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: "var(--font-size-xl)",
          marginBottom: "32px",
        }}
      >
        مسیری که وارد کردید وجود ندارد یا حذف شده است.
      </p>

      <Link
        to="/"
        style={{
          display: "inline-block",
          padding: "13px 32px",
          background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
          color: "var(--color-bg-white)",
          borderRadius: "12px",
          fontWeight: 700,
          textDecoration: "none",
          boxShadow: "var(--shadow-cta)",
        }}
      >
        بازگشت به صفحه اصلی
      </Link>
    </section>
  );
}