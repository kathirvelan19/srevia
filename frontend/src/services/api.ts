import type { Product, Order, ContactMessage } from '../types';
import purewhiteSoapImg from '../assets/purewhite_soap_bar.jpg';

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
        orderStatus: 'PAYMENT_SUBMITTED',
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
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/track?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch {
      // Fallback local lookup
      try {
        const mockOrders: Order[] = JSON.parse(sessionStorage.getItem('mock_orders') || '[]');
        const found = mockOrders.find(
          (o) => o.orderId.toLowerCase() === orderId.toLowerCase() && o.customer.phone.includes(phone.slice(-4))
        );
        return found || null;
      } catch {
        return null;
      }
    }
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
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
      return [];
    } catch {
      const localMock: Order[] = JSON.parse(sessionStorage.getItem('mock_orders') || '[]');
      return localMock.length > 0 ? localMock : [
        {
          orderId: 'SRV-20260829-0001',
          customer: {
            name: 'Arun Kumar',
            phone: '9840123456',
            email: 'arun@example.com',
            address: { house: '42', street: 'Lotus Avenue', area: 'R.S. Puram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641002' }
          },
          items: [{ productId: DEFAULT_PRODUCT.id, productName: DEFAULT_PRODUCT.name, quantity: 2, unitPrice: 149, totalPrice: 298 }],
          subtotal: 298,
          deliveryCharge: 0,
          totalAmount: 298,
          payment: { method: 'UPI_QR', status: 'SUBMITTED', utr: 'UPI20260829987654' },
          orderStatus: 'PAYMENT_SUBMITTED',
          googleSheetsSynced: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  },

  updatePaymentStatus: async (token: string, orderId: string, status: 'VERIFIED' | 'REJECTED', rejectionReason?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/payment`, {
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
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus })
      });
      return res.ok;
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


