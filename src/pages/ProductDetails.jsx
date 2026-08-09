import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";
import { products, categories } from "../data/products";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { formatPrice } from "../utils/formatPrice";
import ProductCard from "../components/product/ProductCard";

// ======================================================
// ProductDetails
// صفحه جزئیات محصول - نسخه کامل
// ======================================================

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((item) => item.id === Number(id));
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

  // محصولات مرتبط (همان دسته‌بندی)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const categoryName = useMemo(() => {
    if (!product) return "";
    return categories.find((c) => c.id === product.category)?.name || "";
  }, [product]);

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

  // ---------- افزودن به سبد ----------
  // قبلاً اینجا یک حلقه‌ی for اجرا می‌شد و addToCart را quantity بار صدا می‌زد
  // (یعنی quantity بار setState و re-render جدا). حالا CartContext خودش
  // پارامتر quantity را می‌پذیرد، پس فقط یک بار صدا می‌زنیم.
  const handleAddToCart = () => {
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
                      color="#f59e0b"
                      fill={
                        star <= Math.round(product.rating) ? "#f59e0b" : "none"
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
                  {product.rating} از ۵
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
                    onClick={() => setQuantity((q) => q + 1)}
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
                    aria-label="زیاد کردن تعداد"
                  >
                    <Plus size={14} />
                  </button>
                </div>
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
                  style={{
                    flex: 1,
                    minWidth: "180px",
                    padding: "15px 24px",
                    background: added
                      ? "linear-gradient(135deg, #16a34a, #15803d)"
                      : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff",
                    borderRadius: "14px",
                    fontSize: "1rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    border: "none",
                    fontFamily: "inherit",
                    boxShadow: "0 12px 28px rgba(37, 99, 235, 0.28)",
                  }}
                >
                  <ShoppingCart size={20} />
                  {added ? "به سبد اضافه شد ✓" : "افزودن به سبد"}
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
                { label: "امتیاز", value: `${product.rating} از ۵` },
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