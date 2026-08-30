import React from 'react';
import { SEO } from '../../components/seo/SEO';
import barImg from '../../assets/purewhite_soap_bar.jpg';

export const OurStoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-28 pb-20">
      <SEO
        title="Our Story — Kathirvelan & SREVIA HERBS | Ayurvedic Heritage"
        description="Discover the story behind SREVIA HERBS founded by Kathirvelan in Coimbatore, Tamil Nadu. Bringing pure, traditional Indian herbal skincare to modern cleansing rituals."
        keywords="Srevia Herbs founder, Kathirvelan Coimbatore, Ayurvedic soap maker Tamil Nadu, herbal skincare brand India"
        canonicalUrl="https://sreviaherbs.com/our-story"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
            ABOUT SREVIA HERBS
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#1F3D2E]">
            Rooted in Herbal Wisdom, <br />
            <span className="italic font-normal text-[#315C45]">Crafted for Modern Skincare</span>
          </h1>
          <p className="text-sm text-[#242824]/80 font-light leading-relaxed">
            SREVIA HERBS was born from a desire to bring pure, honest, and traditional Indian botanical care to everyday skin cleansing rituals.
          </p>
        </div>

        {/* Section 1 & 2: Why Srevia Herbs & Our Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif-display text-3xl font-bold text-[#1F3D2E]">
              1. Why Srevia Herbs
            </h2>
            <p className="text-sm text-[#242824]/80 leading-relaxed font-light">
              In a market dominated by harsh chemical detergents and synthetic skincare bars, Srevia Herbs takes inspiration from India's ancient botanical heritage. We combine time-tested herbal ingredients like Neem and Holy Basil (Tulsi) with modern quality control standards.
            </p>

            <h2 className="font-serif-display text-3xl font-bold text-[#1F3D2E] pt-4">
              2. Our Philosophy
            </h2>
            <p className="text-sm text-[#242824]/80 leading-relaxed font-light">
              We believe effective skincare does not require aggressive chemicals or miracle promises. True skincare is consistent, gentle, and rooted in natural nourishment. Every bar we make honors purity, honesty, and small-batch craftsmanship.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-herbal border border-[#A8B9A3]/30">
              <img src={barImg} alt="Srevia Herbs Artisanal Craft" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Inspiration & Quality */}
        <div className="bg-[#F4F0E7]/60 rounded-3xl p-8 sm:p-12 border border-[#A8B9A3]/30 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">
              Traditional Herbal Inspiration
            </h3>
            <p className="text-xs text-[#242824]/80 leading-relaxed font-light">
              For generations, Neem and Tulsi have been trusted in Indian households to cleanse, purify, and refresh the skin. We source these herbs to ensure maximum freshness and botanical potency in every soap batch.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">
              Modern Quality Standards
            </h3>
            <p className="text-xs text-[#242824]/80 leading-relaxed font-light">
              While our inspiration is traditional, our manufacturing standards are strictly modern. We adhere to meticulous hygiene, ingredient safety checks, and eco-friendly packaging.
            </p>
          </div>
        </div>

        {/* Section 5: First Product */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
            OUR FLAGSHIP
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#1F3D2E]">
            5. Our First Product — PUREWHITE
          </h2>
          <p className="text-sm text-[#242824]/80 leading-relaxed font-light">
            PUREWHITE Herbal Anti-Pimple Soap represents our signature vision: a gentle, herbal-inspired cleansing bar designed for daily use to leave skin feeling clean, clear, and rejuvenated.
          </p>
        </div>

      </div>
    </div>
  );
};
