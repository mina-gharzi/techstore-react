import { ClipboardList } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { ORDER_STATUSES, statusColor, formatOrderDate } from "./adminHelpers";

export default function AdminOrdersTab({ orders, updateOrderStatus }) {
  return orders.length === 0 ? (
    <div
      style={{
        background: "var(--color-bg-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "18px",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <ClipboardList
        size={48}
        color="var(--color-text-faint)"
        style={{ margin: "0 auto 16px" }}
      />
      <p style={{ color: "var(--color-text-muted)" }}>هنوز سفارشی ثبت نشده است.</p>
    </div>
  ) : (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "14px" }}
    >
      {orders.map((order) => {
        const colors = statusColor(order.status);
        return (
          <div
            key={order.id}
            style={{
              background: "var(--color-bg-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    color: "var(--color-text)",
                    fontSize: "0.98rem",
                  }}
                >
                  {order.orderNumber}
                </div>
                <div
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "0.85rem",
                    marginTop: "3px",
                  }}
                >
                  {order.customerName} ·{" "}
                  {formatOrderDate(order.createdAt)}
                </div>
              </div>

              {/* تغییر وضعیت سفارش */}
              <select
                value={order.status}
                onChange={(e) =>
                  updateOrderStatus(order.id, e.target.value)
                }
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid var(--color-border)",
                  background: colors.bg,
                  color: colors.text,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* آیتم‌های سفارش */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                paddingTop: "12px",
                borderTop: "1px dashed #f1f5f9",
                marginBottom: "12px",
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
                    {item.selectedColor
                      ? ` (${item.selectedColor})`
                      : ""}{" "}
                    × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* آدرس ارسال */}
            {order.shippingAddress && (
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "var(--color-text-faint)",
                  marginBottom: "12px",
                }}
              >
                📍 {order.shippingAddress.city}،{" "}
                {order.shippingAddress.address} —{" "}
                {order.shippingAddress.phone}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "12px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                {order.totalItems} کالا ·{" "}
                {order.paymentMethod === "online"
                  ? "پرداخت آنلاین"
                  : "پرداخت در محل"}
              </span>
              <span
                style={{
                  fontWeight: 800,
                  color: "var(--color-primary)",
                  fontSize: "1.02rem",
                }}
              >
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
