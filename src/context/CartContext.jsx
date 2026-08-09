import { createContext, useContext, useState, useEffect } from "react";

// ساخت Context
const CartContext = createContext(null);

// ======================================================
// CartProvider
// این کامپوننت کل اپ را در بر می‌گیرد
// و اطلاعات سبد خرید را در اختیار همه قرار می‌دهد
//
// نکته مهم: هر آیتم سبد یک "cartItemId" دارد که ترکیب
// id محصول + رنگ انتخابی است. این باعث می‌شود مثلاً
// "آیفون مشکی" و "آیفون آبی" دو ردیف جدا در سبد باشند
// و روی هم merge نشوند.
// ======================================================

export function CartProvider({ children }) {
  // خواندن اولیه از localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("techstore-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ذخیره خودکار در localStorage بعد از هر تغییر
  useEffect(() => {
    try {
      localStorage.setItem("techstore-cart", JSON.stringify(cart));
    } catch {
      // localStorage ممکن است در برخی حالت‌ها (مثلاً حالت خصوصی مرورگر) در دسترس نباشد
    }
  }, [cart]);

  // ---------- ساخت شناسه یکتا برای هر واریانت محصول ----------
  const getCartItemId = (id, selectedColor) =>
    selectedColor ? `${id}-${selectedColor}` : `${id}-default`;

  // ---------- افزودن محصول به سبد ----------
  // product: آبجکت محصول (می‌تواند selectedColor هم داشته باشد)
  // quantity: تعداد (پیش‌فرض ۱) - جایگزین حلقه‌ی زدن addToCart چندباره
  const addToCart = (product, quantity = 1) => {
    const cartItemId = getCartItemId(product.id, product.selectedColor);

    setCart((prev) => {
      const existingItem = prev.find((item) => item.cartItemId === cartItemId);

      // اگر همین محصول با همین رنگ از قبل در سبد بود → فقط تعداد را زیاد کن
      if (existingItem) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      // اگر جدید بود (یا رنگش با آیتم موجود فرق داشت) → ردیف جدید اضافه کن
      return [...prev, { ...product, cartItemId, quantity }];
    });
  };

  // ---------- حذف کامل یک واریانت از سبد ----------
  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // ---------- تغییر تعداد یک واریانت ----------
  const updateQuantity = (cartItemId, quantity) => {
    // جلوگیری از تعداد صفر یا منفی: به‌جای باگ خاموش، آیتم حذف می‌شود
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item,
      ),
    );
  };

  // ---------- خالی کردن کل سبد ----------
  const clearCart = () => setCart([]);

  // ---------- محاسبات ----------
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // مقداری که در اختیار کامپوننت‌ها قرار می‌گیرد
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

// ======================================================
// هوک اختصاصی برای استفاده راحت‌تر
// ======================================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart باید داخل CartProvider استفاده شود");
  }

  return context;
}
