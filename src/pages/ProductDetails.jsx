import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts, getStock } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useReviews } from "../context/ReviewsContext";
import { TIMEOUT_REVIEW_SAVED } from "../utils/constants";

import ProductImage from "../components/product/ProductImage";
import ProductInfo from "../components/product/ProductInfo";
import ProductSpecs from "../components/product/ProductSpecs";
import ProductReviews from "../components/product/ProductReviews";
import ProductRelated from "../components/product/ProductRelated";

// ======================================================
// ProductDetails
// صفحه جزئیات محصول
//
// state با key={id} ریست می‌شه (وقتی route عوض بشه).
// نیازی به useEffect برای sync state نیست.
// ======================================================

function ProductDetailsInner({ id, location }) {
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

  const product = products.find((item) => item.id === Number(id));
  usePageTitle(product ? product.name : "محصول پیدا نشد");

  // ---------- state (initializers from product — no useEffect needed) ----------
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.length ? product.colors[0] : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  // ---------- فرم نظر ----------
  const existingReview = product && isAuthenticated && user
    ? getUserReview(product.id, user.id)
    : null;

  const [reviewRating, setReviewRating] = useState(existingReview?.rating ?? 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewComment, setReviewComment] = useState(existingReview?.comment ?? "");
  const [reviewSaved, setReviewSaved] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // وقتی کاربر لاگین/لاگاوت می‌کنه، فرم نظر رو ریست کن
  const prevUserId = user?.id ?? null;
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    const review = product && isAuthenticated && user
      ? getUserReview(product.id, user.id)
      : null;
    setReviewRating(review?.rating ?? 0);
    setReviewComment(review?.comment ?? "");
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  }, [prevUserId]);

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

  // stock به selectedColor وابسته‌ست تا اگه موجودی رنگی اضافه شد، ریکامپوت بشه
  const stock = useMemo(() => getStock(product), [product, selectedColor]);
  const isOutOfStock = stock <= 0;

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
    setTimeout(() => {
      if (mountedRef.current) setReviewSaved(false);
    }, TIMEOUT_REVIEW_SAVED);
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
    setTimeout(() => {
      if (mountedRef.current) setAdded(false);
    }, 2000);
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
              fontSize: "0.92rem",
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
            setReviewError={setReviewError}
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

// ======================================================
// ProductDetails — wrapper: key={id} state رو ریست می‌کنه
// ======================================================
export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  return <ProductDetailsInner key={id} id={id} location={location} />;
}
