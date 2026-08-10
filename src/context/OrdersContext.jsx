import { createContext, useContext, useState, useEffect } from "react";

const OrdersContext = createContext(null);
const STORAGE_KEY = "techstore-orders";

// ======================================================
// OrdersProvider
//
// قبلاً وقتی سفارشی توی Checkout ثبت می‌شد، هیچ‌جا ذخیره نمی‌شد -
// فقط یک پیام موقت (از طریق navigate state) به OrderSuccess
// فرستاده می‌شد و بعدش برای همیشه گم می‌شد. برای این‌که کاربر
// بتونه توی پروفایلش تاریخچه‌ی خریدهاش رو ببینه، سفارش‌ها الان
// توی localStorage ذخیره می‌شن (همون الگوی Cart/Favorites/Products).
//
// هر سفارش با userId کاربری که ثبتش کرده مرتبطه، پس هر کاربر
// فقط سفارش‌های خودش رو می‌بینه.
// ======================================================

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // localStorage در دسترس نیست (مثلاً حالت خصوصی مرورگر)
    }
  }, [orders]);

  // ---------- ثبت سفارش جدید ----------
  // items باید یک snapshot از سبد خرید در لحظه‌ی ثبت باشه، نه
  // ارجاع مستقیم به cart context - چون بعد از ثبت سفارش، سبد
  // خالی می‌شه و اگه snapshot نگیریم اطلاعات از دست می‌ره.
  const addOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: "در حال پردازش",
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // ---------- سفارش‌های یک کاربر خاص ----------
  const getOrdersByUser = (userId) =>
    orders.filter((order) => order.userId === userId);

  const value = { orders, addOrder, getOrdersByUser };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders باید داخل OrdersProvider استفاده شود");
  }

  return context;
}