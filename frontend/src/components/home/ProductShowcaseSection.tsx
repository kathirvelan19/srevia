import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, ArrowRight, XCircle } from 'lucide-react';
import { DEFAULT_PRODUCT } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import heroImg from '../../assets/srevia_hero_soap.jpg';

export const ProductShowcaseSection: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
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

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(activeProduct, quantity);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(activeProduct, quantity);
  };

  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <section id="product-showcase" className="py-24 bg-[#F4F0E7]/60 border-y border-[#F4F0E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#B89B5E] bg-[#1F3D2E] px-4 py-1.5 rounded-full shadow-sm"
          >
            Best Seller — 15+ Happy Customers
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3D2E]"
          >
            Where Purity Meets Beauty
          </motion.h2>

          <p className="text-sm text-[#315C45] font-semibold">
            PUREWHITE Herbal Anti-Pimple Soap
          </p>
        </div>

        {/* Main Floating Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-[#FCFBF7] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-herbal border border-[#A8B9A3]/30 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative"
        >
          
          {/* Left Visual */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#F4F0E7] p-4 border border-[#A8B9A3]/20 group">
              <img
                src={heroImg}
                alt="PUREWHITE Soap Box and Bar"
                className={`w-full h-auto object-cover rounded-xl shadow-sm transform group-hover:scale-105 transition-transform duration-500 ${!inStock ? 'opacity-60 grayscale-[30%]' : ''}`}
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {inStock ? (
                  <div className="bg-[#315C45] text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    {discountPercent > 0 ? `Save ${discountPercent}% • ` : ''}₹{price} Special
                  </div>
                ) : (
                  <div className="bg-rose-600 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Out of Stock (Unavailable)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Product Details & Calculator */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1F3D2E]">
                  PUREWHITE Soap
                </h3>
                <div className="text-right">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#315C45]">
                      ₹{price}
                    </span>
                    {originalPrice > price && (
                      <span className="text-base font-medium text-gray-400 line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>
                  {discountPercent > 0 && (
                    <span className="text-[11px] font-bold text-[#315C45] bg-[#315C45]/10 px-2 py-0.5 rounded">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-[#B89B5E] font-semibold uppercase tracking-wider mt-1">
                100g Bar • Handcrafted Ayurvedic Formula
              </p>
            </div>

            <p className="text-xs text-[#242824]/70 leading-relaxed">
              Clinically proven to reduce acne by up to 95% in just 4 weeks. Formulated with organic Neem, Holy Basil Tulsi, and cold-pressed coconut oil.
            </p>

            {/* Quantity Selector */}
            <div className="bg-[#F4F0E7]/60 p-4 sm:p-5 rounded-2xl border border-[#A8B9A3]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1F3D2E]">
                  Quantity
                </span>
                <div className="flex items-center gap-2 bg-[#FCFBF7] px-3 py-1.5 rounded-full border border-[#A8B9A3]/40">
                  <button
                    disabled={!inStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-[#1F3D2E] hover:text-[#315C45] disabled:opacity-40 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm text-[#1F3D2E] w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    disabled={!inStock}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#1F3D2E] hover:text-[#315C45] disabled:opacity-40 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-2.5 px-4 bg-[#FCFBF7] rounded-xl border border-[#F4F0E7]">
                <span className="text-[#242824]/70 font-medium">Subtotal</span>
                <span className="font-bold text-base text-[#1F3D2E]">
                  ₹{quantity * price}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  disabled={!inStock}
                  onClick={handleAddToCart}
                  className={`w-full font-semibold text-xs uppercase tracking-wider py-3.5 rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                    inStock
                      ? 'bg-[#F4F0E7] hover:bg-[#A8B9A3]/30 text-[#1F3D2E] border border-[#315C45]/40'
                      : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#B89B5E]" />
                  <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>

                <button
                  disabled={!inStock}
                  onClick={handleBuyNow}
                  className={`w-full font-semibold text-xs uppercase tracking-wider py-3.5 rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                    inStock
                      ? 'bg-[#1F3D2E] hover:bg-[#315C45] text-white shadow-herbal'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>{inStock ? 'BUY NOW' : 'UNAVAILABLE'}</span>
                  <ArrowRight className="w-4 h-4 text-[#B89B5E]" />
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
