declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  badge?: string;
  description: string;
  stockQuantity: number;
  image: string;
  benefits: string[];
  ingredients: IngredientItem[];
  active: boolean;
}

export interface IngredientItem {
  name: string;
  shortDesc: string;
  traditionalSignificance: string;
  skincareRole: string;
  image?: string;
}

export interface CustomerAddress {
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: CustomerAddress;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type PaymentMethod = 'RAZORPAY' | 'UPI_QR';

export type PaymentStatus = 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

export type OrderStatus =
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUBMITTED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderPaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  utr?: string;
  screenshotUrl?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  rejectionReason?: string;
}

export interface Order {
  id?: string;
  orderId: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  payment: OrderPaymentInfo;
  orderStatus: OrderStatus;
  googleSheetsSynced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  adminEmail: string | null;
}
