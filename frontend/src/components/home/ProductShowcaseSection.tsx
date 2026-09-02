import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { DEFAULT_PRODUCT } from '../../services/api';
import { useCart } from '../../context/CartContext';
import heroImg from '../../assets/srevia_hero_soap.jpg';

export const ProductShowcaseSection: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(DEFAULT_PRODUCT, quantity);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(DEFAULT_PRODUCT, quantity);
  };

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
          className="bg-[#FCFBF7] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-herbal border border-[#A8B9A3]/30 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          
          {/* Left Visual */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#F4F0E7] p-4 border border-[#A8B9A3]/20 group">
              <img
                src={heroImg}
                alt="PUREWHITE Soap Box and Bar"
                className="w-full h-auto object-cover rounded-xl shadow-sm transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-6 left-6 bg-[#315C45] text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                Save 33% • ₹80 Special
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
                      ₹80
                    </span>
                    <span className="text-base font-medium text-gray-400 line-through">
                      ₹120
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#315C45] bg-[#315C45]/10 px-2 py-0.5 rounded">
                    Save 33%
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#B89B5E] font-semibold uppercase tracking-wider mt-1">
                100g Bar • Handcrafted Ayurvedic Formula
              </p>
            </div>

            <p className="text-sm text-[#242824]/85 leading-relaxed font-normal">
              {DEFAULT_PRODUCT.description}
            </p>

            {/* Benefits Checklist */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F3D2E]">Key Benefits:</h4>
              {DEFAULT_PRODUCT.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#242824]">
                  <CheckCircle2 className="w-4 h-4 text-[#315C45] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Dynamic Quantity Selector & Pricing */}
            <div className="pt-4 border-t border-[#F4F0E7] space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1F3D2E]">Quantity</span>
                
                <div className="flex items-center gap-3 bg-[#F4F0E7] px-4 py-2 rounded-full border border-[#A8B9A3]/40 shadow-inner">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 text-[#1F3D2E] hover:text-[#315C45] transition-colors focus:outline-none active-press"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm text-[#1F3D2E] w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 text-[#1F3D2E] hover:text-[#315C45] transition-colors focus:outline-none active-press"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm py-3 px-5 bg-[#F4F0E7]/70 rounded-2xl border border-[#A8B9A3]/30">
                <span className="text-xs text-[#242824]/70 font-medium">Total Amount:</span>
                <span className="font-bold text-lg text-[#1F3D2E]">
                  {quantity} × ₹80 = <span className="text-[#315C45]">₹{quantity * 80}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#F4F0E7] hover:bg-[#A8B9A3]/30 text-[#1F3D2E] border border-[#315C45]/30 font-semibold text-xs uppercase tracking-wider py-4 rounded-full transition-all active-press flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#B89B5E]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#1F3D2E] hover:bg-[#315C45] text-white font-semibold text-xs uppercase tracking-wider py-4 rounded-full shadow-herbal transition-all transform hover:-translate-y-0.5 active-press flex items-center justify-center gap-2 group"
                >
                  <span>BUY NOW</span>
                  <ArrowRight className="w-4 h-4 text-[#B89B5E] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust statement */}
              <div className="pt-2 flex items-center gap-2 text-xs text-[#242824]/70 font-medium">
                <Shield className="w-4 h-4 text-[#315C45]" />
                <span>Made in small batches with carefully selected botanicals.</span>
              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
