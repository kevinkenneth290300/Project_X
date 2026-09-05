import React from 'react';
import { SeverityBadge } from '../severity/SeverityBadge';
import { InvestigationTimelineItem } from '../../types';
import { Clock, ArrowRight, ShieldAlert, Terminal, Wrench, UserCheck, Eye } from 'lucide-react';

interface InvestigationTimelineProps {
  timeline: InvestigationTimelineItem[];
  onOpenEvent: (eventRecordId: string, eventId: number) => void;
}

export const InvestigationTimeline: React.FC<InvestigationTimelineProps> = ({
  timeline,
  onOpenEvent,
}) => {
  const getEventIcon = (eventId: number) => {
    switch (eventId) {
      case 4624:
        return <UserCheck size={14} className="text-emerald-400" />;
      case 4672:
        return <ShieldAlert size={14} className="text-amber-400" />;
      case 4688:
      case 4104:
        return <Terminal size={14} className="text-sky-400" />;
      case 7045:
        return <Wrench size={14} className="text-rose-400" />;
      case 5007:
        return <ShieldAlert size={14} className="text-red-400" />;
      default:
        return <Clock size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="w-full space-y-3 font-sans">
      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
          Sequential Telemetry Timeline ({timeline.length} Events)
        </span>
        <span className="text-[10px] font-mono text-slate-500">UTC Chronology</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot Icon */}
            <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-[#0b1017] border border-slate-700 flex items-center justify-center shadow-sm group-hover:border-cyan-400 transition-colors">
              {getEventIcon(item.eventId)}
            </div>

            {/* Timeline Card */}
            <div
              onClick={() => onOpenEvent(item.eventRecordId, item.eventId)}
              className="p-3 rounded-lg bg-[#0f151e] hover:bg-[#141e2b] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-400 shrink-0">
                  {item.time}
                </span>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-100 text-xs">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300 font-bold">
                      Event ID {item.eventId}
                    </span>
                    <SeverityBadge severity={item.severity} size="sm" />
                  </div>
                  <p className="text-slate-400 text-xs font-sans">{item.detail}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {item.evidenceId && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
                    {item.evidenceId}
                  </span>
                )}
                <span className="text-[11px] font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  <Eye size={12} className="mr-0.5" /> Inspect
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
