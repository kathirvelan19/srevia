import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { DEFAULT_PRODUCT } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import heroImg from '../../assets/srevia_hero_soap.jpg';

export const HeroSection: React.FC = () => {
  const { addToCart } = useCart();
  const { inStock, price, originalPrice } = useStore();
  const navigate = useNavigate();

  const activeProduct = {
    ...DEFAULT_PRODUCT,
    price,
    originalPrice,
    stockQuantity: inStock ? 100 : 0,
    active: inStock,
  };

  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Mouse Parallax for Desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const heroX = useSpring(mouseX, springConfig);
  const heroY = useSpring(mouseY, springConfig);
  const particleX = useSpring(mouseX, { damping: 40, stiffness: 200 });
  const particleY = useSpring(mouseY, { damping: 40, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2) / 30;
    const y = (clientY - innerHeight / 2) / 30;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleShopNow = () => {
    if (!inStock) return;
    addToCart(activeProduct, 1);
    navigate('/checkout');
  };

  const scrollToRitual = () => {
    const el = document.getElementById('ayurvedic-ritual');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] lg:min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#FCFBF7] flex items-center"
    >
      {/* Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-[#A8B9A3]/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-[#B89B5E]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Editorial Content */}
          <div className="lg:col-span-6 space-y-7 text-left">
            
            {/* Eyebrow & Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-[#1F3D2E] text-[#B89B5E] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider sm:tracking-[0.18em] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                Best Seller — 15+ Happy Customers
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-[#F4F0E7] border border-[#A8B9A3]/40 text-[#1F3D2E] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider sm:tracking-[0.15em]">
                100% TRADITIONAL AYURVEDIC FORMULATED
              </span>
            </motion.div>

            {/* Typography */}
            <div className="space-y-2.5 sm:space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F3D2E] leading-[1.1] tracking-tight"
              >
                Where Purity <br />
                <span className="font-normal italic text-[#315C45]">Meets Beauty</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-xs sm:text-sm uppercase tracking-widest text-[#1F3D2E]/80 font-bold"
              >
                PUREWHITE Herbal Anti-Pimple Soap
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-sm sm:text-lg text-[#315C45] italic font-medium pt-0.5"
              >
                "Ancient Indian botanicals, crafted into a modern daily cleansing ritual."
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="text-xs sm:text-base text-[#242824]/85 leading-relaxed pt-1"
              >
                Clinically proven to reduce acne by up to 95% in just 4 weeks. Crafted with 100% natural ingredients for radiant, clear skin.
              </motion.p>
            </div>

            {/* Rating & Product Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#242824]/80 pt-1 font-medium"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#1F3D2E] font-sans">
                  ₹{price}
                </span>
                {originalPrice > price && (
                  <span className="text-sm sm:text-base font-medium text-gray-400 line-through">
                    ₹{originalPrice}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-[#315C45] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
                    Save {discountPercent}%
                  </span>
                )}
                <span className="text-[11px] sm:text-xs font-normal text-[#242824]/60">/ 100g bar</span>
              </div>

              <div className="h-4 w-[1px] bg-[#A8B9A3]/50 hidden sm:block" />

              {inStock ? (
                <span className="bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                </span>
              ) : (
                <span className="bg-rose-100 text-rose-800 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              )}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <button
                disabled={!inStock}
                onClick={handleShopNow}
                className={`font-semibold text-xs uppercase tracking-[0.18em] px-8 py-3.5 sm:py-4 rounded-full transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                  inStock
                    ? 'bg-[#1F3D2E] hover:bg-[#315C45] text-[#FCFBF7] shadow-herbal hover:shadow-herbal-hover transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>{inStock ? 'Add to Cart' : 'OUT OF STOCK'}</span>
                <ArrowRight className="w-4 h-4 text-[#B89B5E] group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={scrollToRitual}
                className="bg-transparent hover:bg-[#F4F0E7] text-[#1F3D2E] border border-[#315C45]/40 font-semibold text-xs uppercase tracking-[0.18em] px-8 py-3.5 sm:py-4 rounded-full transition-all text-center active-press active:scale-[0.98]"
              >
                View Details
              </button>
            </motion.div>

            {/* Micro Trust Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-xs text-[#242824]/75 font-medium"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#315C45] shrink-0" /> 100% Pure Botanical Neem & Tulsi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#315C45] shrink-0" /> Free Shipping over ₹499
              </span>
            </motion.div>

          </div>

          {/* Right Product Showcase */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            <motion.div
              style={{ x: heroX, y: heroY }}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Background Frame Layer */}
              <div className="absolute inset-0 bg-[#F4F0E7] rounded-3xl transform rotate-2 scale-95 -z-10 shadow-sm border border-[#A8B9A3]/30" />

              {/* Main Product Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-herbal-hover border border-[#F4F0E7] group bg-[#F4F0E7]">
                <img
                  src={heroImg}
                  alt="Srevia Herbs PUREWHITE Soap Showcase"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 max-h-[420px] sm:max-h-none"
                />

                {/* Glassmorphism Floating Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 glass-card px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-lg border border-[#F4F0E7] flex items-center gap-3 sm:gap-4 max-w-[calc(100%-2rem)]"
                >
                  <div className="text-left">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#242824]/70 font-semibold">
                      Special Offer
                    </p>
                    <p className="text-base sm:text-lg font-bold text-[#1F3D2E]">
                      ₹80 <span className="text-xs line-through text-gray-400 font-normal">₹120</span>
                    </p>
                  </div>
                  <span className="bg-[#315C45] text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse-glow shrink-0">
                    Save 33%
                  </span>
                </motion.div>

                {/* Top Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-[#1F3D2E]/90 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-1.5 backdrop-blur-md shadow-md border border-[#315C45]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B89B5E]" />
                  <span>Pure Botanical</span>
                </motion.div>
              </div>

              {/* Floating Botanical Parallax Leaves/Particles */}
              <motion.div
                style={{ x: particleX, y: particleY }}
                className="absolute -top-6 -left-6 bg-[#315C45] text-[#FCFBF7] p-3.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-[#A8B9A3]/30 pointer-events-none hidden sm:flex"
              >
                <span>🌿 Organic Neem Leaf</span>
              </motion.div>

              <motion.div
                style={{ x: particleX, y: particleY }}
                className="absolute -bottom-4 -right-4 bg-[#1F3D2E] text-[#B89B5E] p-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-[#315C45] pointer-events-none hidden sm:flex"
              >
                <span>🌱 Holy Basil Tulsi</span>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
