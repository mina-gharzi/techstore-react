import { User, Phone, Mail, Check } from "lucide-react";

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

const errorStyle = {
  display: "block",
  marginTop: "6px",
  color: "var(--color-error)",
  fontSize: "0.8rem",
  fontWeight: 600,
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
  inputStyle,
}) {
  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "20px" }}>
        اطلاعات شخصی
      </h2>

      <form onSubmit={handleInfoSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>نام و نام خانوادگی</label>
          <div style={{ position: "relative" }}>
            <User size={18} color="var(--color-text-faint)" style={iconStyle} />
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
            <Phone size={18} color="var(--color-text-faint)" style={iconStyle} />
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

        <div style={{ marginBottom: "22px" }}>
          <label style={labelStyle}>ایمیل</label>
          <div style={{ position: "relative" }}>
            <Mail size={18} color="var(--color-text-faint)" style={iconStyle} />
            <input
              type="email"
              value={user.email}
              disabled
              style={{
                ...inputStyle(false),
                background: "#f1f5f9",
                color: "var(--color-text-faint)",
                cursor: "not-allowed",
              }}
            />
          </div>
          <span style={{ display: "block", marginTop: "6px", color: "var(--color-text-faint)", fontSize: "0.78rem" }}>
            ایمیل قابل تغییر نیست
          </span>
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 26px",
            background: infoSaved ? "var(--color-success)" : "var(--color-primary)",
            color: "var(--color-bg-white)",
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
  );
}
