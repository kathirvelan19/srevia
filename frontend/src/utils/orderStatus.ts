import type { OrderStatus } from '../types/order';

export interface OrderStatusConfig {
  status: OrderStatus;
  label: string;
  description: string;
  allowedNext: OrderStatus[];
  badgeStyle: {
    bg: string;
    text: string;
    border: string;
    iconColor?: string;
  };
}

export const ORDER_STATUS_CONFIG: Record<string, OrderStatusConfig> = {
  PLACED: {
    status: 'PLACED',
    label: 'Order Placed',
    description: 'Order details received successfully',
    allowedNext: ['CONFIRMED', 'CANCELLED', 'PAYMENT_FAILED'],
    badgeStyle: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' }
  },
  ORDER_PLACED: {
    status: 'PLACED',
    label: 'Order Placed',
    description: 'Order details received successfully',
    allowedNext: ['CONFIRMED', 'CANCELLED', 'PAYMENT_FAILED'],
    badgeStyle: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' }
  },
  ORDER_RECEIVED: {
    status: 'PLACED',
    label: 'Order Received',
    description: 'Order received and pending verification',
    allowedNext: ['CONFIRMED', 'CANCELLED', 'PAYMENT_FAILED'],
    badgeStyle: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' }
  },
  PAYMENT_PENDING: {
    status: 'PAYMENT_FAILED',
    label: 'Payment Pending',
    description: 'Awaiting payment completion',
    allowedNext: ['CONFIRMED', 'CANCELLED', 'PAYMENT_FAILED'],
    badgeStyle: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' }
  },
  PAYMENT_SUBMITTED: {
    status: 'PLACED',
    label: 'Payment Submitted',
    description: 'Payment proof submitted by customer',
    allowedNext: ['CONFIRMED', 'CANCELLED', 'PAYMENT_FAILED'],
    badgeStyle: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' }
  },
  SUBMITTED: {
    status: 'PLACED',
    label: 'Order Submitted',
    description: 'Order submitted and under review',
    allowedNext: ['CONFIRMED', 'CANCELLED', 'PAYMENT_FAILED'],
    badgeStyle: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' }
  },
  CONFIRMED: {
    status: 'CONFIRMED',
    label: 'Order Confirmed',
    description: 'Payment verified and order confirmed',
    allowedNext: ['PROCESSING', 'CANCELLED'],
    badgeStyle: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' }
  },
  PROCESSING: {
    status: 'PROCESSING',
    label: 'Processing',
    description: 'Herbal batch in preparation',
    allowedNext: ['PACKED', 'CANCELLED'],
    badgeStyle: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' }
  },
  PACKED: {
    status: 'PACKED',
    label: 'Packed',
    description: 'Sealed & ready for courier pickup',
    allowedNext: ['SHIPPED', 'CANCELLED'],
    badgeStyle: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' }
  },
  SHIPPING: {
    status: 'SHIPPED',
    label: 'Shipped',
    description: 'Package handed to courier partner',
    allowedNext: ['OUT_FOR_DELIVERY'],
    badgeStyle: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' }
  },
  SHIPPED: {
    status: 'SHIPPED',
    label: 'Shipped',
    description: 'In transit with courier partner',
    allowedNext: ['OUT_FOR_DELIVERY'],
    badgeStyle: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' }
  },
  OUT_FOR_DELIVERY: {
    status: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    description: 'Out with local delivery executive',
    allowedNext: ['DELIVERED'],
    badgeStyle: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' }
  },
  DELIVERED: {
    status: 'DELIVERED',
    label: 'Delivered',
    description: 'Package delivered to customer',
    allowedNext: ['RETURN_REQUESTED'],
    badgeStyle: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' }
  },
  PAYMENT_FAILED: {
    status: 'PAYMENT_FAILED',
    label: 'Payment Failed',
    description: 'Payment attempt was unsuccessful',
    allowedNext: ['PLACED', 'CANCELLED'],
    badgeStyle: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' }
  },
  CANCELLED: {
    status: 'CANCELLED',
    label: 'Cancelled',
    description: 'Order was cancelled',
    allowedNext: [],
    badgeStyle: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' }
  },
  RETURN_REQUESTED: {
    status: 'RETURN_REQUESTED',
    label: 'Return Requested',
    description: 'Customer requested a return',
    allowedNext: ['RETURNED'],
    badgeStyle: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' }
  },
  RETURNED: {
    status: 'RETURNED',
    label: 'Returned',
    description: 'Item returned to warehouse',
    allowedNext: ['REFUNDED'],
    badgeStyle: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' }
  },
  REFUNDED: {
    status: 'REFUNDED',
    label: 'Refunded',
    description: 'Refund issued to customer',
    allowedNext: [],
    badgeStyle: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' }
  }
};

export const getStatusConfig = (status?: string): OrderStatusConfig => {
  if (!status) return ORDER_STATUS_CONFIG.PLACED;
  const key = status.toUpperCase().trim();
  return ORDER_STATUS_CONFIG[key] || {
    status: 'PLACED',
    label: status.replace(/_/g, ' '),
    description: 'Order status: ' + status,
    allowedNext: [],
    badgeStyle: { bg: 'bg-[#F4F0E7]', text: 'text-[#1F3D2E]', border: 'border-[#A8B9A3]/30' }
  };
};

export const getAllowedNextStates = (status?: string): OrderStatus[] => {
  return getStatusConfig(status).allowedNext;
};

export const isValidTransition = (currentStatus?: string, targetStatus?: string): boolean => {
  if (!currentStatus || !targetStatus) return false;
  if (currentStatus.toUpperCase() === targetStatus.toUpperCase()) return true;
  const allowed = getAllowedNextStates(currentStatus);
  return allowed.includes(targetStatus.toUpperCase() as OrderStatus);
};
