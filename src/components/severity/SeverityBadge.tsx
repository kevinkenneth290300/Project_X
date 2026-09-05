import React from 'react';
import { SeverityLevel } from '../../types';
import { AlertCircle, AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true,
}) => {
  const getStyle = () => {
    switch (severity) {
      case 'Critical':
        return {
          bg: 'bg-[#E64848]/15',
          border: 'border-[#E64848]/60',
          text: 'text-[#E64848]',
          icon: ShieldAlert,
          dot: 'bg-[#E64848]',
        };
      case 'High':
        return {
          bg: 'bg-[#F2994A]/15',
          border: 'border-[#F2994A]/60',
          text: 'text-[#F2994A]',
          icon: AlertTriangle,
          dot: 'bg-[#F2994A]',
        };
      case 'Medium':
        return {
          bg: 'bg-yellow-400/15',
          border: 'border-yellow-400/50',
          text: 'text-yellow-400',
          icon: AlertCircle,
          dot: 'bg-yellow-400',
        };
      case 'Low':
        return {
          bg: 'bg-blue-400/15',
          border: 'border-blue-400/50',
          text: 'text-blue-400',
          icon: Info,
          dot: 'bg-blue-400',
        };
      case 'Informational':
      default:
        return {
          bg: 'bg-[#242426]',
          border: 'border-[#3A3A3C]',
          text: 'text-[#8E9299]',
          icon: CheckCircle2,
          dot: 'bg-[#8E9299]',
        };
    }
  };

  const style = getStyle();
  const IconComponent = style.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-[11px] px-2 py-0.5 gap-1.5',
    lg: 'text-xs px-2.5 py-1 gap-2 font-medium',
  };

  const iconSizes = {
    sm: 11,
    md: 12,
    lg: 14,
  };

  return (
    <span
      className={`inline-flex items-center rounded-sm border font-mono uppercase tracking-wider whitespace-nowrap ${style.bg} ${style.border} ${style.text} ${sizeClasses[size]}`}
    >
      {showIcon && <IconComponent size={iconSizes[size]} className="shrink-0" />}
      <span className="font-semibold">{severity}</span>
    </span>
  );
};
