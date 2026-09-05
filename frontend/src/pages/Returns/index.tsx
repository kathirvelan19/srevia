import React from 'react';
import { RefreshCw } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';

export const ReturnsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset">
      <SEO
        title="Returns & Replacement Policy | Srevia Herbs"
        description="Learn about Srevia Herbs return guidelines, replacement process, and customer satisfaction commitments for PUREWHITE soap."
        keywords="Srevia Herbs returns, replacement policy, refund guidelines, customer support Kathirvelan"
        canonicalUrl="https://sreviaherbs.com/returns-policy"
      />
      <div className="container-custom max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#B89B5E] bg-[#1F3D2E] px-4 py-1.5 rounded-full shadow-sm">
            POLICIES
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#1F3D2E]">
            Returns & Replacement Policy
          </h1>
          <p className="text-sm text-[#242824]/75 leading-relaxed font-light">
            Our goal is 100% customer satisfaction with every bar of PUREWHITE soap.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#FCFBF7] p-8 sm:p-12 rounded-3xl border border-[#A8B9A3]/40 shadow-herbal space-y-8 text-sm text-[#242824]/85 leading-relaxed">
          
          <div className="space-y-3 border-b border-[#F4F0E7] pb-6">
            <h2 className="text-xl font-bold text-[#1F3D2E] flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#B89B5E]" />
              <span>7-Day Replacement Guarantee</span>
            </h2>
            <p>
              Due to hygiene standards for personal care products, unopened items in original packaging can be replaced within **7 days of delivery** if damaged or defective during transit.
            </p>
          </div>

          <div className="space-y-3 border-b border-[#F4F0E7] pb-6">
            <h2 className="text-xl font-bold text-[#1F3D2E]">How to Request a Replacement</h2>
            <ol className="list-decimal pl-5 space-y-2 text-xs">
              <li>Take a photo/video of the damaged package or product.</li>
              <li>Contact Kathirvelan via WhatsApp at **+91 9025132739** or email **kathirvelankvr@gmail.com** with your Order ID.</li>
              <li>Once verified, a replacement bar will be dispatched at no additional shipping cost.</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#1F3D2E]">Refund & Order Cancellations</h2>
            <p className="text-xs">
              Orders can be cancelled before dispatch for a full refund via your original payment method. If dispatched, shipping fees are non-refundable.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
