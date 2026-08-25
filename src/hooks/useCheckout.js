import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import { applyCoupon, calculateDiscount } from "../services/couponService";

// ======================================================
// useCheckout
// هوک سفارشی مدیریت منطق کسب‌وکار صفحه Checkout
//
// تمام state ها، validation، coupon handling، و submit logic
// اینجا هستن تا کامپوننت Checkout فقط UI خالص باشه.
// ======================================================

export function useCheckout() {
  const navigate = useNavigate();
  const { cart, totalItems, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const { updateProduct } = useProducts();

  // ---------- Form State ----------
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [errors, setErrors] = useState({});

  // ---------- Submission State ----------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockError, setStockError] = useState("");

  // ---------- Coupon State ----------
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // ---------- Derived Values ----------
  const discountAmount = calculateDiscount(appliedCoupon, totalPrice);
  const finalTotal = totalPrice - discountAmount;

  // ---------- Coupon Handlers ----------
  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput);
    if (result.success) {
      setAppliedCoupon(result.coupon);
      setCouponError("");
    } else {
      setCouponError(result.error);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  // ---------- Form Handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "نام و نام خانوادگی را وارد کنید";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "شماره موبایل را وارد کنید";
    } else if (!/^09\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "شماره موبایل معتبر نیست (مثال: 09121234567)";
    }

    if (!formData.city.trim()) {
      newErrors.city = "شهر را وارد کنید";
    }

    if (!formData.address.trim()) {
      newErrors.address = "آدرس کامل را وارد کنید";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "کد پستی را وارد کنید";
    } else if (!/^\d{10}$/.test(formData.postalCode.trim())) {
      newErrors.postalCode = "کد پستی باید ۱۰ رقم باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Submit Handler ----------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const outOfStockItems = cart.filter((item) => item.quantity > item.stock);

    if (outOfStockItems.length > 0) {
      setStockError(
        `موجودی «${outOfStockItems[0].name}» کافی نیست. لطفاً به سبد خرید برگردید و تعداد را اصلاح کنید.`,
      );
      return;
    }

    setStockError("");
    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `TS-${Date.now().toString().slice(-8)}`;

      addOrder({
        orderNumber,
        userId: user.id,
        items: cart,
        subtotal: totalPrice,
        couponCode: appliedCoupon?.code || null,
        discountAmount,
        totalPrice: finalTotal,
        totalItems,
        paymentMethod,
        customerName: formData.fullName,
        shippingAddress: {
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
      });

      cart.forEach((item) => {
        updateProduct(item.id, { stock: Math.max(0, item.stock - item.quantity) });
      });

      clearCart();

      navigate("/order-success", {
        state: {
          orderNumber,
          totalPrice: finalTotal,
          discountAmount,
          totalItems,
          paymentMethod,
          customerName: formData.fullName,
        },
      });
    }, 900);
  };

  return {
    // Form
    formData,
    paymentMethod,
    setPaymentMethod,
    errors,
    handleChange,
    handleSubmit,
    // Submission
    isSubmitting,
    stockError,
    // Coupon
    couponInput,
    setCouponInput,
    appliedCoupon,
    couponError,
    handleApplyCoupon,
    handleRemoveCoupon,
    // Derived
    discountAmount,
    finalTotal,
    // Cart
    cart,
    totalItems,
    totalPrice,
  };
}
