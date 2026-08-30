import React from 'react';
import { SEO } from '../../components/seo/SEO';
import { BrandIntroLoader } from '../../components/home/BrandIntroLoader';
import { HeroSection } from '../../components/home/HeroSection';
import { BotanicalStorySection } from '../../components/home/BotanicalStorySection';
import { RitualTimelineSection } from '../../components/home/RitualTimelineSection';
import { ProductShowcaseSection } from '../../components/home/ProductShowcaseSection';
import { WhyPureWhiteSection } from '../../components/home/WhyPureWhiteSection';
import { ResultsSection } from '../../components/home/ResultsSection';
import { BrandStorySection } from '../../components/home/BrandStorySection';
import { TestimonialCarouselSection } from '../../components/home/TestimonialCarouselSection';
import { FinalCTASection } from '../../components/home/FinalCTASection';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#242824] selection:bg-[#A8B9A3]/30 selection:text-[#1F3D2E]">
      <SEO
        title="Srevia Herbs | PUREWHITE Herbal Anti-Pimple Soap & Ayurvedic Skincare"
        description="Rooted in traditional Indian herbal care, crafted for modern everyday skincare. Discover PUREWHITE Herbal Anti-Pimple Soap by Kathirvelan."
        keywords="Srevia Herbs, PUREWHITE soap, herbal anti pimple soap, Ayurvedic skincare, Kathirvelan, Neem soap, Tulsi soap, Coimbatore skincare"
        canonicalUrl="https://sreviaherbs.com/"
      />
      {/* 1. Brand Intro Loading Experience */}
      <BrandIntroLoader />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Botanical Story */}
      <BotanicalStorySection />

      {/* 4. Ayurvedic Ritual Timeline */}
      <RitualTimelineSection />

      {/* 5. Product Showcase & Quick Buy */}
      <ProductShowcaseSection />

      {/* 6. Why PUREWHITE Benefits */}
      <WhyPureWhiteSection />

      {/* 7. Real Ritual. Real Results. */}
      <ResultsSection />

      {/* 8. Brand Story & Heritage */}
      <BrandStorySection />

      {/* 9. Customer Testimonial Carousel */}
      <TestimonialCarouselSection />

      {/* 10. Final Dramatic CTA */}
      <FinalCTASection />
    </div>
  );
};
