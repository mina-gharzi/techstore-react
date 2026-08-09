import { Link } from "react-router-dom";
import { APP_NAME } from "../../utils/constants";
import { categories } from "../../data/products";

// ======================================================
// Footer
// فوتر ثابت سایت
// ======================================================

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0f172a",
        color: "#e2e8f0",
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
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            {APP_NAME}
          </h2>
          <p style={{ lineHeight: 1.8, color: "#94a3b8", fontSize: "0.95rem" }}>
            فروشگاه آنلاین محصولات دیجیتال با بهترین قیمت، ضمانت اصالت کالا و
            ارسال سریع.
          </p>
        </div>

        {/* ---------- لینک‌های سریع ---------- */}
        <div>
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            لینک‌های سریع
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none" }}>
              خانه
            </Link>
            <Link
              to="/products"
              style={{ color: "#94a3b8", textDecoration: "none" }}
            >
              محصولات
            </Link>
            <Link
              to="/about"
              style={{ color: "#94a3b8", textDecoration: "none" }}
            >
              درباره ما
            </Link>
            <Link
              to="/contact"
              style={{ color: "#94a3b8", textDecoration: "none" }}
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
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "#fff",
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
                style={{ color: "#94a3b8", textDecoration: "none" }}
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
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "#fff",
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
              color: "#94a3b8",
              fontSize: "0.95rem",
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
          borderTop: "1px solid #1e293b",
          textAlign: "center",
          color: "#64748b",
          fontSize: "0.9rem",
        }}
      >
        © ۲۰۲۶ {APP_NAME} — تمامی حقوق محفوظ است
      </div>
    </footer>
  );
}