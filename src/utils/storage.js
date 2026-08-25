// ======================================================
// localStorage Utility
// توابع مشترک خواندن/نوشتن localStorage با مدیریت خطا
// ======================================================

export function readJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage ممکن است در دسترس نباشد
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
