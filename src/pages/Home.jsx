import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import { usePageTitle } from "../hooks/usePageTitle";
import ProductCard from "../components/product/ProductCard";

// ======================================================
// Home
// صفحه اصلی فروشگاه - نسخه طراحی‌شده
//
// نکته: قبلاً "products" مستقیم از data/products.js (یک آرایه‌ی
// ثابت) ایمپورت می‌شد. الان از useProducts() میاد که به
// localStorage وصله - یعنی اگه ادمین از پنل مدیریت محصولی اضافه/
// حذف/ویرایش کنه، همین‌جا هم بدون نیاز به تغییر کد دیده می‌شه.
// categories همچنان ثابته چون فعلاً ادمین دسته‌بندی جدید نمی‌سازه.
// ======================================================

export default function Home() {
  usePageTitle(); // صفحه‌ی اصلی فقط اسم فروشگاه رو نشون میده، بدون پیشوند
  const { products } = useProducts();
  const { categories } = useCategories();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);
  const discountProducts = products
    .filter((p) => p.oldPrice && p.oldPrice > p.price)
    .slice(0, 4);

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* ===================== Hero ===================== */}
      <section
        style={{
          position: "relative",
          padding: "100px 20px 90px",
          background:
            "radial-gradient(circle at top right, rgba(37,99,235,0.12) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(59,130,246,0.08) 0%, transparent 40%), linear-gradient(180deg, #f8fbff 0%, var(--color-bg-white) 100%)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(37, 99, 235, 0.1)",
              color: "var(--color-primary)",
              padding: "9px 20px",
              borderRadius: "50px",
              fontSize: "0.92rem",
              fontWeight: 700,
              marginBottom: "28px",
              border: "1px solid rgba(37, 99, 235, 0.15)",
            }}
          >
            ✨ فروشگاه آنلاین تکنولوژی
          </span>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight: 900,
              color: "var(--color-text)",
              lineHeight: 1.25,
              marginBottom: "22px",
              letterSpacing: "-0.5px",
            }}
          >
            جدیدترین محصولات
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--color-primary), #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              دنیای تکنولوژی
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.12rem",
              color: "var(--color-text-muted)",
              maxWidth: "560px",
              margin: "0 auto 36px",
              lineHeight: 2,
            }}
          >
            موبایل، لپ‌تاپ، ساعت هوشمند و لوازم جانبی را با بهترین قیمت، ضمانت
            اصالت کالا و ارسال سریع خریداری کنید.
          </p>

          <div
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "50px",
            }}
          >
            <Link
              to="/products"
              style={{
                padding: "15px 38px",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                color: "var(--color-bg-white)",
                borderRadius: "50px",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 14px 32px rgba(37, 99, 235, 0.32)",
              }}
            >
              مشاهده محصولات
            </Link>

            <Link
              to="/about"
              style={{
                padding: "15px 38px",
                background: "var(--color-bg-white)",
                color: "var(--color-primary)",
                borderRadius: "50px",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                border: "1.5px solid #bfdbfe",
                boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
              }}
            >
              درباره ما
            </Link>
          </div>

          {/* ویژگی‌ها */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            {[
              { icon: "🚚", text: "ارسال سریع" },
              { icon: "✅", text: "ضمانت اصالت" },
              { icon: "🔒", text: "پرداخت امن" },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "50px",
                  padding: "11px 22px",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  color: "var(--color-text-secondary)",
                  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
                }}
              >
                <span>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== Categories ===================== */}
      <section style={{ padding: "80px 20px", background: "var(--color-bg-white)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2rem)",
                fontWeight: 800,
                color: "var(--color-text)",
                marginBottom: "12px",
              }}
            >
              دسته‌بندی محصولات
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.05rem" }}>
              محصول موردنظرتان را سریع‌تر پیدا کنید
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                style={{
                  background:
                    "linear-gradient(180deg, var(--color-bg-white) 0%, var(--color-bg) 100%)",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: "20px",
                  padding: "36px 20px",
                  textAlign: "center",
                  textDecoration: "none",
                  color: "var(--color-text)",
                  fontWeight: 700,
                  fontSize: "1.12rem",
                  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== Featured Products ===================== */}
      <section style={{ padding: "80px 20px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2rem)",
                fontWeight: 800,
                color: "var(--color-text)",
                marginBottom: "12px",
              }}
            >
              محصولات ویژه
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.05rem" }}>
              جدیدترین و محبوب‌ترین محصولات فروشگاه
            </p>
          </div>

          <div
            className="home-product-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "44px" }}>
            <Link
              to="/products"
              style={{
                display: "inline-block",
                padding: "13px 32px",
                background: "var(--color-bg-white)",
                color: "var(--color-primary)",
                border: "1.5px solid var(--color-primary)",
                borderRadius: "14px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.1)",
              }}
            >
              مشاهده همه محصولات
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== New Products ===================== */}
      <section style={{ padding: "80px 20px", background: "var(--color-bg-white)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2rem)",
                fontWeight: 800,
                color: "var(--color-text)",
                marginBottom: "12px",
              }}
            >
              محصولات جدید
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.05rem" }}>
              تازه‌ترین محصولات اضافه‌شده به فروشگاه
            </p>
          </div>

          <div
            className="home-product-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "44px" }}>
            <Link
              to="/products?filter=new"
              style={{
                display: "inline-block",
                padding: "13px 32px",
                background: "var(--color-bg-white)",
                color: "var(--color-primary)",
                border: "1.5px solid var(--color-primary)",
                borderRadius: "14px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.1)",
              }}
            >
              مشاهده همه محصولات جدید
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== Discounted Products ===================== */}
      <section style={{ padding: "80px 20px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2rem)",
                fontWeight: 800,
                color: "var(--color-text)",
                marginBottom: "12px",
              }}
            >
              محصولات تخفیفی
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.05rem" }}>
              محصولات با بیشترین تخفیف
            </p>
          </div>

          <div
            className="home-product-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {discountProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "44px" }}>
            <Link
              to="/products?filter=discount"
              style={{
                display: "inline-block",
                padding: "13px 32px",
                background: "var(--color-bg-white)",
                color: "var(--color-primary)",
                border: "1.5px solid var(--color-primary)",
                borderRadius: "14px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.1)",
              }}
            >
              مشاهده همه محصولات تخفیفی
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== Special Offer ===================== */}
      <section style={{ padding: "30px 20px 90px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 55%, #1e40af 100%)",
              borderRadius: "28px",
              padding: "70px 40px",
              textAlign: "center",
              color: "var(--color-bg-white)",
              boxShadow: "0 28px 60px rgba(37, 99, 235, 0.35)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.25)",
                padding: "9px 20px",
                borderRadius: "50px",
                fontSize: "0.9rem",
                fontWeight: 700,
                marginBottom: "22px",
              }}
            >
              🔥 پیشنهاد ویژه
            </span>

            <h2
              style={{
                fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                marginBottom: "18px",
                letterSpacing: "-0.3px",
              }}
            >
              تا ۳۰٪ تخفیف روی محصولات منتخب
            </h2>

            <p
              style={{
                maxWidth: "520px",
                margin: "0 auto 30px",
                opacity: 0.93,
                lineHeight: 1.9,
                fontSize: "1.05rem",
              }}
            >
              فرصت را از دست ندهید و جدیدترین محصولات را با قیمت ویژه تهیه کنید.
            </p>

            <Link
              to="/products?filter=discount"
              style={{
                display: "inline-block",
                padding: "14px 36px",
                background: "var(--color-bg-white)",
                color: "var(--color-primary-dark)",
                borderRadius: "50px",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
              }}
            >
              مشاهده محصولات تخفیفی
            </Link>
          </div>
        </div>
      </section>

      {/*
        ریسپانسیو موبایل: قبلاً هر سه بخش (ویژه/جدید/تخفیفی) یک
        گرید عمودی بودن که روی صفحه‌ی موبایل خیلی طولانی و پر از
        اسکرول می‌شدن (۳ بخش × ۴ کارت = ۱۲ کارت زیر هم). زیر
        ۶۴۰px، همون گرید رو به یک ردیف اسکرول افقی تبدیل می‌کنیم
        (دقیقاً مثل اکثر اپ‌های فروشگاهی) تا هم فضای عمودی خیلی
        کمتر بشه، هم "مشاهده همه محصولات" پایین هر بخش راحت‌تر
        در دسترس باشه.
      */}
      <style>{`
        @media (max-width: 640px) {
          .home-product-grid {
            display: flex !important;
            overflow-x: auto;
            gap: 14px !important;
            padding-bottom: 6px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .home-product-grid > * {
            flex: 0 0 200px;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </div>
  );
}