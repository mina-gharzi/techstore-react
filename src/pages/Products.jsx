import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import { usePageTitle } from "../hooks/usePageTitle";
import ProductCard from "../components/product/ProductCard";

// ======================================================
// Products
// صفحه محصولات - کامل با سرچ، فیلتر و مرتب‌سازی
//
// نکته: "products" قبلاً مستقیم از data/products.js میومد.
// الان از useProducts() میاد تا محصولاتی که ادمین اضافه/ویرایش/
// حذف می‌کنه این‌جا هم دیده بشن.
// ======================================================

export default function Products() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  // ---------- State ----------
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  // از URL می‌خوانیم
  const activeCategory = searchParams.get("category") || "all";
  const activeFilter = searchParams.get("filter") || "all";

  // ---------- تغییر فیلترها ----------
  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params);
  };

  // ---------- فیلتر + سرچ + سورت ----------
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // دسته‌بندی
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // فیلتر خاص
    if (activeFilter === "new") {
      result = result.filter((p) => p.isNew);
    }

    if (activeFilter === "discount") {
      result = result.filter((p) => p.oldPrice && p.oldPrice > p.price);
    }

    // سرچ
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    // مرتب‌سازی
    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === "newest") {
      result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    }

    return result;
  }, [products, activeCategory, activeFilter, search, sort]);

  // ---------- عنوان صفحه ----------
  const pageTitle = useMemo(() => {
    if (activeFilter === "new") return "محصولات جدید";
    if (activeFilter === "discount") return "محصولات تخفیفی";
    if (activeCategory !== "all") {
      const cat = categories.find((c) => c.id === activeCategory);
      return cat ? cat.name : "محصولات";
    }
    return "همه محصولات";
  }, [activeCategory, activeFilter, categories]);

  // عنوان صفحه هم توی UI نشون داده میشه (پایین‌تر توی <h1>) هم
  // توی تب مرورگر - این‌جوری اگه کاربر چند تب باز کرده باشه
  // (مثلاً یکی فیلتر "جدید"، یکی فیلتر "تخفیفی")، از روی خودِ تب
  // فرقشون رو تشخیص میده.
  usePageTitle(pageTitle);

  // ---------- پاک کردن فیلترها ----------
  const clearFilters = () => {
    setSearch("");
    setSort("default");
    setSearchParams({});
  };

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeFilter !== "all" ||
    search.trim() ||
    sort !== "default";

  // ---------- استایل‌های مشترک ----------
  const sidebarCard = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "22px",
    marginBottom: "16px",
  };

  const filterBtn = (active) => ({
    width: "100%",
    textAlign: "right",
    padding: "11px 14px",
    borderRadius: "12px",
    border: "none",
    background: active ? "#eff6ff" : "transparent",
    color: active ? "#2563eb" : "#334155",
    fontWeight: active ? 800 : 600,
    fontSize: "0.95rem",
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: "4px",
  });

  return (
    <div>
      {/* ===================== Header ===================== */}
      <section
        style={{
          padding: "50px 16px 30px",
          background:
            "radial-gradient(circle at top left, rgba(37,99,235,0.1) 0%, transparent 40%), #f8fafc",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.4rem)",
              fontWeight: 900,
              color: "#0f172a",
              marginBottom: "8px",
            }}
          >
            {pageTitle}
          </h1>
          <p style={{ color: "#64748b", fontSize: "1rem" }}>
            {filteredProducts.length} محصول پیدا شد
          </p>
        </div>
      </section>

      {/* ===================== Main ===================== */}
      <section style={{ padding: "20px 16px 70px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* نوار ابزار موبایل */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* سرچ */}
            <div
              style={{
                flex: 1,
                minWidth: "200px",
                position: "relative",
              }}
            >
              <Search
                size={18}
                color="#94a3b8"
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی محصول، برند..."
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 44px 0 16px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "14px",
                  fontSize: "0.95rem",
                  outline: "none",
                  background: "#fff",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* سورت */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                height: "48px",
                padding: "0 14px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "14px",
                background: "#fff",
                fontFamily: "inherit",
                fontWeight: 600,
                color: "#334155",
                cursor: "pointer",
                minWidth: "160px",
              }}
            >
              <option value="default">مرتب‌سازی پیش‌فرض</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating">بیشترین امتیاز</option>
              <option value="newest">جدیدترین</option>
            </select>

            {/* دکمه فیلتر موبایل */}
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              style={{
                height: "48px",
                padding: "0 16px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "14px",
                background: showFilters ? "#eff6ff" : "#fff",
                color: showFilters ? "#2563eb" : "#334155",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "inherit",
              }}
            >
              <SlidersHorizontal size={18} />
              فیلترها
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr",
              gap: "24px",
              alignItems: "start",
            }}
            className="products-layout"
          >
            {/* ===================== Sidebar ===================== */}
            <aside
              style={{
                display: showFilters ? "block" : undefined,
              }}
              className="products-sidebar"
            >
              {/* دسته‌بندی */}
              <div style={sidebarCard}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: "14px",
                  }}
                >
                  دسته‌بندی
                </h3>

                <button
                  onClick={() => updateParam("category", "all")}
                  style={filterBtn(activeCategory === "all")}
                >
                  همه دسته‌ها
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam("category", cat.id)}
                    style={filterBtn(activeCategory === cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* فیلترهای خاص */}
              <div style={sidebarCard}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: "14px",
                  }}
                >
                  فیلترها
                </h3>

                <button
                  onClick={() => updateParam("filter", "all")}
                  style={filterBtn(activeFilter === "all")}
                >
                  همه محصولات
                </button>

                <button
                  onClick={() => updateParam("filter", "new")}
                  style={filterBtn(activeFilter === "new")}
                >
                  محصولات جدید
                </button>

                <button
                  onClick={() => updateParam("filter", "discount")}
                  style={filterBtn(activeFilter === "discount")}
                >
                  محصولات تخفیفی
                </button>
              </div>

              {/* پاک کردن فیلترها */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1.5px solid #fecaca",
                    background: "#fef2f2",
                    color: "#ef4444",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    fontFamily: "inherit",
                  }}
                >
                  <X size={16} />
                  پاک کردن فیلترها
                </button>
              )}
            </aside>

            {/* ===================== Products Grid ===================== */}
            <div>
              {filteredProducts.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "60px 20px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#0f172a",
                      marginBottom: "8px",
                    }}
                  >
                    محصولی پیدا نشد
                  </p>
                  <p style={{ color: "#64748b", marginBottom: "20px" }}>
                    فیلترها یا عبارت جستجو را تغییر دهید.
                  </p>
                  <button
                    onClick={clearFilters}
                    style={{
                      padding: "10px 22px",
                      background: "#2563eb",
                      color: "#fff",
                      borderRadius: "12px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    نمایش همه محصولات
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* استایل ریسپانسیو سایدبار */}
      <style>{`
        @media (max-width: 900px) {
          .products-layout {
            grid-template-columns: 1fr !important;
          }
          .products-sidebar {
            display: none;
          }
          .products-sidebar[style*="block"] {
            display: block !important;
          }
        }
        @media (min-width: 901px) {
          .products-sidebar {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}