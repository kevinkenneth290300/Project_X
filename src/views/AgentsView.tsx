import React, { useState } from 'react';
import { ArrowRight, Plus, Search } from 'lucide-react';
import { NavigationSection } from '../types';
import { agentService } from '../services/agentService';
import { useScope } from '../context/ScopeContext';
import { useDataState } from '../hooks/useDataState';
import { DataStateView } from '../components/status/DataStateView';
import { StatusBadge } from '../components/status/StatusBadge';

interface AgentsViewProps {
  onNavigate: (section: NavigationSection, params?: { agentId?: string }) => void;
  onSelectAgent: (agentId: string) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({ onNavigate, onSelectAgent }) => {
  const { scope, scopeKey } = useScope();
  const state = useDataState(agentService.getAgents, scopeKey);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const records = state.status === 'ready' ? state.data : [];
  const invalid = records.some((agent) => !agent.id || !agent.hostname) || new Set(records.map((agent) => agent.id)).size !== records.length;
  const displayState = invalid ? { status: 'error' as const, reason: 'Inventory returned invalid or duplicate agent identifiers.' } : state;
  const agents = records.filter((agent) => (scope.siteId === 'all' || agent.siteId === scope.siteId) && (scope.zoneId === 'all' || agent.zoneId === scope.zoneId) && (status === 'All' || agent.status === status) && `${agent.hostname} ${agent.ip} ${agent.os}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-4 text-xs">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3"><h1 className="font-mono text-lg font-bold text-slate-100">Host Management</h1><button disabled aria-describedby="fleet-operations-unavailable" className="flex items-center gap-1.5 text-slate-400"><Plus size={14} />Enroll Agent</button></div>
    <p id="fleet-operations-unavailable" className="text-slate-400">Enrollment, restart and remote IR/profile deployment are unavailable without an authorized control plane.</p>
    <DataStateView state={displayState} />
    {displayState.status === 'ready' && <>
      <div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2"><Search size={14} /><span className="sr-only">Search hosts</span><input aria-label="Search hosts" value={search} onChange={(event) => setSearch(event.target.value)} className="border border-slate-700 bg-slate-900 p-2" /></label><select aria-label="Agent status" value={status} onChange={(event) => setStatus(event.target.value)} className="border border-slate-700 bg-slate-900 p-2">{['All', 'Healthy', 'Warning', 'Offline', 'Unknown'].map((value) => <option key={value}>{value}</option>)}</select><span>{agents.length} host records</span></div>
      <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr>{['Hostname', 'IP', 'Site', 'OS', 'Profile', 'Status', 'Inspect'].map((label) => <th key={label} className="border-b border-slate-800 p-2">{label}</th>)}</tr></thead><tbody>{agents.map((agent) => <tr key={agent.id}><td className="p-2">{agent.hostname}</td><td className="p-2">{agent.ip}</td><td className="p-2">{agent.siteName ?? agent.site}</td><td className="p-2">{agent.os}</td><td className="p-2">{agent.profileName}</td><td className="p-2"><StatusBadge status={agent.status} showPulse={false} /></td><td className="p-2"><button aria-label={`Inspect host ${agent.hostname}`} title="Inspect host" onClick={() => { onSelectAgent(agent.id); onNavigate('agent-detail', { agentId: agent.id }); }} className="text-cyan-300"><ArrowRight size={14} /></button></td></tr>)}</tbody></table></div>
      {agents.length === 0 && <DataStateView state={{ status: 'empty', reason: 'No hosts match the display filters.' }} />}
    </>}
  </div>;
};