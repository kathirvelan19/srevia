import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
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
import { ProfilePage } from './pages/Profile';
import { FAQPage } from './pages/FAQ';
import { ReturnsPage } from './pages/Returns';
import { PrivacyPolicyPage } from './pages/PrivacyPolicy';
import { TermsOfServicePage } from './pages/TermsOfService';

// Admin Pages
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

// Initial Authentication Gate Component
const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1F3D2E]"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Subtle Herbal Background Accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#1F3D2E]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#B89B5E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal text-center space-y-6 relative z-10 animate-fade-in">
          <div className="flex flex-col items-center">
            <span className="font-bold text-3xl tracking-wider text-[#1F3D2E] uppercase">
              SREVIA HERBS
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B89B5E] font-bold mt-1">
              Ayurvedic Skincare
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif-display font-bold text-[#1F3D2E]">
              Welcome to Srevia Herbs
            </h1>
            <p className="text-xs text-[#242824]/70 leading-relaxed">
              Please sign in with your Google account to enter the store, shop PUREWHITE soap, and manage orders.
            </p>
          </div>

          <button
            onClick={async () => {
              try {
                const userRole = await signInWithGoogle();
                if (userRole === 'ADMIN') {
                  navigate('/admin/dashboard');
                }
              } catch (e) {
                console.error("Initial login error:", e);
              }
            }}
            className="w-full bg-[#1F3D2E] hover:bg-[#315C45] text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-full shadow-herbal transition-all flex items-center justify-center gap-3 active-press"
          >
            <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign In with Google</span>
          </button>

          <div className="pt-4 border-t border-[#F4F0E7] text-[11px] text-[#242824]/60">
            <span>Kathirvelan • Customer Care & Support</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
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
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <AuthGate>
              <Routes>
                {/* Public Storefront Routes (Gated behind Google Auth) */}
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
                  path="/profile"
                  element={
                    <MainLayout>
                      <ProfilePage />
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
                <Route
                  path="/admin"
                  element={
                    <MainLayout>
                      <AdminDashboardPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <MainLayout>
                      <AdminDashboardPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <MainLayout>
                      <AdminOrdersPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <MainLayout>
                      <AdminProductsPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <MainLayout>
                      <AdminSettingsPage />
                    </MainLayout>
                  }
                />
              </Routes>
            </AuthGate>
          </Router>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
};

export default App;
