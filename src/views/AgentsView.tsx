import React, { useState, useEffect } from 'react';
import {
  Server,
  Search,
  Filter,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  ArrowRight,
  ShieldAlert,
  HardDrive,
  Activity,
  Layers,
} from 'lucide-react';
import { Agent, NavigationSection } from '../types';
import { agentService } from '../services/agentService';
import { StatusBadge } from '../components/status/StatusBadge';
import { EnrollAgentModal } from '../components/dialogs/EnrollAgentModal';

interface AgentsViewProps {
  onNavigate: (section: NavigationSection, params?: any) => void;
  onSelectAgent: (agentId: string) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({
  onNavigate,
  onSelectAgent,
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Healthy' | 'Warning' | 'Offline'>('All');
  const [profileFilter, setProfileFilter] = useState<string>('All');
  const [siteFilter, setSiteFilter] = useState<string>('All');
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    const data = await agentService.getAgents({
      search,
      status: statusFilter,
      profileId: profileFilter,
      site: siteFilter,
    });
    setAgents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, [search, statusFilter, profileFilter, siteFilter]);

  const totalCount = 184;
  const healthyCount = agents.filter((a) => a.status === 'Healthy').length;
  const investigationCount = agents.filter((a) => a.investigationMode).length;
  const offlineCount = agents.filter((a) => a.status === 'Offline').length;

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-lg font-bold text-slate-100 tracking-tight">Host Management</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              WINDOWS AGENT FLEET
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Windows telemetry collectors and syslog endpoint status across enclaves
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-sm transition-colors"
          >
            <Plus size={14} />
            <span>Enroll Agent</span>
          </button>
        </div>
      </div>

      {/* Metric Counters Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Total Enrolled Fleet</div>
          <div className="text-xl font-bold text-slate-100 mt-0.5">{totalCount} Hosts</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase">Active &amp; Ingesting</div>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">179 Active</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-amber-900/40 bg-amber-950/10">
          <div className="text-amber-400 text-[10px] uppercase font-semibold">Investigation Mode</div>
          <div className="text-xl font-bold text-amber-300 mt-0.5">1 (SERVER-42)</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0f151e] border border-rose-900/40 bg-rose-950/10">
          <div className="text-rose-400 text-[10px] uppercase font-semibold">Offline / Stale</div>
          <div className="text-xl font-bold text-rose-300 mt-0.5">2 Hosts</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-lg bg-[#0f151e] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter hostname, IP, OS build..."
              className="w-full pl-8 pr-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-500 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Healthy">Healthy (Active)</option>
              <option value="Warning">Warning</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Site Filter */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-500 text-[11px]">Site:</span>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none"
            >
              <option value="All">All Sites</option>
              <option value="US-East-DC1">US-East-DC1</option>
              <option value="US-West-DC2">US-West-DC2</option>
              <option value="EU-Frankfurt-DC3">EU-Frankfurt-DC3</option>
              <option value="Plant-Substation-North">Plant-Substation-North</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchAgents}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Refresh List"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Agents Table */}
      <div className="rounded-lg bg-[#0f151e] border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0b1017] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Hostname</th>
                <th className="px-3 py-3">IP Address</th>
                <th className="px-3 py-3">Site / Enclave</th>
                <th className="px-3 py-3">Operating System</th>
                <th className="px-3 py-3">Collection Profile</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Rate</th>
                <th className="px-3 py-3">Queue</th>
                <th className="px-3 py-3">Last Seen</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {agents.map((agent) => (
                <tr
                  key={agent.id}
                  onClick={() => {
                    onSelectAgent(agent.id);
                    onNavigate('agent-detail');
                  }}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {agent.hostname}
                      </span>
                      {agent.investigationMode && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 border border-amber-700 text-amber-300 font-semibold animate-pulse">
                          INVESTIGATION MODE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{agent.ip}</td>
                  <td className="px-3 py-3 text-slate-400">{agent.site}</td>
                  <td className="px-3 py-3 text-slate-400 truncate max-w-[180px]" title={agent.os}>
                    {agent.os}
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30 text-[11px]">
                      {agent.profileName}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={agent.status} size="sm" showPulse />
                  </td>
                  <td className="px-3 py-3 font-semibold text-slate-200">{agent.eventsPerSec}</td>
                  <td className="px-3 py-3">
                    <span className={agent.queueSize.includes('GB') ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                      {agent.queueSize}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-400 text-[11px]">{agent.lastSeen}</td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center justify-end gap-1">
                      Inspect <ArrowRight size={13} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EnrollAgentModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        onAgentEnrolled={(newA) => {
          setAgents([newA, ...agents]);
        }}
      />
    </div>
  );
};
