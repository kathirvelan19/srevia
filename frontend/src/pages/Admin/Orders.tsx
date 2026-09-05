import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, CheckCircle2, XCircle, Eye, ArrowLeft, Truck } from 'lucide-react';
import { api } from '../../services/api';
import { orderService } from '../../services/orderService';
import { useStore } from '../../context/StoreContext';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
import { getAllowedNextStates, getStatusConfig } from '../../utils/orderStatus';
import type { Order, OrderStatus } from '../../types';

const COURIER_OPTIONS = [
  'Delhivery',
  'BlueDart',
  'DTDC',
  'India Post',
  'Ecom Express',
  'Shadowfax',
  'FedEx',
  'Xpressbees'
];

export const AdminOrdersPage: React.FC = () => {
  const { orders: storeOrders, updateOrderStatus: storeUpdateOrderStatus } = useStore();
  const [remoteOrders, setRemoteOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Rejection & Shipping Modals State
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  const [showShipModal, setShowShipModal] = useState(false);
  const [shipCourier, setShipCourier] = useState('Delhivery');
  const [shipTrackingNumber, setShipTrackingNumber] = useState('');
  
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem('srevia_admin_token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadOrders();
  }, [token, navigate]);

  const loadOrders = async () => {
    if (!token) return;
    const data = await api.getAdminOrders(token);
    setRemoteOrders(data);
  };

  const combinedOrders = useMemo(() => {
    const list = [...storeOrders];
    remoteOrders.forEach((ro) => {
      if (!list.some((so) => so.orderId.toUpperCase() === ro.orderId.toUpperCase())) {
        list.push(ro);
      }
    });
    return list;
  }, [storeOrders, remoteOrders]);

  useEffect(() => {
    let result = [...combinedOrders];

    if (statusFilter !== 'ALL') {
      result = result.filter((o) => o.orderStatus === statusFilter || o.payment?.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customer?.name?.toLowerCase().includes(q) ||
          o.customer?.phone?.includes(q)
      );
    }

    result.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });

    setFilteredOrders(result);
  }, [combinedOrders, statusFilter, searchQuery, sortOrder]);

  const handleVerifyPayment = async (orderId: string) => {
    if (!token) return;
    if (window.confirm(`Verify payment for Order #${orderId}?`)) {
      setActionLoading(true);
      await api.updatePaymentStatus(token, orderId, 'VERIFIED');
      await storeUpdateOrderStatus(orderId, 'CONFIRMED');
      await loadOrders();
      setActionLoading(false);
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, payment: { ...prev.payment, status: 'VERIFIED' }, orderStatus: 'CONFIRMED' } : null);
      }
    }
  };

  const handleRejectPayment = async () => {
    if (!token || !selectedOrder) return;
    setActionLoading(true);
    await api.updatePaymentStatus(token, selectedOrder.orderId, 'REJECTED', rejectionReason);
    setShowRejectModal(false);
    setRejectionReason('');
    await loadOrders();
    setActionLoading(false);
    setSelectedOrder((prev) => prev ? { ...prev, payment: { ...prev.payment, status: 'REJECTED' } } : null);
  };

  const handleExecuteTransition = async (orderId: string, newStatus: string) => {
    if (newStatus === 'SHIPPED') {
      setShipTrackingNumber('');
      setShowShipModal(true);
      return;
    }

    if (newStatus === 'CANCELLED' || newStatus === 'REFUNDED') {
      if (!window.confirm(`Are you sure you want to mark Order #${orderId} as ${newStatus}? This action will update inventory and audit history.`)) {
        return;
      }
    }

    setActionLoading(true);
    await orderService.updateOrderStatus(orderId, { status: newStatus }, token || undefined);
    await storeUpdateOrderStatus(orderId, newStatus);
    await loadOrders();
    setActionLoading(false);

    if (selectedOrder?.orderId === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, orderStatus: newStatus as OrderStatus } : null);
    }
  };

  const handleConfirmShipment = async () => {
    if (!selectedOrder) return;
    if (!shipTrackingNumber.trim()) {
      alert('Tracking number is required before marking order as Shipped.');
      return;
    }

    setActionLoading(true);
    await orderService.updateOrderStatus(selectedOrder.orderId, {
      status: 'SHIPPED',
      courier: shipCourier,
      trackingNumber: shipTrackingNumber.trim(),
      message: `Shipped via ${shipCourier} (Tracking #: ${shipTrackingNumber.trim()})`
    }, token || undefined);

    await storeUpdateOrderStatus(selectedOrder.orderId, 'SHIPPED');
    await loadOrders();
    setActionLoading(false);
    setShowShipModal(false);

    setSelectedOrder((prev) => prev ? {
      ...prev,
      orderStatus: 'SHIPPED',
      courier: shipCourier,
      trackingNumber: shipTrackingNumber.trim()
    } : null);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset">
      <div className="container-custom space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4F0E7] pb-6 gap-4">
          <div>
            <span className="text-xs text-[#B89B5E] font-semibold uppercase tracking-[0.25em]">ORDER MANAGEMENT SYSTEM</span>
            <h1 className="font-serif-display text-3xl font-bold text-[#1F3D2E]">
              Customer Orders ({filteredOrders.length})
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'NEWEST' | 'OLDEST')}
              className="bg-white border border-[#A8B9A3]/40 text-[#1F3D2E] text-xs font-bold rounded-full px-4 py-2.5 focus:outline-none"
            >
              <option value="NEWEST">Sort: Newest First</option>
              <option value="OLDEST">Sort: Oldest First</option>
            </select>

            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-[#F4F0E7] hover:bg-[#A8B9A3]/30 text-[#1F3D2E] text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full transition-colors flex items-center gap-2 border border-[#315C45]/30 self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#242824]/40 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Customer Name, or Phone..."
              className="w-full pl-10 pr-4 py-3 bg-[#FCFBF7] border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none focus:border-[#315C45]"
            />
          </div>

          <div className="sm:col-span-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <Filter className="w-4 h-4 text-[#B89B5E] shrink-0" />
            {[
              'ALL',
              'PLACED',
              'CONFIRMED',
              'PROCESSING',
              'PACKED',
              'SHIPPED',
              'OUT_FOR_DELIVERY',
              'DELIVERED',
              'CANCELLED',
              'PAYMENT_FAILED',
              'RETURN_REQUESTED',
              'RETURNED',
              'REFUNDED'
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  statusFilter === filter
                    ? 'bg-[#1F3D2E] text-white shadow-sm'
                    : 'bg-[#F4F0E7] text-[#242824]/70 hover:bg-[#A8B9A3]/30'
                }`}
              >
                {filter.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Main Orders Table / Cards View & Inspector Split Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Table / Mobile Cards */}
          <div className={`${selectedOrder ? 'lg:col-span-6' : 'lg:col-span-12'} bg-white p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal overflow-x-auto`}>
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#242824]/60">
                No orders matching current filter or search query.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#F4F0E7] text-[#242824]/60 uppercase font-semibold">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Order Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F0E7]">
                  {filteredOrders.map((o) => (
                    <tr
                      key={o.orderId}
                      className={`hover:bg-[#F4F0E7]/50 transition-colors cursor-pointer ${
                        selectedOrder?.orderId === o.orderId ? 'bg-[#F4F0E7]/80 font-medium' : ''
                      }`}
                      onClick={() => setSelectedOrder(o)}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-[#1F3D2E]">{o.orderId}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-[#1F3D2E]">{o.customer?.name}</p>
                        <p className="text-[10px] text-[#242824]/60">{o.customer?.phone}</p>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#315C45]">₹{o.totalAmount}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          o.payment?.status === 'VERIFIED' ? 'bg-[#315C45]/10 text-[#315C45]' :
                          o.payment?.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {o.payment?.status || 'SUBMITTED'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <OrderStatusBadge status={o.orderStatus} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}
                          className="p-1.5 bg-[#F4F0E7] text-[#1F3D2E] hover:bg-[#A8B9A3]/40 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Right Selected Order Details Inspector Drawer */}
          {selectedOrder && (
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#F4F0E7] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#B89B5E] tracking-wider">ORDER DETAILS</span>
                  <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">{selectedOrder.orderId}</h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-xs font-bold text-[#242824]/60 hover:underline">
                  Close Drawer ✕
                </button>
              </div>

              {/* Status Badge & Tracking info */}
              <div className="bg-[#FCFBF7] p-4 rounded-2xl border border-[#A8B9A3]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#A8B9A3]">Current Lifecycle State</span>
                  <div className="mt-1">
                    <OrderStatusBadge status={selectedOrder.orderStatus} />
                  </div>
                </div>
                {selectedOrder.trackingNumber && (
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-[#A8B9A3]">Courier / Tracking</span>
                    <p className="text-xs font-bold text-[#1F3D2E] mt-0.5">
                      {selectedOrder.courier || 'Express'} — <code className="bg-[#F4F0E7] px-2 py-0.5 rounded text-[#315C45]">{selectedOrder.trackingNumber}</code>
                    </p>
                  </div>
                )}
              </div>

              {/* State Machine Transition Actions */}
              <div className="bg-[#FCFBF7] p-5 rounded-2xl border border-[#315C45]/20 space-y-3">
                <h4 className="font-bold text-[#1F3D2E] text-xs uppercase tracking-wider">State Machine Transitions</h4>
                
                {getAllowedNextStates(selectedOrder.orderStatus).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {getAllowedNextStates(selectedOrder.orderStatus).map((nextSt) => {
                      const cfg = getStatusConfig(nextSt);
                      const isShip = nextSt === 'SHIPPED';
                      const isCancel = nextSt === 'CANCELLED';

                      return (
                        <button
                          key={nextSt}
                          onClick={() => handleExecuteTransition(selectedOrder.orderId, nextSt)}
                          disabled={actionLoading}
                          className={`text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5 ${
                            isShip
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : isCancel
                              ? 'bg-rose-700 hover:bg-rose-800 text-white'
                              : 'bg-[#1F3D2E] hover:bg-[#315C45] text-white'
                          }`}
                        >
                          {isShip && <Truck className="w-3.5 h-3.5" />}
                          {isCancel && <XCircle className="w-3.5 h-3.5" />}
                          <span>Advance to: {cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[#242824]/60 italic">Terminal State — No further state machine transitions available.</p>
                )}
              </div>

              {/* Timeline Component */}
              <OrderTimeline status={selectedOrder.orderStatus} history={selectedOrder.statusHistory} />

              {/* Customer Info */}
              <div className="bg-[#FCFBF7] p-4 rounded-2xl border border-[#F4F0E7] space-y-2 text-xs">
                <h4 className="font-bold text-[#1F3D2E] uppercase text-[10px] tracking-wider">Customer Information</h4>
                <p><strong className="text-[#1F3D2E]">Name:</strong> {selectedOrder.customer?.name}</p>
                <p><strong className="text-[#1F3D2E]">Phone:</strong> {selectedOrder.customer?.phone}</p>
                <p><strong className="text-[#1F3D2E]">Email:</strong> {selectedOrder.customer?.email || 'N/A'}</p>
                <p><strong className="text-[#1F3D2E]">Address:</strong> {selectedOrder.customer?.address?.house}, {selectedOrder.customer?.address?.street}, {selectedOrder.customer?.address?.area}, {selectedOrder.customer?.address?.city}, {selectedOrder.customer?.address?.state} - {selectedOrder.customer?.address?.pincode}</p>
              </div>

              {/* Payment Verification */}
              {selectedOrder.payment?.status !== 'VERIFIED' && (
                <div className="bg-[#FCFBF7] p-4 rounded-2xl border border-[#F4F0E7] space-y-3 text-xs">
                  <h4 className="font-bold text-[#1F3D2E] uppercase text-[10px] tracking-wider">Payment Verification Actions</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerifyPayment(selectedOrder.orderId)}
                      disabled={actionLoading}
                      className="flex-1 bg-[#315C45] hover:bg-[#1F3D2E] text-white text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#B89B5E]" />
                      <span>VERIFY PAYMENT</span>
                    </button>

                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={actionLoading}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>REJECT PAYMENT</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Shipping Details Modal Prompt */}
      {showShipModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FCFBF7] p-6 sm:p-8 rounded-3xl max-w-md w-full border border-[#A8B9A3]/40 space-y-5 animate-fade-in shadow-2xl">
            <div className="flex items-center gap-3 border-b border-[#F4F0E7] pb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-display text-xl font-bold text-[#1F3D2E]">Ship Order #{selectedOrder.orderId}</h3>
                <p className="text-xs text-[#242824]/70">Enter courier details and tracking number before shipping.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1F3D2E] mb-1 uppercase tracking-wider text-[10px]">Courier Partner</label>
                <select
                  value={shipCourier}
                  onChange={(e) => setShipCourier(e.target.value)}
                  className="w-full p-3 bg-white border border-[#A8B9A3]/40 rounded-xl font-semibold text-xs focus:outline-none focus:border-[#315C45]"
                >
                  {COURIER_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1F3D2E] mb-1 uppercase tracking-wider text-[10px]">Tracking Number *</label>
                <input
                  type="text"
                  value={shipTrackingNumber}
                  onChange={(e) => setShipTrackingNumber(e.target.value)}
                  placeholder="e.g. TRK109823456"
                  className="w-full p-3 bg-white border border-[#A8B9A3]/40 rounded-xl font-bold text-xs focus:outline-none focus:border-[#315C45]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowShipModal(false)}
                className="text-xs text-[#242824]/60 font-bold px-4 py-2.5 rounded-xl hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmShipment}
                disabled={actionLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>Confirm & Mark Shipped</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Reason Modal */}
      {showRejectModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FCFBF7] p-6 rounded-3xl max-w-md w-full border border-[#A8B9A3]/40 space-y-4 shadow-2xl">
            <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">Reject Payment</h3>
            <p className="text-xs text-[#242824]/70">Please specify a reason for rejecting payment for Order #{selectedOrder.orderId}:</p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Invalid UTR number or mismatch in payment amount"
              className="w-full p-3 bg-white border border-[#A8B9A3]/40 rounded-xl text-xs focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRejectModal(false)} className="text-xs text-[#242824]/60 hover:underline">
                Cancel
              </button>
              <button onClick={handleRejectPayment} disabled={actionLoading} className="bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
