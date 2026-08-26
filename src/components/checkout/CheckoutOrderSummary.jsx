import { Link } from "react-router-dom";
import { Tag, X } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";

export default function CheckoutOrderSummary({
  cart,
  totalItems,
  totalPrice,
  discountAmount,
  finalTotal,
  appliedCoupon,
  couponInput,
  setCouponInput,
  couponError,
  handleApplyCoupon,
  handleRemoveCoupon,
  isSubmitting,
  stockError,
}) {
  return (
    <>
      <div
        style={{
          background: "var(--color-bg-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "18px",
          padding: "24px",
          position: "sticky",
          top: "90px",
        }}
      >
        <h2
          style={{
            fontSize: "1.15rem",
            fontWeight: 800,
            marginBottom: "18px",
            color: "var(--color-text)",
          }}
        >
          خلاصه سفارش
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "18px",
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                fontSize: "var(--font-size-base)",
              }}
            >
              <span style={{ color: "var(--color-text-secondary)" }}>
                {item.name}
                {item.selectedColor ? ` (${item.selectedColor})` : ""} ×{" "}
                {item.quantity}
              </span>
              <span style={{ color: "var(--color-text)", fontWeight: 700, whiteSpace: "nowrap" }}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "18px", paddingTop: "14px", borderTop: "1px solid var(--color-border)" }}>
          {appliedCoupon ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--green-50)",
                border: "1px solid var(--green-200)",
                borderRadius: "10px",
                padding: "10px 12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Tag size={15} color="var(--color-success)" />
                <span style={{ fontWeight: 700, color: "var(--color-success)", fontSize: "var(--font-size-base)" }}>
                  {appliedCoupon.code} ({appliedCoupon.description})
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                aria-label="حذف کد تخفیف"
                style={{
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    if (couponError) setCouponError("");
                  }}
                  placeholder="کد تخفیف"
                  style={{
                    flex: 1,
                    height: "42px",
                    padding: "0 12px",
                    border: `1.5px solid ${couponError ? "var(--red-300)" : "var(--color-border)"}`,
                    borderRadius: "10px",
                    fontSize: "var(--font-size-base)",
                    outline: "none",
                    background: couponError ? "var(--color-error-light)" : "var(--color-bg)",
                    fontFamily: "inherit",
                    color: "var(--color-text)",
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  style={{
                    padding: "0 16px",
                    background: "var(--slate-100)",
                    color: "var(--color-text-secondary)",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "var(--font-size-base)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  اعمال کد
                </button>
              </div>
              {couponError && (
                <span style={{ display: "block", marginTop: "6px", color: "var(--color-error)", fontSize: "var(--font-size-sm)", fontWeight: 600 }}>
                  {couponError}
                </span>
              )}
              <span style={{ display: "block", marginTop: "6px", color: "var(--color-text-faint)", fontSize: "var(--font-size-sm)" }}>
                کدهای نمونه: WELCOME10 یا TECH50
              </span>
            </div>
          )}
        </div>

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
            marginBottom: "12px",
            color: "var(--color-text-muted)",
            fontSize: "var(--font-size-md)",
          }}
        >
          <span>مبلغ کل</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        {appliedCoupon && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
              color: "var(--color-success)",
              fontSize: "var(--font-size-md)",
              fontWeight: 700,
            }}
          >
            <span>تخفیف</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "22px",
            paddingBottom: "20px",
            borderBottom: "1px solid var(--color-border)",
            fontWeight: 800,
            fontSize: "1.15rem",
            color: "var(--color-text)",
          }}
        >
          <span>مبلغ قابل پرداخت</span>
          <span style={{ color: "var(--color-primary)" }}>{formatPrice(finalTotal)}</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "14px",
            background: isSubmitting
              ? "var(--blue-300)"
              : "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
            color: "var(--color-bg-white)",
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: "var(--font-size-lg)",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            border: "none",
            fontFamily: "inherit",
            boxShadow: isSubmitting
              ? "none"
              : "var(--shadow-cta)",
          }}
        >
          {isSubmitting ? "در حال ثبت سفارش..." : "ثبت نهایی سفارش"}
        </button>

        <Link
          to="/cart"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "14px",
            color: "var(--color-text-muted)",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "var(--font-size-md)",
          }}
        >
          بازگشت به سبد خرید
        </Link>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
