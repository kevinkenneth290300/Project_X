import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  Play,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sliders,
  Server,
  Terminal,
} from 'lucide-react';
import { Detection, NavigationSection } from '../types';
import { detectionService } from '../services/detectionService';
import { SeverityBadge } from '../components/severity/SeverityBadge';
import { StatusBadge } from '../components/status/StatusBadge';

interface DetectionDetailViewProps {
  detectionId?: string;
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectEvent: (eventId: string) => void;
  onSelectAgent: (agentId: string) => void;
}

export const DetectionDetailView: React.FC<DetectionDetailViewProps> = ({
  detectionId,
  onNavigate,
  onSelectEvent,
  onSelectAgent,
}) => {
  const [detection, setDetection] = useState<Detection | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setDetection(null);
    setLoadError(null);
    const fetchD = async () => {
      try {
        const data = await detectionService.getDetectionById(detectionId);
        if (active) setDetection(data);
      } catch {
        if (active) setLoadError('Unable to load the requested sample definition.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchD();
    return () => { active = false; };
  }, [detectionId]);

  if (loading) {
    return <div className="p-8 text-center font-mono text-slate-400">Loading detection definition...</div>;
  }

  if (!detection) return <div role="alert" className="p-8 font-mono text-amber-300">{loadError || 'Detection definition not found.'}</div>;

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('detections')}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back to Detections"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-bold text-slate-100">{detection.name}</h1>
              <SeverityBadge severity={detection.severity} size="sm" />
              <StatusBadge status="Sample definition (not deployed)" size="sm" />
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Rule ID: {detection.id} • MITRE ATT&amp;CK {detection.mitreAttack.id} ({detection.mitreAttack.name} - {detection.mitreAttack.tactic})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            disabled
            aria-describedby="detection-detail-unavailable"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 cursor-not-allowed"
          >
            <Play size={12} />
            <span>Test Against History</span>
          </button>
          <button
            disabled
            aria-describedby="detection-detail-unavailable"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-400 cursor-not-allowed"
          >
            <Sliders size={12} />Deploy Rule
          </button>
        </div>
      </div>

      <p id="detection-detail-unavailable" role="status" className="text-amber-300 font-mono text-xs">
        Validation, backtesting, and deployment are unavailable. This is an unevaluated sample definition, not an active rule.
      </p>

      {/* Main Grid: Rule Query & Evidence Extraction Template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Rule Logic Query Display */}
        <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Rule Logic (KQL / Lucene Expression)
            </h3>
            <span className="text-[10px] text-slate-400">Engine unavailable</span>
          </div>

          <pre className="p-3 rounded bg-slate-950 text-cyan-300 text-xs overflow-x-auto border border-slate-800/80 whitespace-pre font-mono leading-relaxed select-all">
            {detection.ruleQuery}
          </pre>

          <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
            {detection.description}
          </div>
        </div>

        {/* Evidence Template */}
        <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Evidence Synthesis Template
            </h3>
            <span className="text-[10px] text-slate-400">Sample template</span>
          </div>

          <div className="p-3 rounded bg-[#0b1017] border border-slate-800 text-slate-300 text-xs font-sans leading-relaxed">
            {detection.evidenceTemplate}
          </div>

          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Sample Confidence:</span>
              <span className="text-slate-400">{detection.confidence > 0 ? `${detection.confidence}% (sample)` : 'Not assessed'}</span>
            </div>
            <div className="flex justify-between">
              <span>Auto-Investigation Trigger:</span>
              <span className="text-slate-400">Unavailable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trigger History on Fleet */}
      <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Linked Sample Records ({detection.recentMatchEventIds?.length || 0})
          </h3>
          <span className="text-[10px] text-slate-400">Not evaluated</span>
        </div>

        <div className="space-y-2">
          {(detection.recentMatchEventIds || []).map((recordId) => (
            <div
              key={recordId}
              className="p-3 rounded-lg bg-[#0b1017] border border-slate-800/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-cyan-300">{recordId}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectEvent(recordId);
                    onNavigate('event-detail');
                  }}
                  className="text-cyan-400 hover:underline text-[11px] cursor-pointer"
                >
                  Inspect Sample Record &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
