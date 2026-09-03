import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, CheckCircle2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck, Truck, RefreshCw, XCircle } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { DEFAULT_PRODUCT } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import heroImg from '../../assets/srevia_hero_soap.jpg';
import barImg from '../../assets/purewhite_soap_bar.jpg';

export const ProductPage: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();
  const { inStock, price, originalPrice } = useStore();
  const navigate = useNavigate();

  const activeProduct = {
    ...DEFAULT_PRODUCT,
    price,
    originalPrice,
    stockQuantity: inStock ? 100 : 0,
    active: inStock,
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(activeProduct, quantity);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(activeProduct, quantity);
  };

  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-28 pb-20">
      <SEO
        title={`PUREWHITE Herbal Anti-Pimple Soap | SREVIA HERBS (₹${price})`}
        description={`Buy PUREWHITE Herbal Anti-Pimple Soap online for ₹${price} (MRP ₹${originalPrice}). Clinically proven to reduce acne by up to 95% in just 4 weeks. Handcrafted with 100% natural ingredients.`}
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
            <div className="rounded-3xl overflow-hidden bg-[#F4F0E7] p-4 border border-[#A8B9A3]/30 shadow-herbal relative">
              {!inStock && (
                <div className="absolute top-6 left-6 z-10 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Out of Stock (Unavailable)</span>
                </div>
              )}
              <img
                src={heroImg}
                alt="PUREWHITE Herbal Soap"
                className={`w-full h-auto object-cover rounded-2xl ${!inStock ? 'opacity-65 grayscale-[30%]' : ''}`}
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
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#B89B5E] bg-[#1F3D2E] px-3.5 py-1 rounded-full shadow-sm">
                Best Seller — 15+ Happy Customers
              </span>
              <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#1F3D2E]">
                Where Purity Meets Beauty
              </h1>
              <p className="text-sm font-semibold text-[#315C45]">
                PUREWHITE Herbal Anti-Pimple Soap
              </p>
              
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif-display text-3xl font-extrabold text-[#315C45]">₹{price}</span>
                  {originalPrice > price && (
                    <span className="text-base text-gray-400 line-through">₹{originalPrice}</span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-[#315C45] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>
                
                {inStock ? (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                  </span>
                ) : (
                  <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Out of Stock
                  </span>
                )}
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
                  <button
                    disabled={!inStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 hover:text-[#315C45] disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm text-[#1F3D2E] w-6 text-center">{quantity}</span>
                  <button
                    disabled={!inStock}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 hover:text-[#315C45] disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm py-2 px-4 bg-[#FCFBF7] rounded-xl border border-[#F4F0E7]">
                <span className="text-xs text-[#242824]/70 font-medium">Subtotal</span>
                <span className="font-bold text-lg text-[#1F3D2E]">₹{quantity * price}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  disabled={!inStock}
                  onClick={handleAddToCart}
                  className={`w-full font-semibold text-xs uppercase tracking-wider py-4 rounded-full transition-colors flex items-center justify-center gap-2 ${
                    inStock
                      ? 'bg-[#F4F0E7] hover:bg-[#A8B9A3]/30 text-[#1F3D2E] border border-[#315C45]/40'
                      : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#B89B5E]" />
                  <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>

                <button
                  disabled={!inStock}
                  onClick={handleBuyNow}
                  className={`w-full font-semibold text-xs uppercase tracking-wider py-4 rounded-full transition-all flex items-center justify-center gap-2 ${
                    inStock
                      ? 'bg-[#1F3D2E] hover:bg-[#315C45] text-white shadow-herbal'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>{inStock ? 'BUY NOW' : 'UNAVAILABLE'}</span>
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
                <p className="text-[11px] font-medium text-[#1F3D2E]">100% Ayurvedic Formula</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
