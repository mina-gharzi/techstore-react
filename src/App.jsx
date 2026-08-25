import { BrowserRouter } from "react-router-dom";

// ---------- Context ها ----------
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import { CategoriesProvider } from "./context/CategoriesContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ReviewsProvider } from "./context/ReviewsContext";

// ---------- مسیرها ----------
import AppRoutes from "./routes";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

// ---------- لایه‌های ثابت ----------
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// ======================================================
// App
// کامپوننت اصلی اپلیکیشن
//
// نکته: AuthProvider بیرون‌ترین Provider است چون Cart/Favorites/
// Reviews می‌توانند به وضعیت کاربر لاگین‌شده وابسته باشن (مثلاً
// نظر دادن فقط برای کاربر لاگین‌شده معنا داره).
//
// ترتیب Provider های دیگه (Categories, Products, Cart, Orders,
// Favorites, Reviews) نسبت به هم مهم نیست چون مستقل از همدیگه‌ن،
// فقط همه باید بالاتر از AppRoutes باشن.
// ======================================================

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ProductsProvider>
          <CategoriesProvider>
            <CartProvider>
              <OrdersProvider>
                <FavoritesProvider>
                  <ReviewsProvider>
                    <div className="app">
                      {/* لینک رد شدن از ناوبری — WCAG 2.4.1 */}
                      <a href="#main-content" className="skip-link">
                        رد شدن از ناوبری
                      </a>

                      {/* هدر ثابت در همه صفحات */}
                      <Navbar />

                      {/* محتوای اصلی هر صفحه */}
                      <main className="main-content" id="main-content">
                        <ErrorBoundary>
                          <AppRoutes />
                        </ErrorBoundary>
                      </main>

                      {/* فوتر ثابت در همه صفحات */}
                      <Footer />
                    </div>
                  </ReviewsProvider>
                </FavoritesProvider>
              </OrdersProvider>
            </CartProvider>
          </CategoriesProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;