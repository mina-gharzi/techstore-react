import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { products as seedProducts } from "../data/products";
import { readJSON, writeJSON } from "../utils/storage";
import { DEFAULT_STOCK } from "../utils/constants";

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
    const parsed = readJSON(STORAGE_KEY, seedProducts);
    // نرمال‌سازی: اطمینان از اینکه همه فیلدها مقدار پیش‌فرض دارن
    // (برای مقابله با localStorage نسخه‌های قدیمی‌تر اپ)
    return Array.isArray(parsed)
      ? parsed.map((p) => ({
          id: p.id,
          name: p.name ?? "",
          brand: p.brand ?? "",
          category: p.category ?? "",
          price: p.price ?? 0,
          oldPrice: p.oldPrice ?? null,
          rating: p.rating ?? 0,
          isNew: p.isNew ?? false,
          isFeatured: p.isFeatured ?? false,
          description: p.description ?? "",
          image: p.image ?? "",
          colors: p.colors ?? [],
          stock: Number.isFinite(p.stock) ? p.stock : DEFAULT_STOCK,
        }))
      : seedProducts;
  });

  useEffect(() => {
    writeJSON(STORAGE_KEY, products);
  }, [products]);

  // ---------- افزودن محصول جدید ----------
  const addProduct = useCallback((productData) => {
    const newProduct = {
      id: Date.now(),
      name: "",
      brand: "",
      category: "",
      price: 0,
      oldPrice: null,
      rating: 0,
      isNew: false,
      isFeatured: false,
      description: "",
      image: "",
      colors: [],
      stock: 0,
      ...productData,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  // ---------- ویرایش محصول موجود ----------
  // updates می‌تونه آبجکت یا تابعی باشه که prev رو می‌گیره و آبجکت برمی‌گردونه
  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const patch = typeof updates === "function" ? updates(p) : updates;
        return { ...p, ...patch };
      }),
    );
  }, []);

  // ---------- حذف محصول ----------
  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ---------- بازگشت به لیست پیش‌فرض (برای دمو/تست) ----------
  const resetToDefaults = useCallback(() => setProducts(seedProducts), []);

  const value = useMemo(() => ({
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaults,
  }), [products, addProduct, updateProduct, deleteProduct, resetToDefaults]);

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

// ---------- خواندن امن موجودی ----------
// چون stock یک فیلد جدیده، محصولاتی که قبل از این آپدیت توی
// localStorage کاربرها ذخیره شده بودن این فیلد رو ندارن. به‌جای
// اینکه با undefined همه‌جا "ناموجود" یا "بی‌نهایت" نشون بدیم،
// یک مقدار پیش‌فرض معقول (۱۰) در نظر می‌گیریم.
export function getStock(product) {
  return Number.isFinite(product?.stock) ? product.stock : DEFAULT_STOCK;
}