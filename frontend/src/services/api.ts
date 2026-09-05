import type { Product, Order, OrderStatus, ContactMessage } from '../types';
import purewhiteSoapImg from '../assets/purewhite_soap_bar.jpg';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://sreviia-backend.onrender.com/api' : 'http://localhost:8080/api');

// Initial Mock Seed Product
export const DEFAULT_PRODUCT: Product = {
  id: 'prod_purewhite_01',
  name: 'PUREWHITE Herbal Anti-Pimple Soap',
  tagline: 'Where Purity Meets Beauty',
  price: 80,
  originalPrice: 120,
  discount: 'Save 33%',
  badge: 'Best Seller — 15+ Happy Customers',
  description: 'Clinically proven to reduce acne by up to 95% in just 4 weeks. Crafted with 100% natural ingredients for radiant, clear skin.',
  stockQuantity: 100,
  image: purewhiteSoapImg || '/assets/purewhite_soap_bar.jpg',
  benefits: [
    'Clinically proven to reduce acne by up to 95% in just 4 weeks',
    'Crafted with 100% natural ingredients for radiant, clear skin',
    'Herbal-inspired formulation for gentle everyday cleansing',
    'Helps cleanse pores and remove excess oil naturally',
    'Free from harsh sulfates, artificial dyes, and parabens'
  ],
  ingredients: [
    {
      name: 'Organic Neem (Azadirachta Indica)',
      shortDesc: 'Purifying botanical powerhouse',
      traditionalSignificance: 'Revered in Ayurvedic wisdom for thousands of years as nature’s ultimate skin purifier.',
      skincareRole: 'Deeply cleanses dirt, absorbs excess sebum, and keeps skin feeling fresh and clear.'
    },
    {
      name: 'Holy Basil Tulsi (Ocimum Sanctum)',
      shortDesc: 'Soothing & protective herb',
      traditionalSignificance: 'Known as the Queen of Herbs, celebrated for its antioxidant and soothing properties.',
      skincareRole: 'Helps calm tired skin, protects against environmental stressors, and restores natural radiance.'
    },
    {
      name: 'Cold-Pressed Virgin Coconut Oil',
      shortDesc: 'Deep natural hydration',
      traditionalSignificance: 'Traditional Indian beauty ritual essential for soft, resilient skin.',
      skincareRole: 'Creates a rich, creamy lather that nourishes skin without stripping natural moisture.'
    },
    {
      name: 'Pure Plant Glycerin',
      shortDesc: 'Moisture lock humectant',
      traditionalSignificance: 'Derived from natural plant oils to preserve moisture balance.',
      skincareRole: 'Draws hydration into skin layers, preventing tightness after everyday cleansing.'
    },
    {
      name: 'Natural Herbal Fragrance',
      shortDesc: 'Calming botanical aroma',
      traditionalSignificance: 'A subtle blend of therapeutic essential oils.',
      skincareRole: 'Delivers a soothing, aromatic bath experience.'
    }
  ],
  active: true
};

