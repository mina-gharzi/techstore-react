import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Heart, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { APP_NAME } from "../../utils/constants";

// ======================================================
// Navbar
// هدر ثابت سایت - در همه صفحات نمایش داده می‌شود
// ======================================================

export default function Navbar() {
  // ---------- State ----------
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // ---------- Context ----------
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // ---------- Handlers ----------
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleUserMenu = () => setIsUserMenuOpen((prev) => !prev);
  const closeUserMenu = () => setIsUserMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeUserMenu();
    closeMenu();
  };

  // ---------- Render ----------
  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* ---------- لوگو ---------- */}
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          {APP_NAME}
        </Link>

        {/* ---------- منوی دسکتاپ ---------- */}
        <nav className="navbar__nav">
          <NavLink to="/" className="navbar__link" end>
            خانه
          </NavLink>
          <NavLink to="/products" className="navbar__link">
            محصولات
          </NavLink>
          <NavLink to="/about" className="navbar__link">
            درباره ما
          </NavLink>
          <NavLink to="/contact" className="navbar__link">
            تماس با ما
          </NavLink>
        </nav>

        {/* ---------- اکشن‌ها (کاربر + علاقه‌مندی + سبد خرید) ---------- */}
        <div className="navbar__actions">
          {/* علاقه‌مندی‌ها */}
          <Link
            to="/favorites"
            className="navbar__icon-btn"
            title="علاقه‌مندی‌ها"
          >
            <Heart size={22} />
            {favorites.length > 0 && (
              <span className="navbar__badge">{favorites.length}</span>
            )}
          </Link>

          {/* سبد خرید */}
          <Link to="/cart" className="navbar__icon-btn" title="سبد خرید">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="navbar__badge">{totalItems}</span>
            )}
          </Link>

          {/* ---------- کاربر: ورود یا منوی حساب ---------- */}
          {isAuthenticated ? (
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="navbar__icon-btn"
                onClick={toggleUserMenu}
                title={user.fullName}
                aria-label="حساب کاربری"
              >
                <User size={22} />
              </button>

              {isUserMenuOpen && (
                <>
                  {/* لایه‌ی نامرئی برای بستن منو با کلیک بیرون */}
                  <button
                    type="button"
                    onClick={closeUserMenu}
                    aria-label="بستن منو"
                    style={{ position: "fixed", inset: 0, zIndex: 10 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50px",
                      left: 0,
                      background: "var(--color-bg-white)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "14px",
                      boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                      padding: "10px",
                      minWidth: "180px",
                      zIndex: 20,
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 10px",
                        marginBottom: "6px",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "0.92rem" }}>
                        {user.fullName}
                      </div>
                      <div style={{ color: "var(--color-text-faint)", fontSize: "0.78rem" }}>
                        {user.email}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={closeUserMenu}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px",
                        borderRadius: "10px",
                        color: "var(--color-text-secondary)",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textDecoration: "none",
                      }}
                    >
                      <User size={16} />
                      پروفایل من
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={closeUserMenu}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px",
                          borderRadius: "10px",
                          color: "var(--color-primary)",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          textDecoration: "none",
                        }}
                      >
                        <Shield size={16} />
                        پنل مدیریت
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px",
                        borderRadius: "10px",
                        color: "var(--color-error)",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      <LogOut size={16} />
                      خروج از حساب
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="navbar__icon-btn"
              title="ورود / ثبت‌نام"
            >
              <User size={22} />
            </Link>
          )}

          {/* دکمه منوی موبایل */}
          <button
            type="button"
            className="navbar__menu-toggle"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ---------- منوی موبایل ---------- */}
      <div className={`navbar__mobile-menu ${isMenuOpen ? "is-open" : ""}`}>
        <NavLink to="/" className="navbar__mobile-link" onClick={closeMenu} end>
          خانه
        </NavLink>
        <NavLink
          to="/products"
          className="navbar__mobile-link"
          onClick={closeMenu}
        >
          محصولات
        </NavLink>
        <NavLink
          to="/about"
          className="navbar__mobile-link"
          onClick={closeMenu}
        >
          درباره ما
        </NavLink>
        <NavLink
          to="/contact"
          className="navbar__mobile-link"
          onClick={closeMenu}
        >
          تماس با ما
        </NavLink>

        {/* بخش کاربر توی منوی موبایل */}
        {isAuthenticated ? (
          <>
            <div className="navbar__mobile-divider" />
            <div
              className="navbar__mobile-link"
              style={{ color: "var(--color-text-faint)", fontWeight: 600, cursor: "default" }}
            >
              👋 {user.fullName}
            </div>
            <NavLink
              to="/profile"
              className="navbar__mobile-link"
              onClick={closeMenu}
            >
              پروفایل من
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className="navbar__mobile-link"
                onClick={closeMenu}
              >
                پنل مدیریت
              </NavLink>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="navbar__mobile-link"
              style={{
                textAlign: "right",
                color: "var(--color-error)",
                fontFamily: "inherit",
                fontSize: "1.02rem",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              خروج از حساب
            </button>
          </>
        ) : (
          <>
            <div className="navbar__mobile-divider" />
            <NavLink
              to="/login"
              className="navbar__mobile-link"
              onClick={closeMenu}
            >
              ورود / ثبت‌نام
            </NavLink>
          </>
        )}
      </div>

      {/* ---------- Overlay موبایل ---------- */}
      {isMenuOpen && (
        <button
          type="button"
          className="navbar__overlay"
          onClick={closeMenu}
          aria-label="بستن منو"
        />
      )}
    </header>
  );
}