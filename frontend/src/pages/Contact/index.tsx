import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, User } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { submitContactForm } from '../../services/api';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Product Enquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitContactForm(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'Product Enquiry', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-32 pb-24">
      <SEO
        title="Contact Kathirvelan & Srevia Herbs | Customer Support & Inquiries"
        description="Get in touch with Kathirvelan and the SREVIA HERBS team online. Phone: +91 9025132739, Email: kathirvelankvr@gmail.com."
        keywords="Contact Srevia Herbs, Kathirvelan contact number, PUREWHITE soap customer support"
        canonicalUrl="https://sreviaherbs.com/contact"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
            GET IN TOUCH WITH US
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1F3D2E]">
            Contact Kathirvelan & Srevia Herbs
          </h1>
          <p className="text-sm text-[#242824]/70">
            Have questions about PUREWHITE soap or wholesale inquiries? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#1F3D2E] text-[#FCFBF7] p-8 sm:p-10 rounded-3xl space-y-8 shadow-herbal">
            <div>
              <h2 className="text-2xl font-bold text-[#FCFBF7] mb-2">Direct Contact</h2>
              <p className="text-xs text-[#A8B9A3] leading-relaxed">
                Connect directly with Kathirvelan for product support, customer care, or order assistance.
              </p>
            </div>

            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#315C45] flex items-center justify-center text-[#B89B5E] shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[#B89B5E] uppercase tracking-wider">Contact Person</h3>
                  <p className="font-medium text-white text-base">Kathirvelan</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#315C45] flex items-center justify-center text-[#B89B5E] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[#B89B5E] uppercase tracking-wider">Phone / WhatsApp</h3>
                  <a href="tel:9025132739" className="text-white hover:text-[#B89B5E] transition-colors font-medium">
                    +91 9025132739
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#315C45] flex items-center justify-center text-[#B89B5E] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[#B89B5E] uppercase tracking-wider">Email Address</h3>
                  <a href="mailto:kathirvelankvr@gmail.com" className="text-white hover:text-[#B89B5E] transition-colors font-medium">
                    kathirvelankvr@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#315C45] flex items-center justify-center text-[#B89B5E] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[#B89B5E] uppercase tracking-wider">Store Presence</h3>
                  <p className="text-xs text-white font-semibold leading-relaxed">
                    100% Online Store • Pan-India Shipping
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#315C45] text-xs text-[#A8B9A3] space-y-1">
              <p className="font-medium text-white">Customer Support Hours:</p>
              <p>Mon–Fri: 3:00 PM – 7:00 PM IST</p>
              <p>Sat: 10:00 AM – 6:00 PM IST</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#FCFBF7] p-8 sm:p-10 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#315C45] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#1F3D2E]">Message Sent Successfully!</h3>
                <p className="text-sm text-[#242824]/70 max-w-md mx-auto">
                  Thank you for reaching out, <span className="font-semibold">{formData.name || 'Friend'}</span>. Kathirvelan will get back to you shortly at <span className="font-semibold">{formData.email}</span>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-[#315C45] hover:bg-[#1F3D2E] text-white font-semibold text-xs uppercase tracking-wider px-8 py-3 rounded-full transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1F3D2E] mb-1">Send a Message</h2>
                  <p className="text-xs text-[#242824]/70">Fill out the form below to message Kathirvelan directly.</p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#315C45] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9025132739"
                      className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#315C45] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#315C45] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                    Subject / Enquiry Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Product enquiry / Wholesale inquiry"
                    className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#315C45] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2E] mb-2">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you today?"
                    className="w-full bg-[#F4F0E7]/60 border border-[#A8B9A3]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#315C45] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1F3D2E] hover:bg-[#315C45] text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-full shadow-herbal transition-all flex items-center justify-center gap-2 active-press disabled:opacity-50"
                >
                  {loading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message to Kathirvelan</span>
                      <Send className="w-4 h-4 text-[#B89B5E]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Support & Policy Sections (FAQ, Returns, Privacy Policy, Terms of Service) */}
        <div className="mt-20 pt-16 border-t border-[#A8B9A3]/30 space-y-12">
          
          {/* FAQ Section */}
          <div id="faq" className="bg-[#F4F0E7]/60 p-8 sm:p-10 rounded-3xl border border-[#A8B9A3]/30 space-y-6 scroll-mt-28">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B89B5E]">FREQUENTLY ASKED QUESTIONS</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F3D2E]">Help & FAQ</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#242824]/85 leading-relaxed">
              <div className="bg-[#FCFBF7] p-5 rounded-2xl border border-[#A8B9A3]/20 space-y-2">
                <h3 className="font-bold text-sm text-[#1F3D2E]">How long does shipping take?</h3>
                <p>Orders are dispatched within 24 hours. Delivery typically takes 2–5 business days across India.</p>
              </div>
              <div className="bg-[#FCFBF7] p-5 rounded-2xl border border-[#A8B9A3]/20 space-y-2">
                <h3 className="font-bold text-sm text-[#1F3D2E]">Is PUREWHITE suitable for sensitive skin?</h3>
                <p>Yes, formulated with 100% natural plant oils, virgin coconut oil, neem, and holy basil without harsh sulfates.</p>
              </div>
              <div className="bg-[#FCFBF7] p-5 rounded-2xl border border-[#A8B9A3]/20 space-y-2">
                <h3 className="font-bold text-sm text-[#1F3D2E]">How can I track my order?</h3>
                <p>Use your Unique Order ID and phone number on our <a href="/track-order" className="underline font-semibold text-[#1F3D2E]">Track Order page</a>.</p>
              </div>
              <div className="bg-[#FCFBF7] p-5 rounded-2xl border border-[#A8B9A3]/20 space-y-2">
                <h3 className="font-bold text-sm text-[#1F3D2E]">What payment methods are supported?</h3>
                <p>We accept Razorpay (UPI, GPay, PhonePe, Cards, NetBanking) and Manual UPI QR Code payments.</p>
              </div>
            </div>
          </div>

          {/* Returns & Refund Policy */}
          <div id="returns" className="bg-[#FCFBF7] p-8 sm:p-10 rounded-3xl border border-[#A8B9A3]/30 space-y-4 scroll-mt-28 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F3D2E]">Returns & Replacement Policy</h2>
            <p className="text-xs text-[#242824]/80 leading-relaxed font-light">
              Due to personal care hygiene standards, unopened items can be returned or exchanged within 7 days of delivery if defective or damaged during transit. Contact Kathirvelan via WhatsApp (+91 9025132739) or email for immediate replacement.
            </p>
          </div>

          {/* Privacy Policy */}
          <div id="privacy" className="bg-[#FCFBF7] p-8 sm:p-10 rounded-3xl border border-[#A8B9A3]/30 space-y-4 scroll-mt-28 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F3D2E]">Privacy Policy</h2>
            <p className="text-xs text-[#242824]/80 leading-relaxed font-light">
              Srevia Herbs values customer privacy. We collect customer name, shipping address, phone number, and email solely to process orders, send delivery updates, and issue order invoices. We never share or sell customer data to third-party advertisers.
            </p>
          </div>

          {/* Terms of Service */}
          <div id="terms" className="bg-[#FCFBF7] p-8 sm:p-10 rounded-3xl border border-[#A8B9A3]/30 space-y-4 scroll-mt-28 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F3D2E]">Terms of Service</h2>
            <p className="text-xs text-[#242824]/80 leading-relaxed font-light">
              By purchasing from Srevia Herbs, you agree to our order processing and shipping terms. All products are 100% handcrafted herbal skincare soaps. Price: ₹80 per 100g bar (inclusive of taxes).
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export const ContactPage = Contact;

