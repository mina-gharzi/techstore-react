import { Lock, ChevronDown, ChevronUp, Check } from "lucide-react";

const cardStyle = {
  background: "var(--color-bg-white)",
  border: "1px solid var(--color-border)",
  borderRadius: "18px",
  padding: "28px 26px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 700,
  color: "#1e293b",
  fontSize: "0.88rem",
};

const iconStyle = {
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
};

export default function ProfilePasswordForm({
  isPasswordFormOpen,
  togglePasswordForm,
  passwordData,
  passwordError,
  passwordSaved,
  handlePasswordChange,
  handlePasswordSubmit,
  inputStyle,
}) {
  return (
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
          <Lock size={18} color="var(--color-primary)" />
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text)" }}>
            تغییر رمز عبور
          </span>
        </div>
        {isPasswordFormOpen ? (
          <ChevronUp size={20} color="var(--color-text-faint)" />
        ) : (
          <ChevronDown size={20} color="var(--color-text-faint)" />
        )}
      </button>

      {passwordSaved && !isPasswordFormOpen && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--color-success)",
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
                background: "var(--color-error-light)",
                border: "1px solid var(--color-error-border)",
                color: "var(--color-error)",
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
                <Lock size={18} color="var(--color-text-faint)" style={iconStyle} />
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
                <Lock size={18} color="var(--color-text-faint)" style={iconStyle} />
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
                <Lock size={18} color="var(--color-text-faint)" style={iconStyle} />
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
                  background: "var(--color-primary)",
                  color: "var(--color-bg-white)",
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
                  background: "var(--color-bg-white)",
                  color: "var(--color-text-secondary)",
                  border: "1.5px solid var(--color-border)",
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
  );
}
