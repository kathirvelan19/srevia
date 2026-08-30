import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldAlert } from 'lucide-react';

const RESULTS = [
  {
    title: 'Cleansed Pore Feel',
    stat: '94%',
    desc: 'Users reported a deeply cleansed skin feel without excess oil buildup after morning washing.'
  },
  {
    title: 'Non-Stripping Moisture',
    stat: '96%',
    desc: 'Noticed their face felt soft and supple without uncomfortable tightness after 7 days.'
  },
  {
    title: 'Soothing Freshness',
    stat: '92%',
    desc: 'Felt their skin was calmer, refreshed, and visibly cleaner with twice-daily daily use.'
  },
  {
    title: 'Natural Glow',
    stat: '90%',
    desc: 'Appreciated the fresh herbal scent and natural lather texture during evening bath rituals.'
  }
];

export const ResultsSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#FCFBF7] relative overflow-hidden">
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
            OBSERVED EXPERIENCE
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3D2E]"
          >
            REAL RITUAL. <br />
            <span className="italic font-normal text-[#315C45]">REAL RESULTS.</span>
          </motion.h2>

          <p className="text-sm text-[#242824]/75 font-normal">
            Observed skin feel and cleansing satisfaction reported during daily use guidelines.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESULTS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-[#F4F0E7] p-8 rounded-3xl border border-[#A8B9A3]/30 hover:shadow-herbal transition-all duration-300 space-y-4 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl font-extrabold text-[#1F3D2E]">{item.stat}</span>
                <Sparkles className="w-5 h-5 text-[#B89B5E]" />
              </div>

              <h3 className="text-base font-bold text-[#1F3D2E]">{item.title}</h3>
              
              <p className="text-xs text-[#242824]/80 leading-relaxed font-normal">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Responsible Disclaimer Box */}
        <div className="mt-12 bg-[#F4F0E7]/60 p-5 rounded-2xl border border-[#A8B9A3]/40 text-center max-w-3xl mx-auto flex items-center justify-center gap-3 text-xs text-[#242824]/70">
          <ShieldAlert className="w-4 h-4 text-[#315C45] shrink-0" />
          <p className="italic">
            * Srevia Herbs PUREWHITE is a cosmetic cleansing soap formulated to support a clean, fresh skin feel. Individual experiences vary based on skin type and daily routine.
          </p>
        </div>

      </div>
    </section>
  );
};
