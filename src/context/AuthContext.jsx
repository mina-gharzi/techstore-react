import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// ======================================================
// AuthProvider
//
// هشدار مهم: این یک احراز هویت "fake" و فقط سمت کلاینت است.
// کاربرها و پسوردها به‌صورت متن ساده (plain text) توی
// localStorage مرورگر ذخیره می‌شن. این روش فقط برای توسعه/دمو
// مناسبه و از نظر امنیتی برای پروداکشن قابل قبول نیست:
//   - هر کسی با دسترسی به مرورگر می‌تونه localStorage رو بخونه
//   - پسورد هرگز نباید بدون هش شدن (مثلاً bcrypt) جایی ذخیره بشه
// وقتی به یک بک‌اند واقعی وصل شدی، توابع login/register/logout
// باید با فراخوانی API واقعی (و نگه‌داری توکن، نه پسورد) جایگزین بشن.
// ======================================================

const USERS_KEY = "techstore-users";
const CURRENT_USER_KEY = "techstore-user";

function readUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // localStorage در دسترس نیست (مثلاً حالت خصوصی مرورگر)
  }
}

export function AuthProvider({ children }) {
  // خواندن اولیه‌ی کاربر لاگین‌شده از localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // هر بار user تغییر کرد، ذخیره‌ش کن
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch {
      // نادیده گرفتن خطای localStorage
    }
  }, [user]);

  // ---------- ثبت‌نام ----------
  // برمی‌گرداند: { success: boolean, message?: string }
  const register = ({ fullName, email, phone, password }) => {
    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const alreadyExists = users.some(
      (u) => u.email.toLowerCase() === normalizedEmail,
    );

    if (alreadyExists) {
      return { success: false, message: "این ایمیل قبلاً ثبت‌نام شده است" };
    }

    const newUser = {
      id: Date.now(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password, // fake auth - در پروژه واقعی هرگز پسورد خام ذخیره نکن
    };

    writeUsers([...users, newUser]);

    // بعد از ثبت‌نام موفق، خودکار لاگین کن
    const { password: _pw, ...safeUser } = newUser;
    setUser(safeUser);

    return { success: true };
  };

  // ---------- ورود ----------
  const login = ({ email, password }) => {
    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password,
    );

    if (!matchedUser) {
      return { success: false, message: "ایمیل یا رمز عبور اشتباه است" };
    }

    const { password: _pw, ...safeUser } = matchedUser;
    setUser(safeUser);

    return { success: true };
  };

  // ---------- خروج ----------
  const logout = () => setUser(null);

  const value = {
    user,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ======================================================
// هوک اختصاصی
// ======================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth باید داخل AuthProvider استفاده شود");
  }

  return context;
}