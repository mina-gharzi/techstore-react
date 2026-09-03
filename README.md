# TechStore 🛒

### Modern React E-Commerce Platform

TechStore is a fully responsive, RTL-first e-commerce storefront built with **React, Vite, and the Context API**. It simulates a real online shop — from product discovery and cart management to checkout, order history, and a full admin dashboard for managing products, orders, and users.

Built as a portfolio project with a focus on **realistic app structure, protected routing, role-based access control, and clean separation of business logic from UI.**

---

## 🚀 Live Demo

[View Live Demo](#) <!-- add your Netlify/Vercel link here -->

---

## ✨ Features

### 🛍️ Shopping Experience
- Product catalog with filtering and sorting
- Product details page with specs, related products, and reviews
- Shopping cart with quantity management
- Favorites / wishlist
- Coupon codes (percentage and fixed-amount discounts)
- Multi-step checkout (address → payment method → order summary)
- Order success / confirmation page

### 👤 Authentication & Accounts
- Register / Login / Logout (mock, client-side)
- Forgot password flow
- Protected routes for checkout, order confirmation, and profile
- Profile management (edit info, change password, order history)

### 🛠️ Admin Dashboard
- Role-based access control (`RequireAdmin`) — separate from regular `RequireAuth`
- Manage products, categories, and orders
- Manage users: change roles, delete accounts (with safeguards against removing the last admin or your own account)
- Analytics tab

### ⭐ Reviews
- Star-rating reviews per product, restricted to users who purchased the item
- Users can edit or delete their own review

### 🌍 RTL & Persian UI
- Fully right-to-left interface
- Persian number and currency formatting (Toman)
- Responsive layouts for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI and component architecture |
| Vite | Development and build tooling |
| React Router DOM | Routing, protected routes, code-splitting |
| Context API | Global state (Auth, Cart, Favorites, Products, Categories, Orders, Reviews) |
| Lucide React | Icons |
| Custom CSS | Design system (variables, components) |
| localStorage | Mock persistence layer |

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── admin/        → admin dashboard tabs (products, orders, users, analytics)
│   ├── checkout/      → address form, payment method, order summary
│   ├── product/       → product card, filters, gallery, reviews, specs
│   ├── profile/       → profile info, password change, order history
│   └── layout/        → navbar, footer, layout shell
│
├── context/            → Auth, Cart, Favorites, Products, Categories, Orders, Reviews
├── pages/               → route-level pages
├── services/            → business logic isolated from components (e.g. couponService)
├── hooks/               → shared hooks (useCheckout, usePageTitle)
├── utils/                → formatPrice, storage, constants, order status helpers
├── data/                 → seed/mock product data
├── models/               → shared type/shape documentation
├── styles/               → design tokens + component styles
└── routes.jsx            → central route definitions with lazy-loaded pages
```

### Route Protection

Two separate guard components exist by design:

- **`RequireAuth`** — any logged-in user (checkout, order confirmation, profile)
- **`RequireAdmin`** — logged-in **and** `role === "admin"` (the `/admin` dashboard). Unlike `RequireAuth`'s silent redirect, an authenticated non-admin sees an explicit "Access Restricted" message rather than being redirected — a silent redirect here would look like a bug rather than a permissions boundary.

---

## ⚠️ Project Scope & Limitations

TechStore is a portfolio project and intentionally uses a mock data/auth layer instead of a production backend:

- No real backend — data lives in `localStorage`
- **Mock authentication**: passwords are stored in plain text client-side. This is explicitly *not* production-safe and is called out in code comments in `AuthContext.jsx` — in a real app, auth must go through a backend API with hashed passwords (e.g. bcrypt) and token-based sessions, never plaintext password storage.
- A default admin account (`admin@techstore.com` / `admin123`) is seeded automatically since there's no UI flow to promote a user to admin — in a real app, role assignment would be a backend-controlled operation.
- Coupon codes are hardcoded client-side; a real store would validate them server-side.
- Static/seeded product catalog — no real inventory or payment gateway.

These limitations are intentional: the goal is to demonstrate frontend architecture, state management, and UX flows without introducing unnecessary backend complexity.

---

## 🚀 Getting Started

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

The app will be available at `http://localhost:5173`.

**Demo admin login:** `admin@techstore.com` / `admin123`

---

## 📌 Future Improvements

- Real backend integration (auth, products, orders)
- Real payment gateway
- Server-side coupon validation
- Advanced search
- Product review moderation for admins

---

## 👩‍💻 Author

**Mina Gharzi**
Frontend Developer focused on building modern, accessible, and scalable web applications with React.

---

## 📄 License

This is a personal portfolio project and is not licensed for commercial reuse.
