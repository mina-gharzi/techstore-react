# TechStore 🛒

A modern, responsive e-commerce web application built with **React** and **JavaScript**.

TechStore is a portfolio-focused online store that simulates a complete shopping experience, including product discovery, filtering, cart management, checkout, authentication, favorites, reviews, order management, and an admin dashboard.

The project focuses not only on UI implementation, but also on **component architecture, state management, business logic separation, responsive design, accessibility, and reusable design patterns**.

---

## ✨ Features

### 🛍️ Shopping Experience

* Browse products by category
* Search products by name, brand, and description
* Filter products by:

  * Category
  * New products
  * Discounted products
* Sort products by:

  * Price: low to high
  * Price: high to low
  * Rating
  * Newest
* Product detail pages
* Related products
* Product reviews and ratings
* Product color selection
* Favorites / wishlist
* Persistent shopping cart
* Guest cart support
* Automatic guest-cart merge after login

---

### 🛒 Cart & Checkout

* Add products to cart
* Update product quantities
* Remove products
* Clear cart
* Live product information from the Products state
* Stock validation
* Discount / coupon support
* Checkout form validation
* Address information
* Payment method selection
* Order summary
* Order creation
* Order success page

The cart intentionally stores only the minimum required data:

```js
{
  productId,
  selectedColor,
  quantity
}
```

Product information such as price, name, image, and stock is resolved from the current product state instead of storing a full product snapshot.

---

### 👤 Authentication & User Account

* User registration
* Login / logout
* Forgot-password flow
* Protected routes
* User profile
* Profile information management
* Password management
* Order history
* Order cancellation
* User-specific cart persistence

> **Note:** Authentication is intentionally implemented as a frontend-only demo using `localStorage`. It is not intended for production use. Passwords are stored as plain text only because this is a portfolio/demo project.

---

### ⭐ Favorites & Reviews

* Add/remove products from favorites
* Persistent favorites
* User-specific favorite lists
* Product reviews
* Rating system
* Review management

---

### 📦 Order Management

Orders support controlled status transitions:

```text
Processing
    ↓
Shipped
    ↓
Delivered
```

or:

```text
Processing
    ↓
Cancelled
```

Completed or cancelled orders cannot be moved to another status.

Order cancellation also handles inventory restoration.

---

### 🧑‍💼 Admin Dashboard

The project includes a dedicated admin area with protected access.

Admin functionality includes:

* Dashboard overview
* Product management
* Add products
* Edit products
* Delete products
* Category management
* User management
* Order management
* Order status management
* Analytics
* Product stock management

The admin area is protected using a dedicated `RequireAdmin` route guard.

---

## 🎨 Design System

The project uses a centralized design system instead of relying entirely on component-level styling.

### Design Tokens

The styling system includes reusable tokens for:

* Colors
* Semantic colors
* Typography
* Font weights
* Spacing
* Border radius
* Shadows
* Transitions

Examples:

```css
--color-primary
--color-success
--color-error
--color-text
--color-text-muted
--color-border

--space-1
--space-2
--space-3

--radius-sm
--radius-md
--radius-lg
```

Reusable component styles are organized into dedicated style modules:

```text
styles/
├── variables.css
└── components/
    ├── buttons.css
    ├── forms.css
    ├── cards.css
    ├── alerts.css
    ├── badges.css
    ├── layout.css
    └── quantity.css
```

---

## ♿ Accessibility

Accessibility was considered throughout the interface.

Implemented improvements include:

* Skip-to-content link
* Semantic HTML
* Accessible form labels
* `aria-label` for icon-only controls
* Keyboard-friendly interactive elements
* Proper button types
* Focus states
* Protected navigation
* Responsive layouts
* Error states for forms
* Meaningful image `alt` attributes

The application includes a global skip link:

```text
Skip navigation → Main content
```

to improve keyboard navigation.

---

## 📱 Responsive Design

TechStore is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

Responsive behavior includes:

* Mobile navigation
* Responsive product grids
* Collapsible product filters
* Mobile-friendly checkout
* Responsive admin dashboard
* Flexible cards and forms
* Adaptive typography and spacing

---

## 🧠 Architecture

The application follows a modular React architecture.

```text
src/
│
├── assets/
│
├── components/
│   ├── admin/
│   ├── checkout/
│   ├── layout/
│   ├── product/
│   └── profile/
│
├── context/
│   ├── AuthContext.jsx
│   ├── ProductsContext.jsx
│   ├── CategoriesContext.jsx
│   ├── CartContext.jsx
│   ├── OrdersContext.jsx
│   ├── FavoritesContext.jsx
│   └── ReviewsContext.jsx
│
├── data/
│   └── products.js
│
├── hooks/
│   ├── useCheckout.js
│   └── usePageTitle.js
│
├── models/
│   └── types.js
│
├── pages/
│
├── services/
│   └── couponService.js
│
├── styles/
│
├── utils/
│   ├── constants.js
│   ├── formatPrice.js
│   ├── orderStatus.js
│   └── storage.js
│
├── App.jsx
├── main.jsx
└── routes.jsx
```

