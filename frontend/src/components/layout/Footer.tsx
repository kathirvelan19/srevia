import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, MapPin, Phone, User } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F3D2E] text-[#FCFBF7] pt-16 pb-12 border-t border-[#315C45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[#315C45]/60">
          
          {/* Brand Intro */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-wider text-[#FCFBF7] leading-none uppercase">
                SREVIA HERBS
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#B89B5E] font-semibold mt-1">
                Ayurvedic Skincare
              </span>
            </div>
            
            <p className="italic text-[#A8B9A3] text-sm font-medium">
              "Pure Skin. Pure Care. PureWhite."
            </p>
            
            <p className="text-xs text-[#FCFBF7]/80 leading-relaxed font-normal">
              Rooted in traditional herbal care, crafted for modern everyday skincare. Handmade with natural plant oils, neem, and holy basil.
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#315C45] hover:bg-[#B89B5E] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#315C45] hover:bg-[#B89B5E] flex items-center justify-center text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.239-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-[#B89B5E] font-bold text-[#B89B5E] mb-4 uppercase tracking-wider text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FCFBF7]/80">
              <li>
                <Link to="/" className="hover:text-[#A8B9A3] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/product" className="hover:text-[#A8B9A3] transition-colors">PUREWHITE Soap</Link>
              </li>
              <li>
                <Link to="/ingredients" className="hover:text-[#A8B9A3] transition-colors">Botanical Ingredients</Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-[#A8B9A3] transition-colors">Our Story & Heritage</Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-[#A8B9A3] transition-colors">The PureWhite Experience</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#A8B9A3] transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-base font-bold text-[#B89B5E] mb-4 uppercase tracking-wider text-xs">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FCFBF7]/80">
              <li>
                <Link to="/track-order" className="hover:text-[#A8B9A3] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B89B5E]" />
                  <span>Track Order Status</span>
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-[#A8B9A3] transition-colors">Checkout & Payments</Link>
              </li>
              <li className="pt-2 text-[#A8B9A3] text-[11px] leading-relaxed">
                Need assistance with your order? Kathirvelan is available Mon-Sat, 9am - 6pm IST.
              </li>
            </ul>
          </div>

          {/* Business Contact Info */}
          <div>
            <h4 className="text-base font-bold text-[#B89B5E] mb-4 uppercase tracking-wider text-xs">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-xs text-[#FCFBF7]/80">
              <li className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#B89B5E] shrink-0" />
                <span className="font-semibold text-white">Kathirvelan</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B89B5E] shrink-0 mt-0.5" />
                <span>Srevia Herbs Care, Main Road, Coimbatore, Tamil Nadu 641001, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B89B5E] shrink-0" />
                <a href="tel:9025132739" className="hover:underline">+91 9025132739</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B89B5E] shrink-0" />
                <a href="mailto:kathirvelankvr@gmail.com" className="hover:underline">kathirvelankvr@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Sub-footer & Admin portal access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FCFBF7]/60">
          <p>© 2026 SREVIA HERBS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Handcrafted in India</span>
            <Link to="/admin/login" className="hover:text-[#B89B5E] underline transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
