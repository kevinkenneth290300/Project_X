import React from 'react';
import { Sparkles, ShieldAlert, CheckCircle, ExternalLink, ArrowRight, BrainCircuit } from 'lucide-react';
import { SeverityBadge } from '../severity/SeverityBadge';
import { SeverityLevel } from '../../types';

interface Finding {
  id: string;
  text: string;
  evidenceId: string;
  severity: SeverityLevel;
}

interface InvestigationAssistantProps {
  summary: string;
  confidence: number;
  findings: Finding[];
  onOpenEvidence: (evidenceId: string) => void;
}

export const InvestigationAssistant: React.FC<InvestigationAssistantProps> = ({
  summary,
  confidence = 87,
  findings,
  onOpenEvidence,
}) => {
  return (
    <div className="rounded-lg bg-[#0f151f] border border-cyan-950/60 p-4 space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-cyan-950/80 border border-cyan-700/40 text-cyan-400">
            <BrainCircuit size={16} />
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
              Investigation Assistant
            </h3>
            <p className="text-[10px] font-mono text-slate-400">Deterministic Telemetry Synthesis</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[11px]">
          <span className="text-slate-400">Confidence:</span>
          <span className="text-cyan-300 font-semibold">{confidence}%</span>
        </div>
      </div>

      {/* Narrative Synthesis */}
      <div className="p-3 rounded-md bg-[#0b1017] border-l-2 border-cyan-500 text-slate-300 text-xs leading-relaxed">
        <p className="italic">«{summary}»</p>
      </div>

      {/* Assessment Metric */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
          Assessment
        </div>
        <div className="flex items-center justify-between p-2.5 rounded bg-[#0b1017] border border-slate-800">
          <div className="flex items-center gap-2">
            <SeverityBadge severity="High" size="sm" />
            <span className="font-mono text-slate-200 text-[11px]">Probable Lateral Movement &amp; Persistence</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">{confidence}% confidence</span>
        </div>
      </div>

      {/* Findings Breakdown with Clickable Evidence Links */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold flex items-center justify-between">
          <span>Key Findings ({findings.length})</span>
          <span className="text-[10px] text-slate-500 font-normal">Click evidence to inspect event</span>
        </div>

        <div className="space-y-2">
          {findings.map((f, idx) => (
            <div
              key={f.id || idx}
              className="p-2.5 rounded bg-[#0b1017] border border-slate-800/90 hover:border-slate-700 transition-colors flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-slate-500 text-[11px] font-semibold mt-0.5">
                  {idx + 1}.
                </span>
                <p className="text-slate-200 text-xs leading-snug">{f.text}</p>
              </div>

              <button
                onClick={() => onOpenEvidence(f.evidenceId)}
                className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800/50 text-cyan-300 transition-colors cursor-pointer"
                title={`Inspect Evidence ${f.evidenceId}`}
              >
                <span>Evidence: {f.evidenceId}</span>
                <ExternalLink size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
