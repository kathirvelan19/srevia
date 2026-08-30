import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { DEFAULT_PRODUCT } from '../../services/api';
import { useCart } from '../../context/CartContext';

export const FinalCTASection: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleShopNow = () => {
    addToCart(DEFAULT_PRODUCT, 1);
    navigate('/checkout');
  };

  return (
    <section className="py-28 bg-[#1F3D2E] text-[#FCFBF7] relative overflow-hidden text-center border-t border-[#315C45]">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-[#315C45]/40 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#315C45]/60 border border-[#A8B9A3]/30 text-[#B89B5E] text-xs font-semibold uppercase tracking-[0.25em]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ELEVATE YOUR DAILY RITUAL</span>
        </motion.div>

        {/* Dramatic Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-2"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FCFBF7] leading-none">
            PURE SKIN. <br />
            PURE CARE. <br />
            <span className="italic font-normal text-[#B89B5E]">PUREWHITE.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#A8B9A3] italic font-normal pt-4 max-w-xl mx-auto">
            "Bring the wisdom of Ayurveda into your everyday skincare ritual."
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pt-4"
        >
          <button
            onClick={handleShopNow}
            className="bg-[#B89B5E] hover:bg-[#D4AF37] text-[#1F3D2E] font-bold text-xs uppercase tracking-[0.2em] px-10 py-5 rounded-full shadow-2xl transition-all transform hover:-translate-y-1 active-press inline-flex items-center gap-3 group"
          >
            <span>SHOP PUREWHITE — ₹149</span>
            <ArrowRight className="w-4 h-4 text-[#1F3D2E] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
