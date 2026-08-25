import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useProducts, getStock } from "./ProductsContext";
import { readJSON, writeJSON, removeItem } from "../utils/storage";
import { DEFAULT_STOCK } from "../utils/constants";

const CartContext = createContext(null);

// ======================================================
// CartProvider
//
// نسخه بازنویسی‌شده:
//   1) Per-user: سبد هر کاربر در localStorage جداگانه ذخیره می‌شه
//      (کلید: "techstore-cart-{userId}" یا "techstore-cart-guest")
//   2) بدون Snapshot: فقط { productId, selectedColor, quantity }
//      ذخیره می‌شه؛ name, price, image از ProductsContext زنده
//      خونده می‌شه.
//   3) Merge موقع لاگین: سبد مهمان با سبد کاربر ادغام می‌شه.
//
// نکته: هر آیتم سبد یک "cartItemId" دارد که ترکیب productId
// + رنگ انتخابی است تا مثلاً "آیفون مشکی" و "آیفون آبی"
// دو ردیف جداگانه باشند.
// ======================================================

function getStorageKey(userId) {
  return userId ? `techstore-cart-${userId}` : "techstore-cart-guest";
}

function readRawCart(userId) {
  return readJSON(getStorageKey(userId), []);
}

function writeRawCart(userId, items) {
  writeJSON(getStorageKey(userId), items);
}

function getCartItemId(productId, selectedColor) {
  return selectedColor ? `${productId}-${selectedColor}` : `${productId}-default`;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { products } = useProducts();

  const userId = user?.id ?? null;

  // ---------- state خام سبد (فقط id + color + quantity) ----------
  // initState: merge مهمان ↔ کاربر در همون ابتدا انجام می‌شه، نه در useEffect
  const [rawCart, setRawCart] = useState(() => {
    const currentUserCart = readRawCart(userId);
    const guestCart = readRawCart(null);
    if (userId && guestCart.length > 0) {
      const merged = [...currentUserCart];
      guestCart.forEach((gItem) => {
        const existing = merged.find(
          (m) => m.productId === gItem.productId && m.selectedColor === gItem.selectedColor,
        );
        if (existing) {
          existing.quantity += gItem.quantity;
        } else {
          merged.push({ ...gItem });
        }
      });
      writeRawCart(null, []);
      removeItem("techstore-cart-guest");
      return merged;
    }
    return currentUserCart;
  });

  // ---------- ذخیره خودکار ----------
  useEffect(() => {
    writeRawCart(userId, rawCart);
  }, [rawCart, userId]);

  // ---------- سبد resolved (با اطلاعات زنده محصول) ----------
  const cart = useMemo(() => {
    return rawCart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null; // محصول حذف شده
        return {
          ...product,
          cartItemId: getCartItemId(item.productId, item.selectedColor),
          productId: item.productId,
          selectedColor: item.selectedColor,
          quantity: item.quantity,
          stock: getStock(product),
        };
      })
      .filter(Boolean);
  }, [rawCart, products]);

  // ---------- افزودن به سبد ----------
  // اگه تعداد از موجودی بیشتر باشه، clamp می‌شه (جلوگیری از manipulate
  // localStorage توسط کاربر)
  const addToCart = useCallback((product, quantity = 1) => {
    const selectedColor = product.selectedColor || null;
    const productId = product.id;
    const liveProduct = products.find((p) => p.id === productId);
    const maxStock = liveProduct ? getStock(liveProduct) : DEFAULT_STOCK;

    setRawCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === productId && item.selectedColor === selectedColor,
      );

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((item) =>
          item.productId === productId && item.selectedColor === selectedColor
            ? { ...item, quantity: newQty }
            : item,
        );
      }

      return [...prev, { productId, selectedColor, quantity: Math.min(quantity, maxStock) }];
    });
  }, [products]);

  // ---------- حذف ----------
  const removeFromCart = useCallback((cartItemId) => {
    setRawCart((prev) =>
      prev.filter((item) => getCartItemId(item.productId, item.selectedColor) !== cartItemId),
    );
  }, []);

  // ---------- تغییر تعداد ----------
  // نکته: آیتم از داخل updater خونده می‌شه نه از closure خارجی
  // تا همیشه به‌روز باشه (closure ممکنه stale باشه).
  const updateQuantity = useCallback((cartItemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    setRawCart((prev) => {
      const item = prev.find(
        (i) => getCartItemId(i.productId, i.selectedColor) === cartItemId,
      );
      if (!item) return prev;

      const liveProduct = products.find((p) => p.id === item.productId);
      const maxStock = liveProduct ? getStock(liveProduct) : DEFAULT_STOCK;

      return prev.map((i) =>
        getCartItemId(i.productId, i.selectedColor) === cartItemId
          ? { ...i, quantity: Math.min(quantity, maxStock) }
          : i,
      );
    });
  }, [products, removeFromCart]);

  // ---------- خالی کردن ----------
  const clearCart = useCallback(() => setRawCart([]), []);

  // ---------- محاسبات (از قیمت زنده) ----------
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart باید داخل CartProvider استفاده شود");
  }
  return context;
}
