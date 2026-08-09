import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import ProductCard from "../components/product/ProductCard";

// ======================================================
// Favorites
// صفحه علاقه‌مندی‌ها
// ======================================================

export default function Favorites() {
  // ---------- Context ----------
  const { favorites } = useFavorites();

  // ---------- اگر لیست خالی بود ----------
  if (favorites.length === 0) {
    return (
      <section
        style={{
          padding: "100px 20px",
          textAlign: "center",
        }}
      >
        <Heart
          size={64}
          color="#94a3b8"
          style={{ margin: "0 auto 24px" }}
        />
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: "12px",
          }}
        >
          لیست علاقه‌مندی‌ها خالی است
        </h1>
        <p style={{ color: "#64748b", marginBottom: "28px" }}>
          هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید.
        </p>
        <Link
          to="/products"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "12px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          مشاهده محصولات
        </Link>
      </section>
    );
  }

  // ---------- Render ----------
  return (
    <section style={{ padding: "50px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ---------- عنوان ---------- */}
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "1.9rem",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "10px",
            }}
          >
            علاقه‌مندی‌های من
          </h1>
          <p style={{ color: "#64748b", fontSize: "1.05rem" }}>
            {favorites.length} محصول در لیست علاقه‌مندی‌ها
          </p>
        </div>

        {/* ---------- گرید محصولات ---------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}