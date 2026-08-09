import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

// ======================================================
// Contact
// صفحه تماس با ما - نسخه حرفه‌ای
// ======================================================

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("فرم ارسال شد:", formData);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setIsSubmitted(false), 3500);
  };

  const contactInfo = [
    {
      icon: <MapPin size={22} color="#2563eb" />,
      title: "آدرس",
      desc: "تهران، ایران",
    },
    {
      icon: <Phone size={22} color="#2563eb" />,
      title: "تلفن",
      desc: "۰۲۱-۱۲۳۴۵۶۷۸",
    },
    {
      icon: <Mail size={22} color="#2563eb" />,
      title: "ایمیل",
      desc: "info@techstore.com",
    },
    {
      icon: <Clock size={22} color="#2563eb" />,
      title: "ساعات کاری",
      desc: "۹ صبح تا ۹ شب",
    },
  ];

  const inputStyle = {
    width: "100%",
    height: "52px",
    padding: "0 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "0.95rem",
    outline: "none",
    background: "#f8fafc",
    fontFamily: "inherit",
    color: "#0f172a",
  };

  return (
    <div>
      {/* ===================== Hero Banner ===================== */}
      <section
        style={{
          padding: "50px 16px 40px",
          background:
            "radial-gradient(circle at top right, rgba(37,99,235,0.1) 0%, transparent 45%), #f8fafc",
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
          <div>
            <span
              style={{
                display: "inline-block",
                background: "rgba(37, 99, 235, 0.1)",
                color: "#2563eb",
                padding: "7px 16px",
                borderRadius: "50px",
                fontSize: "0.88rem",
                fontWeight: 700,
                marginBottom: "18px",
              }}
            >
              تماس با ما
            </span>

            <h1
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 900,
                color: "#0f172a",
                marginBottom: "16px",
                lineHeight: 1.35,
              }}
            >
              در ارتباط باشیم
            </h1>

            <p
              style={{
                fontSize: "clamp(0.95rem, 2.5vw, 1.08rem)",
                color: "#64748b",
                lineHeight: 1.9,
                maxWidth: "520px",
              }}
            >
              سوال، پیشنهاد یا انتقادی دارید؟ خوشحال می‌شویم بشنویم و در اسرع
              وقت پاسخ دهیم.
            </p>
          </div>

          {/* عکس بنر */}
          <div style={{ textAlign: "center" }}>
            <img
              src="/assets/images/banner/contact-us.png"
              alt="تماس با TechStore"
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

      {/* ===================== Content ===================== */}
      <section style={{ padding: "20px 16px 80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {/* ---------- اطلاعات تماس ---------- */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "22px",
                padding: "32px 26px",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "8px",
                }}
              >
                اطلاعات تماس
              </h2>
              <p
                style={{
                  color: "#64748b",
                  marginBottom: "28px",
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                }}
              >
                از طریق راه‌های زیر می‌توانید با ما در ارتباط باشید.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {contactInfo.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px",
                      background: "#f8fafc",
                      borderRadius: "14px",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "12px",
                        background: "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#94a3b8",
                          fontWeight: 600,
                          marginBottom: "2px",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.98rem",
                          color: "#0f172a",
                          fontWeight: 700,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- فرم ---------- */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "22px",
                padding: "32px 26px",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "8px",
                }}
              >
                ارسال پیام
              </h2>
              <p
                style={{
                  color: "#64748b",
                  marginBottom: "26px",
                  fontSize: "0.95rem",
                }}
              >
                فرم زیر را پر کنید تا در اسرع وقت پاسخ دهیم.
              </p>

              <form onSubmit={handleSubmit}>
                {/* نام */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: "0.92rem",
                    }}
                  >
                    نام شما
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="مثلاً: مینا"
                    style={inputStyle}
                  />
                </div>

                {/* ایمیل */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: "0.92rem",
                    }}
                  >
                    ایمیل
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                    style={inputStyle}
                  />
                </div>

                {/* موضوع */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: "0.92rem",
                    }}
                  >
                    موضوع
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="موضوع پیام شما"
                    style={inputStyle}
                  />
                </div>

                {/* پیام */}
                <div style={{ marginBottom: "22px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: "0.92rem",
                    }}
                  >
                    پیام شما
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="متن پیام..."
                    style={{
                      ...inputStyle,
                      height: "auto",
                      padding: "14px 16px",
                      resize: "vertical",
                      lineHeight: 1.7,
                    }}
                  />
                </div>

                {/* دکمه */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    height: "54px",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff",
                    borderRadius: "14px",
                    fontWeight: 800,
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 12px 28px rgba(37, 99, 235, 0.28)",
                    border: "none",
                    fontFamily: "inherit",
                  }}
                >
                  <Send size={18} />
                  ارسال پیام
                </button>

                {isSubmitted && (
                  <p
                    style={{
                      marginTop: "16px",
                      textAlign: "center",
                      color: "#16a34a",
                      fontWeight: 700,
                      background: "#f0fdf4",
                      padding: "12px",
                      borderRadius: "12px",
                    }}
                  >
                    پیام شما با موفقیت ارسال شد ✅
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
