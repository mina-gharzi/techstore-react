import { useState } from "react";
import { User, Phone, Mail, Lock, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ======================================================
// Profile
// صفحه پروفایل کاربر - ویرایش اطلاعات + تغییر رمز عبور
// ======================================================

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();

  // ---------- فرم اطلاعات شخصی ----------
  const [infoData, setInfoData] = useState({
    fullName: user.fullName,
    phone: user.phone,
  });
  const [infoErrors, setInfoErrors] = useState({});
  const [infoSaved, setInfoSaved] = useState(false);

  // ---------- فرم تغییر رمز عبور ----------
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

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
    setTimeout(() => setPasswordSaved(false), 2500);
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

          {/* ===================== تغییر رمز عبور ===================== */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "20px" }}>
              تغییر رمز عبور
            </h2>

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

              <button
                type="submit"
                style={{
                  padding: "12px 26px",
                  background: passwordSaved ? "#16a34a" : "#2563eb",
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
                {passwordSaved ? <Check size={17} /> : null}
                {passwordSaved ? "رمز تغییر کرد" : "تغییر رمز عبور"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}