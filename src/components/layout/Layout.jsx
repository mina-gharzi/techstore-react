// ======================================================
// Layout
// ابزارهای کمکی برای چیدمان صفحات
//
// نکته: Navbar و Footer همچنان توی App.jsx مدیریت می‌شن.
// این کامپوننت‌ها فقط برای wrap کردن محتوای داخلی صفحات
// با max-width و padding ثابت هستن.
// ======================================================

export function PageLayout({ children, className = "" }) {
  return (
    <div
      className={className}
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px",
      }}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle, align = "center" }) {
  return (
    <div style={{ textAlign: align, marginBottom: "var(--space-10)" }}>
      <h2
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2rem)",
          fontWeight: "var(--font-weight-extrabold)",
          color: "var(--color-text)",
          marginBottom: "var(--space-3)",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-xl)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={className}
      style={{
        background: "var(--color-bg-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-3xl)",
        padding: "var(--space-7) var(--space-6)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
