import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, CreditCard, Wallet, MapPin, AlertTriangle, Tag, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import { useProducts, getStock } from "../context/ProductsContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatPrice } from "../utils/formatPrice";

// ======================================================
// Checkout
// فرم نهایی‌سازی خرید (آدرس + روش پرداخت + کد تخفیف)
//
// نکته: چون هنوز به یک درگاه پرداخت واقعی وصل نیستیم، این صفحه
// یک فرآیند "fake" رو شبیه‌سازی می‌کنه: فرم رو اعتبارسنجی می‌کنه،
// یک تاخیر کوتاه (شبیه درخواست به سرور) می‌ذاره، سبد رو خالی
// می‌کنه و کاربر رو به صفحه‌ی "سفارش ثبت شد" هدایت می‌کنه.
// وقتی یک API واقعی آماده شد، فقط باید تابع handleSubmit عوض بشه.
// ======================================================

// ---------- کدهای تخفیف ----------
// فعلاً یک لیست ثابت توی خودِ فرانت‌اند. در یک پروژه‌ی واقعی این
// لیست باید سمت سرور اعتبارسنجی بشه (وگرنه هرکسی با نگاه کردن به
// کد جاوااسکریپت می‌تونه کدهای تخفیف رو ببینه).
const COUPONS = {
  WELCOME10: { type: "percent", value: 10, description: "۱۰٪ تخفیف" },
  TECH50: { type: "fixed", value: 5000000, description: "۵,۰۰۰,۰۰۰ تومان تخفیف" },
};

