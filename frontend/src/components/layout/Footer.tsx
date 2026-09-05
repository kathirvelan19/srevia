import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F3D2E] text-[#FCFBF7] pt-16 pb-24 md:pb-12 border-t border-[#315C45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#315C45]/60">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-wider text-[#FCFBF7] uppercase">
                Srevia Herbs
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B89B5E] font-bold mt-1">
                Where Purity Meets Beauty
              </span>
            </div>
            
            <p className="text-xs text-[#FCFBF7]/85 leading-relaxed font-normal">
              Where Purity Meets Beauty. Transform your skin with premium herbal products crafted with love and natural ingredients.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-[#B89B5E] mb-4 uppercase tracking-wider text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FCFBF7]/85">
              <li>
                <Link to="/" className="hover:text-[#B89B5E] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/product" className="hover:text-[#B89B5E] transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-[#B89B5E] transition-colors">Reviews</Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-[#B89B5E] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#B89B5E] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-bold text-[#B89B5E] mb-4 uppercase tracking-wider text-xs">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FCFBF7]/85">
              <li>
                <Link to="/faq" className="hover:text-[#B89B5E] transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#B89B5E] transition-colors">Shipping Info</Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-[#B89B5E] transition-colors">Returns</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#B89B5E] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-[#B89B5E] transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold text-[#B89B5E] mb-4 uppercase tracking-wider text-xs">
              Contact
            </h4>
            <ul className="space-y-3 text-xs text-[#FCFBF7]/85">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B89B5E] shrink-0" />
                <a href="tel:9025132739" className="hover:underline font-medium">+91 9025132739</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B89B5E] shrink-0" />
                <a href="mailto:kathirvelankvr@gmail.com" className="hover:underline">kathirvelankvr@gmail.com</a>
              </li>
              <li className="flex items-center gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#B89B5E] shrink-0" />
                <span className="font-semibold text-white">24/7 Available (All Time)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Footer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FCFBF7]/70">
          <p>© 2025 Srevia Herbs. All rights reserved.</p>
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

