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
          color: "#2563eb",
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
          color: "#0f172a",
          marginBottom: "14px",
        }}
      >
        صفحه پیدا نشد
      </h2>

      <p
        style={{
          color: "#64748b",
          fontSize: "1.05rem",
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
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: 700,
          textDecoration: "none",
          boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
        }}
      >
        بازگشت به صفحه اصلی
      </Link>
    </section>
  );
}