import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle2, RefreshCw, LogOut, ShieldCheck, Tag, X, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import type { Stage3Status } from '../../context/StoreContext';

export const AdminDashboardPage: React.FC = () => {
  const { currentUser, isAdmin, logout, signInWithGoogle } = useAuth();
  const { inStock, setInStock, price, originalPrice, updateProduct, orders, updateOrderStatus, refreshOrders } = useStore();
  const navigate = useNavigate();

  const [editingPrice, setEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(price);
  const [newOriginalPrice, setNewOriginalPrice] = useState(originalPrice);

  useEffect(() => {
    if (!isAdmin) {
      if (!currentUser) {
        // Will prompt Google login or redirect
      }
    }
  }, [isAdmin, currentUser]);

  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] pt-32 pb-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal text-center space-y-6">
          <div className="w-16 h-16 bg-[#1F3D2E] text-[#B89B5E] rounded-full flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-serif-display font-bold text-[#1F3D2E]">Kathirvelan Admin Portal</h1>
            <p className="text-xs text-[#242824]/70 mt-1">Please sign in with Google using <strong className="text-[#1F3D2E]">kathirvelankvr@gmail.com</strong> to access store management.</p>
          </div>

          <button
            onClick={async () => {
              try {
                const userRole = await signInWithGoogle();
                if (userRole === 'ADMIN') {
                  navigate('/admin/dashboard');
                } else {
                  alert("Signed in as " + (currentUser?.email || 'User') + ". Only kathirvelankvr@gmail.com has Admin privileges.");
                  navigate('/profile');
                }
              } catch (e) {
                console.error("Admin sign in failed:", e);
              }
            }}
            className="w-full bg-[#1F3D2E] hover:bg-[#315C45] text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-full shadow-herbal transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign In as Kathirvelan</span>
          </button>
        </div>
      </div>
    );
  }

  const handleSavePrice = () => {
    updateProduct(Number(newPrice), Number(newOriginalPrice), inStock);
    setEditingPrice(false);
  };

  const totalOrders = orders.length;
  const orderReceivedCount = orders.filter((o) => !o.orderStatus || (o.orderStatus as string) === 'ORDER_RECEIVED' || o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PAYMENT_SUBMITTED').length;
  const shippingCount = orders.filter((o) => (o.orderStatus as string) === 'SHIPPING' || o.orderStatus === 'SHIPPED' || o.orderStatus === 'PROCESSING').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset">
      <div className="container-custom space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4F0E7] pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#B89B5E] font-bold uppercase tracking-[0.25em]">ADMIN DASHBOARD</span>
              <span className="bg-[#B89B5E] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                kathirvelankvr@gmail.com
              </span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1F3D2E]">
              Srevia Herbs Control Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshOrders()}
              className="bg-[#F4F0E7] hover:bg-[#A8B9A3]/30 text-[#1F3D2E] text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full border border-[#315C45]/30 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Orders</span>
            </button>

            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="bg-[#F4F0E7] hover:bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full border border-red-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 1. PRODUCT AVAILABILITY & PRICE CONTROLLER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A8B9A3]/30 shadow-herbal space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4F0E7] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B89B5E]">LIVE PRODUCT CONTROL</span>
              <h2 className="text-xl font-bold text-[#1F3D2E]">PUREWHITE Herbal Anti-Pimple Soap Status</h2>
            </div>
            
            {/* Live Availability Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#242824]">Availability Status:</span>
              <button
                onClick={() => setInStock(!inStock)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm ${
                  inStock
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {inStock ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>In Stock (Available Now)</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span>Out of Stock (Unavailable)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pricing Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="bg-[#FCFBF7] p-5 rounded-2xl border border-[#F4F0E7] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B9A3]">Current Selling Price</span>
              <div className="text-3xl font-extrabold text-[#1F3D2E]">₹{price}</div>
              <p className="text-[11px] text-[#242824]/60">Reflected live on store & checkout</p>
            </div>

            <div className="bg-[#FCFBF7] p-5 rounded-2xl border border-[#F4F0E7] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B9A3]">Original MRP Price</span>
              <div className="text-3xl font-extrabold text-[#242824]/50 line-through">₹{originalPrice}</div>
              <p className="text-[11px] text-[#242824]/60">Showing Save {Math.round(((originalPrice - price) / originalPrice) * 100)}% discount</p>
            </div>

            <div className="bg-[#F4F0E7]/60 p-5 rounded-2xl border border-[#315C45]/20 flex flex-col justify-center gap-3">
              {editingPrice ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1F3D2E]">Selling ₹</label>
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-full bg-white border border-[#315C45]/40 rounded-xl px-3 py-1.5 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1F3D2E]">Original ₹</label>
                      <input
                        type="number"
                        value={newOriginalPrice}
                        onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                        className="w-full bg-white border border-[#315C45]/40 rounded-xl px-3 py-1.5 text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSavePrice}
                      className="flex-1 bg-[#1F3D2E] text-white text-xs font-bold py-2 rounded-xl"
                    >
                      Save Price
                    </button>
                    <button
                      onClick={() => setEditingPrice(false)}
                      className="px-3 bg-gray-200 text-gray-700 text-xs font-bold py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-[#1F3D2E]">Update product price live across the store</p>
                  <button
                    onClick={() => {
                      setNewPrice(price);
                      setNewOriginalPrice(originalPrice);
                      setEditingPrice(true);
                    }}
                    className="bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Tag className="w-4 h-4 text-[#B89B5E]" />
                    <span>Edit Price & Discount</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F4F0E7] text-[#1F3D2E] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#315C45]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#A8B9A3]">Total Orders</p>
              <h3 className="text-2xl font-bold text-[#1F3D2E]">{totalOrders}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#A8B9A3]">1. Order Received</p>
              <h3 className="text-2xl font-bold text-amber-800">{orderReceivedCount}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#A8B9A3]">2. Shipping</p>
              <h3 className="text-2xl font-bold text-blue-800">{shippingCount}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#A8B9A3]">3. Delivered</p>
              <h3 className="text-2xl font-bold text-emerald-800">{deliveredCount}</h3>
            </div>
          </div>
        </div>

        {/* 2. 3-STAGE ORDER TRACKING CONTROLLER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A8B9A3]/30 shadow-herbal space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4F0E7] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B89B5E]">3-STAGE TRACKING CONTROLLER</span>
              <h2 className="text-xl font-bold text-[#1F3D2E]">Customer Orders & Live Stage Status ({orders.length})</h2>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#242824]/60">
              No orders placed yet. Orders will appear here automatically.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => {
                const currentStage: Stage3Status =
                  o.orderStatus === 'DELIVERED'
                    ? 'DELIVERED'
                    : (o.orderStatus as string) === 'SHIPPING' || o.orderStatus === 'SHIPPED'
                    ? 'SHIPPING'
                    : 'ORDER_RECEIVED';

                return (
                  <div key={o.orderId} className="border border-[#F4F0E7] rounded-2xl p-5 hover:border-[#315C45]/40 transition-colors space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1F3D2E] text-base">#{o.orderId}</span>
                          <span className="text-xs text-[#242824]/60">• {o.customer.name} ({o.customer.phone})</span>
                        </div>
                        <p className="text-xs text-[#242824]/70 mt-0.5">
                          Amount: <strong className="text-[#1F3D2E]">₹{o.totalAmount}</strong> | Address: {o.customer.address.city}, {o.customer.address.state}
                        </p>
                      </div>

                      {/* 3-Stage Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-[#242824]/70 mr-1">Admin Set Stage:</span>
                        
                        {/* Stage 1: Order Received */}
                        <button
                          onClick={() => updateOrderStatus(o.orderId, 'ORDER_RECEIVED')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            currentStage === 'ORDER_RECEIVED'
                              ? 'bg-amber-600 text-white shadow-md'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          1. Order Received
                        </button>

                        {/* Stage 2: Shipping */}
                        <button
                          onClick={() => updateOrderStatus(o.orderId, 'SHIPPING')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            currentStage === 'SHIPPING'
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                          }`}
                        >
                          2. Shipping
                        </button>

                        {/* Stage 3: Delivered */}
                        <button
                          onClick={() => updateOrderStatus(o.orderId, 'DELIVERED')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            currentStage === 'DELIVERED'
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          3. Delivered
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
