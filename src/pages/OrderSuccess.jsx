import { Link, useLocation, Navigate } from "react-router-dom";
import { CheckCircle2, Package, CreditCard, Wallet } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatPrice } from "../utils/formatPrice";

// ======================================================
// OrderSuccess
// صفحه‌ی تایید بعد از ثبت موفق سفارش
//
// نکته: این صفحه اطلاعاتش رو از location.state می‌گیره که توی
// Checkout.jsx موقع navigate() ارسال شده. اگر کسی مستقیم آدرس
// /order-success رو باز کنه (بدون این‌که واقعاً سفارشی ثبت کرده
// باشه)، state خالیه و به‌جای نمایش اطلاعات جعلی، به صفحه اصلی
// هدایت می‌شه.
// ======================================================

export default function OrderSuccess() {
  usePageTitle("سفارش ثبت شد");

  const location = useLocation();
  const orderInfo = location.state;

  // اگر مستقیم وارد این صفحه شده (رفرش یا لینک مستقیم) و سفارشی در کار نبوده
  if (!orderInfo) {
    return <Navigate to="/" replace />;
  }

  const { orderNumber, totalPrice, discountAmount, totalItems, paymentMethod, customerName } =
    orderInfo;

  return (
    <section style={{ padding: "80px 20px", textAlign: "center" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <div
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "50%",
            background: "#f0fdf4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 26px",
          }}
        >
          <CheckCircle2 size={48} color="var(--color-success)" />
        </div>

        <h1
          style={{
            fontSize: "1.9rem",
            fontWeight: 900,
            color: "var(--color-text)",
            marginBottom: "10px",
          }}
        >
          سفارش شما ثبت شد
        </h1>

        <p style={{ color: "var(--color-text-muted)", marginBottom: "36px", lineHeight: 1.9 }}>
          {customerName ? `${customerName} عزیز، ` : ""}
          از خرید شما متشکریم. جزئیات سفارش برایتان پیامک می‌شود.
        </p>

        {/* کارت جزئیات سفارش */}
        <div
          style={{
            background: "var(--color-bg-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "18px",
            padding: "26px",
            textAlign: "right",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: "1px dashed var(--color-border)",
            }}
          >
            <Package size={20} color="var(--color-primary)" />
            <span style={{ fontWeight: 800, color: "var(--color-text)" }}>
              کد پیگیری: {orderNumber}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
              color: "var(--color-text-muted)",
              fontSize: "0.95rem",
            }}
          >
            <span>تعداد کالا</span>
            <span style={{ color: "var(--color-text)", fontWeight: 700 }}>{totalItems}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
              color: "var(--color-text-muted)",
              fontSize: "0.95rem",
            }}
          >
            <span>روش پرداخت</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--color-text)",
                fontWeight: 700,
              }}
            >
              {paymentMethod === "online" ? (
                <>
                  <CreditCard size={16} />
                  پرداخت آنلاین
                </>
              ) : (
                <>
                  <Wallet size={16} />
                  پرداخت در محل
                </>
              )}
            </span>
          </div>

          {discountAmount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                color: "var(--color-success)",
                fontSize: "0.95rem",
                fontWeight: 700,
              }}
            >
              <span>تخفیف اعمال‌شده</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "14px",
              borderTop: "1px solid var(--color-border)",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "var(--color-text)",
            }}
          >
            <span>مبلغ پرداخت‌شده</span>
            <span style={{ color: "var(--color-primary)" }}>{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/products"
            style={{
              padding: "13px 28px",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
              color: "var(--color-bg-white)",
              borderRadius: "12px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ادامه خرید
          </Link>
          <Link
            to="/"
            style={{
              padding: "13px 28px",
              background: "var(--color-bg-white)",
              color: "var(--color-text-secondary)",
              border: "1.5px solid var(--color-border)",
              borderRadius: "12px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </section>
  );
}