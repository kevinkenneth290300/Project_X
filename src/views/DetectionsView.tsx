import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Server,
  Activity,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Detection, SeverityLevel, NavigationSection } from '../types';
import { detectionService } from '../services/detectionService';
import { SeverityBadge } from '../components/severity/SeverityBadge';
import { StatusBadge } from '../components/status/StatusBadge';
import { CreateDetectionModal } from '../components/dialogs/CreateDetectionModal';

interface DetectionsViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectDetection: (detectionId: string) => void;
  initialSeverityFilter?: SeverityLevel | 'All';
}

export const DetectionsView: React.FC<DetectionsViewProps> = ({
  onNavigate,
  onSelectDetection,
  initialSeverityFilter = 'All',
}) => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'All'>(initialSeverityFilter);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Testing' | 'Disabled'>('All');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchDetections = async () => {
    setLoading(true);
    const data = await detectionService.getDetections({
      severity: severityFilter,
      status: statusFilter,
      search,
    });
    setDetections(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDetections();
  }, [severityFilter, statusFilter, search]);

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Sample Detection Definitions</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 border border-red-800/40 text-red-300 font-semibold">
              NOT DEPLOYED
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Locally stored demonstration definitions. No real rule is active and no evaluation engine is connected.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-sm transition-colors"
        >
          <Plus size={14} />
          <span>New Sample Definition</span>
        </button>
      </div>

      <p id="detection-list-unavailable" role="status" className="text-amber-300 font-mono text-xs">
        Detection validation, backtesting, and rule deployment are unavailable.
      </p>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rule name, MITRE ID, technique, query..."
              className="w-full pl-8 pr-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Severity Tabs */}
          <div className="flex items-center rounded bg-slate-900 border border-slate-700 p-0.5 text-[11px]">
            {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  severityFilter === sev
                    ? 'bg-red-950 text-red-300 font-bold border border-red-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center rounded bg-slate-900 border border-slate-700 p-0.5 text-[11px]">
            {(['All', 'Disabled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  statusFilter === st
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detections List */}
      <div className="space-y-3 font-mono">
        {detections.map((det) => (
          <div
            key={det.id}
            onClick={() => {
              onSelectDetection(det.id);
              onNavigate('detection-detail');
            }}
            className="p-4 rounded-xl bg-[#0f151e] hover:bg-[#141e2b] border border-slate-800 hover:border-red-900/60 transition-all cursor-pointer shadow-sm space-y-3 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <SeverityBadge severity={det.severity} size="sm" />
                <h3 className="font-bold text-slate-100 text-sm group-hover:text-red-300 transition-colors">
                  {det.name}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                  {det.confidence > 0 ? `Sample confidence: ${det.confidence}%` : 'Not assessed'}
                </span>
                <button
                  disabled
                  aria-label={`Deploy sample definition ${det.name}`}
                  aria-describedby="detection-list-unavailable"
                  className="flex items-center gap-1 text-slate-400 cursor-not-allowed"
                  title="Rule deployment unavailable"
                >
                  <ToggleLeft size={13} /><span className="text-slate-400 text-[11px]">Not deployed</span>
                </button>
              </div>
            </div>

            <p className="text-slate-300 text-xs font-sans leading-relaxed">{det.description}</p>

            {/* Query Preview */}
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-[11px] text-cyan-300/90 font-mono truncate">
              {det.ruleQuery}
            </div>

            {/* Footer Details */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-red-950/40 border border-red-800/30 text-red-300 text-[10px] font-bold">
                  MITRE: {det.mitreAttack.id} ({det.mitreAttack.name})
                </span>
                <span>Tactic: {det.mitreAttack.tactic}</span>
                <span className="text-slate-300">Sample triggers: {det.triggersCount}</span>
              </div>

              <div className="flex items-center gap-2">
                <span>Sample last trigger: {det.lastTriggered}</span>
                <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Rule Detail <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateDetectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onDetectionCreated={() => { fetchDetections(); }}
      />
    </div>
  );
};
