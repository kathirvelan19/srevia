import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { loginAdmin } from '../../services/api';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('kathirvelankvr@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginAdmin(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F3D2E] text-[#FCFBF7] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#FCFBF7] text-[#242824] p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#A8B9A3]/30 space-y-8 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#1F3D2E] text-[#FCFBF7] rounded-full flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-[#B89B5E]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1F3D2E]">Admin Portal</h1>
          <p className="text-xs text-[#242824]/70">Srevia Herbs Order & Management Login</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-[#315C45] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kathirvelankvr@gmail.com"
                className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#315C45] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-[#315C45] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#315C45] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F3D2E] hover:bg-[#315C45] text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-full shadow-herbal transition-all flex items-center justify-center gap-2 active-press disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Login to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#B89B5E]" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-[#F4F0E7] text-xs text-[#242824]/60 space-y-1">
          <p>Default Email: <span className="font-semibold text-[#1F3D2E]">kathirvelankvr@gmail.com</span></p>
          <p>Contact: <span className="font-semibold text-[#1F3D2E]">+91 9025132739</span></p>
        </div>

      </div>
    </div>
  );
};

export const AdminLoginPage = AdminLogin;

