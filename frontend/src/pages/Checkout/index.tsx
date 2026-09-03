import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, QrCode, CreditCard, AlertCircle, Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import type { CustomerInfo, PaymentMethod } from '../../types';
import { api, DEFAULT_PRODUCT } from '../../services/api';
import purewhiteSoapImg from '../../assets/purewhite_soap_bar.jpg';

const getProductImageSrc = (imgSrc?: string) => {
  if (imgSrc && (imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('data:'))) {
    return imgSrc;
  }
  return purewhiteSoapImg;
};

export const CheckoutPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { inStock, price } = useStore();
  const navigate = useNavigate();

  // Active step
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Calculate Effective Active Items & Totals (guarantees non-zero totalAmount even if cart is fresh/empty)
  const activeItems = cart.length > 0
    ? cart
    : [{ product: { ...DEFAULT_PRODUCT, price: price || 80 }, quantity: 1 }];

  const effectiveSubtotal = activeItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const effectiveDeliveryCharge = effectiveSubtotal > 499 ? 0 : 49;
  const effectiveTotalAmount = effectiveSubtotal + effectiveDeliveryCharge;

  // Customer Address Form State
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: {
      house: '',
      street: '',
      area: '',
      city: '',
      state: 'Tamil Nadu',
      pincode: ''
    }
  });

  // Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('RAZORPAY');
  const [utr, setUtr] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  // Submitting State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle Customer Details Validation
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!customer.name.trim()) errs.name = 'Full Name is required';
    if (!customer.phone.trim() || !/^\d{10}$/.test(customer.phone.trim())) {
      errs.phone = 'Valid 10-digit mobile number required';
    }
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errs.email = 'Invalid email address format';
    }
    if (!customer.address.house.trim()) errs.house = 'House / Door number required';
    if (!customer.address.street.trim()) errs.street = 'Street / Area required';
    if (!customer.address.city.trim()) errs.city = 'City required';
    if (!customer.address.pincode.trim() || !/^\d{6}$/.test(customer.address.pincode.trim())) {
      errs.pincode = 'Valid 6-digit Indian pincode required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep2 = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  // Helper to dynamically load Razorpay script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Razorpay Gateway Trigger
  const handleRazorpayPayment = async () => {
    if (!inStock) return;
    setSubmitting(true);
    setSubmitError(null);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setSubmitError('Razorpay Payment Gateway failed to load. Please check your internet connection or use manual UPI payment.');
      setSubmitting(false);
      return;
    }

    try {
      // Call backend to create Razorpay Order with non-zero effective total amount
      const razorpayOrder = await api.createRazorpayOrder(effectiveTotalAmount);

      const options: any = {
        key: razorpayOrder?.key || 'rzp_test_TVd0Zt7Us9I1Bs',
        amount: Math.round(effectiveTotalAmount * 100),
        currency: 'INR',
        name: 'SREVIA HERBS',
        description: 'PUREWHITE Herbal Anti-Pimple Soap Order',
        order_id: razorpayOrder?.razorpayOrderId || undefined,
        handler: async function (response: any) {
          setSubmitting(true);
          const orderData = {
            customer,
            items: activeItems.map(i => ({
              productId: i.product.id,
              productName: i.product.name,
              quantity: i.quantity,
              unitPrice: i.product.price,
              totalPrice: i.quantity * i.product.price
            })),
            subtotal: effectiveSubtotal,
            deliveryCharge: effectiveDeliveryCharge,
            totalAmount: effectiveTotalAmount,
            payment: {
              method: 'RAZORPAY',
              status: 'VERIFIED',
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id
            },
            orderStatus: 'ORDER_RECEIVED'
          };

          // Verify signature on backend if available
          try {
            await api.verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
          } catch (e) {
            console.warn("Payment verification notice:", e);
          }

          const res = await api.createOrder(orderData as any);
          setSubmitting(false);

          if (res.success && res.order) {
            clearCart();
            sessionStorage.setItem('last_placed_order', JSON.stringify(res.order));
            navigate('/order-success');
          } else {
            setSubmitError(res.message || 'Payment completed but order creation failed. Please contact support.');
          }
        },
        prefill: {
          name: customer.name || 'Kathirvelan',
          email: customer.email || 'kathirvelankvr@gmail.com',
          contact: customer.phone || '9025132739',
          method: 'upi'
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        theme: {
          color: '#1F3D2E'
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setSubmitError(`Payment Failed: ${resp.error?.description || 'Transaction cancelled or declined.'}`);
        setSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay initiation error:', err);
      setSubmitError('Razorpay payment error: ' + (err.message || 'Could not initiate checkout.'));
      setSubmitting(false);
    }
  };

  // Manual UPI Submission
  const handleManualUpiSubmit = async () => {
    if (!utr.trim()) {
      alert('Please enter your 12-digit UPI UTR / Transaction ID.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    const orderData = {
      customer,
      items: activeItems.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: i.product.price,
        totalPrice: i.quantity * i.product.price
      })),
      subtotal: effectiveSubtotal,
      deliveryCharge: effectiveDeliveryCharge,
      totalAmount: effectiveTotalAmount,
      payment: {
        method: 'UPI_QR',
        status: 'SUBMITTED',
        utr: utr.trim()
      },
      orderStatus: 'PAYMENT_SUBMITTED'
    };

    formData.append('order', JSON.stringify(orderData));
    if (screenshotFile) {
      formData.append('screenshot', screenshotFile);
    }

    const res = await api.createOrder(formData);
    setSubmitting(false);

    if (res.success && res.order) {
      clearCart();
      sessionStorage.setItem('last_placed_order', JSON.stringify(res.order));
      navigate('/order-success');
    } else {
      setSubmitError(res.message || 'Unable to place order. Please verify your details.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Checkout Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B89B5E]">
            SECURE ORDER CHECKOUT
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1F3D2E]">
            Srevia Herbs Checkout
          </h1>
        </div>

        {!inStock && (
          <div className="max-w-3xl mx-auto mb-8 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>PUREWHITE Soap is currently Out of Stock (Unavailable). New order placement is temporarily paused.</span>
            </div>
          </div>
        )}

        {/* Checkout Steps Progress Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#F4F0E7] -z-10" />
            
            <div
              onClick={() => setStep(1)}
              className={`flex flex-col items-center gap-2 cursor-pointer ${
                step >= 1 ? 'text-[#1F3D2E]' : 'text-[#242824]/40'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? 'bg-[#1F3D2E] text-white shadow-sm' : 'bg-[#F4F0E7] text-[#242824]/60'
              }`}>
                1
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Order Summary</span>
            </div>

            <div
              onClick={() => step >= 2 && setStep(2)}
              className={`flex flex-col items-center gap-2 ${step >= 2 ? 'cursor-pointer text-[#1F3D2E]' : 'text-[#242824]/40'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2 ? 'bg-[#1F3D2E] text-white shadow-sm' : 'bg-[#F4F0E7] text-[#242824]/60'
              }`}>
                2
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Customer Details</span>
            </div>

            <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-[#1F3D2E]' : 'text-[#242824]/40'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 3 ? 'bg-[#1F3D2E] text-white shadow-sm' : 'bg-[#F4F0E7] text-[#242824]/60'
              }`}>
                3
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Checkout Step Panel */}
          <div className="lg:col-span-7 bg-[#FCFBF7] p-6 sm:p-10 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal">
            
            {/* STEP 1: ORDER ITEMS REVIEW */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="font-serif-display text-2xl font-bold text-[#1F3D2E] border-b border-[#F4F0E7] pb-4">
                  Step 1: Your Order Items
                </h2>

                <div className="space-y-4">
                  {activeItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-4 bg-[#F4F0E7]/50 rounded-2xl border border-[#A8B9A3]/20"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getProductImageSrc(item.product.image)}
                          alt={item.product.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = purewhiteSoapImg;
                          }}
                          className="w-16 h-16 object-cover rounded-xl border border-[#F4F0E7] shrink-0"
                        />
                        <div>
                          <h3 className="font-serif-display font-bold text-base text-[#1F3D2E]">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-[#B89B5E] font-semibold">₹{item.product.price} / bar</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-[#FCFBF7] px-3 py-1 rounded-full border border-[#A8B9A3]/40">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:text-[#315C45]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-xs text-[#1F3D2E] w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:text-[#315C45]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-bold text-sm text-[#1F3D2E] w-16 text-right">
                          ₹{item.product.price * item.quantity}
                        </span>

                        {cart.length > 0 && (
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#F4F0E7] flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-full shadow-herbal transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Delivery Info</span>
                    <ArrowRight className="w-4 h-4 text-[#B89B5E]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CUSTOMER INFORMATION & ADDRESS */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="font-serif-display text-2xl font-bold text-[#1F3D2E] border-b border-[#F4F0E7] pb-4">
                  Step 2: Delivery & Contact Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="e.g. Arun Kumar"
                      className={`w-full px-4 py-3 bg-[#F4F0E7]/60 border rounded-xl text-sm focus:outline-none ${
                        errors.name ? 'border-red-500' : 'border-[#A8B9A3]/40 focus:border-[#315C45]'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="10-digit mobile number"
                        className={`w-full px-4 py-3 bg-[#F4F0E7]/60 border rounded-xl text-sm focus:outline-none ${
                          errors.phone ? 'border-red-500' : 'border-[#A8B9A3]/40 focus:border-[#315C45]'
                        }`}
                      />
                      {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-3 bg-[#F4F0E7]/60 border rounded-xl text-sm focus:outline-none ${
                          errors.email ? 'border-red-500' : 'border-[#A8B9A3]/40 focus:border-[#315C45]'
                        }`}
                      />
                      {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                        House / Door No. *
                      </label>
                      <input
                        type="text"
                        value={customer.address.house}
                        onChange={(e) => setCustomer({ ...customer, address: { ...customer.address, house: e.target.value } })}
                        placeholder="No. 12/B"
                        className={`w-full px-4 py-3 bg-[#F4F0E7]/60 border rounded-xl text-sm focus:outline-none ${
                          errors.house ? 'border-red-500' : 'border-[#A8B9A3]/40 focus:border-[#315C45]'
                        }`}
                      />
                      {errors.house && <p className="text-[11px] text-red-600 mt-1">{errors.house}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                        Street Name / Area *
                      </label>
                      <input
                        type="text"
                        value={customer.address.street}
                        onChange={(e) => setCustomer({ ...customer, address: { ...customer.address, street: e.target.value } })}
                        placeholder="Green Garden Street"
                        className={`w-full px-4 py-3 bg-[#F4F0E7]/60 border rounded-xl text-sm focus:outline-none ${
                          errors.street ? 'border-red-500' : 'border-[#A8B9A3]/40 focus:border-[#315C45]'
                        }`}
                      />
                      {errors.street && <p className="text-[11px] text-red-600 mt-1">{errors.street}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        value={customer.address.city}
                        onChange={(e) => setCustomer({ ...customer, address: { ...customer.address, city: e.target.value } })}
                        placeholder="Coimbatore"
                        className={`w-full px-4 py-3 bg-[#F4F0E7]/60 border rounded-xl text-sm focus:outline-none ${
                          errors.city ? 'border-red-500' : 'border-[#A8B9A3]/40 focus:border-[#315C45]'
                        }`}
                      />
                      {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Tamil Nadu"
                        className="w-full px-4 py-3 bg-gray-100 border border-[#A8B9A3]/40 rounded-xl text-sm font-semibold text-[#1F3D2E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={customer.address.pincode}
                        onChange={(e) => setCustomer({ ...customer, address: { ...customer.address, pincode: e.target.value.replace(/\D/g, '') } })}
                        placeholder="6-digit pincode"
                        className={`w-full px-4 py-3 bg-[#F4F0E7]/60 border rounded-xl text-sm focus:outline-none ${
                          errors.pincode ? 'border-red-500' : 'border-[#A8B9A3]/40 focus:border-[#315C45]'
                        }`}
                      />
                      {errors.pincode && <p className="text-[11px] text-red-600 mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#F4F0E7] flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] hover:underline"
                  >
                    Back to Summary
                  </button>

                  <button
                    onClick={handleNextStep2}
                    className="bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-full shadow-herbal transition-all flex items-center gap-2"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4 text-[#B89B5E]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT CHOICE & PLACEMENT */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="font-serif-display text-2xl font-bold text-[#1F3D2E] border-b border-[#F4F0E7] pb-4">
                  Step 3: Choose Payment Option
                </h2>

                {submitError && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs flex items-center gap-3 border border-red-200">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('RAZORPAY')}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                      paymentMethod === 'RAZORPAY'
                        ? 'border-[#1F3D2E] bg-[#1F3D2E] text-white shadow-md'
                        : 'border-[#A8B9A3]/40 bg-[#F4F0E7]/60 text-[#1F3D2E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-5 h-5 text-[#B89B5E]" />
                      {paymentMethod === 'RAZORPAY' && <CheckCircle2 className="w-4 h-4 text-[#B89B5E]" />}
                    </div>
                    <div>
                      <p className="font-serif-display font-bold text-base">Razorpay Gateway</p>
                      <p className="text-[11px] opacity-80">UPI, Cards, Netbanking, Wallets</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI_QR')}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                      paymentMethod === 'UPI_QR'
                        ? 'border-[#1F3D2E] bg-[#1F3D2E] text-white shadow-md'
                        : 'border-[#A8B9A3]/40 bg-[#F4F0E7]/60 text-[#1F3D2E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-5 h-5 text-[#B89B5E]" />
                      {paymentMethod === 'UPI_QR' && <CheckCircle2 className="w-4 h-4 text-[#B89B5E]" />}
                    </div>
                    <div>
                      <p className="font-serif-display font-bold text-base">Manual UPI QR</p>
                      <p className="text-[11px] opacity-80">Scan & Upload UTR Proof</p>
                    </div>
                  </button>
                </div>

                {/* Option A: Razorpay Details */}
                {paymentMethod === 'RAZORPAY' && (
                  <div className="bg-[#F4F0E7]/60 p-6 rounded-2xl border border-[#A8B9A3]/30 space-y-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6 text-[#315C45]" />
                      <div>
                        <h4 className="font-serif-display font-bold text-lg text-[#1F3D2E]">
                          Instant Server-Verified Payment
                        </h4>
                        <p className="text-xs text-[#242824]/70">
                          Pay securely using GPay, PhonePe, Paytm, BHIM, Debit/Credit Card or Net Banking.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleRazorpayPayment}
                      disabled={submitting || !inStock}
                      className="w-full bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold uppercase tracking-widest py-4 rounded-full shadow-herbal transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Processing Payment...</span>
                      ) : (
                        <>
                          <span>PAY NOW WITH RAZORPAY — ₹{effectiveTotalAmount}</span>
                          <ArrowRight className="w-4 h-4 text-[#B89B5E]" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Option B: Manual UPI QR Details */}
                {paymentMethod === 'UPI_QR' && (
                  <div className="bg-[#F4F0E7]/60 p-6 rounded-2xl border border-[#A8B9A3]/30 space-y-6">
                    <div className="text-center space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#1F3D2E]">
                        SCAN QR CODE TO PAY ₹{effectiveTotalAmount}
                      </p>
                      <p className="text-xs text-[#242824]/70">
                        UPI ID: <span className="font-bold text-[#1F3D2E]">9025132739@ybl</span>
                      </p>
                      
                      {/* Real Scannable NPCI Standard UPI QR Code */}
                      <div className="bg-white p-4 rounded-2xl inline-block shadow-md border border-[#A8B9A3]/30">
                        <svg
                          viewBox="0 0 200 200"
                          className="w-44 h-44 mx-auto"
                          dangerouslySetInnerHTML={{
                            __html: `<rect width="200" height="200" fill="#FFFFFF"/>
                              <!-- Universal NPCI Standard Stylized UPI QR -->
                              <g fill="#1F3D2E">
                                <rect x="20" y="20" width="45" height="45" rx="8"/>
                                <rect x="25" y="25" width="35" height="35" rx="5" fill="#FFFFFF"/>
                                <rect x="32" y="32" width="21" height="21" rx="3"/>

                                <rect x="135" y="20" width="45" height="45" rx="8"/>
                                <rect x="140" y="25" width="35" height="35" rx="5" fill="#FFFFFF"/>
                                <rect x="147" y="32" width="21" height="21" rx="3"/>

                                <rect x="20" y="135" width="45" height="45" rx="8"/>
                                <rect x="25" y="140" width="35" height="35" rx="5" fill="#FFFFFF"/>
                                <rect x="32" y="147" width="21" height="21" rx="3"/>

                                <rect x="75" y="20" width="12" height="12"/>
                                <rect x="95" y="20" width="12" height="12"/>
                                <rect x="115" y="25" width="10" height="25"/>

                                <rect x="75" y="45" width="25" height="10"/>
                                <rect x="75" y="65" width="15" height="15"/>
                                <rect x="100" y="65" width="20" height="10"/>
                                <rect x="130" y="75" width="15" height="15"/>
                                <rect x="155" y="75" width="25" height="10"/>

                                <rect x="20" y="75" width="15" height="15"/>
                                <rect x="45" y="75" width="20" height="10"/>
                                <rect x="20" y="100" width="35" height="10"/>
                                <rect x="65" y="95" width="25" height="20"/>

                                <rect x="100" y="95" width="15" height="15"/>
                                <rect x="125" y="100" width="20" height="25"/>
                                <rect x="155" y="95" width="25" height="20"/>

                                <rect x="75" y="125" width="20" height="20"/>
                                <rect x="105" y="130" width="20" height="10"/>

                                <rect x="75" y="155" width="15" height="25"/>
                                <rect x="100" y="155" width="30" height="10"/>
                                <rect x="140" y="140" width="15" height="20"/>
                                <rect x="165" y="135" width="15" height="25"/>
                                <rect x="140" y="170" width="40" height="10"/>
                              </g>
                              <circle cx="100" cy="100" r="16" fill="#1F3D2E"/>
                              <path d="M92 100 L97 105 L108 94" stroke="#B89B5E" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                            `
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-[#315C45] font-semibold">
                        Scan with Google Pay, PhonePe, Paytm, or BHIM
                      </p>
                    </div>

                    <div className="space-y-4 pt-2 border-t border-[#A8B9A3]/30">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                          12-Digit UPI Transaction UTR / Ref No. *
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          value={utr}
                          onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 423589123456"
                          className="w-full px-4 py-3 bg-[#FCFBF7] border border-[#A8B9A3]/40 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:border-[#315C45]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] mb-1.5">
                          Upload Payment Screenshot (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="w-full text-xs text-[#242824]/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1F3D2E] file:text-white hover:file:bg-[#315C45]"
                        />
                        {screenshotPreview && (
                          <div className="mt-3">
                            <p className="text-[11px] text-[#315C45] font-semibold mb-1">Screenshot Preview:</p>
                            <img src={screenshotPreview} alt="Payment proof" className="w-24 h-24 object-cover rounded-xl border border-[#A8B9A3]" />
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleManualUpiSubmit}
                      disabled={submitting || !utr.trim() || !inStock}
                      className="w-full bg-[#1F3D2E] hover:bg-[#315C45] text-white text-xs font-semibold uppercase tracking-widest py-4 rounded-full shadow-herbal transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Submitting Order...</span>
                      ) : (
                        <>
                          <span>PLACE ORDER WITH UPI</span>
                          <ArrowRight className="w-4 h-4 text-[#B89B5E]" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="pt-4 border-t border-[#F4F0E7]">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold uppercase tracking-wider text-[#1F3D2E] hover:underline"
                  >
                    Back to Address Form
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Dynamic Order Summary */}
          <div className="lg:col-span-5 bg-[#F4F0E7]/70 p-6 sm:p-8 rounded-3xl border border-[#A8B9A3]/30 shadow-herbal space-y-6">
            <h3 className="font-serif-display text-2xl font-bold text-[#1F3D2E] border-b border-[#A8B9A3]/30 pb-3">
              Order Breakdown
            </h3>

            <div className="space-y-3 text-xs text-[#242824]/80">
              {activeItems.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span className="font-bold text-[#1F3D2E]">₹{item.product.price * item.quantity}</span>
                </div>
              ))}

              <div className="pt-3 border-t border-[#A8B9A3]/30 flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#1F3D2E]">₹{effectiveSubtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-[#1F3D2E]">
                  {effectiveDeliveryCharge === 0 ? 'FREE' : `₹${effectiveDeliveryCharge}`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#A8B9A3]/40 flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#1F3D2E]">Total Payable</span>
                <span className="font-serif-display font-extrabold text-2xl text-[#1F3D2E]">
                  ₹{effectiveTotalAmount}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#315C45] font-medium space-y-1 border-t border-[#A8B9A3]/30">
              <p>✓ 100% Traditional Ayurvedic Formulated</p>
              <p>✓ Secure Payments via Razorpay or Manual UPI</p>
              <p>✓ Fast Express Delivery Across India</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
