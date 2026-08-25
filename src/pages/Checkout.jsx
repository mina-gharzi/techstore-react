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
      <section className="empty-state">
        <ShoppingBag
          size={64}
          color="var(--color-text-faint)"
          style={{ margin: "0 auto 24px" }}
        />
        <h1 className="empty-state__title">سبد خرید خالی است</h1>
        <p className="empty-state__text">
          برای ادامه فرآیند خرید ابتدا محصولی به سبد اضافه کنید.
        </p>
        <Link to="/products" className="btn btn--primary btn--pill">
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
          <div className="alert alert--error">
            {stockError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "30px", alignItems: "start" }}
            className="checkout-layout"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <CheckoutAddressForm formData={formData} errors={errors} handleChange={handleChange} />
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
