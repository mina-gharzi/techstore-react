import { useState } from "react";
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";

export default function AdminCategoriesTab({
  products,
  categories,
  addCategory,
  updateCategory,
  deleteCategory,
}) {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const openAddCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryNameInput("");
    setCategoryError("");
    setIsCategoryFormOpen(true);
  };

  const openEditCategoryForm = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryNameInput(cat.name);
    setCategoryError("");
    setIsCategoryFormOpen(true);
  };

  const closeCategoryForm = () => {
    setIsCategoryFormOpen(false);
    setEditingCategoryId(null);
    setCategoryNameInput("");
    setCategoryError("");
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const trimmed = categoryNameInput.trim();
    if (!trimmed) {
      setCategoryError("نام دسته‌بندی نمی‌تواند خالی باشد.");
      return;
    }
    setCategoryError("");
    if (editingCategoryId) {
      updateCategory(editingCategoryId, trimmed);
    } else {
      addCategory(trimmed);
    }
    closeCategoryForm();
  };

  const countProductsInCategory = (categoryId) =>
    products.filter((p) => p.category === categoryId).length;

  const handleDeleteCategory = (cat) => {
    const count = countProductsInCategory(cat.id);
    if (count > 0) {
      setCategoryError(
        `این دسته‌بندی دارای ${count} محصول است و قابل حذف نیست.`
      );
      return;
    }
    if (window.confirm(`آیا از حذف دسته‌بندی «${cat.name}» مطمئن هستید؟`)) {
      deleteCategory(cat.id);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <button
          type="button"
          onClick={openAddCategoryForm}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 22px",
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
            color: "var(--color-bg-white)",
            borderRadius: "12px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "var(--shadow-cta)",
          }}
        >
          <Plus size={18} />
          افزودن دسته‌بندی
        </button>
      </div>

      {categoryError && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--color-error-light)",
            border: "1px solid var(--color-error-border)",
            color: "var(--color-error)",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "var(--font-size-base)",
            fontWeight: 600,
            marginBottom: "18px",
          }}
        >
          <AlertTriangle size={16} />
          {categoryError}
        </div>
      )}

      {/* فرم افزودن/ویرایش دسته‌بندی */}
      {isCategoryFormOpen && (
        <div
          style={{
            background: "var(--color-bg-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "var(--font-size-xl)",
                fontWeight: 800,
                color: "var(--color-text)",
              }}
            >
              {editingCategoryId ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
            </h2>
            <button
              type="button"
              onClick={closeCategoryForm}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
                cursor: "pointer",
              }}
              aria-label="بستن فرم"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCategorySubmit}>
            <div
              style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
            >
              <label htmlFor="categoryName" className="sr-only">نام دسته‌بندی</label>
              <input
                type="text"
                id="categoryName"
                value={categoryNameInput}
                onChange={(e) => setCategoryNameInput(e.target.value)}
                placeholder="مثلاً: تبلت"
                className="form-input"
                style={{
                  flex: 1,
                  minWidth: "200px",
                }}
              />
              <button
                type="submit"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0 22px",
                  height: "46px",
                  background: "var(--color-primary)",
                  color: "var(--color-bg-white)",
                  borderRadius: "10px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                <Check size={16} />
                {editingCategoryId ? "ذخیره" : "افزودن"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* لیست دسته‌بندی‌ها */}
      {categories.length === 0 ? (
        <div
          style={{
            background: "var(--color-bg-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "18px",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <Tags
            size={48}
            color="var(--color-text-faint)"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "var(--color-text-muted)" }}>
            هنوز دسته‌بندی‌ای ثبت نشده است.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {categories.map((cat) => {
            const count = countProductsInCategory(cat.id);
            return (
              <div
                key={cat.id}
                style={{
                  background: "var(--color-bg-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Tags size={18} />
                </div>

                <div style={{ flex: 1, minWidth: "160px" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--color-text)",
                      fontSize: "var(--font-size-md)",
                    }}
                  >
                    {cat.name}
                  </div>
                  <div style={{ color: "var(--color-text-faint)", fontSize: "var(--font-size-sm)" }}>
                    {count} محصول
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => openEditCategoryForm(cat)}
                    style={{
                      width: "38px",
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-primary)",
                      cursor: "pointer",
                      background: "var(--color-bg-white)",
                    }}
                    aria-label="ویرایش"
                    title="ویرایش"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    style={{
                      width: "38px",
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      border: "1px solid var(--color-error-border)",
                      color: "var(--color-error)",
                      cursor: "pointer",
                      background: "var(--color-bg-white)",
                    }}
                    aria-label="حذف"
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
