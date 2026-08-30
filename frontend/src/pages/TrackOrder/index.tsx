import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Search, ShieldCheck, AlertCircle } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { api } from '../../services/api';
import type { Order } from '../../types';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { orderId: pathOrderId } = useParams<{ orderId?: string }>();

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
  }, [searchParams, pathOrderId]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      setErrorMsg('Please enter an Order ID.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setTrackedOrder(null);

    const result = await api.trackOrder(orderIdInput.trim(), phoneInput.trim());
    setLoading(false);

    if (result) {
      setTrackedOrder(result);
    } else {
      setErrorMsg('No order found matching this Order ID and Phone Number. Please double check your details.');
    }
  };

  const getStepStatus = (stepName: string, currentStatus: string) => {
    const orderSteps = [
      'PAYMENT_PENDING',
      'PAYMENT_SUBMITTED',
      'CONFIRMED',
      'PROCESSING',
      'PACKED',
      'SHIPPED',
      'DELIVERED'
    ];

    const currentIdx = orderSteps.indexOf(currentStatus);
    const stepIdx = orderSteps.indexOf(stepName);

    if (currentIdx >= stepIdx) {
      return 'COMPLETED';
    } else if (currentIdx + 1 === stepIdx) {
      return 'IN_PROGRESS';
    } else {
      return 'PENDING';
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-28 pb-20">
      <SEO
        title="Track Order | Real-Time Status — SREVIA HERBS"
        description="Track your Srevia Herbs PUREWHITE soap order status in real time using your Order ID and mobile number."
        keywords="Track Srevia Herbs order, PUREWHITE order tracking, Srevia shipment status"
        canonicalUrl="https://sreviaherbs.com/track-order"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
            REAL-TIME ORDER STATUS
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1F3D2E]">
            Track Your Srevia Herbs Order
          </h1>
          <p className="text-xs text-[#242824]/70 font-light">
            Enter your Order ID (e.g. SRV-20260829-0001) and associated 10-digit mobile number.
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
                placeholder="e.g. SRV-20260829-0001"
                className="w-full px-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none focus:border-[#315C45]"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
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
                  ORDER {trackedOrder.orderId}
                </h2>
                <p className="text-xs text-[#242824]/60">Placed on: {new Date(trackedOrder.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="bg-[#1F3D2E] text-white px-4 py-2 rounded-2xl text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
                <span>Status: <strong className="text-[#B89B5E]">{trackedOrder.orderStatus}</strong></span>
              </div>
            </div>

            {/* Tracking Progress Timeline */}
            <div className="space-y-6">
              <h3 className="font-serif-display text-xl font-bold text-[#1F3D2E]">Order Lifecycle Progress</h3>

              <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#F4F0E7]">
                
                {/* Stage 1: Order Received */}
                <div className="relative flex items-start gap-4">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 -ml-[23px] text-white ${
                    getStepStatus('PAYMENT_SUBMITTED', trackedOrder.orderStatus) === 'COMPLETED'
                      ? 'bg-[#315C45]' : 'bg-[#A8B9A3]'
                  }`}>
                    ✓
                  </div>
                  <div>
                    <h4 className="font-serif-display font-bold text-base text-[#1F3D2E]">Order Received</h4>
                    <p className="text-xs text-[#242824]/70">Customer order created in database</p>
                  </div>
                </div>

                {/* Stage 2: Payment Verified */}
                <div className="relative flex items-start gap-4">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 -ml-[23px] text-white ${
                    getStepStatus('CONFIRMED', trackedOrder.orderStatus) === 'COMPLETED'
                      ? 'bg-[#315C45]' : 'bg-[#A8B9A3]'
                  }`}>
                    ✓
                  </div>
                  <div>
                    <h4 className="font-serif-display font-bold text-base text-[#1F3D2E]">Payment Verified</h4>
                    <p className="text-xs text-[#242824]/70">Razorpay / UTR verification status: {trackedOrder.payment.status}</p>
                  </div>
                </div>

                {/* Stage 3: Order Confirmed */}
                <div className="relative flex items-start gap-4">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 -ml-[23px] text-white ${
                    getStepStatus('CONFIRMED', trackedOrder.orderStatus) === 'COMPLETED'
                      ? 'bg-[#315C45]' : 'bg-[#A8B9A3]'
                  }`}>
                    ✓
                  </div>
                  <div>
                    <h4 className="font-serif-display font-bold text-base text-[#1F3D2E]">Order Confirmed</h4>
                    <p className="text-xs text-[#242824]/70">Logged to Google Sheets dispatch schedule</p>
                  </div>
                </div>

                {/* Stage 4: Processing & Packed */}
                <div className="relative flex items-start gap-4">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 -ml-[23px] text-white ${
                    getStepStatus('PACKED', trackedOrder.orderStatus) === 'COMPLETED'
                      ? 'bg-[#315C45]' : 'bg-[#A8B9A3]'
                  }`}>
                    ✓
                  </div>
                  <div>
                    <h4 className="font-serif-display font-bold text-base text-[#1F3D2E]">Processing & Packed</h4>
                    <p className="text-xs text-[#242824]/70">Herbal batch selected and securely packaged</p>
                  </div>
                </div>

                {/* Stage 5: Shipped & Delivered */}
                <div className="relative flex items-start gap-4">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 -ml-[23px] text-white ${
                    getStepStatus('DELIVERED', trackedOrder.orderStatus) === 'COMPLETED'
                      ? 'bg-[#315C45]' : 'bg-[#A8B9A3]'
                  }`}>
                    ✓
                  </div>
                  <div>
                    <h4 className="font-serif-display font-bold text-base text-[#1F3D2E]">Shipped & Delivered</h4>
                    <p className="text-xs text-[#242824]/70">Out for delivery to address: {trackedOrder.customer.address.city}, {trackedOrder.customer.address.pincode}</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
