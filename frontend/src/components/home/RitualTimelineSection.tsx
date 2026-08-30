import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sparkles, HeartHandshake, Sun, CheckCircle2 } from 'lucide-react';

const RITUAL_STEPS = [
  {
    step: '01',
    title: 'NATURE SOURCING',
    icon: Leaf,
    headline: 'Pure Organic Botanicals',
    desc: 'Harvesting fresh Neem leaves and sacred Tulsi directly from traditional herbal gardens.'
  },
  {
    step: '02',
    title: 'AYURVEDIC BLENDING',
    icon: Sparkles,
    headline: 'Time-Tested Wisdom',
    desc: 'Infusing herbal extracts into cold-pressed virgin Coconut Oil and pure vegetable Glycerin.'
  },
  {
    step: '03',
    title: 'HANDCRAFTED SOAP',
    icon: HeartHandshake,
    headline: 'Small Batch Artisanal Care',
    desc: 'Poured and aged naturally in small controlled batches to preserve botanical potency.'
  },
  {
    step: '04',
    title: 'DAILY CLEANSING',
    icon: Sun,
    headline: 'Gentle Everyday Lather',
    desc: 'Creating a creamy, soothing foam that purifies pores without drying your skin.'
  },
  {
    step: '05',
    title: 'FRESH RADIANT SKIN',
    icon: CheckCircle2,
    headline: 'Healthy Natural Feel',
    desc: 'Enjoy clean, balanced, refreshed skin ready to take on the day.'
  }
];

export const RitualTimelineSection: React.FC = () => {
  return (
    <section id="ayurvedic-ritual" className="py-24 bg-[#1F3D2E] text-[#FCFBF7] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#315C45]/30 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]"
          >
            THE AYURVEDIC JOURNEY
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FCFBF7]"
          >
            From Botanical Garden <br />
            <span className="italic font-normal text-[#A8B9A3]">To Your Daily Skincare Ritual</span>
          </motion.h2>
        </div>

        {/* Horizontal Timeline (Desktop) & Vertical (Mobile) */}
        <div className="relative">
          
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-[#315C45] -translate-y-1/2 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {RITUAL_STEPS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  className="bg-[#315C45]/40 hover:bg-[#315C45] p-6 rounded-3xl border border-[#A8B9A3]/20 space-y-4 transition-all duration-300 transform hover:-translate-y-2 group shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#B89B5E] tracking-wider font-mono">
                      STEP {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center group-hover:bg-[#B89B5E] group-hover:text-[#1F3D2E] transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#B89B5E]">
                      {item.title}
                    </h3>
                    <h4 className="text-base font-bold text-white">
                      {item.headline}
                    </h4>
                  </div>

                  <p className="text-xs text-[#FCFBF7]/80 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
