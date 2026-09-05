import React from 'react';
import { Clock, ShieldCheck, RefreshCw, Box, Truck, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import type { OrderStatusHistory } from '../../types/order';
import { getStatusConfig } from '../../utils/orderStatus';

interface OrderTimelineProps {
  status?: string;
  currentStatus?: string;
  history?: OrderStatusHistory[];
  className?: string;
}

const LINEAR_STAGES = [
  { key: 'PLACED', label: 'Order Placed', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: ShieldCheck },
  { key: 'PROCESSING', label: 'Processing', icon: RefreshCw },
  { key: 'PACKED', label: 'Packed', icon: Box },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  status: statusProp,
  currentStatus,
  history = [],
  className = ''
}) => {
  const status = statusProp || currentStatus || 'PLACED';
  const getActiveStepIndex = (st?: string): number => {
    if (!st) return 0;
    const s = st.toUpperCase().trim();
    if (s === 'DELIVERED') return 6;
    if (s === 'OUT_FOR_DELIVERY') return 5;
    if (s === 'SHIPPED' || s === 'SHIPPING') return 4;
    if (s === 'PACKED') return 3;
    if (s === 'PROCESSING') return 2;
    if (s === 'CONFIRMED') return 1;
    return 0;
  };

  const isException = ['CANCELLED', 'PAYMENT_FAILED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED'].includes(
    (status || '').toUpperCase().trim()
  );

  const activeIdx = getActiveStepIndex(status);
  const currentConfig = getStatusConfig(status);

  // Map history timestamp for a given stage if present
  const getStageTimestamp = (stageKey: string) => {
    if (!history || history.length === 0) return null;
    const match = history.find((h) => {
      const hs = h.status.toUpperCase();
      if (stageKey === 'PLACED') return ['PLACED', 'ORDER_PLACED', 'ORDER_RECEIVED', 'PAYMENT_SUBMITTED'].includes(hs);
      if (stageKey === 'SHIPPED') return ['SHIPPED', 'SHIPPING'].includes(hs);
      return hs === stageKey;
    });
    return match ? new Date(match.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Exception Status Banner */}
      {isException ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider">{currentConfig.label}</h4>
            <p className="text-xs text-rose-700 mt-0.5">{currentConfig.description}</p>
          </div>
        </div>
      ) : (
        /* Linear Stepper Bar */
        <div className="bg-white p-5 rounded-2xl border border-[#A8B9A3]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#1F3D2E]">
            <span className="uppercase tracking-wider text-[10px] text-[#B89B5E]">LIVE STAGE PROGRESS</span>
            <span className="text-[#315C45]">Stage {activeIdx + 1} of 7: {LINEAR_STAGES[activeIdx]?.label}</span>
          </div>

          <div className="relative flex items-center justify-between w-full my-6 px-2">
            {/* Background line */}
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-[#F4F0E7] -translate-y-1/2 rounded-full -z-0" />
            {/* Active filled progress line */}
            <div
              className="absolute top-1/2 left-4 h-1 bg-[#315C45] -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out -z-0"
              style={{ width: `${(activeIdx / 6) * 100}%` }}
            />

            {/* Stage Nodes */}
            {LINEAR_STAGES.map((stg, i) => {
              const IconComp = stg.icon;
              const isCompleted = i < activeIdx;
              const isCurrent = i === activeIdx;
              const timeStr = getStageTimestamp(stg.key);

              return (
                <div key={stg.key} className="relative z-10 flex flex-col items-center group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#315C45] text-white shadow-sm'
                        : isCurrent
                        ? 'bg-[#1F3D2E] text-[#B89B5E] ring-4 ring-[#A8B9A3]/30 scale-110 shadow-md'
                        : 'bg-[#F4F0E7] text-[#242824]/40 border border-[#A8B9A3]/20'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <IconComp className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] font-semibold mt-2 text-center whitespace-nowrap ${
                    isCurrent ? 'text-[#1F3D2E] font-bold' : isCompleted ? 'text-[#315C45]' : 'text-[#242824]/40'
                  }`}>
                    {stg.label}
                  </span>
                  {timeStr && (
                    <span className="text-[9px] text-[#242824]/50 mt-0.5 whitespace-nowrap">
                      {timeStr}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Immutable Status History Log */}
      {history && history.length > 0 && (
        <div className="bg-[#FCFBF7] p-5 rounded-2xl border border-[#A8B9A3]/30 space-y-3">
          <h4 className="font-bold text-[#1F3D2E] text-xs uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#B89B5E]" />
            <span>Order History Timeline ({history.length} events)</span>
          </h4>
          <div className="space-y-3 divide-y divide-[#F4F0E7] pt-1">
            {history.map((h, idx) => (
              <div key={h.id || idx} className="pt-2.5 flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1F3D2E]">{h.status.replace(/_/g, ' ')}</span>
                    <span className="bg-[#F4F0E7] text-[#315C45] text-[9px] font-bold px-2 py-0.5 rounded-full">
                      By {h.changedBy || 'SYSTEM'}
                    </span>
                  </div>
                  {h.message && <p className="text-[11px] text-[#242824]/70 mt-0.5">{h.message}</p>}
                </div>
                <span className="text-[10px] text-[#242824]/50 font-mono shrink-0">
                  {new Date(h.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
