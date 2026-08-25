import { Link } from "react-router-dom";
import { Shield, Truck, Headphones, Award, Target, Eye } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

// ======================================================
// About
// صفحه درباره ما
// ======================================================

export default function About() {
  usePageTitle("درباره ما");

  const features = [
    {
      icon: <Shield size={26} color="var(--color-primary)" />,
      title: "ضمانت اصالت",
      desc: "تمام محصولات اصل و دارای گارانتی معتبر هستند.",
    },
    {
      icon: <Truck size={26} color="var(--color-primary)" />,
      title: "ارسال سریع",
      desc: "ارسال سفارش‌ها در کوتاه‌ترین زمان ممکن.",
    },
    {
      icon: <Headphones size={26} color="var(--color-primary)" />,
      title: "پشتیبانی",
      desc: "پاسخگویی سریع و راهنمایی کامل خرید.",
    },
    {
      icon: <Award size={26} color="var(--color-primary)" />,
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
    <div>
      {/* ===================== Hero Banner ===================== */}
      <section
        style={{
          padding: "50px 16px 40px",
          background:
            "radial-gradient(circle at top right, rgba(37,99,235,0.1) 0%, transparent 45%), var(--color-bg)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            alignItems: "center",
          }}
        >
          {/* متن */}
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(37, 99, 235, 0.1)",
                color: "var(--color-primary)",
                padding: "7px 16px",
                borderRadius: "50px",
                fontSize: "0.88rem",
                fontWeight: 700,
                marginBottom: "18px",
              }}
            >
              درباره ما
            </span>

            <h1
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 900,
                color: "var(--color-text)",
                marginBottom: "16px",
                lineHeight: 1.35,
              }}
            >
              فروشگاه آنلاین <span style={{ color: "var(--color-primary)" }}>TechStore</span>
            </h1>

            <p
              style={{
                fontSize: "clamp(0.95rem, 2.5vw, 1.08rem)",
                color: "var(--color-text-muted)",
                lineHeight: 1.9,
                maxWidth: "520px",
              }}
            >
              تخصص ما فروش محصولات دیجیتال اصل، با قیمت مناسب و تجربه خرید مطمئن
              است.
            </p>
          </div>

          {/* عکس بنر */}
          <div style={{ textAlign: "center" }}>
            <img
              src="/assets/images/banner/about-us.png"
              alt="درباره TechStore"
              style={{
                width: "100%",
                maxWidth: "460px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </section>

      {/* ===================== Story + Stats ===================== */}
      <section style={{ padding: "70px 20px", background: "var(--color-bg-white)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* متن داستان */}
          <div
            style={{
              maxWidth: "720px",
              margin: "0 auto 50px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "1.7rem",
                fontWeight: 800,
                color: "var(--color-text)",
                marginBottom: "18px",
              }}
            >
              داستان ما
            </h2>
            <p
              style={{
                color: "#475569",
                lineHeight: 2,
                fontSize: "1.05rem",
              }}
            >
              TechStore با هدف ساده کردن خرید آنلاین محصولات تکنولوژی شکل گرفت.
              ما سعی می‌کنیم بهترین کالاها را با ضمانت اصالت، قیمت منصفانه و
              پشتیبانی واقعی در اختیار شما بگذاریم.
            </p>
          </div>

          {/*
            آمار: قبلاً "repeat(4, 1fr)" بود که روی موبایل ۴ ستون فشرده
            و ناخوانا می‌شد. الان با auto-fit، خودش بسته به عرض صفحه
            تعداد ستون‌ها رو کم می‌کنه (مثلاً روی موبایل ۲ ستون).
          */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "16px",
            }}
          >
            {stats.map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "16px",
                  padding: "24px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "var(--color-primary)",
                    marginBottom: "6px",
                  }}
                >
                  {item.number}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--color-text-muted)",
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== Mission & Vision ===================== */}
      <section style={{ padding: "70px 20px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/*
            قبلاً "1fr 1fr" بود، یعنی روی موبایل دو کارت کنار هم فشرده
            می‌شدن. با auto-fit، زیر ۲۸۰px هر کارت، به‌صورت خودکار
            زیر هم می‌رن.
          */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {/* ماموریت */}
            <div
              style={{
                background: "var(--color-bg-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "18px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "var(--color-primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Target size={22} color="var(--color-primary)" />
              </div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "var(--color-text)",
                  marginBottom: "10px",
                }}
              >
                ماموریت ما
              </h3>
              <p
                style={{
                  color: "var(--color-text-muted)",
                  lineHeight: 1.9,
                  fontSize: "0.98rem",
                }}
              >
                ارائه تجربه خرید آنلاین سریع، شفاف و مطمئن برای محصولات دیجیتال.
              </p>
            </div>

            {/* چشم‌انداز */}
            <div
              style={{
                background: "var(--color-bg-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "18px",
                padding: "32px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "var(--color-primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Eye size={22} color="var(--color-primary)" />
              </div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "var(--color-text)",
                  marginBottom: "10px",
                }}
              >
                چشم‌انداز ما
              </h3>
              <p
                style={{
                  color: "var(--color-text-muted)",
                  lineHeight: 1.9,
                  fontSize: "0.98rem",
                }}
              >
                تبدیل شدن به یکی از معتبرترین فروشگاه‌های آنلاین تکنولوژی در
                ایران.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Features ===================== */}
      <section style={{ padding: "70px 20px", background: "var(--color-bg-white)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "1.7rem",
                fontWeight: 800,
                color: "var(--color-text)",
                marginBottom: "10px",
              }}
            >
              چرا TechStore؟
            </h2>
            <p style={{ color: "var(--color-text-muted)" }}>
              مزیت‌هایی که خرید از ما را متمایز می‌کند
            </p>
          </div>

          {/* قبلاً "repeat(4, 1fr)" - همون مشکل موبایل استت‌ها رو داشت */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            {features.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "16px",
                  padding: "26px 18px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "var(--color-primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--color-text)",
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    lineHeight: 1.7,
                    fontSize: "0.9rem",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section style={{ padding: "20px 20px 80px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
              borderRadius: "24px",
              padding: "50px 30px",
              textAlign: "center",
              color: "var(--color-bg-white)",
            }}
          >
            <h2
              style={{
                fontSize: "1.7rem",
                fontWeight: 800,
                marginBottom: "12px",
              }}
            >
              آماده خرید هستید؟
            </h2>
            <p
              style={{
                opacity: 0.92,
                marginBottom: "26px",
                fontSize: "1rem",
              }}
            >
              محصولات اصل را با اطمینان از TechStore تهیه کنید.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/products"
                style={{
                  padding: "12px 28px",
                  background: "var(--color-bg-white)",
                  color: "var(--color-primary-dark)",
                  borderRadius: "50px",
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                مشاهده محصولات
              </Link>
              <Link
                to="/contact"
                style={{
                  padding: "12px 28px",
                  background: "transparent",
                  color: "var(--color-bg-white)",
                  borderRadius: "50px",
                  fontWeight: 700,
                  textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.45)",
                }}
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}