import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Check, Ban, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { getStock } from "../../context/ProductsContext";
import { useReviews } from "../../context/ReviewsContext";
import { formatPrice } from "../../utils/formatPrice";

// ======================================================
// ProductCard
// کارت نمایش یک محصول
// ======================================================

export default function ProductCard({ product }) {
  // ---------- Context ----------
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getAverageRating } = useReviews();

  // ---------- State ----------
  // فیدبک کوتاه بعد از افزودن به سبد، هم‌راستا با همین رفتار در ProductDetails
  const [added, setAdded] = useState(false);

  const stock = getStock(product);
  const isOutOfStock = stock <= 0;
  // امتیاز واقعی از نظرهای ثبت‌شده (اگه نظری نبود، از رتینگ ثابت
  // seed استفاده می‌کنیم تا کارت خالی به‌نظر نرسه)
  const ratingInfo = getAverageRating(product.id, product.rating);

  // ---------- Handlers ----------
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
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
          position: "relative",
        }}
      >
        {isOutOfStock && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(15, 23, 42, 0.85)",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: "50px",
              zIndex: 1,
            }}
          >
            ناموجود
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          style={{
            maxHeight: "160px",
            maxWidth: "100%",
            objectFit: "contain",
            opacity: isOutOfStock ? 0.5 : 1,
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

        {/* امتیاز - از میانگین نظرهای واقعی (ReviewsContext) */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>
            {ratingInfo.average.toFixed(1)}
          </span>
          {ratingInfo.count > 0 && (
            <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
              ({ratingInfo.count})
            </span>
          )}
        </div>

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
            disabled={isOutOfStock}
            style={{
              flex: 1,
              padding: "10px",
              background: isOutOfStock ? "#e2e8f0" : added ? "#16a34a" : "#2563eb",
              color: isOutOfStock ? "#94a3b8" : "#fff",
              borderRadius: "10px",
              fontSize: "0.88rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
              border: "none",
              fontFamily: "inherit",
              transition: "background 0.2s ease",
            }}
          >
            {isOutOfStock ? (
              <Ban size={16} />
            ) : added ? (
              <Check size={16} />
            ) : (
              <ShoppingCart size={16} />
            )}
            {isOutOfStock ? "ناموجود" : added ? "اضافه شد" : "افزودن به سبد"}
          </button>
        </div>

        {!isOutOfStock && stock <= 5 && (
          <span style={{ color: "#f59e0b", fontSize: "0.78rem", fontWeight: 700 }}>
            تنها {stock} عدد باقی مانده
          </span>
        )}
      </div>
    </div>
  );
}