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
  }, [reviews]);

  // ---------- نظر یک کاربر خاص برای یک محصول خاص ----------
  const getUserReview = useCallback((productId, userId) =>
    reviews.find((r) => r.productId === productId && r.userId === userId),
  [reviews]);

  // ---------- ثبت یا ویرایش نظر ----------
  const submitReview = useCallback((productId, userId, userName, { rating, comment }) => {
    const existing = getUserReview(productId, userId);

    if (existing) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === existing.id
            ? { ...r, rating, comment, createdAt: new Date().toISOString() }
            : r,
        ),
      );
      return existing.id;
    }

    const newReview = {
      id: Date.now(),
      productId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    return newReview.id;
  }, []);

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