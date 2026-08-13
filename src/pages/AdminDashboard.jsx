import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  PackageSearch,
  AlertTriangle,
  Package,
  ClipboardList,
  Users,
  ShieldCheck,
  ShieldOff,
  Tags,
  Check,
  Image as ImageIcon,
  ImageOff,
} from "lucide-react";
import { useProducts, getStock } from "../context/ProductsContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { useCategories } from "../context/CategoriesContext";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/formatPrice";

// ======================================================
// AdminDashboard
// پنل مدیریت: چهار تب - محصولات، سفارش‌ها، کاربران، دسته‌بندی‌ها
//
// نکته: چون بک‌اند واقعی نداریم، هر تغییری که اینجا انجام بشه
// فقط توی همین مرورگر (localStorage) ذخیره می‌شه. یعنی اگه یه
// کاربر دیگه از یه مرورگر دیگه سایت رو باز کنه، تغییرات ادمین
// رو نمی‌بینه. برای یک استور واقعی، این context ها باید با
// درخواست‌های واقعی به یک API جایگزین بشن.
// ======================================================

const ORDER_STATUSES = ["در حال پردازش", "ارسال شد", "تحویل داده شد", "لغو شده"];

const statusColor = (status) => {
  if (status === "تحویل داده شد") return { bg: "#f0fdf4", text: "#16a34a" };
  if (status === "لغو شده") return { bg: "#fef2f2", text: "#ef4444" };
  if (status === "ارسال شد") return { bg: "#eff6ff", text: "#2563eb" };
  return { bg: "#fffbeb", text: "#d97706" }; // در حال پردازش
};

// نکته: قبلاً "category: categories[0]?.id" مستقیم توی این آبجکت
// در سطح ماژول محاسبه می‌شد، چون categories از یک import ثابت
// میومد. الان که categories از useCategories() (یک هوک، فقط
// داخل کامپوننت قابل‌فراخوانی) میاد، این مقدار دیگه اینجا در
// دسترس نیست؛ پس فیلد category خالی می‌مونه و در openAddForm
// (داخل خودِ کامپوننت) با اولین دسته‌بندی موجود پر می‌شه.
const emptyForm = {
  name: "",
  brand: "",
  category: "",
  price: "",
  oldPrice: "",
  rating: "4.5",
  stock: "0",
  isNew: false,
  description: "",
  image: "",
};

