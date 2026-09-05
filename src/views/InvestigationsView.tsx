import React, { useState, useEffect } from 'react';
import {
  SearchCheck,
  Plus,
  Filter,
  Search,
  ArrowRight,
  ShieldAlert,
  Server,
  User,
  Clock,
  FolderLock,
  Sparkles,
} from 'lucide-react';
import { Investigation, NavigationSection, SeverityLevel } from '../types';
import { investigationService } from '../services/investigationService';
import { SeverityBadge } from '../components/severity/SeverityBadge';
import { StatusBadge } from '../components/status/StatusBadge';

interface InvestigationsViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectInvestigation: (invId: string) => void;
}

export const InvestigationsView: React.FC<InvestigationsViewProps> = ({
  onNavigate,
  onSelectInvestigation,
}) => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Investigating' | 'Resolved' | 'Closed'>('All');
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newHost, setNewHost] = useState('SERVER-42');
  const [newSeverity, setNewSeverity] = useState<SeverityLevel>('High');
  const [newDesc, setNewDesc] = useState('');

  const fetchInvestigations = async () => {
    setLoading(true);
    const data = await investigationService.getInvestigations({
      status: statusFilter,
      search,
    });
    setInvestigations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInvestigations();
  }, [statusFilter, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await investigationService.createInvestigation({
      title: newTitle,
      host: newHost,
      severity: newSeverity,
      description: newDesc,
    });
    setShowNewModal(false);
    onSelectInvestigation(created.id);
    onNavigate('investigation-detail');
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Investigations</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300 font-semibold">
              INCIDENT RESPONSE WORKSPACE
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Evidence-backed telemetry incident dossiers and automated root cause correlation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-xs font-bold cursor-pointer shadow-sm transition-colors"
          >
            <Plus size={14} />
            <span>New Investigation</span>
          </button>
        </div>
      </div>

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
              placeholder="Search investigation ID, title, host, description..."
              className="w-full pl-8 pr-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center rounded bg-slate-900 border border-slate-700 p-0.5">
            {(['All', 'Investigating', 'Open', 'Resolved', 'Closed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-[11px] cursor-pointer transition-colors ${
                  statusFilter === st
                    ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Investigations List Cards */}
      <div className="space-y-3">
        {investigations.map((inv) => (
          <div
            key={inv.id}
            onClick={() => {
              onSelectInvestigation(inv.id);
              onNavigate('investigation-detail');
            }}
            className="p-4 rounded-xl bg-[#0f151e] hover:bg-[#131d2b] border border-slate-800 hover:border-amber-700/50 transition-all cursor-pointer shadow-sm space-y-3 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-amber-400 group-hover:underline">
                  {inv.id}
                </span>
                <span className="font-mono font-bold text-slate-100 text-sm">{inv.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <SeverityBadge severity={inv.severity} size="sm" />
                <StatusBadge status={inv.status} size="sm" />
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                  Confidence: {inv.confidence}%
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs font-sans leading-relaxed">{inv.description}</p>

            {/* AI Assistant Assessment Teaser */}
            <div className="p-2.5 rounded bg-[#0b1017] border border-cyan-950/60 text-slate-400 font-mono text-[11px] flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <Sparkles size={13} className="text-cyan-400 shrink-0" />
                <span className="truncate">{inv.aiAssistantAssessment.summary}</span>
              </div>
              <span className="text-slate-500 shrink-0 ml-2">
                {inv.aiAssistantAssessment.findings.length} findings
              </span>
            </div>

            {/* Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400 font-mono text-[11px] pt-1 border-t border-slate-800/80">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Server size={13} className="text-cyan-400" /> {inv.host}
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={13} /> {inv.assignedTo}
                </span>
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <FolderLock size={13} /> {inv.evidenceIds.length} Evidence Items
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Updated: {inv.updatedAt}</span>
                <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Open Workspace <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Investigation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-sans text-xs">
          <div className="w-full max-w-lg rounded-xl bg-[#0f151e] border border-slate-700 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <SearchCheck size={18} className="text-amber-400" />
                <h3 className="font-mono text-sm font-bold text-slate-100">Initialize Incident Investigation</h3>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 font-mono">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Investigation Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lateral Movement via SMB Exec on SQL-03"
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Impacted Host *</label>
                  <select
                    value={newHost}
                    onChange={(e) => setNewHost(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
                  >
                    <option value="SERVER-42">SERVER-42</option>
                    <option value="DC-01">DC-01</option>
                    <option value="DC-02">DC-02</option>
                    <option value="APP-17">APP-17</option>
                    <option value="BASTION-JUMP-01">BASTION-JUMP-01</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as SeverityLevel)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Preliminary Context &amp; Indicators</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe initial trigger telemetry, suspect processes, or indicators..."
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:border-cyan-500 focus:outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold cursor-pointer"
                >
                  Create Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
