import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  PackageSearch,
  X,
  Check,
  AlertTriangle,
  Image as ImageIcon,
  ImageOff,
} from "lucide-react";
import { getStock } from "../../context/ProductsContext";
import { formatPrice } from "../../utils/formatPrice";
import { emptyForm } from "./adminHelpers";

export default function AdminProductsTab({
  products,
  categories,
  addProduct,
  updateProduct,
  deleteProduct,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const openAddForm = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, category: categories[0]?.id || "" });
    setErrors({});
    setImagePreviewError(false);
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : "",
      rating: String(product.rating ?? "4.5"),
      stock: String(getStock(product)),
      isNew: !!product.isNew,
      description: product.description || "",
      image: product.image || "",
    });
    setErrors({});
    setImagePreviewError(false);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (name === "image") {
      setImagePreviewError(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "نام محصول را وارد کنید";
    if (!formData.brand.trim()) newErrors.brand = "برند را وارد کنید";

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "قیمت معتبر وارد کنید";
    }

    if (
      formData.oldPrice &&
      Number(formData.oldPrice) <= Number(formData.price)
    ) {
      newErrors.oldPrice = "قیمت قبل تخفیف باید بیشتر از قیمت فعلی باشد";
    }

    if (!formData.image.trim()) {
      newErrors.image = "آدرس تصویر را وارد کنید";
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0 ||
      !Number.isInteger(Number(formData.stock))
    ) {
      newErrors.stock = "موجودی باید یک عدد صحیح و غیرمنفی باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      category: formData.category,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      rating: Number(formData.rating) || 0,
      stock: Number(formData.stock),
      isNew: formData.isNew,
      description: formData.description.trim(),
      image: formData.image.trim(),
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }

    closeForm();
  };

  const handleDelete = (product) => {
    const confirmed = window.confirm(
      `محصول «${product.name}» حذف شود؟ این عمل قابل بازگشت نیست.`,
    );
    if (confirmed) {
      deleteProduct(product.id);
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
          onClick={openAddForm}
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
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
          }}
        >
          <Plus size={18} />
          افزودن محصول
        </button>
      </div>

      {/* ---------- فرم افزودن/ویرایش ---------- */}
      {isFormOpen && (
        <div
          style={{
            background: "var(--color-bg-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "var(--color-text)",
              }}
            >
              {editingId ? "ویرایش محصول" : "محصول جدید"}
            </h2>
            <button
              onClick={closeForm}
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

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label className="form-label" htmlFor="productName">نام محصول</label>
                <input
                  type="text"
                  name="name"
                  id="productName"
                  value={formData.name}
                  onChange={handleChange}
                  className={!!errors.name ? "form-input form-input--error" : "form-input"}
                />
                {errors.name && (
                  <span className="form-error">{errors.name}</span>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="brand">برند</label>
                <input
                  type="text"
                  name="brand"
                  id="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={!!errors.brand ? "form-input form-input--error" : "form-input"}
                />
                {errors.brand && (
                  <span className="form-error">{errors.brand}</span>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label className="form-label" htmlFor="category">دسته‌بندی</label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="rating">امتیاز (۰ تا ۵)</label>
                <input
                  type="number"
                  name="rating"
                  id="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="stock">موجودی انبار</label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  className={!!errors.stock ? "form-input form-input--error" : "form-input"}
                />
                {errors.stock && (
                  <span className="form-error">{errors.stock}</span>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label className="form-label" htmlFor="price">قیمت (تومان)</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={!!errors.price ? "form-input form-input--error" : "form-input"}
                />
                {errors.price && (
                  <span className="form-error">{errors.price}</span>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="oldPrice">
                  قیمت قبل از تخفیف (اختیاری)
                </label>
                <input
                  type="number"
                  name="oldPrice"
                  id="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  className={!!errors.oldPrice ? "form-input form-input--error" : "form-input"}
                />
                {errors.oldPrice && (
                  <span className="form-error">{errors.oldPrice}</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="form-label" htmlFor="imageUrl">آدرس تصویر</label>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <input
                  type="text"
                  name="image"
                  id="imageUrl"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="/assets/images/product/example.jpg"
                  className="form-input"
                  style={{
                    flex: 1,
                    minWidth: "200px",
                  }}
                />

                {/* پیش‌نمایش زنده - با هر تغییر آدرس، همین‌جا آپدیت میشه */}
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "12px",
                    border: "1.5px dashed var(--color-border)",
                    background: "var(--color-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  {!formData.image.trim() ? (
                    <ImageIcon size={22} color="#cbd5e1" />
                  ) : imagePreviewError ? (
                    <div style={{ textAlign: "center", padding: "4px" }}>
                      <ImageOff
                        size={18}
                        color="var(--color-warning)"
                        style={{ margin: "0 auto 2px" }}
                      />
                      <span
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--color-warning)",
                          fontWeight: 700,
                        }}
                      >
                        نامعتبر
                      </span>
                    </div>
                  ) : (
                    <img
                      src={formData.image}
                      alt="پیش‌نمایش محصول"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      onError={() => setImagePreviewError(true)}
                    />
                  )}
                </div>
              </div>
              {errors.image && (
                <span className="form-error">{errors.image}</span>
              )}
              {!errors.image &&
                formData.image.trim() &&
                imagePreviewError && (
                  <span className="form-error">
                    این آدرس تصویر بارگذاری نشد - لینک را بررسی کنید
                  </span>
                )}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="form-label" htmlFor="description">توضیحات</label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="form-input form-textarea"
                style={{
                  height: "auto",
                  padding: "12px 14px",
                  resize: "vertical",
                  lineHeight: 1.7,
                }}
              />
            </div>

            <label
              htmlFor="isNew"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "22px",
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              <input
                type="checkbox"
                name="isNew"
                id="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                }}
              />
              <span
                style={{
                  fontWeight: 600,
                  color: "var(--color-text-secondary)",
                  fontSize: "0.9rem",
                }}
              >
                نشان "جدید" روی این محصول نمایش داده شود
              </span>
            </label>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                style={{
                  padding: "12px 28px",
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                  color: "var(--color-bg-white)",
                  borderRadius: "12px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {editingId ? "ذخیره تغییرات" : "افزودن محصول"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                style={{
                  padding: "12px 28px",
                  background: "var(--color-bg-white)",
                  color: "var(--color-text-muted)",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------- لیست محصولات ---------- */}
      {products.length === 0 ? (
        <div
          style={{
            background: "var(--color-bg-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "18px",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <PackageSearch
            size={48}
            color="var(--color-text-faint)"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "var(--color-text-muted)" }}>هنوز محصولی ثبت نشده است.</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {products.map((product) => {
            const stock = getStock(product);
            return (
            <div
              key={product.id}
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
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "56px",
                  height: "56px",
                  objectFit: "contain",
                  background: "var(--color-bg)",
                  borderRadius: "10px",
                  padding: "6px",
                }}
                onError={(e) => {
                  e.target.src = "/assets/images/product/no-image.png";
                }}
              />

              <div style={{ flex: 1, minWidth: "160px" }}>
                <div
                  style={{
                    fontWeight: 700,
                    color: "var(--color-text)",
                    fontSize: "0.95rem",
                  }}
                >
                  {product.name}
                  {product.isNew && (
                    <span
                      style={{
                        marginRight: "8px",
                        background: "var(--color-primary-light)",
                        color: "var(--color-primary)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "50px",
                      }}
                    >
                      جدید
                    </span>
                  )}
                </div>
                <div style={{ color: "var(--color-text-faint)", fontSize: "0.82rem" }}>
                  {product.brand} ·{" "}
                  {
                    categories.find((c) => c.id === product.category)
                      ?.name
                  }
                </div>
              </div>

              <div
                style={{
                  fontWeight: 800,
                  color: "var(--color-primary)",
                  minWidth: "110px",
                }}
              >
                {formatPrice(product.price)}
              </div>

              {/* نشان موجودی: قرمز اگه صفره، نارنجی اگه کم (زیر ۵)، خاکستری در غیر این صورت */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: "90px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color:
                    stock === 0
                      ? "var(--color-error)"
                      : stock <= 5
                        ? "var(--color-warning)"
                        : "var(--color-text-muted)",
                }}
              >
                {stock === 0 && <AlertTriangle size={14} />}
                {stock === 0
                  ? "ناموجود"
                  : `${stock} عدد`}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => openEditForm(product)}
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
                  onClick={() => handleDelete(product)}
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
