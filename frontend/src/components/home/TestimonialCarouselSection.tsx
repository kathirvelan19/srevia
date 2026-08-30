import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Ananya Sharma',
    city: 'Bangalore, Karnataka',
    quote: 'PUREWHITE has become an essential part of my morning shower ritual. The natural neem scent is incredibly soothing and it cleanses my skin without drying it out.',
    verified: true,
    rating: 5
  },
  {
    id: 2,
    name: 'Priya Venkatesh',
    city: 'Chennai, Tamil Nadu',
    quote: 'The combination of Tulsi and virgin Coconut Oil creates such a rich, creamy lather. My face feels fresh, clean, and balanced every single day.',
    verified: true,
    rating: 5
  },
  {
    id: 3,
    name: 'Karthik Subramanian',
    city: 'Coimbatore, Tamil Nadu',
    quote: 'Finally a handcrafted herbal soap that actually feels premium and leaves zero sticky residue! High quality ingredients at ₹149.',
    verified: true,
    rating: 5
  },
  {
    id: 4,
    name: 'Meera Deshmukh',
    city: 'Mumbai, Maharashtra',
    quote: 'I love that Srevia Herbs stays true to authentic Indian botanicals without artificial parabens. Ordering my 3rd bar today!',
    verified: true,
    rating: 5
  }
];

export const TestimonialCarouselSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const nextReview = () => {
    setCurrent((prev) => (prev + 1) % REVIEWS.length);
  };

  const prevReview = () => {
    setCurrent((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const review = REVIEWS[current];

  return (
    <section className="py-24 bg-[#F4F0E7]/60 border-y border-[#F4F0E7] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
          COMMUNITY FEEDBACK
        </span>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1F3D2E] mt-2 mb-12">
          Loved By Skincare Enthusiasts
        </h2>

        {/* Carousel Card */}
        <div className="relative bg-[#FCFBF7] p-8 sm:p-12 rounded-3xl shadow-herbal border border-[#A8B9A3]/30 min-h-[260px] flex flex-col justify-between">
          
          <Quote className="w-10 h-10 text-[#A8B9A3]/40 mx-auto absolute top-6 left-6 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 relative z-10 my-auto"
            >
              {/* Stars */}
              <div className="flex justify-center text-[#B89B5E] gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base sm:text-lg text-[#1F3D2E] font-medium leading-relaxed italic max-w-2xl mx-auto">
                "{review.quote}"
              </p>

              {/* Customer info */}
              <div>
                <h3 className="font-bold text-[#1F3D2E] text-sm">{review.name}</h3>
                <p className="text-xs text-[#242824]/60">{review.city}</p>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#315C45] font-semibold uppercase tracking-wider mt-1">
                    <CheckCircle2 className="w-3 h-3 text-[#315C45]" /> Verified Buyer
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#F4F0E7] mt-6">
            <div className="flex items-center gap-2">
              {REVIEWS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === current ? 'w-6 bg-[#315C45]' : 'bg-[#A8B9A3]/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevReview}
                className="w-10 h-10 rounded-full bg-[#F4F0E7] hover:bg-[#315C45] hover:text-white text-[#1F3D2E] flex items-center justify-center transition-colors border border-[#A8B9A3]/30"
                aria-label="Previous Review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextReview}
                className="w-10 h-10 rounded-full bg-[#F4F0E7] hover:bg-[#315C45] hover:text-white text-[#1F3D2E] flex items-center justify-center transition-colors border border-[#A8B9A3]/30"
                aria-label="Next Review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
