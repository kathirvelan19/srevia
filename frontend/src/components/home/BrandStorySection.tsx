import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import barImg from '../../assets/purewhite_soap_bar.jpg';

export const BrandStorySection: React.FC = () => {
  return (
    <section className="py-24 bg-[#FCFBF7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Story Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-herbal border border-[#F4F0E7] group">
              <img
                src={barImg}
                alt="Herbal formulation textures"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2E]/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <p className="text-2xl font-bold font-serif-display">Pure Organic Formulations</p>
                <p className="text-xs text-[#F4F0E7]/90 font-light">Crafted with care in Southern India</p>
              </div>
            </div>
          </motion.div>

          {/* Editorial Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
              OUR BRAND HERITAGE
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3D2E] leading-tight">
              "Born from India’s botanical heritage. <br />
              <span className="italic font-normal text-[#315C45]">Made for today’s skincare rituals."</span>
            </h2>

            <p className="text-sm sm:text-base text-[#242824]/80 leading-relaxed font-normal">
              At SREVIA HERBS, founder Kathirvelan envisioned a skincare brand that bridges ancient Indian herbal wisdom with contemporary daily skincare routines.
            </p>

            <p className="text-sm text-[#242824]/80 leading-relaxed font-normal">
              Our flagship PUREWHITE soap bar combines cold-pressed virgin Coconut Oil, antimicrobial Neem, soothing Tulsi, and natural vegetable Glycerin to provide a clean, refreshed skin feel every single day.
            </p>

            <div className="pt-4">
              <Link
                to="/our-story"
                className="inline-flex items-center gap-3 bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold uppercase tracking-[0.18em] px-8 py-4 rounded-full transition-all shadow-md active-press group"
              >
                <span>OUR STORY</span>
                <ArrowRight className="w-4 h-4 text-[#B89B5E] group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
