import { Link } from "react-router-dom";

// ======================================================
// NotFound
// صفحه ۴۰۴ - وقتی مسیر اشتباه وارد شود
// ======================================================

export default function NotFound() {
  return (
    <section
      style={{
        padding: "clamp(60px, 15vw, 120px) 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(3.5rem, 10vw, 6rem)",
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
          fontSize: "var(--font-size-4xl)",
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
        className="btn btn--primary"
      >
        بازگشت به صفحه اصلی
      </Link>
    </section>
  );
}
