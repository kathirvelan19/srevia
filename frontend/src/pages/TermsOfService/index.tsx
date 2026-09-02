import React from 'react';
import { FileText } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-32 pb-24">
      <SEO
        title="Terms of Service | Srevia Herbs"
        description="Terms of service and conditions for purchasing PUREWHITE soap from Srevia Herbs online store."
        keywords="Srevia Herbs Terms of Service, e-commerce terms, purchasing conditions"
        canonicalUrl="https://sreviaherbs.com/terms-of-service"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#B89B5E] bg-[#1F3D2E] px-4 py-1.5 rounded-full shadow-sm">
            TERMS & CONDITIONS
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#1F3D2E]">
            Terms of Service
          </h1>
          <p className="text-sm text-[#242824]/75 leading-relaxed font-light">
            Clear guidelines for online purchases and customer agreements.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#FCFBF7] p-8 sm:p-12 rounded-3xl border border-[#A8B9A3]/40 shadow-herbal space-y-8 text-sm text-[#242824]/85 leading-relaxed">
          
          <div className="space-y-3 border-b border-[#F4F0E7] pb-6">
            <h2 className="text-xl font-bold text-[#1F3D2E] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#B89B5E]" />
              <span>General Overview</span>
            </h2>
            <p className="text-xs">
              By accessing or purchasing from Srevia Herbs online store, you agree to these terms of service. All products offered are 100% handcrafted herbal skincare soaps.
            </p>
          </div>

          <div className="space-y-3 border-b border-[#F4F0E7] pb-6">
            <h2 className="text-xl font-bold text-[#1F3D2E]">Pricing & Orders</h2>
            <p className="text-xs">
              All prices listed (₹80 per 100g bar) are in Indian Rupees (INR) and inclusive of applicable taxes. Delivery charges are calculated transparently during checkout.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#1F3D2E]">Product Usage</h2>
            <p className="text-xs">
              PUREWHITE soap is formulated for cosmetic skin cleansing. Perform a small skin patch test before initial full face or body use if you have known botanical allergies.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
