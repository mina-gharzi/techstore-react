import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useCheckout } from "../hooks/useCheckout";

import CheckoutAddressForm from "../components/checkout/CheckoutAddressForm";
import CheckoutPaymentMethod from "../components/checkout/CheckoutPaymentMethod";
import CheckoutOrderSummary from "../components/checkout/CheckoutOrderSummary";

// ======================================================
// Checkout
// فرم نهایی‌سازی خرید - فقط UI (منطق کسب‌وکار در useCheckout)
// ======================================================

const inputStyle = (hasError) => ({
  width: "100%",
  height: "50px",
  padding: "0 16px",
  border: `1.5px solid ${hasError ? "#fca5a5" : "var(--color-border)"}`,
  borderRadius: "12px",
  fontSize: "0.95rem",
  outline: "none",
  background: hasError ? "var(--color-error-light)" : "var(--color-bg)",
  fontFamily: "inherit",
  color: "var(--color-text)",
});

export default function Checkout() {
  usePageTitle("تکمیل خرید");

  const {
    formData, paymentMethod, setPaymentMethod, errors, handleChange, handleSubmit,
    isSubmitting, stockError,
    couponInput, setCouponInput, appliedCoupon, couponError,
    handleApplyCoupon, handleRemoveCoupon,
    discountAmount, finalTotal,
    cart, totalItems, totalPrice,
  } = useCheckout();

  if (cart.length === 0) {
    return (
      <section style={{ padding: "100px 20px", textAlign: "center" }}>
        <ShoppingBag
          size={64}
          color="var(--color-text-faint)"
          style={{ margin: "0 auto 24px" }}
        />
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "12px" }}>
          سبد خرید خالی است
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "28px" }}>
          برای ادامه فرآیند خرید ابتدا محصولی به سبد اضافه کنید.
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

  return (
    <section style={{ padding: "50px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "8px" }}>
            تکمیل خرید
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1rem" }}>
            اطلاعات ارسال و روش پرداخت را مشخص کنید.
          </p>
        </div>

        {stockError && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 18px",
              background: "var(--color-error-light)",
              border: "1.5px solid #fca5a5",
              borderRadius: "12px",
              color: "#b91c1c",
              fontWeight: 600,
              fontSize: "0.92rem",
              marginBottom: "24px",
            }}
          >
            {stockError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "30px", alignItems: "start" }}
            className="checkout-layout"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <CheckoutAddressForm formData={formData} errors={errors} handleChange={handleChange} inputStyle={inputStyle} />
              <CheckoutPaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
            </div>

            <CheckoutOrderSummary
              cart={cart}
              totalItems={totalItems}
              totalPrice={totalPrice}
              discountAmount={discountAmount}
              finalTotal={finalTotal}
              appliedCoupon={appliedCoupon}
              couponInput={couponInput}
              setCouponInput={setCouponInput}
              couponError={couponError}
              handleApplyCoupon={handleApplyCoupon}
              handleRemoveCoupon={handleRemoveCoupon}
              isSubmitting={isSubmitting}
              stockError={stockError}
            />
          </div>
        </form>
      </div>
    </section>
  );
}
