import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    initials: 'SL',
    name: 'Suriya Lithesh G',
    city: 'Chennai, Tamil Nadu',
    quote: "My skin cleared up within 3 weeks. I've tried so many products — this is the only one that actually worked without drying my face.",
    verified: true,
    rating: 5
  },
  {
    id: 2,
    initials: 'SK',
    name: 'Sasi Kumar',
    city: 'THIRUVANAMALAI, Tamil Nadu',
    quote: "Absolutely love this soap! The herbal fragrance is amazing and my skin feels so soft. No more breakouts after 4 weeks of use.",
    verified: true,
    rating: 5
  },
  {
    id: 3,
    initials: 'VG',
    name: 'Venu Gopal',
    city: 'vellore, TamilNadu',
    quote: "Great natural product. I was skeptical at first but the results surprised me. Skin looks brighter and healthier than ever before.",
    verified: true,
    rating: 4
  }
];

export const TestimonialCarouselSection: React.FC = () => {

  return (
    <section id="real-results" className="py-24 bg-[#F4F0E7]/60 border-y border-[#F4F0E7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#B89B5E] bg-[#1F3D2E] px-4 py-1.5 rounded-full shadow-sm"
          >
            REAL RESULTS
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F3D2E] tracking-tight"
          >
            Real People, <span className="italic font-normal text-[#315C45]">Real Stories</span>
          </motion.h2>
        </div>

        {/* 3 Review Cards Grid (Desktop & Tablet) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-[#FCFBF7] p-8 rounded-3xl shadow-herbal border border-[#A8B9A3]/30 flex flex-col justify-between relative group hover:border-[#B89B5E]/60 transition-all duration-300 transform hover:-translate-y-1.5"
            >
              <Quote className="w-8 h-8 text-[#A8B9A3]/30 absolute top-6 right-6 pointer-events-none" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex text-[#B89B5E] gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-current' : 'text-gray-300 fill-none'
                      }`}
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-sm text-[#1F3D2E] font-medium leading-relaxed italic">
                  "{review.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-[#F4F0E7] flex items-center gap-4">
                {/* Initials Badge */}
                <div className="w-12 h-12 rounded-full bg-[#1F3D2E] text-[#B89B5E] font-bold text-sm flex items-center justify-center border border-[#A8B9A3]/40 shrink-0 shadow-sm font-mono">
                  {review.initials}
                </div>

                <div>
                  <h3 className="font-bold text-[#1F3D2E] text-sm leading-tight">
                    {review.name}
                  </h3>
                  <p className="text-xs text-[#242824]/65 pt-0.5">{review.city}</p>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#315C45] font-semibold uppercase tracking-wider mt-1">
                      <CheckCircle2 className="w-3 h-3 text-[#315C45]" /> Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

