import { Lock, ChevronDown, ChevronUp, Check } from "lucide-react";

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
}) {
  return (
    <div className="card--profile">
      <button
        type="button"
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
        <div className="alert alert--success" style={{ marginTop: "16px" }}>
          <Check size={16} />
          رمز عبور با موفقیت تغییر کرد
        </div>
      )}

      {isPasswordFormOpen && (
        <div style={{ marginTop: "22px" }}>
          {passwordError && (
            <div className="alert alert--error" id="profile-password-error" style={{ marginBottom: "18px" }}>
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label className="form-label" htmlFor="currentPassword">رمز عبور فعلی</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color="var(--color-text-faint)" style={iconStyle} />
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  aria-describedby={passwordError ? "profile-password-error" : undefined}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="form-label" htmlFor="newPassword">رمز عبور جدید</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color="var(--color-text-faint)" style={iconStyle} />
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  aria-describedby={passwordError ? "profile-password-error" : undefined}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="حداقل ۶ کاراکتر"
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: "22px" }}>
              <label className="form-label" htmlFor="confirmNewPassword">تکرار رمز عبور جدید</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color="var(--color-text-faint)" style={iconStyle} />
                <input
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  aria-describedby={passwordError ? "profile-password-error" : undefined}
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                className="btn btn--primary"
              >
                تغییر رمز عبور
              </button>
              <button
                type="button"
                onClick={togglePasswordForm}
                className="btn"
                style={{
                  background: "var(--color-bg-white)",
                  color: "var(--color-text-secondary)",
                  border: "1.5px solid var(--color-border)",
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
