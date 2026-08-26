import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useProducts } from "./ProductsContext";
import { readJSON, writeJSON, removeItem } from "../utils/storage";

const FavoritesContext = createContext(null);

// ======================================================
// FavoritesProvider
//
// نسخه بازنویسی‌شده:
//   1) Per-user: علاقه‌مندی‌های هر کاربر جداگانه
//      (کلید: "techstore-favorites-{userId}" یا "techstore-favorites-guest")
//   2) بدون Snapshot: فقط [{ id }] ذخیره می‌شه؛
//      اطلاعات کامل محصول از ProductsContext زنده خونده می‌شه.
// ======================================================

function getStorageKey(userId) {
  return userId ? `techstore-favorites-${userId}` : "techstore-favorites-guest";
}

function readRawFavorites(userId) {
  return readJSON(getStorageKey(userId), []);
}

function writeRawFavorites(userId, items) {
  writeJSON(getStorageKey(userId), items);
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const { products } = useProducts();

  const userId = user?.id ?? null;

  // ---------- state خام (فقط آرایه‌ای از { id }) ----------
  const [rawFavorites, setRawFavorites] = useState(() => readRawFavorites(null));

  // ---------- لود موقع سویچ کاربر ----------
  useEffect(() => {
    const userFavs = readRawFavorites(userId);
    const guestFavs = readRawFavorites(null);

    if (userId && guestFavs.length > 0) {
      // Merge: آیتم‌های مهمان رو اضافه کن (بدون تکرار)
      setRawFavorites((prev) => {
        const merged = [...userFavs];
        guestFavs.forEach((gf) => {
          if (!merged.some((m) => m.id === gf.id)) {
            merged.push(gf);
          }
        });
        return merged;
      });
      writeRawFavorites(null, []);
      removeItem("techstore-favorites-guest");
    } else {
      setRawFavorites(userFavs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ---------- ذخیره خودکار ----------
  useEffect(() => {
    writeRawFavorites(userId, rawFavorites);
  }, [rawFavorites, userId]);

  // ---------- لیست resolved (اطلاعات زنده محصول) ----------
  const favorites = useMemo(() => {
    return rawFavorites
      .map((fav) => {
        const product = products.find((p) => p.id === fav.id);
        return product || null; // اگر محصول حذف شده، null برگردان
      })
      .filter(Boolean);
  }, [rawFavorites, products]);

  // ---------- اضافه/حذف ----------
  const toggleFavorite = useCallback((product) => {
    setRawFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, { id: product.id }];
    });
  }, []);

  // ---------- چک وضعیت ----------
  const isFavorite = useCallback((id) => {
    return rawFavorites.some((item) => item.id === id);
  }, [rawFavorites]);

  const value = useMemo(() => ({
    favorites,
    toggleFavorite,
    isFavorite,
  }), [favorites, toggleFavorite, isFavorite]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites باید داخل FavoritesProvider استفاده شود");
  }
  return context;
}
