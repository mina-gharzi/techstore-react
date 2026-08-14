import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  ArrowRight,
  Star,
  Shield,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  MessageSquare,
  BadgeCheck,
  Trash2,
} from "lucide-react";
import { useProducts, getStock } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useReviews } from "../context/ReviewsContext";
import { formatPrice } from "../utils/formatPrice";
import ProductCard from "../components/product/ProductCard";

// ======================================================
// ProductDetails
// صفحه جزئیات محصول - نسخه کامل
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

  // اگه محصول پیدا نشد، عنوان "محصول پیدا نشد" میشه؛ وگرنه اسم
  // خودِ محصول توی تب مرورگر نشون داده میشه.
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

  // پر کردن فرم نظر با نظر قبلی کاربر (اگه قبلاً برای همین محصول
  // نظر داده بود) - این‌جوری وقتی برای ویرایش برمی‌گرده، فرم خالی
  // نیست. این افکت باید قبل از "return" شرطی زیر باشه (Rules of
  // Hooks: هوک‌ها نباید بعد از یک return شرطی صدا زده بشن، وگرنه
  // اگه بعداً product تغییر کنه/حذف بشه، تعداد هوک‌های رندرشده
  // فرق می‌کنه و React ارور می‌ده).
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

  // محصولات مرتبط (همان دسته‌بندی)
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
          style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}
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

  // "خریدار تایید شده": آیا این کاربر واقعاً این محصول رو خریده؟
  // (فقط برای نمایش یه نشان اعتماد کنار نظر، محدودیتی برای ثبت
  // نظر ایجاد نمی‌کنه - خیلی از سایت‌های واقعی هم همینطورن)
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

    // قبلاً وقتی کاربر فقط متن نظر رو تایپ می‌کرد ولی روی هیچ
    // ستاره‌ای کلیک نکرده بود، دکمه‌ی "ثبت نظر" غیرفعال (disabled)
    // می‌موند و کلیک روش هیچ اتفاقی نمی‌افتاد - بدون هیچ توضیحی
    // که چرا. الان دکمه همیشه فعاله، ولی اگه امتیازی انتخاب نشده
    // باشه، یک پیام خطای واضح نشون داده می‌شه.
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

  // ---------- افزودن به سبد ----------
  // قبلاً اینجا یک حلقه‌ی for اجرا می‌شد و addToCart را quantity بار صدا می‌زد
  // (یعنی quantity بار setState و re-render جدا). حالا CartContext خودش
  // پارامتر quantity را می‌پذیرد، پس فقط یک بار صدا می‌زنیم.
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

  const features = [
    { icon: <Shield size={18} color="#2563eb" />, text: "ضمانت اصالت کالا" },
    { icon: <Truck size={18} color="#2563eb" />, text: "ارسال سریع" },
    {
      icon: <RotateCcw size={18} color="#2563eb" />,
      text: "۷ روز ضمانت بازگشت",
    },
  ];

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
              gap: "8px",
              color: "#64748b",
              textDecoration: "none",
              fontWeight: 600,
              marginBottom: "24px",
              fontSize: "0.95rem",
            }}
          >
            <ArrowRight size={18} />
            بازگشت به محصولات
          </Link>

          {/* محتوای اصلی */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "36px",
              alignItems: "start",
              marginBottom: "60px",
            }}
          >
            {/* تصویر */}
            <div
              style={{
                position: "relative",
                background: "#fff",
                borderRadius: "22px",
                padding: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "380px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
              }}
            >
              {discountPercent > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "18px",
                    background: "#ef4444",
                    color: "#fff",
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
                    background: "#2563eb",
                    color: "#fff",
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

            {/* اطلاعات */}
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
                    background: "#eff6ff",
                    color: "#2563eb",
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
                  color: "#0f172a",
                  marginBottom: "14px",
                  lineHeight: 1.4,
                }}
              >
                {product.name}
              </h1>

              {/* امتیاز - قبلاً از product.rating (عدد ثابت توی
                  data/products.js) میومد. الان از میانگین نظرهای
                  واقعی محاسبه میشه (ratingInfo)؛ اگه هنوز نظری
                  ثبت نشده، همون امتیاز پیش‌فرض seed رو نشون میده. */}
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
                      color="#f59e0b"
                      fill={
                        star <= Math.round(ratingInfo.average)
                          ? "#f59e0b"
                          : "none"
                      }
                    />
                  ))}
                </div>
                <span
                  style={{
                    color: "#64748b",
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
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "18px 20px",
                  marginBottom: "22px",
                }}
              >
                {product.oldPrice && (
                  <span
                    style={{
                      display: "block",
                      color: "#94a3b8",
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
                    color: "#2563eb",
                  }}
                >
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* توضیحات */}
              <p
                style={{
                  color: "#64748b",
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
                    <span style={{ fontWeight: 700, color: "#334155" }}>
                      رنگ:
                    </span>
                    <span style={{ color: "#64748b", fontWeight: 600 }}>
                      {selectedColor?.name}
                    </span>
                  </div>

                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    {product.colors.map((color) => {
                      const isActive = selectedColor?.value === color.value;

                      return (
                        <button
                          key={color.value}
                          onClick={() => setSelectedColor(color)}
                          title={color.name}
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            background: color.value,
                            border: isActive
                              ? "3px solid #2563eb"
                              : "2px solid #e2e8f0",
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
                <span style={{ fontWeight: 700, color: "#334155" }}>
                  تعداد:
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "6px 10px",
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      background: "#fff",
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
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      background: "#fff",
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
                {!isOutOfStock && stock <= 5 && (
                  <span
                    style={{
                      color: "#f59e0b",
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
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  style={{
                    flex: 1,
                    minWidth: "180px",
                    padding: "15px 24px",
                    background: isOutOfStock
                      ? "#e2e8f0"
                      : added
                        ? "linear-gradient(135deg, #16a34a, #15803d)"
                        : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: isOutOfStock ? "#94a3b8" : "#fff",
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
                  onClick={() => toggleFavorite(product)}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    border: "1.5px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isFavorite(product.id) ? "#ef4444" : "#94a3b8",
                    cursor: "pointer",
                    background: "#fff",
                  }}
                  aria-label="افزودن به علاقه‌مندی‌ها"
                >
                  <Heart
                    size={22}
                    fill={isFavorite(product.id) ? "#ef4444" : "none"}
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
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: "#334155",
                    }}
                  >
                    {item.icon}
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* مشخصات */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              padding: "28px 24px",
              marginBottom: "50px",
            }}
          >
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#0f172a",
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
                    background: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <span style={{ color: "#64748b", fontWeight: 600 }}>
                    {row.label}
                  </span>
                  <span style={{ color: "#0f172a", fontWeight: 800 }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ===================== نظرات کاربران ===================== */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              padding: "28px 24px",
              marginBottom: "50px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <MessageSquare size={20} color="#2563eb" />
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                نظرات کاربران
                {ratingInfo.count > 0 && (
                  <span
                    style={{
                      color: "#94a3b8",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    {" "}
                    ({ratingInfo.count})
                  </span>
                )}
              </h2>
            </div>

            {/* ---------- فرم ثبت/ویرایش نظر ---------- */}
            {isAuthenticated ? (
              <form
                onSubmit={handleReviewSubmit}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "28px",
                }}
              >
                <div style={{ marginBottom: "14px" }}>
                  <span
                    style={{
                      display: "block",
                      fontWeight: 700,
                      color: "#334155",
                      marginBottom: "8px",
                      fontSize: "0.92rem",
                    }}
                  >
                    {myReview ? "ویرایش امتیاز شما" : "امتیاز شما"}
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setReviewRating(star);
                          setReviewError("");
                        }}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        style={{ cursor: "pointer", padding: "2px" }}
                        aria-label={`امتیاز ${star} از ۵`}
                      >
                        <Star
                          size={26}
                          color="#f59e0b"
                          fill={
                            star <= (hoveredStar || reviewRating)
                              ? "#f59e0b"
                              : "none"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  {reviewError && (
                    <span
                      style={{
                        display: "block",
                        marginTop: "8px",
                        color: "#ef4444",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                      }}
                    >
                      {reviewError}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="نظر خود را درباره این محصول بنویسید (اختیاری)..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "0.92rem",
                      outline: "none",
                      background: "#fff",
                      fontFamily: "inherit",
                      color: "#0f172a",
                      resize: "vertical",
                      lineHeight: 1.7,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="submit"
                    style={{
                      padding: "11px 26px",
                      background: reviewSaved ? "#16a34a" : "#2563eb",
                      color: "#fff",
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {reviewSaved
                      ? "ثبت شد ✓"
                      : myReview
                        ? "ذخیره ویرایش"
                        : "ثبت نظر"}
                  </button>

                  {myReview && (
                    <button
                      type="button"
                      onClick={handleDeleteReview}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#ef4444",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={14} />
                      حذف نظر من
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "18px 20px",
                  marginBottom: "28px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#64748b",
                    marginBottom: "12px",
                    fontSize: "0.9rem",
                  }}
                >
                  برای ثبت نظر و امتیاز، ابتدا وارد حساب کاربری خود شوید.
                </p>
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  style={{
                    display: "inline-block",
                    padding: "9px 22px",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  ورود به حساب
                </Link>
              </div>
            )}

            {/* ---------- لیست نظرها ---------- */}
            {productReviews.length === 0 ? (
              <p
                style={{
                  color: "#94a3b8",
                  textAlign: "center",
                  padding: "20px 0",
                  fontSize: "0.9rem",
                }}
              >
                هنوز نظری برای این محصول ثبت نشده - اولین نفر باشید!
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {productReviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      paddingBottom: "16px",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginBottom: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            background: "#eff6ff",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          {review.userName?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 700,
                                color: "#0f172a",
                                fontSize: "0.88rem",
                              }}
                            >
                              {review.userName}
                            </span>
                            {hasPurchased && review.userId === user?.id && (
                              <span
                                title="خریدار تایید شده"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "3px",
                                  color: "#16a34a",
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                }}
                              >
                                <BadgeCheck size={13} />
                                خریدار
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "1px",
                              marginTop: "2px",
                            }}
                          >
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={13}
                                color="#f59e0b"
                                fill={
                                  star <= review.rating ? "#f59e0b" : "none"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.78rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(review.createdAt).toLocaleDateString(
                          "fa-IR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    {review.comment && (
                      <p
                        style={{
                          color: "#475569",
                          fontSize: "0.9rem",
                          lineHeight: 1.8,
                          marginRight: "42px",
                        }}
                      >
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* محصولات مرتبط */}
          {relatedProducts.length > 0 && (
            <div>
              <div style={{ marginBottom: "28px" }}>
                <h2
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: "6px",
                  }}
                >
                  محصولات مرتبط
                </h2>
                <p style={{ color: "#64748b" }}>
                  محصولات مشابه از همین دسته‌بندی
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "20px",
                }}
              >
                {relatedProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
