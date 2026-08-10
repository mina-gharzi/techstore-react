import { useState } from "react";
import { Plus, Pencil, Trash2, X, PackageSearch, AlertTriangle } from "lucide-react";
import { useProducts, getStock } from "../context/ProductsContext";
import { categories } from "../data/products";
import { formatPrice } from "../utils/formatPrice";

// ======================================================
// AdminDashboard
// پنل مدیریت محصولات: افزودن / ویرایش / حذف
//
// نکته: چون بک‌اند واقعی نداریم، هر تغییری که اینجا انجام بشه
// فقط توی همین مرورگر (localStorage از طریق ProductsContext)
// ذخیره می‌شه. یعنی اگه یه کاربر دیگه از یه مرورگر دیگه سایت رو
// باز کنه، تغییرات ادمین رو نمی‌بینه. برای یک استور واقعی، این
// context باید با درخواست‌های واقعی به یک API جایگزین بشه.
// ======================================================

const emptyForm = {
  name: "",
  brand: "",
  category: categories[0]?.id || "",
  price: "",
  oldPrice: "",
  rating: "4.5",
  stock: "0",
  isNew: false,
  description: "",
  image: "",
};

export default function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // ---------- باز کردن فرم برای افزودن ----------
  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
    setIsFormOpen(true);
  };

  // ---------- باز کردن فرم برای ویرایش ----------
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

    if (formData.stock === "" || Number(formData.stock) < 0 || !Number.isInteger(Number(formData.stock))) {
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

  // ---------- استایل مشترک ----------
  const inputStyle = (hasError) => ({
    width: "100%",
    height: "46px",
    padding: "0 14px",
    border: `1.5px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
    borderRadius: "10px",
    fontSize: "0.92rem",
    outline: "none",
    background: hasError ? "#fef2f2" : "#f8fafc",
    fontFamily: "inherit",
    color: "#0f172a",
  });

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: 700,
    color: "#1e293b",
    fontSize: "0.85rem",
  };

  const errorStyle = {
    display: "block",
    marginTop: "5px",
    color: "#ef4444",
    fontSize: "0.78rem",
    fontWeight: 600,
  };

  return (
    <section style={{ padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* ---------- عنوان ---------- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
              پنل مدیریت محصولات
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.92rem" }}>
              {products.length} محصول در فروشگاه
            </p>
          </div>

          <button
            onClick={openAddForm}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 22px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff",
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
              background: "#fff",
              border: "1px solid #e2e8f0",
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
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
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
                  color: "#64748b",
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
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>نام محصول</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle(!!errors.name)}
                  />
                  {errors.name && <span style={errorStyle}>{errors.name}</span>}
                </div>

                <div>
                  <label style={labelStyle}>برند</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    style={inputStyle(!!errors.brand)}
                  />
                  {errors.brand && <span style={errorStyle}>{errors.brand}</span>}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>دسته‌بندی</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={inputStyle(false)}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>امتیاز (۰ تا ۵)</label>
                  <input
                    type="number"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    style={inputStyle(false)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>موجودی انبار</label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={handleChange}
                    style={inputStyle(!!errors.stock)}
                  />
                  {errors.stock && <span style={errorStyle}>{errors.stock}</span>}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>قیمت (تومان)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    style={inputStyle(!!errors.price)}
                  />
                  {errors.price && <span style={errorStyle}>{errors.price}</span>}
                </div>

                <div>
                  <label style={labelStyle}>قیمت قبل از تخفیف (اختیاری)</label>
                  <input
                    type="number"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    style={inputStyle(!!errors.oldPrice)}
                  />
                  {errors.oldPrice && <span style={errorStyle}>{errors.oldPrice}</span>}
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>آدرس تصویر</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="/assets/images/product/example.jpg"
                  style={inputStyle(!!errors.image)}
                />
                {errors.image && <span style={errorStyle}>{errors.image}</span>}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>توضیحات</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    ...inputStyle(false),
                    height: "auto",
                    padding: "12px 14px",
                    resize: "vertical",
                    lineHeight: 1.7,
                  }}
                />
              </div>

              <label
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
                  checked={formData.isNew}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span style={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}>
                  نشان "جدید" روی این محصول نمایش داده شود
                </span>
              </label>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 28px",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff",
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
                    background: "#fff",
                    color: "#64748b",
                    border: "1.5px solid #e2e8f0",
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
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <PackageSearch size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "#64748b" }}>هنوز محصولی ثبت نشده است.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
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
                    background: "#f8fafc",
                    borderRadius: "10px",
                    padding: "6px",
                  }}
                  onError={(e) => {
                    e.target.src = "/assets/images/product/no-image.png";
                  }}
                />

                <div style={{ flex: 1, minWidth: "160px" }}>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>
                    {product.name}
                    {product.isNew && (
                      <span
                        style={{
                          marginRight: "8px",
                          background: "#eff6ff",
                          color: "#2563eb",
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
                  <div style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                    {product.brand} ·{" "}
                    {categories.find((c) => c.id === product.category)?.name}
                  </div>
                </div>

                <div style={{ fontWeight: 800, color: "#2563eb", minWidth: "110px" }}>
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
                      getStock(product) === 0
                        ? "#ef4444"
                        : getStock(product) <= 5
                          ? "#f59e0b"
                          : "#64748b",
                  }}
                >
                  {getStock(product) === 0 && <AlertTriangle size={14} />}
                  {getStock(product) === 0 ? "ناموجود" : `${getStock(product)} عدد`}
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
                      border: "1px solid #e2e8f0",
                      color: "#2563eb",
                      cursor: "pointer",
                      background: "#fff",
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
                      border: "1px solid #fecaca",
                      color: "#ef4444",
                      cursor: "pointer",
                      background: "#fff",
                    }}
                    aria-label="حذف"
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}