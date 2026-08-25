export default function ProductImage({ product, discountPercent }) {
  return (
    <div
      style={{
        position: "relative",
        background: "var(--color-bg-white)",
        borderRadius: "22px",
        padding: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "380px",
        border: "1px solid var(--color-border)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
      }}
    >
      {discountPercent > 0 && (
        <span
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "var(--color-error)",
            color: "var(--color-bg-white)",
            padding: "6px 12px",
            borderRadius: "50px",
            fontSize: "0.85rem",
            fontWeight: 800,
          }}
        >
          {discountPercent}٪ تخفیف
        </span>
      )}

      {product.isNew && (
        <span
          style={{
            position: "absolute",
            top: "18px",
            left: "18px",
            background: "var(--color-primary)",
            color: "var(--color-bg-white)",
            padding: "6px 12px",
            borderRadius: "50px",
            fontSize: "0.85rem",
            fontWeight: 800,
          }}
        >
          جدید
        </span>
      )}

      <img
        src={product.image}
        alt={product.name}
        style={{
          maxWidth: "100%",
          maxHeight: "340px",
          objectFit: "contain",
        }}
        onError={(e) => {
          e.target.src = "/assets/images/product/no-image.png";
        }}
      />
    </div>
  );
}
