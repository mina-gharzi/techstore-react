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

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  if (cart.length === 0) {
    return (
      <section className="empty-state">
        <ShoppingBag size={64} color="var(--color-text-faint)" className="empty-state__icon" />
        <h1 className="empty-state__title">سبد خرید خالی است</h1>
        <p className="empty-state__text">هنوز محصولی به سبد اضافه نکرده‌اید.</p>
        <Link to="/products" className="btn btn--primary btn--pill">
          مشاهده محصولات
        </Link>
      </section>
    );
  }

  return (
    <section className="section--page">
      <div className="container" style={{ maxWidth: "1000px" }}>
        {/* ---------- عنوان ---------- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-9)",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <h1 className="page-header__title" style={{ marginBottom: 0 }}>
            سبد خرید ({totalItems} کالا)
          </h1>

          <button type="button" onClick={clearCart} className="btn btn--ghost" style={{ color: "var(--color-error)" }}>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {cart.map((item) => {
              const exceedsStock = item.quantity > item.stock;

              return (
              <div
                key={item.cartItemId}
                className="card"
                style={{
                  border: exceedsStock ? "1.5px solid var(--color-error-border-strong)" : undefined,
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
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-2)",
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
                      fontSize: "var(--font-size-xl)",
                      fontWeight: "var(--font-weight-bold)",
                      color: "var(--color-text)",
                      textDecoration: "none",
                      display: "block",
                      marginBottom: "var(--space-1p5)",
                    }}
                  >
                    {item.name}
                  </Link>

                  {item.selectedColor && (
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text-muted)",
                        fontWeight: "var(--font-weight-regular)",
                        marginBottom: "var(--space-1p5)",
                      }}
                    >
                      رنگ: {item.selectedColor}
                    </span>
                  )}

                  <span style={{ display: "block", color: "var(--color-primary)", fontWeight: "var(--font-weight-bold)" }}>
                    {formatPrice(item.price)}
                  </span>

                  {exceedsStock && (
                    <span className="alert alert--error" style={{ marginTop: "var(--space-1p5)", fontSize: "var(--font-size-xs)", padding: "var(--space-1) var(--space-2)" }}>
                      <AlertTriangle size={13} />
                      فقط {item.stock} عدد در انبار موجود است
                    </span>
                  )}
                </div>

                {/* کنترل تعداد */}
                <div className="quantity">
                  <button
                    type="button"
                    className="quantity__btn"
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    aria-label="کم کردن تعداد"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="quantity__value">{item.quantity}</span>

                  <button
                    type="button"
                    className="quantity__btn"
                    onClick={() => updateQuantity(item.cartItemId, Math.min(item.stock, item.quantity + 1))}
                    disabled={item.quantity >= item.stock}
                    aria-label="زیاد کردن تعداد"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* قیمت کل */}
                <div
                  style={{
                    fontWeight: "var(--font-weight-extrabold)",
                    color: "var(--color-text)",
                    minWidth: "120px",
                    textAlign: "left",
                  }}
                >
                  {formatPrice(item.price * item.quantity)}
                </div>

                {/* حذف */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="btn btn--icon"
                  style={{ width: "38px", height: "38px", borderRadius: "var(--radius-md)", color: "var(--color-error)" }}
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
          <div className="card" style={{ position: "sticky", top: "90px" }}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-extrabold)", marginBottom: "var(--space-5)", color: "var(--color-text)" }}>
              خلاصه سفارش
            </h2>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-3)", color: "var(--color-text-muted)" }}>
              <span>تعداد کالا</span>
              <span>{totalItems}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "var(--space-5)",
                paddingBottom: "var(--space-5)",
                borderBottom: "1px solid var(--color-border)",
                fontWeight: "var(--font-weight-extrabold)",
                fontSize: "var(--font-size-xl)",
                color: "var(--color-text)",
              }}
            >
              <span>مبلغ کل</span>
              <span style={{ color: "var(--color-primary)" }}>{formatPrice(totalPrice)}</span>
            </div>

            <Link to="/checkout" className="btn btn--primary btn--pill" style={{ width: "100%", display: "block", textAlign: "center" }}>
              ادامه فرآیند خرید
            </Link>

            <Link
              to="/products"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "var(--space-4)",
                color: "var(--color-text-muted)",
                fontWeight: "var(--font-weight-regular)",
                textDecoration: "none",
                fontSize: "var(--font-size-md)",
              }}
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </div>

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
