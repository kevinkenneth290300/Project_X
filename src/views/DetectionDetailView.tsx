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
  detectionId = 'det-001',
  onNavigate,
  onSelectEvent,
  onSelectAgent,
}) => {
  const [detection, setDetection] = useState<Detection | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const fetchD = async () => {
      setLoading(true);
      const data = await detectionService.getDetectionById(detectionId || 'det-001');
      setDetection(data || (await detectionService.getDetectionById('det-001')));
      setLoading(false);
    };
    fetchD();
  }, [detectionId]);

  const handleTestRule = async () => {
    setIsTesting(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsTesting(false);
    setTestResult(
      'Historical Backtest Completed: 1 positive match found on SERVER-42 (Event ID 7045) at 10:42:17 UTC.'
    );
    setTimeout(() => setTestResult(null), 5000);
  };

  const handleToggle = async () => {
    if (!detection) return;
    const updated = await detectionService.toggleDetectionStatus(detection.id);
    if (updated) setDetection(updated);
  };

  if (loading || !detection) {
    return <div className="p-8 text-center font-mono text-slate-400">Loading detection definition...</div>;
  }

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
              <StatusBadge status={detection.status} size="sm" />
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Rule ID: {detection.id} • MITRE ATT&amp;CK {detection.mitreAttack.id} ({detection.mitreAttack.name} - {detection.mitreAttack.tactic})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleTestRule}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer"
          >
            <Play size={12} className={isTesting ? 'animate-spin' : ''} />
            <span>{isTesting ? 'Running Backtest...' : 'Test Against History'}</span>
          </button>
          <button
            onClick={handleToggle}
            className={`px-3 py-1.5 rounded font-semibold cursor-pointer transition-colors ${
              detection.status === 'Active'
                ? 'bg-rose-950/60 border border-rose-700 text-rose-300 hover:bg-rose-900'
                : 'bg-emerald-950/60 border border-emerald-700 text-emerald-300 hover:bg-emerald-900'
            }`}
          >
            {detection.status === 'Active' ? 'Disable Rule' : 'Enable Rule'}
          </button>
        </div>
      </div>

      {testResult && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700 text-emerald-300 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Main Grid: Rule Query & Evidence Extraction Template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Rule Logic Query Display */}
        <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Rule Logic (KQL / Lucene Expression)
            </h3>
            <span className="text-[10px] text-cyan-400">Deterministic Engine</span>
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
            <span className="text-[10px] text-amber-400">Dossier Preserver</span>
          </div>

          <div className="p-3 rounded bg-[#0b1017] border border-slate-800 text-slate-300 text-xs font-sans leading-relaxed">
            {detection.evidenceTemplate}
          </div>

          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Confidence Base Score:</span>
              <span className="text-cyan-300 font-bold">{detection.confidence}%</span>
            </div>
            <div className="flex justify-between">
              <span>Auto-Investigation Trigger:</span>
              <span className="text-emerald-400 font-bold">Enabled for Tier-1 Hosts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trigger History on Fleet */}
      <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Recent Trigger History ({detection.hostsImpacted.length} Impacted Hosts)
          </h3>
          <span className="text-[10px] text-slate-400">Last 24 Hours</span>
        </div>

        <div className="space-y-2">
          {detection.hostsImpacted.map((host) => (
            <div
              key={host}
              className="p-3 rounded-lg bg-[#0b1017] border border-slate-800/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-cyan-300">{host}</span>
                <span className="text-slate-400 text-[11px]">Matched at 10:42:17 UTC</span>
                <span className="text-slate-300 text-[11px]">User: CORP\admin</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectEvent('evt-7045-svc');
                    onNavigate('event-detail');
                  }}
                  className="text-cyan-400 hover:underline text-[11px] cursor-pointer"
                >
                  View Trigger Event &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
