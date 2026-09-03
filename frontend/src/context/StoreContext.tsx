import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
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

  // 1. Firebase Firestore Real-Time Listener (Instant Global Sync Across All Devices & Users)
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const productRef = doc(db, 'store', 'product');
      unsubscribe = onSnapshot(
        productRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setProduct((prev) => ({
              ...prev,
              stockQuantity: data.inStock ? (data.stockQuantity || 100) : 0,
              active: data.inStock !== false,
              price: typeof data.price === 'number' ? data.price : prev.price,
              originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : prev.originalPrice,
            }));
          }
        },
        (error) => {
          console.warn("Firestore snapshot notice:", error);
        }
      );
    } catch (e) {
      console.warn("Firestore setup notice:", e);
    }

    return () => unsubscribe();
  }, []);

  // 2. Initial Serverless API Sync (/api/product)
  useEffect(() => {
    fetch('/api/product')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && data.product) {
          const p = data.product;
          setProduct((prev) => ({
            ...prev,
            stockQuantity: p.inStock ? (p.stockQuantity || 100) : 0,
            active: p.inStock !== false,
            price: typeof p.price === 'number' ? p.price : prev.price,
            originalPrice: typeof p.originalPrice === 'number' ? p.originalPrice : prev.originalPrice,
          }));
        }
      })
      .catch((e) => console.warn("/api/product fetch notice:", e));
  }, []);

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

  const syncProductToBackend = async (stockAvailable: boolean, newPrice?: number, newOriginalPrice?: number) => {
    const p = newPrice !== undefined ? newPrice : price;
    const op = newOriginalPrice !== undefined ? newOriginalPrice : (originalPrice || 120);

    // Sync to Firebase Firestore (Real-Time for all users)
    try {
      await setDoc(doc(db, 'store', 'product'), {
        inStock: stockAvailable,
        stockQuantity: stockAvailable ? 100 : 0,
        active: stockAvailable,
        price: p,
        originalPrice: op,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Firestore setDoc notice:", e);
    }

    // Sync to Vercel Serverless /api/product
    try {
      await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inStock: stockAvailable,
          stockQuantity: stockAvailable ? 100 : 0,
          price: p,
          originalPrice: op,
        }),
      });
    } catch (e) {
      console.warn("/api/product POST notice:", e);
    }
  };

  const setInStock = (stockAvailable: boolean) => {
    setProduct((prev) => ({
      ...prev,
      stockQuantity: stockAvailable ? 100 : 0,
      active: stockAvailable,
    }));
    syncProductToBackend(stockAvailable);
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
    syncProductToBackend(stockAvailable, newPrice, newOriginalPrice);
  };

  const updateOrderStatus = async (orderId: string, stage: Stage3Status) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.orderId.toLowerCase() === orderId.toLowerCase()
          ? { ...o, orderStatus: stage as any, updatedAt: new Date().toISOString() }
          : o
      )
    );

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
