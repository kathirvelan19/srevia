import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { currentUser, isAdmin, signInWithGoogle } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Product', path: '/product' },
    { name: 'Ingredients', path: '/ingredients' },
    { name: 'Our Story', path: '/our-story' },
    { name: 'Results', path: '/results' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FCFBF7]/95 backdrop-blur-md shadow-herbal border-b border-[#F4F0E7] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo (Clean Text Only) */}
          <Link to="/" className="flex flex-col group focus:outline-none">
            <span className="font-bold text-2xl tracking-wider text-[#1F3D2E] leading-none uppercase group-hover:text-[#315C45] transition-colors">
              SREVIA HERBS
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#B89B5E] font-semibold mt-1">
              Ayurvedic Skincare
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors tracking-wide relative py-1 ${
                  isActive(link.path)
                    ? 'text-[#1F3D2E] font-semibold'
                    : 'text-[#242824]/80 hover:text-[#315C45]'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B89B5E] rounded-full animate-fade-in" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-3">
            
            {/* Track Order Icon button */}
            <Link
              to="/track-order"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#1F3D2E] hover:text-[#315C45] bg-[#F4F0E7] hover:bg-[#A8B9A3]/30 px-3 py-1.5 rounded-full transition-colors font-medium border border-[#A8B9A3]/30"
              title="Track Order"
            >
              <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
              <span>Track Order</span>
            </Link>

            {/* Google Auth / Profile Button */}
            {currentUser ? (
              <Link
                to={isAdmin ? '/admin/profile' : '/profile'}
                className="flex items-center gap-2 bg-[#F4F0E7] hover:bg-[#315C45]/10 p-1 pr-3 rounded-full border border-[#B89B5E]/50 transition-all"
                title={isAdmin ? 'Kathirvelan Admin Profile' : 'My Profile'}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Profile'}
                    className="w-7 h-7 rounded-full object-cover border border-[#B89B5E]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#1F3D2E] text-white text-xs font-bold flex items-center justify-center">
                    {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-[#1F3D2E]">
                  {isAdmin ? 'Admin Profile' : (currentUser.displayName || 'Profile').split(' ')[0]}
                </span>
              </Link>
            ) : (
              <button
                onClick={async () => {
                  try {
                    const userRole = await signInWithGoogle();
                    if (userRole === 'ADMIN') {
                      navigate('/admin/dashboard');
                    } else {
                      navigate('/profile');
                    }
                  } catch (e) {
                    console.error("Sign in failed:", e);
                  }
                }}
                className="flex items-center gap-2 bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Icon */}
            <Link
              to="/checkout"
              className="relative p-2.5 text-[#1F3D2E] hover:text-[#315C45] transition-colors focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#315C45] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1F3D2E] focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#1F3D2E]" /> : <Menu className="w-6 h-6 text-[#1F3D2E]" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-[#FCFBF7]/98 backdrop-blur-xl z-40 px-6 py-8 border-t border-[#F4F0E7] flex flex-col justify-between overflow-y-auto animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-5 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xl font-bold py-2 border-b border-[#F4F0E7]/60 flex items-center justify-between transition-colors ${
                  isActive(link.path)
                    ? 'text-[#1F3D2E] font-extrabold'
                    : 'text-[#242824]/75 hover:text-[#1F3D2E]'
                }`}
              >
                <span>{link.name}</span>
                {isActive(link.path) && (
                  <span className="w-2 h-2 rounded-full bg-[#B89B5E]" />
                )}
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-[#F4F0E7] space-y-3.5 pb-6">
            {currentUser ? (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/profile'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#315C45] text-white rounded-xl font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
              >
                <UserIcon className="w-4 h-4 text-[#B89B5E]" />
                {isAdmin ? 'Admin Dashboard (Kathirvelan)' : 'My Profile'}
              </Link>
            ) : (
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  try {
                    const userRole = await signInWithGoogle();
                    if (userRole === 'ADMIN') navigate('/admin/dashboard');
                    else navigate('/profile');
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1F3D2E] text-white rounded-xl font-bold text-sm shadow-sm active:scale-[0.98] transition-transform"
              >
                Sign In with Google
              </button>
            )}

            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#F4F0E7] text-[#1F3D2E] rounded-xl font-medium text-sm border border-[#A8B9A3]/40 active:scale-[0.98] transition-transform"
            >
              <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
              Track Your Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
