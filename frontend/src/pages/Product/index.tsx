import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, CheckCircle2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { DEFAULT_PRODUCT } from '../../services/api';
import { useCart } from '../../context/CartContext';
import heroImg from '../../assets/srevia_hero_soap.jpg';
import barImg from '../../assets/purewhite_soap_bar.jpg';

export const ProductPage: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<'benefits' | 'ingredients' | 'howToUse'>('benefits');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(DEFAULT_PRODUCT, quantity);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(DEFAULT_PRODUCT, quantity);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-28 pb-20">
      <SEO
        title="PUREWHITE Herbal Anti-Pimple Soap | SREVIA HERBS (₹149)"
        description="Buy PUREWHITE Herbal Anti-Pimple Soap online. Handcrafted with pure Neem, Holy Basil Tulsi, and Virgin Coconut Oil for clear, acne-free, radiant skin. Free delivery across India."
        keywords="PUREWHITE soap, buy herbal anti pimple soap, Srevia Herbs product, Neem Tulsi soap online, acne removal soap India"
        canonicalUrl="https://sreviaherbs.com/product"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-[#242824]/60 mb-8 flex items-center gap-2">
          <span>Home</span>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="text-[#1F3D2E] font-semibold">PUREWHITE Soap</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Product Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl overflow-hidden bg-[#F4F0E7] p-4 border border-[#A8B9A3]/30 shadow-herbal">
              <img
                src={heroImg}
                alt="PUREWHITE Herbal Soap"
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden bg-[#F4F0E7] p-2 border border-[#A8B9A3]/20">
                <img src={barImg} alt="PUREWHITE Soap Bar Close Up" className="w-full h-36 object-cover rounded-xl" />
              </div>
              <div className="rounded-2xl bg-[#1F3D2E] text-[#FCFBF7] p-4 flex flex-col justify-center items-center text-center">
                <Leaf className="w-8 h-8 text-[#B89B5E] mb-2" />
                <p className="font-serif-display text-lg font-bold">100g Bar</p>
                <p className="text-[11px] text-[#A8B9A3]">Handcrafted Herbal Batch</p>
              </div>
            </div>
          </div>

          {/* Right Product Details */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2 border-b border-[#F4F0E7] pb-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
                SREVIA HERBS SIGNATURE
              </span>
              <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#1F3D2E]">
                PUREWHITE Herbal Anti-Pimple Soap
              </h1>
              
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif-display text-3xl font-bold text-[#315C45]">₹149</span>
                  <span className="text-xs text-[#242824]/60">(Inclusive of all taxes)</span>
                </div>
                <span className="bg-[#315C45]/10 text-[#315C45] text-xs font-bold px-3 py-1 rounded-full border border-[#315C45]/20">
                  In Stock
                </span>
              </div>
            </div>

            <p className="text-sm text-[#242824]/80 leading-relaxed font-light">
              {DEFAULT_PRODUCT.description}
            </p>

            {/* Quantity Calculator */}
            <div className="bg-[#F4F0E7]/60 p-6 rounded-2xl border border-[#A8B9A3]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1F3D2E]">Quantity</span>
                <div className="flex items-center gap-3 bg-[#FCFBF7] px-4 py-2 rounded-full border border-[#A8B9A3]/40">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-1 hover:text-[#315C45]">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm text-[#1F3D2E] w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="p-1 hover:text-[#315C45]">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm py-2 px-4 bg-[#FCFBF7] rounded-xl border border-[#F4F0E7]">
                <span className="text-xs text-[#242824]/70 font-medium">Subtotal</span>
                <span className="font-bold text-lg text-[#1F3D2E]">₹{quantity * 149}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#F4F0E7] hover:bg-[#A8B9A3]/30 text-[#1F3D2E] border border-[#315C45]/40 font-semibold text-xs uppercase tracking-wider py-4 rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#B89B5E]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#1F3D2E] hover:bg-[#315C45] text-white font-semibold text-xs uppercase tracking-wider py-4 rounded-full shadow-herbal transition-all flex items-center justify-center gap-2"
                >
                  <span>BUY NOW</span>
                  <ArrowRight className="w-4 h-4 text-[#B89B5E]" />
                </button>
              </div>
            </div>

            {/* Delivery & Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 text-center py-4 border-y border-[#F4F0E7]">
              <div className="space-y-1">
                <Truck className="w-5 h-5 mx-auto text-[#B89B5E]" />
                <p className="text-[11px] font-medium text-[#1F3D2E]">Pan-India Shipping</p>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-5 h-5 mx-auto text-[#B89B5E]" />
                <p className="text-[11px] font-medium text-[#1F3D2E]">Razorpay / UPI Secure</p>
              </div>
              <div className="space-y-1">
                <RefreshCw className="w-5 h-5 mx-auto text-[#B89B5E]" />
                <p className="text-[11px] font-medium text-[#1F3D2E]">Fresh Handcrafted</p>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="pt-4 space-y-4">
              <div className="flex border-b border-[#F4F0E7] gap-8">
                <button
                  onClick={() => setSelectedTab('benefits')}
                  className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                    selectedTab === 'benefits' ? 'text-[#1F3D2E]' : 'text-[#242824]/50'
                  }`}
                >
                  Benefits
                  {selectedTab === 'benefits' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B89B5E]" />}
                </button>

                <button
                  onClick={() => setSelectedTab('ingredients')}
                  className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                    selectedTab === 'ingredients' ? 'text-[#1F3D2E]' : 'text-[#242824]/50'
                  }`}
                >
                  Key Ingredients
                  {selectedTab === 'ingredients' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B89B5E]" />}
                </button>

                <button
                  onClick={() => setSelectedTab('howToUse')}
                  className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                    selectedTab === 'howToUse' ? 'text-[#1F3D2E]' : 'text-[#242824]/50'
                  }`}
                >
                  How to Use
                  {selectedTab === 'howToUse' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B89B5E]" />}
                </button>
              </div>

              {selectedTab === 'benefits' && (
                <div className="space-y-3 animate-fade-in">
                  {DEFAULT_PRODUCT.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#242824]/80">
                      <CheckCircle2 className="w-4 h-4 text-[#315C45] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'ingredients' && (
                <div className="space-y-3 animate-fade-in">
                  {DEFAULT_PRODUCT.ingredients.map((ing, i) => (
                    <div key={i} className="bg-[#F4F0E7]/60 p-3 rounded-xl">
                      <p className="font-serif-display font-bold text-sm text-[#1F3D2E]">{ing.name}</p>
                      <p className="text-[11px] text-[#242824]/70 mt-0.5">{ing.skincareRole}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'howToUse' && (
                <div className="text-xs text-[#242824]/80 space-y-2 leading-relaxed animate-fade-in">
                  <p>1. Wet your face and body with lukewarm water.</p>
                  <p>2. Work PUREWHITE soap between hands to form a rich, creamy lather.</p>
                  <p>3. Gently massage onto skin for 30–60 seconds, paying attention to oily areas.</p>
                  <p>4. Rinse thoroughly with water and pat dry.</p>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
