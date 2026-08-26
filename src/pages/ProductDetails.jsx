import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowRight, Shield, Truck, RotateCcw } from "lucide-react";
import { useProducts, getStock } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useReviews } from "../context/ReviewsContext";

import ProductImage from "../components/product/ProductImage";
import ProductInfo from "../components/product/ProductInfo";
import ProductSpecs from "../components/product/ProductSpecs";
import ProductReviews from "../components/product/ProductReviews";
import ProductRelated from "../components/product/ProductRelated";

// ======================================================
// ProductDetails
// صفحه جزئیات محصول
// ======================================================

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user, isAuthenticated } = useAuth();
  const { getOrdersByUser } = useOrders();
  const {
    getReviewsByProduct,
    getAverageRating,
    getUserReview,
    submitReview,
    deleteReview,
  } = useReviews();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // ---------- فرم نظر ----------
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSaved, setReviewSaved] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const product = products.find((item) => item.id === Number(id));

  usePageTitle(product ? product.name : "محصول پیدا نشد");
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0]);
    } else {
      setSelectedColor(null);
    }
    setQuantity(1);
    setAdded(false);
  }, [product]);

  useEffect(() => {
    if (!product || !isAuthenticated) {
      setReviewRating(0);
      setReviewComment("");
      return;
    }
    const existing = getUserReview(product.id, user.id);
    if (existing) {
      setReviewRating(existing.rating);
      setReviewComment(existing.comment);
    } else {
      setReviewRating(0);
      setReviewComment("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, isAuthenticated, user?.id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  const categoryName = useMemo(() => {
    if (!product) return "";
    return categories.find((c) => c.id === product.category)?.name || "";
  }, [product, categories]);

  const discountPercent = useMemo(() => {
    if (!product?.oldPrice || product.oldPrice <= product.price) return 0;
    return Math.round(
      ((product.oldPrice - product.price) / product.oldPrice) * 100,
    );
  }, [product]);

  if (!product) {
    return (
      <section style={{ padding: "80px 16px", textAlign: "center" }}>
        <h1
          style={{ fontSize: "1.8rem", marginBottom: "16px", fontWeight: 800 }}
        >
          محصول پیدا نشد
        </h1>
        <Link
          to="/products"
          style={{ color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }}
        >
          بازگشت به محصولات
        </Link>
      </section>
    );
  }

  const stock = getStock(product);
  const isOutOfStock = stock <= 0;

  // ---------- نظرها و امتیاز ----------
  const productReviews = getReviewsByProduct(product.id);
  const ratingInfo = getAverageRating(product.id, product.rating);
  const myReview = isAuthenticated ? getUserReview(product.id, user.id) : null;

  const hasPurchased =
    isAuthenticated &&
    getOrdersByUser(user.id).some(
      (order) =>
        order.status !== "لغو شده" &&
        order.items?.some((item) => item.id === product.id),
    );

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    if (reviewRating === 0) {
      setReviewError("لطفاً یک امتیاز (حداقل ۱ ستاره) انتخاب کنید");
      return;
    }

    setReviewError("");
    submitReview(product.id, user.id, user.fullName, {
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewSaved(true);
    setTimeout(() => setReviewSaved(false), 2000);
  };

  const handleDeleteReview = () => {
    if (!myReview) return;
    const confirmed = window.confirm("نظر شما حذف شود؟");
    if (confirmed) {
      deleteReview(myReview.id);
      setReviewRating(0);
      setReviewComment("");
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const itemToAdd = {
      ...product,
      selectedColor: selectedColor?.name || null,
    };

    addToCart(itemToAdd, quantity);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <section style={{ padding: "30px 16px 50px" }}>
        <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
          {/* بازگشت */}
          <Link
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--color-text-muted)",
              fontWeight: 600,
              fontSize: "var(--font-size-md)",
              textDecoration: "none",
              marginBottom: "24px",
            }}
          >
            <ArrowRight size={18} />
            بازگشت به محصولات
          </Link>

          {/* گرید اصلی: تصویر + اطلاعات */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "36px",
              marginBottom: "40px",
            }}
          >
            <ProductImage product={product} discountPercent={discountPercent} />
            <ProductInfo
              product={product}
              categoryName={categoryName}
              ratingInfo={ratingInfo}
              discountPercent={discountPercent}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              quantity={quantity}
              setQuantity={setQuantity}
              stock={stock}
              isOutOfStock={isOutOfStock}
              added={added}
              handleAddToCart={handleAddToCart}
              toggleFavorite={toggleFavorite}
              isFavoriteFunc={isFavorite}
            />
          </div>

          {/* مشخصات محصول */}
          <ProductSpecs
            product={product}
            categoryName={categoryName}
            ratingInfo={ratingInfo}
          />

          {/* نظرات کاربران */}
          <ProductReviews
            productReviews={productReviews}
            ratingInfo={ratingInfo}
            myReview={myReview}
            hasPurchased={hasPurchased}
            reviewRating={reviewRating}
            setReviewRating={setReviewRating}
            hoveredStar={hoveredStar}
            setHoveredStar={setHoveredStar}
            reviewComment={reviewComment}
            setReviewComment={setReviewComment}
            reviewSaved={reviewSaved}
            reviewError={reviewError}
            handleReviewSubmit={handleReviewSubmit}
            handleDeleteReview={handleDeleteReview}
            isAuthenticated={isAuthenticated}
            user={user}
            location={location}
          />

          {/* محصولات مرتبط */}
          <ProductRelated relatedProducts={relatedProducts} />
        </div>
      </section>
    </div>
  );
}