---

## 🔄 State Management

The application uses React Context API for global state.

### Authentication

```text
AuthContext
    ↓
User / Users / Roles
```

### Products

```text
ProductsContext
    ↓
Products / Stock / CRUD
```

### Cart

```text
CartContext
    ↓
Cart items / Quantity / Totals
```

### Orders

```text
OrdersContext
    ↓
Create / Update / Cancel orders
```

### Favorites

```text
FavoritesContext
    ↓
User-specific favorites
```

### Reviews

```text
ReviewsContext
    ↓
Product reviews and ratings
```

This separation keeps each domain's state and logic easier to maintain.

---

## 🧩 Custom Hooks

Business logic that doesn't belong directly inside UI components is extracted into custom hooks.

For example:

```text
useCheckout
```

handles checkout-related logic such as:

* Validation
* Coupon handling
* Stock validation
* Order creation
* Checkout submission

This keeps the `Checkout` page focused mainly on rendering and user interaction.

---

## ⚙️ Data Persistence

Because this is a frontend-only portfolio project, application data is persisted using browser `localStorage`.

Persisted data includes:

* Users
* Current user
* Products
* Cart
* Favorites
* Orders
* Reviews
* Categories

A reusable storage utility is used instead of accessing `localStorage` directly throughout the application.

---

## 🗂️ Routing

The application uses React Router.

Main routes include:

```text
/
├── /products
├── /products/:id
├── /cart
├── /checkout
├── /order-success
├── /favorites
├── /about
├── /contact
├── /login
├── /register
├── /forgot-password
├── /profile
└── /admin
```

Protected routes:

```text
/checkout
/order-success
/profile
```

Admin-only route:

```text
/admin
```

The project also uses lazy loading for heavier pages such as:

* Admin Dashboard
* Product Details
* Checkout
* Profile

to reduce the initial loading cost.

---

## 🛡️ Error Handling

A global `ErrorBoundary` is used around the application's route content to prevent a single rendering error from breaking the entire application.

The project also includes:

* Form validation
* Empty states
* Not Found page
* Loading states
* Stock validation
* Protected routes

---

## 🛠️ Tech Stack

* **React**
* **JavaScript (ES6+)**
* **React Router**
* **Context API**
* **React Hooks**
* **CSS**
* **Lucide Icons**
* **LocalStorage**
* **JSDoc**
* **Vite**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### 2. Navigate into the project

```bash
cd techstore
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Then open the local development URL provided by Vite.

---

## 👨‍💼 Demo Admin Account

The project includes a default admin account for demonstration purposes:

```text
Email: admin@techstore.com
Password: admin123
```

> This account exists only for the frontend demo. A real production application should never hard-code admin credentials or store passwords in `localStorage`.

---

## 📸 Project Highlights

### Customer Experience

```text
Home
  ↓
Products
  ↓
Product Details
  ↓
Add to Cart
  ↓
Checkout
  ↓
Order Success
  ↓
Profile / Order History
```

### Admin Experience

```text
Admin Dashboard
      ↓
 ┌────┼─────┬──────────┐
 ↓    ↓     ↓          ↓
Users Products Orders Analytics
             ↓
       Status Management
```

---

## 🎯 Project Goals

This project was built to demonstrate practical frontend development skills rather than only creating a static UI.

Key goals were:

* Build a realistic e-commerce workflow
* Practice React component architecture
* Manage complex global state with Context API
* Separate UI from business logic
* Create reusable components and design tokens
* Handle authentication and protected routes
* Implement persistent client-side data
* Build responsive and accessible interfaces
* Practice admin dashboard architecture
* Create maintainable and scalable frontend code

---

## 🔮 Future Improvements

For a production-ready version, the following could be added:

* Real backend API
* Database integration
* Secure authentication
* JWT / session-based authentication
* Password hashing
* Real payment gateway
* Server-side inventory management
* Server-side order processing
* Image upload
* Product pagination
* Advanced analytics
* Automated tests
* Deployment and CI/CD

---

## 📌 Disclaimer

TechStore is a **frontend portfolio project**.

It intentionally uses mock data and browser storage instead of a real backend. Authentication, payments, inventory, and order processing are simulated for demonstration purposes.

The architecture is designed so these client-side implementations can later be replaced with real APIs and backend services.

---

## 👩‍💻 Author

**Mina Gharzi**

Frontend Developer — React / JavaScript

This project was created as part of my frontend development portfolio, with a focus on building realistic, maintainable, and user-friendly web applications.
