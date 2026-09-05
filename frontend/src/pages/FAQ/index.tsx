import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Truck, PhoneCall } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'All orders are dispatched within 24 hours. Delivery typically takes 2–5 business days across India depending on your location.'
  },
  {
    q: 'What ingredients are used in PUREWHITE soap?',
    a: 'PUREWHITE is crafted with 100% natural Organic Neem, Holy Basil (Tulsi), Cold-Pressed Virgin Coconut Oil, and Pure Plant Glycerine. Free from harsh sulfates, parabens, and synthetic dyes.'
  },
  {
    q: 'Is PUREWHITE suitable for daily face washing?',
    a: 'Yes, PUREWHITE is formulated specifically for gentle everyday face and body cleansing without stripping your skin’s natural moisture barrier.'
  },
  {
    q: 'How do I track my order status?',
    a: 'You can track your order anytime on our Track Order page using your unique Order ID (e.g. SRV-2026-XXXX) and phone number.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Razorpay (UPI, GPay, PhonePe, Cards, NetBanking) and direct manual UPI QR code scan payments.'
  },
  {
    q: 'Can I cancel or change my shipping address?',
    a: 'If your order has not dispatched yet, reach out to Kathirvelan via WhatsApp (+91 9025132739) or email immediately for instant address updates.'
  }
];

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset">
      <SEO
        title="Frequently Asked Questions (FAQ) | Srevia Herbs"
        description="Find answers to common questions about Srevia Herbs PUREWHITE soap ingredients, shipping timelines, order tracking, and payment methods."
        keywords="Srevia Herbs FAQ, PUREWHITE soap questions, shipping info, payment options, Kathirvelan customer support"
        canonicalUrl="https://sreviaherbs.com/faq"
      />
      <div className="container-custom max-w-5xl space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#B89B5E] bg-[#1F3D2E] px-4 py-1.5 rounded-full shadow-sm">
            HELP & SUPPORT
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#1F3D2E]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[#242824]/75 leading-relaxed font-light">
            Everything you need to know about PUREWHITE herbal soap, ordering, and pan-India delivery.
          </p>
        </div>

        {/* Feature Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-[#F4F0E7]/60 p-6 rounded-2xl border border-[#A8B9A3]/30 space-y-2">
            <Truck className="w-6 h-6 text-[#B89B5E] mx-auto" />
            <h3 className="font-bold text-sm text-[#1F3D2E]">Pan-India Shipping</h3>
            <p className="text-xs text-[#242824]/70">Fast 2-5 day delivery</p>
          </div>
          <div className="bg-[#F4F0E7]/60 p-6 rounded-2xl border border-[#A8B9A3]/30 space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#B89B5E] mx-auto" />
            <h3 className="font-bold text-sm text-[#1F3D2E]">100% Natural Formula</h3>
            <p className="text-xs text-[#242824]/70">Zero sulfates & parabens</p>
          </div>
          <div className="bg-[#F4F0E7]/60 p-6 rounded-2xl border border-[#A8B9A3]/30 space-y-2">
            <PhoneCall className="w-6 h-6 text-[#B89B5E] mx-auto" />
            <h3 className="font-bold text-sm text-[#1F3D2E]">Direct Support</h3>
            <p className="text-xs text-[#242824]/70">Kathirvelan: +91 9025132739</p>
          </div>
        </div>

        {/* Accordion FAQ */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#FCFBF7] rounded-2xl border border-[#A8B9A3]/40 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-base text-[#1F3D2E] hover:bg-[#F4F0E7]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-[#B89B5E] shrink-0" />
                  <span>{faq.q}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#315C45] transition-transform duration-300 ${
                    openIdx === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 pt-1 text-sm text-[#242824]/80 leading-relaxed border-t border-[#F4F0E7] bg-[#F4F0E7]/30">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Need More Assistance */}
        <div className="bg-[#1F3D2E] text-white p-8 rounded-3xl text-center space-y-4">
          <h2 className="text-2xl font-bold">Have a specific question?</h2>
          <p className="text-xs text-[#A8B9A3] max-w-md mx-auto">
            Contact Kathirvelan directly via WhatsApp or email for personalized assistance.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="bg-[#B89B5E] hover:bg-[#D4AF37] text-[#1F3D2E] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-colors"
            >
              Contact Us Page
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
