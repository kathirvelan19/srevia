import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

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
          <div className="flex items-center gap-4">
            
            {/* Track Order Icon button */}
            <Link
              to="/track-order"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#1F3D2E] hover:text-[#315C45] bg-[#F4F0E7] hover:bg-[#A8B9A3]/30 px-3.5 py-2 rounded-full transition-colors font-medium border border-[#A8B9A3]/30"
              title="Track Order"
            >
              <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
              <span>Track Order</span>
            </Link>

            {/* Cart Icon */}
            <Link
              to="/checkout"
              className="relative p-2 text-[#1F3D2E] hover:text-[#315C45] transition-colors focus:outline-none"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#315C45] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Shop PUREWHITE CTA */}
            <Link
              to="/product"
              className="hidden lg:inline-flex items-center justify-center bg-[#1F3D2E] hover:bg-[#315C45] text-[#FCFBF7] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-herbal transition-all transform hover:-translate-y-0.5 active-press"
            >
              Shop PUREWHITE
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1F3D2E] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-[#FCFBF7] z-40 px-6 py-8 border-t border-[#F4F0E7] flex flex-col justify-between overflow-y-auto animate-fade-in">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xl font-bold ${
                  isActive(link.path)
                    ? 'text-[#1F3D2E]'
                    : 'text-[#242824]/70 hover:text-[#1F3D2E]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-[#F4F0E7] space-y-4">
            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#F4F0E7] text-[#1F3D2E] rounded-xl font-medium text-sm border border-[#A8B9A3]/40"
            >
              <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
              Track Your Order
            </Link>

            <Link
              to="/product"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-3 bg-[#1F3D2E] text-white rounded-xl font-semibold uppercase tracking-wider text-sm shadow-md"
            >
              Shop PUREWHITE (₹149)
            </Link>

            <div className="text-center text-xs text-[#242824]/60 pt-2">
              <p>Pure Skin. Pure Care. PureWhite.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
