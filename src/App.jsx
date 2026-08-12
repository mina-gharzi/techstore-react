import { BrowserRouter } from "react-router-dom";

// ---------- Context ها ----------
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import { CategoriesProvider } from "./context/CategoriesContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import { FavoritesProvider } from "./context/FavoritesContext";

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
// نکته: AuthProvider بیرون‌ترین Provider است چون Cart/Favorites
// می‌توانند در آینده به وضعیت کاربر لاگین‌شده وابسته بشن (مثلاً
// سبد خرید مخصوص هر کاربر). فعلاً این وابستگی وجود نداره، ولی
// این ترتیب مسیر رو برای اون توسعه‌ی بعدی باز نگه می‌داره.
//
// CategoriesProvider قبل از ProductsProvider نیومده و بعدش هم
// نیومده - ترتیبشون مهم نیست چون به هم وابسته نیستن، فقط هر دو
// باید بالاتر از AppRoutes باشن.
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
                  <div className="app">
                    {/* هدر ثابت در همه صفحات */}
                    <Navbar />

                    {/* محتوای اصلی هر صفحه */}
                    <main className="main-content">
                      <ErrorBoundary>
                        <AppRoutes />
                      </ErrorBoundary>
                    </main>

                    {/* فوتر ثابت در همه صفحات */}
                    <Footer />
                  </div>
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