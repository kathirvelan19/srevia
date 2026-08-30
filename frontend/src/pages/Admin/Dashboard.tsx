import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, DollarSign, Clock, CheckCircle2, Package, RefreshCw, AlertTriangle, LogOut, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import type { Order } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('srevia_admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchOrders = async () => {
      const data = await api.getAdminOrders(token);
      setOrders(data);
    };

    fetchOrders();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('srevia_admin_token');
    localStorage.removeItem('srevia_admin_email');
    navigate('/admin/login');
  };

  // Metrics Calculations
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingPayments = orders.filter((o) => o.payment.status === 'SUBMITTED' || o.payment.status === 'PENDING').length;
  const confirmedOrders = orders.filter((o) => o.orderStatus === 'CONFIRMED').length;
  const processingOrders = orders.filter((o) => o.orderStatus === 'PROCESSING').length;
  const shippedOrders = orders.filter((o) => o.orderStatus === 'SHIPPED').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
  const pendingSyncOrders = orders.filter((o) => !o.googleSheetsSynced);

  const handleBatchSync = async () => {
    if (!token) return;
    setSyncing(true);
    for (const o of pendingSyncOrders) {
      await api.retryGoogleSheetsSync(token, o.orderId);
    }
    const updated = await api.getAdminOrders(token);
    setOrders(updated);
    setSyncing(false);
    alert('Google Sheets sync updated!');
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4F0E7] pb-6 gap-4">
          <div>
            <span className="text-xs text-[#B89B5E] font-semibold uppercase tracking-[0.25em]">OVERVIEW & ANALYTICS</span>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1F3D2E]">
              Srevia Herbs Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/orders"
              className="bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all shadow-md flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-[#B89B5E]" />
              <span>Manage Orders ({orders.length})</span>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-[#F4F0E7] hover:bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full border border-red-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Google Sheets Sync Alert Banner */}
        {pendingSyncOrders.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>{pendingSyncOrders.length} order(s)</strong> pending Google Sheets synchronization.
              </span>
            </div>
            <button
              onClick={handleBatchSync}
              disabled={syncing}
              className="bg-amber-800 hover:bg-amber-900 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'RETRY SYNC'}</span>
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="bg-[#FCFBF7] p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-2">
            <div className="flex items-center justify-between text-[#315C45]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#242824]/60">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-[#B89B5E]" />
            </div>
            <p className="font-serif-display text-3xl font-bold text-[#1F3D2E]">₹{totalRevenue}</p>
            <p className="text-[11px] text-[#A8B9A3]">All time orders</p>
          </div>

          <div className="bg-[#FCFBF7] p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-2">
            <div className="flex items-center justify-between text-[#315C45]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#242824]/60">Total Orders</span>
              <ShoppingBag className="w-5 h-5 text-[#B89B5E]" />
            </div>
            <p className="font-serif-display text-3xl font-bold text-[#1F3D2E]">{totalOrders}</p>
            <p className="text-[11px] text-[#315C45]">{confirmedOrders} confirmed</p>
          </div>

          <div className="bg-[#FCFBF7] p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-2">
            <div className="flex items-center justify-between text-[#315C45]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#242824]/60">Pending Payments</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="font-serif-display text-3xl font-bold text-amber-600">{pendingPayments}</p>
            <p className="text-[11px] text-amber-700">Requires UTR verification</p>
          </div>

          <div className="bg-[#FCFBF7] p-6 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-2">
            <div className="flex items-center justify-between text-[#315C45]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#242824]/60">Delivered</span>
              <CheckCircle2 className="w-5 h-5 text-[#315C45]" />
            </div>
            <p className="font-serif-display text-3xl font-bold text-[#315C45]">{deliveredOrders}</p>
            <p className="text-[11px] text-[#A8B9A3]">Completed customer orders</p>
          </div>

        </div>

        {/* Order Lifecycle Distribution Cards */}
        <div className="bg-[#F4F0E7]/60 p-6 sm:p-8 rounded-3xl border border-[#A8B9A3]/30 space-y-4">
          <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">Order Lifecycle Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-[#FCFBF7] p-4 rounded-2xl border border-[#A8B9A3]/30">
              <span className="text-xs text-[#242824]/60 font-semibold uppercase">Confirmed</span>
              <p className="font-serif-display text-2xl font-bold text-[#1F3D2E]">{confirmedOrders}</p>
            </div>
            <div className="bg-[#FCFBF7] p-4 rounded-2xl border border-[#A8B9A3]/30">
              <span className="text-xs text-[#242824]/60 font-semibold uppercase">Processing</span>
              <p className="font-serif-display text-2xl font-bold text-[#1F3D2E]">{processingOrders}</p>
            </div>
            <div className="bg-[#FCFBF7] p-4 rounded-2xl border border-[#A8B9A3]/30">
              <span className="text-xs text-[#242824]/60 font-semibold uppercase">Shipped</span>
              <p className="font-serif-display text-2xl font-bold text-[#1F3D2E]">{shippedOrders}</p>
            </div>
            <div className="bg-[#FCFBF7] p-4 rounded-2xl border border-[#A8B9A3]/30">
              <span className="text-xs text-[#242824]/60 font-semibold uppercase">Delivered</span>
              <p className="font-serif-display text-2xl font-bold text-[#1F3D2E]">{deliveredOrders}</p>
            </div>
          </div>
        </div>

        {/* Quick Recent Orders Table */}
        <div className="bg-[#FCFBF7] p-6 sm:p-8 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E]">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-[#315C45] hover:underline flex items-center gap-1">
              <span>View All Orders</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#F4F0E7] text-[#242824]/60 uppercase font-semibold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4">Google Sheets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F0E7]">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.orderId} className="hover:bg-[#F4F0E7]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1F3D2E]">{o.orderId}</td>
                    <td className="py-3 px-4 font-medium">{o.customer.name}</td>
                    <td className="py-3 px-4">{o.customer.phone}</td>
                    <td className="py-3 px-4 font-bold text-[#315C45]">₹{o.totalAmount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        o.payment.status === 'VERIFIED' ? 'bg-[#315C45]/10 text-[#315C45]' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1F3D2E]">{o.orderStatus}</td>
                    <td className="py-3 px-4">
                      {o.googleSheetsSynced ? (
                        <span className="text-emerald-700 font-bold">✓ Synced</span>
                      ) : (
                        <span className="text-amber-700 font-bold">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
