import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useProducts, getStock } from "../context/ProductsContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { STATUS_PROCESSING } from "../utils/orderStatus";

import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import ProfilePasswordForm from "../components/profile/ProfilePasswordForm";
import ProfileOrderHistory from "../components/profile/ProfileOrderHistory";

// ======================================================
// Profile
// صفحه پروفایل کاربر: اطلاعات شخصی + تغییر رمز + تاریخچه خرید
// ======================================================

export default function Profile() {
  usePageTitle("پروفایل من");

  const { user, updateProfile, changePassword } = useAuth();
  const { getOrdersByUser, cancelOrder } = useOrders();
  const { products, updateProduct } = useProducts();

  const myOrders = getOrdersByUser(user.id);

  // ---------- لغو سفارش ----------
  // cancelOrder خودش وضعیت رو تغییر می‌ده و فقط callback
  // بازگرداندن موجودی رو صدا می‌زنه.
  const handleCancelOrder = (order) => {
    if (order.status !== STATUS_PROCESSING) return;

    const confirmed = window.confirm(
      `آیا از لغو سفارش «${order.orderNumber}» مطمئن هستید؟`,
    );
    if (!confirmed) return;

    cancelOrder(order.id, (productId, quantity) => {
      const liveProduct = products.find((p) => p.id === productId);
      if (liveProduct) {
        const currentStock = getStock(liveProduct);
        updateProduct(productId, { stock: currentStock + quantity });
      }
    });
  };

  // ---------- اطلاعات شخصی ----------
  const [infoData, setInfoData] = useState({
    fullName: user.fullName,
    phone: user.phone,
  });
  const [infoErrors, setInfoErrors] = useState({});
  const [infoSaved, setInfoSaved] = useState(false);

  // اطلاعات فرم با تغییر کاربر ریست می‌شه (مثلاً بعد از ویرایش پروفایل)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setInfoData({ fullName: user.fullName, phone: user.phone });
  }, [user.fullName, user.phone]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
      newErrors.fullName = "نام را وارد کنید";
    }

    if (!infoData.phone.trim()) {
      newErrors.phone = "شماره موبایل را وارد کنید";
    } else if (!/^09\d{9}$/.test(infoData.phone.trim())) {
      newErrors.phone = "شماره موبایل معتبر نیست";
    }

    setInfoErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    updateProfile(infoData);
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 2500);
  };

  // ---------- تغییر رمز عبور ----------
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
    setPasswordSaved(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      setPasswordError("همه فیلدها را پر کنید");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("رمز عبور جدید باید حداقل ۶ کاراکتر باشد");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("رمز عبور جدید و تکرار آن مطابقت ندارند");
      return;
    }

    const result = changePassword(passwordData);
    if (result.success) {
      setPasswordSaved(true);
      setIsPasswordFormOpen(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setTimeout(() => setPasswordSaved(false), 3000);
    } else {
      setPasswordError(result.message);
    }
  };

  return (
    <section style={{ padding: "50px 20px 80px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        {/* ---------- سربرگ ---------- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-primary), #7c3aed)",
              color: "var(--color-bg-white)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h1
              style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "var(--color-text)",
                marginBottom: "4px",
              }}
            >
              {user.fullName}
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem" }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* ---------- کارت‌ها ---------- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <ProfileInfoForm
            user={user}
            infoData={infoData}
            infoErrors={infoErrors}
            infoSaved={infoSaved}
            handleInfoChange={handleInfoChange}
            handleInfoSubmit={handleInfoSubmit}
          />

          <ProfilePasswordForm
            isPasswordFormOpen={isPasswordFormOpen}
            togglePasswordForm={togglePasswordForm}
            passwordData={passwordData}
            passwordError={passwordError}
            passwordSaved={passwordSaved}
            handlePasswordChange={handlePasswordChange}
            handlePasswordSubmit={handlePasswordSubmit}
          />

          <ProfileOrderHistory
            myOrders={myOrders}
            handleCancelOrder={handleCancelOrder}
          />
        </div>
      </div>
    </section>
  );
}
