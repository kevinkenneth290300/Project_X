import React, { useState, useEffect } from 'react';
import {
  Radio,
  Plus,
  Play,
  Pause,
  Wrench,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SyslogSource, SyslogListener, SyslogMessage, NavigationSection } from '../types';
import { syslogService, SyslogStats } from '../services/syslogService';
import { StatusBadge } from '../components/status/StatusBadge';

interface SyslogViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
}

export const SyslogView: React.FC<SyslogViewProps> = ({ onNavigate }) => {
  const [sources, setSources] = useState<SyslogSource[]>([]);
  const [listeners, setListeners] = useState<SyslogListener[]>([]);
  const [messages, setMessages] = useState<SyslogMessage[]>([]);
  const [stats, setStats] = useState<SyslogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [sampleSources, sampleListeners, sampleMessages, sampleStats] = await Promise.all([
          syslogService.getSources(), syslogService.getListeners(), syslogService.getMessages(), syslogService.getStats(),
        ]);
        if (active) {
          setSources(sampleSources);
          setListeners(sampleListeners);
          setMessages(sampleMessages);
          setStats(sampleStats);
        }
      } catch {
        if (active) {
          setSources([]);
          setListeners([]);
          setMessages([]);
          setStats(null);
          setLoadError('Sample syslog data unavailable: the records could not be loaded.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, []);

  const searchTarget = (search || '').trim().toLowerCase();
  const filteredSources = sources.filter((s) => {
    if (!searchTarget) return true;
    return (
      (s.source || '').toLowerCase().includes(searchTarget) ||
      (s.ip || '').includes(searchTarget) ||
      (s.parser || '').toLowerCase().includes(searchTarget)
    );
  });

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Sample Syslog Records</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              INGESTION UNAVAILABLE
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Static sample sources and raw messages; no listener, parser, ingestion, or delivery is running in this console.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('parser-assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-mono text-xs font-semibold cursor-pointer transition-colors"
          >
            <Sparkles size={13} className="text-cyan-400" />
            <span>Sample Parser Input</span>
          </button>

          <button
            disabled
            aria-describedby="syslog-operations-unavailable"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-mono text-xs font-semibold cursor-not-allowed"
          >
            <Plus size={14} />
            <span>Configure Listener</span>
          </button>
        </div>
      </div>

      <p id="syslog-operations-unavailable" role="status" className="text-amber-300 font-mono text-xs">Live syslog listening, parser testing/deployment, and delivery measurements are unavailable. Records are samples only.</p>
      {loadError && <p role="alert" className="text-amber-300">{loadError}</p>}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Sample Source Records</div>
          <div aria-label="Sample syslog source count" className="text-xl font-bold text-slate-100 mt-0.5">{loading ? 'Loading...' : stats ? stats.sourcesCount : 'Unavailable'}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Throughput Stream</div>
          <div className="text-xl font-bold text-slate-400 mt-0.5">Unavailable</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Sample Message Records</div>
          <div aria-label="Sample syslog message count" className="text-xl font-bold text-slate-200 mt-0.5">{loading ? 'Loading...' : stats ? stats.sampleMessageCount : 'Unavailable'}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Delivery Accuracy</div>
          <div className="text-xl font-bold text-slate-400 mt-0.5">Unknown</div>
        </div>
      </div>

      {/* Ingestion Listeners Grid */}
      <div>
        <h2 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Sample Listener Preferences (Not Listening)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
          {listeners.map((listnr) => (
            <div
              key={listnr.id}
              className="p-3.5 rounded-lg bg-[#0f151e] border border-slate-800 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio size={15} className="text-cyan-400" />
                  <span className="font-bold text-slate-100 text-xs">Sample {listnr.protocol}:{listnr.port}</span>
                </div>
                <StatusBadge status="Unavailable" size="sm" showPulse={false} />
              </div>

              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span className="text-slate-200 font-semibold">{listnr.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span>Port:</span>
                  <span className="text-cyan-300 font-semibold">{listnr.port}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Rate:</span>
                  <span className="text-slate-400">Unavailable</span>
                </div>
                <div className="flex justify-between">
                  <span>Dropped Packets:</span>
                  <span className="text-slate-400">Unknown</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>Sample buffer preference: {listnr.bufferSize}</span>
                <span className="text-slate-400">TLS unverified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Syslog Sources Table */}
      <div className="rounded-lg bg-[#0f151e] border border-slate-800 overflow-hidden font-mono">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Sample Syslog Sources ({filteredSources.length}/{sources.length})
          </h2>
          <div className="relative w-64">
            <Search size={13} className="absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search source IP, host, parser..."
              className="w-full pl-7 pr-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1017] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-3 py-2.5">Hostname</th>
                <th className="px-3 py-2.5">IP Address</th>
                <th className="px-3 py-2.5">Device Type</th>
                <th className="px-3 py-2.5">Sample Total</th>
                <th className="px-3 py-2.5">Sample Parser Preference</th>
                <th className="px-3 py-2.5">Live Message Rate</th>
                <th className="px-3 py-2.5">Last Message</th>
                <th className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSources.map((src) => (
                <tr key={src.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 font-bold text-slate-200">{src.source}</td>
                  <td className="px-3 py-2.5 text-slate-300">{src.ip}</td>
                  <td className="px-3 py-2.5 text-slate-400">{src.type}</td>
                  <td className="px-3 py-2.5 text-slate-300">{src.todayCount.toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-[11px]">
                      {src.parser}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-400">Unavailable</td>
                  <td className="px-3 py-2.5 text-slate-400 text-[11px]">{src.lastMessage}</td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={`Sample: ${src.status}`} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Raw Syslog Ingestion Feed Preview */}
      <div className="rounded-lg bg-[#0f151e] border border-slate-800 p-4 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Terminal size={15} className="text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Unparsed Sample Raw Messages
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            Static samples; no live stream
          </span>
        </div>

        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{msg.timestamp}</span>
                  <span className="text-cyan-400 font-bold">{msg.host}</span>
                </div>
                <span className="text-[10px] text-slate-500">{msg.facility}</span>
              </div>
              <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap select-all">
                {msg.rawMessage}
              </pre>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
