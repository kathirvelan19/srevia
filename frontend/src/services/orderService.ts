import { api } from './api';
import type { Order, OrderStatus } from '../types/order';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://sreviia-backend.onrender.com/api' : 'http://localhost:8080/api');

export const orderService = {
  getOrders: async (token?: string): Promise<Order[]> => {
    const adminToken = token || localStorage.getItem('srevia_admin_token');
    if (adminToken) {
      return await api.getAdminOrders(adminToken);
    }
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (res.ok) return await res.json();
      return [];
    } catch {
      return JSON.parse(sessionStorage.getItem('mock_orders') || '[]');
    }
  },

  getOrder: async (orderId: string, phone?: string): Promise<Order | null> => {
    return await api.trackOrder(orderId, phone || '');
  },

  updateOrderStatus: async (
    orderId: string,
    payload: { status: OrderStatus | string; trackingNumber?: string; courier?: string; message?: string },
    token?: string
  ): Promise<{ success: boolean; order?: Order; message?: string }> => {
    const adminToken = token || localStorage.getItem('srevia_admin_token') || 'admin_token';
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const order = await res.json();
        return { success: true, order };
      }
      const err = await res.json().catch(() => ({ message: 'Failed to update order status' }));
      return { success: false, message: err.message };
    } catch {
      return { success: true };
    }
  },

  cancelOrder: async (orderId: string, reason?: string): Promise<{ success: boolean; order?: Order; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason || 'Cancelled by customer', changedBy: 'CUSTOMER' })
      });
      if (res.ok) {
        const order = await res.json();
        return { success: true, order };
      }
      const err = await res.json().catch(() => ({ message: 'Failed to cancel order' }));
      return { success: false, message: err.message };
    } catch {
      return { success: true };
    }
  },

  requestReturn: async (orderId: string, reason?: string): Promise<{ success: boolean; order?: Order; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason || 'Return requested by customer', changedBy: 'CUSTOMER' })
      });
      if (res.ok) {
        const order = await res.json();
        return { success: true, order };
      }
      const err = await res.json().catch(() => ({ message: 'Failed to request return' }));
      return { success: false, message: err.message };
    } catch {
      return { success: true };
    }
  },

  refundOrder: async (orderId: string, reason?: string, token?: string): Promise<{ success: boolean; order?: Order; message?: string }> => {
    const adminToken = token || localStorage.getItem('srevia_admin_token') || 'admin_token';
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${encodeURIComponent(orderId)}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ reason: reason || 'Refund issued', changedBy: 'ADMIN' })
      });
      if (res.ok) {
        const order = await res.json();
        return { success: true, order };
      }
      const err = await res.json().catch(() => ({ message: 'Failed to issue refund' }));
      return { success: false, message: err.message };
    } catch {
      return { success: true };
    }
  }
};
