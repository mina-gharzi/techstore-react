# 🛍️ TechStore React

A modern and fully responsive e-commerce website built with **React** and **Vite**.

This project is the React rewrite of the original [TechStore (Vanilla JS version)](https://github.com/mina-gharzi/techstore), rebuilt from scratch with React Router, Context API, and a full front-end-only e-commerce feature set (no backend required — everything runs on `localStorage`).

---

## ✨ Features

### Shopping experience

- Fully responsive design (Desktop, Tablet, Mobile)
- Home page with featured, new, and discounted product sections (horizontal scroll on mobile)
- Product listing page with search, category filters, and sorting
- Product details page with color variants, quantity selector, and related products
- Shopping cart with per-color-variant line items, quantity controls, and live stock limits
- Wishlist / Favorites
- Checkout flow with shipping form, payment method selection, and coupon codes
- Order confirmation page and full purchase history in the user's profile

### Inventory & orders

- Per-product stock tracking — out-of-stock products are clearly marked and can't be added to the cart
- Stock is re-validated at checkout and automatically decremented after a successful order
- Coupon system (percentage or fixed-amount discounts)
- Order history with tracking number, items, shipping address, and status

### Accounts & access

- User authentication (Login & Register) — no backend, accounts are stored locally
- Forgot-password flow (identity verification via email + phone, then password reset)
- User profile: edit name/phone, change password, view order history
- Protected routes (`RequireAuth`, `RequireAdmin`) with automatic redirect back after login
- Role-based access: a seeded admin account (`admin@techstore.com` / `admin123`) unlocks the admin panel

### Admin panel

- Product management: add, edit, delete, set stock and pricing
- Order management: view every order and update its status (processing, shipped, delivered, cancelled)

### Engineering

- Context API for global state (Auth, Products, Cart, Orders, Favorites)
- `ErrorBoundary` around all routes so a render crash shows a recovery screen instead of a blank page
- `ScrollToTop` on every route change
- Reusable, well-organized component structure

---

## 🛠️ Tech Stack

- **React 19**
- **Vite**
- **React Router DOM**
- **Context API**
- **Lucide React** (Icons)
- Custom CSS

---

## 📂 Project Structure

```
src/
├── assets/
├── components/
│   ├── cart/
│   ├── common/
│   ├── layout/        # Navbar, Footer
│   ├── product/        # ProductCard
│   ├── ui/
│   ├── ErrorBoundary.jsx
│   ├── RequireAuth.jsx
│   ├── RequireAdmin.jsx
│   └── ScrollToTop.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── ProductsContext.jsx
│   ├── CartContext.jsx
│   ├── OrdersContext.jsx
│   └── FavoritesContext.jsx
├── data/
│   └── products.js     # seed data (source of truth is localStorage after first load)
├── hooks/
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── OrderSuccess.jsx
│   ├── Favorites.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── Profile.jsx
│   ├── AdminDashboard.jsx
│   └── NotFound.jsx
├── styles/
├── utils/
│   ├── constants.js
│   └── formatPrice.js
├── App.jsx
├── main.jsx
└── routes.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mina-gharzi/techstore-react.git

# Navigate to the project folder
cd techstore-react

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Try it out

- **Shop as a guest**, or register a new account.
- **Admin panel**: log in with `admin@techstore.com` / `admin123` to manage products, stock, and orders from `/admin`.
- **Coupon codes** to try at checkout: `WELCOME10` (10% off) or `TECH50` (fixed discount).

> ⚠️ This project has no backend. Users, products, cart, favorites, and orders all live in the browser's `localStorage`. Passwords are stored in plain text for demo purposes only — **do not reuse a real password when testing.**

---

## 📌 Future Improvements

- Real backend & database integration
- Real payment gateway integration
- Advanced search (autocomplete, typo tolerance)
- Product reviews & ratings
- Admin: user management and category management
- Multi-language support

---

## 👩‍💻 Author

**Mina Gharzi**
GitHub: [mina-gharzi](https://github.com/mina-gharzi)

## 📄 License

This project is created for learning and portfolio purposes.
