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

// ---------- ساخت یک حساب ادمین پیش‌فرض ----------
// چون فرم ثبت‌نام فقط کاربر عادی (role: "customer") می‌سازه و
// راهی برای "ادمین شدن" از توی UI وجود نداره، یک حساب ادمین
// پیش‌فرض رو (فقط اگه از قبل هیچ ادمینی وجود نداشته باشه) توی
// لیست کاربرها seed می‌کنیم. این فقط برای دمو/توسعه‌ست؛ در یک
// پروژه‌ی واقعی نقش ادمین باید سمت بک‌اند و توسط یک ادمین دیگه
// تعیین بشه، نه این‌طور هاردکد.
const DEFAULT_ADMIN = {
  id: 1,
  fullName: "مدیر فروشگاه",
  email: "admin@techstore.com",
  phone: "09120000000",
  password: "admin123",
  role: "admin",
};

function ensureDefaultAdmin() {
  const users = readUsers();
  const hasAdmin = users.some((u) => u.role === "admin");

  if (!hasAdmin) {
    writeUsers([...users, DEFAULT_ADMIN]);
  }
}

// این فایل فقط سمت مرورگر اجرا می‌شه (localStorage در دسترسه)، پس
// می‌تونیم همین‌جا در سطح ماژول - یک بار موقع اولین import - چک
// کنیم که حساب ادمین وجود داره یا نه. نیازی به قرار دادنش داخل
// useState/useEffect کامپوننت نیست.
ensureDefaultAdmin();

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

  // ---------- لیست کل کاربرها (برای پنل مدیریت ادمین) ----------
  // قبلاً readUsers/writeUsers فقط توابع کمکی خام بودن که مستقیم
  // localStorage رو می‌خوندن/می‌نوشتن - یعنی React هیچ‌وقت متوجه
  // تغییرشون نمی‌شد و AdminDashboard نمی‌تونست لیست کاربرها رو
  // reactive نمایش بده. الان یک state واقعی نگه می‌داریم که با
  // هر تغییر (ثبت‌نام، حذف، تغییر نقش و...) sync می‌مونه.
  const [users, setUsers] = useState(() => readUsers());

  const persistUsers = (updatedUsers) => {
    writeUsers(updatedUsers);
    setUsers(updatedUsers);
  };

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
    const currentUsers = readUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const alreadyExists = currentUsers.some(
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
      role: "customer", // ثبت‌نام از فرم همیشه کاربر عادی می‌سازه؛ ادمین فقط با seed پیش‌فرض بالا وجود داره
    };

    persistUsers([...currentUsers, newUser]);

    // بعد از ثبت‌نام موفق، خودکار لاگین کن
    const { password: _pw, ...safeUser } = newUser;
    setUser(safeUser);

    return { success: true };
  };

  // ---------- ورود ----------
  const login = ({ email, password }) => {
    const currentUsers = readUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const matchedUser = currentUsers.find(
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

  // ---------- ویرایش پروفایل (نام/موبایل) ----------
  // ایمیل عمداً قابل ویرایش نیست، چون همون شناسه‌ی یکتای ورود
  // (username) هست؛ تغییرش نیاز به منطق پیچیده‌تری (تایید ایمیل
  // جدید و...) داره که خارج از اسکوپ این نسخه‌ی fake auth‌ست.
  const updateProfile = ({ fullName, phone }) => {
    if (!user) {
      return { success: false, message: "کاربر لاگین نیست" };
    }

    const currentUsers = readUsers();
    const updatedUsers = currentUsers.map((u) =>
      u.id === user.id ? { ...u, fullName: fullName.trim(), phone: phone.trim() } : u,
    );
    persistUsers(updatedUsers);

    setUser((prev) => ({ ...prev, fullName: fullName.trim(), phone: phone.trim() }));

    return { success: true };
  };

  // ---------- تغییر رمز عبور ----------
  const changePassword = ({ currentPassword, newPassword }) => {
    if (!user) {
      return { success: false, message: "کاربر لاگین نیست" };
    }

    const currentUsers = readUsers();
    const currentUserRecord = currentUsers.find((u) => u.id === user.id);

    if (!currentUserRecord || currentUserRecord.password !== currentPassword) {
      return { success: false, message: "رمز عبور فعلی اشتباه است" };
    }

    const updatedUsers = currentUsers.map((u) =>
      u.id === user.id ? { ...u, password: newPassword } : u,
    );
    persistUsers(updatedUsers);

    return { success: true };
  };

  // ---------- بازیابی رمز عبور (فراموشی رمز) ----------
  // چون سرویس ایمیل واقعی نداریم (نمی‌تونیم لینک بازیابی بفرستیم)،
  // هویت کاربر با تطابق ایمیل + شماره موبایلی که موقع ثبت‌نام داده
  // بود تایید می‌شه، بعد اجازه‌ی تنظیم رمز جدید داده می‌شه. این یک
  // جایگزین ساده‌ی fake‌ست؛ در پروژه‌ی واقعی باید یک لینک یک‌بارمصرف
  // با محدودیت زمانی از طریق ایمیل/پیامک فرستاده بشه.
  const resetPassword = ({ email, phone, newPassword }) => {
    const currentUsers = readUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    const matchedUser = currentUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.phone === normalizedPhone,
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "ایمیل و شماره موبایل با هم مطابقت ندارند",
      };
    }

    const updatedUsers = currentUsers.map((u) =>
      u.id === matchedUser.id ? { ...u, password: newPassword } : u,
    );
    persistUsers(updatedUsers);

    return { success: true };
  };

  // ---------- مدیریت کاربران (فقط ادمین) ----------

  // تعداد ادمین‌های فعلی - برای جلوگیری از حذف/تنزل آخرین ادمین
  const countAdmins = (list) => list.filter((u) => u.role === "admin").length;

  // حذف یک کاربر
  const deleteUser = (userId) => {
    if (user && userId === user.id) {
      return { success: false, message: "نمی‌توانید حساب خودتان را حذف کنید" };
    }

    const currentUsers = readUsers();
    const target = currentUsers.find((u) => u.id === userId);

    if (!target) {
      return { success: false, message: "کاربر پیدا نشد" };
    }

    if (target.role === "admin" && countAdmins(currentUsers) <= 1) {
      return { success: false, message: "نمی‌توانید آخرین حساب ادمین را حذف کنید" };
    }

    persistUsers(currentUsers.filter((u) => u.id !== userId));
    return { success: true };
  };

  // تغییر نقش یک کاربر (ادمین <-> کاربر عادی)
  const setUserRole = (userId, role) => {
    if (user && userId === user.id) {
      return { success: false, message: "نمی‌توانید نقش خودتان را تغییر دهید" };
    }

    const currentUsers = readUsers();
    const target = currentUsers.find((u) => u.id === userId);

    if (!target) {
      return { success: false, message: "کاربر پیدا نشد" };
    }

    if (target.role === "admin" && role === "customer" && countAdmins(currentUsers) <= 1) {
      return { success: false, message: "نمی‌توانید نقش آخرین ادمین را تغییر دهید" };
    }

    const updatedUsers = currentUsers.map((u) =>
      u.id === userId ? { ...u, role } : u,
    );
    persistUsers(updatedUsers);

    return { success: true };
  };

  // لیست کاربرها بدون پسورد - برای نمایش در پنل ادمین
  const safeUsers = users.map(({ password: _pw, ...rest }) => rest);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    users: safeUsers,
    deleteUser,
    setUserRole,
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