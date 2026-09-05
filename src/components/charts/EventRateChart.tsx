import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface EventRateChartProps {
  currentRate?: string;
  trend?: string;
  height?: number;
}

export const EventRateChart: React.FC<EventRateChartProps> = ({
  currentRate = '12,481 / min',
  trend = '+8.4%',
  height = 140,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // 24 data points representing the last 24 minutes (samples every 1 min)
  const dataPoints = [
    { time: '10:25', value: 11420, rate: '11.4k' },
    { time: '10:26', value: 11610, rate: '11.6k' },
    { time: '10:27', value: 11500, rate: '11.5k' },
    { time: '10:28', value: 11890, rate: '11.8k' },
    { time: '10:29', value: 11720, rate: '11.7k' },
    { time: '10:30', value: 12100, rate: '12.1k' },
    { time: '10:31', value: 12050, rate: '12.0k' },
    { time: '10:32', value: 11980, rate: '11.9k' },
    { time: '10:33', value: 12240, rate: '12.2k' },
    { time: '10:34', value: 12150, rate: '12.1k' },
    { time: '10:35', value: 12600, rate: '12.6k' },
    { time: '10:36', value: 12450, rate: '12.4k' },
    { time: '10:37', value: 12380, rate: '12.3k' },
    { time: '10:38', value: 12510, rate: '12.5k' },
    { time: '10:39', value: 12490, rate: '12.4k' },
    { time: '10:40', value: 12620, rate: '12.6k' },
    { time: '10:41', value: 12890, rate: '12.8k' },
    { time: '10:42', value: 13420, rate: '13.4k' }, // Spike during investigation trigger
    { time: '10:43', value: 13110, rate: '13.1k' },
    { time: '10:44', value: 12780, rate: '12.7k' },
    { time: '10:45', value: 12650, rate: '12.6k' },
    { time: '10:46', value: 12520, rate: '12.5k' },
    { time: '10:47', value: 12490, rate: '12.4k' },
    { time: '10:48', value: 12481, rate: '12.4k' },
  ];

  const min = 11000;
  const max = 14000;
  const range = max - min;
  const width = 600;
  const svgHeight = height;
  const paddingX = 12;
  const paddingY = 16;
  const effectiveWidth = width - paddingX * 2;
  const effectiveHeight = svgHeight - paddingY * 2;

  const points = dataPoints.map((d, i) => {
    const x = paddingX + (i / (dataPoints.length - 1)) * effectiveWidth;
    const y = svgHeight - paddingY - ((d.value - min) / range) * effectiveHeight;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = points[idx - 1];
    const cpX = (prev.x + curr.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className="w-full flex flex-col justify-between select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4 text-[11px] text-[#5A5A5E] font-mono">
          <span>EPS: 1,420</span>
          <span>LATENCY: 12ms</span>
          <span>ACTIVE HOSTS: 184</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-semibold text-white">{activePoint.value.toLocaleString()} / min</span>
          <span className="text-[10px] font-mono text-[#27AE60] flex items-center bg-[#27AE60]/10 px-1.5 py-0.5 rounded-sm border border-[#27AE60]/30">
            <ArrowUpRight size={11} className="mr-0.5" />
            {trend}
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden bg-[#1A1A1D] border border-[#242426] p-1 rounded-sm">
        <svg
          viewBox={`0 0 ${width} ${svgHeight}`}
          className="w-full h-auto block select-none"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="eventRateGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E64848" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#E64848" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E64848" />
              <stop offset="70%" stopColor="#F2994A" />
              <stop offset="100%" stopColor="#E64848" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={paddingY} x2={width} y2={paddingY} stroke="#242426" strokeDasharray="3 3" strokeWidth="1" />
          <line x1="0" y1={svgHeight / 2} x2={width} y2={svgHeight / 2} stroke="#242426" strokeDasharray="3 3" strokeWidth="1" />
          <line x1="0" y1={svgHeight - paddingY} x2={width} y2={svgHeight - paddingY} stroke="#242426" strokeDasharray="3 3" strokeWidth="1" />

          {/* Area Fill */}
          <path d={areaD} fill="url(#eventRateGrad)" />

          {/* Line Path */}
          <path d={pathD} fill="none" stroke="url(#strokeGrad)" strokeWidth="1.75" strokeLinecap="round" />

          {/* Interaction columns & crosshair */}
          {points.map((p, idx) => (
            <g key={idx} onMouseEnter={() => setHoverIndex(idx)}>
              <rect
                x={p.x - effectiveWidth / dataPoints.length / 2}
                y="0"
                width={effectiveWidth / dataPoints.length}
                height={svgHeight}
                fill="transparent"
                className="cursor-crosshair"
              />
            </g>
          ))}

          {/* Active indicator dot */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1="0"
                x2={activePoint.x}
                y2={svgHeight}
                stroke="#E64848"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.7"
              />
              <circle cx={activePoint.x} cy={activePoint.y} r="4" fill="#151517" stroke="#E64848" strokeWidth="2" />
              <circle cx={activePoint.x} cy={activePoint.y} r="1.5" fill="#E64848" />
            </g>
          )}
        </svg>

        {/* Legend axis */}
        <div className="flex justify-between px-2 pt-1.5 text-[10px] font-mono text-[#5A5A5E]">
          <span>-24m ({points[0].time})</span>
          <span>-12m ({points[11].time})</span>
          <span className="text-[#E64848]">Now ({points[points.length - 1].time})</span>
        </div>
      </div>
    </div>
  );
};
