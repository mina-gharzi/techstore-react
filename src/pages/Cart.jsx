import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

// ======================================================
// Cart
// صفحه سبد خرید
// ======================================================

export default function Cart() {
  // ---------- Context ----------
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  // ---------- اگر سبد خالی بود ----------
  if (cart.length === 0) {
    return (
      <section
        style={{
          padding: "100px 20px",
          textAlign: "center",
        }}
      >
        <ShoppingBag
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
          سبد خرید خالی است
        </h1>
        <p style={{ color: "#64748b", marginBottom: "28px" }}>
          هنوز محصولی به سبد اضافه نکرده‌اید.
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
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* ---------- عنوان ---------- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "36px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            سبد خرید ({totalItems} کالا)
          </h1>

          <button
            onClick={clearCart}
            style={{
              color: "#ef4444",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            حذف همه
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "30px",
            alignItems: "start",
          }}
          className="cart-layout"
        >
          {/* ---------- لیست محصولات ---------- */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "18px",
                  display: "flex",
                  gap: "18px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {/* تصویر */}
                <Link to={`/products/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "contain",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      padding: "8px",
                    }}
                    onError={(e) => {
                      e.target.src = "/assets/images/product/no-image.png";
                    }}
                  />
                </Link>

                {/* اطلاعات */}
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <Link
                    to={`/products/${item.id}`}
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#0f172a",
                      textDecoration: "none",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    {item.name}
                  </Link>

                  {/* رنگ انتخابی - اگر محصول واریانت رنگ داشته باشد */}
                  {item.selectedColor && (
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.82rem",
                        color: "#64748b",
                        fontWeight: 600,
                        marginBottom: "6px",
                      }}
                    >
                      رنگ: {item.selectedColor}
                    </span>
                  )}

                  <span
                    style={{
                      display: "block",
                      color: "#2563eb",
                      fontWeight: 700,
                    }}
                  >
                    {formatPrice(item.price)}
                  </span>
                </div>

                {/* کنترل تعداد */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "#f8fafc",
                    borderRadius: "10px",
                    padding: "6px 10px",
                  }}
                >
                  <button
                    onClick={() =>
                      updateQuantity(item.cartItemId, item.quantity - 1)
                    }
                    style={{
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      cursor: "pointer",
                    }}
                    aria-label="کم کردن تعداد"
                  >
                    <Minus size={14} />
                  </button>

                  <span
                    style={{
                      fontWeight: 700,
                      minWidth: "24px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item.cartItemId, item.quantity + 1)
                    }
                    style={{
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      cursor: "pointer",
                    }}
                    aria-label="زیاد کردن تعداد"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* قیمت کل این آیتم */}
                <div
                  style={{
                    fontWeight: 800,
                    color: "#0f172a",
                    minWidth: "120px",
                    textAlign: "left",
                  }}
                >
                  {formatPrice(item.price * item.quantity)}
                </div>

                {/* دکمه حذف */}
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  style={{
                    width: "38px",
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    color: "#ef4444",
                    cursor: "pointer",
                  }}
                  title="حذف"
                  aria-label="حذف از سبد"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* ---------- خلاصه سفارش ---------- */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "24px",
              position: "sticky",
              top: "90px",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                marginBottom: "20px",
                color: "#0f172a",
              }}
            >
              خلاصه سفارش
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                color: "#64748b",
              }}
            >
              <span>تعداد کالا</span>
              <span>{totalItems}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom: "1px solid #e2e8f0",
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "#0f172a",
              }}
            >
              <span>مبلغ کل</span>
              <span style={{ color: "#2563eb" }}>
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/*
              نکته: این دکمه به /checkout لینک شده، اما این مسیر هنوز
              در routes.jsx تعریف نشده. وقتی صفحه‌ی Checkout رو ساختی،
              کافیه یک <Route path="/checkout" element={<Checkout />} />
              به routes.jsx اضافه کنی؛ لینک از همین الان درست کار می‌کنه.
            */}
            <Link
              to="/checkout"
              style={{
                display: "block",
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#fff",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "1rem",
                textAlign: "center",
                cursor: "pointer",
                boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
                textDecoration: "none",
              }}
            >
              ادامه فرآیند خرید
            </Link>

            <Link
              to="/products"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "14px",
                color: "#64748b",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.95rem",
              }}
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </div>

      {/* ریسپانسیو: زیر ۸۰۰px، خلاصه سفارش زیر لیست محصولات می‌آید */}
      <style>{`
        @media (max-width: 800px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}