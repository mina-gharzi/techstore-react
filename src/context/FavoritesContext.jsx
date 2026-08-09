import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext(null);

// ======================================================
// FavoritesProvider
// مدیریت لیست علاقه‌مندی‌ها در کل اپ
// ======================================================

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("techstore-favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ذخیره در localStorage
  useEffect(() => {
    localStorage.setItem("techstore-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ---------- اضافه یا حذف از علاقه‌مندی‌ها ----------
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        // اگر بود → حذف کن
        return prev.filter((item) => item.id !== product.id);
      }

      // اگر نبود → اضافه کن
      return [...prev, product];
    });
  };

  // ---------- چک کردن وضعیت علاقه‌مندی ----------
  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// ======================================================
// هوک اختصاصی
// ======================================================

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites باید داخل FavoritesProvider استفاده شود");
  }

  return context;
}