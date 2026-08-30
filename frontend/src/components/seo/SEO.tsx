import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Srevia Herbs | PUREWHITE Herbal Anti-Pimple Soap & Ayurvedic Skincare',
  description = 'Handcrafted with pure Neem, Holy Basil Tulsi, and Cold-Pressed Virgin Coconut Oil by Kathirvelan in Coimbatore, Tamil Nadu.',
  keywords = 'Srevia Herbs, PUREWHITE soap, herbal anti pimple soap, Ayurvedic skincare, Neem soap, Kathirvelan',
  canonicalUrl = 'https://sreviaherbs.com/'
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }

    // 3. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      metaKeywords.setAttribute('content', keywords);
      document.head.appendChild(metaKeywords);
    }

    // 4. Update Canonical Tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonicalUrl);
    }
  }, [title, description, keywords, canonicalUrl]);

  return null;
};
