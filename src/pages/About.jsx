import { Link } from "react-router-dom";
import { Shield, Truck, Headphones, Award } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

export default function About() {
  usePageTitle("درباره ما");

  const features = [
    {
      icon: <Shield size={22} />,
      title: "ضمانت اصالت",
      desc: "تمام محصولات اصل و دارای گارانتی معتبر هستند.",
    },
    {
      icon: <Truck size={22} />,
      title: "ارسال سریع",
      desc: "ارسال سفارش‌ها در کوتاه‌ترین زمان ممکن.",
    },
    {
      icon: <Headphones size={22} />,
      title: "پشتیبانی",
      desc: "پاسخگویی سریع و راهنمایی کامل خرید.",
    },
    {
      icon: <Award size={22} />,
      title: "قیمت مناسب",
      desc: "بهترین قیمت بازار بدون کاهش کیفیت.",
    },
  ];

  const stats = [
    { number: "۱۰٬۰۰۰+", label: "مشتری راضی" },
    { number: "۵۰۰+", label: "محصول" },
    { number: "۹۸٪", label: "رضایت" },
    { number: "۲۴/۷", label: "پشتیبانی" },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__inner">
          <div className="about-hero__text">
            <span className="about-badge">درباره ما</span>
            <h1 className="about-hero__title">
              فروشگاه آنلاین{" "}
              <span className="brand-text" style={{ color: "var(--color-primary)" }}>
                TechStore
              </span>
            </h1>
            <p className="about-hero__desc">
              تخصص ما فروش محصولات دیجیتال اصل، با قیمت مناسب و تجربه خرید مطمئن است.
            </p>
          </div>
          <div className="about-hero__image">
            <img
              src="/assets/images/banner/about-us.png"
              alt="درباره TechStore"
            />
          </div>
        </div>
      </section>

      {/* Story + Stats */}
      <section className="about-story">
        <div className="about-container">
          <div className="about-story__text">
            <h2>داستان ما</h2>
            <p>
              <span className="brand-text">TechStore</span> با هدف ساده کردن خرید آنلاین محصولات تکنولوژی شکل گرفت.
              ما سعی می‌کنیم بهترین کالاها را با ضمانت اصالت، قیمت منصفانه و پشتیبانی واقعی در اختیار شما بگذاریم.
            </p>
          </div>

          <div className="about-stats">
            {stats.map((item) => (
              <div key={item.label} className="about-stat-card">
                <span className="about-stat-card__number">{item.number}</span>
                <span className="about-stat-card__label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="about-features">
        <div className="about-container">
          <div className="about-section-header">
            <h2>
              چرا <span className="brand-text">TechStore</span>؟
            </h2>
            <p>مزیت‌هایی که خرید از ما را متمایز می‌کند</p>
          </div>

          <div className="about-features__grid">
            {features.map((item) => (
              <div key={item.title} className="about-feature-card">
                <div className="about-feature-card__icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-container">
          <div className="about-cta__box">
            <h2>آماده خرید هستید؟</h2>
            <p>محصولات اصل را با اطمینان از <span className="brand-text">TechStore</span> تهیه کنید.</p>
            <div className="about-cta__actions">
              <Link to="/products" className="about-btn about-btn--white">
                مشاهده محصولات
              </Link>
              <Link to="/contact" className="about-btn about-btn--outline">
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-page {
          background: var(--color-bg);
        }

        .about-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* ── Hero ── */
        .about-hero {
          padding: 60px 20px 50px;
          background:
            radial-gradient(circle at top right, var(--color-primary-tint-10) 0%, transparent 50%),
            var(--color-bg);
        }
        .about-hero__inner {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 40px;
        }
        .about-hero__text {
          flex: 1;
        }
        .about-hero__image {
          flex: 1;
          text-align: center;
        }
        .about-hero__image img {
          width: 100%;
          max-width: 380px;
          height: auto;
          object-fit: contain;
        }
        .about-badge {
          display: inline-block;
          background: var(--color-primary-tint-10);
          color: var(--color-primary);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: var(--font-size-sm);
          font-weight: 700;
          margin-bottom: 16px;
        }
        .about-hero__title {
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 900;
          color: var(--color-text);
          margin-bottom: 14px;
          line-height: 1.35;
        }
        .about-hero__desc {
          font-size: clamp(0.9rem, 2vw, 1.05rem);
          color: var(--color-text-muted);
          line-height: 1.85;
          max-width: 460px;
        }

        /* ── Story ── */
        .about-story {
          padding: 60px 0;
        }
        .about-story__text {
          text-align: center;
          max-width: 640px;
          margin: 0 auto 40px;
        }
        .about-story__text h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-text);
          margin-bottom: 14px;
        }
        .about-story__text p {
          color: var(--color-text-muted);
          line-height: 2;
          font-size: var(--font-size-lg);
        }

        /* ── Stats ── */
        .about-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .about-stat-card {
          background: var(--color-bg-white);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 22px 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .about-stat-card__number {
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--color-primary);
        }
        .about-stat-card__label {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          font-weight: 600;
        }

        /* ── Features ── */
        .about-features {
          padding: 60px 0;
        }
        .about-section-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .about-section-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-text);
          margin-bottom: 8px;
        }
        .about-section-header p {
          color: var(--color-text-muted);
          font-size: var(--font-size-base);
        }
        .about-features__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .about-feature-card {
          background: var(--color-bg-white);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 26px 18px;
          text-align: center;
        }
        .about-feature-card__icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: var(--color-primary-light);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
        }
        .about-feature-card h3 {
          font-size: var(--font-size-lg);
          font-weight: 800;
          color: var(--color-text);
          margin-bottom: 6px;
        }
        .about-feature-card p {
          color: var(--color-text-muted);
          line-height: 1.7;
          font-size: var(--font-size-sm);
        }

        /* ── CTA ── */
        .about-cta {
          padding: 0 0 70px;
        }
        .about-cta__box {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          border-radius: 22px;
          padding: 48px 24px;
          text-align: center;
          color: var(--color-bg-white);
        }
        .about-cta__box h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 10px;
        }
        .about-cta__box p {
          opacity: 0.92;
          margin-bottom: 24px;
          font-size: var(--font-size-lg);
        }
        .about-cta__actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .about-btn {
          padding: 12px 28px;
          border-radius: 50px;
          font-weight: 700;
          text-decoration: none;
          font-size: var(--font-size-base);
        }
        .about-btn--white {
          background: var(--color-bg-white);
          color: var(--color-primary-dark);
        }
        .about-btn--outline {
          background: transparent;
          color: var(--color-bg-white);
          border: 1.5px solid rgba(255,255,255,0.45);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .about-hero__inner {
            flex-direction: column-reverse;
            text-align: center;
          }
          .about-hero__desc {
            max-width: none;
          }
        }

        @media (max-width: 640px) {
          .about-hero {
            padding: 40px 16px 36px;
          }
          .about-story,
          .about-features {
            padding: 44px 0;
          }
          .about-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .about-features__grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .about-feature-card {
            padding: 20px 14px;
          }
          .about-cta {
            padding: 0 16px 50px;
          }
          .about-cta__box {
            padding: 36px 20px;
            border-radius: 18px;
          }
        }

        @media (max-width: 400px) {
          .about-features__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
