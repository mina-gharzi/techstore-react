import { Package, XCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

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

const cardStyle = {
  background: "var(--color-bg-white)",
  border: "1px solid var(--color-border)",
  borderRadius: "18px",
  padding: "28px 26px",
};

export default function ProfileOrderHistory({ myOrders, handleCancelOrder }) {
  return (
    <div style={cardStyle}>
      <h2
        style={{
          fontSize: "1.1rem",
          fontWeight: 800,
          color: "var(--color-text)",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Package size={18} color="var(--color-primary)" />
        تاریخچه خرید
        {myOrders.length > 0 && (
          <span style={{ color: "var(--color-text-faint)", fontWeight: 600, fontSize: "0.85rem" }}>
            ({myOrders.length} سفارش)
          </span>
        )}
      </h2>

      {myOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 10px" }}>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "16px" }}>
            هنوز سفارشی ثبت نکرده‌اید.
          </p>
          <Link
            to="/products"
            style={{
              display: "inline-block",
              padding: "10px 24px",
              background: "var(--color-primary)",
              color: "var(--color-bg-white)",
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
                border: "1px solid var(--color-border)",
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
                  <div style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "0.92rem" }}>
                    کد پیگیری: {order.orderNumber}
                  </div>
                  <div style={{ color: "var(--color-text-faint)", fontSize: "0.8rem", marginTop: "2px" }}>
                    {formatOrderDate(order.createdAt)}
                  </div>
                </div>
                <span
                  style={{
                    background:
                      order.status === "تحویل داده شد"
                        ? "#f0fdf4"
                        : order.status === "لغو شده"
                          ? "var(--color-error-light)"
                          : order.status === "ارسال شد"
                            ? "var(--color-primary-light)"
                            : "#fffbeb",
                    color:
                      order.status === "تحویل داده شد"
                        ? "var(--color-success)"
                        : order.status === "لغو شده"
                          ? "var(--color-error)"
                          : order.status === "ارسال شد"
                            ? "var(--color-primary)"
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
                      color: "var(--color-text-muted)",
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
                <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                  {order.totalItems} کالا
                </span>
                <span style={{ fontWeight: 800, color: "var(--color-primary)" }}>
                  {formatPrice(order.totalPrice)}
                </span>
              </div>

              {order.status === "در حال پردازش" && (
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #f1f5f9" }}>
                  <button
                    onClick={() => handleCancelOrder(order)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      background: "var(--color-error-light)",
                      color: "var(--color-error)",
                      border: "1px solid var(--color-error-border)",
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
  );
}