export default function AdminDashboard() {
  usePageTitle("پنل مدیریت");
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { orders, updateOrderStatus } = useOrders();
  const { users, deleteUser, setUserRole, user: currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState("products"); // "products" | "orders" | "users" | "categories"
  const [userActionError, setUserActionError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // ---------- پیش‌نمایش تصویر ----------
  // true وقتی <img> نتونه آدرس فعلی رو لود کنه (لینک خراب/اشتباه).
  // با هر تغییر آدرس، دوباره false می‌شه تا یه شانس جدید امتحان بشه.
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // ---------- باز کردن فرم برای افزودن ----------
  const openAddForm = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, category: categories[0]?.id || "" });
    setErrors({});
    setImagePreviewError(false);
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
    // با هر تغییر توی آدرس تصویر، وضعیت خطای پیش‌نمایش رو ریست کن
    // تا دوباره امتحان بشه لود بشه
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

  // ---------- Handlers: مدیریت کاربران ----------
  const handleDeleteUser = (targetUser) => {
    const confirmed = window.confirm(
      `کاربر «${targetUser.fullName}» حذف شود؟ این عمل قابل بازگشت نیست.`,
    );
    if (!confirmed) return;

    const result = deleteUser(targetUser.id);
    if (!result.success) {
      setUserActionError(result.message);
      setTimeout(() => setUserActionError(""), 3000);
    }
  };

  const handleToggleRole = (targetUser) => {
    const newRole = targetUser.role === "admin" ? "customer" : "admin";
    const result = setUserRole(targetUser.id, newRole);
    if (!result.success) {
      setUserActionError(result.message);
      setTimeout(() => setUserActionError(""), 3000);
    }
  };

  // ---------- Handlers: مدیریت دسته‌بندی‌ها ----------
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

  const openEditCategoryForm = (category) => {
    setEditingCategoryId(category.id);
    setCategoryNameInput(category.name);
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

    const result = editingCategoryId
      ? updateCategory(editingCategoryId, categoryNameInput)
      : addCategory(categoryNameInput);

    if (!result.success) {
      setCategoryError(result.message);
      return;
    }

    closeCategoryForm();
  };

  // تعداد محصولاتی که توی این دسته‌بندی هستن - برای جلوگیری از
  // حذف یک دسته‌بندی درحالی‌که هنوز محصولی داخلش وجود داره
  // (وگرنه اون محصولات یه category یتیم پیدا می‌کردن که هیچ‌جا
  // نمایش داده نمی‌شن)
  const countProductsInCategory = (categoryId) =>
    products.filter((p) => p.category === categoryId).length;

  const handleDeleteCategory = (category) => {
    const productCount = countProductsInCategory(category.id);

    if (productCount > 0) {
      setCategoryError(
        `${productCount} محصول در دسته‌بندی «${category.name}» وجود دارد. ابتدا آن‌ها را حذف یا به دسته‌ی دیگری منتقل کنید.`,
      );
      setTimeout(() => setCategoryError(""), 4000);
      return;
    }

    const confirmed = window.confirm(`دسته‌بندی «${category.name}» حذف شود؟`);
    if (confirmed) {
      deleteCategory(category.id);
    }
  };

  // ---------- کمکی: فرمت تاریخ فارسی برای سفارش‌ها ----------
  const formatOrderDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
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
        {/* ---------- عنوان + تب‌ها ---------- */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
            پنل مدیریت
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.92rem" }}>
            {activeTab === "products" && `${products.length} محصول در فروشگاه`}
            {activeTab === "orders" && `${orders.length} سفارش ثبت‌شده`}
            {activeTab === "users" && `${users.length} کاربر ثبت‌نام‌شده`}
            {activeTab === "categories" && `${categories.length} دسته‌بندی`}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <button
            onClick={() => setActiveTab("products")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "products" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "products" ? "#2563eb" : "#64748b",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: "-1px",
            }}
          >
            <Package size={17} />
            محصولات
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "orders" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "orders" ? "#2563eb" : "#64748b",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: "-1px",
            }}
          >
            <ClipboardList size={17} />
            سفارش‌ها
            {orders.length > 0 && (
              <span
                style={{
                  background: activeTab === "orders" ? "#2563eb" : "#e2e8f0",
                  color: activeTab === "orders" ? "#fff" : "#64748b",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "1px 7px",
                  borderRadius: "50px",
                }}
              >
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("users")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "users" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "users" ? "#2563eb" : "#64748b",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: "-1px",
            }}
          >
            <Users size={17} />
            کاربران
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "categories" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "categories" ? "#2563eb" : "#64748b",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: "-1px",
            }}
          >
            <Tags size={17} />
            دسته‌بندی‌ها
          </button>
        </div>

        {/* ===================== تب محصولات ===================== */}
        {activeTab === "products" && (
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
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="/assets/images/product/example.jpg"
                    style={{ ...inputStyle(!!errors.image), flex: 1, minWidth: "200px" }}
                  />

                  {/* پیش‌نمایش زنده - با هر تغییر آدرس، همین‌جا آپدیت میشه */}
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "12px",
                      border: "1.5px dashed #e2e8f0",
                      background: "#f8fafc",
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
                        <ImageOff size={18} color="#f59e0b" style={{ margin: "0 auto 2px" }} />
                        <span style={{ fontSize: "0.6rem", color: "#f59e0b", fontWeight: 700 }}>
                          نامعتبر
                        </span>
                      </div>
                    ) : (
                      <img
                        src={formData.image}
                        alt="پیش‌نمایش محصول"
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        onError={() => setImagePreviewError(true)}
                      />
                    )}
                  </div>
                </div>
                {errors.image && <span style={errorStyle}>{errors.image}</span>}
                {!errors.image && formData.image.trim() && imagePreviewError && (
                  <span style={errorStyle}>
                    این آدرس تصویر بارگذاری نشد - لینک را بررسی کنید
                  </span>
                )}
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
        </>
        )}

        {/* ===================== تب سفارش‌ها ===================== */}
        {activeTab === "orders" && (
          orders.length === 0 ? (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "60px 20px",
                textAlign: "center",
              }}
            >
              <ClipboardList size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "#64748b" }}>هنوز سفارشی ثبت نشده است.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {orders.map((order) => {
                const colors = statusColor(order.status);
                return (
                  <div
                    key={order.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.98rem" }}>
                          {order.orderNumber}
                        </div>
                        <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "3px" }}>
                          {order.customerName} · {formatOrderDate(order.createdAt)}
                        </div>
                      </div>

                      {/* تغییر وضعیت سفارش */}
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "10px",
                          border: "1.5px solid #e2e8f0",
                          background: colors.bg,
                          color: colors.text,
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          fontFamily: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* آیتم‌های سفارش */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        paddingTop: "12px",
                        borderTop: "1px dashed #f1f5f9",
                        marginBottom: "12px",
                      }}
                    >
                      {order.items?.map((item) => (
                        <div
                          key={item.cartItemId || item.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.85rem",
                            color: "#64748b",
                          }}
                        >
                          <span>
                            {item.name}
                            {item.selectedColor ? ` (${item.selectedColor})` : ""} ×{" "}
                            {item.quantity}
                          </span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* آدرس ارسال */}
                    {order.shippingAddress && (
                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: "#94a3b8",
                          marginBottom: "12px",
                        }}
                      >
                        📍 {order.shippingAddress.city}، {order.shippingAddress.address} — {order.shippingAddress.phone}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "12px",
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                        {order.totalItems} کالا ·{" "}
                        {order.paymentMethod === "online" ? "پرداخت آنلاین" : "پرداخت در محل"}
                      </span>
                      <span style={{ fontWeight: 800, color: "#2563eb", fontSize: "1.02rem" }}>
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ===================== تب کاربران ===================== */}
        {activeTab === "users" && (
          <>
            {userActionError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#ef4444",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  marginBottom: "18px",
                }}
              >
                <AlertTriangle size={16} />
                {userActionError}
              </div>
            )}

            {users.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "60px 20px",
                  textAlign: "center",
                }}
              >
                <Users size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
                <p style={{ color: "#64748b" }}>هنوز کاربری ثبت‌نام نکرده است.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {users.map((u) => {
                  const isSelf = currentUser && u.id === currentUser.id;
                  const isAdminUser = u.role === "admin";

                  return (
                    <div
                      key={u.id}
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
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: isAdminUser
                            ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                            : "#e2e8f0",
                          color: isAdminUser ? "#fff" : "#64748b",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {u.fullName?.charAt(0) || "?"}
                      </div>

                      <div style={{ flex: 1, minWidth: "180px" }}>
                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>
                          {u.fullName}
                          {isSelf && (
                            <span style={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.78rem" }}>
                              {" "}(خودتان)
                            </span>
                          )}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                          {u.email} · {u.phone}
                        </div>
                      </div>

                      <span
                        style={{
                          background: isAdminUser ? "#eff6ff" : "#f1f5f9",
                          color: isAdminUser ? "#2563eb" : "#64748b",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: "50px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isAdminUser ? "ادمین" : "کاربر عادی"}
                      </span>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleToggleRole(u)}
                          disabled={isSelf}
                          title={isAdminUser ? "تبدیل به کاربر عادی" : "تبدیل به ادمین"}
                          style={{
                            width: "38px",
                            height: "38px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            color: isSelf ? "#cbd5e1" : "#2563eb",
                            cursor: isSelf ? "not-allowed" : "pointer",
                            background: "#fff",
                          }}
                        >
                          {isAdminUser ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          disabled={isSelf}
                          title="حذف کاربر"
                          style={{
                            width: "38px",
                            height: "38px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "10px",
                            border: "1px solid #fecaca",
                            color: isSelf ? "#fca5a5" : "#ef4444",
                            cursor: isSelf ? "not-allowed" : "pointer",
                            background: "#fff",
                            opacity: isSelf ? 0.6 : 1,
                          }}
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
        )}

        {/* ===================== تب دسته‌بندی‌ها ===================== */}
        {activeTab === "categories" && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
              <button
                onClick={openAddCategoryForm}
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
                افزودن دسته‌بندی
              </button>
            </div>

            {categoryError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#ef4444",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "0.88rem",
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
                  background: "#fff",
                  border: "1px solid #e2e8f0",
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
                  <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
                    {editingCategoryId ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
                  </h2>
                  <button
                    onClick={closeCategoryForm}
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

                <form onSubmit={handleCategorySubmit}>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <input
                      type="text"
                      value={categoryNameInput}
                      onChange={(e) => setCategoryNameInput(e.target.value)}
                      placeholder="مثلاً: تبلت"
                      style={{ ...inputStyle(false), flex: 1, minWidth: "200px" }}
                    />
                    <button
                      type="submit"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "0 22px",
                        height: "46px",
                        background: "#2563eb",
                        color: "#fff",
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
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "60px 20px",
                  textAlign: "center",
                }}
              >
                <Tags size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
                <p style={{ color: "#64748b" }}>هنوز دسته‌بندی‌ای ثبت نشده است.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {categories.map((cat) => {
                  const count = countProductsInCategory(cat.id);
                  return (
                    <div
                      key={cat.id}
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
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: "#eff6ff",
                          color: "#2563eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Tags size={18} />
                      </div>

                      <div style={{ flex: 1, minWidth: "160px" }}>
                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>
                          {cat.name}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                          {count} محصول
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => openEditCategoryForm(cat)}
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
                          onClick={() => handleDeleteCategory(cat)}
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
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}