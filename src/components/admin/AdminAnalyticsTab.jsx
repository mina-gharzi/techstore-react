import { Wallet, ClipboardList, TrendingUp, Users } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { statusColor } from "./adminHelpers";

export default function AdminAnalyticsTab({ analytics }) {
  return (
    <>
      {/* کارت‌های خلاصه */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "درآمد کل",
            value: formatPrice(analytics.totalRevenue),
            icon: <Wallet size={20} color="var(--color-primary)" />,
          },
          {
            label: "تعداد سفارش‌ها",
            value: analytics.totalOrders,
            icon: <ClipboardList size={20} color="var(--color-success)" />,
          },
          {
            label: "میانگین ارزش سفارش",
            value: formatPrice(Math.round(analytics.avgOrderValue)),
            icon: <TrendingUp size={20} color="var(--color-warning)" />,
          },
          {
            label: "تعداد مشتری‌ها",
            value: analytics.totalCustomers,
            icon: <Users size={20} color="var(--color-error)" />,
          },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "var(--color-bg-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "var(--color-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              {card.icon}
            </div>
            <div
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "var(--color-text)",
                marginBottom: "4px",
              }}
            >
              {card.value}
            </div>
            <div style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {/* ---------- نمودار درآمد ۷ روز اخیر ---------- */}
        <div
          style={{
            background: "var(--color-bg-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "var(--color-text)",
              marginBottom: "20px",
            }}
          >
            درآمد ۷ روز اخیر
          </h2>

          {analytics.totalRevenue === 0 ? (
            <p
              style={{
                color: "var(--color-text-faint)",
                fontSize: "0.88rem",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              هنوز سفارشی ثبت نشده است.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {analytics.revenueByDay.map((day) => (
                <div
                  key={day.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      width: "34px",
                      color: "var(--color-text-muted)",
                      fontSize: "0.78rem",
                      flexShrink: 0,
                    }}
                  >
                    {day.label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "20px",
                      background: "#f1f5f9",
                      borderRadius: "6px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(day.revenue / analytics.maxDayRevenue) * 100}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg, var(--color-primary), #3b82f6)",
                        borderRadius: "6px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      width: "90px",
                      textAlign: "left",
                      color: "var(--color-text)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {day.revenue > 0 ? formatPrice(day.revenue) : "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- پرفروش‌ترین محصولات ---------- */}
        <div
          style={{
            background: "var(--color-bg-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "var(--color-text)",
              marginBottom: "20px",
            }}
          >
            پرفروش‌ترین محصولات
          </h2>

          {analytics.topProducts.length === 0 ? (
            <p
              style={{
                color: "var(--color-text-faint)",
                fontSize: "0.88rem",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              هنوز محصولی فروخته نشده است.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {analytics.topProducts.map(({ product, qty }) => (
                <div key={product.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
                      {product.name}
                    </span>
                    <span style={{ color: "var(--color-text-muted)", fontWeight: 700 }}>
                      {qty} فروش
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      background: "#f1f5f9",
                      borderRadius: "6px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(qty / analytics.maxQty) * 100}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg, var(--color-success), #22c55e)",
                        borderRadius: "6px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- تفکیک وضعیت سفارش‌ها ---------- */}
        <div
          style={{
            background: "var(--color-bg-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "var(--color-text)",
              marginBottom: "20px",
            }}
          >
            وضعیت سفارش‌ها
          </h2>

          {analytics.totalOrders === 0 ? (
            <p
              style={{
                color: "var(--color-text-faint)",
                fontSize: "0.88rem",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              هنوز سفارشی ثبت نشده است.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {analytics.statusBreakdown.map(({ status, count }) => {
                const colors = statusColor(status);
                const percent = analytics.totalOrders
                  ? Math.round((count / analytics.totalOrders) * 100)
                  : 0;
                return (
                  <div key={status}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
                        {status}
                      </span>
                      <span style={{ color: "var(--color-text-muted)", fontWeight: 700 }}>
                        {count} ({percent}٪)
                      </span>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        background: "#f1f5f9",
                        borderRadius: "6px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: colors.text,
                          borderRadius: "6px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
