import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { canTransition, STATUS_CANCELLED } from "../components/admin/adminHelpers";

const OrdersContext = createContext(null);
const STORAGE_KEY = "techstore-orders";

// ======================================================
// OrdersProvider
//
// فقط سه عملیات مجاز روی سفارش‌ها وجود داره:
// 1. addOrder — ثبت سفارش جدید
// 2. updateOrderStatus — تغییر وضعیت (با اعتبارسنجی transition)
// 3. cancelOrder — لغو سفارش + بازگرداندن موجودی
//
// قاعده کلی: هر عملیات نوشتن روی سفارش باید از یک جا اتفاق بیفته
// تا از inconsistent state جلوگیری بشه.
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
      // localStorage در دسترس نیست
    }
  }, [orders]);

  // ---------- ثبت سفارش جدید ----------
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

  // ---------- سفارش‌های یک کاربر ----------
  const getOrdersByUser = (userId) =>
    orders.filter((order) => order.userId === userId);

  // ---------- تغییر وضعیت سفارش ----------
  // اگه transition مجاز نباشه، ساکت reject می‌شه.
  // عملیات side-effect (مثلاً بازگرداندن موجودی) باید توسط caller
  // و قبل از این فراخوانی انجام بشه.
  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        if (!canTransition(order.status, newStatus)) return order;
        return { ...order, status: newStatus };
      }),
    );
  }, []);

  // ---------- لغو سفارش ----------
  // یک تابع کمکی که هم وضعیت رو تغییر می‌ده و هم callback
  // بازگرداندن موجودی رو فراخوانی می‌کنه.
  const cancelOrder = useCallback((orderId, restoreStock) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        if (!canTransition(order.status, STATUS_CANCELLED)) return order;

        // بازگرداندن موجودی برای هر آیتم
        if (typeof restoreStock === "function") {
          order.items.forEach((item) => {
            restoreStock(item.id, item.quantity);
          });
        }

        return { ...order, status: STATUS_CANCELLED };
      }),
    );
  }, []);

  const value = { orders, addOrder, getOrdersByUser, updateOrderStatus, cancelOrder };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders باید داخل OrdersProvider استفاده شود");
  }

  return context;
}
