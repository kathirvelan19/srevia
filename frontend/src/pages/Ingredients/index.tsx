import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { DEFAULT_PRODUCT } from '../../services/api';

export const IngredientsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset">
      <SEO
        title="Pure Botanical Ingredients — Neem, Tulsi, Virgin Coconut Oil | SREVIA HERBS"
        description="Explore the traditional Ayurvedic ingredients behind PUREWHITE soap: Organic Neem, Holy Basil (Tulsi), Cold-Pressed Virgin Coconut Oil, and Plant Glycerin."
        keywords="Neem soap ingredients, Tulsi skincare benefits, virgin coconut oil soap, natural Ayurvedic ingredients, Kathirvelan Srevia Herbs"
        canonicalUrl="https://sreviaherbs.com/ingredients"
      />
      <div className="container-custom">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
            BOTANICAL HERITAGE
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#1F3D2E]">
            Pure Botanical Ingredients
          </h1>
          <p className="text-sm text-[#242824]/80 font-light leading-relaxed">
            Every bar of PUREWHITE Herbal Anti-Pimple Soap is crafted with raw, carefully selected natural ingredients inspired by traditional Indian skincare wisdom.
          </p>
        </div>

        {/* Detailed Ingredients Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEFAULT_PRODUCT.ingredients.map((ing, idx) => (
            <div
              key={idx}
              className="bg-[#FCFBF7] rounded-3xl p-8 border border-[#A8B9A3]/30 shadow-herbal hover:shadow-herbal-hover transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center font-bold">
                  0{idx + 1}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#315C45] bg-[#315C45]/10 px-3 py-1 rounded-full">
                  100% Herbal
                </span>
              </div>

              <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">
                {ing.name}
              </h3>

              <p className="text-xs font-semibold uppercase tracking-wider text-[#B89B5E]">
                {ing.shortDesc}
              </p>

              <div className="space-y-3 text-xs text-[#242824]/80 font-light leading-relaxed pt-2 border-t border-[#F4F0E7]">
                <div>
                  <h4 className="font-bold text-[#1F3D2E] mb-1">Traditional Ayurvedic Significance:</h4>
                  <p>{ing.traditionalSignificance}</p>
                </div>

                <div>
                  <h4 className="font-bold text-[#1F3D2E] mb-1">Skincare Function & Role:</h4>
                  <p>{ing.skincareRole}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Purity Guarantee Box */}
        <div className="mt-16 bg-[#1F3D2E] text-[#FCFBF7] rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B89B5E]">
              OUR FORMULATION PROMISE
            </span>
            <h3 className="font-serif-display text-3xl font-bold">
              What We Exclude Is As Important As What We Include
            </h3>
            <p className="text-xs text-[#FCFBF7]/80 leading-relaxed font-light">
              We never use harsh SLS/SLES sulfates, artificial dyes, parabens, synthetic bleach, or aggressive chemical agents. PUREWHITE is designed for gentle, non-stripping daily skincare.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-[#A8B9A3]">
              <CheckCircle2 className="w-4 h-4 text-[#B89B5E]" /> No SLS or Parabens
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A8B9A3]">
              <CheckCircle2 className="w-4 h-4 text-[#B89B5E]" /> No Synthetic Bleach
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A8B9A3]">
              <CheckCircle2 className="w-4 h-4 text-[#B89B5E]" /> Cruelty-Free Artisanal Process
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
