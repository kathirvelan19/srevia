import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BrandIntroLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Session check so loader only runs once per initial session visit
    const hasSeenIntro = sessionStorage.getItem('srevia_intro_seen');
    if (hasSeenIntro) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('srevia_intro_seen', 'true');
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="brand-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-[#FCFBF7] flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="overflow-hidden text-center px-4">
            
            {/* Brand Name Mask Reveal */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1.5"
            >
              <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-[#1F3D2E] uppercase">
                SREVIA HERBS
              </h1>
              
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[10px] sm:text-xs font-semibold text-[#B89B5E] uppercase"
              >
                AYURVEDIC SKINCARE
              </motion.p>
            </motion.div>

            {/* Subtle Gold Line Indicator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeInOut' }}
              className="h-[1px] w-24 bg-[#B89B5E]/60 mx-auto mt-6 origin-center"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
