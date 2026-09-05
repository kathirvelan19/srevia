import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminProductsPage: React.FC = () => {
  const { inStock, price, originalPrice, updateProduct } = useStore();
  
  const [currentPrice, setCurrentPrice] = useState(price);
  const [currentOriginalPrice, setCurrentOriginalPrice] = useState(originalPrice);
  const [stockAvailable, setStockAvailable] = useState(inStock);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(Number(currentPrice), Number(currentOriginalPrice), stockAvailable);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset">
      <div className="container-custom max-w-4xl space-y-8">
        
        <div className="flex items-center justify-between border-b border-[#F4F0E7] pb-6">
          <div>
            <span className="text-xs text-[#B89B5E] font-semibold uppercase tracking-[0.25em]">PRODUCT CATALOG</span>
            <h1 className="font-serif-display text-3xl font-bold text-[#1F3D2E]">
              Product & Inventory Management
            </h1>
          </div>

          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-[#F4F0E7] text-[#1F3D2E] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full border border-[#315C45]/30 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>

        {saved && (
          <div className="bg-[#315C45]/10 text-[#315C45] p-4 rounded-2xl text-xs border border-[#315C45]/30 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#315C45]" />
            <span>Product pricing and availability updated live across the website!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-[#FCFBF7] p-8 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                Selling Price (INR ₹) *
              </label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                className="w-full px-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none font-bold text-[#315C45]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                Original MRP Price (INR ₹) *
              </label>
              <input
                type="number"
                value={currentOriginalPrice}
                onChange={(e) => setCurrentOriginalPrice(Number(e.target.value))}
                className="w-full px-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none font-bold text-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                Stock Availability *
              </label>
              <select
                value={stockAvailable ? 'in_stock' : 'out_of_stock'}
                onChange={(e) => setStockAvailable(e.target.value === 'in_stock')}
                className="w-full px-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none font-bold"
              >
                <option value="in_stock">In Stock (Available for Purchase)</option>
                <option value="out_of_stock">Out of Stock (Unavailable)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F4F0E7]">
            <button
              type="submit"
              className="bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#B89B5E]" />
              <span>Save Product Updates</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
