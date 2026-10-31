import React, { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  ShieldAlert,
  HardDrive,
  Cpu,
  Layers,
  ArrowLeft,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Radio,
  ExternalLink,
  ChevronRight,
  Database,
  Sliders,
} from 'lucide-react';
import { Agent, EventRecord, Detection, NavigationSection } from '../types';
import { agentService } from '../services/agentService';
import { eventService } from '../services/eventService';
import { detectionService } from '../services/detectionService';
import { StatusBadge } from '../components/status/StatusBadge';
import { SeverityBadge } from '../components/severity/SeverityBadge';

interface AgentDetailViewProps {
  agentId?: string;
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectEvent: (eventId: string) => void;
  onSelectInvestigation: (invId: string) => void;
}

export const AgentDetailView: React.FC<AgentDetailViewProps> = ({
  agentId = 'agent-042',
  onNavigate,
  onSelectEvent,
  onSelectInvestigation,
}) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [investigationMode, setInvestigationMode] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [agentData, eventsData, detData] = await Promise.all([
        agentService.getAgentById(agentId || 'agent-042'),
        eventService.getEvents({ host: 'SERVER-42' }),
        detectionService.getDetections(),
      ]);
      const currentAgent = agentData || (await agentService.getAgentById('agent-042'));
      setAgent(currentAgent);
      if (currentAgent) {
        setInvestigationMode(currentAgent.investigationMode);
      }
      setEvents(eventsData);
      setDetections(detData.filter((d) => d.hostsImpacted.includes(currentAgent?.hostname || 'SERVER-42')));
      setLoading(false);
    };
    fetchData();
  }, [agentId]);

  if (loading || !agent) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-cyan-400" />
        Loading telemetry stream for host agent...
      </div>
    );
  }

  const channels = Object.entries(agent.collection).filter(([, enabled]) => enabled).map(([name]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    filterMode: 'Sample only',
    eventRate: 'Unavailable',
    status: 'Unavailable',
  }));

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Top Breadcrumb Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('agents')}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back to Agent Fleet"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-lg font-bold text-slate-100">{agent.hostname}</h1>
              <StatusBadge status={`Sample: ${agent.status}`} size="sm" showPulse={false} />
              {investigationMode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-600/50 text-amber-300 font-bold flex items-center gap-1">
                  <Flame size={12} /> SAMPLE IR CONFIGURATION
                </span>
              )}
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Agent ID: {agent.id} • {agent.ip} • Enclave: {agent.site}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('events', { host: agent.hostname })}
            className="px-3 py-1.5 rounded bg-[#0f151e] hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Layers size={13} className="text-cyan-400" />
            <span>Host Events ({events.length})</span>
          </button>
        </div>
      </div>

      <p id="agent-operations-unavailable" role="status" className="text-amber-300 font-mono text-xs">
        Enrollment, restart, and IR/profile deployment are unavailable. Sample agents are not connected endpoints.
      </p>

      {/* Investigation Mode High-Detail Collection Banner */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          investigationMode
            ? 'bg-gradient-to-r from-amber-950/40 via-[#0f151e] to-slate-900 border-amber-600/50 shadow-lg'
            : 'bg-[#0f151e] border-slate-800'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Flame size={16} className={investigationMode ? 'text-amber-400' : 'text-slate-500'} />
              <h3 className="font-mono text-sm font-bold text-slate-100">
                Investigation Mode (Sample Collection Profile)
              </h3>
            </div>
            <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
              This is sample profile configuration only. No IR command can be sent and no endpoint collection change can be deployed from this demonstration.
            </p>
          </div>

          <button
            disabled
            aria-describedby="agent-operations-unavailable"
            className="px-4 py-2 rounded font-mono text-xs font-semibold cursor-not-allowed shrink-0 flex items-center gap-2 bg-slate-900 border border-slate-700 text-slate-400"
          >
            <Sliders size={13} />
            <span>Deploy Investigation Mode</span>
          </button>
        </div>
      </div>

      {/* Metadata Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">IP Address</div>
          <div className="font-bold text-slate-100 mt-1">{agent.ip}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Collection Profile</div>
          <div className="font-bold text-cyan-300 mt-1 truncate" title={agent.profileName}>
            {agent.profileName}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Agent Version</div>
          <div className="font-bold text-slate-100 mt-1">v{agent.version}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Host Uptime</div>
          <div className="font-bold text-slate-100 mt-1">{agent.uptime}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Sample Throughput</div>
          <div className="font-bold text-emerald-400 mt-1">{agent.eventsPerSec}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Sample Queue</div>
          <div className="font-bold text-amber-400 mt-1">{agent.queueSize}</div>
        </div>
      </div>

      {/* Main Grid: Active Channels & Recent Detections on this Host */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Windows Channels List (1 col) */}
        <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Sample Channels</h2>
            <span className="text-[10px] text-cyan-400 font-semibold">{channels.length} Sample Enabled</span>
          </div>

          <div className="space-y-2">
            {channels.map((chan) => (
              <div
                key={chan.name}
                className="p-2.5 rounded bg-[#0b1017] border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-200 text-xs">{chan.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Mode: <span className="text-slate-300">{chan.filterMode}</span> • Rate: {chan.eventRate}
                  </div>
                </div>
                <StatusBadge status={chan.status} size="sm" />
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Disk Buffer Spool:</span>
              <span className="text-slate-400">Unavailable</span>
            </div>
            <div className="flex justify-between">
              <span>TLS Fingerprint:</span>
              <span className="text-slate-400">Unavailable</span>
            </div>
          </div>
        </div>

        {/* Recent Detections on this Host (2 cols) */}
        <div className="lg:col-span-2 rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-red-400" />
              <h2 className="font-mono text-sm font-bold text-slate-100 uppercase tracking-wide">
                Recent Detections on {agent.hostname}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('detections')}
              className="font-mono text-[11px] text-cyan-400 hover:underline cursor-pointer"
            >
              All Detections &rarr;
            </button>
          </div>

          <div className="space-y-2 font-mono">
            {detections.map((det) => (
              <div
                key={det.id}
                onClick={() => onNavigate('detection-detail')}
                className="p-3 rounded-lg bg-[#0b1017] hover:bg-[#131d2a] border border-red-950/60 hover:border-red-800/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={det.severity} size="sm" />
                    <span className="font-bold text-slate-100 text-xs font-mono">{det.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">{det.description}</p>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    MITRE ATT&CK: {det.mitreAttack.id} ({det.mitreAttack.name})
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] text-red-400 font-semibold">{det.lastTriggered}</div>
                  <div className="text-[10px] text-slate-500">Confidence: {det.confidence}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Host Telemetry Event Stream Table */}
      <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Recent Events from {agent.hostname} ({events.length} records)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('events', { host: agent.hostname })}
            className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
          >
            Explore in Event Log Viewer &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1017] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-3 py-2.5">Time (UTC)</th>
                <th className="px-3 py-2.5">Event ID</th>
                <th className="px-3 py-2.5">Channel</th>
                <th className="px-3 py-2.5">User</th>
                <th className="px-3 py-2.5">Severity</th>
                <th className="px-3 py-2.5">Summary</th>
                <th className="px-3 py-2.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {events.slice(0, 5).map((evt) => (
                <tr
                  key={evt.id}
                  onClick={() => {
                    onSelectEvent(evt.id);
                    onNavigate('event-detail');
                  }}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2.5 text-slate-400 text-[11px] whitespace-nowrap">
                    {evt.timestamp.slice(11, 19)}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-cyan-300">{evt.eventId}</td>
                  <td className="px-3 py-2.5 text-slate-400">{evt.channel}</td>
                  <td className="px-3 py-2.5 text-slate-300">{evt.user}</td>
                  <td className="px-3 py-2.5">
                    <SeverityBadge severity={evt.severity} size="sm" />
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 truncate max-w-[280px]" title={evt.summary}>
                    {evt.summary}
                  </td>
                  <td className="px-3 py-2.5 text-right text-cyan-400 text-[11px] font-semibold">
                    Inspect &rarr;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
