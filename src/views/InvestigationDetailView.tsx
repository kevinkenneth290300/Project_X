import React, { useState, useEffect } from 'react';
import {
  SearchCheck,
  ArrowLeft,
  Download,
  Share2,
  Plus,
  Server,
  User,
  Clock,
  FolderLock,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Send,
  ExternalLink,
  ChevronDown,
  Layers,
  FileDown,
} from 'lucide-react';
import { Investigation, EvidenceItem, NavigationSection } from '../types';
import { investigationService } from '../services/investigationService';
import { evidenceService } from '../services/evidenceService';
import { SeverityBadge } from '../components/severity/SeverityBadge';
import { StatusBadge } from '../components/status/StatusBadge';
import { InvestigationAssistant } from '../components/investigations/InvestigationAssistant';
import { InvestigationTimeline } from '../components/investigations/InvestigationTimeline';
import { EvidenceGraph } from '../components/evidence/EvidenceGraph';

interface InvestigationDetailViewProps {
  investigationId?: string;
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectEvent: (eventId: string) => void;
  onSelectAgent: (agentId: string) => void;
}

export const InvestigationDetailView: React.FC<InvestigationDetailViewProps> = ({
  investigationId = 'INV-000142',
  onNavigate,
  onSelectEvent,
  onSelectAgent,
}) => {
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'graph' | 'evidence' | 'notes'>('timeline');
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  useEffect(() => {
    const fetchInv = async () => {
      setLoading(true);
      const data = await investigationService.getInvestigationById(investigationId || 'INV-000142');
      const currentInv = data || (await investigationService.getInvestigationById('INV-000142'));
      setInvestigation(currentInv);
      if (currentInv) {
        const evs = await evidenceService.getEvidenceForInvestigation(currentInv.evidenceIds);
        setEvidenceList(evs);
      }
      setLoading(false);
    };
    fetchInv();
  }, [investigationId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investigation || !newNoteText.trim()) return;
    setIsAddingNote(true);
    const createdNote = await investigationService.addNote(
      investigation.id,
      'Alex Vance',
      'SOC Senior Analyst',
      newNoteText
    );
    setInvestigation({
      ...investigation,
      notes: [createdNote, ...investigation.notes],
    });
    setNewNoteText('');
    setIsAddingNote(false);
  };

  const handleStatusChange = async (newStatus: any) => {
    if (!investigation) return;
    const updated = await investigationService.updateStatus(investigation.id, newStatus);
    if (updated) setInvestigation(updated);
    setStatusMenuOpen(false);
  };

  const handleOpenEvidence = (evidenceId: string) => {
    // Map evidence ID to associated event
    if (evidenceId === 'EVID-001') onSelectEvent('evt-4624-rdp');
    else if (evidenceId === 'EVID-002') onSelectEvent('evt-4672-priv');
    else if (evidenceId === 'EVID-003') onSelectEvent('evt-4688-proc');
    else if (evidenceId === 'EVID-004') onSelectEvent('evt-7045-svc');
    else if (evidenceId === 'EVID-005') onSelectEvent('evt-5007-def');
    else onSelectEvent('evt-7045-svc');
    onNavigate('event-detail');
  };

  if (loading || !investigation) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        Loading investigation dossier and telemetry graph...
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <button
            onClick={() => onNavigate('investigations')}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors mt-0.5 sm:mt-0"
            title="Back to Investigations List"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-bold text-amber-400">{investigation.id}:</span>
              <h1 className="font-mono text-base font-bold text-slate-100">{investigation.title}</h1>
              <SeverityBadge severity={investigation.severity} size="sm" />
              <StatusBadge status={investigation.status} size="sm" />
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
                Confidence: {investigation.confidence}%
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Host: <span className="text-cyan-400 font-bold cursor-pointer hover:underline" onClick={() => onNavigate('agent-detail')}>{investigation.host}</span> • Assigned: {investigation.assignedTo} • Created: {investigation.createdAt}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* Status Change Dropdown */}
          <div className="relative">
            <button
              onClick={() => setStatusMenuOpen(!statusMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              <span>Status: {investigation.status}</span>
              <ChevronDown size={13} />
            </button>
            {statusMenuOpen && (
              <div className="absolute right-0 mt-1 w-40 rounded bg-[#0f151e] border border-slate-800 shadow-xl z-50 p-1">
                {(['Open', 'Investigating', 'Resolved', 'Closed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-300 text-xs"
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Evidence Package */}
          <button
            disabled
            aria-describedby="evidence-export-unavailable"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-semibold cursor-not-allowed"
            title="Evidence export unavailable: no verified provenance or chain of custody"
          >
            <FileDown size={13} />
            <span>Export Evidence Package</span>
          </button>
        </div>
      </div>

      <p id="evidence-export-unavailable" role="status" className="text-amber-300 font-mono text-xs">
        Evidence export unavailable: sample data has no verified digests, provenance, or chain of custody.
      </p>

      {/* Flagship Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (5 cols): AI Investigation Assistant */}
        <div className="lg:col-span-5 space-y-4">
          <InvestigationAssistant
            summary={investigation.aiAssistantAssessment.summary}
            confidence={investigation.aiAssistantAssessment.confidence}
            findings={investigation.aiAssistantAssessment.findings as any}
            onOpenEvidence={handleOpenEvidence}
          />

          {/* Incident Overview Card */}
          <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Enclave &amp; Host Context
            </h3>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Target Host:</span>
                <span className="text-cyan-300 font-bold">{investigation.host} (10.20.4.42)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">OS Environment:</span>
                <span className="text-slate-200">Windows Server 2022 DC</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Enclave:</span>
                <span className="text-slate-200">US-East-DC1 (Tier 1 Enclave)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Preserved Records:</span>
                <span className="text-amber-300 font-bold">{investigation.evidenceIds.length} Telemetry Artifacts</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Ledger Hash:</span>
                <span className="text-slate-400 truncate max-w-[150px]">sha256:7f3a9e21...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Timeline, Relationship Graph, Evidence Ledger, Analyst Notes */}
        <div className="lg:col-span-7 space-y-4">
          {/* Workspace Tabs Header */}
          <div className="flex items-center gap-1 border-b border-slate-800 font-mono text-xs overflow-x-auto pb-0.5">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-[#0f151e] text-cyan-300 border-t border-x border-slate-800 border-b-2 border-b-transparent'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sequential Timeline ({investigation.timeline.length})
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer ${
                activeTab === 'graph'
                  ? 'bg-[#0f151e] text-cyan-300 border-t border-x border-slate-800 border-b-2 border-b-transparent'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Relationship Graph
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer ${
                activeTab === 'evidence'
                  ? 'bg-[#0f151e] text-cyan-300 border-t border-x border-slate-800 border-b-2 border-b-transparent'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Evidence Ledger ({evidenceList.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-t font-semibold transition-colors cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-[#0f151e] text-cyan-300 border-t border-x border-slate-800 border-b-2 border-b-transparent'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analyst Notes ({investigation.notes.length})
            </button>
          </div>

          {/* Tab 1: Sequential Timeline */}
          {activeTab === 'timeline' && (
            <div className="p-4 rounded-lg bg-[#0f151e] border border-slate-800">
              <InvestigationTimeline
                timeline={investigation.timeline}
                onOpenEvent={(recId, eid) => {
                  onSelectEvent(recId);
                  onNavigate('event-detail');
                }}
              />
            </div>
          )}

          {/* Tab 2: Relationship Graph */}
          {activeTab === 'graph' && (
            <div className="p-4 rounded-lg bg-[#0f151e] border border-slate-800 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Incident Entity &amp; Execution Graph
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Interactive Visual Node Correlation</span>
              </div>
              <EvidenceGraph onOpenEvidence={handleOpenEvidence} />
            </div>
          )}

          {/* Tab 3: Evidence Ledger */}
          {activeTab === 'evidence' && (
            <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Preserved Evidence Items ({evidenceList.length})
                </h3>
                <span className="text-[10px] text-emerald-400">Chain of Custody Active</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b1017] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-3 py-2">Evidence ID</th>
                      <th className="px-3 py-2">Event Type</th>
                      <th className="px-3 py-2">Timestamp (UTC)</th>
                      <th className="px-3 py-2">Key Detail</th>
                      <th className="px-3 py-2 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {evidenceList.map((ev) => (
                      <tr
                        key={ev.id}
                        onClick={() => handleOpenEvidence(ev.id)}
                        className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="px-3 py-2.5 font-bold text-cyan-300">{ev.id}</td>
                        <td className="px-3 py-2.5 text-slate-300">{ev.eventType}</td>
                        <td className="px-3 py-2.5 text-slate-400 text-[11px]">{ev.timestamp.slice(11, 19)}</td>
                        <td className="px-3 py-2.5 text-slate-300 max-w-[200px] truncate" title={ev.keyDetail}>
                          {ev.keyDetail}
                        </td>
                        <td className="px-3 py-2.5 text-right text-cyan-400 font-semibold text-[11px]">
                          Open &rarr;
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Analyst Notes Thread */}
          {activeTab === 'notes' && (
            <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Analyst Collaboration &amp; Case Notes ({investigation.notes.length})
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Authenticated Ledger</span>
              </div>

              {/* Add Note Input Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add case observation, host triage finding, or containment action..."
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isAddingNote || !newNoteText.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer disabled:opacity-50"
                  >
                    <Send size={12} />
                    <span>Post Note</span>
                  </button>
                </div>
              </form>

              {/* Notes Thread */}
              <div className="space-y-3 pt-2">
                {investigation.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-lg bg-[#0b1017] border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{note.author}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                          {note.role}
                        </span>
                      </div>
                      <span className="text-slate-500">{note.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
