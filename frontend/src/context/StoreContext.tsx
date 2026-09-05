import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DEFAULT_PRODUCT, api } from '../services/api';
import type { Product, Order, OrderStatus } from '../types';

export type Stage3Status = 'ORDER_RECEIVED' | 'SHIPPING' | 'DELIVERED';

interface StoreContextType {
  product: Product;
  inStock: boolean;
  setInStock: (inStock: boolean) => void;
  price: number;
  originalPrice: number;
  updateProduct: (newPrice: number, newOriginalPrice: number, stockAvailable: boolean) => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, stage: OrderStatus | string) => Promise<void>;
  addNewOrder: (order: Order) => void;
  refreshOrders: () => Promise<void>;
}

const STORAGE_KEY_PRODUCT = 'srevia_store_product';
const STORAGE_KEY_ORDERS = 'srevia_store_orders';
const RENDER_BACKEND_PRODUCTS_URL = 'https://sreviia-backend.onrender.com/api/products';
const RENDER_BACKEND_STATUS_URL = 'https://sreviia-backend.onrender.com/api/products/status';
const LOCAL_API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://sreviia-backend.onrender.com/api' : 'http://localhost:8080/api');

let lastLocalUpdateTimestamp = 0;

const checkStockAvailable = (p: any): boolean => {
  if (!p) return true;
  if (p.inStock === false) return false;
  if (p.active === false) return false;
  if (typeof p.stockQuantity === 'number' && p.stockQuantity <= 0) return false;
  return true;
};

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
        const parsed = JSON.parse(saved);
        const isAvail = checkStockAvailable(parsed);
        return {
          ...DEFAULT_PRODUCT,
          ...parsed,
          inStock: isAvail,
          active: isAvail,
          stockQuantity: isAvail ? (parsed.stockQuantity || 100) : 0,
        };
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
        orderStatus: 'CONFIRMED',
        googleSheetsSynced: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  });

  // 1. Cross-Tab & Broadcast Channel Real-Time Sync for Product & Orders
  useEffect(() => {
    let productChannel: BroadcastChannel | null = null;
    let ordersChannel: BroadcastChannel | null = null;
    try {
      productChannel = new BroadcastChannel('srevia_store_channel');
      productChannel.onmessage = (e) => {
        if (e.data && e.data.product) {
          const p = e.data.product;
          const isAvail = checkStockAvailable(p);
          lastLocalUpdateTimestamp = Date.now();
          setProduct((prev) => ({
            ...prev,
            ...p,
            inStock: isAvail,
            active: isAvail,
            stockQuantity: isAvail ? (p.stockQuantity || 100) : 0,
          }));
        }
      };

      ordersChannel = new BroadcastChannel('srevia_orders_channel');
      ordersChannel.onmessage = (e) => {
        if (e.data && e.data.orderId && e.data.orderStatus) {
          const { orderId, orderStatus } = e.data;
          setOrders((prevOrders) =>
            prevOrders.map((o) =>
              o.orderId.toLowerCase() === orderId.toLowerCase()
                ? { ...o, orderStatus: orderStatus as OrderStatus, updatedAt: new Date().toISOString() }
                : o
            )
          );
        }
      };
    } catch (err) {}

    const handleCustomStockChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        const isAvail = checkStockAvailable(detail);
        lastLocalUpdateTimestamp = Date.now();
        setProduct((prev) => ({
          ...prev,
          ...detail,
          inStock: isAvail,
          active: isAvail,
          stockQuantity: isAvail ? (detail.stockQuantity || 100) : 0,
        }));
      }
    };

    const handleCustomOrderChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.orderId && detail.orderStatus) {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.orderId.toLowerCase() === detail.orderId.toLowerCase()
              ? { ...o, orderStatus: detail.orderStatus as OrderStatus, updatedAt: new Date().toISOString() }
              : o
          )
        );
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_PRODUCT && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const isAvail = checkStockAvailable(parsed);
          lastLocalUpdateTimestamp = Date.now();
          setProduct((prev) => ({
            ...prev,
            ...parsed,
            inStock: isAvail,
            active: isAvail,
            stockQuantity: isAvail ? (parsed.stockQuantity || 100) : 0,
          }));
        } catch (err) {}
      }
      if (e.key === STORAGE_KEY_ORDERS && e.newValue) {
        try {
          const parsedOrders = JSON.parse(e.newValue);
          if (Array.isArray(parsedOrders)) {
            setOrders(parsedOrders);
          }
        } catch (err) {}
      }
    };

    window.addEventListener('srevia_stock_change', handleCustomStockChange);
    window.addEventListener('srevia_order_change', handleCustomOrderChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (productChannel) productChannel.close();
      if (ordersChannel) ordersChannel.close();
      window.removeEventListener('srevia_stock_change', handleCustomStockChange);
      window.removeEventListener('srevia_order_change', handleCustomOrderChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 2. Persistent Backend Polling with Protection against Stale Overwrites
  useEffect(() => {
    const fetchLatestProduct = async () => {
      // Don't overwrite if local admin update happened within last 15 seconds
      if (Date.now() - lastLocalUpdateTimestamp < 15000) {
        return;
      }

      const tryUrls = [`${LOCAL_API_BASE}/products`, RENDER_BACKEND_PRODUCTS_URL];
      for (const url of tryUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const products = await res.json();
            if (Array.isArray(products) && products.length > 0) {
              const p = products[0];
              const isAvail = checkStockAvailable(p);
              setProduct((prev) => ({
                ...prev,
                inStock: isAvail,
                active: isAvail,
                stockQuantity: isAvail ? (p.stockQuantity !== undefined ? p.stockQuantity : 100) : 0,
                price: typeof p.price === 'number' ? p.price : prev.price,
                originalPrice: typeof p.originalPrice === 'number' ? p.originalPrice : prev.originalPrice,
              }));
              break;
            }
          }
        } catch (e) {}
      }
    };

    fetchLatestProduct();
    const interval = setInterval(fetchLatestProduct, 3000);
    return () => clearInterval(interval);
  }, []);

  const inStock = checkStockAvailable(product);
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

  const broadcastProductChange = (updated: Partial<Product>) => {
    lastLocalUpdateTimestamp = Date.now();
    try {
      window.dispatchEvent(new CustomEvent('srevia_stock_change', { detail: updated }));
      const channel = new BroadcastChannel('srevia_store_channel');
      channel.postMessage({ product: updated });
      channel.close();
    } catch (e) {}
  };

  const broadcastOrderChange = (orderId: string, orderStatus: string) => {
    try {
      window.dispatchEvent(new CustomEvent('srevia_order_change', { detail: { orderId, orderStatus } }));
      const channel = new BroadcastChannel('srevia_orders_channel');
      channel.postMessage({ orderId, orderStatus });
      channel.close();
    } catch (e) {}
  };

  const syncProductToBackend = async (stockAvailable: boolean, newPrice?: number, newOriginalPrice?: number) => {
    const p = newPrice !== undefined ? newPrice : price;
    const op = newOriginalPrice !== undefined ? newOriginalPrice : (originalPrice || 120);

    const payload = {
      inStock: stockAvailable,
      stockQuantity: stockAvailable ? 100 : 0,
      active: stockAvailable,
      price: p,
      originalPrice: op,
      updatedAt: new Date().toISOString(),
    };

    // Instant cross-tab and local window broadcast
    broadcastProductChange(payload);

    const token = localStorage.getItem('srevia_admin_token') || 'mock-jwt-admin-token-srevia';
    const authHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const targetUrls = [
      `${LOCAL_API_BASE}/products/status`,
      RENDER_BACKEND_STATUS_URL
    ];

    for (const targetUrl of targetUrls) {
      try {
        await fetch(targetUrl, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.warn("Product status POST notice for " + targetUrl, e);
      }
    }

    try {
      await setDoc(doc(db, 'store', 'product'), payload, { merge: true });
    } catch (e) {
      console.warn("Firestore setDoc notice:", e);
    }
  };

  const setInStock = (stockAvailable: boolean) => {
    const updated = {
      ...product,
      inStock: stockAvailable,
      active: stockAvailable,
      stockQuantity: stockAvailable ? 100 : 0,
    };
    setProduct(updated);
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCT, JSON.stringify(updated));
    } catch (e) {}
    syncProductToBackend(stockAvailable);
  };

  const updateProduct = (newPrice: number, newOriginalPrice: number, stockAvailable: boolean) => {
    const updated = {
      ...product,
      price: newPrice,
      originalPrice: newOriginalPrice,
      inStock: stockAvailable,
      active: stockAvailable,
      stockQuantity: stockAvailable ? 100 : 0,
      discount: newOriginalPrice > newPrice ? `Save ${Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100)}%` : '',
    };
    setProduct(updated);
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCT, JSON.stringify(updated));
    } catch (e) {}
    syncProductToBackend(stockAvailable, newPrice, newOriginalPrice);
  };

  const updateOrderStatus = async (orderId: string, stage: OrderStatus | string) => {
    setOrders((prevOrders) => {
      const updated = prevOrders.map((o) =>
        o.orderId.toLowerCase() === orderId.toLowerCase()
          ? { ...o, orderStatus: stage as OrderStatus, updatedAt: new Date().toISOString() }
          : o
      );
      try {
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
        sessionStorage.setItem('mock_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Instant local & cross-tab broadcast
    broadcastOrderChange(orderId, stage);

    // Sync to Firebase Firestore order status
    try {
      await setDoc(doc(db, 'orders', orderId.toUpperCase()), {
        orderId: orderId.toUpperCase(),
        orderStatus: stage,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn("Firestore order status setDoc notice:", e);
    }

    const token = localStorage.getItem('srevia_admin_token') || 'admin_session';
    try {
      await api.updateOrderStatus(token, orderId, stage);
    } catch (e) {
      console.warn("Backend status update sync notice:", e);
    }
  };

  const addNewOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    broadcastOrderChange(newOrder.orderId, newOrder.orderStatus);
    try {
      setDoc(doc(db, 'orders', newOrder.orderId.toUpperCase()), newOrder);
    } catch (e) {
      console.warn("Firestore new order setDoc notice:", e);
    }
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
        console.warn("Remote order sync notice:", e);
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
