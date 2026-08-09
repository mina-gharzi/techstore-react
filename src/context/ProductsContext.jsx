import { createContext, useContext, useState, useEffect } from "react";
import { products as seedProducts } from "../data/products";

const ProductsContext = createContext(null);
const STORAGE_KEY = "techstore-products";

// ======================================================
// ProductsProvider
//
// قبلاً محصولات مستقیم از data/products.js ایمپورت می‌شدن -
// یعنی یک آرایه‌ی ثابت که هیچ‌کس نمی‌تونست توی خود اپ تغییرش بده.
// برای اینکه داشبورد ادمین بتونه محصول اضافه/ویرایش/حذف کنه،
// این آرایه رو به یک Context با state واقعی منتقل کردیم که توی
// localStorage هم ذخیره می‌شه (دقیقاً همون الگوی Cart/Favorites).
//
// data/products.js همچنان به‌عنوان "seed" اولیه استفاده می‌شه:
// اولین باری که سایت باز می‌شه و هنوز چیزی توی localStorage نیست،
// همون لیست پیش‌فرض نمایش داده می‌شه.
// ======================================================

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : seedProducts;
    } catch {
      return seedProducts;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // localStorage در دسترس نیست (مثلاً حالت خصوصی مرورگر)
    }
  }, [products]);

  // ---------- افزودن محصول جدید ----------
  const addProduct = (productData) => {
    const newProduct = {
      // Date.now() برای دمو کافیه و یکتا بودنش تضمینه؛ در یک بک‌اند
      // واقعی این شناسه رو دیتابیس تولید می‌کنه، نه فرانت‌اند.
      id: Date.now(),
      colors: [],
      ...productData,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  // ---------- ویرایش محصول موجود ----------
  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  // ---------- حذف محصول ----------
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ---------- بازگشت به لیست پیش‌فرض (برای دمو/تست) ----------
  const resetToDefaults = () => setProducts(seedProducts);

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaults,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts باید داخل ProductsProvider استفاده شود");
  }

  return context;
}