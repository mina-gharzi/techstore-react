import { createContext, useContext, useState, useEffect } from "react";
import { categories as seedCategories } from "../data/products";

const CategoriesContext = createContext(null);
const STORAGE_KEY = "techstore-categories";

// ======================================================
// CategoriesProvider
//
// قبلاً دسته‌بندی‌ها یک آرایه‌ی ثابت توی data/products.js بودن -
// یعنی هیچ‌کس نمی‌تونست از توی خود سایت دسته‌بندی جدید اضافه یا
// حذف کنه. الان دقیقاً مثل ProductsContext، این آرایه به یک
// state واقعی با ذخیره‌سازی توی localStorage تبدیل شده.
//
// data/products.js همچنان به‌عنوان "seed" اولیه استفاده می‌شه؛
// فقط اولین باری که سایت باز می‌شه و هنوز چیزی توی localStorage
// نیست، همون لیست پیش‌فرض نمایش داده می‌شه.
// ======================================================

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : seedCategories;
    } catch {
      return seedCategories;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch {
      // localStorage در دسترس نیست (مثلاً حالت خصوصی مرورگر)
    }
  }, [categories]);

  // ---------- افزودن دسته‌بندی جدید ----------
  const addCategory = (name) => {
    const trimmed = name.trim();

    if (!trimmed) {
      return { success: false, message: "نام دسته‌بندی را وارد کنید" };
    }

    const alreadyExists = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (alreadyExists) {
      return { success: false, message: "این دسته‌بندی از قبل وجود دارد" };
    }

    // id جدا از name نگه داشته می‌شه (نه slug فارسی)، چون این id
    // هم توی محصولات (product.category) و هم توی URL (?category=id)
    // استفاده می‌شه و بهتره پایدار و بدون کاراکتر خاص باشه.
    const newCategory = { id: `cat-${Date.now()}`, name: trimmed };
    setCategories((prev) => [...prev, newCategory]);

    return { success: true, category: newCategory };
  };

  // ---------- ویرایش نام یک دسته‌بندی ----------
  const updateCategory = (id, name) => {
    const trimmed = name.trim();

    if (!trimmed) {
      return { success: false, message: "نام دسته‌بندی را وارد کنید" };
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c)),
    );

    return { success: true };
  };

  // ---------- حذف دسته‌بندی ----------
  // نکته: بررسی اینکه آیا محصولی از این دسته استفاده می‌کنه یا نه،
  // اینجا انجام نمی‌شه - چون این context از محصولات خبر نداره.
  // این چک باید توی کامپوننتی که هم به useProducts هم به
  // useCategories دسترسی داره (مثلاً AdminDashboard) انجام بشه.
  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const value = { categories, addCategory, updateCategory, deleteCategory };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);

  if (!context) {
    throw new Error("useCategories باید داخل CategoriesProvider استفاده شود");
  }

  return context;
}