export const ORDER_STATUSES = [
  "در حال پردازش",
  "ارسال شد",
  "تحویل داده شد",
  "لغو شده",
];

export const statusColor = (status) => {
  if (status === "تحویل داده شد") return { bg: "#f0fdf4", text: "#16a34a" };
  if (status === "لغو شده") return { bg: "#fef2f2", text: "#ef4444" };
  if (status === "ارسال شد") return { bg: "#eff6ff", text: "#2563eb" };
  return { bg: "#fffbeb", text: "#d97706" };
};

export const formatOrderDate = (isoString) => {
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

export const inputStyle = (hasError) => ({
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

export const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: 700,
  color: "#1e293b",
  fontSize: "0.85rem",
};

export const errorStyle = {
  display: "block",
  marginTop: "5px",
  color: "#ef4444",
  fontSize: "0.78rem",
  fontWeight: 600,
};

export const emptyForm = {
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
