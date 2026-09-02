import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { ProductPage } from './pages/Product';
import { IngredientsPage } from './pages/Ingredients';
import { OurStoryPage } from './pages/OurStory';
import { ResultsPage } from './pages/Results';
import { ContactPage } from './pages/Contact';
import { CheckoutPage } from './pages/Checkout';
import { OrderSuccessPage } from './pages/OrderSuccess';
import { TrackOrderPage } from './pages/TrackOrder';
import { FAQPage } from './pages/FAQ';
import { ReturnsPage } from './pages/Returns';
import { PrivacyPolicyPage } from './pages/PrivacyPolicy';
import { TermsOfServicePage } from './pages/TermsOfService';

// Admin Pages
import { AdminLoginPage } from './pages/Admin/Login';
import { AdminDashboardPage } from './pages/Admin/Dashboard';
import { AdminOrdersPage } from './pages/Admin/Orders';
import { AdminProductsPage } from './pages/Admin/Products';
import { AdminSettingsPage } from './pages/Admin/Settings';

// Scroll to top on navigation helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout Wrapper
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Storefront Routes */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/product"
            element={
              <MainLayout>
                <ProductPage />
              </MainLayout>
            }
          />
          <Route
            path="/ingredients"
            element={
              <MainLayout>
                <IngredientsPage />
              </MainLayout>
            }
          />
          <Route
            path="/our-story"
            element={
              <MainLayout>
                <OurStoryPage />
              </MainLayout>
            }
          />
          <Route
            path="/results"
            element={
              <MainLayout>
                <ResultsPage />
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <MainLayout>
                <CheckoutPage />
              </MainLayout>
            }
          />
          <Route
            path="/order-success"
            element={
              <MainLayout>
                <OrderSuccessPage />
              </MainLayout>
            }
          />
          <Route
            path="/track-order/:orderId?"
            element={
              <MainLayout>
                <TrackOrderPage />
              </MainLayout>
            }
          />
          <Route
            path="/faq"
            element={
              <MainLayout>
                <FAQPage />
              </MainLayout>
            }
          />
          <Route
            path="/returns-policy"
            element={
              <MainLayout>
                <ReturnsPage />
              </MainLayout>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <MainLayout>
                <PrivacyPolicyPage />
              </MainLayout>
            }
          />
          <Route
            path="/terms-of-service"
            element={
              <MainLayout>
                <TermsOfServicePage />
              </MainLayout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
