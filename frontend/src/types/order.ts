export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'PAYMENT_FAILED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'REFUNDED';

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus | string;
  message: string;
  changedBy: string;
  createdAt: string;
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

export interface OrderPaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  utr?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  screenshotUrl?: string;
  rejectionReason?: string;
}

export interface Order {
  id?: string;
  orderId: string;
  userId?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  payment: OrderPaymentInfo;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courier?: string;
  statusHistory?: OrderStatusHistory[];
  googleSheetsSynced?: boolean;
  emailSent?: boolean;
  emailSentAt?: string;
  emailStatus?: string;
  createdAt: string;
  updatedAt: string;
}
