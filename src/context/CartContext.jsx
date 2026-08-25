import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useProducts, getStock } from "./ProductsContext";

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
  try {
    const saved = localStorage.getItem(getStorageKey(userId));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function writeRawCart(userId, items) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(items));
  } catch {
    // localStorage ممکن است در دسترس نباشد
  }
}

function getCartItemId(productId, selectedColor) {
  return selectedColor ? `${productId}-${selectedColor}` : `${productId}-default`;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { products } = useProducts();

  const userId = user?.id ?? null;

  // ---------- state خام سبد (فقط id + color + quantity) ----------
  const [rawCart, setRawCart] = useState(() => readRawCart(null));

  // ---------- لود سبد کاربر جدید موقع سویچ ----------
  useEffect(() => {
    const userCart = readRawCart(userId);
    const guestCart = readRawCart(null);

    if (userId && guestCart.length > 0) {
      // Merge: آیتم‌های مهمان رو به سبد کاربر اضافه کن
      setRawCart((prev) => {
        const merged = [...userCart];
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
        return merged;
      });
      // پاک کردن سبد مهمان بعد از merge
      writeRawCart(null, []);
      localStorage.removeItem("techstore-cart-guest");
    } else {
      setRawCart(userCart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
  const addToCart = (product, quantity = 1) => {
    const selectedColor = product.selectedColor || null;
    const productId = product.id;

    setRawCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === productId && item.selectedColor === selectedColor,
      );

      if (existing) {
        return prev.map((item) =>
          item.productId === productId && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...prev, { productId, selectedColor, quantity }];
    });
  };

  // ---------- حذف ----------
  const removeFromCart = (cartItemId) => {
    setRawCart((prev) =>
      prev.filter((item) => getCartItemId(item.productId, item.selectedColor) !== cartItemId),
    );
  };

  // ---------- تغییر تعداد ----------
  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    setRawCart((prev) =>
      prev.map((item) =>
        getCartItemId(item.productId, item.selectedColor) === cartItemId
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  // ---------- خالی کردن ----------
  const clearCart = () => setRawCart([]);

  // ---------- محاسبات (از قیمت زنده) ----------
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart باید داخل CartProvider استفاده شود");
  }
  return context;
}
