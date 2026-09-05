import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Settings, UserCheck, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminNav: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
    { path: '/admin/profile', label: 'Admin Profile', icon: UserCheck },
  ];

  const isActive = (path: string) => {
    if (path === '/admin/dashboard' && (currentPath === '/admin' || currentPath === '/admin/dashboard')) {
      return true;
    }
    return currentPath === path;
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#A8B9A3]/30 shadow-herbal mb-8 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F4F0E7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1F3D2E] text-[#B89B5E] flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-[#1F3D2E] text-base sm:text-lg">Kathirvelan Admin Portal</h2>
              <span className="bg-[#B89B5E]/20 text-[#1F3D2E] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#B89B5E]/40">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-[#242824]/70">
              Logged in as <strong className="text-[#1F3D2E]">{currentUser?.email || 'kathirvelankvr@gmail.com'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/profile"
            className="text-[#315C45] hover:text-[#1F3D2E] font-semibold px-3 py-1.5 rounded-xl hover:bg-[#F4F0E7] transition-colors flex items-center gap-1.5"
          >
            <span>Customer Profile View</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="bg-[#1F3D2E] text-white hover:bg-[#315C45] font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Store Front</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#B89B5E]" />
          </Link>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                active
                  ? 'bg-[#1F3D2E] text-white shadow-md'
                  : 'bg-[#F4F0E7]/70 text-[#1F3D2E] hover:bg-[#F4F0E7] hover:text-[#315C45]'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-[#B89B5E]' : 'text-[#315C45]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
