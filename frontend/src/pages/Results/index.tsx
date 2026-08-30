import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';

export const ResultsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-28 pb-20">
      <SEO
        title="Real Skin Transformation & Customer Results | PUREWHITE SREVIA HERBS"
        description="See how daily herbal cleansing with PUREWHITE Anti-Pimple Soap transforms skin. Customer reviews, skin benefits, and 4-week ritual results."
        keywords="PUREWHITE soap results, herbal pimple soap reviews, Srevia Herbs customer experience, clear skin results"
        canonicalUrl="https://sreviaherbs.com/results"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
            THE PUREWHITE RITUAL
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#1F3D2E]">
            The PureWhite Experience
          </h1>
          <p className="text-sm text-[#242824]/80 font-light leading-relaxed">
            Discover how daily gentle herbal cleansing with PUREWHITE soap transforms your daily skincare routine.
          </p>
        </div>

        {/* 4 Pillars of Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-[#F4F0E7] p-8 rounded-3xl border border-[#A8B9A3]/30 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center font-serif-display text-2xl font-bold">
              1
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">Cleanse</h3>
            <p className="text-xs text-[#242824]/80 font-light leading-relaxed">
              Lather gently with warm water to release fresh neem and tulsi botanical essences.
            </p>
          </div>

          <div className="bg-[#F4F0E7] p-8 rounded-3xl border border-[#A8B9A3]/30 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center font-serif-display text-2xl font-bold">
              2
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">Refresh</h3>
            <p className="text-xs text-[#242824]/80 font-light leading-relaxed">
              Enrich pores with natural glycerine hydration, keeping skin balanced and free of excess oil.
            </p>
          </div>

          <div className="bg-[#F4F0E7] p-8 rounded-3xl border border-[#A8B9A3]/30 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center font-serif-display text-2xl font-bold">
              3
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">Care</h3>
            <p className="text-xs text-[#242824]/80 font-light leading-relaxed">
              Enjoy a smooth, supple, non-tight skin feel right after rinsing.
            </p>
          </div>

          <div className="bg-[#F4F0E7] p-8 rounded-3xl border border-[#A8B9A3]/30 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center font-serif-display text-2xl font-bold">
              4
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">Repeat</h3>
            <p className="text-xs text-[#242824]/80 font-light leading-relaxed">
              Use daily morning and evening as part of your regular skincare routine.
            </p>
          </div>
        </div>

        {/* Transparency Disclaimer */}
        <div className="bg-[#FCFBF7] p-8 sm:p-10 rounded-3xl border border-[#A8B9A3]/40 shadow-herbal max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-3 text-[#1F3D2E]">
            <ShieldAlert className="w-6 h-6 text-[#B89B5E]" />
            <h3 className="font-serif-display text-2xl font-bold">Transparency & Skincare Guidelines</h3>
          </div>

          <p className="text-xs text-[#242824]/80 leading-relaxed font-light">
            Srevia Herbs is committed to honest, responsible skincare communication. PUREWHITE is a herbal-inspired cosmetic soap created for everyday hygiene and skin cleansing. We do not make medical claims or guarantee pimple removal for underlying medical conditions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1F3D2E] font-medium pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#315C45]" /> Suitable for all skin types
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#315C45]" /> Perform a patch test before initial use
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
