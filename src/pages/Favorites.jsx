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
      <section className="empty-state">
        <div className="empty-state__icon">
          <Heart
            size={64}
            color="var(--color-text-faint)"
          />
        </div>
        <h1 className="empty-state__title">
          لیست علاقه‌مندی‌ها خالی است
        </h1>
        <p className="empty-state__text">
          هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید.
        </p>
        <Link
          to="/products"
          className="btn btn--primary btn--pill"
        >
          مشاهده محصولات
        </Link>
      </section>
    );
  }

  // ---------- Render ----------
  return (
    <section className="page-favorites" style={{ padding: "50px 20px" }}>
      <div className="container--plain">
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "1.9rem",
              fontWeight: 800,
              color: "var(--color-text)",
              marginBottom: "10px",
            }}
          >
            علاقه‌مندی‌های من
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-xl)" }}>
            {favorites.length} محصول در لیست علاقه‌مندی‌ها
          </p>
        </div>

        <div className="product-grid">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}