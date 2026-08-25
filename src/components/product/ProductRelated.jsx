import ProductCard from "./ProductCard";

export default function ProductRelated({ relatedProducts }) {
  return (
    relatedProducts.length > 0 && (
      <div>
        <div style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "var(--color-text)",
              marginBottom: "6px",
            }}
          >
            محصولات مرتبط
          </h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            محصولات مشابه از همین دسته‌بندی
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    )
  );
}
