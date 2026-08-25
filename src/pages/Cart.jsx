import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, AlertTriangle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatPrice } from "../utils/formatPrice";

// ======================================================
// Cart
// صفحه سبد خرید
// ======================================================

export default function Cart() {
  usePageTitle("سبد خرید");

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
          color="var(--color-text-faint)"
          style={{ margin: "0 auto 24px" }}
        />
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "var(--color-text)",
            marginBottom: "12px",
          }}
        >
          سبد خرید خالی است
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "28px" }}>
          هنوز محصولی به سبد اضافه نکرده‌اید.
        </p>
        <Link
          to="/products"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "var(--color-primary)",
            color: "var(--color-bg-white)",
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
              color: "var(--color-text)",
            }}
          >
            سبد خرید ({totalItems} کالا)
          </h1>

          <button
            onClick={clearCart}
            style={{
              color: "var(--color-error)",
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
            {cart.map((item) => {
              const exceedsStock = item.quantity > item.stock;

              return (
              <div
                key={item.cartItemId}
                style={{
                  background: "var(--color-bg-white)",
                  border: exceedsStock ? "1.5px solid #fca5a5" : "1px solid var(--color-border)",
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
                      background: "var(--color-bg)",
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
                      color: "var(--color-text)",
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
                        color: "var(--color-text-muted)",
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
                      color: "var(--color-primary)",
                      fontWeight: 700,
                    }}
                  >
                    {formatPrice(item.price)}
                  </span>

                  {/* هشدار: اگه موجودی از وقتی این آیتم به سبد اضافه شده کم شده باشه */}
                  {exceedsStock && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        marginTop: "6px",
                        color: "var(--color-error)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      <AlertTriangle size={13} />
                      فقط {item.stock} عدد در انبار موجود است
                    </span>
                  )}
                </div>

                {/* کنترل تعداد */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "var(--color-bg)",
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
                      background: "var(--color-bg-white)",
                      border: "1px solid var(--color-border)",
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
                      updateQuantity(item.cartItemId, Math.min(item.stock, item.quantity + 1))
                    }
                    disabled={item.quantity >= item.stock}
                    style={{
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      background: "var(--color-bg-white)",
                      border: "1px solid var(--color-border)",
                      cursor: item.quantity >= item.stock ? "not-allowed" : "pointer",
                      opacity: item.quantity >= item.stock ? 0.5 : 1,
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
                    color: "var(--color-text)",
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
                    color: "var(--color-error)",
                    cursor: "pointer",
                  }}
                  title="حذف"
                  aria-label="حذف از سبد"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              );
            })}
          </div>

          {/* ---------- خلاصه سفارش ---------- */}
          <div
            style={{
              background: "var(--color-bg-white)",
              border: "1px solid var(--color-border)",
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
                color: "var(--color-text)",
              }}
            >
              خلاصه سفارش
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                color: "var(--color-text-muted)",
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
                borderBottom: "1px solid var(--color-border)",
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "var(--color-text)",
              }}
            >
              <span>مبلغ کل</span>
              <span style={{ color: "var(--color-primary)" }}>
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
                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                color: "var(--color-bg-white)",
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
                color: "var(--color-text-muted)",
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