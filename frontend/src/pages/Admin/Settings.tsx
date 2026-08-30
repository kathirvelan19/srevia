import React, { useState } from 'react';
import { Save, CheckCircle2, QrCode, FileSpreadsheet, Phone, Mail, User } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [upiId, setUpiId] = useState('9025132739@upi');
  const [contactName, setContactName] = useState('Kathirvelan');
  const [contactPhone, setContactPhone] = useState('9025132739');
  const [contactEmail, setContactEmail] = useState('kathirvelankvr@gmail.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('srevia_upi_id', upiId);
    localStorage.setItem('srevia_contact_name', contactName);
    localStorage.setItem('srevia_contact_phone', contactPhone);
    localStorage.setItem('srevia_contact_email', contactEmail);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1F3D2E]">Business & Payment Settings</h1>
        <p className="text-xs text-[#242824]/70 mt-1">Configure UPI ID, Admin Contact Details, and Google Sheets integration.</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Contact Info Settings */}
        <div className="bg-[#FCFBF7] p-6 sm:p-8 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F4F0E7] pb-4">
            <User className="w-5 h-5 text-[#315C45]" />
            <h2 className="text-xl font-bold text-[#1F3D2E]">Contact Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                Business Owner / Contact Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#315C45] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#315C45]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#315C45] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#315C45]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#315C45] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#315C45]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* UPI QR Payment Settings */}
        <div className="bg-[#FCFBF7] p-6 sm:p-8 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F4F0E7] pb-4">
            <QrCode className="w-5 h-5 text-[#315C45]" />
            <h2 className="text-xl font-bold text-[#1F3D2E]">UPI Payment QR Settings</h2>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
              Business UPI Virtual Payment Address (VPA)
            </label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. 9025132739@upi"
              className="w-full sm:w-96 bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#315C45]"
            />
            <p className="text-xs text-[#242824]/60 mt-2">
              This UPI ID is rendered on the Checkout page for manual QR payment scans.
            </p>
          </div>
        </div>

        {/* Google Sheets API Config Summary */}
        <div className="bg-[#FCFBF7] p-6 sm:p-8 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F4F0E7] pb-4">
            <FileSpreadsheet className="w-5 h-5 text-[#315C45]" />
            <h2 className="text-xl font-bold text-[#1F3D2E]">Google Sheets API Status</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F4F0E7] rounded-xl border border-[#A8B9A3]/30">
              <span className="font-semibold text-[#1F3D2E]">Sheet ID Status:</span>
              <p className="text-[#242824]/70 mt-1 font-mono">1BxiMVs0XRm5nSy2Wdm4-001SreviaHerbsSheetID</p>
            </div>
            <div className="p-4 bg-[#F4F0E7] rounded-xl border border-[#A8B9A3]/30">
              <span className="font-semibold text-[#1F3D2E]">Service Account:</span>
              <p className="text-[#242824]/70 mt-1 font-mono">srevia-sync@sreviaherbs.iam.gserviceaccount.com</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#1F3D2E] hover:bg-[#315C45] text-white font-semibold text-xs uppercase tracking-widest px-9 py-4 rounded-full shadow-herbal transition-all flex items-center gap-2 active-press"
        >
          <Save className="w-4 h-4 text-[#B89B5E]" />
          <span>Save Settings</span>
        </button>

      </form>
    </div>
  );
};

export const AdminSettingsPage = AdminSettings;

