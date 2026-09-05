import React from 'react';
import { Clock, ShieldCheck, RefreshCw, Box, Truck, MapPin, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { getStatusConfig } from '../../utils/orderStatus';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className = '',
  showIcon = true
}) => {
  const config = getStatusConfig(status);
  const { bg, text, border } = config.badgeStyle;

  const renderIcon = () => {
    if (!showIcon) return null;
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'OUT_FOR_DELIVERY':
        return <MapPin className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />;
      case 'SHIPPED':
      case 'SHIPPING':
        return <Truck className="w-3.5 h-3.5 text-blue-600" />;
      case 'PACKED':
        return <Box className="w-3.5 h-3.5 text-teal-600" />;
      case 'PROCESSING':
        return <RefreshCw className="w-3.5 h-3.5 text-purple-600" />;
      case 'CONFIRMED':
        return <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />;
      case 'CANCELLED':
      case 'PAYMENT_FAILED':
      case 'REFUNDED':
        return <XCircle className="w-3.5 h-3.5 text-rose-600" />;
      case 'RETURN_REQUESTED':
      case 'RETURNED':
        return <RotateCcw className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${bg} ${text} ${border} ${className}`}
    >
      {renderIcon()}
      <span>{config.label}</span>
    </span>
  );
};
