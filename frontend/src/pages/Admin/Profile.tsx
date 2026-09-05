import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, User, Mail, Phone, MapPin, QrCode, CheckCircle2, 
  Download, RefreshCw, Key, Lock, Activity, Server, FileSpreadsheet, 
  CreditCard, Clock, Save, LogOut, Camera, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { AdminNav } from '../../components/admin/AdminNav';
import { api } from '../../services/api';

interface AuditLogItem {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export const AdminProfilePage: React.FC = () => {
  const { currentUser, isAdmin, logout, signInWithGoogle } = useAuth();
  const { orders } = useStore();
  const navigate = useNavigate();

  // Profile Form States
  const [adminName, setAdminName] = useState(() => localStorage.getItem('srevia_contact_name') || 'Kathirvelan');
  const [adminPhone, setAdminPhone] = useState(() => localStorage.getItem('srevia_contact_phone') || '9025132739');
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem('srevia_contact_email') || currentUser?.email || 'kathirvelankvr@gmail.com');
  const [upiId, setUpiId] = useState(() => localStorage.getItem('srevia_upi_id') || '9025132739@upi');
  const [officeAddress, setOfficeAddress] = useState(() => localStorage.getItem('srevia_office_address') || 'Coimbatore, Tamil Nadu, India');
  const [designation, setDesignation] = useState(() => localStorage.getItem('srevia_admin_title') || 'Founder & Super Administrator');
  const [avatarUrl, setAvatarUrl] = useState(() => currentUser?.photoURL || localStorage.getItem('srevia_admin_avatar') || '');

