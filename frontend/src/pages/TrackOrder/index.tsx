import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Search, ShieldCheck, AlertCircle, Truck, CheckCircle2, Clock, PackageCheck, MapPin, Box, RefreshCw, XCircle, RotateCcw } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import type { Order, OrderStatus } from '../../types';

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

  // Real-time simultaneous update listener for active tracked order
  useEffect(() => {
    if (trackedOrder) {
      const live = orders.find((o) => o.orderId.toUpperCase() === trackedOrder.orderId.toUpperCase());
      if (live && live.orderStatus !== trackedOrder.orderStatus) {
        setTrackedOrder(live);
      }
    }
  }, [orders, trackedOrder]);

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

  const STAGES: { key: OrderStatus[]; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    { key: ['ORDER_PLACED', 'ORDER_RECEIVED', 'PAYMENT_SUBMITTED', 'PAYMENT_PENDING'], label: 'Order Placed', desc: 'Order details received', icon: Clock },
    { key: ['CONFIRMED'], label: 'Confirmed', desc: 'Payment verified', icon: ShieldCheck },
    { key: ['PROCESSING'], label: 'Processing', desc: 'Herbal batch in production', icon: RefreshCw },
    { key: ['PACKED'], label: 'Packed', desc: 'Sealed & courier labeled', icon: Box },
    { key: ['SHIPPED', 'SHIPPING'], label: 'Shipped', desc: 'Handed to courier partner', icon: Truck },
    { key: ['OUT_FOR_DELIVERY'], label: 'Out for Delivery', desc: 'Out with delivery executive', icon: MapPin },
    { key: ['DELIVERED'], label: 'Delivered', desc: 'Package handed to customer', icon: PackageCheck },
  ];

  const getStageStepIndex = (status?: string): number => {
    if (!status) return 0;
    const s = status.toUpperCase();
    if (s === 'DELIVERED') return 6;
    if (s === 'OUT_FOR_DELIVERY') return 5;
    if (s === 'SHIPPED' || s === 'SHIPPING') return 4;
    if (s === 'PACKED') return 3;
    if (s === 'PROCESSING') return 2;
    if (s === 'CONFIRMED') return 1;
    return 0;
  };

  const isExceptionState = (status?: string) => {
    if (!status) return false;
    const s = status.toUpperCase();
    return ['CANCELLED', 'PAYMENT_FAILED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED'].includes(s);
  };

  const activeStepIdx = trackedOrder ? getStageStepIndex(trackedOrder.orderStatus) : 0;
  const isException = trackedOrder ? isExceptionState(trackedOrder.orderStatus) : false;

  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset">
      <SEO
        title="Track Order | Real-Time Order Status — SREVIA HERBS"
        description="Track your Srevia Herbs PUREWHITE soap order status in real time across 7 lifecycle stages."
        keywords="Track Srevia Herbs order, PUREWHITE order tracking, Srevia shipment status"
        canonicalUrl="https://sreviaherbs.com/track-order"
      />
      <div className="container-custom max-w-4xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
            REAL-TIME ORDER LIFECYCLE
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1F3D2E]">
            Track Your Srevia Herbs Order
          </h1>
          <p className="text-xs text-[#242824]/70 font-light">
            Enter your Order ID (e.g. SRV-20260903-1001) to view live status updates.
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
          <div className="bg-[#FCFBF7] p-6 sm:p-8 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-8 animate-fade-in">
            
            {/* Header Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4F0E7] pb-6 gap-4">
              <div>
                <span className="text-xs text-[#B89B5E] font-semibold uppercase tracking-wider">Order Reference</span>
                <h2 className="font-serif-display text-3xl font-bold text-[#1F3D2E]">
                  ORDER #{trackedOrder.orderId}
                </h2>
                <p className="text-xs text-[#242824]/60">Placed on: {new Date(trackedOrder.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="bg-[#1F3D2E] text-white px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md">
                <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
                <span>Current Status: <strong className="text-[#B89B5E] uppercase">{trackedOrder.orderStatus.replace('_', ' ')}</strong></span>
              </div>
            </div>

            {/* Exception State Alert Banner */}
            {isException && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-5 rounded-2xl space-y-2 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  {trackedOrder.orderStatus === 'CANCELLED' && <XCircle className="w-5 h-5 text-red-600" />}
                  {trackedOrder.orderStatus === 'PAYMENT_FAILED' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {trackedOrder.orderStatus === 'RETURN_REQUESTED' && <RotateCcw className="w-5 h-5 text-amber-700" />}
                  {trackedOrder.orderStatus === 'RETURNED' && <RotateCcw className="w-5 h-5 text-amber-700" />}
                  {trackedOrder.orderStatus === 'REFUNDED' && <CheckCircle2 className="w-5 h-5 text-emerald-700" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1F3D2E] uppercase tracking-wider">
                    Status: {trackedOrder.orderStatus.replace('_', ' ')}
                  </h4>
                  <p className="text-xs opacity-90 leading-relaxed mt-0.5">
                    {trackedOrder.orderStatus === 'CANCELLED' && 'This order has been cancelled. If you have questions, contact Kathirvelan (+91 9025132739).'}
                    {trackedOrder.orderStatus === 'PAYMENT_FAILED' && 'Payment verification failed. Please try placing a new order or reach out for assistance.'}
                    {trackedOrder.orderStatus === 'RETURN_REQUESTED' && 'Return request received. Our team will contact you for pickup & inspection.'}
                    {trackedOrder.orderStatus === 'RETURNED' && 'Returned item received at facility.'}
                    {trackedOrder.orderStatus === 'REFUNDED' && 'Payment has been refunded back to your original payment method.'}
                  </p>
                </div>
              </div>
            )}

            {/* 7-STAGE LINEAR TIMELINE */}
            {!isException && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-display text-xl font-bold text-[#1F3D2E]">Live 7-Stage Order Lifecycle</h3>
                  <span className="text-xs font-semibold text-[#315C45] bg-[#315C45]/10 px-3 py-1 rounded-full">
                    Step {activeStepIdx + 1} of 7
                  </span>
                </div>

                {/* Desktop 7-Stage Progress Bar */}
                <div className="hidden lg:grid grid-cols-7 gap-2 relative pt-2">
                  {STAGES.map((stage, idx) => {
                    const isPassed = idx <= activeStepIdx;
                    const isCurrent = idx === activeStepIdx;
                    const IconComponent = stage.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center text-center space-y-2 relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-[#1F3D2E] text-[#B89B5E] shadow-lg ring-4 ring-[#B89B5E]/30 scale-110'
                              : isPassed
                              ? 'bg-[#315C45] text-white'
                              : 'bg-[#F4F0E7] text-gray-400 border border-[#A8B9A3]/30'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className={`text-[11px] font-bold tracking-tight ${isPassed ? 'text-[#1F3D2E]' : 'text-gray-400'}`}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile / Tablet Vertical Timeline Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {STAGES.map((stage, idx) => {
                    const isPassed = idx <= activeStepIdx;
                    const isCurrent = idx === activeStepIdx;
                    const IconComponent = stage.icon;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-[#1F3D2E] text-white shadow-herbal border-[#B89B5E]'
                            : isPassed
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                            : 'bg-gray-50/60 border-gray-200 text-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-[#B89B5E] text-[#1F3D2E]'
                              : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-75">STAGE {idx + 1}</span>
                            <h4 className="font-bold text-xs">{stage.label}</h4>
                            <p className="text-[11px] opacity-80 mt-0.5">{stage.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* Customer Details Summary */}
            <div className="pt-6 border-t border-[#F4F0E7] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#242824]/85">
              <div className="bg-[#F4F0E7]/40 p-4 rounded-2xl space-y-1">
                <h4 className="font-bold text-[#1F3D2E] uppercase tracking-wider text-[11px]">Delivery Address</h4>
                <p className="font-semibold text-sm text-[#1F3D2E]">{trackedOrder.customer.name}</p>
                <p>{trackedOrder.customer.address.house}, {trackedOrder.customer.address.street}</p>
                <p>{trackedOrder.customer.address.city}, {trackedOrder.customer.address.state} — {trackedOrder.customer.address.pincode}</p>
                <p className="font-semibold text-[#315C45] pt-1">Phone: {trackedOrder.customer.phone}</p>
              </div>

              <div className="bg-[#F4F0E7]/40 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-[#1F3D2E] uppercase tracking-wider text-[11px]">Order Payment Details</h4>
                <div className="flex justify-between border-b border-[#A8B9A3]/20 pb-1">
                  <span>Method:</span>
                  <span className="font-bold text-[#1F3D2E]">{trackedOrder.payment.method}</span>
                </div>
                <div className="flex justify-between border-b border-[#A8B9A3]/20 pb-1">
                  <span>Payment Status:</span>
                  <span className="font-bold text-emerald-800 uppercase">{trackedOrder.payment.status}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-[#1F3D2E]">Total Amount:</span>
                  <span className="font-extrabold text-base text-[#1F3D2E]">₹{trackedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
