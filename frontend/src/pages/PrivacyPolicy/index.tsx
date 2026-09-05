import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset">
      <SEO
        title="Privacy Policy | Srevia Herbs"
        description="Read Srevia Herbs Privacy Policy. How we protect customer personal data, addresses, and payment information."
        keywords="Srevia Herbs Privacy Policy, customer data protection, secure e-commerce privacy"
        canonicalUrl="https://sreviaherbs.com/privacy-policy"
      />
      <div className="container-custom max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#B89B5E] bg-[#1F3D2E] px-4 py-1.5 rounded-full shadow-sm">
            PRIVACY & DATA
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#1F3D2E]">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#242824]/75 leading-relaxed font-light">
            Your privacy is fundamental to our business.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#FCFBF7] p-8 sm:p-12 rounded-3xl border border-[#A8B9A3]/40 shadow-herbal space-y-8 text-sm text-[#242824]/85 leading-relaxed">
          
          <div className="space-y-3 border-b border-[#F4F0E7] pb-6">
            <h2 className="text-xl font-bold text-[#1F3D2E] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#B89B5E]" />
              <span>Information We Collect</span>
            </h2>
            <p className="text-xs">
              When you place an order or message us, we collect your name, phone number, shipping address, and email address solely for fulfilling your purchase, sending order updates, and providing customer support.
            </p>
          </div>

          <div className="space-y-3 border-b border-[#F4F0E7] pb-6">
            <h2 className="text-xl font-bold text-[#1F3D2E] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#B89B5E]" />
              <span>Payment & Data Security</span>
            </h2>
            <p className="text-xs">
              All payment transactions are encrypted securely via Razorpay payment gateway SDK or verified via official UPI protocol. We do not store credit card or bank account details on our servers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#1F3D2E] flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-[#B89B5E]" />
              <span>Zero Data Sharing</span>
            </h2>
            <p className="text-xs">
              We never sell, rent, or trade customer information to third-party advertisers. Your information is strictly used for order delivery and customer communication.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
