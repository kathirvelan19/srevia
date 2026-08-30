import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, Package, Copy, Phone, Mail } from 'lucide-react';
import type { Order } from '../../types';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;
  const [copied, setCopied] = React.useState(false);

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#FCFBF7] rounded-3xl p-8 sm:p-12 border border-[#A8B9A3]/40 shadow-herbal space-y-8">
          
          {/* Header Badge */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#315C45] text-[#FCFBF7] rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
              ORDER PLACED SUCCESSFULLY
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1F3D2E]">
              Thank You For Your Order!
            </h1>
            <p className="text-sm text-[#242824]/80">
              We have received your order for PUREWHITE Herbal Anti-Pimple Soap.
            </p>
          </div>

          {/* Reference Order ID Card */}
          <div className="bg-[#F4F0E7] p-6 rounded-2xl border border-[#A8B9A3]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#242824]/70 uppercase tracking-wider font-semibold">Your Reference Order ID</p>
              <p className="text-2xl font-bold text-[#1F3D2E] tracking-wider mt-0.5">{order.orderId}</p>
            </div>
            <button
              onClick={handleCopyOrderId}
              className="flex items-center gap-2 bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors active-press shadow-sm"
            >
              <Copy className="w-4 h-4 text-[#B89B5E]" />
              <span>{copied ? 'COPIED!' : 'COPY ID'}</span>
            </button>
          </div>

          {/* Customer & Address Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm border-t border-[#F4F0E7] pt-6">
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1F3D2E]">Customer Info</h3>
              <p className="text-[#242824] font-medium">{order.customer.name}</p>
              <p className="text-xs text-[#242824]/80">{order.customer.phone}</p>
              <p className="text-xs text-[#242824]/80">{order.customer.email}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1F3D2E]">Delivery Address</h3>
              <p className="text-xs text-[#242824]/80 leading-relaxed">
                {order.customer.address.house}, {order.customer.address.street}, {order.customer.address.area}<br />
                {order.customer.address.city}, {order.customer.address.state} - {order.customer.address.pincode}
              </p>
            </div>
          </div>

          {/* Order Summary Breakdown */}
          <div className="border-t border-[#F4F0E7] pt-6 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#1F3D2E]">Order Items</h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-2">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#315C45]" />
                  <div>
                    <p className="font-semibold text-[#1F3D2E]">{item.productName}</p>
                    <p className="text-xs text-[#242824]/60">Qty: {item.quantity} × ₹{item.unitPrice}</p>
                  </div>
                </div>
                <span className="font-bold text-[#1F3D2E]">₹{item.totalPrice}</span>
              </div>
            ))}

            <div className="pt-4 border-t border-[#F4F0E7] space-y-2 text-sm">
              <div className="flex justify-between text-xs text-[#242824]/70">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-[#242824]/70">
                <span>Delivery Charge</span>
                <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1F3D2E] pt-2 border-t border-[#F4F0E7]">
                <span>Total Amount Paid / Payable</span>
                <span className="text-[#315C45]">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Contact & Support Note */}
          <div className="bg-[#F4F0E7]/60 p-5 rounded-2xl border border-[#A8B9A3]/30 text-xs text-[#242824]/80 space-y-2">
            <p className="font-bold text-[#1F3D2E]">Need support with your order?</p>
            <p>Contact Kathirvelan directly for order updates or shipping inquiries:</p>
            <div className="flex flex-wrap gap-4 pt-1 font-medium">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#315C45]" /> +91 9025132739</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#315C45]" /> kathirvelankvr@gmail.com</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/track-order"
              state={{ orderId: order.orderId, phone: order.customer.phone }}
              className="flex-1 bg-[#1F3D2E] hover:bg-[#315C45] text-white font-semibold text-xs uppercase tracking-wider py-4 rounded-full transition-all text-center flex items-center justify-center gap-2 active-press shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
              <span>Track This Order</span>
            </Link>

            <Link
              to="/"
              className="flex-1 bg-[#F4F0E7] hover:bg-[#A8B9A3]/30 text-[#1F3D2E] font-semibold text-xs uppercase tracking-wider py-4 rounded-full transition-all text-center flex items-center justify-center gap-2 border border-[#315C45]/30"
            >
              <span>Return To Home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export const OrderSuccessPage = OrderSuccess;

