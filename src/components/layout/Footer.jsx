import { Link } from "react-router-dom";
import { APP_NAME } from "../../utils/constants";
import { useCategories } from "../../context/CategoriesContext";

// ======================================================
// Footer
// فوتر ثابت سایت
// ======================================================

export default function Footer() {
  const { categories } = useCategories();

  return (
    <footer
      style={{
        background: "var(--color-text)",
        color: "var(--color-border)",
        padding: "50px 20px 30px",
        marginTop: "60px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
        }}
      >
        {/* ---------- معرفی فروشگاه ---------- */}
        <div>
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "var(--color-bg-white)",
              marginBottom: "16px",
            }}
          >
            {APP_NAME}
          </h2>
          <p style={{ lineHeight: 1.8, color: "var(--color-text-faint)", fontSize: "var(--font-size-md)" }}>
            فروشگاه آنلاین محصولات دیجیتال با بهترین قیمت، ضمانت اصالت کالا و
            ارسال سریع.
          </p>
        </div>

        {/* ---------- لینک‌های سریع ---------- */}
        <div>
          <h3
            style={{
              fontSize: "var(--font-size-xl)",
              fontWeight: 700,
              color: "var(--color-bg-white)",
              marginBottom: "16px",
            }}
          >
            لینک‌های سریع
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/" style={{ color: "var(--color-text-faint)", textDecoration: "none" }}>
              خانه
            </Link>
            <Link
              to="/products"
              style={{ color: "var(--color-text-faint)", textDecoration: "none" }}
            >
              محصولات
            </Link>
            <Link
              to="/about"
              style={{ color: "var(--color-text-faint)", textDecoration: "none" }}
            >
              درباره ما
            </Link>
            <Link
              to="/contact"
              style={{ color: "var(--color-text-faint)", textDecoration: "none" }}
            >
              تماس با ما
            </Link>
          </div>
        </div>

        {/* ---------- دسته‌بندی‌ها ----------
            قبلاً همه‌ی این لینک‌ها به‌صورت هاردکد به "/products" ساده
            وصل بودن (بدون فیلتر واقعی). حالا از همون آرایه‌ی categories
            که توی data/products.js تعریف شده لوپ می‌زنیم، دقیقاً مثل
            Home.jsx - هم لینک‌ها درست فیلتر می‌کنن، هم اگه دسته‌بندی
            جدید اضافه/حذف بشه، فوتر خودکار sync می‌مونه.
        ---------- */}
        <div>
          <h3
            style={{
              fontSize: "var(--font-size-xl)",
              fontWeight: 700,
              color: "var(--color-bg-white)",
              marginBottom: "16px",
            }}
          >
            دسته‌بندی‌ها
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                style={{ color: "var(--color-text-faint)", textDecoration: "none" }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ---------- ارتباط با ما ---------- */}
        <div>
          <h3
            style={{
              fontSize: "var(--font-size-xl)",
              fontWeight: 700,
              color: "var(--color-bg-white)",
              marginBottom: "16px",
            }}
          >
            ارتباط با ما
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "var(--color-text-faint)",
              fontSize: "var(--font-size-md)",
            }}
          >
            <span>📍 تهران، ایران</span>
            <span>📞 ۰۲۱-۱۲۳۴۵۶۷۸</span>
            <span>✉️ info@techstore.com</span>
          </div>
        </div>
      </div>

      {/* ---------- کپی‌رایت ---------- */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "40px auto 0",
          paddingTop: "24px",
          borderTop: "1px solid var(--slate-800)",
          textAlign: "center",
          color: "var(--color-text-muted)",
          fontSize: "var(--font-size-md)",
        }}
      >
        © ۲۰۲۶ {APP_NAME} — تمامی حقوق محفوظ است
      </div>
    </footer>
  );
}