import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, CheckCircle2, XCircle, Eye, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import type { Order, OrderStatus } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

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
    setOrders(data);
  };

  useEffect(() => {
    let result = orders;

    if (statusFilter !== 'ALL') {
      result = result.filter((o) => o.orderStatus === statusFilter || o.payment.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q)
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  const handleVerifyPayment = async (orderId: string) => {
    if (!token) return;
    if (window.confirm(`Verify payment for Order ${orderId}?`)) {
      await api.updatePaymentStatus(token, orderId, 'VERIFIED');
      await api.updateOrderStatus(token, orderId, 'CONFIRMED');
      await loadOrders();
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, payment: { ...prev.payment, status: 'VERIFIED' }, orderStatus: 'CONFIRMED' } : null);
      }
    }
  };

  const handleRejectPayment = async () => {
    if (!token || !selectedOrder) return;
    await api.updatePaymentStatus(token, selectedOrder.orderId, 'REJECTED', rejectionReason);
    setShowRejectModal(false);
    setRejectionReason('');
    await loadOrders();
    setSelectedOrder((prev) => prev ? { ...prev, payment: { ...prev.payment, status: 'REJECTED' } } : null);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!token) return;
    if (window.confirm(`Change order status of ${orderId} to ${newStatus}?`)) {
      await api.updateOrderStatus(token, orderId, newStatus);
      await loadOrders();
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, orderStatus: newStatus as OrderStatus } : null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset">
      <div className="container-custom space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4F0E7] pb-6 gap-4">
          <div>
            <span className="text-xs text-[#B89B5E] font-semibold uppercase tracking-[0.25em]">ORDER MANAGEMENT</span>
            <h1 className="font-serif-display text-3xl font-bold text-[#1F3D2E]">
              Customer Orders ({filteredOrders.length})
            </h1>
          </div>

          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-[#F4F0E7] hover:bg-[#A8B9A3]/30 text-[#1F3D2E] text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full transition-colors flex items-center gap-2 border border-[#315C45]/30 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[#FCFBF7] p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#242824]/40 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Customer Name, or Phone..."
              className="w-full pl-10 pr-4 py-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-sm focus:outline-none focus:border-[#315C45]"
            />
          </div>

          <div className="sm:col-span-6 flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-[#B89B5E] shrink-0" />
            {['ALL', 'SUBMITTED', 'VERIFIED', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'REJECTED'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full whitespace-nowrap transition-colors ${
                  statusFilter === filter
                    ? 'bg-[#1F3D2E] text-white shadow-sm'
                    : 'bg-[#F4F0E7] text-[#242824]/70 hover:bg-[#A8B9A3]/30'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Main Orders Table & Inspector Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Table */}
          <div className={`${selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'} bg-[#FCFBF7] p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal overflow-x-auto`}>
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
                      <p className="font-bold text-[#1F3D2E]">{o.customer.name}</p>
                      <p className="text-[10px] text-[#242824]/60">{o.customer.phone}</p>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#315C45]">₹{o.totalAmount}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        o.payment.status === 'VERIFIED' ? 'bg-[#315C45]/10 text-[#315C45]' :
                        o.payment.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#1F3D2E]">{o.orderStatus}</td>
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
          </div>

          {/* Right Selected Order Details Inspector Drawer */}
          {selectedOrder && (
            <div className="lg:col-span-5 bg-[#FCFBF7] p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#F4F0E7] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#B89B5E] tracking-wider">ORDER DETAILS</span>
                  <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">{selectedOrder.orderId}</h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-xs text-[#242824]/60 hover:underline">
                  Close
                </button>
              </div>

              {/* Customer Info */}
              <div className="bg-[#F4F0E7]/60 p-4 rounded-2xl space-y-2 text-xs">
                <h4 className="font-bold text-[#1F3D2E] uppercase text-[10px] tracking-wider">Customer Details</h4>
                <p><strong className="text-[#1F3D2E]">Name:</strong> {selectedOrder.customer.name}</p>
                <p><strong className="text-[#1F3D2E]">Phone:</strong> {selectedOrder.customer.phone}</p>
                <p><strong className="text-[#1F3D2E]">Email:</strong> {selectedOrder.customer.email || 'N/A'}</p>
                <p><strong className="text-[#1F3D2E]">Address:</strong> {selectedOrder.customer.address.house}, {selectedOrder.customer.address.street}, {selectedOrder.customer.address.area}, {selectedOrder.customer.address.city}, {selectedOrder.customer.address.state} - {selectedOrder.customer.address.pincode}</p>
              </div>

              {/* Payment Details */}
              <div className="bg-[#F4F0E7]/60 p-4 rounded-2xl space-y-3 text-xs">
                <h4 className="font-bold text-[#1F3D2E] uppercase text-[10px] tracking-wider">Payment Information</h4>
                <p><strong className="text-[#1F3D2E]">Method:</strong> {selectedOrder.payment.method}</p>
                <p><strong className="text-[#1F3D2E]">Payment Status:</strong> <span className="font-bold text-[#315C45]">{selectedOrder.payment.status}</span></p>
                {selectedOrder.payment.utr && <p><strong className="text-[#1F3D2E]">UTR / Transaction ID:</strong> <code className="bg-white px-2 py-0.5 rounded text-[#315C45]">{selectedOrder.payment.utr}</code></p>}
                {selectedOrder.payment.razorpayPaymentId && <p><strong className="text-[#1F3D2E]">Razorpay Payment ID:</strong> <code className="bg-white px-2 py-0.5 rounded text-[#315C45]">{selectedOrder.payment.razorpayPaymentId}</code></p>}

                {/* Verification Actions */}
                {selectedOrder.payment.status !== 'VERIFIED' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleVerifyPayment(selectedOrder.orderId)}
                      className="flex-1 bg-[#315C45] hover:bg-[#1F3D2E] text-white text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#B89B5E]" />
                      <span>VERIFY PAYMENT</span>
                    </button>

                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>REJECT PAYMENT</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Order Status Transition Controls */}
              <div className="space-y-2 pt-2 border-t border-[#F4F0E7]">
                <h4 className="font-bold text-[#1F3D2E] text-xs uppercase tracking-wider">Update Order Lifecycle Status:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedOrder.orderId, st)}
                      disabled={selectedOrder.orderStatus === st}
                      className={`text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-xl border transition-colors ${
                        selectedOrder.orderStatus === st
                          ? 'bg-[#1F3D2E] text-white border-[#1F3D2E]'
                          : 'bg-[#FCFBF7] text-[#1F3D2E] border-[#A8B9A3]/40 hover:bg-[#F4F0E7]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Reject Payment Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FCFBF7] p-6 rounded-3xl max-w-md w-full border border-[#A8B9A3]/40 space-y-4">
            <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">Reject Payment</h3>
            <p className="text-xs text-[#242824]/70">Please specify a reason for rejecting payment for Order {selectedOrder?.orderId}:</p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Invalid UTR number or mismatch in payment amount"
              className="w-full p-3 bg-[#F4F0E7]/60 border border-[#A8B9A3]/40 rounded-xl text-xs focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRejectModal(false)} className="text-xs text-[#242824]/60 hover:underline">
                Cancel
              </button>
              <button onClick={handleRejectPayment} className="bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
