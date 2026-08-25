import { useState, useMemo, useCallback } from "react";
import {
  Package,
  ClipboardList,
  Users,
  Tags,
  BarChart3,
} from "lucide-react";
import { useProducts, getStock } from "../context/ProductsContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { useCategories } from "../context/CategoriesContext";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";

import AdminProductsTab from "../components/admin/AdminProductsTab";
import AdminOrdersTab from "../components/admin/AdminOrdersTab";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminCategoriesTab from "../components/admin/AdminCategoriesTab";
import AdminAnalyticsTab from "../components/admin/AdminAnalyticsTab";
import { ORDER_STATUSES } from "../components/admin/adminHelpers";

// ======================================================
// AdminDashboard
// پنل مدیریت: پنج تب - محصولات، سفارش‌ها، کاربران، دسته‌بندی‌ها، آمار
//
// نکته: چون بک‌اند واقعی نداریم، هر تغییری که اینجا انجام بشه
// فقط توی همین مرورگر (localStorage) ذخیره می‌شه. یعنی اگه یه
// کاربر دیگه از یه مرورگر دیگه سایت رو باز کنه، تغییرات ادمین
// رو نمی‌بینه. برای یک استور واقعی، این context ها باید با
// درخواست‌های واقعی به یک API جایگزین بشن.
// ======================================================

export default function AdminDashboard() {
  usePageTitle("پنل مدیریت");
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories, addCategory, updateCategory, deleteCategory } =
    useCategories();
  const { orders, updateOrderStatus, cancelOrder } = useOrders();
  const { users, deleteUser, setUserRole, user: currentUser } = useAuth();

  const restoreStock = useCallback((productId, quantity) => {
    const liveProduct = products.find((p) => p.id === productId);
    if (liveProduct) {
      updateProduct(productId, { stock: getStock(liveProduct) + quantity });
    }
  }, [products, updateProduct]);

  // ---------- محاسبات آمار (تب "آمار") ----------
  const analytics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== "لغو شده");
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const avgOrderValue = validOrders.length
      ? totalRevenue / validOrders.length
      : 0;
    const totalCustomers = users.filter((u) => u.role !== "admin").length;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    const revenueByDay = last7Days.map((d) => {
      const dayStr = d.toDateString();
      const dayRevenue = validOrders
        .filter((o) => new Date(o.createdAt).toDateString() === dayStr)
        .reduce((sum, o) => sum + o.totalPrice, 0);
      return {
        label: d.toLocaleDateString("fa-IR", { weekday: "short" }),
        revenue: dayRevenue,
      };
    });
    const maxDayRevenue = Math.max(...revenueByDay.map((d) => d.revenue), 1);

    const salesByProduct = {};
    validOrders.forEach((o) => {
      o.items?.forEach((item) => {
        salesByProduct[item.id] =
          (salesByProduct[item.id] || 0) + item.quantity;
      });
    });
    const topProducts = Object.entries(salesByProduct)
      .map(([id, qty]) => ({
        qty,
        product: products.find((p) => p.id === Number(id)),
      }))
      .filter((entry) => entry.product)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
    const maxQty = Math.max(...topProducts.map((p) => p.qty), 1);

    const statusBreakdown = ORDER_STATUSES.map((status) => ({
      status,
      count: orders.filter((o) => o.status === status).length,
    }));

    return {
      totalRevenue,
      avgOrderValue,
      totalCustomers,
      totalOrders: orders.length,
      revenueByDay,
      maxDayRevenue,
      topProducts,
      maxQty,
      statusBreakdown,
    };
  }, [orders, products, users]);

  const [activeTab, setActiveTab] = useState("products");

  const tabBtnStyle = (tab) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 18px",
    background: "none",
    border: "none",
    borderBottom:
      activeTab === tab ? "2px solid var(--color-primary)" : "2px solid transparent",
    color: activeTab === tab ? "var(--color-primary)" : "var(--color-text-muted)",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: "-1px",
  });

  return (
    <section style={{ padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* ---------- عنوان + تب‌ها ---------- */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "var(--color-text)",
              marginBottom: "6px",
            }}
          >
            پنل مدیریت
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem" }}>
            {activeTab === "products" && `${products.length} محصول در فروشگاه`}
            {activeTab === "orders" && `${orders.length} سفارش ثبت‌شده`}
            {activeTab === "users" && `${users.length} کاربر ثبت‌نام‌شده`}
            {activeTab === "categories" && `${categories.length} دسته‌بندی`}
            {activeTab === "analytics" && "نمای کلی فروش فروشگاه"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <button onClick={() => setActiveTab("products")} style={tabBtnStyle("products")}>
            <Package size={17} />
            محصولات
          </button>
          <button onClick={() => setActiveTab("orders")} style={tabBtnStyle("orders")}>
            <ClipboardList size={17} />
            سفارش‌ها
            {orders.length > 0 && (
              <span
                style={{
                  background: activeTab === "orders" ? "var(--color-primary)" : "var(--color-border)",
                  color: activeTab === "orders" ? "var(--color-bg-white)" : "var(--color-text-muted)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "1px 7px",
                  borderRadius: "50px",
                }}
              >
                {orders.length}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab("users")} style={tabBtnStyle("users")}>
            <Users size={17} />
            کاربران
          </button>
          <button onClick={() => setActiveTab("categories")} style={tabBtnStyle("categories")}>
            <Tags size={17} />
            دسته‌بندی‌ها
          </button>
          <button onClick={() => setActiveTab("analytics")} style={tabBtnStyle("analytics")}>
            <BarChart3 size={17} />
            آمار
          </button>
        </div>

        {/* ---------- محتوای تب‌ها ---------- */}
        {activeTab === "products" && (
          <AdminProductsTab
            products={products}
            categories={categories}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
          />
        )}

        {activeTab === "orders" && (
          <AdminOrdersTab
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            cancelOrder={cancelOrder}
            restoreStock={restoreStock}
          />
        )}

        {activeTab === "users" && (
          <AdminUsersTab
            users={users}
            currentUser={currentUser}
            deleteUser={deleteUser}
            setUserRole={setUserRole}
          />
        )}

        {activeTab === "categories" && (
          <AdminCategoriesTab
            products={products}
            categories={categories}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
          />
        )}

        {activeTab === "analytics" && (
          <AdminAnalyticsTab analytics={analytics} />
        )}
      </div>
    </section>
  );
}
