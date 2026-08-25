import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { categories as seedCategories } from "../data/products";
import { readJSON, writeJSON } from "../utils/storage";

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
  const [categories, setCategories] = useState(() => readJSON(STORAGE_KEY, seedCategories));

  useEffect(() => {
    writeJSON(STORAGE_KEY, categories);
  }, [categories]);

  // ---------- افزودن دسته‌بندی جدید ----------
  const addCategory = useCallback((name) => {
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

    const newCategory = { id: `cat-${Date.now()}`, name: trimmed };
    setCategories((prev) => [...prev, newCategory]);

    return { success: true, category: newCategory };
  }, [categories]);

  // ---------- ویرایش نام یک دسته‌بندی ----------
  const updateCategory = useCallback((id, name) => {
    const trimmed = name.trim();

    if (!trimmed) {
      return { success: false, message: "نام دسته‌بندی را وارد کنید" };
    }

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c)),
    );

    return { success: true };
  }, []);

  // ---------- حذف دسته‌بندی ----------
  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const value = useMemo(() => ({ categories, addCategory, updateCategory, deleteCategory }), [categories, addCategory, updateCategory, deleteCategory]);

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