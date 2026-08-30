import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles, Droplet, Sun } from 'lucide-react';

const INGREDIENTS = [
  {
    number: '01',
    name: 'ORGANIC NEEM',
    title: 'Traditional Purifying Botanical',
    icon: Leaf,
    desc: 'Revered in Ayurvedic wisdom for thousands of years as nature’s ultimate skin purifier.',
    role: 'Deeply cleanses dirt, absorbs excess sebum, and keeps skin feeling fresh.',
    tag: 'Purifying Powerhouse'
  },
  {
    number: '02',
    name: 'HOLY BASIL (TULSI)',
    title: 'Ancient Skincare Ritual',
    icon: Sun,
    desc: 'Known as the Queen of Herbs, celebrated for its antioxidant and soothing properties.',
    role: 'Helps calm tired skin, protects against stressors, and restores natural radiance.',
    tag: 'Soothing & Calming'
  },
  {
    number: '03',
    name: 'VIRGIN COCONUT OIL',
    title: 'Cold-Pressed Nourishment',
    icon: Sparkles,
    desc: 'Traditional Indian beauty essential for soft, resilient, hydrated skin.',
    role: 'Creates a rich, creamy lather that nourishes without stripping moisture.',
    tag: 'Deep Hydration'
  },
  {
    number: '04',
    name: 'PURE PLANT GLYCERIN',
    title: 'Gentle Everyday Hydration',
    icon: Droplet,
    desc: 'Derived from natural plant oils to preserve skin’s moisture balance.',
    role: 'Draws hydration into skin layers, preventing tightness after cleansing.',
    tag: 'Moisture Lock'
  }
];

export const BotanicalStorySection: React.FC = () => {
  return (
    <section className="py-24 bg-[#FCFBF7] relative overflow-hidden">
      
      {/* Background Subtle Lines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]"
          >
            BOTANICAL INGREDIENTS
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3D2E] leading-tight"
          >
            ROOTED IN NATURE. <br />
            <span className="italic font-normal text-[#315C45]">REFINED FOR TODAY.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-[#242824]/75 font-normal"
          >
            Four active botanicals formulated to provide a clean, refreshed skin feel.
          </motion.p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INGREDIENTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative bg-[#F4F0E7]/60 hover:bg-[#F4F0E7] p-7 rounded-3xl border border-[#A8B9A3]/30 transition-all duration-300 hover:shadow-herbal flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#B89B5E] tracking-wider font-mono">
                      {item.number}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Tag */}
                  <div>
                    <h3 className="text-xl font-bold text-[#1F3D2E] group-hover:text-[#315C45] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#B89B5E] uppercase tracking-wider mt-1">
                      {item.title}
                    </p>
                  </div>

                  {/* Desc */}
                  <p className="text-xs text-[#242824]/80 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Role */}
                <div className="pt-4 mt-6 border-t border-[#A8B9A3]/30">
                  <p className="text-[11px] text-[#315C45] font-medium leading-relaxed">
                    <span className="font-bold text-[#1F3D2E]">Role:</span> {item.role}
                  </p>
                  <div className="h-[2px] w-0 group-hover:w-full bg-[#B89B5E] transition-all duration-500 mt-3 rounded-full" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Ingredients CTA */}
        <div className="text-center mt-12">
          <Link
            to="/ingredients"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1F3D2E] hover:text-[#315C45] border-b-2 border-[#1F3D2E] pb-1 transition-all group"
          >
            <span>DISCOVER ALL BOTANICAL INGREDIENTS</span>
            <ArrowRight className="w-4 h-4 text-[#B89B5E] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};
