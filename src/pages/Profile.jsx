import { useState } from "react";
import { User, Phone, Mail, Lock, Check, Package, ChevronDown, ChevronUp, XCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useProducts, getStock } from "../context/ProductsContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatPrice } from "../utils/formatPrice";

// ======================================================
// Profile
// صفحه پروفایل کاربر - ویرایش اطلاعات، تغییر رمز عبور، تاریخچه خرید
// ======================================================

export default function Profile() {
  usePageTitle("پروفایل من");
  const { user, updateProfile, changePassword } = useAuth();
  const { getOrdersByUser, updateOrderStatus } = useOrders();
  const { products, updateProduct } = useProducts();

  const myOrders = getOrdersByUser(user.id);

  // ---------- لغو سفارش توسط کاربر ----------
  // فقط سفارش‌هایی که هنوز "در حال پردازش" هستن قابل لغوئن -
  // بعد از اینکه ادمین وضعیت رو به "ارسال شد" یا جلوتر تغییر داد،
  // دیگه منطقی نیست کاربر خودش لغوش کنه (باید با پشتیبانی تماس بگیره).
  const [cancelError, setCancelError] = useState("");

  const handleCancelOrder = (order) => {
    const confirmed = window.confirm(
      `سفارش «${order.orderNumber}» لغو شود؟ این عمل قابل بازگشت نیست.`,
    );
    if (!confirmed) return;

    updateOrderStatus(order.id, "لغو شده");

    // موجودی محصولات این سفارش رو برمی‌گردونیم، چون دیگه فروخته نشده
    order.items?.forEach((item) => {
      const liveProduct = products.find((p) => p.id === item.id);
      if (liveProduct) {
        const currentStock = getStock(liveProduct);
        updateProduct(item.id, { stock: currentStock + item.quantity });
      }
    });

    setCancelError("");
  };

  // ---------- فرم اطلاعات شخصی ----------
  const [infoData, setInfoData] = useState({
    fullName: user.fullName,
    phone: user.phone,
  });
  const [infoErrors, setInfoErrors] = useState({});
  const [infoSaved, setInfoSaved] = useState(false);

  // ---------- تغییر رمز عبور: پشت یک دکمه مخفی می‌مونه ----------
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const togglePasswordForm = () => {
    setIsPasswordFormOpen((prev) => !prev);
    setPasswordError("");
    setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  };

  // ---------- Handlers: اطلاعات شخصی ----------
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfoData((prev) => ({ ...prev, [name]: value }));
    if (infoErrors[name]) setInfoErrors((prev) => ({ ...prev, [name]: null }));
    setInfoSaved(false);
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!infoData.fullName.trim()) {
      newErrors.fullName = "نام و نام خانوادگی را وارد کنید";
    }
    if (!infoData.phone.trim()) {
      newErrors.phone = "شماره موبایل را وارد کنید";
    } else if (!/^09\d{9}$/.test(infoData.phone.trim())) {
      newErrors.phone = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود";
    }

    if (Object.keys(newErrors).length > 0) {
      setInfoErrors(newErrors);
      return;
    }

    updateProfile(infoData);
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 2500);
  };

  // ---------- Handlers: تغییر رمز عبور ----------
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordError) setPasswordError("");
    setPasswordSaved(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError("همه‌ی فیلدها را پر کنید");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("رمز جدید باید حداقل ۶ کاراکتر باشد");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("رمز جدید و تکرار آن یکسان نیستند");
      return;
    }

    const result = changePassword(passwordData);

    if (!result.success) {
      setPasswordError(result.message);
      return;
    }

    setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    setPasswordSaved(true);
    setIsPasswordFormOpen(false);
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  // ---------- کمکی: فرمت تاریخ فارسی ----------
  const formatOrderDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  // ---------- استایل مشترک ----------
  const inputStyle = (hasError) => ({
    width: "100%",
    height: "48px",
    padding: "0 44px 0 16px",
    border: `1.5px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
    borderRadius: "12px",
    fontSize: "0.92rem",
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
    fontSize: "0.88rem",
  };

  const errorStyle = {
    display: "block",
    marginTop: "6px",
    color: "#ef4444",
    fontSize: "0.8rem",
    fontWeight: 600,
  };

  const iconStyle = {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
  };

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "28px 26px",
  };

  return (
    <section style={{ padding: "50px 20px 80px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        {/* ---------- سربرگ ---------- */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "1.4rem",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {user.fullName?.charAt(0) || "?"}
          </div>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>
              {user.fullName}
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>{user.email}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* ===================== اطلاعات شخصی ===================== */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "20px" }}>
              اطلاعات شخصی
            </h2>

            <form onSubmit={handleInfoSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>نام و نام خانوادگی</label>
                <div style={{ position: "relative" }}>
                  <User size={18} color="#94a3b8" style={iconStyle} />
                  <input
                    type="text"
                    name="fullName"
                    value={infoData.fullName}
                    onChange={handleInfoChange}
                    style={inputStyle(!!infoErrors.fullName)}
                  />
                </div>
                {infoErrors.fullName && <span style={errorStyle}>{infoErrors.fullName}</span>}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>شماره موبایل</label>
                <div style={{ position: "relative" }}>
                  <Phone size={18} color="#94a3b8" style={iconStyle} />
                  <input
                    type="tel"
                    name="phone"
                    value={infoData.phone}
                    onChange={handleInfoChange}
                    style={inputStyle(!!infoErrors.phone)}
                  />
                </div>
                {infoErrors.phone && <span style={errorStyle}>{infoErrors.phone}</span>}
              </div>

              {/* ایمیل عمداً غیرقابل ویرایش - چون شناسه‌ی ورود کاربره */}
              <div style={{ marginBottom: "22px" }}>
                <label style={labelStyle}>ایمیل</label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} color="#94a3b8" style={iconStyle} />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    style={{
                      ...inputStyle(false),
                      background: "#f1f5f9",
                      color: "#94a3b8",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
                <span style={{ display: "block", marginTop: "6px", color: "#94a3b8", fontSize: "0.78rem" }}>
                  ایمیل قابل تغییر نیست
                </span>
              </div>

              <button
                type="submit"
                style={{
                  padding: "12px 26px",
                  background: infoSaved ? "#16a34a" : "#2563eb",
                  color: "#fff",
                  borderRadius: "12px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background 0.2s ease",
                }}
              >
                {infoSaved ? <Check size={17} /> : null}
                {infoSaved ? "ذخیره شد" : "ذخیره تغییرات"}
              </button>
            </form>
          </div>

          {/* ===================== تغییر رمز عبور (پشت دکمه) ===================== */}
          <div style={cardStyle}>
            <button
              onClick={togglePasswordForm}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Lock size={18} color="#2563eb" />
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                  تغییر رمز عبور
                </span>
              </div>
              {isPasswordFormOpen ? (
                <ChevronUp size={20} color="#94a3b8" />
              ) : (
                <ChevronDown size={20} color="#94a3b8" />
              )}
            </button>

            {passwordSaved && !isPasswordFormOpen && (
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#16a34a",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                <Check size={16} />
                رمز عبور با موفقیت تغییر کرد
              </div>
            )}

            {isPasswordFormOpen && (
              <div style={{ marginTop: "22px" }}>
                {passwordError && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#ef4444",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      marginBottom: "18px",
                    }}
                  >
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>رمز عبور فعلی</label>
                    <div style={{ position: "relative" }}>
                      <Lock size={18} color="#94a3b8" style={iconStyle} />
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        style={inputStyle(false)}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>رمز عبور جدید</label>
                    <div style={{ position: "relative" }}>
                      <Lock size={18} color="#94a3b8" style={iconStyle} />
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="حداقل ۶ کاراکتر"
                        style={inputStyle(false)}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "22px" }}>
                    <label style={labelStyle}>تکرار رمز عبور جدید</label>
                    <div style={{ position: "relative" }}>
                      <Lock size={18} color="#94a3b8" style={iconStyle} />
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChange}
                        style={inputStyle(false)}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="submit"
                      style={{
                        padding: "12px 26px",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: "12px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      تغییر رمز عبور
                    </button>
                    <button
                      type="button"
                      onClick={togglePasswordForm}
                      style={{
                        padding: "12px 22px",
                        background: "#fff",
                        color: "#64748b",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ===================== تاریخچه خرید ===================== */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Package size={18} color="#2563eb" />
              تاریخچه خرید
              {myOrders.length > 0 && (
                <span style={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.85rem" }}>
                  ({myOrders.length} سفارش)
                </span>
              )}
            </h2>

            {myOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <p style={{ color: "#64748b", marginBottom: "16px" }}>
                  هنوز سفارشی ثبت نکرده‌اید.
                </p>
                <Link
                  to="/products"
                  style={{
                    display: "inline-block",
                    padding: "10px 24px",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: "10px",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  مشاهده محصولات
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.92rem" }}>
                          کد پیگیری: {order.orderNumber}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "2px" }}>
                          {formatOrderDate(order.createdAt)}
                        </div>
                      </div>
                      <span
                        style={{
                          background:
                            order.status === "تحویل داده شد"
                              ? "#f0fdf4"
                              : order.status === "لغو شده"
                                ? "#fef2f2"
                                : order.status === "ارسال شد"
                                  ? "#eff6ff"
                                  : "#fffbeb",
                          color:
                            order.status === "تحویل داده شد"
                              ? "#16a34a"
                              : order.status === "لغو شده"
                                ? "#ef4444"
                                : order.status === "ارسال شد"
                                  ? "#2563eb"
                                  : "#d97706",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: "50px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* لیست کوتاه آیتم‌های همین سفارش */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginBottom: "10px",
                        paddingTop: "10px",
                        borderTop: "1px dashed #f1f5f9",
                      }}
                    >
                      {order.items?.map((item) => (
                        <div
                          key={item.cartItemId || item.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.85rem",
                            color: "#64748b",
                          }}
                        >
                          <span>
                            {item.name}
                            {item.selectedColor ? ` (${item.selectedColor})` : ""} ×{" "}
                            {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "10px",
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                        {order.totalItems} کالا
                      </span>
                      <span style={{ fontWeight: 800, color: "#2563eb" }}>
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>

                    {/* لغو سفارش - فقط تا وقتی هنوز "در حال پردازش"ه */}
                    {order.status === "در حال پردازش" && (
                      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #f1f5f9" }}>
                        <button
                          onClick={() => handleCancelOrder(order)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 16px",
                            background: "#fef2f2",
                            color: "#ef4444",
                            border: "1px solid #fecaca",
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          <XCircle size={15} />
                          لغو سفارش
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}