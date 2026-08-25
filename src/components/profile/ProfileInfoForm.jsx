import { User, Phone, Mail, Check } from "lucide-react";

const cardStyle = {
  background: "var(--color-bg-white)",
  border: "1px solid var(--color-border)",
  borderRadius: "18px",
  padding: "28px 26px",
};

const iconStyle = {
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
};

export default function ProfileInfoForm({
  user,
  infoData,
  infoErrors,
  infoSaved,
  handleInfoChange,
  handleInfoSubmit,
}) {
  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "20px" }}>
        اطلاعات شخصی
      </h2>

      <form onSubmit={handleInfoSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label className="form-label" htmlFor="fullName">نام و نام خانوادگی</label>
          <div style={{ position: "relative" }}>
            <User size={18} color="var(--color-text-faint)" style={iconStyle} />
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={infoData.fullName}
              onChange={handleInfoChange}
              className={!!infoErrors.fullName ? "form-input form-input--error" : "form-input"}
            />
          </div>
          {infoErrors.fullName && <span className="form-error">{infoErrors.fullName}</span>}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label className="form-label" htmlFor="phone">شماره موبایل</label>
          <div style={{ position: "relative" }}>
            <Phone size={18} color="var(--color-text-faint)" style={iconStyle} />
            <input
              type="tel"
              name="phone"
              id="phone"
              value={infoData.phone}
              onChange={handleInfoChange}
              className={!!infoErrors.phone ? "form-input form-input--error" : "form-input"}
            />
          </div>
          {infoErrors.phone && <span className="form-error">{infoErrors.phone}</span>}
        </div>

        <div style={{ marginBottom: "22px" }}>
          <label className="form-label" htmlFor="email">ایمیل</label>
          <div style={{ position: "relative" }}>
            <Mail size={18} color="var(--color-text-faint)" style={iconStyle} />
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="form-input"
              style={{
                background: "#f1f5f9",
                color: "var(--color-text-faint)",
                cursor: "not-allowed",
              }}
            />
          </div>
          <span className="form-error" style={{ color: "var(--color-text-faint)" }}>
            ایمیل قابل تغییر نیست
          </span>
        </div>

        <button
          type="submit"
          className="btn btn--primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: infoSaved ? "var(--color-success)" : undefined,
          }}
        >
          {infoSaved ? <Check size={17} /> : null}
          {infoSaved ? "ذخیره شد" : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}
