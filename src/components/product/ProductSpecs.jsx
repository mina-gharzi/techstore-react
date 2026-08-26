const ProductSpecs = ({ product, categoryName, ratingInfo }) => {
  return (
    <div
      style={{
        background: "var(--color-bg-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "20px",
        padding: "28px 24px",
        marginBottom: "50px",
      }}
    >
      <h2
        style={{
          fontSize: "1.3rem",
          fontWeight: 800,
          color: "var(--color-text)",
          marginBottom: "20px",
        }}
      >
        مشخصات محصول
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        {[
          { label: "برند", value: product.brand },
          { label: "دسته‌بندی", value: categoryName },
          {
            label: "امتیاز",
            value: `${ratingInfo.average.toFixed(1)} از ۵`,
          },
          {
            label: "وضعیت",
            value: product.isNew ? "جدید" : "موجود",
          },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "14px 16px",
              background: "var(--color-bg)",
              borderRadius: "12px",
              border: "1px solid var(--slate-100)",
            }}
          >
            <span style={{ color: "var(--color-text-muted)", fontWeight: 600 }}>
              {row.label}
            </span>
            <span style={{ color: "var(--color-text)", fontWeight: 800 }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecs;
