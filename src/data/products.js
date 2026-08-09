// ======================================================
// products.js
// منبع داده محصولات فروشگاه
// ======================================================

export const products = [
  // ---------- موبایل ----------
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "mobile",
    price: 79900000,
    oldPrice: 85000000,
    rating: 4.9,
    isNew: true,
    description: "پرچمدار اپل با تراشه A17 Pro و بدنه تیتانیومی.",
    image: "/assets/images/product/iphone15.png",
    colors: [
    { name: "مشکی", value: "#1f2937" },
    { name: "نقره‌ای", value: "#d1d5db" },
    { name: "آبی", value: "#3b82f6" },
    { name: "طلایی", value: "#f59e0b" },
  ],
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "mobile",
    price: 72000000,
    oldPrice: 78000000,
    rating: 4.8,
    isNew: true,
    description: "پرچمدار سامسونگ با قلم S Pen و دوربین قدرتمند.",
    image: "/assets/images/product/s20.webp",
    colors: [
    { name: "مشکی", value: "#1f2937" },
    { name: "نقره‌ای", value: "#d1d5db" },

  ],
  },
  {
    id: 3,
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    category: "mobile",
    price: 52000000,
    oldPrice: 58000000,
    rating: 4.7,
    isNew: false,
    description: "دوربین حرفه‌ای و شارژ فوق‌سریع شیائومی.",
    image: "/assets/images/product/xiaomi.jpg",
    colors: [
    { name: "مشکی", value: "#1f2937" },
    { name: "نقره‌ای", value: "#d1d5db" },

  ],
  },

  // ---------- لپ‌تاپ ----------
  {
    id: 4,
    name: "MacBook Pro 14",
    brand: "Apple",
    category: "laptop",
    price: 125000000,
    oldPrice: 135000000,
    rating: 4.9,
    isNew: false,
    description: "لپ‌تاپ حرفه‌ای اپل با چیپ M3 Pro.",
    image: "/assets/images/product/macbook.webp",
    colors: [
    { name: "مشکی", value: "#1f2937" },
    { name: "نقره‌ای", value: "#d1d5db" },
    { name: "آبی", value: "#3b82f6" },
    
  ],
  },
  {
    id: 5,
    name: "ASUS ROG Zephyrus G14",
    brand: "Asus",
    category: "laptop",
    price: 98000000,
    oldPrice: 105000000,
    rating: 4.6,
    isNew: true,
    description: "لپ‌تاپ گیمینگ قدرتمند ایسوس.",
    image: "/assets/images/product/asus.jpg",
    colors: [
    { name: "مشکی", value: "#1f2937" },
    { name: "نقره‌ای", value: "#d1d5db" },
    { name: "آبی", value: "#3b82f6" },
   
  ],
  },
  {
    id: 6,
    name: "Lenovo Legion 5",
    brand: "Lenovo",
    category: "laptop",
    price: 75000000,
    oldPrice: 82000000,
    rating: 4.5,
    isNew: false,
    description: "لپ‌تاپ گیمینگ با عملکرد قوی و خنک‌کنندگی عالی.",
    image: "/assets/images/product/lenovo5.jpg",
    colors: [
    { name: "مشکی", value: "#1f2937" },
    { name: "نقره‌ای", value: "#d1d5db" },
    { name: "آبی", value: "#3b82f6" },
    
  ],
  },

  // ---------- ساعت ----------
  {
    id: 7,
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    category: "watch",
    price: 48000000,
    oldPrice: 52000000,
    rating: 4.7,
    isNew: true,
    description: "ساعت هوشمند مقاوم مناسب ورزش حرفه‌ای.",
    image: "/assets/images/product/applewatch.png",
    colors: [
    { name: "مشکی", value: "#1f2937" },
    { name: "نقره‌ای", value: "#d1d5db" },
    { name: "آبی", value: "#3b82f6" },
    
  ],
  },
  {
    id: 8,
    name: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    category: "watch",
    price: 18500000,
    oldPrice: 21000000,
    rating: 4.5,
    isNew: false,
    description: "ساعت هوشمند سامسونگ با امکانات سلامتی کامل.",
    image: "/assets/images/product/samsungw.jpg",
    colors: [
    { name: "مشکی", value: "#1f2937" },
    { name: "نقره‌ای", value: "#d1d5db" },
    { name: "آبی", value: "#3b82f6" },

  ],
  },

  // ---------- هدفون ----------
  {
    id: 9,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "headphone",
    price: 18500000,
    oldPrice: 21000000,
    rating: 4.8,
    isNew: false,
    description: "هدفون نویزکنسلینگ حرفه‌ای سونی.",
    image: "/assets/images/product/sony.jpg",
    colors: [
    { name: "مشکی", value: "#1f2937" },
    { name: "نقره‌ای", value: "#d1d5db" },
    { name: "آبی", value: "#3b82f6" },
    { name: "طلایی", value: "#f59e0b" },
  ],
  },
  {
    id: 10,
    name: "AirPods Pro 2",
    brand: "Apple",
    category: "headphone",
    price: 14500000,
    oldPrice: 16000000,
    rating: 4.7,
    isNew: true,
    description: "هدفون بی‌سیم اپل با نویزکنسلینگ فعال.",
    image: "/assets/images/product/airpods.jpg",
    colors: [
    { name: "مشکی", value: "#1f2937" },
    { name: "نقره‌ای", value: "#d1d5db" },
  ],
  },
];

export const categories = [
  { id: "mobile", name: "موبایل" },
  { id: "laptop", name: "لپ‌تاپ" },
  { id: "watch", name: "ساعت هوشمند" },
  { id: "headphone", name: "هدفون" },
];