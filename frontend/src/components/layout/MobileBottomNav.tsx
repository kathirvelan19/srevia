import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, ShoppingBag, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { currentUser, isAdmin, signInWithGoogle } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCFBF7]/95 backdrop-blur-lg border-t border-[#F4F0E7] shadow-[0_-4px_20px_rgba(31,61,46,0.08)] px-2 py-1.5 transition-all">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home Link */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded-xl transition-colors ${
            isActive('/') ? 'text-[#1F3D2E] font-bold' : 'text-[#242824]/60 hover:text-[#315C45]'
          }`}
          aria-label="Home"
        >
          <Home className={`w-5 h-5 ${isActive('/') ? 'text-[#315C45]' : ''}`} />
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">Home</span>
        </Link>

        {/* Product Link */}
        <Link
          to="/product"
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded-xl transition-colors ${
            isActive('/product') ? 'text-[#1F3D2E] font-bold' : 'text-[#242824]/60 hover:text-[#315C45]'
          }`}
          aria-label="Products"
        >
          <Package className={`w-5 h-5 ${isActive('/product') ? 'text-[#315C45]' : ''}`} />
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">Product</span>
        </Link>

        {/* Track Order Link */}
        <Link
          to="/track-order"
          className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded-xl transition-colors ${
            isActive('/track-order') ? 'text-[#1F3D2E] font-bold' : 'text-[#242824]/60 hover:text-[#315C45]'
          }`}
          aria-label="Track Order"
        >
          <ShieldCheck className={`w-5 h-5 ${isActive('/track-order') ? 'text-[#B89B5E]' : ''}`} />
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">Track</span>
        </Link>

        {/* Shopping Cart Link */}
        <Link
          to="/checkout"
          className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded-xl transition-colors ${
            isActive('/checkout') ? 'text-[#1F3D2E] font-bold' : 'text-[#242824]/60 hover:text-[#315C45]'
          }`}
          aria-label="Checkout Cart"
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${isActive('/checkout') ? 'text-[#315C45]' : ''}`} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#315C45] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">Cart</span>
        </Link>

        {/* Profile / Admin / Sign In Link */}
        {currentUser ? (
          <Link
            to={isAdmin ? '/admin/profile' : '/profile'}
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded-xl transition-colors ${
              isActive('/profile') || isActive('/admin/profile') || isActive('/admin/dashboard')
                ? 'text-[#1F3D2E] font-bold'
                : 'text-[#242824]/60 hover:text-[#315C45]'
            }`}
            aria-label="Profile"
          >
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="User Profile"
                className="w-5 h-5 rounded-full object-cover border border-[#B89B5E]"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-[#315C45]" />
            )}
            <span className="text-[10px] mt-0.5 font-medium tracking-tight">
              {isAdmin ? 'Admin' : 'Account'}
            </span>
          </Link>
        ) : (
          <button
            onClick={async () => {
              try {
                const userRole = await signInWithGoogle();
                if (userRole === 'ADMIN') navigate('/admin/dashboard');
                else navigate('/profile');
              } catch (e) {
                console.error(e);
              }
            }}
            className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded-xl text-[#242824]/60 hover:text-[#315C45] transition-colors"
            aria-label="Sign In"
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium tracking-tight">Sign In</span>
          </button>
        )}

      </div>
    </nav>
  );
};
