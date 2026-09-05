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
import { syslogService } from '../services/syslogService';
import { StatusBadge } from '../components/status/StatusBadge';
import { SyslogListenerModal } from '../components/dialogs/SyslogListenerModal';

interface SyslogViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
}

export const SyslogView: React.FC<SyslogViewProps> = ({ onNavigate }) => {
  const [sources, setSources] = useState<SyslogSource[]>([]);
  const [listeners, setListeners] = useState<SyslogListener[]>([]);
  const [messages, setMessages] = useState<SyslogMessage[]>([]);
  const [stats, setStats] = useState<any>({
    sourcesCount: 47,
    messagesPerSec: 3821,
    messagesToday: '18.4M',
    deliverySuccessRate: '99.99%',
  });
  const [loading, setLoading] = useState(true);
  const [showListenerModal, setShowListenerModal] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [srcs, listns, msgs, st] = await Promise.all([
        syslogService.getSources(),
        syslogService.getListeners(),
        syslogService.getMessages(),
        syslogService.getStats(),
      ]);
      setSources(srcs);
      setListeners(listns);
      setMessages(msgs);
      setStats(st);
      setLoading(false);
    };
    fetchData();
  }, []);

  const searchTarget = (search || '').trim().toLowerCase();
  const filteredSources = sources.filter((s) => {
    if (!searchTarget) return true;
    return (
      (s.hostname || '').toLowerCase().includes(searchTarget) ||
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
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Syslog Management</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              RFC 5424 / RFC 3164 INGESTION
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Network appliances, firewall feeds, Linux syslog daemons, and normalized ECS log pipeline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('parser-assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-mono text-xs font-semibold cursor-pointer transition-colors"
          >
            <Sparkles size={13} className="text-cyan-400" />
            <span>Interactive Parser Assistant</span>
          </button>

          <button
            onClick={() => setShowListenerModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-sm transition-colors"
          >
            <Plus size={14} />
            <span>Configure Listener</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Active Ingestion Sources</div>
          <div className="text-xl font-bold text-slate-100 mt-0.5">{stats.sourcesCount} Devices</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Throughput Stream</div>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">{stats.messagesPerSec} msg/sec</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Ingested Today</div>
          <div className="text-xl font-bold text-cyan-300 mt-0.5">{stats.messagesToday}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Delivery Accuracy</div>
          <div className="text-xl font-bold text-slate-100 mt-0.5">{stats.deliverySuccessRate}</div>
        </div>
      </div>

      {/* Ingestion Listeners Grid */}
      <div>
        <h2 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Configured Syslog Listeners
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
                  <span className="font-bold text-slate-100 text-xs">{listnr.name}</span>
                </div>
                <StatusBadge status={listnr.status} size="sm" showPulse />
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
                  <span className="text-emerald-400">{listnr.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dropped Packets:</span>
                  <span className="text-slate-300">{listnr.droppedCount}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>Buffer: {listnr.bufferSize}</span>
                {listnr.tlsCertExpiry && (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Lock size={10} /> TLS 1.3
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Syslog Sources Table */}
      <div className="rounded-lg bg-[#0f151e] border border-slate-800 overflow-hidden font-mono">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Registered Syslog Network Sources ({sources.length})
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
                <th className="px-3 py-2.5">Facility</th>
                <th className="px-3 py-2.5">Severity</th>
                <th className="px-3 py-2.5">Parser Engine</th>
                <th className="px-3 py-2.5">Message Rate</th>
                <th className="px-3 py-2.5">Last Message</th>
                <th className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSources.map((src) => (
                <tr key={src.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 font-bold text-slate-200">{src.hostname}</td>
                  <td className="px-3 py-2.5 text-slate-300">{src.ip}</td>
                  <td className="px-3 py-2.5 text-slate-400">{src.facility}</td>
                  <td className="px-3 py-2.5 text-slate-300">{src.severity}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-[11px]">
                      {src.parser}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-emerald-400">{src.messageRate}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-[11px]">{src.lastMessage}</td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={src.status} size="sm" />
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
              Live Syslog Raw Payload Stream
            </h2>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Realtime buffer
          </span>
        </div>

        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{msg.timestamp}</span>
                  <span className="text-cyan-400 font-bold">{msg.host}</span>
                  <span className="text-slate-300">({msg.ip})</span>
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

      <SyslogListenerModal
        isOpen={showListenerModal}
        onClose={() => setShowListenerModal(false)}
        onSaved={() => {
          // reload
        }}
      />
    </div>
  );
};