export default function Checkout() {
  usePageTitle("تکمیل خرید");

  const navigate = useNavigate();
  const { cart, totalItems, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const { products, updateProduct } = useProducts();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockError, setStockError] = useState("");

  // ---------- کد تخفیف ----------
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, type, value, description }
  const [couponError, setCouponError] = useState("");

  const discountAmount = (() => {
    if (!appliedCoupon) return 0;
    const raw =
      appliedCoupon.type === "percent"
        ? (totalPrice * appliedCoupon.value) / 100
        : appliedCoupon.value;
    // تخفیف هیچ‌وقت نباید از مبلغ کل بیشتر بشه (مثلاً یه کد تخفیف ثابت
    // روی یه سبد خیلی کوچیک)
    return Math.min(raw, totalPrice);
  })();

  const finalTotal = totalPrice - discountAmount;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError("یک کد تخفیف وارد کنید");
      return;
    }

    const coupon = COUPONS[code];

    if (!coupon) {
      setCouponError("کد تخفیف معتبر نیست");
      return;
    }

    setAppliedCoupon({ code, ...coupon });
    setCouponError("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  // ---------- اگر سبد خالی بود ----------
  if (cart.length === 0) {
    return (
      <section style={{ padding: "100px 20px", textAlign: "center" }}>
        <ShoppingBag size={64} color="#94a3b8" style={{ margin: "0 auto 24px" }} />
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
          برای ادامه فرآیند خرید ابتدا محصولی به سبد اضافه کنید.
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

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // با تایپ دوباره، خطای همون فیلد پاک بشه
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "نام و نام خانوادگی را وارد کنید";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "شماره موبایل را وارد کنید";
    } else if (!/^09\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود";
    }

    if (!formData.city.trim()) {
      newErrors.city = "شهر را وارد کنید";
    }

    if (!formData.address.trim()) {
      newErrors.address = "آدرس کامل را وارد کنید";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "کد پستی را وارد کنید";
    } else if (!/^\d{10}$/.test(formData.postalCode.trim())) {
      newErrors.postalCode = "کد پستی باید ۱۰ رقم باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // بازبینی موجودی درست قبل از ثبت نهایی - چون ممکنه بین لحظه‌ی
    // افزودن به سبد و همین الان، ادمین موجودی رو کم کرده باشه یا
    // یه کاربر دیگه همون موجودی رو خریده باشه. بدون این چک، سفارش
    // بیشتر از موجودی واقعی ثبت می‌شد.
    const outOfStockItems = cart.filter((item) => {
      const liveProduct = products.find((p) => p.id === item.id);
      const liveStock = liveProduct ? getStock(liveProduct) : getStock(item);
      return item.quantity > liveStock;
    });

    if (outOfStockItems.length > 0) {
      setStockError(
        `موجودی «${outOfStockItems[0].name}» کافی نیست. لطفاً به سبد خرید برگردید و تعداد را اصلاح کنید.`,
      );
      return;
    }

    setStockError("");
    setIsSubmitting(true);

    // شبیه‌سازی زمان پردازش سفارش/اتصال به درگاه پرداخت
    setTimeout(() => {
      const orderNumber = `TS-${Date.now().toString().slice(-8)}`;

      // یک snapshot از سبد قبل از خالی کردنش می‌گیریم، چون بعد از
      // clearCart() دیگه به آیتم‌های سبد دسترسی نداریم و برای
      // تاریخچه‌ی خرید توی پروفایل بهشون نیاز داریم.
      addOrder({
        orderNumber,
        userId: user.id,
        items: cart,
        subtotal: totalPrice,
        couponCode: appliedCoupon?.code || null,
        discountAmount,
        totalPrice: finalTotal,
        totalItems,
        paymentMethod,
        customerName: formData.fullName,
        shippingAddress: {
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
      });

      // موجودی هر محصول رو به اندازه‌ی تعداد خریداری‌شده کم می‌کنیم
      cart.forEach((item) => {
        const liveProduct = products.find((p) => p.id === item.id);
        if (liveProduct) {
          const currentStock = getStock(liveProduct);
          updateProduct(item.id, { stock: Math.max(0, currentStock - item.quantity) });
        }
      });

      // سفارش "ثبت" شد → سبد باید خالی بشه
      clearCart();

      navigate("/order-success", {
        state: {
          orderNumber,
          totalPrice: finalTotal,
          discountAmount,
          totalItems,
          paymentMethod,
          customerName: formData.fullName,
        },
      });
    }, 900);
  };

  // ---------- استایل مشترک اینپوت‌ها ----------
  const inputStyle = (hasError) => ({
    width: "100%",
    height: "50px",
    padding: "0 16px",
    border: `1.5px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
    borderRadius: "12px",
    fontSize: "0.95rem",
    outline: "none",
    background: hasError ? "#fef2f2" : "#f8fafc",
    fontFamily: "inherit",
    color: "#0f172a",
  });

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: 700,
    color: "#1e293b",
    fontSize: "0.92rem",
  };

  const errorStyle = {
    display: "block",
    marginTop: "6px",
    color: "#ef4444",
    fontSize: "0.82rem",
    fontWeight: 600,
  };

  return (
    <section style={{ padding: "50px 20px 80px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* ---------- عنوان ---------- */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "8px",
            }}
          >
            تکمیل خرید
          </h1>
          <p style={{ color: "#64748b" }}>
            اطلاعات ارسال و روش پرداخت را مشخص کنید.
          </p>
        </div>

        {stockError && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#ef4444",
              borderRadius: "12px",
              padding: "14px 16px",
              fontSize: "0.9rem",
              fontWeight: 600,
              marginBottom: "24px",
            }}
          >
            <AlertTriangle size={18} />
            {stockError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "24px",
              alignItems: "start",
            }}
            className="checkout-layout"
          >
            {/* ===================== فرم آدرس + پرداخت ===================== */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* اطلاعات گیرنده */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "26px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <MapPin size={20} color="#2563eb" />
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
                    اطلاعات ارسال
                  </h2>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>نام و نام خانوادگی</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="مثلاً: مینا قرضی"
                      style={inputStyle(!!errors.fullName)}
                    />
                    {errors.fullName && <span style={errorStyle}>{errors.fullName}</span>}
                  </div>

                  <div>
                    <label style={labelStyle}>شماره موبایل</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="09xxxxxxxxx"
                      style={inputStyle(!!errors.phone)}
                    />
                    {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>شهر</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="مثلاً: تهران"
                      style={inputStyle(!!errors.city)}
                    />
                    {errors.city && <span style={errorStyle}>{errors.city}</span>}
                  </div>

                  <div>
                    <label style={labelStyle}>کد پستی</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="۱۰ رقم"
                      style={inputStyle(!!errors.postalCode)}
                    />
                    {errors.postalCode && (
                      <span style={errorStyle}>{errors.postalCode}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>آدرس کامل</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="خیابان، کوچه، پلاک، واحد..."
                    style={{
                      ...inputStyle(!!errors.address),
                      height: "auto",
                      padding: "14px 16px",
                      resize: "vertical",
                      lineHeight: 1.7,
                    }}
                  />
                  {errors.address && <span style={errorStyle}>{errors.address}</span>}
                </div>
              </div>

              {/* روش پرداخت */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "26px",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: "20px",
                  }}
                >
                  روش پرداخت
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* پرداخت آنلاین */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "16px",
                      border: `1.5px solid ${
                        paymentMethod === "online" ? "#2563eb" : "#e2e8f0"
                      }`,
                      background: paymentMethod === "online" ? "#eff6ff" : "#f8fafc",
                      borderRadius: "14px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <CreditCard size={20} color="#2563eb" />
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>
                        پرداخت آنلاین (کارت بانکی)
                      </div>
                      <div style={{ color: "#64748b", fontSize: "0.82rem" }}>
                        از طریق درگاه بانکی
                      </div>
                    </div>
                  </label>

                  {/* پرداخت در محل */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "16px",
                      border: `1.5px solid ${
                        paymentMethod === "cod" ? "#2563eb" : "#e2e8f0"
                      }`,
                      background: paymentMethod === "cod" ? "#eff6ff" : "#f8fafc",
                      borderRadius: "14px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <Wallet size={20} color="#2563eb" />
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>
                        پرداخت در محل
                      </div>
                      <div style={{ color: "#64748b", fontSize: "0.82rem" }}>
                        پرداخت نقدی یا کارت‌خوان هنگام تحویل
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* ===================== خلاصه سفارش ===================== */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
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
                  color: "#0f172a",
                }}
              >
                خلاصه سفارش
              </h2>

              {/* لیست کوتاه آیتم‌ها */}
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
                      fontSize: "0.88rem",
                    }}
                  >
                    <span style={{ color: "#334155" }}>
                      {item.name}
                      {item.selectedColor ? ` (${item.selectedColor})` : ""} ×{" "}
                      {item.quantity}
                    </span>
                    <span style={{ color: "#0f172a", fontWeight: 700, whiteSpace: "nowrap" }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* ---------- کد تخفیف ---------- */}
              <div style={{ marginBottom: "18px", paddingTop: "14px", borderTop: "1px solid #e2e8f0" }}>
                {appliedCoupon ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "10px",
                      padding: "10px 12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Tag size={15} color="#16a34a" />
                      <span style={{ fontWeight: 700, color: "#16a34a", fontSize: "0.85rem" }}>
                        {appliedCoupon.code} ({appliedCoupon.description})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      aria-label="حذف کد تخفیف"
                      style={{
                        color: "#64748b",
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
                          border: `1.5px solid ${couponError ? "#fca5a5" : "#e2e8f0"}`,
                          borderRadius: "10px",
                          fontSize: "0.85rem",
                          outline: "none",
                          background: couponError ? "#fef2f2" : "#f8fafc",
                          fontFamily: "inherit",
                          color: "#0f172a",
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        style={{
                          padding: "0 16px",
                          background: "#f1f5f9",
                          color: "#334155",
                          border: "none",
                          borderRadius: "10px",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          whiteSpace: "nowrap",
                        }}
                      >
                        اعمال کد
                      </button>
                    </div>
                    {couponError && (
                      <span style={{ display: "block", marginTop: "6px", color: "#ef4444", fontSize: "0.78rem", fontWeight: 600 }}>
                        {couponError}
                      </span>
                    )}
                    <span style={{ display: "block", marginTop: "6px", color: "#94a3b8", fontSize: "0.75rem" }}>
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
                  marginBottom: "12px",
                  color: "#64748b",
                  fontSize: "0.92rem",
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
                    color: "#16a34a",
                    fontSize: "0.92rem",
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
                  borderBottom: "1px solid #e2e8f0",
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  color: "#0f172a",
                }}
              >
                <span>مبلغ قابل پرداخت</span>
                <span style={{ color: "#2563eb" }}>{formatPrice(finalTotal)}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: isSubmitting
                    ? "#93c5fd"
                    : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  border: "none",
                  fontFamily: "inherit",
                  boxShadow: isSubmitting
                    ? "none"
                    : "0 10px 25px rgba(37, 99, 235, 0.25)",
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
                  color: "#64748b",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                بازگشت به سبد خرید
              </Link>
            </div>
          </div>
        </form>
      </div>

      {/* ریسپانسیو: زیر ۸۰۰px خلاصه سفارش زیر فرم می‌آید */}
      <style>{`
        @media (max-width: 800px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}