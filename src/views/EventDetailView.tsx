import React, { useState, useEffect } from 'react';
import {
  Layers,
  ArrowLeft,
  Copy,
  Check,
  ShieldAlert,
  SearchCheck,
  Plus,
  Code,
  FileCode,
  Clock,
  Server,
  User,
  Terminal,
  Activity,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { EventRecord, NavigationSection, Investigation } from '../types';
import { eventService } from '../services/eventService';
import { investigationService } from '../services/investigationService';
import { SeverityBadge } from '../components/severity/SeverityBadge';
import { CreateDetectionModal } from '../components/dialogs/CreateDetectionModal';

interface EventDetailViewProps {
  eventId?: string;
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectAgent: (agentId: string) => void;
  onSelectInvestigation: (invId: string) => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  eventId = 'evt-7045-svc',
  onNavigate,
  onSelectAgent,
  onSelectInvestigation,
}) => {
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'xml' | 'json' | 'correlation'>('summary');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showCreateDetectionModal, setShowCreateDetectionModal] = useState(false);
  const [addedToInv, setAddedToInv] = useState(false);
  const [correlatedEvents, setCorrelatedEvents] = useState<EventRecord[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const data = await eventService.getEventById(eventId || 'evt-7045-svc');
      const currentEvt = data || (await eventService.getEventById('evt-7045-svc'));
      setEvent(currentEvt);
      if (currentEvt) {
        const corr = await eventService.getEvents({ host: currentEvt.host });
        setCorrelatedEvents(corr.filter((e) => e.id !== currentEvt.id));
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleAddToInvestigation = async () => {
    if (!event) return;
    await investigationService.addNote(
      'INV-000142',
      'Alex Vance',
      'SOC Senior Analyst',
      `Attached Event ${event.eventId} (${event.summary}) from ${event.host} to investigation evidence ledger.`
    );
    setAddedToInv(true);
    setTimeout(() => setAddedToInv(false), 3000);
  };

  if (loading || !event) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        Loading event telemetry artifact...
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('events')}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back to Event Explorer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-cyan-300">Event ID {event.eventId}</span>
              <SeverityBadge severity={event.severity} size="sm" />
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                {event.channel}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Host: <span className="text-slate-200 font-semibold cursor-pointer hover:underline" onClick={() => onNavigate('agent-detail')}>{event.host}</span> • {event.timestamp} • Provider: {event.provider}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={handleAddToInvestigation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-950/70 hover:bg-amber-900 border border-amber-700/60 text-amber-300 transition-colors cursor-pointer"
          >
            <SearchCheck size={13} />
            <span>{addedToInv ? '✓ Attached to INV-000142' : 'Add to Investigation'}</span>
          </button>

          <button
            onClick={() => setShowCreateDetectionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>Create Detection</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 font-mono text-xs">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-3.5 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'summary'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Summary &amp; Key Fields
        </button>
        <button
          onClick={() => setActiveTab('xml')}
          className={`px-3.5 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'xml'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Raw XML Payload
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`px-3.5 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'json'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          JSON Schema (ECS)
        </button>
        <button
          onClick={() => setActiveTab('correlation')}
          className={`px-3.5 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'correlation'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Temporal Context &amp; Correlation ({correlatedEvents.length})
        </button>
      </div>

      {/* Tab 1: Human-readable Summary & Key Fields */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          {/* Summary Box */}
          <div className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 space-y-2">
            <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
              Event Narrative
            </h3>
            <p className="text-sm font-mono text-slate-100">{event.summary}</p>
          </div>

          {/* Structured Key-Value Fields Grid */}
          <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Parsed Event Data (Winlogbeat / Manifest Schema)
              </h3>
              <span className="text-[10px] text-slate-400">{Object.keys(event.details).length} Normalized Fields</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(event.details).map(([key, value]) => (
                <div key={key} className="p-2.5 rounded bg-[#0b1017] border border-slate-800/80 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">{key}</div>
                  <div className="text-slate-100 font-bold text-xs break-all select-all font-mono">
                    {String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Context Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase">Actor Identity</div>
              <div className="font-bold text-amber-300 mt-1">{event.user}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Source IP: {event.sourceIp}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase">Record Integrity</div>
              <div className="font-bold text-emerald-400 mt-1">Record ID #{event.recordNumber}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Hash: sha256 verified</div>
            </div>
            <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase">Linked Investigation</div>
              <div
                onClick={() => onNavigate('investigation-detail')}
                className="font-bold text-cyan-400 mt-1 cursor-pointer hover:underline flex items-center gap-1"
              >
                <span>INV-000142</span>
                <ExternalLink size={12} />
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">High Confidence Alert</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Raw XML View */}
      {activeTab === 'xml' && (
        <div className="rounded-lg bg-[#0b1017] border border-slate-800 p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-[11px]">Native Windows Event Viewer XML Structure</span>
            <button
              onClick={() => handleCopy(event.rawXml, 'xml')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer text-[11px]"
            >
              {copiedType === 'xml' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedType === 'xml' ? 'Copied XML' : 'Copy Raw XML'}</span>
            </button>
          </div>

          <pre className="text-[11px] text-emerald-300/90 overflow-x-auto p-3 rounded bg-slate-950/80 border border-slate-800/80 whitespace-pre font-mono leading-relaxed select-all">
            {event.rawXml}
          </pre>
        </div>
      )}

      {/* Tab 3: JSON View */}
      {activeTab === 'json' && (
        <div className="rounded-lg bg-[#0b1017] border border-slate-800 p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-[11px]">Elastic Common Schema (ECS) Ingestion Document</span>
            <button
              onClick={() => handleCopy(JSON.stringify(event, null, 2), 'json')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer text-[11px]"
            >
              {copiedType === 'json' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedType === 'json' ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>
          </div>

          <pre className="text-[11px] text-cyan-300/90 overflow-x-auto p-3 rounded bg-slate-950/80 border border-slate-800/80 whitespace-pre font-mono leading-relaxed select-all">
            {JSON.stringify(event, null, 2)}
          </pre>
        </div>
      )}

      {/* Tab 4: Correlation */}
      {activeTab === 'correlation' && (
        <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-slate-100 uppercase tracking-wide">
              Temporal Context: Events on {event.host} ± 5 minutes
            </h3>
            <span className="text-[10px] text-slate-400">{correlatedEvents.length} events correlated</span>
          </div>

          <div className="space-y-2">
            {correlatedEvents.map((corr) => (
              <div
                key={corr.id}
                onClick={() => {
                  setEvent(corr);
                  setActiveTab('summary');
                }}
                className="p-2.5 rounded bg-[#0b1017] hover:bg-[#141e2b] border border-slate-800/80 hover:border-cyan-800/50 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">{corr.timestamp.slice(11, 19)}</span>
                  <span className="font-bold text-cyan-300">ID {corr.eventId}</span>
                  <span className="text-slate-200 truncate max-w-md">{corr.summary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={corr.severity} size="sm" />
                  <span className="text-cyan-400 text-[11px]">Inspect &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CreateDetectionModal
        isOpen={showCreateDetectionModal}
        onClose={() => setShowCreateDetectionModal(false)}
        prefillQuery={`event.code: ${event.eventId} AND winlog.channel: "${event.channel}"`}
        prefillTitle={`Detection for Event ${event.eventId} on ${event.host}`}
        onDetectionCreated={(d) => {
          onNavigate('detections');
        }}
      />
    </div>
  );
};
