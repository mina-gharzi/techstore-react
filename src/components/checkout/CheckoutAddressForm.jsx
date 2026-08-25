import { MapPin } from "lucide-react";

const labelStyle = {
  display: "block",
  fontSize: "0.88rem",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "6px",
};

const errorStyle = {
  color: "#dc2626",
  fontSize: "0.8rem",
  marginTop: "4px",
  display: "block",
};

export default function CheckoutAddressForm({ formData, errors, handleChange, inputStyle }) {
  return (
    <div
      style={{
        background: "var(--color-bg-white)",
        border: "1px solid var(--color-border)",
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
        <MapPin size={20} color="var(--color-primary)" />
        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--color-text)" }}>
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
  );
}
