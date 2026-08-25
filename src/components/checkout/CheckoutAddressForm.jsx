import { MapPin } from "lucide-react";

export default function CheckoutAddressForm({ formData, errors, handleChange }) {
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
          <label className="form-label" htmlFor="checkout-fullName">نام و نام خانوادگی</label>
          <input
            type="text"
            name="fullName"
            id="checkout-fullName"
            aria-describedby={errors.fullName ? "checkout-fullName-error" : undefined}
            aria-invalid={!!errors.fullName}
            value={formData.fullName}
            onChange={handleChange}
            placeholder="مثلاً: مینا قرضی"
            className={errors.fullName ? "form-input form-input--error" : "form-input"}
          />
          {errors.fullName && <span className="form-error" id="checkout-fullName-error">{errors.fullName}</span>}
        </div>

        <div>
          <label className="form-label" htmlFor="checkout-phone">شماره موبایل</label>
          <input
            type="tel"
            name="phone"
            id="checkout-phone"
            aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
            aria-invalid={!!errors.phone}
            value={formData.phone}
            onChange={handleChange}
            placeholder="09xxxxxxxxx"
            className={errors.phone ? "form-input form-input--error" : "form-input"}
          />
          {errors.phone && <span className="form-error" id="checkout-phone-error">{errors.phone}</span>}
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
          <label className="form-label" htmlFor="checkout-city">شهر</label>
          <input
            type="text"
            name="city"
            id="checkout-city"
            aria-describedby={errors.city ? "checkout-city-error" : undefined}
            aria-invalid={!!errors.city}
            value={formData.city}
            onChange={handleChange}
            placeholder="مثلاً: تهران"
            className={errors.city ? "form-input form-input--error" : "form-input"}
          />
          {errors.city && <span className="form-error" id="checkout-city-error">{errors.city}</span>}
        </div>

        <div>
          <label className="form-label" htmlFor="checkout-postalCode">کد پستی</label>
          <input
            type="text"
            name="postalCode"
            id="checkout-postalCode"
            aria-describedby={errors.postalCode ? "checkout-postalCode-error" : undefined}
            aria-invalid={!!errors.postalCode}
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="۱۰ رقم"
            className={errors.postalCode ? "form-input form-input--error" : "form-input"}
          />
          {errors.postalCode && (
            <span className="form-error" id="checkout-postalCode-error">{errors.postalCode}</span>
          )}
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="checkout-address">آدرس کامل</label>
        <textarea
          name="address"
          id="checkout-address"
          aria-describedby={errors.address ? "checkout-address-error" : undefined}
          aria-invalid={!!errors.address}
          value={formData.address}
          onChange={handleChange}
          rows={3}
          placeholder="خیابان، کوچه، پلاک، واحد..."
          className={errors.address ? "form-input form-input--error" : "form-input"}
          style={{
            height: "auto",
            padding: "14px 16px",
            resize: "vertical",
            lineHeight: 1.7,
          }}
        />
        {errors.address && <span className="form-error" id="checkout-address-error">{errors.address}</span>}
      </div>
    </div>
  );
}