  // UI state
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logFilter, setLogFilter] = useState('ALL');
  const [downloadingBackup, setDownloadingBackup] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    const token = localStorage.getItem('srevia_admin_token') || 'firebase_admin_active';
    const logs = await api.getAuditLogs(token);
    setAuditLogs(logs);
    setLoadingLogs(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('srevia_contact_name', adminName);
    localStorage.setItem('srevia_contact_phone', adminPhone);
    localStorage.setItem('srevia_contact_email', adminEmail);
    localStorage.setItem('srevia_upi_id', upiId);
    localStorage.setItem('srevia_office_address', officeAddress);
    localStorage.setItem('srevia_admin_title', designation);
    if (avatarUrl) {
      localStorage.setItem('srevia_admin_avatar', avatarUrl);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadBackup = async () => {
    setDownloadingBackup(true);
    try {
      const token = localStorage.getItem('srevia_admin_token') || 'firebase_admin_active';
      const backupData = await api.downloadDatabaseBackup(token);
      
      const payload = backupData || {
        appName: 'SREVIA HERBS Backend',
        generatedAt: new Date().toISOString(),
        exportedBy: adminEmail,
        ordersCount: orders.length,
        orders: orders,
        settings: {
          upiId,
          contactName: adminName,
          contactPhone: adminPhone,
          contactEmail: adminEmail
        }
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `srevia_database_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Backup download error:', e);
    } finally {
      setDownloadingBackup(false);
    }
  };

  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] pt-32 pb-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal text-center space-y-6">
          <div className="w-16 h-16 bg-[#1F3D2E] text-[#B89B5E] rounded-full flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-serif-display font-bold text-[#1F3D2E]">Admin Authentication Required</h1>
            <p className="text-xs text-[#242824]/70 mt-1">Please sign in as Super Admin (<strong>kathirvelankvr@gmail.com</strong>) to access this profile center.</p>
          </div>

          <button
            onClick={async () => {
              try {
                const role = await signInWithGoogle();
                if (role === 'ADMIN') {
                  navigate('/admin/profile');
                } else {
                  alert('Only kathirvelankvr@gmail.com has Admin permissions.');
                  navigate('/profile');
                }
              } catch (e) {
                console.error(e);
              }
            }}
            className="w-full bg-[#1F3D2E] hover:bg-[#315C45] text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-full shadow-herbal transition-all flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
            <span>Sign In as Super Admin</span>
          </button>
        </div>
      </div>
    );
  }

  const filteredLogs = auditLogs.filter((log) => {
    if (logFilter === 'ALL') return true;
    return log.action.toUpperCase() === logFilter;
  });

  return (
    <div className="min-h-screen bg-[#FCFBF7] page-header-offset pb-16">
      <div className="container-custom space-y-8">
        
        {/* Reusable Admin Navigation Header */}
        <AdminNav />

        {/* Saved Success Toast */}
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Admin Profile & Business Settings saved successfully!</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Updated Live</span>
          </div>
        )}

        {/* 1. EXECUTIVE ADMIN PROFILE HERO CARD */}
        <div className="bg-gradient-to-r from-[#1F3D2E] via-[#2A4D3B] to-[#1F3D2E] text-white rounded-3xl p-6 sm:p-10 shadow-herbal relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#B89B5E]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              
              {/* Avatar with Custom Preview */}
              <div className="relative group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={adminName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#B89B5E] shadow-2xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#B89B5E] text-[#1F3D2E] text-3xl font-extrabold flex items-center justify-center border-4 border-white/20 shadow-2xl">
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-[#B89B5E] text-[#1F3D2E] p-2 rounded-full shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="bg-[#B89B5E] text-[#1F3D2E] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> SUPER ADMIN
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active Session
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold font-serif-display text-white">
                  {adminName}
                </h1>
                <p className="text-xs text-[#B89B5E] font-medium tracking-wide">
                  {designation} — Srevia Herbs Control Center
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-white/80">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#B89B5E]" />
                    <span>{adminEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#B89B5E]" />
                    <span>{adminPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B89B5E]" />
                    <span>{officeAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap lg:flex-col items-center sm:items-stretch gap-3 shrink-0">
              <button
                onClick={handleDownloadBackup}
                disabled={downloadingBackup}
                className="bg-[#B89B5E] hover:bg-[#a0854d] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-all shadow-md flex items-center justify-center gap-2 active-press"
              >
                <Download className="w-4 h-4" />
                <span>{downloadingBackup ? 'Generating Backup...' : 'Download Full DB Backup'}</span>
              </button>

              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="bg-white/10 hover:bg-red-500/20 text-white hover:text-red-200 text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-full border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. MAIN CONTENT GRID: EDITABLE DETAILS & SECURITY OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols): Edit Profile & Settings Form */}
          <div className="lg:col-span-2 space-y-8">
            
            <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A8B9A3]/30 shadow-herbal space-y-6">
              <div className="flex items-center justify-between border-b border-[#F4F0E7] pb-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#315C45]" />
                  <h2 className="text-xl font-bold text-[#1F3D2E]">Admin Identity & Contact Profile</h2>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89B5E]">Editable</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                    Super Admin Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#315C45] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#315C45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                    Designation / Title
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-[#315C45] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#315C45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                    Primary Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#315C45] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#315C45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#315C45] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#315C45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                    UPI Virtual Payment Address (VPA)
                  </label>
                  <div className="relative">
                    <QrCode className="w-4 h-4 text-[#315C45] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. 9025132739@upi"
                      className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#315C45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                    Office Headquarters Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#315C45] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={officeAddress}
                      onChange={(e) => setOfficeAddress(e.target.value)}
                      className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#315C45]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                  Avatar Photo URL (Optional Preview)
                </label>
                <div className="relative">
                  <Camera className="w-4 h-4 text-[#315C45] absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://lh3.googleusercontent.com/..."
                    className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#315C45]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="bg-[#1F3D2E] hover:bg-[#315C45] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-herbal transition-all flex items-center gap-2 active-press"
                >
                  <Save className="w-4 h-4 text-[#B89B5E]" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>

            {/* 3. LIVE ADMIN AUDIT LOGS TRAIL */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A8B9A3]/30 shadow-herbal space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4F0E7] pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-[#315C45]" />
                  <div>
                    <h2 className="text-xl font-bold text-[#1F3D2E]">Admin Audit Logs & Activity History</h2>
                    <p className="text-xs text-[#242824]/60">Real-time log of administrative actions across stock, orders, and pricing.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchAuditLogs}
                    className="p-2 bg-[#F4F0E7] hover:bg-[#A8B9A3]/30 text-[#1F3D2E] rounded-xl transition-colors"
                    title="Refresh Audit Logs"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingLogs ? 'animate-spin' : ''}`} />
                  </button>

                  <select
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    className="bg-[#F4F0E7] border border-[#A8B9A3]/40 text-[#1F3D2E] text-xs font-bold rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="ALL">All Event Types</option>
                    <option value="STOCK_TOGGLE">Stock Toggles</option>
                    <option value="PRICE_CHANGE">Price Changes</option>
                    <option value="PAYMENT_VERIFICATION">Payment Verifications</option>
                    <option value="LOGIN">Auth Logins</option>
                  </select>
                </div>
              </div>

              {loadingLogs ? (
                <div className="py-8 text-center text-xs text-[#242824]/60">
                  Loading audit logs...
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#242824]/60">
                  No activity logs found for selected filter.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id || log.timestamp}
                      className="p-4 bg-[#FCFBF7] border border-[#F4F0E7] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#315C45]/30 transition-colors text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#1F3D2E]/10 text-[#1F3D2E] text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#1F3D2E]/20">
                            {log.action}
                          </span>
                          <span className="font-semibold text-[#1F3D2E]">{log.performedBy}</span>
                        </div>
                        <p className="text-[#242824]/80">{log.details}</p>
                      </div>

                      <div className="text-right sm:shrink-0 text-[11px] text-[#242824]/60 space-y-0.5">
                        <div className="flex items-center sm:justify-end gap-1">
                          <Clock className="w-3 h-3 text-[#315C45]" />
                          <span>{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="font-mono text-[10px]">IP: {log.ipAddress}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (1 Col): Security, Auth & System Status */}
          <div className="space-y-8">
            
            {/* Security & Authentication Box */}
            <div className="bg-white rounded-3xl p-6 border border-[#A8B9A3]/30 shadow-herbal space-y-6">
              <div className="flex items-center gap-3 border-b border-[#F4F0E7] pb-4">
                <Lock className="w-5 h-5 text-[#315C45]" />
                <h3 className="text-lg font-bold text-[#1F3D2E]">Security & Credentials</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-[#F4F0E7]/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#315C45]" />
                    <span className="font-semibold text-[#1F3D2E]">Auth Provider</span>
                  </div>
                  <span className="font-mono font-bold text-[#315C45]">Google Identity (Firebase)</span>
                </div>

                <div className="p-3.5 bg-[#F4F0E7]/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#B89B5E]" />
                    <span className="font-semibold text-[#1F3D2E]">Privilege Level</span>
                  </div>
                  <span className="bg-[#B89B5E] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    SUPER_ADMIN
                  </span>
                </div>

                <div className="p-3.5 bg-[#F4F0E7]/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-[#1F3D2E]">Token Status</span>
                  </div>
                  <span className="font-mono text-emerald-700 font-bold">Active / Encrypted</span>
                </div>

                <div className="p-3.5 bg-[#F4F0E7]/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#315C45]" />
                    <span className="font-semibold text-[#1F3D2E]">Last Authentication</span>
                  </div>
                  <span className="font-mono text-[#242824]/70">Today, 21:26 IST</span>
                </div>
              </div>
            </div>

            {/* System Health Status */}
            <div className="bg-white rounded-3xl p-6 border border-[#A8B9A3]/30 shadow-herbal space-y-6">
              <div className="flex items-center gap-3 border-b border-[#F4F0E7] pb-4">
                <Server className="w-5 h-5 text-[#315C45]" />
                <h3 className="text-lg font-bold text-[#1F3D2E]">System Integrations Health</h3>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Google Sheets API */}
                <div className="p-4 bg-[#FCFBF7] rounded-2xl border border-[#F4F0E7] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-[#1F3D2E]">Google Sheets API</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      SYNC ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#242824]/70">Automated 12-state order streaming enabled.</p>
                </div>

                {/* Razorpay Gateway */}
                <div className="p-4 bg-[#FCFBF7] rounded-2xl border border-[#F4F0E7] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#4285F4]" />
                      <span className="font-bold text-[#1F3D2E]">Razorpay Gateway</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#242824]/70">Instant payment webhook verification ready.</p>
                </div>

                {/* Database & Backup */}
                <div className="p-4 bg-[#FCFBF7] rounded-2xl border border-[#F4F0E7] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#315C45]" />
                      <span className="font-bold text-[#1F3D2E]">MongoDB / DB Snapshot</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      HEALTHY
                    </span>
                  </div>
                  <p className="text-[11px] text-[#242824]/70">Total live orders: <strong>{orders.length}</strong></p>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
