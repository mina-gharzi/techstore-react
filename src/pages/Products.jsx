import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { useProducts } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import { usePageTitle } from "../hooks/usePageTitle";
import ProductFilter from "../components/product/ProductFilter";
import ProductSort from "../components/product/ProductSort";
import ProductGrid from "../components/product/ProductGrid";

// ======================================================
// Products
// صفحه محصولات - کامل با سرچ، فیلتر و مرتب‌سازی
// ======================================================

export default function Products() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get("category") || "all";
  const activeFilter = searchParams.get("filter") || "all";

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products) ? [...products] : [];

    if (activeCategory !== "all") {
      result = result.filter((p) => p?.category === activeCategory);
    }

    if (activeFilter === "new") {
      result = result.filter((p) => p?.isNew);
    }

    if (activeFilter === "discount") {
      result = result.filter((p) => p?.oldPrice && p.oldPrice > p.price);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => {
        const name = (p?.name ?? "").toLowerCase();
        const brand = (p?.brand ?? "").toLowerCase();
        const desc = (p?.description ?? "").toLowerCase();
        return name.includes(q) || brand.includes(q) || desc.includes(q);
      });
    }

    if (sort === "price-asc") {
      result.sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0));
    } else if (sort === "price-desc") {
      result.sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0));
    } else if (sort === "rating") {
      result.sort((a, b) => (b?.rating ?? 0) - (a?.rating ?? 0));
    } else if (sort === "newest") {
      result.sort((a, b) => Number(b?.isNew) - Number(a?.isNew));
    }

    return result;
  }, [products, activeCategory, activeFilter, search, sort]);

  const pageTitle = useMemo(() => {
    if (activeFilter === "new") return "محصولات جدید";
    if (activeFilter === "discount") return "محصولات تخفیفی";
    if (activeCategory !== "all") {
      const cat = categories.find((c) => c.id === activeCategory);
      return cat ? cat.name : "محصولات";
    }
    return "همه محصولات";
  }, [activeCategory, activeFilter, categories]);

  usePageTitle(pageTitle);

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

  return (
    <div>
      {/* ===================== Header ===================== */}
      <section
        style={{
          padding: "50px 16px 30px",
          background:
            "radial-gradient(circle at top left, rgba(37,99,235,0.1) 0%, transparent 40%), var(--color-bg)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.4rem)",
              fontWeight: "var(--font-weight-black)",
              color: "var(--color-text)",
              marginBottom: "var(--space-2)",
            }}
          >
            {pageTitle}
          </h1>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--font-size-lg)",
            }}
          >
            {filteredProducts.length} محصول پیدا شد
          </p>
        </div>
      </section>

      {/* ===================== Main ===================== */}
      <section style={{ padding: "var(--space-5) 16px 70px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* نوار ابزار موبایل */}
          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              marginBottom: "var(--space-5)",
              flexWrap: "wrap",
            }}
          >
            {/* سرچ */}
            <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
              <Search
                size={18}
                color="var(--color-text-faint)"
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
                aria-label="جستجوی محصولات"
                placeholder="جستجوی محصول، برند..."
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 44px 0 16px",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: "var(--radius-2xl)",
                  fontSize: "var(--font-size-lg)",
                  outline: "none",
                  background: "var(--color-bg-white)",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* سورت */}
            <ProductSort sort={sort} onSortChange={setSort} />

            {/* دکمه فیلتر موبایل */}
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              style={{
                height: "48px",
                padding: "0 var(--space-4)",
                border: "1.5px solid var(--color-border)",
                borderRadius: "var(--radius-2xl)",
                background: showFilters
                  ? "var(--color-primary-light)"
                  : "var(--color-bg-white)",
                color: showFilters
                  ? "var(--color-primary)"
                  : "var(--color-text-secondary)",
                fontWeight: "var(--font-weight-bold)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
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
              gap: "var(--space-6)",
              alignItems: "start",
            }}
            className="products-layout"
          >
            {/* سایدبار فیلتر */}
            <div
              className={`products-sidebar${showFilters ? " is-open" : ""}`}
            >
              <ProductFilter
                categories={categories}
                activeCategory={activeCategory}
                activeFilter={activeFilter}
                onCategoryChange={(val) => updateParam("category", val)}
                onFilterChange={(val) => updateParam("filter", val)}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* گرید محصولات */}
            <ProductGrid
              products={filteredProducts}
              onClearFilters={clearFilters}
            />
          </div>
        </div>
      </section>

      {/* استایل ریسپانسیو */}
      <style>{`
        @media (max-width: 900px) {
          .products-layout {
            grid-template-columns: 1fr !important;
          }
          .products-sidebar {
            display: none;
          }
          .products-sidebar.is-open {
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