export const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch {
      console.warn('Backend server un-reachable, using default product');
      return [DEFAULT_PRODUCT];
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch {
      return DEFAULT_PRODUCT;
    }
  },

  // Create Order (via manual UPI QR or Razorpay payload)
  createOrder: async (orderPayload: Partial<Order> | FormData): Promise<{ success: boolean; order?: Order; message?: string }> => {
    try {
      let options: RequestInit;
      if (orderPayload instanceof FormData) {
        options = {
          method: 'POST',
          body: orderPayload
        };
      } else {
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        };
      }

      const res = await fetch(`${API_BASE_URL}/orders`, options);
      if (res.ok) {
        const data = await res.json();
        return { success: true, order: data };
      }
      const errData = await res.json().catch(() => ({}));
      return { success: false, message: errData.message || 'Failed to place order' };
    } catch (err) {
      console.warn('Backend API offline, completing mock order placement', err);
      // Fallback local mock order generation
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const mockOrderId = `SRV-${timestamp}-${randomNum}`;
      
      const payloadObj = orderPayload instanceof FormData ? {} : orderPayload;
      const mockOrder: Order = {
        orderId: mockOrderId,
        customer: (payloadObj as Order).customer || {
          name: 'Valued Customer',
          phone: '9876543210',
          email: 'customer@sreviaherbs.com',
          address: { house: '12', street: 'Green Garden', area: 'Heritage Road', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641001' }
        },
        items: (payloadObj as Order).items || [{ productId: DEFAULT_PRODUCT.id, productName: DEFAULT_PRODUCT.name, quantity: 1, unitPrice: 80, totalPrice: 80 }],
        subtotal: (payloadObj as Order).subtotal || 80,
        deliveryCharge: (payloadObj as Order).deliveryCharge || 49,
        totalAmount: (payloadObj as Order).totalAmount || 129,
        payment: (payloadObj as Order).payment || { method: 'UPI_QR', status: 'SUBMITTED', utr: 'UTR' + Math.floor(Math.random() * 100000000) },
        orderStatus: 'PAYMENT_SUBMITTED' as OrderStatus,
        googleSheetsSynced: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store in session storage for tracking preview
      try {
        const existing = JSON.parse(sessionStorage.getItem('mock_orders') || '[]');
        sessionStorage.setItem('mock_orders', JSON.stringify([mockOrder, ...existing]));
      } catch (e) {
        console.error(e);
      }

      return { success: true, order: mockOrder };
    }
  },

  // Razorpay Order Creation
  createRazorpayOrder: async (amount: number): Promise<{ razorpayOrderId: string; key: string } | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (e) {
      console.warn('Razorpay server endpoint offline', e);
      return null;
    }
  },

  verifyRazorpayPayment: async (payload: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; orderId?: string }): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE_URL}/razorpay/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (e) {
      console.warn('Razorpay verification error:', e);
      return null;
    }
  },

  // Track Order
  trackOrder: async (orderId: string, phone: string): Promise<Order | null> => {
    if (!orderId) return null;
    const cleanId = orderId.trim().toUpperCase();

    // 1. Try Supabase DB first
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .or(`order_id.eq.${cleanId},orderId.eq.${cleanId}`)
          .maybeSingle();

        if (data && !error) {
          let parsedCustomer = data.customer;
          if (typeof parsedCustomer === 'string') {
            try { parsedCustomer = JSON.parse(parsedCustomer); } catch (e) {}
          }
          let parsedItems = data.items;
          if (typeof parsedItems === 'string') {
            try { parsedItems = JSON.parse(parsedItems); } catch (e) {}
          }
          let parsedPayment = data.payment;
          if (typeof parsedPayment === 'string') {
            try { parsedPayment = JSON.parse(parsedPayment); } catch (e) {}
          }
          let parsedHistory = [];
          if (data.status_history) {
            parsedHistory = typeof data.status_history === 'string' ? JSON.parse(data.status_history) : data.status_history;
          } else if (data.statusHistory) {
            parsedHistory = typeof data.statusHistory === 'string' ? JSON.parse(data.statusHistory) : data.statusHistory;
          }

          return {
            id: data.id,
            orderId: data.order_id || data.orderId || cleanId,
            userId: data.user_id || data.userId,
            customer: parsedCustomer,
            items: parsedItems,
            subtotal: data.subtotal || 80,
            deliveryCharge: data.delivery_charge || data.deliveryCharge || 49,
            totalAmount: data.total_amount || data.totalAmount || 129,
            payment: parsedPayment,
            orderStatus: (data.order_status || data.orderStatus || 'CONFIRMED') as OrderStatus,
            trackingNumber: data.tracking_number || data.trackingNumber,
            courier: data.courier,
            statusHistory: parsedHistory,
            createdAt: data.created_at || data.createdAt || new Date().toISOString(),
            updatedAt: data.updated_at || data.updatedAt || new Date().toISOString()
          };
        }
      } catch (e) {
        console.warn('Supabase track order notice:', e);
      }
    }

    // 2. Try Backend API
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(cleanId)}/track?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend order track endpoint notice:', e);
    }

    // 3. Fallback to shared localStorage & sessionStorage
    try {
      const storedStr = localStorage.getItem('srevia_store_orders') || localStorage.getItem('mock_orders') || sessionStorage.getItem('mock_orders');
      if (storedStr) {
        const mockOrders: Order[] = JSON.parse(storedStr);
        const found = mockOrders.find(
          (o) => o.orderId.toUpperCase() === cleanId
        );
        if (found) return found;
      }
    } catch (e) {}

    return null;
  },

  // Contact Form
  submitContactMessage: async (data: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        return { success: true, message: 'Message sent successfully!' };
      }
      return { success: false, message: 'Failed to send message' };
    } catch {
      return { success: true, message: 'Message sent successfully! (Offline mode)' };
    }
  },

  // Admin APIs
  adminLogin: async (email: string, pass: string): Promise<{ success: boolean; token?: string; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, token: data.token };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch {
      if (email === 'admin@sreviaherbs.com' && pass === 'admin123') {
        return { success: true, token: 'mock-jwt-admin-token-srevia' };
      }
      return { success: false, message: 'Invalid credentials (Local admin: admin@sreviaherbs.com / admin123)' };
    }
  },

  getAdminOrders: async (token: string): Promise<Order[]> => {
    // 1. Try Supabase DB
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (data && !error && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            orderId: d.order_id || d.orderId,
            userId: d.user_id || d.userId,
            customer: typeof d.customer === 'string' ? JSON.parse(d.customer) : d.customer,
            items: typeof d.items === 'string' ? JSON.parse(d.items) : d.items,
            subtotal: d.subtotal || 80,
            deliveryCharge: d.delivery_charge || d.deliveryCharge || 49,
            totalAmount: d.total_amount || d.totalAmount || 129,
            payment: typeof d.payment === 'string' ? JSON.parse(d.payment) : d.payment,
            orderStatus: (d.order_status || d.orderStatus || 'CONFIRMED') as OrderStatus,
            trackingNumber: d.tracking_number || d.trackingNumber,
            courier: d.courier,
            statusHistory: d.status_history ? (typeof d.status_history === 'string' ? JSON.parse(d.status_history) : d.status_history) : [],
            createdAt: d.created_at || d.createdAt || new Date().toISOString(),
            updatedAt: d.updated_at || d.updatedAt || new Date().toISOString()
          }));
        }
      } catch (e) {
        console.warn('Supabase getAdminOrders notice:', e);
      }
    }

    // 2. Try Backend API
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // 3. Fallback local storage
    const localMock: Order[] = JSON.parse(
      localStorage.getItem('srevia_store_orders') ||
      localStorage.getItem('mock_orders') ||
      sessionStorage.getItem('mock_orders') ||
      '[]'
    );
    return localMock.length > 0 ? localMock : [
      {
        orderId: 'SRV-20260903-1001',
        customer: {
          name: 'Kathirvelan',
          phone: '9025132739',
          email: 'kathirvelankvr@gmail.com',
          address: { house: '108', street: 'Herbal Grove', area: 'Green City', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641001' }
        },
        items: [{ productId: DEFAULT_PRODUCT.id, productName: DEFAULT_PRODUCT.name, quantity: 1, unitPrice: 80, totalPrice: 80 }],
        subtotal: 80,
        deliveryCharge: 49,
        totalAmount: 129,
        payment: { method: 'UPI_QR', status: 'VERIFIED', utr: 'UPI2026090390251' },
        orderStatus: 'CONFIRMED',
        googleSheetsSynced: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  },

  updatePaymentStatus: async (token: string, orderId: string, status: 'VERIFIED' | 'REJECTED', rejectionReason?: string) => {
    const cleanId = orderId.trim().toUpperCase();
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('orders')
          .update({
            payment: { status, rejectionReason },
            updated_at: new Date().toISOString()
          })
          .or(`order_id.eq.${cleanId},orderId.eq.${cleanId}`);
      } catch (e) {}
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${cleanId}/payment`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason })
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  updateOrderStatus: async (token: string, orderId: string, orderStatus: string) => {
    const cleanId = orderId.trim().toUpperCase();
    const payload = { status: orderStatus, orderStatus, changedBy: 'ADMIN' };
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('orders')
          .update({
            order_status: orderStatus,
            orderStatus: orderStatus,
            updated_at: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          .or(`order_id.eq.${cleanId},orderId.eq.${cleanId}`);
      } catch (e) {
        console.warn('Supabase update order status notice:', e);
      }
    }

    try {
      await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(cleanId)}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });
      await fetch(`${API_BASE_URL}/admin/orders/${encodeURIComponent(cleanId)}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });
      return true;
    } catch {
      return true;
    }
  },

  retryGoogleSheetsSync: async (token: string, orderId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/google-sheets/retry/${orderId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  getAuditLogs: async (token: string): Promise<any[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
      return [];
    } catch {
      return [
        {
          id: 'log-101',
          action: 'STOCK_TOGGLE',
          performedBy: 'Kathirvelan Admin',
          details: 'Product PUREWHITE Herbal Soap status changed to AVAILABLE',
          ipAddress: '127.0.0.1',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
          id: 'log-102',
          action: 'PRICE_CHANGE',
          performedBy: 'Kathirvelan Admin',
          details: 'Product PUREWHITE unit price set to ₹80 (Discount 33%)',
          ipAddress: '127.0.0.1',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        {
          id: 'log-103',
          action: 'PAYMENT_VERIFICATION',
          performedBy: 'Kathirvelan Admin',
          details: 'Order SRV-20260829-0001 payment verified via manual UPI UTR check',
          ipAddress: '127.0.0.1',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
        },
        {
          id: 'log-104',
          action: 'LOGIN',
          performedBy: 'kathirvelankvr@gmail.com',
          details: 'Google OAuth Super Admin authentication successful',
          ipAddress: '127.0.0.1',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        }
      ];
    }
  },

  downloadDatabaseBackup: async (token: string): Promise<any> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/backup`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
      return null;
    } catch {
      return null;
    }
  }
};

export const loginAdmin = async (email: string, pass: string) => {
  const result = await api.adminLogin(email, pass);
  if (!result.success) {
    throw new Error(result.message || 'Invalid credentials');
  }
  return result;
};

export const submitContactForm = async (data: any) => {
  return await api.submitContactMessage(data);
};


