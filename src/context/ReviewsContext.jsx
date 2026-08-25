import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { readJSON, writeJSON } from "../utils/storage";

const ReviewsContext = createContext(null);
const STORAGE_KEY = "techstore-reviews";

// ======================================================
// ReviewsProvider
//
// قبلاً امتیاز هر محصول (product.rating) یک عدد ثابت توی
// data/products.js بود - یعنی حتی اگه صد نفر محصول رو می‌خریدن،
// امتیازش هیچ‌وقت عوض نمی‌شد. الان یک سیستم نظر واقعی داریم:
// هر کاربر لاگین‌شده می‌تونه برای هر محصول یک نظر (امتیاز ۱ تا ۵
// + متن) ثبت کنه، و میانگین امتیاز از روی همین نظرهای واقعی
// محاسبه می‌شه.
//
// هر کاربر فقط یک نظر برای هر محصول داره - اگه دوباره نظر بده،
// نظر قبلیش آپدیت می‌شه (نه این‌که یه نظر جدید اضافه بشه).
// ======================================================

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(() => readJSON(STORAGE_KEY, []));

  useEffect(() => {
    writeJSON(STORAGE_KEY, reviews);
  }, [reviews]);

  // ---------- نظرهای یک محصول خاص (جدیدترین اول) ----------
  const getReviewsByProduct = useCallback((productId) =>
    reviews
      .filter((r) => r.productId === productId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  [reviews]);

  // ---------- میانگین امتیاز یک محصول ----------
  const getAverageRating = useCallback((productId, fallbackRating = 0) => {
    const productReviews = getReviewsByProduct(productId);

    if (productReviews.length === 0) {
      return { average: fallbackRating, count: 0 };
    }

    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return { average: sum / productReviews.length, count: productReviews.length };
  }, [getReviewsByProduct]);

  // ---------- نظر یک کاربر خاص برای یک محصول خاص ----------
  const getUserReview = useCallback((productId, userId) =>
    reviews.find((r) => r.productId === productId && r.userId === userId),
  [reviews]);

  // ---------- ثبت یا ویرایش نظر ----------
  // نکته مهم: setReviews یک state updater آسنکرونه - تابعی که بهش می‌دیم
  // همون لحظه اجرا نمی‌شه، بلکه موقع رندر بعدی اجرا می‌شه. پس نمی‌شه یه
  // متغیر رو *داخل* updater ست کرد و بلافاصله بعدش (بیرون از setReviews)
  // بخونیمش - همیشه مقدار اولیه‌ش (null) رو می‌گیریم.
  // برای همین resultId رو قبل از فراخوانی setReviews، از روی همون
  // `reviews`ی که از useState گرفتیم (نه از prev داخل updater) تعیین
  // می‌کنیم. نوشتن واقعی همچنان از functional update با prev استفاده
  // می‌کنه، پس مشکل duplicate-review (نسخه‌ی قبلی این باگ) ایجاد نمی‌شه.
  const submitReview = useCallback((productId, userId, userName, { rating, comment }) => {
    const existing = reviews.find(
      (r) => r.productId === productId && r.userId === userId,
    );
    const resultId = existing ? existing.id : Date.now();

    setReviews((prev) => {
      if (existing) {
        return prev.map((r) =>
          r.id === existing.id
            ? { ...r, rating, comment, createdAt: new Date().toISOString() }
            : r,
        );
      }

      return [
        {
          id: resultId,
          productId,
          userId,
          userName,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });

    return resultId;
  }, [reviews]);

  // ---------- حذف نظر ----------
  const deleteReview = useCallback((reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }, []);

  const value = useMemo(() => ({
    reviews,
    getReviewsByProduct,
    getAverageRating,
    getUserReview,
    submitReview,
    deleteReview,
  }), [reviews, getReviewsByProduct, getAverageRating, getUserReview, submitReview, deleteReview]);

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);

  if (!context) {
    throw new Error("useReviews باید داخل ReviewsProvider استفاده شود");
  }

  return context;
}