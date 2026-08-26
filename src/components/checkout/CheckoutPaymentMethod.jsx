import { CreditCard, Wallet } from "lucide-react";

export default function CheckoutPaymentMethod({ paymentMethod, setPaymentMethod }) {
  return (
    <div
      style={{
        background: "var(--color-bg-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "18px",
        padding: "26px",
      }}
    >
      <h2
        style={{
          fontSize: "1.15rem",
          fontWeight: 800,
          color: "var(--color-text)",
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
              paymentMethod === "online" ? "var(--color-primary)" : "var(--color-border)"
            }`,
            background: paymentMethod === "online" ? "var(--color-primary-light)" : "var(--color-bg)",
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
          <CreditCard size={20} color="var(--color-primary)" />
          <div>
            <div style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "var(--font-size-md)" }}>
              پرداخت آنلاین (کارت بانکی)
            </div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-base)" }}>
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
              paymentMethod === "cod" ? "var(--color-primary)" : "var(--color-border)"
            }`,
            background: paymentMethod === "cod" ? "var(--color-primary-light)" : "var(--color-bg)",
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
          <Wallet size={20} color="var(--color-primary)" />
          <div>
            <div style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "var(--font-size-md)" }}>
              پرداخت در محل
            </div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-base)" }}>
              پرداخت نقدی یا کارت‌خوان هنگام تحویل
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
