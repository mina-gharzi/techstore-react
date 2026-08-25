import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { canTransition, STATUS_CANCELLED } from "../utils/orderStatus";
import { readJSON, writeJSON } from "../utils/storage";

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
//
// نکته مهم درباره cancelOrder:
// بازگرداندن موجودی (restoreStock) باید بیرون از setOrders اتفاق بیفته
// چون setOrders یک closure هست و نباید side-effect داخلش باشه.
// ======================================================

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => readJSON(STORAGE_KEY, []));

  useEffect(() => {
    writeJSON(STORAGE_KEY, orders);
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
  // اول بررسی می‌کنیم آیا transition مجاز هست، بعد موجودی رو
  // برمی‌گردونیم (خارج از setOrders)، و بعد وضعیت رو آپدیت می‌کنیم.
  const cancelOrder = useCallback((orderId, restoreStock) => {
    // ۱. خوندن وضعیت فعلی سفارش (بدون هیچ state write)
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    if (!canTransition(order.status, STATUS_CANCELLED)) return;

    // ۲. بازگرداندن موجودی — کاملاً بیرون از setOrders
    if (typeof restoreStock === "function") {
      order.items.forEach((item) => {
        restoreStock(item.id, item.quantity);
      });
    }

    // ۳. آپدیت وضعیت سفارش
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: STATUS_CANCELLED } : o,
      ),
    );
  }, [orders]);

  const value = useMemo(() => ({ orders, addOrder, getOrdersByUser, updateOrderStatus, cancelOrder }), [orders, addOrder, getOrdersByUser, updateOrderStatus, cancelOrder]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders باید داخل OrdersProvider استفاده شود");
  }

  return context;
}
