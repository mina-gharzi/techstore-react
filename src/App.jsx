import { BrowserRouter } from "react-router-dom";

// ---------- Context ها ----------
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

// ---------- مسیرها ----------
import AppRoutes from "./routes";
import ScrollToTop from "./components/ScrollToTop";

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
// ======================================================

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <FavoritesProvider>
              <div className="app">
                {/* هدر ثابت در همه صفحات */}
                <Navbar />

                {/* محتوای اصلی هر صفحه */}
                <main className="main-content">
                  <AppRoutes />
                </main>

                {/* فوتر ثابت در همه صفحات */}
                <Footer />
              </div>
            </FavoritesProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;