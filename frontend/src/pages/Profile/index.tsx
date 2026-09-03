import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Package, ShieldCheck, ArrowRight, Clock, Truck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { SEO } from '../../components/seo/SEO';

export const ProfilePage: React.FC = () => {
  const { currentUser, isAdmin, logout, signInWithGoogle } = useAuth();
  const { orders } = useStore();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] pt-32 pb-24 flex items-center justify-center px-4">
        <SEO title="User Profile | SREVIA HERBS" description="Sign in to view your profile and order status." />
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal text-center space-y-6">
          <div className="w-16 h-16 bg-[#F4F0E7] text-[#1F3D2E] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <User className="w-8 h-8 text-[#315C45]" />
          </div>
          <div>
            <h1 className="text-2xl font-serif-display font-bold text-[#1F3D2E]">Welcome to Srevia Herbs</h1>
            <p className="text-xs text-[#242824]/70 mt-1">Sign in with your Google account to access your profile and track orders.</p>
          </div>

          <button
            onClick={async () => {
              try {
                const userRole = await signInWithGoogle();
                if (userRole === 'ADMIN') {
                  navigate('/admin/dashboard');
                }
              } catch (e) {
                console.error("Login failed:", e);
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
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    );
  }

  const userEmail = currentUser.email || '';
  const userOrders = orders.filter(
    (o) => o.customer.email.toLowerCase() === userEmail.toLowerCase() || isAdmin
  );

  const renderStageBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'SHIPPING':
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Truck className="w-3.5 h-3.5" />
            Shipping in Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Order Received
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-28 pb-20">
      <SEO title="My Profile | SREVIA HERBS" description="View account details and order status." />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A8B9A3]/30 shadow-herbal flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="w-20 h-20 rounded-full border-2 border-[#B89B5E] shadow-md object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1F3D2E] text-white text-2xl font-bold flex items-center justify-center shadow-md">
                {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-2xl font-bold text-[#1F3D2E]">
                  {currentUser.displayName || 'Srevia Customer'}
                </h1>
                {isAdmin ? (
                  <span className="bg-[#B89B5E] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="bg-[#315C45]/10 text-[#315C45] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Customer Profile
                  </span>
                )}
              </div>
              <p className="text-xs text-[#242824]/70 mt-1">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-full transition-all shadow-md flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="bg-[#F4F0E7] hover:bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider px-4 py-3 rounded-full border border-red-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Admin Quick Switch Notice */}
        {isAdmin && (
          <div className="bg-[#1F3D2E] text-white p-6 rounded-3xl shadow-herbal flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89B5E]">ADMIN PRIVILEGES ACTIVE</span>
              <h2 className="text-lg font-bold text-white">Kathirvelan Admin Control Center</h2>
              <p className="text-xs text-[#FCFBF7]/80">Manage PUREWHITE soap availability, update pricing, and set 3-stage order tracking live.</p>
            </div>
            <Link
              to="/admin/dashboard"
              className="bg-[#B89B5E] hover:bg-[#a0854d] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-md shrink-0 flex items-center gap-2"
            >
              <span>Manage Store & Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Order History */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A8B9A3]/30 shadow-herbal space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4F0E7] pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#1F3D2E]">My Orders ({userOrders.length})</h2>
              <p className="text-xs text-[#242824]/70">Track your PUREWHITE soap orders in real time.</p>
            </div>
            <Link
              to="/track-order"
              className="text-xs font-bold text-[#315C45] hover:text-[#1F3D2E] flex items-center gap-1"
            >
              <span>Track with Order ID</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {userOrders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Package className="w-12 h-12 text-[#A8B9A3] mx-auto opacity-50" />
              <p className="text-sm font-semibold text-[#1F3D2E]">No orders placed yet</p>
              <p className="text-xs text-[#242824]/60 max-w-sm mx-auto">Explore PUREWHITE Herbal Soap and place your order today!</p>
              <Link
                to="/product/prod_purewhite_01"
                className="inline-block bg-[#1F3D2E] text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-md hover:bg-[#315C45] transition-all"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((o) => (
                <div key={o.orderId} className="border border-[#F4F0E7] rounded-2xl p-5 hover:border-[#315C45]/40 transition-colors space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4F0E7] pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89B5E]">ORDER ID</span>
                      <h3 className="font-bold text-[#1F3D2E] text-sm">#{o.orderId}</h3>
                      <p className="text-[11px] text-[#242824]/60">Placed on {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>{renderStageBadge(o.orderStatus)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-[#A8B9A3] uppercase">Item</p>
                      <p className="font-medium text-[#1F3D2E]">
                        {o.items[0]?.productName || 'PUREWHITE Soap'} × {o.items[0]?.quantity || 1}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#A8B9A3] uppercase">Total Paid</p>
                      <p className="font-bold text-[#1F3D2E]">₹{o.totalAmount}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/track-order/${o.orderId}`}
                      className="bg-[#F4F0E7] hover:bg-[#315C45] hover:text-white text-[#1F3D2E] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Track Status</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
