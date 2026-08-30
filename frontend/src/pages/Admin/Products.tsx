import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { DEFAULT_PRODUCT } from '../../services/api';

export const AdminProductsPage: React.FC = () => {
  const [product, setProduct] = useState(DEFAULT_PRODUCT);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
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
          <div className="bg-[#315C45]/10 text-[#315C45] p-4 rounded-2xl text-xs border border-[#315C45]/30 font-semibold">
            ✓ Product details and stock level updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="bg-[#FCFBF7] p-8 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                Price (INR ₹) *
              </label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none font-bold text-[#315C45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                Stock Quantity *
              </label>
              <input
                type="number"
                value={product.stockQuantity}
                onChange={(e) => setProduct({ ...product, stockQuantity: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                Status
              </label>
              <select
                value={product.active ? 'active' : 'inactive'}
                onChange={(e) => setProduct({ ...product, active: e.target.value === 'active' })}
                className="w-full px-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none"
              >
                <option value="active">Active (Available for order)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
              Product Description *
            </label>
            <textarea
              rows={4}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full px-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#F4F0E7] flex justify-end">
            <button
              type="submit"
              className="bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-full shadow-herbal flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#B89B5E]" />
              <span>SAVE CHANGES</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
