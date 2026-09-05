import React from 'react';
import { StatusLevel } from '../../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, PowerOff, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: StatusLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showPulse = false,
}) => {
  const getStyle = () => {
    switch (status) {
      case 'Healthy':
      case 'Operational':
      case 'Active':
      case 'Listening':
      case 'Connected':
        return {
          bg: 'bg-[#27AE60]/10',
          border: 'border-[#27AE60]/40',
          text: 'text-[#27AE60]',
          dot: 'bg-[#27AE60]',
          icon: CheckCircle2,
        };
      case 'Warning':
      case 'Degraded':
      case 'Investigating':
        return {
          bg: 'bg-[#F2994A]/10',
          border: 'border-[#F2994A]/40',
          text: 'text-[#F2994A]',
          dot: 'bg-[#F2994A]',
          icon: AlertTriangle,
        };
      case 'Critical':
      case 'Offline':
      case 'Disabled':
      case 'Failure':
        return {
          bg: 'bg-[#E64848]/10',
          border: 'border-[#E64848]/40',
          text: 'text-[#E64848]',
          dot: 'bg-[#E64848]',
          icon: AlertOctagon,
        };
      case 'Not Connected':
        return {
          bg: 'bg-[#151517]',
          border: 'border-[#242426]',
          text: 'text-[#8E9299]',
          dot: 'bg-[#5A5A5E]',
          icon: PowerOff,
        };
      case 'Unknown':
      default:
        return {
          bg: 'bg-[#151517]',
          border: 'border-[#242426]',
          text: 'text-[#8E9299]',
          dot: 'bg-[#8E9299]',
          icon: HelpCircle,
        };
    }
  };

  const style = getStyle();

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1.5',
    md: 'text-[11px] px-2 py-0.5 gap-1.5',
    lg: 'text-xs px-2.5 py-1 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-sm border font-mono whitespace-nowrap ${style.bg} ${style.border} ${style.text} ${sizeClasses[size]}`}
    >
      <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
        {showPulse && (status === 'Healthy' || status === 'Operational' || status === 'Active') && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${style.dot}`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${style.dot}`} />
      </span>
      <span className="font-medium">{status}</span>
    </span>
  );
};
