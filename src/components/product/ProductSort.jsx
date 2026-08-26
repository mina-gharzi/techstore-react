// ======================================================
// ProductSort
// دراپ‌داون مرتب‌سازی محصولات
// ======================================================

export default function ProductSort({ sort, onSortChange }) {
  return (
    <select
      value={sort}
      onChange={(e) => onSortChange(e.target.value)}
      style={{
        height: "48px",
        padding: "0 var(--space-4)",
        border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius-2xl)",
        background: "var(--color-bg-white)",
        fontFamily: "inherit",
        fontWeight: "var(--font-weight-regular)",
        color: "var(--color-text-secondary)",
        cursor: "pointer",
        minWidth: "160px",
        outline: "none",
        fontSize: "var(--font-size-md)",
      }}
    >
      <option value="default">مرتب‌سازی پیش‌فرض</option>
      <option value="price-asc">ارزان‌ترین</option>
      <option value="price-desc">گران‌ترین</option>
      <option value="rating">بیشترین امتیاز</option>
      <option value="newest">جدیدترین</option>
    </select>
  );
}
