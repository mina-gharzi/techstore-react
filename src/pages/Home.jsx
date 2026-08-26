import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { useCategories } from "../context/CategoriesContext";
import { usePageTitle } from "../hooks/usePageTitle";
import ProductCard from "../components/product/ProductCard";

// ======================================================
// آیکون‌های SVG
// ======================================================
const iconPaths = {
  arrowLeft: (
    <>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </>
  ),
};

function Icon({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name] || null}
    </svg>
  );
}

// ======================================================
// انیمیشن ورود هنگام اسکرول
// ======================================================
function Reveal({ children, delay = 0, style, className }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(26px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ======================================================
// کامپوننت‌های مشترک
// ======================================================
function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "40px" }}>
      <h2
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2rem)",
          fontWeight: 800,
          color: "var(--color-text)",
          marginBottom: "10px",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: "var(--font-size-xl)",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function ProductSection({ bg, title, subtitle, products, to, cta }) {
  return (
    <section
      className="home-section"
      style={{ padding: "80px 20px", background: bg }}
    >
      <div className="container--plain">
        <Reveal>
          <SectionHeader title={title} subtitle={subtitle} />
        </Reveal>
        <Reveal delay={120}>
          <div className="home-product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link
              to={to}
              className="btn-outline home-more-btn"
              style={{
                display: "inline-block",
                padding: "13px 32px",
                background: "var(--color-bg-white)",
                color: "var(--color-primary)",
                border: "1.5px solid var(--color-primary)",
                borderRadius: "14px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "var(--shadow-button-outline)",
              }}
            >
              {cta}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ======================================================
// اسلایدر هیرو
// ======================================================
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1758467700789-d6f49099c884?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "دنیای تکنولوژی",
    subtitle: "برای زندگی بهتر.",
    desc: "موبایل، لپ‌تاپ و لوازم جانبی را با ضمانت اصالت کالا، بهترین قیمت و ارسال سریع به سراسر کشور تهیه کنید.",
  },
  {
    image: "https://images.unsplash.com/photo-1758467700789-d6f49099c884?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "جدیدترین محصولات",
    subtitle: "با بهترین کیفیت",
    desc: "مجموعه‌ای بی‌نظیر از محصولات دیجیتال روز دنیا را کشف کنید.",
  },
  {
    image: "https://images.unsplash.com/photo-1758467700789-d6f49099c884?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "تخفیف‌های ویژه",
    subtitle: "فرصت را از دست ندهید",
    desc: "تا ۳۰٪ تخفیف روی محصولات منتخب فروشگاه — همین الان خرید کنید.",
  },
  {
    image: "https://images.unsplash.com/photo-1758467700789-d6f49099c884?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "ارسال به سراسر کشور",
    subtitle: "سریع و مطمئن",
    desc: "سفارش‌ها در کوتاه‌ترین زمان ممکن بسته‌بندی و ارسال می‌شوند.",
  },
  {
    image: "https://images.unsplash.com/photo-1758467700789-d6f49099c884?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "ضمانت اصالت کالا",
    subtitle: "خریدی مطمئن",
    desc: "تمام محصولات اصل و دارای گارانتی معتبر هستند.",
  },
];

