import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sun, Shield, Sparkles } from 'lucide-react';

const BENEFITS = [
  {
    num: '01',
    title: 'AYURVEDIC BOTANICALS',
    desc: 'Inspired by traditional Indian skincare wisdom using pure organic extracts.',
    icon: Leaf
  },
  {
    num: '02',
    title: 'GENTLE DAILY CLEANSING',
    desc: 'Designed for everyday face & body use without stripping natural moisture.',
    icon: Sun
  },
  {
    num: '03',
    title: 'SMALL-BATCH CRAFTED',
    desc: 'Carefully formulated and handcrafted in small batches for fresh potency.',
    icon: Shield
  },
  {
    num: '04',
    title: 'MODERN RITUAL',
    desc: 'Traditional herbal ingredients delivered in a contemporary skincare experience.',
    icon: Sparkles
  }
];

export const WhyPureWhiteSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#1F3D2E] text-[#FCFBF7] relative overflow-hidden">
      
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#315C45]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]"
          >
            OUR COMMITMENT
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FCFBF7]"
          >
            Why Choose PUREWHITE
          </motion.h2>
        </div>

        {/* 4 Benefit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-[#315C45]/40 hover:bg-[#315C45] p-8 rounded-3xl border border-[#A8B9A3]/20 transition-all duration-300 transform hover:-translate-y-2 space-y-4 shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#B89B5E] font-mono">{item.num}</span>
                  <div className="w-10 h-10 rounded-full bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center group-hover:bg-[#B89B5E] group-hover:text-[#1F3D2E] transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white tracking-wide">
                  {item.title}
                </h3>

                <p className="text-xs text-[#FCFBF7]/80 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
