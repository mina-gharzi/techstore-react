import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Check, Ban, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { getStock } from "../../context/ProductsContext";
import { useReviews } from "../../context/ReviewsContext";
import { formatPrice } from "../../utils/formatPrice";
import { TIMEOUT_ADDED_TO_CART, LOW_STOCK_THRESHOLD } from "../../utils/constants";
import "../../styles/product-card.css";

// ======================================================
// ProductCard
// کارت نمایش یک محصول
// ======================================================

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getAverageRating } = useReviews();

  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), TIMEOUT_ADDED_TO_CART);
    return () => clearTimeout(id);
  }, [added]);

  const stock = getStock(product);
  const isOutOfStock = stock <= 0;
  const ratingInfo = getAverageRating(product.id, product.rating);
  const favorited = isFavorite(product.id);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
    setAdded(true);
  }, [addToCart, product, isOutOfStock]);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <div className="product-card">
      {/* دکمه علاقه‌مندی */}
      <button
        type="button"
        onClick={handleToggleFavorite}
        className={`product-card__favorite-btn ${favorited ? "is-active" : ""}`}
        title="افزودن به علاقه‌مندی‌ها"
      >
        <Heart size={18} fill={favorited ? "var(--color-error)" : "none"} />
      </button>

      {/* تصویر محصول */}
      <Link to={`/products/${product.id}`} className="product-card__image-link">
        {isOutOfStock && (
          <span className="product-card__out-of-stock-badge">ناموجود</span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`product-card__image ${isOutOfStock ? "is-out-of-stock" : ""}`}
          onError={(e) => {
            e.target.src = "/assets/images/product/no-image.png";
          }}
        />
      </Link>

      {/* اطلاعات محصول */}
      <div className="product-card__info">
        <span className="product-card__brand">{product.brand}</span>

        <Link to={`/products/${product.id}`} className="product-card__name">
          {product.name}
        </Link>

        {/* امتیاز */}
        <div className="product-card__rating">
          <Star size={14} color="var(--color-warning)" fill="var(--color-warning)" />
          <span className="product-card__rating-value">
            {ratingInfo.average.toFixed(1)}
          </span>
          {ratingInfo.count > 0 && (
            <span className="product-card__rating-count">
              ({ratingInfo.count})
            </span>
          )}
        </div>

        {/* قیمت */}
        <div className="product-card__price">
          {product.oldPrice && (
            <span className="product-card__old-price">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <span className="product-card__current-price">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* دکمه‌ها */}
        <div className="product-card__actions">
          <Link
            to={`/products/${product.id}`}
            className="product-card__details-btn"
          >
            جزئیات
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`product-card__add-btn ${added ? "is-added" : ""}`}
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

        {!isOutOfStock && stock <= LOW_STOCK_THRESHOLD && (
          <span className="product-card__low-stock">
            تنها {stock} عدد باقی مانده
          </span>
        )}
      </div>
    </div>
  );
}
