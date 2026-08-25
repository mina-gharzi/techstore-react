import { PackageSearch } from "lucide-react";
import ProductCard from "./ProductCard";

// ======================================================
// ProductGrid
// گرید نمایش لیست محصولات + state خالی بودن
// ======================================================

export default function ProductGrid({ products, onClearFilters }) {
  if (products.length === 0) {
    return (
      <div
        style={{
          background: "var(--color-bg-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-3xl)",
          padding: "60px var(--space-5)",
          textAlign: "center",
        }}
      >
        <PackageSearch
          size={48}
          color="var(--color-text-faint)"
          style={{ margin: "0 auto var(--space-4)" }}
        />
        <p
          style={{
            fontSize: "var(--font-size-xl)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--color-text)",
            marginBottom: "var(--space-2)",
          }}
        >
          محصولی پیدا نشد
        </p>
        <p
          style={{
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-5)",
          }}
        >
          فیلترها یا عبارت جستجو را تغییر دهید.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              padding: "var(--space-3) var(--space-6)",
              background: "var(--color-primary)",
              color: "var(--color-bg-white)",
              borderRadius: "var(--radius-lg)",
              fontWeight: "var(--font-weight-bold)",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            نمایش همه محصولات
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "var(--space-5)",
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
