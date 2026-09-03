import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_PRODUCT, api } from '../services/api';
import type { Product, Order } from '../types';

export type Stage3Status = 'ORDER_RECEIVED' | 'SHIPPING' | 'DELIVERED';

interface StoreContextType {
  product: Product;
  inStock: boolean;
  setInStock: (inStock: boolean) => void;
  price: number;
  originalPrice: number;
  updateProduct: (newPrice: number, newOriginalPrice: number, stockAvailable: boolean) => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, stage: Stage3Status) => Promise<void>;
  addNewOrder: (order: Order) => void;
  refreshOrders: () => Promise<void>;
}

const STORAGE_KEY_PRODUCT = 'srevia_store_product';
const STORAGE_KEY_ORDERS = 'srevia_store_orders';

const StoreContext = createContext<StoreContextType>({
  product: DEFAULT_PRODUCT,
  inStock: true,
  setInStock: () => {},
  price: 80,
  originalPrice: 120,
  updateProduct: () => {},
  orders: [],
  updateOrderStatus: async () => {},
  addNewOrder: () => {},
  refreshOrders: async () => {},
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [product, setProduct] = useState<Product>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCT);
      if (saved) {
        return { ...DEFAULT_PRODUCT, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed loading saved store product:", e);
    }
    return DEFAULT_PRODUCT;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed loading saved store orders:", e);
    }
    return [
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
        orderStatus: 'ORDER_RECEIVED',
        googleSheetsSynced: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  });

  const inStock = product.stockQuantity > 0 && product.active !== false;
  const price = product.price;
  const originalPrice = product.originalPrice;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCT, JSON.stringify(product));
    } catch (e) {
      console.error(e);
    }
  }, [product]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const setInStock = (stockAvailable: boolean) => {
    setProduct((prev) => ({
      ...prev,
      stockQuantity: stockAvailable ? 100 : 0,
      active: stockAvailable,
    }));
  };

  const updateProduct = (newPrice: number, newOriginalPrice: number, stockAvailable: boolean) => {
    setProduct((prev) => ({
      ...prev,
      price: newPrice,
      originalPrice: newOriginalPrice,
      stockQuantity: stockAvailable ? 100 : 0,
      active: stockAvailable,
      discount: newOriginalPrice > newPrice ? `Save ${Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100)}%` : '',
    }));
  };

  const updateOrderStatus = async (orderId: string, stage: Stage3Status) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.orderId.toLowerCase() === orderId.toLowerCase()
          ? { ...o, orderStatus: stage as any, updatedAt: new Date().toISOString() }
          : o
      )
    );

    // Also call backend API
    const token = localStorage.getItem('srevia_admin_token') || 'admin_session';
    try {
      await api.updateOrderStatus(token, orderId, stage);
    } catch (e) {
      console.warn("Backend status update sync note:", e);
    }
  };

  const addNewOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const refreshOrders = async () => {
    const token = localStorage.getItem('srevia_admin_token') || '';
    if (token) {
      try {
        const remoteOrders = await api.getAdminOrders(token);
        if (remoteOrders && remoteOrders.length > 0) {
          setOrders(remoteOrders);
        }
      } catch (e) {
        console.warn("Remote order sync note:", e);
      }
    }
  };

  return (
    <StoreContext.Provider
      value={{
        product,
        inStock,
        setInStock,
        price,
        originalPrice: originalPrice || 120,
        updateProduct,
        orders,
        updateOrderStatus,
        addNewOrder,
        refreshOrders,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