// ======================================================
// Hero — عکس پس‌زمینه تمام‌صفحه با اسلایدر
// ======================================================
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = (index) => {
    if (index === currentSlide || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setTimeout(() => setIsTransitioning(false), 600);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isTransitioning]);

  const slide = heroSlides[currentSlide];

  return (
    <section
      className="hero-section"
      onClick={() => {
        if (!isTransitioning) {
          setIsTransitioning(true);
          setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
          setTimeout(() => setIsTransitioning(false), 600);
        }
      }}
      style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* تصاویر پس‌زمینه — همه لایه زیر هم */}
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className="hero-bg"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: i === currentSlide ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        >
          <img
            src={s.image}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ))}

      {/* اورلی */}
      <div
        className="hero-overlay"
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, rgba(17,24,68,0.9) 0%, rgba(75,86,148,0.6) 50%, rgba(17,24,68,0.3) 100%)",
        }}
      />

      <div
        className="hero-container"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "110px 40px 90px",
        }}
      >
        <div style={{ maxWidth: "620px" }}>
          <Reveal>
            {/* متا */}
            <div
              className="hero-meta"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: "30px",
              }}
            >
              <span>فروشگاه آنلاین تکنولوژی</span>
              <span
                style={{
                  width: "48px",
                  height: "1px",
                  background: "rgba(255,255,255,0.4)",
                }}
              />
              <span>ساخته‌شده برای شما</span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1
              className="hero-title"
              style={{
                color: "#fff",
                fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
                fontWeight: 900,
                lineHeight: 1.25,
                letterSpacing: "-1px",
                marginBottom: "26px",
              }}
            >
              {slide.title}
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #ffffff, #b0b9d1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {slide.subtitle}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p
              className="hero-body"
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "var(--font-size-lg)",
                lineHeight: 2,
                maxWidth: "480px",
                marginBottom: "38px",
              }}
            >
              {slide.desc}
            </p>
          </Reveal>

          <Reveal delay={320}>
            <Link
              to="/products"
              className="hero-cta"
              style={{
                color: "#fff",
                fontSize: "var(--font-size-lg)",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.5)",
                paddingBottom: "6px",
              }}
            >
              مشاهده محصولات
              <span
                className="hero-cta-arrow"
                style={{ display: "inline-flex" }}
              >
                <Icon name="arrowLeft" size={20} />
              </span>
            </Link>
          </Reveal>

          {/* دات‌های اسلایدر */}
          <Reveal delay={420}>
            <div
              className="hero-bottom"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "64px",
                maxWidth: "440px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.14em",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "1px",
                    height: "34px",
                    background: "rgba(255,255,255,0.25)",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",
                      background: "#fff",
                      animation: "scrollLine 1.8s ease-in-out infinite",
                    }}
                  />
                </span>
              </div>

              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToSlide(i)}
                    aria-label={`اسلاید ${i + 1}`}
                    style={{
                      width: i === currentSlide ? "22px" : "6px",
                      height: "6px",
                      borderRadius: "50px",
                      border: "none",
                      background: i === currentSlide ? "#fff" : "rgba(255,255,255,0.3)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// پیشنهاد ویژه
// ======================================================
function SpecialOffer() {
  return (
    <section
      className="home-section"
      style={{ padding: "30px 20px 90px", background: "var(--color-bg)" }}
    >
      <div className="container--plain">
        <Reveal>
          <div
            className="offer-card"
            style={{
              overflow: "hidden",
              background:
                "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 55%, var(--blue-800) 100%)",
              borderRadius: "28px",
              padding: "64px 40px",
              textAlign: "center",
              color: "var(--color-bg-white)",
              boxShadow: "var(--shadow-hero)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                marginBottom: "16px",
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
                fontSize: "var(--font-size-xl)",
              }}
            >
              فرصت را از دست ندهید و جدیدترین محصولات را با قیمت ویژه تهیه کنید.
            </p>
            <Link
              to="/products?filter=discount"
              className="btn-white"
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
        </Reveal>
      </div>
    </section>
  );
}

// ======================================================
// دسته‌بندی محصولات
// ======================================================
function CategoriesSection({ categories }) {
  return (
    <section
      className="home-section"
      style={{ padding: "80px 20px", background: "var(--color-bg)" }}
    >
      <div className="container--plain">
        <Reveal>
          <SectionHeader
            title="دسته‌بندی محصولات"
            subtitle="دسته مورد نظر خود را انتخاب کنید"
          />
        </Reveal>

        <Reveal delay={120}>
          <div
            className="categories-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="category-card"
                style={{
                  background: "var(--color-bg-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "18px",
                  padding: "32px 28px",
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <h3
                  style={{
                    fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                    fontWeight: 800,
                    color: "var(--color-text)",
                    margin: 0,
                  }}
                >
                  {cat.name}
                </h3>

                <div
                  className="category-card__arrow"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--color-bg)",
                    color: "var(--color-text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export default function Home() {
  usePageTitle();
  const { products } = useProducts();
  const { categories } = useCategories();

  const newProducts = products.filter((p) => p.isNew).slice(0, 4);
  const discountProducts = products
    .filter((p) => p.oldPrice && p.oldPrice > p.price)
    .slice(0, 4);

  return (
    <div style={{ overflowX: "hidden" }}>
      <HeroSection />

      <CategoriesSection categories={categories} />

      <ProductSection
        bg="var(--color-bg)"
        title="محصولات جدید"
        subtitle="تازه‌ترین محصولات اضافه‌شده به فروشگاه"
        products={newProducts}
        to="/products?filter=new"
        cta="مشاهده همه محصولات جدید"
      />

      <ProductSection
        bg="var(--color-bg)"
        title="محصولات تخفیفی"
        subtitle="محصولات با بیشترین تخفیف"
        products={discountProducts}
        to="/products?filter=discount"
        cta="مشاهده همه محصولات تخفیفی"
      />

      <SpecialOffer />

      {/* ===== استایل‌های سراسری ===== */}
      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }

        /* گرید دسکتاپ */
        .home-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        @media (hover: hover) {
          .hero-cta {
            transition: borderColor 0.25s ease;
          }
          .hero-cta:hover {
            border-color: #fff;
          }
          .hero-cta .hero-cta-arrow {
            transition: transform 0.25s ease;
          }
          .hero-cta:hover .hero-cta-arrow {
            transform: translateX(-6px);
          }

          .btn-outline {
            transition: transform 0.25s ease, background 0.25s ease, borderColor 0.25s ease;
          }
          .btn-outline:hover {
            transform: translateY(-3px);
            background: var(--color-primary-tint-10);
            border-color: var(--color-primary);
          }

          .btn-white {
            transition: transform 0.25s ease, boxShadow 0.25s ease;
          }
          .btn-white:hover {
            transform: translateY(-3px);
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
          }

          .home-product-grid > * {
            transition: transform 0.3s ease, boxShadow 0.3s ease;
          }
          .home-product-grid > *:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 32px rgba(17, 24, 68, 0.12);
          }
        }

        @media (hover: none) {
          .btn-outline:active,
          .btn-white:active {
            transform: scale(0.95);
          }
          .home-product-grid > *:active {
            transform: scale(0.97);
          }

          /* کارت دسته‌بندی */
          .category-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          }
          .category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 32px rgba(17, 24, 68, 0.1);
            border-color: var(--color-primary-border);
          }
          .category-card:hover .category-card__arrow {
            background: var(--color-primary);
            color: var(--color-bg-white);
            transform: translateX(-4px);
          }
        }

        @media (hover: none) {
          .category-card:active {
            transform: scale(0.97);
          }
        }

        /* ===== موبایل ===== */
        @media (max-width: 640px) {
          .hero-section {
            min-height: 100svh !important;
            align-items: flex-end !important;
          }

          /* اورلی عمودی — پایین تیره‌تر */
          .hero-overlay {
            background:
              linear-gradient(180deg, rgba(17,24,68,0.35) 0%, rgba(17,24,68,0.55) 50%, rgba(17,24,68,0.94) 100%) !important;
          }

          .hero-container {
            padding: 90px 24px 44px !important;
            max-width: none !important;
          }

          .hero-title {
            font-size: 2.2rem !important;
          }

          /* حذف متا و متن توضیحی روی موبایل */
          .hero-meta {
            display: none !important;
          }
          .hero-body {
            display: none !important;
          }

          .hero-bottom {
            margin-top: 48px !important;
            max-width: none !important;
          }

          /* بقیه سکشن‌ها و گرید دوستونه */
          .home-section {
            padding: 56px 16px !important;
          }
          /* اسکرول افقی محصولات */
          .home-product-grid {
            display: flex !important;
            grid-template-columns: none !important;
            gap: 14px !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 8px;
            margin: 0 -20px;
            padding-left: 20px;
            padding-right: 20px;
          }
          .home-product-grid > * {
            min-width: 260px;
            max-width: 260px;
            scroll-snap-align: start;
            flex-shrink: 0;
          }
          .home-more-btn {
            margin-top: 24px !important;
          }
          .home-product-grid::-webkit-scrollbar {
            display: none;
          }
          .home-product-grid {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .categories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .categories-grid .category-card {
            flex-direction: column;
            align-items: flex-start !important;
            padding: 18px 16px !important;
            gap: 12px !important;
            border-radius: 14px !important;
          }
          .categories-grid .category-card h3 {
            font-size: 0.9rem !important;
            line-height: 1.4 !important;
          }
          .categories-grid .category-card__arrow {
            width: 34px !important;
            height: 34px !important;
            align-self: flex-end !important;
          }
          .categories-grid .category-card__arrow svg {
            width: 15px !important;
            height: 15px !important;
          }
          .offer-card {
            padding: 44px 20px !important;
            border-radius: 20px !important;
          }
        }

        @media (max-width: 380px) {
          .categories-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
