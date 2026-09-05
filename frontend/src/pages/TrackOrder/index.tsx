import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Search, ShieldCheck, AlertCircle, Truck, Package, RotateCcw, XCircle } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { api } from '../../services/api';
import { orderService } from '../../services/orderService';
import { useStore } from '../../context/StoreContext';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
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

  // Modal State for Cancel/Return
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    setActionMessage(null);

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

  const handleCancelOrder = async () => {
    if (!trackedOrder || !cancelReason.trim()) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await orderService.cancelOrder(trackedOrder.orderId, cancelReason.trim());
      if (res.success) {
        if (res.order) setTrackedOrder(res.order);
        else setTrackedOrder((prev) => prev ? { ...prev, orderStatus: 'CANCELLED' } : null);
        setShowCancelModal(false);
        setCancelReason('');
        setActionMessage({ type: 'success', text: 'Order has been successfully cancelled.' });
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Failed to cancel order.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Failed to cancel order.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnOrder = async () => {
    if (!trackedOrder || !returnReason.trim()) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await orderService.requestReturn(trackedOrder.orderId, returnReason.trim());
      if (res.success) {
        if (res.order) setTrackedOrder(res.order);
        else setTrackedOrder((prev) => prev ? { ...prev, orderStatus: 'RETURN_REQUESTED' } : null);
        setShowReturnModal(false);
        setReturnReason('');
        setActionMessage({ type: 'success', text: 'Return request submitted successfully. Our support team will reach out.' });
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Failed to submit return request.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err?.message || 'Failed to submit return request.' });
    } finally {
      setActionLoading(false);
    }
  };

  const canCancel = trackedOrder && ['PLACED', 'ORDER_PLACED', 'ORDER_RECEIVED', 'PAYMENT_SUBMITTED', 'PAYMENT_PENDING', 'CONFIRMED'].includes((trackedOrder.orderStatus || '').toUpperCase());
  const canReturn = trackedOrder && (trackedOrder.orderStatus || '').toUpperCase() === 'DELIVERED';

  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset">
      <SEO
        title="Track Order | Real-Time Order Status — SREVIA HERBS"
        description="Track your Srevia Herbs PUREWHITE soap order status in real time across the 12-state order lifecycle."
        keywords="Track Srevia Herbs order, PUREWHITE order tracking, Srevia shipment status"
        canonicalUrl="https://sreviaherbs.com/track-order"
      />
      <div className="container-custom max-w-4xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
            REAL-TIME ORDER MANAGEMENT SYSTEM
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1F3D2E]">
            Track Your Order Status
          </h1>
          <p className="text-xs text-[#242824]/70 font-light">
            Enter your Order ID (e.g. SRV-20260903-1001) to view live status & carrier updates.
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
                <p className="text-xs text-[#242824]/60">Placed on: {new Date(trackedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <OrderStatusBadge status={trackedOrder.orderStatus} className="text-sm px-4 py-2" />
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {canCancel && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-200 transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Order</span>
                    </button>
                  )}
                  {canReturn && (
                    <button
                      onClick={() => setShowReturnModal(true)}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-purple-200 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request Return</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Action Feedback Message */}
            {actionMessage && (
              <div className={`p-4 rounded-2xl text-xs flex items-center gap-3 border ${
                actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionMessage.text}</span>
              </div>
            )}

            {/* Carrier & Tracking Details Component */}
            {(trackedOrder.courier || trackedOrder.trackingNumber) && (
              <div className="bg-[#1F3D2E] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B89B5E]/20 text-[#B89B5E] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#B89B5E] tracking-widest">COURIER DISPATCH</span>
                    <p className="font-semibold text-sm">{trackedOrder.courier || 'Express Courier Partner'}</p>
                  </div>
                </div>
                {trackedOrder.trackingNumber && (
                  <div className="bg-[#315C45] px-4 py-2 rounded-xl text-xs flex items-center gap-2 border border-[#A8B9A3]/30">
                    <span className="text-[#B89B5E] font-semibold">AWB Tracking No:</span>
                    <strong className="font-mono tracking-wider text-white select-all">{trackedOrder.trackingNumber}</strong>
                  </div>
                )}
              </div>
            )}

            {/* LIVE ORDER TIMELINE */}
            <div className="space-y-4">
              <h3 className="font-serif-display text-xl font-bold text-[#1F3D2E] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#B89B5E]" />
                <span>Order Lifecycle Audit & Status Timeline</span>
              </h3>
              
              <OrderTimeline
                currentStatus={trackedOrder.orderStatus}
                history={trackedOrder.statusHistory}
              />
            </div>

            {/* Order Items & Customer Summary */}
            <div className="pt-6 border-t border-[#F4F0E7] space-y-6">
              <h4 className="font-serif-display text-lg font-bold text-[#1F3D2E]">Ordered Items & Shipping Details</h4>
              
              {/* Items List */}
              <div className="bg-[#F4F0E7]/40 rounded-2xl p-4 divide-y divide-[#A8B9A3]/20">
                {trackedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#315C45]/10 flex items-center justify-center text-[#315C45]">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1F3D2E]">{item.productName}</p>
                        <p className="text-[#242824]/60">Qty: {item.quantity} × ₹{item.unitPrice}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#1F3D2E]">₹{item.totalPrice || item.quantity * item.unitPrice}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Address & Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#242824]/85">
                <div className="bg-[#F4F0E7]/40 p-4 rounded-2xl space-y-1">
                  <h5 className="font-bold text-[#1F3D2E] uppercase tracking-wider text-[11px]">Delivery Address</h5>
                  <p className="font-semibold text-sm text-[#1F3D2E]">{trackedOrder.customer.name}</p>
                  <p>{trackedOrder.customer.address.house}, {trackedOrder.customer.address.street}</p>
                  <p>{trackedOrder.customer.address.city}, {trackedOrder.customer.address.state} — {trackedOrder.customer.address.pincode}</p>
                  <p className="font-semibold text-[#315C45] pt-1">Phone: {trackedOrder.customer.phone}</p>
                </div>

                <div className="bg-[#F4F0E7]/40 p-4 rounded-2xl space-y-2">
                  <h5 className="font-bold text-[#1F3D2E] uppercase tracking-wider text-[11px]">Payment Summary</h5>
                  <div className="flex justify-between border-b border-[#A8B9A3]/20 pb-1">
                    <span>Payment Method:</span>
                    <span className="font-bold text-[#1F3D2E]">{trackedOrder.payment.method}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#A8B9A3]/20 pb-1">
                    <span>Payment Status:</span>
                    <span className="font-bold text-emerald-800 uppercase">{trackedOrder.payment.status}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold text-[#1F3D2E]">Total Paid:</span>
                    <span className="font-extrabold text-base text-[#1F3D2E]">₹{trackedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && trackedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#A8B9A3]/30 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center gap-3 text-red-700">
              <XCircle className="w-7 h-7" />
              <h3 className="text-xl font-bold font-serif-display text-[#1F3D2E]">Cancel Order #{trackedOrder.orderId}</h3>
            </div>

            <p className="text-xs text-[#242824]/80 leading-relaxed">
              Are you sure you want to cancel this order? Please state your reason for cancellation below.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#1F3D2E] uppercase tracking-wider mb-1.5">
                Reason for Cancellation *
              </label>
              <textarea
                rows={3}
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Changed my mind / Ordered wrong item..."
                className="w-full p-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-xs focus:outline-none focus:border-[#315C45]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={actionLoading || !cancelReason.trim()}
                onClick={handleCancelOrder}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all disabled:opacity-50"
              >
                {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && trackedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#A8B9A3]/30 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center gap-3 text-purple-800">
              <RotateCcw className="w-7 h-7" />
              <h3 className="text-xl font-bold font-serif-display text-[#1F3D2E]">Request Return #{trackedOrder.orderId}</h3>
            </div>

            <p className="text-xs text-[#242824]/80 leading-relaxed">
              We're sorry the order didn't meet your expectations. Please describe the issue to initiate a return request.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#1F3D2E] uppercase tracking-wider mb-1.5">
                Reason for Return *
              </label>
              <textarea
                rows={3}
                required
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="e.g. Damaged packaging / Defective item..."
                className="w-full p-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-xs focus:outline-none focus:border-[#315C45]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || !returnReason.trim()}
                onClick={handleReturnOrder}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-700 hover:bg-purple-800 text-white shadow-md transition-all disabled:opacity-50"
              >
                {actionLoading ? 'Submitting...' : 'Submit Return Request'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
