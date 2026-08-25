import { X } from "lucide-react";

// ======================================================
// ProductFilter
// سایدبار فیلتر دسته‌بندی و فیلترهای خاص
// ======================================================

export default function ProductFilter({
  categories,
  activeCategory,
  activeFilter,
  onCategoryChange,
  onFilterChange,
  onClear,
  hasActiveFilters,
}) {
  const filterBtn = (active) => ({
    width: "100%",
    textAlign: "right",
    padding: "11px 14px",
    borderRadius: "var(--radius-lg)",
    border: "none",
    background: active ? "var(--color-primary-light)" : "transparent",
    color: active ? "var(--color-primary)" : "var(--color-text-secondary)",
    fontWeight: active ? "var(--font-weight-extrabold)" : "var(--font-weight-regular)",
    fontSize: "var(--font-size-lg)",
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: "4px",
    transition: "all var(--transition-normal)",
  });

  const sidebarCard = {
    background: "var(--color-bg-white)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-3xl)",
    padding: "var(--space-6)",
    marginBottom: "var(--space-4)",
  };

  return (
    <aside>
      {/* دسته‌بندی */}
      <div style={sidebarCard}>
        <h3
          style={{
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-extrabold)",
            color: "var(--color-text)",
            marginBottom: "var(--space-4)",
          }}
        >
          دسته‌بندی
        </h3>

        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          style={filterBtn(activeCategory === "all")}
        >
          همه دسته‌ها
        </button>

        {categories.map((cat) => (
          <button
            type="button"
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            style={filterBtn(activeCategory === cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* فیلترهای خاص */}
      <div style={sidebarCard}>
        <h3
          style={{
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-extrabold)",
            color: "var(--color-text)",
            marginBottom: "var(--space-4)",
          }}
        >
          فیلترها
        </h3>

        <button
          type="button"
          onClick={() => onFilterChange("all")}
          style={filterBtn(activeFilter === "all")}
        >
          همه محصولات
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("new")}
          style={filterBtn(activeFilter === "new")}
        >
          محصولات جدید
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("discount")}
          style={filterBtn(activeFilter === "discount")}
        >
          محصولات تخفیفی
        </button>
      </div>

      {/* پاک کردن فیلترها */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          style={{
            width: "100%",
            padding: "var(--space-3)",
            borderRadius: "var(--radius-lg)",
            border: "1.5px solid var(--color-error-border)",
            background: "var(--color-error-light)",
            color: "var(--color-error)",
            fontWeight: "var(--font-weight-bold)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontFamily: "inherit",
            transition: "all var(--transition-normal)",
          }}
        >
          <X size={16} />
          پاک کردن فیلترها
        </button>
      )}
    </aside>
  );
}
