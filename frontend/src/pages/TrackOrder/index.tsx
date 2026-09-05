import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Search, ShieldCheck, AlertCircle, Truck, CheckCircle2, Clock } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import type { Stage3Status } from '../../context/StoreContext';
import type { Order } from '../../types';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { orderId: pathOrderId } = useParams<{ orderId?: string }>();
  const { orders } = useStore();

  const [orderIdInput, setOrderIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const rawOrderId = pathOrderId || searchParams.get('orderId');
    if (rawOrderId && rawOrderId.trim()) {
      const cleanOrderId = rawOrderId.trim().toUpperCase();
      setOrderIdInput(cleanOrderId);
      
      setLoading(true);
      setErrorMsg(null);
      
      // Look in StoreContext first
      const localFound = orders.find((o) => o.orderId.toUpperCase() === cleanOrderId);
      if (localFound) {
        setLoading(false);
        setTrackedOrder(localFound);
        if (localFound.customer?.phone) setPhoneInput(localFound.customer.phone);
        return;
      }

      api.trackOrder(cleanOrderId, '').then((result) => {
        setLoading(false);
        if (result) {
          setTrackedOrder(result);
          if (result.customer && result.customer.phone) {
            setPhoneInput(result.customer.phone);
          }
        } else {
          setErrorMsg(`Order #${cleanOrderId} was not found. Please double check your order ID.`);
        }
      });
    }
  }, [searchParams, pathOrderId, orders]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      setErrorMsg('Please enter an Order ID.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setTrackedOrder(null);

    const cleanId = orderIdInput.trim().toUpperCase();
    const localFound = orders.find(
      (o) => o.orderId.toUpperCase() === cleanId && (!phoneInput || o.customer.phone.includes(phoneInput.slice(-4)))
    );

    if (localFound) {
      setLoading(false);
      setTrackedOrder(localFound);
      return;
    }

    const result = await api.trackOrder(cleanId, phoneInput.trim());
    setLoading(false);

    if (result) {
      setTrackedOrder(result);
    } else {
      setErrorMsg('No order found matching this Order ID and Phone Number. Please double check your details.');
    }
  };

  const getStageState = (stageName: Stage3Status, currentStatus: string) => {
    const isDelivered = currentStatus === 'DELIVERED';
    const isShipping = currentStatus === 'SHIPPING' || currentStatus === 'SHIPPED';

    if (stageName === 'ORDER_RECEIVED') {
      return isShipping || isDelivered ? 'COMPLETED' : 'IN_PROGRESS';
    }
    if (stageName === 'SHIPPING') {
      if (isDelivered) return 'COMPLETED';
      if (isShipping) return 'IN_PROGRESS';
      return 'PENDING';
    }
    if (stageName === 'DELIVERED') {
      if (isDelivered) return 'COMPLETED';
      return 'PENDING';
    }
    return 'PENDING';
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset">
      <SEO
        title="Track Order | Real-Time 3-Stage Status — SREVIA HERBS"
        description="Track your Srevia Herbs PUREWHITE soap order status in real time across 3 stages: Order Received, Shipping, and Delivered."
        keywords="Track Srevia Herbs order, PUREWHITE order tracking, Srevia shipment status"
        canonicalUrl="https://sreviaherbs.com/track-order"
      />
      <div className="container-custom max-w-4xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
            REAL-TIME ORDER STATUS
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1F3D2E]">
            Track Your Srevia Herbs Order
          </h1>
          <p className="text-xs text-[#242824]/70 font-light">
            Enter your Order ID (e.g. SRV-20260903-1001) to view real-time admin tracking.
          </p>
        </div>

        {/* Track Form Box */}
        <div className="bg-[#FCFBF7] p-6 sm:p-8 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal mb-10">
          
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs flex items-center gap-3 mb-6 border border-red-200">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                Order ID *
              </label>
              <input
                type="text"
                required
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
                placeholder="e.g. SRV-20260903-1001"
                className="w-full px-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none focus:border-[#315C45]"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                maxLength={10}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none focus:border-[#315C45]"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold uppercase tracking-widest py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-[#B89B5E]" />
                <span>{loading ? 'Searching...' : 'TRACK'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Tracked Order Result Details */}
        {trackedOrder && (
          <div className="bg-[#FCFBF7] p-8 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-8 animate-fade-in">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4F0E7] pb-6 gap-4">
              <div>
                <span className="text-xs text-[#B89B5E] font-semibold uppercase tracking-wider">Tracking Reference</span>
                <h2 className="font-serif-display text-3xl font-bold text-[#1F3D2E]">
                  ORDER #{trackedOrder.orderId}
                </h2>
                <p className="text-xs text-[#242824]/60">Placed on: {new Date(trackedOrder.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="bg-[#1F3D2E] text-white px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md">
                <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
                <span>Current Stage: <strong className="text-[#B89B5E] uppercase">{trackedOrder.orderStatus}</strong></span>
              </div>
            </div>

            {/* 3-STAGE ORDER TRACKING PROGRESS */}
            <div className="space-y-6">
              <h3 className="font-serif-display text-xl font-bold text-[#1F3D2E]">Live Order Stages (Admin Controlled)</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Stage 1: Order Received */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  getStageState('ORDER_RECEIVED', trackedOrder.orderStatus) === 'COMPLETED'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Clock className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">STAGE 1</span>
                      <h4 className="font-bold text-sm">Order Received</h4>
                    </div>
                  </div>
                  <p className="text-xs opacity-80">Order & payment details received by Kathirvelan.</p>
                </div>

                {/* Stage 2: Shipping */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  getStageState('SHIPPING', trackedOrder.orderStatus) === 'COMPLETED'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : getStageState('SHIPPING', trackedOrder.orderStatus) === 'IN_PROGRESS'
                    ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Truck className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">STAGE 2</span>
                      <h4 className="font-bold text-sm">Shipping</h4>
                    </div>
                  </div>
                  <p className="text-xs opacity-80">Herbal batch packed & out for shipping with courier partner.</p>
                </div>

                {/* Stage 3: Delivered */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  getStageState('DELIVERED', trackedOrder.orderStatus) === 'COMPLETED'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">STAGE 3</span>
                      <h4 className="font-bold text-sm">Delivered</h4>
                    </div>
                  </div>
                  <p className="text-xs opacity-80">PUREWHITE Soap delivered to customer address.</p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
