import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Droplets, Sun, Leaf, HeartHandshake, Award, FlaskConical } from 'lucide-react';

const REASONS = [
  {
    num: '01',
    emoji: '✨',
    title: 'Reduces Acne',
    desc: 'Clinically proven formula targets acne at the root',
    icon: Sparkles
  },
  {
    num: '02',
    emoji: '🛡',
    title: 'Prevents Breakouts',
    desc: 'Daily use creates a protective barrier against bacteria',
    icon: ShieldCheck
  },
  {
    num: '03',
    emoji: '💧',
    title: 'Deep Pore Cleansing',
    desc: 'Penetrates deep to remove dirt, oil, and impurities',
    icon: Droplets
  },
  {
    num: '04',
    emoji: '☀️',
    title: 'Brightens Skin Tone',
    desc: 'Natural brightening agents for a radiant glow',
    icon: Sun
  },
  {
    num: '05',
    emoji: '🌿',
    title: '100% Natural',
    desc: 'No harmful chemicals, parabens, or sulfates',
    icon: Leaf
  },
  {
    num: '06',
    emoji: '🤲',
    title: 'Gentle on Skin',
    desc: 'Suitable for all skin types including sensitive skin',
    icon: HeartHandshake
  },
  {
    num: '07',
    emoji: '🏺',
    title: 'Handcrafted',
    desc: 'Made with care using traditional herbal techniques',
    icon: Award
  },
  {
    num: '08',
    emoji: '⚗️',
    title: 'Anti-Pimple Formula',
    desc: 'Specialized blend of herbs targeting acne-causing bacteria',
    icon: FlaskConical
  }
];

export const WhyPureWhiteSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#1F3D2E] text-[#FCFBF7] relative overflow-hidden">
      
      {/* Ambient Radial Lighting */}
      <div className="absolute top-1/2 left-1/4 w-[30rem] h-[30rem] bg-[#315C45]/30 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#B89B5E]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#B89B5E] bg-[#315C45]/50 border border-[#A8B9A3]/30 px-4 py-1.5 rounded-full shadow-sm"
          >
            WHY CHOOSE PUREWHITE
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FCFBF7] tracking-tight leading-tight"
          >
            8 Reasons Your Skin <br />
            <span className="italic font-normal text-[#B89B5E]">Will Thank You</span>
          </motion.h2>
        </div>

        {/* 8 Benefit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-[#315C45]/35 hover:bg-[#315C45]/70 p-7 rounded-3xl border border-[#A8B9A3]/25 transition-all duration-300 transform hover:-translate-y-2 space-y-4 shadow-lg group hover:shadow-2xl hover:border-[#B89B5E]/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-[#B89B5E] font-mono tracking-wider">
                    {item.num}
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center border border-[#A8B9A3]/20 group-hover:bg-[#B89B5E] group-hover:text-[#1F3D2E] transition-all shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs text-[#FCFBF7]/85 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

