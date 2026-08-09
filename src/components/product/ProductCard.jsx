import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { formatPrice } from "../../utils/formatPrice";

// ======================================================
// ProductCard
// کارت نمایش یک محصول
// ======================================================

export default function ProductCard({ product }) {
  // ---------- Context ----------
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // ---------- State ----------
  // فیدبک کوتاه بعد از افزودن به سبد، هم‌راستا با همین رفتار در ProductDetails
  const [added, setAdded] = useState(false);

  // ---------- Handlers ----------
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  // ---------- Render ----------
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        position: "relative",
      }}
    >
      {/* ---------- دکمه علاقه‌مندی ---------- */}
      <button
        onClick={handleToggleFavorite}
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          zIndex: 2,
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          color: isFavorite(product.id) ? "#ef4444" : "#94a3b8",
          cursor: "pointer",
        }}
        title="افزودن به علاقه‌مندی‌ها"
      >
        <Heart size={18} fill={isFavorite(product.id) ? "#ef4444" : "none"} />
      </button>

      {/* ---------- تصویر محصول ---------- */}
      <Link
        to={`/products/${product.id}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "200px",
          padding: "20px",
          background: "#f8fafc",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            maxHeight: "160px",
            maxWidth: "100%",
            objectFit: "contain",
          }}
          onError={(e) => {
            e.target.src = "/assets/images/product/no-image.png";
          }}
        />
      </Link>

      {/* ---------- اطلاعات محصول ---------- */}
      <div
        style={{
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "10px",
        }}
      >
        {/* دسته‌بندی */}
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#2563eb",
          }}
        >
          {product.brand}
        </span>

        {/* نام محصول */}
        <Link
          to={`/products/${product.id}`}
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#0f172a",
            textDecoration: "none",
            lineHeight: 1.4,
          }}
        >
          {product.name}
        </Link>

        {/* قیمت */}
        <div style={{ marginTop: "auto" }}>
          {product.oldPrice && (
            <span
              style={{
                fontSize: "0.85rem",
                color: "#94a3b8",
                textDecoration: "line-through",
                display: "block",
                marginBottom: "4px",
              }}
            >
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#2563eb",
            }}
          >
            {formatPrice(product.price)}
          </span>
        </div>

        {/* ---------- دکمه‌ها ---------- */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "12px",
          }}
        >
          <Link
            to={`/products/${product.id}`}
            style={{
              flex: 1,
              padding: "10px",
              textAlign: "center",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "#334155",
              textDecoration: "none",
            }}
          >
            جزئیات
          </Link>

          {/*
            قبلاً این دکمه "خرید" نوشته شده بود ولی فقط addToCart را صدا
            می‌زد (نه هدایت به پرداخت). حالا متن با رفتار واقعی‌اش هم‌خوانی دارد.
          */}
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              padding: "10px",
              background: added ? "#16a34a" : "#2563eb",
              color: "#fff",
              borderRadius: "10px",
              fontSize: "0.88rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              cursor: "pointer",
              border: "none",
              fontFamily: "inherit",
              transition: "background 0.2s ease",
            }}
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
            {added ? "اضافه شد" : "افزودن به سبد"}
          </button>
        </div>
      </div>
    </div>
  );
}