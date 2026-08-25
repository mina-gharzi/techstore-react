import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { LOW_STOCK_THRESHOLD } from "../../utils/constants";

export default function ProductInfo({
  product,
  categoryName,
  ratingInfo,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  stock,
  isOutOfStock,
  added,
  handleAddToCart,
  toggleFavorite,
  isFavoriteFunc,
}) {
  const features = [
    { icon: <Shield size={18} color="var(--color-primary)" />, text: "ضمانت اصالت کالا" },
    { icon: <Truck size={18} color="var(--color-primary)" />, text: "ارسال سریع" },
    {
      icon: <RotateCcw size={18} color="var(--color-primary)" />,
      text: "۷ روز ضمانت بازگشت",
    },
  ];

  return (
    <div>
      {/* برند + دسته */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
            padding: "6px 14px",
            borderRadius: "50px",
            fontSize: "0.85rem",
            fontWeight: 700,
          }}
        >
          {product.brand}
        </span>
        {categoryName && (
          <span
            style={{
              background: "#f1f5f9",
              color: "#475569",
              padding: "6px 14px",
              borderRadius: "50px",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            {categoryName}
          </span>
        )}
      </div>

      {/* نام */}
      <h1
        style={{
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 900,
          color: "var(--color-text)",
          marginBottom: "14px",
          lineHeight: 1.4,
        }}
      >
        {product.name}
      </h1>

      {/* امتیاز */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "2px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={18}
              color="var(--color-warning)"
              fill={
                star <= Math.round(ratingInfo.average) ? "var(--color-warning)" : "none"
              }
            />
          ))}
        </div>
        <span
          style={{
            color: "var(--color-text-muted)",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          {ratingInfo.average.toFixed(1)} از ۵
          {ratingInfo.count > 0 && ` (${ratingInfo.count} نظر)`}
        </span>
      </div>

      {/* قیمت */}
      <div
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          padding: "18px 20px",
          marginBottom: "22px",
        }}
      >
        {product.oldPrice && (
          <span
            style={{
              display: "block",
              color: "var(--color-text-faint)",
              textDecoration: "line-through",
              fontSize: "1rem",
              marginBottom: "4px",
            }}
          >
            {formatPrice(product.oldPrice)}
          </span>
        )}
        <span
          style={{
            fontSize: "clamp(1.5rem, 3vw, 1.9rem)",
            fontWeight: 900,
            color: "var(--color-primary)",
          }}
        >
          {formatPrice(product.price)}
        </span>
      </div>

      {/* توضیحات */}
      <p
        style={{
          color: "var(--color-text-muted)",
          lineHeight: 1.95,
          fontSize: "1.02rem",
          marginBottom: "24px",
        }}
      >
        {product.description}
      </p>

      {/* انتخاب رنگ */}
      {product.colors && product.colors.length > 0 && (
        <div style={{ marginBottom: "22px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontWeight: 700, color: "var(--color-text-secondary)" }}>رنگ:</span>
            <span style={{ color: "var(--color-text-muted)", fontWeight: 600 }}>
              {selectedColor?.name}
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {product.colors.map((color) => {
              const isActive = selectedColor?.value === color.value;

              return (
                <button
                  type="button"
                  key={color.value}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: color.value,
                    border: isActive
                      ? "3px solid var(--color-primary)"
                      : "2px solid var(--color-border)",
                    outline: isActive ? "2px solid #bfdbfe" : "none",
                    cursor: "pointer",
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(37,99,235,0.2)"
                      : "none",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* تعداد */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 700, color: "var(--color-text-secondary)" }}>تعداد:</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
            padding: "6px 10px",
          }}
        >
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-white)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="کم کردن تعداد"
          >
            <Minus size={14} />
          </button>
          <span
            style={{
              fontWeight: 800,
              minWidth: "24px",
              textAlign: "center",
            }}
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={quantity >= stock}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-white)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: quantity >= stock ? "not-allowed" : "pointer",
              opacity: quantity >= stock ? 0.5 : 1,
            }}
            aria-label="زیاد کردن تعداد"
          >
            <Plus size={14} />
          </button>
        </div>
        {!isOutOfStock && stock <= LOW_STOCK_THRESHOLD && (
          <span
            style={{
              color: "var(--color-warning)",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            تنها {stock} عدد موجود است
          </span>
        )}
      </div>

      {/* دکمه‌ها */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          style={{
            flex: 1,
            minWidth: "180px",
            padding: "15px 24px",
            background: isOutOfStock
              ? "var(--color-border)"
              : added
                ? "linear-gradient(135deg, var(--color-success), #15803d)"
                : "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
            color: isOutOfStock ? "var(--color-text-faint)" : "var(--color-bg-white)",
            borderRadius: "14px",
            fontSize: "1rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: isOutOfStock ? "not-allowed" : "pointer",
            border: "none",
            fontFamily: "inherit",
            boxShadow: isOutOfStock
              ? "none"
              : "0 12px 28px rgba(37, 99, 235, 0.28)",
          }}
        >
          <ShoppingCart size={20} />
          {isOutOfStock
            ? "ناموجود"
            : added
              ? "به سبد اضافه شد ✓"
              : "افزودن به سبد"}
        </button>

        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            border: "1.5px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isFavoriteFunc(product.id) ? "var(--color-error)" : "var(--color-text-faint)",
            cursor: "pointer",
            background: "var(--color-bg-white)",
          }}
          aria-label="افزودن به علاقه‌مندی‌ها"
        >
          <Heart
            size={22}
            fill={isFavoriteFunc(product.id) ? "var(--color-error)" : "none"}
          />
        </button>
      </div>

      {/* ویژگی‌ها */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "10px",
        }}
      >
        {features.map((item) => (
          <div
            key={item.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              padding: "12px 14px",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            {item.icon}
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
