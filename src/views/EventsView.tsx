import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Filter,
  Play,
  Pause,
  Download,
  RefreshCw,
  Clock,
  ArrowRight,
  Server,
  User,
  Shield,
  FileCode,
} from 'lucide-react';
import { EventRecord, SeverityLevel, NavigationSection } from '../types';
import { eventService } from '../services/eventService';
import { SeverityBadge } from '../components/severity/SeverityBadge';

interface EventsViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectEvent: (eventId: string) => void;
  initialHostFilter?: string;
}

export const EventsView: React.FC<EventsViewProps> = ({
  onNavigate,
  onSelectEvent,
  initialHostFilter = 'All',
}) => {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'All'>('All');
  const [hostFilter, setHostFilter] = useState<string>(initialHostFilter);
  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [eventIdFilter, setEventIdFilter] = useState<string>('All');
  const [timeRange, setTimeRange] = useState('Last 1h');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const data = await eventService.getEvents({
      search,
      severity: severityFilter,
      host: hostFilter,
      channel: channelFilter,
      eventId: eventIdFilter,
      timeRange,
    });
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [search, severityFilter, hostFilter, channelFilter, eventIdFilter, timeRange]);

  // Simulate live ingestion pulsing
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      // Periodic subtle heartbeat
    }, 4000);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Event Explorer</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              STRUCTURED LOG STREAM
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Windows event logs, Sysmon, Script Block Logging, and Normalized Syslog stream
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-semibold cursor-pointer border transition-colors ${
              isLiveStreaming
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isLiveStreaming ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <Pause size={12} />
                <span>Streaming Live</span>
              </>
            ) : (
              <>
                <Play size={12} />
                <span>Resume Stream</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fast Filter Bar */}
      <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 space-y-2.5 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event ID, host, user, process name, commandline, IP..."
              className="w-full pl-8 pr-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Time Presets */}
          <div className="flex items-center rounded bg-slate-900 border border-slate-700 p-0.5">
            {['15m', '1h', '24h', '7d'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(`Last ${t}`)}
                className={`px-2.5 py-1 rounded text-[11px] cursor-pointer transition-colors ${
                  timeRange === `Last ${t}`
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={fetchEvents}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Refresh Events"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Second Row: Specific Structured Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
          {/* Host Selector */}
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">Host:</label>
            <select
              value={hostFilter}
              onChange={(e) => setHostFilter(e.target.value)}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
            >
              <option value="All">All Hosts (184)</option>
              <option value="SERVER-42">SERVER-42 (IR Active)</option>
              <option value="DC-01">DC-01 (Domain Controller)</option>
              <option value="DC-02">DC-02</option>
              <option value="APP-17">APP-17</option>
              <option value="SERVER-01">SERVER-01</option>
              <option value="SERVER-02">SERVER-02</option>
            </select>
          </div>

          {/* Event ID Selector */}
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">Key Event ID:</label>
            <select
              value={eventIdFilter}
              onChange={(e) => setEventIdFilter(e.target.value)}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
            >
              <option value="All">All Event IDs</option>
              <option value="4624">4624 (Logon Success)</option>
              <option value="4672">4672 (Privilege Assignment)</option>
              <option value="4688">4688 (Process Creation)</option>
              <option value="7045">7045 (Service Installed)</option>
              <option value="5007">5007 (Defender Tampering)</option>
              <option value="4104">4104 (ScriptBlock Logging)</option>
            </select>
          </div>

          {/* Channel Selector */}
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">Channel:</label>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
            >
              <option value="All">All Channels</option>
              <option value="Security">Security</option>
              <option value="System">System</option>
              <option value="Application">Application</option>
              <option value="Microsoft-Windows-PowerShell/Operational">PowerShell/Operational</option>
              <option value="Microsoft-Windows-Windows Defender/Operational">Defender/Operational</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">Severity:</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Informational">Informational</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Stream Table */}
      <div className="rounded-lg bg-[#0f151e] border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0b1017] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-3 py-2.5">Time (UTC)</th>
                <th className="px-3 py-2.5">Host</th>
                <th className="px-3 py-2.5">Event ID</th>
                <th className="px-3 py-2.5">Channel</th>
                <th className="px-3 py-2.5">Provider</th>
                <th className="px-3 py-2.5">User</th>
                <th className="px-3 py-2.5">Severity</th>
                <th className="px-3 py-2.5">Summary</th>
                <th className="px-3 py-2.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {events.map((evt) => (
                <tr
                  key={evt.id}
                  onClick={() => {
                    onSelectEvent(evt.id);
                    onNavigate('event-detail');
                  }}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="px-3 py-2.5 text-slate-400 text-[11px] whitespace-nowrap">
                    {evt.timestamp.slice(11, 19)}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                    {evt.host}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-bold text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/30">
                      {evt.eventId}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-400 truncate max-w-[120px]" title={evt.channel}>
                    {evt.channel}
                  </td>
                  <td className="px-3 py-2.5 text-slate-400 truncate max-w-[130px]" title={evt.provider}>
                    {evt.provider}
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 font-semibold">{evt.user}</td>
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
